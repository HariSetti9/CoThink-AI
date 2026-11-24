import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { CONCEPTS, TASKS } from '../public/app/tasks.mjs';
import { PHASES } from '../public/app/session.mjs';

test('stable IDs, unique snippets and balanced phase/concept coverage', () => {
  assert.equal(TASKS.length, 24);
  assert.equal(new Set(TASKS.map(task => task.id)).size, TASKS.length);
  assert.equal(new Set(TASKS.map(task => task.code)).size, TASKS.length);
  for (const phase of Object.keys(PHASES)) {
    for (const concept of Object.keys(CONCEPTS)) {
      assert.equal(TASKS.filter(task => task.phase === phase && task.concept === concept).length, 2);
    }
  }
  assert.deepEqual([...new Set(TASKS.map(task => task.phase))], Object.keys(PHASES));
});

for (const task of TASKS) {
  test('Python reference output for ' + task.id, () => {
    assert.equal(task.choices.length, 3);
    assert.equal(new Set(task.choices).size, 3);
    assert.ok(task.hint.length);
    const result = spawnSync(process.env.COTHINK_PYTHON ?? 'python', ['-I', '-c', task.code], { encoding: 'utf8', timeout: 3000 });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    const normalize = text => text.trim().replaceAll(/,\s+/g, ',');
    assert.equal(normalize(result.stdout), normalize(task.choices[task.answer]));
  });
}
