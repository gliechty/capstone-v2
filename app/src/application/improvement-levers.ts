import type { CanonicalConfig, MetricBenchmarksRecord } from "../domain/config/types";
import { scoreAssessment, type AssessmentScore } from "../domain/scoring/score-assessment";
import { decimalAnswer } from "./calculator-mapping";

export interface ImprovementLever {
  id: string; title: string; category: string; metricId: string; unit: string;
  actual: string; best: string; kind: "boolean" | "categorical" | "percent" | "numeric";
  options: string[]; min: number; max: number;
  weightedGain: number; rawGain: number;
  categoryGains: { category: string; gain: number | null }[];
  method: string; benchmark: string | null; note: string | null;
}
export interface LeverSelection {
  levers: ImprovementLever[];
  excluded: { id: string; reason: string }[];
}
const active = (v: string) => ["", "true", "yes", "1"].includes(v.trim().toLowerCase());

// Derive an attainable optimum from the existing normalization, not from prose,
// unit labels, a guessed input cap or a replacement score formula.
function numericBest(metric: MetricBenchmarksRecord, actual: number, percent: boolean): number | null {
  const p1 = Number(metric.param_1), p2 = Number(metric.param_2), p3 = Number(metric.param_3);
  const max = Number(metric.max_value) || 100;
  if (![p1, p2, p3, max].every(Number.isFinite) || max <= 0) return null;
  let best: number;
  switch (metric.normalization_method.trim().toLowerCase()) {
    case "identity_percent": best = max; break;
    case "linear_cap": if (p1 <= 0) return null; best = p1; break;
    case "gaussian": if (p2 === 0) return null; best = Math.max(0, p1); break;
    case "inverse_count": case "inverse_percentage": best = 0; break;
    case "benchmark_inverse_ratio": if (p1 <= 0) return null; best = 0; break;
    case "inverse_linear_cap": if ((p2 || Number(metric.max_value) || p1) <= 0) return null; best = 0; break;
    case "exponential_decay": {
      if ((p2 || 10) <= 0) return null;
      const converted = percent || metric.unit.toLowerCase().includes("percent");
      const threshold = p1 > 1 && converted ? p1 / 100 : p1;
      best = Math.min(actual, Math.max(0, threshold * (converted ? 100 : 1)));
      break;
    }
    case "banded":
      if (p1 < 0 || p2 < p1 || p3 < p2) return null;
      best = Math.min(actual, p1); break;
    default: return null; // Includes unbounded numeric identity_boolean.
  }
  return percent ? Math.min(100, best) : best;
}

export function selectImprovementLevers(config: CanonicalConfig, baseline: AssessmentScore): LeverSelection {
  const candidates: ImprovementLever[] = [], excluded: LeverSelection["excluded"] = [];
  if (baseline.weightedOverall === null || baseline.rawOverall === null) return { levers: [], excluded };
  for (const row of baseline.questions) {
    if (row.status !== "scored") continue;
    const question = config.QuestionBank.find(q => q.question_id === row.id)!;
    const discrete = row.responseType === "boolean" || row.responseType === "categorical";
    const options = discrete ? config.AnswerScales.filter(s => s.answer_scale_id.trim() === question.answer_scale_id.trim() && active(s.active))
      .sort((a, b) => Number(a.display_order) - Number(b.display_order)).map(s => s.answer_option) : [];
    const metric = row.normalization.benchmark;
    const target = metric ? numericBest(metric, Number(row.rawAnswer), row.responseType === "percent") : null;
    if (!discrete && (target === null || !Number.isFinite(target))) {
      excluded.push({ id: row.id, reason: "No finite, defensible best answer and scenario range under the current scoring function." });
      continue;
    }
    const answers = discrete ? options : [decimalAnswer(target!)];
    let best: { answer: string; score: AssessmentScore; gain: number } | undefined;
    for (const answer of answers) {
      const score = scoreAssessment(config, baseline.input.profile, { ...baseline.input.answers, [row.id]: answer });
      const gain = score.weightedOverall! - baseline.weightedOverall;
      if (gain > 0 && (!best || gain > best.gain)) best = { answer, score, gain };
    }
    if (!best) continue;
    // U-026 is numeric-typed, but its explicit identity_percent plateau is 100.
    // It is not excluded or silently reinterpreted as electricity-only.
    const isPercent = row.responseType === "percent" ||
      (metric?.normalization_method === "identity_percent" && metric.max_value === "100" && Number(row.rawAnswer) <= 100);
    candidates.push({
      id: row.id, title: row.title, category: row.category, metricId: question.metric_id,
      unit: discrete ? "" : isPercent ? "%" : metric!.unit,
      actual: row.rawAnswer, best: best.answer,
      kind: discrete ? row.responseType as "boolean" | "categorical" : isPercent ? "percent" : "numeric",
      options, min: discrete || isPercent ? 0 : Math.min(Number(row.rawAnswer), target!),
      max: discrete ? options.length - 1 : isPercent ? 100 : Math.max(Number(row.rawAnswer), target!),
      weightedGain: best.gain, rawGain: best.score.rawOverall! - baseline.rawOverall,
      categoryGains: baseline.categories.map(c => ({
        category: c.category, gain: c.percent === null ? null : best!.score.categories.find(s => s.category === c.category)!.percent! - c.percent,
      })),
      method: row.normalization.method,
      benchmark: metric ? JSON.stringify([metric.metric_id, metric.benchmark_group_type, metric.benchmark_group_value]) : null,
      note: row.id === "U-026" ? "This question and calculator transfer use total-energy renewable share. The inherited benchmark is labeled renewable electricity share. That methodology wording discrepancy remains unresolved; this scenario uses the existing score function and does not estimate emissions." : null,
    });
  }
  // Stable sort retains canonical questionnaire order for equal gains.
  candidates.sort((a, b) => b.weightedGain - a.weightedGain);
  return { levers: candidates.slice(0, 5), excluded };
}
