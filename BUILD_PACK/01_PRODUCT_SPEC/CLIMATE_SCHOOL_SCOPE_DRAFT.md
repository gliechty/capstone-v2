# CLIMATE_SCHOOL_SCOPE_DRAFT.md

## Status

Working scope for beginning Capstone v2 before Professor Guo's final written signoff.

This document defines **required capabilities and user outcomes**, not a fixed internal architecture.

The build may begin against this scope. Professor Guo's later approval may narrow, expand, or reprioritize it.

---

## 1. Objective

Rebuild the existing SME sustainability assessment as a faster, more professional, maintainable Climate School application while preserving the core Capstone methodology and config-driven structure.

The v1 Build Pack and Golden Tests provide the baseline for existing behavior. They do not require v2 to reproduce the v1 technology stack.

---

## 2. Primary user-facing experience

Two primary user-facing surfaces are currently envisioned.

### A. Public context / research page

This page should:

- explain the client problem and purpose of the tool;
- explain the assessment approach in accessible language;
- include a short demo/video area;
- provide a clear CTA such as **Take the Assessment**;
- provide research / verification material below the primary CTA;
- communicate the methodology, source basis, limitations, and research provenance clearly enough for academic review.

The precise layout is open to UX design.

### B. Assessment application

After selecting **Take the Assessment**, the user should enter the SME metadata/context required by the assessment.

The user should then be guided through how they want to provide important quantitative sustainability inputs.

Current required paths:

- **I'll enter it** — user already knows the relevant values;
- **Calculate emissions** — user uses the integrated emissions/carbon calculator.

Future/stretch path:

- **Upload utility bills / evidence** — the system extracts candidate data, identifies gaps or ambiguity, asks clarifying questions where necessary, and uses validated values to populate the emissions calculator or relevant assessment fields.

The setup experience should preserve session state and avoid repeated entry.

The exact UX pattern—modal, guided flow, full-screen stepper, drawer, embedded sequence, etc.—is intentionally not specified here.

Once required setup data is resolved, the user proceeds into the adaptive questionnaire.

---

## 3. Core assessment functionality

The v2 application should preserve or deliberately improve:

- SME context/profile capture;
- deterministic, config-driven question selection;
- adaptive questionnaire behavior;
- deterministic answer normalization;
- metric benchmark handling;
- base weights;
- contextual multipliers;
- category scoring;
- raw overall score;
- industry-weighted score;
- source-grounded recommendations;
- source/evidence presentation.

The config-driven structure is a core requirement.

The build must not silently collapse the canonical config entities into a less auditable structure.

---

## 4. Canonical configuration authority

The canonical configuration entities remain conceptually distinct:

- QuestionBank;
- AnswerScales;
- MetricBenchmarks;
- MultiplierRules;
- CategoryWeights;
- DocumentIndex;
- DocumentChunks.

For CategoryWeights specifically, the authoritative source workbook is `CategoryWeights.xlsx`.

Relevant tabs:

- `Sheet1` — authoritative category-weight values;
- `why?` — methodology/rationale provenance;
- `prompt1` — original generation prompt provenance;
- `Noah_Test` — non-authoritative development/test material and not part of the production baseline.

The preserved Markdown provenance files may mirror `why?` and `prompt1`, but `Sheet1` is authoritative for runtime category-weight values.

---

## 5. Emissions / carbon calculator

The calculator should be integrated as a practical assessment-input tool.

Required behavior:

- user can enter the required activity/emissions data;
- calculator produces the relevant canonical metrics;
- values already calculated during the session can populate corresponding assessment fields automatically;
- the user should not be asked to enter the same data twice;
- units and source/provenance should remain clear;
- the calculator does not replace the deterministic scoring methodology.

The detailed formulas are governed by the preserved calculator specification and subsequent validation.

Utility-bill / evidence upload remains stretch unless separately approved.

---

## 6. Results, export, and retention

The user should receive a clear results experience containing, as appropriate:

- overall score(s);
- category-level scores;
- useful quantitative metrics/statistics;
- charts/visual summaries;
- key gaps;
- prioritized recommendations;
- supporting evidence/sources.

At minimum, the user should be able to **download/save the results as a PDF or equivalent durable report**.

The report should preserve enough context to interpret the assessment later, including the configuration/method version used.

Email delivery may also be implemented if it is the best low-friction way to let users retain or share results, but email is not required to define the architecture.

---

## 7. Recommendation performance and graceful degradation

The v1 recommendation path is slower than desired.

Target:

> approximately **10 seconds or less** under normal test conditions where practical.

Agents may improve implementation details to reduce latency, including retrieval, orchestration, caching, parallelism, model/provider configuration, or other engineering choices.

Requirements:

- grounding quality must remain acceptable;
- recommendation output must remain structurally valid;
- loading/progress indicators must be truthful;
- simulated progress stages must not be presented as real backend telemetry.

If the recommendation model fails or times out:

- deterministic assessment results must still load;
- charts/scores/report generation must still work;
- deterministic priority gaps may be shown from lowest relevant scores;
- the system must not present non-AI fallback output as AI-generated recommendations unless a defined deterministic remediation mapping exists.

