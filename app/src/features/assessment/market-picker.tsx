"use client";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { marketValues, toggleMarket } from "../../application/assessment-setup";

export function MarketPicker({ value, options, onChange, describedBy }: {
  value: string; options: { label: string; value: string }[];
  onChange: (value: string) => void; describedBy: string;
}) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const selected = marketValues(value);
  const summary = selected.map((market, index) => `${index === 0 ? "Primary" : "Secondary"}: ${options.find(option => option.value === market)?.label ?? market}`).join(" · ");
  function closeOnEscape(event: KeyboardEvent<HTMLButtonElement | HTMLInputElement>) {
    if (event.key === "Escape" && open) { event.preventDefault(); setOpen(false); button.current?.focus(); }
  }
  return <div role="group" aria-label="Target market selector" className="relative min-w-0" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <button ref={button} type="button" name="targetMarket" className="field-control flex items-center justify-between gap-3 text-left"
      aria-label="Choose target markets" aria-expanded={open} aria-controls={panelId} aria-describedby={describedBy}
      onKeyDown={closeOnEscape} onClick={() => setOpen(!open)}>
      <span>{selected.length ? `${selected.length} of 2 markets selected` : "Choose up to two markets"}</span>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
    </button>
    {open && <div id={panelId} role="group" aria-label="Target market choices" className="absolute left-0 right-0 z-40 mt-1 max-h-64 overflow-y-auto rounded-lg border border-line bg-white p-2 shadow-lg">
      {options.map(option => <label key={option.value} className="flex min-h-12 cursor-pointer items-center gap-3 rounded px-3 py-2 hover:bg-slate-100">
        <input type="checkbox" value={option.value} checked={selected.includes(option.value)} onKeyDown={closeOnEscape}
          disabled={selected.length >= 2 && !selected.includes(option.value)}
          onChange={() => onChange(toggleMarket(value, option.value))} />
        <span>{option.label}</span>
      </label>)}
      <p className="px-3 py-2 text-small text-muted">Select up to two. Uncheck a selected market to remove it.</p>
    </div>}
    <p className="mt-2 text-small" role="status">{summary || "No target markets selected."}</p>
  </div>;
}
