import { z } from "zod";
import source from "../../content/recommendations/policy.json";
const rank = z.strictObject({ industry: z.number().nonnegative(), region: z.number().nonnegative(), buyer: z.number().nonnegative(), tag: z.number().nonnegative(), summaryCap: z.number().nonnegative(), wildcards: z.array(z.string()) });
export const recommendationPolicySchema = z.strictObject({
  version: z.string().min(1), documentLimit: z.number().int().min(1).max(100), chunkLimit: z.number().int().min(1).max(200),
  document: rank, chunk: rank, levels: z.record(z.string(), z.number().nonnegative()),
  excludedCitationDocuments: z.array(z.strictObject({ docId: z.string().min(1), reason: z.string().min(1) })),
  timeoutMs: z.number().int().min(1).max(30000), maxPromptBytes: z.number().int().min(1).max(1000000),
  maxResponseBytes: z.number().int().min(1).max(100000), maxRequestBytes: z.number().int().min(1).max(400000),
  maxOutputTokens: z.number().int().min(1).max(8000),
});
export const recommendationPolicy = recommendationPolicySchema.parse(source);
export type RecommendationPolicy = z.infer<typeof recommendationPolicySchema>;
