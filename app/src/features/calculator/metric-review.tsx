"use client";
import { displayAnswer, sourceLabel } from "../../application/display-value";
import { useState } from "react";
import { useAssessment } from "../assessment/assessment-context";
import { calculatorMappings, displayCalculatorNumber } from "../../application/calculator-mapping";
import { calculateDraft, type CalculatorDraft } from "../../application/calculator";

export function MetricReview({ draft, saveCalculator }: { draft: CalculatorDraft; saveCalculator: () => string | null }) {
  const { session, questions, startCalculator } = useAssessment();
  const mappings = calculatorMappings(draft, questions);
  const [selected, setSelected] = useState<string[]>(() => mappings.filter(row => row.raw !== null && !session.answers[row.questionId]?.trim()).map(row => row.questionId));
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return <section className="mt-6" aria-label="Questionnaire metric mapping">
    <h3 className="text-subheading">Use confirmed values in your questionnaire</h3>
    <p className="mt-3 text-muted">Review the metric, unit and destination below. Only selected values transfer. Existing answers are unchecked: select one explicitly to replace it. Confirmed calculator answers remain editable in Review and are not asked again during forward navigation. Scoring is unchanged.</p>
    <ul className="mt-4 grid gap-3">{mappings.map(row => <li key={row.questionId} className="rounded-lg border border-line p-4 min-w-0">
      <label className="flex items-start gap-3"><input type="checkbox" disabled={row.raw === null} checked={selected.includes(row.questionId)} onChange={e => { setError(null); setSelected(ids => e.target.checked ? [...ids, row.questionId] : ids.filter(id => id !== row.questionId)); }} /><span className="min-w-0 break-words"><span className="field-label">{row.questionId}: {row.title}</span><span className="block text-small">{row.raw === null ? "Unknown" : displayCalculatorNumber(Number(row.raw), row.unit)} {row.raw === null ? "" : row.unit}</span>{row.reason && <span className="block text-small text-muted">{row.reason}</span>}{session.answers[row.questionId]?.trim() && <span className="block text-small">Current answer: {displayAnswer(session.answers[row.questionId]!, row.unit)} — select to replace.</span>}</span></label><details className="mt-2 text-small text-muted"><summary className="text-link">Mapping identity</summary>{row.questionId} · {row.metricId} · {row.unit}</details>
    </li>)}</ul>
    <label className="mt-4 flex items-start gap-3"><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} /><span>I confirm the selected values cover this business and annual reporting period, with matching revenue and source boundaries. I have reviewed the source breakdown and any historical-factor limitations; these remain reference estimates.</span></label>
    <button type="button" className="button-primary mt-4" disabled={!confirmed || selected.length === 0} onClick={() => setError(startCalculator(draft, selected, confirmed, saveCalculator))}>Use selected values and start questionnaire</button>
    {error && <p role="alert" className="form-error mt-3">{error}</p>}
  </section>;
}
export function CalculatorProvenance({ questionId }: { questionId?: string }) {
  const { session, questions } = useAssessment();
  const transfer = session.calculatorTransfer;
  if (!transfer || !transfer.questionIds.length || (questionId && !transfer.questionIds.includes(questionId))) return null;
  const result = calculateDraft(transfer.draft).result;
  if (!result) return null;
  const rows = calculatorMappings(transfer.draft, questions).filter(row => transfer.questionIds.includes(row.questionId) && (!questionId || row.questionId === questionId));
  return <details className="mt-3 text-small"><summary className="text-link">Confirmed calculator values and source details</summary>
    <p>{result.periodStart} to {result.periodEnd} · {result.methodVersion} · {result.factorVersion}</p>
    <ul>{rows.map(row => <li key={row.questionId}>{row.questionId} · {row.metricId}: {row.raw === null ? "Unknown" : displayAnswer(row.raw, row.unit)}</li>)}</ul>
    <p>Historical factors remain reference-only, not production-approved or globally applicable. You can correct an answer manually; that answer then becomes independent of calculator edits.</p>
    <ul>{result.traces.map(t => <li key={t.id} className="mt-2 break-words">{sourceLabel(t)}: {t.quantity ?? "Unknown"} {t.unit}. {t.expression} {t.kind === "water" && "Water withdrawal: " + t.water + " m3."} {t.factor && t.factor.id + " · " + t.factor.cell + " · " + t.factor.source_label + " · " + t.factor.geography + " · validity year unverified."} Evidence: {t.evidence || "Not supplied"}</li>)}</ul>
  </details>;
}
