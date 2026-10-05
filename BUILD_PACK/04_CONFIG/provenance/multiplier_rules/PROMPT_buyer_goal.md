# Multiplier Rules Prompt — Buyer / Goal

**Source workbook:** `MultiplierRules.xlsx`  
**Source tab:** `prompt2`  
**Status:** Provenance record; source wording preserved verbatim.

## Original workbook note

This prompt used to generate Buyer/Goal multipler rules from dataset atomic_with_clusters (Claude - ChatGPT generated prompt)

## Original prompt

```text
You are generating buyer- and goal-based multiplier rules for an SME sustainability scoring system.

Use the same tag vocabulary from the previous MultiplierRules generation.

Input:
List of candidate_tags from the dataset.
Goal:
Create multiplier rules that reflect how different buyer types and business goals prioritize sustainability indicators.
Buyer types:
Enterprise
Government
SME
Consumer Brands
Export Buyer
Business goals:
Win enterprise customers
Access new markets
Meet buyer sustainability requirements
Prepare for procurement questionnaires
Improve sustainability ratings
Investor readiness
Rules:
- Use tags to define relevance (e.g., compliance, governance, traceability, reporting)
- Create 8–12 total rules
- Multipliers must be between 1.1 and 1.25
- Do NOT overlap excessively with industry/market rules
- Keep logic simple and interpretable
Output:
rule_id
active
tag
category
subcategory
industry
target_market_region
target_buyer
business_goal
multiplier
rationale
source = "designed_logic"
Each rationale must clearly explain WHY that buyer or goal increases importance of the tag.
```
