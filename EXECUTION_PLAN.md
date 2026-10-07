# EXECUTION_PLAN.md



## Purpose



This document is the operational build roadmap for Capstone v2.



It sits below `BUILD_PLAN.md`:



- `BUILD_PLAN.md` defines major milestones and human review gates.

- `EXECUTION_PLAN.md` breaks those milestones into right-sized implementation steps.

- The Google Sheet `Build Checklist` → `v2.0` mirrors this plan for human project tracking.



If this file and the Google Sheet ever diverge, this repository file is the authoritative build-execution plan.



Implementation agents may propose smaller substeps within an authorized execution step, but they may not silently advance to another step or milestone.



The intended loop is:



> Select step → implement → test → inspect → understand → commit → mark complete → continue.



---



# Status conventions



- `COMPLETE` — implemented, verified, reviewed, committed.

- `CURRENT` — explicitly authorized for implementation.

- `PENDING` — not yet authorized.

- `BLOCKED` — requires methodology, scope, IP, or other explicit approval.

- `STRETCH` — optional after required scope is stable.

- `RESEARCH` — experimental work that must not silently alter the core product.



Only the human project owner may change a step to `COMPLETE` or authorize the next step.



---



# Milestone 1 — Product shell and assessment entry



## M1.0 — Scaffold + architecture baseline

**Status:** COMPLETE



### Purpose

Create a safe, reproducible technical foundation before product features.



### Output

- Next.js / React / TypeScript application scaffold

- testing infrastructure

- linting and architecture-boundary enforcement

- design-token foundation

- architecture decision records

- single verification command: `npm run verify`



### Dependencies

Approved architecture and Build Pack control documents.



### Notes

Completed on branch `milestone-1-scaffold`.



No substantive Capstone product functionality was implemented in this step.



---



## M1.1 — UI system + landing-page shell

**Status:** COMPLETE



### Purpose

Establish the product visual language and the public/context surface.



### Output

- approved design-token implementation

- typography

- spacing

- color system

- borders/radii

- motion treatment

- reduced-motion behavior

- responsive landing-page shell

- problem/context section

- About / approach section

- video placeholder

- research / verification section

- clear `Take the Assessment` CTA



### Dependencies

- M1.0

- `BUILD_PACK/01_PRODUCT_SPEC/UI_BRAND_GUIDE.md`



### Boundaries

Do not implement:

- assessment setup

- questionnaire behavior

- scoring

- recommendations

- calculator

- database/persistence

- admin/maintenance features

- commercial/stretch features



Keep visual polish controlled until the deterministic core is proven.



---


### Notes

Implemented and verified. Public-facing copy remains provisional pending research/client review; this does not block the approved UI shell.


## M1.2 — Assessment setup + session state

**Status:** COMPLETE



### Purpose

Collect SME context and begin a resilient assessment session.



### Output

- dedicated full-page assessment setup flow

- SME metadata/context fields

- quantitative-input method choice

- React reducer/context state

- browser session persistence

- route into questionnaire flow



### Dependencies

- M1.1

- approved SME metadata/context fields



### Notes

Manual quantitative input is the initial default.



Calculator and upload paths may remain disabled/placeholders until their milestones.



---



## M1.3 — Questionnaire shell + progress/navigation

**Status:** COMPLETE



### Purpose

Implement the approved assessment interaction model before real scoring logic.



### Output

- vertical single-focus / roller-style question cards

- active-card emphasis

- desktop progress rail

- compact mobile progress equivalent

- skip behavior

- revisit behavior

- answered/unanswered/current state

- direct question navigation

- category-transition treatment

- final unanswered-question review behavior

- reduced-motion support



### Dependencies

- M1.2

- `UI_BRAND_GUIDE.md`



### Notes

Representative or mock questions may be used at this stage.



Missing answers must never silently become zero.



---



## M1.4 — Results shell + Milestone 1 review

**Status:** COMPLETE



### Purpose

Prove the end-to-end product shell without pretending scoring or recommendations are implemented.



### Output

- `/results` route

- score-summary shell

- category visualization shell

- executive-summary section shell

- gaps section shell

- recommendation section shell

- prominent report-download CTA shell

- Milestone 1 review package



### Dependencies

M1.1–M1.3.



### Review gate

