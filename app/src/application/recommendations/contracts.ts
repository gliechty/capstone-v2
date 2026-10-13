import { z } from "zod";
import { notesSchema } from "../assessment-notes";
import { scoreRequestSchema } from "../score-request";
import { CATEGORIES } from "../../domain/scoring/score-assessment";
export const recommendationRequestSchema = scoreRequestSchema.extend({
  // Only additional context actually collected by the current questionnaire.
  companyName: z.string().trim().min(1).max(200), subindustry: z.string().max(200), notes: notesSchema,
});
export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>;
const text = z.string().trim().min(1).max(4000);
export const citationSchema = z.strictObject({ doc_title: text, source: text, pages_or_section: text, link: z.string().max(2000).url() });
export const recommendationContentSchema = z.strictObject({
  executive_summary: text,
  priority_recommendations: z.array(z.strictObject({
    priority_rank: z.number().int().min(1).max(5), title: z.string().trim().min(1).max(200),
    why_it_matters: text, recommended_action: text, evidence: z.array(citationSchema).max(8),
    related_categories: z.array(z.enum(CATEGORIES)).min(1).max(4).refine(v => new Set(v).size === v.length),
    implementation_difficulty: z.enum(["Low", "Medium", "High"]),
  })).min(1).max(5),
  key_gaps: z.array(z.strictObject({ category: z.enum(CATEGORIES), gap: text, evidence: z.array(citationSchema).max(8) })).max(3),
  grounding_notes: text,
});
export type RecommendationContent = z.infer<typeof recommendationContentSchema>;
export type Citation = z.infer<typeof citationSchema>;
export interface RecommendationProvider {
  readonly id: string;
  readonly model: string;
  readonly kind: "live" | "test-double" | "disabled";
  generate(request: { system: string; prompt: string; maxOutputTokens: number; signal: AbortSignal }): Promise<unknown>;
}
export type UnavailableCode = "provider_not_configured" | "no_answers" | "insufficient_evidence" | "prompt_too_large" | "timeout" | "cancelled" | "provider_failure" | "invalid_output";
export class RecommendationInputError extends Error {}
