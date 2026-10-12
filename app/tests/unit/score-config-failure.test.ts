import { expect, test, vi } from "vitest";
vi.mock("../../src/adapters/config-repository", () => ({ loadCanonicalConfig: () => { throw new Error("private internal config path"); } }));
import { POST } from "../../src/app/api/assessment-score/route";
test("configuration load failure returns safe 503 with no score or trace", async () => {
  const response = await POST(new Request("http://localhost/api/assessment-score", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }));
  expect(response.status).toBe(503);
  expect(await response.json()).toEqual({ error: "Scoring configuration is unavailable. No score has been generated." });
});
