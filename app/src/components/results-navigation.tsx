"use client";

import { useRef, type KeyboardEvent } from "react";

const sections = [
  { id: "summary", label: "Summary" },
  { id: "gaps", label: "Key Gaps" },
  { id: "actions", label: "Recommended Actions" },
  { id: "sources", label: "Evidence/Sources" },
];

export function ResultsNavigation() {
  const disclosure = useRef<HTMLDetailsElement>(null);
  function closeDisclosure() {
    if (disclosure.current) disclosure.current.open = false;
  }
  function handleEscape(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && disclosure.current?.open) {
      closeDisclosure();
      disclosure.current.querySelector("summary")?.focus();
    }
  }
  return <div className="results-navigation">
    <nav aria-label="Results sections" className="results-desktop-nav">
      {sections.map((section, index) => <a key={section.id} href={"#" + section.id}>
        <span aria-hidden="true" className="results-nav-number">0{index + 1}</span>{section.label}
      </a>)}
    </nav>
    <details ref={disclosure} className="results-mobile-nav">
      <summary onKeyDown={handleEscape}>On this page <span className="text-small text-muted">/ 4 sections</span></summary>
      <nav aria-label="Results sections">
        {sections.map((section, index) => <a key={section.id} href={"#" + section.id} onClick={closeDisclosure} onKeyDown={handleEscape}>
          <span aria-hidden="true" className="results-nav-number">0{index + 1}</span>{section.label}
        </a>)}
      </nav>
    </details>
  </div>;
}
