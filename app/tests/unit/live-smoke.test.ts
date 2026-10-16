import { expect, test, vi } from "vitest";
import { readFileSync } from "node:fs";
import { recommendationRequestSchema } from "../../src/application/recommendations/contracts";
import { input } from "../helpers/recommendation-fixture";
// Dynamic import keeps the separately invoked JS runner out of application compilation.
const path = "../../scripts/live-recommendation-smoke.mjs";
test("smoke uses only synthetic profiles, reserves all five attempts below $2, and never runs on import", async () => {
  const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
  try {
    const { syntheticCase, reservationCost, validateLedger, main } = await import(path);
    expect(reservationCost(8000) * 5).toBeLessThan(2);
    for (let i = 0; i < 5; i++) { const value = syntheticCase(i, input.configVersion); expect(recommendationRequestSchema.safeParse(value).success).toBe(true); expect(value.companyName).toBe(`Synthetic live smoke ${i + 1}`); }
    expect(() => validateLedger(Array(6).fill({ reservedUsd: 0.3 }))).toThrow();
    expect(() => validateLedger([{ reservedUsd: -1 }])).toThrow();
    await expect(main([])).rejects.toThrow("No requests sent");
    await expect(main(["--confirm-synthetic-budget", "--url=https://example.com"])).rejects.toThrow("loopback");
    expect(fetch).not.toHaveBeenCalled();
    const source = readFileSync("scripts/live-recommendation-smoke.mjs", "utf8");
    expect(source).not.toMatch(/goldenCases|legacy-scoring|OPENAI_API_KEY|BUILD_PACK/);
  } finally { vi.unstubAllGlobals(); }
});
