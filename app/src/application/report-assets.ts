import mapping from '../../config/portraits/portrait_family_mapping_v0.2.json';
import { calculatePortrait, archetypes } from './sustainability-portrait';
import { selectPortraitSubtype } from './portrait-subtype';
import type { ScoreSummary } from './score-summary';
export type ReportAssets = Record<string, string>;
export function reportAssetPaths(score: ScoreSummary) {
 const portrait = calculatePortrait(score, mapping);
 const pair = portrait && selectPortraitSubtype(portrait);
 return ['/brand/mosaic-mark.svg', '/brand/mosaic-wordmark.svg', '/report/Manrope-variable.ttf',
 ...Object.values(archetypes).map(name => '/portraits/arch-' + name.toLowerCase() + '-small.svg'),
 ...['people','governance','community','resources'].map(name => '/portraits/category-' + name + '-small.svg'),
 ...(pair ? ['/portraits/roles/' + pair.definition.artwork.split('/').pop()] : [])];
}
// Embed only installed first-party assets so the downloaded HTML remains portable.
export async function loadReportAssets(score: ScoreSummary): Promise<ReportAssets> {
 const entries = await Promise.all(reportAssetPaths(score).map(async path => {
  const response = await fetch(path, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error('Report artwork could not be loaded. Please retry the download.');
  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = ''; for (const byte of bytes) binary += String.fromCharCode(byte);
  return [path, 'data:' + (path.endsWith('.ttf') ? 'font/ttf' : 'image/svg+xml') + ';base64,' + btoa(binary)];
 }));
 return Object.fromEntries(entries);
}

