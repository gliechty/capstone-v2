// Explicit paid step; never imported or run by offline preprocessing/validation.
import fs from 'node:fs';
import path from 'node:path';
import {dir,save,classes,hash} from './common.mjs';
if(process.argv[2]!=='--approved-m8-0-usd-0.30')throw Error('Explicit M8.0 allowance switch required');
const ledgerPath=path.join(dir,'model-usage.json');
const ledger=fs.existsSync(ledgerPath)?JSON.parse(fs.readFileSync(ledgerPath,'utf8')):{allowance_usd:0.30,max_attempts:2,approval:'Owner approved separate M8.0 allowance 2026-11-09 in chat',pricing:{input_per_million:0.75,output_per_million:4.50,source:'https://developers.openai.com/api/docs/models/gpt-5.4-mini',checked:'2026-11-09'},attempts:[]};
if(ledger.attempts.length>=2)throw Error('Two-attempt limit reached');
if(fs.existsSync(path.join(dir,'model-proposals.json')))throw Error('Successful proposals already exist; no further call permitted');
const fields={question_id:{type:'string'},answer_effort:{type:'string',enum:classes},rationale:{type:'string'},assumptions:{type:'string'},confidence:{type:'string',enum:['high','medium','low']}};
const prompt=fs.readFileSync(path.join(dir,'prompt.txt'),'utf8');
const body=JSON.stringify({model:'gpt-5.4-mini-2026-03-17',reasoning:{effort:'none'},store:false,max_output_tokens:12000,input:[{role:'system',content:prompt},{role:'user',content:fs.readFileSync(path.join(dir,'classification-input.json'),'utf8')}],text:{format:{type:'json_schema',name:'answer_effort',strict:true,schema:{type:'object',properties:{assignments:{type:'array',items:{type:'object',properties:fields,required:Object.keys(fields),additionalProperties:false}}},required:['assignments'],additionalProperties:false}}}});
// UTF-8 request bytes conservatively upper-bound text tokens, with an overhead reserve.
const bound=(Buffer.byteLength(body)+2000)*0.75/1e6+12000*4.50/1e6;
if(Buffer.byteLength(body)>100000||ledger.attempts.reduce((s,a)=>s+(a.cost_usd??a.reserved_usd),0)+bound>0.30)throw Error('Allowance bound exceeded');
const keyFile=process.env.M8_KEY_FILE;
if(!keyFile)throw Error('M8_KEY_FILE must point to existing owner credential file; never copy into experiment');
const key=fs.readFileSync(keyFile,'utf8').match(/^\s*OPENAI_API_KEY\s*=\s*["']?([^\r\n"']+)["']?\s*$/m)?.[1]?.trim();
if(!key)throw Error('Existing credential unavailable');
const attempt={started_at:new Date().toISOString(),reserved_usd:bound,prompt_version:'m8-answer-effort-1',prompt_sha256:hash(prompt),request_sha256:hash(body),model:'gpt-5.4-mini-2026-03-17',status:'reserved'};
ledger.attempts.push(attempt);save('model-usage.json',ledger);
try{
 const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',redirect:'error',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body,signal:AbortSignal.timeout(180000)});
 if(!response.ok)throw Error('Provider HTTP '+response.status);
 const result=await response.json();
 attempt.response_id=result.id;attempt.actual_model=result.model;attempt.usage=result.usage;
 if(result.usage)attempt.cost_usd=(result.usage.input_tokens*0.75+result.usage.output_tokens*4.50)/1e6;
 if(result.status!=='completed')throw Error('Provider response '+result.status);
 const text=result.output.filter(o=>o.type==='message').flatMap(o=>o.content).filter(c=>c.type==='output_text').map(c=>c.text).join('');
 const proposals=JSON.parse(text);save('model-proposals.json',proposals);attempt.status='completed';
 console.log(JSON.stringify({status:attempt.status,rows:proposals.assignments?.length,usage:attempt.usage,cost_usd:attempt.cost_usd}));
}catch(e){attempt.status='failed';attempt.error=e.message;throw e;}
finally{attempt.ended_at=new Date().toISOString();save('model-usage.json',ledger);}
