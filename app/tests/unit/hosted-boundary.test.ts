import {execFile} from "node:child_process";
import {promisify} from "node:util";
import {pathToFileURL} from "node:url";
import {resolve} from "node:path";
import {test,expect} from "vitest";
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {isRecommendationRequest} from "../../src/adapters/recommendations/hosted-boundary";
import {reserveHostedAttempt, reconcileHostedAttempt, bangkokBudgetDay} from "../../src/adapters/recommendations/hosted-budget";
test("hosted boundary admits only explicit HTTPS same-origin requests",()=>{
 const origin="https://app.example";
 const req=(headers:Record<string,string>)=>new Request(origin+'/api/assessment-recommendations',{headers:{host:'app.example',origin,...headers}});
 expect(isRecommendationRequest(req({}),true,origin)).toBe(true);
 expect(isRecommendationRequest(new Request("http://0.0.0.0:3000/api/assessment-recommendations",{headers:{host:"app.example",origin}}),true,origin)).toBe(true);
 for(const h of ([{origin:'https://evil.example'},{host:'evil.example'},{forwarded:'host=app.example'},{'sec-fetch-site':'cross-site'}] as Record<string,string>[]))expect(isRecommendationRequest(req(h),true,origin)).toBe(false);
 expect(isRecommendationRequest(new Request(origin,{headers:{host:'app.example'}}),true,origin)).toBe(false);
 expect(isRecommendationRequest(req({}),true,'http://app.example')).toBe(false);
});
test("reservations survive reuse and enforce two requests / $1, corrupt or missing ledger fails closed",()=>{
 const dir=mkdtempSync(join(tmpdir(),'mosaic-budget-'));const path=join(dir,'ledger.json');const env={RECOMMENDATION_PUBLIC_ORIGIN:'https://app.example',RECOMMENDATION_VERIFICATION_FILE:path,RECOMMENDATION_VERIFICATION_TOKEN:'test-token'};
 try {expect(reserveHostedAttempt(env,"test-token").ok).toBe(false);writeFileSync(path,'[]');expect(reserveHostedAttempt(env,"test-token").ok).toBe(true);expect(reserveHostedAttempt(env,"test-token").ok).toBe(true);expect(reserveHostedAttempt(env,"test-token")).toMatchObject({ok:false,code:'budget_exhausted'});expect(JSON.parse(readFileSync(path,'utf8'))).toHaveLength(2);writeFileSync(path,'{}');expect(reserveHostedAttempt(env,"test-token").ok).toBe(false);}finally{rmSync(dir,{recursive:true});}
});

test("verification and daily public usage use independent ledgers without resetting either",()=>{
 const dir=mkdtempSync(join(tmpdir(),'mosaic-separate-'));const publicPath=join(dir,'public.json'),testPath=join(dir,'verification.json');
 const env={RECOMMENDATION_PUBLIC_ORIGIN:'https://app.example',RECOMMENDATION_BUDGET_FILE:publicPath,RECOMMENDATION_DAILY_BUDGET_USD:'0.4',RECOMMENDATION_VERIFICATION_FILE:testPath,RECOMMENDATION_VERIFICATION_TOKEN:'secret-test'};
 try{writeFileSync(publicPath,'[]');writeFileSync(testPath,'[]');expect(reserveHostedAttempt(env,'secret-test').ok).toBe(true);expect(reserveHostedAttempt(env,'secret-test').ok).toBe(true);expect(reserveHostedAttempt(env,'secret-test').ok).toBe(false);expect(reserveHostedAttempt(env).ok).toBe(true);expect(reserveHostedAttempt(env).ok).toBe(false);expect(JSON.parse(readFileSync(publicPath,'utf8'))).toHaveLength(1);expect(JSON.parse(readFileSync(testPath,'utf8'))).toHaveLength(2);}finally{rmSync(dir,{recursive:true});}
});

 test("Bangkok midnight, actual usage, unknown reservations and restart persistence",()=>{
 const dir=mkdtempSync(join(tmpdir(),'mosaic-bangkok-')),path=join(dir,'public.json');
 const env={RECOMMENDATION_PUBLIC_ORIGIN:'https://app.example',RECOMMENDATION_BUDGET_FILE:path,RECOMMENDATION_DAILY_BUDGET_USD:'1'};
 const before=new Date('2026-10-19T16:59:59Z'),after=new Date('2026-10-19T17:00:00Z');
 try{writeFileSync(path,'[]');expect(bangkokBudgetDay(before)).toBe('2026-10-19');expect(bangkokBudgetDay(after)).toBe('2026-10-20');
 const first=reserveHostedAttempt(env,null,before);expect(first.ok).toBe(true);
 expect(reserveHostedAttempt(env,null,before).ok).toBe(true);expect(reserveHostedAttempt(env,null,before).ok).toBe(true);
 expect(reserveHostedAttempt({...env},null,before)).toMatchObject({ok:false,code:'budget_exhausted'});
 if(!first.ok)throw Error('reservation');
 expect(reconcileHostedAttempt(first.receipt,undefined)).toBe(false);
 expect(reserveHostedAttempt(env,null,before).ok).toBe(false);
 expect(reconcileHostedAttempt(first.receipt,{inputTokens:1000,outputTokens:1000})).toBe(true);
 expect(reconcileHostedAttempt(first.receipt,{inputTokens:1000,outputTokens:1000})).toBe(true);
 expect(reserveHostedAttempt(env,null,before).ok).toBe(true);
 expect(reserveHostedAttempt(env,null,before).ok).toBe(false);
 expect(reserveHostedAttempt(env,null,after).ok).toBe(true);
 expect(JSON.parse(readFileSync(path,'utf8'))).toHaveLength(5);
 writeFileSync(path+'.lock','');expect(reserveHostedAttempt(env,null,after)).toMatchObject({ok:false,code:'budget_unavailable'});
 }finally{rmSync(dir,{recursive:true});}
 });

test("simultaneous processes cannot overspend the shared $1 ledger",async()=>{
 const dir=mkdtempSync(join(tmpdir(),'mosaic-concurrent-')),path=join(dir,'public.json');
 const env={RECOMMENDATION_PUBLIC_ORIGIN:'https://app.example',RECOMMENDATION_BUDGET_FILE:path,RECOMMENDATION_DAILY_BUDGET_USD:'1'};
 const moduleUrl=pathToFileURL(resolve('src/adapters/recommendations/hosted-budget.ts')).href;
 const code=`import {reserveHostedAttempt} from ${JSON.stringify(moduleUrl)};console.log(JSON.stringify(reserveHostedAttempt(${JSON.stringify(env)})));`;
 try{writeFileSync(path,'[]');const results=await Promise.all(Array.from({length:8},()=>promisify(execFile)(process.execPath,['--input-type=module','-e',code])));
 expect(results.filter(r=>JSON.parse(r.stdout).ok).length).toBeLessThanOrEqual(3);
 const rows=JSON.parse(readFileSync(path,'utf8'));expect(rows.length).toBeGreaterThan(0);expect(rows.length*.324144).toBeLessThanOrEqual(1);
 }finally{rmSync(dir,{recursive:true});}
},20000);
