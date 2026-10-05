# Base Weight Generation

**Source workbook:** `AtomicIndicators.xlsx`  
**Source tab:** `prompt weights`  
**Status:** Legacy-pipeline provenance record; source wording preserved verbatim.

## Original workbook note

Weights prompt (assigns base weight between 1 and 5. 75% of extra comes from cross-doc consensus, 25% from within the same doc)

## Original prompt

```text
You are generating **defensible base weights** for an SME sustainability QuestionBank.

This is a fresh task. Do not assume or reuse any prior weighting logic. Use only the definitions in this prompt.

---

## INPUT

`atomic_clusters_weights.csv`

Each row is an atomic indicator with:

* cluster_id
* cluster_total_count
* doc_coverage_pct
* industry_doc_coverage_pct
* market_doc_coverage_pct
* applicability_type
* applicability_value

---

## OBJECTIVE

Assign a **base_weight (1–5)** to each row.

Base weight must reflect:

> How strongly this concept is supported by evidence within the **relevant document set**

---

## CORE PRINCIPLE

Use **different evidence pools**:

* Universal indicators → evaluate against **full corpus**
* Industry indicators → evaluate within **that industry’s corpus**
* Market indicators → evaluate within **that market’s corpus**

Do NOT mix these.

---

## STEP 1 — CREATE RANKS (0–1 SCALE)

### A. Universal indicators (applicability_type = universal)

Compute:

* doc_coverage_rank_global
  → rank `doc_coverage_pct` across ALL rows (0–1 percentile)

* cluster_frequency_rank_global
  → rank `cluster_total_count` across ALL rows (0–1 percentile)

---

### B. Industry indicators (applicability_type = industry)

Compute WITHIN SAME industry (`applicability_value`):

* doc_coverage_rank_industry
  → rank `industry_doc_coverage_pct` within that industry

* cluster_frequency_rank_industry
  → rank `cluster_total_count` among rows in that industry

---

### C. Market indicators (applicability_type = market)

Compute WITHIN SAME market (`applicability_value`):

* doc_coverage_rank_market
  → rank `market_doc_coverage_pct` within that market

* cluster_frequency_rank_market
  → rank `cluster_total_count` among rows in that market

---

## STEP 2 — COMBINE RANKS

Use:

```text
base_weight_score =
0.75 * doc_coverage_rank
+ 0.25 * cluster_frequency_rank
```

Where:

* doc coverage = primary signal (cross-document agreement)
* cluster frequency = secondary signal (volume of evidence)

---

## STEP 3 — SCALE TO 1–5

```text
base_weight_raw = 1 + 4 * base_weight_score
base_weight = round(base_weight_raw, 2)
```

---

## STEP 4 — ADD COLUMNS

Append:

* base_weight_score
* base_weight
* weighting_basis
* question_candidate_flag

---

## weighting_basis

Short explanation:

Examples:

* "universal: strong cross-document coverage across corpus"
* "industry (Manufacturing): high coverage within manufacturing documents"
* "market (EU): strong presence across EU-related documents"

---

## question_candidate_flag

Set TRUE if:

* indicator is actionable, measurable, or assessable for SMEs

Set FALSE if:

* purely definitional
* too granular
* duplicative without adding new meaning
* not usable in a questionnaire

---

## RULES

* Do NOT use multipliers, tags, buyer type, or business goal here
* Do NOT mix global and contextual ranking pools
* Do NOT delete rows
* Do NOT merge rows
* Do NOT rewrite indicator_text
* Return full CSV

---

## OUTPUT REPORT

Also report:

* total rows processed
* min / max base_weight
* average base_weight
* count of TRUE question_candidate_flag
* top 10 clusters by average base_weight

---

Do not explain reasoning outside of weighting_basis. Return the updated dataset.

```
