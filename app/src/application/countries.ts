import { z } from "zod";
import data from "../../config/countries.json" with { type: "json" };
export const countries = data.countries;
export function listedCountry(value?: string) {
  return countries.find(country => country.name.toLowerCase() === value?.trim().toLowerCase());
}
// Session storage keeps legacy free text; new submissions use this shared list.
export const countrySchema = z.string().trim().max(200).refine(value => !value || Boolean(listedCountry(value)), "Choose a country from the list, or clear the optional field.").transform(value => listedCountry(value)?.name ?? value).optional();
