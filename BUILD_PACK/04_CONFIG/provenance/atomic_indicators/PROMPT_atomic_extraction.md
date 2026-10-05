# Atomic Indicator Extraction

**Source workbook:** `AtomicIndicators.xlsx`  
**Source tab:** `atom_ind_prompt`  
**Status:** Legacy-pipeline provenance record; source wording preserved verbatim.

## Original workbook note

We used this prompt in NotebookLM - a RAG system

## Original prompt

```text
You are extracting ATOMIC INDICATORS from a source document for a procurement-facing SME sustainability scoring system.

Use these fields for every row:
source_doc_id = [REPLACE_WITH_DOC_ID]
source_title = [REPLACE_WITH_DOCUMENT_TITLE]

OBJECTIVE

Identify all sustainability-related indicators, disclosures, policies, metrics, or practices that could later become scored assessment questions.

An atomic indicator is the smallest meaningful unit of reportable or answerable sustainability information. Do not combine distinct disclosures into one row.

IMPORTANT RULES

Extract INDICATORS, not survey questions.
Do NOT deduplicate.
If an item contains "and" or "or", split into separate rows if they represent distinct disclosures.
Keep indicators atomic and specific.
Use plain, concise language.
Favor procurement-, buyer-, or export-relevant indicators.
Convert implied requirements into clear indicators.
Skip vague statements.

CATEGORIZATION

Assign ONLY ONE category:
People
Governance
Community
Resources

Use concise, reusable subcategories.

RESPONSE TYPE

boolean
numeric
percent
categorical
computed

Use numeric/percent only when clearly measurable; otherwise use boolean or categorical.

APPLICABILITY

applicability_type:
universal
industry
market
geo

applicability_value:
Universal (if universal)
Otherwise use exact values below when possible

Industries:
Manufacturing (Industrial / Components)
Food & Agro-processing
Consumer Goods (Apparel / FMCG)
Construction / Materials
Business / Export Services

Regions:
North America
LATAM
EU
UK
Eastern Europe
Middle East
Africa
South Asia
APAC
Oceania
EU/UK

SIZE RELEVANCE

all
medium_plus
large

Default to all unless clearly otherwise.

SOURCE CLASSIFICATION

source_type:
framework
buyer_requirement
guidance
benchmark
questionnaire
other

Use simple, literal subcategories; avoid unsupported analytical labels.

source_framework:
GRI
SASB
ESRS
TCFD
ISSB
VSME
CDP
Buyer-specific
None

If unclear, choose closest match.

CANDIDATE TAG RULES

2–3 tags per row (max 3)
short (1–3 words)
lowercase_with_underscores
SEMICOLON-separated
avoid generic or redundant tags
prefer specific tags

Each row:
1–2 topic tags
optional 0–1 context tag

STARTER TAGS

energy
electricity
renewable_energy
energy_efficiency
emissions
ghg
water
waste
recycling
materials
labor
health_safety
grievance_mechanism
training
diversity
ethics
anti_bribery
compliance
governance
policy
supplier_management
traceability
procurement
community_impact

Context:
manufacturing
export
eu_market
regulated_market
resource_intensive
supply_chain

EVIDENCE

1–2 line excerpt or paraphrase.
notes if needed to highlight context (for later LLM passes)

OUTPUT

atomic_id | source_doc_id | source_title | source_type | source_framework | indicator_text | category | subcategory | response_type | applicability_type | applicability_value | size_relevance | candidate_tags | evidence_excerpt | notes

QUALITY CHECK

Good:
Company tracks energy consumption
Company reports renewable electricity share
Company has a supplier code of conduct

Bad:
Sustainability is important
The company should be responsible

Now extract atomic indicators from the document.
```
