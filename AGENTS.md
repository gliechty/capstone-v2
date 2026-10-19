# AGENTS.md

## Owner workflow correction — 2026-10-19 (current)
This section supersedes conflicting historical workflow/authorization wording below.
- Deliver the authorized working application. No synthetic substitute, preview deployment, login gate, extra framework or future feature without owner instruction.
- Ask before creating or using synthetic fixtures for UI demonstrations/visual reviews. Existing approved automated unit/Golden/provider-double tests remain usable as recorded tests; they do not authorize a synthetic product or new fixture project. If new fixtures or tests are needed, ask first.
- Only execute verification recorded in the approved test register in `codex.prompting.memory.md` or explicitly authorized by the owner and recorded there before execution. Do not add tests, assertions, harnesses, fixture sets, scans or benchmarks on discretion.
- A request for an extra test must state in plain English: the concrete failure it would catch, why existing tests cannot catch it, the user impact, expected time/token/API cost, and the proposed command/file. Await approval. Do not weaken existing tests to avoid asking.
- Existing commands may run on affected saved test files. Run the full saved gate once for a final code candidate; rerun only invalidated checks or a failed check after a concrete fix. No full gate for Markdown-only edits. Never restart a running gate because a PM message arrived.
- At task start report expected active time and token range with assumptions/confidence. At finish report measured elapsed time, active time only if observed, and measured coding-agent tokens only if telemetry exists. Unknown is `unavailable`, never zero or inferred from prose length. Separate coding-agent tokens from application OpenAI usage.
- Use the KPI/current-state section of EXECUTION_PLAN.md, the existing Build Checklist and codex.prompting.memory.md. No new milestone-specific review documents. Preserve historical evidence.
- Current M3 is authorized through normal public deployment on the clean server with real recommendations and durable report. Use the existing local MOSAIC key securely (owner confirms it was never on the old host). Production AI allowance is $1/day; deployment verification is separately limited to two requests/$1. Never expose keys. Existing same-origin, scoring, validation and duplicate-request controls remain.
- Routine scoped implementation proceeds without repeated approval; human milestone acceptance and new scope remain owner decisions. Codex's application commits/pushes remain manual unless separately authorized.
- Read instructions once per work package and re-read changed sections only. Concise updates; investigate concrete failures, not hypothetical redesigns. Do not start M4 before M3 acceptance.


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
4. `BUILD_PACK/01_PRODUCT_SPEC/UI_BRAND_GUIDE.md`
5. `BUILD_PACK/00_READ_ME_FIRST/GLOSSARY.md`
6. `BUILD_PACK/08_ARCHITECTURE/LEGACY_MAP.md`
7. `BUILD_PACK/07_GOLDEN_TESTS/`
8. `BUILD_PACK/00_READ_ME_FIRST/COLUMBIA_IP_GUARDRAILS.md`
9. `BUILD_PLAN.md`
10. `EXECUTION_PLAN.md`
11. `codex.prompting.memory.md` (approved test register and effort reporting)

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

### Architecture extensibility and consistency

Before the initial application architecture/scaffold is approved, explicitly show where future capabilities could attach without reconstructing the deterministic assessment core. At minimum, identify credible extension seams for:

- authentication / user accounts and authorization;
- billing / subscriptions;
- document/evidence processing such as utility-bill extraction;
- knowledge-base/source ingestion;
- model/provider replacement;
- storage/database adapters;
- deployment/environment configuration.

Do **not** implement those future features merely to demonstrate extensibility.

After the architecture/scaffold is approved, treat the selected core patterns as the working architecture. Do not gradually introduce competing approaches to state management, persistence, validation, API boundaries, error handling, or other cross-cutting concerns without a documented reason. Material architectural deviation requires a brief proposal/ADR and human review.

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

For any capability that will be reachable from the public internet, also perform an appropriate security gate before calling it deployable:

- validate untrusted input server-side against explicit schemas;
- use parameterized database access / safe ORM patterns rather than string-built queries;
- enforce authorization at privileged/admin boundaries when such boundaries exist;
- keep secrets out of source, prompts, logs, client bundles, and committed config;
- run available secret/dependency/security scans;
- use least-privilege credentials and service permissions;
- restrict and validate uploaded files when file upload exists;
- avoid exposing stack traces, credentials, or sensitive internals in production errors.

If accounts/authentication are not yet in approved scope, do not compensate by exposing privileged maintenance/admin actions publicly.

### Deterministic calculation trace and numeric policy

For every scored question, the implementation must be able to produce a structured calculation trace sufficient to diagnose where a v1/v2 difference first appears. The trace should include, where applicable:

- question ID and raw answer;
- normalization method and relevant inputs;
- normalized score;
- resolved benchmark and benchmark ID/source;
- base weight;
- matched multiplier rule IDs and resulting multiplier;
- category and category weight;
- weighted contribution;
- category/overall contribution;
- configuration/method version.

Do not use display-rounded values as inputs to later calculations.

Before Milestone 2 scoring implementation is treated as complete, document the numeric representation and comparison policy. Preserve source/config precision, avoid intermediate rounding unless the methodology explicitly requires it, keep presentation rounding separate, and use explicit test tolerances only where justified. Never widen a tolerance ad hoc merely to make a Golden Test pass.

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

## Current owner operating instruction — 2026-10-14

Leave changes uncommitted. The owner handles staging, commits and pushes manually; this supersedes earlier commit/push authorization until explicitly changed. Routine repository reads, scoped edits, tests and review-document updates within the current authorized package are already authorized; proceed without repeated conversational permission requests. Respect platform permission controls and explain actual blockers. Preserve methodology, architecture, scope, data-transmission and spending limits; stop for genuinely unresolved material decisions. Let running verification finish and do not restart completed work solely because of this operating correction.

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
