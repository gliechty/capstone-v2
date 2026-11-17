import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
export const dir=path.dirname(fileURLToPath(import.meta.url));
export const root=path.resolve(dir,'../..');
export const read=p=>fs.readFileSync(path.join(root,p),'utf8').replace(/^\uFEFF/,'');
export const json=p=>JSON.parse(read(p));
export const save=(name,value)=>fs.writeFileSync(path.join(dir,name),JSON.stringify(value,null,2)+'\n');
export const hash=value=>createHash('sha256').update(value).digest('hex');
export const classes=['direct_knowledge','record_lookup','calculation_aggregation','needs_review'];
export const questions=json('app/config/capstone-v1/QuestionBank.json');
export const contentHash=q=>hash(JSON.stringify(q)); // all original ordered fields, UTF-8, no whitespace
export const dependencyRoot=process.env.M8_DEPENDENCY_ROOT||path.resolve(root,'../.m13-approved/app');
export const requireDependency=createRequire(path.join(dependencyRoot,'package.json'));
export async function loadTs(relative){
  const ts=requireDependency('typescript');
  let source=ts.transpileModule(read(relative),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
  source=source.replace('from "zod"',`from ${JSON.stringify(pathToFileURL(requireDependency.resolve('zod')).href)}`);
  return import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
}
// Preserve raw CSV records, including quoting, embedded newlines and original line endings.
export function csvRecords(text){
  const out=[];let quoted=false,start=0;
  for(let i=0;i<text.length;i++){
    if(text[i]==='"'){if(quoted&&text[i+1]==='"')i++;else quoted=!quoted;}
    if(text[i]==='\n'&&!quoted){out.push(text.slice(start,i+1));start=i+1;}
  }
  if(start<text.length)out.push(text.slice(start));
  if(quoted)throw Error('Unterminated CSV quote');
  return out;
}
export function csvCells(record){
  const values=[];let quoted=false,value='';
  record=record.replace(/\r?\n$/,'').replace(/^\uFEFF/,'');
  for(let i=0;i<record.length;i++){
    const c=record[i];
    if(c==='"'){if(quoted&&record[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}
    else if(c===','&&!quoted){values.push(value);value='';}else value+=c;
  }
  values.push(value);return values;
}
export const csvString=rows=>rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n')+'\n';
