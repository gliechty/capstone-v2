import { readFileSync, readdirSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import type { CanonicalConfig } from "../../src/domain/config/types";
import type { ScoringProfile } from "../../src/domain/scoring/score-assessment";
const root = "../BUILD_PACK/07_GOLDEN_TESTS/";
export interface GoldenCase {
  case_id: string; profile: ScoringProfile & Record<string, unknown>;
  expected_question_ids: string[]; answers: { question_id: string; answer: string | number | null }[];
}
export const goldenCases: GoldenCase[] = readdirSync(root + "sme_cases").filter(f => f.endsWith(".json")).map(f => JSON.parse(readFileSync(root + "sme_cases/" + f, "utf8")));
export function goldenExpected(fixture: GoldenCase) {
  return JSON.parse(readFileSync(root + "expected_outputs/" + fixture.case_id + "_expected.json", "utf8"));
}
// Test-only replay of the preserved, inspected AssessmentScoring object. Never
// bundled into the application. No network/storage capabilities enter the VM.
export function legacyScorer(config: CanonicalConfig, fixture: GoldenCase, fullPrecision = false) {
  const source = JSON.parse(readFileSync("../BUILD_PACK/02_LEGACY_APPSMITH/export/appsmith-sandboxes-v1-export-2026-10-02.json", "utf8"));
  const collections = source.actionCollectionList as { publishedCollection?: { name: string; body: string } }[];
  const body = collections.find(c => c.publishedCollection?.name === "AssessmentScoring")!.publishedCollection!.body;
  const p = fixture.profile;
  const globals: Record<string, unknown> = {};
  for (const name of ["AnswerScales", "MetricBenchmarks", "MultiplierRules", "CategoryWeights"] as const) globals[name] = { data: config[name] };
  for (const [name, value] of Object.entries({ ...p, target_market_1: p.target_market_region[0], target_market_2: p.target_market_region[1] })) {
    globals["dd_" + name] = { selectedOptionValue: value };
    globals["inp_" + name] = { text: value };
  }
  globals.appsmith = { store: { answers: Object.fromEntries(fixture.answers.map(a => [a.question_id, a.answer])) } };
  globals.API_Get_Questions = { data: { questions: fixture.expected_question_ids.map(id => config.QuestionBank.find(q => q.question_id === id)) } };
  const context = createContext(globals, { codeGeneration: { strings: false, wasm: false } });
  // Explicit diagnostic variant: remove only decimal formatting, inside this
  // isolated VM. This measures the authorized precision change independently.
  if (fullPrecision) runInContext("Number.prototype.toFixed = function () { return this.toString(); }", context, { timeout: 1000 });
  return runInContext("(" + body.replace("export default", "").replace(/;\s*$/, "") + ")", context, { timeout: 1000 });
}
