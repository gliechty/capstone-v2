# AGENTS.md

Owner acceptance — 2026-10-21: M4.2 accepted as delivered, including the remaining calculator corrections and documented historical-factor limitations. Commit/push the scoped calculator follow-up and records on milestone-4-calculator. Then create milestone-4-branding-video from that checkpoint for M4.3 Claude branding/video; branch preparation only, no implementation, build, merge or deployment. Preserve unrelated work. This supersedes historical pending-acceptance wording below.

Current M4.2 review checkpoint (2026-10-21): owner authorizes bounded calculator usability/spec corrections and scoped commit/push on milestone-4-calculator. Preserve unrelated work; no deploy or merge. Live checklist roadmap: M4.3 homepage branding/video, M4.4 metric mapping/autofill, M4.5 quantitative review. None starts in this checkpoint; historical numbering below remains historical.

## Current authority and synchronization — owner direction, 2026-10-20
Build Checklist, tab v2.0, is the single project-management authority for current scope, sequence, owner decisions, acceptance and effort/status. Latest explicit owner instructions take precedence. Repository code, canonical configuration and test evidence remain authoritative for implemented behavior; a checkbox does not prove implementation.

Before EVERY milestone step, read the live F1 note and the relevant checklist row values INCLUDING cell notes at https://docs.google.com/spreadsheets/d/1JPxxDzxOuH77i62EUBqgz9T46h-8ck9YtKZQIQa8FdQ/edit?gid=406102921 . Then reconcile supporting AGENTS.md, BUILD_PLAN.md, EXECUTION_PLAN.md and codex.prompting.memory.md before implementation, preserving newer unrelated work. BUILD_PLAN describes product scope/criteria; EXECUTION_PLAN records technical steps/evidence. Neither independently overrides current checklist decisions. Do not reopen accepted work based on historical text. If live checklist access fails, report the blocker; do not treat an old copy as current.

PM maintains the checklist and reconciles completion/commit evidence available in-session. Codex maintains the existing repository instructions/plans and publishes scoped changes only as authorized. No background synchronization exists. At closeout supply affected row, result, measured effort/unavailable telemetry, commit SHA, branch, push/merge state and deployed release when applicable. PM updates the same item; no new tracking document, service or synchronization tooling.

Current disposition (owner2026-10-21): M3 accepted; M4.0 evaluation complete; M4.1 accepted as the reference specification and fixture package with documented limitations. M4.2 accepted by the owner on2026-10-21; verified evidence and limitations retained. Historical factors are not production-approved or globally applicable; U-026 autofill pending; Scope3 excluded. Quality tooling/refactoring remains optional final pre-shipping QA on a separate branch. M4.1 is published; the owner now authorizes committing/pushing only scoped M4.2 calculator work and its records on milestone-4-calculator. No merge or deployment authorized. This supersedes conflicting historical status text below.


## One-step delivery and effort audit — owner direction, 2026-10-20
This standing protocol, updated by the owner on 2026-10-21, supersedes conflicting historical effort wording. M4.1 is accepted; M4.2 resumed by owner2026-10-21: focused calculator checks approved; calculator belongs in the existing full-page Data Input stage with manual/calculator/Skip options and preserved reviewable entries. No M4.4 autofill or M4.3 branding. No merge is authorized.
- Work on one milestone step at a time; do not silently bundle adjacent steps.
- Before starting each step, explicitly confirm this protocol and the live checklist row/notes have been loaded. Start the delivery record at the first reading/audit session, before implementation: step ID, scope, timestamp/timezone, separate implementation and verification elapsed-time estimates, combined total without overlap, assumptions/confidence and comparable completed work. Record coding-token estimate and actual telemetry availability; unsupported forecasts and missing telemetry are **unavailable** immediately.
- Measure elapsed delivery time across work sessions, including reading, implementation, verification and closeout. Record session start/end timestamps and explicit approval/overnight pauses separately. Sum non-overlapping delivery intervals; retain calendar span and recorded pauses separately. Never label elapsed time active time. Unmeasured intervals remain **not measured**; never reconstruct historical timing, invent active time/tokens or double-count overlapping work/checks. At completion record the end timestamp and elapsed total **once** in the existing step record.
- Calibrate forecasts using comparable completed work and explain scope differences. M4.1 recorded **27m33s overall**; its included final continuation took **10 minutes against a 30–60-minute forecast**. The continuation is included, not additive. Preserve those historical measurements; do not apply a blanket speed multiplier. New runtime/UI work and verification differ from reference-specification work.
- Measure effort to improve delivery efficiency, reduce owner intervention and prevent repeated scope/test churn.
- At each step's closeout, compare expected versus actual effort, identify the main avoidable delay or rework, and propose at most one concrete workflow correction in the existing step record. If evidence is unavailable, say so; do not invent variance or causes. PM records the decision in the existing Build Checklist; the next applicable step checks whether the adopted correction helped and records the evidence or its absence. Do not implement additional tooling merely to measure effort. Proposed architecture/tooling/test changes remain subject to existing scope and approval rules.
- Include the commit SHA and publication state in the handoff: branch, whether changes are uncommitted/staged/committed, whether pushed (or not verified), and PR/merge status when known. Distinguish the base commit from any uncommitted work; never imply a local change is published. Git staging/commits/pushes remain owner-controlled.
- PM reconciles the existing Build Checklist whenever commit/completion evidence is received. Supply the step record and evidence in the handoff; do not claim PM synchronization until confirmed or create another tracking document.
- At closeout verify required fields: protocol-loaded confirmation, step ID/scope, separate implementation and verification estimates and combined total, calibration/assumptions, expected tokens or unavailable, telemetry availability, session start/end timestamps, recorded pauses/calendar span, elapsed delivery total, actual tokens or unavailable, one expected-versus-actual explanation, at most one proposed correction (or none), commit SHA and publication state. Missing evidence stays explicit.

