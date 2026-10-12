import { isDeepStrictEqual } from "node:util";
import type { CanonicalConfig } from "../../src/domain/config/types";
import { METHOD_VERSION, scoreAssessment, type AssessmentScore } from "../../src/domain/scoring/score-assessment";
import { goldenExpected, legacyScorer, type GoldenCase } from "./legacy-scoring";

// Test-only evidence, ordered by dependency stage. No expectation comes from v2.
export const stages = ["selection", "benchmark", "normalization", "base weight", "multiplier", "question points", "category weight", "category totals", "category score", "overall"] as const;
export type Stage = typeof stages[number];
export interface Observation {
  source: "historical capture vs preserved replay" | "canonical vs full-precision replay" | "historical selection vs canonical";
  stage: Stage; location: string; field: string; expected: unknown; actual: unknown; numeric: boolean;
}
export interface Comparison {
  caseId: string; configVersion: string; methodVersion: string; observations: Observation[];
  historical: { raw: number; weighted: number };
  replay: { raw: number; weighted: number };
  canonical: { raw: number | null; weighted: number | null };
  historicalWeightedBreakdown: "captured" | "not captured";
}
export const goldenAnswers = (fixture: GoldenCase) => Object.fromEntries(fixture.answers.map(a => [a.question_id, a.answer === null ? "" : String(a.answer)]));
export function matches(o: Observation) {
  if (o.numeric && typeof o.expected === "number" && typeof o.actual === "number") {
    return Number.isFinite(o.actual) && Math.abs(o.actual - o.expected) <= 32 * Number.EPSILON * Math.max(1, Math.abs(o.expected));
  }
  if (o.actual === undefined || o.expected === undefined) return o.actual === o.expected;
  // VM-created records have different prototypes; compare their JSON data only.
  return isDeepStrictEqual(JSON.parse(JSON.stringify(o.actual ?? null)), JSON.parse(JSON.stringify(o.expected ?? null)));
}
export function firstDivergence(comparison: Comparison) {
  return comparison.observations.find(o => !matches(o));
}
export function diagnostic(comparison: Comparison, o: Observation) {
  return JSON.stringify({ case: comparison.caseId, config: comparison.configVersion, method: comparison.methodVersion,
    evidence: o.source, stage: o.stage, location: o.location, field: o.field, expected: o.expected, actual: o.actual,
    comparison: o.numeric ? "32 * EPSILON * max(1, abs(reference))" : "exact" }, null, 2);
}
export function compareGolden(config: CanonicalConfig, fixture: GoldenCase,
  actual: AssessmentScore = scoreAssessment(config, fixture.profile, goldenAnswers(fixture))): Comparison {
  const capture = goldenExpected(fixture);
  const expected = capture.scoring;
  const legacy = legacyScorer(config, fixture);
  const precise = legacyScorer(config, fixture, true);
  const historicalRows = legacy.getAllAnsweredQuestionDebug() as Record<string, unknown>[];
  const preciseRows = precise.getAllAnsweredQuestionDebug() as Record<string, unknown>[];
  const observations: Observation[] = [];
  const add = (source: Observation["source"], stage: Stage, location: string, field: string, expected: unknown, actual: unknown, numeric = false) =>
    observations.push({ source, stage, location, field, expected, actual, numeric });
  const h: Observation["source"] = "historical capture vs preserved replay";
  const c: Observation["source"] = "canonical vs full-precision replay";
  const selection: Observation["source"] = "historical selection vs canonical";
  add(selection, "selection", "assessment", "case IDs", fixture.case_id, capture.case_id);
  add(selection, "selection", "assessment", "ordered IDs", capture.question_selection.actual_ids, actual.questions.map(q => q.id));
  add(selection, "selection", "assessment", "seed IDs", fixture.expected_question_ids, actual.questions.map(q => q.id));
  add(c, "selection", "assessment", "configVersion", config.version, actual.configVersion);
  add(c, "selection", "assessment", "methodVersion", METHOD_VERSION, actual.methodVersion);
  for (const row of expected.question_level as Record<string, unknown>[]) {
    const id = String(row.question_id);
    const old = historicalRows.find(r => r.question_id === id);
    const q = actual.questions.find(r => r.id === id);
    add(h, "normalization", id, "answered", Boolean(goldenAnswers(fixture)[id]?.trim()), Boolean(old));
    if (!old) continue;
    for (const [field, legacyField, stage] of [
      ["normalization_method", "normalization_method", "normalization"], ["normalized_score", "normalized_score", "normalization"],
      ["base_weight", "base_weight", "base weight"], ["multiplier", "multiplier", "multiplier"],
      ["weighted_score", "weighted_score", "question points"], ["final_score", "final_score", "question points"],
      ["final_score_possible", "total_possible", "question points"],
    ] as const) add(h, stage, id, field, row[field], old[legacyField]);
    add(h, "multiplier", id, "matched rules", row.matched_multiplier_rules,
      (old.matched_rules as { rule_id: string; multiplier: number }[]).map(r => r.rule_id + " (" + r.multiplier + "x)"));
    add(c, "normalization", id, "status", "scored", q?.status);
  }
  for (const q of actual.questions) {
    const ref = preciseRows.find(r => r.question_id === q.id);
    add(c, "normalization", q.id, "status", ref ? "scored" : "missing", q.status);
    if (q.status === "missing") {
      add(c, "question points", q.id, "has earned points", false, Object.hasOwn(q, "earned"));
      add(c, "question points", q.id, "has possible points", false, Object.hasOwn(q, "possible"));
      continue;
    }
    if (!ref) continue;
    const question = config.QuestionBank.find(r => r.question_id === q.id)!;
    add(c, "benchmark", q.id, "resolved record", ["boolean", "categorical"].includes(question.response_type) ? null : legacy.getMetric(question), q.normalization.benchmark);
    add(c, "normalization", q.id, "method", ref.normalization_method, q.normalization.method);
    add(c, "normalization", q.id, "score", ref.normalized_score, q.normalization.value, true);
    add(c, "base weight", q.id, "weight", ref.base_weight, q.baseWeight);
    add(c, "multiplier", q.id, "matched rule IDs", (ref.matched_rules as { rule_id: string }[]).map(r => r.rule_id), q.multiplier.rules.map(r => r.rule_id));
    add(c, "multiplier", q.id, "effective multiplier", ref.multiplier, q.multiplier.value, true);
    add(c, "question points", q.id, "normalized × base", ref.weighted_score, q.weighted, true);
    add(c, "question points", q.id, "earned", ref.final_score, q.earned, true);
    add(c, "question points", q.id, "possible", ref.total_possible, q.possible, true);
  }
  const preciseCategories = precise.getWeightedCategoryBreakdown() as Record<string, unknown>[];
  const oldCategories = legacy.getCategoryScores() as Record<string, unknown>[];
  add(c, "category totals", "assessment", "category identities",
    preciseCategories.map(r => r.category).sort(), actual.categories.map(r => r.category).sort());
  for (const category of actual.categories) {
    const ref = preciseCategories.find(r => r.category === category.category);
    const old = oldCategories.find(r => r.category === category.category);
    const recorded = expected.category_scores.find((r: { category: string }) => r.category === category.category);
    const digits = fixture.case_id === "GOLDEN_01_MANUFACTURING" ? 0 : 2;
    for (const [field, value, stage] of [
      ["category_weight", category.weight, "category weight"], ["points_earned", category.earned, "category totals"],
      ["total_possible", category.possible, "category totals"], ["questions_answered", category.answered, "category totals"],
      ["raw_category_percent", category.percent, "category score"], ["weighted_contribution", category.contribution, "category score"],
    ] as const) add(c, stage, category.category, field, ref?.[field], value, field !== "category_weight" && field !== "questions_answered");
    for (const field of ["points_earned", "total_possible"] as const)
      add(h, "category totals", category.category, field, recorded?.[field], Number(Number(old?.[field]).toFixed(digits)));
    add(h, "category score", category.category, "percent", recorded?.category_percent, old?.category_percent);
  }
  const oldRaw = legacy.getOverallScore();
  const preciseRaw = precise.getOverallScore();
  add(h, "overall", "raw", "percent", expected.raw_overall.overall_percent, oldRaw.overall_percent);
  for (const [field, value] of [["points_earned", actual.earned], ["total_possible", actual.possible], ["overall_percent", actual.rawOverall]] as const)
    add(c, "overall", "raw", field, preciseRaw[field], value, true);
  add(c, "overall", "weighted", "score", precise.getWeightedOverallScore().weighted_score, actual.weightedOverall, true);
  if (expected.weighted_overall.breakdown) {
    // Historical weights are an isolated capture oracle, never runtime authority.
    const weights = config.CategoryWeights.map(w => w.industry !== fixture.profile.industry ? w : { ...w,
      ...Object.fromEntries(expected.weighted_overall.breakdown.map((r: { category: string; weight: number }) => [r.category.toLowerCase() + "_weight", String(r.weight)])) });
    const historicalWeights = legacyScorer({ ...config, CategoryWeights: weights }, fixture);
    add(h, "category weight", "assessment", "captured weights", expected.category_weights, historicalWeights.getCategoryWeights());
    add(h, "category score", "assessment", "weighted breakdown", expected.weighted_category_breakdown, historicalWeights.getWeightedCategoryBreakdown());
    add(h, "overall", "weighted", "score", expected.weighted_overall.weighted_score, historicalWeights.getWeightedOverallScore().weighted_score);
  }
  observations.sort((a, b) => stages.indexOf(a.stage) - stages.indexOf(b.stage));
  return { caseId: fixture.case_id, configVersion: config.version, methodVersion: actual.methodVersion, observations,
    historical: { raw: expected.raw_overall.overall_percent, weighted: expected.weighted_overall.weighted_score },
    replay: { raw: oldRaw.overall_percent, weighted: legacy.getWeightedOverallScore().weighted_score },
    canonical: { raw: actual.rawOverall, weighted: actual.weightedOverall },
    historicalWeightedBreakdown: expected.weighted_overall.breakdown ? "captured" : "not captured" };
}
export function matrixRow(result: Comparison) {
  return { case: result.caseId, method: result.methodVersion, ...Object.fromEntries(stages.map(stage => [stage,
    result.observations.filter(o => o.stage === stage).every(matches) ? "PASS" : "FAIL"])),
    historicalRawWeighted: result.historical, preservedReplayCanonicalWeights: result.replay,
    canonicalFullPrecision: result.canonical, historicalWeightedBreakdown: result.historicalWeightedBreakdown };
}
