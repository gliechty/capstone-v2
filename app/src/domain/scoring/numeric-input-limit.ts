// Physical input limits, independent of scoring targets and normalization.
export function numericInputLimit(kind: string, unit = ""): number | undefined {
 if (kind === "percent" || ["%", "percent"].includes(unit.trim().toLowerCase())) return 100;
 if (unit.trim().toLowerCase() === "hours/week") return 168;
 return undefined;
}
