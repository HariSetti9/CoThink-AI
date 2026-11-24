import { CONCEPTS, DATASET_VERSION, TASKS } from '../tasks.mjs';

export const PYTHON_DOMAIN = {
  id: 'python',
  label: 'Python code tracing',
  description: 'Predict what short programs print.',
  passageLabel: 'Python code',
  concepts: CONCEPTS,
  datasetVersion: DATASET_VERSION,
  showPracticeExplanation: true,
  preGuide: 'Predict the output on your own, then rate how sure you are.',
  verification: 'Trace the expression one step at a time, then compare your prediction with the answer choices.',
  reflection: 'Which Python rule explains your choice? Try stating the rule before submitting.',
  tasks: TASKS,
};
