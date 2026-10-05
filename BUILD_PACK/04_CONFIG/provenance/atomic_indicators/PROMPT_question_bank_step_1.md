# QuestionBank Step 1

**Source workbook:** `AtomicIndicators.xlsx`  
**Source tab:** `qb_prompt_1`  
**Status:** Legacy-pipeline provenance record; source wording preserved verbatim.

## Original workbook note

Final (working) prompt to generate new QuestionBank from atomic_weighted_candidates plus AnswerScales and Noah's MetricBenchmarks

## Original prompt

```text
You are generating the **initial draft QuestionBank (Step 1 of 2)** for an SME sustainability assessment.

This step focuses ONLY on:

* selecting high-signal indicators
* drafting clear, SME-answerable questions

Do NOT assign answer scales, metrics, or rationale yet.

---

## INPUT

`atomic_weighted_candidates.csv`

Columns include:
cluster_id, indicator_text, category, subcategory, applicability_type, applicability_value, size_relevance, base_weight, candidate_tags, source_doc_id, atomic_id

---

## OBJECTIVE

Generate **exactly 140 candidate questions**:

* 30 universal questions
* 110 conditional questions (industry + market)

---

## STEP 1 — FILTER

Keep rows:

* Universal → base_weight ≥ 3.5
* Industry / Market → base_weight ≥ 3.2

---

## STEP 2 — CLUSTER SELECTION

Group by `cluster_id`.

For each cluster:

* Select the highest base_weight universal indicator (if exists)
* Select up to 2–3 contextual indicators (industry or market) if they add specificity

Clusters can generate multiple questions.

---

## STEP 3 — QUESTION GENERATION

### A) Universal questions

* General, broadly applicable
* Easy for low-maturity SMEs to answer
* Avoid technical jargon

Assign:

* question_type = universal
* trigger_value = Universal

---

### B) Contextual questions

* Industry-specific OR market-specific
* Must be more specific than universal version

Assign:

* question_type = industry OR market
* trigger_value = exact applicability_value

---

## STEP 4 — PRIORITY

* Universal questions first (lower priority number)
* Contextual questions after (higher number)
* Maintain logical grouping by cluster

---

## STEP 5 — SME CONSTRAINT

Assume many SMEs:

* do not track formal metrics
* may have informal processes

Therefore:

* prefer simple, direct wording
* allow “No” or “Not yet” to be valid responses

---

## OUTPUT SCHEMA (EXACT)

question_id
question_text
question_type
trigger_value
category
subcategory
cluster_id
base_weight

---

## RULES

* Do NOT assign answer_scale_id
* Do NOT assign metric_id
* Do NOT include rationale
* Do NOT invent new concepts
* Do NOT duplicate questions within a cluster
* Keep wording clear and practical

---

## OUTPUT REPORT

Include:

* total questions (must = 140)
* count:

  * universal
  * industry
  * market
* count by category

---

Return:

1. Question table
2. Output report

```
