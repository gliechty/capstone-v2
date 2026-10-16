import "server-only";
import { loadCanonicalConfig } from "../config-repository";
import { assessmentCatalog } from "../../application/assessment-catalog";
import { createRecommendationService } from "../../application/recommendations/service";
import { recommendationPolicy } from "../../application/recommendations/policy";
import { readProviderConfiguration } from "./configuration";
import { openAIProvider } from "./openai";
export function providerStatus() { return { ...readProviderConfiguration().status, configVersion: loadCanonicalConfig().config.version, sessionVersion: assessmentCatalog(loadCanonicalConfig().config).version }; }
export async function generateRecommendations(input: unknown, signal?: AbortSignal) {
  const { status, apiKey } = readProviderConfiguration();
  const provider = status.ready && status.settings && apiKey ? openAIProvider(status.settings, apiKey)
    : { id: "disabled", model: "none", kind: "disabled" as const, generate: async () => { throw new Error("disabled"); } };
  const policy = status.settings ? { ...recommendationPolicy, timeoutMs: status.settings.timeoutMs, maxOutputTokens: status.settings.maxOutputTokens } : recommendationPolicy;
  return createRecommendationService({ loadConfig: () => loadCanonicalConfig().config, provider, policy })(input, signal);
}
