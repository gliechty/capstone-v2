import { setupConfig, marketValues, type SetupOptions } from "./assessment-setup";
import type { CanonicalConfig } from "../domain/config/types";
import { selectQuestions, type SelectionQuestion } from "../domain/selection/select-questions";

export type Question = {
  id: string; title: string; category: string; hint: string; unit?: string;
} & ({ kind: "boolean" | "categorical"; options: readonly string[] } | { kind: "numeric" | "percent" | "text" });
export interface AssessmentCatalog {
  version: string;
  industries: readonly string[];
  regions: readonly string[];
  setupOptions: SetupOptions;
  questions: readonly (Question & SelectionQuestion)[];
}
export interface SetupContext { industry: string; companySize: string; location: string; targetMarket: string }
export function selectedQuestions(catalog: AssessmentCatalog, profile: SetupContext): readonly Question[] {
  return selectQuestions(catalog.questions, { industry: profile.industry, employee_band: profile.companySize,
    company_location: profile.location, target_market_region: marketValues(profile.targetMarket) });
}
// Only selection and presentation data crosses to the browser. No benchmarks,
// weights, document content, model configuration or scoring calculations.
export function assessmentCatalog(config: CanonicalConfig): AssessmentCatalog {
  const regions = setupConfig.options.location.map(option => option.value);
  const questions = config.QuestionBank.filter(q => q.active === "TRUE").map((q): Question & SelectionQuestion => {
    const shared = { id: q.question_id, question_id: q.question_id, title: q.question_text, category: q.category,
      active: q.active, industry_trigger: q.industry_trigger, market_trigger: q.market_trigger, size_applicability: q.size_applicability, priority: q.priority,
      hint: "Answer for your business, or skip if unknown. Blank answers remain unanswered." };
    if (q.response_type === "boolean" || q.response_type === "categorical") {
      return { ...shared, kind: q.response_type, options: config.AnswerScales.filter(s => s.answer_scale_id === q.answer_scale_id && s.active === "TRUE").sort((a,b) => Number(a.display_order) - Number(b.display_order)).map(s => s.answer_option) };
    }
    if (!["numeric", "percent", "text"].includes(q.response_type)) throw new Error("Unsupported response type: " + q.question_id);
    // Unit metadata only, not benchmark selection or evaluation. Conflicting units fail visibly.
    const units = [...new Set(config.MetricBenchmarks.filter(m => m.metric_id === q.metric_id).map(m => m.unit))];
    if (units.length > 1) throw new Error("Conflicting metric units: " + q.question_id);
    return { ...shared, kind: q.response_type as "numeric" | "percent" | "text", unit: q.response_type === "percent" ? "%" : units[0] };
  });
  return { version: config.version + "/" + setupConfig.version, industries: setupConfig.options.industry.map(option => option.value), regions, setupOptions: setupConfig.options, questions };
}
