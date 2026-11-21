import { releaseConfigForInput, releaseConfig } from "../release-config";
import "server-only";

import { assessmentCatalog } from "../../application/assessment-catalog";
import { createRecommendationService } from "../../application/recommendations/service";
import { recommendationPolicy } from "../../application/recommendations/policy";
import { readProviderConfiguration } from "./configuration";
import { openAIProvider } from "./openai";
export function providerStatus(version?:string) { return { ...readProviderConfiguration().status, configVersion: releaseConfig(version).config.version, sessionVersion: assessmentCatalog(releaseConfig(version).config).version }; }
export async function generateRecommendations(input: unknown, signal?: AbortSignal) {
  const { status, apiKey } = readProviderConfiguration();
  const provider = status.ready && status.settings && apiKey ? openAIProvider(status.settings, apiKey)
    : { id: "disabled", model: "none", kind: "disabled" as const, generate: async () => { throw new Error("disabled"); } };
  const policy = status.settings ? { ...recommendationPolicy, timeoutMs: status.settings.timeoutMs, maxOutputTokens: status.settings.maxOutputTokens } : recommendationPolicy;
  return createRecommendationService({ loadConfig: () => releaseConfigForInput(input).config, provider, policy })(input, signal);
}
