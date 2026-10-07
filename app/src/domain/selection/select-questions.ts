import type { QuestionBankRecord } from "../config/types";

export interface SelectionProfile {
  readonly industry: string;
  readonly company_location: string;
  readonly target_market_region: readonly string[];
  readonly employee_band: string;
}
const aliases: Readonly<Record<string, string>> = {
  all: "any", "all smes": "any", universal: "any", always: "any", northamerica: "north america",
  manufacturing: "manufacturing (industrial / components)",
  "food and agro-processing": "food & agro-processing",
  "consumer goods": "consumer goods (apparel / fmcg)",
  "construction and materials": "construction / materials",
  "business and export services": "business / export services",
};
export function normalize(value: string): string { return value.toLowerCase().trim().replace(/\s+/g, " "); }
export function canonicalToken(value: string): string { const key = normalize(value); return aliases[key] ?? key; }
function tokens(value: string): string[] { return value.split(/[;,]/).map(canonicalToken).filter(Boolean); }
function rank(band: string): number | null {
  const key = normalize(band).replace(/[–—]/g, "-").replace(/\s*-\s*/g, "-").replace(/,/g, "");
  return ({ "1-10": 1, "11-50": 2, "51-250": 3, "251-500": 4, "501-1000": 5, "1001+": 6 } as Record<string, number>)[key] ?? null;
}
// Preserved Select Questions node, n8n-question-selection-final-2026-10-02.json.
// Both trigger dimensions and size apply; buyer/goal do not select questions.
export type SelectionQuestion = Pick<QuestionBankRecord, "question_id" | "active" | "industry_trigger" | "market_trigger" | "size_applicability" | "priority">;
export function selectQuestions<T extends SelectionQuestion>(rows: readonly T[], profile: SelectionProfile): T[] {
  const industry = canonicalToken(profile.industry);
  const markets = [...profile.target_market_region.map(canonicalToken), canonicalToken(profile.company_location)].filter(Boolean);
  const size = rank(profile.employee_band);
  return rows.filter(row => {
    if (!["true", "yes", "1", "active"].includes(normalize(row.active))) return false;
    const industries = tokens(row.industry_trigger || "ANY");
    const regions = tokens(row.market_trigger || "ANY");
    const applicability = normalize(row.size_applicability || "all");
    const sizeMatches = applicability === "medium_plus" ? size !== null && size >= 3 : applicability === "large" ? size !== null && size >= 5 : true;
    return (industries.includes("any") || industries.includes(industry)) &&
      (regions.includes("any") || regions.some(region => markets.includes(region))) && sizeMatches;
  }).sort((a, b) => Number(a.priority) - Number(b.priority)); // Stable source order breaks ties, as in v1.
}
