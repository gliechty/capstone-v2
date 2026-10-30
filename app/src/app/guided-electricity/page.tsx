import { notFound } from "next/navigation";
import { prototypeEnabled } from "../../adapters/laiffi-prototype";
import { assessmentCatalog } from "../../application/assessment-catalog";
import { loadCanonicalConfig } from "../../adapters/config-repository";
import { GuidedElectricity } from "../../features/guided-electricity/panel";
export default function Page(){if(!prototypeEnabled()) notFound();return <GuidedElectricity catalog={assessmentCatalog(loadCanonicalConfig().config)} />;}
