import mapping from "../../config/geography/country-regions-v1.json" with { type: "json" };
import { listedCountry } from "./countries";

// Only explicit source-documented mappings suggest a region; unsupported countries stay manual.
export function suggestedRegion(country?: string): string | undefined {
  const code = listedCountry(country)?.code;
  return code ? (mapping.byCountryCode as Record<string, string>)[code] : undefined;
}
