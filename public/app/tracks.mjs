import { CONCEPTS, DATASET_VERSION, TASKS } from './tasks.mjs';
import { CODING_DATASET_VERSION, CODING_TASKS } from './coding-tasks.mjs';

export const TRACKS = {
  coding: {
    datasetVersion: CODING_DATASET_VERSION,
    tasks: CODING_TASKS,
  },
  tracing: {
    datasetVersion: DATASET_VERSION,
    tasks: TASKS,
  },
};

export function trackConcepts(track) {
  const used = new Set(TRACKS[track].tasks.map(task => task.concept));
  return Object.keys(CONCEPTS).filter(concept => used.has(concept));
}
