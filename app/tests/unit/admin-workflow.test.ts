import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { AdminStore } from '../../src/adapters/admin-store';
import { loadCanonicalConfig } from '../../src/adapters/config-repository';
import { changes } from '../../src/application/admin/validation';
import type { Actor, Draft } from '../../src/application/admin/contracts';
import { benchmarkKey } from '../../src/application/admin/contracts';
import { developmentIdentityAllowed, sameOrigin } from '../../src/adapters/admin-auth';
const owner: Actor = { email: 'owner@example.test', role: 'super_admin', identity: 'development' }, admin: Actor = { email: 'editor@example.test', role: 'admin', identity: 'development' };
const payload = (d: Draft) => ({ revision: d.revision, QuestionBank: d.config.QuestionBank, MetricBenchmarks: d.config.MetricBenchmarks, AnswerScales: d.config.AnswerScales, reviews: d.reviews });
let store: AdminStore, dir: string;
beforeEach(() => { vi.stubEnv('MOSAIC_SUPER_ADMIN_EMAIL', owner.email); dir = mkdtempSync(path.join(tmpdir(), 'mosaic-admin-')); store = new AdminStore(dir); });
afterEach(() => { store.close(); rmSync(dir, { recursive: true, force: true }); vi.unstubAllEnvs(); });
describe('local admin release contracts', () => {
    it('allows a reviewed option-label edit without treating it as deleting its referenced scale', () => {
        let d = store.createDraft(owner); const p = payload(d);
        const q = d.config.QuestionBank.find(q => q.active === 'TRUE' && q.response_type === 'boolean')!;
        const index = p.AnswerScales.findIndex(s => s.answer_scale_id === q.answer_scale_id);
        const changed = { ...p.AnswerScales[index]!, answer_option: 'Reviewed label' };
        p.AnswerScales = p.AnswerScales.map((s,i) => i === index ? changed : s);
        p.reviews = { ['AnswerScales:' + changed.answer_scale_id + '|' + changed.answer_option]: {citation:'Existing approved scale', sourceYear:'', reviewedAt:'2026-11-17', reviewDue:'', status:'reviewed', rationale:'Clarify option wording; preserve numeric mapping.'} };
        d = store.save(d.id, p, admin); expect(store.validate(d).errors).toEqual([]);
    });
    it('imports approved bytes/precision and labels unknown dates truthfully', () => { const r = store.release(); expect(r.config).toEqual(loadCanonicalConfig().config); expect(r.createdAt).toBeNull(); expect(r.publishedAt).toBeNull(); const validation = store.validate(store.createDraft(owner)); expect(validation.errors).toEqual([]); expect(validation.warnings.map(i => i.key)).toEqual(['inactive-metric:I-045', 'source-originals', 'U-026']); });
    it('saves drafts across connection refresh without changing active release', () => { let d = store.createDraft(owner); const p = payload(d); p.QuestionBank = p.QuestionBank.map((q, i) => i === 0 ? { ...q, question_text: q.question_text + ' Clarification.' } : q); d = store.save(d.id, p, admin); expect(store.release().config.QuestionBank[0]?.question_text).not.toContain('Clarification.'); store.close(); store = new AdminStore(dir); expect(store.draft(d.id).config.QuestionBank[0]?.question_text).toContain('Clarification.'); expect(store.audit()).toHaveLength(2); });
    it('rejects stale writes, read-only edits and stale publication reviews', () => { const d = store.createDraft(owner); store.save(d.id, payload(d), admin); expect(() => store.save(d.id, payload(d), owner)).toThrow('newer draft'); expect(() => store.publish(d.id, d.revision, owner)).toThrow('changed after review'); const latest = store.draft(d.id), p = payload(latest); p.QuestionBank = p.QuestionBank.map((q, i) => i === 0 ? { ...q, base_weight: '999' } : q); expect(() => store.save(d.id, p, admin)).toThrow('read-only'); });
    it('publishes immutable configuration, preserves old identities and rolls back without deleting history', () => { const old = store.release(); let d = store.createDraft(owner); const p = payload(d); p.QuestionBank = p.QuestionBank.map((q, i) => i === 0 ? { ...q, question_text: q.question_text + ' Clarified.' } : q); d = store.save(d.id, p, admin); const result = store.validate(d); expect(result.errors).toEqual([]); const r = store.publish(d.id, d.revision, admin); expect(r.config.version).not.toBe(old.config.version); expect(store.release(old.id).config).toEqual(old.config); expect(store.release().id).toBe(r.id); store.rollback(old.id, r.id, owner); expect(store.release().id).toBe(old.id); expect(store.release(r.id).config.QuestionBank[0]?.question_text).toContain('Clarified.'); expect(() => store.rollback(r.id, r.id, owner)).toThrow('changed'); });
    it('prevents publication of missing active benchmark or scale assignments', () => { let d = store.createDraft(owner); const p = payload(d); p.QuestionBank = p.QuestionBank.map(q => q.active === 'TRUE' ? { ...q, metric_id: ['numeric', 'percent'].includes(q.response_type) ? 'MISSING' : q.metric_id, answer_scale_id: ['boolean', 'categorical'].includes(q.response_type) ? 'MISSING' : q.answer_scale_id } : q); d = store.save(d.id, p, admin); expect(store.validate(d).errors.length).toBeGreaterThan(0); expect(() => store.publish(d.id, d.revision, admin)).toThrow('Publication blocked'); });
    it('shows affected references after deletion and does not allow a new error under baseline exceptions', () => { let d = store.createDraft(owner); const q = d.config.QuestionBank.find(q => q.active === 'TRUE' && q.response_type === 'percent')!; const p = payload(d); p.MetricBenchmarks = p.MetricBenchmarks.filter(m => m.metric_id !== q.metric_id); d = store.save(d.id, p, admin); expect(store.validate(d).errors.some(e => e.questions.includes(q.question_id))).toBe(true); });
    it('rejects mismatched units, invalid normalization parameters and unreviewed records', () => { let d = store.createDraft(owner); const q = d.config.QuestionBank.find(q => q.active === 'TRUE' && q.response_type === 'percent')!, m = d.config.MetricBenchmarks.find(m => m.metric_id === q.metric_id)!; const p = payload(d), newMetric = { ...m, metric_id: 'M6-test', unit: 'litres/tonne', normalization_method: 'linear_cap', param_1: '0' }; p.MetricBenchmarks = [...p.MetricBenchmarks, newMetric]; p.QuestionBank = p.QuestionBank.map(row => row.question_id === q.question_id ? { ...row, metric_id: newMetric.metric_id } : row); d = store.save(d.id, p, admin); const errors = store.validate(d).errors; expect(errors.some(e => e.key.startsWith('mapping-unit:'))).toBe(true); expect(errors.some(e => e.key.startsWith('param1:'))).toBe(true); expect(errors.some(e => e.key === 'review:MetricBenchmarks:' + benchmarkKey(newMetric))).toBe(true); });
    it('only super admins grant/revoke, and revocation kills development sessions', () => { expect(() => store.access(admin.email, true, admin)).toThrow('Only super'); store.access(admin.email, true, owner); const token = store.devSession(admin.email); expect(store.devActor(token)?.role).toBe('admin'); store.access(admin.email, false, owner); expect(store.devActor(token)).toBeNull(); store.access(admin.email, true, owner); expect(store.devActor(token)).toBeNull(); expect(() => store.access(owner.email, false, owner)).toThrow('cannot be revoked'); });
    it('detects corrupt immutable artifacts rather than silently falling back', () => { const r = store.release(); writeFileSync(path.join(dir, 'blobs', r.hash + '.json'), '{}'); expect(() => store.release()).toThrow('integrity'); });
    it('rejects a draft based on a release superseded by another publisher', () => { const a = store.createDraft(owner), b = store.createDraft(admin); store.publish(a.id, a.revision, owner); expect(() => store.publish(b.id, b.revision, admin)).toThrow('active release changed'); });
    it('never enables the development shortcut in production or on a nonloopback origin', () => { vi.stubEnv('MOSAIC_ADMIN_ENABLED', '1'); vi.stubEnv('MOSAIC_DEV_IDENTITY', '1'); vi.stubEnv('BETTER_AUTH_URL', 'http://localhost:3206'); vi.stubEnv('NODE_ENV', 'production'); expect(developmentIdentityAllowed('http://localhost:3206/api/admin/development-login')).toBe(false); vi.stubEnv('NODE_ENV', 'development'); expect(developmentIdentityAllowed('http://localhost:3206/api/admin/development-login')).toBe(true); expect(developmentIdentityAllowed('http://example.com/api/admin/development-login')).toBe(false); expect(() => sameOrigin(new Request('http://localhost:3206/api/admin/access', { headers: { origin: 'https://attacker.example' } }))).toThrow('Cross-origin'); });
    it('reports exact wording and mapping changes without mutating other fields', () => { const a = store.release().config, b = { ...a, QuestionBank: a.QuestionBank.map((q, i) => i === 0 ? { ...q, question_text: 'Reviewed wording' } : q) }; expect(changes(a, b)).toEqual([{ entity: 'QuestionBank', key: a.QuestionBank[0]!.question_id, field: 'question_text', before: a.QuestionBank[0]!.question_text, after: 'Reviewed wording' }]); });
});
import { effortArtifact, quickEligibility } from '../../src/application/admin/quick-wording';
import { selectQuickQuestions } from '../../src/application/quick-assessment';
import { goldenCases } from '../helpers/legacy-scoring';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const choicesInput=(edits:Record<string,string|undefined>[],quickChoices:Record<string,'keep'|'exclude'>={})=>({base:store.release().id,expectedLatest:store.listReleases()[0]!.id,edits,quickChoices,notes:'Eligibility review'});
const selected=(release:ReturnType<AdminStore['release']>,index=0)=>selectQuickQuestions(release.config,goldenCases[index]!.profile,quickEligibility(release)).map(q=>q.question_id);
describe('versioned per-question Quick eligibility',()=>{
 it('edits an already-ineligible question with no choice and keeps Quick selection unchanged',()=>{
  const before=store.release(),q=before.config.QuestionBank.find(q=>q.question_id==='U-002')!;
  const body=choicesInput([{question_id:q.question_id,question_text:q.question_text+' Clarified.'}]);
  expect(store.reviewQuestions(body).quickReview).toEqual([]);
  const saved=store.saveQuestions(body,owner);expect(saved.quickDecisions).toEqual([]);expect(store.release().id).toBe(saved.id);
  for(let i=0;i<goldenCases.length;i++)expect(selected(saved,i)).toEqual(selected(before,i));
 });
 it('keeps an eligible edited question, binds decision to version/change, and preserves effort artifact and ranking',()=>{
  const bytes=readFileSync('config/assessment-profiles/quick-effort-v1.json');const before=store.release();
  const body=choicesInput([{question_id:'U-001',answer_scale_id:'PARTIAL_3',question_text:'Does your company maintain a written environmental policy?'}],{'U-001':'keep'});
  expect(store.reviewQuestions(body).quickReview).toEqual(['U-001']);
  expect(()=>store.saveQuestions({...body,quickChoices:{}},owner)).toThrow('Choose Keep eligible');
  const saved=store.saveQuestions(body,owner),tag=effortArtifact.rows.find(t=>t.question_id==='U-001')!;
  expect(saved.quickDecisions?.[0]).toMatchObject({questionId:'U-001',choice:'keep',savedVersion:saved.id,editor:owner.email,notes:body.notes,originalClassification:tag.assigned_effort_class,originalReviewStatus:tag.review_status,originalOwnerApproved:tag.owner_approved,changes:saved.changeSummary});
  expect(saved.quickDecisions?.[0]?.beforeHash).not.toBe(saved.quickDecisions?.[0]?.afterHash);
  for(let i=0;i<goldenCases.length;i++)expect(selected(saved,i)).toEqual(selected(before,i));
  expect(readFileSync('config/assessment-profiles/quick-effort-v1.json')).toEqual(bytes);
  expect(createHash('sha256').update(bytes).digest('hex')).toBe('cec2d4b38d75decb0e5ae138a0c840049a633a320880dd077d2e809ff55e6cfa');
  expect(store.release(before.id)).toEqual(before);
  expect(()=>store.saveQuestions(body,admin)).toThrow('newer configuration');
  store.close();store=new AdminStore(dir);expect(store.release(saved.id)).toEqual(saved);
 });
 it('excludes only the edited eligible question, refills from remaining pool and carries exclusion through later edits',()=>{
  const before=store.release(),id=selected(before)[0]!,q=before.config.QuestionBank.find(q=>q.question_id===id)!;
  const saved=store.saveQuestions(choicesInput([{question_id:id,question_text:q.question_text+' Clarification.'}],{[id]:'exclude'}),owner);
  expect(selected(saved)).not.toContain(id);expect(selected(saved)).toHaveLength(20);expect(selected(before)).toContain(id);
  const again=choicesInput([{question_id:id,question_text:q.question_text+' Further clarification.'}]);expect(store.reviewQuestions(again).quickReview).toEqual([]);
  const later=store.saveQuestions(again,owner);expect(selected(later)).toEqual(selected(saved));expect(later.quickDecisions).toEqual([]);
 });
 it('never allows eligibility choices to bypass mapping validation or edit other fields',()=>{
  for(const edit of [{question_id:'U-001',answer_scale_id:'missing'},{question_id:'U-001',answer_scale_id:'NUMERIC_INPUT'},{question_id:'U-031',metric_id:'missing'},{question_id:'U-031',metric_id:'MET_EN_INT_REV'},{question_id:'U-031',answer_scale_id:'YN'}]){
   const body=choicesInput([edit]);const review=store.reviewQuestions(body);expect(review.validation.errors.length).toBeGreaterThan(0);
   expect(()=>store.saveQuestions({...body,quickChoices:Object.fromEntries(review.quickReview.map(id=>[id,'keep']))},owner)).toThrow('Save blocked');
  }
  expect(()=>store.saveQuestions(choicesInput([{question_id:'U-001',base_weight:'999'}],{'U-001':'keep'}),owner)).toThrow();
  expect(()=>store.saveQuestions(choicesInput([{question_id:'U-002',question_text:'Clarification'}],{'U-002':'keep'}),owner)).toThrow('only to edited questions currently eligible');
 });
 it('supports valid metric mapping without changing universal documents or ineligible-question status',()=>{
  const before=store.release(),body=choicesInput([{question_id:'U-031',metric_id:'MET_WASTE_DIV'}]);expect(store.reviewQuestions(body).quickReview).toEqual([]);
  const saved=store.saveQuestions(body,owner);expect(saved.changeSummary).toEqual([expect.objectContaining({key:'U-031',field:'metric_id',before:'waste_diverted_percent',after:'MET_WASTE_DIV'})]);
  expect(saved.config.AnswerScales).toEqual(before.config.AnswerScales);expect(saved.config.MetricBenchmarks).toEqual(before.config.MetricBenchmarks);expect(selected(saved)).toEqual(selected(before));
 });
});
it('uses original eligibility for legacy releases without inventing exclusions from the retired hash gate',()=>{
 const before=store.release(),legacy={...before,config:{...before.config,QuestionBank:before.config.QuestionBank.map(q=>q.question_id==='U-001'?{...q,question_text:q.question_text+' Previous local edit.'}:q)}};
 expect(quickEligibility(legacy)['U-001']).toBe(true);expect(selected(legacy)).toEqual(selected(before));
});

