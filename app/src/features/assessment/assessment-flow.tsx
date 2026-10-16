"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authorizeResultsGeneration } from "../../application/recommendations/generation-intent";
import { recommendationRequestFromSession } from "../../application/recommendations/request";
import { NOTES_MAX_LENGTH } from "../../application/assessment-notes";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { MobileQuestionRail, ProgressNavigator } from "./progress-navigator";
import { AssessmentProvider, useAssessment, catalogProfileErrors } from "./assessment-context";
import { answerError, profileFields, progressLabel, unanswered, type ProfileKey } from "./model";
import { marketValues, toggleMarket } from "../../application/assessment-setup";
import type { AssessmentCatalog, Question } from "../../application/assessment-catalog";

function StageHeading({ children }: { children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return <h1 ref={ref} tabIndex={-1} className="text-heading">{children}</h1>;
}

function Setup() {
  const { session, dispatch, catalog } = useAssessment();
  const [submitted, setSubmitted] = useState(false);
  const errors = catalogProfileErrors(catalog, session.profile);
  const markets = marketValues(session.profile.targetMarket);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const first = profileFields.find((field) => errors[field.key]);
    if (first) {
      const control = first.key === "targetMarket" ? event.currentTarget.querySelector<HTMLInputElement>('[name="targetMarket"]') : event.currentTarget.elements.namedItem(first.key);
      if (control instanceof HTMLElement) control.focus();
      return;
    }
    dispatch({ type: "method" });
  }
  return (
    <section className="assessment-setup">
      <span className="section-label">01 / Business context</span>
      <StageHeading>Tell us about your business.</StageHeading>
      <p className="mt-4 text-muted">Use example information to explore the flow. Fields marked required must be completed; subindustry and additional context are optional.</p>
      <form className="mt-8" noValidate onSubmit={submit}>
        {submitted && Object.keys(errors).length > 0 && <p role="alert" className="form-error mb-6">Please check the highlighted fields before continuing.</p>}
        <div className="grid gap-6 md:grid-cols-2">
          {profileFields.map((field) => {
            const error = submitted ? errors[field.key] : undefined;
            const id = "profile-" + field.key;
            if (field.key === "targetMarket") return <fieldset key={field.key} className="market-field" aria-describedby={id + "-hint" + (error ? " " + id + "-error" : "")} aria-invalid={Boolean(error)}>
              <legend className="field-label">Target markets <span className="text-small font-normal text-muted">(required)</span></legend>
              <p id={id + "-hint"} className="mb-2 text-small text-muted">{field.hint}</p>
              <div className="market-choices">
                {catalog.setupOptions.targetMarket.map(option => <label key={option.value} className="market-choice">
                  <input type="checkbox" name="targetMarket" value={option.value} checked={markets.includes(option.value)}
                    disabled={markets.length === 2 && !markets.includes(option.value)}
                    onChange={() => dispatch({ type: "profile", field: "targetMarket", value: toggleMarket(session.profile.targetMarket, option.value) })} />
                  <span>{option.label}</span>
                </label>)}
              </div>
              <div className="mt-3 text-small" role="status" aria-live="polite">
                {markets.length === 0 ? <p>No target markets selected.</p> : <ol className="grid gap-2">
                  {markets.map((market, index) => <li key={market} className="flex items-center justify-between gap-2">
                    <span>{index === 0 ? "Primary" : "Secondary"}: {market}</span>
                    <button type="button" className="text-link" aria-label={"Remove " + market} onClick={() => dispatch({ type: "profile", field: "targetMarket", value: toggleMarket(session.profile.targetMarket, market) })}>Remove</button>
                  </li>)}
                </ol>}
                {markets.length === 2 && <p className="mt-2 text-muted">Two markets selected. Deselect one to choose another.</p>}
              </div>
              {error && <p id={id + "-error"} className="form-error mt-2">{error}</p>}
            </fieldset>;
            return <div key={field.key}>
              <label htmlFor={id} className="field-label">{field.label} <span className="text-small font-normal text-muted">({field.required ? "required" : "optional"})</span></label>
              <p id={id + "-hint"} className="mb-2 text-small text-muted">{field.hint}</p>
              {field.key === "notes" ? <textarea id={id} name={field.key} className="field-control" rows={4}
                maxLength={NOTES_MAX_LENGTH} value={session.profile.notes} aria-invalid={Boolean(error)}
                aria-describedby={id + "-hint" + (error ? " " + id + "-error" : "")}
                onChange={event => dispatch({ type: "profile", field: "notes", value: event.target.value })} />
                : field.key !== "companyName" && field.key !== "subindustry" ? <select id={id} name={field.key} className="field-control"
                required value={session.profile[field.key]} aria-invalid={Boolean(error)}
                aria-describedby={id + "-hint" + (error ? " " + id + "-error" : "")}
                onChange={event => dispatch({ type: "profile", field: field.key, value: event.target.value })}>
                <option value="">Choose one</option>
                {catalog.setupOptions[field.key].map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select> : <input id={id} name={field.key} className="field-control" type="text"
                autoComplete={field.key === "companyName" ? "organization" : "off"} required={field.required} maxLength={200}
                value={session.profile[field.key]} aria-invalid={Boolean(error)}
                aria-describedby={id + "-hint" + (error ? " " + id + "-error" : "")}
                onChange={event => dispatch({ type: "profile", field: field.key as ProfileKey, value: event.target.value })} />}
              {error && <p id={id + "-error"} className="form-error mt-2">{error}</p>}
            </div>;
          })}
        </div>
        <button className="button-primary mt-8" type="submit">Continue to input method <span aria-hidden="true">→</span></button>
      </form>
    </section>
  );
}

function InputMethod() {
  const { dispatch, questions } = useAssessment();
  return <section className="assessment-setup">
    <span className="section-label">02 / Quantitative data</span>
    <StageHeading>How would you like to enter your quantitative sustainability data?</StageHeading>
    <fieldset className="mt-8 grid gap-4">
      <legend className="sr-only">Quantitative-data input method</legend>
      <label className="choice-option"><input type="radio" name="method" value="manual" defaultChecked /> <span>Enter manually<span className="block text-small text-muted">Available. Enter example values directly in the questionnaire.</span></span></label>
      <label className="choice-option unavailable"><input type="radio" name="method" value="calculator" disabled /> <span>Use emissions calculator<span className="block text-small text-muted">Unavailable · planned for a later milestone.</span></span></label>
      <label className="choice-option unavailable"><input type="radio" name="method" value="upload" disabled /> <span>Upload utility bills/evidence<span className="block text-small text-muted">Unavailable · future stretch capability.</span></span></label>
    </fieldset>
    <div className="mt-8 flex flex-wrap gap-4">
      <button className="button-secondary" type="button" onClick={() => dispatch({ type: "edit-setup" })}>Back to setup</button>
      {questions.length === 0 && <p role="alert">No questions match this context. Review your setup; no fallback questionnaire has been substituted.</p>}
      <button className="button-primary" type="button" disabled={questions.length === 0} onClick={() => dispatch({ type: "start" })}>Start questionnaire</button>
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
    dispatch({ type: "answer", id: question.id, raw: value });
    advanceTimer.current = setTimeout(() => dispatch({ type: "next" }), 800);
  }
  const raw = session.answers[question.id] ?? "";
  const error = attempted ? answerError(question, raw) : undefined;
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const index = questions.findIndex((q) => q.id === question.id);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    cancelAdvance();
    setAttempted(true);
    if (answerError(question, raw)) { inputRef.current?.focus(); return; }
    dispatch({ type: "next" });
  }
  function change(value: string) { cancelAdvance(); dispatch({ type: "answer", id: question.id, raw: value }); }
  return <form noValidate onSubmit={submit} className="mt-6" onKeyDownCapture={cancelAdvance} onPointerDownCapture={cancelAdvance}>
    {"options" in question ? <fieldset aria-describedby={"question-hint" + (error ? " answer-error" : "")}>
      <legend className="field-label">Your answer</legend>
      <div className="grid gap-3">
        {question.options.map((option, i) => <label key={option} className="choice-option">
          <input type="radio" name="answer" value={option} checked={raw === option}
            ref={i === 0 ? (node) => { inputRef.current = node; } : undefined}
            onChange={() => dispatch({ type: "answer", id: question.id, raw: option })}
            onClick={(event) => { if (event.detail > 0) pointerChoice(option); }}
            onKeyDown={(event) => {
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
    <p className="mt-4 text-small text-muted">{"options" in question ? "Click or tap an answer to continue automatically. With a keyboard, choose with arrows or Space, then press Enter or Continue." : "Enter an answer, then continue."} You can revisit any question.</p>
    <div className="mt-6 flex flex-wrap gap-3">
      <button type="button" className="button-secondary" disabled={index === 0} onClick={() => dispatch({ type: "back" })}>Previous</button>
      <button type="submit" className="button-primary">{index === questions.length - 1 ? "Review answers" : "Continue"}</button>
      <button type="button" className="button-secondary" onClick={() => dispatch({ type: "skip" })}>Skip</button>
      {raw !== "" && <button type="button" className="text-link" onClick={() => change("")}>Clear answer</button>}
    </div>
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

function Questionnaire() {
  const { session, dispatch, questions } = useAssessment();
  const question = questions.find((q) => q.id === session.activeId)!;
  const index = questions.indexOf(question);
  const [motion, setMotion] = useState({ index, direction: "forward" });
  if (motion.index !== index) setMotion({ index, direction: index < motion.index ? "backward" : "forward" });
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const heading = headingRef.current;
    heading?.focus({ preventScroll: true });
    const card = heading?.closest("article");
    card?.scrollIntoView({ block: card.clientHeight < window.innerHeight - 32 ? "center" : "start", behavior: "instant" });
  }, [question.id]);
  return <div className="assessment-grid" data-first-question={index === 0}>
    <Progress />
    <section className="question-region min-w-0" aria-label="Questionnaire">
      <div className="question-toolbar flex flex-wrap items-center justify-between gap-3 text-small">
        <p>Question {index + 1} of {questions.length}</p>
        <button type="button" className="text-link" onClick={() => dispatch({ type: "review" })}>Review all answers</button>
      </div>
      <div className="question-stage" key={question.id} data-category={question.category} data-direction={motion.direction}>
        <AdjacentCard question={questions[index - 1]} position="previous" />
        <div className="active-question-region">
          <article className="question-card" key={question.id}>
            <p className="category-label">{question.category} <span className="font-normal">/ {question.id}</span></p>
            <h1 ref={headingRef} tabIndex={-1} className="mt-4 text-subheading">{question.title}</h1>
            <p id="question-hint" className="mt-4 text-muted">{question.hint}</p>
            <AnswerForm question={question} />
          </article>
          <Progress mobileCard />
        </div>
        <AdjacentCard question={questions[index + 1]} position="next" />
      </div>
    </section>
  </div>;
}

function Review() {
  const { session, dispatch, questions, saveWarning } = useAssessment();
  const router = useRouter();
  const sending = useRef(false);
  const [confirmPartial, setConfirmPartial] = useState(false);
  const confirmButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (confirmPartial) confirmButton.current?.focus(); }, [confirmPartial]);
  const [message, setMessage] = useState("");
  const missing = unanswered(session, questions);
  const invalid = questions.some(q => session.answers[q.id]?.trim() && answerError(q, session.answers[q.id]));
  function generate() {
    if (sending.current || invalid || saveWarning) return;
    if (missing.length && !confirmPartial) { setConfirmPartial(true); return; }
    try {
      const input = recommendationRequestFromSession(session);
      sending.current = true;
      authorizeResultsGeneration(input);
      router.push("/results");
    } catch { setMessage("Review your assessment before generating results."); }
  }
  return <section className="assessment-setup">
    <span className="section-label">Review / Your answers</span>
    <StageHeading>Review your answers.</StageHeading>
    <p className="mt-4">{questions.length - missing.length} answered · {missing.length} unanswered questions.</p>
    <p className="mt-2 text-muted">Missing answers stay missing; they are never treated as zero. Recommendations use your assessment and supplied evidence and require human review.</p>
    <p className="mt-3 text-small">This action calculates scores and requests AI recommendations from the configured provider. Your business context, answers and source excerpts are sent for generation.</p>
    {invalid && <p role="alert" className="mt-4">Correct or clear invalid answers before generating results.</p>}
    {message && <p role="alert">{message}</p>}
    {confirmPartial ? <div className="preview-notice mt-6" role="group" aria-label="Confirm partial assessment">
      <p role="status">{missing.length} questions are unanswered. Scores and recommendations will be based only on the available answers.</p>
      <div className="mt-4 flex flex-wrap gap-4"><button ref={confirmButton} type="button" className="button-primary" disabled={invalid || Boolean(saveWarning)} onClick={generate}>Generate score and recommendations anyway</button><button type="button" className="button-secondary" onClick={() => setConfirmPartial(false)}>Keep reviewing</button></div>
    </div> : <button type="button" className="button-primary mt-6" disabled={invalid || Boolean(saveWarning)} onClick={generate}>Generate score and recommendations</button>}
    <ul className="my-8 grid gap-3">
      {questions.map((question, i) => <li key={question.id} className="review-row">
        <button type="button" className="text-link text-left" onClick={() => dispatch({ type: "jump", id: question.id })}>{i + 1}. {question.title}</button>
        <p className="text-small">{progressLabel(session, question)}</p>
        {session.answers[question.id] && <p className="text-small text-muted break-words">Your entry: {session.answers[question.id]}</p>}
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
  const { ready, session, dispatch, restoreWarning, saveWarning } = useAssessment();
  return <>
    <a href="#assessment-main" className="skip-link">Skip to assessment</a>
    <header className="page-container flex flex-wrap items-center justify-between gap-4 py-6">
      <Link className="nav-link" href="/">← Capstone home</Link>
      {ready && session.phase !== "setup" && <button className="text-link" type="button" onClick={() => dispatch({ type: "edit-setup" })}>Edit business context</button>}
    </header>
    <main id="assessment-main" tabIndex={-1} className="page-container pb-12">
      <div className="preview-notice mb-6">
        <p className="font-semibold">Assessment interaction preview</p>
        <p className="text-small">Canonical questions and deterministic scores · Research build. Entries are saved in this browser tab. Opening results sends answers and selection context to this application’s server for calculation without server persistence. AI recommendations require an explicit generation request.</p>
      </div>
      {restoreWarning && <p role="alert" className="storage-warning mb-4">{restoreWarning}</p>}
      {saveWarning && <p role="alert" className="storage-warning mb-4">{saveWarning}</p>}
      {!ready ? <p role="status">Restoring this tab’s assessment…</p> : <>
        <p className="mb-4 text-small text-muted">{saveWarning ? "Session saving unavailable." : "Session saving enabled for this tab."}</p>
        {session.phase === "setup" && <Setup />}
        {session.phase === "method" && <InputMethod />}
        {session.phase === "questions" && <Questionnaire />}
        {session.phase === "review" && <Review />}
        {session.phase === "boundary" && <Boundary />}
      </>}
    </main>
  </>;
}
export function AssessmentFlow({ catalog }: { catalog: AssessmentCatalog }) {
  return <AssessmentProvider catalog={catalog}><Flow /></AssessmentProvider>;
}
