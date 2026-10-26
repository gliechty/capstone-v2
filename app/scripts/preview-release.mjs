import {createHash} from "node:crypto";
import {readFileSync,readdirSync,existsSync} from "node:fs";
const files=[];const walk=d=>{if(!existsSync(d))return;for(const e of readdirSync(d,{withFileTypes:true})){const p=d+"/"+e.name;if(e.isDirectory())walk(p);else files.push(p);}};
for(const d of ["src","config","public","deploy/preview"])walk(d);
files.push("package.json","package-lock.json","next.config.ts","postcss.config.mjs","tsconfig.json","tsconfig.domain.json",".dockerignore");
const hash=createHash("sha256");for(const f of files.sort()){hash.update(f+"\0");hash.update(readFileSync(f));hash.update("\0");}
console.log(JSON.stringify({releaseId:"preview-"+hash.digest("hex").slice(0,20),files:files.length,description:"SHA-256 of sorted build source paths and bytes, including uncommitted changes; excludes secrets and local evidence"},null,2));
