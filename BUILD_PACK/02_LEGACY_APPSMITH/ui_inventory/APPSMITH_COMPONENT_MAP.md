# Appsmith UI / Behavior Inventory — DRAFT PENDING CLARIFICATION

**Source artifacts reviewed**
- `appsmith-sandboxes-v1-export-2026-10-02.json` (Appsmith application export)
- `n8n-question-selection-final-2026-10-02.json`
- `n8n-output-rag-final-2026-10-02.json`
- 9 Appsmith screenshots supplied for the Build Pack

**Purpose**
This file is a human-readable migration map of the current Appsmith application. It is descriptive: it records what the exported v1 app does now. It does **not** treat every current implementation detail as a requirement for v2.

**Status**
Finalized for Build Pack use based on the exported Appsmith application, supplied screenshots, supplied n8n workflows, and user confirmation of authoritative/legacy behavior.

---

## 1. App-level structure

The exported Appsmith application is named **Sandboxes** and contains four pages:

1. `Questions_Sandbox`
2. `Weights_Sandbox`
3. `Output_Sandbox`
4. `SME Assessment Tool`

The application export also contains:
- Google Sheets datasource definitions for `QuestionBank`, `AnswerScales`, `MetricBenchmarks`, `MultiplierRules`, `Test_SMEs`, and `QS_CategoryWeights`
- REST API actions for n8n and NocoDB
- JavaScript collections for scoring, output handling, and loading-state behavior
- Published and unpublished page layouts

---

## 2. Main user-facing page: `SME Assessment Tool`

### 2.1 SME context form

The page collects the following context before question selection:

| Appsmith widget | User-facing field | Current input type | Current options/source |
|---|---|---|---|
| `inp_company_name` | Company name | Text | Free text |
| `dd_employee_band` | # Employees | Select | 1–10; 11–50; 51–250; 251–500; 501–1000; 1001+ |
| `dd_revenue_band` | Annual Revenue (pre-tax) | Select | <$1M; $1M–$5M; $5M–$15M; $15M–$25M; $25M–$50M; $50M+ |
| `dd_industry` | Industry | Select | Manufacturing; Food & Agro-processing; Consumer Goods; Construction / Materials; Business / Export Services |
| `inp_subindustry` | Subindustry | Text | Free text |
| `dd_company_location` | Company Region | Select | North America; LATAM; EU; UK; Eastern Europe; Middle East; Africa; South Asia; APAC; Oceania |
| `inp_country` | Country | Text | Free text |
| `dd_target_market_1` | Target Market (1st priority) | Select | Same region list as Company Region |
| `dd_target_market_2` | Target Market (2nd priority) | Select | Same region list as Company Region |
| `dd_target_buyer` | Target Buyer | Select | Enterprise; Government; SME; Consumer Brands; Export Buyer |
| `dd_business_goal` | Business Goal | Select | Win enterprise customers; Access new markets; Meet buyer sustainability requirements; Prepare for procurement questionnaires; Improve sustainability ratings; Investor readiness |
| `inp_notes` | Additional Context / Requirements | Text | Free text |

### 2.2 Start Assessment behavior

Button: `btn_start_assessment`

Current behavior:
1. Clears prior answer and score/loading state from Appsmith store.
2. Sets `startedAssessment = true`.
3. Calls `API_Get_Questions`.

`API_Get_Questions` sends the current SME context to:

`POST /webhook/final-preview-questions`

The current n8n question-selection export uses this same webhook path.

### 2.3 Question rendering

Questions returned from `API_Get_Questions.data.questions` populate the list widget:

`lst_questions`

For each question, the UI renders:
- question ID and question text
- answer input
- allowed-answer guidance / numeric-format guidance
- category
- framework/source
- scoring/debug text

Answer values are stored in:

`appsmith.store.answers[question_id]`

The current Appsmith implementation writes an answer to the store on the answer input's **onBlur** event.

### 2.4 Allowed answer behavior

For categorical and boolean questions, `AnswerScales` is queried in-memory by `answer_scale_id` and active status, and allowed answer text is displayed.

For percent questions, the UI tells the user to enter percentage values as whole numbers (example: `10%` as `10`).

For numeric questions, the UI asks for a numeric value.

---

## 3. Current scoring behavior in Appsmith

The main page contains a JavaScript collection named:

`AssessmentScoring`

This collection currently performs the scoring logic inside Appsmith.

### 3.1 Answer normalization

Categorical / boolean:
- Matches `answer_scale_id`
- Matches answer text case-insensitively
- Reads `normalized_score` from `AnswerScales`

Numeric / percent:
- Looks up a row in `MetricBenchmarks`
- Prefers an industry-specific benchmark row when one exists
- Otherwise falls back to a global/all/none/blank benchmark row
- Applies the configured scoring method

