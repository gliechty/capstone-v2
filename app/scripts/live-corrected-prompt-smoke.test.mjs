import { test } from 'node:test';
import assert from 'node:assert/strict';
import { captureResponse } from './live-corrected-prompt-smoke.mjs';
test('retention is bounded, body passes unchanged, and headers are not copied', async () => {
  const chunks = [];
  const source = new Response('synthetic rejected response', { status: 200, headers: { 'x-test-sensitive': 'never retain' } });
  const captured = captureResponse(source, chunks, 9);
  assert.equal(await captured.text(), 'synthetic rejected response');
  assert.equal(Buffer.concat(chunks).toString(), 'synthetic');
  assert.equal(captured.headers.get('x-test-sensitive'), null);
});
test('retains malformed synthetic content for diagnosis without repairing it', async () => {
  const chunks = []; const captured = captureResponse(new Response('{broken'), chunks);
  assert.equal(await captured.text(), '{broken');
  assert.equal(Buffer.concat(chunks).toString(), '{broken');
});
