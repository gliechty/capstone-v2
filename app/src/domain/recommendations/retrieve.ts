import type { CanonicalConfig, DocumentChunksRecord, DocumentIndexRecord } from "../config/types";
export interface RetrievalContext {
  industry: string; subindustry: string; company_location: string; notes?: string;
  target_market_region: readonly string[]; target_buyer: string; business_goal: string;
}
export interface RankPolicy { industry: number; region: number; buyer: number; tag: number; summaryCap: number; wildcards: readonly string[] }
export interface RetrievalPolicy {
  version: string; documentLimit: number; chunkLimit: number;
  document: RankPolicy; chunk: RankPolicy; levels: Readonly<Record<string, number>>;
}
export interface Ranked<T> { record: T; score: number; reasons: readonly string[] }
const norm = (value: unknown) => String(value || "").toLowerCase().trim();
const split = (value: unknown) => norm(value).split(/[;,]/).map(v => v.trim()).filter(Boolean);
function matches(field: string, value: unknown, wildcards: readonly string[]) {
  if (wildcards.includes(norm(field))) return true;
  if (!norm(value)) return false;
  const values = split(value);
  return split(field).some(v => values.includes(v));
}
const hits = (tags: string, value: string) => split(tags).filter(tag => norm(value).includes(tag)).length;
// Preserve n8n's literal comma/semicolon matching (including summary matching),
// document/chunk wildcard asymmetry, and source-order ties. No fuzzy search.
export function retrieveEvidence(config: CanonicalConfig, context: RetrievalContext, policy: RetrievalPolicy) {
  const body = [context.industry, context.subindustry, context.target_market_region, context.target_buyer, context.business_goal, context.notes].filter(Boolean).join(" ").toLowerCase();
  const summaryBody = `${norm(context.business_goal)} ${norm(context.notes)} ${norm(context.subindustry)}`;
  function rank(record: DocumentIndexRecord | DocumentChunksRecord, chunk: boolean, parent = 0) {
    const p = chunk ? policy.chunk : policy.document;
    const d = record as DocumentIndexRecord;
    const c = record as DocumentChunksRecord;
    const level = chunk ? c.strength : d.priority;
    const base = policy.levels[norm(level)] ?? (chunk ? 0 : (Number.isFinite(Number(level)) ? Number(level) : 0));
    const reasons: string[] = [];
    let score = parent + base;
    if (parent > 0) reasons.push(`parent doc score: ${parent}`);
    if (base > 0) reasons.push(`${chunk ? "strength" : "priority"}: ${level}`);
    for (const [label, field, values, weight] of [
      [chunk ? "industry_scope" : "industry", chunk ? c.industry_scope : d.industry, [context.industry], p.industry],
      [chunk ? "region_scope" : "region", chunk ? c.region_scope : d.region, [context.target_market_region, context.company_location], p.region],
      [chunk ? "buyer_scope" : "buyer", chunk ? c.buyer_scope : d.buyer_type, [context.target_buyer], p.buyer],
    ] as const) {
      if (values.some(v => matches(field, v, p.wildcards))) {
        score += weight;
        if (chunk || (norm(field) && norm(field) !== "any")) reasons.push(`${label} match: ${field}`);
      }
    }
    const tagHits = hits(chunk ? c.tags : d.topic_tags, body);
    if (tagHits > 0) { score += tagHits * p.tag; reasons.push(`${chunk ? "chunk" : "topic"} tag hits: ${tagHits}`); }
    const summaryHits = hits(record.summary, summaryBody);
    if (summaryHits > 0) { score += Math.min(summaryHits, p.summaryCap); reasons.push(chunk ? "chunk summary relevance" : "summary relevance"); }
    return { record, score, reasons };
  }
  const documents = config.DocumentIndex.filter(d => !norm(d.active) || norm(d.active) === "true")
    .map(d => rank(d, false) as Ranked<DocumentIndexRecord>).sort((a, b) => b.score - a.score).slice(0, policy.documentLimit);
  const parents = new Map(documents.map(d => [d.record.doc_id, d]));
  const chunks = config.DocumentChunks.filter(c => parents.has(c.doc_id))
    .map(c => rank(c, true, parents.get(c.doc_id)!.score) as Ranked<DocumentChunksRecord>)
    .sort((a, b) => b.score - a.score).slice(0, policy.chunkLimit);
  return { version: policy.version, documents, chunks };
}
