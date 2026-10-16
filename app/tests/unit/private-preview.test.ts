import { afterEach, describe, expect, it, vi } from "vitest";
import { previewEnabled, previewReserved } from "../../src/adapters/preview-mode";
import { readProviderConfiguration } from "../../src/adapters/recommendations/configuration";
import { syntheticContent, syntheticSession } from "../../src/features/preview/fixtures";
import { recommendationContentSchema } from "../../src/application/recommendations/contracts";
import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { assessmentCatalog, selectedQuestions } from "../../src/application/assessment-catalog";
import { createAssessmentModel } from "../../src/features/assessment/model";
import { catalogProfileErrors } from "../../src/features/assessment/assessment-context";
import { computeAssessment } from "../../src/application/score-request";
import { recommendationRequestFromSession } from "../../src/application/recommendations/request";
afterEach(()=>vi.unstubAllEnvs());
describe("private preview separation",()=>{
 it("requires both build capability and runtime opt-in",()=>{vi.stubEnv("CAPSTONE_PREVIEW_BUILD","0");expect(previewEnabled({CAPSTONE_PREVIEW_MODE:"synthetic"})).toBe(false);vi.stubEnv("CAPSTONE_PREVIEW_BUILD","1");expect(previewEnabled({})).toBe(false);expect(previewEnabled({CAPSTONE_PREVIEW_MODE:"synthetic"})).toBe(true);});
 it.each(["synthetic","invalid"])("runtime %s cannot fall back to paid provider even with credentials",mode=>{vi.stubEnv("CAPSTONE_PREVIEW_BUILD","0");const result=readProviderConfiguration({CAPSTONE_PREVIEW_MODE:mode,RECOMMENDATION_PROVIDER:"openai",RECOMMENDATION_MODEL:"gpt-5.4-mini",OPENAI_API_KEY:"not-a-real-key"});expect(result.status.ready).toBe(false);expect(result.apiKey).toBeNull();expect(result.status.code).toBe("private_preview_disabled");});
 it("preview build cannot call provider with runtime opt-in absent",()=>{vi.stubEnv("CAPSTONE_PREVIEW_BUILD","1");expect(previewReserved({})).toBe(true);expect(readProviderConfiguration({RECOMMENDATION_PROVIDER:"openai",RECOMMENDATION_MODEL:"gpt-5.4-mini",OPENAI_API_KEY:"not-a-real-key"}).apiKey).toBeNull();});
 it("fixtures remain labeled and scores use unchanged engine",()=>{expect(recommendationContentSchema.safeParse(syntheticContent).success).toBe(true);expect(syntheticContent.executive_summary).toContain("Synthetic");const config=loadCanonicalConfig().config,catalog=assessmentCatalog(config);const model=createAssessmentModel(catalog.version,p=>selectedQuestions(catalog,p),p=>catalogProfileErrors(catalog,p));const state=model.sessionSchema.parse(syntheticSession(catalog.version));const input=recommendationRequestFromSession(state);const score=computeAssessment(config,{configVersion:input.configVersion,context:input.context,answers:input.answers});expect(score.rawOverall).toBeCloseTo(50.95298602287166,10);expect(score.weightedOverall).toBeCloseTo(12.06566709021601,10);});
});
