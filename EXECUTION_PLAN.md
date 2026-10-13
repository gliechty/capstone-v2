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

Implemented and verified on 2026-10-12; accepted by the owner on 2026-10-12 following the human walkthrough. The eight-question test matched expected scores, and the Q23 edit, recalculation and refresh worked. Final acceptance includes M2.6 and completes Milestone 2; see app/docs/M2.7-MILESTONE-2-REVIEW.md. Questionnaire review/navigation issues are deferred to M3.4/M3.6. PR #3 merged into main on 2026-10-12 with separate owner authorization; see the merge/branch record below. M3 implementation remains unstarted and unauthorized.



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

## M3 implementation proposal — planning only, 2026-10-12

M2 was explicitly accepted on 2026-10-12. With separate owner merge authorization, PR #3 merged into main on 2026-10-12 using merge commit `4929f9f2969fa946da1066ea3825921349ecf641` (parents: previous main `8cae855` and acceptance commit `c9cb2b8`). Local main was synchronized, then `milestone-3-recommendations` was created from that merged main. `milestone-2-deterministic-core` remains preserved locally and remotely at `c9cb2b8`; shared history was not rewritten. The current branch is `milestone-3-recommendations`; this documentation handoff does not begin or authorize M3 implementation. All M3 execution steps remain PENDING.

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
- Legacy prompt mentions notes/revenue_band, while current UI does not collect them. Omit unavailable fields explicitly; do not invent values. Adding new setup fields is a separate meaningful UX decision.

### Proposed server environment names and decisions before implementation

Names to add to `app/.env.example` when the package is authorized; no credentials are needed or requested for this M2 sprint:

| Name | Purpose |
| --- | --- |
| `RECOMMENDATION_PROVIDER` | Explicit adapter selection |
| `RECOMMENDATION_MODEL` | Reviewed model identifier; historical gpt-5.2 is provenance, not a pinned future choice |
| `OPENAI_API_KEY` | Server-only secret if the OpenAI adapter is selected |
| `RECOMMENDATION_TIMEOUT_MS` | Validated bounded provider deadline |
| `RECOMMENDATION_MAX_OUTPUT_TOKENS` | Validated cost/output bound |

No `NEXT_PUBLIC_` secret or client-controlled provider URL. Provider/model, budget, credential provisioning and allowed SME data transmission need owner direction before live integration. Before public exposure, decide deployment-level abuse/cost controls for a paid anonymous endpoint; do not expose an unbounded billable proxy. Citation/edition ambiguities must be resolved or explicitly excluded before affected generated advice is treated as grounded. M2 acceptance and the authorized PR #3 merge were completed on 2026-10-12; first-package authorization remains the immediate implementation gate.





## M3.1 — Recommendation service + provider boundary

**Status:** PENDING



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

**Status:** PENDING



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

**Status:** PENDING



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

**Status:** PENDING



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

### Planned LlamaIndex / LangChain experiment — owner request 2026-10-13

**Purpose:** Build demonstrable hands-on experience with both frameworks and test whether they help deliver assessment recommendations in **under 10 seconds**. This is planned work within M3.6, after the native baseline exists; M3 implementation remains PENDING. Framework use alone does not establish a speed improvement.

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
- Current branch — `milestone-3-recommendations`, created from synchronized main at `4929f9f2969fa946da1066ea3825921349ecf641`; the M2 branch/history remain preserved. M3 implementation is unstarted; M3.1–M3.6 remain PENDING.
- All later steps remain subject to their existing status and explicit human authorization.
