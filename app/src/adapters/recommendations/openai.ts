import "server-only";
import { z } from "zod";
import { recommendationContentSchema, ProviderFailure, type RecommendationProvider, type ProviderDiagnostic } from "../../application/recommendations/contracts";
import type { ProviderSettings } from "./configuration";
// Transport schema describes the legacy response fields; semantic guidance is not an acceptance gate.
export const outputSchema = JSON.parse(JSON.stringify(z.toJSONSchema(recommendationContentSchema), (key, value) => ["$schema", "format", "minLength", "maxLength"].includes(key) ? undefined : value)) as Record<string, unknown>;
const usageSchema = z.object({ input_tokens: z.number().int().nonnegative(), output_tokens: z.number().int().nonnegative() });
const envelopeSchema = z.object({ status: z.string(), model: z.string(), usage: usageSchema.nullish(), output: z.array(z.object({
  type: z.string(), role: z.string().optional(), content: z.array(z.object({ type: z.string(), text: z.string().optional() })).optional(),
})) });
async function boundedJson(response: Response, onDiagnostic?: (event: ProviderDiagnostic) => void) {
  const started = performance.now();
  const reader = response.body?.getReader();
  if (!reader) throw new ProviderFailure("invalid_response");
  const chunks: Uint8Array[] = []; let bytes = 0;
  try {
    while (true) { const part = await reader.read(); if (part.done) break; bytes += part.value.byteLength;
      if (bytes > 200000) throw new ProviderFailure("invalid_response"); chunks.push(part.value); }
    onDiagnostic?.({ stage: "body_complete", bodyMs: performance.now() - started, responseBytes: bytes });
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks))) as unknown;
  } catch { void reader.cancel().catch(() => {}); throw new ProviderFailure("invalid_response"); }
  finally { reader.releaseLock(); }
}
export function openAIProvider(settings: ProviderSettings, apiKey: string, transport?: typeof fetch): RecommendationProvider {
  return { id: "openai", model: settings.model, kind: "live", settings,
    async generate(request) {
      // Ordinary verification must never use the real network, including with a local key.
      if (!transport && process.env.CAPSTONE_OFFLINE_TESTS === "1") throw new ProviderFailure("provider_not_configured");
      const body = JSON.stringify({ model: settings.model, reasoning: { effort: settings.reasoning }, store: false,
        max_output_tokens: request.maxOutputTokens, input: [{ role: "system", content: request.system }, { role: "user", content: request.prompt }],
        text: { format: { type: "json_schema", name: "assessment_recommendations", strict: true, schema: outputSchema } } });
      const started = performance.now();
      request.onDiagnostic?.({ stage: "awaiting_headers", requestBytes: Buffer.byteLength(body, "utf8") });
      const response = await (transport ?? fetch)("https://api.openai.com/v1/responses", { method: "POST", redirect: "error", signal: request.signal,
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }, body });
      request.onDiagnostic?.({ stage: "reading_body", headersMs: performance.now() - started, httpStatus: response.status });
      if (response.status === 401 || response.status === 403) { void response.body?.cancel(); throw new ProviderFailure("authentication_failed"); }
      if (!response.ok) {
        if (response.status === 429) {
          let quota = false;
          try { const body = await boundedJson(response, request.onDiagnostic); quota = z.object({ error: z.object({ code: z.literal("insufficient_quota") }) }).safeParse(body).success; } catch { /* safe rate-limit response */ }
          throw new ProviderFailure(quota ? "quota_exceeded" : "rate_limited");
        }
        void response.body?.cancel(); throw new ProviderFailure("provider_failure");
      }
      const parsed = envelopeSchema.safeParse(await boundedJson(response, request.onDiagnostic));
      if (!parsed.success) throw new ProviderFailure("invalid_response");
      const value = parsed.data;
      const usage = value.usage ? { inputTokens: value.usage.input_tokens, outputTokens: value.usage.output_tokens } : undefined;
      if (![settings.model, ...(settings.model === "gpt-5.4-mini" ? ["gpt-5.4-mini-2026-03-17"] : [])].includes(value.model)) throw new ProviderFailure("invalid_response", usage);
      if (value.status === "incomplete") throw new ProviderFailure("incomplete_output", usage);
      if (value.status !== "completed") throw new ProviderFailure("provider_failure", usage);
      const parts = value.output.filter(o => o.type === "message" && o.role === "assistant").flatMap(o => o.content ?? []);
      if (parts.some(p => p.type === "refusal")) throw new ProviderFailure("refused", usage);
      if (parts.length !== 1 || parts[0]?.type !== "output_text" || typeof parts[0].text !== "string") throw new ProviderFailure("invalid_response", usage);
      return { text: parts[0].text, usage, actualModel: value.model };
    } };
}
