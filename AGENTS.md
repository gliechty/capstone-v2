# AGENTS.md

## Project

Capstone v2 — Columbia Climate School / SEE Foundation SME sustainability assessment.

This repository is an iterative rebuild of the Spring 2026 Capstone application.

The Build Pack is the baseline/evidence set. It is **not** a requirement to reproduce the v1 architecture.

Primary rule:

> **Preserve contracts and conceptual boundaries; improve implementations.**

---

# 1. Read before changing code

Read these files in this order:

1. `BUILD_PACK/00_READ_ME_FIRST/BUILD_CHARTER.md`
2. `BUILD_PACK/01_PRODUCT_SPEC/CLIMATE_SCHOOL_SCOPE_DRAFT.md`
3. `BUILD_PACK/01_PRODUCT_SPEC/PRODUCT_VISION.md`
4. `BUILD_PACK/00_READ_ME_FIRST/GLOSSARY.md`
5. `BUILD_PACK/08_ARCHITECTURE/LEGACY_MAP.md`
6. `BUILD_PACK/07_GOLDEN_TESTS/`
7. `BUILD_PACK/00_READ_ME_FIRST/COLUMBIA_IP_GUARDRAILS.md`
8. `BUILD_PLAN.md`

Consult `CURRENT_ARCHITECTURE.md` only to understand v1 behavior/dependencies. Do not treat it as the target architecture.

If documents conflict:

1. explicit current human instruction wins;
2. approved/current Scope wins for deliverables;
3. Build Charter wins for agent behavior;
4. canonical config + Golden Tests win for baseline runtime behavior;
5. Product Vision provides strategic context, not detailed implementation requirements.

Surface unresolved conflicts instead of guessing.

---

# 2. Current milestone

Work only within the milestone currently authorized by the human project owner in `BUILD_PLAN.md`.

You may:

- propose substeps;
- reorder work inside the milestone where sensible;
- recommend a better approach.

You may not:

- mark a major milestone complete yourself;
- begin the next milestone without explicit human approval;
- expand Current Scope because a future feature seems useful.

At the end of a milestone, report what changed, verification results, important tradeoffs, and anything requiring review.

---

# 3. Non-negotiable baseline contracts

## Canonical config remains conceptually distinct

Do not silently merge, subsume, delete, rename, or change the semantics of:

- `QuestionBank`
- `AnswerScales`
- `MetricBenchmarks`
- `MultiplierRules`
- `CategoryWeights`
- `DocumentIndex`
- `DocumentChunks`

Physical storage may change. Conceptual boundaries, stable identity, auditability, and versionability must remain unless explicitly approved.

## Config stays config

Do not hard-code configurable assessment behavior into application code for convenience.

Do not replace deterministic config with prompts/model judgment.

Do not infer permanent engine rules from the values currently present in the config.

## Formulas remain deterministic

Do not silently change:

- normalization semantics;
- benchmark behavior;
- base-weight behavior;
- multiplier semantics;
- category aggregation;
- raw/weighted overall calculations.

Refactoring is allowed if behavior is preserved.

If a methodological change appears beneficial, stop and propose it before implementation.

---

# 4. Engineering freedom

You are encouraged to improve:

- technology stack;
- repository layout;
- internal architecture;
- database design;
- state management;
- API design;
- UI/UX;
- retrieval implementation;
- caching;
- concurrency;
- performance;
- testing;
- observability;
- deployment;
- accessibility.

Prefer measurable improvements over architectural fashion.

Do not introduce a new dependency merely because it is common or convenient.

---

# 5. Engineering quality expectations

Optimize for:

- correctness;
- speed;
- reliability;
- efficient computation;
- clean state handling;
- maintainability;
- testability;
- security;
- reproducibility;
- modularity;
- scale.

Prefer designs that:

- minimize unnecessary synchronous API chains;
- minimize avoidable external API failure points;
- keep deterministic assessment/scoring available when an AI provider is unavailable;
- isolate third-party integrations;
- use stable IDs and explicit schemas;
- maintain one authoritative source for persistent data;
- use migrations/versioning for persisted schema/config changes;
- fail visibly rather than returning plausible fake output;
- support automated build/test/typecheck/verification;
- provide enough observability to diagnose production failures.

Do not overengineer hypothetical scale. Avoid obvious designs that require rebuilding the core product to grow.

---

# 6. Verification rules

Before claiming work is complete:

- run relevant unit tests;
- run relevant integration tests;
- run typecheck/lint/build checks where configured;
- run applicable Golden Tests;
- test failure/error paths for the changed capability;
- verify no secrets were committed;
- verify no temporary/mock values are being mistaken for production behavior.

Golden Tests are regression guards, not the objective function.

Known legacy defects should not be preserved only to make tests green.

If a Golden Test differs:

- accidental regression → fix;
- intentional change → document and request approval where it affects methodology/core behavior.

Never weaken or delete tests simply to make a change pass.

---

# 7. Stop and request human review before

Stop before implementing any of the following:

- scoring/formula/methodology change;
- semantic change to a canonical config entity;
- major new external dependency or managed service;
- replacement of a major implemented component after meaningful work exists;
- destructive or difficult-to-reverse data migration;
- major change to future extensibility;
- next Build Plan milestone;
- capability covered by an `IP REVIEW REQUIRED` trigger.

Present:

1. what you want to change;
2. why;
3. alternatives considered;
4. expected benefit;
5. risks/migration cost;
6. tests that would prove it works.

Do not continue that change until approved.

---

# 8. IP boundary

Read `COLUMBIA_IP_GUARDRAILS.md`.

The current research build may improve implementation of approved Current Scope.

Do not independently implement distinct commercial SaaS differentiation or a potentially valuable new method/algorithm merely because it would improve the future product.

When required, emit the exact `IP REVIEW REQUIRED` structure from the guardrail document and stop that feature.

---

# 9. Git and change discipline

- Keep commits coherent and reviewable.
- Do not rewrite shared history or perform destructive Git operations unless explicitly instructed.
- Do not make unrelated large refactors inside a feature task.
- Do not hide architecture/methodology changes inside cleanup commits.
- Preserve useful provenance when migrating config or algorithms.
- Never commit secrets, credentials, tokens, or private keys.
- Maintain `.env.example` or equivalent with names/placeholders only.
- Keep the main development branch runnable.

When a decision is important and not obvious from code, record it briefly in the appropriate project document/ADR rather than relying on chat history.

---

# 10. Common failure modes

Explicitly avoid:

- over-cleaning canonical config boundaries;
- hardcoding from current examples;
- silent schema drift;
- replacing deterministic logic with AI;
- swallowing failures behind plausible fallbacks;
- leaving mock/prototype data in production paths;
- dependency proliferation;
- architecture churn without evidence;
- optimizing to tests instead of preserving the underlying behavior;
- building future features before they are needed;
- treating v1 implementation choices as requirements.

---

# 11. Completion report format

At the end of a meaningful task or milestone, report concisely:

### Changed
What was implemented or modified.

### Verified
Tests/checks run and results.

### Decisions
Any notable implementation decisions and why.

### Deviations
Any intentional difference from the baseline/spec.

### Risks / open questions
Anything the human owner should review.

### Next
The next proposed action, without starting a new milestone unless authorized.
