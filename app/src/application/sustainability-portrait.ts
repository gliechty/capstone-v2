import type { ScoreSummary } from './score-summary';
import type { ImprovementLever } from './improvement-levers';
export const PORTRAIT_FAMILIES = ['commit', 'measure', 'plan', 'do', 'engage'] as const;
export type PortraitFamily = typeof PORTRAIT_FAMILIES[number];
export type FamilyMapping = { mappingVersion: string; configVersion: string; questionBankHash: string; ruleVersion: string; templateVersion: string; strengthFloor: number; rows: { question_id: string; family: string; active: boolean; response_type: string; normalization_max: number | null }[] };
export const portraitLabels = { commit: 'Commit', measure: 'Measure', plan: 'Plan', do: 'Do', engage: 'Engage' };
export const archetypes = { commit: 'Anchor', measure: 'Chronicler', plan: 'Navigator', do: 'Steward', engage: 'Partner' };
// Presentation interpretation only. No writes to answers, score, config or scenario state.
export function calculatePortrait(score: ScoreSummary, mapping: FamilyMapping, calculatorIds: readonly string[] = []) {
  if (score.configVersion !== mapping.configVersion) return null;
  const byId = new Map(mapping.rows.map(row => [row.question_id, row]));
  if (byId.size !== mapping.rows.length || score.trace.some(row => !byId.get(row.question_id)?.active)) return null;
  const excludedNumeric: string[] = [];
  const unclassified: string[] = [];
  const families = PORTRAIT_FAMILIES.map(id => {
    const applicable = score.trace.filter(row => {
      const tag = byId.get(row.question_id)!;
      if (tag.family !== id) return false;
      // Non-Measure numeric interpretation is separately gated; never invent an optimum.
      if (['numeric', 'percent'].includes(row.response_type) && id !== 'measure') { excludedNumeric.push(row.question_id); return false; }
      return true;
    });
    const evidence = applicable.flatMap(row => {
      if (row.status !== 'scored' || !row.raw_answer.trim()) return [];
      const numeric = ['numeric', 'percent'].includes(row.response_type);
      if (numeric && (!/^\d+(\.\d+)?$/.test(row.raw_answer.trim()) || !Number.isFinite(Number(row.raw_answer)) || (row.response_type === 'percent' && Number(row.raw_answer) > 100))) return [];
      const max = byId.get(row.question_id)!.normalization_max;
      const value = numeric ? 1 : max && Number.isFinite(row.normalized_score) ? row.normalized_score / max : null;
      if (value === null || value < 0 || value > 1) return [];
      return [{ id: row.question_id, title: row.question_text, value, numeric, origin: calculatorIds.includes(row.question_id) ? 'calculator' as const : 'unknown' as const }];
    });
    const assessed = applicable.length >= 2;
    const readable = assessed && evidence.length >= Math.ceil(applicable.length / 2);
    const origins = new Set(evidence.map(row => row.origin));
    return { id, applicable: applicable.length, answered: evidence.length, assessed, readable,
      mean: evidence.length ? evidence.reduce((sum, row) => sum + row.value, 0) / evidence.length : null,
      inputBasis: origins.size > 1 ? 'mixed (calculator / unknown)' : origins.has('calculator') ? 'calculator' : 'unknown', evidence };
  });
  for (const row of score.trace) if (byId.get(row.question_id)!.family === 'none') unclassified.push(row.question_id);
  const readable = families.filter(row => row.readable);
  const sorted = [...readable].sort((a, b) => b.mean! - a.mean! || b.answered - a.answered || PORTRAIT_FAMILIES.indexOf(a.id) - PORTRAIT_FAMILIES.indexOf(b.id));
  const ready = readable.length >= 3;
  const leader = ready ? sorted[0] : undefined;
  const strongest = leader && leader.mean! >= mapping.strengthFloor ? leader : undefined;
  const weakest = ready ? [...readable].sort((a, b) => a.mean! - b.mean! || b.answered - a.answered || PORTRAIT_FAMILIES.indexOf(a.id) - PORTRAIT_FAMILIES.indexOf(b.id))[0] : undefined;
  const assessedCategories = score.categories.filter(c => c.percent !== null);
  const highest = Math.max(...assessedCategories.map(c => c.percent!));
  return { name: !ready ? 'Portrait in progress' : strongest ? archetypes[strongest.id] : 'Explorer',
    icon: !ready ? null : strongest ? archetypes[strongest.id].toLowerCase() : 'explorer',
    families, strongest: strongest?.id ?? null, weakest: weakest?.id ?? null, readable: readable.length,
    strengths: assessedCategories.filter(c => c.percent === highest).map(c => c.category), excludedNumeric, unclassified,
    versions: { config: score.configVersion, method: score.methodVersion, bankHash: mapping.questionBankHash, mapping: mapping.mappingVersion, rules: mapping.ruleVersion, template: mapping.templateVersion } };
}
export function portraitLever(weakest: PortraitFamily | null, available: readonly ImprovementLever[], mapping: FamilyMapping) {
  if (!weakest || !available.length) return null;
  const family = (lever: ImprovementLever) => mapping.rows.find(row => row.question_id === lever.id)?.family ?? 'none';
  const match = available.slice(0, 5).find(lever => family(lever) === weakest);
  const lever = match ?? available[0]!;
  return { lever, family: family(lever), label: match ? 'Top Lever in ' + portraitLabels[weakest] : 'Overall top Lever' };
}
