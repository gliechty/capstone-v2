import { z } from "zod";
import availability from "../../config/calculator-availability.json" with { type: "json" };
import library from "../../config/calculator-reference-v1.json" with { type: "json" };
import { activityKinds, type CalculatorInput, type ReferenceFactor } from "../domain/calculator/types";
import { calculate } from "../domain/calculator/calculate";
// Decimal point is a dot; commas are accepted only as grouped thousands. Storage retains original text.
const numericText = /^(?:\d+(?:\.\d*)?|\.\d+|\d{1,3}(?:,\d{3})+(?:\.\d*)?)(?:[eE][+-]?\d+)?$/;
const numberInput = z.string().max(80).transform((value, ctx) => {
  const raw = value.trim();
  if (!raw) return null;
  if (!numericText.test(raw) || !Number.isFinite(Number(raw.replaceAll(",", "")))) {
    ctx.addIssue({ code: "custom", message: "Enter a number such as 100000 or 100,000 (dot for decimals), or leave blank if unknown. Negative or malformed numbers are not accepted." });
    return z.NEVER;
  }
  return Number(raw.replaceAll(",", ""));
});
const revenueInput = z.string().max(80).transform((value, ctx) => {
  const raw = value.trim(); if (!raw) return null;
  if (!numericText.test(raw.replace(/^-/, "")) || !Number.isFinite(Number(raw.replaceAll(",", "")))) { ctx.addIssue({ code: "custom", message: "Enter revenue using a dot for decimals and grouped commas for thousands (12,000.5), or leave blank." }); return z.NEVER; }
  return Number(raw.replaceAll(",", ""));
});
const coverageChoice = z.union([z.boolean(), z.enum(["complete", "none", "incomplete"])]);
const label = z.string().trim().min(1, "Enter a source name, for example Factory electricity meter.").max(120);
const rawSource = z.object({ id: z.string().min(1).max(80), site: z.string().max(120), source: z.string().max(120), kind: z.enum(activityKinds), quantity: z.string().max(80), unit: z.string().max(20), factorId: z.string().max(50), geography: z.string().max(120), evidence: z.string().max(1000), renewable: z.string().max(80), diverted: z.string().max(80), hazardous: z.string().max(80) }).strict();
export const calculatorStorageSchema = z.object({
  schemaVersion: z.literal(1), factorVersion: z.literal(library.version), periodStart: z.string().max(10), periodEnd: z.string().max(10), referenceAcknowledged: z.boolean(),
  revenue: z.object({ amount: z.string().max(80), currency: z.enum(["USD", "CNY", "other"]), scale: z.enum(["units", "millions"]) }).strict(),
  coverage: z.object({ scope1: coverageChoice, scope2: coverageChoice, energy: coverageChoice, water: coverageChoice, waste: coverageChoice }).strict(), activities: z.array(rawSource).max(100),
}).strict();
const sourceSchema = z.object({ id: z.string().min(1).max(80), site: z.string().trim().max(120), source: label, kind: z.enum(activityKinds), quantity: numberInput, unit: z.string().max(20), factorId: z.string().max(50), geography: z.string().max(120), evidence: z.string().max(1000), renewable: numberInput, diverted: numberInput, hazardous: numberInput }).strict();
export const calculatorDraftSchema = z.object({
  schemaVersion: z.literal(1), factorVersion: z.literal(library.version),
  periodStart: z.iso.date(), periodEnd: z.iso.date(), referenceAcknowledged: z.boolean(),
  revenue: z.object({ amount: revenueInput, currency: z.enum(["USD", "CNY", "other"]), scale: z.enum(["units", "millions"]) }).strict(),
  coverage: z.object({ scope1: coverageChoice, scope2: coverageChoice, energy: coverageChoice, water: coverageChoice, waste: coverageChoice }).strict(),
  activities: z.array(sourceSchema).max(100),
}).strict().refine(x => x.periodStart <= x.periodEnd, { path: ["periodEnd"], message: "End date must be on or after start date." });
export type CalculatorDraft = z.input<typeof calculatorDraftSchema>;
export const referenceFactors = library.factors as ReferenceFactor[];
export const referenceVersion = library.version;
export function initialCalculatorDraft(): CalculatorDraft {
  return { schemaVersion: 1, factorVersion: referenceVersion, periodStart: "", periodEnd: "", referenceAcknowledged: false,
    revenue: { amount: "", currency: "USD", scale: "units" }, coverage: { scope1: false, scope2: false, energy: false, water: false, waste: false }, activities: [] };
}
export function calculateDraft(draft: unknown) {
  const parsed = calculatorDraftSchema.safeParse(draft);
  if (!parsed.success) return { result: null, issues: parsed.error.issues.map(i => ({ path: i.path.join("."), message: i.message })) };
  return calculate(parsed.data as CalculatorInput, referenceFactors, referenceVersion);
}

export function calculatorEligible(country?: string): boolean { return availability.supportedCountries.some(supported => supported.toLowerCase() === country?.trim().toLowerCase()); }
