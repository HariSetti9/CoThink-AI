# CoThink AI

CoThink AI v0.5 is a Human-Centered AI research prototype for competence-aware adaptive help in introductory Python code tracing. [Open the demonstration](https://cothink-ai.vercel.app/).

## Run and test

Use Node.js 22 or later and Python 3 on PATH. No packages or API keys are required.

```sh
npm start
npm test
```

Open http://127.0.0.1:4173/. Run `npm test` from another terminal or stop the local server first. Set `COTHINK_PYTHON` if Python is installed under a different command.

## Demonstration and architecture

- The demo has 24 code-tracing questions across four concepts. Each concept has two questions per phase. The phases are independent pre-test, assisted practice and unaided transfer.
- Four demonstration policies share a versioned exercise bank and practice workflow. The adaptive and interaction-only policies share the same escalation after errors. The adaptive policy also uses same-concept pre-test performance and confidence for the first recommendation.
- Analytics show independent scores, first-attempt practice accuracy, unaided first-attempt practice accuracy, final practice accuracy, assistance and overrides. Session rows retain the v0.4 fields and add stable item IDs, attempt details and policy decisions. A JSON export is available at completion.
- `public/app/` holds independent modules for the task bank, policy, session flow, analytics and dashboard. Vercel serves `public/`. The separate `server/` directory contains a Gemini draft helper with mocked verification. The demo has no Gemini route or server-side response collection.
- The browser holds responses in memory for the session. There is no login or automatic export. Answer keys ship with the public demo and the items have not been validated psychometrically. These constraints prevent the demo from serving as a controlled study platform.

## Research

See the [literature review](research/LITERATURE.md), [draft protocol](research/PROTOCOL.md) and [development tracker](research/TRACKER.md). The code, dataset additions, and text received AI assistance. Human review and empirical validation are pending. No participant study has been conducted.
