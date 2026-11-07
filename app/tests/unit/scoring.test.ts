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
  for (const method of ["identity_percent", "inverse_percentage", "linear_cap", "inverse_linear_cap"]) expect(() => normalized("500", {normalization_method:method})).toThrow(/percentage/);
  expect(normalized("10")).toBe(100);
  sameNumber(normalized("20"), Math.exp(-0.2) * 100);
  expect(normalized("100", { normalization_method: "identity_percent" })).toBe(100);
  expect(normalized("100", { normalization_method: "inverse_percentage" })).toBe(0);
  expect(normalized("100", { normalization_method: "linear_cap" })).toBe(100);
  expect(normalized("100", { normalization_method: "inverse_linear_cap" })).toBe(0);
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

import { selectImprovementLevers } from "../../src/application/improvement-levers";

test("levers rank approved Golden answers by real weighted gain, include numeric targets, and preserve baseline", () => {
  const fixture = goldenCases[0]!;
  const answers = Object.fromEntries(fixture.answers.map(a => [a.question_id, a.answer === null ? "" : String(a.answer)]));
  const before = JSON.stringify(answers);
  const baseline = scoreAssessment(config, fixture.profile, answers);
  const selected = selectImprovementLevers(config, baseline);
  expect(selected.levers.map(l => l.id)).toEqual(["U-034", "U-033", "U-035", "U-036", "I-069"]);
  expect(selected.levers[0]!.options).toEqual(["No", "Some", "Yes"]);
  sameNumber(selected.levers[0]!.weightedGain, 3.1972789115646307);
  const combined = { ...answers, "U-034": "Yes", "U-035": "8" };
  const scenario = scoreAssessment(config, fixture.profile, combined);
  expect(scenario.categories.find(c => c.category === "Community")!.percent).toBeGreaterThan(baseline.categories.find(c => c.category === "Community")!.percent!);
  // Existing scenario total plus the approved M-024 routing correction:
  // 1 hour, weight3.97, People denominator2334.5 and category weight0.1457.
  const trainingCorrection = (100 / 64 - 100 / 40) * 3.97 / 2334.5 * 100 * 0.1457;
  sameNumber(scenario.weightedOverall!, 30.41997828024284 + trainingCorrection);
  expect(JSON.stringify(answers)).toBe(before);
  expect(selectImprovementLevers(config, scoreAssessment(config, fixture.profile, {})).levers).toEqual([]);
  expect(selectImprovementLevers(config, scoreAssessment(config, fixture.profile, { "U-034": "Yes" })).levers).toEqual([]);
});

test("levers preserve fractional actual answers, disclose U-026 and exclude inherited unbounded water functions", () => {
  const score = scoreAssessment(config, profile, { "U-026": "12.3456789", "U-031": "33.3333333333" });
  const selected = selectImprovementLevers(config, score);
  const renewable = selected.levers.find(l => l.id === "U-026")!;
  expect(renewable.actual).toBe("12.3456789");
  expect(renewable.best).toBe("100");
  expect(renewable.kind).toBe("percent");
  expect(renewable.note).toContain("total-energy");
  expect(renewable.note).toContain("electricity");
  expect(selected.levers.find(l => l.id === "U-031")!.actual).toBe("33.3333333333");
  const waterProfile = { ...profile, target_market_region: ["South Asia"] };
  const water = scoreAssessment(config, waterProfile, { "IM-6": "20" });
  const unresolved = selectImprovementLevers(config, water);
  expect(unresolved.levers).toEqual([]);
  expect(unresolved.excluded).toEqual([{ id: "IM-6", reason: "No finite, defensible best answer and scenario range under the current scoring function." }]);
});
import { withPortraitPotential } from '../../src/application/portrait-potential';
import portraitMapping from '../../config/portraits/portrait_family_mapping_v0.2.json';
import { calculatePortrait as calculatePortraitBase, portraitLever, PORTRAIT_FAMILIES, portraitMaturity, comparePortraitFamilies } from '../../src/application/sustainability-portrait';
const calculatePortrait: typeof calculatePortraitBase = (score, mapping, ids) => calculatePortraitBase(withPortraitPotential(config, score), mapping, ids);

