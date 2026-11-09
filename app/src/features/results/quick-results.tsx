"use client";
import Link from 'next/link';
import { useEffect,useReducer } from 'react';
import { useRouter } from 'next/navigation';
import { createAssessmentModel,type Session } from '../assessment/model';
import { catalogProfileErrors } from '../assessment/assessment-context';
import { quickRequest } from '../assessment/quick-request';
import { selectedQuestions,type AssessmentCatalog } from '../../application/assessment-catalog';
import { browserSession,watchAssessmentSession } from '../../adapters/assessment-session';
import type { ScoreSummary } from '../../application/score-summary';
type Data={version:string;questionIds:string[];score:Pick<ScoreSummary,'categories'|'answered'|'missing'|'rawOverall'|'weightedOverall'>};
type View={status:'loading'}|{status:'error';message:string}|{status:'ready';data:Data;session:Session};
const display=(value:number|null)=>value===null?'Not scored':value.toFixed(1);
export function QuickResults({catalog}:{catalog:AssessmentCatalog}){
 const router=useRouter();
 const [view,setView]=useReducer((_v:View,next:View)=>next,{status:'loading'});
 useEffect(()=>{
  const model=createAssessmentModel(catalog.version,p=>selectedQuestions(catalog,p),p=>catalogProfileErrors(catalog,p));
  let abort:AbortController|undefined;
  const refresh=async()=>{
   abort?.abort();abort=new AbortController();const signal=abort.signal;
   const restored=browserSession(model.sessionSchema).load(),session=restored.state;
   if(!session?.assessmentProfile || session.progress!==4){setView({status:'error',message:restored.warning??'Complete and review your Quick assessment before opening its results.'});return;}
   setView({status:'loading'});
   try{
    const response=await fetch('/api/quick-assessment',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(quickRequest(session,'score')),signal});
    const data=await response.json() as Data;
    if(!response.ok || !data.score || data.version!==session.assessmentProfile.version || JSON.stringify(data.questionIds)!==JSON.stringify(session.assessmentProfile.questionIds))throw Error('Quick selection changed. Return to Setup and review your questions.');
    if(!signal.aborted)setView({status:'ready',data,session});
   }catch(error){if(!signal.aborted)setView({status:'error',message:error instanceof Error?error.message:'Quick scores unavailable.'});}
  };
  const unsubscribe=watchAssessmentSession(()=>void refresh(),()=>void refresh(),()=>abort?.abort());
  void refresh();return()=>{abort?.abort();unsubscribe();};
 },[catalog]);
 function continueFull(){
  const model=createAssessmentModel(catalog.version,p=>selectedQuestions(catalog,p),p=>catalogProfileErrors(catalog,p)),storage=browserSession(model.sessionSchema),state=storage.load().state;
  if(!state)return;
  const warning=storage.save(model.assessmentReducer(state,{type:'continue-full'}));
  if(warning)setView({status:'error',message:warning});else router.push('/assessment');
 }
 return <main className="page-container py-12"><Link href="/" className="text-link">MOSAIC home</Link><h1 className="text-display mt-6">Quick assessment results</h1>
  <p className="mt-4"><strong>Quick subset scores</strong> cover a smaller question set and are not directly comparable with Full assessment scores.</p>
  {view.status==='loading'?<p role="status" className="mt-6">Calculating Quick subset scores…</p>:view.status==='error'?<p role="alert" className="mt-6">{view.message}</p>:<>
   <p className="mt-6">{view.data.score.answered} of {view.data.questionIds.length} Quick questions answered · {view.data.score.missing} unanswered in Quick.</p>
   <p className="text-small mt-2">Questions excluded from Quick are outside this assessment, not unanswered Full questions. Missing Quick answers are excluded from score denominators; category weights remain unchanged.</p>
   <dl className="grid gap-6 md:grid-cols-2 mt-8"><div><dt>Quick weighted subset score</dt><dd className="text-heading">{display(view.data.score.weightedOverall)} / 100</dd></div><div><dt>Quick raw subset score</dt><dd className="text-heading">{display(view.data.score.rawOverall)} / 100</dd></div></dl>
   <div className="grid gap-4 md:grid-cols-2 mt-8">{view.data.score.categories.map(c=><section className="preview-notice" key={c.category}><h2 className="text-subheading">{c.category}</h2><p>{display(c.percent)}{c.percent===null?'':' / 100'}</p><p className="text-small">{c.answered} answered of {catalog.questions.filter(q=>q.category===c.category&&view.data.questionIds.includes(q.id)).length} selected</p></section>)}</div>
  </>}
  <p className="mt-8">Continue to Full for portraits, recommendations, Levers and reports. Your shared answers will be retained. Additional questions can change the scores without indicating a change in business performance.</p>
  <div className="flex flex-wrap gap-4 mt-6"><Link className="button-secondary" href="/assessment/quick">Review Quick answers</Link><button className="button-primary" onClick={continueFull}>Continue to Full assessment</button></div>
 </main>;
}
