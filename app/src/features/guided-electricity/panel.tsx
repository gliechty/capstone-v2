"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { AssessmentProvider, useAssessment } from "../assessment/assessment-context";
import type { AssessmentCatalog } from "../../application/assessment-catalog";
import { countries, listedCountry } from "../../application/countries";
import { electricityFactsSchema, electricityRequest, electricityAnswerPreview, mappingReview, mappingResponseSchema, type ElectricityFacts, type MappingResponse } from "../../application/guided-electricity";

type Ready={catalogs:{catalog_id:string;database_name:string;database_version:string;attribution:string;terms_url:string}[];usage:{completed_evaluations:number;monthly_limit:number;reserved_evaluations:number};attempts:number;limit:number;cost:string};
type Result={mapping:MappingResponse;headersMs:number;totalMs:number;attempt:number};
function Panel(){
 const {session,questions,ready:sessionReady}=useAssessment();
 const [description,setDescription]=useState(""); const [quantity,setQuantity]=useState("");const [unit,setUnit]=useState<"kWh"|"MWh">("kWh");
 const [country,setCountry]=useState("");const [start,setStart]=useState("");const [end,setEnd]=useState("");
 const [account,setAccount]=useState<Ready|null>(null);const [catalogId,setCatalogId]=useState(""); const [clientId]=useState(()=>crypto.randomUUID());
 const [result,setResult]=useState<Result|null>(null);const [original,setOriginal]=useState<ElectricityFacts|null>(null);
 const [clarification,setClarification]=useState("");const [reviewed,setReviewed]=useState(false);const [busy,setBusy]=useState(false);const lock=useRef(false);
 const [error,setError]=useState("");const [complete,setComplete]=useState(false);const [revenue,setRevenue]=useState("");const [confirmation,setConfirmation]=useState("");
 const [followupId]=useState(()=>crypto.randomUUID());
 const facts={description,quantity,unit,countryCode:country||listedCountry(session.profile.country)?.code||"",periodStart:start,periodEnd:end};
 const parsed=electricityFactsSchema.safeParse(original??facts);
 const request=parsed.success&&catalogId?electricityRequest(parsed.data,catalogId,result?followupId:clientId,result?clarification:""):null;
 const review=result?mappingReview(result.mapping):null;
 const preview=parsed.success?electricityAnswerPreview(parsed.data,complete,revenue,questions):null;
 const mappings=preview?.mappings??[];
 async function checkAccount(){if(lock.current)return;lock.current=true;setBusy(true);setError("");try{const r=await fetch("/api/guided-electricity",{cache:"no-store"});const body=await r.json();if(!r.ok)throw new Error(body.error);setAccount(body);if(body.catalogs.length===1)setCatalogId(body.catalogs[0].catalog_id);}catch(e){setError(e instanceof Error?e.message:"Account check failed.");}finally{lock.current=false;setBusy(false);}}
 async function submit(){
  if(lock.current)return;
  if(!reviewed||!parsed.success||!catalogId){setError("Confirm the description, quantity, country, reporting dates and displayed JSON before submitting.");return;}
  if(result&&!clarification.trim()){setError("Enter your clarification, or leave the result unresolved without sending another request.");return;}
  lock.current=true;setBusy(true);setError("");
  try{
   const r=await fetch("/api/guided-electricity",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({facts:parsed.data,catalogId,clientId:result?followupId:clientId,parentId:result?clientId:null,clarification:result?clarification:""})});
   const body=await r.json();if(!r.ok)throw new Error(body.error);
   const mapping=mappingResponseSchema.parse(body.mapping);setOriginal(parsed.data);setResult({...body,mapping});setReviewed(false);setConfirmation("");
  }catch(e){setError(e instanceof Error?e.message:"Request interrupted; outcome unknown. Do not retry. Check the retained local attempt.");}finally{lock.current=false;setBusy(false);}
 }
 function confirmPreview(){
  try{const available=mappings.filter(m=>m.raw!==null);if(!available.length)throw new Error("No supported assessment answer is available yet.");
   sessionStorage.setItem("mosaic.guided-electricity.confirmed-preview.v1",JSON.stringify({at:new Date().toISOString(),facts:parsed.success?parsed.data:null,answers:available,provenance:"User-confirmed quantities and complete energy coverage; existing M4 deterministic arithmetic. No Laiffi emissions factor used.",requestId:result?.mapping.request_id??null}));setConfirmation("Preview confirmed and saved in this tab. Your questionnaire answers have not been changed.");
  }catch(e){setError(e instanceof Error?e.message:"Preview could not be saved; nothing confirmed.");}
 }
 if(!sessionReady)return <p>Restoring assessment context…</p>;
 return <main className="page-container py-8 max-w-4xl space-y-6">
  <Link href="/assessment">Return to assessment / Setup</Link><h1 className="text-3xl">Guided electricity — local prototype</h1>
  <p>Describe electricity consumption, review the JSON, then explicitly send it to Laiffi. No OpenAI calls, automatic evaluations or retries.</p>
  <section className="rounded-xl border p-5 space-y-3"><h2 className="text-xl">Your assessment context</h2><p>{session.profile.companyName||"No company set"} · {session.profile.industry||"Set industry in Setup"} · {session.profile.country||"Country not set"}</p>
   <ul>{questions.filter(q=>q.metricId?.startsWith("energy_intensity_")).map(q=><li key={q.id}>{q.id}: {q.title} ({q.unit})</li>)}</ul>
   <p>Only the description and confirmed electricity facts shown in the JSON are sent. Company name, other answers and notes are not transmitted.</p>
  </section>
  <section className="rounded-xl border p-5 space-y-3"><h2 className="text-xl">1. Describe and confirm facts</h2>
   <fieldset disabled={busy||Boolean(result)} onChange={()=>{setReviewed(false);setConfirmation("");}} className="space-y-3">
    <label className="block">Electricity description<textarea className="block w-full border rounded p-3" maxLength={3000} value={description} onChange={e=>setDescription(e.target.value)} /></label>
    <p>Your wording is preserved. The fields below are facts you confirm, not facts invented by a model.</p>
    <label className="block">Electricity quantity<input className="block border rounded p-2" value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="e.g. 100,000" /></label>
    <label>Unit<select value={unit} onChange={e=>setUnit(e.target.value as "kWh"|"MWh")}><option>kWh</option><option>MWh</option></select></label>
    <label className="block">Activity country<select value={facts.countryCode} onChange={e=>setCountry(e.target.value)}><option value="">Select a confirmed country</option>{countries.map(c=><option key={c.code} value={c.code}>{c.name}</option>)}</select></label>
    <label className="block">Reporting period start<input type="date" value={start} onChange={e=>setStart(e.target.value)} /></label><label className="block">Reporting period end<input type="date" value={end} onChange={e=>setEnd(e.target.value)} /></label>
    <p>Reporting dates are used for the assessment preview. Include the reporting year in your description: Laiffi has no dedicated reporting-year request field.</p>
   </fieldset>
  </section>
  <section className="rounded-xl border p-5 space-y-3"><h2 className="text-xl">2. Review request and submit</h2>
   <button className="button-secondary" disabled={busy} onClick={checkAccount}>Check account and catalogs (no evaluation)</button>
   {account&&<><p>{account.usage.completed_evaluations} completed / {account.usage.monthly_limit} monthly; {account.usage.reserved_evaluations} reserved. Experiment slots reserved: {account.attempts}/2. {account.cost}</p><label>Entitled catalog<select disabled={Boolean(result)} value={catalogId} onChange={e=>{setCatalogId(e.target.value);setReviewed(false);}}><option value="">Choose catalog</option>{account.catalogs.map(c=><option key={c.catalog_id} value={c.catalog_id}>{c.database_name} {c.database_version}</option>)}</select></label>{account.catalogs.filter(c=>c.catalog_id===catalogId).map(c=><p key={c.catalog_id}>{c.attribution} · Terms: {c.terms_url}</p>)}</>}
   {review&&<><p role="status">Mapping status: {review.status}</p><p>{review.questionAuthor}</p>{review.question&&<p>{review.question}</p>}<blockquote className="border-l-4 pl-4">{review.rationale}</blockquote><label className="block">Your clarification<textarea className="block w-full border rounded p-3" maxLength={700} disabled={result?.attempt===2} value={clarification} onChange={e=>{setClarification(e.target.value);setReviewed(false);}} /></label></>}
   {request?<pre className="max-h-80 overflow-auto whitespace-pre-wrap break-all text-sm">{JSON.stringify(request,null,2)}</pre>:<p>Complete the facts and select a catalog to see the exact request.</p>}
   <label className="block"><input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)} /> I confirm these facts and authorize this displayed request.</label>
   <button className="button-primary" disabled={busy||!request||!reviewed||result?.attempt===2} onClick={submit}>{busy?"Working…":result?"Submit clarification once":"Send initial request once"}</button>
   <p>Refreshing never resubmits. If interrupted, the reservation remains and the retained local response must be checked; cancellation is not assumed.</p>
   {error&&<p role="alert">{error}</p>}
  </section>
  {review&&<section className="rounded-xl border p-5 space-y-3"><h2 className="text-xl">3. Actual API result</h2><p>Headers {result!.headersMs} ms · complete {result!.totalMs} ms</p><p>{review.boundary}</p>
   {review.rows.map((row,index)=><article className="border rounded p-3" key={row.dataset.id+index}><h3>{row.dataset.name}</h3><p>{row.dataset.geography} · {row.dataset.reference_unit} · {row.dataset.database_name} {row.dataset.database_version}</p><p>Factor: {row.emission_factor?.status??"not supplied"} · {row.emission_factor?.value??"unknown"} {row.emission_factor?.impact_unit} / {row.emission_factor?.reference_unit} · {row.emission_factor?.reason}</p><p>Mapping approved: {String(row.emission_factor?.mapping_approved??false)}. Valid reporting year: not supplied. Factor calculation timestamp: {row.emission_factor?.calculated_at??"not supplied"} (not validity year).</p></article>)}
  </section>}
  <section className="rounded-xl border p-5 space-y-3"><h2 className="text-xl">4. Quantity-based assessment answer preview</h2><p>Energy intensity uses quantities, not an emissions factor. Confirm only if this electricity is all energy used during the complete annual period. Other fuels or missing sources mean coverage is incomplete.</p>
   <label className="block"><input type="checkbox" checked={complete} onChange={e=>{setComplete(e.target.checked);setConfirmation("");}} /> This is all energy used in the stated period; no other sources are omitted.</label>
   <label className="block">Same-period revenue in USD<input value={revenue} onChange={e=>{setRevenue(e.target.value);setConfirmation("");}} placeholder="Leave blank if unknown" /></label>
   {preview?.calculation.issues.map(i=><p key={i.path}>{i.message}</p>)}
   {!mappings.length&&<p>Set a supported industry in assessment Setup and enter valid facts to see pertinent questionnaire mappings.</p>}
   {mappings.map(m=><p key={m.questionId}>{m.questionId} · {m.title}: {m.raw===null?m.reason:`${m.raw} ${m.unit}`}</p>)}
   <button className="button-secondary" disabled={!mappings.some(m=>m.raw!==null)} onClick={confirmPreview}>Confirm answer preview</button><p role="status">{confirmation}</p><p>Preview provenance: user-confirmed quantities, coverage and revenue; existing deterministic calculator. No external emissions factor, no automatic questionnaire overwrite.</p>
  </section>
 </main>;
}
export function GuidedElectricity({catalog}:{catalog:AssessmentCatalog}){return <AssessmentProvider catalog={catalog}><Panel /></AssessmentProvider>;}
