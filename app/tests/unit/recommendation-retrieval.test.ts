import { mkdirSync, writeFileSync } from "node:fs";
import { afterAll, expect, test } from "vitest";
import { loadCanonicalConfig } from "../../src/adapters/config-repository";
import { retrieveEvidence, type RetrievalContext } from "../../src/domain/recommendations/retrieve";
import { recommendationPolicy } from "../../src/application/recommendations/policy";
import { legacyRetrieval } from "../helpers/legacy-retrieval";
import { goldenCases } from "../helpers/legacy-scoring";
const { config } = loadCanonicalConfig();
const matrix: unknown[] = [];
afterAll(() => { mkdirSync("test-results", { recursive: true }); writeFileSync("test-results/retrieval-matrix.json", JSON.stringify(matrix, null, 2)); });
for (const fixture of goldenCases) test(`${fixture.case_id}: native ranking agrees with preserved nodes and records stable-join differences`, () => {
  const context: RetrievalContext = { ...fixture.profile, subindustry: String(fixture.profile.subindustry) };
  const actual = retrieveEvidence(config, context, recommendationPolicy);
  const expected = legacyRetrieval(config, context);
  const historicalJoins = legacyRetrieval(config, context, true);
  expect(actual.documents.map(d => [d.record.doc_id, d.score, d.reasons])).toEqual(expected.documents.map(d => [d.doc_id, d.retrieval_score, d.retrieval_reasons]));
  expect(actual.chunks.map(c => [c.record.chunk_record_id, c.score, c.reasons])).toEqual(expected.chunks.map(c => [c.chunk_id, c.retrieval_score, c.retrieval_reasons]));
  expect(actual.documents).toHaveLength(8); expect(actual.chunks).toHaveLength(18);
  const legacyIds = historicalJoins.chunks.map(c => c.chunk_id);
  const nativeIds = actual.chunks.map(c => c.record.chunk_record_id);
  matrix.push({ case: fixture.case_id, policy: recommendationPolicy.version, documents: actual.documents.map(d => ({ id: d.record.doc_id, score: d.score })),
    canonicalChunks: nativeIds, legacyTitleJoinChunks: legacyIds, addedByStableJoin: nativeIds.filter(id => !legacyIds.includes(id)), removedByTopK: legacyIds.filter(id => !nativeIds.includes(id)) });
});
const context: RetrievalContext = { industry: "Widgets", subindustry: "solar", company_location: "APAC", target_market_region: ["EU", "North America"], target_buyer: "Enterprise", business_goal: "energy" };
test("preserves wildcard asymmetry, numeric priority, literal tags/summary and source-order ties", () => {
  const base = { ...config.DocumentIndex[0]!, active: "true", industry: "Other", region: "Other", buyer_type: "Other", topic_tags: "", summary: "", priority: "0" };
  const docs = [
    { ...base, doc_id: "a", priority: "2", industry: "ANY", region: "APAC", buyer_type: "Enterprise", topic_tags: "solar;energy", summary: "solar;energy;solar" },
    { ...base, doc_id: "b", industry: "Global" }, { ...base, doc_id: "c", industry: "All" },
    { ...base, doc_id: "d", active: "1", priority: "1000" }, { ...base, doc_id: "e" },
  ];
  const snapshot = { ...config, DocumentIndex: docs, DocumentChunks: [] };
  const actual = retrieveEvidence(snapshot, context, recommendationPolicy);
  expect(actual.documents.map(d => [d.record.doc_id, d.score])).toEqual([["a", 18], ["c", 4], ["b", 0], ["e", 0]]);
  expect(actual.documents.map(d => d.score)).toEqual(legacyRetrieval(snapshot, context).documents.map(d => d.retrieval_score));
});
test("stable IDs join renamed parents and disambiguate duplicate legacy chunk IDs", () => {
  const d = { ...config.DocumentIndex[0]!, doc_id: "a", doc_title: "Renamed", active: "true" };
  const c = { ...config.DocumentChunks[0]!, doc_id: "a", doc_title: "Original", legacy_chunk_id: "duplicate", chunk_record_id: "a/duplicate", industry_scope: "Global", buyer_scope: "Multi", region_scope: "All" };
  const data = { ...config, DocumentIndex: [d, { ...d, doc_id: "b" }], DocumentChunks: [c, { ...c, doc_id: "b", chunk_record_id: "b/duplicate" }, { ...c, doc_id: "orphan" }] };
  const actual = retrieveEvidence(data, context, recommendationPolicy);
  expect(actual.chunks.map(c => c.record.chunk_record_id)).toEqual(["a/duplicate", "b/duplicate"]);
  expect(actual.chunks[0]!.score - actual.documents[0]!.score).toBe(10);
  expect(retrieveEvidence(data, context, { ...recommendationPolicy, documentLimit: 1, chunkLimit: 1 }).chunks).toHaveLength(1);
});
