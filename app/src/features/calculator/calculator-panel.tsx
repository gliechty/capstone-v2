"use client";
import { useEffect, useReducer, useRef, useState, type ReactNode } from "react";
import { browserCalculator, initialCalculatorSession, type CalculatorSession } from "../../adapters/calculator-session";
import { calculateDraft, referenceFactors, referenceVersion, type CalculatorDraft } from "../../application/calculator";
import { activityKinds, type ActivityKind, type CoverageKey } from "../../domain/calculator/types";
import { activityInCoverage, allowedFactorIds, calculatorUnits } from "../../domain/calculator/calculate";

type State = CalculatorSession & { ready: boolean; warning: string | null; showErrors: boolean };
type Action = { type: "restore"; state: CalculatorSession; warning: string | null } | { type: "edit"; draft: CalculatorDraft } | { type: "method"; method: CalculatorSession["method"] } | { type: "calculate"; valid: boolean } | { type: "warning"; warning: string | null };
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "restore": return { ...action.state, ready: true, showErrors: false, warning: action.warning };
    case "edit": return { ...state, draft: action.draft, reviewed: false, showErrors: false };
    case "method": return { ...state, method: action.method };
    case "calculate": return { ...state, reviewed: action.valid, priorReviewedDraft: action.valid && !state.reviewed ? state.lastReviewedDraft : state.priorReviewedDraft, lastReviewedDraft: action.valid ? state.draft : state.lastReviewedDraft, showErrors: true };
    case "warning": return { ...state, warning: action.warning };
  }
}
const labels: Record<ActivityKind, string> = { electricity: "Purchased electricity", gas: "Natural gas", fuel: "Liquid fuel", mileage: "Vehicle distance (alternative to fuel)", refrigerant: "Refrigerant top-up", heat: "Purchased heat", process: "Process activity", "measured-scope1": "Measured Scope 1 source (alternative method)", water: "Water withdrawal", waste: "Waste generated" };
const coverageLabels: Record<CoverageKey, string> = { scope1: "Scope 1 sources", scope2: "Scope 2 sources", energy: "Energy sources", water: "Water withdrawal sources", waste: "Waste streams" };
const supportedGeographies = [...new Set(referenceFactors.filter(f => allowedFactorIds("electricity", "kWh").includes(f.id)).map(f => f.geography))];
const display = (n: number | null) => n === null ? "Unknown" : new Intl.NumberFormat("en", { maximumSignificantDigits: 10 }).format(n);
function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="block field-label">{label}{hint && <span className="block text-small font-normal text-muted mb-2">{hint}</span>}{children}</label>;
}
function GeographyPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [search, setSearch] = useState("");
  const options = supportedGeographies.filter(g => g === value || g.toLowerCase().includes(search.trim().toLowerCase()));
  return <div className="grid gap-2"><Field label="Find a supported geography"><input className="field-control" type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search China or a province" /></Field><Field label="Electricity geography" hint="Choose a listed location; no global factor is assumed."><select className="field-control" value={supportedGeographies.includes(value) ? value : ""} onChange={e => onChange(e.target.value)}><option value="">Unknown / not listed</option>{options.map(g => <option key={g} value={g}>{g}</option>)}</select></Field>{options.length === 0 && <p className="text-small text-muted">No supported geography matches. Do not substitute another region's factor.</p>}</div>;
}
export function CalculatorPanel() {
  const [state, dispatch] = useReducer(reducer, { ...initialCalculatorSession(), ready: false, warning: null, showErrors: false });
  const firstSave = useRef(true);
  const feedback = useRef<HTMLDivElement>(null);
  useEffect(() => { const loaded = browserCalculator.load(); dispatch({ type: "restore", ...loaded }); }, []);
  useEffect(() => {
    if (!state.ready) return;
    if (firstSave.current) { firstSave.current = false; return; }
    const warning = browserCalculator.save({ draft: state.draft, method: state.method, reviewed: state.reviewed, lastReviewedDraft: state.lastReviewedDraft, priorReviewedDraft: state.priorReviewedDraft });
    if (warning) dispatch({ type: "warning", warning });
  }, [state.ready, state.draft, state.method, state.reviewed, state.lastReviewedDraft, state.priorReviewedDraft]);
  const { draft } = state;
  const previousInputs = state.reviewed ? state.priorReviewedDraft : state.lastReviewedDraft;
  const outcome = calculateDraft(draft);
  const result = state.reviewed ? outcome.result : null;
  const edit = (next: CalculatorDraft) => dispatch({ type: "edit", draft: next });
  const editSource = (index: number, patch: Partial<CalculatorDraft["activities"][number]>) => edit({ ...draft, activities: draft.activities.map((a,i) => i === index ? { ...a, ...patch } : a) });
  if (!state.ready) return <p role="status">Restoring data input entries...</p>;
  return <>
    {state.warning && <p className="form-error mt-4" role="alert">{state.warning}</p>}
    <fieldset className="mt-8 grid gap-4">
      <legend className="sr-only">Quantitative-data input method</legend>
      <label className="choice-option"><input type="radio" name="method" checked={state.method === "manual"} onChange={() => dispatch({ type: "method", method: "manual" })} /><span>Enter manually<span className="block text-small text-muted">Enter known values directly in the questionnaire. Scoring methodology is unchanged; existing questionnaire answers are preserved.</span></span></label>
      <label className="choice-option"><input type="radio" name="method" checked={state.method === "calculator"} onChange={() => dispatch({ type: "method", method: "calculator" })} /><span>Use emissions calculator (Beta — China grid factors)<span className="block text-small text-muted">Calculate and review quantities using explicit historical reference factors.</span></span></label>
      <label className="choice-option"><input type="radio" name="method" checked={state.method === "skip"} onChange={() => dispatch({ type: "method", method: "skip" })} /><span>Skip quantitative data for now<span className="block text-small text-muted">Continue without calculation. Scoring methodology is unchanged; saved entries and questionnaire answers are kept. Skip unknown questions individually.</span></span></label>
      <label className="choice-option unavailable"><input type="radio" name="method" disabled /><span>Upload utility bills/evidence<span className="block text-small text-muted">Unavailable · future stretch capability.</span></span></label>
    </fieldset>
    {state.method === "calculator" && <section className="mt-8" aria-labelledby="calculator-heading">
      <h2 id="calculator-heading" className="text-subheading">Emissions, energy, water and waste calculator</h2>
      <p className="mt-4 text-muted">Reference estimates only. The available electricity factors cover China and listed provinces, not other countries. Their reporting-year suitability has not been verified; they are not approved for production reporting. Historical source details are available with the calculation.</p>
      <p className="mt-3 text-muted">Use one entry per physical source for the same reporting period and boundary. Choose fuel OR mileage, and measured OR calculated emissions for each source. Do not enter company totals alongside their site/source components. Blank means unknown; enter 0 only when confirmed. Scope 3 is excluded.</p>
      {previousInputs && <details className="mt-3"><summary className="text-link">Previously calculated inputs (superseded)</summary><ul>{previousInputs.activities.map(a => <li key={a.id}>{a.site} / {a.source}: {a.quantity || "Unknown"} {a.unit}</li>)}</ul></details>}
      <form className="mt-6" noValidate onSubmit={event => { event.preventDefault(); dispatch({ type: "calculate", valid: outcome.result !== null }); requestAnimationFrame(() => feedback.current?.focus()); }}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Period start"><input className="field-control" type="date" value={draft.periodStart} onChange={e => edit({ ...draft, periodStart: e.target.value })} /></Field>
          <Field label="Period end"><input className="field-control" type="date" value={draft.periodEnd} onChange={e => edit({ ...draft, periodEnd: e.target.value })} /></Field>
          <Field label="Same-period revenue" hint="Optional. Zero or unknown revenue leaves intensity unavailable; absolute quantities remain available."><input className="field-control" inputMode="decimal" maxLength={80} value={draft.revenue.amount} onChange={e => edit({ ...draft, revenue: { ...draft.revenue, amount: e.target.value } })} /></Field>
          <Field label="Revenue currency"><select className="field-control" value={draft.revenue.currency} onChange={e => edit({ ...draft, revenue: { ...draft.revenue, currency: e.target.value as CalculatorDraft["revenue"]["currency"] } })}><option value="USD">USD</option><option value="CNY">CNY</option><option value="other">Other</option></select></Field>
          <Field label="Revenue scale"><select className="field-control" value={draft.revenue.scale} onChange={e => edit({ ...draft, revenue: { ...draft.revenue, scale: e.target.value as "units" | "millions" } })}><option value="units">Currency units</option><option value="millions">Millions of currency units</option></select></Field>
        </div>
        {draft.activities.map((a,index) => <fieldset key={a.id} className="mt-6 rounded-lg border border-line p-4 md:p-6">
          <legend className="field-label">Source {index + 1}</legend>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Business location" hint="For example: Bangkok workshop or Shanghai factory."><input className="field-control" maxLength={120} value={a.site} onChange={e => editSource(index, { site: e.target.value })} /></Field>
            <Field label="Source description" hint="For example: main electricity meter or delivery fleet. Use the same description for the same physical source; internal IDs are generated automatically."><input className="field-control" maxLength={120} value={a.source} onChange={e => editSource(index, { source: e.target.value })} /></Field>
            <Field label="Activity"><select className="field-control" value={a.kind} onChange={e => { const kind = e.target.value as ActivityKind; editSource(index, { kind, unit: calculatorUnits[kind][0]!, factorId: "", renewable: "", diverted: "", hazardous: "" }); }}>{activityKinds.map(k => <option key={k} value={k}>{labels[k]}</option>)}</select></Field>
            <div className="grid min-w-0 items-end grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3 md:col-span-2">
              <Field label="Quantity" hint="Leave blank if unknown."><input className="field-control" inputMode="decimal" maxLength={80} value={a.quantity} onChange={e => editSource(index, { quantity: e.target.value })} /></Field>
              <Field label="Unit"><select className="field-control" value={a.unit} onChange={e => editSource(index, { unit: e.target.value, factorId: "" })}>{calculatorUnits[a.kind].map(u => <option key={u}>{u}</option>)}</select></Field>
            </div>
            {a.kind === "electricity" && <GeographyPicker value={a.geography} onChange={geography => editSource(index, { geography, factorId: "" })} />}
            {allowedFactorIds(a.kind,a.unit).length > 0 && <Field label="Reference factor" hint={a.kind === "electricity" ? "Only factors compatible with your selected location are offered." : "Choose the fuel, material or activity that matches your source. These are historical reference values."}><select className="field-control" value={a.factorId} onChange={e => editSource(index, { factorId: e.target.value })}><option value="">Unknown / not selected</option>{referenceFactors.filter(f => allowedFactorIds(a.kind,a.unit).includes(f.id) && (a.kind !== "electricity" || f.geography === a.geography)).map(f => <option key={f.id} value={f.id}>{f.label}</option>)}</select></Field>}
            {["electricity","gas","fuel","heat","mileage"].includes(a.kind) && <Field label={`Renewable portion (${a.unit})`} hint="Optional subset of this quantity; explicitly enter 0 if none. Does not reduce location-based emissions."><input className="field-control" inputMode="decimal" maxLength={80} value={a.renewable} onChange={e => editSource(index, { renewable: e.target.value })} /></Field>}
            {a.kind === "waste" && <><Field label={`Diverted portion (${a.unit})`}><input className="field-control" inputMode="decimal" maxLength={80} value={a.diverted} onChange={e => editSource(index, { diverted: e.target.value })} /></Field><Field label={`Hazardous portion (${a.unit})`}><input className="field-control" inputMode="decimal" maxLength={80} value={a.hazardous} onChange={e => editSource(index, { hazardous: e.target.value })} /></Field></>}
            <Field label="Evidence reference" hint="Optional bill/meter/source reference; no upload or external transmission."><input className="field-control" maxLength={1000} value={a.evidence} onChange={e => editSource(index, { evidence: e.target.value })} /></Field>
          </div>
          {a.factorId && <p className="mt-3 text-small text-muted">Historical reference selected. Check its suitability before using these estimates for reporting.</p>}
          <button className="text-link mt-4" type="button" onClick={() => edit({ ...draft, activities: draft.activities.filter((_,i) => i !== index) })}>Remove source {index + 1}</button>
        </fieldset>)}
        <button className="button-secondary mt-4" type="button" disabled={draft.activities.length >= 100} onClick={() => edit({ ...draft, activities: [...draft.activities, { id: crypto.randomUUID(), site: "", source: "", kind: "electricity", unit: "kWh", quantity: "", factorId: "", geography: "", evidence: "", renewable: "", diverted: "", hazardous: "" }] })}>Add source</button>
        <fieldset className="mt-6 grid gap-3"><legend className="field-label">Coverage confirmation</legend><p className="text-small text-muted">Choose separately for each category. All relevant sources entered means the whole period and business boundary are covered. None apply explicitly confirms no applicable sources and a genuine zero. Incomplete/not sure keeps totals unknown and shows known subtotals.</p>{(Object.keys(coverageLabels) as CoverageKey[]).map(key => <Field key={key} label={coverageLabels[key]}><select className="field-control" value={typeof draft.coverage[key] === "boolean" ? draft.coverage[key] ? draft.activities.some(a => activityInCoverage(a.kind,key)) ? "complete" : "none" : "incomplete" : draft.coverage[key]} onChange={e => edit({ ...draft, coverage: { ...draft.coverage, [key]: e.target.value as "complete" | "none" | "incomplete" } })}><option value="incomplete">Incomplete/not sure</option><option value="complete">All relevant sources entered</option><option value="none">None apply</option></select></Field>)}</fieldset>
        <label className="mt-6 flex items-start gap-3"><input type="checkbox" checked={draft.referenceAcknowledged} onChange={e => edit({ ...draft, referenceAcknowledged: e.target.checked })} /><span>I understand these are historical reference factors, not production-approved or globally applicable.</span></label>
        <button className="button-primary mt-6" type="submit">Calculate for review</button>
      </form>
      <div ref={feedback} tabIndex={-1} className="mt-6" aria-live="polite">
        {state.showErrors && outcome.issues.length > 0 && <div role="alert"><h3 className="field-label">Check calculator entries</h3><ul>{outcome.issues.map((issue,i) => <li key={i} className="form-error">{issue.path}: {issue.message}</li>)}</ul></div>}
        {!result && <p>Values are not yet calculated for these entries. Calculate again after edits; previous results are not reused.</p>}
        {result && <section aria-label="Calculated values for review"><h3 className="text-subheading">Calculated values for review</h3><p className="mt-3 text-muted">{result.periodStart} to {result.periodEnd}. Results stay separate from assessment answers; automatic transfer is not enabled. Review units and coverage before manually entering any value. U-026 autofill remains pending.</p>
          <dl className="mt-4 grid gap-4 md:grid-cols-2">{Object.entries({ ...result.totals, combinedEmissions: result.combinedEmissions }).map(([key,q]) => <div className="rounded-lg border border-line p-4" key={key}><dt className="field-label">{key === "combinedEmissions" ? "Scope 1 + 2" : key === "scope1" ? "Scope 1" : key === "scope2" ? "Scope 2 (location-based)" : key}</dt><dd>{display(q.value)} {q.unit}{!q.complete && <span className="block text-small text-muted">Incomplete · known subtotal: {display(q.knownSubtotal)} {q.unit}</span>}</dd></div>)}</dl>
          <dl className="mt-4 grid gap-3 md:grid-cols-2">{Object.entries(result.intensities).map(([key,value]) => <div key={key}><dt>{key} intensity ({({carbon:"tCO2e",energy:"kWh",water:"m3",waste:"kg"} as Record<string,string>)[key]}/USD)</dt><dd>{display(value)}</dd></div>)}{[["Renewable electricity share",result.renewableElectricityShare],["Renewable total-energy share",result.renewableEnergyShare],["Waste diversion",result.diversionShare],["Hazardous waste share",result.hazardousShare]].map(([key,value]) => <div key={String(key)}><dt>{key}</dt><dd>{display(value as number | null)}%</dd></div>)}</dl>
          <ul className="mt-4 text-small text-muted">{result.flags.map(flag => <li key={flag}>{flag}</li>)}</ul>
          <details className="mt-4"><summary className="text-link">Calculation details and historical provenance</summary><p className="text-small break-words">{result.methodVersion} · {referenceVersion}</p>{result.traces.map(t => <div key={t.id} className="mt-3 border-t border-line pt-3"><h4 className="field-label">{t.site} / {t.source}</h4><p>{t.expression ?? "No emission calculation for this source."}</p><p>Energy: {display(t.energy)} kWh; water: {display(t.water)} m3; waste: {display(t.waste)} kg.</p>{t.factor && <p>{t.factor.cell} · {t.factor.source_label} · {t.factor.geography} · validity year unknown · not production-approved</p>}<p>Evidence: {t.evidence || "Not supplied"}</p>{t.flags.map(f => <p key={f}>{f}</p>)}</div>)}</details>
        </section>}
      </div>
    </section>}
  </>;
}
