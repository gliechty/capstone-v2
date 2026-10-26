import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { createServer } from 'vite';
import { syntheticCase } from './live-recommendation-smoke.mjs';
// Offline replay only: no environment loading, provider adapter, HTTP or Results storage.
globalThis.fetch = async () => { throw new Error('Network forbidden during replay'); };
const file = '.local/live-corrected-prompt-2026-10-15-response.txt';
const bytes = readFileSync(file), digest = b => createHash('sha256').update(b).digest('hex');
const record = JSON.parse(readFileSync('.local/live-corrected-prompt-2026-10-15.json', 'utf8'));
assert.equal(record.case, 'synthetic-1');
assert.equal(record.promptVersion, 'legacy-runtime-v1-validated-transport-3');
const server = await createServer({ configFile: false, logLevel: 'silent', server: { middlewareMode: true } });
try {
  const load = path => server.ssrLoadModule('/src/' + path + '.ts');
  const [{ loadCanonicalConfig }, { assessmentCatalog }, { computeAssessment }, { recommendationRequestSchema }, { prepareEvidence, PROMPT_VERSION }, { recommendationPolicy }, { validateRecommendationOutput }] = await Promise.all([
    load('adapters/config-repository'), load('application/assessment-catalog'), load('application/score-request'), load('application/recommendations/contracts'), load('application/recommendations/prepare'), load('application/recommendations/policy'), load('application/recommendations/validate-output'),
  ]);
  const { config } = loadCanonicalConfig();
  const input = recommendationRequestSchema.parse(syntheticCase(0, assessmentCatalog(config).version));
  const score = computeAssessment(config, { configVersion: input.configVersion, context: input.context, answers: input.answers });
  const evidence = prepareEvidence(config, input, recommendationPolicy);
  assert.deepEqual({ rawOverall: score.rawOverall, weightedOverall: score.weightedOverall, categories: score.categories, answered: score.answered, missing: score.missing }, record.assessment);
  assert.deepEqual({ documentIds: evidence.ranked.documents.map(d => d.record.doc_id), chunkIds: evidence.ranked.chunks.map(c => c.record.chunk_record_id), usableChunkIds: evidence.chunks.map(c => c.record.chunk_record_id), limitations: evidence.limitations }, record.evidence);
  const envelope = JSON.parse(bytes.toString('utf8'));
  const parts = envelope.output.filter(o => o.type === 'message' && o.role === 'assistant').flatMap(o => o.content ?? []).filter(p => p.type === 'output_text');
  assert.equal(parts.length, 1);
  const originalText = parts[0].text;
  const result = validateRecommendationOutput(originalText, input, score, evidence, config, recommendationPolicy.maxResponseBytes);
  assert.equal(result.ok, true);
  assert.deepEqual(result.content, JSON.parse(originalText));
  assert.equal(digest(readFileSync(file)), digest(bytes));
  const report = { mode: 'offline-replay-not-new-generation', sourceFile: resolve(file), responseSha256: digest(bytes), originalPromptVersion: record.promptVersion,
    replayContractVersion: PROMPT_VERSION, matchingAssessmentAndEvidence: true, responseUnchanged: true, originalOutcome: record.outcome, originalIssues: record.issues,
    replayValidation: 'passed', recommendations: result.content.priority_recommendations.length, gaps: result.content.key_gaps.length,
    newProviderCalls: 0, displayedInResults: false, limitation: 'Structural/numeric/reference checks only; not semantic grounding, live success or milestone acceptance.' };
  writeFileSync('.local/retained-response-replay-v4.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally { await server.close(); }
