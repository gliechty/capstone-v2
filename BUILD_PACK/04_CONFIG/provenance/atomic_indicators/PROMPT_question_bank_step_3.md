# QuestionBank Step 3 / Structural Cleanup

**Source workbook:** `AtomicIndicators.xlsx`  
**Source tab:** `qb_prompt_3`  
**Status:** Legacy-pipeline provenance record; source wording preserved verbatim.

## Original workbook note

final cleaning prompt - makes multi-trigger possible (industry | market | size) with updated n8n code

## Original prompt

```text
You are running Step 2.1 structural cleanup on the SME Sustainability QuestionBank.

INPUTS
- In-progress QuestionBank Step 2 CSV
- AnswerScales
- MetricBenchmarks
- Current n8n code logic summarized below

GOAL
Transform the QuestionBank so it is fully compatible with the existing n8n selector.

DO NOT modify or redesign:
- question_text
- answer_scale_id
- metric_id
- response_type
- category
- subcategory
- base_weight
- framework_source
- cluster_id
- cluster_progression_level
- tags
- rationale

CURRENT N8N SELECTION LOGIC
Each active row is selected only if:

1. industry_trigger is either ANY or exactly matches SME industry
2. market_trigger is either ANY or appears in SME target_market_region
3. size_applicability passes the employee-band filter

The matcher uses AND logic:

industryOk && marketOk && sizeOk

Therefore each row must be atomic.

FINAL REQUIRED TRIGGER MODEL

Every final row must have exactly ONE industry_trigger and exactly ONE market_trigger.

Allowed patterns:

1. Universal
   industry_trigger = ANY
   market_trigger = ANY

2. Industry-only
   industry_trigger = one specific industry
   market_trigger = ANY

3. Market-only
   industry_trigger = ANY
   market_trigger = one specific market

4. Industry-market pair
   industry_trigger = one specific industry
   market_trigger = one specific market

STRICTLY FORBIDDEN:
- semicolon-separated triggers
- comma-separated triggers
- multiple markets in one row
- multiple industries in one row
- blank trigger cells

If any row contains multiple trigger values, duplicate/split it into atomic rows.

Examples:
- EU;UK becomes two rows: ANY/EU and ANY/UK
- APAC;South Asia becomes two rows: ANY/APAC and ANY/South Asia
- Manufacturing;Construction becomes two rows: Manufacturing/ANY and Construction/ANY
- Manufacturing + EU;UK becomes two rows: Manufacturing/EU and Manufacturing/UK
- Manufacturing;Construction + EU;UK becomes four rows:
  Manufacturing/EU
  Manufacturing/UK
  Construction/EU
  Construction/UK

If a row was intended as “industry OR market,” split it into:
- industry-specific / ANY
- ANY / market-specific

If a row was intended as a true industry-market intersection, keep it as:
- specific industry / specific market

Use judgment based on the existing question_type, trigger_value, and rationale.

VALID INDUSTRY VALUES
Use exactly:
- Manufacturing (Industrial / Components)
- Food & Agro-processing
- Consumer Goods (Apparel / FMCG)
- Construction / Materials
- Business / Export Services

VALID MARKET VALUES
Use exactly:
- EU
- UK
- APAC
- LATAM
- North America
- Eastern Europe
- Middle East
- South Asia
- Africa
- Oceania

UNIVERSAL VALUE
Use exactly:
- ANY

SIZE APPLICABILITY
Add or standardize the column:
- size_applicability

Allowed values only:
- all
- medium_plus
- large

Rules:
- default = all
- medium_plus = use only where a question clearly requires formal capacity, tracking systems, dedicated staff, quantitative inventories, third-party assurance, EPDs, LCA, or comparable operational maturity
- large = use very rarely

Do NOT use small_plus.

PRIORITY
Reassign priority as a global integer from 1 to N.

Requirements:
- no duplicates
- no gaps
- numeric only
- roughly grouped by category
- within similar clusters, order L1 before L2 before L3
- universal questions should generally appear before contextual questions within the same cluster

SCORING INTEGRITY
Before finalizing, verify:
- every row has either a valid answer_scale_id OR a valid metric_id
- every metric_id exists in MetricBenchmarks
- NUMERIC_INPUT is only used when metric_id is present
- no row has missing category, base_weight, response_type, or priority

OUTPUTS
1. Cleaned QuestionBank CSV
2. Delta report with:
   - row count before and after
   - list of duplicated/split rows
   - count by question_type
   - count by industry_trigger
   - count by market_trigger
   - count by size_applicability
   - list of any unresolved issues

FINAL CHECK
Before finishing, explicitly confirm:
- no trigger cell contains a comma or semicolon
- no trigger cell is blank
- all rows are atomic
- all priorities are unique
- no question was dropped
```
