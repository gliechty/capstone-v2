'use client';
import Image from 'next/image';
import { useEffect, useReducer } from 'react';
import mapping from '../../../config/portraits/portrait_family_mapping_v0.2.json';
import { calculatePortrait, portraitLabels, portraitLever } from '../../application/sustainability-portrait';
import type { ScoreSummary } from '../../application/score-summary';
import type { ImprovementLever } from '../../application/improvement-levers';
import { requestImprovementLevers } from '../../adapters/assessment-levers';
import { Information } from './evidence-controls';
type LeverState = { identity: string; status: 'ready'; levers: ImprovementLever[] } | { identity: string; status: 'unavailable' };
export function SustainabilityPortrait({ score, sessionVersion, calculatorIds }: { score: ScoreSummary; sessionVersion: string; calculatorIds: readonly string[] }) {
  const portrait = calculatePortrait(score, mapping, calculatorIds);
  const identity = JSON.stringify([score.configVersion, score.methodVersion, score.input]);
  const [available, publish] = useReducer((_old: LeverState | null, next: LeverState) => next, null);
  useEffect(() => {
    const controller = new AbortController();
    const profile = score.input.profile;
    const request = { configVersion: sessionVersion, answers: score.input.answers, context: { industry: profile.industry, companySize: profile.employee_band,
      location: profile.company_location, targetMarkets: profile.target_market_region, targetBuyer: profile.target_buyer, businessGoal: profile.business_goal } };
    void requestImprovementLevers(request, controller.signal).then(data => {
      if (!controller.signal.aborted && JSON.stringify(data.baseline.input) === JSON.stringify(score.input)) publish({ identity, status: 'ready', levers: data.levers });
    }).catch(() => { if (!controller.signal.aborted) publish({ identity, status: 'unavailable' }); });
    return () => controller.abort();
  }, [identity, score.input, sessionVersion]);
  if (!portrait) return <section className="portrait-card" aria-label="Sustainability portrait"><h2 className="text-subheading">Portrait unavailable</h2><p>The portrait mapping does not match this assessment configuration. Your calculated scores are unchanged.</p></section>;
  const current = available?.identity === identity ? available : null;
  const next = current?.status === 'ready' ? portraitLever(portrait.weakest, current.levers, mapping) : null;
  return <section className="portrait-card" aria-labelledby="portrait-heading" data-portrait={portrait.name}>
    <div className="portrait-heading">
      {portrait.icon && <Image src={'/portraits/arch-' + portrait.icon + '.svg'} alt="" width={72} height={72} unoptimized />}
      <div><p className="section-label">Sustainability portrait · Beta</p><h2 id="portrait-heading" className="text-heading">{portrait.name}</h2>
        <p>{portrait.strongest ? portraitLabels[portrait.strongest] + ' is your strongest readable approach family.' : portrait.readable < 3 ? 'More answers are needed across at least three approach families.' : 'No readable approach family reaches the provisional strength floor.'}</p>
      </div>
    </div>
    <p className="portrait-caption">An interpretation of supplied answers, separate from your sustainability scores. It is not certification or verified measurement.</p>
    <dl className="portrait-facts">
      <div><dt>Category strength</dt><dd>{portrait.strengths.length ? portrait.strengths.join(' · ') : 'Not assessed'}</dd><dd className="text-small text-muted">Highest existing category score{portrait.strengths.length > 1 ? 's (tied)' : ''}.</dd></div>
      <div><dt>Next approach to explore</dt><dd>{portrait.weakest ? portraitLabels[portrait.weakest] : 'Not assigned yet'}</dd><dd className="text-small text-muted">{portrait.weakest ? 'Lowest mean among readable families.' : 'Fewer than three families are readable.'}</dd></div>
    </dl>
    {portrait.weakest && <div className="portrait-next"><h3 className="font-semibold">{next?.label ?? 'Suggested Lever'}</h3>
      {!current ? <p role="status">Loading existing actual-answer Levers…</p> : current.status === 'unavailable' ? <p>Levers are unavailable. No action has been inferred.</p> : next ? <><p>{next.lever.title}</p><p className="text-small text-muted">{next.lever.id} · Family: {next.family === 'none' ? 'Unclassified' : next.family} · {next.lever.actual} → {next.lever.best}</p><a href="#improvement-levers" className="text-link">Explore this with Levers</a></> : <p>No eligible Lever is available from your supplied answers.</p>}
    </div>}
    <ul className="portrait-families" aria-label="Family coverage and input basis">{portrait.families.map(family => <li key={family.id}>
      <span className="font-semibold">{portraitLabels[family.id]}</span>
      <span>{!family.assessed ? 'Not assessed in this question set' : !family.readable ? 'Not enough answers' : Math.round(family.mean! * 100) + '% of best-answer credit'}</span>
      <span className="text-small text-muted">{family.answered}/{family.applicable} eligible answers · Input basis: {family.inputBasis}</span>
    </li>)}</ul>
    <Information label="Why this portrait?">
      <p>Beta interpretation rules: each family uses the equal-weight mean of normalized eligible answered items. Skipped and missing answers are unknown, never low answers. A family needs at least two applicable items and answers for at least half; a portrait needs three readable families. The provisional strength floor is 50%.</p>
      <p className="mt-3">For explicitly Measure-tagged numeric items, a valid figure—including zero—means only “figure supplied” and receives full portrait credit. It does not verify measurement or improve the sustainability score. Input basis describes origin only; absent origin records remain unknown.</p>
      <p className="mt-3">Ties use more answered items, then Commit, Measure, Plan, Do, Engage. Category-strength ties are shown together. Suggested actions use only the existing actual-answer top five Levers; a fallback is labeled Overall top Lever. What-if values and retrieved guidance are never portrait inputs.</p>
      {portrait.excludedNumeric.length > 0 && <p className="mt-3">Numeric interpretation deferred ({portrait.excludedNumeric.length} items); excluded from portrait means and coverage: {portrait.excludedNumeric.join(', ')}.</p>}
      {portrait.unclassified.length > 0 && <p className="mt-3">No family assigned; excluded from portrait means and coverage: {portrait.unclassified.join(', ')}.</p>}
      {portrait.families.map(family => <div key={family.id} className="mt-4"><h3 className="font-semibold">{portraitLabels[family.id]} evidence</h3>{!family.evidence.length ? <p>No eligible supplied answers.</p> : <ul>{family.evidence.map(item => <li key={item.id}>{item.id}: {item.title} — {item.numeric ? 'figure supplied' : Math.round(item.value * 100) + '% of best-answer credit'}; origin {item.origin}.</li>)}</ul>}</div>)}
      <p className="mt-4 text-small portrait-versions">Configuration {portrait.versions.config}; bank SHA-256 {portrait.versions.bankHash}; scoring {portrait.versions.method}; mapping {portrait.versions.mapping}; interpretation {portrait.versions.rules}; template {portrait.versions.template}. Computed from the current confirmed-answer snapshot; no saved portrait history is implied.</p>
    </Information>
  </section>;
}
