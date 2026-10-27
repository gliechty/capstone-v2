import type { ScoreInput, ScoreSummary } from "../application/score-summary";
import type { LeverSelection } from "../application/improvement-levers";
export async function requestImprovementLevers(input: ScoreInput, signal: AbortSignal): Promise<LeverSelection & { baseline: ScoreSummary }> {
  const response = await fetch("/api/assessment-levers", {
    method: "POST", headers: { "Content-Type": "application/json" },
    cache: "no-store", signal, body: JSON.stringify(input),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Improvement levers could not be loaded.");
  return body;
}
