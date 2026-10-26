"use client";
import { useEffect, useReducer, useRef } from "react";
import Link from "next/link";
import { selectedQuestions, type AssessmentCatalog } from "../../application/assessment-catalog";
import { browserSession, watchAssessmentSession } from "../../adapters/assessment-session";
import { createAssessmentModel } from "../assessment/model";
import { catalogProfileErrors } from "../assessment/assessment-context";
import { recommendationRequestFromSession } from "../../application/recommendations/request";
import { consumeResultsGeneration } from "../../application/recommendations/generation-intent";
import { ComputedScores } from "../results/computed-scores";
import { RecommendationPresentation, type PresentationView } from "../results/recommendation-presentation";
import { syntheticContent, syntheticSession } from "./fixtures";
const receipt = "capstone.private-preview.pending.v1";
const configuration = {ready:true,code:"synthetic",settings:null,fingerprint:"synthetic-preview-v1",configVersion:"synthetic",sessionVersion:"synthetic",methodVersion:"synthetic",promptVersion:"synthetic",policyVersion:"synthetic"};
const initial:PresentationView={phase:"idle",code:"not_generated",configuration};
export function PrivatePreview({catalog}:{catalog:AssessmentCatalog}) {
 const [view,publish]=useReducer((_old:PresentationView,next:PresentationView)=>next,initial);
 const [scenario,setScenario]=useReducer((_old:string,next:string)=>next,"success");
 const [delay,setDelay]=useReducer((_old:number,next:number)=>next,6000);
 const [warning,setWarning]=useReducer((_old:string,next:string)=>next,"");
 const active=useRef(false);const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const model=createAssessmentModel(catalog.version,p=>selectedQuestions(catalog,p),p=>catalogProfileErrors(catalog,p));
 function stop(code:string,clearReceipt=true){if(timer.current)clearTimeout(timer.current);timer.current=null;active.current=false;if(clearReceipt){try{sessionStorage.removeItem(receipt);}catch{/* Receipt is conservative. */}}publish({...initial,phase:code==="interrupted"?"unavailable":"idle",code});}
 function generate(){
  if(active.current)return;
  const state=browserSession(model.sessionSchema).load().state;
  if(!state || !Object.keys(state.answers).length){publish({...initial,code:"no_assessment"});return;}
  try{sessionStorage.setItem(receipt,"pending");}catch{setWarning("Preview storage is unavailable. No simulation started.");return;}
  active.current=true;publish({...initial,phase:"loading",code:"generating"});
  timer.current=setTimeout(()=>{
   active.current=false;timer.current=null;try{sessionStorage.removeItem(receipt);}catch{/* Never auto-retry. */}
   if(scenario!=="success"){publish({...initial,phase:"unavailable",code:scenario==="timeout"?"timeout":"provider_failure"});return;}
   publish({...initial,phase:"available",code:"available",result:{content:syntheticContent,evidence:{documentIds:[],chunkIds:[],usableChunkIds:[],limitations:["Synthetic examples only; no provider, retrieval or output validation run."]},identity:{inputId:"synthetic-preview-v1",provider:{id:"synthetic",model:"none",settings:null},configVersion:catalog.version,methodVersion:"synthetic",promptVersion:"synthetic",policyVersion:"synthetic"}}});
  },delay);
 }
 // A receipt survives refresh; a timer/result does not. No mount-based retry.
 useEffect(()=>{
  let pending=false;try{pending=sessionStorage.getItem(receipt)==="pending";}catch{setWarning("Preview storage unavailable; refresh recovery cannot be saved.");}
  const state=browserSession(model.sessionSchema).load().state;
  if(pending)publish({...initial,phase:"unavailable",code:"interrupted"});
  else if(state && consumeResultsGeneration(recommendationRequestFromSession(state)))generate();
  const off=watchAssessmentSession(()=>stop("not_generated"),()=>stop("interrupted",false),()=>stop("interrupted",false));
  return()=>{off();if(timer.current)clearTimeout(timer.current);active.current=false;};
 // Snapshot controls for this mount; generation itself reads current controls.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[catalog]);
 function loadSample(){stop("not_generated");const store=browserSession(model.sessionSchema);const result=store.save(model.sessionSchema.parse(syntheticSession(catalog.version)));setWarning(result ?? "Synthetic assessment loaded. Existing answers in this preview tab were replaced.");}
 return <main className="page-container results-page" id="results-main">
  <section className="results-section"><h1 className="text-display">Private browser preview</h1><p className="mt-4">Actual assessment UI and deterministic scores; authored synthetic narrative examples. Controls below simulate outcomes locally, without contacting any provider. Timeout duration is a simulation control, not the live 30-second deadline.</p>
  <div className="mt-6 flex flex-wrap gap-4"><button className="button-secondary" onClick={loadSample}>Load synthetic assessment (replaces preview answers)</button><Link className="text-link" href="/assessment">Edit assessment</Link></div>
  <div className="mt-6 flex flex-wrap gap-4"><label>Simulated outcome <select aria-label="Simulated outcome" value={scenario} disabled={view.phase==="loading"} onChange={e=>setScenario(e.target.value)}><option value="success">Success</option><option value="timeout">Timeout</option><option value="error">Error</option></select></label><label>Delay <select aria-label="Delay" value={delay} disabled={view.phase==="loading"} onChange={e=>setDelay(Number(e.target.value))}><option value={0}>Immediate</option><option value={2000}>2 seconds</option><option value={6000}>6 seconds</option><option value={12000}>12 seconds</option></select></label></div><p role="status" className="mt-3">{warning}</p></section>
  <RecommendationPresentation view={view} generate={generate} cancel={()=>stop("cancelled")} synthetic><section className="results-section calculated-section" aria-label="Deterministic assessment results"><ComputedScores catalog={catalog}/></section></RecommendationPresentation>
 </main>;
}
