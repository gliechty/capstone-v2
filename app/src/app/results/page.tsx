import { redirect } from "next/navigation";
import { previewEnabled } from "../../adapters/preview-mode";
import type { Metadata } from "next";
import Link from "next/link";
import { ComputedScores } from "../../features/results/computed-scores";
import { assessmentCatalog } from "../../application/assessment-catalog";
import { loadCanonicalConfig } from "../../adapters/config-repository";
import { Recommendations } from "../../features/results/recommendations";
import "../../styles/results.css";
import { ResultsNavigation } from "../../components/results-navigation";

export const metadata: Metadata = {
  title: "Assessment results | Capstone",
  description: "Deterministic assessment scores and explicitly requested, validated AI recommendations.",
  robots: { index: false, follow: false },
};

export default function ResultsPage() {
  if (previewEnabled()) redirect("/preview");
  const catalog = assessmentCatalog(loadCanonicalConfig().config);
  return <>
    <a href="#results-main" className="skip-link">Skip to results</a>
    <header className="page-container flex flex-wrap items-center justify-between gap-4 py-6">
      <Link href="/" className="nav-link">← Capstone home</Link>
      <Link href="/assessment" className="text-link">Return to assessment</Link>
    </header>
    <main id="results-main" tabIndex={-1} className="page-container results-page">
      <aside className="preview-notice" aria-label="Results limitations">
        <p className="font-semibold">Calculated scores · Optional AI recommendations</p>
        <p className="text-small">Research assessment, not certification. Scores are calculated separately; AI recommendations require explicit generation and human review.</p>
      </aside>
      <ResultsNavigation />
      <section aria-labelledby="results-title" className="results-section">
        <div className="results-heading">
          <div><span className="section-label">Results / Research assessment</span><h1 id="results-title" className="text-display">Your assessment results</h1></div>
          <div className="report-placeholder">
            <button type="button" className="text-link text-small" disabled aria-describedby="report-availability">Download full report <span aria-hidden="true">↓</span></button>
            <p id="report-availability" className="mt-3 text-small text-muted">Report generation is not implemented.</p>
          </div>
        </div>
      </section>
      <Recommendations catalog={catalog}><section className="results-section calculated-section" aria-label="Deterministic assessment results"><ComputedScores catalog={catalog} /></section></Recommendations>
    </main>
  </>;
}
