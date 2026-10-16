# EXECUTION_PLAN.md



## Purpose



This document is the operational build roadmap for Capstone v2.



It sits below `BUILD_PLAN.md`:



- `BUILD_PLAN.md` defines major milestones and human review gates.

- `EXECUTION_PLAN.md` breaks those milestones into right-sized implementation steps.

- The Google Sheet `Build Checklist` → `v2.0` mirrors this plan for human project tracking.



If this file and the Google Sheet ever diverge, this repository file is the authoritative build-execution plan.



Implementation agents may propose smaller substeps within an authorized execution step, but they may not silently advance to another step or milestone.



The intended loop is:



> Select step → implement → test → inspect → understand → commit → mark complete → continue.



---



# Status conventions



- `COMPLETE` — implemented, verified, reviewed, committed.

- `CURRENT` — explicitly authorized for implementation.

- `PENDING` — not yet authorized.

- `BLOCKED` — requires methodology, scope, IP, or other explicit approval.

- `STRETCH` — optional after required scope is stable.

- `RESEARCH` — experimental work that must not silently alter the core product.



Agents may maintain routine status wording when explicitly authorized; acceptance must cite a documented human decision, never a commit alone. Only the human project owner may change a step to `COMPLETE` or authorize the next step.



---



# Milestone 1 — Product shell and assessment entry



## M1.0 — Scaffold + architecture baseline

**Status:** COMPLETE



### Purpose

Create a safe, reproducible technical foundation before product features.



### Output

- Next.js / React / TypeScript application scaffold

- testing infrastructure

- linting and architecture-boundary enforcement

- design-token foundation

- architecture decision records

- single verification command: `npm run verify`



### Dependencies

Approved architecture and Build Pack control documents.



### Notes

Completed on branch `milestone-1-scaffold`.



No substantive Capstone product functionality was implemented in this step.



---



## M1.1 — UI system + landing-page shell

**Status:** COMPLETE



### Purpose

Establish the product visual language and the public/context surface.



### Output

- approved design-token implementation

- typography

- spacing

- color system

- borders/radii

- motion treatment

- reduced-motion behavior

- responsive landing-page shell

- problem/context section

- About / approach section

- video placeholder

- research / verification section

- clear `Take the Assessment` CTA



### Dependencies

- M1.0

- `BUILD_PACK/01_PRODUCT_SPEC/UI_BRAND_GUIDE.md`



### Boundaries

Do not implement:

- assessment setup

- questionnaire behavior

- scoring

- recommendations

- calculator

- database/persistence

- admin/maintenance features

- commercial/stretch features



Keep visual polish controlled until the deterministic core is proven.



---


### Notes

Implemented and verified. Public-facing copy remains provisional pending research/client review; this does not block the approved UI shell.


## M1.2 — Assessment setup + session state

**Status:** COMPLETE



### Purpose

Collect SME context and begin a resilient assessment session.



### Output

- dedicated full-page assessment setup flow

- SME metadata/context fields

- quantitative-input method choice

- React reducer/context state

- browser session persistence

- route into questionnaire flow



### Dependencies

- M1.1

- approved SME metadata/context fields



### Notes

Manual quantitative input is the initial default.



Calculator and upload paths may remain disabled/placeholders until their milestones.



---



## M1.3 — Questionnaire shell + progress/navigation

**Status:** COMPLETE



### Purpose

Implement the approved assessment interaction model before real scoring logic.



### Output

- vertical single-focus / roller-style question cards

- active-card emphasis

- desktop progress rail

- compact mobile progress equivalent

- skip behavior

- revisit behavior

- answered/unanswered/current state

- direct question navigation

- category-transition treatment

- final unanswered-question review behavior

- reduced-motion support



### Dependencies

- M1.2

- `UI_BRAND_GUIDE.md`



### Notes

Representative or mock questions may be used at this stage.



Missing answers must never silently become zero.



---



## M1.4 — Results shell + Milestone 1 review

**Status:** COMPLETE



### Purpose

Prove the end-to-end product shell without pretending scoring or recommendations are implemented.



### Output

- `/results` route

- score-summary shell

- category visualization shell

- executive-summary section shell

- gaps section shell

- recommendation section shell

- prominent report-download CTA shell

- Milestone 1 review package



### Dependencies

M1.1–M1.3.



### Review gate

Stop and review Milestone 1 before beginning Milestone 2.



---



# Milestone 2 — Deterministic assessment core and Golden parity



## M2.1 — Canonical config schemas + loader

**Status:** COMPLETE



### Purpose

Make the preserved Capstone configuration readable by the new application without hard-coding it.



### Output

Typed schemas and repository/loading interfaces for:

- QuestionBank

- AnswerScales

- MetricBenchmarks

- MultiplierRules

- CategoryWeights

- DocumentIndex

- DocumentChunks



Also:

- validation

- config-version identity

- explicit load failures



### Dependencies

- Milestone 1 approved

- canonical clean config files



### Notes

No production database is required for this step.



Versioned repository files may serve as the initial runtime authority.



---



## M2.2 — Deterministic question selection + ordering

**Status:** COMPLETE

Implementation and verification completed for the explicitly authorized M2.1 + M2.2 package. See `app/docs/M2.1-M2.2-REVIEW.md` and `app/docs/CONFIG-MIGRATION.md`. M2.1–M2.2 were accepted by human review and committed; this does not complete Milestone 2. M2.3–M2.5 were subsequently explicitly authorized as a separate work package.



### Purpose

Reproduce which questions each SME receives and in what order.



### Output

Pure deterministic selection and ordering engine driven by:

- active state

- industry

- market/location

- size

- priority/order rules



### Dependencies

M2.1.



### Verification

Golden cases must match expected question IDs and ordering.



### Notes

Do not introduce buyer/goal-based question selection unless explicitly approved as a methodology change.



---



## M2.3 — Answer persistence + normalization/benchmarks

**Status:** COMPLETE

Implemented and verified on 2026-10-10 as part of the explicitly authorized M2.3–M2.5 package; accepted by human review on 2026-10-11. See `app/docs/M2.3-M2.5-REVIEW.md`. This does not complete Milestone 2 or authorize M2.6/M2.7.



### Purpose

Reliably capture answers and reproduce normalized question scores.



### Output

- answer-state integration

- robust persistence through navigation/focus changes

- normalization library

- benchmark resolver

- missing-data handling

- question-level normalized outputs



### Dependencies

M2.1–M2.2.



### Notes

Fix the v1 answer-loss/focus-change defect.



Missing values must never silently become zero.



---



## M2.4 — Base weights + contextual multipliers

**Status:** COMPLETE

Implemented and verified on 2026-10-10 as part of the explicitly authorized M2.3–M2.5 package; accepted by human review on 2026-10-11. See `app/docs/M2.3-M2.5-REVIEW.md`. This does not complete Milestone 2 or authorize M2.6/M2.7.



### Purpose

Reproduce contextual weighting deterministically.



### Output

- base-weight application

- multiplier-rule matching

- matched rule IDs

- resulting multiplier

- explainable multiplier trace



### Dependencies

M2.1–M2.3.



### Notes

Do not convert current config values or caps into permanent engine assumptions.



---



## M2.5 — Category weighting + score aggregation

**Status:** COMPLETE

Implemented and verified on 2026-10-10 as part of the explicitly authorized M2.3–M2.5 package; accepted by human review on 2026-10-11. See `app/docs/M2.3-M2.5-REVIEW.md`. This does not complete Milestone 2 or authorize M2.6/M2.7.



### Purpose

Reproduce category and overall scoring.



### Output

- weighted question contributions

- category aggregation

- category scores

- raw overall score

- industry-weighted overall score



### Dependencies

M2.4.



### Notes

Calculation precision must remain separate from presentation rounding.



---



## M2.6 — Calculation trace + numeric policy

**Status:** COMPLETE

Implemented and verified on 2026-10-11 under separate explicit M2.6 authorization; accepted by the owner on 2026-10-12 as part of final Milestone 2 acceptance, including explanations, calculation trace and numeric policy. See `app/docs/M2.6-REVIEW.md`, `app/docs/NUMERIC-POLICY.md` and the acceptance record in `app/docs/M2.7-MILESTONE-2-REVIEW.md`.



