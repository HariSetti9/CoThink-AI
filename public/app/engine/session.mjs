import { chooseAssistance, MODES, POLICY_VERSION } from './policy.mjs';

export const APP_VERSION = '0.6';
export const PHASES = { pre: 'Independent pre-test', practice: 'Assisted practice', transfer: 'Unaided transfer' };
const MAX_PRACTICE_ATTEMPTS = 3;

export function createSession(mode, domain) {
  if (!Object.hasOwn(MODES, mode)) throw new RangeError('Unknown assistance policy');
  return { mode, domain, index: 0, logs: [], submissions: [], requests: [], sealed: false };
}

export function currentTask(session) {
  return session.domain.tasks[session.index];
}

export function submitAnswer(session, selected, confidence) {
  const task = currentTask(session);
  if (!task || session.sealed) return null;
  if (!Number.isInteger(selected) || selected < 0 || selected >= task.choices.length) return null;
  if (!Number.isInteger(confidence) || confidence < 0 || confidence > 100) return null;

  const correct = selected === task.answer;
  const assisted = session.requests.length > 0;
  session.submissions.push({ correct, confidence, assisted });
  if (task.phase === 'practice' && !correct && session.submissions.length < MAX_PRACTICE_ATTEMPTS) {
    return { correct, sealed: false };
  }

  session.sealed = true;
  session.logs.push({
    taskId: task.id,
    concept: task.concept,
    phase: task.phase,
    correct,
    confidence,
    attempts: session.submissions.length,
    assistance: session.requests.map(request => request.strategy),
    submissions: session.submissions.slice(),
    requests: session.requests.slice(),
  });
  return { correct, sealed: true };
}

export function canRequestAssistance(session) {
  return !session.sealed && session.mode !== 'unaided' && currentTask(session)?.phase === 'practice';
}

export function requestAssistance(session, override = false) {
  const task = currentTask(session);
  if (!canRequestAssistance(session)) return null;
  const failures = session.submissions.length;
  const probes = session.mode === 'adaptive'
    ? session.logs.filter(log => log.phase === 'pre' && log.concept === task.concept)
    : [];
  const decision = chooseAssistance({ mode: session.mode, override, failures, probes });
  const request = { ...decision, override, afterAttempts: failures };
  session.requests.push(request);
  return request;
}

export function advance(session) {
  if (!session.sealed) return false;
  session.index++;
  session.sealed = false;
  session.submissions = [];
  session.requests = [];
  return true;
}

export function exportSession(session) {
  return {
    version: APP_VERSION,
    schemaVersion: 2,
    policyVersion: POLICY_VERSION,
    datasetVersion: session.domain.datasetVersion,
    domain: session.domain.id,
    mode: session.mode,
    logs: session.logs,
  };
}
