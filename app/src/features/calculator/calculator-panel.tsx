"use client";
import { cloneElement, createContext, useContext, useEffect, useId, useReducer, useRef, useState, type ReactElement, type ReactNode } from "react";
import { browserCalculator, initialCalculatorSession, type CalculatorSession } from "../../adapters/calculator-session";
import { calculateDraft, calculatorEligible, referenceFactors, referenceVersion, type CalculatorDraft } from "../../application/calculator";
import { activityKinds, type ActivityKind, type CoverageKey } from "../../domain/calculator/types";
import { activityInCoverage, allowedFactorIds, calculatorUnits } from "../../domain/calculator/calculate";

import { useAssessment } from "../assessment/assessment-context";
import { displayCalculatorNumber, unavailableMetricReason } from "../../application/calculator-mapping";
import { MetricReview, CalculatorProvenance } from "./metric-review";

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
const display = displayCalculatorNumber;
const IssueContext = createContext<{ path: string; message: string }[]>([]);
const fieldId = (path: string) => "calculator-" + path.replaceAll(".", "-");
function Help({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false); const id = useId();
  return <span className="inline-flex shrink-0 items-center" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <button type="button" className="inline-flex h-6 w-6 items-center justify-center rounded-full text-link" aria-label={"About " + label} aria-describedby={open ? id : undefined} onFocus={() => setOpen(true)} onClick={() => setOpen(true)} onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); setOpen(false); } }}>ⓘ</button>
    {open && <span id={id} role="tooltip" className="absolute left-0 top-7 z-50 w-64 max-w-full rounded-lg border border-line bg-white p-3 text-small font-normal text-muted shadow-lg">{text}</span>}
  </span>;
}
function Field({ label, children, hint, path, trailing }: { label: string; children: ReactElement<{ id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string }>; hint?: string; path?: string; trailing?: ReactNode }) {
  const generated = useId(); const id = path ? fieldId(path) : generated;
  const issues = useContext(IssueContext).filter(issue => issue.path === path);
  return <div className="min-w-0"><div className="relative flex min-h-7 items-center gap-1 mb-2"><label htmlFor={id} className="field-label">{label}</label>{hint && <Help label={label} text={hint} />}</div><div className="relative">{cloneElement(children, { id, "aria-invalid": issues.length > 0, "aria-describedby": issues.length ? id + "-error" : undefined })}{trailing}</div>{issues.length > 0 && <p id={id + "-error"} className="form-error text-small mt-2">{issues.map(i => i.message).join(" ")}</p>}</div>;
}
function GeographyPicker({ value, onChange, path }: { value: string; onChange: (value: string) => void; path: string }) {
  const [search, setSearch] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [browseAll, setBrowseAll] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const query = browseAll ? "" : search.trim().toLowerCase();
  const matches = supportedGeographies.filter(g => g.toLowerCase().includes(query));
  const select = (geography: string) => { setSearch(geography); setBrowseAll(false); setOpen(false); setActive(-1); onChange(geography); };
  return <div className="relative min-w-0" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) { setOpen(false); setActive(-1); } }}>
    <Field path={path} label="Electricity geography" trailing={<button type="button" className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg" aria-label="Browse all electricity geographies" aria-expanded={open} aria-controls={listId} onClick={() => { inputRef.current?.focus(); setBrowseAll(true); setOpen(true); setActive(-1); }}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg></button>} hint="Type an English or Chinese name, then choose a supported location. A single compatible factor is selected automatically; if several are available, choose one explicitly.">
      <input ref={inputRef} className="field-control pr-12" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={listId} aria-activedescendant={open && active >= 0 ? listId + "-" + active : undefined} autoComplete="off" placeholder="Search China or a province" value={search} onFocus={() => setOpen(true)} onChange={event => { setSearch(event.target.value); setBrowseAll(false); setOpen(true); setActive(-1); }} onKeyDown={event => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true); setActive(i => matches.length ? i < 0 ? event.key === "ArrowDown" ? 0 : matches.length - 1 : (i + (event.key === "ArrowDown" ? 1 : -1) + matches.length) % matches.length : -1); }
        else if (event.key === "Enter" && open) { event.preventDefault(); if (active >= 0 && matches[active]) select(matches[active]); else if (matches.length === 1) select(matches[0]!); }
        else if (event.key === "Escape") { event.preventDefault(); setSearch(value); setOpen(false); setActive(-1); }
      }} />
    </Field>
    {open && <ul id={listId} role="listbox" aria-label="Supported electricity geographies" className="absolute left-0 right-0 z-40 mt-1 max-h-64 overflow-y-auto rounded-lg border border-line bg-white py-1 shadow-lg">
      {matches.map((geography, index) => { const at = geography.toLowerCase().indexOf(query); return <li id={listId + "-" + index} role="option" aria-selected={active === index} key={geography} onMouseDown={event => event.preventDefault()} onClick={() => select(geography)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") select(geography); }} tabIndex={-1} className={"cursor-pointer px-4 py-3 text-small hover:bg-slate-100 " + (active === index ? "bg-slate-100" : "")}>
        {query ? <><span className="text-muted">{geography.slice(0, at)}</span><strong>{geography.slice(at, at + query.length)}</strong><span className="text-muted">{geography.slice(at + query.length)}</span></> : geography}
      </li>; })}
      {!matches.length && <li className="px-4 py-3 text-small text-muted" role="presentation">No supported location matches “{search}”. Try its listed English or Chinese name; no factor is substituted.</li>}
    </ul>}
    <p className="mt-2 text-small text-muted">Selected: {value || "Unknown / not selected"}.{search !== value && " Choose a suggestion to apply your search."}</p>
    {value && <button type="button" className="text-link text-small" onClick={() => select("")}>Clear geography selection</button>}
  </div>;
}
const fieldNames: Record<string, string> = { site: "Facility/location", source: "Source name", quantity: "Quantity", unit: "Unit", factorId: "Reference factor", geography: "Electricity geography", renewable: "Renewable portion", diverted: "Diverted portion", hazardous: "Hazardous portion", kind: "Activity", evidence: "Evidence reference", periodStart: "Period start", periodEnd: "Period end", referenceAcknowledged: "Historical-factor acknowledgement", "revenue.amount": "Same-period revenue", "revenue.currency": "Revenue currency", "revenue.scale": "Revenue scale" };
function issueLabel(path: string, draft: CalculatorDraft) {
  const parts = path.split(".");
  if (parts[0] === "activities") { const index = Number(parts[1]); const source = draft.activities[index]; return "Source " + (index + 1) + (source?.source ? " (“" + source.source + "”)" : "") + ": " + (fieldNames[parts[2]!] ?? "source entry"); }
  if (parts[0] === "coverage") return coverageLabels[parts[1] as CoverageKey];
  return fieldNames[path] ?? "Calculator entries";
}
export function CalculatorPanel() {
  const { dispatch: assessmentDispatch, session, questions } = useAssessment();
  const eligible = calculatorEligible(session.profile.country);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [state, dispatch] = useReducer(reducer, { ...initialCalculatorSession(), ready: false, warning: null, showErrors: false });
  const firstSave = useRef(true);
  const feedback = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loaded = browserCalculator.load();
    let changed = false;
    const activities = loaded.state.draft.activities.map(source => {
      if (source.kind !== "electricity" || !source.geography || source.factorId) return source;
      const compatible = referenceFactors.filter(f => f.geography === source.geography && allowedFactorIds(source.kind, source.unit).includes(f.id));
      if (compatible.length !== 1) return source;
      changed = true; return { ...source, factorId: compatible[0]!.id };
    });
    if (changed) {
      loaded.state = { ...loaded.state, draft: { ...loaded.state.draft, activities }, reviewed: false };
      assessmentDispatch({ type: "calculator-invalidate" });
      loaded.warning = browserCalculator.save(loaded.state) ?? "The single compatible factor was selected for your saved geography. Recalculate and confirm before transfer.";
    }
    dispatch({ type: "restore", ...loaded });
  }, [assessmentDispatch]);
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
  const edit = (next: CalculatorDraft) => { assessmentDispatch({ type: "calculator-invalidate" }); dispatch({ type: "edit", draft: next }); };
  const editSource = (index: number, patch: Partial<CalculatorDraft["activities"][number]>) => {
    const next = { ...draft.activities[index]!, ...patch };
    if (next.kind === "electricity" && ("geography" in patch || "unit" in patch || "kind" in patch)) {
      const factors = referenceFactors.filter(f => f.geography === next.geography && allowedFactorIds(next.kind, next.unit).includes(f.id));
      next.factorId = factors.length === 1 ? factors[0]!.id : "";
    }
    edit({ ...draft, activities: draft.activities.map((a,i) => i === index ? next : a) });
  };
  const openErrors = () => setCollapsed(ids => ids.filter(id => !outcome.issues.some(issue => issue.path.startsWith("activities." + draft.activities.findIndex(a => a.id === id) + "."))));
  const saveCalculator = () => browserCalculator.save({ draft, method: state.method, reviewed: state.reviewed, lastReviewedDraft: state.lastReviewedDraft, priorReviewedDraft: state.priorReviewedDraft });
  if (!state.ready) return <p role="status">Restoring data input entries...</p>;
  return <IssueContext.Provider value={state.showErrors ? outcome.issues : []}>
    {state.warning && <p className="form-error mt-4" role="alert">{state.warning}</p>}
    <CalculatorProvenance />
    <fieldset className="mt-8 grid gap-4">
      <legend className="sr-only">Quantitative-data input method</legend>
      <label className="choice-option"><input type="radio" name="method" checked={!eligible || state.method === "manual" || state.method === "skip"} onChange={() => dispatch({ type: "method", method: "manual" })} /><span>Enter manually<span className="block text-small text-muted">Enter known values directly in the questionnaire. Scoring methodology is unchanged; existing questionnaire answers are preserved.</span></span></label>
      {eligible && <label className="choice-option"><input type="radio" name="method" checked={state.method === "calculator"} onChange={() => dispatch({ type: "method", method: "calculator" })} /><span>Use emissions calculator (Beta — China grid factors)<span className="block text-small text-muted">Calculate and review quantities using explicit historical reference factors.</span></span></label>}
      <label className="choice-option unavailable"><input type="radio" name="method" disabled /><span>Upload utility bills/evidence<span className="block text-small text-muted">Unavailable · future stretch capability.</span></span></label>
    </fieldset>
    {!eligible && <p className="mt-4 text-muted">{session.profile.country?.trim() ? "The calculator is not available for this country. Use manual questionnaire entry; saved calculator entries are retained for recovery." : "Choose a supported Country in Setup to use the calculator. Currently China is supported; you can continue with manual entry."}</p>}
    {(!eligible || state.method !== "calculator") && <button className="button-primary mt-6" type="button" disabled={questions.length === 0} onClick={() => assessmentDispatch({ type: "start" })}>Start questionnaire</button>}
    {eligible && state.method === "calculator" && <section className="mt-8" aria-labelledby="calculator-heading">
      <h2 id="calculator-heading" className="text-subheading">Emissions, energy, water and waste calculator</h2>
      <p className="mt-4 text-muted">Reference estimates only. The available electricity factors cover China and listed provinces, not other countries. Their reporting-year suitability has not been verified; they are not approved for production reporting. Historical source details are available with the calculation.</p>
      <p className="mt-3 text-muted">Use one entry per physical source for the same reporting period and boundary. Choose fuel OR mileage, and measured OR calculated emissions for each source. Do not enter company totals alongside their site/source components. Blank means unknown; enter 0 only when confirmed. Use a dot for decimals and commas for thousands (12,000.5). Scope 3 is excluded.</p>
      {previousInputs && <details className="mt-3"><summary className="text-link">Earlier calculation snapshot (history)</summary><p className="text-small text-muted">Saved inputs from an earlier calculation; this is history, not a warning about the current values below.</p><ul>{previousInputs.activities.map(a => <li key={a.id}>{a.site} / {a.source}: {a.quantity || "Unknown"} {a.unit}</li>)}</ul></details>}
      <form id={fieldId("activities")} tabIndex={-1} className="mt-6" noValidate onSubmit={event => { event.preventDefault(); openErrors(); dispatch({ type: "calculate", valid: outcome.result !== null }); requestAnimationFrame(() => feedback.current?.focus()); }}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field path="periodStart" label="Period start"><input className="field-control" type="date" value={draft.periodStart} onChange={e => edit({ ...draft, periodStart: e.target.value })} /></Field>
          <Field path="periodEnd" label="Period end"><input className="field-control" type="date" value={draft.periodEnd} onChange={e => edit({ ...draft, periodEnd: e.target.value })} /></Field>
          <Field path="revenue.amount" label="Same-period revenue" hint="Optional. Zero or unknown revenue leaves intensity unavailable; absolute quantities remain available."><input className="field-control" inputMode="decimal" placeholder="Optional revenue amount" maxLength={80} value={draft.revenue.amount} onChange={e => edit({ ...draft, revenue: { ...draft.revenue, amount: e.target.value } })} /></Field>
          <Field path="revenue.currency" label="Revenue currency"><select className="field-control" value={draft.revenue.currency} onChange={e => edit({ ...draft, revenue: { ...draft.revenue, currency: e.target.value as CalculatorDraft["revenue"]["currency"] } })}><option value="USD">USD</option><option value="CNY">CNY</option><option value="other">Other</option></select></Field>
          <Field path="revenue.scale" label="Revenue scale"><select className="field-control" value={draft.revenue.scale} onChange={e => edit({ ...draft, revenue: { ...draft.revenue, scale: e.target.value as "units" | "millions" } })}><option value="units">Currency units</option><option value="millions">Millions of currency units</option></select></Field>
        </div>
        {draft.activities.map((a,index) => <fieldset key={a.id} className={"mt-6 rounded-lg border border-line border-l-4 p-4 md:p-6 " + (a.kind === "water" ? "border-l-people" : a.kind === "waste" ? "border-l-resources" : "border-l-accent")}>
          <legend className="field-label">Source {index + 1}</legend>
          <div className="mb-4 flex items-start justify-between gap-3"><div><p className="field-label flex items-center gap-2"><svg aria-hidden="true" className={a.kind === "water" ? "text-people" : a.kind === "waste" ? "text-resources" : "text-accent"} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={a.kind === "water" ? "M12 3C8 8 5 11 5 15a7 7 0 0 0 14 0c0-4-3-7-7-12Z" : a.kind === "waste" ? "M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7" : "m13 2-9 12h7l-1 8 10-13h-7z"} /></svg>{a.source || "Unnamed source"}</p><p className="text-small text-muted">{a.site && a.site + " · "}{labels[a.kind]} · {a.quantity || "Unknown quantity"} {a.unit}</p><p className="text-small text-muted">{outcome.issues.some(i => i.path.startsWith("activities." + index + ".")) ? "Check this source's entries" : !a.quantity.trim() || (["electricity","gas","fuel","heat","mileage"].includes(a.kind) && !a.renewable.trim()) || (a.kind === "waste" && (!a.diverted.trim() || !a.hazardous.trim())) || (allowedFactorIds(a.kind,a.unit).length > 0 && !a.factorId) ? "Incomplete: some quantities, portions or factors are unknown" : "Source inputs entered; review overall coverage below"}</p></div>{collapsed.includes(a.id) && <button type="button" className="text-link" onClick={() => setCollapsed(ids => ids.filter(id => id !== a.id))}>Edit source {index + 1}</button>}</div>
          {!collapsed.includes(a.id) && <><div className="grid gap-4 md:grid-cols-2">
            <Field path={`activities.${index}.source`} label="Source name"><input className="field-control" placeholder="Factory electricity meter" maxLength={120} value={a.source} onChange={e => editSource(index, { source: e.target.value })} /></Field>
            <Field path={`activities.${index}.site`} label="Facility/location (optional)" hint="Distinguishes similarly named sources at different facilities. Matching names flag possible duplicate entries, but cannot detect all overlapping inventories."><input className="field-control" placeholder="Beijing factory" maxLength={120} value={a.site} onChange={e => editSource(index, { site: e.target.value })} /></Field>
            <Field path={`activities.${index}.kind`} label="Activity"><select className="field-control" value={a.kind} onChange={e => { const kind = e.target.value as ActivityKind; editSource(index, { kind, unit: calculatorUnits[kind][0]!, factorId: "", renewable: "", diverted: "", hazardous: "" }); }}>{activityKinds.map(k => <option key={k} value={k}>{labels[k]}</option>)}</select></Field>
            <div className="grid min-w-0 items-start grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3 md:col-span-2">
              <Field path={`activities.${index}.quantity`} label="Quantity"><input className="field-control" inputMode="decimal" placeholder="Leave blank if unknown" maxLength={80} value={a.quantity} onChange={e => editSource(index, { quantity: e.target.value })} /></Field>
              <Field path={`activities.${index}.unit`} label="Unit"><select className="field-control" value={a.unit} onChange={e => editSource(index, { unit: e.target.value, factorId: "" })}>{calculatorUnits[a.kind].map(u => <option key={u}>{u}</option>)}</select></Field>
            </div>
            {a.kind === "electricity" && <GeographyPicker path={`activities.${index}.geography`} value={a.geography} onChange={geography => editSource(index, { geography, factorId: "" })} />}
            {allowedFactorIds(a.kind,a.unit).length > 0 && !(a.kind === "electricity" && a.factorId && referenceFactors.filter(f => f.geography === a.geography && allowedFactorIds(a.kind,a.unit).includes(f.id)).length === 1) && <Field path={`activities.${index}.factorId`} label="Reference factor" hint={a.kind === "electricity" ? "Only factors compatible with your selected location are offered." : "Choose the fuel, material or activity that matches your source. These are historical reference values."}><select className="field-control" value={a.factorId} onChange={e => editSource(index, { factorId: e.target.value })}><option value="">Unknown / not selected</option>{referenceFactors.filter(f => allowedFactorIds(a.kind,a.unit).includes(f.id) && (a.kind !== "electricity" || f.geography === a.geography)).map(f => <option key={f.id} value={f.id}>{f.label}</option>)}</select></Field>}
            {["electricity","gas","fuel","heat","mileage"].includes(a.kind) && <Field path={`activities.${index}.renewable`} label={`Renewable portion (${a.unit})`} hint="Optional subset of this quantity; explicitly enter 0 if none. Does not reduce location-based emissions."><input className="field-control" inputMode="decimal" placeholder="Unknown, or 0 if none" maxLength={80} value={a.renewable} onChange={e => editSource(index, { renewable: e.target.value })} /></Field>}
            {a.kind === "waste" && <><Field path={`activities.${index}.diverted`} label={`Diverted portion (${a.unit})`}><input className="field-control" inputMode="decimal" placeholder="Unknown, or 0 if none" maxLength={80} value={a.diverted} onChange={e => editSource(index, { diverted: e.target.value })} /></Field><Field path={`activities.${index}.hazardous`} label={`Hazardous portion (${a.unit})`}><input className="field-control" inputMode="decimal" placeholder="Unknown, or 0 if none" maxLength={80} value={a.hazardous} onChange={e => editSource(index, { hazardous: e.target.value })} /></Field></>}
            <Field path={`activities.${index}.evidence`} label="Evidence reference" hint="Optional bill/meter/source reference; no upload or external transmission."><input className="field-control" placeholder="Optional bill or meter reference" maxLength={1000} value={a.evidence} onChange={e => editSource(index, { evidence: e.target.value })} /></Field>
          </div>
          {a.factorId && <p className="mt-3 text-small text-muted">Applied factor: {referenceFactors.find(f => f.id === a.factorId)?.label} ({referenceFactors.find(f => f.id === a.factorId)?.value} {referenceFactors.find(f => f.id === a.factorId)?.factor_unit}). Source: {referenceFactors.find(f => f.id === a.factorId)?.source_label} · workbook {referenceFactors.find(f => f.id === a.factorId)?.cell}. Historical reference; reporting year and suitability remain unverified.</p>}
          <button className="button-secondary mt-4 mr-4" type="button" onClick={() => { if (outcome.issues.some(issue => issue.path.startsWith("activities." + index + "."))) { dispatch({ type: "calculate", valid: false }); return; } setCollapsed(ids => [...ids, a.id]); }}>Done / Collapse source {index + 1}</button>
          <button className="text-link mt-4" type="button" onClick={() => edit({ ...draft, activities: draft.activities.filter((_,i) => i !== index) })}>Remove source {index + 1}</button></>}
        </fieldset>)}
        <button className="button-secondary mt-4" type="button" disabled={draft.activities.length >= 100} onClick={() => edit({ ...draft, activities: [...draft.activities, { id: crypto.randomUUID(), site: "", source: "", kind: "electricity", unit: "kWh", quantity: "", factorId: "", geography: "", evidence: "", renewable: "", diverted: "", hazardous: "" }] })}>Add source</button>
        <fieldset className="mt-6 grid gap-3"><legend className="field-label">Coverage confirmation</legend><p className="text-small text-muted">Choose separately for each category. All relevant sources entered means the whole period and business boundary are covered. None apply explicitly confirms no applicable sources and a genuine zero. Incomplete/not sure keeps totals unknown and shows known subtotals.</p>{(Object.keys(coverageLabels) as CoverageKey[]).map(key => <Field key={key} path={`coverage.${key}`} label={coverageLabels[key]}><select className="field-control" value={typeof draft.coverage[key] === "boolean" ? draft.coverage[key] ? draft.activities.some(a => activityInCoverage(a.kind,key)) ? "complete" : "none" : "incomplete" : draft.coverage[key]} onChange={e => edit({ ...draft, coverage: { ...draft.coverage, [key]: e.target.value as "complete" | "none" | "incomplete" } })}><option value="incomplete">Incomplete/not sure</option><option value="complete">All relevant sources entered</option><option value="none">None apply</option></select></Field>)}</fieldset>
        <label className="mt-6 flex items-start gap-3"><input id={fieldId("referenceAcknowledged")} type="checkbox" checked={draft.referenceAcknowledged} onChange={e => edit({ ...draft, referenceAcknowledged: e.target.checked })} /><span>I understand these are historical reference factors, not production-approved or globally applicable.</span></label>
        {state.showErrors && outcome.issues.filter(i => i.path === "referenceAcknowledged").map(i => <p key={i.path} className="form-error">{i.message}</p>)}
        <button className="button-primary mt-6" type="submit">Calculate for review</button>
      </form>
      <div ref={feedback} tabIndex={-1} className="mt-6" aria-live="polite">
        {state.showErrors && outcome.issues.length > 0 && <div role="alert"><h3 className="field-label">Check calculator entries</h3><ul>{outcome.issues.map((issue,i) => <li key={i} className="form-error"><a className="text-link" href={"#" + fieldId(issue.path)} onClick={event => { event.preventDefault(); openErrors(); requestAnimationFrame(() => document.getElementById(fieldId(issue.path))?.focus()); }}>{issueLabel(issue.path, draft)}: {issue.message}</a></li>)}</ul></div>}
        {!result && <p>Values are not yet calculated for these entries. Calculate again after edits; previous results are not reused.</p>}
        {result && <section aria-label="Calculated values for review"><h3 className="text-subheading">Calculated values for review</h3><p className="mt-3 text-muted">{result.periodStart} to {result.periodEnd}. Review units, annual period and coverage, then select and confirm values below to transfer. U-026 uses renewable total-energy share. The inherited benchmark still refers to electricity; that methodology discrepancy remains open for Alan/Henry.</p>
          <dl className="mt-4 grid gap-4 md:grid-cols-2">{Object.entries({ ...result.totals, combinedEmissions: result.combinedEmissions }).map(([key,q]) => <div className="rounded-lg border border-line p-4" key={key}><dt className="field-label">{key === "combinedEmissions" ? "Scope 1 + 2" : key === "scope1" ? "Scope 1" : key === "scope2" ? "Scope 2 (location-based)" : key}</dt><dd>{display(q.value)} {q.unit}{!q.complete && <span className="block text-small text-muted">Incomplete · known subtotal: {display(q.knownSubtotal)} {q.unit}</span>}</dd></div>)}</dl>
          <dl className="mt-4 grid gap-3 md:grid-cols-2">{Object.entries(result.intensities).map(([key,value]) => <div key={key}><dt>{key} intensity ({({carbon:"tCO2e",energy:"kWh",water:"m3",waste:"kg"} as Record<string,string>)[key]}/USD)</dt><dd>{display(value)}{value === null && <span className="block text-small text-muted">{unavailableMetricReason(key, draft)}</span>}</dd></div>)}{[["Renewable electricity share",result.renewableElectricityShare],["Renewable total-energy share",result.renewableEnergyShare],["Waste diversion",result.diversionShare],["Hazardous waste share",result.hazardousShare]].map(([key,value]) => <div key={String(key)}><dt>{key}</dt><dd>{display(value as number | null)}{value !== null && "%"}{value === null && <span className="block text-small text-muted">{unavailableMetricReason(({"Renewable electricity share":"renewableElectricity","Renewable total-energy share":"renewable","Waste diversion":"diversion","Hazardous waste share":"hazardous"} as Record<string,string>)[String(key)]!, draft)}</span>}</dd></div>)}</dl>
          <ul className="mt-4 text-small text-muted">{result.flags.map(flag => <li key={flag}>{flag}</li>)}</ul>
          <details className="mt-4"><summary className="text-link">Calculation details and historical provenance</summary><p className="text-small break-words">{result.methodVersion} · {referenceVersion}</p>{result.traces.map(t => <div key={t.id} className="mt-3 border-t border-line pt-3"><h4 className="field-label">{t.site} / {t.source}</h4><p>{t.expression ?? "No emission calculation for this source."}</p><p>Energy: {display(t.energy)} kWh; water: {display(t.water)} m3; waste: {display(t.waste)} kg.</p>{t.factor && <p>{t.factor.cell} · {t.factor.source_label} · {t.factor.geography} · validity year unknown · not production-approved</p>}<p>Evidence: {t.evidence || "Not supplied"}</p>{t.flags.map(f => <p key={f}>{f}</p>)}</div>)}</details>
          <MetricReview key={JSON.stringify(draft)} draft={draft} saveCalculator={saveCalculator} />
        </section>}
      </div>
    </section>}
  </IssueContext.Provider>;
}
