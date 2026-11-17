import { redirect } from "next/navigation";
import { previewEnabled } from "../../adapters/preview-mode";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ComputedScores } from "../../features/results/computed-scores";
import { assessmentCatalog } from "../../application/assessment-catalog";
import { loadCanonicalConfig } from "../../adapters/config-repository";
import { Recommendations } from "../../features/results/recommendations";
import "../../styles/results.css";
import { ResultsStages, ResultsGate } from "../../features/assessment/stage-navigation";
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
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Full navigation avoids restored/combined homepage fragments; sessionStorage is preserved. */}
      <a href="/#top" className="nav-link inline-flex items-center gap-2"><span aria-hidden="true">←</span><Image src="/brand/mosaic-mark-straight.svg" alt="" width={24} height={24} />MOSAIC home</a>
      <Link href="/assessment" className="text-link">Return to assessment</Link>
    </header>
    <main id="results-main" tabIndex={-1} className="page-container results-page">
      <ResultsGate catalog={catalog}><div className="results-navigation-stack"><ResultsStages catalog={catalog}/><ResultsNavigation /></div>
      <section aria-labelledby="results-title" className="results-section">
        <div className="results-heading">
          <div><span className="section-label">Results / Research assessment</span><h1 id="results-title" className="text-display">Your assessment results</h1></div>

        </div>
      </section>
      <Recommendations catalog={catalog}><section className="results-section calculated-section" aria-label="Deterministic assessment results"><ComputedScores catalog={catalog} /></section></Recommendations></ResultsGate>
    </main>
  </>;
}
