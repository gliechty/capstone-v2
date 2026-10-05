# Prompt Index

This index distinguishes **runtime prompts** used by the deployed v1 application from **offline provenance/generation prompts** used to create configuration and retrieval datasets.

## Authority

For reconstruction of v1 behavior, use this order of authority:

1. final Appsmith and n8n exports;
2. canonical clean configuration datasets;
3. preserved source workbooks and provenance prompts;
4. Spring 2026 Capstone Report as supporting methodology documentation.

Where prose in the report conflicts with an actual preserved prompt, **prompt > prose**.

## 1. Runtime prompt

| Prompt | Location | Role | Runtime? |
|---|---|---|---|
| Recommendation generation | `06_AI_RAG/prompts/PROMPT_recommendation_runtime.md` | Generates grounded recommendation JSON from SME context, deterministic scores, retrieved documents, and retrieved chunks | Yes |

The final question-selection workflow is deterministic and contains no LLM prompt. Final scoring is also deterministic and is implemented in Appsmith's authoritative `AssessmentScoring` object.

`PROMPT_recommendation_runtime.md` remains the authoritative v1 runtime AI prompt.

## 2. Offline extraction environment

Three first-pass extraction tasks were run **document-by-document in NotebookLM**:

1. Atomic Indicator extraction
2. DocumentIndex metadata extraction
3. DocumentChunks evidence extraction

These are distinct outputs from the same source corpus and should not be conflated.

### 2.1 Atomic Indicator extraction

For each raw source document:

1. open a **new NotebookLM session/window for that document**;
2. run the prompt preserved from `AtomicIndicators.xlsx > atom_ind_prompt`;
3. replace the source-document ID/title placeholders;
4. extract atomic indicators from that document only;
5. append the resulting rows to the combined `atomic_indicators` dataset.

Prompt:
`04_CONFIG/provenance/atomic_indicators/PROMPT_atomic_extraction.md`

The fresh NotebookLM session/window per document is specifically confirmed for Atomic Indicator extraction.

### 2.2 Document indexing

For each Knowledge Base document, run in NotebookLM:

`04_CONFIG/provenance/document_index/PROMPT_document_index.md`

Source:
`DocumentIndex.xlsx > prompt1`

Purpose:
create one source-level metadata row later stored in `DocumentIndex`.

### 2.3 Document chunking

For each Knowledge Base document, run in NotebookLM:

`04_CONFIG/provenance/document_chunks/PROMPT_document_chunks.md`

Source:
`DocumentChunks.xlsx > prompt1`

Purpose:
extract procurement-relevant evidence chunks later stored in `DocumentChunks`.

Do not infer that the Atomic Indicator fresh-session/window convention necessarily applied to DocumentIndex or DocumentChunks unless separately documented.

## 3. Offline transformation environment: Claude

After the initial Atomic Indicator extraction, the downstream transformations were run in **Claude**, using the preserved prompts/tabs and intermediate datasets.

The legacy chain is:

`raw source documents`
→ NotebookLM atomic extraction
→ `atomic_indicators`
→ Claude downstream transformations
→ normalized / clustered / frequency-enriched / weighted candidates
→ QuestionBank drafts
→ later QA/implementation edits
→ production `QuestionBank_Config > Test_Questions`.

Principal preserved stages:

| Stage | Preserved prompt | Principal result |
|---|---|---|
| Atomic normalization / cleanup | no distinct standalone prompt preserved | `atomic_normalized` |
| Cluster generation | `PROMPT_cluster_generation.md` | `indicators_clustered` |
| Rejoin clusters to atomic rows | no distinct standalone prompt preserved | `atomic_with_clusters` |
| Frequency/context enrichment | `PROMPT_cluster_frequency.md` | `atomic_clusters_frequency` |
| Base-weight generation | `PROMPT_base_weights.md` | `atomic_weighted_candidates` |
| QuestionBank Step 1 | `PROMPT_question_bank_step_1.md` | `question_bank_step_1` |
| QuestionBank Step 2 | `PROMPT_question_bank_step_2.md` | `question_bank_step_2` |
| QuestionBank Step 3 | `PROMPT_question_bank_step_3.md` | `question_bank_step_3` |

Intermediate workbook tabs remain provenance even where a distinct prompt was not preserved.

`QB_Final` is the closest preserved workbook ancestor of production `QuestionBank_Config > Test_Questions`. Production `Test_Questions` remains authoritative because later QA/implementation edits occurred before deployment.

## 4. Other configuration-generation prompts

These are provenance/config-generation prompts rather than runtime prompts:

| Area | Preserved prompt/method files |
|---|---|
| MultiplierRules | industry/market generation; buyer/goal generation; rationale |
| CategoryWeights | category-weight generation; rationale |

The current MultiplierRules generation prompts intentionally produce **uplift multipliers**:
- industry/market prompt: 1.15 / 1.25 / 1.35;
- buyer/goal prompt: 1.10–1.25.

This is a legacy generation policy, not a reason to hard-code those exact limits into the v2 engine.

## 5. Migration rules

For faithful v2.0 reconstruction:

- preserve deterministic question selection and scoring;
- use final Appsmith/n8n exports and canonical clean config for v1 runtime behavior;
- use provenance prompts to explain how configuration/retrieval datasets were originally produced;
- do not automatically re-run legacy NotebookLM/Claude generation prompts during ordinary assessment runtime;
- future config-regeneration workflows should preserve the ability to regenerate from a selected corpus, but with generation, independent QA, provenance, deterministic validation, versioning, corpus-coverage checks, and explicit publish approval.