Methods present in the exported code:
- `identity_percent`
- `percent_direct`
- `identity_boolean`
- `gaussian`
- `gaussian_target`
- `linear_cap`
- `linear_cap_benchmark`
- `inverse_count`
- `inverse_percentage`
- `percent_inverse`
- `benchmark_inverse_ratio`
- `benchmark_ratio_inverse`
- `exponential_decay`
- `exponential_decay_threshold`
- `inverse_linear_cap`
- `banded`
- `min_max`

### 3.2 Question weighting

For each answered question, the current implementation calculates:

`weighted_score = normalized_score × base_weight`

### 3.3 Contextual multiplier

`AssessmentScoring.getFinalMultiplierForQuestion()` filters active rows in `MultiplierRules` against:

- question tag(s)
- category
- subcategory
- SME industry
- SME target market region
- SME target buyer
- SME business goal

Matching multiplier rows are multiplied together.

The final multiplier is capped at:

`1.5`

Current question score:

`final_score = weighted_score × final_multiplier`

Current question maximum:

`total_possible = 100 × base_weight × final_multiplier`

### 3.4 Category scores

Answered, valid questions are grouped by category.

For each category:

`category_percent = points_earned / total_possible × 100`

The current expected categories visible in the UI/config are:
- Governance
- People
- Resources
- Community

### 3.5 Raw overall score

The raw overall score sums category points and category possible points:

`overall_percent = total_points_earned / total_possible_points × 100`

### 3.6 Industry category weights

`CategoryWeights` reads the `QS_CategoryWeights` datasource and matches the selected industry exactly.

It returns:
- `people_weight`
- `governance_weight`
- `community_weight`
- `resources_weight`

Current industry-weighted score:

`weighted_score = Σ(category_percent × category_weight)`

The score chart displays:
- raw overall percentage
- raw points earned / total possible
- industry-weighted category score
- one bar per category using the category's raw percentage

---

## 4. Score + recommendation sequence

Button: `btn_score_recs`

Current sequence:

1. `UXState.startLoading()`
2. `showScores = true`
3. `scoredPayload = AssessmentScoring.getScorePayload()`
4. `API_Get_Recommendations.run()`
5. `UXState.stopLoading()` in `finally`

`API_Get_Recommendations` calls:

`POST /webhook/capstone-ai-output-final`

The current n8n output/RAG export uses this same webhook path.

### 4.1 Recommendation payload

`AssessmentScoring.getScorePayload()` sends:

- `sme_context`
- `raw_overall`
- `weighted_overall`
- `category_scores`
- `weighted_category_breakdown`
- `category_debug`
- `category_weights`
- `scoring_summary`
- `answered_questions`

The scoring summary includes:
- 5 lowest-scoring answered questions
- 5 highest-scoring answered questions
- up to 4 weakest categories

### 4.2 Recommendation response rendering

`AssessmentScoring.getParsedRecommendations()` parses the model response JSON returned by `API_Get_Recommendations`.

The UI displays:
- executive summary
- key gaps
- prioritized recommendations
- implementation difficulty
- evidence citations / source metadata

The nine supplied screenshots cover the current rendered states sufficiently for migration reference.

---

## 5. Loading/progress UI

Appsmith collection:

`UXState`

The loading panel currently contains eight labels:

1. Calculating scores
2. Formatting payload
3. Searching knowledge bank
4. Finding chunks
5. Building recommendation prompt
6. Prompting agent
7. Analyzing agent response
8. Formatting output

Current implementation advances the displayed step on a timer every ~3.5 seconds while the recommendation request is running.

The exported loading custom widget is visual only; the displayed step is driven by Appsmith state rather than a backend progress event.

---

## 6. Custom widgets

### `cw_weighted_bar_chart`

Custom React widget.

Inputs:
- raw overall result
- industry-weighted score
- category breakdown

Outputs displayed:
- overall score
- total points
- weighted score
- category bars
- category points earned / possible

### `cw_loading_status`

Custom React widget.

Inputs:
- loading boolean
- current step label/number
- total steps

Displays:
- loading title
- spinner
- current progress label

---

## 7. Sandbox pages

The three sandbox pages are **development/testing artifacts only**. They were used to test modular functionality before it was integrated into the full working application. They should be preserved as historical/debug references but should **not** drive v2 behavior where they differ from `SME Assessment Tool`.

### 7.1 `Questions_Sandbox`

Purpose:
- select a pre-seeded test SME profile from NocoDB
- generate a question list
- display selected questions
- show last-sync timestamp

It calls the older `/webhook/preview-questions` endpoint.

**Authoritative v1 behavior:** `SME Assessment Tool` and `/webhook/final-preview-questions`.

### 7.2 `Weights_Sandbox`

Purpose:
- select a pre-seeded test SME
- select an individual question
- manually enter an answer
- inspect AnswerScales / MetricBenchmarks
- inspect matched multiplier rules
- inspect normalized, weighted, multiplied, and final scores

It contains a separate `ScoringEngine` JavaScript collection.

