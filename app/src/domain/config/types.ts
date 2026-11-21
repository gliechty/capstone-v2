// Lossless canonical records: decimal lexemes remain strings until an authorized calculation boundary.
export interface QuestionBankRecord {
  readonly question_id: string;
  readonly question_text: string;
  readonly question_type: string;
  readonly industry_trigger: string;
  readonly market_trigger: string;
  readonly size_applicability: string;
  readonly framework_source: string;
  readonly base_weight: string;
  readonly priority: string;
  readonly active: string;
  readonly tags: string;
  readonly category: string;
  readonly subcategory: string;
  readonly answer_scale_id: string;
  readonly response_type: string;
  readonly metric_id: string;
  readonly rationale: string;
  readonly cluster_id: string;
  readonly weighting_basis: string;
  readonly question_origin: string;
  readonly cluster_progression_level: string;
  readonly cluster_total_count: string;
  readonly source_repetition_count: string;
  readonly global_frequency_percent: string;
  readonly base_weight_score: string;
}
export interface AnswerScalesRecord {
  readonly answer_scale_id: string;
  readonly answer_option: string;
  readonly raw_value: string;
  readonly normalized_score: string;
  readonly display_order: string;
  readonly active: string;
}
export interface MetricBenchmarksRecord {
  readonly formula_parameters?: string;
  readonly metric_id: string;
  readonly metric_name: string;
  readonly benchmark_group_type: string;
  readonly benchmark_group_value: string;
  readonly unit: string;
  readonly normalization_method: string;
  readonly param_1: string;
  readonly param_2: string;
  readonly param_3: string;
  readonly min_value: string;
  readonly max_value: string;
  readonly direction: string;
  readonly notes: string;
  readonly active: string;
}
export interface MultiplierRulesRecord {
  readonly rule_id: string;
  readonly active: string;
  readonly tag: string;
  readonly category: string;
  readonly subcategory: string;
  readonly industry: string;
  readonly target_market_region: string;
  readonly target_buyer: string;
  readonly business_goal: string;
  readonly multiplier: string;
  readonly rationale: string;
  readonly source: string;
}
export interface CategoryWeightsRecord {
  readonly industry: string;
  readonly people_weight: string;
  readonly governance_weight: string;
  readonly community_weight: string;
  readonly resources_weight: string;
  readonly notes: string;
}
export interface DocumentIndexRecord {
  readonly doc_id: string;
  readonly doc_title: string;
  readonly doc_type: string;
  readonly source: string;
  readonly category: string;
  readonly industry: string;
  readonly region: string;
  readonly buyer_type: string;
  readonly topic_tags: string;
  readonly priority: string;
  readonly summary: string;
  readonly active: string;
  readonly status: string;
  readonly link: string;
  readonly legacy_doc_id: string;
}
export interface DocumentChunksRecord {
  readonly doc_title: string;
  readonly chunk_text: string;
  readonly source_section_or_page: string;
  readonly summary: string;
  readonly evidence_type: string;
  readonly category: string;
  readonly subcategory: string;
  readonly tags: string;
  readonly industry_scope: string;
  readonly buyer_scope: string;
  readonly region_scope: string;
  readonly strength: string;
  readonly citation_label: string;
  readonly chunk_record_id: string;
  readonly legacy_chunk_id: string;
  readonly doc_id: string;
  readonly legacy_doc_title: string;
}
export interface ScoringFormulaRecord {
 readonly formula_id:string; readonly name:string; readonly expression:string;
 readonly parameters:string; readonly explanation:string; readonly examples:string;
}
export interface CanonicalConfig {
  readonly ScoringFormulas?: readonly ScoringFormulaRecord[];
  readonly version: string;
  readonly regions: readonly string[];
  readonly QuestionBank: readonly QuestionBankRecord[];
  readonly AnswerScales: readonly AnswerScalesRecord[];
  readonly MetricBenchmarks: readonly MetricBenchmarksRecord[];
  readonly MultiplierRules: readonly MultiplierRulesRecord[];
  readonly CategoryWeights: readonly CategoryWeightsRecord[];
  readonly DocumentIndex: readonly DocumentIndexRecord[];
  readonly DocumentChunks: readonly DocumentChunksRecord[];
}
