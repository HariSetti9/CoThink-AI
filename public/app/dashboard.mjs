import { DOMAINS } from './domains.mjs';
import { PHASES, advance, canRequestAssistance, createSession, currentTask, exportSession, requestAssistance, submitAnswer } from './session.mjs';
import { summarize } from './analytics.mjs';

const $ = id => document.getElementById(id);
const descriptions = {
  adaptive: 'Uses your pre-test answers and confidence to choose the first help you see for each practice question.',
  interaction: 'Uses your attempts on the current exercise to adjust help.',
  fixed: 'Offers a curated hint whenever you ask for assistance.',
  direct: 'Shows a worked answer whenever you ask for assistance.',
  unaided: 'Work independently throughout the session. Practice gives correctness feedback after each attempt.',
};
const phaseGuidance = {
  practice: 'Choose Request assistance for help with this question.',
  transfer: 'Apply what you practised to a new question on your own.',
};
const helpReasons = {
  learner_override: 'You chose to see a worked answer.',
  direct_policy: 'This mode gives a worked answer when you ask for help.',
  fixed_policy: 'This mode gives a hint when you ask for help.',
  repeated_difficulty: 'You have tried this question twice. Here is a walkthrough.',
  first_difficulty: 'You have tried this question once. A hint can help with your next attempt.',
  interaction_default: 'This mode starts with a hint and adjusts after you try the question.',
  limited_evidence: 'There are too few pre-test responses on this topic, so the session starts with a hint.',
  confidence_above_probe_score: 'Your confidence on this topic was higher than your pre-test score, so the prompt asks you to verify your reasoning.',
  low_probe_score: 'Your pre-test answers suggest a worked answer may help with this topic.',
  mixed_probe_score: 'Some of your pre-test answers on this topic were correct, so the session starts with a hint.',
  high_probe_score: 'You did well on this topic in the pre-test, so the prompt asks you to explain your reasoning.',
};
const strategyLabels = { hint: 'Hint', verify: 'Verification', reflect: 'Reflection', worked: 'Worked answer' };
let session;

function phaseLabel(phase, mode) {
  return phase === 'practice' && mode === 'unaided' ? 'Unaided practice' : PHASES[phase];
}

function textElement(tag, text) {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
}

function renderJourney(activePhase, complete = false) {
  for (const row of document.querySelectorAll('[data-phase]')) {
    const phase = row.dataset.phase;
    const active = phase === activePhase;
    const done = complete || (activePhase && Object.keys(PHASES).indexOf(phase) < Object.keys(PHASES).indexOf(activePhase));
    if (active) row.setAttribute('aria-current', 'step');
    else row.removeAttribute('aria-current');
    row.querySelector('.phase-status').textContent = active ? 'In progress' : done ? 'Complete' : 'Pending';
  }
}

function renderTask() {
  const task = currentTask(session);
  const domain = session.domain;
  renderJourney(task.phase);
  $('stage').textContent = phaseLabel(task.phase, session.mode) + ' · ' + domain.concepts[task.concept];
  $('item-position').textContent = (session.index + 1) + ' / ' + domain.tasks.length;
  $('progress').value = session.index;
  $('question').textContent = task.prompt;
  $('phase-guide').textContent = task.phase === 'pre' ? domain.preGuide : task.phase === 'practice' && session.mode === 'unaided' ? 'Work through this task on your own.' : phaseGuidance[task.phase];
  $('passage').setAttribute('aria-label', domain.passageLabel);
  $('passage').classList.toggle('rule-passage', domain.id === 'reasoning');
  $('code').textContent = task.code;
  $('choices').replaceChildren(...task.choices.map((answer, index) => {
    const label = document.createElement('label');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'answer';
    radio.value = index;
    label.append(radio, document.createTextNode(answer));
    return label;
  }));
  $('confidence').value = 50;
  $('confidence').disabled = false;
  $('confidence-value').value = '50%';
  $('submit').disabled = false;
  $('help').hidden = $('override').hidden = !canRequestAssistance(session);
  $('next').hidden = true;
  $('feedback').textContent = '';
  $('question').focus();
}

function showAssistance(override) {
  const request = requestAssistance(session, override);
  if (!request) return;
  const task = currentTask(session);
  const messages = {
    worked: 'Worked answer · ' + task.choices[task.answer].replace(/\.$/, '') + '. ' + (task.explanation ?? task.hint),
    verify: 'Verification · ' + session.domain.verification,
    reflect: 'Reflection · ' + session.domain.reflection,
    hint: 'Hint · ' + task.hint,
  };
  const reason = textElement('span', 'Why this help? ' + helpReasons[request.reason]);
  reason.className = 'help-reason';
  $('feedback').replaceChildren(document.createTextNode(messages[request.strategy]), reason);
}

