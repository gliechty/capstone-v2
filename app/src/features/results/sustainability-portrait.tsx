'use client';
import { displayAnswer } from "../../application/display-value";
import Image from 'next/image';
import { useEffect, useReducer, useId, useContext } from 'react';
import mapping from '../../../config/portraits/portrait_family_mapping_v0.2.json';
import { calculatePortrait, portraitLabels, portraitLever, portraitMaturity, archetypes } from '../../application/sustainability-portrait';
import { selectPortraitSubtype } from '../../application/portrait-subtype';
import type { ScoreSummary } from '../../application/score-summary';
import type { ImprovementLever } from '../../application/improvement-levers';
import { requestImprovementLevers } from '../../adapters/assessment-levers';
import { RecommendationViewContext } from './recommendation-view-context';
import { portraitReading, portraitAdvice, portraitFamilyDefinitions } from '../../application/portrait-reading';
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

function Maturity({ value, label, showPercent = true }: { value: number; label: string; showPercent?: boolean }) {
  const level = portraitMaturity(value);
  const percent = new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value * 100);
  return <span className="portrait-maturity" role="group" aria-label={label + ' approach development: ' + level.label + (showPercent ? ', ' + percent + '%' : '') + ', ' + level.dots + ' of 3 dots'}>
    <span className="portrait-maturity-dots" aria-hidden="true">{[1, 2, 3].map(dot => <span key={dot} data-filled={dot <= level.dots} />)}</span>
    <span>{showPercent ? level.label + ' · ' + percent + '%' : 'Approach development · ' + level.label}</span>
  </span>;
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
function PortraitChart({ families, subtype }: { families: Portrait['families']; subtype: ReturnType<typeof selectPortraitSubtype> }) {
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
      <title id={titleId}>{'Approach profile, percent of total eligible credit. ' + description}</title>
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
        return <g key={f.id} data-family={f.id} data-readable={f.readable} data-pair-rank={subtype?.first.id === f.id ? 1 : subtype?.second.id === f.id ? 2 : undefined}>
          {f.readable && <circle cx={x} cy={y} r="4" className="portrait-chart-dot" />}
          <image href={'/portraits/arch-' + familyIcons[f.id] + '-small.svg'} x={lx! - 11} y={ly! - 31} width="22" height="22" aria-hidden="true" />
          <text x={lx} y={ly} textAnchor="middle" className="portrait-chart-label">{portraitLabels[f.id]}</text>
          <text x={lx} y={ly! + 21} textAnchor="middle" className="portrait-chart-value">{f.readable ? Math.round(f.mean! * 100) + '%' : '—'}</text>
        </g>;
      })}
    </svg>
    <figcaption><span>Each family percentage reflects questionnaire credit earned out of its total applicable credit. Unanswered questions lower these percentages.</span><span className="portrait-chart-scale">Outer edge 100%{!complete && ' · Gaps mean no eligible answers, not zero.'}</span></figcaption>
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
  const subtype = selectPortraitSubtype(portrait);
  const current = available?.identity === identity ? available : null;
  const next = current?.status === 'ready' ? portraitLever(portrait.weakest, current.levers, mapping) : null;
  return <section className="portrait-section" aria-labelledby="portrait-introduction-heading">
    <header className="portrait-introduction">
      <h2 id="portrait-introduction-heading" className="text-subheading">Your sustainability archetype</h2>
      <p>Every business approaches sustainability differently. MOSAIC combines your two strongest answer families—Commit, Measure, Plan, Do and Engage—into a visual portrait of your reported approach.</p>
      <p className="text-small">Your categories show what you address; your archetype shows how you approach it.</p>
    </header>
    <section className="portrait-card" aria-labelledby="portrait-heading" data-portrait={portrait.name} data-subtype={subtype?.definition.subtype_id}>
    <div className="portrait-overview"><div className="portrait-story"><div className="portrait-heading">
      {portrait.icon && <Image className={subtype ? 'portrait-role-art' : undefined} src={subtype ? '/portraits/roles/' + subtype.definition.artwork.split('/').at(-1) : '/portraits/arch-' + portrait.icon + '.svg'} alt="" width={72} height={72} unoptimized />}
      <div><p className="section-label">Sustainability portrait · Beta</p><h3 id="portrait-heading" className="text-heading">{subtype?.definition.name ?? portrait.name}</h3>
        {subtype && <p className="portrait-family-combination"><span aria-hidden="true">→ </span>{portraitLabels[subtype.first.id]} + {portraitLabels[subtype.second.id]}</p>}
        {!subtype && <p className="portrait-meaning">{meanings[portrait.name]}</p>}
      </div>
    </div>
    {subtype && <div className="portrait-development"><Maturity value={subtype.combined} label={subtype.definition.name} showPercent={false} /><p className="text-small text-muted">Based on questionnaire credit, not verified organizational maturity.</p></div>}
    <p className="portrait-personal">{portraitReading(portrait)}</p>
    {subtype && <div className="portrait-pair" aria-label="Leading approach families">
      {[subtype.first, subtype.second].map(family => <div key={family.id} className="portrait-pair-chip"><FamilyIcon family={family.id} /><span><strong>{portraitLabels[family.id]} · {archetypes[family.id]}</strong><small>{portraitFamilyDefinitions[family.id]}</small><Maturity value={family.mean!} label={archetypes[family.id]} /></span></div>)}
    </div>}
    {subtype?.sharedLead && <p className="text-small portrait-shared-lead">Shared lead: {portraitLabels[subtype.first.id]} and {portraitLabels[subtype.second.id]} are equal ({Math.round(subtype.first.mean! * 100)}%).</p>}
    {advice && <p className="portrait-advice">Your recommendation report suggests a next move: <a href="#actions" className="text-link">{advice}</a>.</p>}
    </div><PortraitChart families={portrait.families} subtype={subtype} /></div>
    <dl className="portrait-facts">
      <div><dt>Category strength</dt><dd>{portrait.strengths.length ? portrait.strengths.map(category => <span className="portrait-icon-label portrait-strength" key={category}>{categoryIcons[category] && <Image className="portrait-detail-icon" src={'/portraits/category-' + categoryIcons[category] + '-small.svg'} alt="" width={28} height={28} unoptimized />}{category}</span>) : 'Not assessed'}</dd><dd className="text-small text-muted">Highest existing category score{portrait.strengths.length > 1 ? 's (tied)' : ''}.</dd></div>
      <div><dt>Next approach to explore</dt><dd className="portrait-icon-label">{portrait.weakest && <FamilyIcon family={portrait.weakest} size={28} />}{portrait.weakest ? portraitLabels[portrait.weakest] : 'Not assigned yet'}</dd><dd className="text-small text-muted">{portrait.weakest ? 'A place to build on next.' : 'Answer an eligible question in two action families.'}</dd></div>
    </dl>
    {portrait.weakest && <div className="portrait-next"><h3 className="font-semibold portrait-icon-label">{next && <FamilyIcon family={next.family} />}{next?.label ?? 'Suggested Lever'}</h3>
      {!current ? <p role="status">Loading existing actual-answer Levers…</p> : current.status === 'unavailable' ? <p>Levers are unavailable. No action has been inferred.</p> : next ? <><p>{next.lever.title}</p><p className="text-small text-muted">{next.lever.id} · Family: {next.family === 'none' ? 'Unclassified' : next.family} · {displayAnswer(next.lever.actual, next.lever.unit)} → {displayAnswer(next.lever.best, next.lever.unit)}</p><a href="#improvement-levers" className="text-link">Explore this with Levers</a></> : <p>No eligible Lever is available from your supplied answers.</p>}
    </div>}
    <Information label="Why this archetype?">
      {subtype && <div className="portrait-subtype-explanation"><p>Combined approach-development credit: {new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(subtype.combined * 100)}% — the arithmetic mean of {portraitLabels[subtype.first.id]} and {portraitLabels[subtype.second.id]}.</p><p>{portraitLabels[subtype.first.id]} is the leading scored family in your current answers ({Math.round(subtype.first.mean! * 100)}%), and {portraitLabels[subtype.second.id]} is second ({Math.round(subtype.second.mean! * 100)}%). The two highest family percentages determine the pair, with no minimum percentage. Each needs at least one valid eligible answer. The combined percentage is their equal-weight average. This describes your answer pattern, not verified business practices.</p><p className="text-small">Subtype {subtype.definition.subtype_id} · rule version {subtype.ruleVersion}. Equal full-precision percentages use higher possible industry-weighted points, then the fixed family order. No near-tie margin is applied.</p></div>}
      <p>Families describe <strong>how</strong> you approach sustainability. Categories—People, Governance, Community and Resources—describe <strong>what</strong> a question concerns. They are separate dimensions: there is no one-to-one mapping, and a high category score does not assign an archetype. Category weights break equal family-percentage ties; category scores do not determine the family percentages.</p>
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
    })() : 'Answer an eligible question in at least two action families to reveal a paired portrait.'}</p>

      <p className="mt-3">The short reading uses fixed wording and your computed answer pattern. When a recommendation for this exact assessment is available, its leading action title is included and linked; it does not change the archetype. No separate AI reading is generated.</p>
      <p>Archetypes describe relative patterns in supplied answers, not certification, verified measurement or whole-company readiness. The maturity dots describe assessment credit only: Emerging is 0–50%, Growing is above 50% through 75%, and Mature is above 75%. Thresholds use unrounded values. The hero uses the arithmetic mean of its two constituent percentages.</p>
    <ul className="portrait-families" aria-label="Family coverage and input basis">{portrait.families.map(family => <li key={family.id}>
      <span className="font-semibold portrait-icon-label"><FamilyIcon family={family.id} />{portraitLabels[family.id]}</span>
      <span>{!family.assessed ? 'Not assessed in this question set' : !family.readable ? 'No eligible answers yet' : Math.round(family.mean! * 100) + '% of total eligible credit'}</span>
      <span className="text-small text-muted">{family.answered}/{family.applicable} eligible answers · Input basis: {family.inputBasis}</span>
    </li>)}</ul>

      <p>Beta interpretation rules: each eligible question has equal possible portrait credit. Earned credit is divided by ALL applicable eligible items, including unanswered ones. Missing and skipped items remain unanswered, contribute no earned credit, and reduce the percentage; they are not saved as zero answers. A family has a score after one valid eligible answer. Any two scored families produce a pair, even at 0%.</p>
      <p className="mt-3">For explicitly Measure-tagged numeric items, a valid figure—including zero—means only “figure supplied” and receives full portrait credit. It does not verify measurement or improve the sustainability score. Input basis describes origin only; absent origin records remain unknown.</p>
      <p className="mt-3">For equal family percentages, sum each eligible question’s maximum possible points divided by its category’s total possible points, multiplied by that category’s industry weight. Category totals include all selected questions, including unanswered and portrait-excluded questions. These weights affect ties only. An exact remaining tie uses Commit, Measure, Plan, Do, Engage. Category-strength ties are shown together. Suggested actions use only the existing actual-answer top five Levers; a fallback is labeled Overall top Lever. What-if values, recommendations and retrieved guidance never set the archetype or chart values.</p>
      {portrait.excludedNumeric.length > 0 && <p className="mt-3">Numeric interpretation deferred ({portrait.excludedNumeric.length} items); excluded from portrait means and coverage: {portrait.excludedNumeric.join(', ')}.</p>}
      {portrait.unclassified.length > 0 && <p className="mt-3">No family assigned; excluded from portrait means and coverage: {portrait.unclassified.join(', ')}.</p>}
      {portrait.families.map(family => <div key={family.id} className="mt-4"><h3 className="font-semibold portrait-icon-label"><FamilyIcon family={family.id} size={16} />{portraitLabels[family.id]} evidence</h3>{!family.evidence.length ? <p>No eligible supplied answers.</p> : <ul>{family.evidence.map(item => <li key={item.id}>{item.id} · {score.trace.find(row => row.question_id === item.id)?.category}: {item.title} — {item.numeric ? 'figure supplied' : Math.round(item.value * 100) + '% of best-answer credit'}; origin {item.origin}.</li>)}</ul>}</div>)}
      <p className="mt-4 text-small portrait-versions">Configuration {portrait.versions.config}; bank SHA-256 {portrait.versions.bankHash}; scoring {portrait.versions.method}; mapping {portrait.versions.mapping}; interpretation {portrait.versions.rules}; template {portrait.versions.template}. Computed from the current confirmed-answer snapshot; no saved portrait history is implied.</p>
    </Information>
    </section>
  </section>;
}
