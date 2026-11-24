import { createSession as createEngineSession } from './engine/session.mjs';
import { DOMAINS } from './domains.mjs';

export { APP_VERSION, PHASES, advance, canRequestAssistance, currentTask, exportSession, requestAssistance, submitAnswer } from './engine/session.mjs';

export function createSession(mode, domainId = 'python') {
  if (!Object.hasOwn(DOMAINS, domainId)) throw new RangeError('Unknown task domain');
  return createEngineSession(mode, DOMAINS[domainId]);
}
