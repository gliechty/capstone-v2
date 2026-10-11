import type { AnswerScalesRecord, MetricBenchmarksRecord } from "../config/types";
export interface TraceIdentity {
  question_id: string; question_text: string; raw_answer: string; response_type: string; category: string;
  config_version: string; method_version: string;
}
export type CalculationTrace = (TraceIdentity & { status: "missing" }) | (TraceIdentity & {
  status: "scored";
  normalization_method: string;
  normalization_inputs: Readonly<Record<string, string | number | boolean>>;
  normalized_score: number;
  benchmark: null | { id: string; source: "MetricBenchmarks"; record: MetricBenchmarksRecord };
  answer_scale: AnswerScalesRecord | null;
  base_weight: number;
  matched_multiplier_rule_ids: string[];
  multiplier: number; multiplier_product: number; multiplier_cap: number;
  weighted_score: number; final_score: number; total_possible: number;
  category_contribution: { earned_points: number; possible_points: number; category_possible: number;
    percentage_points: number | null; category_weight: number; weighted_overall_points: number | null; raw_overall_points: number | null };
});
