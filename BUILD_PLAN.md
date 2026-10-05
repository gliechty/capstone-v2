# BUILD_PLAN.md

## Purpose

This document defines the major build milestones and human review gates for Capstone v2.

The project owner decides when a milestone is complete and when the build may advance.

Implementation agents may propose substeps and implementation approaches within a milestone, but may not silently advance to the next milestone.

The intended workflow is:

> **Build → test → inspect → understand → redirect if necessary → continue.**

This is not a one-prompt autonomous build.

---

# Milestone 1 — Product shell and assessment entry

## Goal

Create the two-surface product shell and a usable entry into the assessment without over-investing in visual polish before the core engine is proven.

## Expected outcomes

### Public/context page
- client problem / product context;
- About / approach section;
- video placeholder;
- research / verification section;
- clear CTA such as **Take the Assessment**.

### Assessment entry
- launch assessment flow;
- collect SME metadata/context;
- preserve session state;
- route into the assessment experience.

The exact interaction pattern (modal, stepper, drawer, full-screen flow, etc.) is not fixed and may be proposed by the build system.

## Review gate

Stop and show:
- page structure;
- assessment-entry flow;
- major UX assumptions;
- selected stack / implementation approach if not previously approved.

Do not spend significant time on visual polish before Milestone 2 is proven.

---

# Milestone 2 — Deterministic assessment core and Golden parity

## Goal

Reproduce the core config-driven Capstone assessment behavior independently of the legacy Appsmith/n8n implementation.

## Expected outcomes

The new system can:
- load the canonical configuration;
- keep canonical config entities conceptually distinct;
- select the correct questions from SME metadata/context;
- preserve question ordering;
- normalize answers deterministically;
- resolve metric benchmarks;
- apply base weights;
- apply contextual multiplier rules;
- apply category weights;
- calculate category scores;
- calculate raw overall score;
- calculate industry-weighted overall score;
- display basic score/category visualizations comparable to v1.

## Required verification

Golden Cases must verify:
- selected question IDs/order match;
- answer normalization matches;
- base weights match;
- multiplier application matches;
- category weights match;
- category scores match;
- final raw and weighted scores match at the defined canonical precision.

Also verify:
- answers do not silently disappear during navigation or focus changes;
- current config values are not hard-coded as permanent engine constraints;
- known v1 defects are not preserved merely for parity.

## Review gate

Stop and show:
- Golden Test results;
- any deviations from v1;
- any config/schema changes;
- representative computed output;
- performance observations;
- any methodology issue discovered.

The deterministic core must be approved before recommendation logic becomes authoritative.

---

# Milestone 3 — Recommendations, results, and durable report

## Goal

Layer grounded recommendations and a usable results experience onto the proven deterministic core.

## Expected outcomes

Results should include, as appropriate:
- overall score(s);
- category scores;
- question-level answers/scores;
- visual score/category display;
- key gaps;
- prioritized recommendations;
- supporting evidence/sources;
- clearer, more readable results than v1.

The user can download/save a durable report, at minimum as PDF or equivalent.

The report should include:
- SME profile/context;
- question-by-question answers;
- question scores;
- category scores;
- overall scores;
- key gaps;
- recommendations;
- relevant supporting evidence/sources.

## Recommendation quality checks

Recommendation regression should verify:
- no contradiction of deterministic scores;
- no invented source/evidence;
- major gaps remain materially aligned with the SME's weak areas;
- recommendations remain relevant to profile/context;
- output schema is valid;
- any numeric score repeated in prose exactly matches authoritative deterministic computation.

Exact prose matching is not required.

## Performance

Aim for approximately **10 seconds or less** under normal test conditions where practical.

## Failure behavior

If the recommendation model fails or times out:
- deterministic assessment results must still load;
- charts/scores/report generation must still work;
- the system may present deterministic **priority gaps** based on the lowest relevant question/category scores;
- do not label these as AI recommendations unless a deterministic remediation mapping exists.

If later desired, fixed/config-driven remediation guidance can be attached to low-scoring questions/categories as a non-AI fallback.

## Review gate

Show:
- Golden recommendation comparisons;
- latency measurements;
- failure behavior;
- PDF/report output;
- external API dependencies.

---

# Milestone 4 — Emissions calculator and quantitative input flow

## Goal

Integrate the emissions calculator as a practical assessment input-resolution capability.

## Expected user choices

The user can choose to:
- manually enter known emissions / water / energy / related quantitative data;
- use the emissions calculator;
- later, if approved, upload utility bills/evidence for assisted extraction.

## Current-scope requirements

- calculator inputs resolve to canonical metrics;
- values map through stable `metric_id` or equivalent identity;
- resolved values can autofill relevant assessment fields;
- the same value is not requested twice unnecessarily;
- units/provenance remain explicit;
- user can inspect/correct relevant values;
- missing data is not silently treated as zero;
- calculator logic remains separate from scoring semantics.

## Stretch within this area

Utility-bill/evidence upload may use GenAI to:
- interpret source documents;
- identify candidate inputs;
- report missing/ambiguous information;
- ask clarifying questions;
- populate calculator fields behind the scenes.

User confirmation is required before extracted values affect deterministic scoring.

## Review gate

Demonstrate at least one full flow:

`SME setup → calculator/manual data → resolved metric → questionnaire autofill → deterministic score`.

---

# Milestone 5 — Basic config and knowledge-base maintenance
## CURRENT / REQUIRED

## Goal

