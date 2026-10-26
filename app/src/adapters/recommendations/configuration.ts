import "server-only";
import { previewReserved } from "../preview-mode";
import { z } from "zod";
import { createHash } from "node:crypto";
import { recommendationPolicy } from "../../application/recommendations/policy";
import { PROMPT_VERSION } from "../../application/recommendations/prepare";
import { METHOD_VERSION } from "../../domain/scoring/score-assessment";
const settingsSchema = z.object({
  provider: z.literal("openai"), model: z.enum(["gpt-5.4-mini", "gpt-5.4-mini-2026-03-17"]),
  reasoning: z.enum(["none", "low", "medium", "high", "xhigh"]),
  timeoutMs: z.coerce.number().int().min(1).max(30000), maxOutputTokens: z.coerce.number().int().min(1).max(8000),
});
export type ProviderSettings = z.infer<typeof settingsSchema>;
export function readProviderConfiguration(env: Record<string, string | undefined> = process.env) {
  const parsed = settingsSchema.safeParse({ provider: env.RECOMMENDATION_PROVIDER, model: env.RECOMMENDATION_MODEL,
    reasoning: env.RECOMMENDATION_REASONING ?? "low", timeoutMs: env.RECOMMENDATION_TIMEOUT_MS ?? "30000", maxOutputTokens: env.RECOMMENDATION_MAX_OUTPUT_TOKENS ?? "4000" });
  const code = previewReserved(env) ? "private_preview_disabled" : env.CAPSTONE_OFFLINE_TESTS === "1" ? "offline_tests" : !env.RECOMMENDATION_PROVIDER || env.RECOMMENDATION_PROVIDER === "disabled" ? "provider_not_configured"
    : !parsed.success ? "configuration_invalid" : !env.OPENAI_API_KEY?.trim() ? "credentials_missing" : "ready";
  const settings = parsed.success ? parsed.data : null;
  const identity = { settings, methodVersion: METHOD_VERSION, promptVersion: PROMPT_VERSION, policyVersion: recommendationPolicy.version };
  const fingerprint = createHash("sha256").update(JSON.stringify(identity)).digest("hex");
  return { status: { ready: code === "ready", code, ...identity, fingerprint }, apiKey: code === "ready" ? env.OPENAI_API_KEY!.trim() : null };
}
export type ProviderStatus = ReturnType<typeof readProviderConfiguration>["status"] & { configVersion: string; sessionVersion: string };
