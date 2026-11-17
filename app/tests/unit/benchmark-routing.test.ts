import { expect, test } from "vitest";
import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { validateRelations } from "../../src/application/config/schemas";
import { normalizeAnswer, resolveBenchmark, scoreAssessment } from "../../src/domain/scoring/score-assessment";
import { selectQuestions } from "../../src/domain/selection/select-questions";
import { goldenCases, historicalBenchmarkConfig } from "../helpers/legacy-scoring";

const { config } = loadCanonicalConfig();
const training = config.QuestionBank.find(q => q.question_id === "M-024")!;
const turnover = config.QuestionBank.find(q => q.metric_id === "voluntary_turnover_rate")!;
const industries = [
  ["Business / Export Services", 45, 15],
  ["Manufacturing (Industrial / Components)", 64, 12],
  ["Construction / Materials", 55, 15],
  ["Food & Agro-processing", 55, 20],
  ["Consumer Goods (Apparel / FMCG)", 40, 15],
] as const;

test.each(industries)("training and turnover use the existing %s industry parameters", (industry, trainingCap, turnoverThreshold) => {
  expect(training.metric_id).toBe("labor_training_hours");
  expect(resolveBenchmark(config, training, industry)).toMatchObject({
    metric_id: "labor_training_hours", benchmark_group_type: "industry", benchmark_group_value: industry,
    normalization_method: "linear_cap", param_1: String(trainingCap), param_2: "", param_3: "", min_value: "0", max_value: "100",
  });
  expect(normalizeAnswer(config, training, "20", industry)!.value).toBe(20 / trainingCap * 100);
  expect(normalizeAnswer(config, training, String(trainingCap), industry)!.value).toBe(100);
  expect(normalizeAnswer(config, training, String(trainingCap + 1), industry)!.value).toBe(100);
  expect(resolveBenchmark(config, turnover, industry)).toMatchObject({
    metric_id: "voluntary_turnover_rate", benchmark_group_type: "industry", benchmark_group_value: industry,
    normalization_method: "exponential_decay", param_1: String(turnoverThreshold), param_2: "10", param_3: "",
  });
});

test("configuration accepts shared metric IDs across industries but rejects duplicate composite identities", () => {
  const rows = config.MetricBenchmarks.filter(row => row.metric_id === training.metric_id);
  expect(rows).toHaveLength(5);
  expect(new Set(rows.map(row => row.benchmark_group_value)).size).toBe(5);
  expect(validateRelations(config)).toEqual(["QuestionBank I-045: missing metric reference (inactive; retained source record)"]);
  expect(() => validateRelations({ ...config, MetricBenchmarks: [...config.MetricBenchmarks, rows[0]!] })).toThrow(/duplicate identity/);
});

test("Golden score changes are confined to training and its People/overall contributions", () => {
  const historical = historicalBenchmarkConfig(config);
  const expectedWeightedDelta: Record<string, number> = {
    GOLDEN_01_MANUFACTURING: -0.023228836474615377,
    GOLDEN_03_BUSINESS_EXPORT: -0.06703871499177,
  };
  for (const fixture of goldenCases) {
    const answers = Object.fromEntries(fixture.answers.map(a => [a.question_id, a.answer === null ? "" : String(a.answer)]));
    const before = scoreAssessment(historical, fixture.profile, answers);
    const after = scoreAssessment(config, fixture.profile, answers);
    expect(after.questions.filter(q => q.id !== "M-024")).toEqual(before.questions.filter(q => q.id !== "M-024"));
    expect(after.categories.filter(c => c.category !== "People")).toEqual(before.categories.filter(c => c.category !== "People"));
    const expected = before.weightedOverall! + (expectedWeightedDelta[fixture.case_id] ?? 0);
    expect(Math.abs(after.weightedOverall! - expected)).toBeLessThanOrEqual(32 * Number.EPSILON * Math.max(1, Math.abs(expected)));
    if (!(fixture.case_id in expectedWeightedDelta)) {
      expect(after.rawOverall).toBe(before.rawOverall);
      expect(after.categories).toEqual(before.categories);
    }
  }
});

test("active numeric and percent questions never fall back to another industry across all configured markets", () => {
  let lookups = 0;
  for (const [industry] of industries) {
    const selected = new Map<string, typeof training>();
    for (const region of config.regions) {
      // Union of reachable questions, not a synthetic user assessment: location
      // and market are alternative region triggers; the largest band includes
      // all currently configured size-applicability groups.
      for (const q of selectQuestions(config.QuestionBank, { industry, employee_band: "1001+", company_location: region, target_market_region: [region] })) {
        if (["numeric", "percent"].includes(q.response_type)) selected.set(q.question_id, q);
      }
    }
    for (const q of selected.values()) {
      const row = resolveBenchmark(config, q, industry);
      expect(row.benchmark_group_type === "global" || row.benchmark_group_value === industry, industry + ": " + q.question_id).toBe(true);
      lookups++;
    }
  }
  expect(lookups).toBe(100);
});
