# n8n Workflow / Dependency Inventory

**Source artifacts reviewed**
- `n8n-question-selection-final-2026-10-02.json` (exported workflow name: `capstone-ai-final`)
- `n8n-output-rag-final-2026-10-02.json` (exported workflow name: `capstone-ai-output-final`)
- `APPSMITH_COMPONENT_MAP.md` / Appsmith export for caller verification

**Purpose**
Human-readable migration map of the two n8n workflows used by the authoritative `SME Assessment Tool`.

**Status**
Finalized for Build Pack use based on the supplied n8n exports, Appsmith caller verification, and user confirmation of authoritative data sources and preprocessing boundaries.

---

## 1. Runtime relationship

```text
SME Assessment Tool (Appsmith)
        │
        ├── POST /webhook/final-preview-questions
        │       ↓
        │   n8n: capstone-ai-final
        │       ↓
        │   QuestionBank_Config / Test_Questions
        │       ↓
        │   selected question array
        │
        └── POST /webhook/capstone-ai-output-final
                ↓
            n8n: capstone-ai-output-final
                ↓
            DocumentIndex
                ↓
            select top documents
                ↓
            DocumentChunks
                ↓
            select top chunks
                ↓
            construct grounded recommendation prompt
                ↓
            OpenAI GPT-5.2
                ↓
            raw model response → Appsmith parser/rendering
```

The Appsmith export points both API actions at the same n8n host:
`https://n8n.flowagentai.website`

The host is a deployment detail, not a v2 requirement.

---

# 2. Workflow A — Question Selection

## Export metadata

| Field | Value |
|---|---|
| Exported workflow name | `capstone-ai-final` |
| Active in export | `true` |
| Nodes | 6 |
| Trigger | Webhook |
| Method | POST |
| Webhook path | `/webhook/final-preview-questions` |
| Response mode | Explicit `Respond to Webhook` node |

## Node order

```text
Preview Questions API
    ↓
Normalize SME Profile From Body
    ↓
Read QuestionBank
    ↓
Select Questions
    ↓
Format Question Output
    ↓
Return Preview Questions
```

## Node inventory

### 2.1 `Preview Questions API`

Type: n8n Webhook

Accepts:
`POST /webhook/final-preview-questions`

Expected request body:

```json
{
  "sme_context": {
    "company_name": "...",
    "industry": "...",
    "subindustry": "...",
    "employee_band": "...",
    "revenue_band": "...",
    "company_location": "...",
    "country": "...",
    "target_market_region": ["...", "..."],
    "target_buyer": "...",
    "business_goal": "...",
    "notes": "..."
  }
}
```

Caller verified in authoritative Appsmith page:
`SME Assessment Tool → API_Get_Questions`

### 2.2 `Normalize SME Profile From Body`

Type: Code

Creates a normalized object containing:

- `test_id` = `null`
- `company_name`
- `industry`
- `subindustry`
- `employee_band`
- `revenue_band`
- `company_location`
- `country`
- `target_market_region` normalized to an array
- `target_buyer`
- `business_goal`
- `notes`

Important:
- This production path does **not** depend on a pre-seeded SME record.
- `test_id` is explicitly set to `null`.

### 2.3 `Read QuestionBank`

Type: Google Sheets

Exported source reference:

| Field | Export value |
|---|---|
| Spreadsheet cached name | `QuestionBank_Config` |
| Sheet/tab cached name | `Test_Questions` |
| Google Sheets credential reference | `Google Sheets account` |

The credential export contains a credential **reference**, not a secret value.

### 2.4 `Select Questions`

Type: Code

The workflow:

1. filters to active question rows;
2. normalizes matching values/aliases;
3. evaluates industry applicability;
4. evaluates market applicability;
5. evaluates size applicability;
6. sorts selected questions by numeric priority;
7. returns the selected question fields.

#### Active-row rule

A row is active only if `active`, lowercased/trimmed, equals one of:

- `true`
- `yes`
- `1`
- `active`

Blank is **not** treated as active in this workflow.

#### Industry matching

The SME has one normalized `industry`.

A question's `industry_trigger` may contain multiple semicolon/comma-separated values.

Question passes if:
- trigger contains `any`, or
- trigger contains the SME industry.

The code contains explicit aliases for the current industry vocabulary.

#### Market matching

SME markets are built from:

- `target_market_region`
- `company_location`

A question's `market_trigger` may contain multiple semicolon/comma-separated values.

Question passes if:
- trigger contains `any`, or
- any trigger value matches one of the SME markets.

#### Size matching

Employee bands are ranked:

| Band | Rank |
|---|---:|
| 1–10 | 1 |
| 11–50 | 2 |
| 51–250 | 3 |
| 251–500 | 4 |
| 501–1000 | 5 |
| 1001+ | 6 |

`size_applicability` behavior:
- blank / `all` / `all smes` → include
- `medium_plus` → employee rank >= 3
- `large` → employee rank >= 5
- any other value → currently falls through to `true`

That last fallback is a current implementation behavior and should not be interpreted as a desired v2 validation rule without review.

#### Selected question payload fields

Each selected question contains:

- `question_id`
- `question_text`
- `question_type`
- `trigger_value`
- `industry_trigger`
- `market_trigger`
- `framework_source`
- `base_weight`
- `priority`
- `active`
- `tags` (split into an array)
- `answer_scale_id`
- `response_type`
- `metric_id`
- `category`
- `subcategory`
- `rationale`
- `cluster_id`
- `size_applicability`
- `cluster_progression_level`

Debug fields are also generated internally for employee-band / size selection inspection.

### 2.5 `Format Question Output`

Type: Set

Final response object:

```json
{
  "company_name": "...",
  "test_id": null,
  "question_count": 0,
  "questions": []
}
```

### 2.6 `Return Preview Questions`

Type: Respond to Webhook

Returns the formatted JSON directly to Appsmith.

---

# 3. Workflow B — Retrieval + Recommendation Generation

## Export metadata

| Field | Value |
|---|---|
| Exported workflow name | `capstone-ai-output-final` |
| Active in export | `true` |
| Nodes | 10 |
| Trigger | Webhook |
| Method | POST |
| Webhook path | `/webhook/capstone-ai-output-final` |
| Response mode | Explicit `Respond to Webhook` node |
| LLM node model | `gpt-5.2` |

## Node order

```text
Webhook
    ↓
Normalize Retrieval Outputs
    ↓
Get DocumentIndex
    ↓
Select Matching Documents
    ↓
Get DocumentChunks
    ↓
Select Matching Chunks
    ↓
Format Retrieval Output
    ↓
Build Recommendation Prompt
    ↓
Message a model
    ↓
Respond to Webhook
```

## Node inventory

### 3.1 `Webhook`

Type: n8n Webhook

Accepts:
`POST /webhook/capstone-ai-output-final`

Caller verified in authoritative Appsmith page:
`SME Assessment Tool → API_Get_Recommendations`

Appsmith sends:

- `sme_context`
- `raw_overall`
- `weighted_overall`
- `category_scores`
- `weighted_category_breakdown`
- `category_debug`
- `category_weights`
- `scoring_summary`
- `answered_questions`

### 3.2 `Normalize Retrieval Outputs`

Type: Set

Copies SME context and scoring payload fields from the webhook request.

#### Migration note: trailing-space field names

The export contains trailing spaces in several assignment names:

- `weighted_overall `
- `category_scores   `
- `category_debug `
- `category_weights `

Later code refers to unspaced names.

This is documented as a **legacy implementation quirk / potential bug**, not a v2 requirement. The output flow also reconstructs/falls back for some missing scoring fields downstream, which helps explain why the runtime could still produce results.

Do **not** intentionally reproduce trailing-space keys in v2.

### 3.3 `Get DocumentIndex`

Type: Google Sheets

Exported source:

| Field | Export value |
|---|---|
| Spreadsheet cached name | `DocumentIndex` |
| Sheet/tab cached name | `DocumentIndex` |
| Credential reference | `Google Sheets account` |

### 3.4 `Select Matching Documents`

Type: Code

This is deterministic rule-based retrieval.

It does **not** use embeddings or semantic vector search in the supplied final workflow.

#### Active filter

If the `active` field is nonblank and is not exactly normalized `true`, the document is excluded.

A blank `active` field is allowed through.

#### Document retrieval score

Each document receives additive points from:

1. priority
2. industry match
3. region match
4. buyer match
5. topic-tag hits in SME context
6. summary relevance

Priority conversion:

| Priority | Points |
|---|---:|
| High | 3 |
| Medium | 2 |
| Low | 1 |
| Numeric value | numeric value |
| Unrecognized | 0 |

Industry match:
`+4`

Region match:
`+3`

Buyer match:
`+3`

Topic-tag hit:
`+2` per hit

Summary relevance:
up to `+2`

The workflow sorts descending and keeps:

**top 8 documents**

#### Document fields passed downstream

- `doc_id`
- `doc_title`
- `doc_type`
- `source`
- `category`
- `industry`
- `region`
- `buyer_type`
- `topic_tags`
- `priority`
- `active`
- `summary`
- `link`
- `retrieval_score`
- `retrieval_reasons`

