# CoThink AI development tracker

| Milestone | State | Evidence or release gate |
| --- | --- | --- |
| v0.4 audit | Verified | GitHub main commit `2b78ef14744b3efaab37145c6d0b2cbfb47f2ff8` matched Vercel production's Git metadata. The public alias rendered prototype 0.4. The team hostname redirected to Vercel login. |
| v0.5 learning dashboard | Implemented | Responsive session workflow, stage progress, final score breakdown, concept table, assistance distribution and private JSON download. |
| v0.5 policy and export | Verified with automated tests | Adaptive vs interaction-only comparison; same post-error rules, strategy reason and explicit override records; versioned export with v0.4 field compatibility. |
| v0.5 dataset | Technically verified | Retained 18 items and added six string items. All 24 outputs checked with Python 3.13.2, with two items per phase/concept. Expert review and psychometric evaluation pending. |
| v0.5 regression checks | Automated suite passed | `npm test` on Node 24.14.1 and Python 3.13.2, 49 passed. The production browser flow and download are recorded below. |
| v0.5 production | Released | Vercel Preview and Production built the same source commit, `2fd41d6`. The public production alias served v0.5 and passed the desktop session check. |
| Gemini readiness | Mock-tested | Server-only draft helper, default disabled. No live test, billing request, user prompt processing, public endpoint or deployment secret. |
| Literature and protocol | Drafts committed with code | DOI-linked review, separate 2026 preprint entry, matched conceptual comparison, primary endpoint and analysis design. Novelty and educational benefit remain open. |
| Study infrastructure and manuscript | Pending | Parallel forms, protected allocation and scoring, institutional approval, consent, feasibility pilot, preregistration and genuine findings. |

## Engineering notes

- Fixed the old browser workflow's ambiguity between final practice score and independent first-attempt evidence. Assistance and correctness feedback remain unavailable in both independent phases.
- Initial assistance uses a two-response evidence floor. Both adaptive modes use a shared progression after failed attempts. An explicit worked-answer override takes precedence over the assigned policy.
- The static demo does not make model calls. Before enabling the server helper, use an approved Preview-only configuration with a restricted key stored in Vercel, choose a supported model and check its allowance, authenticate users, cap spending and requests, and review draft hints for answer leakage. Server variable names are `GEMINI_ENABLED`, `GEMINI_API_KEY`, and `GEMINI_MODEL`. No key belongs in source or browser code. See [Google's key guide](https://ai.google.dev/gemini-api/docs/api-key) and [GenerateContent reference](https://ai.google.dev/api/generate-content).

## Release verification, 24 November 2026

- [Code revision](https://github.com/HariSetti9/CoThink-AI/commit/2fd41d6ce84d8485aa29f41d069651d6c8855e81) · [Public production](https://cothink-ai.vercel.app/). Vercel production deployment `dpl_DcNYQSwGtXbVTQMFVqZSBnSzrkAf` reached READY with that Git revision. Preview completed for the same revision. The team and preview hostnames required sign-in.
- The desktop browser completed all 24 items in one synthetic adaptive session. Checked missing-answer validation, hidden assistance on pre-test and transfer, reflection before the first practice attempt, hint after a failed attempt, worked-answer override, results, session reset and selection of the interaction-only mode. No browser console errors were reported during the session.
- The synthetic run displayed 8/8 pre-test, 7/8 transfer, 7/8 first-attempt practice and 8/8 final practice. The downloaded JSON contained 24 records, export schema 2, one override and the expected three assistance events. These numbers verify software behavior.
- Narrow-screen CSS is implemented. The viewport testing interface continued to report a desktop viewport after a resize request, so a 390 px browser check remains open.

## Next instrument milestone

The answer-position audit found 3/5/0 correct picks across the three option positions in the demo pre-test, 2/4/2 in practice and 3/4/1 in transfer. Preserve the published demo bank as a versioned baseline. Balance answer positions in the dedicated study bank and freeze equivalent baseline, immediate transfer and delayed transfer forms after expert review. Each form needs documented concept coverage, parallel cognitive demands and fresh code examples. Log the form and displayed option order in the approved study export, and run scoring and item-balance checks before a feasibility pilot.

The next implementation boundary is a separate protected study workflow with server-side answer keys and allocation. Model-generated assistance and participant enrollment remain gated by their respective review and approval steps.

## v0.5 usability follow-up

The landing page shows how two learners can receive different support on the same Python concept. Instructions appear at each phase of the session. Each practice response explains the policy reason for the chosen type of help. Assessment items, policy rules, and export format are unchanged.

## v0.6 coding milestone

The product goal is independent problem-solving. A coding track now asks learners to complete actual Python expressions. It has four diagnostic exercises, four practice exercises and four fresh transfer exercises, with loops and Boolean conditions in each phase. The results page suggests a practice activity for each concept missed during unaided transfer. The tracing track retains its v0.5 dataset, policies and descriptive comparisons. Coding and tracing use separate dataset IDs and are unsuitable for pooled score comparisons.

The checker recognizes documented common forms with harmless whitespace and whole-expression parentheses. It does not execute learner-entered code. Automated tests check every accepted form in Python against repository-owned reference cases. Code-entry correctness is a task-specific prototype measure. Rare equivalent expressions may need review, item difficulty and transfer have no psychometric validation, and the answer bank is accessible in the demo source. The next research milestone requires expert-reviewed new forms and a protected study workflow.
