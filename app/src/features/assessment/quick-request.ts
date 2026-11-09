import type { Session } from './model';
import { marketValues } from '../../application/assessment-setup';
export function quickRequest(state:Session,action:'select'|'score'){
 const p=state.profile;
 return {action,configVersion:state.configVersion,context:{industry:p.industry,companySize:p.companySize,location:p.location,targetMarkets:marketValues(p.targetMarket),targetBuyer:p.targetBuyer,businessGoal:p.businessGoal},answers:action==='select'?{}:Object.fromEntries(Object.entries(state.answers).filter(([id])=>state.assessmentProfile?.questionIds.includes(id)))};
}