### 3.5 `Get DocumentChunks`

Type: Google Sheets

Exported source:

| Field | Export value |
|---|---|
| Spreadsheet cached name | `DocumentChunks` |
| Sheet/tab cached name | `Sheet1` |
| Credential reference | `Google Sheets account` |

### 3.6 `Select Matching Chunks`

Type: Code

Only chunks belonging to already-selected parent documents are considered.

#### Important join behavior

The current workflow matches chunks to selected parent documents by normalized:

`doc_title`

—not by `doc_id`.

This is a legacy dependency/fragility to fix or explicitly preserve through regression testing. v2 should preferably use a stable document identifier.

#### Chunk retrieval score

Chunk score begins with the selected parent document's retrieval score.

Then adds:

Strength:
- High = +3
- Medium = +2
- Low = +1

Industry match:
`+3`

Region match:
`+2`

Buyer match:
`+2`

Tag hit:
`+2` per hit

Summary relevance:
up to `+2`

The workflow sorts descending and keeps:

**top 18 chunks**

#### Chunk fields passed downstream

- `chunk_id`
- `doc_title`
- `chunk_text`
- `source_section_or_page`
- `summary`
- `evidence_type`
- `category`
- `subcategory`
- `tags`
- `industry_scope`
- `buyer_scope`
- `region_scope`
- `strength`
- `citation_label`
- `retrieval_score`
- `retrieval_reasons`

### 3.7 `Format Retrieval Output`

Type: Code

Combines:

- SME context
- scoring payload
- selected documents
- selected chunks

It attempts to parse JSON-like payload fields when they have arrived as strings.

If `weighted_overall` is missing/empty, it derives a weighted score from:

`weighted_category_breakdown[].weighted_contribution`

If `category_scores` is missing/empty, it derives category rows from the weighted category breakdown.

### 3.8 `Build Recommendation Prompt`

Type: Code

Builds one large recommendation prompt containing:

1. SME context
2. scoring outputs
3. selected document metadata
4. selected chunk text/metadata
5. output JSON contract
6. recommendation-ranking rules
7. SME-size guidance
8. evidence/citation instructions
9. executive-summary instructions

Key behavioral constraints in the current prompt include:

- prioritize actual SME answers first;
- use retrieved chunks before score-only reasoning;
- do not invent laws, standards, buyer requirements, or numeric thresholds;
- make recommendations size-appropriate;
- prioritize low scores + procurement relevance + strong retrieved evidence;
- no more than 5 recommendations;
- no more than 3 key gaps;
- return JSON only;
- hide internal question/chunk IDs from user-facing prose.

The recommendation prompt should later be extracted separately into:
`BUILD_PACK/06_AI_RAG/prompts/`

### 3.9 `Message a model`

Type: n8n OpenAI node

Exported configuration:

| Field | Value |
|---|---|
| Model | `gpt-5.2` |
| Credential reference | `OpenAi account` |

The export includes the credential reference, not the actual API key.

The workflow relies on the prompt instruction to return JSON. The supplied workflow does not contain a separate structured-output/schema-validation node after the LLM call.

### 3.10 `Respond to Webhook`

Returns the OpenAI node output directly.

The authoritative Appsmith page then parses:

`API_Get_Recommendations.data?.output?.[0]?.content?.[0]?.text`

as JSON for rendering.

---

# 4. External dependency inventory

## Required at current v1 runtime

| Dependency | Used by | Purpose | Captured yet? |
|---|---|---|---|
| n8n runtime | both workflows | orchestration/webhooks | Workflow exports captured |
| Google Sheets OAuth credential | both workflows | read configuration/retrieval data | Reference captured; secret intentionally not exported |
| `QuestionBank_Config` workbook / `Test_Questions` tab | question selection | authoritative final v1 question bank | Exported as CSV |
| `DocumentIndex` workbook/tab | output workflow | document metadata and retrieval scoring | PRESENT: `04_CONFIG/raw/DocumentIndex - DocumentIndex.csv`; canonical clean copy: `04_CONFIG/clean/DocumentIndex.csv` |
| `DocumentChunks` workbook / `Sheet1` tab | output workflow | chunk text + retrieval metadata | PRESENT: `04_CONFIG/raw/DocumentChunks - Sheet1.csv`; canonical clean copy: `04_CONFIG/clean/DocumentChunks.csv` |
| OpenAI API credential | output workflow | recommendation generation | Reference captured; secret intentionally not exported |
| GPT-5.2 behavior | output workflow | current recommendation generation | Model name captured |
| Appsmith `SME Assessment Tool` | caller | constructs requests / renders responses | Appsmith export + screenshots captured |

