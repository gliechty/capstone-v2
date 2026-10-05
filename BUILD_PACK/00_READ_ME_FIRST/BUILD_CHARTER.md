# BUILD_CHARTER.md

## Purpose

This document defines how implementation agents should work on Capstone v2.

The Build Pack is a **baseline and evidence set**, not a blueprint for reproducing the v1 architecture.

The governing principle is:

> **Preserve contracts and conceptual boundaries; improve implementations.**

Agents may improve architecture, code organization, UX, performance, retrieval, data access, testing, deployment, and other implementation details. They must not silently change the meaning of the assessment.

---

## 1. What must be preserved

### Config-driven assessment structure

The following are distinct parts of the product model, not merely convenient files:

- `QuestionBank`
- `AnswerScales`
- `MetricBenchmarks`
- `MultiplierRules`
- `CategoryWeights`
- `DocumentIndex`
- `DocumentChunks`

They may be stored differently in v2, but they must remain independently addressable, versionable, testable, and auditable.

Do **not** merge, subsume, rename, delete, or materially alter their semantics without explicit human approval.

Do not hard-code configurable business logic into application code for convenience.

Do not replace deterministic configuration with prompt logic or model judgment.

### Formulas and scoring behavior

Refactoring formulas is allowed.

Changing their meaning is not.

Any replacement of existing:

- normalization logic;
- benchmark handling;
- base-weight application;
- multiplier logic;
- category aggregation;
- overall-score calculation;

must either:

1. demonstrate equivalent behavior against the Golden Tests; or
2. stop and present the proposed methodological change for human approval.

Do not simplify formulas merely because the current dataset makes two approaches appear equivalent.

### Stable concepts, not current values

Do not infer permanent engine constraints from current data values.

Examples include:

- current question counts;
- current industries;
- current categories;
- current multiplier values/ranges;
- current retrieval top-K values;
- current source counts.

Treat these as configuration unless explicitly defined as product constraints.

---

## 2. What agents are free to improve

Within the current milestone, agents may propose and implement better choices for:

- application architecture;
- code organization;
- state management;
- database design;
- APIs;
- UI/UX;
- visualization;
- retrieval implementation;
- caching;
- parallelism/concurrency;
- model/provider configuration;
- testing;
- observability;
- deployment;
- accessibility;
- performance.

The goal is not fidelity to Appsmith, n8n, Google Sheets, or any other v1 technology.

The goal is a better implementation of the required capabilities.

---

## 3. Engineering quality

Optimize for:

- speed;
- reliability;
- clean state handling;
- efficient computation;
- maintainability;
- testability;
- security;
- reproducibility;
- modularity;
- scale.

Prefer designs that:

- avoid unnecessary synchronous API chains;
- minimize avoidable external API failure points;
- keep deterministic assessment logic available even if an AI provider is unavailable;
- isolate external integrations rather than scattering provider-specific code throughout the application;
- use stable IDs and explicit schemas;
- keep one authoritative source for persistent data;
- version schema/config changes;
- fail visibly rather than returning plausible-looking fallback output;
- make build, test, typecheck, and verification steps executable automatically;
- make production failures diagnosable;
- avoid obviously dead-end design choices that would require replacing the core assessment to support later growth.

A future commercial system may need more scale than the research build. The current build does not need to solve hypothetical hyperscale problems now, but it should not create obvious structural barriers to growth.

---

## 4. Golden Tests

Golden Tests are regression guards, not the objective function.

Use them to detect accidental changes in:

- question applicability;
- normalization;
- scoring;
- weighting;
- category/overall results;
- recommendation structure and grounding.

Do not preserve a known v1 defect merely to make a Golden Test pass.

If behavior differs:

- accidental difference → fix it;
- intentional improvement → document it, test it, and present it for review where it changes methodology or a core contract.

---

## 5. Common failure modes to avoid

Agents should explicitly guard against:

- **over-cleaning** — combining config entities because they appear redundant;
- **hardcoding from examples** — treating current data values as permanent rules;
- **silent schema drift** — renaming fields or changing semantics without approval;
- **AI substitution** — replacing deterministic logic with a model call because it is easier;
- **fallback masking** — swallowing failures and returning plausible output;
- **prototype leakage** — mock data, hardcoded values, or temporary shortcuts surviving unnoticed;
- **dependency proliferation** — adding external services when simpler local computation is sufficient;
- **architecture churn** — replacing working components without evidence that the change improves the product;
- **test gaming** — reproducing outputs without preserving the underlying logic;
- **premature abstraction** — building frameworks for future features that are not yet required.

---

## 6. Human review and milestones

The human project owner defines the major milestones and decides when to advance to the next one.

Agents may propose substeps within a milestone.

Agents must stop and surface a proposal before:

- changing formulas or assessment methodology;
- changing the semantics of a canonical config entity;
- introducing a major new external dependency;
- replacing a major implemented technology/component after meaningful work already exists;
- making a change that materially alters future extensibility;
- beginning the next user-defined milestone.

The build is iterative.

The intended workflow is:

1. build a bounded piece;
2. test it;
3. inspect it;
4. understand any major changes;
5. redirect if necessary;
6. continue.

The objective is not a perfect one-prompt build.

---

## 7. Future additions

Future additions should be possible without requiring reconstruction of the core assessment.

This does **not** mean implementing future features now.

It means avoiding unnecessary coupling so that later additions—such as new data sources, calculators, document ingestion, user accounts, market intelligence, or alternative model providers—can be attached through clear interfaces rather than by rewriting the assessment engine.

Specific future features are governed by product scope and IP boundaries, not by this Charter.