Stop and review Milestone 1 before beginning Milestone 2.



---



# Milestone 2 — Deterministic assessment core and Golden parity



## M2.1 — Canonical config schemas + loader

**Status:** PENDING



### Purpose

Make the preserved Capstone configuration readable by the new application without hard-coding it.



### Output

Typed schemas and repository/loading interfaces for:

- QuestionBank

- AnswerScales

- MetricBenchmarks

- MultiplierRules

- CategoryWeights

- DocumentIndex

- DocumentChunks



Also:

- validation

- config-version identity

- explicit load failures



### Dependencies

- Milestone 1 approved

- canonical clean config files



### Notes

No production database is required for this step.



Versioned repository files may serve as the initial runtime authority.



---



## M2.2 — Deterministic question selection + ordering

**Status:** PENDING



### Purpose

Reproduce which questions each SME receives and in what order.



### Output

Pure deterministic selection and ordering engine driven by:

- active state

- industry

- market/location

- size

- priority/order rules



### Dependencies

M2.1.



### Verification

Golden cases must match expected question IDs and ordering.



### Notes

Do not introduce buyer/goal-based question selection unless explicitly approved as a methodology change.



---



## M2.3 — Answer persistence + normalization/benchmarks

**Status:** PENDING



### Purpose

Reliably capture answers and reproduce normalized question scores.



### Output

- answer-state integration

- robust persistence through navigation/focus changes

- normalization library

- benchmark resolver

- missing-data handling

- question-level normalized outputs



### Dependencies

M2.1–M2.2.



### Notes

Fix the v1 answer-loss/focus-change defect.



Missing values must never silently become zero.



---



## M2.4 — Base weights + contextual multipliers

**Status:** PENDING



### Purpose

Reproduce contextual weighting deterministically.



### Output

- base-weight application

- multiplier-rule matching

- matched rule IDs

- resulting multiplier

- explainable multiplier trace



### Dependencies

M2.1–M2.3.



### Notes

Do not convert current config values or caps into permanent engine assumptions.



---



## M2.5 — Category weighting + score aggregation

**Status:** PENDING



### Purpose

Reproduce category and overall scoring.



### Output

- weighted question contributions

- category aggregation

- category scores

- raw overall score

- industry-weighted overall score



### Dependencies

M2.4.



### Notes

Calculation precision must remain separate from presentation rounding.



---



## M2.6 — Calculation trace + numeric policy

**Status:** PENDING



### Purpose

Make every score explainable and every parity failure diagnosable.



### Output

Structured calculation trace containing, where applicable:

- question ID

- raw answer

- normalization method and inputs

- normalized score

- benchmark ID/source

- base weight

- matched multiplier rule IDs

- resulting multiplier

- category

- category weight

- weighted contribution

- overall contribution

- config/method version



Also:

- documented numeric representation policy

- source/config precision rules

- intermediate-rounding rules

- presentation-rounding rules

- explicit Golden comparison tolerance



### Dependencies

M2.3–M2.5.



### Notes

Never widen tolerances merely to make Golden Tests pass.



---



## M2.7 — Golden parity + basic score visualizations

**Status:** PENDING



### Purpose

Prove the deterministic core against the preserved v1 behavior.



### Output

- Golden Test matrix for all five Golden SMEs

- selected-question parity

- normalization parity

- weight parity

- multiplier parity

- category-score parity

- overall-score parity

- documented reconciliation of known v1 defects

- basic overall/category score visualizations

- Milestone 2 review package



### Dependencies

M2.1–M2.6 plus Golden fixtures.



### Review gate

The deterministic core must be approved before recommendation logic becomes authoritative.



---



# Milestone 3 — Recommendations, results, and durable report



## M3.1 — Recommendation service + provider boundary

**Status:** PENDING



### Purpose

Replace the v1 n8n recommendation runtime with a maintainable application service boundary.



### Output

- recommendation-service interface

- server-side provider adapter

- model configuration

- structured request/response schema

- timeout/error handling

- provider-replacement seam



### Dependencies

- M2 approved

- preserved runtime recommendation prompt



### Notes

Do not recreate n8n literally unless justified.



Deterministic scoring must remain available if the model provider is unavailable.



---



## M3.2 — RAG source/chunk retrieval

**Status:** PENDING



### Purpose

