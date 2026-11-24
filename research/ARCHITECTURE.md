# Reusable architecture

## Boundaries

| Layer | Owns | Project paths |
| --- | --- | --- |
| Assistance policy | Pure decision from mode, prior observations and local attempt count. Returns a strategy and a reason code, or no assistance. | `public/app/engine/policy.mjs` |
| Session and metrics | Ordered phases, valid responses, retry limits, request eligibility, export, and descriptive scores. Domain content is passed to the session. | `public/app/engine/session.mjs`, `public/app/engine/analytics.mjs` |
| Domain adapters | Content, labels, answer keys, task-specific feedback and help wording. | `public/app/domains/` and the preserved Python bank `public/app/tasks.mjs` |
| Workspace | Selects a registered domain and a policy, renders tasks and results, and downloads optional JSON. | `public/app/dashboard.mjs`, `public/index.html` |
| Study system (future) | Eligibility and consent, random assignment, held-out instrument and scoring, approved pseudonymous records. | A protected deployment with server-side storage |

The policy modules have no dependencies on the browser, model providers, the domain registry, or the specific Python and reasoning banks. A domain adapter supplies an ID, dataset version, concepts, ordered tasks and display guidance. Each objective-choice task supplies a stable ID, phase, concept, passage, prompt, choices, answer index and hint. Tasks may include a worked-answer rationale. The domain adapter also owns domain-specific verification and reflection language. A later response format may add a scoring adapter without changing the assistance policy inputs.

The browser exports application version, schema version, policy version, domain, dataset version and mode with the existing v0.5 record fields. Independent items are recorded after one answer and get no help or correctness feedback. Practice keeps up to three attempts. The unaided option suppresses requests and worked-answer overrides at both UI and engine boundaries. Python retains its legacy feedback in assisted modes. The reasoning demo uses the same practice correctness feedback across its modes.

The current static product uses deterministic curated assistance. The optional Gemini draft helper is outside the web output and outside the evaluation conditions. Future generative providers should supply vetted content separately from deciding the strategy. A controlled study should lock arm assignment, keep answer keys server-side, and freeze domain, content and policy versions.

Development builds run against versioned Git commits in Vercel Preview. Production was last verified with the v0.5 Python demo. The earlier coding-only v0.6 draft is a separate branch and a separate deployment.
