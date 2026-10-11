import type { CanonicalConfig, MetricBenchmarksRecord, QuestionBankRecord } from "../config/types";
import { selectQuestions, type SelectionProfile } from "../selection/select-questions";

export interface ScoringProfile extends SelectionProfile { readonly target_buyer: string; readonly business_goal: string }
export const METHOD_VERSION = "v1-formulas-full-precision-v2.1";
// AssessmentScoring.getMultiplier in the preserved Appsmith export; not inferred from rule values.
export const FINAL_MULTIPLIER_CAP = 1.5;
export const CATEGORIES = ["People", "Governance", "Community", "Resources"] as const;
export type Category = typeof CATEGORIES[number];
export class ScoringError extends Error {}
const text = (value: string) => value.trim().toLowerCase();
const active = (value: string) => ["", "true", "yes", "1"].includes(text(value));
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
function finite(value: number, context: string): number {
  if (!Number.isFinite(value)) throw new ScoringError(context + ": non-finite calculation");
  return value;
}
function decimal(value: string, context: string): number {
  if (!value.trim()) throw new ScoringError(context + ": missing numeric configuration");
  return finite(Number(value), context);
}
export function resolveBenchmark(config: CanonicalConfig, question: QuestionBankRecord, industry: string): MetricBenchmarksRecord {
  const rows = config.MetricBenchmarks.filter(row => row.metric_id === question.metric_id && active(row.active));
  const metric = rows.find(row => text(row.benchmark_group_type) === "industry" && text(row.benchmark_group_value) === text(industry))
    ?? rows.find(row => text(row.benchmark_group_type) === "global" || ["all", "none", ""].includes(text(row.benchmark_group_value)))
    ?? rows[0]; // Explicit final fallback in preserved v1; source order is significant.
  if (!metric) throw new ScoringError(question.question_id + ": no active benchmark");
  return metric;
}
export function normalizeAnswer(config: CanonicalConfig, question: QuestionBankRecord, raw: string, industry: string) {
  if (!raw.trim()) return null;
  if (["boolean", "categorical"].includes(question.response_type)) {
    const scale = config.AnswerScales.find(row => row.answer_scale_id.trim() === question.answer_scale_id.trim() && text(row.answer_option) === text(raw) && active(row.active));
    if (!scale) throw new ScoringError(question.question_id + ": invalid answer option");
    return { value: decimal(scale.normalized_score, question.question_id), method: "answer_scale", benchmark: null, scale };
  }
  if (!["numeric", "percent"].includes(question.response_type)) throw new ScoringError(question.question_id + ": unsupported response type");
  if (!/^\d+(\.\d+)?$/.test(raw.trim())) throw new ScoringError(question.question_id + ": enter a non-negative decimal");
  const x = finite(Number(raw), question.question_id);
  if (question.response_type === "percent" && x > 100) throw new ScoringError(question.question_id + ": percentage must be between 0 and 100");
  const metric = resolveBenchmark(config, question, industry);
  // Empty optional parameters have v1's Number("") = 0 semantics. Required
  // denominators are checked explicitly; malformed decimals never become defaults.
  const p1 = metric.param_1 === "" ? 0 : decimal(metric.param_1, "param_1");
  const p2 = metric.param_2 === "" ? 0 : decimal(metric.param_2, "param_2");
  const p3 = metric.param_3 === "" ? 0 : decimal(metric.param_3, "param_3");
  const max = decimal(metric.max_value, "max_value");
  const safeMax = max !== 0 ? max : 100;
  const nonzero = (n: number) => { if (n === 0) throw new ScoringError(question.question_id + ": zero benchmark denominator"); return n; };
  let value: number;
  switch (text(metric.normalization_method)) {
    case "identity_percent": value = clamp(x, 0, safeMax); break;
    case "identity_boolean": value = x; break;
    case "gaussian": value = Math.exp(-0.5 * ((x - p1) / nonzero(p2)) ** 2) * safeMax; break;
    case "linear_cap": value = Math.min(x / nonzero(p1), 1) * safeMax; break;
    case "inverse_count": value = 1 / (1 + x) * safeMax; break;
    case "inverse_percentage": value = clamp(1 - clamp(x, 0, 100) / 100, 0, 1) * 100; break;
    case "benchmark_inverse_ratio": value = 1 / (1 + x / nonzero(p1)) * safeMax; break;
    case "exponential_decay": {
      const percent = question.response_type === "percent" || text(metric.unit).includes("percent");
      const adjusted = percent ? x / 100 : x;
      const threshold = p1 > 1 && percent ? p1 / 100 : p1;
      value = clamp(adjusted <= threshold ? 1 : Math.exp(-(p2 || 10) * (adjusted - threshold)), 0, 1) * safeMax;
      break;
    }
    case "inverse_linear_cap": value = clamp(1 - Math.min(x / nonzero(p2 || max || p1), 1), 0, 1) * safeMax; break;
    case "banded": value = x <= p1 ? 100 : x <= p2 ? 75 : x <= p3 ? 50 : 0; break;
    default: throw new ScoringError(question.question_id + ": unsupported normalization method");
  }
  return { value: finite(value, question.question_id), method: metric.normalization_method, benchmark: metric, scale: null };
}
export function resolveMultiplier(config: CanonicalConfig, question: QuestionBankRecord, profile: ScoringProfile) {
  const tags = question.tags.split(/[;,]/).map(text).filter(Boolean);
  const exact = (rule: string, value: string) => !text(rule) || text(rule) === "any" || text(rule) === text(value);
  const contains = (rule: string, value: string) => !text(rule) || text(rule) === "any" || text(value).includes(text(rule));
  const rules = config.MultiplierRules.filter(rule => {
    const ruleTags = rule.tag.split(/[;,]/).map(text).filter(Boolean);
    return ["true", "yes", "1"].includes(text(rule.active)) &&
      (!ruleTags.length || ruleTags.includes("any") || ruleTags.some(tag => tags.includes(tag))) &&
      exact(rule.category, question.category) && exact(rule.subcategory, question.subcategory) && exact(rule.industry, profile.industry) &&
      contains(rule.target_market_region, profile.target_market_region.join(", ")) && contains(rule.target_buyer, profile.target_buyer) && contains(rule.business_goal, profile.business_goal);
  });
  const product = rules.reduce((value, rule) => finite(value * decimal(rule.multiplier, rule.rule_id), rule.rule_id), 1);
  return { value: Math.min(product, FINAL_MULTIPLIER_CAP), product, cap: FINAL_MULTIPLIER_CAP, rules };
}
export function scoreAssessment(config: CanonicalConfig, profile: ScoringProfile, answers: Readonly<Record<string, string>>) {
  const selected = selectQuestions(config.QuestionBank, profile);
  if (!selected.length) throw new ScoringError("No questions match this context");
  const ids = new Set(selected.map(q => q.question_id));
  for (const id of Object.keys(answers)) if (!ids.has(id)) throw new ScoringError("Answer outside selected questionnaire: " + id);
  const weights = config.CategoryWeights.find(row => row.industry.trim() === profile.industry.trim());
  if (!weights) throw new ScoringError("No category weights for this industry");
  const weightMap = { People: decimal(weights.people_weight, "People weight"), Governance: decimal(weights.governance_weight, "Governance weight"), Community: decimal(weights.community_weight, "Community weight"), Resources: decimal(weights.resources_weight, "Resources weight") };
  const questions = selected.map(question => {
    const rawAnswer = answers[question.question_id] ?? "";
    const normalization = normalizeAnswer(config, question, rawAnswer, profile.industry);
    const base = { id: question.question_id, category: question.category, rawAnswer };
    if (!normalization) return { ...base, status: "missing" as const };
    if (!CATEGORIES.includes(question.category as Category)) throw new ScoringError(question.question_id + ": unsupported category");
    const baseWeight = decimal(question.base_weight, question.question_id);
    const multiplier = resolveMultiplier(config, question, profile);
    const weighted = finite(normalization.value * baseWeight, question.question_id);
    const earned = finite(weighted * multiplier.value, question.question_id);
    const possible = finite(100 * baseWeight * multiplier.value, question.question_id);
    return { ...base, status: "scored" as const, normalization, baseWeight, multiplier, weighted, earned, possible };
  });
  const categories = CATEGORIES.map(category => {
    const rows = questions.filter(q => q.category === category && q.status === "scored");
    const earned = finite(rows.reduce((sum, q) => sum + (q.status === "scored" ? q.earned : 0), 0), category);
    const possible = finite(rows.reduce((sum, q) => sum + (q.status === "scored" ? q.possible : 0), 0), category);
    const percent = possible > 0 ? earned / possible * 100 : null;
    return { category, answered: rows.length, earned, possible, percent, weight: weightMap[category], contribution: percent === null ? null : percent * weightMap[category] };
  });
  const earned = finite(categories.reduce((sum, c) => sum + c.earned, 0), "overall");
  const possible = finite(categories.reduce((sum, c) => sum + c.possible, 0), "overall");
  const answered = questions.filter(q => q.status === "scored").length;
  // Missing categories retain null percentages/contributions. As in v1, the
  // sum contains only observed categories; weights are never redistributed.
  const weightedOverall = possible > 0 ? finite(categories.reduce((sum, c) => sum + (c.contribution ?? 0), 0), "weighted overall") : null;
  return { configVersion: config.version, methodVersion: METHOD_VERSION, questions, categories, answered, missing: selected.length - answered,
    earned, possible, rawOverall: possible > 0 ? earned / possible * 100 : null, weightedOverall };
}
export type AssessmentScore = ReturnType<typeof scoreAssessment>;
