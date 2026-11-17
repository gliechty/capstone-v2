"use client";
import { suggestedRegion } from "../../application/country-regions";
import { quickRequest } from "./quick-request";
import { displayAnswer } from "../../application/display-value";


import Link from "next/link";
import { FieldHelp } from "./field-help";
import { MarketPicker } from "./market-picker";
import { CountryPicker } from "./country-picker";
import Image from "next/image";
import { CalculatorProvenance } from "../calculator/metric-review";
import { CalculatorPanel } from "../calculator/calculator-panel";
import { browserSession } from "../../adapters/assessment-session";
import { createAssessmentModel } from "./model";
import { selectedQuestions } from "../../application/assessment-catalog";
import { StageNavigation } from "./stage-navigation";
import { useRouter } from "next/navigation";
import { authorizeResultsGeneration } from "../../application/recommendations/generation-intent";
import { recommendationRequestFromSession } from "../../application/recommendations/request";
import { NOTES_MAX_LENGTH } from "../../application/assessment-notes";
import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { MobileQuestionRail, ProgressNavigator } from "./progress-navigator";
import { AssessmentProvider, useAssessment, catalogProfileErrors } from "./assessment-context";
import { answerError, profileFields, progressLabel, unanswered, type ProfileKey } from "./model";

import type { AssessmentCatalog, Question } from "../../application/assessment-catalog";

