import type { Metadata } from "next";
import Link from "next/link";
import { ComputedScores } from "../../features/results/computed-scores";
import { assessmentCatalog } from "../../application/assessment-catalog";
import { loadCanonicalConfig } from "../../adapters/config-repository";
import { resultsPreview as preview } from "../../content/results-preview";
import "../../styles/results.css";
import { ResultsNavigation } from "../../components/results-navigation";

export const metadata: Metadata = {
  title: "Assessment results | Capstone",
  description: "Deterministic assessment scores. Narrative and recommendations remain illustrative examples.",
  robots: { index: false, follow: false },
};

export default function ResultsPage() {
  const catalog = assessmentCatalog(loadCanonicalConfig().config);
  return <>
    <a href="#results-main" className="skip-link">Skip to results</a>
    <header className="page-container flex flex-wrap items-center justify-between gap-4 py-6">
      <Link href="/" className="nav-link">← Capstone home</Link>
      <Link href="/assessment" className="text-link">Return to assessment</Link>
    </header>
    <main id="results-main" tabIndex={-1} className="page-container results-page">
      <aside className="preview-notice" aria-label="Results limitations">
        <p className="font-semibold">Calculated scores · Example narrative</p>
        <p className="text-small">{preview.notice}</p>
      </aside>
      <ResultsNavigation />
      <section id="summary" tabIndex={-1} aria-labelledby="results-title" className="results-section">
        <div className="results-heading">
          <div><span className="section-label">Results / Research assessment</span><h1 id="results-title" className="text-display">{preview.title}</h1></div>
          <div className="report-placeholder">
            <button type="button" className="button-primary" disabled aria-describedby="report-availability">Download full report <span aria-hidden="true">↓</span></button>
            <p id="report-availability" className="mt-3 text-small text-muted">Unavailable in this preview. Report generation is not implemented.</p>
          </div>
        </div>
        <ComputedScores catalog={catalog} />
      </section>
      <section className="results-section summary-section" aria-labelledby="summary-heading">
        <span className="section-label">01 / Read the picture</span>
        <h2 id="summary-heading" className="text-heading">Executive summary</h2>
        <p className="mt-6 text-small font-semibold text-accent">Example narrative · Not AI-generated</p>
        <p className="mt-3 max-w-copy">{preview.summary}</p>
      </section>
      <section id="gaps" tabIndex={-1} className="results-section gaps-section" aria-labelledby="gaps-heading">
        <span className="section-label">02 / Where to look</span>
        <h2 id="gaps-heading" className="text-heading">Key gaps</h2>
        <p className="mt-4 text-muted">Illustrative gaps, not findings from your answers.</p>
        <div className="gap-grid mt-8">{preview.gaps.map((gap) => <article key={gap.id} className="gap-card">
          <p className="text-small font-semibold text-accent">{gap.category} / Example gap</p>
          <h3 className="text-subheading mt-4">{gap.title}</h3>
          <p className="mt-4">{gap.detail}</p>
          <p className="mt-4 text-muted"><strong>Why it matters:</strong> {gap.why}</p>
          <a href="#sources" className="text-link mt-4 text-small">Evidence status: not connected</a>
        </article>)}</div>
      </section>
      <section id="actions" tabIndex={-1} className="results-section actions-section" aria-labelledby="actions-heading">
        <span className="section-label">03 / A path forward</span>
        <h2 id="actions-heading" className="text-heading">Recommended actions</h2>
        <p className="mt-4 max-w-copy text-muted">Example priority order only. These are editorial placeholders, not generated advice or a ranking of your business needs.</p>
        <ol className="action-list mt-8">{preview.actions.map((action, index) => <li key={action.id}>
          <span className="action-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <article>
            <p className="text-small font-semibold text-accent">{action.category} / Example action</p>
            <h3 className="text-subheading mt-3">{action.title}</h3>
            <p className="mt-4 text-muted">{action.rationale}</p>
            <p className="mt-3"><strong>Concrete action:</strong> {action.action}</p>
            <a href="#sources" className="text-link mt-3 text-small">Evidence status: not connected</a>
          </article>
        </li>)}</ol>
      </section>
      <section id="sources" tabIndex={-1} className="results-section sources-section" aria-labelledby="sources-heading">
        <span className="section-label">04 / Basis & limitations</span>
        <h2 id="sources-heading" className="text-heading">Evidence & sources</h2>
        <p className="mt-6 max-w-copy">No source evidence has been retrieved or verified for this mock example. Source titles, page references and links will belong here when grounded recommendations are implemented.</p>
        <p className="mt-4 max-w-copy text-muted">The scores above use the versioned canonical assessment configuration. Evidence for the example narrative and actions is not connected; those examples are not derived from your scores.</p>
        <p className="mt-4 text-small text-muted">Layout fixture: {preview.version}</p>
        <Link href="/assessment" className="text-link mt-8">Return to assessment</Link>
      </section>
    </main>
  </>;
}
