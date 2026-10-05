# Atomic Indicators Provenance — Legacy Pipeline Map

**Source:** `AtomicIndicators.xlsx`

## Purpose

This folder preserves the derivation workflow that produced the indicator universe and successive QuestionBank drafts used during v1 development.

It is **provenance**, not a production specification. The current working v1 application does not read `AtomicIndicators.xlsx` at runtime. The authoritative v1 question-selection workflow reads the separate `QuestionBank_Config` workbook, tab `Test_Questions`.

Therefore, no tab in this workbook should be treated as the authoritative runtime QuestionBank unless it is explicitly compared with `Test_Questions`.

## Legacy stage map

| Stage | Prompt / method source | Resulting workbook tab |
|---|---|---|
| Method overview | `Why Steps` | n/a |
| Atomic extraction | `atom_ind_prompt` | `atomic_indicators` |
| Normalization / cleanup | no distinct prompt tab preserved | `atomic_normalized` |
| Cluster creation | `indicators_clustered prompt` | `indicators_clustered` |
| Rejoin clusters to atomic rows | no distinct prompt tab preserved | `atomic_with_clusters` |
| Frequency / context enrichment | `atomic_clusters_frequency promp` | `atomic_clusters_frequency` |
| Base-weight generation | `prompt weights` | `atomic_weighted_candidates` |
| QuestionBank drafting | `qb_prompt_1` | `question_bank_step_1` |
| QuestionBank enrichment | `qb_prompt_2` | `question_bank_step_2` |
| Trigger cleanup / selector compatibility | `qb_prompt_3` | `question_bank_step_3` |
| Later QuestionBank variants | no distinct prompt tab preserved | `qb_3_v2`, `qb_3ChatGPT_backup`, `QB_Final` |

## What to preserve

Preserve the complete original workbook unchanged.

Also export each **data/result tab** as CSV so the stages can be versioned, diffed, inspected by agents, and compared against later implementations without requiring spreadsheet parsing.

Because the exact lineage between the later QuestionBank variants and production `Test_Questions` is not yet verified, preserve all later variants rather than selecting one as canonical.

## v2.1 future-design note

A future standards-ingestion workflow may reuse the conceptual stages here, but should not simply automate this legacy process unchanged.

The intended future direction is a more controlled agentic workflow with distinct generation, QA, and provenance responsibilities, explicit validation gates, reproducible intermediate artifacts, and deterministic checks before configuration changes are accepted.

Likely future stages include:

1. ingest/index selected standards and source documents;
2. chunk documents with repeatable provenance;
3. generate atomic indicators with source citations;
4. independently QA indicator completeness, atomicity, category/applicability labels, and provenance;
5. cluster indicators with collision/coverage checks;
6. compute deterministic frequency/coverage statistics;
7. generate or update QuestionBank/config candidates;
8. validate market/industry/SME-size coverage and minimum corpus sufficiency;
9. require approval/versioning before publishing a new assessment configuration.

This note captures a future architectural constraint, not functionality present in v1.
