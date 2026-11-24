# Evaluation framework for adaptive assistance

## Study question

Does access to competence-aware assistance improve **immediate unaided near transfer** versus fixed hints, while comparing both approaches with direct answers and unaided practice? The assignment unit is an adult participant. Estimate the intention-to-treat difference in mean transfer percentage points for the offered policy. Preselection and confidence are evidence about a task, with uncertain generalization beyond it.

| Arm | Assistance during practice | Interpretation |
| --- | --- | --- |
| Adaptive | When requested, selects from the shared support library using baseline competence and confidence, then local errors | Candidate intervention |
| Fixed | When requested, gives the same task-specific hint across people | Primary active control |
| Direct answers | When requested, shows the correct response with its rationale | Tests direct help under the same availability policy |
| Unaided practice | Practice tasks and attempt budget match the other arms. No assistance prompts or worked solutions. | Estimates independent practice with common basic outcome feedback |
| Interaction-only (optional follow-up) | Starts with a hint and shares adaptive's escalation after local errors. Baseline probes are collected in both arms. | Isolates the added value of pre-test evidence, beyond the main comparison |

## Proposed implementation

1. Begin with the reasoning instrument described in [the assessment blueprint](REASONING_ASSESSMENT.md). Obtain expert-reviewed parallel baseline, immediate and delayed forms with unexposed contexts and a distinct practice bank. Set the protocol population and accessible instructions before recruitment. Treat Python as a separately powered replication if feasible. Analyze domain-specific estimates and report them with uncertainty. A domain-by-condition contrast requires a design with power for that interaction.
2. After ethics approval and informed consent, collect a baseline before revealing allocation. Randomize with concealed balanced blocks, stratified by preregistered baseline bands and site if relevant. The study system persists allocation and locks content, assistance mode, provider, settings and scoring. Allow the same attempt budget, time, task order, confidence instructions and correctness-only practice feedback across arms. Use the same help button and timing in the three assisted arms. Remove optional worked-answer overrides for the study so they cannot turn the fixed-hint arm into direct assistance. Record opportunity to request, actual use, strategy and timing.
3. At immediate and delayed follow-ups, use held-out tasks running without AI or correctness feedback. Counterbalance form order within arm where feasible, using the private practice bank. Offer equivalent accommodations in all arms. Use server-side keys and log only approved study fields. Pair the quantitative study with a small consented feasibility pilot for wording, timing and attrition. Score open-response items with an agreed rubric and blinded raters.
4. Before confirmatory registration, freeze policy thresholds, tasks, scoring, assignment method, outcomes, minimal meaningful effect, stopping rule, planned sample sizes and missing-data rules. Use the existing [power sensitivity script](power_sensitivity.py) for the primary two-arm contrast as a first planning approximation. Power the final four-arm design with simulation of the primary contrast, finite item counts, baseline association, assignment blocks and plausible attrition. Simulate additional contrasts if they are intended to support formal claims.

## Measures and analysis

- **Primary outcome.** Immediate held-out correctness percentage. Regress on assigned arm, baseline score, form order, and prespecified strata. Report raw means and adjusted differences with robust 95% confidence intervals. The primary contrast is adaptive vs fixed. Secondary pairwise contrasts of adaptive vs direct and adaptive vs unaided use Holm adjustment within that family.
- **Secondary outcomes.** Seven-day delayed transfer with a preregistered window, confidence calibration including Brier score, first-attempt and final practice accuracy, usage, elapsed time, and workload using a prespecified validated scale. Report speed and accuracy separately. Use item-level sensitivity models if floor or ceiling effects are material.
- **Missing data.** Report flow and missingness by randomized arm. Predefine an imputation model using available baseline/arm covariates, a complete-case sensitivity, and a departure-from-missing-at-random sensitivity for substantive differential attrition. Treat outcomes and subgroups beyond the registered plan as exploratory.
- **Appropriate reliance.** Request counts and unaided gains cannot measure acceptance of erroneous advice. Use a separate approved task with initial choice, independently known advice correctness and final choice. Estimate acceptance of correct advice and rejection of incorrect advice on eligible trials separately. Preregister exposure, exclusions and debriefing. Public curated help uses correct keys, so its event logs do not estimate these measures.

The public demo exposes its keys and lets a visitor select modes. It can verify software behavior and illustrate the study contrasts. The protocol requires protected recruitment and scoring, participant approval, expert and pilot validation, and a completed controlled study for empirical claims.
