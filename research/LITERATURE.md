# Literature review and research log

Search date: 24 November 2026. This is a focused evidence map with publisher pages, academic indexes, and publicly available abstracts. It is a working review with selective full-text access; publication-level coverage remains open.

## Search record

| Stream | Search concepts | Entry points |
| --- | --- | --- |
| Learner modeling | knowledge tracing, independent proficiency probes, confidence, expertise reversal | Springer journal record, institutional repository |
| Assistance design | assistance dilemma, worked-example fading, code-tracing tutor, Python hints | Journal records, ACM / author-hosted abstracts |
| Generative assistance | novice programming hints, programming transfer and retention, adaptive scaffolding, matched-peer student models | ACM conference material, PMLR, PubMed, arXiv |
| Closest-work check | programming + prior knowledge or diagnostic pre-test + adaptive hint levels + unaided transfer, then exact-title checks | DOI records, ACM venue page, arXiv |

Included sources address the learner signal, design of help, independent outcome, or a direct programming analogue. Peer-reviewed articles and proceedings inform the primary map. Preprints and venue abstracts are identified separately. Purely model-accuracy benchmarks and opinion pieces were outside this pass. A systematic review would require database exports, duplicate screening, independent eligibility judgments, and backward/forward citation tracking.

## Evidence and overlap