## Maintainability and delivery efficiency — owner direction, 2026-10-20
Maintain a codebase that independent developers and future AI agents can understand, verify and safely extend. Prefer clear contracts, consistent conventions, explicit dependencies and behavior-preserving tests. Use the smallest effective set of automated checks. Refactor when it materially improves correctness or changeability, not merely to satisfy stylistic metrics. Minimize owner intervention, redundant verification and unnecessary tooling.

This directive does not independently authorize refactoring, new tests or tool installation. M4.0 is closed as an evaluation. Quality tools and justified refactoring are deferred to optional, time-allowing final pre-shipping QA on a separate branch; they are not prerequisites for M4.1. Preserve the recorded audit as evidence, not current execution authorization.

## Owner workflow correction — 2026-10-19 (current)
This section supersedes conflicting historical workflow/authorization wording below.
- Deliver the authorized working application. No synthetic substitute, preview deployment, login gate, extra framework or future feature without owner instruction.
- Ask before creating or using synthetic fixtures for UI demonstrations/visual reviews. Existing approved automated unit/Golden/provider-double tests remain usable as recorded tests; they do not authorize a synthetic product or new fixture project. If new fixtures or tests are needed, ask first.
- Only execute verification recorded in the approved test register in `codex.prompting.memory.md` or explicitly authorized by the owner and recorded there before execution. Do not add tests, assertions, harnesses, fixture sets, scans or benchmarks on discretion.
- A request for an extra test must state in plain English: the concrete failure it would catch, why existing tests cannot catch it, the user impact, expected time/token/API cost, and the proposed command/file. Await approval. Do not weaken existing tests to avoid asking.
- Existing commands may run on affected saved test files. Run the full saved gate once for a final code candidate; rerun only invalidated checks or a failed check after a concrete fix. No full gate for Markdown-only edits. Never restart a running gate because a PM message arrived.
- Follow the standing delivery-effort protocol above: estimate and measure elapsed delivery across sessions, with separate implementation/verification forecasts and pauses. Record one closing comparison; preserve historical measurements and unavailable coding-token telemetry. Application API usage is separate.
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

## Deployment fidelity and work discipline — owner correction, 2026-10-19

A request to host the working app means preserve its existing landing, assessment, Results and AI workflow. Do not substitute a simulation/test harness, redirect users into diagnostic controls, or introduce login/onboarding requirements without explaining the concrete user-facing difference and obtaining applicable authorization. Explicit synthetic-only authorization remains binding until changed; clearly call out its incompatibility with live-AI parity rather than presenting it as equivalent. Latest owner direction is the normal hosted app, no private/offline banner or login, and the existing AI integration; the owner has now authorized secure reuse of the local key and a shared $1/day Asia/Bangkok operating budget, separate from the deployment verification allowance.

Use the smallest deployment changes needed. Reuse accepted implementation and verification evidence; do not restart research, redesign UI, or add dependencies/experiments for deployment. Verify the actual landing-to-results journey and required live capability before claiming the app is ready. A health check or synthetic test alone is not evidence of live AI availability. Report exact missing credentials, budget or security decisions early, continue independent work, and avoid repeated permission requests for already authorized routine work. Do not silently weaken validation or create unbounded public billable access. Keep changes uncommitted under the owner's existing Git instruction.
