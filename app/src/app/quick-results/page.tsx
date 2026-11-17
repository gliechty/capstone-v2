import { QuickResults } from '../../features/results/quick-results';
import { assessmentCatalog } from '../../application/assessment-catalog';
import { loadCanonicalConfig } from '../../adapters/config-repository';
export default function QuickResultsPage(){return <QuickResults catalog={assessmentCatalog(loadCanonicalConfig().config)}/>;}
