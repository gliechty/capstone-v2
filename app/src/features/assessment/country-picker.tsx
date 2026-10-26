"use client";
import { useId, useRef, useState } from "react";
import { countries } from "../../application/countries";
export function CountryPicker({ value, onChange, onPendingChange, id, describedBy, invalid }: { value: string; onChange: (value: string) => void; onPendingChange: (pending: boolean) => void; id: string; describedBy: string; invalid: boolean }) {
  const [search,setSearch]=useState(value);
  const [open,setOpen]=useState(false), [browseAll,setBrowseAll]=useState(false), [active,setActive]=useState(-1);
  const input=useRef<HTMLInputElement>(null); const listId=useId();
  const query=browseAll ? "" : search.trim().toLowerCase();
  const matches=countries.filter(country=>country.name.toLowerCase().includes(query) || country.code.toLowerCase()===query);
  const choose=(name:string)=>{onChange(name);setSearch(name);onPendingChange(false);setOpen(false);setActive(-1);setBrowseAll(false);input.current?.focus();};
  return <div className="relative min-w-0" onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget)){setOpen(false);setActive(-1);}}}>
    <input ref={input} id={id} name="country" className="field-control pr-12" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={listId} aria-activedescendant={open && active>=0 ? listId+"-"+active : undefined} aria-describedby={describedBy} aria-invalid={invalid} autoComplete="off" maxLength={200} placeholder="Search countries" value={search} onFocus={()=>setOpen(true)} onChange={event=>{setSearch(event.target.value);if(!event.target.value.trim()){onChange("");onPendingChange(false);}else onPendingChange(true);setBrowseAll(false);setOpen(true);setActive(-1);}} onKeyDown={event=>{
      if(event.key==="ArrowDown" || event.key==="ArrowUp") {event.preventDefault();setOpen(true);const next=matches.length ? active<0 ? event.key==="ArrowDown" ? 0 : matches.length-1 : (active+(event.key==="ArrowDown" ? 1 : -1)+matches.length)%matches.length : -1;setActive(next);requestAnimationFrame(()=>document.getElementById(listId+"-"+next)?.scrollIntoView({block:"nearest"}));}
      else if(event.key==="Enter" && open){event.preventDefault();if(active>=0 && matches[active])choose(matches[active].name);else if(matches.length===1)choose(matches[0]!.name);}
      else if(event.key==="Escape"){event.preventDefault();setSearch(value);onPendingChange(false);setOpen(false);setActive(-1);}
    }}/>
    <button type="button" className="absolute right-0 top-0 flex h-14 w-12 items-center justify-center rounded-r-lg" aria-label="Browse all countries" aria-expanded={open} aria-controls={listId} onClick={()=>{input.current?.focus();setBrowseAll(true);setOpen(true);setActive(-1);}}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg></button>
    {search !== value && search.trim() && <p className="text-small text-muted mt-2">Choose a matching country to apply your search, or clear the field.</p>}
    {open && <ul id={listId} role="listbox" aria-label="Countries and territories" className="absolute left-0 right-0 z-40 mt-1 max-h-64 overflow-y-auto rounded-lg border border-line bg-white py-1 shadow-lg">
      {matches.map((country,index)=>{const at=country.name.toLowerCase().indexOf(query);return <li id={listId+"-"+index} role="option" aria-selected={active===index} key={country.code} tabIndex={-1} onMouseDown={event=>event.preventDefault()} onClick={()=>choose(country.name)} onKeyDown={event=>{if(event.key==="Enter" || event.key===" ")choose(country.name);}} className={"cursor-pointer px-4 py-3 text-small hover:bg-slate-100 "+(active===index?"bg-slate-100":"")}>
        {query && at>=0 ? <><span className="text-muted">{country.name.slice(0,at)}</span><strong>{country.name.slice(at,at+query.length)}</strong><span className="text-muted">{country.name.slice(at+query.length)}</span></> : country.name}
      </li>;})}
      {!matches.length && <li role="presentation" className="px-4 py-3 text-small text-muted">No matching country. Try another spelling or browse the list.</li>}
    </ul>}
  </div>;
}
