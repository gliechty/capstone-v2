# Indicator Clustering

**Source workbook:** `AtomicIndicators.xlsx`  
**Source tab:** `indicators_clustered prompt`  
**Status:** Legacy-pipeline provenance record; source wording preserved verbatim.

## Original workbook note

Indicator clusters prompt - This and subsequent prompts in Claude

## Original prompt

```text
You are grouping atomic sustainability indicators into concept clusters.
GOAL:
Group similar indicators into clusters representing the SAME underlying concept, even if phrased differently.
INPUT:
A table of atomic indicators with columns including:
atomic_id, indicator_text, category, subcategory, candidate_tags, source_doc_id
TASK:
1. GROUP INDICATORS INTO CLUSTERS
- Each cluster represents ONE concept
- Indicators belong in the same cluster if they:
  - measure the same thing
  - require the same underlying data
  - would become the same assessment question
2. DO NOT OVER-SPLIT
- Do NOT separate:
  - Scope 1 vs Scope 2 emissions → SAME cluster
  - policy vs strategy vs target → SAME cluster if conceptually linked
- Do separate:
  - energy vs emissions
  - safety vs labor vs governance
3. OUTPUT STRUCTURE
Return a NEW table with:
cluster_id
representative_indicator
category
subcategory
atomic_ids (comma-separated)
source_docs (comma-separated)
frequency_count
4. REPRESENTATIVE INDICATOR
- Choose the clearest, most general phrasing
- Should be easily convertible into a question
5. FREQUENCY
- Count number of atomic rows in cluster
6. IMPORTANT RULES
- Each atomic_id must appear in EXACTLY ONE cluster
- Do NOT drop any rows
- Do NOT create duplicate clusters for the same concept
- Prefer slightly broader clusters over overly granular ones
OUTPUT ONLY THE CLUSTER TABLE.
```