### Purpose

Make every score explainable and every parity failure diagnosable.



### Output

Structured calculation trace containing, where applicable:

- question ID

- raw answer

- normalization method and inputs

- normalized score

- benchmark ID/source

- base weight

- matched multiplier rule IDs

- resulting multiplier

- category

- category weight

- weighted contribution

- overall contribution

- config/method version



Also:

- documented numeric representation policy

- source/config precision rules

- intermediate-rounding rules

- presentation-rounding rules

- explicit Golden comparison tolerance



### Dependencies

M2.3–M2.5.



### Notes

Never widen tolerances merely to make Golden Tests pass.



---



## M2.7 — Golden parity + basic score visualizations

**Status:** COMPLETE

Implemented and verified on 2026-10-12; accepted by the owner on 2026-10-12 following the human walkthrough. The eight-question test matched expected scores, and the Q23 edit, recalculation and refresh worked. Final acceptance includes M2.6 and completes Milestone 2; see app/docs/M2.7-MILESTONE-2-REVIEW.md. Questionnaire review/navigation issues are deferred to M3.4/M3.6. PR #3 merged into main on 2026-10-12 with separate owner authorization; see the merge/branch record below. M3.1–M3.3 were subsequently authorized for local implementation on 2026-10-13; live provider integration and M3.4–M3.6 remain gated.



### Purpose

Prove the deterministic core against the preserved v1 behavior.



### Output

- Golden Test matrix for all five Golden SMEs

- selected-question parity

- normalization parity

- weight parity

- multiplier parity

- category-score parity

- overall-score parity

- documented reconciliation of known v1 defects

- basic overall/category score visualizations

- Milestone 2 review package



### Dependencies

M2.1–M2.6 plus Golden fixtures.



### Review gate

The deterministic core must be approved before recommendation logic becomes authoritative.



---



# Milestone 3 — Recommendations, results, and durable report

## M3 implementation packages — proposed 2026-10-12; first package authorized 2026-10-13

M2 was explicitly accepted on 2026-10-12. With separate owner merge authorization, PR #3 merged into main on 2026-10-12 using merge commit `4929f9f2969fa946da1066ea3825921349ecf641` (parents: previous main `8cae855` and acceptance commit `c9cb2b8`). Local main was synchronized, then `milestone-3-recommendations` was created from that merged main. `milestone-2-deterministic-core` remains preserved locally and remotely at `c9cb2b8`; shared history was not rewritten. The current branch is `milestone-3-recommendations`; the branch handoff itself did not authorize implementation. On 2026-10-13 the owner authorized M3.1–M3.3 using controlled local provider test doubles. See app/docs/M3.1-M3.3-REVIEW.md. That initial authorization excluded live calls. The 2026-10-14 limited live-AI authorization below now governs M3.1/M3.3 and a subset of M3.4; deferred navigation, M3.5 and M3.6 remain PENDING.

### Targeted metadata restoration — authorized 2026-10-13

The owner authorized restoring only Additional Context / Requirements (`notes`) through setup, compatible session persistence and the local recommendation foundation. See [metadata mapping and correction review](app/docs/M3-METADATA-RESTORATION-REVIEW.md). This does not authorize the remainder of M3.4, live calls, retrieval experiments, deployment or acceptance. Foundation checkpoint: `7480686`; remote documentation `e162192` integrated without rewriting history.

### Current limited authorization and operating correction — 2026-10-14

The owner accepted the LOCAL recommendation foundation and notes restoration: answers/notes survived refresh and notes-only edits preserved displayed raw 58.3 / industry-weighted 13.8. The new package implements M3.1 OpenAI runtime configuration, M3.3 Responses generation through unchanged prompt/validation, and ONLY M3.4 generation controls, validated narrative/evidence and loading/failure/freshness states in the existing Results layout. See [current review](app/docs/M3-LIVE-AI-REVIEW.md) and [provider/Columbia setup](app/docs/AI-PROVIDER-SETUP.md).

Provider baseline: gpt-5.4-mini, low reasoning, explicit configuration, default disabled. Live smoke is limited to five automated synthetic-profile attempts and estimated US$2 after local provider/model/key configuration; failures and timeouts count. No confidential/archived SME transmission, paid ordinary tests, deployment, main merge, deferred navigation, report work or retrieval experiments. Live verification remains pending without credentials; Milestone 3 remains open.

**Owner operating correction:** leave changes uncommitted. The owner handles staging, commits and pushes manually, superseding earlier commit/push instructions. Routine repository reads, scoped edits, tests and review-document updates are authorized without repeated conversational permission requests. Respect platform permission controls and explain actual blockers. Preserve methodology, architecture, scope, data-transmission and spending limits, with human stops for genuinely unresolved material decisions. Let running verification finish; do not restart completed work solely because of this correction.

### 2026-10-15 focused live-timeout diagnosis

M3.1/M3.3 live smoke FAILED: 0/5, all local timeout / HTTP 503 / not_accepted at the configured 10,000 ms deadline. gpt-5.4-mini / low / 4,000 output tokens throughout. Ledger usage is null for every attempt; estimated spend is a reservation, not observed usage. All five attempts count; allowance exhausted. Original app/.local/live-smoke-ledger.json preserved without reset or retry.

| Case | Attempt UTC (2026-10-15) | Preparation* ms | Provider* ms | Service ms | Endpoint ms | Outcome / HTTP | Usage |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- |
| synthetic-1 | 05:43:19.717Z | 104.21 | 10022.13 | 10126.53 | 10260.65 | timeout / 503 | null |
| synthetic-2 | 05:43:29.988Z | 57.15 | 10015.62 | 10072.92 | 10211.30 | timeout / 503 | null |
| synthetic-3 | 05:43:40.204Z | 65.45 | 10013.49 | 10078.99 | 10211.94 | timeout / 503 | null |
| synthetic-4 | 05:43:50.422Z | 79.89 | 10005.12 | 10085.09 | 10228.42 | timeout / 503 | null |
| synthetic-5 | 05:44:00.655Z | 63.85 | 10005.81 | 10069.70 | 10220.49 | timeout / 503 | null |

