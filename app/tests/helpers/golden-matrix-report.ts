import { METHOD_VERSION } from "../../src/domain/scoring/score-assessment";
import { firstDivergence, matrixRow, type Comparison } from "./golden-comparison";

interface CaseIdentity { case: string; config: string }
interface ErrorRow extends CaseIdentity {
  method: string;
  status: "ERROR";
  diagnostic: { phase: "compareGolden"; name: string; message: string; stack?: string };
}
export type GoldenMatrixRow = (ReturnType<typeof matrixRow> & CaseIdentity & { status: "PASS" | "FAIL" }) | ErrorRow;

// Record before the caller's assertions; a thrown comparison is not a completed FAIL.
export function recordGoldenCase(matrix: GoldenMatrixRow[], identity: CaseIdentity, compare: () => Comparison): Comparison {
  const record = (row: GoldenMatrixRow) => {
    const index = matrix.findIndex(existing => existing.case === identity.case);
    if (index === -1) matrix.push(row);
    else matrix[index] = row;
  };
  try {
    const comparison = compare();
    record({ ...matrixRow(comparison), ...identity, status: firstDivergence(comparison) ? "FAIL" : "PASS" });
    return comparison;
  } catch (error) {
    record({ ...identity, method: METHOD_VERSION, status: "ERROR", diagnostic: {
      phase: "compareGolden",
      name: error instanceof Error ? error.name : "NonErrorThrow",
      message: error instanceof Error ? error.message : String(error),
      ...(error instanceof Error && error.stack ? { stack: error.stack } : {}),
    } });
    throw error;
  }
}
