"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ProgressNavigator } from "./progress-navigator";
import { AssessmentProvider, useAssessment, catalogProfileErrors } from "./assessment-context";
import { answerError, profileFields, progressLabel, unanswered, type ProfileKey } from "./model";
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
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const first = profileFields.find((field) => errors[field.key]);
    if (first) {
      const control = event.currentTarget.elements.namedItem(first.key);
      if (control instanceof HTMLElement) control.focus();
      return;
    }
    dispatch({ type: "method" });
  }
  return (
    <section className="assessment-setup">
      <span className="section-label">01 / Business context</span>
      <StageHeading>Tell us about your business.</StageHeading>
      <p className="mt-4 text-muted">Use example information to explore the flow. Fields marked required must be completed; subindustry is optional.</p>
      <form className="mt-8" noValidate onSubmit={submit}>
        {submitted && Object.keys(errors).length > 0 && <p role="alert" className="form-error mb-6">Please check the highlighted fields before continuing.</p>}
        <div className="grid gap-6 md:grid-cols-2">
          {profileFields.map((field) => {
            const error = submitted ? errors[field.key] : undefined;
            const id = "profile-" + field.key;
            return <div key={field.key} className={field.key === "businessGoal" ? "md:col-span-2" : ""}>
              <label htmlFor={id} className="field-label">{field.label} <span className="text-small font-normal text-muted">({field.required ? "required" : "optional"})</span></label>
              <p id={id + "-hint"} className="mb-2 text-small text-muted">{field.hint}</p>
              {["industry", "location", "targetMarket"].includes(field.key) ? <select id={id} name={field.key} className="field-control"
                required={field.required} multiple={field.key === "targetMarket"}
                value={field.key === "targetMarket" ? session.profile.targetMarket.split(";").filter(Boolean) : session.profile[field.key]}
                aria-invalid={Boolean(error)} aria-describedby={id + "-hint" + (error ? " " + id + "-error" : "")}
                onChange={event => dispatch({ type: "profile", field: field.key, value: field.key === "targetMarket" ? Array.from(event.currentTarget.selectedOptions, option => option.value).join(";") : event.target.value })}>
                {field.key !== "targetMarket" && <option value="">Choose one</option>}
                {(field.key === "industry" ? catalog.industries : catalog.regions).map(value => <option key={value} value={value}>{value}</option>)}
              </select> : <input id={id} name={field.key} className="field-control" type="text"
                inputMode={field.key === "companySize" ? "numeric" : "text"}
                autoComplete={field.key === "companyName" ? "organization" : "off"}
                required={field.required} maxLength={field.key === "businessGoal" ? 1000 : 200}
                value={session.profile[field.key]} aria-invalid={Boolean(error)}
                aria-describedby={id + "-hint" + (error ? " " + id + "-error" : "")}
                onChange={(event) => dispatch({ type: "profile", field: field.key as ProfileKey, value: event.target.value })} />}
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

function Progress() {
  const { session, dispatch, questions } = useAssessment();
  const items = questions.map((question, index) => ({
    id: question.id, number: index + 1, title: question.title, category: question.category,
    status: progressLabel(session, question), current: session.activeId === question.id,
  }));
  return <ProgressNavigator items={items} onSelect={(id) => {
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
    advanceTimer.current = setTimeout(() => dispatch({ type: "next" }), 280);
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
  if (!question) return <div className="question-peek-boundary text-small text-muted">{position === "previous" ? "Your business context is ready." : "Next: review your unanswered questions."}</div>;
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
  return <div className="assessment-grid">
    <Progress />
    <section className="min-w-0" aria-label="Questionnaire">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-small">
        <p>Question {index + 1} of {questions.length}</p>
        <button type="button" className="text-link" onClick={() => dispatch({ type: "review" })}>Review all answers</button>
      </div>
      <div className="question-stage" key={question.id} data-category={question.category} data-direction={motion.direction}>
        <AdjacentCard question={questions[index - 1]} position="previous" />
        <article className="question-card" key={question.id}>
          <p className="category-label">{question.category} <span className="font-normal">/ {question.id}</span></p>
          <h1 ref={headingRef} tabIndex={-1} className="mt-4 text-subheading">{question.title}</h1>
          <p id="question-hint" className="mt-4 text-muted">{question.hint}</p>
          <AnswerForm question={question} />
        </article>
        <AdjacentCard question={questions[index + 1]} position="next" />
      </div>
    </section>
  </div>;
}

function Review() {
  const { session, dispatch, questions } = useAssessment();
  const missing = unanswered(session, questions);
  return <section className="assessment-setup">
    <span className="section-label">Review / Your answers</span>
    <StageHeading>Review your answers.</StageHeading>
    <p className="mt-4">{missing.length} unanswered {missing.length === 1 ? "question" : "questions"}.</p>
    <p className="mt-2 text-muted">Blank or invalid entries stay unanswered. They are never treated as zero.</p>
    <ul className="my-8 grid gap-3">
      {questions.map((question, i) => <li key={question.id} className="review-row">
        <button type="button" className="text-link text-left" onClick={() => dispatch({ type: "jump", id: question.id })}>{i + 1}. {question.title}</button>
        <p className="text-small">{progressLabel(session, question)}</p>
        {session.answers[question.id] && <p className="text-small text-muted break-words">Your entry: {session.answers[question.id]}</p>}
      </li>)}
    </ul>
    <p className="mb-4 text-small text-muted">This preview cannot generate a score. The next action only opens an explanation of this boundary.</p>
    <div className="flex flex-wrap gap-4">
      {missing.length > 0 && <button type="button" className="button-secondary" onClick={() => dispatch({ type: "review-missing" })}>Review missing answers</button>}
      <button type="button" className="button-primary" onClick={() => dispatch({ type: "boundary" })}>{missing.length > 0 ? "Generate score anyway" : "Continue to preview boundary"}</button>
    </div>
  </section>;
}

function Boundary() {
  const { dispatch } = useAssessment();
  return <section className="assessment-setup">
    <span className="section-label">Non-production preview boundary</span>
    <StageHeading>Preview complete — no score generated.</StageHeading>
    <p className="mt-6 text-muted">These questions come from the preserved canonical configuration. Scoring is not available, and your answers have not been submitted to a server. You can explore a separate results layout with fixed mock data; it does not use your answers.</p>
    <div className="flex flex-wrap gap-4 mt-8"><button type="button" className="button-secondary" onClick={() => dispatch({ type: "review" })}>Return to answer review</button><Link href="/results" className="button-primary">View mock results preview</Link></div>
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
        <p className="text-small">Canonical questions · No score or recommendations. Use example data. Entries stay in this browser tab’s session; they are not sent to a server.</p>
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
