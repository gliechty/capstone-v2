"use client";
import { useReleaseCatalog } from "../assessment/release-boundary";
import { flushSync } from "react-dom";
import { displayAnswer } from "../../application/display-value";

import { useEffect, useMemo, useReducer, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { AssessmentCatalog } from "../../application/assessment-catalog";
import { selectedQuestions } from "../../application/assessment-catalog";
import { marketValues } from "../../application/assessment-setup";
import { createAssessmentModel } from "../assessment/model";
import { catalogProfileErrors } from "../assessment/assessment-context";
import { browserSession, watchAssessmentSession } from "../../adapters/assessment-session";
import { requestImprovementLevers } from "../../adapters/assessment-levers";
import { requestAssessmentScore } from "../../adapters/assessment-scoring";
import type { ImprovementLever, LeverSelection } from "../../application/improvement-levers";
import { decimalAnswer as plainDecimal } from "../../application/calculator-mapping";
import { ReportDownload } from "./report-download";
import type { RecommendationView } from "../../application/recommendations/controller";
import type { ScoreInput, ScoreSummary } from "../../application/score-summary";

export const LEVERS_DISCLAIMER = "Explore how different answers would affect your scores under the current assessment methodology. These scenarios do not change your submitted answers or predict verified environmental outcomes, implementation costs or feasibility.";
type Loaded = LeverSelection & { baseline: ScoreSummary };
type LoadView = { status: "loading" } | { status: "unavailable" } | { status: "error"; message: string } | { status: "ready"; data: Loaded; input: ScoreInput; identity: string };
const number = (v: number | null) => v === null ? "Not scored" : v.toFixed(2);
const delta = (v: number) => (v > 0 ? "+" : "") + v.toFixed(2);
const discrete = (lever: ImprovementLever) => lever.kind === "boolean" || lever.kind === "categorical";

export function ImprovementLevers({ catalog: initialCatalog, recommendationView }: { catalog: AssessmentCatalog; recommendationView: RecommendationView }) {
  const catalog = useReleaseCatalog(initialCatalog);
  const [retry, retryLoad] = useReducer((n: number) => n + 1, 0);
  const [view, publish] = useReducer((_v: LoadView, v: LoadView) => v, { status: "loading" });
  useEffect(() => {
    const model = createAssessmentModel(catalog.version, p => selectedQuestions(catalog, p), p => catalogProfileErrors(catalog, p));
    const storage = browserSession(model.sessionSchema);
    let last: string | undefined, current = 0, controller: AbortController | undefined;
    function read() {
      const state = storage.load().state;
      if (!state || !["questions", "review", "boundary"].includes(state.phase)) return null;
      const p = state.profile;
      return { identity: JSON.stringify([state.configVersion, p, state.answers]), input: {
        configVersion: state.configVersion, answers: state.answers,
        context: { industry: p.industry, companySize: p.companySize, location: p.location,
          targetMarkets: marketValues(p.targetMarket), targetBuyer: p.targetBuyer, businessGoal: p.businessGoal },
      } };
    }
    function refresh(force = false) {
      const snapshot = read();
      if (!force && snapshot?.identity === last) return;
      last = snapshot?.identity;
      const generation = ++current;
      controller?.abort(); controller = new AbortController();
      publish({ status: "loading" });
      if (!snapshot) { publish({ status: "unavailable" }); return; }
      void requestImprovementLevers(snapshot.input, controller.signal).then(data => {
        if (generation !== current) return;
        if (read()?.identity !== snapshot.identity) { refresh(true); return; }
        publish({ status: "ready", data, input: snapshot.input, identity: snapshot.identity });
      }).catch(error => {
        if (generation === current) publish({ status: "error", message: error instanceof Error ? error.message : "Levers are unavailable." });
      });
    }
    const stop = watchAssessmentSession(() => refresh(), () => refresh(true), () => {
      current++; controller?.abort(); last = undefined; publish({ status: "loading" });
    });
    refresh(true);
    return () => { current++; controller?.abort(); stop(); };
  }, [catalog, retry]);
  return <section id="improvement-levers" className="results-section levers-section" aria-labelledby="levers-title">
    <h2 id="levers-title" className="text-heading">Explore your improvement levers</h2>
    <p className="text-small levers-disclaimer">{LEVERS_DISCLAIMER}</p>
    {view.status === "loading" && <p role="status">Finding opportunities in your answered questions…</p>}
    {view.status === "unavailable" && <p>Review your saved assessment before exploring levers.</p>}
    {view.status === "error" && <div><p role="alert">{view.message} Your actual scores are unchanged.</p><button className="text-link" onClick={retryLoad}>Retry loading levers</button></div>}
    {view.status === "ready" && <LeverExplorer key={view.identity} data={view.data} input={view.input} catalog={catalog} recommendationView={recommendationView} />}
  </section>;
}

function inputError(lever: ImprovementLever, value: string): string | null {
  if (discrete(lever)) return lever.options.includes(value) ? null : "Choose a listed answer.";
  if (!/^\d+(\.\d+)?$/.test(value.trim()) || !Number.isFinite(Number(value))) return "Enter a non-negative decimal number.";
  if (Number(value) < lever.min || Number(value) > lever.max) return "Enter a value from " + lever.min + " to " + lever.max + " " + lever.unit + ".";
  return null;
}

function LeverExplorer({ data, input, catalog, recommendationView }: { data: Loaded; input: ScoreInput; catalog: AssessmentCatalog; recommendationView: RecommendationView }) {
  const { baseline, levers } = data;
  const initial = useMemo(() => Object.fromEntries(levers.map(l => [l.id, l.actual])), [levers]);
  const [values, setValues] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [retry, retryScore] = useReducer((n: number) => n + 1, 0);
  const [view, publish] = useReducer((_v: { key: string; score?: ScoreSummary; error?: string }, v: { key: string; score?: ScoreSummary; error?: string }) => v, { key: "", score: baseline });
  const identity = JSON.stringify(values);
  const errors = levers.map(l => inputError(l, values[l.id]!));
  const invalid = errors.some(Boolean);
  const actual = levers.every(l => values[l.id] === l.actual);
  useEffect(() => {
    if (actual || invalid) return;
    const abort = new AbortController();
    let current = true;
    const timer = setTimeout(() => {
      void requestAssessmentScore({ ...input, answers: { ...input.answers, ...values } }, abort.signal)
        .then(score => { if (current) publish({ key: identity, score }); })
        .catch(error => { if (current) publish({ key: identity, error: error instanceof Error ? error.message : "Scenario calculation failed." }); });
    }, 120);
    return () => { current = false; clearTimeout(timer); abort.abort(); };
  }, [input, values, identity, actual, invalid, retry]);
  const score = actual ? baseline : !invalid && view.key === identity ? view.score : undefined;
  const error = !actual && !invalid && view.key === identity ? view.error : undefined;
  const update = (id: string, value: string) => setValues(v => ({ ...v, [id]: value }));
  function keyMove(event: KeyboardEvent<HTMLInputElement>, lever: ImprovementLever) {
    if (!["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const forward = event.key === "ArrowRight" || event.key === "ArrowUp";
    if (discrete(lever)) {
      const current = lever.options.indexOf(values[lever.id]!);
      const index = event.key === "Home" ? 0 : event.key === "End" ? lever.options.length - 1 : Math.max(0, Math.min(lever.options.length - 1, current + (forward ? 1 : -1)));
      update(lever.id, lever.options[index]!);
    } else {
      const step = lever.kind === "percent" ? 1 : (lever.max - lever.min) / 100;
      const current = Number(values[lever.id]) || lever.min;
      const value = event.key === "Home" ? lever.min : event.key === "End" ? lever.max : Math.max(lever.min, Math.min(lever.max, current + (forward ? step : -step)));
      update(lever.id, plainDecimal(value));
    }
  }
  return <>
    <details className="lever-mapping"><summary>How these levers are selected</summary><p>Ranked by potential industry-weighted score improvement with all other answers fixed. Selection stays stable; combined scores are recalculated together. Recommendations prioritize contextual actions, while Levers rank mathematical score gains.</p></details>
    <div className="levers-layout">
    {levers.length === 0 && <p className="mt-4">No answered questions currently offer an eligible score improvement. Unanswered questions remain information gaps.</p>}
    <div className="lever-list">{levers.map((lever, index) => {
      const isDiscrete = discrete(lever), categorical = lever.kind === "categorical";
      const optionIndex = Math.max(0, lever.options.indexOf(values[lever.id]!));
      const sliderValue = isDiscrete ? optionIndex + (categorical ? 0.5 : 0) : Number(values[lever.id]);
      const min = isDiscrete ? 0 : lever.min;
      const max = categorical ? lever.options.length : isDiscrete ? lever.options.length - 1 : lever.max;
      const actualValue = isDiscrete ? lever.options.indexOf(lever.actual) + (categorical ? 0.5 : 0) : Number(lever.actual);
      const position = (n: number) => Math.max(0, Math.min(100, 100 * (n - min) / (max - min)));
      const before = position(actualValue), after = position(Number.isFinite(sliderValue) ? sliderValue : actualValue);
      return <article className="lever-card" key={lever.id}>
        <h3 id={"lever-title-" + lever.id} className="lever-question">{lever.title}</h3>
        <p className="lever-selected">Actual: {displayAnswer(lever.actual, lever.unit)} → Scenario: <strong>{values[lever.id] ? displayAnswer(values[lever.id]!, lever.unit) : "Not entered"}</strong></p>
        <div className="lever-track" style={{ "--actual": before + "%", "--change-start": Math.min(before, after) + "%", "--change-width": Math.abs(after - before) + "%" } as CSSProperties}>
        <div className="lever-track-base" aria-hidden="true"/><div className="lever-track-change" aria-hidden="true"/>
        <span className="lever-actual-marker" aria-hidden="true">Actual</span>
        <input type="range" className="lever-slider" aria-labelledby={"lever-title-" + lever.id}
          aria-describedby={"lever-help-" + lever.id} aria-valuetext={displayAnswer(values[lever.id]!, lever.unit)}
          min={isDiscrete ? 0 : lever.min} max={categorical ? lever.options.length : isDiscrete ? lever.options.length - 1 : lever.max}
          step="any" value={Number.isFinite(sliderValue) ? sliderValue : lever.min}
          onKeyDown={event => keyMove(event, lever)}
          onChange={event => {
            const n = Number(event.target.value);
            if (isDiscrete) update(lever.id, lever.options[Math.max(0, Math.min(lever.options.length - 1, categorical ? Math.floor(n) : Math.round(n)))]!);
            else update(lever.id, plainDecimal(lever.kind === "percent" ? Math.round(n) : n));
          }} />
        </div>
        {isDiscrete ? <div className="lever-options" style={{ "--option-count": lever.options.length } as CSSProperties}>{lever.options.map(option => <span key={option}>{option}</span>)}</div> :
          <label className="lever-value-label">Scenario value ({lever.unit})
            <input className="field-control" inputMode="decimal" type="text" maxLength={2000}
              aria-label={lever.id + " scenario value"} aria-invalid={Boolean(errors[index])} aria-describedby={errors[index] ? "lever-error-" + lever.id : undefined}
              value={editing === lever.id ? values[lever.id] : displayAnswer(values[lever.id]!, lever.unit, false)} onFocus={event => { flushSync(() => setEditing(lever.id)); event.currentTarget.select(); }} onBlur={() => setEditing(null)} onChange={event => update(lever.id, event.target.value)} />
          </label>}
        {errors[index] && <p role="alert" id={"lever-error-" + lever.id}>{errors[index]}</p>}
        <details className="lever-mapping"><summary>Keyboard help and technical details</summary>
        <p id={"lever-help-" + lever.id} className="text-small">{isDiscrete ? "Arrow keys move between the labeled answers." : lever.kind === "percent" ? "Slider: 1 percentage point per step. Enter a finer value in the field." : "Explore the range from your actual answer to the existing scoring target; use the field for an exact value."}</p>
        <p>{lever.category} · Potential weighted gain: {delta(lever.weightedGain)} points</p>
          <p>{lever.id}{lever.metricId && " · " + lever.metricId} · {lever.method}</p>
          {lever.benchmark && <p className="text-small">Benchmark: {lever.benchmark}</p>}
          <p>Best-scoring answer: {displayAnswer(lever.best, lever.unit)}. Independent raw overall gain: {delta(lever.rawGain)} points.</p>
          <ul>{lever.categoryGains.map(c => <li key={c.category}>{c.category}: {c.gain === null ? "Not scored" : delta(c.gain) + " points"}</li>)}</ul>
          {lever.note && <p className="mt-3">{lever.note}</p>}
        </details>
      </article>;
    })}
    {levers.length > 0 && <button type="button" className="text-link lever-reset" onClick={() => { setValues(initial); publish({ key: "", score: baseline }); }}>Reset to actual answers</button>}
    </div>
    <div className="lever-comparison" aria-busy={!score && !error && !invalid}>
      <h3 className="text-small">Industry-weighted overall</h3>
      <div className="lever-headline" aria-live="polite"><span><small>Actual</small>{number(baseline.weightedOverall)}</span><span aria-hidden="true">→</span><span><small>Hypothetical</small>{score ? number(score.weightedOverall) : "…"}</span><strong>{score && baseline.weightedOverall !== null && score.weightedOverall !== null ? delta(score.weightedOverall - baseline.weightedOverall) + " pts" : "Pending"}</strong></div>
      <div className="lever-category-bars">{baseline.categories.map(c => {
        const after = score?.categories.find(s => s.category === c.category)?.percent;
        return <div className="lever-category" key={c.category}><span>{c.category}</span><span>{number(c.percent)} → {after === undefined ? "…" : number(after)} ({c.percent === null || after == null ? "—" : delta(after - c.percent)})</span><div className="lever-bars" aria-hidden="true"><i style={{width: (c.percent ?? 0) + "%"}}/><b style={{width: (after ?? 0) + "%"}}/></div></div>;
      })}</div>
      <p className="text-small lever-raw">Raw overall: {number(baseline.rawOverall)} → {score ? number(score.rawOverall) : "Pending"}</p>
      {!score && <p role={error || invalid ? "alert" : "status"}>{invalid ? "Correct the highlighted values to calculate this scenario." : error || "Updating combined scenario…"}</p>}
      {error && <button className="text-link" onClick={retryScore}>Retry scenario calculation</button>}
      <details className="lever-score-details"><summary>Full score comparison</summary>
      {/* eslint-disable-next-line jsx-a11y-x/no-noninteractive-tabindex -- Scrollable score comparisons need keyboard focus. */}
      <div className="lever-table-scroll" tabIndex={0} role="region" aria-label="Score comparison table; scroll horizontally if needed"><table><caption className="sr-only">Actual and combined hypothetical scores, and change in percentage points</caption><thead><tr><th scope="col">Score</th><th scope="col">Actual</th><th scope="col">Hypothetical</th><th scope="col">Change</th></tr></thead>
        <tbody>{[
          { label: "Industry-weighted overall", before: baseline.weightedOverall, after: score?.weightedOverall },
          { label: "Raw overall", before: baseline.rawOverall, after: score?.rawOverall },
          ...baseline.categories.map(c => ({ label: c.category, before: c.percent, after: score?.categories.find(s => s.category === c.category)?.percent })),
        ].map(row => <tr key={row.label}><th scope="row">{row.label}</th><td>{number(row.before)}</td><td>{row.after === undefined ? "Pending" : number(row.after)}</td><td>{row.before === null || row.after == null ? "—" : delta(row.after - row.before)}</td></tr>)}</tbody></table></div></details>
      <div className="lever-report"><ReportDownload catalog={catalog} view={recommendationView} scenario={{ input, answers: values, levers }} disabled={!score || invalid}/><p className="text-small">Implementation may require time, expenditure and expertise; these are not estimated.</p></div>
    </div>
    </div>
    <div className="lever-mobile-report"><ReportDownload catalog={catalog} view={recommendationView} scenario={{ input, answers: values, levers }} disabled={!score || invalid}/><p className="text-small">Implementation may require time, expenditure and expertise; these are not estimated.</p></div>
    {data.excluded.length > 0 && <details className="mt-4"><summary>Questions outside this first release</summary><ul>{data.excluded.map(e => <li key={e.id}>{e.id}: {e.reason}</li>)}</ul></details>}
  </>;
}
