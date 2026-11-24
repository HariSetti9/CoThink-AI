import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { summarize } from '../public/app/analytics.mjs';
import { gradeAnswer } from '../public/app/answers.mjs';
import { CODING_TASKS } from '../public/app/coding-tasks.mjs';
import { advance, createSession, currentTask, exportSession, requestAssistance, submitAnswer } from '../public/app/session.mjs';
import { trackConcepts } from '../public/app/tracks.mjs';

const referenceCases = {
  'coding-pre-loops-1': [[{ n: 1 }, [0]], [{ n: 4 }, [0, 1, 2, 3]]],
  'coding-pre-conditions-1': [[{ score: 49 }, false], [{ score: 50 }, true], [{ score: 51 }, true]],
  'coding-pre-loops-2': [[{ n: 2 }, [1]], [{ n: 5 }, [1, 2, 3, 4]]],
  'coding-pre-conditions-2': [[{ value: -3 }, false], [{ value: -4 }, true], [{ value: 0 }, true], [{ value: 7 }, false]],
  'coding-practice-loops-1': [[{ total: 1 }, [1]], [{ total: 4 }, [1, 2, 3, 4]]],
  'coding-practice-conditions-1': [[{ cost: 4, budget: 5 }, true], [{ cost: 5, budget: 5 }, true], [{ cost: 6, budget: 5 }, false]],
  'coding-practice-loops-2': [[{ n: 1 }, [1]], [{ n: 3 }, [3, 2, 1]]],
  'coding-practice-conditions-2': [[{ index: -1, length: 2 }, false], [{ index: 0, length: 0 }, false], [{ index: 0, length: 2 }, true], [{ index: 2, length: 2 }, false]],
  'coding-transfer-loops-1': [[{ limit: 1 }, []], [{ limit: 4 }, [2, 4]], [{ limit: 5 }, [2, 4]]],
  'coding-transfer-conditions-1': [[{ reading: -1, low: 0, high: 2 }, true], [{ reading: 0, low: 0, high: 2 }, false], [{ reading: 1, low: 0, high: 2 }, false], [{ reading: 2, low: 0, high: 2 }, false], [{ reading: 3, low: 0, high: 2 }, true]],
  'coding-transfer-loops-2': [[{ high: 2, low: 2 }, [2]], [{ high: 2, low: -1 }, [2, 1, 0, -1]]],
  'coding-transfer-conditions-2': [[{ value: -1, low: 0, high: 2 }, false], [{ value: 0, low: 0, high: 2 }, true], [{ value: 1, low: 0, high: 2 }, true], [{ value: 2, low: 0, high: 2 }, true], [{ value: 3, low: 0, high: 2 }, false]],
};

test('coding tasks have stable IDs and balanced independent, practice and transfer coverage', () => {
  assert.equal(CODING_TASKS.length, 12);
  assert.equal(new Set(CODING_TASKS.map(task => task.id)).size, 12);
  assert.deepEqual(trackConcepts('coding'), ['loops', 'conditions']);
  assert.equal(trackConcepts('tracing').length, 4);
  for (const phase of ['pre', 'practice', 'transfer']) {
    for (const concept of trackConcepts('coding')) {
      assert.equal(CODING_TASKS.filter(task => task.phase === phase && task.concept === concept).length, 2);
    }
  }
});

for (const task of CODING_TASKS) {
  test('accepted Python forms satisfy boundary cases for ' + task.id, () => {
    const cases = referenceCases[task.id];
    assert.ok(cases.length >= 2);
    assert.ok(task.answers.length);
    assert.equal(task.code.split('____').length, 2);
    for (const expression of task.answers) assert.equal(gradeAnswer(task, expression), true);

    // The subprocess receives repository-owned answers and fixtures only.
    const input = JSON.stringify(JSON.stringify({ answers: task.answers, cases }));
    const script = `import json
data = json.loads(${input})
for answer in data["answers"]:
    for variables, expected in data["cases"]:
        result = eval(answer, {"__builtins__": {"range": range}}, variables)
        if isinstance(expected, list):
            assert isinstance(result, range) and list(result) == expected, (answer, variables, result)
        else:
            assert result is expected, (answer, variables, result)
`;
    const python = spawnSync(process.env.COTHINK_PYTHON ?? 'python', ['-I', '-c', script], { encoding: 'utf8', timeout: 4000 });
    assert.ifError(python.error);
    assert.equal(python.status, 0, python.stderr);
  });
}

test('typed grading handles whitespace and whole-expression parentheses', () => {
  const task = CODING_TASKS[0];
  assert.equal(gradeAnswer(task, ' (( range ( 0 , n ) )) '), true);
  assert.equal(gradeAnswer(task, 'range\t(\tn\t)'), true);
  assert.equal(gradeAnswer(task, 'range(n + 1)'), false);
  assert.equal(gradeAnswer(task, 'ra nge(n)'), false);
  assert.equal(gradeAnswer(task, 'range((0, n))'), false);
  assert.equal(gradeAnswer(task, 'range(n); print(n)'), false);
  assert.equal(gradeAnswer(task, 'range(n))'), false);
  assert.equal(gradeAnswer(task, '(range(n))()'), false);
  assert.equal(gradeAnswer(task, ' '), null);
  assert.equal(gradeAnswer(task, 'range(n)\n'), null);
  assert.equal(gradeAnswer(task, 'x'.repeat(161)), null);
});

function enterPractice(confidence, correct) {
  const session = createSession('adaptive', 'coding');
  while (currentTask(session).phase === 'pre') {
    assert.equal(requestAssistance(session), null);
    assert.equal(submitAnswer(session, correct ? currentTask(session).answers[0] : '0', confidence).sealed, true);
    assert.equal(advance(session), true);
  }
  return session;
}

test('same coding task receives different initial help from pre-test evidence', () => {
  const secure = enterPractice(100, true);
  const struggling = enterPractice(0, false);
  assert.equal(currentTask(secure).id, currentTask(struggling).id);
  assert.equal(requestAssistance(secure).strategy, 'reflect');
  assert.equal(requestAssistance(struggling).strategy, 'worked');
  assert.equal(submitAnswer(secure, 'range(1, total)', 70).sealed, false);
  assert.equal(requestAssistance(secure).reason, 'first_difficulty');
});

test('coding results and export are track-specific and omit raw expressions', () => {
  assert.throws(() => createSession('adaptive', '__proto__'), RangeError);
  const session = createSession('interaction', 'coding');
  for (const task of CODING_TASKS) {
    assert.equal(currentTask(session).id, task.id);
    assert.equal(Boolean(requestAssistance(session)), task.phase === 'practice');
    assert.equal(submitAnswer(session, task.answers[0], 85).sealed, true);
    assert.equal(advance(session), true);
  }
  assert.equal(currentTask(session), undefined);
  const exported = exportSession(session);
  assert.equal(exported.version, '0.6');
  assert.equal(exported.datasetVersion, 'python-expressions-v1');
  assert.equal(exported.track, 'coding');
  assert.equal(exported.logs.length, 12);
  assert.doesNotMatch(JSON.stringify(exported), /range\(/);
  const stats = summarize(exported.logs, trackConcepts(exported.track));
  assert.equal(stats.transfer.correct, 4);
  assert.equal(stats.concepts.length, 2);
  assert.equal(stats.requestCount, 4);
  assert.equal(exportSession(createSession('adaptive')).datasetVersion, 'python-tracing-v2');
});
