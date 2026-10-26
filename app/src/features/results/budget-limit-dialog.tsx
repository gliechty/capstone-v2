"use client";
import { useEffect, useId, useRef, type RefObject } from "react";
export const budgetLimitMessage = "Today’s AI recommendation budget has been reached. Your scores remain available. Please try again tomorrow or contact Guy / the Climate School to arrange additional access.";
export function BudgetLimitDialog({blocked,returnFocus}:{blocked:boolean;returnFocus?:RefObject<HTMLButtonElement|null>}) {
  const dialog = useRef<HTMLDialogElement>(null), title = useId(), description = useId();
  useEffect(() => {
    if (!blocked) return;
    const previous = returnFocus?.current ?? document.activeElement;
    const node = dialog.current;
    node?.showModal();
    const restore = () => { if (previous instanceof HTMLElement && previous.isConnected) previous.focus(); };
    node?.addEventListener("close",restore);
    return () => { node?.close(); node?.removeEventListener("close",restore); };
  },[blocked,returnFocus]);
  return <dialog ref={dialog} className="source-dialog" aria-labelledby={title} aria-describedby={description}>
    <h2 id={title} className="text-subheading">Daily AI budget reached</h2>
    <p id={description} className="mt-4">{budgetLimitMessage}</p>
    <button type="button" className="button-secondary mt-4" onClick={()=>dialog.current?.close()}>Close</button>
  </dialog>;
}
