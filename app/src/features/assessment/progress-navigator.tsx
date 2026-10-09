/** @jsxImportSource react */
"use client";

import { useEffect, useId, useRef, useState, type ComponentProps, type CSSProperties, type KeyboardEvent } from "react";

export type ProgressItem = {
  id: string; number: number; title: string; category: string;
  status: string; current: boolean;
};

function stateOf(item: ProgressItem) {
  return item.status === "Answered" ? "answered" : item.status.includes("skipped") ? "skipped" : "unanswered";
}
function symbol(item: ProgressItem) {
  return item.status === "Answered" ? "✓" : item.status.includes("skipped") ? "–" : "○";
}
function label(item: ProgressItem) {
  return "Question " + item.number + ": " + item.title + " — " + item.category + " — " + item.status + (item.current ? " — Current" : "");
}
function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number, container: HTMLElement | null, count: number) {
  const delta = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
  if (!delta && event.key !== "Home" && event.key !== "End") return;
  event.preventDefault();
  const next = event.key === "Home" ? 0 : event.key === "End" ? count - 1 : Math.max(0, Math.min(count - 1, index + delta));
  container?.querySelectorAll<HTMLButtonElement>(".progress-dot")[next]?.focus();
}

// The marker hit slots never move or resize. Only their decorative glyphs magnify;
// the nearby-choice panel provides larger pointer targets for dense sections.
function DesktopTrack({ items, onSelect }: { items: readonly ProgressItem[]; onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const pointerFocus = useRef(false);
  const listRef = useRef<HTMLOListElement>(null);
  const active = hovered ?? focused;
  const start = active === null ? 0 : Math.max(0, Math.min(active - 2, items.length - 5));
  const nearby = active === null ? [] : items.slice(start, start + 5);
  return <div className="progress-track" data-inspected={active ?? ""}
    style={{ "--question-count": Math.max(1, items.length), "--lens-position": ((active ?? 0) + 0.5) / Math.max(1, items.length) * 100 + "%" } as CSSProperties}
    onPointerDownCapture={() => {
      pointerFocus.current = true;
      if (active !== null) setHovered(active);
      setFocused(null);
    }}
    onPointerUpCapture={() => { pointerFocus.current = false; }}
    onPointerCancel={() => { pointerFocus.current = false; }}
    onPointerLeave={() => { setHovered(null); pointerFocus.current = false; }}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(null); }}
    onKeyDownCapture={(event) => { if (event.key === "Escape") { setHovered(null); setFocused(null); } }}>
    <ol className="progress-markers" ref={listRef}>
      {items.map((item, index) => {
        const distance = active === null ? 3 : Math.abs(index - active);
        return <li key={item.id}
          data-proximity={distance === 0 ? "active" : distance <= 2 ? "near" : "far"}>
          <button type="button" className="progress-dot" aria-label={label(item)} aria-current={item.current ? "step" : undefined}
            onPointerEnter={(event) => { if (event.pointerType !== "touch") { setHovered(index); setFocused(null); } }}
            onPointerMove={(event) => { if (event.pointerType !== "touch") setHovered(index); }}
            onFocus={() => { if (!pointerFocus.current) { setHovered(null); setFocused(index); } }}
            onKeyDown={(event) => {
              if (event.key !== "Escape") { setHovered(null); setFocused(index); }
              moveFocus(event, index, listRef.current, items.length);
            }}
            onClick={() => onSelect(item.id)}>
            <span className="progress-symbol" aria-hidden="true"><span className="progress-glyph" data-status={stateOf(item)} /></span>
            <span className="sr-only">{item.status}</span>
          </button>
        </li>;
      })}
    </ol>
    {active !== null && <div className="progress-lens" role="group" aria-label="Nearby questions">
      {nearby.map((item) => <button key={item.id} type="button" className="nearby-choice"
        data-inspected={items[active]?.id === item.id} aria-current={item.current ? "step" : undefined}
        aria-label={"Go to " + label(item).toLowerCase()}
        onClick={() => onSelect(item.id)}>
        <span aria-hidden="true">{symbol(item)}</span>
        <span><strong>{item.number}.</strong> {item.title}</span>
      </button>)}
    </div>}
  </div>;
}

function MobileTrack({ items, onSelect }: { items: readonly ProgressItem[]; onSelect: (id: string) => void }) {
  const ref = useRef<HTMLOListElement>(null);
  return <ol ref={ref} className="mobile-progress-list">
    {items.map((item, index) => <li key={item.id}>
      {index === 0 || items[index - 1]?.category !== item.category ? <p className="text-small text-muted">{item.category}</p> : null}
      <button type="button" className="progress-dot" aria-label={label(item)} aria-current={item.current ? "step" : undefined}
        onKeyDown={(event) => moveFocus(event, index, ref.current, items.length)}
        onClick={(event) => {
          onSelect(item.id);
          const details = event.currentTarget.closest("details");
          if (details) details.open = false;
        }}>
        <span aria-hidden="true">{symbol(item)}</span><span>{item.number}. {item.title}</span>
      </button>
    </li>)}
  </ol>;
}

