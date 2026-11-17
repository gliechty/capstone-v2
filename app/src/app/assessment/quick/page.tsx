import { AssessmentFlow } from '../../../features/assessment/assessment-flow';
import { assessmentCatalog } from '../../../application/assessment-catalog';
import { loadCanonicalConfig } from '../../../adapters/config-repository';
export default function QuickAssessmentPage(){return <AssessmentFlow catalog={assessmentCatalog(loadCanonicalConfig().config)} quick />;}
