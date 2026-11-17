import { createHash } from 'node:crypto';
import { z } from 'zod';
import policyData from '../../config/assessment-profiles/quick-v1.json';
import effortData from '../../config/assessment-profiles/quick-effort-v1.json';
import type { CanonicalConfig } from '../domain/config/types';
import { selectQuestions } from '../domain/selection/select-questions';
import { resolveMultiplier, scoreAssessment, type ScoringProfile } from '../domain/scoring/score-assessment';
import { scoreRequestSchema } from './score-request';
import { setupConfig } from './assessment-setup';

export const quickPolicy = z.object({version:z.string(),targetCount:z.number().int().positive(),minimumPerCategory:z.number().int().nonnegative(),effortVersion:z.string(),eligibleEffort:z.literal('direct_knowledge'),allocation:z.literal('constrained-proportional-largest-remainder'),ranking:z.literal('base-weight-times-capped-profile-multiplier'),questionTieBreak:z.literal('source-order'),categoryTieBreak:z.array(z.string()).length(4)}).parse(policyData);
// Separate prototype policy/provenance; canonical questions and formulas are untouched.
export function selectQuickQuestions(config:CanonicalConfig, profile:ScoringProfile) {
 if(effortData.version!==quickPolicy.effortVersion)throw Error('Quick effort version mismatch');
 const tags=new Map(effortData.rows.map(r=>[r.question_id,r]));
 const sourceOrder=new Map(config.QuestionBank.map((q,i)=>[q.question_id,i]));
 const eligible=selectQuestions(config.QuestionBank,profile).filter(q=>{
  const tag=tags.get(q.question_id);
  if(!tag)throw Error('Missing Quick effort provenance');
  if(createHash('sha256').update(JSON.stringify(q)).digest('hex')!==tag.question_content_hash)throw Error('Quick effort reassessment required');
  return tag.assigned_effort_class===quickPolicy.eligibleEffort;
 });
 const categories=quickPolicy.categoryTieBreak;
 const counts=Object.fromEntries(categories.map(c=>[c,eligible.filter(q=>q.category===c).length]));
 const target=Math.min(quickPolicy.targetCount,eligible.length);
 if(!target)return [];
 const quotas:Record<string,number>={};let open=[...categories],remaining=target;
 while(open.length){
  const total=open.reduce((sum,c)=>sum+counts[c]!,0);
  const tentative=Object.fromEntries(open.map(c=>[c,total?remaining*counts[c]!/total:0]));
  const bound=open.filter(c=>tentative[c]!<Math.min(quickPolicy.minimumPerCategory,counts[c]!));
  if(!bound.length){Object.assign(quotas,tentative);break;}
  for(const c of bound){quotas[c]=Math.min(quickPolicy.minimumPerCategory,counts[c]!);remaining-=quotas[c]!;}
  open=open.filter(c=>!bound.includes(c));
 }
 const allocation=Object.fromEntries(categories.map(c=>[c,Math.floor(quotas[c]!)]));
 let spare=target-Object.values(allocation).reduce((a,b)=>a+b,0);
 const remainder=[...categories].sort((a,b)=>(quotas[b]!-Math.floor(quotas[b]!))-(quotas[a]!-Math.floor(quotas[a]!))||categories.indexOf(a)-categories.indexOf(b));
 for(const c of remainder)if(spare&&allocation[c]!<counts[c]!){allocation[c]!++;spare--;}
 const ranked=eligible.map(q=>({q,weight:Number(q.base_weight)*resolveMultiplier(config,q,profile).value}));
 const ids=new Set(categories.flatMap(c=>ranked.filter(r=>r.q.category===c).sort((a,b)=>b.weight-a.weight||sourceOrder.get(a.q.question_id)!-sourceOrder.get(b.q.question_id)!).slice(0,allocation[c]).map(r=>r.q.question_id)));
 // Keep Full presentation order; ranking controls membership, not UI order.
 return eligible.filter(q=>ids.has(q.question_id));
}
export const quickRequestSchema=scoreRequestSchema.extend({action:z.enum(['select','score']),answers:scoreRequestSchema.shape.answers.default({})});
export function computeQuickAssessment(config:CanonicalConfig,input:unknown){
 const request=quickRequestSchema.parse(input);
 if(request.configVersion!==config.version+'/'+setupConfig.version)throw Error('Configuration changed');
 const c=request.context;
 const profile={industry:c.industry,employee_band:c.companySize,company_location:c.location,target_market_region:c.targetMarkets,target_buyer:c.targetBuyer,business_goal:c.businessGoal};
 const selected=selectQuickQuestions(config,profile);
 const ids=selected.map(q=>q.question_id);
 if(request.action==='select')return {version:quickPolicy.version,questionIds:ids};
 if(Object.keys(request.answers).some(id=>!ids.includes(id)))throw Error('Answer outside Quick selection');
 // The existing engine receives only this subset, so omitted Full questions are not missing.
 const score=scoreAssessment({...config,QuestionBank:selected},profile,request.answers);
 return {version:quickPolicy.version,questionIds:ids,score:{categories:score.categories,answered:score.answered,missing:score.missing,rawOverall:score.rawOverall,weightedOverall:score.weightedOverall}};
}