Allow authorized Climate School maintainers to perform routine updates to approved configuration and source/knowledge-base documents without editing application source code.

## Expected outcomes

An authorized maintainer can:
- replace/update approved canonical config datasets;
- update source/knowledge-base documents;
- validate changed configuration before activation;
- identify/select the live configuration version;
- retain the original Capstone configuration as a permanent fallback.

Routine maintenance must not require editing application source code. The canonical configuration entities remain conceptually distinct.

Automated source-document processing that regenerates configuration is a separate approval-gated capability in Milestone 5A.

## Review gate

Show:
- an approved config/source update through the maintenance flow;
- validation before activation;
- live-version identification/selection;
- fallback to the original Capstone configuration.

---

# Milestone 5A — Automated source-document to config regeneration
## NEEDS EXPLICIT APPROVAL BEFORE IMPLEMENTATION

## Goal

Allow future Climate School maintainers to refresh the application's knowledge base and derived configuration without repeating the original Capstone process manually.

## Functional intent

An authorized admin can:
- upload/add new source documents or standards;
- select which source set should be processed;
- initiate the preserved Capstone transformation sequence with a single action;
- review generated outputs before they become live;
- select/publish an approved configuration version;
- retain the original Capstone configuration as a permanent fallback.

## Processing sequence

The automated workflow should preserve the original Capstone prompt order and methodological sequence as closely as practicable, including:
- document indexing;
- document chunking;
- AtomicIndicator extraction;
- AtomicIndicator normalization/transformation;
- clustering/frequency/context processing;
- base-weight generation;
- MultiplierRules generation;
- CategoryWeights generation;
- QuestionBank generation/refinement;
- related retrieval/config outputs.

The exact implementation/orchestration may improve for reliability and speed.

However:
- semantic changes to the preserved prompts/method require human approval;
- implementation-level formatting/schema changes are allowed where needed for reliable automation;
- generated config must be validated before publication;
- the existing Capstone baseline must remain available as a permanent rollback/fallback.

This workflow is a maintenance process, not an interactive runtime path, and **does not need to meet the ~10-second recommendation target**.

## Review gate

Before implementation:
- confirm this milestone is within approved research scope/IP boundary.

After implementation:
- demonstrate processing of a small test source set;
- show generated artifacts;
- show validation;
- show version selection/publish;
- show rollback to the Capstone baseline.

---

# Milestone 6 — Interactive levers
## STRETCH

## Goal

Let the user explore how plausible operational improvements could affect assessment outcomes.

## Expected behavior

- recommendation logic identifies likely improvement opportunities;
- eligible opportunities are mapped to known manipulable canonical metrics;
- the system selects approximately 2–3 useful levers;
- the user can adjust those values;
- relevant what-if scores/metrics update immediately.

Only metrics with a defined deterministic relationship to scoring should become levers.

The recommendation model may help rank/select eligible levers, but it must not invent the mathematical relationship between the lever and the score.

## Review gate

Show:
- why each lever was selected;
- its canonical metric mapping;
- baseline vs what-if score;
- no hidden change to scoring methodology.

---

# Milestone 7 — Quick vs Full assessment
## STRETCH / METHODOLOGY REVIEW

## Goal

Explore whether a shorter assessment can provide useful screening value without misleading users about comparability.

Do not implement until the scoring/comparability method is explicitly approved.

Potential models include:
- distinct screening score;
- core-question-only score;
- statistically calibrated approximation;
- another reviewed method.

Do not simply remove questions and reuse the same score label.

## Review gate

Methodology proposal must be approved before coding.

---

# Milestone 8 — Alan/Henry external benchmark layer
## RESEARCH EXPERIMENT

## Goal

Explore whether Alan/Henry's large-company China/HKEX/EU research can provide useful external context without altering the core SME score.

Potential uses include:
- peer/external benchmark display;
- contextual recommendation evidence;
- research/verification-page comparisons;
- reporting-frequency comparisons.

Do not:
- mix these data into the core SME score by default;
- alter core weights from this dataset without explicit methodological approval;
- present large-company observations as direct SME peer truth.

## Review gate

Show exactly what the source data supports before deciding how it appears in the product.

---

# Cross-cutting reliability requirements

These apply to all milestones.

## Deterministic core remains available

Failure of OpenAI or another model provider must not prevent:
- questionnaire completion;
- deterministic scoring;
- charts;
- deterministic priority-gap display;
- durable report generation.

## Config identity

Each assessment/report should record the configuration/method version used so results can be interpreted later.

## External dependencies

Avoid unnecessary chains of third-party APIs.

A noncritical external dependency should degrade gracefully where practical rather than taking down the core assessment.

## Human milestone ownership

Only the human project owner may mark a milestone complete or authorize the next milestone.

---

# Milestone status

- [ ] Milestone 1 — Product shell and assessment entry
- [ ] Milestone 2 — Deterministic assessment core and Golden parity
- [ ] Milestone 3 — Recommendations, results, and durable report
- [ ] Milestone 4 — Emissions calculator and quantitative input flow
- [ ] Milestone 5 — Basic config and knowledge-base maintenance — CURRENT / REQUIRED
- [ ] Milestone 5A — Automated source-document to config regeneration — NEEDS APPROVAL
- [ ] Milestone 6 — Interactive levers — STRETCH
- [ ] Milestone 7 — Quick vs Full assessment — STRETCH / METHODOLOGY REVIEW
- [ ] Milestone 8 — Alan/Henry external benchmark layer — RESEARCH EXPERIMENT
