'use client';
import Image from 'next/image';
import { useEffect, useReducer, useId, useContext } from 'react';
import mapping from '../../../config/portraits/portrait_family_mapping_v0.2.json';
import { calculatePortrait, portraitLabels, portraitLever } from '../../application/sustainability-portrait';
import type { ScoreSummary } from '../../application/score-summary';
import type { ImprovementLever } from '../../application/improvement-levers';
import { requestImprovementLevers } from '../../adapters/assessment-levers';
import { RecommendationViewContext } from './recommendation-view-context';
import { portraitReading, portraitAdvice } from '../../application/portrait-reading';
import { inputIdentityText } from '../../application/recommendations/identity';
import type { RecommendationRequest } from '../../application/recommendations/contracts';
import { browserInputHash } from '../../adapters/recommendation-client';
import { Information } from './evidence-controls';
const familyIcons: Record<string, string> = { commit: 'anchor', measure: 'chronicler', plan: 'navigator', do: 'steward', engage: 'partner' };
const categoryIcons: Record<string, string> = { People: 'people', Governance: 'governance', Community: 'community', Resources: 'resources' };
function FamilyIcon({ family, size = 20 }: { family: string; size?: number }) {
  const name = familyIcons[family];
  return name ? <Image className="portrait-detail-icon" src={'/portraits/arch-' + name + '-small.svg'} alt="" width={size} height={size} unoptimized /> : null;
}

type Portrait = NonNullable<ReturnType<typeof calculatePortrait>>;
const meanings: Record<string, string> = {
  Anchor: 'Policies and commitments lead your approach.',
  Chronicler: 'Tracking and documenting lead your approach.',
  Navigator: 'Targets and plans lead your approach.',
  Steward: 'Operational action leads your approach.',
  Partner: 'Working with others leads your approach.',
  Explorer: 'Your approach is still taking shape.',
  'Portrait in progress': 'More evidence will reveal your approach.',
};
function PortraitChart({ families }: { families: Portrait['families'] }) {
  const titleId = useId();
  const point = (index: number, value: number) => {
    const angle = -Math.PI / 2 + index * 2 * Math.PI / 5;
    return [180 + Math.cos(angle) * 103 * value, 170 + Math.sin(angle) * 103 * value];
  };
  const points = (value: number) => families.map((_, i) => point(i, value).join(',')).join(' ');
  const complete = families.every(f => f.readable);
  const labels = [[180, 40], [294, 128], [254, 291], [106, 291], [66, 128]];
  const description = families.map(f => portraitLabels[f.id] + ': ' + (f.readable ? Math.round(f.mean! * 100) + '%' : 'insufficient evidence')).join('; ');
  return <figure className="portrait-chart">
    <svg viewBox="0 0 360 340" role="img" aria-labelledby={titleId}>
      <title id={titleId}>{'Approach profile, percent of full answer credit. ' + description}</title>
      {[1, .75, .5, .25].map(level => <polygon key={level} points={points(level)} className={level === 1 ? 'portrait-chart-boundary' : 'portrait-chart-grid'} />)}
      {families.map((f, i) => { const [x, y] = point(i, 1); return <line key={f.id} x1="180" y1="170" x2={x} y2={y} className="portrait-chart-grid" />; })}
      {complete && <polygon data-portrait-shape="filled" points={families.map((f, i) => point(i, f.mean!).join(',')).join(' ')} className="portrait-chart-fill" />}
      {!complete && families.map((f, i) => {
        const next = (i + 1) % families.length;
        if (!f.readable || !families[next]!.readable) return null;
        const [x1, y1] = point(i, f.mean!), [x2, y2] = point(next, families[next]!.mean!);
        return <line key={f.id} x1={x1} y1={y1} x2={x2} y2={y2} className="portrait-chart-segment" />;
      })}
      {families.map((f, i) => {
        const [x, y] = point(i, f.mean ?? 0), [lx, ly] = labels[i]!;
        return <g key={f.id} data-family={f.id} data-readable={f.readable}>
          {f.readable && <circle cx={x} cy={y} r="4" className="portrait-chart-dot" />}
          <image href={'/portraits/arch-' + familyIcons[f.id] + '-small.svg'} x={lx! - 11} y={ly! - 31} width="22" height="22" aria-hidden="true" />
          <text x={lx} y={ly} textAnchor="middle" className="portrait-chart-label">{portraitLabels[f.id]}</text>
          <text x={lx} y={ly! + 21} textAnchor="middle" className="portrait-chart-value">{f.readable ? Math.round(f.mean! * 100) + '%' : '—'}</text>
        </g>;
      })}
    </svg>
    <figcaption>Full answer credit · outer edge 100%{!complete && <span>Gaps mean insufficient evidence, not zero.</span>}</figcaption>
  </figure>;
}

