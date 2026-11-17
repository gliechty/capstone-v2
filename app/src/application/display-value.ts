// Presentation only. Never use formatted strings as calculation or storage inputs.
export function displayNumber(value: number, unit = "", grouping = true): string {
 const compact = unit.includes("/USD") || (value !== 0 && Math.abs(value) < 0.01);
 return new Intl.NumberFormat("en", { useGrouping: grouping, ...(compact ? {maximumSignificantDigits:4} : {maximumFractionDigits:2}) }).format(value);
}
export function displayAnswer(raw: string, unit = "", withUnit = true): string {
 const value = raw.trim();
 if (!/^\d+(\.\d+)?$/.test(value) || !Number.isFinite(Number(value))) return raw;
 const label = unit === "percent" ? "%" : unit;
 return displayNumber(Number(value), label, withUnit) + (withUnit && label ? " " + label : "");
}
export const sourceLabel = (source: {site:string;source:string}) => [source.site.trim(), source.source.trim()].filter(Boolean).join(" / ");
