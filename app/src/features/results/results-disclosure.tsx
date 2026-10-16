"use client";
import { useEffect, useRef, type ReactNode } from "react";
export function ResultsDisclosure({ id, title, identity, children }: { id: string; title: string; identity?: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const key = identity ? "capstone.results.disclosure.v1:" + identity + ":" + id : null;
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    try { element.open = key ? sessionStorage.getItem(key) === "open" : false; } catch { element.open = false; }
  }, [key]);
  return <section id={id} tabIndex={-1} className="results-section results-disclosure" aria-labelledby={id + "-heading"}>
    <details ref={ref} onToggle={event => { if (key) { try { sessionStorage.setItem(key, event.currentTarget.open ? "open" : "closed"); } catch { /* Disclosure remains usable without storage. */ } } }}>
      <summary><h2 id={id + "-heading"} className="text-subheading">{title}</h2><span className="disclosure-chevron" aria-hidden="true">⌄</span></summary>
      <div className="disclosure-body">{children}</div>
    </details>
  </section>;
}
