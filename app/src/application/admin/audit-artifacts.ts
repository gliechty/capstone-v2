export type AuditTable={columns:string[];rows:string[][]};
export function readableValue(value:unknown):string {
 if(value===null||value===undefined||value==='')return '';
 if(Array.isArray(value))return value.map(readableValue).join('\n');
 if(typeof value==='object')return Object.entries(value).map(([k,v])=>k+': '+readableValue(v)).join('\n');
 return String(value);
}
export function auditTable(value:unknown):AuditTable {
 if(Array.isArray(value)){const objects:Record<string,unknown>[]=value.map(v=>v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{Value:v});const columns=[...new Set(objects.flatMap(Object.keys))];return {columns,rows:objects.map(r=>columns.map(k=>readableValue(r[k])))};}
 if(value&&typeof value==='object')return {columns:['Field','Value'],rows:Object.entries(value).map(([k,v])=>[k,readableValue(v)])};
 return {columns:['Value'],rows:[[readableValue(value)]]};
}
export function parseAuditCsv(text:string):AuditTable {
 const rows:string[][]=[];let row:string[]=[],cell='',quoted=false,closed=false;const source=text.replace(/^\uFEFF/,'');
 for(let i=0;i<source.length;i++){const c=source[i]!;if(quoted){if(c==='"'){if(source[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else cell+=c;continue;}
 if(c==='"'){if(cell||closed)throw Error('Invalid quote in archived CSV.');quoted=true;}
 else if(c===','){row.push(cell);cell='';closed=false;}
 else if(c==='\r'||c==='\n'){if(c==='\r'&&source[i+1]==='\n')i++;row.push(cell);rows.push(row);row=[];cell='';closed=false;}
 else {if(closed)throw Error('Unexpected text after a quoted CSV field.');cell+=c;}}
 if(quoted)throw Error('Unclosed quoted CSV field.');if(cell||row.length||closed){row.push(cell);rows.push(row);}
 const columns=rows.shift()??[];if(rows.some(r=>r.length!==columns.length))throw Error('Archived CSV has inconsistent column counts.');return {columns,rows};
}
export function auditCsv(table:AuditTable):string {
 const quote=(value:string)=>{const numeric=/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(value);const safe=!numeric&&/^[\s\uFEFF]*[=+\-@]/.test(value)?"'"+value:value;return '"'+safe.replaceAll('"','""')+'"';};
 return [table.columns,...table.rows].map(r=>r.map(quote).join(',')).join('\r\n')+'\r\n';
}
