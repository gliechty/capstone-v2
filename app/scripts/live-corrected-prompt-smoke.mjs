import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { syntheticCase, reservationCost } from './live-recommendation-smoke.mjs';
import { reserveAttempt } from './live-recommendation-diagnostic.mjs';
const hash = value => createHash('sha256').update(value).digest('hex');
const previous = [
  ['.local/live-smoke-ledger.json', 'f8bea126af8248a03264faeaa36cb646fa0327ff005f0facd8063d9f55878a03'],
  ['.local/live-diagnostic-2026-10-15.json', '0d2fc075e14388b7b6a4055c633bc46271c617e8a908bd0b75fabb5d7f5ca301'],
];
export function captureResponse(response, chunks, limit = 200000) {
  let bytes = 0;
  if (!response.body) return response;
  return new Response(response.body.pipeThrough(new TransformStream({ transform(chunk, controller) {
    const remaining = Math.max(0, limit - bytes);
    if (remaining) chunks.push(chunk.slice(0, remaining));
    bytes += chunk.byteLength; controller.enqueue(chunk);
  } })), { status: response.status, statusText: response.statusText });
}
async function main() {
  const live = process.argv.includes('--execute-authorized-once');
  if (!live && !process.argv.includes('--dry-run')) throw new Error('Mode required');
  const recordPath = resolve('.local/live-corrected-prompt-2026-10-15.json');
  const responsePath = resolve('.local/live-corrected-prompt-2026-10-15-response.txt');
  if (existsSync(recordPath) || existsSync(responsePath)) throw new Error('Allowance consumed');
  for (const [path, expected] of previous) if (hash(readFileSync(path)) !== expected) throw new Error('Previous ledger changed');
  const readyResponse = await fetch('http://127.0.0.1:3000/api/assessment-recommendations', { redirect: 'error', signal: AbortSignal.timeout(15000) });
  if (!readyResponse.ok) throw new Error('Readiness unavailable');
  const running = await readyResponse.json();
  const envHash = hash(readFileSync('.env.local')); process.loadEnvFile('.env.local');
  const { createServer } = await import('vite');
  const server = await createServer({ configFile: false, logLevel: 'silent', server: { middlewareMode: true },
    resolve: { alias: { 'server-only': resolve('node_modules/next/dist/compiled/server-only/empty.js') } } });
  try {
    const load = path => server.ssrLoadModule('/src/' + path + '.ts');
    const [{ loadCanonicalConfig }, { assessmentCatalog }, { computeAssessment }, { recommendationRequestSchema }, { recommendationPolicy },
      { prepareEvidence, assemblePrompt, PROMPT_VERSION }, { createRecommendationService }, { readProviderConfiguration }, { openAIProvider, outputSchema }] = await Promise.all([
      load('adapters/config-repository'), load('application/assessment-catalog'), load('application/score-request'), load('application/recommendations/contracts'),
      load('application/recommendations/policy'), load('application/recommendations/prepare'), load('application/recommendations/service'),
      load('adapters/recommendations/configuration'), load('adapters/recommendations/openai'),
    ]);
    const { status, apiKey } = readProviderConfiguration();
    if (!running.ready || !status.ready || !apiKey || running.fingerprint !== status.fingerprint || PROMPT_VERSION !== 'legacy-runtime-v1-validated-transport-3'
      || running.promptVersion !== PROMPT_VERSION || status.settings.timeoutMs !== 30000 || status.settings.model !== 'gpt-5.4-mini'
      || status.settings.reasoning !== 'low' || status.settings.maxOutputTokens !== 4000) throw new Error('Readiness mismatch');
    const { config } = loadCanonicalConfig();
    if (running.configVersion !== config.version || running.sessionVersion !== assessmentCatalog(config).version) throw new Error('Config mismatch');
    const input = recommendationRequestSchema.parse(syntheticCase(0, running.sessionVersion));
    const score = computeAssessment(config, { configVersion: input.configVersion, context: input.context, answers: input.answers });
    const evidence = prepareEvidence(config, input, recommendationPolicy), prompt = assemblePrompt(input, score, evidence);
    const promptBytes = Buffer.byteLength(prompt.system + prompt.prompt);
    const framingBytes = Buffer.byteLength(JSON.stringify(outputSchema)) + 1024;
    const reservedUsd = Number(reservationCost(4000).toFixed(6));
    if (reservedUsd > 0.35 || promptBytes > recommendationPolicy.maxPromptBytes || framingBytes > 8192) throw new Error('Budget/bounds failed');
    const record = { authorization: 'Exactly one corrected-prompt synthetic live request; separate additional budget up to USD 0.35; no retries',
      case: 'synthetic-1', priorAttempts: 6, priorReservedUsd: 1.944864, reservedUsd, cumulativeReservedUsd: Number((1.944864 + reservedUsd).toFixed(6)),
      settings: status.settings, promptVersion: PROMPT_VERSION, readinessFingerprint: running.fingerprint, promptBytes, framingAllowanceUsedBytes: framingBytes,
      outcome: 'reserved_interrupted_or_unknown', usage: null, estimatedUsd: reservedUsd, responseFile: responsePath,
      responseRetention: 'Synthetic provider body only, bounded at 200000 bytes; no credentials or headers. Rejected output never enters Results UI.' };
    if (!live) { console.log(JSON.stringify({ mode: 'no-generation-preflight', ...record })); return; }
    const chunks = []; let dispatches = 0;
    const provider = openAIProvider(status.settings, apiKey, async (url, init) => {
      if (++dispatches !== 1) throw new Error('Second dispatch forbidden');
      return captureResponse(await fetch(url, init), chunks);
    });
    const service = createRecommendationService({ loadConfig: () => config, provider,
      policy: { ...recommendationPolicy, timeoutMs: 30000, maxOutputTokens: 4000 } });
    record.attemptedAt = new Date().toISOString(); reserveAttempt(recordPath, record);
    const watchdog = setTimeout(() => process.exit(2), 45000);
    try {
      const result = await service(input);
      record.outcome = result.status === 'available' ? 'available' : result.code;
      record.metrics = result.metrics; record.usage = result.metrics.usage ?? null;
      record.validation = result.status === 'available' ? result.validation : 'not_accepted';
      if (result.status === 'available') record.validatedContent = result.content; else record.issues = result.issues;
      record.assessment = result.assessment; record.evidence = result.evidence;
      if (record.usage) record.estimatedUsd = (record.usage.inputTokens * 0.75 + record.usage.outputTokens * 4.5) / 1000000;
    } finally {
      const raw = Buffer.concat(chunks).toString('utf8').split(apiKey).join('[REDACTED]');
      writeFileSync(responsePath, raw, { flag: 'wx' });
      record.dispatches = dispatches; record.retainedResponseBytes = Buffer.byteLength(raw);
      record.previousLedgersUnchanged = previous.every(([path, expected]) => hash(readFileSync(path)) === expected);
      record.environmentFileUnchanged = hash(readFileSync('.env.local')) === envHash;
      writeFileSync(recordPath + '.tmp', JSON.stringify(record, null, 2) + '\n'); renameSync(recordPath + '.tmp', recordPath);
      clearTimeout(watchdog);
    }
    const safe = { ...record }; delete safe.validatedContent; delete safe.assessment; delete safe.evidence;
    console.log(JSON.stringify(safe, null, 2));
  } finally { await server.close(); }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(() => {
  console.error('Stopped; no retry. Inspect the safe reservation/preflight record. Raw errors withheld.'); process.exitCode = 1;
});
