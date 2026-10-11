import type { ScoreInput, ScoreSummary } from "../application/score-summary";
// HTTP is isolated from the UI and deterministic core. Only raw answers and
// selection/scoring context cross this boundary; no server persistence occurs.
export async function requestAssessmentScore(input: ScoreInput, signal: AbortSignal): Promise<ScoreSummary> {
  const response = await fetch("/api/assessment-score", { method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store", signal, body: JSON.stringify(input) });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "The score could not be calculated.");
  return body;
}
