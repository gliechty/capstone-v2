"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Information } from "./evidence-controls";
import { useEffect, useReducer, type CSSProperties } from "react";
import { browserSession, watchAssessmentSession } from "../../adapters/assessment-session";
import { selectedQuestions, type AssessmentCatalog } from "../../application/assessment-catalog";
import { marketValues } from "../../application/assessment-setup";
import { createAssessmentModel } from "../assessment/model";
import { catalogProfileErrors } from "../assessment/assessment-context";
import { createScoreRefresh, type ScoreView } from "../../application/score-refresh";
import type { ScoreInput } from "../../application/score-summary";
import { ScoreExplanation } from "./score-explanation";
import { requestAssessmentScore } from "../../adapters/assessment-scoring";
const display = (value: number | null) => value === null ? "Not scored" : value.toFixed(1);
export function ComputedScores({ catalog }: { catalog: AssessmentCatalog }) {
  const router = useRouter();
  function reviewMissing() {
    const model=createAssessmentModel(catalog.version,p=>selectedQuestions(catalog,p),p=>catalogProfileErrors(catalog,p));
    const storage=browserSession(model.sessionSchema), state=storage.load().state;
    if(state && !storage.save(model.assessmentReducer(state,{type:"review-missing"})))router.push("/assessment");
  }
  const [view, dispatch] = useReducer((_state: ScoreView & { context?: ScoreInput["context"] }, next: ScoreView & { context?: ScoreInput["context"] }) => next, { status: "loading" });
  useEffect(() => {
    const model = createAssessmentModel(catalog.version, p => selectedQuestions(catalog, p), p => catalogProfileErrors(catalog, p));
    const storage = browserSession(model.sessionSchema);
    let context: ScoreInput["context"] | undefined;
    const refresh = createScoreRefresh(() => {
      context = undefined;
      const restored = storage.load();
      if (!restored.state || !["review", "boundary", "questions"].includes(restored.state.phase)) return { input: null,
        message: restored.warning ?? "No completed assessment context is available in this tab. Return to assessment to enter or review your answers." };
      const { profile: p, answers, configVersion } = restored.state;
      context = { industry: p.industry, companySize: p.companySize, location: p.location,
        targetMarkets: marketValues(p.targetMarket), targetBuyer: p.targetBuyer, businessGoal: p.businessGoal };
      return { input: { configVersion, context, answers }, message: "" };
    }, requestAssessmentScore, next => dispatch({ ...next, context }));
    const unsubscribe = watchAssessmentSession(() => refresh.refresh(), () => refresh.refresh(true), () => refresh.invalidate());
    refresh.refresh();
    return () => { unsubscribe(); refresh.dispose(); };
  }, [catalog]);
  if (view.status === "loading") return <p className="mt-8" role="status">Calculating from this tab’s assessment answers…</p>;
  if (view.status === "unavailable") return <div className="mt-8"><h2 className="text-subheading">Scores unavailable</h2><p role="alert" className="mt-4">{view.message}</p><Link href="/assessment" className="text-link mt-4">Review assessment answers</Link></div>;
  const s = view.score;
  return <>
    {view.context && <div className="context-strip" role="group" aria-label="Assessment context"><dl>{[["Industry",view.context.industry],["Size",view.context.companySize],["Target buyer",view.context.targetBuyer],["Target markets",view.context.targetMarkets.join(", ")],["Business goal",view.context.businessGoal]].filter(([,value])=>value).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>}
    <Information label="How context is used"><p>Recommendations use your business context and notes. Question selection uses industry, employee band, location and target markets. Industry sets category weights and helps resolve benchmarks. Configured matching rules can apply multipliers using industry, target markets, buyer and business goal. Notes do not change deterministic scores. Open the calculation details to see the rules actually applied.</p></Information>
    <div className="score-summary">
      <div className="overall-scores">
        <h2 className="text-subheading">Calculated overall scores</h2>
        <dl className="score-values">{[{ label: "Raw overall score", value: s.rawOverall }, { label: "Industry-weighted score", value: s.weightedOverall }].map(score => <div key={score.label}>
          <dt className="text-small text-muted">{score.label}</dt><dd className="score-number">{display(score.value)}{score.value !== null && <span className="text-subheading"> / 100</span>}</dd>
        </div>)}</dl>
        <p className="coverage-count">{s.answered} answered · {s.missing} unanswered</p>
        {s.missing > 0 && <p className="mt-3 text-small">Partial assessment: these scores describe supplied answers, not whole-company readiness. Unanswered items contribute neither earned nor possible points; unscored category weights are not redistributed.</p>}
      </div>
      <figure className="category-comparison" aria-labelledby="category-caption">
        <figcaption id="category-caption" className="text-subheading">Calculated category scores</figcaption>

        <ul className="category-bars">{s.categories.map(c => <li key={c.category} style={{ "--bar-color": "var(--category-" + c.category.toLowerCase() + ")", "--bar-value": (c.percent ?? 0) + "%" } as CSSProperties}>
          <div className="flex justify-between gap-4"><span>{c.category}</span><span className="font-semibold">{display(c.percent)}{c.percent !== null && <span className="sr-only"> out of 100</span>}</span></div>
          <p className="text-small text-muted">{s.trace.filter(q => q.category === c.category && q.status === "scored").length} answered · {s.trace.filter(q => q.category === c.category && q.status === "missing").length} unanswered</p>
          {c.percent !== null && <div className="category-bar-track" aria-hidden="true"><span /></div>}
        </li>)}</ul>
      </figure>
    </div>
    <div className="mt-6"><h2 className="text-subheading">Lowest assessed categories</h2><ul>{s.categories.filter(c => c.percent !== null).sort((a, b) => a.percent! - b.percent!).slice(0, 2).map(c => <li key={c.category}>{c.category}: {display(c.percent)} / 100</li>)}</ul></div>
    {s.missing > 0 && <div className="incomplete-notice"><p>Incomplete assessment · Unanswered items are unknown, not confirmed weaknesses.</p><button type="button" className="text-link" onClick={reviewMissing}>Review unanswered items</button></div>}
    <ScoreExplanation score={s} />

  </>;
}