const scoringBody=(entity:'AnswerScales'|'MetricBenchmarks',rows:readonly unknown[])=>({entity,rows,expectedActive:store.release().id,expectedScoring:store.scoring().id,notes:'',citation:'Approved configuration, local test review',rationale:'Bounded administrator scoring update.'});
describe('universal scoring publication',()=>{
 it('publishes scale changes immediately, preserves immutable sessions and Quick eligibility, and records history across refresh',()=>{
  const original=store.release();
  const kept=store.saveQuestions(choicesInput([{question_id:'U-001',question_text:'Does your company have a written environmental policy?'}],{'U-001':'keep'}),owner);
  const rows=kept.config.AnswerScales.map(r=>r.answer_scale_id==='YN'&&r.normalized_score==='100'?{...r,normalized_score:'90'}:r);
  const body=scoringBody('AnswerScales',rows);expect(store.reviewScoring(body).validation.errors).toEqual([]);
  const saved=store.publishScoring(body,admin);expect(store.release().id).toBe(saved.id);expect(saved.config.AnswerScales).toEqual(rows);
  expect(store.release(original.id)).toEqual(original);expect(store.release(kept.id)).toEqual(kept);expect(quickEligibility(saved)).toEqual(quickEligibility(kept));
  expect(saved.notes).toBe('');expect(saved.publishedBy).toBe(admin.email);expect(saved.changeSummary?.some(c=>c.entity==='AnswerScales')).toBe(true);
  expect(()=>store.publishScoring(body,owner)).toThrow('newer configuration');
  store.close();store=new AdminStore(dir);expect(store.scoring().id).toBe(saved.id);expect(store.scoringHistory().length).toBe(2);
  const restored=store.makeDefault(original.id,saved.id,owner);expect(restored.config.QuestionBank).toEqual(original.config.QuestionBank);expect(restored.config.AnswerScales).toEqual(rows);expect(store.release(original.id)).toEqual(original);
  expect(store.editingRelease(original.id).config.AnswerScales).toEqual(rows);
 });
 it('adds, edits and deletes unused scales and benchmarks, retaining optional notes and exact history',()=>{
  for(const entity of ['AnswerScales','MetricBenchmarks'] as const){
   const base=store.scoring().config[entity];const row=entity==='AnswerScales'?{...store.scoring().config.AnswerScales[0]!,answer_scale_id:'CUSTOM_UNUSED'}:{...store.scoring().config.MetricBenchmarks[0]!,metric_id:'CUSTOM_UNUSED'};
   const first=store.publishScoring({...scoringBody(entity,[...base,row]),notes:'Custom reference'},owner);expect(first.notes).toBe('Custom reference');
   const changed=entity==='AnswerScales'?{...row,normalized_score:'42'}:{...row,metric_name:'Custom updated benchmark'};
   const second=store.publishScoring(scoringBody(entity,[...base,changed]),admin);expect(second.config[entity]).toContainEqual(changed);
   const third=store.publishScoring(scoringBody(entity,base),admin);expect(third.config[entity]).toEqual(base);expect(store.release(first.id).config[entity]).toContainEqual(row);
  }
 });
 it('blocks referenced deletions, malformed scores, incompatible units, missing provenance and numeric marker changes',()=>{
  const c=store.scoring().config;
  const deleted=scoringBody('AnswerScales',c.AnswerScales.filter(s=>s.answer_scale_id!=='YN'));expect(store.reviewScoring(deleted).validation.errors.some(e=>e.questions.includes('U-001'))).toBe(true);expect(()=>store.publishScoring(deleted,admin)).toThrow('blocked');
  const metric=c.QuestionBank.find(q=>q.active==='TRUE'&&q.response_type==='percent')!.metric_id;
  const removed=scoringBody('MetricBenchmarks',c.MetricBenchmarks.filter(m=>m.metric_id!==metric));expect(store.reviewScoring(removed).validation.errors.some(e=>e.key.startsWith('deleted-reference'))).toBe(true);
  const units=scoringBody('MetricBenchmarks',c.MetricBenchmarks.map(m=>m.metric_id===metric?{...m,unit:'kWh/USD'}:m));expect(store.reviewScoring(units).validation.errors.some(e=>e.key.startsWith('mapping-unit'))).toBe(true);
  const bad=scoringBody('AnswerScales',c.AnswerScales.map((r,i)=>i===0?{...r,normalized_score:'101'}:r));expect(()=>store.publishScoring(bad,admin)).toThrow('blocked');
  const valid=scoringBody('AnswerScales',[...c.AnswerScales,{...c.AnswerScales[0]!,answer_scale_id:'UNUSED'}]);expect(()=>store.publishScoring({...valid,citation:''},admin)).toThrow('source/reference');
  const numeric=scoringBody('AnswerScales',c.AnswerScales.map(r=>r.answer_scale_id==='NUMERIC_INPUT'?{...r,normalized_score:'20'}:r));expect(()=>store.publishScoring(numeric,admin)).toThrow('read-only input marker');
  expect(store.release().config).toEqual(c);
 });
 it('checks saved configuration references even when no longer assigned in the default and blocks legacy bypass',()=>{
  const c=store.release().config;store.saveQuestions(choicesInput([{question_id:'U-001',answer_scale_id:'PARTIAL_3'}],{'U-001':'keep'}),owner);
  const updated=store.publishScoring(scoringBody('AnswerScales',c.AnswerScales.map(s=>s.answer_scale_id==='YN'&&s.normalized_score==='100'?{...s,normalized_score:'95'}:s)),admin);
  const d=store.createDraft(owner),p=payload(d);p.AnswerScales=c.AnswerScales;const saved=store.save(d.id,p,owner);expect(()=>store.publish(saved.id,saved.revision,owner)).toThrow('Universal Scoring Documents');
  const deletion=scoringBody('AnswerScales',updated.config.AnswerScales.filter(s=>s.answer_scale_id!=='YN'));expect(store.reviewScoring(deletion).validation.errors.length).toBeGreaterThan(0);
 });
});

