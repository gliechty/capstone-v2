import type { ScoreSummary } from './score-summary';
import { calculatePortrait, PORTRAIT_FAMILIES } from './sustainability-portrait';
import type { RecommendationView } from './recommendations/controller';
type Portrait = NonNullable<ReturnType<typeof calculatePortrait>>;
const opening: Record<string, string> = {
  Anchor: 'As an Anchor, your answers suggest that setting commitments is where your approach begins—giving others something clear to hold you to.',
  Chronicler: 'As a Chronicler, your answers suggest you start by making sustainability visible through records and figures—a basis for showing progress.',
  Navigator: 'As a Navigator, your answers suggest you look for a direction to work toward, turning sustainability ambitions into targets and plans.',
  Steward: 'As a Steward, your answers suggest you bring sustainability into what the business does, making practical action the centre of your approach.',
  Partner: 'As a Partner, your answers suggest you approach sustainability through relationships, bringing suppliers or other stakeholders into the work.',
  Explorer: 'As an Explorer, your answers show an approach still taking shape. You do not need to do everything at once; a focused next step can help you find your footing.',
  'Portrait in progress': 'Your story is still coming into focus. A few more answers will help distinguish the way you approach sustainability.',
};
const secondary = {
  commit: 'Your answers also show some commitments to build on.',
  measure: 'Tracking or supplying figures also appears in your answers—a starting point for making progress visible.',
  plan: 'Your answers also show some planning to help give the work direction.',
  do: 'Your answers also show some practical action to build on.',
  engage: 'Your answers also show some work with others to build on.',
};
export function portraitReading(portrait: Portrait, profile: ScoreSummary['input']['profile']) {
  const support = portrait.strongest ? portrait.families.filter(f => f.id !== portrait.strongest && f.readable && f.mean! > 0)
    .sort((a,b) => b.mean! - a.mean! || b.answered - a.answered || PORTRAIT_FAMILIES.indexOf(a.id) - PORTRAIT_FAMILIES.indexOf(b.id))[0] : undefined;
  const buyer = profile.target_buyer?.trim().replace(/\s+buyers?$/i, '');
  const markets = profile.target_market_region.filter(Boolean).join(', ');
  const context = buyer ? 'For the ' + buyer.toLowerCase() + ' buyers you want to reach' + (markets ? ' in ' + markets : '') + ', the opportunity is to make that progress easier to see.' : '';
  return [opening[portrait.name], support ? secondary[support.id] : '', context].filter(Boolean).join(' ');
}
// Generated advice may enrich the reading, never the archetype or plotted values.
export function portraitAdvice(view: Pick<RecommendationView, 'phase' | 'result'> | null, inputId: string | null, score: Pick<ScoreSummary, 'configVersion' | 'methodVersion'>) {
  const result = view?.phase === 'available' ? view.result : undefined;
  if (!inputId || result?.status !== 'available' || result.identity.inputId !== inputId || result.identity.configVersion !== score.configVersion || result.identity.methodVersion !== score.methodVersion) return null;
  const title = [...result.content.priority_recommendations].sort((a,b) => a.priority_rank - b.priority_rank).find(r => r.title.trim())?.title.trim();
  if (!title) return null;
  return title.length > 160 ? title.slice(0, 157).replace(/\s+\S*$/, '') + '…' : title;
}