test('portrait beta mapping covers active and inactive records without changing scores', () => {
  expect(portraitMapping.rows).toHaveLength(config.QuestionBank.length);
  expect(new Set(portraitMapping.rows.map(r => r.question_id)).size).toBe(config.QuestionBank.length);
  for (const q of config.QuestionBank) {
    const row = portraitMapping.rows.find(r => r.question_id === q.question_id)!;
    expect(row.active).toBe(q.active === 'TRUE');
    expect(row.question_text_at_mapping).toBe(q.question_text);
    expect(row.response_type).toBe(q.response_type);
    expect(row.answer_scale_id).toBe(q.answer_scale_id);
  }
  for (const fixture of goldenCases) {
    const score = scoreAssessment(config, fixture.profile, Object.fromEntries(fixture.answers.map(a => [a.question_id, a.answer === null ? "" : String(a.answer)]))), before = JSON.stringify(score);
    const portrait = calculatePortrait(score, portraitMapping)!;
    expect(portrait).not.toBeNull();
    expect(JSON.stringify(score)).toBe(before);
    const readable = portrait.families.filter(f => f.readable);
    for (const family of portrait.families) {
      expect(family.readable).toBe(family.applicable > 0 && family.answered > 0);
      if (family.evidence.length) expect(family.mean).toBe(family.evidence.reduce((sum, r) => sum + r.value, 0) / family.applicable);
      expect(family.inputBasis).toBe('unknown');
    }
    if (readable.length < 2) expect(portrait.name).toBe('Portrait in progress');
    else {
      const winner = [...readable].sort(comparePortraitFamilies)[0]!;
      expect(portrait.strongest).toBe(winner.id);
    }
  }
});

test('portrait figure supplied includes zero, skips unknown, and defers other numeric interpretation', () => {
  const fixture = goldenCases[0]!;
  const empty = scoreAssessment(config, fixture.profile, {});
  expect(calculatePortrait(empty, portraitMapping)!.name).toBe('Portrait in progress');
  const id = empty.trace.find(t => ['numeric','percent'].includes(t.response_type) && portraitMapping.rows.find(r => r.question_id === t.question_id)?.family === 'measure')!.question_id;
  const zero = scoreAssessment(config, fixture.profile, { [id]: '0' });
  const portrait = calculatePortrait(zero, portraitMapping, [id])!;
  const measure = portrait.families.find(f => f.id === 'measure')!;
  expect(measure.evidence.find(e => e.id === id)).toMatchObject({ value: 1, numeric: true, origin: 'calculator' });
  expect(calculatePortrait(zero, portraitMapping)!.families.find(f => f.id === 'measure')!.inputBasis).toBe('unknown');
  expect(calculatePortrait(empty, portraitMapping)!.families.find(f => f.id === 'measure')!.answered).toBe(0);
  for (const raw of ['', 'NaN', '-1', '1e4']) {
    if (raw) expect(() => scoreAssessment(config, fixture.profile, { [id]: raw })).toThrow();
    else expect(calculatePortrait(scoreAssessment(config, fixture.profile, { [id]: raw }), portraitMapping)!.families.find(f => f.id === 'measure')!.answered).toBe(0);
  }
  const deferred = empty.trace.filter(t => ['numeric','percent'].includes(t.response_type) && !['measure','none'].includes(portraitMapping.rows.find(r => r.question_id === t.question_id)!.family));
  expect(portrait.excludedNumeric.sort()).toEqual(deferred.map(r => r.question_id).sort());
  for (const row of deferred) expect(portrait.families.flatMap(f => f.evidence).map(e => e.id)).not.toContain(row.question_id);
  expect(calculatePortrait({ ...zero, configVersion: 'different-bank' }, portraitMapping)).toBeNull();
});