function StageHeading({ children }: { children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return <h1 ref={ref} tabIndex={-1} className="stage-heading text-heading">{children}</h1>;
}

const setupPrompts: Partial<Record<ProfileKey, string>> = {
  companyName: "Enter company name", industry: "Choose an industry", subindustry: "Add a specific activity",
  companySize: "Choose an employee band", location: "Choose a region", targetBuyer: "Choose a buyer type",
  businessGoal: "Choose a business goal", notes: "Add business context or buyer requirements",
};
const setupHelp: Partial<Record<ProfileKey, string>> = {
  country: "Select a country from the search results. The current calculator is enabled for China only and uses the China reference workbook. Other countries can use manual data entry.",
  location: "This is your business's home region, not its target sales markets. Country selection may suggest a region; you can change it.",
  targetMarket: "Choose up to two regions. Your first choice is primary; your second is secondary. Uncheck a selected market to remove it.",
  businessGoal: "Examples: attract new investors or prepare for procurement screening.",
  notes: "Add relevant business context or buyer requirements, up to 1,000 characters.",
};

function Setup() {
  const { session, dispatch, catalog } = useAssessment();
  const [submitted, setSubmitted] = useState(false);
  const [selecting,setSelecting]=useState(false);
  const [selectionError,setSelectionError]=useState("");
  const [countrySearchPending, setCountrySearchPending] = useState(false);
  const errors = catalogProfileErrors(catalog, session.profile);
  if (countrySearchPending) errors.country = "Choose a country from the search results, or clear this optional field.";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const first = profileFields.find((field) => errors[field.key]);
    if (first) {
      const control = first.key === "targetMarket" ? event.currentTarget.querySelector<HTMLInputElement>('[name="targetMarket"]') : event.currentTarget.elements.namedItem(first.key);
      if (control instanceof HTMLElement) control.focus();
      return;
    }
    if(session.assessmentProfile){
      setSelecting(true);setSelectionError("");
      try{
        const response=await fetch("/api/quick-assessment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(quickRequest(session,"select"))});
        const result=await response.json();
        if(!response.ok || !Array.isArray(result.questionIds) || !result.questionIds.length)throw Error("Quick selection unavailable");
        dispatch({type:"quick-selection",version:result.version,questionIds:result.questionIds});
      }catch{setSelectionError("Quick questions could not be selected. Review your business context and try again.");}
      finally{setSelecting(false);}
      return;
    }
    dispatch({ type: "method" });
  }
  return (
    <section className="assessment-setup">
      <span className="section-label">01 / Business context</span>
      <StageHeading>Tell us about your business.</StageHeading>
      <p className="mt-4 text-muted">Enter your business context. Fields marked required must be completed; subindustry and additional context are optional.</p>
      <form className="mt-8" noValidate onSubmit={submit}><fieldset disabled={selecting}>
        {submitted && Object.keys(errors).length > 0 && <p role="alert" className="form-error mb-6">Please check the highlighted fields before continuing.</p>}
        <div className="context-grid">
          {profileFields.map((field) => {
            const error = submitted ? errors[field.key] : undefined;
            const id = "profile-" + field.key;
            const help = setupHelp[field.key];
            const describedBy = [help ? id + "-hint" : "", error ? id + "-error" : ""].filter(Boolean).join(" ");
            if (field.key === "targetMarket") return <div key={field.key} role="group" className="context-field market-field" aria-labelledby={id + "-label"} aria-describedby={describedBy}>
              <div className="context-field-heading"><span id={id + "-label"} className="field-label">Target markets <span className="text-small font-normal text-muted">(required)</span></span>
                <FieldHelp id={id + "-hint"} label="Target markets">{help!}</FieldHelp></div>
              <MarketPicker value={session.profile.targetMarket} options={catalog.setupOptions.targetMarket}
                onChange={value => dispatch({ type: "profile", field: "targetMarket", value })} describedBy={describedBy} />
              <div className="context-field-feedback">{error && <p id={id + "-error"} className="form-error">{error}</p>}</div>
            </div>;
            return <div key={field.key} className="context-field">
              <div className="context-field-heading"><label htmlFor={id} className="field-label">{field.label} <span className="text-small font-normal text-muted">({field.required ? "required" : "optional"})</span></label>
                {help && <FieldHelp id={id + "-hint"} label={field.label}>{help}</FieldHelp>}</div>
              <div>
              {field.key === "country" ? <CountryPicker onPendingChange={setCountrySearchPending} id={id} value={session.profile.country ?? ""} onChange={value => dispatch({ type: "profile", field: "country", value })} describedBy={describedBy} invalid={Boolean(error)} /> : field.key === "notes" ? <textarea id={id} name={field.key} className="field-control" rows={4} placeholder={setupPrompts[field.key]}
                maxLength={NOTES_MAX_LENGTH} value={session.profile.notes} aria-invalid={Boolean(error)}
                aria-describedby={describedBy}
                onChange={event => dispatch({ type: "profile", field: "notes", value: event.target.value })} />
                : field.key !== "companyName" && field.key !== "subindustry" ? <select id={id} name={field.key} className="field-control"
                required value={session.profile[field.key] ?? ""} aria-invalid={Boolean(error)}
                aria-describedby={describedBy}
                onChange={event => dispatch({ type: "profile", field: field.key, value: event.target.value })}>
                <option value="">{setupPrompts[field.key] ?? "Choose one"}</option>
                {catalog.setupOptions[field.key].map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select> : <input id={id} name={field.key} className="field-control" type="text" placeholder={setupPrompts[field.key]}
                autoComplete={field.key === "companyName" ? "organization" : "off"} required={field.required} maxLength={200}
                value={session.profile[field.key] ?? ""} aria-invalid={Boolean(error)}
                aria-describedby={describedBy}
                onChange={event => dispatch({ type: "profile", field: field.key as ProfileKey, value: event.target.value })} />}
              </div>
              <div className="context-field-feedback">
              {field.key === "location" && session.profile.country && <p className="mt-2 text-small text-muted" role="status">{suggestedRegion(session.profile.country) ? "Suggested region: " + suggestedRegion(session.profile.country) + ". You can change it." : "No suggested region for this country. Please select your region."}</p>}
              {error && <p id={id + "-error"} className="form-error mt-2">{error}</p>}
              </div>
            </div>;
          })}
        </div>
        <button className="button-primary mt-8" type="submit">{selecting ? "Selecting questions…" : session.assessmentProfile ? "Continue to Quick questions" : "Continue to input method"} <span aria-hidden="true">→</span></button>
      </fieldset>{selectionError && <p role="alert">{selectionError}</p>}</form>
    </section>
  );
}

function InputMethod() {
  const { dispatch, questions } = useAssessment();
  return <section className="assessment-setup">
    <span className="section-label">02 / Quantitative data</span>
    <StageHeading>How would you like to enter your quantitative sustainability data?</StageHeading>
    <CalculatorPanel />
    <div className="mt-8 flex flex-wrap gap-4">
      <button className="button-secondary" type="button" onClick={() => dispatch({ type: "edit-setup" })}>Back to setup</button>
      {questions.length === 0 && <p role="alert">No questions match this context. Review your setup; no fallback questionnaire has been substituted.</p>}

    </div>
  </section>;
}

function Progress({ mobileCard = false }: { mobileCard?: boolean }) {
  const { session, dispatch, questions } = useAssessment();
  const items = questions.map((question, index) => ({
    id: question.id, number: index + 1, title: question.title, category: question.category,
    status: progressLabel(session, question), current: session.activeId === question.id,
  }));
  const Navigator = mobileCard ? MobileQuestionRail : ProgressNavigator;
  return <Navigator items={items} onSelect={(id) => {
    const question = questions.find((item) => item.id === id);
    if (question) dispatch({ type: "jump", id: question.id });
  }} />;
}

function AnswerForm({ question }: { question: Question }) {
  const { session, dispatch, questions } = useAssessment();
  const [attempted, setAttempted] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function cancelAdvance() {
    if (advanceTimer.current !== null) clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
  }
  useEffect(() => () => {
    if (advanceTimer.current !== null) clearTimeout(advanceTimer.current);
  }, []);
  function pointerChoice(value: string) {
    cancelAdvance();
    if (session.answers[question.id] === value) {
      dispatch({ type: "answer", id: question.id, raw: "" });
      return;
    }
    dispatch({ type: "answer", id: question.id, raw: value });
    advanceTimer.current = setTimeout(() => dispatch({ type: "next" }), 800);
  }
  const raw = session.answers[question.id] ?? "";
  const error = attempted && raw.trim() ? answerError(question, raw) : undefined;
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const index = questions.findIndex((q) => q.id === question.id);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    cancelAdvance();
    setAttempted(true);
    if (raw.trim() && answerError(question, raw)) { inputRef.current?.focus(); return; }
    dispatch({ type: "next" });
  }
  function change(value: string) { cancelAdvance(); dispatch({ type: "answer", id: question.id, raw: value }); }
  return <form noValidate onSubmit={submit} className="mt-6" onKeyDownCapture={cancelAdvance} onPointerDownCapture={cancelAdvance}>
    <CalculatorProvenance questionId={question.id} />
    {"options" in question ? <fieldset aria-describedby={"question-hint" + (error ? " answer-error" : "")}>
      <legend className="field-label">Your answer</legend>
      <div className="grid gap-3">
        {question.options.map((option, i) => <label key={option} className="choice-option">
          <input type="radio" name="answer" value={option} checked={raw === option}
            ref={i === 0 ? (node) => { inputRef.current = node; } : undefined}
            onChange={(event) => { if (!(event.nativeEvent instanceof MouseEvent) || event.nativeEvent.detail === 0) change(option); }}
            onClick={(event) => { if (event.detail > 0) pointerChoice(option); }}
            onKeyDown={(event) => {
              if (event.key === " " && raw === option) { event.preventDefault(); change(""); return; }
              if (event.key === "Enter") {
                event.preventDefault();
                change(option);
                dispatch({ type: "next" });
              }
            }} />
          <span>{option}</span>
        </label>)}
      </div>
    </fieldset> : <div>
      <label htmlFor="answer" className="field-label">Your answer{question.unit ? " (" + question.unit + ")" : ""}</label>
      {question.kind === "text" ? <textarea id="answer" className="field-control" rows={4} maxLength={2000} value={raw}
        ref={(node) => { inputRef.current = node; }} aria-invalid={Boolean(error)}
        aria-describedby={"question-hint" + (error ? " answer-error" : "")} onChange={(event) => change(event.target.value)} />
        : <input id="answer" className="field-control" type="text" inputMode="decimal" maxLength={2000} value={raw}
          ref={(node) => { inputRef.current = node; }} aria-invalid={Boolean(error)}
          aria-describedby={"question-hint" + (error ? " answer-error" : "")} onChange={(event) => change(event.target.value)} />}
    </div>}
    {"options" in question && raw && <p className="selection-confirmation mt-3" role="status">Selected: {raw}</p>}
    {error && <p id="answer-error" role="alert" className="form-error mt-3">{error}</p>}

    <div className="answer-actions mt-3 flex flex-wrap gap-3">
      <button type="button" className="button-secondary" disabled={index === 0} onClick={() => dispatch({ type: "back" })}>Previous</button>
      <button type="submit" className="button-primary">{index === questions.length - 1 ? "Review answers" : "Continue"}</button>
      <button type="button" className="button-secondary" onClick={() => dispatch({ type: "skip" })}>Skip</button>
      {raw !== "" && <button type="button" className="text-link" onClick={() => change("")}>Clear answer</button>}
    </div>
    <details className="answer-help"><summary>Answer and keyboard help</summary><p>{"options" in question ? "Click or tap an answer to continue automatically. Click it again to clear it. With a keyboard, choose with arrows or Space; Space clears the selected answer. Press Enter or Continue to advance." : "Enter an answer, then continue."} You can revisit any question.</p></details>
  </form>;
}

function AdjacentCard({ question, position }: { question?: Question; position: "previous" | "next" }) {
  const { dispatch } = useAssessment();
  if (!question && position === "previous") return null;
  if (!question) return <div className="question-peek-boundary text-small text-muted">Next: review your unanswered questions.</div>;
  return <div className={"question-peek " + position}>
    <button type="button" className="adjacent-card" aria-label={(position === "previous" ? "Previous" : "Next") + " question: " + question.title}
      onClick={() => dispatch({ type: "jump", id: question.id })}>
      <span className="text-small font-semibold">{position === "previous" ? "↑ Previous" : "↓ Next"} / {question.category}</span>
      <span className="block mt-2 font-semibold">{question.title}</span>
      <span className="block mt-2 text-small">{question.hint}</span>
      <span className="adjacent-input" aria-hidden="true" />
    </button>
  </div>;
}

// Inert outgoing surface retains the same visible controls while it rolls away.
// It cannot edit answers or receive focus; the active form remains authoritative.
function DepartingQuestion({question,raw}:{question:Question;raw:string}) {
  return <article className="departing-surface" inert>
    <p className="departing-category">{question.category} <span className="font-normal">/ {question.id}</span></p>
    <h2 className="question-heading mt-3">{question.title}</h2><p className="mt-4 text-muted">{question.hint}</p>
    <div className="mt-3"><p className="field-label">Your answer</p>
      {"options" in question ? <div className="grid gap-3">{question.options.map(option=><label className="choice-option" key={option}><input type="radio" checked={raw===option} readOnly tabIndex={-1}/><span>{option}</span></label>)}</div> : <div className="field-control">{raw}</div>}
      {raw && <p className="selection-confirmation mt-3">Selected: {raw}</p>}
      <div className="answer-help">Answer and keyboard help</div>
      <div className="answer-actions mt-3 flex flex-wrap gap-3"><span className="button-secondary">Previous</span><span className="button-primary">Continue</span><span className="button-secondary">Skip</span></div>
    </div>
  </article>;
}

function Questionnaire() {
  const { session, dispatch, questions } = useAssessment();
  const question = questions.find((q) => q.id === session.activeId)!;
  const index = questions.indexOf(question);
  const [motion, setMotion] = useState<{index:number;direction:string;previous:number|null}>({ index, direction: "forward", previous: null });
  if (motion.index !== index) setMotion({ index, direction: index < motion.index ? "backward" : "forward", previous: motion.index });
  const headingRef = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    const heading = headingRef.current;
    const grid = heading?.closest<HTMLElement>(".assessment-grid");
    if (grid) grid.style.paddingTop = "0px";
    heading?.focus({ preventScroll: true });
    const center = () => {
      const card = heading?.closest(".active-question-region");
      if (!card) return;
      // The stepper can cross its sticky threshold during this scroll. Settle
      // against its actual position rather than assuming it was already pinned.
      for (let pass = 0; pass < 8; pass++) {
        const viewport = window.visualViewport;
        const top = Math.max(viewport?.offsetTop ?? 0, document.querySelector(".stage-navigation")?.getBoundingClientRect().bottom ?? 0) + 12;
        const bottom = (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight) - 12;
        const bounds = card.getBoundingClientRect();
        const target = top + Math.max(0, (bottom - top - bounds.height) / 2);
        if (Math.abs(bounds.top - target) < 1) break;
        // At the top of a short page there is no upward scroll available.
        // Supply only the missing space, rather than a fixed desktop gap.
        if (window.scrollY === 0 && bounds.top < target && grid) {
          grid.style.paddingTop = `${parseFloat(grid.style.paddingTop || "0") + target - bounds.top}px`;
          continue;
        }
        const before = window.scrollY;
        window.scrollBy({ top: bounds.top - target, behavior: "instant" });
        if (before === window.scrollY) break;
      }
    };
    center();
    // Recompute after scrolling has pinned the sticky stepper to its final position.
    const frame = requestAnimationFrame(center);
    let disposed = false;
    void document.fonts.ready.then(() => { if (!disposed && document.activeElement === heading) center(); });
    const resize = () => {
      const active = document.activeElement;
      if (active instanceof HTMLElement && active.matches("input, textarea, select")) active.scrollIntoView({block:"nearest",behavior:"instant"});
      else center();
    };
    window.visualViewport?.addEventListener("resize", resize);
    return () => { disposed = true; cancelAnimationFrame(frame); window.visualViewport?.removeEventListener("resize", resize); };
  }, [question.id]);
  return <div className="assessment-grid" data-first-question={index === 0}>
    <Progress />
    <section className="question-region min-w-0" aria-label="Questionnaire">
      <div className="question-toolbar flex flex-wrap items-center justify-between gap-3 text-small">
        <div className="progress-summary"><p>Question {index + 1} of {questions.length} · {questions.length - unanswered(session, questions).length} answered</p>
          <details className="navigation-help"><summary>Navigation help</summary><div className="navigation-help-content">
            <p>● Answered: an answer is saved. ○ Unanswered: no answer is saved. – Skipped: you explicitly chose Skip.</p>
            <p>Skipped and unanswered questions both remain missing, not zero. Orange brackets mark your current question.</p>
            <p>Hover or tap the rail to explore; use arrow keys to navigate and Enter to select.</p>
          </div></details>
        </div>
        <button type="button" className="text-link" onClick={() => dispatch({ type: "review" })}>Review all answers</button>
      </div>
      <div className="question-stage" key={question.id} data-category={question.category} data-direction={motion.direction} data-moving={motion.previous !== null}>
        <AdjacentCard question={questions[index - 1]} position="previous" />
        <div className="active-question-region">
          {motion.previous !== null && questions[motion.previous] && <div className="departing-card" aria-hidden="true" onAnimationEnd={() => setMotion(current => ({...current, previous: null}))}>
            <DepartingQuestion question={questions[motion.previous]!} raw={session.answers[questions[motion.previous]!.id] ?? ""}/>
          </div>}
          <article className="question-card" key={question.id}>
            <p className="category-label">{question.category} <span className="font-normal">/ {question.id}</span></p>
            <h1 ref={headingRef} tabIndex={-1} className="question-heading mt-3">{question.title}</h1>
            <p id="question-hint" className={question.hint === "Answer for your business, or skip if unknown. Blank answers remain unanswered." ? "sr-only" : "mt-3 text-muted"}>{question.hint}</p>
            <AnswerForm question={question} />
          </article>
        </div>
        <Progress mobileCard />
        <AdjacentCard question={questions[index + 1]} position="next" />
      </div>
    </section>
  </div>;
}

