# Canonical Clean Config

**Purpose:** Canonical, agent-friendly copies of the authoritative v1 configuration and retrieval tables.

These files are derived from the immutable exports in `04_CONFIG/raw/`. The raw files remain the historical/source-of-truth snapshots. This `clean/` directory is intended for migration analysis, tests, and v2 implementation.

## Files

| Clean file | Raw source | Role in v1 |
|---|---|---|
| `QuestionBank.csv` | `QuestionBank_Config_Test_Questions.csv` | Authoritative production v1 QuestionBank used by the final n8n question selector |
| `AnswerScales.csv` | `AnswerScales - Sheet1.csv` | Categorical/boolean answer normalization |
| `MetricBenchmarks.csv` | `MetricBenchmarks - Sheet1.csv` | Numeric/percent normalization configuration |
| `MultiplierRules.csv` | `MultiplierRules_Sheet1.csv` | Context-sensitive scoring multipliers |
| `CategoryWeights.csv` | `CategoryWeights - Sheet1.csv` | Industry-specific final category aggregation |
| `DocumentIndex.csv` | `DocumentIndex - DocumentIndex.csv` | Retrieval document metadata / document ranking |
| `DocumentChunks.csv` | `DocumentChunks - Sheet1.csv` | Retrieval evidence chunks / chunk ranking |

`AtomicIndicators` is intentionally **not** part of this clean runtime-config set. It is preserved under `raw/atomic_indicators/` and `provenance/atomic_indicators/` because it documents the derivation pipeline rather than a table directly consumed by the production v1 app.

## Cleaning rules applied

Only mechanical normalization was performed:

- removed UTF-8 BOM where present;
- normalized CSV line endings;
- trimmed accidental leading/trailing whitespace in headers and cell values;
- removed completely blank rows;
- normalized recognized `active` boolean values to `TRUE` / `FALSE`;
- repaired obvious mojibake from the CSV exports (for example `â€”` → `—` and `â€“` → `–`);
- preserved row order, IDs, question wording, scoring values, rules, tags, and substantive content;
- did **not** invent missing values or silently rewrite configuration logic.

### CategoryWeights precision

The CSV export displayed weights rounded to two decimals. One displayed row therefore summed to `1.01`. Because the authoritative `CategoryWeights.xlsx` supplied earlier in this Build Pack contained the underlying full-precision values, `CategoryWeights.csv` restores those precise source values. This is an export-precision restoration, **not** a methodology change.

## Validation results

### Cross-references

- QuestionBank → AnswerScales: **PASS**
- QuestionBank → MetricBenchmarks: **PASS for active runtime rows**

The only QuestionBank metric reference missing from `MetricBenchmarks.csv` is:

- `I-045` → `managed_land_hectares` — the question is currently `active=FALSE`, so it does not affect the active v1 runtime.

### Category weight sums

After restoring full precision, each industry row sums to approximately `1.0`.

### Known retrieval-data issues preserved, not silently repaired

The v1 output workflow matches selected documents to chunks by normalized `doc_title`. The current data contains **9 chunk document titles without an exact DocumentIndex title match** and **9 DocumentIndex titles without an exact chunk title match**.

This is a migration issue, not a cleaning typo to repair blindly. v2 should use a stable `doc_id` foreign key instead of title matching.

The current `DocumentChunks.csv` also contains **8 duplicated `chunk_id` values** across different documents (`EC-01, EC-02, EC-03, EC-04, EC-05, EC-06, EC-07, EC-08`). They are preserved because the v1 runtime does not join on `chunk_id`; v2 should make chunk identifiers globally unique.

## Canonicality / guardrails for agents

1. Use `QuestionBank.csv` as the v1 question source—not any historical QuestionBank draft.
2. Treat the clean files as migration inputs, but use `raw/` when auditing whether cleanup altered a value.
3. Do not “improve” scoring rules, weights, or question content during a faithful v1 migration.
4. Known data issues above should be resolved through explicit migration decisions/tests, not silent cleanup.
5. Provenance prompts/methodology live under `04_CONFIG/provenance/`; they are explanatory history, not runtime configuration.
