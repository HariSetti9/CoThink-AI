export const POLICY_VERSION = 'caap-0.5';
export const MODES = {
  adaptive: 'Competence-aware',
  interaction: 'Interaction-only',
  fixed: 'Fixed hints',
  direct: 'Direct answers',
};

export function chooseAssistance({ mode, override, failures, probes }) {
  if (override) return { strategy: 'worked', reason: 'learner_override' };
  if (mode === 'direct') return { strategy: 'worked', reason: 'direct_policy' };
  if (mode === 'fixed') return { strategy: 'hint', reason: 'fixed_policy' };
  if (failures >= 2) return { strategy: 'worked', reason: 'repeated_difficulty' };
  if (failures === 1) return { strategy: 'hint', reason: 'first_difficulty' };
  if (mode === 'interaction' || probes.length < 2) {
    return { strategy: 'hint', reason: mode === 'interaction' ? 'interaction_default' : 'limited_evidence' };
  }

  const score = 100 * probes.filter(probe => probe.correct).length / probes.length;
  const confidence = probes.reduce((sum, probe) => sum + probe.confidence, 0) / probes.length;
  if (confidence - score >= 30) return { strategy: 'verify', reason: 'confidence_above_probe_score' };
  if (score < 40) return { strategy: 'worked', reason: 'low_probe_score' };
  if (score < 75) return { strategy: 'hint', reason: 'mixed_probe_score' };
  return { strategy: 'reflect', reason: 'high_probe_score' };
}
