import { expect, test } from "vitest";
import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { scoreAssessment, normalizeAnswer, METHOD_VERSION } from "../../src/domain/scoring/score-assessment";
import { goldenCases, legacyScorer } from "../helpers/legacy-scoring";
const { config } = loadCanonicalConfig();
function same(actual: number, expected: number) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(32 * Number.EPSILON * Math.max(1, Math.abs(expected)));
}
for (const fixture of goldenCases) test(fixture.case_id + " trace is the authoritative calculation and mechanically matches legacy fields", () => {
  const answers = Object.fromEntries(fixture.answers.map(a => [a.question_id, a.answer === null ? "" : String(a.answer)]));
  const score = scoreAssessment(config, fixture.profile, answers);
  const legacy = legacyScorer(config, fixture, true).getAllAnsweredQuestionDebug();
  expect(score.traceSchemaVersion).toBe(1);
  expect(score.trace.map(r => r.question_id)).toEqual(score.questions.map(q => q.id));
  expect(JSON.parse(JSON.stringify(score)).trace).toEqual(score.trace);
  expect(score.input.answers).toEqual(answers);
  expect(score.input.answers).not.toBe(answers);
  let raw = 0, weighted = 0;
  for (const row of score.trace) {
    const q = score.questions.find(q => q.id === row.question_id)!;
    expect(row.raw_answer).toBe(answers[q.id] ?? "");
    expect(row.response_type).toBe(q.responseType);
    expect(row.config_version).toBe(config.version);
    expect(row.method_version).toBe(METHOD_VERSION);
    if (row.status === "missing") {
      expect(q.status).toBe("missing");
      expect(row).not.toHaveProperty("normalized_score");
      expect(row).not.toHaveProperty("final_score");
      continue;
    }
    if (q.status !== "scored") throw new Error("Trace status differs");
    const old = legacy.find((r: { question_id: string }) => r.question_id === row.question_id);
    for (const key of ["normalized_score", "base_weight", "multiplier", "weighted_score", "final_score", "total_possible"] as const) same(row[key], old[key]);
    expect(row.normalized_score).toBe(q.normalization.value);
    expect(row.normalization_inputs).toBe(q.normalization.inputs);
    expect(row.normalization_method).toBe(q.normalization.method);
    expect(row.final_score).toBe(q.earned);
    expect(row.total_possible).toBe(q.possible);
    expect(row.matched_multiplier_rule_ids).toEqual(old.matched_rules.map((r: { rule_id: string }) => r.rule_id));
    expect(row.multiplier_product).toBe(q.multiplier.product);
    expect(row.multiplier_cap).toBe(q.multiplier.cap);
    if (row.benchmark) {
      const metric = q.normalization.benchmark!;
      expect(row.benchmark.record).toBe(metric);
      expect(row.benchmark.source).toBe("MetricBenchmarks");
      expect(JSON.parse(row.benchmark.id)).toEqual([metric.metric_id, metric.benchmark_group_type, metric.benchmark_group_value]);
      expect(row.normalization_inputs.x).toBe(Number(row.raw_answer));
    } else expect(row.answer_scale).toBe(q.normalization.scale);
    raw += row.category_contribution.raw_overall_points!;
    weighted += row.category_contribution.weighted_overall_points!;
  }
  same(raw, score.rawOverall!); same(weighted, score.weightedOverall!);
  for (const category of score.categories) {
    const rows = score.trace.filter(r => r.category === category.category);
    const contribution = rows.reduce((n, r) => n + (r.status === "scored" ? r.category_contribution.percentage_points ?? 0 : 0), 0);
    same(contribution, category.percent ?? 0);
  }
});
test("missing/blank answers are unscored; zero answers and raw lexical precision stay distinct", () => {
  const answers = { "U-001": " No ", "U-018": "0.000", "U-021": "  " };
  const score = scoreAssessment(config, goldenCases[0]!.profile, answers);
  expect(score.trace.find(r => r.question_id === "U-001")).toMatchObject({ raw_answer: " No ", normalized_score: 0, status: "scored" });
  expect(score.trace.find(r => r.question_id === "U-018")).toMatchObject({ raw_answer: "0.000", normalization_inputs: { x: 0 }, status: "scored" });
  expect(score.trace.find(r => r.question_id === "U-021")).toEqual(expect.objectContaining({ raw_answer: "  ", status: "missing" }));
  expect(score.input.answers).toEqual(answers);
  answers["U-001"] = "Yes";
  expect(score.input.answers["U-001"]).toBe(" No ");
  expect(scoreAssessment(config, goldenCases[0]!.profile, answers).trace.find(r => r.question_id === "U-001")).toMatchObject({ normalized_score: 100 });
});
test("normalization trace captures effective operands without replacing source parameter precision", () => {
  const q = { ...config.QuestionBank[0]!, response_type: "percent", metric_id: "trace-test" };
  const metric = { ...config.MetricBenchmarks[0]!, metric_id: q.metric_id, unit: "percent", normalization_method: "exponential_decay", param_1: "10.000", param_2: "", param_3: "", max_value: "100", benchmark_group_type: "global", active: "TRUE" };
  const normalized = normalizeAnswer({ ...config, MetricBenchmarks: [metric] }, q, "20.00", goldenCases[0]!.profile.industry)!;
  expect(normalized.inputs).toMatchObject({ x: 20, param_1: 10, param_2: 0, adjusted_x: 0.2, threshold: 0.1, decay_rate: 10, percent_conversion: true });
  expect(normalized.benchmark!.param_1).toBe("10.000");
  expect(normalized.value).toBe(Math.exp(-1) * 100);
  expect(normalized.value).not.toBe(Number(normalized.value.toFixed(2)));
});
