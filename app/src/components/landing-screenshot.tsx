"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

export function LandingScreenshot({ title, screenshot, alt }: { title: string; screenshot: string; alt: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [zoom, setZoom] = useState(1);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = previous; };
  }, [open]);
  const src = "/screenshots/" + screenshot;
  return <>
    <button ref={trigger} type="button" className="landing-screenshot" aria-haspopup="dialog" aria-label={"Enlarge screenshot: " + title} onClick={() => {setZoom(1); setOpen(true); dialog.current?.showModal();}}>
      <Image src={src} alt={alt} width={1920} height={1080} />
    </button>
    <dialog ref={dialog} className="landing-image-dialog" aria-labelledby={titleId} onClose={() => {setOpen(false); trigger.current?.focus({preventScroll:true});}}>
      <div className="landing-image-dialog-header">
        <h2 id={titleId} className="text-subheading">{title}</h2>
        <button type="button" className="button-secondary" onClick={() => dialog.current?.close()}>Close screenshot</button>
      </div>
      <div className="landing-image-tools" role="group" aria-label="Screenshot zoom">
        <button type="button" className="button-secondary" disabled={zoom === 1} onClick={() => setZoom(Math.max(1, zoom - 1))}>Zoom out</button>
        <button type="button" className="button-secondary" disabled={zoom === 6} onClick={() => setZoom(Math.min(6, zoom + 1))}>Zoom in</button>
        <button type="button" className="button-secondary" onClick={() => setZoom(1)}>Fit image</button>
        <span role="status">{zoom * 100}%</span>
      </div>
      {/* Keyboard focus enables native arrow-key scrolling of the zoomed image. */}
      {/* eslint-disable-next-line jsx-a11y-x/no-noninteractive-tabindex */}
      <div className="landing-image-pan" tabIndex={0} role="region" aria-label="Screenshot; scroll or swipe to pan">
        <Image src={src} alt={alt} width={1920} height={1080} className="landing-image-full" style={{width: `${zoom * 100}%`}} />
      </div>
    </dialog>
  </>;
}