test('portrait uses only available actual top-five Levers with truthful fallback and no fabricated action', () => {
  const fixture = goldenCases[0]!;
  const score = scoreAssessment(config, fixture.profile, Object.fromEntries(fixture.answers.map(a => [a.question_id, a.answer === null ? "" : String(a.answer)])));
  const available = selectImprovementLevers(config, score).levers;
  for (const family of PORTRAIT_FAMILIES) {
    const found = available.find(l => portraitMapping.rows.find(r => r.question_id === l.id)!.family === family);
    const result = portraitLever(family, available, portraitMapping);
    expect(result?.lever.id).toBe((found ?? available[0])?.id);
    if (result) expect(result.label.startsWith('Top Lever in ')).toBe(Boolean(found));
  }
  expect(portraitLever('measure', [], portraitMapping)).toBeNull();
  expect(portraitLever(null, available, portraitMapping)).toBeNull();
});

import { portraitReading, portraitAdvice } from '../../src/application/portrait-reading';
import { createRecommendationService } from '../../src/application/recommendations/service';
import { input as recommendationInput, validTestContent } from '../helpers/recommendation-fixture';

test('portrait reading grounds concise language in the computed answer pattern', () => {
  const fixture = goldenCases[2]!;
  const score = scoreAssessment(config, fixture.profile, Object.fromEntries(fixture.answers.map(a => [a.question_id, a.answer === null ? '' : String(a.answer)])));
  const portrait = calculatePortrait(score, portraitMapping)!;
  const text = portraitReading(portrait);
  expect(text).toContain('Policies and commitments lead your answers, followed by tracking and recording.');
  expect(text).toContain('You answered');
  const empty = scoreAssessment(config, fixture.profile, {});
  const noEvidence = portraitReading(calculatePortrait(empty, portraitMapping)!);
  expect(noEvidence).toContain('still coming into focus');
  expect(noEvidence).not.toContain('also');
  expect(noEvidence).not.toContain('Tracking or supplying figures');
  const onlyCommit = Object.fromEntries(fixture.answers.filter(a => portraitMapping.rows.find(r => r.question_id === a.question_id)?.family === 'commit').map(a => [a.question_id, a.answer === null ? '' : String(a.answer)]));
  const partial = scoreAssessment(config, fixture.profile, onlyCommit);
  expect(portraitReading(calculatePortrait(partial, portraitMapping)!)).not.toContain('also');
});

test('portrait advice reuses only available matching recommendation output and never changes the portrait', async () => {
  const result = await createRecommendationService({ loadConfig: () => config, provider: { id: 'openai', model: 'test-existing-double', kind: 'live', generate: async () => JSON.stringify(validTestContent()) } })(recommendationInput);
  if (result.status !== 'available') throw new Error('Existing recommendation fixture unavailable');
  const version = { configVersion: result.identity.configVersion, methodVersion: result.identity.methodVersion };
  const view = { phase: 'available' as const, result };
  expect(portraitAdvice(view, result.identity.inputId, version)).toBe([...result.content.priority_recommendations].sort((a,b)=>a.priority_rank-b.priority_rank)[0]!.title);
  expect(portraitAdvice(view, 'changed-answers-or-context', version)).toBeNull();
  expect(portraitAdvice(view, null, version)).toBeNull();
  expect(portraitAdvice({ ...view, phase: 'loading' }, result.identity.inputId, version)).toBeNull();
  expect(portraitAdvice(view, result.identity.inputId, { ...version, configVersion: 'changed' })).toBeNull();
  expect(portraitAdvice(view, result.identity.inputId, { ...version, methodVersion: 'changed' })).toBeNull();
});

import subtypeDefinitions from '../../config/portraits/portrait_subtypes_v0.2.json';
import { selectPortraitSubtype } from '../../src/application/portrait-subtype';

