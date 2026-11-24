# CoThink AI project vision

Accepted project direction, 24 November 2026.

## Mission

Build a reusable competence-aware adaptive assistance engine for human–AI collaboration. The engine uses evidence about the user's task-specific understanding and the current interaction to choose how much help to offer and when. It should help people complete work while preserving their ability to reason, verify and make decisions independently.

The policy is the core product and research candidate. Python code tracing is the first experimental testbed. Propositional reasoning is the second, chosen to test the same assistance mechanism on independently scorable tasks with different subject matter. A testbed can be replaced or expanded without rewriting the decision policy.

## Research objectives

1. Specify an auditable policy that selects direct answers, hints, verification or reflection prompts from explicit, versioned evidence. Human handoff or deliberate abstention is a future action for tasks that require it.
2. Estimate whether task-specific independent probes add value beyond interaction history, and whether adaptive assistance improves later unaided performance relative to fixed support, direct answers and an unaided practice baseline.
3. Measure assisted performance separately from immediate and delayed unaided transfer. Examine confidence calibration, workload, help usage and appropriate reliance under a separately designed, approved study.
4. Test the same policy across materially different task domains with reusable software interfaces. Evaluate the contribution against prior work before claiming novelty.

## Scope and architecture

- The domain-independent engine owns policy, evidence selection, attempt rules, session phases and versioned outcomes.
- Each domain supplies tasks, concept labels, assessment keys and curated support text. Rendering and persistence use an explicit domain contract.
- The public application is a sandbox for demonstration and synthetic verification. The protected study workflow will hold answer keys, assignment and approved participant data server-side.
- Preserve the released v0.5 Python testbed and its original exercises, mode semantics, descriptive metrics and export fields. Use a versioned adapter for later releases.
- Research work includes literature comparison, independently verified answer keys, documented instrument limitations, preregistration, and institutional ethics approval and consent before human research.

## Non-goals

- A Python-only tutoring product or a collection of unrelated quizzes.
- A foundation model, an unrestricted chatbot, or an autonomous agent that takes consequential action for a user.
- Automated high-stakes decisions, covert monitoring, collecting participant data through the public demo, and claims of validated competence, novelty or efficacy without evidence.
- Claiming that a second software testbed establishes transfer between domains or that software QA establishes research outcomes.

## Release principles

Keep production on the verified release while developing and testing candidate revisions in Preview. Maintain an auditable Git history, dataset and policy versions, regression tests and verification evidence. Document AI contributions. Prioritize a credible, reproducible Human-Centered AI project for the Microsoft Research India application and eventual academic publication.
