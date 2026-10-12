import { expect, test } from "vitest";
import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { METHOD_VERSION } from "../../src/domain/scoring/score-assessment";
import { compareGolden, diagnostic, firstDivergence } from "../helpers/golden-comparison";
import { recordGoldenCase, type GoldenMatrixRow } from "../helpers/golden-matrix-report";
import { goldenCases } from "../helpers/legacy-scoring";

const { config } = loadCanonicalConfig();
const reference = compareGolden(config, goldenCases[0]!);
const identity = { case: reference.caseId, config: config.version };

test.each([new TypeError("Replay failed at benchmark lookup"), "Replay threw a string"])(
  "records a serializable ERROR before rethrowing the original exception: %s", error => {
    const matrix: GoldenMatrixRow[] = [];
    let caught: unknown;
    try {
      recordGoldenCase(matrix, identity, () => { throw error; });
    } catch (value) { caught = value; }
    expect(caught).toBe(error);
    expect(matrix).toHaveLength(1);
    const row = JSON.parse(JSON.stringify(matrix))[0];
    expect(row).toMatchObject({ ...identity, method: METHOD_VERSION, status: "ERROR", diagnostic: {
      phase: "compareGolden", name: error instanceof Error ? "TypeError" : "NonErrorThrow",
      message: error instanceof Error ? error.message : error,
    } });
    if (error instanceof Error) expect(row.diagnostic.stack).toBe(error.stack);
    expect(row).not.toHaveProperty("canonicalFullPrecision");
  },
);

test("a comparison FAIL remains a single FAIL when its diagnostic assertion throws", () => {
  const matrix: GoldenMatrixRow[] = [];
  const comparison = structuredClone(reference);
  comparison.observations[0]!.actual = "deliberate mismatch";
  expect(() => {
    const result = recordGoldenCase(matrix, identity, () => comparison);
    const mismatch = firstDivergence(result);
    if (mismatch) throw new Error(diagnostic(result, mismatch));
  }).toThrow('"stage": "selection"');
  expect(matrix).toHaveLength(1);
  expect(matrix[0]).toMatchObject({ ...identity, status: "FAIL", selection: "FAIL" });
});

test("keeps one row per SME through an exception and a successful retry", () => {
  const matrix: GoldenMatrixRow[] = [];
  const error = new Error("case-level comparison failure");
  for (const [index, fixture] of goldenCases.entries()) {
    const caseIdentity = { case: fixture.case_id, config: config.version };
    const compare = () => {
      if (index === 2) throw error;
      return { ...reference, caseId: fixture.case_id };
    };
    if (index === 2) expect(() => recordGoldenCase(matrix, caseIdentity, compare)).toThrow(error);
    else expect(recordGoldenCase(matrix, caseIdentity, compare).caseId).toBe(fixture.case_id);
  }
  const report = JSON.parse(JSON.stringify({ rows: matrix }));
  expect(report.rows.map((row: GoldenMatrixRow) => row.case)).toEqual(goldenCases.map(fixture => fixture.case_id));
  expect(report.rows.map((row: GoldenMatrixRow) => row.status)).toEqual(["PASS", "PASS", "ERROR", "PASS", "PASS"]);
  const recovered = { ...reference, caseId: goldenCases[2]!.case_id };
  expect(recordGoldenCase(matrix, { case: recovered.caseId, config: config.version }, () => recovered)).toBe(recovered);
  expect(matrix).toHaveLength(5);
  expect(matrix.map(row => row.case)).toEqual(goldenCases.map(fixture => fixture.case_id));
  expect(matrix.map(row => row.status)).toEqual(["PASS", "PASS", "PASS", "PASS", "PASS"]);
});
