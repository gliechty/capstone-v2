# MOSAIC M6.0 — Phase 1 interaction review

**Updated:** 20 November 2026 · **Status:** M6.0 version-1 design remains owner-approved. The owner additionally approved three global scoring documents and integrated formula editing. Local implementation is verified at http://localhost:3206/admin; the owner has accepted this local implementation. Deployment remains separate. Canonical evidence: EXECUTION_PLAN.md, M6 editable ScoringFormulas.
This is the existing proposal, revised in place. The owner's three-part model supersedes the earlier per-KB scoring-sheet adoption design and “new KB version” terminology for QuestionBank-only edits.

## 1. Agreed model

| Part | Meaning | Phase 1 |
| --- | --- | --- |
| Universal Scoring Documents | AnswerScales, MetricBenchmarks and ScoringFormulas apply across all configuration sets | Edit · Download · History. Save and publish applies to new assessments across all configuration sets. Existing assessments retain the versions they started with |
| Knowledge Base | A set of source documents | Existing source collection remains unchanged; source selection/upload/generation is outside Phase 1 |
| Configuration Set | Non-universal assessment documents derived from a KB | Edit only QuestionBank wording, answerScale assignment and metric_id assignment. Other configuration documents are read-only |
| App-wide Source Records | DocumentIndex and DocumentChunks cover the entire application in Phase 1 | View / Download, read-only |

A slightly different custom answer scale is appended to the universal AnswerScales, then mapped from the appropriate question. It is not a private per-KB sheet. Later generation searches these universal documents and flags missing suitable scales/benchmarks instead of inventing matches.

There is no per-configuration-set adoption step for universal updates. Universal save/publication history records editor, timestamp, change summary and optional notes. Keep internal version identifiers for reproducibility; do not expose a separate adoption workflow.

QuestionBank changes create a **configuration-set version**, not a new KB. The source collection and universal documents are unchanged by that edit. Each assessment retains its starting configuration and scoring-document versions. This is implemented and locally verified; production deployment remains pending.

## 2. Admin Center — one page, no tab bar

```text
Universal Scoring Documents
  AnswerScales                   Edit · Download · History
  MetricBenchmarks               Edit · Download · History
  ScoringFormulas                Edit · Download · History
  Save and publish affects new assessments across all configuration sets;
  existing assessments retain their starting versions.

KB / Configuration Set
  Default KB: approved source collection · 44 documents
  Configuration set: SME sustainability · latest saved version
  QuestionBank                   Open / edit wording and mappings
  Other configuration documents View / Download (read-only)
  Configuration-set versions    History

App-wide Source Records
  DocumentIndex                  View · Download
  DocumentChunks                 View · Download
```

Use click-in screens and expandable groups. No new-KB, upload, generation, collaboration or prompt-editing controls in Phase 1.

## 3. Formula methodology editing — approved extension, locally implemented

ScoringFormulas contains equations, parameter definitions/defaults, explanations and example inputs. MetricBenchmarks references a formula and supplies benchmark-specific parameter values. From a benchmark, inspect the equation and calculated examples, Edit shared formula, Create variation for this benchmark, or New formula for this benchmark without navigating away. Shared review lists every affected benchmark. Formula creation/assignment publish atomically; variations leave other benchmarks on their existing formula. ScoringFormulas also provides independent editing and audit access.

History can Restore scoring snapshot: all three global documents are restored together as a new publication. Existing sessions keep their exact earlier formulas and values. Configuration Make default remains separate and uses the selected QuestionBank with current global scoring. Formula expressions support bounded mathematics and piecewise conditions; invalid syntax/arithmetic/references block publication or scoring. Example previews are sampled checks, not methodology certification. The inherited working_hours note discrepancy is disclosed, not silently corrected. Current user walkthrough: M6-PLANNING-HANDOFF.md.

## 3a. Historical clickable mockup (19 November)

The files below preserve the approved earlier visual review. They do not contain the subsequent formula editor; use the local application above for the current interaction.

- [Standalone HTML](M6-ADMIN-UI-PHASE1-REVIEW.html)
- Local preview while its server is running: http://127.0.0.1:56834/
- Inline source: C:/Users/guyli/.codex/visualizations/2026/11/15/01a1de3b-0097-72a0-b45b-e975937725a3/m6-phased-admin-screens.html

The standalone HTML is exported from the same interaction source. It runs without an application server, authentication or provider access. Downloads contain clearly labelled representative CSV rows, not complete production exports.

**One complete simulated save journey:** QuestionBank → select question → wording/mapping edits → review → optional notes → save confirmation → configuration history.

