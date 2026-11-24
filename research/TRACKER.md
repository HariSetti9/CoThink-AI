# CoThink AI development tracker

| Milestone | State | Evidence or release gate |
| --- | --- | --- |
| v0.4 audit | Verified | GitHub main commit `2b78ef14744b3efaab37145c6d0b2cbfb47f2ff8` matched Vercel production's Git metadata. The public alias rendered prototype 0.4. The team hostname redirected to Vercel login. |
| v0.5 learning dashboard | Implemented | Responsive session workflow, stage progress, final score breakdown, concept table, assistance distribution and private JSON download. |
| v0.5 policy and export | Verified with automated tests | Adaptive vs interaction-only comparison; same post-error rules, strategy reason and explicit override records; versioned export with v0.4 field compatibility. |
| v0.5 dataset | Technically verified | Retained 18 items and added six string items. All 24 outputs checked with Python 3.13.2, with two items per phase/concept. Expert review and psychometric evaluation pending. |
| v0.5 regression checks | Automated suite passed | `npm test` on Node 24.14.1 and Python 3.13.2, 49 passed. Browser verification and deployed revision recorded independently. |
| Gemini readiness | Mock-tested | Server-only draft helper, default disabled. No live test, billing request, user prompt processing, public endpoint or deployment secret. |
| Literature and protocol | Drafts committed with code | DOI-linked review, separate 2026 preprint entry, matched conceptual comparison, primary endpoint and analysis design. Novelty and educational benefit remain open. |
| Study infrastructure and manuscript | Pending | Parallel forms, protected allocation and scoring, institutional approval, consent, feasibility pilot, preregistration and genuine findings. |

## Engineering notes

- Fixed the old browser workflow's ambiguity between final practice score and independent first-attempt evidence. Assistance and correctness feedback remain unavailable in both independent phases.
- Initial assistance uses a two-response evidence floor. Both adaptive modes use a shared progression after failed attempts. An explicit worked-answer override takes precedence over the assigned policy.
- The static demo does not make model calls. Before enabling the server helper, use an approved Preview-only configuration with a restricted key stored in Vercel, choose a supported model and check its allowance, authenticate users, cap spending and requests, and review draft hints for answer leakage. Server variable names are `GEMINI_ENABLED`, `GEMINI_API_KEY`, and `GEMINI_MODEL`. No key belongs in source or browser code. See [Google's key guide](https://ai.google.dev/gemini-api/docs/api-key) and [GenerateContent reference](https://ai.google.dev/api/generate-content).