See [live diagnosis and one-request proposal](app/docs/M3-LIVE-AI-REVIEW.md#2026-10-15-live-timeout-diagnosis--allowance-exhausted) for full cap inventory, safe diagnostics, connectivity observation and uncertainty. An unauthenticated non-generating models GET returned expected 401 in 587 ms; no key or SME data sent. No additional generation during diagnosis. Normal default/maximum remains 10 seconds and the under-ten-second target is not met. Proposed next action, pending explicit approval: one synthetic-1 diagnostic using the unchanged adapter/model/low reasoning/4,000-token cap/prompt/retrieval/validation, a separate server-only 60-second deadline and one-shot reservation; estimated extra $0.324144 / cumulative $1.944864, actual billing unknown. No 60-second path has been implemented or executed. Diagnostic checks: 45 provider/service/smoke tests and 15 Golden matrix tests PASS; typecheck, lint and diff checks PASS. Original full gate retained as historical evidence; no full gate rerun for this focused diagnosis. All changes remain unstaged/uncommitted; owner handles Git. No acceptance or scope expansion.

### 2026-10-15 one additional diagnostic: authorized, executed, exhausted

Owner authorized exactly one additional synthetic diagnostic (60-second maximum; unchanged gpt-5.4-mini / low / 4,000 output tokens / prompt / retrieval / validation). Executed once at 06:30:03.038 UTC through the isolated server-only harness; no retries. Upstream HTTP 200; headers 14,943.2468 ms, body 88.2277 ms, provider total 15,041.5322 ms, preparation 122.9231 ms. Validation FAILED: two sme_context_missing issues in executive_summary; unanswered_category in four priority recommendations and two key gaps. No validated advice/citations published. Provider usage: 14,541 input / 2,277 output; estimated charge $0.02115225. Additional reservation $0.324144 and cumulative reservation $1.944864 preserved; prior five calls' actual charges remain unknown.

Separate ignored record: app/.local/live-diagnostic-2026-10-15.json, permanently prevents repeat execution. Original five-attempt ledger and environment file unchanged; runtime configuration remains 10,000 ms (never overridden). Three controlled harness tests, focused lint and no-generation preflight passed before dispatch. The normal under-ten-second target is unmet. Both allowances are exhausted. See [full live diagnostic evidence](app/docs/M3-LIVE-AI-REVIEW.md). No new calls, validation relaxation, acceptance or scope advancement. Changes remain unstaged/uncommitted; stop for owner review.

### 2026-10-15 offline follow-up: contract diagnosis only

No further provider calls. Rejected diagnostic prose was not retained, so the exact two missing labels and six rows' specific category choices cannot be recovered. The synthetic case observed only Governance. Verified prompt/validator ambiguity: summary asks explicit naming but validator requires literal labels; key_gaps has an observed-category restriction not stated explicitly in the prompt. Missing-data disclosure passes in grounding_notes. Safe diagnostic fields now identify missing contextField and offending canonical categories; acceptance rules unchanged. Offline verification: 77 focused tests, typecheck, focused lint and diff checks PASS. See [offline analysis, archived configuration comparison and smallest correction](app/docs/M3-OFFLINE-GENERATION-DIAGNOSIS.md).

Legacy Appsmith generation action had a 100-second timeout (both published/unpublished); n8n selected GPT-5.2 with empty options. Actual provider/workflow default deadlines, reasoning/output caps and latency are not captured. Proposed, not applied: clarify exact summary labels and allowed assessed categories for both recommendation/gap arrays; place unassessed disclosures in grounding_notes. Proposed operational provider deadline 30 seconds with 45-second generation-client caps, preserving the under-ten-second target and no retries. Current runtime remains 10 seconds; no further paid-call allowance or new scope. Changes remain unstaged/uncommitted.

### 2026-10-15 authorized prompt/deadline correction (offline)

Implemented prompt version legacy-runtime-v1-validated-transport-3: explicit exact summary labels, assessed/unassessed category lists, restrictions for both recommendation/gap arrays, missing-data disclosure in grounding_notes, counts as maxima. Archived template, scoring, retrieval and validation safeguards preserved. Runtime provider default/maximum 30 seconds; generation clients 45 seconds; request-body read 10 seconds and safe status 15 seconds unchanged. Immediate cancellation and the distinct under-ten-second performance target remain.

Explicit existing .env.local value 10000 still takes precedence; file preserved. Owner's single-line activation edit: `RECOMMENDATION_TIMEOUT_MS=30000`, then restart updated server. Both ledgers remain untouched and allowances exhausted. No provider calls authorized by this correction. Focused checks: 80 tests PASS, plus five controller and three diagnostic-harness safety tests. Full offline npm run verify PASS: typecheck, lint, 236 unit tests, production build, 55 Chromium browser tests. First gate exposed a fixture timeout mismatch; fixture aligned with new default, freshness assertions preserved, full gate rerun passed. No live verification of the revised prompt. See [live review](app/docs/M3-LIVE-AI-REVIEW.md). Changes unstaged/uncommitted; acceptance and later milestones remain gated.

### 2026-10-15 corrected-prompt one-request authorization: consumed

Owner authorized exactly one synthetic Governance-only live request with a new separate budget up to $0.35. Running-server safe readiness verified timeout 30000 and prompt legacy-runtime-v1-validated-transport-3; gpt-5.4-mini / low / 4000 unchanged. Preflight reserve $0.324144 fit the new allowance; cumulative reservations $2.269008. Dispatched exactly once at 07:05:54.679 UTC; upstream HTTP 200, headers 8631.2655 ms, body 223.1232 ms, provider 8864.2139 ms, service total 8937.7519 ms. Usage 14,714 input / 1,647 output; estimated charge $0.018447.

Validation FAILED on one exact industry-label omission (sme_context_missing at executive_summary, industry): response said "manufacturer" rather than "Manufacturing (Industrial / Components)". Two recommendations and one gap used Governance; missing-data disclosures were in grounding_notes. No rejected content entered Results UI. Synthetic body retained locally in app/.local/live-corrected-prompt-2026-10-15-response.txt; separate permanent record app/.local/live-corrected-prompt-2026-10-15.json. Previous ledgers and owner-edited environment file preserved. Five offline harness safety tests and focused lint passed. See live review for precise excerpts. All allowances exhausted; stop. No runtime correction, relaxed safeguards, later scope or Git operations performed.

### 2026-10-15 owner scope correction: migration baseline before editorial optimization

Explicitly remove literal industry/employee-band/business-goal repetition as a hard acceptance requirement. Implemented shared prompt/validation identity legacy-runtime-v1-validated-transport-4; current authoritative setup values display separately in the existing Results summary. No generated prose is repaired or relabeled as model output. Numeric, schema, citation-membership, assessed-category, cancellation/duplicate/stale and paid-control safeguards remain. No new semantic classifier or paraphrase rules. Existing 30-second provider / 45-second client caps remain.

Retained version-3 synthetic output replays successfully under the revised validator, with original matching scores/evidence and unchanged response bytes. This is offline replay, not a new live success or current-session advice. Original ledgers retain historical failures. See [baseline correction review](app/docs/M3-MIGRATION-BASELINE-REVIEW.md). No provider request or model/environment change. Full offline gate PASS: typecheck, lint, 240 unit tests, build and 55 browser tests; 69 focused tests also passed. M3 acceptance and exhausted live allowances remain gated. The linked review proposes a separately authorized two-request same-input GPT-5.4-mini/GPT-5.2 check with version 4, low reasoning, 4000 output tokens, 30-second provider/45-second client caps and a new $1.10 ceiling. No harness/model switch or paid execution is authorized by this proposal.

### First package: M3.1–M3.3

- Application recommendation service and provider-neutral request/result contract, with a server-only provider adapter. Recompute authoritative scores from trusted config and validated raw inputs; never accept client scores. Keep provider calls independent of the score endpoint.
- Port deterministic metadata document/chunk ranking from the final n8n workflow. Retain the documented 8-document/18-chunk baseline as explicit retrieval configuration, stable source-order tie handling and version identity. Use migrated stable document IDs; regression-test the deliberate improvement over legacy title joins and its evidence-set effects.
- Assemble the preserved runtime prompt with context, answered questions, deterministic outputs and retrieved evidence. Preserve semantic instructions; adapting interpolation and structured transport is implementation work, while material prompt changes require review.
- Validate JSON shape, ranks/counts, category names, source membership, allowed citation URLs, page/section provenance, absence of internal IDs and score restatements. Treat SME text/source excerpts as untrusted data, never instructions. Do not let generated text create new citations or overwrite scores. Do not silently repair incorrect numbers into apparently validated prose.
- Provider failures/timeouts/malformed responses return explicit recommendation-unavailable status. Bound request/output size and duration; avoid unbounded retries, sensitive logs, invented fallbacks or introducing a new SDK/service without evidence of need. Isolated HTTP via existing platform fetch is sufficient as the initial adapter proposal.
- Unit/retrieval fixtures and adapter contract tests precede credentialed smoke/latency tests. Exact prose parity is not required. Live-call cost and data approval must be established before external calls.

### Second package: M3.4–M3.6

- Include the owner-requested questionnaire review/navigation polish recorded under M3.4; verify it at M3.6 without changing deterministic scoring or blank-answer semantics.
- Replace fictional narrative only when validated generated output exists; retain current score/chart/explanation authority. Tie recommendation results to the same input/config/method identity and reject stale responses.
- Integrate evidence links and unavailable/retry states in the existing vertical results layout. Provide deterministic priority gaps separately and label their origin.
- Produce a print-ready durable report initially (browser Save as PDF), containing context, answers/skips, scores, versions, available recommendations and evidence. Omit unavailable AI content truthfully; report generation and all deterministic results remain usable during provider failure.
- Complete browser, citation/score consistency, stale-response, failure/timeout and report regression checks. Measure retrieval/provider/end-to-end latency under stated conditions; optimize only from evidence.
- Run the owner-requested LlamaIndex/LangChain experiment defined in M3.6 after establishing the native TypeScript baseline. Evaluate both frameworks separately, targeting complete validated recommendations in under 10 seconds; report quality, cost and latency before proposing production adoption.

### Required evidence and limitations

- Runtime prompt: `BUILD_PACK/06_AI_RAG/prompts/PROMPT_recommendation_runtime.md`; source node `Build Recommendation Prompt` in `BUILD_PACK/03_LEGACY_N8N/workflows/n8n-output-rag-final-2026-10-02.json`. Inspect the actual normalization/ranking/formatting nodes before porting, using `AI_PIPELINE_CURRENT.md` as a map, not target architecture.
- `PROMPT_INDEX.md` distinguishes runtime from offline extraction/generation. DocumentIndex/DocumentChunks provenance prompts explain existing records; do not run source-to-config regeneration in M3.
- Existing canonical 44 documents/428 chunks and `app/docs/CONFIG-MIGRATION.md` provide stable identity, not independently verified source content. Nine reconciled title pairs, duplicate legacy chunk IDs, edition ambiguity and inconsistent Scope 3 page references remain explicit. Preserved Drive binaries were not independently verified.
- Validate citation membership and safe link structure deterministically; do not equate that with external accessibility, source edition or factual verification. Trim presentation URL whitespace without silently rewriting canonical records. Unsupported/ambiguous evidence must be excluded or surfaced; any material source correction needs a reviewed provenance-preserving update.
- Golden outputs provide structural/grounding examples, not a prose oracle. Consumer Goods' historical prose says 70.3 while deterministic output is 70.4. M3 must use the accepted current canonical scores, including M2's documented differences.
- Optional notes are now collected and propagated under the accepted metadata correction. Country/revenue_band remain omitted and explicitly disclosed; do not invent values or silently restore them. See app/docs/M3-METADATA-RESTORATION-REVIEW.md.

### Server environment names and remaining live decisions

Runtime server names are documented in `app/.env.example` and app/docs/AI-PROVIDER-SETUP.md. The current adapter defaults to disabled and requires explicit provider/model/key configuration:

| Name | Purpose |
| --- | --- |
| `RECOMMENDATION_PROVIDER` | Explicit adapter selection |
| `RECOMMENDATION_MODEL` | gpt-5.4-mini baseline; reviewed snapshot supported, no silent substitution |
| `RECOMMENDATION_REASONING` | Supported effort; initial low |
| `OPENAI_API_KEY` | Server-only secret if the OpenAI adapter is selected |
| `RECOMMENDATION_TIMEOUT_MS` | Validated bounded provider deadline |
| `RECOMMENDATION_MAX_OUTPUT_TOKENS` | Validated cost/output bound |

No `NEXT_PUBLIC_` secret or client-controlled provider URL. The 2026-10-14 authorization selects OpenAI gpt-5.4-mini / low and at most five synthetic automated attempts within estimated US$2 after explicit local configuration. At the 2026-10-14 offline check no key was present. The subsequent owner-run five-attempt smoke failed on 2026-10-15; allowance exhausted (see diagnosis above). Confidential/archived SME transmission and public deployment are not authorized. Public exposure still requires authentication/abuse/spend/privacy controls. Citation/edition ambiguities remain excluded or disclosed. M2 acceptance and merge remain complete; local M3 foundation/notes acceptance does not accept the new live package.





## M3.1 — Recommendation service + provider boundary

**Status:** CURRENT

The local M3.1–M3.3 foundation was accepted on 2026-10-14. The current live-provider extension is implemented and offline-verified (227 unit / 55 browser tests; full gate passed 2026-10-14); live verification and acceptance remain pending. See `app/docs/M3-LIVE-AI-REVIEW.md`; retain the original foundation review as historical verification evidence.



### Purpose

Replace the v1 n8n recommendation runtime with a maintainable application service boundary.



### Output

- recommendation-service interface

- server-side provider adapter

- model configuration

- structured request/response schema

- timeout/error handling

- provider-replacement seam



### Dependencies

- M2 approved

- preserved runtime recommendation prompt



### Notes

Do not recreate n8n literally unless justified.



Deterministic scoring must remain available if the model provider is unavailable.



---



## M3.2 — RAG source/chunk retrieval

**Status:** COMPLETE — accepted local native baseline, 2026-10-14

The accepted native TypeScript retrieval baseline is reused unchanged. Stable identities, ordering, 8-document/18-chunk selection and source exclusions retain their existing verification. No retrieval redesign or experiment is authorized in this package.



### Purpose

Reproduce grounded evidence selection before recommendation generation.



### Output

- DocumentIndex ranking

- DocumentChunks ranking

- document/chunk join logic

- evidence bundle passed to recommendation generation



### Dependencies

M3.1 plus canonical DocumentIndex/DocumentChunks.



### Notes

Start from preserved v1 metadata-ranking behavior.



Vector/embedding retrieval is not required unless separately justified.



---



## M3.3 — Structured recommendation generation

**Status:** CURRENT

The local M3.1–M3.3 foundation was accepted on 2026-10-14. The current live-provider extension is implemented and offline-verified (227 unit / 55 browser tests; full gate passed 2026-10-14); live verification and acceptance remain pending. See `app/docs/M3-LIVE-AI-REVIEW.md`; retain the original foundation review as historical verification evidence.



### Purpose

Generate grounded recommendations consistent with authoritative deterministic results.



### Output

- model call

- structured output parsing/validation

- evidence/source validation

- numeric-score consistency checks

- schema-valid recommendation payload



### Dependencies

M3.1–M3.2.



### Verification

Recommendations must:

- not contradict deterministic scores

- not invent sources

- align materially with weak areas

- remain relevant to SME context

- repeat scores exactly when scores appear in prose



Exact prose parity is not required.



---



## M3.4 — Results, gaps, recommendations + evidence UI

**Status:** CURRENT — limited Results integration only; remainder PENDING

Authorized 2026-10-14: explicit generation/regeneration, validated recommendations/evidence, loading/error/cancel/retry and freshness checks in the existing Results layout. This subset passed the full offline gate on 2026-10-14 (227 unit / 55 browser tests) and is not yet human-accepted. Navigation, questionnaire controls/Skip behavior and technical-JSON presentation below remain deferred; M3.4 as a whole is not complete.



### Purpose

Turn deterministic and AI outputs into a clear results narrative.



### Output

- overall score display

- category score display

- executive summary

- visual key-gap cards

- ranked recommended actions

- evidence/source presentation

- authoritative score charts



### Dependencies

M2.7 and M3.3.



### Notes

Default to a vertical narrative rather than tabs.



The current deterministic score remains authoritative.

### Deferred questionnaire review/navigation polish — human feedback 2026-10-12

Owner-requested follow-up from the M2 walkthrough; schedule with M3.4 in the M3.4–M3.6 package. This is a future implementation item, not an M2 blocker or authorization to begin M3.

- Make **Review Answers** available from every question, including the first, middle and last. Place the action consistently outside the question-card content (for example, below the active card), rather than making the last card the only discoverable route.
- Remove the per-card blank-answer gate and the message "Enter an answer or choose Skip." A blank question may advance or open answer review without an explicit Skip action; the last question must behave consistently with the rest.
- Use the existing answer-review screen to summarize unanswered/skipped questions and offer review of missing answers or explicit generation of a partial score.
- Preserve current drafts when opening review. Keep Skip available as an optional action, maintain existing answer retention and stale-result protection, and retain validation of invalid nonblank values. Do not coerce blanks or invalid values to zero, alter scoring/denominator rules, or change canonical configuration.
- Check that the action is discoverable and usable on desktop, narrow/mobile layouts and keyboard navigation. Keep its label distinct from the later score-generation confirmation.

Acceptance at M3.6: verify entry to review from the first, a middle and the last question; blank final-question access without Skip; unchanged answers/drafts and missing counts; valid partial-score confirmation; and continued rejection of invalid nonblank scoring inputs.

### Additional review/results UX — human feedback 2026-10-14

During the rebuilt `72f9eb3` walkthrough, the owner confirmed answers and Additional Context / Requirements persist after refresh and found **How this score was calculated** useful. The owner then edited only the additional context and recalculated; before/after screenshots show the same displayed raw score (58.3) and industry-weighted score (13.8), with four answered questions. This completes the reported manual notes/persistence check; it is not a new numeric oracle or formal package/milestone acceptance.

- Put the primary **Generate score / Generate score anyway** action near the top of Review Answers, alongside the answered/unanswered summary, so users need not scroll through the entire questionnaire. Retain a matching bottom action if useful; both must perform the same operation.
- Make score generation lead directly to the results page and its calculation/loading/error states. Remove the intervening **Your answers are ready for calculation / View calculated results** screen from the normal flow; move any necessary calculation/data-handling notice inline. This navigation change does not authorize live AI calls or change server validation, answer retention, missing-data semantics or deterministic scoring.
- Retain the readable calculation explanations and per-question breakdowns.
- The owner questioned the user-facing purpose of raw technical JSON. Presentation recommendation for M3.4 review: label it clearly as advanced audit/debug detail, keep it collapsed and outside the primary reading flow, and avoid raw JSON blocks in the default printable report. Preserve full-precision structured traces and their config/method/rule provenance; this is a presentation decision, not removal of the audit capability.

Extend M3.6 acceptance checks to cover the top-of-review generation action on desktop/mobile and keyboard, direct results navigation without the extra confirmation screen, calculation loading/failure states, preserved answers on return, and continued access to readable calculations and optional technical audit detail. These items are planned with M3.4/M3.5; this record does not begin implementation.

### Proposed five-stage navigation — owner discussion 2026-10-14

The owner proposes a horizontal connected step indicator at the top of the assessment and results pages: **Set Up > Data Input > Questions > Review > Results**, with completed stages green and inaccessible stages gray. The purpose is to revisit business context, the chosen input method or answers directly, then return to updated results. Record this as a design proposal for M3.4; implementation and final interaction details remain pending.

Recommended interaction rules to resolve with the package:
- Keep the navigation consistently visible, with a compact accessible treatment on narrow screens that does not cover content. Preserve the existing vertical results narrative; these are process stages, not tabs for result sections.
- Separate completion from availability: distinguish the current stage, completed stages, accessible incomplete stages and locked stages with text/icons as well as color. Explain why a stage is locked. Set Up must always be accessible for correction, and previously accessible stages must remain reachable when their prerequisites remain valid.
- Require valid business setup and an available input method to proceed into questions. Incomplete questionnaires remain valid for review and partial scoring; do not require every answer or explicit Skip before enabling Review. Invalid nonblank answers must remain visible and correctable, and must not be silently scored or discarded.
- Initially generate a score from Review with clear answered/unanswered counts, then allow revisiting Results directly while current prerequisites remain valid. Treat returning to Results after scoring-input edits as a request to recompute authoritative scores. Show loading or unavailable/validation states; never present an old score as current.
- Preserve answers, notes and navigation position when moving between stages. Re-evaluate the selected questionnaire after context changes using existing deterministic selection rules; only currently applicable valid answers contribute. Disclose any newly unanswered questions without silently resetting the assessment.
- Notes-only edits leave deterministic scores unchanged but make any previous recommendations outdated. Recommendation responses and reports must match current input/config/method/policy/prompt identity; do not trigger paid AI generation merely by navigating between stages. An explicit regenerate action may request new advice once live calls are approved.
- This navigation proposal does not implement utility-bill upload or the emissions calculator. Those input methods remain visibly unavailable until their own authorized milestones.

Extend M3.6 browser checks to cover forward/backward stage navigation, keyboard/mobile access, partial questionnaires, invalid setup/answers, context edits that change selected questions, refresh persistence, and stale or out-of-order score/recommendation responses after edits.





---



## M3.5 — Durable report / PDF

**Status:** PENDING



### Purpose

Create a portable assessment record independent of the live browser session.



### Output

Downloadable report containing:

- SME profile/context

- answers/skips

- question scores

- category scores

- overall scores

- gaps

- recommendations

- evidence/sources

- config/method version



### Dependencies

M3.4.



### Notes

Print-ready HTML is acceptable initially if it satisfies the durable-report requirement.



---



## M3.6 — Failure, latency + recommendation regression review

**Status:** PENDING



### Purpose

Prove the recommendation layer is reliable and degrades gracefully.



### Output

- provider-failure tests

- timeout tests

- deterministic fallback behavior

- recommendation regression checks

- questionnaire-to-answer-review navigation and blank-answer regression checks from M3.4

- latency measurements

- runnable LlamaIndex and LangChain prototypes, comparative benchmark results and an adoption recommendation

- Milestone 3 review package



### Dependencies

M3.1–M3.5.



### Notes

Aim for approximately 10 seconds or less under normal test conditions where practical.



Scores, charts, deterministic gaps, and report generation must still work when AI fails.

### Deferred recommendation-quality evaluation — M3.6 only

After a working migration baseline and separate authorization: evaluate broader prose quality, claim-to-source support/entailment, model selection and latency distribution. Distinguish citation membership from evidence actually supporting a claim; record human rubric and disagreements. Do not turn each editorial preference into a new migration rejection rule. The separately proposed small GPT-5.2 same-input check is a bounded live-review proposal, not completion of this evaluation or proof of Appsmith parity. No framework, model, grounding or latency experiments are implemented now.

### Planned LlamaIndex / LangChain experiment — owner request 2026-10-13

Detailed future protocol: [M3.6 retrieval accuracy, performance and efficiency evaluation](app/docs/M3.6-RETRIEVAL-EVALUATION-PLAN.md), integrated from `e162192`. This is planning only; experiments remain PENDING.

**Purpose:** Build demonstrable hands-on experience with both frameworks and test whether they help deliver assessment recommendations in **under 10 seconds**. This is planned work within M3.6, after the native baseline exists; this M3.6 experiment remains PENDING. Framework use alone does not establish a speed improvement.

**Scope**

- Build small, runnable TypeScript prototypes behind the same retrieval/provider contracts: native TypeScript as the control, LlamaIndex for evidence retrieval/assembly, and LangChain for recommendation orchestration and structured output. Exercise actual framework capabilities; installing packages alone is not a completed experiment. Test each separately before considering a combined stack.
- Keep experimental adapters isolated from the default runtime. Record package versions and dependency implications. A vector database, embeddings, a new managed service or a replacement of the application architecture is not required by this experiment.
- Preserve canonical config, deterministic scoring, accepted numeric policy and BUILD_PACK. Keep framework code outside the deterministic domain. Use the existing source identities, evidence validation and explicit failure behavior.

**Comparison and timing**

- Use the same five SME test contexts, versioned corpus, approved provider/model and generation settings, prompt instructions and comparable evidence/output budgets. Use fixed evidence for an overhead comparison; evaluate retrieval differences separately. Record any changed ranking, prompt, model or concurrency so benefits are not incorrectly attributed to a framework.
- Measure from the user's recommendation request until complete, validated recommendations are visible. Break out retrieval/evidence assembly, provider generation, parsing/validation and total elapsed time. Report sample counts, median, p95, failures/timeouts and token usage/cost; distinguish cold starts, warm uncached runs and cached results. First-token time or a progress indicator does not satisfy the completion target.
- Target **under 10 seconds under documented normal test conditions**. Profile bottlenecks and test bounded optimizations without reducing required output or validation quality. Report misses honestly; this is a measured target, not a promised service guarantee. Existing provider/model, live-call budget and data-transmission approvals apply.

**Quality and review evidence**

- Apply the same checks to each variant: structured validity, authoritative score consistency, citation/source membership, relevance to SME context and priority gaps, plus stale-response and provider-failure behavior. Compare grounded quality as well as speed; exact prose parity is not required.
- Include runnable commands, pinned versions, test conditions, measurements and a brief architecture/tradeoff note in the M3 review package. Recommend retaining native TypeScript, adopting a useful framework component, or deferring adoption based on the evidence.
- Preserve enough implementation and evaluation evidence to support an accurate CV description such as "implemented and evaluated LlamaIndex and LangChain recommendation prototypes." Distinguish prototype experience from production deployment; production adoption is a separate outcome of review.




---



# Milestone 4 — Emissions calculator and quantitative input flow



## M4.1 — Reconcile calculator methodology + fixtures

**Status:** PENDING



### Purpose

Turn the preserved spreadsheet into a trustworthy implementation reference.



### Output

- verified calculator formula decisions

- discrepancy log

- unit assumptions

- calculator regression fixtures



### Dependencies

- M3 approved

- emissions calculator workbook/spec



### Notes

Do not blindly port unverified spreadsheet formulas.



---



## M4.2 — Calculator engine + UI

**Status:** PENDING



### Purpose

Provide a usable deterministic emissions-calculation path.



### Output

- calculator inputs

- unit handling

- deterministic calculations

- validation

- correction/edit flow

- calculator UI



### Dependencies

M4.1.



### Notes

Calculator logic remains separate from scoring semantics.



---



## M4.3 — Canonical metric mapping + autofill

**Status:** PENDING



### Purpose

Resolve quantitative values into assessment inputs without asking for the same information twice.



### Output

- stable `metric_id` mapping

- units/provenance

- questionnaire autofill

- duplicate-input suppression

- user correction capability



### Dependencies

M4.2 plus canonical metric identities.



---



## M4.4 — End-to-end quantitative flow + review

**Status:** PENDING



### Purpose

Prove calculator/manual values correctly enter the deterministic assessment core.



### Output

Demonstrated flow:



`SME setup → manual/calculator data → resolved metric → questionnaire autofill → deterministic score`



Plus Milestone 4 review package.



### Dependencies

M4.1–M4.3 and Milestone 2 engine.



### Notes

Utility-bill/evidence extraction remains stretch unless explicitly approved.



---



# Milestone 5 — Basic config and knowledge-base maintenance

**Milestone classification:** CURRENT / REQUIRED



## M5.1 — Persistence + config/version data model

**Status:** PENDING



### Purpose

Introduce durable storage only once maintenance/versioning requires it.



### Output

- typed persistence/data-access layer

- schema migrations

- config-version records

- source/document records

- publication state



### Dependencies

M4 approved plus architecture review.



### Notes

This is the likely point to introduce PostgreSQL and a typed data layer such as Drizzle.



Do not scatter raw database access throughout the application.



---



## M5.2 — Protected maintainer/admin boundary

**Status:** PENDING



### Purpose

Keep privileged maintenance capabilities separate from the public assessment.



### Output

- protected maintenance route/service boundary

- authorization approach appropriate to deployment

- clear separation from public runtime



### Dependencies

M5.1 plus security requirements.



### Notes

Do not expose admin functionality publicly merely because end-user accounts are deferred.



---



## M5.3 — Config import, staging + validation

**Status:** PENDING



### Purpose

Let maintainers update approved config datasets without application source-code edits.



### Output

- import flow

- staging state

- schema validation

- referential validation

- validation report before activation



### Dependencies

M5.1–M5.2.



### Notes

Canonical config entities remain independently addressable and versioned.



---



## M5.4 — Knowledge-base/source maintenance

**Status:** PENDING



### Purpose

Let maintainers update recommendation source material safely.



### Output

- source/document update flow

- DocumentIndex maintenance

- DocumentChunks maintenance

- validation



### Dependencies

M5.1–M5.3.



### Notes

Automated source-to-config regeneration belongs to Milestone 5A.



---



## M5.5 — Activation, live-version selection + fallback

**Status:** PENDING



### Purpose

Make configuration changes reversible and auditable.



### Output

- publish/select live config version

- assessment/report records retain config version

- original Capstone config retained permanently

- rollback/fallback flow



### Dependencies

M5.3–M5.4.



---



## M5.6 — Maintenance security/deployment + review

**Status:** PENDING



### Purpose

Prove the maintenance path is safe, portable, reproducible, and operational.



### Output

- security checks

- clean-clone deployment/migration test

- backup/fallback demonstration

- Milestone 5 review package



### Dependencies

M5.1–M5.5.



---



# Milestone 5A — Automated source-document to config regeneration

**Milestone classification:** NEEDS EXPLICIT APPROVAL



## M5A.0 — Scope/IP approval gate

**Status:** BLOCKED



### Purpose

Confirm automated source-to-config regeneration is within approved scope and IP boundaries before implementation.



### Output

Explicit human authorization and documented research/IP boundary.



### Dependencies

- Prof. Guo / funded-scope clarification

- Columbia IP guardrails



### Notes

Do not design or prototype detailed commercial/proprietary differentiation merely because it becomes technically possible.



---



## M5A.1 — Automated source-to-config pipeline

**Status:** BLOCKED



### Purpose

Automate the preserved Capstone transformation sequence for future source sets.



### Potential output

- document indexing

- document chunking

- AtomicIndicator extraction

- AtomicIndicator normalization/transformation

- clustering/frequency/context processing

- base-weight generation

- MultiplierRules generation

- CategoryWeights generation

- QuestionBank generation/refinement

- related retrieval/config artifacts



### Dependencies

M5A.0 approval plus preserved provenance/prompts.



### Notes

This is a maintenance workflow, not a runtime assessment path.



Semantic prompt/method changes require human approval.



---



## M5A.2 — Review, publish + rollback

**Status:** BLOCKED



### Purpose

Keep regenerated configuration human-reviewed, versioned, and reversible.



### Output

- generated-artifact review

- validation

- version publication

- rollback to original Capstone baseline

- Milestone 5A review package



### Dependencies

M5A.1.



---



# Milestone 6 — Interactive levers

**Milestone classification:** STRETCH



## M6.1 — Define eligible lever mappings

**Status:** STRETCH



### Purpose

Identify operational variables with a deterministic relationship to scoring.



### Output

Approximately 2–3 candidate levers mapped to:

- canonical metrics

- current values

- allowed ranges

- deterministic scoring paths



### Dependencies

Validated scoring/calculator outputs plus methodology review.



### Notes

AI may rank eligible levers but may not invent the mathematical relationship between a lever and score.



---



## M6.2 — What-if sliders + shadow score

**Status:** STRETCH



### Purpose

Let users explore plausible improvement scenarios without overwriting authoritative results.



### Output

- slider controls

- immediate deterministic recomputation

- authoritative current score

- clearly distinct what-if / ghost score



### Dependencies

M6.1 plus deterministic engine.



---



## M6.3 — Lever review gate

**Status:** STRETCH



### Purpose

Verify mappings and ensure no scoring methodology was silently altered.



### Output

- lever rationale

- canonical metric mapping

- baseline vs what-if examples

- Milestone 6 review package



### Dependencies

M6.1–M6.2.



---



# Milestone 7 — Quick vs Full assessment

**Milestone classification:** STRETCH / METHODOLOGY REVIEW



## M7.0 — Quick vs Full methodology approval

**Status:** BLOCKED



### Purpose

Define how a shortened assessment can produce useful screening value without misleading comparability.



### Output

Approved methodology proposal, potentially using:

- distinct screening score

- core-question-only score

- statistically calibrated approximation

- another explicitly reviewed method



### Dependencies

Validated deterministic engine plus methodology review.



### Notes

Do not simply remove questions and reuse the Full score label.



---



## M7.1 — Implement + validate shortened assessment

**Status:** BLOCKED



### Purpose

Build the approved Quick mode only after its methodology is approved.



### Output

- Quick assessment flow

- approved score treatment

- validation evidence

- Milestone 7 review package



### Dependencies

M7.0 approval.



---



# Milestone 8 — Alan/Henry external benchmark layer

**Milestone classification:** RESEARCH EXPERIMENT



## M8.1 — Audit Alan/Henry research applicability

**Status:** RESEARCH



### Purpose

Define exactly what the large-company China/HKEX/EU research can legitimately support.



### Output

- source/coverage/fit memo

- limitations

- allowable comparison claims

- explicit distinction from SME evidence



### Dependencies

Preserved Alan/Henry research package.



### Notes

The source population is not SMEs.



---



## M8.2 — External benchmark experiment/display

**Status:** RESEARCH



### Purpose

Test an external-context layer without contaminating the core SME score.



### Potential output

- peer/external benchmark display

- contextual recommendation evidence

- verification/research-page comparison

- reporting-frequency comparison



### Dependencies

M8.1.



### Notes

Do not alter core weights or scores by default.



---



## M8.3 — Adoption decision + review

**Status:** RESEARCH



### Purpose

Decide whether the experimental benchmark layer belongs in the product.



### Output

- experiment findings

- limitations

- keep / modify / drop decision

- Milestone 8 review package



### Dependencies

M8.1–M8.2.



---



# Cross-cutting execution rules



These apply to every execution step.



## Scope discipline

- Work only on the explicitly authorized step.

- Do not silently begin the next step.

- Do not add stretch/commercial functionality because it seems convenient.

- If a required change crosses milestone or IP boundaries, stop for review.



## Build Pack protection

- Do not modify `BUILD_PACK` during ordinary implementation unless explicitly authorized.

- Treat it as the evidence/methodology baseline.



## Deterministic-core protection

- Scoring remains deterministic.

- AI may not replace config-driven scoring logic.

- AI failure must not break the core assessment once that capability exists.



## Config protection

Keep these conceptual entities distinct:

- QuestionBank

- AnswerScales

- MetricBenchmarks

- MultiplierRules

- CategoryWeights

- DocumentIndex

- DocumentChunks



## Testing

Before a step is presented as complete:

- run relevant unit tests

- run integration/browser tests where appropriate

- run typecheck

- run lint

- run build

- run Golden Tests when applicable

- test relevant error/failure paths

- verify no secrets or generated junk are being committed



Use `npm run verify` as the baseline verification command once applicable.



## Git discipline

- Keep changes scoped to the current execution step.

- Do not commit or push unless explicitly authorized.

- Keep commits coherent and reviewable.

- Do not rewrite shared history.

- Never commit secrets.



## Completion report

At the end of each meaningful execution step, report:



### Changed

What was implemented or modified.



### Verified

Tests/checks run and results.



### Decisions

Notable implementation choices.



### Deviations

Any intentional difference from spec/baseline.



### Risks / open questions

Anything needing human review.



### Next

The next proposed action without starting it.



---



# Current position

- M1.0–M1.4 — COMPLETE (previously implemented and human-reviewed).
- M2.1 — COMPLETE (accepted by human review; see the M2.2 package acceptance record above).
- M2.2 — COMPLETE (accepted by human review; see the M2.2 package acceptance record above).
- M2.3–M2.5 — COMPLETE; implemented, verified, and accepted by human review on 2026-10-11.
- M2.6 — COMPLETE; implemented and verified on 2026-10-11; accepted by the owner in the final M2 walkthrough on 2026-10-12.
- M2.7 — COMPLETE; implemented, verified and explicitly accepted on 2026-10-12. Milestone 2 is complete; see app/docs/M2.7-MILESTONE-2-REVIEW.md. Questionnaire review/navigation follow-ups remain deferred to M3.4/M3.6. PR #3 merged into main as `4929f9f2969fa946da1066ea3825921349ecf641` on 2026-10-12.
- Current branch — `milestone-3-recommendations`, created from synchronized main at `4929f9f2969fa946da1066ea3825921349ecf641`; the M2 branch/history remain preserved. Local foundation/notes accepted 2026-10-14. M3.1/M3.3 live extension and limited M3.4 Results integration are CURRENT, pending live verification and review. M3.2 native baseline is accepted and unchanged. Remaining M3.4 navigation, M3.5 and M3.6 are PENDING.
- All later steps remain subject to their existing status and explicit human authorization.

## Owner acceptance and one-shot v4 browser walkthrough — 2026-10-15

The owner accepted the offline context-contract correction as reviewed, not all of M3. GPT-5.2 comparison and its harness are deferred to M3.6; the former $1.10 proposal is not active authorization. Configured model remains gpt-5.4-mini.

Exactly one separately authorized synthetic request was dispatched through the application's actual Generate recommendations button in a fresh Playwright browser context. The owner's port-3000 server reported v3; it was left untouched. The existing verified v4 production build ran temporarily on loopback port 3002 with bounded local provider-body capture and an exclusive one-dispatch lock. Readiness confirmed v4, gpt-5.4-mini, low reasoning, 4000 output tokens, 30000ms provider and 45000ms generation-client caps. No runtime source, model configuration or .env.local was changed. Prior assessments/browser storage were untouched.

Before dispatch, the conservative $0.324144 reservation fit the new $0.35 ceiling. No retry or regeneration occurred. Separate evidence: app/.local/live-v4-browser-attempt.json; application response: live-v4-browser-application-response.json; original provider body: live-v4-browser-provider-response.txt (17956 bytes). Files contain synthetic evidence only; no request headers/credentials were recorded. Prior ledgers and retained response hashes are unchanged. Cumulative reservations across all eight attempts: $2.593152; reservations are not actual cumulative billing because the first five failures lack usage.

Result: HTTP 200, available, all application checks passed. Preparation 115.064ms; provider headers 6886.532ms; body completion 46.054ms; total provider 6945.670ms; service total 7082.010ms; browser click-to-complete 7474.145ms. Usage: 14691 input / 1173 output tokens. Estimated cost: $0.01629675 at the verified $0.75/$4.50 per-million rates. One observation meets the under-ten-second target; it does not establish p95 or general reliability.

Visible walkthrough: one Governance recommendation, one Governance gap, authoritative Manufacturing / 251 - 500 / Investor readiness context, and all three citation tuples displayed. Recommendation: Publish a written environmental policy and assign ownership. It proposes a practical policy, responsible leader, annual review and data-quality process. Sources are Industrial Machinery & Goods Sustainability Accounting Standard (Activity Metrics p.6) and Chemicals (Safety & Environmental Stewardship pp.29-30; Operational Safety pp.34-35). Membership checks pass; claim-to-excerpt support remains a human-review limitation. No source links were opened to claim independent verification.

Notes-only followup used the actual setup textarea, Continue to input method, Start questionnaire, then Results. Answers and all other profile fields were unchanged; scores remained 51.0 raw / 12.1 weighted; previous advice was absent and Generate was available. All generation POSTs were blocked in followup; none were attempted. Existing navigation clears non-persisted advice as well, so this live walkthrough alone does not isolate notes identity invalidation from navigation clearing. Six focused offline controller tests passed, including notes-only invalidation of displayed output. Initial walkthrough harness mistakes (returning from incomplete setup and comparing innerText with textContent) were corrected without application changes or paid retries.

Screenshots retained locally: live-v4-browser-accepted.png and live-v4-browser-notes-edited.png. Earlier full offline gate remains valid: typecheck/lint/build, 240 unit tests and 55 browser tests passed. No runtime edits were made in this walkthrough package. All changes remain unstaged/uncommitted. M3 acceptance, deployment and merge remain pending.

### Design-planning checkpoints retained — no implementation authorization

Before deferred M3.4 work: review a concrete design/interaction plan for the existing five-stage navigation proposal, partial-assessment Review access, top-of-review score action, direct Results transition, notes/answer persistence and stale-result behavior. Include desktop/mobile and keyboard states, prerequisite/locked states and loading/error handling; seek owner review before design implementation. Preserve the recorded calculation-explanation and advanced-audit-detail requirements.

Before M3.5: review durable-report content, source/grounding disclosures, printable layout and advanced-audit presentation before implementing report/PDF work. At M3.6: evaluate the reviewed navigation/report designs, failure/latency regressions, prose quality, claim-to-source grounding, and the deferred same-input GPT-5.2 comparison/harness alongside the existing retrieval evaluation plan. These are planning checkpoints only; no design implementation, model switch or experiment starts here.

### Local Results operational fix — 2026-10-16
Live walkthrough paused. A stale next start process serving a replaced .next build caused ChunkLoadError / HTTP 404 on Results. Restarting the unchanged verified build fixed the two-answer partial-assessment transition and refresh: 51.0 raw, 12.1 weighted, answers preserved; zero browser errors or provider requests. Details and before/after evidence in app/docs/M3-LIVE-AI-REVIEW.md. Stop the production server before build/verify replaces its build directory; restart after completion. No runtime or methodology change, no M3 acceptance.

## Focused Results interaction/UI package — authorized 2026-10-16

Owner authorizes combined Generate score and recommendations action (including partial confirmation), immediate independent scores, one explicitly requested recommendation attempt, failure/retry/cancel and duplicate/stale protection; balanced responsive Results layout; expanded executive summary and collapsed counted gaps/actions with evidence/technical disclosure. Use installed UI/accessibility guidance and existing design primitives. No paid calls, new AI components, scoring/retrieval/config/validation/provider changes, commits or pushes. Newer uncommitted work and ledgers must be preserved. This supersedes the earlier restriction on this specific Results transition/layout work, not the rest of deferred navigation, M3.5 reports or M3.6 experiments. M3 is not accepted. Implementation/verification record: app/docs/M3-RESULTS-INTERACTION-REVIEW.md.

Latest owner clarification: scores first, executive summary immediately below with loading; test refresh/navigation during generation, unknown provider outcome and explicit recovery without duplicate automatic dispatch. Restart only the final verified build for manual testing. No provider calls authorized by this verification.

Focused Results package verification complete (2026-10-16): npm run verify PASS — typecheck/lint, 247 unit tests, production build, 61 browser tests; production audit zero vulnerabilities. Desktop/tablet/mobile and pending/recovery visual review complete. Refresh transport-failure receipt defect corrected and verified; no automatic duplicate generation, unchanged scores and explicit unknown-outcome recovery. No provider calls; protected baseline and ledgers unchanged. M3 remains unaccepted; all edits unstaged/uncommitted. See app/docs/M3-RESULTS-INTERACTION-REVIEW.md.

## Results visual correction — owner authorized 2026-10-16

Correct presentation omissions from manual review: compact stored context and accurate score-driver explanation; progressive technical information; top action category/difficulty badges; per-insight accessible source dialogs; reordered/grouped evidence; separate missing-information notice and existing unanswered-item navigation. Use ui-ux-pro-max and ui-styling. No scoring/retrieval/prompt/config/provider changes, paid calls, reports, anticipated ROI, commits or pushes. M3 acceptance is unchanged. Review and per-requirement evidence: app/docs/M3-RESULTS-VISUAL-CORRECTION-REVIEW.md.

Results visual correction gate PASS (2026-10-16): typecheck/lint, 248 unit tests, build, 65 browser tests; desktop/tablet/mobile and retained-response visual inspection complete. All seven UI requirements implemented; score comparison and exact new manual-response audit remain evidence-limited. No provider calls or changes to scoring/config/retrieval/provider settings/ledgers. M3 unaccepted; changes unstaged/uncommitted. See M3-RESULTS-VISUAL-CORRECTION-REVIEW.md for screenshot checklist and transient unchanged-test timeout history.


## Loading/motion closeout authorization — 2026-10-16

Owner authorized the remaining M3.4 loading spinner, approximately two-second rotating words, slower confirmed selection/card transition, delayed offline and reduced-motion verification, plus a private Hetzner staging PLAN only. No provider calls, deployment, commits or pushes. M3/recommendation quality remains unaccepted.

Implemented: 800 ms pointer selection pause with visible Selected confirmation; 420 ms card entry; loading spinner and cosmetic words every 2000 ms. Words do not claim measured provider progress. Reduced motion uses static text/ring and no card animation. Six focused browser checks, typecheck/lint/build passed; full offline gate result recorded below after completion.

GROUNDING-001 — OPEN: Chemicals Operational Safety pp.34–35 / p.35 excerpts do not directly support the reported whistleblower/grievance-channel, confidentiality or non-retaliation recommendation. Citation membership is insufficient proof of claim support. Exact latest manual output is unavailable, limiting complete claim audit. Do not mark recommendation quality accepted; broader grounding evaluation remains M3.6.

Staging proposal: [private Hetzner plan](app/docs/PRIVATE-HETZNER-STAGING-PLAN.md). Owner supplied capstone-ai (89.167.6.61); remote inspection blocked by unavailable SSH authentication, not by missing host identity. Existing trusted-host BatchMode connection as default user guyli failed with Permission denied; no remote command ran. Local setup inspected. Prefer isolated loopback service plus authenticated SSH tunnel, disabled provider/no credentials, and separately labeled non-billable synthetic preview if authorized. No existing remote services inspected or modified.


Final loading/motion package gate: npm run verify PASS (typecheck, lint, 248 unit tests / 29 files including Golden coverage, production build, 69 Chromium tests). Six focused browser checks also passed. Delayed responses prove one request, scores retained, two-second rotation, static reduced-motion feedback and completion cleanup. Selection confirmation remains visible at 600 ms, advances after the 800 ms pause; 420 ms card animation is disabled for reduced motion. Loading screenshots inspected in both modes; responsive Results/source-dialog checks passed at 1440/768/390. Production audit zero vulnerabilities; credential-pattern scan zero matches. Protected BUILD_PACK/domain/config/lockfile diff empty, prior four evidence hashes unchanged, index empty; generated outputs ignored. No provider calls.

Local operational recovery: no listener was present initially. Final verified build 7XkDJeIhEZ9UV7jnWUUxu restarted in persistent hidden process 16232; /results HTTP 200, readiness v4 / gpt-5.4-mini / low / 4000 / 30000 ms confirmed without generation. Client cap unchanged at 45000 ms. Ready for manual testing at http://127.0.0.1:3000. Local existing live settings are unchanged; the proposed non-billable staging preview is not deployed. All edits unstaged/uncommitted. M3 and recommendation quality remain unaccepted.


## Owner acceptance: focused Results UI corrections — 2026-10-16

Owner explicitly accepted the requested Results UI corrections, loading feedback and slower card transitions. This includes the compact context/hierarchy, source dialogs, evidence ordering, reduced clutter, spinner/two-second rotating wording, visible selection confirmation and slower motion. Retained gate: 248 unit tests and 69 browser tests, typecheck/lint/build passed. This is scoped UI acceptance only: not whole M3, recommendation quality, reports, retrieval experiments or deployment acceptance. GROUNDING-001 (unsupported whistleblower citation) and SCORE-COMPARISON-001 (55.6/13.2 versus 58.3/13.8 without matching input maps/traces) remain OPEN.

Next authorized package: read-only Hetzner inspection and local isolated protected non-billable preview preparation using actual UI/deterministic scoring with labeled synthetic narrative scenarios. No server mutation, DNS changes, paid requests, staging, commits or pushes. Deployment approval follows review of concrete files and remaining prerequisites.

Checklist reconciled read-only against the Google Drive v2.0 table; see app/docs/BUILD-CHECKLIST-RECONCILIATION.md. No checklist checkbox is treated as authorization for broader M3/M5/research work.


## Private preview preparation gate — 2026-10-16

PASS: full normal npm run verify (typecheck, lint, 253 unit tests / 30 files including Golden coverage, production build, 70 Chromium tests). Separate preview production build plus six Chromium preview tests passed. Production audit zero vulnerabilities; credential-pattern scan zero matches; four prior evidence hashes unchanged; protected BUILD_PACK/config/domain/lockfile diff empty; Git index empty. Preview select labeling issue was fixed before the complete successful rerun. Generated .next-preview output is excluded from lint/Git; an initial gate was stopped during lint to add that generated-output exclusion, then the full gate passed.

Local preview: http://127.0.0.1:3001/preview, PID 33428, source release preview-970da310fbfe902076ae; health synthetic/billable=false, provider ready=false/private_preview_disabled. Normal verified build xL_3WjPUwlWrhS1Fu-aXT restored on port 3000 (PID16804). No .env.local edit, provider call, server mutation, staging/commit/push. Current branch milestone-3-recommendations.

Prepared concrete deployment files in app/deploy/preview; runbook app/docs/PRIVATE-HETZNER-STAGING-PLAN.md; implementation review app/docs/PRIVATE-PREVIEW-REVIEW.md; checklist reconciliation app/docs/BUILD-CHECKLIST-RECONCILIATION.md. Proposed new service 127.0.0.1:3201, isolated network, 1 CPU/768MB, protected HTTPS preview.flowagentai.website, image/health identity and preview-only rollback. Fresh SSH inventory blocked (no matching configured key/agent; default guyli denied), Docker Linux daemon absent and Caddy not installed locally. Compose and Node script syntax validated; exact-container/egress/Caddy auth/TLS checks remain required before deployment approval. Existing Appsmith/n8n/Postgres/NocoDB services were not changed.

Owner UI acceptance is recorded, not whole M3 acceptance. GROUNDING-001 and SCORE-COMPARISON-001 remain open; synthetic fixtures do not resolve recommendation quality or manual score provenance.