test('paired portraits cover all twenty ordered pairs without changing the base portrait or Lever', () => {
  const fixture = goldenCases[2]!;
  const score = scoreAssessment(config, fixture.profile, Object.fromEntries(fixture.answers.map(a => [a.question_id, String(a.answer ?? '')])));
  const base = calculatePortrait(score, portraitMapping)!;
  const levers = selectImprovementLevers(config, score).levers;
  expect(subtypeDefinitions.subtypes).toHaveLength(20);
  expect(new Set(subtypeDefinitions.subtypes.map(s => s.subtype_id)).size).toBe(20);
  for (const first of PORTRAIT_FAMILIES) for (const second of PORTRAIT_FAMILIES.filter(f => f !== first)) {
    const portrait = { ...base, strongest: first, families: base.families.map(f => ({ ...f, readable: true, mean: f.id === first ? .8 : f.id === second ? .6 : .2 })) };
    const before = JSON.stringify(portrait);
    const selected = selectPortraitSubtype(portrait)!;
    expect(selected.definition.strongest_family).toBe(first);
    expect(selected.definition.second_family).toBe(second);
    expect(selected.sharedLead).toBe(false);
    expect(selectPortraitSubtype(portrait)).toEqual(selected);
    expect(JSON.stringify(portrait)).toBe(before);
    expect(portraitLever(portrait.weakest, levers, portraitMapping)).toEqual(portraitLever(base.weakest, levers, portraitMapping));
  }
});

test('paired portraits use every eligible item, permit two low or zero families, and retain unknowns', () => {
  const fixture = goldenCases[0]!;
  const score = scoreAssessment(config, fixture.profile, { 'U-001': 'Yes', 'U-002': 'No' });
  const before = JSON.stringify(score);
  const portrait = calculatePortrait(score, portraitMapping)!;
  const commit = portrait.families.find(f => f.id === 'commit')!;
  expect(commit.mean).toBe(1 / commit.applicable);
  expect(commit.answered).toBe(1);
  expect(commit.readable).toBe(true);
  const pair = selectPortraitSubtype(portrait)!;
  expect(pair).not.toBeNull();
  expect(pair.second.mean).toBe(0);
  expect(pair.combined).toBe((pair.first.mean! + pair.second.mean!) / 2);
  expect(JSON.stringify(score)).toBe(before);
  expect(score.input.answers).toEqual({ 'U-001': 'Yes', 'U-002': 'No' });
  const zero = calculatePortrait(scoreAssessment(config, fixture.profile, { 'U-001': 'No', 'U-002': 'No' }), portraitMapping)!;
  expect(selectPortraitSubtype(zero)!.combined).toBe(0);
  expect(portraitReading(zero)).toContain('does not imply established practices');
  expect(portraitReading(zero)).not.toContain('setting commitments');
  const one = calculatePortrait(scoreAssessment(config, fixture.profile, { 'U-001': 'Yes' }), portraitMapping)!;
  expect(one.name).toBe('Portrait in progress');expect(selectPortraitSubtype(one)).toBeNull();
  expect(one.families.find(f => f.id === 'measure')!.mean).toBeNull();
  const empty = calculatePortrait(scoreAssessment(config, fixture.profile, {}), portraitMapping)!;
  expect(selectPortraitSubtype(empty)).toBeNull();
  expect(selectPortraitSubtype({ ...portrait, versions: { ...portrait.versions, rules: 'different' } })).toBeNull();
});

