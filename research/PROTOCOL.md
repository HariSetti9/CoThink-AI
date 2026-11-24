# Draft study protocol for the Python testbed

For the candidate multi-domain design, see [the evaluation framework](EVALUATION.md). This earlier Python-specific design documents the planned probe ablation.

**Status:** Design for review. Recruitment and participant data collection require prior institutional ethics approval and consent. The public v0.5 demo is for demonstration.

## Question and estimand

Among consenting adult introductory programming learners, what is the intention-to-treat effect of assignment to probe-informed assistance vs interaction-only assistance on the immediate unaided transfer score? The prespecified unit is the learner. The comparison estimates the effect of assigning the entire policy, including any downstream changes in requests and overrides.

## Design

1. Collect a validated independent baseline form with confidence per item. Use balanced blocks within preregistered baseline strata, with assignment concealed until baseline submission. Persist participant allocation in the study system. Equalize study instructions, environment, duration, items, curated help templates, options to request help and overrides, and practice scoring.
2. In the probe-informed arm, baseline correctness and confidence determine initial strategy within concept. The interaction-only arm starts with a generic hint. Both arms supply the same escalation after the first and second errors. Freeze policy version and item bank before the confirmatory study. Keep the model provider disabled.
3. Administer a held-out, unaided immediate assessment. Hide item keys server-side and withhold correctness feedback until assessments close. Add an equivalent follow-up form at seven days where feasible. Use common proctoring and accessibility accommodations in both arms. Prespecify task equivalence and permissible tools.
4. Use blinded assessors where responses require human scoring. Audit an overlapping subset using a prespecified rubric and report agreement. The protocol remains compatible with machine-scored tracing responses and should include separate code-writing tasks if the claim extends to code production.

## Outcome specification and analysis

| Role | Outcome | Definition |
| --- | --- | --- |
| Primary | Immediate unaided transfer | Percentage correct on a frozen held-out form, scored using a preregistered rubric. Raw between-arm difference and baseline-adjusted effect in percentage points with 95% CI. |
| Secondary | Delayed transfer | Unaided score on the seven-day form, with a prespecified attendance window and missingness report. |
| Secondary | Calibration | Mean squared difference between predicted probability and correctness over independent assessment items. |
| Secondary | Practice process | First-attempt accuracy, first-attempt accuracy with no earlier help request, final practice accuracy, request counts, strategy exposure, worked-answer overrides, and time if approved. |
| Secondary | Workload | Use a validated instrument with the administration point and scoring specified before enrollment. |

Primary analysis uses linear regression of transfer percentage on assigned arm, baseline score, and declared assignment strata/covariates, with robust standard errors. Preserve random assignment in analysis. Report enrollment, exclusions defined before assignment where possible, completion by arm and reasons for missing outcomes. Prespecify a missing-data strategy and complete-case sensitivity analysis, with additional sensitivity checks if attrition differs. Treat subgroup interactions, mediation and exploratory outcomes as exploratory unless prespecified with suitable power. Follow the same reporting plan for positive, null and negative effects.

Define the smallest educationally meaningful effect with the study lead. Use external evidence and a feasibility pilot to select a plausible outcome variance, baseline correlation and attrition range. Run sensitivity-based sample-size calculations, account for clustering if recruiting by section, and specify a stopping rule and target before confirmatory enrollment. Avoid using an underpowered pilot effect as the sole power assumption.

### Reproducible planning sensitivity

Run `python research/power_sensitivity.py` for a CSV grid. Its assumptions are individually randomized equal groups, a two-sided normal approximation, common outcome variance, and a single baseline predictor. The effect input is a difference divided by the unadjusted outcome standard deviation. The variance reduction is approximated by 1 minus squared baseline–outcome correlation. The script rounds up the analyzable count before inflating it for expected attrition.

The default inputs are illustrative, with no participant data or recommended recruitment target. For example, an effect of 0.4 standard deviations, baseline correlation 0.4, 80% power and 15% expected attrition yields 83 analyzable and 98 recruited learners per arm. Choose an effect and variance on substantive grounds and verify the final design by simulation, especially for ceiling effects, clustering or differential missingness.

## Instrument development and release gate

- Start with expert item-by-concept review by two introductory Python educators. Review correctness, clarity, accessibility, distractor plausibility, transfer demand and unintended cues. Hold out new items and balance option positions, concepts and difficulty across parallel forms.
- After approval, use a feasibility pilot to check item difficulty, discrimination, completion time, confidence response rates, reliability and floor/ceiling effects across forms. Record revisions and freeze scoring and policies after review. The public 24-item bank has reproducible Python answer keys and balanced phase/concept counts. Its items primarily assess code tracing and show no established equivalence or psychometric validity.
- Build and verify a protected study workflow with server-side allocation and keys, approved consent copy, pseudonymous study IDs, and versioned datasets and analysis. The demo's freely selected modes and inspectable answers preclude that use.
- Document consent, retention, deletion, access and oversight with the institution before collecting data. Limit collection to approved items. Keep consent records separate from study responses. Do not transfer participant responses to a model provider without explicit approval and disclosure.

## Manuscript record

Methods can presently describe the research question, comparator, policy code, data schema, and the verified software and task checks. The Results section must remain pending until the preregistered study yields data. Disclose ChatGPT assistance with code, draft items, documentation and literature triage. Authors are responsible for source verification, research design, eligibility, analysis and final statements.
