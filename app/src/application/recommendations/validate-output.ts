import type { CanonicalConfig } from "../../domain/config/types";
import type { AssessmentScore } from "../../domain/scoring/score-assessment";
import { recommendationContentSchema, type RecommendationContent, type RecommendationRequest } from "./contracts";
import { type PreparedEvidence } from "./prepare";
export interface OutputIssue { code: string; path: string; categories?: RecommendationContent["key_gaps"][number]["category"][] }
export function validateRecommendationOutput(raw: unknown, _input: RecommendationRequest, _score: AssessmentScore, _evidence: PreparedEvidence, _config: CanonicalConfig, maxBytes: number):
  { ok: true; content: RecommendationContent } | { ok: false; issues: OutputIssue[] } {
  const fail = (code: string) => ({ ok: false as const, issues: [{ code, path: "output" }] });
  if (typeof raw !== "string") return fail("invalid_transport");
  if (new TextEncoder().encode(raw).length > maxBytes) return fail("response_too_large");
  let decoded: unknown;
  try { decoded = JSON.parse(raw); } catch { return fail("malformed_json"); }
  const parsed = recommendationContentSchema.safeParse(decoded);
  if (!parsed.success) return { ok: false, issues: parsed.error.issues.slice(0, 20).map(i => ({ code: "schema", path: i.path.join(".") })) };
  // Match legacy JSON delivery: validate renderable structure, never rewrite advice.
  // Preserve unknown fields and original strings rather than returning a normalized copy.
  return { ok: true, content: decoded as RecommendationContent };
}