| Study | Relevant design or finding | Consequence for CoThink |
| --- | --- | --- |
| [Corbett & Anderson, 1994](https://doi.org/10.1007/BF01099821) | The ACT Programming Tutor estimates rule-level learning from task performance and uses its estimates to individualize exercises. | Knowledge-based learner models in programming have long-standing precedent. Two probes per concept are a limited proxy. |
| [Koedinger & Aleven, 2007](https://doi.org/10.1007/s10648-007-9049-0) | Studies the assistance dilemma with Cognitive Tutors. | Test support allocation and learning outcomes together. |
| [Kalyuga & Renkl, 2010](https://doi.org/10.1007/s11251-009-9102-0) | Reviews theory and evidence on relationships between prior knowledge and instructional design. | Baseline moderation is plausible, with direction and size requiring evidence in this setting. |
| [Na Nongkhai, Wang & Mendori, 2025](https://doi.org/10.3390/educsci15060724) | ADVENTURE uses concept-specific pre-tests to set initial exercise difficulty, then updates it with performance. The classroom comparison tested adaptive vs random exercise assignment and analyzed practice submissions. | Direct precedent for probe-informed programming adaptation. The proposed contrast is initial help strategy at matched exercise difficulty, compared against shared interaction rules and assessed on held-out unaided transfer. |
| [Huang et al., 2023](https://doi.org/10.1111/jcal.12757) | Trace Table Tutor compares two student models and uses unaided assessments without trace tables. The tutors also differ in hints and problem sequencing. | Strong code-tracing and transfer precedent. A controlled comparison should freeze exercise sequence and help templates. |
| [Price et al., AIED 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7334677/) | A controlled classroom evaluation of data-driven Python hints reported no overall improvement in performance or learning. | Include null evidence when setting expectations and planning power. |
| [Jennings & Muldner, 2021](https://doi.org/10.1007/s40593-020-00217-z) | Varied interface scaffolding and the order of worked examples and problem solving in a code-tracing tutor. Reported differences across learner subgroups. | Closest domain analogue. Examine its grouping variables and assessments carefully before claiming a contribution. |
| [Amershi et al., CHI 2019](https://doi.org/10.1145/3290605.3300233) | Provides human–AI interaction guidelines for control and feedback. | Give overrides a consistent interface and make override use measurable. |
| [Kazemitabaar et al., CHI 2023](https://doi.org/10.1145/3544548.3580919) | Controlled novice-Python study compared code generator access and included a one-week retention assessment. | Independent assessment and delayed follow-up have direct precedent in introductory programming. |
| [Kazemitabaar et al., CHI 2024](https://doi.org/10.1145/3613904.3642773) | CodeAid deployed assistance that offers explanations, pseudocode and feedback in a programming course. | Guardrails and instructional support are established designs. |
| [Xiao, Hou & Stamper, CHI EA 2024](https://doi.org/10.1145/3613905.3650937) | Think-aloud study used four levels of programming hints and found that different levels supported different needs. | Multiple hint levels are established. A comparison must isolate the assignment signal. |
| [Bastani et al., PNAS 2025](https://doi.org/10.1073/pnas.2422633122) | Mathematics study measured work with AI and performance after AI removal. | Distinguish assisted performance from unaided learning. Transfer across domains requires evidence. |
| [Heickal & Lan, PMLR workshop 2026](https://proceedings.mlr.press/v339/heickal26a.html) | Randomized classroom feedback protocol compared hints, generated failing tests, and no AI feedback after incorrect Python submissions. | Relevant feedback benchmark. Its reported completion outcomes differ from the proposed held-out transfer endpoint. |
| [Hou et al., arXiv preprint 2026](https://arxiv.org/abs/2609.22993) | CoMeT uses learner decisions to escalate and fade help in Python tasks, per the preprint abstract. | Strong mechanism overlap with interaction-based adaptation. Include it in the next full-text comparison. |
| [Matched-Peer Study, SIGCSE Virtual 2026 venue abstract](https://sigcsevirtual2026.acm.org/details/sigcse-virtual-2026-papers/24/Do-LLM-Student-Models-Track-the-Student-or-the-Situation-A-Matched-Peer-Study-in-Nov) | Tests whether student-model predictions distinguish learners facing matched Python assessment states. | Justifies checking that the policy reacts to a learner signal when task context is held constant. |

## Candidate contribution

The defensible question is whether **adding independent, concept-specific diagnostic responses to a transparently specified assistance policy** improves held-out unaided programming transfer relative to an otherwise equivalent interaction-only policy. Both groups take identical diagnostic probes. Both have identical tasks, help content, feedback opportunities and post-error escalation. Only the initial help decision uses probe performance and confidence in the probe-informed group.

This is a proposed causal comparison. Concept-level pre-tests already inform adaptive exercise selection in ADVENTURE. Adaptivity, confidence-sensitive feedback, escalation and independent assessment have overlapping precedents. The specific thresholds are transparent heuristics, with no novelty or effectiveness established. v0.5 verifies the contrast in software, where probe changes affect early recommendations only in the probe-informed arm. Human effects need a study. Because performance and confidence enter together, an observed primary effect would identify their combined value. A correctness-only ablation can distinguish their contributions in a separately powered follow-up.

Before any novelty claim, complete full-text comparison of Jennings & Muldner and CoMeT, and trace newer work citing ADVENTURE and Trace Table Tutor, search forward citations and AIED/EDM/ICER/SIGCSE proceedings, and log studies that already combine independent probes, a matched interaction-only comparator, and held-out transfer. Maintain the research question as an evaluation or replication if close prior work is found.

## Cross-domain evidence update, 24 November 2026

The additional search paired adaptive support and prior competence with human–AI collaboration, offloading, reliance, cognitive forcing and conditional inference. Sources came from ACM records, original publisher or institutional pages, and PubMed. Earlier programming tutoring searches and notes remain above. This is a targeted evidence map with selective full-text review.

| Source | What the work establishes | Relevance to CoThink |
| --- | --- | --- |
| [Risko & Gilbert, 2016](https://doi.org/10.1016/j.tics.2016.07.002) | Reviews how people use external action to shift cognitive demands. | External help can be productive. Assisted success alone cannot identify lasting skill or undesirable offloading. |
| [Bansal et al., CHI 2021](https://www.microsoft.com/en-us/research/publication/does-the-whole-exceed-its-parts-the-effect-of-ai-explanations-on-complementary-team-performance/) | Tests explanations and complementary team performance. Explaining the recommendation did not reliably improve the joint outcome. | Display decision reasons for transparency and separately measure the effect on behavior. |
| [Buçinca, Malaya & Gajos, CSCW 2021](https://doi.org/10.1145/3449287) | Experiment compares cognitive forcing with explainable AI and an unaided condition. Reports lower overreliance in some forcing designs and a usability trade-off. | The mechanism of prompting reasoning has established precedent. Measure both performance and workload. |
| [Schemmer et al., IUI 2023](https://doi.org/10.1145/3581641.3584066) | Defines separate appropriate-reliance measures for correct and incorrect advice. | A reliance experiment needs independently verified advice correctness and initial and final human choices. |
| [Vasconcelos et al., CSCW 2023](https://doi.org/10.1145/3579605) | Studies how the effort and value of evaluating explanations affect reliance across tasks. | Time and verification effort can change whether explanations help. Equalize access and record workload. |
| [Lee et al., CHI 2025](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/) | Surveys self-reported changes in cognitive effort and associations with confidence among knowledge workers. | Motivates measuring confidence, with controlled transfer outcomes to examine effects. |
| [Microsoft Research HAX](https://www.microsoft.com/en-us/research/group/hax-team/) | Research programme covers human–AI complementarity, evaluation, personalization and adaptation. | Context for the research portfolio. Evidence about CoThink comes from its own evaluation. |
| [Evans, 1993](https://doi.org/10.1016/0010-0277(93)90056-2) | Reviews evidence on four common conditional inferences and differences in interpretation and negation. | Supports the reasoning blueprint and its item interpretation and validation checks. |

Adaptive support, skill models, deliberate reasoning prompts, and reliance metrics all have precedents. The candidate contribution is a transparent and reusable policy whose probe input can be ablated under matched conditions, with explicit unaided outcomes in a specified domain. Reusing software across two tasks is a feasibility observation. The effectiveness of the approach, its novelty, and its transferability remain open. Extend the search with forward/backward citations and full-text screening across CHI, IUI, CSCW, AIED, EDM and ICER before stating an academic gap.
