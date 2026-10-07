import type { Metadata } from "next";
import Link from "next/link";
import { AssessmentFlow } from "../../features/assessment/assessment-flow";
import { assessmentCatalog } from "../../application/assessment-catalog";
import { loadCanonicalConfig } from "../../adapters/config-repository";
export const metadata: Metadata = {
  title: "Assessment preview | Capstone",
  description: "Business setup and canonical questionnaire. No scoring.",
};
export default function AssessmentPage() {
  // Loading during build fails the deployment on malformed canonical config.
  // The same failure is visible rather than falling back to demo questions.
  const { config, diagnostics } = loadCanonicalConfig();
  if (diagnostics.length) console.warn("Canonical config diagnostics:", diagnostics.join("; "));
  const catalog = assessmentCatalog(config);
  if (!catalog.questions.length) return <main className="page-container py-12"><h1>Assessment unavailable</h1><p>No active canonical questions are configured.</p><Link href="/">Return home</Link></main>;
  return <AssessmentFlow catalog={catalog} />;
}
