import { computeAssessment } from "../../src/application/score-request";
import { scoreClosing } from "../../src/application/recommendations/prepare";
import { expect, test } from "vitest";
import { validateRecommendationOutput } from "../../src/application/recommendations/validate-output";
import type { RecommendationContent } from "../../src/application/recommendations/contracts";
import { config, input, score, evidence, validTestContent } from "../helpers/recommendation-fixture";
const validate = (raw: unknown, max = 40000) => validateRecommendationOutput(raw, input, score, evidence, config, max);
test("valid content round-trips without correcting generated values", () => {
  const content = structuredClone(validTestContent());
  content.grounding_notes = "Only Governance was assessed. Collect answers before drawing conclusions about other categories.";
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
  ["schema", c => { Object.assign(c, { raw_overall: 100 }); }],
];
test.each(mutations)("legacy delivery does not reject %s or rewrite output", (_code, mutate) => {
  const content = structuredClone(validTestContent()); mutate(content);
  const raw = JSON.stringify(content);
  const result = validate(raw);
  expect(result).toEqual({ ok: true, content });
  expect(JSON.stringify(content)).toBe(raw);
});
test("response bytes are bounded; bounded inference may have no citation", () => {
  expect(validate(JSON.stringify(validTestContent()), 10)).toMatchObject({ ok: false, issues: [{ code: "response_too_large" }] });
  const content = structuredClone(validTestContent()); content.priority_recommendations[0]!.evidence = [];
  expect(validate(JSON.stringify(content)).ok).toBe(true);
});

test("percentages remain model guidance rather than acceptance conditions", () => {
  const content = structuredClone(validTestContent());
  content.priority_recommendations[0]!.recommended_action = "Review the documented target of 12.34567%.";
  expect(validate(JSON.stringify(content))).toEqual({ ok: true, content });
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
  expect(validate(JSON.stringify(content))).toEqual({ ok: true, content });
});

test("category coverage is guidance rather than a rejection gate", () => {
  const content = structuredClone(validTestContent());
  content.priority_recommendations[0]!.related_categories = ["Governance", "Resources", "People"];
  content.key_gaps[0]!.category = "Community";
  expect(validate(JSON.stringify(content))).toEqual({ ok: true, content });
});

test("missing information can be disclosed in grounding notes without asserting an assessed weakness", () => {
  const content = structuredClone(validTestContent());
  content.grounding_notes += " Resources, People and Community were not assessed; collect answers before drawing conclusions about these areas.";
  expect(validate(JSON.stringify(content)).ok).toBe(true);
  content.key_gaps.push({ category: "Resources", gap: "Resources was not assessed; collect answers before drawing conclusions.", evidence: [] });
  expect(validate(JSON.stringify(content))).toEqual({ ok: true, content });
});

test("generated score prose is preserved, not certified or corrected", () => {
  const content = structuredClone(validTestContent());
  content.executive_summary = "The score is 99. " + content.executive_summary;
  expect(validate(JSON.stringify(content))).toEqual({ ok: true, content });
});

test.each(["score", "citation", "unanswered"])("legacy delivery preserves %s prose even with omitted labels", kind => {
  const content = structuredClone(validTestContent());
  for (const label of [input.context.industry, input.context.companySize, input.context.businessGoal]) content.executive_summary = content.executive_summary.replace(label, "");
  if (kind === "score") content.executive_summary = content.executive_summary.replace("score is 51.0%", "score is 99.0%");
  if (kind === "citation") content.priority_recommendations[0]!.evidence[0]!.link = "https://invented.example/";
  if (kind === "unanswered") content.key_gaps[0]!.category = "Resources";
  expect(validate(JSON.stringify(content))).toEqual({ ok: true, content });
});

test.each(["No operational emissions baseline or energy tracking", "The company does not track total energy consumption."])("does not reject unknown-answer claims under migration parity: %s", text => {
  const content = structuredClone(validTestContent());
  content.key_gaps[0]!.gap = text;
  expect(validate(JSON.stringify(content))).toEqual({ ok: true, content });
});
test.each(["No evidence of energy tracking was supplied; the practice remains unconfirmed.", "Energy tracking is unknown; confirm whether consumption is monitored before drawing conclusions.", "If the company does not track energy, a practical next step would be to establish a baseline.", "Evaluate ROI using project costs and potential benefits before choosing an investment.", "Return on investment has not been calculated; this is a qualitative priority."])("permits qualified advice without exact wording: %s", text => {
  const content = structuredClone(validTestContent()); content.grounding_notes = text;
  expect(validate(JSON.stringify(content)).ok).toBe(true);
});
test.each(["This is the highest-ROI next step.", "This project delivers the best return on investment.", "The calculated ROI is 12 months."])("does not reject ROI prose under migration parity: %s", text => {
  const content = structuredClone(validTestContent()); content.executive_summary = text + " " + content.executive_summary;
  expect(validate(JSON.stringify(content))).toEqual({ ok: true, content });
});

test("an assessed Resources category does not turn its missing energy answer into No", () => {
  const resource = score.questions.find(q => q.category === "Resources" && q.responseType === "boolean" && !/energy/i.test(q.title))!;
  const answeredInput = {...input, answers:{...input.answers,[resource.id]:"No"}};
  const partial = computeAssessment(config, {configVersion:answeredInput.configVersion,context:answeredInput.context,answers:answeredInput.answers});
  expect(partial.categories.find(c=>c.category==="Resources")!.percent).not.toBeNull();
  const content = structuredClone(validTestContent());
  content.executive_summary = "An observed practice can improve. " + scoreClosing(partial);
  content.priority_recommendations[0]!.related_categories = ["Resources"];
  content.key_gaps[0] = {category:"Resources",gap:"No operational emissions baseline or energy tracking",evidence:[]};
  const result = validateRecommendationOutput(JSON.stringify(content),answeredInput,partial,evidence,config,40000);
  expect(result).toEqual({ok:true,content});
  content.key_gaps[0]!.gap = "An answered resource practice needs improvement.";
  content.grounding_notes = "Energy tracking remains unknown even though other resource answers were supplied.";
  expect(validateRecommendationOutput(JSON.stringify(content),answeredInput,partial,evidence,config,40000).ok).toBe(true);
});
