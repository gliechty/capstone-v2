"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function LandingHeader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const menu = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const header = ref.current;
    const closeOnLink = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("nav a");
      if (!link) return;
      setOpen(false);
      if (!open || !menu.current?.offsetParent) return;
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      requestAnimationFrame(() => {
        if (!header?.isConnected) return;
        document.documentElement.style.setProperty("--landing-header-height", (header?.getBoundingClientRect().height ?? 0) + "px");
        target.scrollIntoView({block:"start",behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
        history.pushState(null, "", link.hash);
      });
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape" && open) { setOpen(false); menu.current?.focus(); } };
    header?.addEventListener("click", closeOnLink);
    header?.addEventListener("keydown", escape);
    return () => { header?.removeEventListener("click", closeOnLink); header?.removeEventListener("keydown", escape); };
  }, [open]);
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
  return <header ref={ref} className="landing-header" data-menu-open={open}>
    <div className="page-container flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-6">
      <button ref={menu} type="button" className="landing-menu-button" aria-label="Section menu" aria-expanded={open} aria-controls="landing-navigation" onClick={() => setOpen(!open)}><span aria-hidden="true">☰</span></button>
      {children}
    </div>
  </header>;
}
