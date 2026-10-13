import { expect, test, vi } from "vitest";
vi.mock("../../src/adapters/config-repository", () => ({ loadCanonicalConfig() { throw new Error("secret path and config detail"); } }));
import { POST } from "../../src/app/api/assessment-recommendations/route";
test("configuration failure returns a safe unavailable response", async () => {
  const response = await POST(new Request("http://localhost/api/assessment-recommendations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
    configVersion: "version", companyName: "Test", subindustry: "", context: { industry: "Manufacturing (Industrial / Components)", companySize: "251 - 500", location: "APAC", targetMarkets: ["EU"], targetBuyer: "Enterprise", businessGoal: "Investor readiness" }, answers: { "U-001": "Yes" },
  }) }));
  expect(response.status).toBe(503);
  expect(await response.json()).toEqual({ status: "unavailable", code: "configuration_unavailable" });
});
