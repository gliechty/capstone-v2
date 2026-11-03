"use client";

import Image from "next/image";
import { useId, useRef } from "react";

export function LandingScreenshot({ title, screenshot, alt }: { title: string; screenshot: string; alt: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const src = "/screenshots/" + screenshot;
  return <>
    <button ref={trigger} type="button" className="landing-screenshot" aria-haspopup="dialog" aria-label={"Enlarge screenshot: " + title} onClick={() => dialog.current?.showModal()}>
      <Image src={src} alt={alt} width={1920} height={1080} />
    </button>
    <dialog ref={dialog} className="landing-image-dialog" aria-labelledby={titleId} onClose={() => trigger.current?.focus()}>
      <div className="landing-image-dialog-header">
        <h2 id={titleId} className="text-subheading">{title}</h2>
        <button type="button" className="button-secondary" onClick={() => dialog.current?.close()}>Close screenshot</button>
      </div>
      <Image src={src} alt={alt} width={1920} height={1080} className="landing-image-full" />
    </dialog>
  </>;
}