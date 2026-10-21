import type { Activity, CalculatorInput, CalculatorResult, CalculationIssue, CoverageKey, Quantity, ReferenceFactor, SourceTrace } from "./types";

const scope1Kinds = ["gas", "fuel", "mileage", "refrigerant", "process", "measured-scope1"];
const scope2Kinds = ["electricity", "heat"];
const energyKinds = ["electricity", "gas", "fuel", "heat", "mileage"];
const units: Record<Activity["kind"], readonly string[]> = {
  electricity: ["kWh", "MWh"], gas: ["kWh", "m3", "therm"], fuel: ["litre"], mileage: ["km"],
  refrigerant: ["kg"], heat: ["kWh", "MWh"], process: ["t"], "measured-scope1": ["tCO2e"], water: ["m3"], waste: ["kg", "t"],
};
export const calculatorUnits = units;
const factorRows: Partial<Record<Activity["kind"], readonly number[]>> = {
  electricity: Array.from({ length: 18 }, (_, i) => i + 19), gas: [13, 14, 15], fuel: [7, 8, 9],
  mileage: [54, 55, 56, 57, 58], refrigerant: [45, 46, 47, 48, 49, 50], heat: [41], process: [92, 93],
};
export function allowedFactorIds(kind: Activity["kind"], unit: string): string[] {
  if (kind === "gas") return [unit === "kWh" ? "legacy-C13" : unit === "m3" ? "legacy-C14" : "legacy-C15"];
  return (factorRows[kind] ?? []).map(row => `legacy-C${row}`);
}
export function activityInCoverage(kind: Activity["kind"], key: CoverageKey): boolean {
  return key === "scope1" ? scope1Kinds.includes(kind) : key === "scope2" ? scope2Kinds.includes(kind) : key === "energy" ? energyKinds.includes(kind) : kind === key;
}
const coverageComplete = (value: CalculatorInput["coverage"][CoverageKey]) => value === true || value === "complete" || value === "none";
const numberText = (n: number) => String(n);
function sourceTrace(a: Activity, factors: readonly ReferenceFactor[]): SourceTrace {
  const factor = factors.find(f => f.id === a.factorId) ?? null;
  const trace: SourceTrace = { ...a, factor, emissions: null, energy: null, water: null, waste: null, renewable: null, diverted: null, hazardous: null, expression: null, flags: [] };
  if (a.quantity === null) { trace.flags.push("Activity not provided"); return trace; }
  const q = a.quantity;
  if (factor) {
    trace.emissions = q * (a.unit === "MWh" ? 1000 : 1) * Number(factor.value) / (a.kind === "process" ? 1 : 1000);
    trace.expression = `${q} ${a.unit}${a.unit === "MWh" ? " × 1000 kWh/MWh" : ""} × ${factor.value} ${factor.factor_unit}${a.kind === "process" ? "" : " ÷ 1000"} = ${numberText(trace.emissions)} tCO2e`;
    trace.flags.push("Historical factor; validity year and applicability not independently verified");
    if (factor.source_label === "MEE~") trace.flags.push("Approximate China provincial factor");
    if (a.kind === "refrigerant") trace.flags.push("Top-up treated as emitted mass: confirm this proxy applies to your source");
  } else if (factorRows[a.kind]) trace.flags.push("Emission factor not selected; emissions unavailable");
  if (a.kind === "measured-scope1") { trace.emissions = q; trace.expression = `${q} tCO2e (measured source)`; }
  if (a.kind === "electricity" || a.kind === "heat" || (a.kind === "gas" && a.unit === "kWh")) trace.energy = q * (a.unit === "MWh" ? 1000 : 1);
  const energyId = a.kind === "gas" && a.unit === "m3" ? "legacy-C64" : a.kind === "fuel" ? ({ "legacy-C7": "legacy-C65", "legacy-C8": "legacy-C66", "legacy-C9": "legacy-C67" } as Record<string, string>)[a.factorId] : undefined;
  if (energyId) {
    const energyFactor = factors.find(f => f.id === energyId);
    if (energyFactor) { trace.energy = q * Number(energyFactor.value); trace.flags.push(`Energy conversion: ${q} × ${energyFactor.value} kWh/${a.unit}; ${energyFactor.cell}, ${energyFactor.version}`); }
  }
  if (energyKinds.includes(a.kind) && trace.energy === null) trace.flags.push("Energy conversion unavailable; total energy is incomplete");
  if (energyKinds.includes(a.kind) && a.renewable !== null && trace.energy !== null) trace.renewable = q === 0 ? 0 : a.renewable / q * trace.energy;
  if (a.kind === "water") trace.water = q;
  if (a.kind === "waste") {
    const scale = a.unit === "t" ? 1000 : 1;
    trace.waste = q * scale;
    trace.diverted = a.diverted === null ? null : a.diverted * scale;
    trace.hazardous = a.hazardous === null ? null : a.hazardous * scale;
  }
  return trace;
}
function aggregate(rows: readonly SourceTrace[], field: "emissions" | "energy" | "water" | "waste", complete: boolean, unit: string): Quantity {
  const provided = rows.filter(r => r[field] !== null);
  const knownSubtotal = provided.length ? provided.reduce((sum, r) => sum + r[field]!, 0) : complete && rows.length === 0 ? 0 : null;
  const resolved = complete && provided.length === rows.length;
  return { value: resolved ? knownSubtotal : null, knownSubtotal, unit, complete: resolved };
}
function share(rows: readonly SourceTrace[], field: "renewable" | "diverted" | "hazardous", denominator: Quantity) {
  if (denominator.value === null || denominator.value <= 0 || rows.some(r => r[field] === null)) return null;
  return rows.reduce((sum, r) => sum + r[field]!, 0) / denominator.value * 100;
}
export function calculate(input: CalculatorInput, factors: readonly ReferenceFactor[], factorVersion: string): { result: CalculatorResult | null; issues: CalculationIssue[] } {
  const issues: CalculationIssue[] = [];
  const seen = new Set<string>();
  input.activities.forEach((a, index) => {
    const path = `activities.${index}`;
    for (const field of ["quantity", "renewable", "diverted", "hazardous"] as const) {
      if (a[field] !== null && (!Number.isFinite(a[field]) || a[field] < 0)) issues.push({ path: `${path}.${field}`, message: "Enter a finite, nonnegative number or leave unknown." });
    }
    if (!units[a.kind].includes(a.unit)) issues.push({ path: `${path}.unit`, message: "Choose a supported unit." });
    const key = JSON.stringify([a.site.trim().toLowerCase(), a.source.trim().toLowerCase()]);
    if (seen.has(key)) issues.push({ path: `${path}.source`, message: "This site/source already has an entry. Choose one method per activity; do not add an overlapping total." });
    seen.add(key);
    if (a.factorId && (!allowedFactorIds(a.kind, a.unit).includes(a.factorId) || !factors.some(f => f.id === a.factorId && f.version === factorVersion))) issues.push({ path: `${path}.factorId`, message: "This factor does not match the activity, unit or library version." });
    const factor = factors.find(f => f.id === a.factorId);
    if (a.kind === "electricity" && factor && a.geography !== factor.geography) issues.push({ path: `${path}.geography`, message: "The selected grid factor must match the stated geography." });
    for (const field of ["renewable", "diverted", "hazardous"] as const) {
      if (a[field] !== null && (a.quantity === null || a[field]! > a.quantity)) issues.push({ path: `${path}.${field}`, message: "A known total is required and the subset cannot exceed it." });
    }
  });
  if (input.activities.some(a => a.factorId) && !input.referenceAcknowledged) issues.push({ path: "referenceAcknowledged", message: "Acknowledge the historical-factor limitations before calculating with them." });

  for (const key of Object.keys(input.coverage) as CoverageKey[]) {
    const rows = input.activities.filter(a => activityInCoverage(a.kind, key));
    if (input.coverage[key] === "none" && rows.length) issues.push({ path: `coverage.${key}`, message: "None apply conflicts with entered sources. Remove those sources or select All relevant sources entered / Incomplete." });
    if (input.coverage[key] === "complete" && !rows.length) issues.push({ path: `coverage.${key}`, message: "Enter the relevant sources, or select None apply / Incomplete." });
  }
  if (issues.length) return { result: null, issues };
  const traces = input.activities.map(a => sourceTrace(a, factors));
  const totals: Record<CoverageKey, Quantity> = {
    scope1: aggregate(traces.filter(r => scope1Kinds.includes(r.kind)), "emissions", coverageComplete(input.coverage.scope1), "tCO2e"),
    scope2: aggregate(traces.filter(r => scope2Kinds.includes(r.kind)), "emissions", coverageComplete(input.coverage.scope2), "tCO2e"),
    energy: aggregate(traces.filter(r => energyKinds.includes(r.kind)), "energy", coverageComplete(input.coverage.energy), "kWh"),
    water: aggregate(traces.filter(r => r.kind === "water"), "water", coverageComplete(input.coverage.water), "m3"),
    waste: aggregate(traces.filter(r => r.kind === "waste"), "waste", coverageComplete(input.coverage.waste), "kg"),
  };
  const complete = totals.scope1.complete && totals.scope2.complete;
  const known = [totals.scope1.knownSubtotal, totals.scope2.knownSubtotal].filter((v): v is number => v !== null);
  const combinedEmissions: Quantity = { value: complete ? totals.scope1.value! + totals.scope2.value! : null, knownSubtotal: known.length ? known.reduce((a,b) => a+b, 0) : null, unit: "tCO2e", complete };
  const revenue = input.revenue.currency === "USD" && input.revenue.amount !== null && input.revenue.amount > 0 ? input.revenue.amount * (input.revenue.scale === "millions" ? 1000000 : 1) : null;
  const intensity = (q: Quantity) => q.value !== null && revenue !== null ? q.value / revenue : null;
  const electricityRows = traces.filter(r => r.kind === "electricity");
  const electricity = aggregate(electricityRows, "energy", coverageComplete(input.coverage.energy), "kWh");
  const energyRows = traces.filter(r => energyKinds.includes(r.kind));
  const flags = [...new Set(traces.flatMap(t => t.flags))];
  if (Object.values(totals).some(t => !t.complete)) flags.push("Only explicitly complete activity coverage produces a total; other values are known subtotals.");
  if (input.revenue.amount !== null && input.revenue.amount <= 0) flags.push("Zero or negative revenue cannot be used as an intensity denominator; absolute quantities remain available.");
  if (revenue === null) flags.push("Same-period USD revenue is required for intensity; no currency conversion is assumed.");
  flags.push("Renewable share is separate from location-based emissions. U-026 autofill remains pending.");
  const result: CalculatorResult = {
    methodVersion: "m4.1-reconciled-reference-v1", factorVersion, periodStart: input.periodStart, periodEnd: input.periodEnd, traces, totals, combinedEmissions,
    intensities: { carbon: intensity(combinedEmissions), energy: intensity(totals.energy), water: intensity(totals.water), waste: intensity(totals.waste) },
    renewableElectricityShare: share(electricityRows, "renewable", electricity),
    renewableEnergyShare: share(energyRows, "renewable", totals.energy),
    diversionShare: share(traces.filter(r => r.kind === "waste"), "diverted", totals.waste), hazardousShare: share(traces.filter(r => r.kind === "waste"), "hazardous", totals.waste), flags,
  };
  const numeric = [revenue, ...Object.values(totals).flatMap(t => [t.value,t.knownSubtotal]), combinedEmissions.value, combinedEmissions.knownSubtotal, ...Object.values(result.intensities), ...traces.flatMap(t => [t.emissions,t.energy,t.water,t.waste]), result.renewableElectricityShare,result.renewableEnergyShare,result.diversionShare,result.hazardousShare];
  if (numeric.some(n => n !== null && !Number.isFinite(n))) return { result: null, issues: [{ path: "activities", message: "These quantities exceed the supported numeric range. Check the inputs and units." }] };
  return { result, issues: [] };
}
