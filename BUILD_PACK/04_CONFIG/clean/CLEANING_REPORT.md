# Cleaning Report

## Output summary

| File | Raw rows | Clean rows | Columns |
|---|---:|---:|---:|
| `QuestionBank.csv` | 161 | 161 | 25 |
| `AnswerScales.csv` | 39 | 39 | 6 |
| `MetricBenchmarks.csv` | 62 | 62 | 14 |
| `MultiplierRules.csv` | 42 | 42 | 12 |
| `CategoryWeights.csv` | 5 | 5 | 6 |
| `DocumentIndex.csv` | 44 | 44 | 14 |
| `DocumentChunks.csv` | 428 | 428 | 14 |

## Explicit transformations

- Boundary whitespace trimmed.
- UTF-8 BOM removed.
- Obvious mojibake repaired.
- `active` boolean casing normalized.
- Blank rows removed (none of the seven authoritative inputs contained substantive blank-row blocks).
- `CategoryWeights.csv` restored full underlying precision from the supplied `CategoryWeights.xlsx` source workbook.

## Validation flags requiring migration awareness

- Missing AnswerScale references from QuestionBank: none.
- Missing MetricBenchmark references from QuestionBank: ['managed_land_hectares'].
- Exact DocumentIndex/DocumentChunks title mismatches: 9 on each side.
- Duplicate chunk IDs across different documents: ['EC-01', 'EC-02', 'EC-03', 'EC-04', 'EC-05', 'EC-06', 'EC-07', 'EC-08'].

### Document title mismatches

**Chunk titles without exact index match:**
- 2025 CDP SME Questionnaire
- Australian Sustainability Reporting Standard AASB S1 [voluntary]
- Containers & Packaging Sustainability Accounting Standard
- Corporate Sustainability Reporting Directive (CSRD)
- Corporate Value Chain (Scope 3) Standard
- EFRAG IG 1: Materiality Assessment Implementation Guidance
- EFRAG IG 2: Value Chain Implementation Guidance
- Sustainability Reporting Handbook For Vietnamese Companies
- UNOPS Sustainable Procurement Framework

**Index titles without exact chunk match:**
- 2025 CDP SME Questionnaire: Modules 14-21
- Corporate Value Chain (Scope 3) Accounting and Reporting Standard
- EFRAG IG 2: Value chain
- EU Corpurate Social Responsibility Directive (CSRD)
- General Requirements for Disclosure of Sustainability-related Financial Information
- IG 1 Materiality Assessment_final
- Sustainability Accounting Standard: Containers & Packaging
- Sustainability Reporting Handbook for Vietnamese Companies
- UNOPS Sustainable Procurement Framework (Annex 1 to the Procurement Manual)

### Category weight row sums
- Business / Export Services: 1.0000
- Construction / Materials: 1.0000
- Consumer Goods (Apparel / FMCG): 1.0000
- Food & Agro-processing: 1.0000
- Manufacturing (Industrial / Components): 1.0000