function Review() {
  const { session, dispatch, questions, saveWarning, catalog } = useAssessment();
  const router = useRouter();
  const sending = useRef(false);
  const [confirmPartial, setConfirmPartial] = useState(false);
  const [missingOnly, setMissingOnly] = useState(false);
  const confirmButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (confirmPartial) confirmButton.current?.focus(); }, [confirmPartial]);
  const [message, setMessage] = useState("");
  const missing = unanswered(session, questions);
  const legacySkipped = questions.filter(q => session.skipped.includes(q.id) && session.answers[q.id]?.trim());
  const invalid = legacySkipped.length > 0 || questions.some(q => session.answers[q.id]?.trim() && answerError(q, session.answers[q.id]));
  function generate() {
    if (sending.current || invalid || saveWarning) return;
    if (missing.length && !confirmPartial) { setConfirmPartial(true); return; }
    try {
      if(session.assessmentProfile){
        const model=createAssessmentModel(catalog.version,p=>selectedQuestions(catalog,p),p=>catalogProfileErrors(catalog,p));
        const next=model.assessmentReducer(session,{type:"generate"});
        const warning=browserSession(model.sessionSchema).save(next);
        if(warning || next.progress!==4){setMessage(warning??"Review your Quick answers first.");return;}
        sending.current=true;dispatch({type:"generate"});router.push("/quick-results");return;
      }
      const input = recommendationRequestFromSession(session);
      const model = createAssessmentModel(catalog.version, p => selectedQuestions(catalog, p), p => catalogProfileErrors(catalog, p));
      const next = model.assessmentReducer(session, { type: "generate" });
      const warning = browserSession(model.sessionSchema).save(next);
      if (next.progress !== 4 || warning) { setMessage(warning ?? "Review your assessment before generating results."); return; }
      sending.current = true;
      dispatch({ type: "generate" });
      authorizeResultsGeneration(input);
      router.push("/results");
    } catch { setMessage("Review your assessment before generating results."); }
  }
  return <section className="assessment-setup">
    <span className="section-label">Review / Your answers</span>
    <StageHeading>Review your answers.</StageHeading>
    <p className="mt-4">{questions.length - missing.length} answered · {missing.length} unanswered questions.</p>
    <details className="review-missing-note mt-2 text-small"><summary>What missing answers do</summary><p className="text-muted">Missing answers stay missing; they are never treated as zero. Scores use the available answers. Coverage shows how much of the assessment you supplied.</p></details>
    <p className="mt-3 text-small">{session.assessmentProfile ? "Quick subset scores cover a smaller question set and are not directly comparable with Full. No AI request is made." : "Your business context, answers and selected source passages are sent to AI to generate recommendations."}</p>
    {invalid && <p role="alert" className="mt-4">Correct or clear invalid answers before generating results.</p>}
    {legacySkipped.length > 0 && <div className="storage-warning mt-4"><p>These previously skipped questions still contain saved answers from the older Skip behavior. Revisit each one and choose Skip to clear it, or confirm your answer. Original saved values have been preserved for your review.</p><ul>{legacySkipped.map(q => <li key={q.id}><button className="text-link" onClick={() => dispatch({type:"jump",id:q.id})}>{q.id}: {q.title}</button></li>)}</ul></div>}
    {message && <p role="alert">{message}</p>}
    {confirmPartial ? <div className="preview-notice mt-6" role="group" aria-label="Confirm partial assessment">
      <p role="status">{missing.length} questions are unanswered. {session.assessmentProfile ? "Quick subset scores will use the available Quick answers." : "Scores and recommendations will be based only on the available answers."}</p>
      <div className="mt-4 flex flex-wrap gap-4"><button ref={confirmButton} type="button" className="button-primary" disabled={invalid || Boolean(saveWarning)} onClick={generate}>{session.assessmentProfile ? "View Quick subset scores anyway" : "Generate score and recommendations anyway"}</button><button type="button" className="button-secondary" onClick={() => setConfirmPartial(false)}>Keep reviewing</button></div>
    </div> : <button type="button" className="button-primary mt-6" disabled={invalid || Boolean(saveWarning)} onClick={generate}>{session.assessmentProfile ? "View Quick subset scores" : "Generate score and recommendations"}</button>}
    <CalculatorProvenance />
    <div className="review-filters mt-6" role="group" aria-label="Filter answer review">
      <button type="button" className="button-secondary" aria-pressed={!missingOnly} onClick={() => setMissingOnly(false)}>All answers ({questions.length})</button>
      <button type="button" className="button-secondary" aria-pressed={missingOnly} onClick={() => setMissingOnly(true)}>Skipped / unanswered ({missing.length})</button>
    </div>
    <p className="mt-3 text-small" role="status">{missingOnly ? missing.length + " skipped or unanswered questions. Select a question to revisit it." : "Showing all questions. Select a question to review or edit it."}</p>
    <ul className="my-8 grid gap-3">
      {questions.map((question, i) => (!missingOnly || missing.some(item => item.id === question.id)) && <li key={question.id} className="review-row">
        <button type="button" className="text-link text-left" onClick={() => dispatch({ type: "jump", id: question.id })}>{i + 1}. {question.title}</button>
        <p className="text-small">{progressLabel(session, question)}</p>
        {session.answers[question.id] && <p className="text-small text-muted break-words">Your entry: {displayAnswer(session.answers[question.id]!, question.unit)}</p>}
      </li>)}
    </ul>
    {missing.length > 0 && <button type="button" className="button-secondary" onClick={() => dispatch({ type: "review-missing" })}>Review missing answers</button>}
  </section>;
}

