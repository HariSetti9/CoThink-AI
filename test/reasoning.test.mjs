import assert from 'node:assert/strict';
import test from 'node:test';
import { REASONING_DOMAIN } from '../public/app/domains/reasoning.mjs';
import { createSession as createEngineSession, exportSession as exportEngineSession, submitAnswer as submitEngineAnswer } from '../public/app/engine/session.mjs';
import { summarize } from '../public/app/engine/analytics.mjs';
import { advance, canRequestAssistance, createSession, currentTask, exportSession, requestAssistance, submitAnswer } from '../public/app/session.mjs';
import { MODES } from '../public/app/engine/policy.mjs';

const { tasks } = REASONING_DOMAIN;
const observations = {
  mp: ['p', true, 'q'],
  da: ['p', false, 'q'],
  ac: ['q', true, 'p'],
  mt: ['q', false, 'p'],
};
const worlds = [{ p: false, q: false }, { p: false, q: true }, { p: true, q: false }, { p: true, q: true }];

test('three forms have disjoint contexts, balanced inference patterns and balanced answer positions', () => {
  assert.equal(tasks.length, 24);
  assert.equal(new Set(tasks.map(task => task.assessment.context)).size, 24);
  assert.deepEqual([...new Set(tasks.map(task => task.phase))], ['pre', 'practice', 'transfer']);
  assert.deepEqual([0, 1, 2].map(i => tasks.filter(task => task.answer === i).length), [8, 8, 8]);
  for (const phase of ['pre', 'practice', 'transfer']) {
    const form = tasks.filter(task => task.phase === phase);
    assert.equal(form.length, 8);
    assert.deepEqual([0, 1, 2].map(i => form.filter(task => task.answer === i).length).sort(), [2, 3, 3]);
    for (const pattern of Object.keys(observations)) assert.equal(form.filter(task => task.assessment.pattern === pattern).length, 2);
  }
});

for (const task of tasks) {
  test('truth-table answer for ' + task.id, () => {
    const { observed, value, target, optionKeys, labels, pattern } = task.assessment;
    assert.deepEqual([observed, value, target], observations[pattern]);
    // Exclude only the truth assignment that falsifies the stipulated implication.
    const models = worlds.filter(world => !(world.p === true && world.q === false) && world[observed] === value);
    assert.ok(models.length);
    const possible = new Set(models.map(world => world[target]));
    const expected = possible.size === 1 ? String([...possible][0]) : 'unknown';
    assert.deepEqual([...optionKeys].sort(), ['false', 'true', 'unknown']);
    assert.equal(new Set(task.choices).size, 3);
    assert.deepEqual(task.choices, optionKeys.map(option => labels[option]));
    assert.equal(optionKeys[task.answer], expected);
  });
}

for (const mode of Object.keys(MODES)) {
  test('reasoning completes and exports the correct domain in ' + mode, () => {
    const session = createSession(mode, 'reasoning');
    for (const task of tasks) {
      assert.equal(currentTask(session), task);
      const eligible = task.phase === 'practice' && mode !== 'unaided';
      assert.equal(canRequestAssistance(session), eligible);
      assert.equal(Boolean(requestAssistance(session)), eligible);
      if (!eligible) assert.equal(requestAssistance(session, true), null);
      assert.equal(submitAnswer(session, task.answer, 75).sealed, true);
      assert.equal(advance(session), true);
    }
    const exported = exportSession(session);
    assert.equal(exported.domain, 'reasoning');
    assert.equal(exported.datasetVersion, 'propositional-reasoning-v1');
    assert.equal(exported.logs.length, 24);
    assert.ok(exported.logs.filter(log => log.phase !== 'practice').every(log => !log.requests.length));
    const summary = summarize(exported.logs, Object.keys(REASONING_DOMAIN.concepts));
    assert.equal(summary.concepts.length, 2);
    assert.equal(summary.transfer.correct, 8);
    assert.equal(summary.requestCount, mode === 'unaided' ? 0 : 8);
  });
}

function initialReasoningHelp(mode, correct, confidence) {
  const session = createSession(mode, 'reasoning');
  while (currentTask(session).phase === 'pre') {
    const { answer } = currentTask(session);
    submitAnswer(session, correct ? answer : (answer + 1) % 3, confidence);
    advance(session);
  }
  return requestAssistance(session)?.strategy;
}

test('same reasoning item receives different initial help only when the policy uses probes', () => {
  assert.equal(initialReasoningHelp('adaptive', true, 90), 'reflect');
  assert.equal(initialReasoningHelp('adaptive', false, 0), 'worked');
  for (const [mode, expected] of [['interaction', 'hint'], ['fixed', 'hint'], ['direct', 'worked'], ['unaided', undefined]]) {
    assert.equal(initialReasoningHelp(mode, true, 90), expected);
    assert.equal(initialReasoningHelp(mode, false, 0), expected);
  }
});

test('unregistered domains can use the engine through the task contract', () => {
  const domain = {
    id: 'sample',
    datasetVersion: 'sample-v1',
    tasks: [{ id: 'sample-1', phase: 'pre', concept: 'sample', choices: ['A', 'B'], answer: 1 }],
  };
  const session = createEngineSession('adaptive', domain);
  assert.equal(submitEngineAnswer(session, 1, 80).correct, true);
  assert.equal(exportEngineSession(session).datasetVersion, 'sample-v1');
  assert.throws(() => createSession('adaptive', 'constructor'), RangeError);
});
