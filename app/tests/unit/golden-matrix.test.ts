import { mkdirSync, writeFileSync } from "node:fs";
import { afterAll, expect, test } from "vitest";
import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { scoreAssessment } from "../../src/domain/scoring/score-assessment";
import { goldenCases } from "../helpers/legacy-scoring";
import { compareGolden, diagnostic, firstDivergence, goldenAnswers, matrixRow, stages, type Stage } from "../helpers/golden-comparison";
const { config } = loadCanonicalConfig();
const matrix: ReturnType<typeof matrixRow>[] = [];
afterAll(() => { mkdirSync("test-results", { recursive: true }); writeFileSync("test-results/golden-matrix.json", JSON.stringify({ config: config.version, rows: matrix }, null, 2)); });
for (const fixture of goldenCases) test(fixture.case_id + " stage-by-stage Golden matrix", () => {
  const comparison = compareGolden(config, fixture);
  matrix.push(matrixRow(comparison));
  const mismatch = firstDivergence(comparison);
  if (mismatch) throw new Error(diagnostic(comparison, mismatch));
  for (const stage of stages) expect(comparison.observations.some(o => o.stage === stage), stage).toBe(true);
});
test.each<Stage>(["selection", "benchmark", "normalization", "base weight", "multiplier", "question points", "category weight", "category totals", "category score", "overall"])(
  "diagnostics locate first divergence at %s before downstream errors", stage => {
    const fixture = goldenCases[1]!;
    const actual = structuredClone(scoreAssessment(config, fixture.profile, goldenAnswers(fixture)));
    const q = actual.questions.find(q => q.status === "scored" && q.normalization.benchmark)!;
    if (q.status !== "scored") throw new Error("Expected numeric fixture");
    const category = actual.categories.find(c => c.category === q.category)!;
    if (stage === "selection") actual.questions.reverse();
    if (stage === "benchmark") q.normalization.benchmark = { ...q.normalization.benchmark!, param_1: "123456" };
    if (stage === "normalization") q.normalization.value += 1;
    if (stage === "base weight") q.baseWeight += 1;
    if (stage === "multiplier") q.multiplier.rules = [{ ...config.MultiplierRules[0]!, rule_id: "diagnostic-only-rule" }];
    if (stage === "question points") q.earned += 1;
    if (stage === "category weight") category.weight += 0.01;
    if (stage === "category totals") category.earned += 1;
    if (stage === "category score") category.percent! += 1;
    actual.rawOverall! += 1; actual.weightedOverall! += 1; // downstream symptoms must not mask the earlier cause
    const comparison = compareGolden(config, fixture, actual);
    const first = firstDivergence(comparison)!;
    expect(first?.stage).toBe(stage);
    const detail = JSON.parse(diagnostic(comparison, first));
    expect(detail).toMatchObject({ case: fixture.case_id, config: config.version, method: actual.methodVersion, stage });
    expect(detail).toHaveProperty("expected"); expect(detail).toHaveProperty("actual");
    if (["benchmark", "normalization", "base weight", "multiplier", "question points"].includes(stage)) expect(detail.location).toBe(q.id);
    if (stage.startsWith("category")) expect(detail.location).toBe(category.category);
  });
