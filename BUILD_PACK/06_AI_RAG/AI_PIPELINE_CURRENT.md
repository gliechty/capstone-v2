# AI / RAG Pipeline — Current v1 and v2.0 Migration Decisions

## Scope

This document records:

1. the deployed v1 AI/retrieval behavior;
2. the offline preprocessing that produced its inputs;
3. confirmed migration decisions for v2.0 where they differ from v1.

It is not a substitute for the approved product scope. Any v2.0 feature marked as a migration decision remains subject to the final Climate School scope / implementation plan.

## Authority

For v1 parity:

1. final Appsmith and n8n exports are authoritative for runtime behavior;
2. canonical clean configuration datasets are authoritative for runtime values;
3. preserved source workbooks/prompts are authoritative for methodology provenance;
4. Spring 2026 Capstone Report is supporting documentation.

Where prose conflicts with an actual preserved prompt, **prompt > prose**.

---

# A. v1 runtime responsibility split

## A1. Question selection

Appsmith calls:

`POST /webhook/final-preview-questions`

The final n8n selector reads `QuestionBank_Config > Test_Questions` and applies deterministic:

- `active`;
- `industry_trigger`;
- `market_trigger` against target-market/company-location context;
- `size_applicability`.

### Buyer / goal behavior in v1

`target_buyer` and `business_goal` do **not** directly determine which questions are selected in the final v1 selector.

However, they are not ignored elsewhere:

- the authoritative `MultiplierRules` contains **12 buyer/goal-targeted rules**, so buyer/goal context can affect question-level adjusted weights and therefore scoring;
- `target_buyer` directly affects RAG document/chunk relevance;
- `business_goal` is included in RAG context/tag/summary relevance;
- both are passed into the final recommendation prompt.

So the accurate v1 statement is:

> Buyer and business-goal metadata affect scoring/retrieval/recommendation context, but not deterministic question selection.

## A2. Scoring

Final v1 scoring is implemented in Appsmith's authoritative:

`AssessmentScoring`

Appsmith performs:

- answer normalization;
- benchmark lookup/fallback;
- base-weight application;
- context multiplier matching;
- question-level scoring;
- category aggregation;
- industry category weighting;
- score-payload construction.

n8n does **not** own the final scoring engine.

## A3. Recommendation generation

After scoring, Appsmith sends the score payload to:

`POST /webhook/capstone-ai-output-final`

Runtime flow:

`Appsmith scored payload`
→ normalize retrieval inputs
→ read `DocumentIndex`
→ rank documents
→ read `DocumentChunks`
→ rank chunks
→ format retrieval output
→ build recommendation prompt
→ `gpt-5.2`
→ return result to Appsmith.

---

# B. v1 runtime retrieval

## B1. DocumentIndex ranking

`DocumentIndex` is ranked deterministically.

- inactive rows ignored;
- priority: High = 3, Medium = 2, Low = 1;
- industry match: +4;
- region match: +3;
- buyer match: +3;
- topic-tag hit: +2 each;
- summary relevance: up to +2.

Top **8 documents** are retained.

`business_goal` participates indirectly through the context text and summary-relevance matching.

## B2. DocumentChunks ranking

Chunks are restricted to selected parent documents.

- inherited parent-document score;
- strength: High = 3, Medium = 2, Low = 1;
- industry match: +3;
- region match: +2;
- buyer match: +2;
- tag hit: +2 each;
- summary relevance: up to +2.

Top **18 chunks** are retained.

## B3. Legacy join behavior

Chunks are matched to selected parent documents using normalized `doc_title`, not a stable `doc_id`.

This is a known migration weakness. v2 should use a stable document identifier while regression-testing the behavior change.

## B4. Retrieval type

The deployed v1 runtime uses **deterministic metadata ranking**.

It does **not** use vector embeddings or semantic vector search in the final supplied workflow.

---

# C. Runtime recommendation prompt

The final prompt receives:

