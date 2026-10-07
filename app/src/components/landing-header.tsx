"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function LandingHeader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const header = ref.current;
    if (!header || typeof ResizeObserver === "undefined") return;
    const update = () => document.documentElement.style.setProperty("--landing-header-height", header.getBoundingClientRect().height + "px");
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--landing-header-height");
    };
  }, []);
  return <header ref={ref} className="landing-header">
    <div className="page-container flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-6">{children}</div>
  </header>;
}