**Authoritative v1 behavior:** the `AssessmentScoring` collection in `SME Assessment Tool`. `ScoringEngine` is a closely related earlier/testing implementation and may be useful for comparison, but should not override `AssessmentScoring` when the two differ.

### 7.3 `Output_Sandbox`

Purpose:
- select a pre-seeded test SME
- load questions
- enter answers
- call an output-agent workflow
- inspect raw output and formatted recommendations / gaps

It calls the older `/webhook/output-sandbox-v1` endpoint.

**Authoritative v1 behavior:** `SME Assessment Tool` and `/webhook/capstone-ai-output-final`.

---

## 8. Data / service dependencies visible in the Appsmith export

### Main `SME Assessment Tool`

Google Sheets-backed:
- `QuestionBank`
- `AnswerScales`
- `MetricBenchmarks`
- `MultiplierRules`
- `QS_CategoryWeights`

n8n:
- `/webhook/final-preview-questions`
- `/webhook/capstone-ai-output-final`

Appsmith local/browser state:
- `answers`
- `startedAssessment`
- `showScores`
- `scoredPayload`
- `recLoading`
- `recStepIndex`
- `recLoadingIntervalId`

### Sandbox-only or test-profile dependencies visible in export

- NocoDB REST API
- `Test_SMEs`
- older sandbox webhook paths

NocoDB was used only to seed/select test SME profiles during modular testing. It is **not a required production dependency** of the final v1 `SME Assessment Tool`, which did not include pre-seeded SME records. v2 should likewise not assume pre-seeded SME data unless a future requirement explicitly introduces it.

---

## 9. Current main-page flow

```text
SME context form
    ↓
Start Assessment
    ↓
API_Get_Questions
    ↓
n8n /webhook/final-preview-questions
    ↓
QuestionBank selection
    ↓
Question list rendered
    ↓
User answers questions
    ↓
Appsmith AssessmentScoring
    ├── AnswerScales
    ├── MetricBenchmarks
    ├── MultiplierRules
    └── CategoryWeights
    ↓
Raw + category-weighted scores
    ↓
API_Get_Recommendations
    ↓
n8n /webhook/capstone-ai-output-final
    ├── DocumentIndex
    ├── DocumentChunks
    └── OpenAI
    ↓
Executive summary + gaps + recommendations + evidence
```

---

## 10. Confirmed migration interpretation

### 10.1 Authoritative application path

`SME Assessment Tool` is the authoritative full working v1 application.

Where a sandbox page differs from it:
- use the `SME Assessment Tool` behavior;
- use the webhook endpoints wired into `SME Assessment Tool`;
- use the two supplied final n8n workflow exports as the backend reference.

### 10.2 Authoritative scoring engine

`AssessmentScoring` is the authoritative final v1 scoring implementation to preserve and regression-test.

`ScoringEngine` in `Weights_Sandbox` is a related testing implementation. It can be compared against `AssessmentScoring` to identify historical differences or useful diagnostics, but is not the migration source of truth.

### 10.3 Live per-question scoring/debug capability

The current v1 answer widget persists an answer to `appsmith.store.answers` on `onBlur`, while `AssessmentScoring` reads from that answer store and exposes per-question debug/scoring functions.

This makes the user's recollection **technically plausible**: the on-blur write allows Appsmith bindings to recalculate/render question-level score/debug information immediately after the user leaves an answer field.

For v2, the requirement should therefore be expressed as a **capability, not an exact Appsmith event implementation**:

- v2 should be able to compute question-level scoring immediately as answers change;
- the UI should be able to expose or hide that live score/debug information;
- whether ordinary respondents see live computed scores during completion or only see scores after submitting should remain a configurable product decision pending Prof. Guo's preference;
- v2 does **not** need to reproduce Appsmith's `onBlur` mechanism specifically. A React implementation may use controlled form state, `onChange`, debouncing, or another clean mechanism while preserving the option for immediate scoring.

Recommended implementation distinction:

- **Scoring engine:** always capable of deterministic incremental calculation.
- **Respondent UI:** feature/config flag controlling whether live scores are visible.
- **Developer/debug mode:** can expose detailed normalized score, benchmark, multiplier, and final-score diagnostics even when respondent-facing live scoring is hidden.

### 10.4 Recommendation progress display

The current recommendation progress labels are timer-driven (`~3.5s` rotation) and do not represent verified backend stage completion.

For v2, preserve the **user experience requirement** that a long-running recommendation action shows clear progress/loading feedback, but do not treat the simulated timer sequence as a required implementation. If the new backend can expose real stage status cheaply, use it; otherwise a simpler loading/progress treatment is acceptable.

## 11. Build Pack placement

Store this finalized file at:

`BUILD_PACK/02_LEGACY_APPSMITH/ui_inventory/APPSMITH_COMPONENT_MAP.md`

The corresponding **Build Appsmith UI/behavior inventory** Prebuild checklist item can be marked complete.
