import { marketValues } from "../assessment-setup";
import { recommendationRequestSchema } from "./contracts";
// Pure projection for the future recommendation caller. No request is sent here.
// Notes are recommendation metadata, never part of scoring/selection context.
export function recommendationRequestFromSession(session: {
  configVersion: string; answers: Record<string, string>;
  profile: { companyName: string; subindustry: string; notes?: string; industry: string;
    companySize: string; location: string; targetMarket: string; targetBuyer: string; businessGoal: string };
}) {
  const p = session.profile;
  return recommendationRequestSchema.parse({
    configVersion: session.configVersion, answers: session.answers,
    companyName: p.companyName, subindustry: p.subindustry, notes: p.notes,
    context: { industry: p.industry, companySize: p.companySize, location: p.location,
      targetMarkets: marketValues(p.targetMarket), targetBuyer: p.targetBuyer, businessGoal: p.businessGoal },
  });
}