type LeverState = { identity: string; status: 'ready'; levers: ImprovementLever[] } | { identity: string; status: 'unavailable' };
export function SustainabilityPortrait({ score, sessionVersion, calculatorIds, input }: { input?: RecommendationRequest; score: ScoreSummary; sessionVersion: string; calculatorIds: readonly string[] }) {
  const portrait = calculatePortrait(score, mapping, calculatorIds);
  const recommendationView = useContext(RecommendationViewContext);
  const requestIdentity = input ? inputIdentityText(input) : '';
  const [hashed, setHashed] = useReducer((_old: { identity: string; hash: string } | null, next: { identity: string; hash: string }) => next, null);
  useEffect(() => {
    let active = true;
    if (requestIdentity) void browserInputHash(requestIdentity).then(hash => { if (active) setHashed({ identity: requestIdentity, hash }); }).catch(() => { /* A missing identity omits advice, never blocks the portrait. */ });
    return () => { active = false; };
  }, [requestIdentity]);
  const advice = portraitAdvice(recommendationView, hashed?.identity === requestIdentity ? hashed.hash : null, score);
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
    <div className="portrait-overview"><div className="portrait-story"><div className="portrait-heading">
      {portrait.icon && <Image src={'/portraits/arch-' + portrait.icon + '.svg'} alt="" width={72} height={72} unoptimized />}
      <div><p className="section-label">Sustainability portrait · Beta</p><h2 id="portrait-heading" className="text-heading">{portrait.name}</h2>
        <p className="portrait-meaning">{meanings[portrait.name]}</p>
      </div>
    </div>
    <p className="portrait-personal">{portraitReading(portrait, score.input.profile)}</p>
    {advice && <p className="portrait-advice">Your recommendation report suggests a next move: <a href="#actions" className="text-link">{advice}</a>.</p>}
    <p className="portrait-caption text-small">Your reported approach · Separate from your sustainability score</p>
    </div><PortraitChart families={portrait.families} /></div>
    <dl className="portrait-facts">
      <div><dt>Category strength</dt><dd>{portrait.strengths.length ? portrait.strengths.map(category => <span className="portrait-icon-label portrait-strength" key={category}>{categoryIcons[category] && <Image className="portrait-detail-icon" src={'/portraits/category-' + categoryIcons[category] + '-small.svg'} alt="" width={28} height={28} unoptimized />}{category}</span>) : 'Not assessed'}</dd><dd className="text-small text-muted">Highest existing category score{portrait.strengths.length > 1 ? 's (tied)' : ''}.</dd></div>
      <div><dt>Next approach to explore</dt><dd className="portrait-icon-label">{portrait.weakest && <FamilyIcon family={portrait.weakest} size={28} />}{portrait.weakest ? portraitLabels[portrait.weakest] : 'Not assigned yet'}</dd><dd className="text-small text-muted">{portrait.weakest ? 'A place to build on next.' : 'Fewer than three families are readable.'}</dd></div>
    </dl>
    {portrait.weakest && <div className="portrait-next"><h3 className="font-semibold portrait-icon-label">{next && <FamilyIcon family={next.family} />}{next?.label ?? 'Suggested Lever'}</h3>
      {!current ? <p role="status">Loading existing actual-answer Levers…</p> : current.status === 'unavailable' ? <p>Levers are unavailable. No action has been inferred.</p> : next ? <><p>{next.lever.title}</p><p className="text-small text-muted">{next.lever.id} · Family: {next.family === 'none' ? 'Unclassified' : next.family} · {next.lever.actual} → {next.lever.best}</p><a href="#improvement-levers" className="text-link">Explore this with Levers</a></> : <p>No eligible Lever is available from your supplied answers.</p>}
    </div>}
    <Information label="Why this archetype?">
      <p>Families describe <strong>how</strong> you approach sustainability. Categories—People, Governance, Community and Resources—describe <strong>what</strong> a question concerns. They are separate dimensions: there is no one-to-one mapping, and a high category score does not assign an archetype. No statistical correlation between them has been established.</p>
      <p className="mt-3">Each question has a versioned family tag based on its meaning, alongside its answer scale. Clear cases use simple rules; remaining cases were tagged with a small model and spot-checked. Tags are fixed before your answers are read, not chosen to produce a particular portrait. A number is not automatically Measure; items without a suitable interpretation are excluded.</p>
      <dl className="portrait-tag-key">
        <div><dt className="portrait-icon-label"><FamilyIcon family="commit" />Commit → Anchor</dt><dd>Policies, promises and formal commitments.</dd></div>
        <div><dt className="portrait-icon-label"><FamilyIcon family="measure" />Measure → Chronicler</dt><dd>Tracking, recording, reporting and supplying relevant figures.</dd></div>
        <div><dt className="portrait-icon-label"><FamilyIcon family="plan" />Plan → Navigator</dt><dd>Targets, risk assessment and plans for change.</dd></div>
        <div><dt className="portrait-icon-label"><FamilyIcon family="do" />Do → Steward</dt><dd>Putting practices and programmes into operation.</dd></div>
        <div><dt className="portrait-icon-label"><FamilyIcon family="engage" />Engage → Partner</dt><dd>Working with suppliers, communities or other stakeholders.</dd></div>
      </dl>
      <p>For example, an environmental policy and a labour-rights policy can both be Commit, while belonging to Governance and People respectively. A question about tracking energy is Measure within Resources.</p>
    <p className="text-small">{portrait.strongest ? (() => {
      const family = portrait.families.find(f => f.id === portrait.strongest)!;
      return 'In your answers, ' + portraitLabels[family.id] + ' leads at ' + Math.round(family.mean! * 100) + '% credit, based on ' + family.answered + ' of ' + family.applicable + ' eligible answers.';
    })() : portrait.readable < 3 ? 'Answer more questions across at least three approach areas to reveal a portrait.' : 'Your readable areas are below the provisional 50% strength floor.'}</p>

      <p className="mt-3">The short reading uses fixed wording, your answer pattern and buyer/market context. When a recommendation for this exact assessment is available, its leading action title is included and linked; it does not change the archetype. No separate AI reading is generated.</p>
      <p>Archetypes describe relative patterns in supplied answers, not certification, verified measurement or whole-company readiness.</p>
    <ul className="portrait-families" aria-label="Family coverage and input basis">{portrait.families.map(family => <li key={family.id}>
      <span className="font-semibold portrait-icon-label"><FamilyIcon family={family.id} />{portraitLabels[family.id]}</span>
      <span>{!family.assessed ? 'Not assessed in this question set' : !family.readable ? 'Not enough answers' : Math.round(family.mean! * 100) + '% of best-answer credit'}</span>
      <span className="text-small text-muted">{family.answered}/{family.applicable} eligible answers · Input basis: {family.inputBasis}</span>
    </li>)}</ul>

      <p>Beta interpretation rules: each family uses the equal-weight mean of normalized eligible answered items. Skipped and missing answers are unknown, never low answers. A family needs at least two applicable items and answers for at least half; a portrait needs three readable families. The provisional strength floor is 50%.</p>
      <p className="mt-3">For explicitly Measure-tagged numeric items, a valid figure—including zero—means only “figure supplied” and receives full portrait credit. It does not verify measurement or improve the sustainability score. Input basis describes origin only; absent origin records remain unknown.</p>
      <p className="mt-3">Ties use more answered items, then Commit, Measure, Plan, Do, Engage. Category-strength ties are shown together. Suggested actions use only the existing actual-answer top five Levers; a fallback is labeled Overall top Lever. What-if values, recommendations and retrieved guidance never set the archetype or chart values.</p>
      {portrait.excludedNumeric.length > 0 && <p className="mt-3">Numeric interpretation deferred ({portrait.excludedNumeric.length} items); excluded from portrait means and coverage: {portrait.excludedNumeric.join(', ')}.</p>}
      {portrait.unclassified.length > 0 && <p className="mt-3">No family assigned; excluded from portrait means and coverage: {portrait.unclassified.join(', ')}.</p>}
      {portrait.families.map(family => <div key={family.id} className="mt-4"><h3 className="font-semibold portrait-icon-label"><FamilyIcon family={family.id} size={16} />{portraitLabels[family.id]} evidence</h3>{!family.evidence.length ? <p>No eligible supplied answers.</p> : <ul>{family.evidence.map(item => <li key={item.id}>{item.id} · {score.trace.find(row => row.question_id === item.id)?.category}: {item.title} — {item.numeric ? 'figure supplied' : Math.round(item.value * 100) + '% of best-answer credit'}; origin {item.origin}.</li>)}</ul>}</div>)}
      <p className="mt-4 text-small portrait-versions">Configuration {portrait.versions.config}; bank SHA-256 {portrait.versions.bankHash}; scoring {portrait.versions.method}; mapping {portrait.versions.mapping}; interpretation {portrait.versions.rules}; template {portrait.versions.template}. Computed from the current confirmed-answer snapshot; no saved portrait history is implied.</p>
    </Information>
  </section>;
}
