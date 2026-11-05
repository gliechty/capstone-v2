"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function LandingHeader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const header = ref.current;
    if (!header || typeof ResizeObserver === "undefined") return;
    const links = Array.from(header.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]'));
    const sections = links.map(link => document.getElementById(link.hash.slice(1)));
    const update = () => {
      const height = header.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--landing-header-height", height + "px");
      const margin = sections[0] ? parseFloat(getComputedStyle(sections[0]).scrollMarginTop) || 0 : 0;
      const position = height + margin + 2;
      let current = -1;
      sections.forEach((section, index) => {
        if (section && section.getBoundingClientRect().top <= position) current = index;
      });
      links.forEach((link, index) => {
        if (index === current) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    const main = document.getElementById("main-content");
    if (main) observer.observe(main);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.documentElement.style.removeProperty("--landing-header-height");
    };
  }, []);
  return <header ref={ref} className="landing-header">
    <div className="page-container flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-6">{children}</div>
  </header>;
}