---

## 8. Basic config and knowledge-base maintenance — CURRENT SCOPE

The Climate School should be able to keep the application current without changing application code for routine content/config updates.

At minimum, an authorized maintainer should be able to:

- replace or update approved canonical config datasets;
- update source/knowledge-base documents;
- validate changed configuration before activation;
- retain the original Capstone configuration as a permanent fallback;
- identify which configuration version is currently live.

The exact admin UX is intentionally not specified yet.

Possible implementations may include:

- controlled file upload/replacement;
- a restricted admin-only maintenance page;
- a validation/import workflow;
- another maintainable approach proposed during the build.

The important requirement is that a future maintainer should not need to edit source code simply to refresh approved standards, sources, or configuration.

---

## 9. Automated source → config regeneration — NEEDS APPROVAL

A future maintenance capability may automate the original Capstone transformation sequence after an admin uploads new standards/source documents.

Desired flow:

```text
new source documents
    ↓
document indexing
    ↓
document chunking
    ↓
AtomicIndicator extraction
    ↓
AtomicIndicator normalization / transformation
    ↓
clustering / frequency / context processing
    ↓
base-weight generation
    ↓
MultiplierRules generation
    ↓
CategoryWeights generation
    ↓
QuestionBank generation / refinement
    ↓
related retrieval/config outputs
    ↓
validation / human review
    ↓
versioned publish
```

If approved:

- preserve the original Capstone prompt order and methodological sequence as closely as practicable;
- prompts should remain essentially the same in meaning as the preserved Capstone prompts;
- semantic prompt/method changes require human approval;
- implementation/orchestration may improve for reliability and maintainability;
- generated config must be reviewed/validated before becoming live;
- the original Capstone configuration remains a permanent fallback.

This is an offline/maintenance process and does **not** need to meet the ~10-second recommendation target.

---

## 10. Assisted evidence upload — STRETCH

A future/stretch capability may allow the user to upload utility bills or similar source documents.

Desired behavior:

1. extract candidate values;
2. identify missing/ambiguous information;
3. ask clarifying questions when needed;
4. validate units and reporting period;
5. populate the emissions calculator or canonical assessment metrics;
6. allow user review/correction before the value affects scoring.

This capability should reduce manual entry without making numeric scoring depend on opaque AI judgment.

---

## 11. Interactive sustainability levers — STRETCH

A future/stretch results capability may let the user explore how changing important sustainability inputs could affect relevant outputs.

Potential pattern:

- recommendation logic identifies likely improvement opportunities;
- eligible opportunities are mapped to known manipulable canonical metrics;
- the system selects approximately 2–3 useful levers;
- the user adjusts those values;
- relevant what-if scores/metrics update immediately.

Only metrics with a defined deterministic relationship to scoring should become levers.

The recommendation model may help rank/select eligible levers, but it must not invent the mathematical relationship between a lever and the score.

---

## 12. Quick vs Full assessment — STRETCH / METHODOLOGY REVIEW

A future capability may offer a shorter assessment path.

Do not implement this simply by removing questions and reusing the same score label.

Before implementation, define and approve the comparability methodology, such as:

- a distinct screening score;
- a core-question-only score;
- a statistically calibrated approximation;
- another reviewed approach.

---

## 13. Alan/Henry external benchmark layer — RESEARCH EXPERIMENT

Alan/Henry's China/HKEX/EU large-company research may be explored as a separate source of external context.

Potential uses include:

- peer/external benchmark display;
- contextual recommendation evidence;
- research/verification-page comparisons;
- reporting-frequency comparisons.

Do not:

- mix these data into the core SME score by default;
- alter core weights from this dataset without explicit methodological approval;
- present large-company observations as direct SME peer truth.

---

## 14. Out of current Climate School build

The following are not required in the current research build:

- paid subscriptions/billing;
- commercial multi-tenant SaaS administration;
- proprietary market-intelligence products;
- peer/company scraping as a commercial feature;
- paid Alan/Henry-style peer benchmarking;
- enterprise customer permissions;
- monetization-specific workflows.

The current implementation should not unnecessarily block later additions, but it should not build these features now.

---

## 15. Acceptance criteria

### A. Functionality

Does the application provide the functionality defined in this scope?

### B. Method integrity

Do scoring and computation preserve the key formulas and config-driven structure of the Capstone baseline, except where a change has been explicitly reviewed and approved?

### C. Extensibility

Can later modules/integrations be added without requiring reconstruction of the core assessment?

### D. Engineering quality

Is the implementation materially faster, more reliable, cleaner, more maintainable, and more capable of scaling than the v1 research prototype?

### E. Usability

Is the application substantially easier, clearer, and more professional to use than v1?

### F. Research transparency

Can a reviewer understand where questions, calculations, weighting, source evidence, and recommendations come from?

---

## 16. Architecture freedom

The implementation must preserve modularity, auditability, and future extensibility.

Specific architectural choices are intentionally left to the build process and periodic human review.

The system should be judged primarily on whether it satisfies the functional and quality requirements above—not on whether its internal structure resembles v1 or an early planning assumption.
