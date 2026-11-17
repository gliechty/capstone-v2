"use client";
import { useRef, type ReactNode } from "react";
import { BudgetLimitDialog, budgetLimitMessage } from "./budget-limit-dialog";
import { EVIDENCE_DISCLOSURE } from "../../application/recommendations/evidence-disclosure";
import Link from "next/link";
import type { RecommendationView } from "../../application/recommendations/controller";
import { RecommendationLoading } from "./recommendation-loading";
import { ResultsDisclosure } from "./results-disclosure";
import { Bibliography, Information, Sources } from "./evidence-controls";
const messages: Record<string, string> = {
  budget_exhausted: budgetLimitMessage,
  budget_unavailable: "The server spending control is unavailable. No generation was started.",
  local_only: "Hosted generation is not configured. Deterministic scores remain available.",
  not_generated: "Recommendations have not been generated. Generation sends this assessment context, answers and retrieved source excerpts to the configured AI provider.",
  no_assessment: "Complete or restore an assessment in this tab before generating recommendations.",
  provider_not_configured: "Recommendation generation is disabled. Deterministic scores remain available.",
  offline_tests: "Recommendation generation is disabled in offline verification.",
  credentials_missing: "The server has no configured provider credentials. Deterministic scores remain available.",
  configuration_invalid: "Provider settings are invalid. Ask the local operator to review configuration.",
  configuration_unavailable: "Recommendation configuration is unavailable. Retry after checking the local server.",
  configuration_changed: "Configuration changed. Generate again using the current settings.",
  generating: "Generating recommendations…",
  cancelled: "Stopped waiting for recommendations. The provider may still finish or charge for the request. Retry explicitly to make a new request.",
  interrupted: "The previous request was interrupted and its result could not be recovered. Its provider outcome is unknown. Scores remain available; retry explicitly to make a new request.",
  timeout: "The server generation deadline was exceeded. No recommendations were accepted. Scores remain available; you can retry explicitly.",
  client_timeout: "The browser stopped waiting after 45 seconds. The server/provider outcome is unknown; it may still finish or charge. Scores remain available. Retry only if you want to make another request.",
  authentication_failed: "The provider rejected its credentials. Check the server configuration.",
  quota_exceeded: "Provider quota is exhausted. No recommendations were accepted.",
  rate_limited: "The request was rate limited. Wait a minute before retrying.",
  busy: "Another generation is running. Wait for it to finish before retrying.",
  refused: "The provider declined this request. No recommendations were accepted.",
  incomplete_output: "The provider returned incomplete output. No recommendations were accepted.",
  invalid_output: "Generated advice could not be displayed because its JSON, required structure or source-link format was invalid. Nothing has been repaired.",
  invalid_response: "The provider returned an invalid response. No recommendations were accepted.",
  no_answers: "Answer at least one question before generating recommendations.",
  insufficient_evidence: "There is insufficient usable source evidence for recommendations.",
  prompt_too_large: "This assessment exceeds the generation input limit.",
  stale_response: "This response no longer matches the assessment or generation settings. Generate again.",
};
export type PresentationView = Omit<RecommendationView, "result"> & { result?: Pick<NonNullable<RecommendationView["result"]>, "content" | "evidence" | "identity"> };
export function RecommendationPresentation({view,generate,cancel,children,synthetic=false}:{view:PresentationView;generate:()=>void;cancel:()=>void;children?:ReactNode;synthetic?:boolean}) {
  const generateButton = useRef<HTMLButtonElement>(null);
  const content = view.result?.content;
  const citations = [...(content?.priority_recommendations.flatMap(r => r.evidence) ?? []), ...(content?.key_gaps.flatMap(g => g.evidence) ?? [])];
  const unique = citations.filter((c, i) => citations.findIndex(other => JSON.stringify(c) === JSON.stringify(other)) === i);
  return <>
    {children}
    <BudgetLimitDialog blocked={view.code === "budget_exhausted"} returnFocus={generateButton}/>
    <section id="summary" tabIndex={-1} className="results-section summary-section" aria-labelledby="summary-heading">
      <span className="section-label">01 / Read the picture</span><h2 id="summary-heading" className="text-heading">Executive summary</h2>
      <div className="mt-6 flex flex-wrap gap-4">
        <button id="recommendation-generation" ref={generateButton} className={content ? "button-secondary" : "button-primary"} disabled={view.phase === "loading" || !view.configuration?.ready || view.code === "no_assessment"} onClick={generate}>
          {content ? "Regenerate recommendations" : view.phase === "unavailable" || view.code === "cancelled" ? "Retry recommendations" : "Generate recommendations"}
        </button>
        {view.phase === "loading" && <button className="button-secondary" onClick={cancel}>Cancel generation</button>}
      </div>
      {view.phase === "loading" ? <RecommendationLoading/> : <p className="mt-4" role="status">{synthetic ? (content ? "Synthetic examples ready — not AI advice." : view.code === "cancelled" ? "Simulation cancelled locally. No provider request was made." : view.code === "interrupted" ? "Simulation interrupted. Retry explicitly; no provider request was made." : view.code === "not_generated" ? "Choose a scenario, then generate synthetic examples. No data leaves this preview." : messages[view.code] ?? "Simulated error. Retry explicitly; scores remain available.") : view.code === "budget_exhausted" ? budgetLimitMessage : content ? "Recommendations ready." : messages[view.code] ?? "Recommendations are unavailable. Review the assessment or retry explicitly; deterministic scores remain available."}</p>}
      {view.storageWarning && <p role="status" className="mt-4">{view.storageWarning}</p>}
      {content && <p className="mt-6 results-prose">{content.executive_summary}</p>}
      {view.diagnostics && <Information label="Last generation failure details"><p>Failure code: {view.code}. Application time: {(view.diagnostics.totalMs / 1000).toFixed(2)} s; provider phase: {(view.diagnostics.providerMs / 1000).toFixed(2)} s.</p>
        {view.diagnostics.timeoutStage && <p>Deadline stage: {view.diagnostics.timeoutStage}.</p>}
        {view.diagnostics.headersMs !== undefined && <p>Response headers: {(view.diagnostics.headersMs / 1000).toFixed(2)} s.</p>}
        {view.diagnostics.bodyMs !== undefined && <p>Response body: {(view.diagnostics.bodyMs / 1000).toFixed(2)} s.</p>}
        {view.diagnostics.issues.length > 0 && <p>Validation: {[...new Set(view.diagnostics.issues)].join(", ")}.</p>}
        <p>These details do not contain your answers, prompts or rejected advice.</p></Information>}
      {view.configuration?.settings && <Information label="Generation details"><p>Provider: {view.configuration.settings.provider} · Model: {view.configuration.settings.model} · Reasoning: {view.configuration.settings.reasoning}. Generation happens only when requested.</p><p>Required response structure and safe source-link format are checked. Generated scores, citations and claims are not independently verified; the calculated scores above remain authoritative.</p></Information>}
    </section>
    <ResultsDisclosure id="gaps" title={content ? "Key gaps (" + content.key_gaps.length + ")" : "Key gaps — unavailable"} identity={view.result?.identity.inputId}>
      {!content ? <p className="mt-4 text-muted">No generated AI gap analysis is available. This does not mean there are no gaps. Calculated category scores above remain available independently.</p> : <div className="gap-grid mt-8">{content.key_gaps.map((g, i) => <article className="gap-card" key={i}><span className="category-badge">{g.category}</span><h3 className="text-subheading mt-3">{g.gap}</h3><Sources citations={g.evidence} label={g.gap} /></article>)}</div>}
    </ResultsDisclosure>
    <ResultsDisclosure id="actions" title={content ? "Recommended actions (" + content.priority_recommendations.length + ")" : "Recommended actions — unavailable"} identity={view.result?.identity.inputId}>
      {!content ? <p className="mt-4 text-muted">No generated recommendations are available for this assessment.</p> : <ol className="action-list mt-8">{content.priority_recommendations.map((r, i) => <li key={i}><span className="action-number">{r.priority_rank}</span><article><div className="action-badges">{r.related_categories.map((category, i)=><span className="category-badge" key={i}>{category}</span>)}<span className={"difficulty-badge difficulty-" + r.implementation_difficulty.toLowerCase()}>Difficulty: {r.implementation_difficulty === "High" ? "Hard" : r.implementation_difficulty}</span></div><h3 className="text-subheading mt-3">{r.title}</h3><p className="mt-4">{r.why_it_matters}</p><p className="mt-3"><strong>Action:</strong> {r.recommended_action}</p><Sources citations={r.evidence} label={r.title} /></article></li>)}</ol>}
    </ResultsDisclosure>
    <ResultsDisclosure id="sources" title="Evidence & sources" identity={view.result?.identity.inputId}>
      <div className="evidence-layout"><section><h3 className="text-subheading">How recommendations use evidence</h3><p className="mt-3 results-prose">{synthetic ? "This preview displays authored synthetic references solely to review source dialogs and bibliography layout. It does not run retrieval or validate claim support. Live application behavior: " : ""}MOSAIC uses retrieval-augmented generation (RAG): it selects relevant excerpts from its configured source library and supplies them to the AI alongside your business context, answered questions and calculated scores. The AI uses this material to draft recommendations. Scores are calculated separately. Source references let you inspect the supporting material; they do not constitute independent verification of every claim.</p></section>
      <section><h3 className="text-subheading">Assessment evidence & coverage</h3><p className="mt-3 results-prose">{EVIDENCE_DISCLOSURE}</p>{content ? <p className="mt-3 results-prose">{content.grounding_notes}</p> : <p className="mt-3">No AI recommendation evidence is displayed until generation and validation succeed.</p>}</section>
      <section><h3 className="text-subheading">Bibliography</h3>{content ? <Bibliography citations={unique}/> : <p className="mt-3">No cited documents yet.</p>}</section></div>
      <Information label="Detailed provenance limitations"><p>References preserve library metadata and excerpts. Source binaries, editions, external accessibility and page accuracy have not been independently verified. Country and revenue-band context are not collected.</p><ul>{view.result?.evidence.limitations.map((limit,i)=><li key={i}>{limit}</li>)}</ul></Information>
      <Link href="/assessment" className="text-link mt-8">Return to assessment</Link>
    </ResultsDisclosure>
  </>;
}
