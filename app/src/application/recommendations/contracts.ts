import { z } from "zod";
import { countrySchema } from "../countries";
import { notesSchema } from "../assessment-notes";
import { scoreRequestSchema } from "../score-request";

export const recommendationRequestSchema = scoreRequestSchema.extend({
  // Only additional context actually collected by the current questionnaire.
  companyName: z.string().trim().min(1).max(200), subindustry: z.string().max(200), notes: notesSchema, country: countrySchema,
});
export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>;
const text = z.string();
export const citationSchema = z.object({ doc_title: text, source: text, pages_or_section: text, link: z.httpUrl() });
export const recommendationContentSchema = z.object({
  executive_summary: text,
  priority_recommendations: z.array(z.object({
    priority_rank: z.number(), title: z.string(),
    why_it_matters: text, recommended_action: text, evidence: z.array(citationSchema),
    related_categories: z.array(z.string()),
    implementation_difficulty: z.string(),
  })),
  key_gaps: z.array(z.object({ category: z.string(), gap: text, evidence: z.array(citationSchema) })),
  grounding_notes: text,
});
export type RecommendationContent = z.infer<typeof recommendationContentSchema>;
export type Citation = z.infer<typeof citationSchema>;
export type ProviderDiagnostic =
  | { stage: "awaiting_headers"; requestBytes: number }
  | { stage: "reading_body"; headersMs: number; httpStatus: number }
  | { stage: "body_complete"; bodyMs: number; responseBytes: number };
export interface RecommendationProvider {
  readonly id: string;
  readonly model: string;
  readonly kind: "live" | "test-double" | "disabled";
  readonly settings?: { reasoning: string; timeoutMs: number; maxOutputTokens: number };
  generate(request: { system: string; prompt: string; maxOutputTokens: number; signal: AbortSignal; onDiagnostic?: (event: ProviderDiagnostic) => void }): Promise<unknown>;
}
export type UnavailableCode = "provider_not_configured" | "no_answers" | "insufficient_evidence" | "prompt_too_large" | "timeout" | "cancelled" | "provider_failure" | "invalid_output" | "authentication_failed" | "quota_exceeded" | "rate_limited" | "refused" | "incomplete_output" | "invalid_response";
export class RecommendationInputError extends Error {}

export type TokenUsage = { inputTokens: number; outputTokens: number };
export class ProviderFailure extends Error { constructor(readonly code: UnavailableCode, readonly usage?: TokenUsage) { super(code); } }