test('portrait ties use normalized weighted possible points only after exact percentage ties', () => {
  const fixture = goldenCases[2]!;
  const score = scoreAssessment(config, fixture.profile, Object.fromEntries(fixture.answers.map(a => [a.question_id, String(a.answer ?? '')])));
  const base = calculatePortrait(score, portraitMapping)!;
  const make = () => ({ ...base, families: base.families.map(f => ({ ...f, mean: .25, answered: 1, applicable: 8, readable: true, weightedPotential: 1 })) });
  const tied = make();
  expect(selectPortraitSubtype(tied)).toMatchObject({ sharedLead: true, definition: { subtype_id: 'A-CO-ME' } });
  tied.families.find(f => f.id === 'measure')!.weightedPotential = 3;
  tied.families.find(f => f.id === 'do')!.weightedPotential = 2;
  tied.families.find(f => f.id === 'commit')!.answered = 8;
  expect(selectPortraitSubtype(tied)?.definition.subtype_id).toBe('A-ME-DO');
  const near = make();near.families.find(f => f.id === 'engage')!.mean = .25 + Number.EPSILON;
  near.families.find(f => f.id === 'measure')!.weightedPotential = 100;
  expect(selectPortraitSubtype(near)).toMatchObject({ sharedLead: false, definition: { subtype_id: 'A-EN-ME' } });
  const second = make();second.families.find(f => f.id === 'commit')!.mean = .5;
  second.families.find(f => f.id === 'plan')!.weightedPotential = 2;
  expect(selectPortraitSubtype(second)?.definition.subtype_id).toBe('A-CO-PL');
  second.families.find(f => f.id === 'plan')!.readable = false;
  expect(selectPortraitSubtype(second)?.definition.subtype_id).toBe('A-CO-ME');
  const potential = withPortraitPotential(config, score).portraitPotential;
  const empty = withPortraitPotential(config, scoreAssessment(config, fixture.profile, {}));
  expect(empty.portraitPotential).toEqual(potential); // Unanswered items never inflate category shares.
  for (const category of score.categories) {
    const total = score.trace.filter(t => t.category === category.category).reduce((sum, t) => sum + potential[t.question_id]!, 0);
    if (score.trace.some(t => t.category === category.category)) expect(total).toBeCloseTo(category.weight * 100, 10);
  }
  expect(withPortraitPotential(config, score).rawOverall).toBe(score.rawOverall);
  expect(withPortraitPotential(config, score).trace).toBe(score.trace);
});

test('portrait maturity boundaries and hero mean use unrounded values', () => {
  for (const [value, label, dots] of [[0,'Emerging',1],[.5,'Emerging',1],[.5 + Number.EPSILON,'Growing',2],[.75,'Growing',2],[.75 + Number.EPSILON,'Mature',3],[1,'Mature',3]] as const) {
    expect(portraitMaturity(value)).toMatchObject({ label, dots });
  }
  const fixture = goldenCases[2]!;
  const base = calculatePortrait(scoreAssessment(config, fixture.profile, Object.fromEntries(fixture.answers.map(a => [a.question_id,String(a.answer ?? '')]))), portraitMapping)!;
  const portrait = { ...base, families: base.families.map(f => ({ ...f, mean: f.id === 'commit' ? .5 : f.id === 'measure' ? .265 : .1, readable: true })) };
  const pair = selectPortraitSubtype(portrait)!;
  expect(pair.combined).toBe(.3825);
  expect(portraitMaturity(pair.combined).label).toBe('Emerging');
});

test('paired portrait Golden observations are computed rather than tuned to supplied examples', () => {
  const observations = goldenCases.map(fixture => {
    const score = scoreAssessment(config, fixture.profile, Object.fromEntries(fixture.answers.map(a => [a.question_id, String(a.answer ?? '')])));
    const portrait = calculatePortrait(score, portraitMapping)!;
    const before = JSON.stringify(portrait);
    const pair = selectPortraitSubtype(portrait);
    expect(JSON.stringify(portrait)).toBe(before);
    if (pair) { expect(pair.first.mean).toBeGreaterThanOrEqual(0); expect(pair.second.mean).toBeGreaterThanOrEqual(0); expect(pair.second.readable).toBe(true); }
    return { archetype: portrait.name, subtype: pair?.definition.name ?? null, first: pair?.first.mean, second: pair?.second.mean };
  });
  console.log('Computed Golden portrait observations:', JSON.stringify(observations));
});
