import {readFileSync,realpathSync} from 'node:fs';
import path from 'node:path';
import {z} from 'zod';
import {AdminError,type Actor,type Release} from '../application/admin/contracts';
import {hash,type AdminStore} from './admin-store';

const root=()=>path.resolve(process.env.MOSAIC_SOURCE_LIBRARY_DIR||path.join(process.cwd(),'.local','capstone-source-library'));
const entrySchema=z.object({id:z.string(),path:z.string(),sha256:z.string().regex(/^[a-f0-9]{64}$/),bytes:z.number().int().positive(),edition:z.string().nullable().optional()});
type Entry=z.infer<typeof entrySchema>&{sourceIdentity:string};
type ImportRecord={at:string;by:string;identity:Actor['identity'];manifestHash:string;entries:Entry[]};
export function kbRoot(store:AdminStore,release:Release):Release {
 const seen=new Set<string>();let current=release;
 while(current.parent){if(seen.has(current.id))throw new AdminError('Invalid version ancestry',409);seen.add(current.id);current=store.release(current.parent);}
 return current;
}
const key=(id:string)=>'source-import:'+id;
function record(store:AdminStore,id:string):ImportRecord|null {const row=store.db.prepare('SELECT value FROM settings WHERE key=?').get(key(id)) as {value:string}|undefined;return row?JSON.parse(row.value):null;}
function bytes(entry:Entry|z.infer<typeof entrySchema>):Buffer {
 const base=realpathSync(/* turbopackIgnore: true */ root()),file=realpathSync(/* turbopackIgnore: true */ path.resolve(base,entry.path));
 if(!file.startsWith(base+path.sep)||!file.toLowerCase().endsWith('.pdf'))throw new AdminError('Invalid source file location',409);
 const data=readFileSync(/* turbopackIgnore: true */ file);
 if(data.length!==entry.bytes||hash(data)!==entry.sha256||data.subarray(0,5).toString()!=='%PDF-')throw new AdminError('Source integrity check failed; original not served.',409);
 return data;
}
export function sourceImport(store:AdminStore,release:Release,actor:Actor) {
 if(actor.role!=='super_admin'||actor.email!==process.env.MOSAIC_SUPER_ADMIN_EMAIL?.trim().toLowerCase())throw new AdminError('Only the initial super admin can register this recovered collection.',403);
 const kb=kbRoot(store,release);if(kb.id!==store.baseline.version)throw new AdminError('No recovered collection is staged for this knowledge base.',404);
 const existing=record(store,kb.id);if(existing)return kbInfo(store,release);
 const raw=readFileSync(/* turbopackIgnore: true */ path.join(root(),'manifest.json'),'utf8'),entries=z.array(entrySchema).parse(JSON.parse(raw));
 if(new Set(entries.map(e=>e.id)).size!==entries.length)throw new AdminError('Duplicate source IDs in manifest.',409);
 const bound=kb.config.DocumentIndex.map(s=>{const e=entries.find(e=>e.id===s.doc_id);if(!e)throw new AdminError('Missing recovered source '+s.doc_id,409);bytes(e);return {...e,sourceIdentity:hash(JSON.stringify(s))};});
 store.transaction(()=>{if(record(store,kb.id))return;const value:ImportRecord={at:new Date().toISOString(),by:actor.email,identity:actor.identity,manifestHash:hash(raw),entries:bound};store.db.prepare('INSERT INTO settings VALUES(?,?)').run(key(kb.id),JSON.stringify(value));store.log(actor,'import-source-originals',{kb:kb.id,count:bound.length,manifestHash:value.manifestHash});});
 return kbInfo(store,release);
}
export function kbInfo(store:AdminStore,release:Release) {
 const kb=kbRoot(store,release),imported=record(store,kb.id);
 return {id:kb.id,title:kb.id===store.baseline.version?'Capstone Baseline':kb.name,description:kb.id===store.baseline.version?'The original Capstone Spring ’26 knowledge base, preserved as the foundation for MOSAIC.':null,version:release.id,isDefault:release.id===store.release().id,sourceCount:release.config.DocumentIndex.length,sourceImport:imported?{at:imported.at,by:imported.by,identity:imported.identity}:null,canImport:!imported&&kb.id===store.baseline.version};
}
export function sourceList(store:AdminStore,release:Release) {
 const imported=record(store,kbRoot(store,release).id);
 return release.config.DocumentIndex.map(s=>{const e=imported?.entries.find(e=>e.id===s.doc_id&&e.sourceIdentity===hash(JSON.stringify(s)));return {id:s.doc_id,available:!!e,sha256:e?.sha256??null,edition:e?.edition??null};});
}
export function sourcePdf(store:AdminStore,release:Release,id:string) {
 const source=release.config.DocumentIndex.find(s=>s.doc_id===id);if(!source)throw new AdminError('Source is not in this configuration version.',404);
 const e=record(store,kbRoot(store,release).id)?.entries.find(e=>e.id===id&&e.sourceIdentity===hash(JSON.stringify(source)));
 if(!e)throw new AdminError('Original source unavailable for this version.',404);
 return {data:bytes(e),sha256:e.sha256};
}