function Boundary() {
  const { dispatch } = useAssessment();
  return <section className="assessment-setup">
    <span className="section-label">Deterministic scoring / Research build</span>
    <StageHeading>Your answers are ready for calculation.</StageHeading>
    <p className="mt-6 text-muted">The results page submits your raw answers and selection context to this application’s server to calculate scores from the canonical configuration. Answers are not stored on the server. AI recommendations require an explicit generation request and must pass validation.</p>
    <div className="flex flex-wrap gap-4 mt-8"><button type="button" className="button-secondary" onClick={() => dispatch({ type: "review" })}>Return to answer review</button><Link href="/results" className="button-primary">View calculated results</Link></div>
  </section>;
}

function Flow() {
  const router = useRouter();
  const { ready, session, dispatch, catalog, restoreWarning, saveWarning } = useAssessment();
  return <>
    <a href="#assessment-main" className="skip-link">Skip to assessment</a>
    <header className="page-container flex flex-wrap items-center justify-between gap-4 py-6">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Full navigation avoids restored/combined homepage fragments; sessionStorage is preserved. */}
      <a className="nav-link inline-flex items-center gap-2" href="/#top"><span aria-hidden="true">←</span><Image src="/brand/mosaic-mark-straight.svg" alt="" width={24} height={24} />MOSAIC home</a>
      {ready && session.phase !== "setup" && <button className="text-link" type="button" onClick={() => dispatch({ type: "edit-setup" })}>Edit business context</button>}
    </header>
    <main id="assessment-main" tabIndex={-1} className="page-container pb-12">
      {ready && <StageNavigation session={session} catalog={catalog} onStage={action=>{if(action==="results"){if(session.progress === 4 && !saveWarning)router.push(session.assessmentProfile?"/quick-results":"/results");}else dispatch(action);}}/>}
      {ready && session.assessmentProfile && <div className="preview-notice mb-4"><p><strong>Quick assessment</strong>{session.assessmentProfile.questionIds.length ? ` · ${session.assessmentProfile.questionIds.length} questions` : " · question count follows business Setup"}</p><p>Shared answers are retained when you continue to Full.</p><button className="button-secondary mt-3" onClick={()=>{
        const model=createAssessmentModel(catalog.version,p=>selectedQuestions(catalog,p),p=>catalogProfileErrors(catalog,p));
        const warning=browserSession(model.sessionSchema).save(model.assessmentReducer(session,{type:"continue-full"}));
        if(!warning)router.push("/assessment");
      }}>Continue to Full assessment</button></div>}
      <details className="assessment-context-note text-small"><summary>About this assessment</summary>
        <p>{saveWarning ? "Progress cannot currently be saved in this tab." : "Your progress is saved in this tab."} Answer what you know; you can revisit missing answers.</p>
        <p>Scores use the answers you provide. This is a research assessment, not certification.</p>
      </details>
      {restoreWarning && <p role="alert" className="storage-warning mb-4">{restoreWarning}</p>}
      {saveWarning && <p role="alert" className="storage-warning mb-4">{saveWarning}</p>}
      {!ready ? <p role="status">Restoring this tab’s assessment…</p> : <>
        {session.phase === "setup" && <Setup />}
        {session.phase === "method" && <InputMethod />}
        {session.phase === "questions" && <Questionnaire />}
        {session.phase === "review" && <Review />}
        {session.phase === "boundary" && <Boundary />}
      </>}
    </main>
  </>;
}
export function AssessmentFlow({ catalog, quick=false }: { catalog: AssessmentCatalog; quick?:boolean }) {
  return <AssessmentProvider catalog={catalog} quick={quick}><Flow /></AssessmentProvider>;
}
