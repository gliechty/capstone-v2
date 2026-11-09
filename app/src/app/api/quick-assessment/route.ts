import { loadCanonicalConfig } from '../../../adapters/config-repository';
import { computeQuickAssessment } from '../../../application/quick-assessment';
export const runtime='nodejs';
export async function POST(request:Request){
 const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
 if(!request.headers.get('content-type')?.startsWith('application/json'))return reply({error:'Send JSON assessment data.'},415);
 const reader=request.body?.getReader();if(!reader)return reply({error:'Missing assessment data.'},400);
 try{
  const parts:Uint8Array[]=[];let size=0;
  while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>400000){await reader.cancel();return reply({error:'Assessment data is too large.'},413);}parts.push(part.value);}
  const input=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat(parts)));
  return reply(computeQuickAssessment(loadCanonicalConfig().config,input));
 }catch{return reply({error:'Quick assessment could not be calculated. Review your setup and answers.'},422);}
}
