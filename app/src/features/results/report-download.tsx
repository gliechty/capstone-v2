"use client";
import { useEffect, useRef, useState } from "react";
import type { AssessmentCatalog } from "../../application/assessment-catalog";
import { selectedQuestions } from "../../application/assessment-catalog";
import { createAssessmentModel } from "../assessment/model";
import { catalogProfileErrors } from "../assessment/assessment-context";
import { browserSession } from "../../adapters/assessment-session";
import { requestAssessmentScore } from "../../adapters/assessment-scoring";
import { recommendationRequestFromSession } from "../../application/recommendations/request";
import { inputIdentityText } from "../../application/recommendations/identity";
import { browserInputHash } from "../../adapters/recommendation-client";
import type { ImprovementLever } from "../../application/improvement-levers";
import type { ScoreInput } from "../../application/score-summary";
import { loadReportAssets } from '../../application/report-assets';
import { requestImprovementLevers } from '../../adapters/assessment-levers';
import { assessmentReport, type ReportScenario } from "../../application/assessment-report";
import type { RecommendationView } from "../../application/recommendations/controller";
type ScenarioRequest={input:ScoreInput;answers:Record<string,string>;levers:ImprovementLever[]};
export function ReportDownload({catalog,view,scenario,disabled=false}:{catalog:AssessmentCatalog;view:RecommendationView;scenario?:ScenarioRequest;disabled?:boolean}) {
 const latest=useRef(scenario),mounted=useRef(true);
 useEffect(()=>{latest.current=scenario;},[scenario]);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);

 const [busy,setBusy]=useState(false),[message,setMessage]=useState("");
 async function download(){
  if(busy||disabled)return;setBusy(true);setMessage("");
  try {
   const model=createAssessmentModel(catalog.version,p=>selectedQuestions(catalog,p),p=>catalogProfileErrors(catalog,p));
   const store=browserSession(model.sessionSchema),session=store.load().state;
   if(!session)throw new Error("Restore a valid assessment before downloading.");
   const input=recommendationRequestFromSession(session),identity=inputIdentityText(input);
   const scenarioKey=JSON.stringify(scenario);
   if(scenario && (input.configVersion!==scenario.input.configVersion || JSON.stringify(input.answers)!==JSON.stringify(scenario.input.answers) || Object.entries(scenario.input.context).some(([key,value])=>JSON.stringify(input.context[key as keyof typeof input.context])!==JSON.stringify(value))))throw new Error("Assessment changed. Reload your levers before downloading.");

   const score=await requestAssessmentScore({configVersion:input.configVersion,context:input.context,answers:input.answers},AbortSignal.timeout(15000));
   const assets = await loadReportAssets(score);
   const priority = await requestImprovementLevers({configVersion:input.configVersion,context:input.context,answers:input.answers},AbortSignal.timeout(15000)).catch(()=>null);
   let appendix:ReportScenario|undefined;
   if(scenario) {
    const hypothetical=await requestAssessmentScore({...scenario.input,answers:{...input.answers,...scenario.answers}},AbortSignal.timeout(15000));
    appendix={score:hypothetical,answers:scenario.levers.map(l=>({id:l.id,title:l.title,actual:l.actual,proposed:scenario.answers[l.id]!,unit:l.unit}))};
   }
   if(!mounted.current || JSON.stringify(latest.current)!==scenarioKey)throw new Error("Scenario changed. Download again for the current values.");
   const now=store.load().state;
   if(!now || inputIdentityText(recommendationRequestFromSession(now))!==identity)throw new Error("Assessment changed. Download again for current answers.");
   const id=await browserInputHash(identity);
   const final=store.load().state;
   if(!final || inputIdentityText(recommendationRequestFromSession(final))!==identity)throw new Error("Assessment changed. Download again.");
   if(!mounted.current || JSON.stringify(latest.current)!==scenarioKey)throw new Error("Scenario changed. Download again.");
   const content=view.result?.identity.inputId===id ? view.result.content : undefined;
   const url=URL.createObjectURL(new Blob([assessmentReport(session,score,content,undefined,appendix,{assets,levers:priority?.levers})],{type:"text/html;charset=utf-8"}));
   const a=document.createElement('a');a.href=url;a.download=scenario?'mosaic-assessment-with-levers.html':'mosaic-assessment-report.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
   setMessage("Report downloaded. Open it and use Print → Save as PDF if needed.");
  } catch(error){setMessage(error instanceof Error?error.message:"Report unavailable. Retry after reviewing your answers.");}
  finally {setBusy(false);}
 }
 return <div className="mt-4"><button className={scenario?"button-primary":"button-secondary"} disabled={disabled || busy || view.code==="no_assessment"} onClick={()=>void download()}>{busy?"Preparing report…":scenario?"Download report with hypothetical levers":"Download assessment report"}</button><p className="text-small mt-2" role="status">{message||"Includes current scores and answers; available even if AI fails. HTML with print-to-PDF support."}</p></div>;
}
