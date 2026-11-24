import { CONCEPTS } from './tasks.mjs';

function score(logs, predicate = log => log.correct) {
  const correct = logs.filter(predicate).length;
  return { correct, total: logs.length, pct: logs.length ? 100 * correct / logs.length : null };
}

export function summarize(logs, concepts = Object.keys(CONCEPTS)) {
  const pre = logs.filter(log => log.phase === 'pre');
  const practice = logs.filter(log => log.phase === 'practice');
  const transfer = logs.filter(log => log.phase === 'transfer');
  const before = score(pre);
  const after = score(transfer);
  const requests = practice.flatMap(log => log.requests ?? []);
  const firstAttempts = practice.filter(log => log.submissions?.length);
  return {
    pre: before,
    practice: score(practice),
    firstPractice: score(firstAttempts, log => log.submissions[0].correct),
    firstUnaidedPractice: score(firstAttempts.filter(log => !log.submissions[0].assisted), log => log.submissions[0].correct),
    transfer: after,
    change: before.pct === null || after.pct === null ? null : after.pct - before.pct,
    brier: transfer.length
      ? transfer.reduce((sum, log) => sum + (log.confidence / 100 - Number(log.correct)) ** 2, 0) / transfer.length
      : null,
    requestCount: practice.reduce((sum, log) => sum + (log.requests?.length ?? log.assistance?.length ?? 0), 0),
    overrideCount: requests.filter(request => request.override).length,
    strategies: Object.fromEntries(['hint', 'verify', 'reflect', 'worked'].map(strategy => [
      strategy, practice.reduce((sum, log) => sum + (log.assistance ?? []).filter(value => value === strategy).length, 0),
    ])),
    concepts: concepts.map(concept => ({
      concept,
      pre: score(pre.filter(log => log.concept === concept)),
      transfer: score(transfer.filter(log => log.concept === concept)),
    })),
  };
}