## Not used by these supplied runtime workflows

The supplied n8n exports do **not** show:

- Postgres queries
- NocoDB queries
- vector database calls
- embeddings
- file/PDF parsing at request time
- Google Drive document downloads
- calls to additional n8n subworkflows
- scheduled triggers
- environment-variable reads in workflow code
- direct document ingestion/chunk-generation steps

This means those behaviors should **not be inferred** as part of the two exported runtime workflows.

---

# 5. Migration-critical contracts

## Question-selection contract

Input:
`SME context`

Output:
`ordered array of applicable question records`

Core deterministic logic to regression-test:
- active filtering
- alias normalization
- industry trigger
- market trigger
- company-location contribution to market matching
- employee-band / size applicability
- priority sorting
- output fields

## Recommendation contract

Input:
- SME context
- deterministic scoring results
- answered-question detail

Intermediate:
- top 8 matching documents
- top 18 matching chunks
- grounded recommendation prompt

Output:
JSON-compatible recommendation response containing:
- executive summary
- prioritized recommendations
- key gaps
- grounding notes

---

# 6. Known implementation quirks / migration flags

These are documented, not assumed to be desired v2 behavior:

1. Some normalized scoring field names have trailing spaces in the n8n Set node.
2. Chunks join to parent documents by `doc_title`, not stable `doc_id`.
3. `size_applicability` values other than recognized cases currently fall through as included.
4. Document retrieval is deterministic metadata matching rather than embedding/vector retrieval.
5. Output JSON is prompt-enforced rather than validated by a dedicated schema/parser node.
6. The n8n/OpenAI response shape is coupled to Appsmith's parser path.
7. Current data lives in Google Sheets; that location is an implementation detail, while the data/logic itself is migration-critical.

---

# 7. Confirmed source-of-truth decisions

### 7.1 `Test_Questions` is authoritative v1 QuestionBank

Despite the name, `QuestionBank_Config → Test_Questions` was the final question bank used by the working production MVP.

The user has already exported:
- `Test_Questions` as CSV
- `Validation Lists` (the data-validation sheet) as CSV

These belong in `BUILD_PACK/04_CONFIG/raw/`.

### 7.2 Document chunking is outside the v1 runtime

For the current migration baseline, document chunking should be treated as **A: a separate one-time/manual preprocessing process**, not as part of the two supplied runtime workflows.

The corpus was processed using the same NotebookLM-based chunking workflow across documents, then the prepared chunk rows were consumed by the final n8n output workflow.

Therefore:
- preserve the existing `DocumentChunks` data and document how it was produced;
- do not pretend the supplied n8n runtime already contains ingestion/chunk-generation functionality;
- do not make document regeneration a blocking requirement for faithful v1 migration.

---

# 8. Future extensibility requirement — not current v1 behavior

The target architecture should preserve a clean path to a future **knowledge-base sync / standards-ingestion pipeline**, even if Prof. Guo does not include it in the immediate Columbia build.

A future user/admin should be able to upload, select, and deselect standards/source documents, then trigger a workflow such as **Sync Docs**.

That future workflow should be architecturally separable from the current assessment runtime and eventually support:

1. **Index/update document metadata** for newly selected source documents.
2. **Chunk documents** using a repeatable preprocessing pipeline.
3. **Extract atomic indicators** from the selected documents and write them to a canonical atomic-indicator store.
4. **Rebuild/update the configuration layer** from the selected source set, including question bank, base weights, multipliers, category weights, and other derived configuration based on indicator frequencies / coverage.
5. **Run corpus-quality / coverage checks** and surface useful errors or warnings where the selected source set is too small or does not adequately cover intended markets, industries, SME sizes, or other required dimensions.

Important boundary:
- this is a **future architectural requirement / stretch capability**, not a claim about what v1 currently does;
- the immediate v2/Climate School scope remains dependent on Prof. Guo's confirmation;
- the architecture should avoid making this future capability require a wholesale rewrite of the assessment engine.

A useful separation for v2 architecture is:

```text
Standards ingestion / sync plane
    ↓
canonical indicators + derived configuration + retrieval corpus
    ↓
versioned assessment configuration
    ↓
assessment runtime
    ↓
score + recommendations
```

This keeps source ingestion/config regeneration separate from respondent-time assessment execution.

---

# 9. Build Pack placement

Store this finalized file at:

`BUILD_PACK/03_LEGACY_N8N/workflow_inventory.md`
