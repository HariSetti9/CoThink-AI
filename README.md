# CoThink AI

CoThink AI studies how an AI collaborator can adapt its help to a person's understanding and the task. The domain-independent assistance engine is the core. Python tracing and logical reasoning are experimental testbeds. See the [project vision](PROJECT_VISION.md) and [architecture](research/ARCHITECTURE.md).

The v0.6 development candidate runs in Preview. [Public v0.5 Python testbed](https://cothink-ai.vercel.app/).

## Run and test

Use Node.js 22 or later and Python 3 on PATH. No packages or API keys are required.

```sh
npm start
npm test
```

Open http://127.0.0.1:4173/. Set `COTHINK_PYTHON` if Python is installed under a different command.

## Workflows

- **Logical reasoning** has 24 conditional-inference tasks across diagnosis, practice and unaided transfer. An independent truth-table test checks each answer key.
- **Python code tracing** retains the 24-item v0.5 bank and the assisted practice flow. The existing modes and analytics remain available.
- **Assistance policies** include adaptive, fixed hints, direct answers and unaided practice. Interaction-only serves as an extra comparator. Independent phases withhold assistance.
- **Results** include pre-test and transfer accuracy, confidence, assistance events and optional local JSON. The export preserves v0.5 fields and adds domain metadata. The public demo is browser-only and its keys are inspectable.

See the [reasoning instrument](research/REASONING_ASSESSMENT.md), [evaluation plan](research/EVALUATION.md), [related work](research/LITERATURE.md) and [tracker](research/TRACKER.md). Research validation requires expert and pilot evaluation. Human research requires institutional ethics approval and consent. The code, item drafts and documentation received AI assistance.
