import { recommendationRequestSchema, type RecommendationRequest } from "./contracts";
export function inputIdentityText(input: RecommendationRequest) {
  const parsed = recommendationRequestSchema.parse(input);
  return JSON.stringify({ ...parsed, answers: Object.fromEntries(Object.entries(parsed.answers).sort(([a], [b]) => a.localeCompare(b))) });
}
