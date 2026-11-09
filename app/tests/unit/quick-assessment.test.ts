import {expect,test} from 'vitest';
import {readFileSync} from 'node:fs';
import {loadCanonicalConfig} from '../../src/adapters/config-repository';
import {selectQuickQuestions,computeQuickAssessment} from '../../src/application/quick-assessment';
import {goldenCases} from '../helpers/legacy-scoring';
import {scoreAssessment} from '../../src/domain/scoring/score-assessment';
import {assessmentCatalog,selectedQuestions} from '../../src/application/assessment-catalog';
import {createAssessmentModel} from '../../src/features/assessment/model';
import {quickRequest} from '../../src/features/assessment/quick-request';
const {config}=loadCanonicalConfig();
const catalog=assessmentCatalog(config);
const approved=JSON.parse(readFileSync('../experiments/m8.0-v1/twenty/comparison.json','utf8')) as {case_id:string;selected:{id:string}[]}[];
for(const fixture of goldenCases)test(fixture.case_id+' matches accepted set deterministically and leaves Full unchanged',()=>{
 const before=scoreAssessment(config,fixture.profile,{});
 const ids=selectQuickQuestions(config,fixture.profile).map(q=>q.question_id);
 expect(ids).toHaveLength(20);
 expect([...ids].sort()).toEqual(approved.find(c=>c.case_id===fixture.case_id)!.selected.map(q=>q.id).sort());
 expect(selectQuickQuestions(config,fixture.profile).map(q=>q.question_id)).toEqual(ids);
 expect(scoreAssessment(config,fixture.profile,{})).toEqual(before);
 expect(before.questions.map(q=>q.id)).toEqual(fixture.expected_question_ids);
});
const profile={companyName:'Example',industry:'Manufacturing (Industrial / Components)',subindustry:'',companySize:'251 - 500',country:'China',location:'APAC',targetMarket:'EU',targetBuyer:'Enterprise',businessGoal:'Prepare for procurement questionnaires',notes:''};
const model=createAssessmentModel(catalog.version,p=>selectedQuestions(catalog,p));
test('old sessions default to Full; Quick preserves Full answers and continuing restores shared answers',()=>{
 const old={...model.initialSession(),profile};
 expect(model.sessionSchema.parse(old).assessmentProfile).toBeUndefined();
 const full=model.assessmentReducer(old,{type:'start'});
 const result=computeQuickAssessment(config,quickRequest(full,'select'));
 let quick=model.assessmentReducer({...full,answers:{'U-018':'4','U-026':'42'}},{type:'quick-setup'});
 quick=model.assessmentReducer(quick,{type:'quick-selection',version:result.version,questionIds:result.questionIds});
 expect(quick.phase).toBe('questions');expect(model.questions(quick)).toHaveLength(result.questionIds.length);
 expect(model.sessionSchema.safeParse(quick).success).toBe(true);
 expect(quick.answers['U-026']).toBe('42'); // retained Full-only value, not a Quick missing/answer
 expect(quickRequest(quick,'score').answers).not.toHaveProperty('U-026');
 const continued=model.assessmentReducer(quick,{type:'continue-full'});
 expect(continued.assessmentProfile).toBeUndefined();expect(continued.answers).toEqual(quick.answers);
 expect(model.questions(continued)).toEqual(model.questions(full));
 expect(model.sessionSchema.safeParse(continued).success).toBe(true);
});
test('subset denominators use existing formulas and reject answers outside Quick',()=>{
 const state={...model.initialSession(),profile};
 const selection=computeQuickAssessment(config,quickRequest(state,'select'));
 const session={...state,assessmentProfile:{mode:'quick' as const,version:selection.version,questionIds:selection.questionIds}};
 const answers=Object.fromEntries(model.questions(session).map(q=>[q.id,'options' in q?q.options[0]!:'4']));
 const input=quickRequest({...session,answers},'score');
 const result=computeQuickAssessment(config,input);
 expect(result.score?.answered).toBe(20);expect(result.score?.missing).toBe(0);
 const expected=scoreAssessment({...config,QuestionBank:config.QuestionBank.filter(q=>selection.questionIds.includes(q.question_id))},{industry:profile.industry,employee_band:profile.companySize,company_location:profile.location,target_market_region:['EU'],target_buyer:profile.targetBuyer,business_goal:profile.businessGoal},answers);
 expect(result.score?.categories).toEqual(expected.categories);expect(result.score?.weightedOverall).toBe(expected.weightedOverall);
 const missing=computeQuickAssessment(config,{...input,answers:{}});expect(missing.score?.missing).toBe(20);
 expect(()=>computeQuickAssessment(config,{...input,answers:{'U-026':'42'}})).toThrow(/outside Quick/);
});
test('setup changes invalidate Quick selection without erasing retained answers',()=>{
 const state={...model.initialSession(),profile,answers:{'U-018':'4'},assessmentProfile:{mode:'quick' as const,version:'quick-proportional-1',questionIds:['U-018']}};
 const changed=model.assessmentReducer(state,{type:'profile',field:'targetBuyer',value:'Investor'});
 expect(changed.phase).toBe('setup');expect(changed.assessmentProfile?.questionIds).toEqual([]);expect(changed.answers).toEqual(state.answers);
});

for(const fixture of goldenCases)test(fixture.case_id+' produces valid Quick results from saved Golden answers',()=>{
 const selected=selectQuickQuestions(config,fixture.profile);
 const ids=selected.map(q=>q.question_id);
 const answers=Object.fromEntries(fixture.answers.filter(a=>ids.includes(a.question_id)).map(a=>[a.question_id,a.answer===null?'':String(a.answer)]));
 const p=fixture.profile;
 const result=computeQuickAssessment(config,{action:'score',configVersion:catalog.version,context:{industry:p.industry,companySize:p.employee_band.replace(/\s*[-–]\s*/g,' - '),location:p.company_location,targetMarkets:p.target_market_region,targetBuyer:p.target_buyer,businessGoal:p.business_goal},answers});
 expect(result.questionIds).toEqual(ids);expect(result.score).toBeDefined();
 expect(result.score!.answered).toBe(20);expect(result.score!.missing).toBe(0);
 for(const value of [result.score!.rawOverall,result.score!.weightedOverall,...result.score!.categories.map(c=>c.percent)]){expect(Number.isFinite(value)).toBe(true);expect(value).toBeGreaterThanOrEqual(0);expect(value).toBeLessThanOrEqual(100);}
});
