import {createHash} from 'node:crypto';
import {readFileSync,readdirSync,existsSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const host=process.argv.find(x=>x.startsWith('--host='))?.slice(7)??'root@2.28.206.236';
const key=process.argv.find(x=>x.startsWith('--key='))?.slice(6);
if(!key)throw new Error('Supply --key=path-to-new-server-SSH-key');
if(!/^[a-z0-9@.-]+$/i.test(host))throw new Error('Invalid SSH host');
const entries=['src','config','public','deploy/app','package.json','package-lock.json','next.config.ts','postcss.config.mjs','tsconfig.json','tsconfig.domain.json','.dockerignore'];
const files=[];const walk=p=>{for(const e of readdirSync(resolve(root,p),{withFileTypes:true})){if(e.isSymbolicLink())throw new Error('Symlink excluded');const f=p+'/'+e.name;if(e.isDirectory())walk(f);else files.push(f);}};
for(const p of entries)if(existsSync(resolve(root,p))){if(['src','config','public','deploy/app'].includes(p))walk(p);else files.push(p);}
const hash=createHash('sha256');for(const p of files.sort()){hash.update(p+'\0');hash.update(readFileSync(resolve(root,p)));hash.update('\0');}
const release='mosaic-'+hash.digest('hex').slice(0,20);mkdirSync(resolve(root,'.local'),{recursive:true});
const archive=resolve(root,'.local',release+'.tar');
const run=(exe,args)=>{const r=spawnSync(exe,args,{cwd:root,stdio:'inherit'});if(r.status!==0)throw new Error(exe+' failed; prior image retained');};
run('tar',['-cf',archive,...entries.filter(p=>existsSync(resolve(root,p)))]);
run('scp',['-i',key,'-o','BatchMode=yes','-o','StrictHostKeyChecking=yes',archive,host+':/root/'+release+'.tar']);
run('ssh',['-i',key,'-o','BatchMode=yes','-o','StrictHostKeyChecking=yes',host,`mkdir -p /opt/mosaic-app/releases/${release}/app && tar -xf /root/${release}.tar -C /opt/mosaic-app/releases/${release}/app && sh /opt/mosaic-app/releases/${release}/app/deploy/app/deploy.sh ${release}`]);
console.log('Release:',release);
