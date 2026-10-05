# n8n Webhook Inventory

**Authoritative caller:** Appsmith page `SME Assessment Tool`

This file records the two production webhook contracts represented by the supplied final Appsmith + n8n exports.

---

## 1. Question selection

### Endpoint

`POST https://n8n.flowagentai.website/webhook/final-preview-questions`

Current host is a v1 deployment detail.

### Appsmith caller

`SME Assessment Tool → API_Get_Questions`

### n8n workflow

`capstone-ai-final`

### Request

```json
{
  "sme_context": {
    "company_name": "string",
    "industry": "string",
    "subindustry": "string",
    "employee_band": "string",
    "revenue_band": "string",
    "company_location": "string",
    "country": "string",
    "target_market_region": ["string"],
    "target_buyer": "string",
    "business_goal": "string",
    "notes": "string"
  }
}
```

### Response

```json
{
  "company_name": "string|null",
  "test_id": null,
  "question_count": 0,
  "questions": [
    {
      "question_id": "...",
      "question_text": "...",
      "question_type": "...",
      "trigger_value": "...",
      "industry_trigger": "...",
      "market_trigger": "...",
      "framework_source": "...",
      "base_weight": "...",
      "priority": "...",
      "active": "...",
      "tags": [],
      "answer_scale_id": "...",
      "response_type": "...",
      "metric_id": "...",
      "category": "...",
      "subcategory": "...",
      "rationale": "...",
      "cluster_id": "...",
      "size_applicability": "...",
      "cluster_progression_level": "..."
    }
  ]
}
```

### Runtime dependencies

- `QuestionBank_Config`
- `Test_Questions` tab — confirmed authoritative final v1 QuestionBank
- Google Sheets OAuth credential

---

## 2. Recommendations / RAG output

### Endpoint

`POST https://n8n.flowagentai.website/webhook/capstone-ai-output-final`

Current host is a v1 deployment detail.

### Appsmith caller

`SME Assessment Tool → API_Get_Recommendations`

### n8n workflow

`capstone-ai-output-final`

### Request top-level fields

```json
{
  "sme_context": {},
  "raw_overall": {},
  "weighted_overall": {},
  "category_scores": [],
  "weighted_category_breakdown": [],
  "category_debug": {},
  "category_weights": {},
  "scoring_summary": {},
  "answered_questions": []
}
```

### n8n processing dependencies

- `DocumentIndex`
- `DocumentChunks`
- Google Sheets OAuth credential
- OpenAI API credential
- model configured as `gpt-5.2`

### Intended LLM JSON body

```json
{
  "executive_summary": "string",
  "priority_recommendations": [
    {
      "priority_rank": 1,
      "title": "string",
      "why_it_matters": "string",
      "recommended_action": "string",
      "evidence": [
        {
          "doc_title": "string",
          "source": "string",
          "pages_or_section": "string",
          "link": "string"
        }
      ],
      "related_categories": ["Category"],
      "implementation_difficulty": "Low|Medium|High"
    }
  ],
  "key_gaps": [
    {
      "category": "string",
      "gap": "string",
      "evidence": [
        {
          "doc_title": "string",
          "source": "string",
          "pages_or_section": "string",
          "link": "string"
        }
      ]
    }
  ],
  "grounding_notes": "string"
}
```

### Actual webhook response contract

The n8n workflow returns the **OpenAI node output**, rather than extracting the above JSON object into a clean API response itself.

The current Appsmith integration expects the model text at approximately:

`API_Get_Recommendations.data.output[0].content[0].text`

and then parses that text as JSON.

This response-shape coupling is a legacy implementation detail and should not automatically become the v2 API contract.

---

## 3. Legacy sandbox endpoints — explicitly non-authoritative

The Appsmith export contains older sandbox webhook references such as:

- `/webhook/preview-questions`
- `/webhook/output-sandbox-v1`

Per user confirmation, these belong to modular development/test pages and are **not** authoritative production endpoints.

---

## 4. Build Pack placement

Store this file at:

`BUILD_PACK/03_LEGACY_N8N/webhook_inventory.md`
