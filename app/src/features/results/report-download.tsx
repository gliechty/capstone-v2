"use client";
import { useState } from "react";
import type { AssessmentCatalog } from "../../application/assessment-catalog";
import { selectedQuestions } from "../../application/assessment-catalog";
import { createAssessmentModel } from "../assessment/model";
import { catalogProfileErrors } from "../assessment/assessment-context";
import { browserSession } from "../../adapters/assessment-session";
import { requestAssessmentScore } from "../../adapters/assessment-scoring";
import { recommendationRequestFromSession } from "../../application/recommendations/request";
import { inputIdentityText } from "../../application/recommendations/identity";
import { browserInputHash } from "../../adapters/recommendation-client";
import { assessmentReport } from "../../application/assessment-report";
import type { RecommendationView } from "../../application/recommendations/controller";
export function ReportDownload({catalog,view}:{catalog:AssessmentCatalog;view:RecommendationView}) {
 const [busy,setBusy]=useState(false),[message,setMessage]=useState("");
 async function download(){
  if(busy)return;setBusy(true);setMessage("");
  try {
   const model=createAssessmentModel(catalog.version,p=>selectedQuestions(catalog,p),p=>catalogProfileErrors(catalog,p));
   const store=browserSession(model.sessionSchema),session=store.load().state;
   if(!session)throw new Error("Restore a valid assessment before downloading.");
   const input=recommendationRequestFromSession(session),identity=inputIdentityText(input);
   const score=await requestAssessmentScore({configVersion:input.configVersion,context:input.context,answers:input.answers},AbortSignal.timeout(15000));
   const now=store.load().state;
   if(!now || inputIdentityText(recommendationRequestFromSession(now))!==identity)throw new Error("Assessment changed. Download again for current answers.");
   const id=await browserInputHash(identity);
   const final=store.load().state;
   if(!final || inputIdentityText(recommendationRequestFromSession(final))!==identity)throw new Error("Assessment changed. Download again.");
   const content=view.result?.identity.inputId===id ? view.result.content : undefined;
   const url=URL.createObjectURL(new Blob([assessmentReport(session,score,content)],{type:"text/html;charset=utf-8"}));
   const a=document.createElement('a');a.href=url;a.download='mosaic-assessment-report.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
   setMessage("Report downloaded. Open it and use Print → Save as PDF if needed.");
  } catch(error){setMessage(error instanceof Error?error.message:"Report unavailable. Retry after reviewing your answers.");}
  finally {setBusy(false);}
 }
 return <div className="mt-4"><button className="button-secondary" disabled={busy || view.code==="no_assessment"} onClick={()=>void download()}>{busy?"Preparing report…":"Download assessment report"}</button><p className="text-small mt-2" role="status">{message||"Includes current scores and answers; available even if AI fails. HTML with print-to-PDF support."}</p></div>;
}
