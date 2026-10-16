import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { syntheticCase } from './live-recommendation-smoke.mjs';
const originalHash = 'f8bea126af8248a03264faeaa36cb646fa0327ff005f0facd8063d9f55878a03';
const hash = value => createHash('sha256').update(value).digest('hex');
export function reserveAttempt(path, record) {
  // Permanent exclusive reservation doubles as a one-shot lock. Never delete it.
  writeFileSync(path, JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
}
export async function boundedGeneration(provider, request, timeoutMs = 60000) {
  const controller = new AbortController();
  const timeoutError = new Error('diagnostic_timeout');
  let timer, diagnostics = {}, active = true;
  const started = performance.now();
  try {
    const result = await Promise.race([
      new Promise((_, reject) => { timer = setTimeout(() => { active = false; reject(timeoutError); controller.abort(); }, timeoutMs); }),
      Promise.resolve().then(() => provider.generate({ ...request, signal: controller.signal,
        onDiagnostic: event => { if (active) diagnostics = { ...diagnostics, ...event }; } })),
    ]);
    return { result, diagnostics: { ...diagnostics }, providerMs: performance.now() - started };
  } catch (error) {
    return { error, timedOut: error === timeoutError, diagnostics: { ...diagnostics }, providerMs: performance.now() - started };
  } finally { active = false; clearTimeout(timer); }
}
async function main() {
  const live = process.argv.includes('--execute-authorized-once');
  if (!live && !process.argv.includes('--dry-run')) throw new Error('Explicit mode required');
  const ledgerPath = resolve('.local/live-smoke-ledger.json'), recordPath = resolve('.local/live-diagnostic-2026-10-15.json');
  const ledger = readFileSync(ledgerPath);
  if (hash(ledger) !== originalHash) throw new Error('Original ledger changed');
  const rows = JSON.parse(ledger);
  if (rows.length !== 5 || Math.round(rows.reduce((sum, row) => sum + row.reservedUsd, 0) * 1e6) !== 1620720) throw new Error('Reservation mismatch');
  if (existsSync(recordPath)) throw new Error('Single diagnostic allowance consumed');
  const envPath = resolve('.env.local'), envHash = hash(readFileSync(envPath));
  process.loadEnvFile(envPath);
  const { createServer } = await import('vite');
  const server = await createServer({ configFile: false, logLevel: 'silent', server: { middlewareMode: true },
    resolve: { alias: { 'server-only': resolve('node_modules/next/dist/compiled/server-only/empty.js') } } });
  try {
    const load = path => server.ssrLoadModule('/src/' + path + '.ts');
    const [{ loadCanonicalConfig }, { assessmentCatalog }, { computeAssessment }, { recommendationRequestSchema, ProviderFailure },
      { recommendationPolicy }, { prepareEvidence, assemblePrompt, PROMPT_VERSION }, { validateRecommendationOutput },
      { readProviderConfiguration }, { openAIProvider, outputSchema }] = await Promise.all([
      load('adapters/config-repository'), load('application/assessment-catalog'), load('application/score-request'),
      load('application/recommendations/contracts'), load('application/recommendations/policy'), load('application/recommendations/prepare'),
      load('application/recommendations/validate-output'), load('adapters/recommendations/configuration'), load('adapters/recommendations/openai'),
    ]);
    const { status, apiKey } = readProviderConfiguration();
    if (!status.ready || !apiKey || status.settings.model !== 'gpt-5.4-mini' || status.settings.reasoning !== 'low'
      || status.settings.maxOutputTokens !== 4000 || status.settings.timeoutMs !== 10000 || recommendationPolicy.timeoutMs !== 10000) throw new Error('Settings mismatch');
    const started = performance.now(), { config } = loadCanonicalConfig();
    const input = recommendationRequestSchema.parse(syntheticCase(0, assessmentCatalog(config).version));
    if (Buffer.byteLength(JSON.stringify(input)) > recommendationPolicy.maxRequestBytes) throw new Error('Request bound');
    const score = computeAssessment(config, { configVersion: input.configVersion, context: input.context, answers: input.answers });
    const evidence = prepareEvidence(config, input, recommendationPolicy), prompt = assemblePrompt(input, score, evidence);
    const promptBytes = Buffer.byteLength(prompt.system + prompt.prompt);
    const framingBytes = Buffer.byteLength(JSON.stringify({ model: status.settings.model, reasoning: { effort: 'low' }, store: false,
      max_output_tokens: 4000, input: [{ role: 'system', content: '' }, { role: 'user', content: '' }],
      text: { format: { type: 'json_schema', name: 'assessment_recommendations', strict: true, schema: outputSchema } } }));
    if (!score.answered || !evidence.citations.length || promptBytes > recommendationPolicy.maxPromptBytes || framingBytes > 8192) throw new Error('Preparation bounds');
    const record = { authorization: 'Owner authorized exactly one additional synthetic diagnostic on 2026-10-15',
      case: 'synthetic-1', originalLedgerSha256: originalHash, priorAttempts: 5, reservedUsd: 0.324144, cumulativeReservedUsd: 1.944864,
      model: status.settings.model, reasoning: 'low', maxOutputTokens: 4000, diagnosticDeadlineMs: 60000, normalTimeoutMs: 10000,
      configVersion: config.version, methodVersion: score.methodVersion, promptVersion: PROMPT_VERSION, policyVersion: recommendationPolicy.version,
      preparationMs: performance.now() - started, promptBytes, framingBytes,
      documentIds: evidence.ranked.documents.map(d => d.record.doc_id), chunkIds: evidence.ranked.chunks.map(c => c.record.chunk_record_id),
      outcome: 'reserved_interrupted_or_unknown', validation: 'not_accepted', usage: null, estimatedUsd: 0.324144 };
    if (!live) { console.log(JSON.stringify({ mode: 'dry-run-no-generation', ...record })); return; }
    record.attemptedAt = new Date().toISOString();
    reserveAttempt(recordPath, record);
    const watchdog = setTimeout(() => process.exit(2), 75000);
    try {
      const attempt = await boundedGeneration(openAIProvider(status.settings, apiKey), { ...prompt, maxOutputTokens: 4000 });
      record.providerMs = attempt.providerMs; record.providerDiagnostic = attempt.diagnostics;
      if (attempt.error) {
        record.outcome = attempt.timedOut ? 'timeout' : attempt.error instanceof ProviderFailure ? attempt.error.code : 'provider_failure';
        if (attempt.timedOut) record.timeoutStage = attempt.diagnostics.stage ?? 'provider';
        record.usage = attempt.error instanceof ProviderFailure ? attempt.error.usage ?? null : null;
      } else {
        record.usage = attempt.result.usage ?? null;
        const validation = validateRecommendationOutput(attempt.result.text, input, score, evidence, config, recommendationPolicy.maxResponseBytes);
        record.outcome = validation.ok ? 'available' : 'invalid_output';
        record.validation = validation.ok ? 'structural-and-reference-checks-passed-human-review-pending' : 'not_accepted';
        if (validation.ok) record.validatedContent = validation.content; else record.issues = validation.issues;
      }
      if (record.usage) record.estimatedUsd = (record.usage.inputTokens * 0.75 + record.usage.outputTokens * 4.5) / 1000000;
      record.originalLedgerUnchanged = hash(readFileSync(ledgerPath)) === originalHash;
      record.environmentFileUnchanged = hash(readFileSync(envPath)) === envHash;
      record.normalConfigurationUnchanged = readProviderConfiguration().status.settings.timeoutMs === 10000;
      const temp = recordPath + '.tmp'; writeFileSync(temp, JSON.stringify(record, null, 2) + '\n'); renameSync(temp, recordPath);
      const safe = { ...record }; delete safe.validatedContent; console.log(JSON.stringify(safe, null, 2));
    } finally { clearTimeout(watchdog); }
  } finally { await server.close(); }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(() => {
  console.error('Diagnostic stopped. No retry. Inspect the preserved reservation and safe preflight checks; raw errors are intentionally withheld.'); process.exitCode = 1;
});