- SME context;
- raw and industry-weighted scoring outputs;
- category scores;
- answered-question detail;
- selected documents;
- selected chunks.

It instructs the model to prioritize actual SME answers, then retrieved evidence, then scores as supporting signal; keep recommendations size-appropriate; avoid unsupported requirements/thresholds; and return structured JSON.

Exact prompt:

`06_AI_RAG/prompts/PROMPT_recommendation_runtime.md`

That file remains unchanged unless the runtime recommendation contract is intentionally revised.

---

# D. Offline preprocessing provenance

## D1. Three NotebookLM first-pass extraction branches

All three initial extraction prompts were run document-by-document in **NotebookLM**:

1. `AtomicIndicators > atom_ind_prompt`
2. `DocumentIndex > prompt1`
3. `DocumentChunks > prompt1`

The Atomic Indicator process specifically used a **new NotebookLM session/window for each raw document**.

## D2. Atomic Indicator downstream transformations

After NotebookLM extraction, subsequent Atomic Indicator transformations were run in **Claude**.

This includes the preserved normalization/clustering/frequency/weighting/QuestionBank transformation chain.

The resulting staged datasets are provenance. Production `QuestionBank_Config > Test_Questions` remains the authoritative deployed QuestionBank.

---

# E. v2.0 migration decision — buyer and business-goal relevance

v2.0 should preserve the current use of `target_buyer` and `business_goal` in scoring/retrieval/recommendations **and add a deterministic path for them to influence question relevance/selection where justified**.

Recommended architecture:

- add optional `buyer_trigger` / `business_goal_trigger` (or equivalent applicability arrays) to the QuestionBank schema;
- default to `ANY`, so universal comparability is preserved;
- derive/configure these fields from the corpus/config-generation workflow rather than asking an LLM to choose questions at runtime;
- keep a universal/core question floor so buyer/goal filters cannot over-prune the assessment;
- regression-test how many questions each profile receives.

The purpose is not to make question selection AI-driven. It is to make more SME metadata participate in the same deterministic config-driven selection mechanism.

---

# F. v2.0 migration decision — runtime metric calculation / evidence ingestion

v1 generally expects the SME to enter the metric/intensity value that will be normalized.

For v2.0, metric values should be able to come from multiple sources while converging on the same deterministic scoring contract.

Preferred source order:

1. **calculated in-session** from an emissions/ESG calculator when the required inputs exist;
2. **extracted from uploaded evidence** such as utility bills or current audits, after validation/confirmation;
3. **manually entered** by the SME when they already know the relevant metric/intensity.

The questionnaire should not force duplicate data entry. If a trusted calculated/extracted value already exists in session state, the corresponding question can be pre-filled or resolved from that value.

### Required provenance

A resolved metric should preserve:

- canonical `metric_id`;
- normalized unit;
- final value used for scoring;
- `value_source` such as `calculator`, `uploaded_evidence`, or `manual`;
- source artifact/reference where applicable;
- formula/calculator version for derived values;
- user confirmation status for extracted values.

LLMs may assist with document extraction, but numeric values used for scoring should pass deterministic parsing/unit validation and, where appropriate, user confirmation.

This changes the input path, not the scoring principle: once a canonical value is resolved, normalization and scoring remain deterministic.

---

# G. v2.0 multiplier policy

## G1. What the current authoritative rules actually do

The authoritative `MultiplierRules.xlsx > Sheet1` contains:

- **42 active rules**;
- **30** industry/market-targeted rules;
- **12** buyer/business-goal-targeted rules;
- multiplier values from **1.10 to 1.35**.

Distribution:

- 1.10: 1 rule
- 1.15: 7 rules
- 1.20: 6 rules
- 1.25: 15 rules
- 1.35: 13 rules

The preserved generation prompts intentionally created **uplift-only** multipliers:

- industry/market: 1.15 / 1.25 / 1.35;
- buyer/goal: 1.10–1.25.

