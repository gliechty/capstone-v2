import type { ScoreInput, ScoreSummary } from "./score-summary";
export type ScoreView = { status: "loading" } | { status: "unavailable"; message: string } | { status: "ready"; score: ScoreSummary };
export interface ScoreSnapshot { input: ScoreInput | null; message: string }
// Orchestrates freshness only. It never normalizes or calculates a score.
export function createScoreRefresh(read: () => ScoreSnapshot, request: (input: ScoreInput, signal: AbortSignal) => Promise<ScoreSummary>, publish: (view: ScoreView) => void) {
  let generation = 0;
  let key: string | undefined;
  let controller: AbortController | undefined;
  function refresh(force = false) {
    const snapshot = read();
    const nextKey = JSON.stringify(snapshot);
    if (!force && key === nextKey) return;
    key = nextKey;
    controller?.abort();
    controller = new AbortController();
    const current = ++generation;
    publish({ status: "loading" });
    if (!snapshot.input) { publish({ status: "unavailable", message: snapshot.message }); return; }
    void request(snapshot.input, controller.signal).then(score => {
      if (current !== generation) return;
      if (JSON.stringify(read()) !== nextKey) { refresh(true); return; }
      publish({ status: "ready", score });
    }).catch(error => {
      if (current !== generation) return;
      if (JSON.stringify(read()) !== nextKey) { refresh(true); return; }
      publish({ status: "unavailable", message: error instanceof Error ? error.message : "Scoring is unavailable. Return to your answers and try again." });
    });
  }
  function dispose() { generation++; controller?.abort(); key = undefined; }
  return { refresh, dispose, invalidate() { dispose(); publish({ status: "loading" }); } };
}
