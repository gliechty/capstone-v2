import type { AssessmentScore } from "../domain/scoring/score-assessment";
export type ScoreSummary = Pick<AssessmentScore, "configVersion" | "methodVersion" | "categories" | "answered" | "missing" | "rawOverall" | "weightedOverall">;
export interface ScoreInput {
  configVersion: string;
  context: { industry: string; companySize: string; location: string; targetMarkets: string[]; targetBuyer: string; businessGoal: string };
  answers: Record<string, string>;
}
