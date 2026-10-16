"use client";
import { useId, useRef, type ReactNode } from "react";
import type { Citation } from "../../application/recommendations/contracts";
export function Information({ label, children }: { label: string; children: ReactNode }) {
 return <details className="results-information"><summary aria-label={label}><span aria-hidden="true">ⓘ</span> {label}</summary><div className="information-body">{children}</div></details>;
}
export function groupCitations(citations: Citation[]) {
 const groups: { title: string; source: string; link: string; sections: string[] }[] = [];
 for(const c of citations) {
  let group=groups.find(g=>g.title===c.doc_title && g.source===c.source && g.link===c.link);
  if(!group){group={title:c.doc_title,source:c.source,link:c.link,sections:[]};groups.push(group);}
  if(!group.sections.includes(c.pages_or_section))group.sections.push(c.pages_or_section);
 }
 return groups;
}
export function Bibliography({citations}:{citations:Citation[]}) {
 return <ul className="bibliography">{groupCitations(citations).map((g,i)=><li key={i}><a className="text-link" href={g.link} target="_blank" rel="noopener noreferrer">{g.title}</a><p className="text-small text-muted">{g.source}</p><ul>{g.sections.map(section=><li key={section}>{section}</li>)}</ul></li>)}</ul>;
}
export function Sources({citations,label}:{citations:Citation[];label:string}) {
 const dialog=useRef<HTMLDialogElement>(null), trigger=useRef<HTMLButtonElement>(null), id=useId();
 return <><button ref={trigger} type="button" className="source-control" aria-haspopup="dialog" aria-label={"Sources ("+citations.length+") for "+label} onClick={()=>dialog.current?.showModal()}>Sources ({citations.length})</button>
 <dialog ref={dialog} className="source-dialog" aria-labelledby={id} onClose={()=>trigger.current?.focus()}><div className="dialog-header"><h2 id={id} className="text-subheading">Sources for {label}</h2><button type="button" className="button-secondary" onClick={()=>dialog.current?.close()}>Close sources</button></div><Bibliography citations={citations}/><p className="mt-4 text-small">References supplied for this insight; membership does not verify every claim.</p></dialog></>;
}
