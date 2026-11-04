import { z } from "zod";
import { recommendationContentSchema } from "../application/recommendations/contracts";
import type { RecommendationView } from "../application/recommendations/controller";
import type { SessionStoragePort } from "./assessment-session";
export const RECOMMENDATION_RESULT_KEY = "mosaic.recommendations.success.v1";
const savedSchema = z.object({
 configuration: z.object({ fingerprint:z.string(),configVersion:z.string(),sessionVersion:z.string(),methodVersion:z.string(),promptVersion:z.string(),policyVersion:z.string() }).passthrough(),
 result:z.object({status:z.literal("available"),content:recommendationContentSchema,
  identity:z.object({inputId:z.string().regex(/^[a-f0-9]{64}$/),configVersion:z.string(),methodVersion:z.string(),promptVersion:z.string(),policyVersion:z.string(),provider:z.object({id:z.string(),model:z.string(),settings:z.object({reasoning:z.string(),timeoutMs:z.number(),maxOutputTokens:z.number()}).passthrough()})}),
  evidence:z.object({limitations:z.array(z.string())}).passthrough(),
 }).passthrough(),
});
// Same tab and origin as the assessment. Never recover a receipt as successful output.
export function recommendationStorage(storage: SessionStoragePort) {
 return {
  load(): Pick<RecommendationView,"result"|"configuration"> | null {
   try {const raw=storage.getItem(RECOMMENDATION_RESULT_KEY);if(!raw || raw.length>600000)return null;
    const parsed=savedSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data as unknown as Pick<RecommendationView,"result"|"configuration"> : null;
   } catch{return null;}
  },
  save(value: Pick<RecommendationView,"result"|"configuration"> | null) {
   try {const raw=value?JSON.stringify(value):"";if(raw.length>600000)return false;storage.setItem(RECOMMENDATION_RESULT_KEY,raw);return true;} catch{return false;}
  },
 };
}
