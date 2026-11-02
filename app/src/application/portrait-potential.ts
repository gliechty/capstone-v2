import type { CanonicalConfig } from '../domain/config/types';
import { resolveMultiplier } from '../domain/scoring/score-assessment';
import type { ScoreSummary } from './score-summary';
// Separate portrait metadata. Uses all selected questions, including unanswered;
// never supplies synthetic answers or changes the engine's observed score/trace.
export function withPortraitPotential<T extends ScoreSummary>(config: CanonicalConfig, score: T) {
  const selected = score.trace.map(row => {
    const question = config.QuestionBank.find(q => q.question_id === row.question_id)!;
    return { id: row.question_id, category: row.category, possible: 100 * Number(question.base_weight) * resolveMultiplier(config, question, score.input.profile).value };
  });
  const totals = new Map(score.categories.map(category => [category.category, selected.filter(q => q.category === category.category).reduce((sum, q) => sum + q.possible, 0)]));
  const portraitPotential = Object.fromEntries(selected.map(q => {
    const category = score.categories.find(c => c.category === q.category)!;
    const total = totals.get(category.category)!;
    return [q.id, total > 0 ? q.possible / total * category.weight * 100 : 0];
  }));
  return { ...score, portraitPotential };
}
