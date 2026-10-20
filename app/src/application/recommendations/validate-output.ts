import { unsupportedClaimCitations, unsupportedAssessmentClaims } from "./claim-support";
import type { CanonicalConfig } from "../../domain/config/types";
import type { AssessmentScore } from "../../domain/scoring/score-assessment";
import { recommendationContentSchema, type RecommendationContent, type RecommendationRequest } from "./contracts";
import { scoreClosing, type PreparedEvidence } from "./prepare";
export interface OutputIssue { code: string; path: string; categories?: RecommendationContent["key_gaps"][number]["category"][] }
export function validateRecommendationOutput(raw: unknown, input: RecommendationRequest, score: AssessmentScore, evidence: PreparedEvidence, config: CanonicalConfig, maxBytes: number):
  { ok: true; content: RecommendationContent } | { ok: false; issues: OutputIssue[] } {
  const fail = (code: string) => ({ ok: false as const, issues: [{ code, path: "output" }] });
  if (typeof raw !== "string") return fail("invalid_transport");
  if (new TextEncoder().encode(raw).length > maxBytes) return fail("response_too_large");
  let decoded: unknown;
  try { decoded = JSON.parse(raw); } catch { return fail("malformed_json"); }
  const parsed = recommendationContentSchema.safeParse(decoded);
  if (!parsed.success) return { ok: false, issues: parsed.error.issues.slice(0, 20).map(i => ({ code: "schema", path: i.path.join(".") })) };
  const content = parsed.data;
  const issues: OutputIssue[] = [];
  const add = (code: string, path: string, detail: Pick<OutputIssue, "categories"> = {}) => { if (issues.length < 20) issues.push({ code, path, ...detail }); };
  const closing = scoreClosing(score);
  if (!content.executive_summary.endsWith(closing)) add("score_mismatch", "executive_summary");
  const summary = content.executive_summary.endsWith(closing) ? content.executive_summary.slice(0, -closing.length) : content.executive_summary;
  const observed = score.categories.filter(c => c.percent !== null).sort((a, b) => a.percent! - b.percent!);
  const categories = new Set(observed.map(c => c.category));
  const lowest = observed[0]?.percent;
  const weak = new Set(observed.filter(c => c.percent === lowest).map(c => c.category));
  if (!content.priority_recommendations.some(r => r.related_categories.some(c => weak.has(c)))) add("priority_gap_missing", "priority_recommendations");
  const citations = new Set(evidence.citations.map(c => JSON.stringify([c.doc_title, c.source, c.pages_or_section, c.link])));
  const narratives: { text: string; path: string }[] = [{ text: summary, path: "executive_summary" }, { text: content.grounding_notes, path: "grounding_notes" }];
  const titles = new Set<string>();
  content.priority_recommendations.forEach((r, i) => {
    const path = `priority_recommendations.${i}`;
    if (r.priority_rank !== i + 1) add("rank_order", path);
    if (titles.has(r.title.toLowerCase())) add("duplicate_recommendation", path);
    titles.add(r.title.toLowerCase());
    const unanswered = r.related_categories.filter(c => !categories.has(c));
    if (unanswered.length) add("unanswered_category", path, { categories: unanswered });
    if (r.recommended_action.split(/\s+/).length > 120) add("action_length", path);
    if (r.evidence.length === 0 && !/a practical next step would be|this suggests/i.test(r.why_it_matters + " " + r.recommended_action)) add("unlabeled_inference", path);
    for (const field of ["title", "why_it_matters", "recommended_action"] as const) narratives.push({ text: r[field], path: `${path}.${field}` });
  });
  for (const [i, gap] of content.key_gaps.entries()) {
    if (!categories.has(gap.category)) add("unanswered_category", `key_gaps.${i}`, { categories: [gap.category] });
    narratives.push({ text: gap.gap, path: `key_gaps.${i}.gap` });
  }
  for (const [name, rows] of [["priority_recommendations", content.priority_recommendations], ["key_gaps", content.key_gaps]] as const) {
    rows.forEach((r, i) => {
      const text = "recommended_action" in r ? [r.title,r.why_it_matters,r.recommended_action].join(" ") : r.gap;
      for (const j of unsupportedClaimCitations(text,r.evidence,evidence)) add("unsupported_claim_citation",`${name}.${i}.evidence.${j}`);
    });
    rows.forEach((r, i) => r.evidence.forEach((c, j) => {
      if (!citations.has(JSON.stringify([c.doc_title, c.source, c.pages_or_section, c.link]))) add("unknown_citation", `${name}.${i}.evidence.${j}`);
    }));
  }
  const internalIds = [...config.QuestionBank.map(q => q.question_id), ...config.DocumentChunks.flatMap(c => [c.chunk_record_id, c.legacy_chunk_id]), ...config.DocumentIndex.map(d => d.doc_id)];
  const supportedPercentages = new Set(score.questions.filter(q => q.status === "scored" && q.responseType === "percent").map(q => Number(q.rawAnswer)));
  const percentagePattern = /(\d+(?:\.\d+)?)\s*(?:%|percent\b)/gi;
  // Numeric evidence may be quoted only from supplied excerpts. This is a
  // reference check, not proof that a model's inference about the excerpt is true.
  for (const chunk of evidence.chunks) {
    for (const match of chunk.record.chunk_text.matchAll(percentagePattern)) supportedPercentages.add(Number(match[1]));
  }
  for (const row of narratives) {
    for (const code of unsupportedAssessmentClaims(row.text, score.questions.filter(q => q.status === "missing"))) add(code, row.path);
    if (/https?:\/\/|www\.|\]\(/i.test(row.text)) add("narrative_url", row.path);
    if (internalIds.some(id => row.text.includes(id))) add("internal_id", row.path);
    // Closed score-restatement surface. Reject other numeric score claims,
    // including reversed phrasing and percentages, instead of repairing them.
    // Supplied context labels can contain numbers and "ratings".
    // Mask only those literal labels in the summary, not generated claims.
    let scoreClaims = row.text;
    if (row.path === "executive_summary") {
      for (const value of [input.context.industry, input.context.companySize, input.context.businessGoal]) {
        const literal = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        scoreClaims = scoreClaims.replace(new RegExp(literal, "gi"), "[context]");
      }
    }
    if (/(?:score|rating|overall|percentile)[^.!?\n]{0,100}\d|\d[^.!?\n]{0,100}(?:score|rating|overall|percentile)/i.test(scoreClaims)
      || /\d\s*(?:out of 100|\/\s*100)/i.test(scoreClaims)) add("unstructured_score_claim", row.path);
    for (const match of row.text.matchAll(percentagePattern)) {
      if (!supportedPercentages.has(Number(match[1]))) add("unsupported_percentage", row.path);
    }
  }
  return issues.length ? { ok: false, issues } : { ok: true, content };
}
