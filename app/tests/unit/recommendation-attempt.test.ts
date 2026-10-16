import {expect,test} from "vitest";
import {recommendationAttempt} from "../../src/adapters/recommendation-attempt";
const id="a".repeat(64), other="b".repeat(64);
test("pending receipt survives new consumers but never authorizes a request",()=>{
 const values=new Map<string,string>();const storage={getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>{values.set(k,v);}};
 const first=recommendationAttempt(storage);first.begin(id);const restored=recommendationAttempt(storage);
 expect(restored.pending(id)).toBe(true);expect(restored.pending(other)).toBe(false);
 restored.complete(other);expect(restored.pending(id)).toBe(true);restored.complete(id);expect(first.pending(id)).toBe(false);
 expect([...values.values()]).not.toContain(id);
});
test("receipt write errors fail before the caller dispatches",()=>{const attempt=recommendationAttempt({getItem:()=>null,setItem:()=>{throw Error("storage unavailable");}});expect(()=>attempt.begin(id)).toThrow();});
