import { ESLint } from "eslint";
import { beforeAll, describe, expect, test } from "vitest";

const eslint = new ESLint();
beforeAll(async () => { await eslint.calculateConfigForFile("src/domain/probe.ts"); }, 60_000);

async function violations(code: string, filePath = "src/domain/probe.ts") {
  const [result] = await eslint.lintText(code, { filePath });
  expect(result?.fatalErrorCount).toBe(0);
  return result?.messages.filter((message) =>
    ["architecture/domain-boundary", "no-restricted-globals", "no-restricted-properties"].includes(message.ruleId ?? ""),
  ) ?? [];
}

describe("enforced deterministic domain boundary", () => {
  test.each([
    'import React from "react";',
    'import type { NextConfig } from "next";',
    'import fs from "node:fs";',
    'import value from "../app/page";',
    'import value from "@/adapters/database";',
    'export { value } from "../application/service";',
    'export * from "../adapters/provider";',
    'const value = import("../adapters/provider");',
    'const name = "react"; const value = import(name);',
    'type Value = import("react").ReactNode;',
    'const value = require("node:fs");',
    '"use client"; export {};',
    '"use server"; export {};',
    'fetch("https://example.invalid");',
    'const now = Date.now();',
    'const random = Math.random();',
    'const env = process.env;',
    'const value = globalThis;',
  ])("rejects forbidden dependency or ambient input: %s", async (code) => {
    expect(await violations(code)).not.toHaveLength(0);
  });

  test.each([
    'import type { Value } from "./value";',
    'export { value } from "./value";',
    'type Value = import("./value").Value;',
    'export const total = (values: number[]) => values.reduce((sum, value) => sum + value, 0);',
  ])("permits domain-local dependencies and pure computation: %s", async (code) => {
    expect(await violations(code)).toHaveLength(0);
  });

  test("checks nested relative paths against the domain root", async () => {
    expect(await violations('import value from "../../app/page";', "src/domain/assessment/probe.ts")).not.toHaveLength(0);
    expect(await violations('import value from "../value";', "src/domain/assessment/probe.ts")).toHaveLength(0);
  });

  test("does not impose the domain restriction on adapters", async () => {
    expect(await violations('import fs from "node:fs";', "src/adapters/probe.ts")).toHaveLength(0);
  });
});
