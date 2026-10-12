"use client";
import Link from "next/link";
import { useEffect, useReducer, type CSSProperties } from "react";
import { browserSession, watchAssessmentSession } from "../../adapters/assessment-session";
import { selectedQuestions, type AssessmentCatalog } from "../../application/assessment-catalog";
import { marketValues } from "../../application/assessment-setup";
import { createAssessmentModel } from "../assessment/model";
import { catalogProfileErrors } from "../assessment/assessment-context";
import { createScoreRefresh, type ScoreView } from "../../application/score-refresh";
import { ScoreExplanation } from "./score-explanation";
import { requestAssessmentScore } from "../../adapters/assessment-scoring";
const display = (value: number | null) => value === null ? "Not scored" : value.toFixed(1);
export function ComputedScores({ catalog }: { catalog: AssessmentCatalog }) {
  const [view, dispatch] = useReducer((_state: ScoreView, next: ScoreView) => next, { status: "loading" });
  useEffect(() => {
    const model = createAssessmentModel(catalog.version, p => selectedQuestions(catalog, p), p => catalogProfileErrors(catalog, p));
    const storage = browserSession(model.sessionSchema);
    const refresh = createScoreRefresh(() => {
      const restored = storage.load();
      if (!restored.state || !["review", "boundary", "questions"].includes(restored.state.phase)) return { input: null,
        message: restored.warning ?? "No completed assessment context is available in this tab. Return to assessment to enter or review your answers." };
      const { profile: p, answers, configVersion } = restored.state;
      return { input: { configVersion, context: { industry: p.industry, companySize: p.companySize, location: p.location,
        targetMarkets: marketValues(p.targetMarket), targetBuyer: p.targetBuyer, businessGoal: p.businessGoal }, answers }, message: "" };
    }, requestAssessmentScore, dispatch);
    const unsubscribe = watchAssessmentSession(() => refresh.refresh(), () => refresh.refresh(true), () => refresh.invalidate());
    refresh.refresh();
    return () => { unsubscribe(); refresh.dispose(); };
  }, [catalog]);
  if (view.status === "loading") return <p className="mt-8" role="status">Calculating from this tab’s assessment answers…</p>;
  if (view.status === "unavailable") return <div className="mt-8"><h2 className="text-subheading">Scores unavailable</h2><p role="alert" className="mt-4">{view.message}</p><Link href="/assessment" className="text-link mt-4">Review assessment answers</Link></div>;
  const s = view.score;
  return <>
    <div className="score-summary">
      <div className="overall-scores">
        <h2 className="text-subheading">Calculated overall scores</h2>
        <dl className="score-values">{[{ label: "Raw overall score", value: s.rawOverall }, { label: "Industry-weighted score", value: s.weightedOverall }].map(score => <div key={score.label}>
          <dt className="text-small text-muted">{score.label}</dt><dd className="score-number">{display(score.value)}{score.value !== null && <span className="text-subheading"> / 100</span>}</dd>
        </div>)}</dl>
        <p className="text-small text-muted">{s.answered} answered · {s.missing} unanswered. Missing answers are excluded from earned and possible points; they are never filled with zero. Category weights are not redistributed when a category is unanswered.</p>
      </div>
      <figure className="category-comparison" aria-labelledby="category-caption">
        <figcaption id="category-caption" className="text-subheading">Calculated category scores</figcaption>
        <p className="mt-2 text-small text-muted">Same 0–100 scale for each category. Display rounded to one decimal.</p>
        <ul className="category-bars">{s.categories.map(c => <li key={c.category} style={{ "--bar-color": "var(--category-" + c.category.toLowerCase() + ")", "--bar-value": (c.percent ?? 0) + "%" } as CSSProperties}>
          <div className="flex justify-between gap-4"><span>{c.category}</span><span className="font-semibold">{display(c.percent)}{c.percent !== null && <span className="sr-only"> out of 100</span>}</span></div>
          {c.percent !== null && <div className="category-bar-track" aria-hidden="true"><span /></div>}
        </li>)}</ul>
      </figure>
    </div>
    <ScoreExplanation score={s} />
    <p className="mt-4 text-small text-muted break-words">Calculated from canonical configuration {s.configVersion}. Method: {s.methodVersion}. Research build; no certification or readiness classification is implied.</p>
  </>;
}
