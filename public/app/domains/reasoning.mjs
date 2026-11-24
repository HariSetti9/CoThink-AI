const concepts = {
  antecedent: 'Facts about the if clause',
  consequent: 'Facts about the then clause',
};

const forms = {
  mp: { observed: 'p', value: true, target: 'q', key: 'true', rationale: 'When the if clause is true, the stated rule requires the then clause to hold.' },
  da: { observed: 'p', value: false, target: 'q', key: 'unknown', rationale: 'When the if clause is false, the rule leaves the then clause open.' },
  ac: { observed: 'q', value: true, target: 'p', key: 'unknown', rationale: 'The rule allows the then clause to hold even when the if clause is false.' },
  mt: { observed: 'q', value: false, target: 'p', key: 'false', rationale: 'If the if clause were true, the then clause would have to be true, contradicting the fact.' },
};

const scenarios = {
  pre: [
    ["amber-panel","mp","the panel is amber","the panel is not amber","the panel has a triangle","the panel has no triangle"],
    ["archive-label","ac","the folder contains a map","the folder does not contain a map","the folder has a blue label","the folder has no blue label"],
    ["silver-clasp","da","the case has a silver clasp","the case has no silver clasp","the case has a front tab","the case has no front tab"],
    ["striped-badge","mt","the badge is hexagonal","the badge is not hexagonal","the badge has a white stripe","the badge has no white stripe"],
    ["ceramic-tile","ac","the tile is ceramic","the tile is not ceramic","the tile has a black border","the tile has no black border"],
    ["red-cap","mp","the bottle has a red cap","the bottle has no red cap","the bottle has a round label","the bottle has no round label"],
    ["woven-ribbon","mt","the ribbon is woven","the ribbon is not woven","the ribbon has a dot pattern","the ribbon has no dot pattern"],
    ["oak-drawer","da","the drawer is made of oak","the drawer is not made of oak","the drawer has a brass handle","the drawer has no brass handle"],
  ],
  practice: [
    ["gold-token","da","the token is gold","the token is not gold","the token has a square mark","the token has no square mark"],
    ["green-envelope","mt","the envelope has a triangle seal","the envelope has no triangle seal","the envelope has a green sticker","the envelope has no green sticker"],
    ["marked-cup","mp","the cup has a curved handle","the cup does not have a curved handle","the cup has a star mark","the cup has no star mark"],
    ["folded-card","ac","the card is folded","the card is not folded","the card has a striped edge","the card has no striped edge"],
    ["purple-spool","mt","the spool is purple","the spool is not purple","the spool has a letter A on it","the spool has no letter A on it"],
    ["etched-key","da","the key has an etched number","the key has no etched number","the key has a round head","the key does not have a round head"],
    ["canvas-bag","ac","the bag is canvas","the bag is not canvas","the bag has a green loop","the bag has no green loop"],
    ["square-label","mp","the label is square","the label is not square","the label has two dots","the label does not have two dots"],
  ],
  transfer: [
    ["wooden-ruler","mt","the ruler is wooden","the ruler is not wooden","the ruler has a red end","the ruler has no red end"],
    ["ornament","mp","the ornament has a spiral","the ornament has no spiral","the ornament is painted white","the ornament is not painted white"],
    ["clip-box","ac","the box has a metal clip","the box has no metal clip","the box has a purple lid","the box does not have a purple lid"],
    ["felt-patch","da","the patch is felt","the patch is not felt","the patch has a silver edge","the patch has no silver edge"],
    ["desk-tray","mp","the tray is oval","the tray is not oval","the tray has a blue stamp","the tray has no blue stamp"],
    ["white-stud","da","the band has a white stud","the band has no white stud","the band has an arrow symbol","the band has no arrow symbol"],
    ["printed-marker","ac","the marker has a printed number","the marker has no printed number","the marker is orange","the marker is not orange"],
    ["small-lantern","mt","the lantern has a paper shade","the lantern has no paper shade","the lantern has a striped base","the lantern does not have a striped base"],
  ],
};

// Each phase has balanced answer positions in a non-cyclic order.
const answerPositions = [
  1, 2, 0, 2, 1, 0, 1, 0,
  2, 0, 1, 0, 2, 1, 2, 1,
  0, 2, 1, 2, 0, 1, 2, 0,
];

const sentence = text => text[0].toUpperCase() + text.slice(1) + '.';
const formatFact = (statement, value) => sentence(statement[value ? 0 : 1]);

function buildTask(phase, row, ordinal) {
  const [context, pattern, pTrue, pFalse, qTrue, qFalse] = row;
  const statements = { p: [pTrue, pFalse], q: [qTrue, qFalse] };
  const { observed, value, target, key, rationale } = forms[pattern];
  const labels = {
    true: formatFact(statements[target], true),
    false: formatFact(statements[target], false),
    unknown: 'Cannot determine from the rule and the fact.',
  };
  const optionKeys = Object.keys(labels).filter(option => option !== key);
  if (ordinal % 2) optionKeys.reverse();
  optionKeys.splice(answerPositions[ordinal], 0, key);
  return {
    id: 'logic-' + context,
    phase,
    concept: observed === 'p' ? 'antecedent' : 'consequent',
    prompt: 'What must follow?',
    code: 'Rule · If ' + pTrue + ', then ' + qTrue + '.\nFact · ' + formatFact(statements[observed], value),
    choices: optionKeys.map(option => labels[option]),
    answer: optionKeys.indexOf(key),
    hint: observed === 'p'
      ? 'Check what the rule requires when its if clause has the stated value.'
      : 'Test each possible value of the if clause against both the rule and the fact.',
    explanation: rationale,
    assessment: { context, pattern, observed, value, target, optionKeys, labels },
  };
}

export const REASONING_DOMAIN = {
  id: 'reasoning',
  label: 'Logical reasoning',
  description: 'Decide what follows from a rule and a fact.',
  passageLabel: 'Rule and fact',
  concepts,
  datasetVersion: 'propositional-reasoning-v1',
  showPracticeExplanation: false,
  preGuide: 'Use the stated rule and fact. Consider only conclusions that must be true.',
  verification: 'Try to find a case where your conclusion fails while the rule and the fact still hold.',
  reflection: 'Explain why the rule and the fact together support your choice.',
  tasks: Object.entries(scenarios).flatMap(([phase, rows], form) =>
    rows.map((row, index) => buildTask(phase, row, form * rows.length + index))),
};
