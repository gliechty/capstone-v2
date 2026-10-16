import { expect, test } from "vitest";
import { validateRecommendationOutput } from "../../src/application/recommendations/validate-output";
import type { RecommendationContent } from "../../src/application/recommendations/contracts";
import { config, input, score, evidence, validTestContent } from "../helpers/recommendation-fixture";
const validate = (raw: unknown, max = 40000) => validateRecommendationOutput(raw, input, score, evidence, config, max);
test("valid content round-trips without correcting generated values", () => {
  const content = structuredClone(validTestContent());
  expect(validate(JSON.stringify(content))).toEqual({ ok: true, content });
});
test.each([
  ["malformed_json", "```json\n{}\n```"], ["malformed_json", "{"], ["invalid_transport", {}], ["schema", "{}"], ["schema", "null"],
])("rejects malformed transport/output: %s", (code, raw) => {
  expect(validate(raw)).toMatchObject({ ok: false, issues: expect.arrayContaining([expect.objectContaining({ code })]) });
});
const mutations: [string, (c: RecommendationContent) => void][] = [
  ["score_mismatch", c => { c.executive_summary = c.executive_summary.replace(/score is [\d.]+%/, "score is 99.9%"); }],
  ["rank_order", c => { c.priority_recommendations[0]!.priority_rank = 2; }],
  ["duplicate_recommendation", c => { c.priority_recommendations.push({ ...c.priority_recommendations[0]!, priority_rank: 2 }); }],
  ["unknown_citation", c => { c.priority_recommendations[0]!.evidence[0]!.doc_title = "Invented source"; }],
  ["unknown_citation", c => { c.priority_recommendations[0]!.evidence[0]!.link = "https://invented.example/source"; }],
  ["unknown_citation", c => { c.key_gaps[0]!.evidence[0]!.pages_or_section = "Invented page 999"; }],
  ["unknown_citation", c => { c.priority_recommendations[0]!.evidence[0]!.source = "Invented issuer"; }],
  ["unanswered_category", c => { c.key_gaps[0]!.category = "Resources"; }],
  ["priority_gap_missing", c => { c.priority_recommendations[0]!.related_categories = ["Resources"]; }],
  ["unlabeled_inference", c => { c.priority_recommendations[0]!.evidence = []; c.priority_recommendations[0]!.why_it_matters = "Guaranteed requirement."; }],
  ["action_length", c => { c.priority_recommendations[0]!.recommended_action = "word ".repeat(121); }],
  ["narrative_url", c => { c.grounding_notes += " https://example.org"; }],
  ["internal_id", c => { c.priority_recommendations[0]!.title = "Fix U-001"; }],
  ["unstructured_score_claim", c => { c.priority_recommendations[0]!.why_it_matters = "Your score is 12.3."; }],
  ["unstructured_score_claim", c => { c.key_gaps[0]!.gap = "You received 80 out of 100."; }],
  ["evidence_limitation_missing", c => { c.grounding_notes = "All sources fully verified."; }],
  ["schema", c => { Object.assign(c, { raw_overall: 100 }); }],
];
test.each(mutations)("rejects %s without rewriting output", (code, mutate) => {
  const content = structuredClone(validTestContent()); mutate(content);
  const raw = JSON.stringify(content);
  const result = validate(raw);
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.issues.map(i => i.code)).toContain(code);
  expect(JSON.stringify(content)).toBe(raw);
});
test("response bytes are bounded; bounded inference may have no citation", () => {
  expect(validate(JSON.stringify(validTestContent()), 10)).toMatchObject({ ok: false, issues: [{ code: "response_too_large" }] });
  const content = structuredClone(validTestContent()); content.priority_recommendations[0]!.evidence = [];
  expect(validate(JSON.stringify(content)).ok).toBe(true);
});

test("permits percentages present in supplied excerpts and rejects invented percentages", () => {
  const content = structuredClone(validTestContent());
  content.priority_recommendations[0]!.recommended_action = "Review the documented target of 12.34567%.";
  expect(validate(JSON.stringify(content))).toMatchObject({ ok: false, issues: expect.arrayContaining([expect.objectContaining({ code: "unsupported_percentage" })]) });
  const augmented = { ...evidence, chunks: [{ ...evidence.chunks[0]!, record: { ...evidence.chunks[0]!.record, chunk_text: "Documented target of 12.34567%." } }] };
  expect(validateRecommendationOutput(JSON.stringify(content), input, score, augmented, config, 40000).ok).toBe(true);
});

test.each(["omit", "paraphrase"])("summary may %s context labels without changing generated prose", mode => {
  const content = structuredClone(validTestContent());
  for (const label of [input.context.industry, input.context.companySize, input.context.businessGoal]) content.executive_summary = content.executive_summary.replace(label, mode === "omit" ? "" : "this business");
  content.executive_summary = content.executive_summary.trim();
  const before = JSON.stringify(content);
  expect(validate(before)).toEqual({ ok: true, content });
  expect(JSON.stringify(content)).toBe(before);
  content.executive_summary = "Your score is 99. " + content.executive_summary;
  expect(validate(JSON.stringify(content))).toMatchObject({ ok: false, issues: expect.arrayContaining([{ code: "unstructured_score_claim", path: "executive_summary" }]) });
});

test("diagnostics name each unobserved category while keeping one issue per rejected row", () => {
  const content = structuredClone(validTestContent());
  content.priority_recommendations[0]!.related_categories = ["Governance", "Resources", "People"];
  content.key_gaps[0]!.category = "Community";
  expect(validate(JSON.stringify(content))).toMatchObject({ ok: false, issues: [
    { code: "unanswered_category", path: "priority_recommendations.0", categories: ["Resources", "People"] },
    { code: "unanswered_category", path: "key_gaps.0", categories: ["Community"] },
  ] });
});

test("missing information can be disclosed in grounding notes without asserting an assessed weakness", () => {
  const content = structuredClone(validTestContent());
  content.grounding_notes += " Resources, People and Community were not assessed; collect answers before drawing conclusions about these areas.";
  expect(validate(JSON.stringify(content)).ok).toBe(true);
  content.key_gaps.push({ category: "Resources", gap: "Resources was not assessed; collect answers before drawing conclusions.", evidence: [] });
  expect(validate(JSON.stringify(content))).toMatchObject({ ok: false, issues: [
    { code: "unanswered_category", path: "key_gaps.1", categories: ["Resources"] },
  ] });
});

test("exact context labels do not hide incorrect generated scores", () => {
  const content = structuredClone(validTestContent());
  content.executive_summary = "The score is 99. " + content.executive_summary;
  expect(validate(JSON.stringify(content))).toMatchObject({ ok: false, issues: expect.arrayContaining([
    { code: "unstructured_score_claim", path: "executive_summary" },
  ]) });
});

test.each(["score", "citation", "unanswered"])("omitted labels do not excuse %s violations", kind => {
  const content = structuredClone(validTestContent());
  for (const label of [input.context.industry, input.context.companySize, input.context.businessGoal]) content.executive_summary = content.executive_summary.replace(label, "");
  if (kind === "score") content.executive_summary = content.executive_summary.replace("score is 51.0%", "score is 99.0%");
  if (kind === "citation") content.priority_recommendations[0]!.evidence[0]!.link = "https://invented.example/";
  if (kind === "unanswered") content.key_gaps[0]!.category = "Resources";
  const expected = { score: "score_mismatch", citation: "unknown_citation", unanswered: "unanswered_category" }[kind];
  expect(validate(JSON.stringify(content))).toMatchObject({ ok: false, issues: expect.arrayContaining([expect.objectContaining({ code: expected })]) });
});
