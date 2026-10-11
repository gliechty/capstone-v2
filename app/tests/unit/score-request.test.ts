import { expect, test } from "vitest";
import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { assessmentCatalog } from "../../src/application/assessment-catalog";
import { computeAssessment } from "../../src/application/score-request";
import { POST } from "../../src/app/api/assessment-score/route";
const { config } = loadCanonicalConfig();
const input = { configVersion: assessmentCatalog(config).version, context: { industry: "Manufacturing (Industrial / Components)", companySize: "251 - 500", location: "APAC", targetMarkets: ["EU"], targetBuyer: "Enterprise", businessGoal: "Investor readiness" }, answers: { "U-001": "Yes" } };
const request = (body: string, type = "application/json") => new Request("http://localhost/api/assessment-score", { method: "POST", headers: { "Content-Type": type }, body });
test("server reselects and recomputes from trusted config; accepts no supplied score or config", async () => {
  expect(computeAssessment(config, input).rawOverall).toBe(100);
  for (const patch of [{ score: 100 }, { trace: [] }, { config: {} }, { configVersion: "stale" }, { answers: { unknown: "Yes" } }, { context: { ...input.context, companySize: "300" } }]) expect(() => computeAssessment(config, { ...input, ...patch })).toThrow();
  const response = await POST(request(JSON.stringify(input)));
  expect(response.status).toBe(200); expect(response.headers.get("Cache-Control")).toBe("no-store");
  const body = await response.json();
  expect(body.trace).toEqual(computeAssessment(config, input).trace); expect(body.input.answers).toEqual(input.answers); expect(body.traceSchemaVersion).toBe(1);
  expect(body.rawOverall).toBe(100); expect(body).not.toHaveProperty("questions"); expect(body).not.toHaveProperty("answers");
});
test("HTTP failure paths return explicit errors without fake scores", async () => {
  for (const [body, status, type] of [["{bad", 400, "application/json"], [JSON.stringify({ ...input, score: 100 }), 400, "application/json"], [JSON.stringify({ ...input, answers: { "U-018": "Infinity" } }), 422, "application/json"], [" ".repeat(400001), 413, "application/json"], ["{}", 415, "text/plain"]] as const) {
    const response = await POST(request(body, type)); expect(response.status).toBe(status);
    const result = await response.json(); expect(result.error).toBeTruthy(); expect(result).not.toHaveProperty("rawOverall");
  }
});
