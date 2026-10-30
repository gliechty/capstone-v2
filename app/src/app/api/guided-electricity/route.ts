import { prototypeEnabled, readiness, evaluateElectricity } from "../../../adapters/laiffi-prototype";
const response=(body:unknown,status=200)=>Response.json(body,{status,headers:{"Cache-Control":"no-store"}});
function local(request:Request) { const host=request.headers.get("host") ?? new URL(request.url).host; const u=new URL("http://"+host); const origin=request.headers.get("origin"); return prototypeEnabled() && ["localhost","127.0.0.1","[::1]"].includes(u.hostname) && (!origin || origin===u.origin); }
export async function GET(request:Request) {
  if(!local(request)) return response({error:"Local prototype is disabled."},404);
  try { return response(await readiness()); } catch { return response({error:"Account readiness unavailable. Check the local server key and connection; no evaluation sent."},503); }
}
export async function POST(request:Request) {
  if(!local(request)) return response({error:"Local prototype is disabled."},404);
  if(!request.headers.get("content-type")?.startsWith("application/json")) return response({error:"Send JSON."},415);
  try {
    const reader=request.body?.getReader(); if(!reader) return response({error:"Missing request."},400);
    let text="";let length=0;const decoder=new TextDecoder();
    while(true){const part=await reader.read();if(part.done)break;length+=part.value.length;if(length>20000){await reader.cancel();return response({error:"Request is too large."},413);}text+=decoder.decode(part.value,{stream:true});}
    return response(await evaluateElectricity(JSON.parse(text+decoder.decode())));
  } catch(error) { return response({error:error instanceof Error && !error.message.startsWith("[")?error.message:"Review the required facts and request format. No automatic retry."},400); }
}
