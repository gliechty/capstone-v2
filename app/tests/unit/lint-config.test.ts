import { ESLint } from "eslint";
import nextPlugin from "@next/eslint-plugin-next";
import { beforeAll, expect, test } from "vitest";

const eslint = new ESLint();
beforeAll(async () => {
  await eslint.calculateConfigForFile("src/app/page.tsx");
}, 60_000);

test("retains the entire upstream Core Web Vitals rule set", async () => {
  const config = await eslint.calculateConfigForFile("src/app/page.tsx");
  const rules = nextPlugin.configs["core-web-vitals"].rules;
  if (!rules) throw new Error("Next Core Web Vitals rules are missing");
  expect(Object.keys(rules).length).toBeGreaterThan(0);
  for (const [rule, level] of Object.entries(rules)) {
    expect(config.rules[rule][0], rule).toBe(level === "error" ? 2 : 1);
  }
  expect(config.settings?.next?.rootDir).toBeUndefined();
});

test.each([
  ["@next/next/no-async-client-component", '"use client"; export default async function Probe() { return <p>Probe</p>; }'],
  ["@next/next/no-sync-scripts", 'export default function Probe() { return <script src="/example.js" />; }'],
  ["jsx-a11y-x/alt-text", 'export default function Probe() { return <img src="/example.png" />; }'],
  ["jsx-a11y-x/aria-props", 'export default function Probe() { return <div aria-madeup="true" />; }'],
  ["@eslint-react/no-missing-key", 'export default function Probe() { return [1, 2].map(n => <span>{n}</span>); }'],
  ["react-hooks/rules-of-hooks", 'import { useState } from "react"; export function Probe({ flag }: { flag: boolean }) { if (flag) { useState(0); } return null; }'],
])("reports %s on invalid source", async (rule, code) => {
  const [result] = await eslint.lintText(code, { filePath: "src/app/probe.tsx" });
  expect(result?.fatalErrorCount).toBe(0);
  expect(result?.messages.some(message => message.ruleId === rule)).toBe(true);
});