Universal Edit and History actions open explanatory/representative views. Universal Save and publish is intentionally unavailable in this mockup: only the QuestionBank save journey is simulated. This is not a claim that universal-document editing works. Other configuration and source views are read-only.

## 4. Three-minute owner walkthrough

1. **0:00–0:30 — Orient.** Open the preview. Inspect the three sections and the universal Save and publish explanation. Under KB / Configuration Set, choose Open QuestionBank.
2. **0:30–1:15 — Wording and scale.** Select U-001. Change its wording, then choose PARTIAL_3. Inspect No / Some / Yes and scores 0 / 50 / 100 beside the selector. The assignment is a demonstration, not methodology approval.
3. **1:15–2:00 — Metric mapping.** Back to QuestionBank → select U-031. Keep NUMERIC_INPUT and choose MET_WASTE_DIV. Inspect units, method, range, direction and scope beside the selector. All representative metrics are visible, including kWh/USD and times per year. An incompatible selection produces an explanation; it is not silently filtered away.
4. **2:00–2:30 — Review.** Click Review changes. Compare the original and changed wording/mappings. Enter Change notes if useful, or leave them blank. Notes are optional and never gate saving.
5. **2:30–3:00 — Save and inspect.** Click Save changes. The confirmation identifies configuration-set v2 and automatically records the preview editor, save timestamp and change summary. Open version history. Notes appear alongside those fields; a blank note displays “No notes added.” Inspect v1 to see the preserved original questions.

## 5. Required interaction behavior

- Make saved configuration, unsaved question changes and universal scoring documents distinguishable.
- Only wording and scoring mappings are editable in QuestionBank. IDs, response type, weights, categories and other fields are read-only.
- Show scale labels/scores and benchmark details beside selectors.
- NUMERIC_INPUT represents direct numeric input, not an editable zero-score answer option.
- Do not filter all metric choices to percentages. Compatibility depends on the actual question and benchmark contract.
- Explain why Review/Save is unavailable: no changes, blank wording, or the concrete mapping mismatch.
- Keep edits while navigating. Discard changes requires confirmation and leaves saved versions intact.
- **Change notes are optional.** Automatically record editor, timestamp and a before/after change summary on every simulated save.
- Preserve previous configuration versions. Do not fabricate missing baseline author/date metadata.
- The mockup saves only in preview state. Raw standalone-page reload starts fresh; no durable backend persistence or authenticated identity is implied.

## 6. Representative records and verification

Existing clean records reused:
- QuestionBank U-001 (environmental policy), U-031 (waste diversion percentage), U-018 (safety training frequency).
- AnswerScales YN, PARTIAL_3, PROGRESS_5 and NUMERIC_INPUT.
- MetricBenchmarks waste_diverted_percent, MET_WASTE_DIV, safety_training_frequency and MET_EN_INT_REV.
- Read-only excerpts from MultiplierRules, CategoryWeights, DocumentIndex and DocumentChunks.

The waste-diversion options share percentage scoring in the preserved records. Their use in this UI demonstration does not create an application-wide compatibility method. The preview uses explicit representative compatibility checks only; implementation must reuse approved schemas/validation and surface unresolved semantics.

Browser checks completed for the current iteration:
- Open QuestionBank, edit U-001 wording and scale, return without losing edits.
- Open U-031, inspect non-percentage benchmark details and see the mismatch explanation.
- Select MET_WASTE_DIV, review all before/after changes and save with notes **left blank**.
- Confirm automatic editor/time/change-summary recording and “No notes added” in configuration history.
- Inspect rendered history layout; final JavaScript parses.

These are mockup checks, not production authentication, authorization, scoring, persistence or publication evidence. The nonblank-notes display follows the same stored notes field; no claim of a separate browser test for that branch is made.

## 7. Phases and implementation boundary

1. **Maintenance:** current KB/configuration overview, universal scoring-document maintenance, restricted QuestionBank editing, audit/download/history.
2. **Update the current KB:** source edition replacement, provenance-qualified reuse and approved downstream regeneration. Source processing must not block Phase 1.
3. **Create separate KBs/configuration sets:** source-library selection and new uploads, reusing the Phase 2 pipeline. Separate logical records in the existing store, not separate physical databases.

Preserve working Google login, SQLite/artifact storage, versioning and assessment-session pinning. Do not change the application during visual review. Once an interaction is approved, implement one complete wording-edit path first, verify the new and prior assessment behavior, then extend to mappings and universal documents. The new global publication semantics require explicit implementation reconciliation; the current backend is not asserted to implement them already.

For future source processing, reuse document-local artifacts only with matching source bytes/edition, stage inputs, processing versions and QA provenance. Materialize the selected KB's atomic dataset and recompute corpus-dependent clustering/coverage/weights/configuration under approved rules. Preserved legacy artifacts are recovery evidence, not automatically a verified cache. No source processing or methodological choice is authorized here.

