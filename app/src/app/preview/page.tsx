import { notFound } from "next/navigation";
import { previewEnabled } from "../../adapters/preview-mode";
import { loadCanonicalConfig } from "../../adapters/config-repository";
import { assessmentCatalog } from "../../application/assessment-catalog";
import { PrivatePreview } from "../../features/preview/private-preview";
import "../../styles/results.css";
export const dynamic = "force-dynamic";
export default function PreviewPage() {
 if (!previewEnabled()) notFound();
 return <PrivatePreview catalog={assessmentCatalog(loadCanonicalConfig().config)} />;
}