Reproduce grounded evidence selection before recommendation generation.



### Output

- DocumentIndex ranking

- DocumentChunks ranking

- document/chunk join logic

- evidence bundle passed to recommendation generation



### Dependencies

M3.1 plus canonical DocumentIndex/DocumentChunks.



### Notes

Start from preserved v1 metadata-ranking behavior.



Vector/embedding retrieval is not required unless separately justified.



---



## M3.3 — Structured recommendation generation

**Status:** PENDING



### Purpose

Generate grounded recommendations consistent with authoritative deterministic results.



### Output

- model call

- structured output parsing/validation

- evidence/source validation

- numeric-score consistency checks

- schema-valid recommendation payload



### Dependencies

M3.1–M3.2.



### Verification

Recommendations must:

- not contradict deterministic scores

- not invent sources

- align materially with weak areas

- remain relevant to SME context

- repeat scores exactly when scores appear in prose



Exact prose parity is not required.



---



## M3.4 — Results, gaps, recommendations + evidence UI

**Status:** PENDING



### Purpose

Turn deterministic and AI outputs into a clear results narrative.



### Output

- overall score display

- category score display

- executive summary

- visual key-gap cards

- ranked recommended actions

- evidence/source presentation

- authoritative score charts



### Dependencies

M2.7 and M3.3.



### Notes

Default to a vertical narrative rather than tabs.



The current deterministic score remains authoritative.



---



## M3.5 — Durable report / PDF

**Status:** PENDING



### Purpose

Create a portable assessment record independent of the live browser session.



### Output

Downloadable report containing:

- SME profile/context

- answers/skips

- question scores

- category scores

- overall scores

- gaps

- recommendations

- evidence/sources

- config/method version



### Dependencies

M3.4.



### Notes

Print-ready HTML is acceptable initially if it satisfies the durable-report requirement.



---



## M3.6 — Failure, latency + recommendation regression review

**Status:** PENDING



### Purpose

Prove the recommendation layer is reliable and degrades gracefully.



### Output

- provider-failure tests

- timeout tests

- deterministic fallback behavior

- recommendation regression checks

- latency measurements

- Milestone 3 review package



### Dependencies

M3.1–M3.5.



### Notes

Aim for approximately 10 seconds or less under normal test conditions where practical.



Scores, charts, deterministic gaps, and report generation must still work when AI fails.



---



# Milestone 4 — Emissions calculator and quantitative input flow



## M4.1 — Reconcile calculator methodology + fixtures

**Status:** PENDING



### Purpose

Turn the preserved spreadsheet into a trustworthy implementation reference.



### Output

- verified calculator formula decisions

- discrepancy log

- unit assumptions

- calculator regression fixtures



### Dependencies

- M3 approved

- emissions calculator workbook/spec



### Notes

Do not blindly port unverified spreadsheet formulas.



---



## M4.2 — Calculator engine + UI

**Status:** PENDING



### Purpose

Provide a usable deterministic emissions-calculation path.



### Output

- calculator inputs

- unit handling

- deterministic calculations

- validation

- correction/edit flow

- calculator UI



### Dependencies

M4.1.



### Notes

Calculator logic remains separate from scoring semantics.



---



## M4.3 — Canonical metric mapping + autofill

**Status:** PENDING



### Purpose

Resolve quantitative values into assessment inputs without asking for the same information twice.



### Output

- stable `metric_id` mapping

- units/provenance

- questionnaire autofill

- duplicate-input suppression

- user correction capability



### Dependencies

M4.2 plus canonical metric identities.



---



## M4.4 — End-to-end quantitative flow + review

**Status:** PENDING



### Purpose

Prove calculator/manual values correctly enter the deterministic assessment core.



### Output

Demonstrated flow:



`SME setup → manual/calculator data → resolved metric → questionnaire autofill → deterministic score`



Plus Milestone 4 review package.



### Dependencies

M4.1–M4.3 and Milestone 2 engine.



### Notes

Utility-bill/evidence extraction remains stretch unless explicitly approved.



---



# Milestone 5 — Basic config and knowledge-base maintenance

**Milestone classification:** CURRENT / REQUIRED



## M5.1 — Persistence + config/version data model

**Status:** PENDING



### Purpose

Introduce durable storage only once maintenance/versioning requires it.



### Output