function showResults() {
  const domain = session.domain;
  const stats = summarize(session.logs, Object.keys(domain.concepts));
  const fraction = metric => metric.total ? metric.correct + ' / ' + metric.total : '—';
  const signedChange = (stats.change > 0 ? '+' : '') + stats.change.toFixed(1) + ' pp';
  const metrics = [
    ['Pre-test', fraction(stats.pre)], ['Unaided transfer', fraction(stats.transfer)],
    ['Score change', signedChange], ['Transfer Brier score', stats.brier.toFixed(3)],
    ['Practice first attempt', fraction(stats.firstPractice)], ['Practice first attempt, unaided', fraction(stats.firstUnaidedPractice)],
    ['Practice after retries', fraction(stats.practice)], ['Assistance requests', stats.requestCount],
  ];
  $('metrics').replaceChildren(...metrics.map(([label, value]) => {
    const card = document.createElement('div');
    card.className = 'metric';
    card.append(textElement('p', label), textElement('strong', value));
    return card;
  }));
  $('concept-results').replaceChildren(...stats.concepts.map(item => {
    const row = document.createElement('tr');
    const cell = textElement('th', domain.concepts[item.concept]);
    cell.scope = 'row';
    row.append(cell, textElement('td', fraction(item.pre)), textElement('td', fraction(item.transfer)));
    return row;
  }));
  $('strategy-results').replaceChildren(...[
    ...Object.entries(stats.strategies).map(([strategy, count]) => [strategyLabels[strategy], count]),
    ['Worked-answer overrides', stats.overrideCount],
  ].map(([label, count]) => {
    const row = document.createElement('div');
    row.append(textElement('dt', label), textElement('dd', count));
    return row;
  }));
  $('lesson').hidden = $('empty-results').hidden = true;
  $('finished').hidden = $('results').hidden = false;
  $('finished-domain').textContent = domain.label;
  $('finished-title').focus();
  renderJourney(null, true);
}

function selectedDomain() {
  return document.querySelector('input[name="domain"]:checked').value;
}

function updateSetup() {
  const domain = DOMAINS[selectedDomain()];
  const mode = $('mode').value;
  $('item-count').textContent = domain.tasks.length;
  $('concept-count').textContent = Object.keys(domain.concepts).length;
  $('progress').max = domain.tasks.length;
  $('mode-description').textContent = descriptions[mode];
  $('practice-label').textContent = phaseLabel('practice', mode);
  $('practice-description').textContent = mode === 'unaided' ? 'Work through new tasks independently.' : 'Request help as you work.';
}

$('domains').addEventListener('change', updateSetup);
$('mode').addEventListener('change', updateSetup);
updateSetup();
$('start').addEventListener('click', () => {
  session = createSession($('mode').value, selectedDomain());
  $('setup').hidden = true;
  $('lesson').hidden = false;
  renderTask();
});
$('restart').addEventListener('click', () => {
  $('finished').hidden = $('results').hidden = true;
  $('setup').hidden = $('empty-results').hidden = false;
  renderJourney();
  $('session-title').focus();
});
$('confidence').addEventListener('input', () => {
  $('confidence-value').value = $('confidence').value + '%';
});
$('answer-form').addEventListener('submit', event => {
  event.preventDefault();
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) {
    $('feedback').textContent = 'Select an answer first.';
    $('choices').querySelector('input').focus();
    return;
  }

  const task = currentTask(session);
  const result = submitAnswer(session, Number(selected.value), Number($('confidence').value));
  if (!result) return;
  if (!result.sealed) {
    selected.checked = false;
    $('feedback').textContent = canRequestAssistance(session) ? 'Try another answer or request assistance.' : 'Try another answer.';
    selected.focus();
    return;
  }

  const practiceText = result.correct ? 'Correct.' : 'Practice complete.';
  const explanation = session.domain.showPracticeExplanation && session.mode !== 'unaided' ? ' ' + task.hint : '';
  $('feedback').textContent = task.phase === 'practice' ? practiceText + explanation : 'Response recorded.';
  for (const input of $('choices').querySelectorAll('input')) input.disabled = true;
  $('submit').disabled = $('confidence').disabled = true;
  $('help').hidden = $('override').hidden = true;
  $('next').hidden = false;
  $('next').firstChild.textContent = session.index + 1 === session.domain.tasks.length ? 'View results ' : 'Next exercise ';
  $('next').focus();
});
$('help').addEventListener('click', () => showAssistance(false));
$('override').addEventListener('click', () => showAssistance(true));
$('next').addEventListener('click', () => {
  if (!advance(session)) return;
  if (currentTask(session)) renderTask();
  else showResults();
});
document.querySelector('.export-session').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(exportSession(session), null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cothink-session.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
