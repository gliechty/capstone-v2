import definitions from '../../config/portraits/portrait_subtypes_v0.2.json' with { type: 'json' };
import { comparePortraitFamilies, PORTRAIT_RULES, type calculatePortrait } from './sustainability-portrait';
type Portrait = NonNullable<ReturnType<typeof calculatePortrait>>;
// An identity-only extension of the accepted portrait. Never changes its scores or next step.
export function selectPortraitSubtype(portrait: Portrait) {
  if (portrait.versions.rules !== definitions.requires_portrait_rule_version || !portrait.strongest || portrait.readable < PORTRAIT_RULES.minimumScoredFamilies) return null;
  const ranked = portrait.families.filter(f => f.readable).sort(comparePortraitFamilies);
  const [first, second] = ranked;
  if (!first || !second) return null;
  const definition = definitions.subtypes.find(s => s.strongest_family === first.id && s.second_family === second.id);
  if (!definition) return null;
  return { definition, first, second, combined: (first.mean! + second.mean!) / 2, sharedLead: first.mean === second.mean, ruleVersion: definitions.subtype_rule_version };
}
