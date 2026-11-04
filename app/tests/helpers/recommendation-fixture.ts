import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { assessmentCatalog } from "../../src/application/assessment-catalog";
import { computeAssessment } from "../../src/application/score-request";
import { recommendationPolicy } from "../../src/application/recommendations/policy";
import { prepareEvidence, scoreClosing } from "../../src/application/recommendations/prepare";
import type { RecommendationContent, RecommendationRequest, RecommendationProvider } from "../../src/application/recommendations/contracts";
export const { config } = loadCanonicalConfig();
export const input: RecommendationRequest = {
  configVersion: assessmentCatalog(config).version, companyName: "Local test SME", notes: "", subindustry: "Industrial components",
  context: { industry: "Manufacturing (Industrial / Components)", companySize: "251 - 500", location: "APAC", targetMarkets: ["EU"], targetBuyer: "Enterprise", businessGoal: "Investor readiness" },
  answers: { "U-001": "No", "U-002": "Yes" },
};
export const score = computeAssessment(config, { configVersion: input.configVersion, context: input.context, answers: input.answers });
export const evidence = prepareEvidence(config, input, recommendationPolicy);
// Deliberately synthetic test-only content, never imported by src or an endpoint.
export function validTestContent(): RecommendationContent {
  const category = score.categories.filter(c => c.percent !== null).sort((a, b) => a.percent! - b.percent!)[0]!.category;
  return {
    executive_summary: `${input.context.industry} has an observed strength. For employee band ${input.context.companySize}, improve the observed gap for ${input.context.businessGoal}. ${scoreClosing(score)}`,
    priority_recommendations: [{ priority_rank: 1, title: "Review the observed practice", why_it_matters: "This suggests a practical improvement for the reported answers.", recommended_action: "Review the reported practice with the responsible manager.",
      evidence: [evidence.citations[0]!], related_categories: [category], implementation_difficulty: "Low" }],
    key_gaps: [{ category, gap: "An answered practice needs improvement.", evidence: [evidence.citations[0]!] }],
    grounding_notes: "Test-only content. Preserved source excerpts and page references are not independently verified.",
  };
}
export const testProvider = (generate: RecommendationProvider["generate"]): RecommendationProvider => ({ id: "controlled-test-double", model: "no-model", kind: "test-double", generate });

// Existing provider double, exposed through browser transport for report download checks.
export async function mockSuccessfulRecommendations(page: import("@playwright/test").Page) {
 const {createHash}=await import("node:crypto");
 const {inputIdentityText}=await import("../../src/application/recommendations/identity");
 const settings={provider:"openai",model:"gpt-5.4-mini",reasoning:"low",timeoutMs:30000,maxOutputTokens:4000};
 const configuration={ready:true,code:"ready",settings,fingerprint:"report-browser-double",configVersion:config.version,sessionVersion:input.configVersion,methodVersion:score.methodVersion,promptVersion:"test-prompt",policyVersion:"test-policy"};
 await page.route("**/api/assessment-recommendations",async route=>{
  if(route.request().method()==="GET")return route.fulfill({json:configuration});
  return route.fulfill({json:{status:"available",configuration,content:validTestContent(),evidence:{limitations:["Controlled test transport only"]},identity:{inputId:createHash("sha256").update(inputIdentityText(route.request().postDataJSON())).digest("hex"),configVersion:config.version,methodVersion:score.methodVersion,promptVersion:configuration.promptVersion,policyVersion:configuration.policyVersion,provider:{id:settings.provider,model:settings.model,settings}}}});
 });
}