// Presentation only. Assessment state and navigation remain owned by the caller.
export function ProgressNavigator({ items, onSelect }: { items: readonly ProgressItem[]; onSelect: (id: string) => void }) {
  const complete = items.filter((item) => item.status === "Answered").length;
  return <>
    <aside className="desktop-progress" aria-label="Assessment progress">
      <nav className="progress-panel" aria-label="Question progress">
        <div className="progress-summary"><p className="text-small font-semibold">{complete} of {items.length} answered</p>
        <p className="progress-legend text-small">● Answered · ○ Unanswered · – Skipped<br />Double ring: current</p>
        <p className="mb-3 text-small text-muted">Hover or focus to explore.</p>
        </div><DesktopTrack items={items} onSelect={onSelect} />
      </nav>
    </aside>
    <details className="mobile-progress lg:hidden">
      <summary>{complete} of {items.length} answered · Jump to a question</summary>
      <nav aria-label="Question progress"><MobileTrack items={items} onSelect={onSelect} /></nav>
    </details>
  </>;
}

// Native :active can be delayed on touch devices; feedback starts at contact,
// independently of click navigation, and cancels when the gesture is abandoned.
function TouchChoice(props: ComponentProps<"button">) {
  const [pressed, setPressed] = useState(false);
  return <button {...props} data-pressed={pressed}
    onPointerDown={() => setPressed(true)}
    onPointerUp={() => setPressed(false)}
    onPointerCancel={() => setPressed(false)}
    onPointerLeave={() => setPressed(false)}
    onBlur={() => setPressed(false)} />;
}

// A broad touch surface locates a neighborhood; full-sized choices resolve the
// precise question without pretending 64 tightly packed ticks are finger targets.
export function MobileQuestionRail({ items, onSelect }: { items: readonly ProgressItem[]; onSelect: (id: string) => void }) {
  const [inspected, setInspected] = useState(Math.max(0, items.findIndex(item => item.current)));
  const [open, setOpen] = useState(false);
  const [touching, setTouching] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const rail = useRef<HTMLElement>(null);
  const panelId = useId();
  const start = Math.max(0, Math.min(inspected - 2, items.length - 5));
  useEffect(() => {
    if (!open) return;
    function dismissOutside(event: MouseEvent) {
      if (event.target instanceof Node && !rail.current?.contains(event.target)) {
        // Dismiss the popout without activating an answer underneath it.
        event.preventDefault();
        event.stopPropagation();
        if (rail.current?.contains(document.activeElement)) trigger.current?.focus({ preventScroll: true });
        setOpen(false);
        setTouching(false);
      }
    }
    document.addEventListener("click", dismissOutside, true);
    return () => document.removeEventListener("click", dismissOutside, true);
  }, [open]);
  function inspectPosition(element: HTMLElement, clientY: number) {
    const box = element.getBoundingClientRect();
    setInspected(Math.max(0, Math.min(items.length - 1, Math.floor((clientY - box.top) / box.height * items.length))));
  }
  function close() { setTouching(false); setOpen(false); trigger.current?.focus({ preventScroll: true }); }
  return <nav ref={rail} className="mobile-card-rail lg:hidden" aria-label="Active card question navigation">
    <div className="mobile-rail-sticky" onKeyDownCapture={event => { if (event.key === "Escape") { event.preventDefault(); close(); } }}>
      <button ref={trigger} type="button" className="mobile-rail-surface" aria-label="Explore question track"
        aria-expanded={open} aria-controls={panelId} aria-describedby={panelId + "-hint"}
        onPointerDown={event => { inspectPosition(event.currentTarget, event.clientY); setTouching(true); }}
        onPointerUp={() => setTouching(false)}
        onPointerCancel={() => setTouching(false)}
        onClick={event => {
          if (event.detail > 0) inspectPosition(event.currentTarget, event.clientY);
          setOpen(true);
        }}
        onKeyDown={event => {
          if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          setInspected(index => event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : Math.max(0, Math.min(items.length - 1, index + (event.key === "ArrowDown" ? 1 : -1))));
          setOpen(true);
        }}>
        <span className="mobile-rail-markers" aria-hidden="true" style={{ "--question-count": items.length } as CSSProperties}>
          {items.map((item, index) => <span key={item.id} className="mobile-rail-marker" data-current={item.current}
            data-proximity={!(open || touching) ? "far" : index === inspected ? "active" : Math.abs(index - inspected) <= 2 ? "near" : "far"}>
            <span className="progress-glyph" data-status={stateOf(item)} />
          </span>)}
        </span>
      </button>
      <span id={panelId + "-hint"} className="sr-only">Tap a position to explore nearby questions. Arrow keys, Home and End explore; Tab reaches the question choices; Escape closes them.</span>
      {open && <div id={panelId} className="mobile-rail-choices" role="group" aria-label="Choose a nearby question">
        <p className="sr-only" aria-live="polite">Questions {start + 1}–{Math.min(start + 5, items.length)} of {items.length}</p>
        {items.slice(start, start + 5).map(item => <TouchChoice key={item.id} type="button" className="nearby-choice"
          aria-label={"Go to " + label(item).toLowerCase()} aria-current={item.current ? "step" : undefined}
          onClick={() => { close(); onSelect(item.id); }}>
          <span aria-hidden="true">{symbol(item)}</span><span>{item.number}. {item.title}</span>
        </TouchChoice>)}
      </div>}
    </div>
  </nav>;
}
