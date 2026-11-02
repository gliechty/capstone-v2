import type { ScoreSummary } from './score-summary';
import { calculatePortrait, comparePortraitFamilies, portraitLabels } from './sustainability-portrait';
import type { RecommendationView } from './recommendations/controller';
type Portrait = NonNullable<ReturnType<typeof calculatePortrait>>;
export const portraitFamilyDefinitions = {
  commit: 'Policies and formal commitments.',
  measure: 'Tracking, recording and supplying figures.',
  plan: 'Targets, plans and risk assessment.',
  do: 'Putting practices into action.',
  engage: 'Working with suppliers and communities.',
};
const familyPhrases = {
  commit: ['Policies and commitments', 'lead'],
  measure: ['Tracking and recording', 'lead'],
  plan: ['Targets and planning', 'lead'],
  do: ['Practical action', 'leads'],
  engage: ['Collaboration and engagement', 'lead'],
};
export function portraitReading(portrait: Portrait) {
  const [first, second] = portrait.families.filter(f => f.readable).sort(comparePortraitFamilies);
  if (!portrait.strongest || !first || !second) return 'Your portrait is still coming into focus. Answer an eligible question in two families to reveal a pair.';
  if (first.mean === 0) return 'Your answered items currently earn no portrait credit. The pair reflects the tie-break rule and does not imply established practices.';
  const [phrase, verb] = familyPhrases[first.id];
  const introduction = first.mean === second.mean
    ? portraitLabels[first.id] + ' and ' + portraitLabels[second.id] + ' share the highest percentage in your answers.'
    : second.mean === 0
      ? phrase + ' ' + verb + ' your answers; ' + portraitLabels[second.id] + ' has no earned credit yet.'
      : phrase + ' ' + verb + ' your answers, followed by ' + familyPhrases[second.id][0]!.toLowerCase() + '.';
  return introduction + ' You answered ' + first.answered + '/' + first.applicable + ' ' + portraitLabels[first.id] + ' questions and ' + second.answered + '/' + second.applicable + ' ' + portraitLabels[second.id] + ' questions.';
}
// Generated advice may enrich the reading, never the archetype or plotted values.
export function portraitAdvice(view: Pick<RecommendationView, 'phase' | 'result'> | null, inputId: string | null, score: Pick<ScoreSummary, 'configVersion' | 'methodVersion'>) {
  const result = view?.phase === 'available' ? view.result : undefined;
  if (!inputId || result?.status !== 'available' || result.identity.inputId !== inputId || result.identity.configVersion !== score.configVersion || result.identity.methodVersion !== score.methodVersion) return null;
  const title = [...result.content.priority_recommendations].sort((a,b) => a.priority_rank - b.priority_rank).find(r => r.title.trim())?.title.trim();
  if (!title) return null;
  return title.length > 160 ? title.slice(0, 157).replace(/\s+\S*$/, '') + '…' : title;
}
