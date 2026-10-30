import "server-only";
import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { electricityRequest, electricityFactsSchema, mappingResponseSchema } from "../application/guided-electricity";

const base="https://api.laiffi.app/api/v1";
const root=join(process.cwd(),".local","laiffi-clarification-20261029");
export const prototypeEnabled=()=>process.env.LAIFFI_PROTOTYPE_ENABLED==="1";
const catalogSchema=z.object({catalog_id:z.string(),database_name:z.string(),database_version:z.string(),attribution:z.string(),terms_url:z.string()});
const usageSchema=z.object({completed_evaluations:z.number(),reserved_evaluations:z.number(),monthly_limit:z.number(),requests_per_minute:z.number()});
export const submissionSchema=z.object({facts:electricityFactsSchema,catalogId:z.string().min(1).max(256),clientId:z.uuid(),clarification:z.string().max(700),parentId:z.uuid().nullable()}).strict();
async function api(path:string,body?:unknown,id?:string) {
  const key=process.env.LAIFFI_API_KEY;
  if(!prototypeEnabled() || !key) throw new Error("Laiffi prototype is not enabled with a server-side key.");
  const started=Date.now();
  const response=await fetch(base+path,{method:body ? "POST":"GET",headers:{Authorization:`Bearer ${key}`,Accept:"application/json",...(body?{"Content-Type":"application/json","Idempotency-Key":id!}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(60000),cache:"no-store",redirect:"error"});
  const headersMs=Date.now()-started;
  if(!response.ok) { await response.body?.cancel(); throw new Error(`Laiffi returned HTTP ${response.status}. No retry was sent.`); }
  const raw=await response.text();
  if(raw.length>2_000_000) throw new Error("Laiffi response exceeds the local display limit; no retry was sent.");
  return {body:JSON.parse(raw) as unknown,headersMs,totalMs:Date.now()-started};
}
export async function readiness() {
  const catalogs=z.array(catalogSchema).parse((await api("/catalogs")).body);
  const usage=usageSchema.parse((await api("/usage")).body);
  await mkdir(root,{recursive:true});
  const attempts=(await readdir(root)).filter(x=>/^attempt-[12]$/.test(x));
  return {catalogs,usage,attempts:attempts.length,limit:2,cost:"Pilot is free per Fredrik (2026-10-27); completed evaluations consume monthly quota. OpenAI: 0 calls."};
}
export async function evaluateElectricity(input:unknown) {
  const v=submissionSchema.parse(input);
  if(process.env.CAPSTONE_OFFLINE_TESTS==="1") throw new Error("Live evaluations are disabled during offline tests.");
  const ready=await readiness();
  if(!ready.catalogs.some(c=>c.catalog_id===v.catalogId)) throw new Error("Choose a currently entitled catalog.");
  if(ready.usage.completed_evaluations+ready.usage.reserved_evaluations>=ready.usage.monthly_limit) throw new Error("Laiffi monthly quota is exhausted.");
  const slot=v.parentId?2:1;
  if(slot===2) {
    const prior=submissionSchema.parse(JSON.parse(await readFile(join(root,"attempt-1","input.json"),"utf8")));
    if(prior.clientId!==v.parentId || JSON.stringify(prior.facts)!==JSON.stringify(v.facts) || prior.catalogId!==v.catalogId || !v.clarification.trim()) throw new Error("Keep the original facts/catalog and provide an explicit clarification of the first request.");
    await readFile(join(root,"attempt-1","response.json"),"utf8");
  } else if(v.clarification) throw new Error("Clarification must refer to a completed first request.");
  // Exclusive directory reserves before dispatch; survives restarts and never resets unknown outcomes.
  const dir=join(root,`attempt-${slot}`);
  try { await mkdir(dir); } catch { throw new Error("This experiment's request slot is already reserved. No new evaluation or retry was sent."); }
  const request=electricityRequest(v.facts,v.catalogId,v.clientId,v.clarification);
  const idempotencyKey=randomUUID();
  await writeFile(join(dir,"input.json"),JSON.stringify(v,null,2),{mode:0o600});
  await writeFile(join(dir,"request.json"),JSON.stringify(request,null,2),{mode:0o600});
  await writeFile(join(dir,"dispatch.json"),JSON.stringify({at:new Date().toISOString(),idempotencyKey,usageBefore:ready.usage}),{mode:0o600});
  try {
    const actual=await api("/mappings",request,idempotencyKey);
    await writeFile(join(dir,"response.json"),JSON.stringify(actual,null,2),{mode:0o600});
    const mapping=mappingResponseSchema.parse(actual.body);
    let usageAfter: z.infer<typeof usageSchema>|null=null;
    try {usageAfter=usageSchema.parse((await api("/usage")).body);} catch { /* Unknown usage keeps reservation. */ }
    await writeFile(join(dir,"usage-after.json"),JSON.stringify(usageAfter),{mode:0o600});
    return {mapping,headersMs:actual.headersMs,totalMs:actual.totalMs,usageBefore:ready.usage,usageAfter,attempt:slot};
  } catch(error) {
    const message=error instanceof z.ZodError?"Laiffi returned an unexpected response structure; retained locally. No retry sent.":error instanceof Error && error.name==="TimeoutError"?"Laiffi exceeded the 60-second experiment deadline; outcome unknown. Reservation retained; no retry sent.":error instanceof Error && error.message.startsWith("Laiffi returned HTTP")?error.message:"Laiffi request could not complete. Outcome may be unknown; reservation retained. No retry sent.";
    await writeFile(join(dir,"failure.json"),JSON.stringify({at:new Date().toISOString(),message}),{mode:0o600});
    throw new Error(message, { cause: error });
  }
}