- typed persistence/data-access layer

- schema migrations

- config-version records

- source/document records

- publication state



### Dependencies

M4 approved plus architecture review.



### Notes

This is the likely point to introduce PostgreSQL and a typed data layer such as Drizzle.



Do not scatter raw database access throughout the application.



---



## M5.2 — Protected maintainer/admin boundary

**Status:** PENDING



### Purpose

Keep privileged maintenance capabilities separate from the public assessment.



### Output

- protected maintenance route/service boundary

- authorization approach appropriate to deployment

- clear separation from public runtime



### Dependencies

M5.1 plus security requirements.



### Notes

Do not expose admin functionality publicly merely because end-user accounts are deferred.



---



## M5.3 — Config import, staging + validation

**Status:** PENDING



### Purpose

Let maintainers update approved config datasets without application source-code edits.



### Output

- import flow

- staging state

- schema validation

- referential validation

- validation report before activation



### Dependencies

M5.1–M5.2.



### Notes

Canonical config entities remain independently addressable and versioned.



---



## M5.4 — Knowledge-base/source maintenance

**Status:** PENDING



### Purpose

Let maintainers update recommendation source material safely.



### Output

- source/document update flow

- DocumentIndex maintenance

- DocumentChunks maintenance

- validation



### Dependencies

M5.1–M5.3.



### Notes

Automated source-to-config regeneration belongs to Milestone 5A.



---



## M5.5 — Activation, live-version selection + fallback

**Status:** PENDING



### Purpose

Make configuration changes reversible and auditable.



### Output

- publish/select live config version

- assessment/report records retain config version

- original Capstone config retained permanently

- rollback/fallback flow



### Dependencies

M5.3–M5.4.



---



## M5.6 — Maintenance security/deployment + review

**Status:** PENDING



### Purpose

Prove the maintenance path is safe, portable, reproducible, and operational.



### Output

- security checks

- clean-clone deployment/migration test

- backup/fallback demonstration

- Milestone 5 review package



### Dependencies

M5.1–M5.5.



---



# Milestone 5A — Automated source-document to config regeneration

**Milestone classification:** NEEDS EXPLICIT APPROVAL



## M5A.0 — Scope/IP approval gate

**Status:** BLOCKED



### Purpose

Confirm automated source-to-config regeneration is within approved scope and IP boundaries before implementation.



### Output

Explicit human authorization and documented research/IP boundary.



### Dependencies

- Prof. Guo / funded-scope clarification

- Columbia IP guardrails



### Notes

Do not design or prototype detailed commercial/proprietary differentiation merely because it becomes technically possible.



---



## M5A.1 — Automated source-to-config pipeline

**Status:** BLOCKED



### Purpose

Automate the preserved Capstone transformation sequence for future source sets.



### Potential output

- document indexing

- document chunking

- AtomicIndicator extraction

- AtomicIndicator normalization/transformation

- clustering/frequency/context processing

- base-weight generation

- MultiplierRules generation

- CategoryWeights generation

- QuestionBank generation/refinement

- related retrieval/config artifacts



### Dependencies

M5A.0 approval plus preserved provenance/prompts.



### Notes

This is a maintenance workflow, not a runtime assessment path.



Semantic prompt/method changes require human approval.



---



## M5A.2 — Review, publish + rollback

**Status:** BLOCKED



### Purpose

Keep regenerated configuration human-reviewed, versioned, and reversible.



### Output

- generated-artifact review

- validation

- version publication

- rollback to original Capstone baseline

- Milestone 5A review package



### Dependencies

M5A.1.



---



# Milestone 6 — Interactive levers

**Milestone classification:** STRETCH



## M6.1 — Define eligible lever mappings

**Status:** STRETCH



### Purpose

Identify operational variables with a deterministic relationship to scoring.



### Output

Approximately 2–3 candidate levers mapped to:

- canonical metrics

- current values

- allowed ranges

- deterministic scoring paths



### Dependencies

Validated scoring/calculator outputs plus methodology review.



### Notes

AI may rank eligible levers but may not invent the mathematical relationship between a lever and score.



---



## M6.2 — What-if sliders + shadow score

**Status:** STRETCH



### Purpose

Let users explore plausible improvement scenarios without overwriting authoritative results.



### Output

- slider controls

- immediate deterministic recomputation

