# Document Index Prompt — Metadata Extraction

**Source workbook:** `DocumentIndex.xlsx`  
**Source tab:** `prompt1`  
**Status:** Provenance record; source wording preserved verbatim.

## Original prompt

```text
You are extracting structured metadata for a sustainability-related document used in a procurement-focused SME assessment MVP.

Return output for one document only [add document title here]

OUTPUT FORMAT

Output must be a table with the following headers:

doc_title doc_type source category industry region buyer_type topic_tags priority summary active status link

FIELD RULES
doc_title

Use the exact document title.

doc_type (choose one)
standard
supplier_code
buyer_framework
regulation
guidance
report
questionnaire
source

Issuing organization (e.g. GRI, Unilever, CDP)

category (choose one)
supplier_requirements
disclosure_framework
operational_guidance
reporting_standard
regulatory_reference
buyer_signal
industry (choose one)
Manufacturing (Industrial / Components)
Food & Agro-processing
Consumer Goods (Apparel / FMCG)
Construction / Materials
Business / Export Services
Multi
region (choose one)
Global
EU
UK
US
APAC
Multi
buyer_type (choose one)
Enterprise
Government
Export Buyer
Multi
topic_tags

3–8 comma-separated tags, lowercase
Focus on procurement-relevant concepts

priority (choose one)
High = directly used in supplier evaluation or requirements
Medium = strong supporting signal
Low = background only
summary

1–2 sentences explaining how this document is used in a supplier or procurement context

active

Always set to: TRUE

status

Always set to: To Review

link

Leave blank

INSTRUCTIONS
Be precise and conservative
Prefer Multi when scope is broad
Focus on procurement relevance, not general ESG framing
Do not include explanations
Output must be a table
```
