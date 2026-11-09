import { expect, test } from "vitest";
import mapping from "../../config/geography/country-regions-v1.json";
import source from "../../config/geography/un-m49-2026-11-09.json";
import { countries } from "../../src/application/countries";
import { setupConfig } from "../../src/application/assessment-setup";
import { suggestedRegion } from "../../src/application/country-regions";
import { createAssessmentModel } from "../../src/features/assessment/model";

test("local suggestions contain only owner-approved UN geographic translations and existing region values", () => {
  const approved: Record<string, string> = {};
  for (const row of source.rows) {
    const value = row.countryCode === "GB" ? "UK" : row.region === "Africa" ? "Africa" : row.subregion === "Northern America" ? "North America"
      : row.subregion === "Latin America and the Caribbean" ? "LATAM" : ["Eastern Asia", "South-eastern Asia"].includes(row.subregion) ? "APAC"
      : row.subregion === "Southern Asia" && row.countryCode !== "IR" ? "South Asia" : row.region === "Oceania" ? "Oceania" : undefined;
    if (value) approved[row.countryCode] = value;
  }
  expect(mapping.byCountryCode).toEqual(approved);
  for (const [code, region] of Object.entries(mapping.byCountryCode)) {
    expect(countries.some(country => country.code === code)).toBe(true);
    expect(setupConfig.options.location.some(option => option.value === region)).toBe(true);
  }
  expect(suggestedRegion("China")).toBe("APAC");
  expect(suggestedRegion("United Kingdom")).toBe("UK");
  expect(suggestedRegion("Australia")).toBe("Oceania");
  for (const country of ["France", "Iran", "Taiwan", "", "not a country"]) expect(suggestedRegion(country)).toBeUndefined();
});

test("country changes replace stale region atomically; manual overrides and existing saved metadata remain supported", () => {
  const model = createAssessmentModel("context-test", () => []);
  let state = model.initialSession();
  state = { ...state, profile: { ...state.profile, country: "China", location: "UK", targetMarket: "EU;UK" }, answers: { "U-001": "Yes" } };
  expect(model.sessionSchema.parse(state).profile.location).toBe("UK"); // No migration of stored metadata.
  state = model.assessmentReducer(state, { type: "profile", field: "country", value: "Australia" });
  expect(state.profile.location).toBe("Oceania");
  state = model.assessmentReducer(state, { type: "profile", field: "location", value: "APAC" });
  expect(model.sessionSchema.parse(state).profile.location).toBe("APAC");
  for (const country of ["France", ""]) {
    state = model.assessmentReducer(state, { type: "profile", field: "country", value: country });
    expect(state.profile.location).toBe("");
  }
  expect(state.profile.targetMarket).toBe("EU;UK");
  expect(state.answers).toEqual({ "U-001": "Yes" });
});