- authoritative current score

- clearly distinct what-if / ghost score



### Dependencies

M6.1 plus deterministic engine.



---



## M6.3 — Lever review gate

**Status:** STRETCH



### Purpose

Verify mappings and ensure no scoring methodology was silently altered.



### Output

- lever rationale

- canonical metric mapping

- baseline vs what-if examples

- Milestone 6 review package



### Dependencies

M6.1–M6.2.



---



# Milestone 7 — Quick vs Full assessment

**Milestone classification:** STRETCH / METHODOLOGY REVIEW



## M7.0 — Quick vs Full methodology approval

**Status:** BLOCKED



### Purpose

Define how a shortened assessment can produce useful screening value without misleading comparability.



### Output

Approved methodology proposal, potentially using:

- distinct screening score

- core-question-only score

- statistically calibrated approximation

- another explicitly reviewed method



### Dependencies

Validated deterministic engine plus methodology review.



### Notes

Do not simply remove questions and reuse the Full score label.



---



## M7.1 — Implement + validate shortened assessment

**Status:** BLOCKED



### Purpose

Build the approved Quick mode only after its methodology is approved.



### Output

- Quick assessment flow

- approved score treatment

- validation evidence

- Milestone 7 review package



### Dependencies

M7.0 approval.



---



# Milestone 8 — Alan/Henry external benchmark layer

**Milestone classification:** RESEARCH EXPERIMENT



## M8.1 — Audit Alan/Henry research applicability

**Status:** RESEARCH



### Purpose

Define exactly what the large-company China/HKEX/EU research can legitimately support.



### Output

- source/coverage/fit memo

- limitations

- allowable comparison claims

- explicit distinction from SME evidence



### Dependencies

Preserved Alan/Henry research package.



### Notes

The source population is not SMEs.



---



## M8.2 — External benchmark experiment/display

**Status:** RESEARCH



### Purpose

Test an external-context layer without contaminating the core SME score.



### Potential output

- peer/external benchmark display

- contextual recommendation evidence

- verification/research-page comparison

- reporting-frequency comparison



### Dependencies

M8.1.



### Notes

Do not alter core weights or scores by default.



---



## M8.3 — Adoption decision + review

**Status:** RESEARCH



### Purpose

Decide whether the experimental benchmark layer belongs in the product.



### Output

- experiment findings

- limitations

- keep / modify / drop decision

- Milestone 8 review package



### Dependencies

M8.1–M8.2.



---



# Cross-cutting execution rules



These apply to every execution step.



## Scope discipline

- Work only on the explicitly authorized step.

- Do not silently begin the next step.

- Do not add stretch/commercial functionality because it seems convenient.

- If a required change crosses milestone or IP boundaries, stop for review.



## Build Pack protection

- Do not modify `BUILD_PACK` during ordinary implementation unless explicitly authorized.

- Treat it as the evidence/methodology baseline.



## Deterministic-core protection

- Scoring remains deterministic.

- AI may not replace config-driven scoring logic.

- AI failure must not break the core assessment once that capability exists.



## Config protection

Keep these conceptual entities distinct:

- QuestionBank

- AnswerScales

- MetricBenchmarks

- MultiplierRules

- CategoryWeights

- DocumentIndex

- DocumentChunks



## Testing

Before a step is presented as complete:

- run relevant unit tests

- run integration/browser tests where appropriate

- run typecheck

- run lint

- run build

- run Golden Tests when applicable

- test relevant error/failure paths

- verify no secrets or generated junk are being committed



Use `npm run verify` as the baseline verification command once applicable.



## Git discipline

- Keep changes scoped to the current execution step.

- Do not commit or push unless explicitly authorized.

- Keep commits coherent and reviewable.

- Do not rewrite shared history.

- Never commit secrets.



## Completion report

At the end of each meaningful execution step, report:



### Changed

What was implemented or modified.



### Verified

Tests/checks run and results.



### Decisions

Notable implementation choices.



### Deviations

Any intentional difference from spec/baseline.



### Risks / open questions

Anything needing human review.



### Next

The next proposed action without starting it.



---



# Current position

- M1.0 — COMPLETE
- M1.1 — COMPLETE
- M1.2 — CURRENT
- all later steps are not yet authorized unless explicitly marked otherwise.
