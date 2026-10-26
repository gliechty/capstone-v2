export const activityKinds = ["electricity", "gas", "fuel", "mileage", "refrigerant", "heat", "process", "measured-scope1", "water", "waste"] as const;
export type ActivityKind = typeof activityKinds[number];
export type CoverageKey = "scope1" | "scope2" | "energy" | "water" | "waste";
export type Activity = {
  id: string; site: string; source: string; kind: ActivityKind; quantity: number | null;
  unit: string; factorId: string; geography: string; evidence: string;
  renewable: number | null; diverted: number | null; hazardous: number | null;
};
export type CalculatorInput = {
  periodStart: string; periodEnd: string; referenceAcknowledged: boolean;
  revenue: { amount: number | null; currency: "USD" | "CNY" | "other"; scale: "units" | "millions" };
  coverage: Record<CoverageKey, boolean | "complete" | "none" | "incomplete">; activities: Activity[];
};
export type ReferenceFactor = {
  id: string; version: string; cell: string; label: string; input_unit: string;
  value: string; factor_unit: string; source_label: string; geography: string;
  validity_year: null; source_url: null; production_approved: false; limitations: string[];
};
export type CalculationIssue = { path: string; message: string };
export type Quantity = { value: number | null; knownSubtotal: number | null; unit: string; complete: boolean };
export type SourceTrace = {
  id: string; site: string; source: string; kind: ActivityKind; quantity: number | null; unit: string;
  factor: ReferenceFactor | null; evidence: string; emissions: number | null; energy: number | null;
  water: number | null; waste: number | null; renewable: number | null; diverted: number | null; hazardous: number | null;
  expression: string | null; flags: string[];
};
export type CalculatorResult = {
  methodVersion: string; factorVersion: string; periodStart: string; periodEnd: string;
  traces: SourceTrace[]; totals: Record<CoverageKey, Quantity>; combinedEmissions: Quantity;
  intensities: { carbon: number | null; energy: number | null; water: number | null; waste: number | null };
  renewableElectricityShare: number | null; renewableEnergyShare: number | null;
  diversionShare: number | null; hazardousShare: number | null; flags: string[];
};
