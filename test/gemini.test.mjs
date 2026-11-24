import assert from 'node:assert/strict';
import test from 'node:test';
import { draftHint } from '../server/gemini.mjs';

const task = { prompt: 'What prints?', code: 'print(2 + 2)', hint: 'Add the operands.', unrelated: 'private-free-text' };
const configured = { GEMINI_ENABLED: 'true', GEMINI_MODEL: 'gemini-mock-model', GEMINI_API_KEY: 'unit-test-key' };
const fallback = { source: 'curated', text: task.hint };

test('off by default and malformed configuration never call the provider', async () => {
  let calls = 0;
  const fetcher = () => { calls++; };
  for (const env of [{}, { ...configured, GEMINI_ENABLED: 'false' }, { ...configured, GEMINI_API_KEY: '' }, { ...configured, GEMINI_MODEL: '../escape' }]) {
    assert.deepEqual(await draftHint(task, { env, fetcher }), fallback);
  }
  assert.equal(calls, 0);
});

test('sends only exercise context and returns a draft for human review', async () => {
  let request;
  const fetcher = async (url, init) => {
    request = { url, init };
    return { ok: true, json: async () => ({ candidates: [{ finishReason: 'STOP', content: { parts: [{ thought: true, text: 'Internal' }, { text: 'Look at the operator.' }] } }] }) };
  };
  const result = await draftHint(task, { env: configured, fetcher });
  assert.deepEqual(result, { source: 'gemini', text: 'Look at the operator.', reviewRequired: true });
  assert.match(request.url, /^https:\/\/generativelanguage\.googleapis\.com\//);
  assert.equal(request.init.headers['x-goog-api-key'], configured.GEMINI_API_KEY);
  assert.equal(request.init.redirect, 'error');
  assert.equal(request.init.signal.aborted, false);
  assert.match(request.init.body, /print\(2 \+ 2\)/);
  assert.doesNotMatch(request.init.body + request.url + JSON.stringify(result), /unit-test-key|private-free-text/);
});

test('provider errors, rejected generations and malformed responses use the curated hint', async () => {
  const invalid = [
    async () => { throw new Error('network'); },
    async () => ({ ok: false }),
    async () => ({ ok: true, json: async () => ({}) }),
    async () => ({ ok: true, json: async () => ({ candidates: [{ finishReason: 'MAX_TOKENS' }] }) }),
    async () => ({ ok: true, json: async () => ({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'a'.repeat(301) }] } }] }) }),
  ];
  for (const fetcher of invalid) assert.deepEqual(await draftHint(task, { env: configured, fetcher }), fallback);
});
