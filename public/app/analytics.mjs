import { DOMAINS } from './domains.mjs';
import { summarize as summarizeEngine } from './engine/analytics.mjs';

export function summarize(logs, conceptIds = Object.keys(DOMAINS.python.concepts)) {
  return summarizeEngine(logs, conceptIds);
}
