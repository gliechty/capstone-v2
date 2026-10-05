# Category Weights Prompt — Industry Weight Generation

**Source workbook:** `CategoryWeights.xlsx`  
**Source tab:** `prompt1`  
**Status:** Provenance record; source wording preserved verbatim.

## Original workbook note

prompt used to generate Category weights from atomic_with_clusters (run in Claud, prompt from ChatGPT

## Original prompt

```text
You are generating CategoryWeights for an SME sustainability scoring system using empirical evidence.

Input:
Atomic_With_Clusters table.

Goal:
Calculate category weights for each industry based on the distribution of indicators.

Steps:

1. Filter rows where applicability_type = industry.

2. For each industry (applicability_value):
   - Count total rows
   - Count rows per category:
     People
     Governance
     Community
     Resources

3. For each industry:
   - Compute category_weight = category_count / total_count

4. Normalize so each row sums to 1.0

5. Apply smoothing:
   - No category may be below 0.10
   - No category may exceed 0.50
   - If adjustment is needed, redistribute proportionally

Output:

industry | people_weight | governance_weight | community_weight | resources_weight | notes

Notes should briefly explain:
- dominant categories
- why distribution looks that way
```
