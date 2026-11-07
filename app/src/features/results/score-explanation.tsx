import { displayAnswer } from "../../application/display-value";
import type { ScoreSummary } from "../../application/score-summary";
const display = (value: number | null) => value === null ? "Not scored" : value.toFixed(2);
// Presentation only: every operand, score and contribution is emitted by the engine.
export function ScoreExplanation({ score }: { score: ScoreSummary }) {
  return <details className="score-explanation">
    <summary>How this score was calculated</summary>
    <div className="explanation-body"><p className="text-small break-words">Configuration: {score.configVersion}. Method: {score.methodVersion}. Display values are rounded; calculations retain full precision. Lowest assessed categories compare answered questions only and are not a readiness classification.</p>
      <p>Each answered question is converted to a normalized score using its configured answer scale or metric benchmark. That score is multiplied by the question’s base weight and any matching context multiplier to produce earned points.</p>
      <p className="mt-4">Raw overall compares {display(score.earned)} earned points with {display(score.possible)} possible points. Category scores compare points within each category; the industry-weighted score combines those category scores using the configured industry weights.</p>
      <p className="mt-4 text-small text-muted">Missing answers contribute no earned or possible points. Missing categories remain unscored and their weights are not redistributed. Values below are rounded for reading only; technical detail and JSON retain calculation precision.</p>
      <h3 className="text-subheading mt-6">Question calculations</h3>
      <p className="mt-2 text-small text-muted">Open a question for its calculation. Technical detail is optional.</p>
      <ol className="trace-questions">
        {score.trace.map(row => <li key={row.question_id}>
          <details className="trace-question">
            <summary>{row.question_text}<span className="block text-small text-muted">{row.category} · {row.status === "scored" ? "Scored" : "Unanswered — not scored"}</span></summary>
            <div className="trace-body">
              <p className="break-words">Your answer: {row.raw_answer.trim() ? displayAnswer(row.raw_answer, row.response_type === "percent" ? "%" : row.status === "scored" ? row.benchmark?.record.unit : "") : "No answer"}</p>
              {row.status === "missing" ? <p className="mt-3">This question has no normalized score and contributes no earned or possible points.</p> : <>
                <dl className="trace-values">
                  <div><dt>Normalized score</dt><dd>{display(row.normalized_score)} / 100</dd></div>
                  <div><dt>Base weight</dt><dd>{display(row.base_weight)}</dd></div>
                  <div><dt>Context multiplier</dt><dd>{display(row.multiplier)}×</dd></div>
                  <div><dt>Earned / possible points</dt><dd>{display(row.final_score)} / {display(row.total_possible)}</dd></div>
                  <div><dt>Contribution to category score</dt><dd>{display(row.category_contribution.percentage_points)} percentage points</dd></div>
                  <div><dt>Contribution to industry-weighted score</dt><dd>{display(row.category_contribution.weighted_overall_points)} points</dd></div>
                </dl>
                <p className="text-small text-muted">{row.answer_scale ? "Normalization uses a configured answer scale." : "Normalization uses the configured metric benchmark: " + row.benchmark?.record.metric_name + "."}</p>
              </>}
              <details className="trace-technical"><summary>Technical detail</summary>
                <p className="text-small mt-3">Exact engine output. Benchmark source identifies canonical configuration, not independently verified external evidence.</p>
                <textarea readOnly rows={14} aria-label={"Calculation trace for " + row.question_id} value={JSON.stringify(row, null, 2)} />
              </details>
            </div>
          </details>
        </li>)}
      </ol>
      <details className="trace-technical"><summary>Scored assessment JSON</summary>
        <p className="text-small mt-3">Current raw inputs and derived traces are separate in this record. It is recalculated when answers or context change; this is not a saved report.</p>
        <textarea readOnly rows={14} aria-label="Scored assessment JSON record" value={JSON.stringify(score, null, 2)} />
      </details>
    </div>
  </details>;
}
