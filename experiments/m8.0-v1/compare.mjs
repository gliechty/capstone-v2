// Offline, owner-authorized validation and Golden SME comparison. No scoring or network.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {dir,root,read,json,save,hash,questions,contentHash,csvRecords,csvCells,csvString,classes,loadTs,requireDependency} from './common.mjs';
const baseline=JSON.parse(fs.readFileSync(path.join(dir,'baseline.json'),'utf8'));
const proposals=JSON.parse(fs.readFileSync(path.join(dir,'model-proposals.json'),'utf8')).assignments;
assert.deepEqual(proposals.map(p=>p.question_id),questions.map(q=>q.question_id),'Model IDs/order must exactly match original');
for(const p of proposals){assert(classes.includes(p.answer_effort));assert(p.rationale&&p.assumptions);assert(['high','medium','low'].includes(p.confidence));assert(p.confidence!=='low'||p.answer_effort==='needs_review');}
const reviews=JSON.parse(fs.readFileSync(path.join(dir,'reviews.json'),'utf8'));
assert.equal(new Set(reviews.map(r=>r.question_id)).size,reviews.length);
for(const r of reviews){const q=questions.find(q=>q.question_id===r.question_id);assert(q);assert.equal(r.question_content_hash,contentHash(q),'Stale review: changed question requires reassessment');assert(classes.includes(r.assignment));assert(r.reason);}
for(const q of questions)assert.equal(contentHash(q),baseline.question_hashes[q.question_id],'Baseline changed; create a new experiment version');
const rows=questions.map((q,i)=>({...q,answer_effort:reviews.find(r=>r.question_id===q.question_id)?.assignment??proposals[i].answer_effort}));
const audit=questions.map((q,i)=>{const p=proposals[i],r=reviews.find(r=>r.question_id===q.question_id);return {question_id:q.question_id,proposed_effort_class:p.answer_effort,assigned_effort_class:rows[i].answer_effort,rationale:p.rationale,assumptions:p.assumptions,confidence:p.confidence,rule_version:'m8-effort-semantic-guidance-1',model:'gpt-5.4-mini-2026-03-17',prompt_version:'m8-answer-effort-1',question_content_hash:contentHash(q),review_status:r?'agent_spot_checked_pending_owner_review':'model_proposal_pending_owner_review',reviewer:r?'Codex':null,review_reason:r?.reason??null,reviewed_at:r?.reviewed_at??null,owner_approved:false};});
save('answer-effort.audit.json',audit);save('QuestionBank.experimental.json',rows);
save('uncertain-assignments.json',audit.filter(a=>a.assigned_effort_class==='needs_review').map(a=>({...a,question:questions.find(q=>q.question_id===a.question_id)})));
const csv=fs.readFileSync(path.join(dir,'QuestionBank.original.csv'),'utf8');
assert.equal(hash(csv),baseline.source_csv_sha256);
// A read-only baseline snapshot preserves exact original bytes even on a checkout with different line endings.
const activeSourceRecords=csvRecords(fs.readFileSync(path.join(root,baseline.source_csv),'utf8'));
assert.deepEqual(activeSourceRecords.map(csvCells),csvRecords(csv).map(csvCells),'Original source CSV values and order must remain unchanged');
const records=csvRecords(csv);
const extended=records.map((r,i)=>r.replace(/(\r?\n)?$/,(_,end)=>','+(i===0?'answer_effort':rows[i-1].answer_effort)+(end??''))).join('');
fs.writeFileSync(path.join(dir,'QuestionBank.experimental.csv'),extended);
// Removing only the final field must restore the complete original byte stream.
const restored=csvRecords(extended).map(r=>r.replace(/,[a-z_]+(\r?\n)?$/,(_,end)=>end??'')).join('');
assert.equal(restored,csv,'CSV must restore byte for byte');
assert.deepEqual(rows.map(({answer_effort,...q})=>q),questions,'All original JSON columns/values/order preserved');
assert.deepEqual(csvCells(csvRecords(extended)[0]),[...baseline.original_columns,'answer_effort']);
const parsed=csvRecords(extended).slice(1).map(r=>Object.fromEntries(csvCells(r).map((v,i)=>[[...baseline.original_columns,'answer_effort'][i],v])));
assert.deepEqual(parsed,rows,'Experimental CSV and JSON must agree');
const {QuestionBankSchema}=await loadTs('app/src/application/config/schemas.ts');
const {z}=requireDependency('zod');
const experimentalSchema=z.array(QuestionBankSchema.extend({answer_effort:z.enum(classes)})).min(1);
experimentalSchema.parse(rows);
assert.deepEqual(z.toJSONSchema(experimentalSchema),JSON.parse(fs.readFileSync(path.join(dir,'QuestionBank.experimental.schema.json'),'utf8')));
const {selectQuestions}=await loadTs('app/src/domain/selection/select-questions.ts');
assert.equal(hash(read('app/src/domain/selection/select-questions.ts')),baseline.selector_sha256);
assert.equal(hash(read('app/config/portraits/portrait_family_mapping_v0.2.json')),baseline.family_mapping_sha256);
const mappings=json('app/config/portraits/portrait_family_mapping_v0.2.json').rows;
const families=new Map(mappings.map(m=>[m.question_id,m.family]));
const cases=fs.readdirSync(path.join(root,'BUILD_PACK/07_GOLDEN_TESTS/sme_cases')).filter(n=>n.endsWith('.json')).map(n=>json('BUILD_PACK/07_GOLDEN_TESTS/sme_cases/'+n));
const fields=['question_id','wording','response_type','effort_class','category','archetype_family','review_status'];
const detail=q=>({question_id:q.question_id,wording:q.question_text,response_type:q.response_type,effort_class:q.answer_effort,category:q.category,archetype_family:families.get(q.question_id)??'unmapped',review_status:audit.find(a=>a.question_id===q.question_id).review_status});
const counts=(list,field,values)=>Object.fromEntries(values.map(v=>[v,list.filter(q=>q[field]===v).length]));
const result=[];
for(const fixture of cases){
 const full=selectQuestions(rows,fixture.profile), original=selectQuestions(questions,fixture.profile);
 assert.deepEqual(full.map(q=>q.question_id),original.map(q=>q.question_id));
 assert.deepEqual(full.map(q=>q.question_id),fixture.expected_question_ids,'Existing Golden exact ID/order oracle');
 const subsets={full,boolean_categorical:full.filter(q=>['boolean','categorical'].includes(q.response_type)),direct_knowledge:full.filter(q=>q.answer_effort==='direct_knowledge'),needs_review:full.filter(q=>q.answer_effort==='needs_review')};
 const lists=Object.fromEntries(Object.entries(subsets).map(([k,qs])=>[k,qs.map(detail)]));
 for(const [name,list]of Object.entries(lists)){
  fs.writeFileSync(path.join(dir,fixture.case_id+'.'+name+'.csv'),csvString([fields,...list.map(q=>fields.map(f=>q[f]))]));
 }
 assert(lists.full.every(q=>q.archetype_family!=='unmapped'),'Existing active family mapping required');
 const coverage=Object.fromEntries(['full','boolean_categorical','direct_knowledge'].map(name=>[name,{categories:counts(lists[name],'category',['People','Governance','Community','Resources']),families:counts(lists[name],'archetype_family',['commit','measure','plan','do','engage','none'])}]));
 const gaps=Object.fromEntries(['boolean_categorical','direct_knowledge'].map(name=>[name,Object.fromEntries(['categories','families'].map(dimension=>[dimension,Object.keys(coverage.full[dimension]).filter(k=>k!=='none'&&coverage.full[dimension][k]>0&&coverage[name][dimension][k]===0)]))]));
 result.push({case_id:fixture.case_id,profile:fixture.profile,counts:Object.fromEntries(Object.entries(lists).map(([k,v])=>[k,v.length])),direct_numeric_ids:subsets.direct_knowledge.filter(q=>['numeric','percent'].includes(q.response_type)).map(q=>q.question_id),boolean_categorical_non_direct_ids:subsets.boolean_categorical.filter(q=>q.answer_effort!=='direct_knowledge').map(q=>q.question_id),coverage,gaps,lists});
}
save('golden-comparison.json',result);
save('validation.json',{validated_at:new Date().toISOString(),original_rows:questions.length,original_columns:baseline.original_columns.length,experimental_columns:baseline.original_columns.length+1,csv_removal_byte_identical:true,json_original_fields_order_values_identical:true,schema_validation:'Existing QuestionBankSchema.extend(answer_effort enum), all rows pass; emitted machine-readable JSON Schema equals validator projection. Original finite-decimal refinement retained in executable validator.',golden_applicability_exact_ids_and_order:result.map(r=>({case_id:r.case_id,count:r.counts.full,passed:true})),selector_unchanged:true,archetype_mapping_unchanged:true,scoring_executed:false,review_sample_count:reviews.length,model_proposal_count:proposals.length,owner_review:'pending'});
const table=['| Golden SME | Full | Boolean/categorical | Direct knowledge | Direct numeric/percent | Needs review |','|---|---:|---:|---:|---:|---:|',...result.map(r=>`| ${r.case_id.replace('GOLDEN_','')} | ${r.counts.full} | ${r.counts.boolean_categorical} | ${r.counts.direct_knowledge} | ${r.direct_numeric_ids.length} | ${r.counts.needs_review} |`)];
let report='# M8.0 candidate comparison — pending owner review\n\n'+table.join('\n')+'\n\nFull uses the unchanged production applicability selector and existing Golden SME profiles. These are questionnaire counts, not scores. No question-count cap is applied. Direct-knowledge selections include unreviewed model proposals; review status accompanies every row. No owner-approved effort assignments are claimed.\n';
for(const r of result){
 report+=`\n## ${r.case_id}\n\nDirect numeric/percent IDs: ${r.direct_numeric_ids.join(', ')||'none'}. Boolean/categorical questions that are not direct knowledge: ${r.boolean_categorical_non_direct_ids.join(', ')||'none'}.\n\n| Coverage | Full | Boolean/categorical | Direct knowledge |\n|---|---:|---:|---:|\n`;
 for(const dim of ['categories','families'])for(const k of Object.keys(r.coverage.full[dim]))report+=`| ${dim}: ${k} | ${r.coverage.full[dim][k]} | ${r.coverage.boolean_categorical[dim][k]} | ${r.coverage.direct_knowledge[dim][k]} |\n`;
 report+='\nLost coverage relative to Full: '+JSON.stringify(r.gaps)+'.\n';
 for(const [name,list] of Object.entries(r.lists)){
  report+=`\n### ${name} (${list.length})\n\n| ID | Wording | Response | Effort | Category | Family | Review |\n|---|---|---|---|---|---|---|\n`;
  report+=list.map(q=>'| '+fields.map(f=>String(q[f]).replaceAll('|','\\|').replaceAll('\n',' ')).join(' | ')+' |').join('\n')+'\n';
 }
}
fs.writeFileSync(path.join(dir,'COMPARISON.md'),report);
console.log(JSON.stringify(result.map(({case_id,counts,direct_numeric_ids,gaps})=>({case_id,counts,direct_numeric_ids,gaps})),null,2));
