// Owner-authorized offline comparison only. No scoring calls, network or app mutations.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {dir,root,read,json,questions,hash,requireDependency,csvString} from './common.mjs';
const out=path.join(dir,'twenty');fs.mkdirSync(out,{recursive:true});
const save=(n,v)=>fs.writeFileSync(path.join(out,n),JSON.stringify(v,null,2)+'\n');
// Import unchanged production functions, resolving their relative TS dependencies in memory.
async function moduleUrl(file){
 const ts=requireDependency('typescript');
 let js=ts.transpileModule(read(file),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 for(const m of [...js.matchAll(/from "(\.[^"]+)"/g)])js=js.replace(m[0],`from "${await moduleUrl(path.join(path.dirname(file),m[1]+'.ts'))}"`);
 return 'data:text/javascript;base64,'+Buffer.from(js).toString('base64');
}
const {resolveMultiplier,CATEGORIES}=await import(await moduleUrl('app/src/domain/scoring/score-assessment.ts'));
const {selectQuestions}=await import(await moduleUrl('app/src/domain/selection/select-questions.ts'));
const tags=JSON.parse(fs.readFileSync(path.join(dir,'QuestionBank.experimental.json')));
const audit=JSON.parse(fs.readFileSync(path.join(dir,'answer-effort.audit.json')));
const prior=JSON.parse(fs.readFileSync(path.join(dir,'golden-comparison.json')));
const config={MultiplierRules:json('app/config/capstone-v1/MultiplierRules.json')};
const mapping=new Map(json('app/config/portraits/portrait_family_mapping_v0.2.json').rows.map(r=>[r.question_id,r.family]));
const index=new Map(questions.map((q,i)=>[q.question_id,i]));
// Lower-bound constrained proportional allocation; category order is production CATEGORIES.
function allocate(counts){
 const quota={},rounds=[];let open=[...CATEGORIES],remaining=20;
 while(open.length){
  const total=open.reduce((s,c)=>s+counts[c],0);
  const tentative=Object.fromEntries(open.map(c=>[c,remaining*counts[c]/total]));
  const bind=open.filter(c=>tentative[c]<Math.min(2,counts[c]));
  rounds.push({remaining,eligible_total:total,tentative,bound_to_minimum:bind});
  if(!bind.length){Object.assign(quota,tentative);break;}
  for(const c of bind){quota[c]=Math.min(2,counts[c]);remaining-=quota[c];}
  open=open.filter(c=>!bind.includes(c));
 }
 const allocation=Object.fromEntries(CATEGORIES.map(c=>[c,Math.floor(quota[c])]));
 const remainders=[...CATEGORIES].sort((a,b)=>(quota[b]-Math.floor(quota[b]))-(quota[a]-Math.floor(quota[a]))||CATEGORIES.indexOf(a)-CATEGORIES.indexOf(b));
 const extras=[];
 for(const c of remainders){if(Object.values(allocation).reduce((a,b)=>a+b,0)===20)break;if(allocation[c]<counts[c]){allocation[c]++;extras.push(c);}}
 assert.equal(Object.values(allocation).reduce((a,b)=>a+b,0),20);
 for(const c of CATEGORIES)assert(allocation[c]>=Math.min(2,counts[c])&&allocation[c]<=counts[c]);
 return {counts,unconstrained_quotas:Object.fromEntries(CATEGORIES.map(c=>[c,20*counts[c]/Object.values(counts).reduce((a,b)=>a+b,0)])),rounds,constrained_quotas:quota,round_down:Object.fromEntries(CATEGORIES.map(c=>[c,Math.floor(quota[c])])),largest_remainder_extra_slots:extras,allocation};
}
const pairs=[
 {ids:['U-023','I-040'],note:'General Scope 1 measurement versus agricultural Scope 1 reporting; substantial topic overlap, differing sector/reporting scope.'},
 {ids:['U-024','I-041'],note:'General Scope 2 measurement versus food-production Scope 2 reporting; substantial topic overlap, differing sector/reporting scope.'},
 {ids:['U-003','M-008'],note:'Overlapping grievance/whistleblower mechanisms and protective policy; distinct scope, not automatic duplicates.'},
 {ids:['U-004','M-010','M-011'],note:'Overlapping public reporting: report existence, framework alignment and disclosed content.'},
 {ids:['U-005','U-015'],note:'GHG target versus broader measurable sustainability targets; partial overlap.'},
 {ids:['U-013','M-033'],note:'Broad transition plan versus explicit 1.5°C compatibility; nested requirements.'},
 {ids:['U-022','M-021','I-039'],note:'Climate-risk assessment/identification/exposure analysis; substantial topic overlap, distinct wording.'},
 {ids:['U-010','M-016','M-002'],note:'Public anti-corruption commitment, written policy and prevention mechanisms; related progression, not exact equivalents.'},
 {ids:['U-014','M-015'],note:'Supplier environmental criteria versus written sustainable-sourcing procedures; partially overlapping.'},
 {ids:['U-028','M-036'],note:'Plan to reduce non-renewable/hazardous materials versus active identification/reduction; related progression.'}
];
const dependencies=[
 {id:'M-001',prerequisite:null,note:'Verification scope presupposes an emissions inventory; U-023/U-024 ask about measurement but do not establish completed independent assurance.'},
 {id:'M-010',prerequisite:'U-004',note:'Framework-aligned reporting presupposes a sustainability report; differing options may distinguish partial alignment.'},
 {id:'M-011',prerequisite:'U-004',note:'Disclosure of operations/activities presupposes a public report; broader reports may also satisfy its wording.'},
 {id:'U-012',prerequisite:'U-001',note:'Downstream scope assumes an environmental policy; policy-existence answer may be needed.'},
 {id:'M-022',prerequisite:'U-015',note:'Existing wording says leave blank without targets; preserve that condition.'},
 {id:'M-014',prerequisite:null,note:'Progress tracking presupposes previously disclosed plans/commitments; no single prerequisite ID establishes disclosure.'}
];
const families=['commit','measure','plan','do','engage','none'];
const results=[];
for(const old of prior){
 const full=selectQuestions(questions,old.profile);
 assert.deepEqual(full.map(q=>q.question_id),old.lists.full.map(q=>q.question_id));
 const eligible=full.filter(q=>tags.find(t=>t.question_id===q.question_id).answer_effort==='direct_knowledge');
 assert.deepEqual(eligible.map(q=>q.question_id),old.lists.direct_knowledge.map(q=>q.question_id));
 const counts=Object.fromEntries(CATEGORIES.map(c=>[c,eligible.filter(q=>q.category===c).length]));
 const proportional=allocate(counts);
 const ranked=Object.fromEntries(CATEGORIES.map(c=>[c,eligible.filter(q=>q.category===c).map(q=>{
  const m=resolveMultiplier(config,q,old.profile),a=audit.find(a=>a.question_id===q.question_id);
  return {id:q.question_id,wording:q.question_text,response_type:q.response_type,category:q.category,family:mapping.get(q.question_id),effort:'direct_knowledge',base_weight:Number(q.base_weight),multiplier:m.value,multiplier_product:m.product,matched_rule_ids:m.rules.map(r=>r.rule_id),effective_weight:Number(q.base_weight)*m.value,source_row:index.get(q.question_id)+1,cluster_id:q.cluster_id,review_status:a.review_status,effort_caveat:a.review_reason??a.assumptions};
 }).sort((a,b)=>b.effective_weight-a.effective_weight||a.source_row-b.source_row).map((q,i)=>({...q,category_rank:i+1}))]));
 const fixed={People:Math.min(4,counts.People),Governance:Math.min(6,counts.Governance),Community:Math.min(2,counts.Community),Resources:Math.min(8,counts.Resources)};
 let spare=20-Object.values(fixed).reduce((a,b)=>a+b,0);
 for(const c of ['Resources','Governance','People','Community']){const add=Math.min(spare,counts[c]-fixed[c]);fixed[c]+=add;spare-=add;}
 const select=allocation=>CATEGORIES.flatMap(c=>ranked[c].slice(0,allocation[c]));
 const selected=select(proportional.allocation),fixedSelected=select(fixed);
 assert.equal(selected.length,20);assert.equal(new Set(selected.map(q=>q.id)).size,20);
 const ids=new Set(selected.map(q=>q.id)),fixedIds=new Set(fixedSelected.map(q=>q.id));
 const coverage=qs=>Object.fromEntries(families.map(f=>[f,qs.filter(q=>q.family===f).length]));
 const overlap=pairs.map(p=>({...p,selected_ids:p.ids.filter(id=>ids.has(id))})).filter(p=>p.selected_ids.length>1);
 const deps=dependencies.filter(d=>ids.has(d.id)).map(d=>({...d,prerequisite_selected:d.prerequisite?ids.has(d.prerequisite):null}));
 const result={case_id:old.case_id,profile:old.profile,allocation:proportional,family_coverage:coverage(selected),selected,ranked_eligible:ranked,near_duplicate_flags:overlap,dependency_flags:deps,unreviewed_selected_ids:selected.filter(q=>q.review_status.startsWith('model')).map(q=>q.id),fixed_comparator:{allocation:fixed,family_coverage:coverage(fixedSelected),selected:fixedSelected,shared_count:selected.filter(q=>fixedIds.has(q.id)).length,only_proportional:selected.filter(q=>!fixedIds.has(q.id)).map(q=>q.id),only_fixed:fixedSelected.filter(q=>!ids.has(q.id)).map(q=>q.id)}};
 results.push(result);
 const fields=['id','wording','response_type','category','family','effort','base_weight','multiplier','effective_weight','category_rank','source_row','review_status','effort_caveat'];
 for(const [label,qs] of [['proportional',selected],['fixed',fixedSelected]])fs.writeFileSync(path.join(out,old.case_id+'.'+label+'.csv'),csvString([fields,...qs.map(q=>fields.map(f=>q[f]))]));
}
save('comparison.json',results);
save('provenance.json',{created_at:new Date().toISOString(),source_experiment_commit:'2d4b9f49137a55d0018ac1ff2421ca5b5f084068',effort_tags_sha256:hash(fs.readFileSync(path.join(dir,'QuestionBank.experimental.json'))),scoring_module_sha256:hash(read('app/src/domain/scoring/score-assessment.ts')),multiplier_rules_sha256:hash(read('app/config/capstone-v1/MultiplierRules.json')),checks:'All five Full selections and eligible direct-knowledge IDs/order match saved experiment. Exactly20 unique eligible questions each; min2 per category where available; category counts within supply. Ranking uses unchanged resolveMultiplier; no answers or scoreAssessment calls.',family_constraints:false,paid_calls:0,status:'pending owner review; M8.1 unstarted'});
let md='# M8.0: 20-question proportional candidate — pending owner review\n\nAllocation: constrained proportional quotas (20 × eligible share). Fix categories below min(2, available) at that minimum, then redistribute remaining slots proportionally among the others. Repeat if needed. Floor quotas, award spare slots by descending fractional remainder; exact ties use production category order People, Governance, Community, Resources. No category exceeds available questions. No availability ceiling binds in these five cases.\n\nRanking: descending base_weight × existing profile multiplier (existing product/cap1.5 and rule matching). Equal weights use original QuestionBank row order. Full numeric precision determines rank; displayed weights below are abbreviated. Category scoring weights do not allocate slots or change within-category ranking. Questions are shown grouped by category and ranked within it, not as a proposed UI order.\n\nFixed comparator uses the same effort pool and weight ranking with Governance6/People4/Resources8/Community2; Food lacks a fourth People item, so its spare slot goes to Resources. This isolates allocation effects: earlier topic/family-balancing suggestions are NOT applied to either set. No family coverage is forced, duplicate removed or dependency repaired. Existing tags, including unreviewed proposals, are unchanged.\n';
const escape=v=>String(v).replaceAll('|','\\|').replaceAll('\n',' ');
for(const r of results){
 md+=`\n## ${r.case_id}\n\n| Category | Eligible | Raw quota | Constrained quota | Floor | Final | Fixed |\n|---|---:|---:|---:|---:|---:|---:|\n`;
 for(const c of CATEGORIES)md+=`| ${c} | ${r.allocation.counts[c]} | ${r.allocation.unconstrained_quotas[c].toFixed(4)} | ${r.allocation.constrained_quotas[c].toFixed(4)} | ${r.allocation.round_down[c]} | ${r.allocation.allocation[c]} | ${r.fixed_comparator.allocation[c]} |\n`;
 md+=`\nMinimum bindings by round: ${r.allocation.rounds.map(x=>x.bound_to_minimum.join(', ')||'none').join(' → ')}. Largest-remainder extra slots: ${r.allocation.largest_remainder_extra_slots.join(', ')}.\n\n| Family | Proportional | Fixed |\n|---|---:|---:|\n`;
 for(const f of families)md+=`| ${f} | ${r.family_coverage[f]} | ${r.fixed_comparator.family_coverage[f]} |\n`;
 md+=`\nShared: ${r.fixed_comparator.shared_count}/20. Only proportional: ${r.fixed_comparator.only_proportional.join(', ')||'none'}. Only fixed: ${r.fixed_comparator.only_fixed.join(', ')||'none'}.\n\n### Exact proportional set\n\n| ID | Question | Type | Category | Family | Base × multiplier = effective |\n|---|---|---|---|---|---|\n`;
 for(const q of r.selected)md+=`| ${q.id} | ${escape(q.wording)} | ${q.response_type} | ${q.category} | ${q.family} | ${q.base_weight} × ${q.multiplier} = ${Number(q.effective_weight.toPrecision(8))} |\n`;
 md+='\n### Review flags (not selection constraints)\n\n';
 md+=r.near_duplicate_flags.map(f=>`- ${f.selected_ids.join(', ')}: ${f.note}`).join('\n')+'\n';
 md+=r.dependency_flags.map(f=>`- ${f.id}: ${f.note} ${f.prerequisite?f.prerequisite+' '+(f.prerequisite_selected?'included':'NOT selected'):''}`).join('\n')+'\n';
 md+=`- Unreviewed model effort proposals selected: ${r.unreviewed_selected_ids.join(', ')||'none'}. All assignments remain pending owner approval.\n`;
 for(const q of r.selected)md+=`- ${q.id} effort assumption: ${q.effort_caveat}\n`;
 md+='\nExact fixed comparator IDs, in category/rank order: '+r.fixed_comparator.selected.map(q=>q.id).join(', ')+'. Full wording/weights/flags are in comparison.json and the corresponding fixed CSV.\n';
}
fs.writeFileSync(path.join(out,'COMPARISON.md'),md);
console.log(JSON.stringify(results.map(r=>({case:r.case_id,allocation:r.allocation.allocation,families:r.family_coverage,only_proportional:r.fixed_comparator.only_proportional,only_fixed:r.fixed_comparator.only_fixed,selected:r.selected.map(q=>q.id),flags:r.near_duplicate_flags,deps:r.dependency_flags})),null,2));