## 8. Processing gaps carried forward

Summary of the existing detailed stage register in **M6-PLANNING-HANDOFF.md**. Prompt/artifact names refer to preserved `BUILD_PACK/04_CONFIG` material. No candidate convention previously discussed in planning is approved by this proposal.

| Stage | Existing prompt/script/artifact | Missing | Recovery versus decision |
| --- | --- | --- | --- |
| Sources → index/chunks/atomics | PROMPT_document_index.md, PROMPT_document_chunks.md, PROMPT_atomic_extraction.md; AtomicIndicators workbook | Exact original bytes/editions, model/run history; parser/OCR/orchestration code | Recover Capstone inputs/sessions. Extraction objective exists; missing inputs, documentation and implementation |
| Atomic normalization | Original/normalized atomic CSVs; normalization_notes | Full normalization instruction and executable stage | Recover conversation/working file. If absent, method decision; examples do not authorize “lowercase everything” |
| Clustering/membership | PROMPT_cluster_generation.md; indicators_clustered.csv, atomic_with_clusters.csv | Adjudication/run history, stable IDs, match-flag meaning, duplicate/unresolved handling; join code | Recover original decisions; exact atomic-ID join supported. No invented fuzzy matching or threshold |
| Counts/coverage | PROMPT_cluster_frequency.md; atomic_clusters_frequency.csv | Undefined industry_doc_coverage_pct, market_doc_coverage_pct, source_repetition_pct, doc_count_per_cluster, doc_coverage_pct; denominators, multi-context membership, blank/zero and units | Recover enrichment instructions/context tables; unrecovered policy needs method decision. Implementation absent |
| Frequency → weight input | Frequency/weighted CSVs; PROMPT_base_weights.md | global_frequency_pct → global_frequency_percent changes scale (first row 4.4369 → 0.044369), while specific_context_pct stays 42.3077; handoff/precision undocumented | Recover referenced atomic_clusters_weights.csv/session; do not normalize every percentage identically |
| Base weights | PROMPT_base_weights.md; atomic_weighted_candidates.csv | Percentile estimator/ties, ranking pools, singleton/empty cases, multi-context/geo and missing coverage | 75/25 rank blend, 1–5 scaling and final two-decimal rounding exist. Recover conventions or obtain method decision; code absent |
| Question selection | PROMPT_question_bank_step_1.md; 149-row output | Requested 140 (30 universal/110 contextual) versus 149; revision/approval and insufficient-evidence policy | Recover sessions. Unrecovered count policy needs decision, not fabricated questions |
| Enrichment/mappings | PROMPT_question_bank_step_2.md; 125-row output; scales/benchmarks | Row QA/research provenance and generated-mapping review integration | Recover reviewed research; new benchmarks need evidence. Missing documentation/integration, not permission to infer values |
| Trigger cleanup → production | PROMPT_question_bank_step_3.md; 144/141-row variants; QB_Final 161; authoritative QuestionBank_Config_Test_Questions.csv | Split-ID/delta lineage, OR/intersection adjudication and final-to-production edits/QA | Recover original decisions/artifact differences; matching counts do not prove equivalence |
| Industry/market multipliers | PROMPT_industry_market.md; MultiplierRules workbook | Overlapping 40% boundary, cluster/tag aggregation and selection history | Recover; unresolved boundary/aggregation needs method decision; automation absent |
| Buyer/goal multipliers | PROMPT_buyer_goal.md; workbook prompt2/Sheet1 | Individual designed-logic selection/review history | Recover rationale. Interpretive rules are documented; there is no missing deterministic formula to invent |
| Category weights | PROMPT_category_weights.md; CategoryWeights workbook | Clamp/redistribution order, rounding/residual allocation and empty/missing categories/industries | Recover working sessions; otherwise method decision before implementation; no stored formulas settle these gaps |
| Import/Quick qualification | migrate-config.ps1, document-identity-map.json, config schemas; M8 preprocessing experiment | General new-KB import/job integration and changed-question Quick qualification | Primarily implementation/review gaps. Baseline-specific title repairs are not a generic converter |

Recovery does not itself implement a pipeline. Replaying preserved outputs does not verify regeneration. Missing method conventions must not be quietly filled by interface defaults.

## 9. Review gate

Owner visual review is pending. Claude's earlier feedback was based on Markdown/code, not a rendered click-through. Review the actual current HTML against the three-minute journey, the three-part model, optional notes and version-history fields. Report confusing actions or missing feedback; do not infer implementation approval.

No application data, authentication, backend behavior, production deployment or MAIN worktree changes were made. The existing implementation is preserved.
