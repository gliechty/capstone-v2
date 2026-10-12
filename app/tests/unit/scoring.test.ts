import { expect, test } from "vitest";
import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { normalizeAnswer, resolveBenchmark, resolveMultiplier, scoreAssessment } from "../../src/domain/scoring/score-assessment";
import { goldenCases } from "../helpers/legacy-scoring";
const { config } = loadCanonicalConfig();
const profile = goldenCases[0]!.profile;
// Floating-point operation-order comparison only: 32 ULP-scaled epsilons,
// not a tolerance for historical decimal rounding or weight differences.
function sameNumber(actual: number, expected: number) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(32 * Number.EPSILON * Math.max(1, Math.abs(expected)));
}
test("missing is distinct from zero, invalid answers fail, unknown IDs fail, and no weights are redistributed", () => {
  const empty = scoreAssessment(config, profile, {});
  expect(empty.rawOverall).toBeNull(); expect(empty.weightedOverall).toBeNull(); expect(empty.categories.every(c => c.percent === null)).toBe(true);
  const zero = scoreAssessment(config, profile, { "U-001": "No" });
  expect(zero.rawOverall).toBe(0); expect(zero.answered).toBe(1); expect(zero.possible).toBe(386);
  expect(zero.categories.find(c => c.category === "People")!.percent).toBeNull();
  const yes = scoreAssessment(config, profile, { "U-001": "Yes" });
  expect(yes.weightedOverall).toBe(100 * Number(config.CategoryWeights.find(w => w.industry === profile.industry)!.governance_weight));
  for (const bad of ["NaN", "Infinity", "1e999", "-2", "0x10", "n/a"]) expect(() => scoreAssessment(config, profile, { "U-018": bad })).toThrow();
  expect(() => scoreAssessment(config, profile, { "U-021": "101" })).toThrow(/percentage/);
  expect(() => scoreAssessment(config, profile, { "U-001": "Maybe" })).toThrow(/option/);
  expect(() => scoreAssessment(config, profile, { unknown: "Yes" })).toThrow(/outside/);
  expect(() => scoreAssessment({ ...config, CategoryWeights: [] }, profile, {})).toThrow(/weights/);
});
test("benchmark precedence preserves industry, global/all and final source-order fallback", () => {
  const q = config.QuestionBank.find(q => q.question_id === "U-018")!;
  const base = { ...config.MetricBenchmarks[0]!, metric_id: q.metric_id, active: "TRUE" };
  const global = { ...base, benchmark_group_type: "global", benchmark_group_value: "all" };
  const industry = { ...base, benchmark_group_type: "industry", benchmark_group_value: profile.industry };
  expect(resolveBenchmark({ ...config, MetricBenchmarks: [global, industry] }, q, profile.industry)).toBe(industry);
  expect(resolveBenchmark({ ...config, MetricBenchmarks: [global, { ...industry, active: "FALSE" }] }, q, profile.industry)).toBe(global);
  const other = { ...industry, benchmark_group_value: "Other" };
  expect(resolveBenchmark({ ...config, MetricBenchmarks: [other] }, q, profile.industry)).toBe(other);
  expect(() => resolveBenchmark({ ...config, MetricBenchmarks: [] }, q, profile.industry)).toThrow(/benchmark/);
});
test.each([
  ["identity_percent", "25", "10", "2", "3", 25], ["identity_boolean", "1", "10", "2", "3", 1],
  ["gaussian", "12", "10", "2", "3", Math.exp(-0.5) * 100], ["linear_cap", "5", "10", "2", "3", 50],
  ["inverse_count", "2", "10", "2", "3", 100 / 3], ["inverse_percentage", "25", "10", "2", "3", 75],
  ["benchmark_inverse_ratio", "10", "10", "2", "3", 50], ["exponential_decay", "12", "10", "2", "3", Math.exp(-4) * 100],
  ["inverse_linear_cap", "1", "10", "2", "3", 50], ["banded", "2", "1", "2", "3", 75],
])("%s uses unrounded formula", (method, raw, p1, p2, p3, value) => {
  const q = { ...config.QuestionBank[0]!, response_type: "numeric", metric_id: "test" };
  const metric = { ...config.MetricBenchmarks[0]!, metric_id: "test", unit: "count", normalization_method: method as string, param_1: p1 as string, param_2: p2 as string, param_3: p3 as string, max_value: "100", benchmark_group_type: "global", active: "TRUE" };
  sameNumber(normalizeAnswer({ ...config, MetricBenchmarks: [metric] }, q, raw as string, profile.industry)!.value, value as number);
});
test("multipliers match all v1 dimensions, multiply then cap, and do not infer OR regions", () => {
  const q = { ...config.QuestionBank[0]!, tags: "alpha;beta", category: "People", subcategory: "training" };
  const rule = { ...config.MultiplierRules[0]!, rule_id: "r1", active: "TRUE", tag: "alpha", category: "People", subcategory: "training", industry: profile.industry, target_market_region: "North America", target_buyer: "Export", business_goal: "procurement", multiplier: "1.3" };
  const result = resolveMultiplier({ ...config, MultiplierRules: [rule, { ...rule, rule_id: "r2" }] }, q, profile);
  expect(result.product).toBe(1.3 * 1.3); expect(result.value).toBe(1.5);
  for (const patch of [{ active: "" }, { tag: "gamma" }, { category: "Resources" }, { subcategory: "other" }, { industry: "Other" }, { target_market_region: "North America;Oceania" }, { target_buyer: "Enterprise" }, { business_goal: "Invest" }]) expect(resolveMultiplier({ ...config, MultiplierRules: [{ ...rule, ...patch }] }, q, profile).rules).toEqual([]);
});

