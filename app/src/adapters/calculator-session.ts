import { z } from "zod";
import { calculatorStorageSchema, initialCalculatorDraft, type CalculatorDraft } from "../application/calculator";
import type { SessionStoragePort } from "./assessment-session";
export const CALCULATOR_KEY = "mosaic.calculator.reference.v1";
const savedSchema = z.object({ method: z.enum(["manual", "calculator", "skip"]), draft: calculatorStorageSchema, reviewed: z.boolean(), lastReviewedDraft: calculatorStorageSchema.optional(), priorReviewedDraft: calculatorStorageSchema.optional() }).strict();
export type CalculatorSession = { method: "manual" | "calculator" | "skip"; draft: CalculatorDraft; reviewed: boolean; lastReviewedDraft?: CalculatorDraft; priorReviewedDraft?: CalculatorDraft };
export const initialCalculatorSession = (): CalculatorSession => ({ method: "manual", draft: initialCalculatorDraft(), reviewed: false });
export function createCalculatorSession(getStorage: () => SessionStoragePort) {
  return {
    load(): { state: CalculatorSession; warning: string | null } {
      try {
        const raw = getStorage().getItem(CALCULATOR_KEY);
        if (raw === null) return { state: initialCalculatorSession(), warning: null };
        if (raw.length > 1000000) throw new Error("Oversized saved calculator");
        return { state: savedSchema.parse(JSON.parse(raw)), warning: null };
      } catch { return { state: initialCalculatorSession(), warning: "Saved calculator entries could not be restored (invalid data, version or unavailable storage). Assessment answers are unchanged." }; }
    },
    save(state: CalculatorSession): string | null {
      try { const raw = JSON.stringify(savedSchema.parse(state)); if (raw.length > 1000000) throw new Error("Oversized saved calculator"); getStorage().setItem(CALCULATOR_KEY, raw); return null; }
      catch { return "Calculator entries could not be saved. Keep this page open; refresh may lose your changes."; }
    },
  };
}
export const browserCalculator = createCalculatorSession(() => window.sessionStorage);