Therefore, the current corpus/methodology treats multipliers as a mechanism to increase weight when contextual evidence indicates greater materiality.

## G2. Do not hard-code 1.10–1.35

The v2.0 engine should **not** infer its allowed multiplier bounds from the min/max values currently present in the database.

The configuration/regeneration system should be capable of producing a different valid rule set from a different corpus.

Recommended separation:

- **engine validation bounds**: configurable;
- **generation-policy bounds**: configurable and versioned;
- **published rule values**: generated/reviewed configuration.

## G3. Recommended v2.0 default: 1.0–1.5

For v2.0, a **1.0–1.5 default generation/validation policy** is the cleaner continuation of the current methodology.

Advantages:

- preserves the interpretation that the corpus-derived base weight is the baseline;
- context only increases materiality when there is positive evidence;
- avoids an AI/config generator suppressing an otherwise important question merely because evidence is sparse;
- is easier to explain and audit;
- is consistent with the existing rules and with the current effective-multiplier ceiling of 1.5.

The engine should still make the bounds explicit/configurable rather than burying `1.0` / `1.5` as magic constants.

## G4. Why support 0.5–1.5 at all?

A future **0.5–1.5** policy has a legitimate methodological advantage: it permits **bidirectional contextualization**.

Example:
a concept may be common across the corpus and therefore receive a high base weight, but have affirmative evidence that it is materially less relevant for a specific industry/market/buyer context. A multiplier below 1.0 can express that reduction without deleting the question.

Potential advantages:

- better context sensitivity;
- reduces over-weighting caused by corpus-wide frequency;
- creates a symmetric conceptual range around the baseline 1.0.

Risks:

- absence of evidence can be incorrectly treated as evidence of low materiality;
- probabilistic config generation could suppress important questions;
- multiple stacked down/up multipliers can become hard to interpret;
- cross-SME comparability becomes more sensitive to contextual configuration;
- stronger QA and provenance are required.

### Recommendation

Architect the multiplier schema/engine so a future policy such as **0.5–1.5 is possible**, but keep **1.0–1.5 as the v2.0 default generation policy** unless there is explicit, source-grounded evidence and a reviewed rule for down-weighting.

If below-1.0 multipliers are later enabled, require:

- explicit rationale;
- source/provenance;
- deterministic validation;
- a clearly defined stacking rule;
- a configured final effective-multiplier floor/ceiling;
- regression/sensitivity testing before publication.

---

# H. Report-vs-runtime guardrails

Known report errors should not be implemented:

1. report attribution of final scoring to n8n — incorrect;
2. report claim that buyer/business goal already drive v1 question selection — incorrect;
3. report reference to ~70 documents — canonical v1 index contains 44;
4. report prose suggesting current runtime intensity conversion — not v1 behavior, but runtime derivation is an intentional v2.0 improvement;
5. report prose describing current multipliers as already bidirectional 0.5–1.5 — broader than the deployed rule set;
6. any prose weighting description that conflicts with the preserved weighting prompt — **prompt wins**.

Do not add `date` as a scored response type. It is not part of the canonical final scoring model.

---

# I. Known migration issues

1. Parent document ↔ chunk matching relies on `doc_title`, not stable `doc_id`.
2. Clean-data audit found exact title mismatches between some index and chunk records.
3. Some `chunk_id` values are duplicated across documents.
4. JSON recommendation output is prompt-enforced rather than schema-validated.
5. The model response shape is coupled to the legacy Appsmith parser.
6. Legacy offline generation did not use the stronger generation → independent QA → provenance loops desired for future automated config regeneration.

---

# J. Migration principle

For v2.0, preserve deterministic/auditable scoring while improving the input and context layers:

- richer deterministic question applicability;
- reusable session values from calculators/uploads/manual entries;
- config-regeneration compatibility;
- explicit provenance/versioning;
- provider-independent business logic.

For future automated standards ingestion, treat the legacy NotebookLM/Claude prompts as methodology provenance—not as a production agent architecture to copy unchanged.
