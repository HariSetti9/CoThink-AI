import { CONCEPTS, TASKS } from './tasks.mjs';
import { PHASES, advance, createSession, currentTask, exportSession, requestAssistance, submitAnswer } from './session.mjs';
import { summarize } from './analytics.mjs';

const $ = id => document.getElementById(id);
const descriptions = {
  adaptive: 'Adjusts the first suggestion using your pre-test responses. Help escalates when you get stuck.',
  interaction: 'Uses your attempts on the current exercise to adjust help.',
  fixed: 'Offers a curated hint whenever you ask for assistance.',
  direct: 'Shows a worked answer whenever you ask for assistance.',
};
const strategyLabels = { hint: 'Hint', verify: 'Verification', reflect: 'Reflection', worked: 'Worked answer' };
let session;

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
  renderJourney(task.phase);
  $('stage').textContent = PHASES[task.phase] + ' · ' + CONCEPTS[task.concept];
  $('item-position').textContent = (session.index + 1) + ' / ' + TASKS.length;
  $('progress').value = session.index;
  $('question').textContent = task.prompt;
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
  $('help').hidden = $('override').hidden = task.phase !== 'practice';
  $('next').hidden = true;
  $('feedback').textContent = '';
  $('question').focus();
}

function showAssistance(override) {
  const request = requestAssistance(session, override);
  if (!request) return;
  const task = currentTask(session);
  const messages = {
    worked: 'Worked answer · ' + task.choices[task.answer] + '. ' + task.hint,
    verify: 'Verification · Trace the expression one step at a time, then compare your prediction with the answer choices.',
    reflect: 'Reflection · Which Python rule explains your choice? Try stating the rule before submitting.',
    hint: 'Hint · ' + task.hint,
  };
  $('feedback').textContent = messages[request.strategy];
}

function showResults() {
  const stats = summarize(session.logs);
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
    const cell = textElement('th', CONCEPTS[item.concept]);
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
  $('finished-title').focus();
  renderJourney(null, true);
}

$('item-count').textContent = TASKS.length;
$('concept-count').textContent = Object.keys(CONCEPTS).length;
$('progress').max = TASKS.length;
$('mode').addEventListener('change', () => {
  $('mode-description').textContent = descriptions[$('mode').value];
});
$('mode').dispatchEvent(new Event('change'));
$('start').addEventListener('click', () => {
  session = createSession($('mode').value);
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
    $('feedback').textContent = 'Try another answer or request assistance.';
    selected.focus();
    return;
  }

  $('feedback').textContent = task.phase === 'practice'
    ? (result.correct ? 'Correct. ' : 'Practice complete. ') + task.hint
    : 'Response recorded.';
  for (const input of $('choices').querySelectorAll('input')) input.disabled = true;
  $('submit').disabled = $('confidence').disabled = true;
  $('help').hidden = $('override').hidden = true;
  $('next').hidden = false;
  $('next').firstChild.textContent = session.index + 1 === TASKS.length ? 'View results ' : 'Next exercise ';
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
