import { displayNumber, sourceLabel } from "./display-value";
import { z } from "zod";
import { calculateDraft, calculatorStorageSchema, type CalculatorDraft } from "./calculator";
import type { Question } from "./assessment-catalog";

// Transport mapping only: these are the accepted canonical metric identities, not scoring rules.
const families = ["bus", "cg", "const", "food", "manuf"];
const definitions = Object.fromEntries([
  ...(["carbon", "energy", "water", "waste"] as const).flatMap(kind => families.map(family => [kind + "_intensity_" + family, { kind, unit: ({ carbon: "tCO2e/USD", energy: "kWh/USD", water: "m3/USD", waste: "kg/USD" })[kind] }])),
  ["waste_diverted_percent", { kind: "diversion", unit: "%" }],
  ["hazardous_waste_percent", { kind: "hazardous", unit: "%" }],
  ["water_withdrawal_m3", { kind: "withdrawal", unit: "m3/yr" }],
]) as Record<string, { kind: string; unit: string }>;
export type MetricMapping = { questionId: string; title: string; metricId: string; unit: string; raw: string | null; reason: string | null };
export const calculatorTransferSchema = z.object({
  draft: calculatorStorageSchema,
  questionIds: z.array(z.string()).max(100),
}).strict();
export type CalculatorTransfer = z.infer<typeof calculatorTransferSchema>;
// Preserve binary64 precision while using the questionnaire's existing plain-decimal input contract.
export function decimalAnswer(value: number): string {
  const text = String(value);
  if (!text.includes("e")) return text;
  const [coefficient, exponent] = text.split("e");
  const [whole, fraction = ""] = coefficient!.split(".");
  const digits = whole! + fraction;
  const position = whole!.length + Number(exponent);
  return position <= 0 ? "0." + "0".repeat(-position) + digits : position >= digits.length ? digits + "0".repeat(position - digits.length) : digits.slice(0, position) + "." + digits.slice(position);
}
export function annualPeriod(start: string, end: string): boolean {
  const first = new Date(start + "T00:00:00Z");
  const afterEnd = new Date(end + "T00:00:00Z"); afterEnd.setUTCDate(afterEnd.getUTCDate() + 1);
  const anniversary = new Date(first); anniversary.setUTCFullYear(first.getUTCFullYear() + 1);
  return Number.isFinite(first.getTime()) && anniversary.getTime() === afterEnd.getTime();
}
export function calculatorMappings(draft: CalculatorDraft, questions: readonly Question[]): MetricMapping[] {
  const { result } = calculateDraft(draft);
  return questions.flatMap(q => {
    const metricId = q.metricId ?? "";
    const definition = q.id === "U-026" && metricId === "MET_RE_SHARE" ? { kind: "renewable", unit: "%" } : definitions[metricId];
    if (!definition && metricId !== "MET_RE_SHARE") return [];
    let reason: string | null = null;
    let value: number | null = null;
    const unit = definition?.unit ?? "%";
    if (!definition) reason = "This destination has no approved renewable-share mapping; no autofill.";
    else if (!result) reason = "Calculate valid inputs first.";
    else if (!annualPeriod(result.periodStart, result.periodEnd)) reason = "A complete annual reporting period is required; partial periods are not annualized.";
    else if (q.unit !== unit || !["numeric", "percent"].includes(q.kind)) reason = "Canonical response type/unit does not match; no conversion assumed.";
    else {
      value = definition.kind === "renewable" ? result.renewableEnergyShare : definition.kind === "diversion" ? result.diversionShare : definition.kind === "hazardous" ? result.hazardousShare : definition.kind === "withdrawal" ? result.totals.water.value : result.intensities[definition.kind as keyof typeof result.intensities];
      if (value === null || value === undefined) reason = unavailableMetricReason(definition.kind, draft);
    }
    return [{ questionId: q.id, title: q.title, metricId, unit, raw: reason || value === null ? null : decimalAnswer(value), reason }];
  });
}

export const displayCalculatorNumber = (value: number | null, unit = "") => value === null ? "Unknown" : displayNumber(value, unit);
export function unavailableMetricReason(kind: string, draft: CalculatorDraft): string {
 const { result } = calculateDraft(draft);
 if (!result) return "Calculate valid inputs first.";
 if (["renewable", "renewableElectricity"].includes(kind)) {
  const sources = result.traces.filter(t => kind === "renewableElectricity" ? t.kind === "electricity" : ["electricity", "gas", "fuel", "heat", "mileage"].includes(t.kind));
  const unavailable = sources.filter(t => t.quantity !== null && t.energy === null);
  if (unavailable.length) return "Energy conversion is unavailable for " + unavailable.map(sourceLabel).join(", ") + ". Renewable total-energy share cannot be calculated with these units; entering a renewable portion does not resolve the missing conversion.";
  const missing = sources.filter(t => t.renewable === null);
  return missing.length ? "Renewable portion is unknown for " + missing.map(sourceLabel).join(", ") + ". Enter the known portion or 0 if confirmed none." : "Complete energy coverage and known energy quantities/conversions with a positive total are needed; missing or zero totals do not define a percentage.";
 }
 if (["diversion", "hazardous"].includes(kind)) {
  const field = kind === "diversion" ? "diverted" : "hazardous";
  const missing = result.traces.filter(t => t.kind === "waste" && t[field] === null);
  return missing.length ? (kind === "diversion" ? "Diverted" : "Hazardous") + " portion is unknown for " + missing.map(sourceLabel).join(", ") + ". Enter the known portion or 0 if confirmed none." : "Complete waste coverage and known quantities with a positive waste total are needed for this percentage.";
 }
 const quantity = kind === "carbon" ? result.combinedEmissions : result.totals[kind === "withdrawal" ? "water" : kind as "energy" | "water" | "waste"];
 if (quantity?.value === null) return "Complete " + (kind === "carbon" ? "Scope 1 and Scope 2" : kind === "withdrawal" ? "water" : kind) + " coverage and missing source quantities or factors before transfer. No zero is substituted.";
 return "A positive same-period revenue in USD is needed for this intensity; absolute quantities remain available.";
}
