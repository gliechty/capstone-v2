import { createHash } from "node:crypto";
import { expect, test, vi } from "vitest";
import { createRecommendationController, type RecommendationView } from "../../src/application/recommendations/controller";
import { createRecommendationService } from "../../src/application/recommendations/service";
import { readProviderConfiguration } from "../../src/adapters/recommendations/configuration";
import type { ProviderStatus } from "../../src/adapters/recommendations/configuration";
import { config, input, validTestContent } from "../helpers/recommendation-fixture";
const settings = { provider: "openai" as const, model: "gpt-5.4-mini" as const, reasoning: "low" as const, timeoutMs: 30000, maxOutputTokens: 4000 };
const configuration: ProviderStatus = { ...readProviderConfiguration({ RECOMMENDATION_PROVIDER: "openai", RECOMMENDATION_MODEL: "gpt-5.4-mini", OPENAI_API_KEY: "test-only" }).status, configVersion: config.version, sessionVersion: input.configVersion };
async function setup() {
  const result = await createRecommendationService({ loadConfig: () => config, provider: { id: "openai", model: settings.model, kind: "live", settings, generate: async () => JSON.stringify(validTestContent()) } })(input);
  let current = structuredClone(input); let status = configuration;
  const views: RecommendationView[] = [];
  const generate = vi.fn(async () => ({ ...result, configuration }));
  const controller = createRecommendationController({ read: () => current, status: async () => status, generate, hash: async s => createHash("sha256").update(s).digest("hex"), publish: v => views.push(v) });
  return { controller, generate, views, result, edit: () => { current = { ...current, notes: "changed notes" }; }, configure: (value: ProviderStatus) => { status = value; } };
}
test("refresh/focus do not generate; explicit generation validates identity; notes edits invalidate", async () => {
  const t = await setup(); await t.controller.refresh(); await t.controller.refresh(); expect(t.generate).not.toHaveBeenCalled();
  await t.controller.generate(); expect(t.views.at(-1)?.phase).toBe("available");
  t.edit(); await t.controller.refresh(); expect(t.views.at(-1)?.result).toBeUndefined(); expect(t.generate).toHaveBeenCalledOnce();
  t.controller.dispose();
});
test("duplicate clicks are ignored; cancelled or out-of-order settlements cannot publish advice", async () => {
  const t = await setup(); let release!: (value: Awaited<ReturnType<typeof t.generate>>) => void;
  t.generate.mockImplementation(() => new Promise(resolve => { release = resolve; }));
  const first = t.controller.generate(); await vi.waitFor(() => expect(t.generate).toHaveBeenCalledOnce());
  await t.controller.generate(); expect(t.generate).toHaveBeenCalledOnce();
  t.controller.cancel(); release({ ...t.result, configuration }); await first;
  expect(t.views.at(-1)?.code).toBe("cancelled"); expect(t.views.at(-1)?.result).toBeUndefined();
  t.controller.dispose();
});
test("edits during request and a wrong response identity cannot become current advice", async () => {
  const t = await setup(); t.generate.mockImplementation(async () => { t.edit(); return { ...t.result, configuration }; });
  await t.controller.generate(); expect(t.views.at(-1)?.result).toBeUndefined(); expect(t.views.at(-1)?.phase).toBe("idle");
  const other = await setup(); other.generate.mockResolvedValue({ ...other.result, configuration, identity: { ...other.result.identity, inputId: "different" } });
  await other.controller.generate(); expect(other.views.at(-1)?.code).toBe("stale_response");
  t.controller.dispose(); other.controller.dispose();
});
test("provider or version changes invalidate both pending and displayed output", async () => {
  const t = await setup(); await t.controller.generate(); expect(t.views.at(-1)?.phase).toBe("available");
  t.configure({ ...configuration, fingerprint: "changed", settings: { ...settings, reasoning: "medium" } });
  await t.controller.refresh(); expect(t.views.at(-1)?.result).toBeUndefined(); expect(t.views.at(-1)?.code).toBe("configuration_changed"); t.controller.dispose();
  const other = await setup(); other.generate.mockImplementation(async () => { other.configure({ ...configuration, methodVersion: "changed" }); return { ...other.result, configuration }; });
  await other.controller.generate(); expect(other.views.at(-1)?.code).toBe("configuration_changed"); other.controller.dispose();
});
test("disabled status prevents generation and configuration restoration makes explicit retry possible", async () => {
  const t = await setup(); t.configure({ ...configuration, ready: false, code: "credentials_missing" });
  await t.controller.generate(); expect(t.generate).not.toHaveBeenCalled(); expect(t.views.at(-1)?.code).toBe("credentials_missing");
  t.configure(configuration); await t.controller.generate(); expect(t.views.at(-1)?.phase).toBe("available"); t.controller.dispose();
});

test("old prompt/validation contract cannot be displayed under the current contract", async () => {
  const t = await setup();
  t.generate.mockResolvedValue({ ...t.result, configuration, identity: { ...t.result.identity, promptVersion: "legacy-runtime-v1-validated-transport-3" } });
  await t.controller.generate(); expect(t.views.at(-1)?.code).toBe("stale_response"); expect(t.views.at(-1)?.result).toBeUndefined(); t.controller.dispose();
  const displayed = await setup(); await displayed.controller.generate();
  displayed.configure({ ...configuration, promptVersion: "next-contract", fingerprint: "changed-contract" });
  await displayed.controller.refresh(); expect(displayed.views.at(-1)?.result).toBeUndefined(); displayed.controller.dispose();
});
