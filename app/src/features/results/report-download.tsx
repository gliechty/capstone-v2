"use client";
import { useReleaseCatalog } from "../assessment/release-boundary";
import { useEffect, useId, useRef, useState } from "react";
import type { AssessmentCatalog } from "../../application/assessment-catalog";
import { selectedQuestions } from "../../application/assessment-catalog";
import { createAssessmentModel } from "../assessment/model";
import { catalogProfileErrors } from "../assessment/assessment-context";
import { browserSession } from "../../adapters/assessment-session";
import { recommendationRequestFromSession } from "../../application/recommendations/request";
import { inputIdentityText } from "../../application/recommendations/identity";
import { browserInputHash } from "../../adapters/recommendation-client";
import type { ImprovementLever } from "../../application/improvement-levers";
import type { ScoreInput } from "../../application/score-summary";
import type { RecommendationView } from "../../application/recommendations/controller";
type ScenarioRequest={input:ScoreInput;answers:Record<string,string>;levers:ImprovementLever[]};
export function ReportDownload({catalog: initialCatalog,view,scenario,disabled=false}:{catalog:AssessmentCatalog;view:RecommendationView;scenario?:ScenarioRequest;disabled?:boolean}) {
  const catalog = useReleaseCatalog(initialCatalog);
 const latest=useRef(scenario),mounted=useRef(true);
 useEffect(()=>{latest.current=scenario;},[scenario]);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
 const menuId=useId(),picker=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const [openedFor,setOpenedFor]=useState<RecommendationView["result"]|null>(null);
 const [format,setFormat]=useState<"pdf"|"html">("pdf");
 const [busy,setBusy]=useState(false);
 const [feedback,setFeedback]=useState<{text:string;format:string;inputId:string|undefined;scenario:string|undefined}|null>(null);
 const message=feedback?.format===format && feedback.inputId===view.result?.identity.inputId && feedback.scenario===JSON.stringify(scenario)?feedback.text:"";
 const ready=view.phase === "available" && view.result?.status === "available" &&
  Boolean(view.result.content.key_gaps.length && view.result.content.priority_recommendations.length);
 const open=Boolean(ready && !disabled && !busy && openedFor && openedFor===view.result);
 useEffect(()=>{
  if(!open)return;
  const outside=(event:PointerEvent)=>{if(!picker.current?.contains(event.target as Node))setOpenedFor(null);};
  const escape=(event:KeyboardEvent)=>{if(event.key==="Escape"){setOpenedFor(null);trigger.current?.focus();}};
  document.addEventListener("pointerdown",outside);document.addEventListener("keydown",escape);
  return()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape);};
 },[open]);
 async function download(format:"pdf"|"html"){
  setOpenedFor(null);setFormat(format);
  const setMessage=(text:string)=>setFeedback({text,format,inputId:view.result?.identity.inputId,scenario:JSON.stringify(scenario)});
  if(busy||disabled||!ready)return;setBusy(true);setMessage("");
  try {
   const model=createAssessmentModel(catalog.version,p=>selectedQuestions(catalog,p),p=>catalogProfileErrors(catalog,p));
   const store=browserSession(model.sessionSchema),session=store.load().state;
   if(!session)throw new Error("Restore a valid assessment before downloading.");
   const input=recommendationRequestFromSession(session),identity=inputIdentityText(input);
   const scenarioKey=JSON.stringify(scenario);
   if(scenario && (scenario.input.configVersion!==input.configVersion || Object.entries(scenario.input.answers).some(([key,value])=>input.answers[key]!==value) || Object.entries(scenario.input.context).some(([key,value])=>JSON.stringify(input.context[key as keyof typeof input.context])!==JSON.stringify(value))))throw new Error("Assessment changed. Reload your levers before downloading.");
   const id=await browserInputHash(identity);
   if(view.result?.identity.inputId!==id)throw new Error("Generate recommendations for the current assessment before downloading.");
   const response=await fetch("/api/assessment-report-"+format, {
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({session,recommendations:{inputId:id,content:view.result.content},scenarioAnswers:scenario?.answers}),
    signal:AbortSignal.timeout(45000),
   });
   if(!response.ok){const failure=await response.json().catch(()=>null);throw new Error(failure?.error ?? "Please retry.");}
   const blob=await response.blob(),current=store.load().state;
   if(!mounted.current || JSON.stringify(latest.current)!==scenarioKey || !current || inputIdentityText(recommendationRequestFromSession(current))!==identity)
    throw new Error("Assessment or scenario changed. Download again for the current values.");
   const url=URL.createObjectURL(blob),link=document.createElement("a");
   link.href=url;link.download=(scenario?"mosaic-assessment-with-levers.":"mosaic-assessment-report.")+format;
   link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
   setMessage(format.toUpperCase()+" report downloaded.");
  } catch(error){setMessage(format.toUpperCase()+" report could not be downloaded. "+(error instanceof Error?(error.name==="TimeoutError"?"Preparation timed out. Please retry.":error.message):"Please retry."));}
  finally{setBusy(false);}
 }
 return <fieldset className="report-download mt-4"><legend className="font-semibold">Download assessment report</legend>
  <div ref={picker} className="report-format-picker mt-2" onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setOpenedFor(null);}}>
   <button ref={trigger} className="button-primary" aria-expanded={open} aria-controls={menuId} disabled={disabled||busy||!ready} onClick={()=>{setOpenedFor(open?null:view.result);setFeedback(null);}}>{busy?"Preparing "+format.toUpperCase()+" report...":"Download report"}<span aria-hidden="true"> {open?"\u25b4":"\u25be"}</span></button>
   {open && <div id={menuId} className="report-format-options" role="group" aria-label="Report file format">
    <button type="button" onClick={()=>void download("pdf")}>PDF</button>
    <button type="button" onClick={()=>void download("html")}>HTML</button>
   </div>}
  </div>
  {scenario && <p className="text-small mt-2">Includes a separately labeled hypothetical Levers appendix.</p>}
  <p className="text-small mt-2" role="status">{message || (ready?"Includes current scores, Key Gaps and Recommended Actions.":"Generate successful recommendations for this assessment before downloading either format.")}</p>
  {!ready && <a className="text-link" href="#recommendation-generation">{view.phase==="unavailable"?"Retry recommendations":"Go to recommendation generation"}</a>}
 </fieldset>;
}
