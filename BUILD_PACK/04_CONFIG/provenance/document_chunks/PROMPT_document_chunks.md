# Document Chunks Prompt — Evidence Extraction

**Source workbook:** `DocumentChunks.xlsx`  
**Source tab:** `prompt1`  
**Status:** Provenance record; source wording preserved verbatim.

## Original prompt

```text
You are extracting structured evidence from a sustainability document for a procurement-focused SME assessment tool.

Your task is to identify and extract procurement-relevant evidence chunks from the document.

Focus ONLY on content that would matter to:

enterprise buyers
supplier onboarding
sustainability questionnaires
compliance or disclosure expectations
operational requirements placed on suppliers
OUTPUT FORMAT

Return your output as a table with the following columns:

chunk_id
doc_title
chunk_text
source_section_or_page
summary
evidence_type
category
subcategory
tags
industry_scope
buyer_scope
region_scope
strength
citation_label
EXTRACTION RULES
Each chunk must:
be 80–220 words
contain ONE idea only
be understandable out of context
be directly useful as evidence for a recommendation
Only include content that reflects:
explicit supplier requirements
strong expectations from buyers
common supplier practices tied to procurement
disclosure requirements
benchmarks used in supplier evaluation
Do NOT include:
generic ESG language
high-level mission statements
vague sustainability principles
duplicated content
FIELD DEFINITIONS
evidence_type:
one of [requirement, strong expectation, common practice, disclosure signal, benchmark, risk]
category:
choose from [Energy, Materials, Water, Waste, Labor, Governance, Traceability, Certifications, Emissions, Supplier Management]
subcategory:
short, specific label (e.g. "Scope 3 reporting", "Supplier screening", "Hazardous waste handling")
tags:
3–6 comma-separated keywords (lowercase)
industry_scope:
one of:
Manufacturing (Industrial / Components)
Food & Agro-processing
Consumer Goods (Apparel / FMCG)
Construction / Materials
Business / Export Services
Multi
buyer_scope:
one of [Enterprise, Government, Export Buyer, Multi]
region_scope:
one of [Global, EU, UK, US, APAC, Multi]
strength:
High = explicit requirement or standard
Medium = strong expectation or common buyer behavior
Low = weak signal or emerging practice
citation_label:
short human-readable reference (e.g. "GRI 308, Disclosure 308-1")
ADDITIONAL INSTRUCTIONS
Prefer fewer, high-quality chunks over many weak ones
Aim for 8–15 strong chunks per document
Use the original wording from the document whenever possible.
You may lightly clean formatting (remove bullets, fix grammar, shorten slightly)
Do NOT paraphrase or reinterpret meaning
If the content is heavily paraphrased, discard and re-extract using closer original wording.
Do NOT rewrite into your own language
If shortening, remove non-essential parts but preserve exact phrasing of key requirements
Do NOT invent content
If unsure, exclude the chunk
Run this for the selected document only
```

## Original workbook note

Run this extraction for [the document you're chunking] only. at the bottom of the prompt
