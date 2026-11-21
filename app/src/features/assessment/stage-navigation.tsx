"use client";
import { useReleaseCatalog } from "./release-boundary";
import { useEffect, useState, useReducer, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Session, Action } from "./model";
import { createAssessmentModel, unanswered } from "./model";
import { catalogProfileErrors } from "./assessment-context";
import { selectedQuestions, type AssessmentCatalog } from "../../application/assessment-catalog";
import { browserSession, watchAssessmentSession } from "../../adapters/assessment-session";
export function StageNavigation({session,catalog,onStage,results=false}:{session:Session;catalog:AssessmentCatalog;onStage:(action:Action|"results")=>void;results?:boolean}) {
 const valid=Object.keys(catalogProfileErrors(catalog,session.profile)).length===0;
 const started=valid && Boolean(session.activeId) && selectedQuestions(catalog,session.profile).some(q=>q.id===session.activeId);
 const reached = session.progress ?? ({setup:0,method:1,questions:2,review:3,boundary:3}[session.phase]);
 const stages = [
  {name:"Set Up",phase:"setup",action:{type:"edit-setup"} as Action,enabled:true},
  {name:"Data Input",phase:"method",action:{type:"method"} as Action,enabled:valid},
  {name:"Questions",phase:"questions",action:{type:"start"} as Action,enabled:valid && reached >= 2},
  {name:"Review",phase:"review",action:{type:"review"} as Action,enabled:started},
  {name:"Results",phase:"results",action:"results" as const,enabled:valid && session.progress === 4 && !session.skipped.some(id=>session.answers[id]?.trim())},
 ].filter(stage=>!session.assessmentProfile || stage.phase!=="method");
 const current=results?"results":session.phase;
 const questions=selectedQuestions(catalog,session.profile).filter(q=>!session.assessmentProfile || session.assessmentProfile.questionIds.includes(q.id));
 const missing=unanswered(session,questions).length;
 return <nav aria-label="Assessment stages" className="stage-navigation">{stages.map((s,i)=>{
  const state = current === s.phase ? "current" : !s.enabled ? "locked" : reached > i ? "completed" : "available";
  return <button key={s.phase} type="button" className="button-secondary" aria-label={`${i+1}. ${s.name}`} aria-describedby={"stage-"+s.phase+"-state"} data-state={state} aria-current={state === "current" ? "step" : undefined} disabled={!s.enabled}
   title={state === "locked" ? s.phase === "results" ? "Review answers and choose Generate score and recommendations first" : "Complete the preceding stage first" : undefined}
   onClick={()=>onStage(s.action)}><span>{i+1}. {s.name}</span><small id={"stage-"+s.phase+"-state"}>{s.phase === "questions" && s.enabled && missing > 0 ? `${questions.length-missing}/${questions.length} answered` : state}</small></button>;
 })}</nav>;

}
export function ResultsStages({catalog: initialCatalog}:{catalog:AssessmentCatalog}) {
  const catalog = useReleaseCatalog(initialCatalog);
 const [session,setSession]=useReducer((_state:Session|null,next:Session|null)=>next,null),[error,setError]=useState("");const router=useRouter();
 useEffect(()=>{const model=createAssessmentModel(catalog.version,p=>selectedQuestions(catalog,p),p=>catalogProfileErrors(catalog,p));setSession(browserSession(model.sessionSchema).load().state);},[catalog]);
 if(!session)return null;
 return <><StageNavigation session={session} catalog={catalog} results onStage={action=>{
  if(action==='results')return;
  const model=createAssessmentModel(catalog.version,p=>selectedQuestions(catalog,p),p=>catalogProfileErrors(catalog,p));const store=browserSession(model.sessionSchema),fresh=store.load().state;
  if(!fresh){setError("Assessment could not be restored.");return;}
  const warning=store.save(model.assessmentReducer(fresh,action));if(warning){setError(warning);return;}router.push('/assessment');
 }}/>{error&&<p role="alert">{error}</p>}</>;
}

// This is a workflow gate, not authorization for a paid request. Only the
// ephemeral one-use intent can start generation; reload/revisit never grants it.
export function ResultsGate({catalog: initialCatalog,children}:{catalog:AssessmentCatalog;children:ReactNode}) {
  const catalog = useReleaseCatalog(initialCatalog);
 const [access,setAccess]=useReducer((_state:"loading"|"allowed"|"review"|"missing"|"quick",next:"loading"|"allowed"|"review"|"missing"|"quick")=>next,"loading");
 const router=useRouter();
 useEffect(()=>{
  const model=createAssessmentModel(catalog.version,p=>selectedQuestions(catalog,p),p=>catalogProfileErrors(catalog,p));
  const check=()=>{const state=browserSession(model.sessionSchema).load().state;setAccess(state?.assessmentProfile?"quick":!state?"missing":state.progress===4 && !state.skipped.some(id=>state.answers[id]?.trim())?"allowed":"review");};
  check();return watchAssessmentSession(check,check,()=>{});
 },[catalog]);
 if(access==="quick")return <section><h1 className="text-heading">Quick assessment</h1><p>Quick subset scores are shown separately from Full results.</p><button className="button-primary mt-4" onClick={()=>router.push('/quick-results')}>View Quick assessment results</button></section>;
 if(access==="allowed" || access==="missing")return children;
 if(access==="loading")return <p role="status">Restoring assessment…</p>;
 return <section className="results-section"><h1 className="text-heading">Review before Results</h1>
 <p className="mt-4">Review your answers and choose Generate score and recommendations before opening Results. If older skipped questions still contain answers, confirm or clear them in Review first. No new recommendation request has been made.</p>
 <button className="button-primary mt-4" onClick={()=>{
  const model=createAssessmentModel(catalog.version,p=>selectedQuestions(catalog,p),p=>catalogProfileErrors(catalog,p));const store=browserSession(model.sessionSchema),state=store.load().state;
  if(state && state.activeId && !Object.keys(catalogProfileErrors(catalog,state.profile)).length)store.save(model.assessmentReducer(state,{type:"review"}));
  router.push('/assessment');
 }}>Review assessment answers</button></section>;
}
