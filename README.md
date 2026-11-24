# CoThink AI

Competence-aware adaptive programming assistance — research prototype v0.3.

[Public demonstration](https://cothink-ai-setti-haris-projects.vercel.app)

## Run locally
Open index.html in a browser. No dependencies or API keys required.

## Features
Three assistance modes, independent pre-test, assisted practice, unaided transfer, confidence ratings, descriptive analytics and local JSON export. No automatic research data collection. Curated content, not an LLM.

## Research question
Does assistance adapted to independent competence improve unaided programming transfer compared with fixed hints? This is a candidate question, not a novelty or efficacy claim.

## Proposed study
After ethics approval and consent, randomize learners to adaptive or fixed assistance with matched tasks, assessments and time. Primary outcome: unaided transfer score adjusted for baseline. Secondary: delayed transfer, Brier score, workload and assistance use. Determine sample size before confirmatory testing. The demo uses only three items per phase and is unsuitable for confirmatory research; expand and validate the task bank first.

## Limitations
Single binary pre-test item per concept is a noisy competence proxy. Assistance is optional and overrides may confound comparisons. Client-side answers are inspectable. Practice scores include retries. No human study has been conducted. Six policy scenarios checked during v0.3 development; browser end-to-end testing pending.

## References
- Amershi et al., Guidelines for Human-AI Interaction, CHI 2019. https://doi.org/10.1145/3290605.3300233
- Kazemitabaar et al., CodeAid, CHI 2024. https://doi.org/10.1145/3613904.3642773

## Disclosure
AI-assisted implementation and documentation. Human review, contribution and empirical validation are required before academic claims or submission.
