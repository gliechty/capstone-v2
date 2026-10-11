import { z } from "zod";
import { setupConfig } from "./assessment-setup";
import type { CanonicalConfig } from "../domain/config/types";
import { scoreAssessment, ScoringError } from "../domain/scoring/score-assessment";
const option = (key: keyof typeof setupConfig.options) => z.string().refine(value => setupConfig.options[key].some(row => row.value === value), "Choose a configured option");
export const scoreRequestSchema = z.strictObject({
  configVersion: z.string().max(200),
  context: z.strictObject({ industry: option("industry"), companySize: option("companySize"), location: option("location"),
    targetMarkets: z.array(option("targetMarket")).min(1).max(2).refine(values => new Set(values).size === values.length),
    targetBuyer: option("targetBuyer"), businessGoal: option("businessGoal") }),
  answers: z.record(z.string().min(1).max(100), z.string().max(2000)).refine(answers => Object.keys(answers).length <= 1000),
});
export function computeAssessment(config: CanonicalConfig, input: unknown) {
  const request = scoreRequestSchema.parse(input);
  if (request.configVersion !== config.version + "/" + setupConfig.version) throw new ScoringError("Configuration version changed. Return to assessment to review your session.");
  const c = request.context;
  return scoreAssessment(config, { industry: c.industry, employee_band: c.companySize, company_location: c.location,
    target_market_region: c.targetMarkets, target_buyer: c.targetBuyer, business_goal: c.businessGoal }, request.answers);
}
