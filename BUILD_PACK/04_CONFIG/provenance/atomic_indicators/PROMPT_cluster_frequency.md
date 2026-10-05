# Cluster Frequency / Enrichment

**Source workbook:** `AtomicIndicators.xlsx`  
**Source tab:** `atomic_clusters_frequency promp`  
**Status:** Legacy-pipeline provenance record; source wording preserved verbatim.

## Original workbook note

First prompt

## Original prompt

```text
You are creating an enriched atomic indicator table for weighting.
Input:
Atomic_With_Clusters table.
Create a new table called atomic_clusters_weights.
Keep all original columns and add:
cluster_total_count
cluster_universal_count
cluster_industry_count
cluster_market_count
specific_context_count
global_frequency_pct
specific_context_pct
source_repetition_count
Definitions:
- cluster_total_count = count of rows with the same cluster_id
- cluster_universal_count = count of rows with same cluster_id and applicability_type = universal
- cluster_industry_count = count of rows with same cluster_id and applicability_type = industry
- cluster_market_count = count of rows with same cluster_id and applicability_type = market
- specific_context_count = count of rows with same cluster_id, same applicability_type, and same applicability_value
- global_frequency_pct = cluster_total_count / total number of atomic rows
- specific_context_pct = specific_context_count / cluster_total_count
- source_repetition_count = count of rows with same cluster_id and same source_doc_id
Rules:
- Do not delete rows.
- Do not merge rows.
- Do not rewrite indicator_text.
- Preserve all existing columns.
- Return CSV.
Also report:
- total rows processed
- number of unique clusters
- min/max cluster_total_count
- any rows with missing cluster_id
```
