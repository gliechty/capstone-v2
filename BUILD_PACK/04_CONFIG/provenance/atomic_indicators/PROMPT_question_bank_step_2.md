# QuestionBank Step 2

**Source workbook:** `AtomicIndicators.xlsx`  
**Source tab:** `qb_prompt_2`  
**Status:** Legacy-pipeline provenance record; source wording preserved verbatim.

## Original workbook note

Final prompt to generate questionBank

## Original prompt

```text
You are completing **Step 2 (final enrichment)** of an SME Sustainability QuestionBank.

You are given a pre-generated QuestionBank (Step 1 output).

Your task is to:

* refine questions
* resolve duplicates intelligently
* assign answer structures (AnswerScales or MetricBenchmarks)
* complete all metadata fields

---

## INPUT

QuestionBank Step 1 table

Columns:
question_id, question_text, question_type, trigger_value, category, subcategory, cluster_id, base_weight

MetricBenchmarks table

AnswerScales table

---

## OBJECTIVE

Produce a **fully enriched QuestionBank** ready for scoring and Appsmith integration.

---

## STEP 1 — DUPLICATE → PROGRESSION LOGIC (CRITICAL)

Within each cluster:

If multiple questions overlap:

DO NOT automatically delete.

Instead:

### Convert into progression:

Level 1 (universal):

* simple existence / baseline

Level 2 (contextual):

* more specific OR scoped

Level 3 (advanced, optional):

* metric / quantitative / maturity-based

---

### Example transformation:

BAD:
3 identical waste questions across markets

GOOD:

1. Do you track total waste generated? (universal)
2. Do you track waste by type and disposal method? (contextual)
3. What % of waste is diverted from landfill? (metric)

---

### Rule:

Only delete a question if:

* it adds no new scope
* no added specificity
* no added maturity/metric depth

---

## STEP 2 — ANSWER STRUCTURE

### A) Use MetricBenchmarks when available

* assign metric_id
* answer_scale_id = NUMERIC_INPUT
* response_type = numeric or percent
* include unit in question_text if needed

---

### B) Otherwise assign AnswerScale

Use:

| Case      | Scale       |
| --------- | ----------- |
| Yes/No    | YN          |
| Partial   | PARTIAL_3   |
| Progress  | PROGRESS_5  |
| Maturity  | MATURITY_4  |
| Frequency | FREQUENCY_3 |

---

### C) Upgrade contextual duplicates

If two questions exist in same cluster:

→ Make the second one:

* more specific OR
* maturity-based OR
* metric-based

---

## STEP 3 — SME SIMPLIFICATION

If question is too technical:

→ rewrite to be SME-answerable

Example:
"report NOx emissions"
→
"monitor air emissions (e.g. NOx, particulate matter)"

---

## STEP 4 — METADATA COMPLETION

Populate ALL fields:

question_id
question_text
question_type
trigger_value
framework_source
base_weight
priority
active (TRUE)
tags
category
subcategory
answer_scale_id
response_type
metric_id
rationale
cluster_id
size_applicability
weighting_basis
question_origin

---

## ADDITIONAL METADATA (SELECT ONLY RELEVANT)

From available fields, include:

* cluster_total_count
* global_frequency_percent
* source_repetition_count
* base_weight_score

Do NOT overload with all fields.

---

## STEP 5 — NEW CONFIG SUGGESTIONS (CONTROLLED)

### A) New AnswerScales (max 5)

Only if clearly needed.

---

### B) New MetricBenchmarks (max 10)

ONLY if:

* quantitative concept is critical
* no existing benchmark fits

Each must include:

* metric_id
* unit
* normalization method
* parameters
* credible source (IEA, ILO, FAO, World Bank, etc.)

---

## STEP 6 — PRIORITY FINALIZATION

* universal first
* then contextual
* within cluster: simple → advanced

---

## RATIONALE (REQUIRED)

For each question:

* why selected (cluster + weight)
* why answer structure chosen
* if metric used: why appropriate
* if progression: explain relationship

---

## OUTPUT

1. Final QuestionBank table

2. Output report:

   * counts (universal/industry/market)
   * metric vs categorical
   * new metrics created
   * new answer scales created

3. New MetricBenchmarks (if any)

4. New AnswerScales (if any)

```