import {compileFormula} from '../../src/domain/scoring/formula-expression';
import {legacyFormulas,formulasFor,evaluateFormula,exampleMetric} from '../../src/domain/scoring/scoring-formulas';
import {normalizeAnswer,scoreAssessment} from '../../src/domain/scoring/score-assessment';
import {goldenAnswers} from '../helpers/golden-comparison';
import type {ScoringFormulaRecord} from '../../src/domain/config/types';
const formulaBody=(rows:readonly ScoringFormulaRecord[])=>({entity:'ScoringFormulas',rows,expectedActive:store.release().id,expectedScoring:store.scoring().id,citation:'Local methodology review',rationale:'Reviewed formula revision',notes:''});
describe('versioned scoring formulas',()=>{
 it('parses mathematical precedence, lazy piecewise expressions and rejects executable/unknown/unbounded syntax',()=>{
  expect(compileFormula('-2^2 + 2^3^2',[] )({})).toBe(508);
  expect(compileFormula('x == 0 ? 100 : min(100, 10 / x)',['x'])({x:0})).toBe(100);
  expect(compileFormula('x > 3 && x < 8 ? sqrt(25) : abs(-2)',['x'])({x:5})).toBe(5);
  for(const expression of ['process.exit()','globalThis','x.constructor','(()=>1)()','Math.exp(x)','unknown + x','exp(1,2)','1e999','1;2','x = 3','min()'])expect(()=>compileFormula(expression,['x'])).toThrow();
  expect(()=>compileFormula('1 / x',['x'])({x:0})).toThrow('zero');expect(()=>compileFormula('sqrt(-1)',[])({})).toThrow('non-finite');expect(()=>compileFormula('('.repeat(45)+'1'+')'.repeat(45),[])({})).toThrow('nesting');
 });
 it('imports all existing methods without changing benchmark normalization or Golden results',()=>{
  const c=store.release().config,imported={...c,ScoringFormulas:legacyFormulas};const seen=new Set<string>();
  for(const m of c.MetricBenchmarks.filter(m=>m.active==='TRUE')){const original=c.QuestionBank.find(q=>q.metric_id===m.metric_id&&['numeric','percent'].includes(q.response_type));if(!original)continue;
   const q={...original,metric_id:m.metric_id};const one={...c,MetricBenchmarks:[m]},two={...one,ScoringFormulas:legacyFormulas};
   for(const x of [0,1,10,40,60,100])expect(normalizeAnswer(two,q,String(x),m.benchmark_group_value)?.value).toBeCloseTo(normalizeAnswer(one,q,String(x),m.benchmark_group_value)!.value,12);seen.add(m.normalization_method);
  }
  expect(seen.has('gaussian')).toBe(true);
  for(const f of legacyFormulas){const m=exampleMetric(f),q={...c.QuestionBank[0]!,metric_id:m.metric_id,response_type:'numeric'};const one={...c,MetricBenchmarks:[m]};for(const x of [0,1,10,40,60,100])expect(normalizeAnswer({...one,ScoringFormulas:legacyFormulas},q,String(x),'')?.value).toBeCloseTo(normalizeAnswer(one,q,String(x),'')!.value,12);}
  for(const f of goldenCases){const a=scoreAssessment(c,f.profile,goldenAnswers(f)),b=scoreAssessment(imported,f.profile,goldenAnswers(f));expect(b.rawOverall).toBe(a.rawOverall);expect(b.weightedOverall).toBe(a.weightedOverall);expect(b.questions.map(q=>q.status==='scored'?q.earned:null)).toEqual(a.questions.map(q=>q.status==='scored'?q.earned:null));}
 });
 it('edits a shared formula, preserves sessions, records exact formula diff and restores the whole scoring snapshot',()=>{
  const old=store.release(),q=old.config.QuestionBank.find(q=>q.metric_id==='working_hours')!;
  const changed=formulasFor(old.config).map(f=>f.formula_id==='gaussian'?{...f,expression:'50',explanation:'Local reviewed constant-score experiment'}:f);
  const published=store.publishScoring(formulaBody(changed),admin);expect(normalizeAnswer(published.config,q,'40','')?.value).toBe(50);expect(normalizeAnswer(store.release(old.id).config,q,'40','')?.value).toBe(100);
  expect(published.changeSummary).toContainEqual(expect.objectContaining({entity:'ScoringFormulas',key:'gaussian',field:'expression',after:'50'}));expect(published.files).toHaveProperty('ScoringFormulas');expect(published.notes).toBe('');
  const restoreInput={expectedActive:published.id,expectedScoring:published.id,notes:'Restore reviewed starting point'};
  const restored=store.restoreScoring(old.id,restoreInput,owner);expect(normalizeAnswer(restored.config,q,'40','')?.value).toBe(100);expect(store.release(published.id).config.ScoringFormulas).toEqual(changed);expect(()=>store.restoreScoring(old.id,restoreInput,owner)).toThrow('newer configuration');
  store.close();store=new AdminStore(dir);expect(store.scoring().id).toBe(restored.id);expect(store.scoringHistory().some(r=>r.id===published.id)).toBe(true);
 });
 it('publishes a new formula and benchmark assignment atomically, with named overrides and no changes to other metrics',()=>{
  const old=store.release();const custom:ScoringFormulaRecord={formula_id:'hours_piecewise',name:'Hours piecewise',expression:'x <= ideal_hours ? 100 : max(0, 100 - (x - ideal_hours) * penalty)',parameters:JSON.stringify([{name:'ideal_hours',label:'Ideal weekly hours',defaultValue:40},{name:'penalty',label:'Points per excess hour',defaultValue:5}]),explanation:'Local methodology example',examples:'0, 40, 60, 100'};
  const rows=old.config.MetricBenchmarks.map(m=>m.metric_id==='working_hours'?{...m,normalization_method:custom.formula_id,formula_parameters:'{"penalty":2}'}:m);
  const body={...scoringBody('MetricBenchmarks',rows),formulas:[...formulasFor(old.config),custom]};const saved=store.publishScoring(body,admin),q=old.config.QuestionBank.find(q=>q.metric_id==='working_hours')!;
  expect(normalizeAnswer(saved.config,q,'60','')?.value).toBe(60);expect(saved.config.MetricBenchmarks.filter(m=>m.metric_id!=='working_hours')).toEqual(old.config.MetricBenchmarks.filter(m=>m.metric_id!=='working_hours'));
  expect(()=>store.publishScoring(body,admin)).toThrow('newer configuration');expect(saved.changeSummary?.some(c=>c.entity==='MetricBenchmarks')).toBe(true);expect(saved.changeSummary?.some(c=>c.entity==='ScoringFormulas')).toBe(true);
 });
 it('blocks missing/deleted formulas, undefined parameters, invalid samples and runtime-only singularities without publishing',()=>{
  const old=store.release(),all=formulasFor(old.config);
  expect(()=>store.publishScoring(formulaBody(all.filter(f=>f.formula_id!=='gaussian')),owner)).toThrow('Missing formula');
  for(const expression of ['missing_parameter+x','1/0','101','sqrt(-1)'])expect(()=>store.publishScoring(formulaBody(all.map(f=>f.formula_id==='gaussian'?{...f,expression}:f)),owner)).toThrow('blocked');
  const duplicate=[...all,all[0]!];expect(()=>store.publishScoring(formulaBody(duplicate),owner)).toThrow('Duplicate formula');
  expect(store.release()).toEqual(old);
  const d=store.createDraft(owner),bad=payload(d);bad.MetricBenchmarks=bad.MetricBenchmarks.map(m=>m.metric_id==='working_hours'?{...m,normalization_method:'missing_formula'}:m);const legacy=store.save(d.id,bad,owner);expect(()=>store.publish(legacy.id,legacy.revision,owner)).toThrow('Missing formula');
  const bounded=store.publishScoring(formulaBody(all.map(f=>f.formula_id==='gaussian'?{...f,expression:'x == 37 ? 101 : 50',examples:'0, 40'}:f)),owner);const q=old.config.QuestionBank.find(q=>q.metric_id==='working_hours')!;expect(()=>normalizeAnswer(bounded.config,q,'37','')).toThrow('between 0 and 100');expect(normalizeAnswer(bounded.config,q,'38','')?.value).toBe(50);
  const f={...all.find(f=>f.formula_id==='gaussian')!,expression:'100 / (x - 37)',examples:'40, 60'};expect(()=>evaluateFormula(f,old.config.MetricBenchmarks.find(m=>m.metric_id==='working_hours')!,37)).toThrow('zero');
 });
 it('adds and deletes an unused formula while preserving immutable publications',()=>{
  const extra:ScoringFormulaRecord={formula_id:'unused',name:'Unused',expression:'clamp(x,0,100)',parameters:'[]',explanation:'Test',examples:'0, 50, 100'};
  const first=store.publishScoring(formulaBody([...legacyFormulas,extra]),owner);expect(first.config.ScoringFormulas).toContainEqual(extra);
  const second=store.publishScoring(formulaBody(legacyFormulas),owner);expect(second.config.ScoringFormulas).not.toContainEqual(extra);expect(store.release(first.id).config.ScoringFormulas).toContainEqual(extra);
 });
});
