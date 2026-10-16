import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, unlinkSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { boundedGeneration, reserveAttempt } from './live-recommendation-diagnostic.mjs';
test('permanent reservation rejects a second attempt without overwriting first', () => {
  const dir = mkdtempSync(join(tmpdir(), 'capstone-diagnostic-')), path = join(dir, 'attempt.json');
  try { reserveAttempt(path, { reservedUsd: 0.324144 });
    assert.throws(() => reserveAttempt(path, { reservedUsd: 0 }), { code: 'EEXIST' });
    assert.deepEqual(JSON.parse(readFileSync(path, 'utf8')), { reservedUsd: 0.324144 });
  } finally { unlinkSync(path); rmdirSync(dir); }
});
test('one dispatch, abort at deadline, immutable diagnostics after late completion', async () => {
  let calls = 0, request, finish;
  const provider = { generate: r => { calls++; request = r; r.onDiagnostic({ stage: 'awaiting_headers', requestBytes: 20 }); return new Promise(resolve => { finish = resolve; }); } };
  const attempt = await boundedGeneration(provider, { system: 'test', prompt: 'synthetic', maxOutputTokens: 4000 }, 10);
  assert.equal(calls, 1); assert.equal(attempt.timedOut, true); assert.equal(request.signal.aborted, true);
  request.onDiagnostic({ stage: 'body_complete', responseBytes: 40 }); finish({ text: '{}' });
  assert.equal(attempt.diagnostics.stage, 'awaiting_headers');
});
test('success preserves provider result and failure is never retried', async () => {
  const output = { text: '{}', usage: { inputTokens: 1, outputTokens: 1 } };
  assert.equal((await boundedGeneration({ generate: async () => output }, {}, 100)).result, output);
  let calls = 0; const error = new Error('controlled');
  const result = await boundedGeneration({ generate: async () => { calls++; throw error; } }, {}, 100);
  assert.equal(calls, 1); assert.equal(result.error, error); assert.equal(result.timedOut, false);
});
