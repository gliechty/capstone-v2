# Multiplier Rules Prompt — Industry / Market / Universal

**Source workbook:** `MultiplierRules.xlsx`  
**Source tab:** `prompt1`  
**Status:** Provenance record; source wording preserved verbatim.

## Original workbook note

This prompt used to generate industry/market/universal multipler rules from dataset atomic_with_clusters (Claude - ChatGPT generated prompt)

## Original prompt

```text
You are generating MultiplierRules for an SME sustainability scoring system.
Input:
Atomic_With_Clusters table.
Goal:
Create a set of context-based multipliers that adjust base weights based on industry and market relevance.
IMPORTANT:
- Base weights are already determined by cluster frequency.
- Multipliers should reflect where certain topics are disproportionately important.
---
STEP 1 — Identify concentration
For each cluster_id:
- Count total rows
- Count rows where applicability_type = industry
- Count rows where applicability_type = market
Then identify clusters where:
- industry_count / total_count ≥ 0.30
- OR market_count / total_count ≥ 0.30
These clusters show strong contextual relevance.
---
STEP 2 — Derive rules from tags
For each qualifying cluster:
- Extract candidate_tags
- Extract applicability_value (industry or market)
Group similar clusters by:
- shared tags (e.g., energy, labor, governance)
- shared applicability_value
---
STEP 3 — Generate MultiplierRules
Create rules with the following structure:
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
source_clusters
---
RULE LOGIC
- multiplier ranges:
  1.15 = mild relevance
  1.25 = moderate relevance
  1.35 = strong relevance
- assign multiplier based on strength of concentration:
  30–40% → 1.15
  40–60% → 1.25
  >60% → 1.35
- use:
  industry when applicability_type = industry
  target_market_region when applicability_type = market
- do NOT create duplicate rules for identical tag + context combos
- keep rules interpretable (max ~15–20 rules)
---
RATIONALE REQUIREMENTS
Each rule must include:
- plain-language explanation
- reference to cluster behavior (frequency + context)
Example:
"Energy-related indicators appear disproportionately in Manufacturing clusters, indicating higher materiality for this sector."
---
OUTPUT FORMAT
Return a clean table:
rule_id | active | tag | category | subcategory | industry | target_market_region | target_buyer | business_goal | multiplier | rationale | source_clusters
---
DO NOT:
- invent tags not present in data
- create overly granular rules
- exceed ~50 rules
```
