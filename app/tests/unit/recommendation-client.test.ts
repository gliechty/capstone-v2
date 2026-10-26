import { afterEach, expect, test, vi } from "vitest";
import { requestRecommendations, recommendationStatus } from "../../src/adapters/recommendation-client";
import { input } from "../helpers/recommendation-fixture";
import type { ProviderStatus } from "../../src/adapters/recommendations/configuration";
afterEach(() => vi.unstubAllGlobals());
test("generation requests a 45-second cap while status keeps 15 seconds and user cancellation is immediate", async () => {
  const signals: AbortSignal[] = [];
  const fetch = vi.fn(async (_url: string, init: RequestInit) => { signals.push(init.signal!); return Response.json({}); });
  vi.stubGlobal("fetch", fetch);
  const timeout = vi.spyOn(AbortSignal, "timeout");
  try {
    const cancel = new AbortController();
    await requestRecommendations(input, { fingerprint: "local-test" } as ProviderStatus, cancel.signal);
    expect(timeout).toHaveBeenLastCalledWith(45000);
    expect(signals[0]!.aborted).toBe(false);
    cancel.abort(); expect(signals[0]!.aborted).toBe(true);
    await recommendationStatus(new AbortController().signal);
    expect(timeout).toHaveBeenLastCalledWith(15000);
    expect(fetch).toHaveBeenCalledTimes(2);
  } finally { timeout.mockRestore(); }
});
