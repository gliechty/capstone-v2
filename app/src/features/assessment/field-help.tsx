"use client";
import { useRef, useState } from "react";

export function FieldHelp({ id, label, children }: { id: string; label: string; children: string }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  return <div className="context-help" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <button ref={button} type="button" aria-label={label + " information"} aria-expanded={open} aria-controls={id}
      onClick={() => setOpen(!open)} onKeyDown={event => {
        if (event.key === "Escape") { event.preventDefault(); setOpen(false); button.current?.focus(); }
      }}><span aria-hidden="true">ⓘ</span></button>
    <p id={id} hidden={!open} className="context-help-panel text-small">{children}</p>
  </div>;
}
