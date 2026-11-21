import {it,expect,vi} from 'vitest';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {AdminStore} from '../../src/adapters/admin-store';
import {kbInfo,sourceImport,sourceList,sourcePdf} from '../../src/adapters/admin-sources';
import type {Actor} from '../../src/application/admin/contracts';
it('binds immutable originals to source membership and authenticated import, without changing releases',()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'mosaic-sources-')),store=new AdminStore(dir),owner:Actor={email:'owner@example.test',role:'super_admin',identity:'development'};vi.stubEnv('MOSAIC_SUPER_ADMIN_EMAIL',owner.email);
 try{
 const baseline=store.release();expect(()=>sourceImport(store,baseline,{...owner,role:'admin'})).toThrow('Only');sourceImport(store,baseline,owner);
 const info=kbInfo(store,baseline);expect(info.sourceImport?.by).toBe(owner.email);expect(store.release()).toEqual(baseline);expect(baseline.createdAt).toBeNull();
 const first=baseline.config.DocumentIndex[0]!;expect(sourcePdf(store,baseline,first.doc_id).data.subarray(0,5).toString()).toBe('%PDF-');
 const subset={...baseline,config:{...baseline.config,DocumentIndex:baseline.config.DocumentIndex.slice(1)}};expect(sourceList(store,subset)).toHaveLength(baseline.config.DocumentIndex.length-1);expect(()=>sourcePdf(store,subset,first.doc_id)).toThrow('not in');
 const altered={...baseline,config:{...baseline.config,DocumentIndex:[{...first,link:'different-source'}]}};expect(sourceList(store,altered)[0]?.available).toBe(false);expect(()=>sourcePdf(store,altered,first.doc_id)).toThrow('unavailable');
 const other={...baseline,id:'separate-kb',name:'Another KB'};expect(kbInfo(store,other).title).toBe('Another KB');expect(kbInfo(store,other).isDefault).toBe(false);expect(sourceList(store,other).every(s=>!s.available)).toBe(true);
 const question=baseline.config.QuestionBank.find(q=>q.question_id==='U-002')!;const next=store.saveQuestions({base:baseline.id,expectedLatest:baseline.id,edits:[{question_id:question.question_id,question_text:question.question_text+' Clarified.'}],quickChoices:{},notes:''},owner);
 expect(kbInfo(store,next).id).toBe(info.id);expect(kbInfo(store,next).sourceImport).toEqual(info.sourceImport);expect(kbInfo(store,baseline).isDefault).toBe(false);expect(kbInfo(store,next).isDefault).toBe(true);
 const row=store.db.prepare('SELECT value FROM settings WHERE key=?').get('source-import:'+baseline.id) as {value:string};const corrupt=JSON.parse(row.value);corrupt.entries[0].sha256='0'.repeat(64);store.db.prepare('UPDATE settings SET value=? WHERE key=?').run(JSON.stringify(corrupt),'source-import:'+baseline.id);expect(()=>sourcePdf(store,baseline,first.doc_id)).toThrow('integrity');
 }finally{store.close();vi.unstubAllEnvs();if(path.resolve(dir).startsWith(path.resolve(tmpdir())+path.sep)&&path.basename(dir).startsWith('mosaic-sources-'))rmSync(dir,{recursive:true,force:true});}
});