test("normalization boundary/error cases never repair invalid config or round intermediate scores", () => {
  const q = { ...config.QuestionBank[0]!, response_type: "numeric", metric_id: "test" };
  const metric = { ...config.MetricBenchmarks[0]!, metric_id: "test", unit: "percent", normalization_method: "exponential_decay", param_1: "10", param_2: "2", param_3: "", max_value: "100", benchmark_group_type: "global", active: "TRUE" };
  const normalized = (raw: string, patch = {}) => normalizeAnswer({ ...config, MetricBenchmarks: [{ ...metric, ...patch }] }, q, raw, profile.industry)!.value;
  expect(normalized("10")).toBe(100);
  sameNumber(normalized("20"), Math.exp(-0.2) * 100);
  expect(normalized("500", { normalization_method: "identity_percent" })).toBe(100);
  expect(normalized("500", { normalization_method: "inverse_percentage" })).toBe(0);
  expect(normalized("500", { normalization_method: "linear_cap" })).toBe(100);
  expect(normalized("500", { normalization_method: "inverse_linear_cap" })).toBe(0);
  for (const [raw, expected] of [["1", 100], ["2", 75], ["3", 50], ["4", 0]]) expect(normalized(raw as string, { normalization_method: "banded", param_1: "1", param_2: "2", param_3: "3" })).toBe(expected);
  for (const patch of [{ normalization_method: "linear_cap", param_1: "0" }, { normalization_method: "gaussian", param_2: "0" }, { param_1: "NaN" }, { normalization_method: "invented" }]) expect(() => normalized("1", patch)).toThrow();
  expect(normalizeAnswer(config, config.QuestionBank[0]!, " YES ", profile.industry)!.value).toBe(100);
  expect(normalizeAnswer(config, q, "  ", profile.industry)).toBeNull();
  const inverse = normalized("2", { normalization_method: "inverse_count" });
  expect(inverse).not.toBe(Number(inverse.toFixed(2)));
});
test("multiplier cap applies after the entire product, never after each rule", () => {
  const q = config.QuestionBank[0]!;
  const base = { ...config.MultiplierRules[0]!, active: "TRUE", tag: "ANY", category: "ANY", subcategory: "ANY", industry: "ANY", target_market_region: "ANY", target_buyer: "ANY", business_goal: "ANY" };
  const rules = [{ ...base, rule_id: "a", multiplier: "2" }, { ...base, rule_id: "b", multiplier: "0.5" }];
  expect(resolveMultiplier({ ...config, MultiplierRules: rules }, q, profile).value).toBe(1);
});
