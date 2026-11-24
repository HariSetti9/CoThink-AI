import assert from 'node:assert/strict';
import test from 'node:test';
import { summarize } from '../public/app/analytics.mjs';
import { chooseAssistance, MODES } from '../public/app/policy.mjs';
import { TASKS } from '../public/app/tasks.mjs';
import { advance, createSession, currentTask, exportSession, requestAssistance, submitAnswer } from '../public/app/session.mjs';

const probes = (first, second, confidence) => [{ correct: first, confidence }, { correct: second, confidence }];

const scenarios = [
  ['adaptive low evidence', { probes: [] }, 'hint', 'limited_evidence'],
  ['low probe score', { probes: probes(false, false, 10) }, 'worked', 'low_probe_score'],
  ['mixed probe score', { probes: probes(true, false, 55) }, 'hint', 'mixed_probe_score'],
  ['high probe score', { probes: probes(true, true, 100) }, 'reflect', 'high_probe_score'],
  ['confidence gap exactly at threshold', { probes: probes(true, false, 80) }, 'verify', 'confidence_above_probe_score'],
  ['confidence gap below threshold', { probes: probes(true, false, 79) }, 'hint', 'mixed_probe_score'],
  ['first failure prefers a hint over verification', { probes: probes(false, false, 90), failures: 1 }, 'hint', 'first_difficulty'],
  ['second failure escalates', { failures: 2 }, 'worked', 'repeated_difficulty'],
  ['interaction-only initial hint is probe invariant', { mode: 'interaction', probes: probes(true, true, 100) }, 'hint', 'interaction_default'],
  ['interaction-only escalation', { mode: 'interaction', failures: 2 }, 'worked', 'repeated_difficulty'],
  ['fixed first and later help stays a hint', { mode: 'fixed', failures: 2 }, 'hint', 'fixed_policy'],
  ['direct initial help is a worked answer', { mode: 'direct' }, 'worked', 'direct_policy'],
  ['override is logged separately', { mode: 'fixed', failures: 2, override: true }, 'worked', 'learner_override'],
];

for (const [name, inputs, strategy, reason] of scenarios) {
  test(name, () => {
    assert.deepEqual(chooseAssistance({ mode: 'adaptive', override: false, failures: 0, probes: [], ...inputs }), { strategy, reason });
  });
}

function reachPractice(session) {
  while (currentTask(session).phase === 'pre') {
    assert.equal(requestAssistance(session, true), null);
    assert.equal(submitAnswer(session, currentTask(session).answer, 90).sealed, true);
    assert.equal(advance(session), true);
  }
}

test('invalid mode, answer, confidence and premature advance leave state intact', () => {
  assert.throws(() => createSession('__proto__'), RangeError);
  const session = createSession('adaptive');
  assert.equal(advance(session), false);
  assert.equal(submitAnswer(session, '', 50), null);
  assert.equal(submitAnswer(session, 3, 50), null);
  assert.equal(submitAnswer(session, 0, NaN), null);
  assert.equal(submitAnswer(session, 0, -1), null);
  assert.equal(submitAnswer(session, 0, 101), null);
  assert.deepEqual(session.submissions, []);
});

test('practice records failed attempts, retry accuracy, and override timing', () => {
  const session = createSession('adaptive');
  reachPractice(session);
  const { answer } = currentTask(session);
  const wrong = (answer + 1) % 3;
  assert.deepEqual(submitAnswer(session, wrong, 60), { correct: false, sealed: false });
  assert.equal(requestAssistance(session).strategy, 'hint');
  assert.deepEqual(submitAnswer(session, wrong, 55), { correct: false, sealed: false });
  assert.deepEqual(requestAssistance(session, true), { strategy: 'worked', reason: 'learner_override', override: true, afterAttempts: 2 });
  assert.deepEqual(submitAnswer(session, answer, 100), { correct: true, sealed: true });
  assert.equal(submitAnswer(session, wrong, 50), null);
  assert.equal(requestAssistance(session), null);
  const log = session.logs.at(-1);
  assert.deepEqual(log.submissions, [
    { correct: false, confidence: 60, assisted: false },
    { correct: false, confidence: 55, assisted: true },
    { correct: true, confidence: 100, assisted: true },
  ]);
  const stats = summarize(session.logs);
  assert.equal(stats.firstPractice.correct, 0);
  assert.equal(stats.firstUnaidedPractice.total, 1);
  assert.equal(stats.practice.correct, 1);
  assert.equal(stats.requestCount, 2);
  assert.equal(stats.overrideCount, 1);
});

test('a third failed practice attempt seals a single outcome', () => {
  const session = createSession('fixed');
  reachPractice(session);
  const wrong = (currentTask(session).answer + 1) % 3;
  assert.equal(submitAnswer(session, wrong, 50).sealed, false);
  assert.equal(submitAnswer(session, wrong, 50).sealed, false);
  assert.equal(submitAnswer(session, wrong, 50).sealed, true);
  assert.equal(session.logs.at(-1).correct, false);
  assert.equal(session.logs.at(-1).attempts, 3);
});

for (const mode of Object.keys(MODES)) {
  test('complete session and versioned export in ' + mode, () => {
    const session = createSession(mode);
    for (const task of TASKS) {
      assert.equal(currentTask(session).id, task.id);
      assert.equal(Boolean(requestAssistance(session)), task.phase === 'practice');
      assert.equal(submitAnswer(session, task.answer, 80).sealed, true);
      assert.equal(advance(session), true);
    }
    assert.equal(currentTask(session), undefined);
    assert.equal(advance(session), false);
    const receipt = exportSession(session);
    assert.equal(receipt.schemaVersion, 2);
    assert.equal(receipt.mode, mode);
    assert.equal(receipt.logs.length, 24);
    assert.equal(receipt.logs.filter(log => log.phase === 'transfer').every(log => log.requests.length === 0), true);
    const stats = summarize(receipt.logs);
    assert.equal(stats.change, 0);
    assert.ok(Math.abs(stats.brier - 0.04) < 0.000001);
    assert.equal(stats.requestCount, 8);
    assert.equal(stats.firstUnaidedPractice.pct, null);
  });
}

test('descriptive analytics handle empty and v0.4-shaped logs', () => {
  assert.equal(summarize([]).change, null);
  assert.equal(summarize([]).brier, null);
  const stats = summarize([{ phase: 'practice', concept: 'loops', correct: true, confidence: 50, attempts: 2, assistance: ['hint'] }]);
  assert.equal(stats.practice.correct, 1);
  assert.equal(stats.firstPractice.total, 0);
  assert.equal(stats.requestCount, 1);
  assert.equal(stats.strategies.hint, 1);
});
