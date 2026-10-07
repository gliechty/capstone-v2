import { z } from "zod";
import type { CanonicalConfig } from "../../domain/config/types";

const decimal = z.string().regex(/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?$/).refine((v) => Number.isFinite(Number(v)), "Finite decimal required");
const optionalDecimal = z.union([z.literal(""), decimal]);
const flag = z.enum(["TRUE", "FALSE"]);
export const QuestionBankSchema = z.strictObject({
  question_id: z.string().min(1),
  question_text: z.string().min(1),
  question_type: z.string(),
  industry_trigger: z.string(),
  market_trigger: z.string(),
  size_applicability: z.enum(["all", "all smes", "medium_plus", "large"]),
  framework_source: z.string(),
  base_weight: decimal,
  priority: decimal,
  active: flag,
  tags: z.string(),
  category: z.enum(["People", "Governance", "Community", "Resources"]),
  subcategory: z.string(),
  answer_scale_id: z.string().min(1),
  response_type: z.enum(["boolean", "categorical", "numeric", "percent", "text"]),
  metric_id: z.string(),
  rationale: z.string(),
  cluster_id: z.string(),
  weighting_basis: z.string(),
  question_origin: z.string(),
  cluster_progression_level: z.string(),
  cluster_total_count: optionalDecimal,
  source_repetition_count: optionalDecimal,
  global_frequency_percent: optionalDecimal,
  base_weight_score: z.string(),
});
export const AnswerScalesSchema = z.strictObject({
  answer_scale_id: z.string().min(1),
  answer_option: z.string().min(1),
  raw_value: decimal,
  normalized_score: decimal,
  display_order: decimal,
  active: flag,
});
export const MetricBenchmarksSchema = z.strictObject({
  metric_id: z.string().min(1),
  metric_name: z.string().min(1),
  benchmark_group_type: z.enum(["global", "industry"]),
  benchmark_group_value: z.string(),
  unit: z.string(),
  normalization_method: z.enum(["banded", "benchmark_inverse_ratio", "exponential_decay", "gaussian", "identity_boolean", "identity_percent", "inverse_count", "inverse_linear_cap", "inverse_percentage", "linear_cap"]),
  param_1: optionalDecimal,
  param_2: optionalDecimal,
  param_3: optionalDecimal,
  min_value: decimal,
  max_value: decimal,
  direction: z.enum(["higher_better", "lower_better", "neutral", "reported_better"]),
  notes: z.string(),
  active: flag,
});
export const MultiplierRulesSchema = z.strictObject({
  rule_id: z.string().min(1),
  active: flag,
  tag: z.string(),
  category: z.string(),
  subcategory: z.string(),
  industry: z.string(),
  target_market_region: z.string(),
  target_buyer: z.string(),
  business_goal: z.string(),
  multiplier: decimal,
  rationale: z.string(),
  source: z.string(),
});
export const CategoryWeightsSchema = z.strictObject({
  industry: z.string(),
  people_weight: decimal,
  governance_weight: decimal,
  community_weight: decimal,
  resources_weight: decimal,
  notes: z.string(),
});
export const DocumentIndexSchema = z.strictObject({
  doc_id: z.string().min(1),
  doc_title: z.string().min(1),
  doc_type: z.string(),
  source: z.string(),
  category: z.string(),
  industry: z.string(),
  region: z.string(),
  buyer_type: z.string(),
  topic_tags: z.string(),
  priority: z.string().min(1),
  summary: z.string(),
  active: flag,
  status: z.string(),
  link: z.string(),
  legacy_doc_id: z.string().min(1),
});
export const DocumentChunksSchema = z.strictObject({
  doc_title: z.string().min(1),
  chunk_text: z.string().min(1),
  source_section_or_page: z.string(),
  summary: z.string(),
  evidence_type: z.string(),
  category: z.string(),
  subcategory: z.string(),
  tags: z.string(),
  industry_scope: z.string(),
  buyer_scope: z.string(),
  region_scope: z.string(),
  strength: z.string(),
  citation_label: z.string(),
  chunk_record_id: z.string().min(1),
  legacy_chunk_id: z.string().min(1),
  doc_id: z.string().min(1),
  legacy_doc_title: z.string().min(1),
});

export const entitySchemas = { QuestionBank: z.array(QuestionBankSchema).min(1), AnswerScales: z.array(AnswerScalesSchema).min(1), MetricBenchmarks: z.array(MetricBenchmarksSchema).min(1), MultiplierRules: z.array(MultiplierRulesSchema).min(1), CategoryWeights: z.array(CategoryWeightsSchema).min(1), DocumentIndex: z.array(DocumentIndexSchema).min(1), DocumentChunks: z.array(DocumentChunksSchema).min(1) };
export type EntityName = keyof typeof entitySchemas;

// Semantic integrity is checked after shape validation; no repair/defaulting occurs here.
export function validateRelations(config: CanonicalConfig): string[] {
  const diagnostics: string[] = [];
  function unique(entity: string, keys: readonly string[]) {
    const seen = new Set<string>();
    for (const key of keys) { if (seen.has(key)) throw new Error(entity + ": duplicate identity " + key); seen.add(key); }
  }
  unique("QuestionBank", config.QuestionBank.map(r => r.question_id));
  unique("AnswerScales", config.AnswerScales.map(r => JSON.stringify([r.answer_scale_id, r.answer_option])));
  unique("MetricBenchmarks", config.MetricBenchmarks.map(r => JSON.stringify([r.metric_id, r.benchmark_group_type, r.benchmark_group_value])));
  unique("MultiplierRules", config.MultiplierRules.map(r => r.rule_id));
  unique("CategoryWeights", config.CategoryWeights.map(r => r.industry));
  unique("DocumentIndex", config.DocumentIndex.map(r => r.doc_id));
  unique("DocumentIndex legacy identity", config.DocumentIndex.map(r => r.legacy_doc_id));
  unique("DocumentChunks", config.DocumentChunks.map(r => r.chunk_record_id));
  unique("DocumentChunks legacy lineage", config.DocumentChunks.map(r => JSON.stringify([r.doc_id, r.legacy_chunk_id])));
  const documents = new Map(config.DocumentIndex.map(r => [r.doc_id, r]));
  for (const r of config.DocumentChunks) {
    const doc = documents.get(r.doc_id);
    if (!doc || r.doc_title !== doc.doc_title) throw new Error("DocumentChunks: broken document reference " + r.chunk_record_id);
    if (r.chunk_record_id !== r.doc_id + ":" + r.legacy_chunk_id) throw new Error("DocumentChunks: inconsistent lineage " + r.chunk_record_id);
  }
  for (const q of config.QuestionBank) {
    const missingScale = ["categorical", "boolean"].includes(q.response_type) && !config.AnswerScales.some(s => s.answer_scale_id === q.answer_scale_id && s.active === "TRUE");
    const missingMetric = q.metric_id !== "" && !config.MetricBenchmarks.some(m => m.metric_id === q.metric_id);
    if (missingScale || missingMetric) {
      const detail = "QuestionBank " + q.question_id + ": missing " + (missingScale ? "answer scale" : "metric") + " reference";
      if (q.active === "TRUE") throw new Error(detail);
      diagnostics.push(detail + " (inactive; retained source record)");
    }
  }
  return diagnostics;
}
