# Logical reasoning testbed

## Construct and why this domain

This testbed measures whether a conclusion follows from one stipulated propositional implication and one fact. The construct is formal conditional inference. It requires ordinary reading rather than Python syntax and has a machine-checkable answer. It provides a different task domain for software reuse and a measure of **near transfer** to new contexts using the same logical operations. It supports neither general intelligence nor cross-domain learning claims.

[Evans (1993)](https://doi.org/10.1016/0010-0277(93)90056-2) surveys four common conditional inferences and shows why phrasing and negation are relevant. Items explicitly ask what must follow from given information. Object properties are stipulated as a local rule and participants are instructed to use only that rule and the fact. Neutral fictional combinations reduce reliance on familiar causal knowledge. They do not eliminate interpretation differences.

| Family | Given `P → Q` and | Target conclusion | Result |
| --- | --- | --- | --- |
| Modus ponens | P | Q | Must be true |
| Modus tollens | ¬Q | ¬P | Must be true |
| Affirming the consequent | Q | P | Cannot determine |
| Denying the antecedent | ¬P | Q | Cannot determine |

## Blueprint

The versioned demo has eight diagnostic, eight practice and eight transfer items. Each phase has two items from each family and four for facts about each clause. Contexts are distinct across forms. Each correct answer position appears eight times in the full bank and two or three times per phase. The alternatives are the positive target, the negative target and insufficient information. Each independent item is scored once, without help or correctness feedback. The practice arm labels reflect the assistance policy, and confidence is captured separately from correctness. Study materials should require an explicit confidence entry or a preregistered missing-value rule.

## Verification and remaining validity work

- Executable checks exhaust all four truth assignments for every item, retain assignments compatible with its implication and fact, and independently derive the answer. The checks cover consistent premises, unique displayed options, phase and family balance, disjoint contexts, and answer-position balance. This establishes formal answer-key correctness.
- Surface variation is deliberately modest. Half of the keys are insufficient-information responses by design; this can create a cue with repeated exposure. Negation, interpretation of conditionals, wording, reading difficulty, ceiling/floor effects, and repeated exposure are threats to validity. Three 8-item schedules are demo forms with matched structure. Equivalence is unestablished.
- Before human testing, prepare fresh, private A/B/C forms, with equivalent family coverage and balanced item positions, plus a distinct practice bank. Use expert reviews for wording, pragmatic ambiguity, accessibility, distractors and construct relevance. Maintain a revision log. After ethics clearance and consent, run a feasibility pilot with cognitive interviews or think-alouds, item difficulty and discrimination checks, form-order and confidence checks, reliability estimates with uncertainty, and floor/ceiling and completion-time checks. Where feasible include open explanations with a blinded rubric. Redesign items with misinterpretations or position cues. Freeze the forms and analysis before confirmation.

Scores and test runs from this bank are descriptive or synthetic, with no human learning claim. Use a protected study version for all participant-facing assessments.
