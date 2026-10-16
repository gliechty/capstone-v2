# M3.1/M3.3 offline generation diagnosis

Date: 2026-10-15. Branch: milestone-3-recommendations. No provider request, regeneration or network check in this diagnosis. Neither M3 nor the live package is accepted. Existing local changes remain unstaged/uncommitted. Deferred UX, M3.5 and M3.6 remain out of scope.

Subsequent status: the owner authorized the proposed prompt/deadline correction later on 2026-10-15. It is now implemented offline; see M3-LIVE-AI-REVIEW.md. Proposal/current-timeout statements below describe the original diagnosis checkpoint. Both provider-call allowances remain exhausted.

## What can and cannot be recovered

The rejected sixth response was **not retained**. The diagnostic runner stored only metrics, usage and issue codes/paths on rejection; it saves validatedContent only after successful validation. app/.local contains the original five-attempt ledger and the separate diagnostic record, neither containing rejected prose. Do not regenerate it. No model-response excerpts or citations are available, and no archived historical output can substitute for this response.

The preserved input, canonical config and unchanged prompt assembly establish these three required executive-summary labels:

- industry: `Manufacturing (Industrial / Components)`
- companySize / employee_band: `251 - 500`
- businessGoal: `Investor readiness`

The two identical `sme_context_missing` records do not identify which two labels were absent. The old validator appended an indistinguishable issue for each missing label; issue order alone cannot disambiguate the pair. It is also unknown whether the model omitted the concepts or used legitimate paraphrases (e.g. an en dash instead of the exact employee-band spelling). Those examples are hypothetical, not recovered excerpts.

Both answered questions, U-001=No and U-002=Yes, belong to **Governance**. People, Community and Resources have null category percentages and no answered questions. Under the validator, Governance is the only eligible category for structured recommendations/gaps in this case. The schema accepts only the four canonical category names, and schema parsing succeeded before these errors, so each rejected row contained at least one of the three unobserved categories. The exact chosen categories and prose were not retained.

| Recorded issue | What is proved | What is not recoverable |
| --- | --- | --- |
| executive_summary: sme_context_missing, twice | Two of the three exact labels above were absent before the required score-closing sentence | Which two; omission versus paraphrase; generated excerpts |
| priority_recommendations.0: unanswered_category | Row 1 named at least one non-Governance category | Category names, action/rationale and whether it proposed collecting missing data |
| priority_recommendations.1: unanswered_category | Row 2 named at least one non-Governance category | Same limitations |
| priority_recommendations.2: unanswered_category | Row 3 named at least one non-Governance category | Same limitations |
| priority_recommendations.3: unanswered_category | Row 4 named at least one non-Governance category | Same limitations |
| key_gaps.1: unanswered_category | Gap 2 named a non-Governance category | Category name and whether it described missing evidence or claimed an observed weakness |
| key_gaps.2: unanswered_category | Gap 3 named a non-Governance category | Same limitations |

## Exact contract comparison and classification

The runtime system instruction says: “In the executive summary, explicitly name the supplied industry, employee band and business goal.” The application validator instead requires case-insensitive **literal substring** matches. The response JSON schema defines executive_summary as a string; it imposes no exact-label requirements. Thus there is a verified instruction/validation precision mismatch. The semantic context requirement is explicit, but literal spelling is not. Without prose, neither ignored instructions nor a false rejection of a legitimate paraphrase can be conclusively assigned to the two original errors. Do not treat missing literal labels as proof that the model ignored SME context.

The next system clause says: “Related categories must have answered questions; include the lowest observed category among the recommendations.” This explicitly governs priority_recommendations.related_categories. All four rejected recommendation rows violated that structured-field constraint. The transport schema's enum contains all four canonical categories; it does not dynamically restrict the list to categories observed for this SME. The prompt supplies all category scores, including null/unanswered ones, and the retrieved documents/chunks may cover unobserved areas. Supplying those sources is not authorization to invent an assessed weakness. A compliant producer must still follow the answered-category rule. Whether an individual rejected row was otherwise a useful missing-data suggestion cannot be known without its prose.

The legacy prompt only says “Keep key_gaps diagnostic and short, not repetitive of recommendations.” The system refers to “Related categories,” but does not explicitly name key_gaps.category or direct missing-data discussion elsewhere. The validator applies the observed-category restriction to key_gaps too. This is a verified **prompt clarity gap**, not proof that the model ignored an explicit key-gap instruction. The static schema allows any canonical category. The original two gap violations may have been unsupported weakness claims or legitimate missing-information discussion placed in the wrong field; the record cannot distinguish these.

An offline controlled example proves the boundary without attributing wording to the model:

- `grounding_notes`: “Resources, People and Community were not assessed; collect answers before drawing conclusions about these areas.” **Passes** with otherwise valid content and retained source-limitations disclosure.
- `key_gaps` category Resources, gap: “Resources was not assessed; collect answers before drawing conclusions.” **Fails** unanswered_category, even though the sentence is truthful.

The validator is structurally strict, not a semantic classifier of data-collection advice. The rejection is consistent with the current assessed-gap contract; it is not evidence that missing information should be hidden. The existing grounding_notes field already provides a place for that disclosure. Expanding key_gaps to mix observed weaknesses with unassessed/data-collection categories would change its meaning and Results interpretation; that needs a separate reviewed contract/UX decision. Do not simply remove unanswered_category or relabel rejected rows automatically.

## Archived Appsmith/n8n versus v2

Verified from the actual exported nodes/actions, not inferred SDK defaults:

| Aspect | Archived final runtime | Current v2 |
| --- | --- | --- |
| Model | n8n `Message a model`, OpenAI node typeVersion 2.1, modelId.value `gpt-5.2` | Fixed approved `gpt-5.4-mini`; low reasoning |
| Reasoning/output cap | Node options `{}`; no explicit reasoning effort, token cap or sampling override exported | Explicit low and 4,000 max_output_tokens |
| Tools / API | Node responses.values forwards recommendation_prompt; builtInTools `{}`. Exact SDK request/defaults not captured | Native fetch POST /v1/responses, no tools/retries, redirect:error, store:false |
| Prompt | `Build Recommendation Prompt` constructs four JSON sections and the legacy instructions | Static legacy template preserved exactly; additional trusted system instructions plus validation-context/citation allowlist |
| Context | company_name, industry, subindustry, employee_band, revenue_band, company_location, country, target_market_region, target_buyer, business_goal, notes | Same collected concepts except country/revenue_band remain omitted and explicitly unavailable; notes retained; no invented replacements |
| Scoring authority | Appsmith AssessmentScoring.getScorePayload supplies raw/weighted overall, categories, weighted breakdown, debug/weights, scoring_summary and answered questions | Server recomputes from validated raw answers/config; no client score authority; full-precision accepted numeric policy |
| Context forwarded into prompt | n8n Format Retrieval Output forwards context, raw/weighted/category/breakdown and answered questions. Build node assigns scoring_summary but does not interpolate it in the prompt | Trusted scoring JSON includes overall/category/breakdown and answered questions; raw answers first remains in the legacy instruction |
| Legacy quirks | Set node names `weighted_overall ` and `category_scores   ` have trailing spaces; downstream reads unspaced names. Prompt builder can derive weighted score from contributions, rounding that fallback to one decimal | Trusted values supplied directly; accepted M2 differences retained, not recreated to mimic the bug |
| Retrieval | Deterministic metadata ranking, top 8 documents / 18 chunks; legacy title joins | Same native baseline limits, stable migrated identities/order, disclosed exclusions and source limitations |
| Output requirements | Prompt asks for JSON with summary/recommendations/gaps/grounding_notes; max 5 recommendations and 3 gaps | Same fields plus strict provider JSON schema and application checks for scores, context, category relevance and citation membership |
| Postprocessing | Respond to Webhook returns model output. Appsmith getParsedRecommendations reads output[0].content[0].text and JSON.parse; catch returns null. No semantic/schema validation in these nodes/actions | Bounded envelope parsing and explicit failure codes; validates references and content before exposing advice |
| Caller timeout | API_Get_Recommendations action: **100,000 ms** in both published and unpublished SME Assessment Tool configurations | Browser/smoke POST cap 25,000 ms; provider default/max 10,000 ms; service policy schema max 30,000 ms; inbound body-read cap 10,000 ms |
| Parser timeout | Appsmith getParsedRecommendations JS action: 10,000 ms | Not equivalent to provider request timeout; do not confuse the legacy parser and HTTP action caps |
| Provider/workflow timeout | Model options `{}`; workflow settings contain executionOrder/binaryMode/availableInMCP, no explicit execution timeout; host/proxy/SDK defaults absent | Explicit service abort/race; one-off 60-second diagnostic did not alter normal caps |

Sources: BUILD_PACK/03_LEGACY_N8N/workflows/n8n-output-rag-final-2026-10-02.json; BUILD_PACK/02_LEGACY_APPSMITH/export/appsmith-sandboxes-v1-export-2026-10-02.json (published/unpublished API_Get_Recommendations and getParsedRecommendations; AssessmentScoring.getScorePayload); app/src/content/recommendations/legacy-prompt.json; app/src/application/recommendations/prepare.ts, contracts.ts, validate-output.ts; app/src/adapters/recommendations/openai.ts and configuration.ts. Existing prompt regression verifies exact static-template preservation against the archived node.

Missing evidence: deployed n8n release/SDK defaults, its effective provider and infrastructure timeouts, exact billed legacy settings, provider latency distribution, actual model snapshots behind aliases, and the rejected sixth response. An exported 100-second Appsmith action is not evidence that legacy recommendations typically took 100 seconds or met a ten-second target. The two models cannot be compared for speed/quality from these artifacts alone. No live lookup or request was made to fill these gaps.

## Smallest correction and timeout proposal

Implemented now: diagnostic detail only. sme_context_missing includes a bounded contextField identifier; unanswered_category includes only the offending canonical category names while retaining one issue per rejected row. No raw narrative, SME field values, prompt, credential or provider response is added to errors. These changes cannot recover the earlier response, and do not alter acceptance rules, scores, citations, output schema or prompt identity.

Recommended next correction (proposal only; **not implemented**): clarify the trusted system instructions and append explicit validation-context data:

1. Require the three supplied labels verbatim (case-insensitive acceptance remains), exposing a `required_summary_labels` map in validation context. Tell the model not to paraphrase these labels; no need to hard-code a particular SME into code or force a model-generated score repair.
2. Supply `allowed_assessed_categories` derived from non-null category scores and `unassessed_categories`. Explicitly apply the first list to BOTH priority_recommendations.related_categories and key_gaps.category. State that null is unknown, not zero or demonstrated weakness.
3. Direct unassessed areas and requests to complete answers to grounding_notes, without claiming assessed weakness. State that five recommendations/three gaps are maxima, not quotas; produce fewer when only one category is observed. Preserve the requirement to cover the lowest observed category and exact existing score closing.
4. Version the prompt when implementing this clarification. Keep the preserved legacy template, retrieval, scoring, static schema and validator safeguards intact. Dynamic per-request category enums could be a later belt-and-braces option but add complexity unnecessary for the first correction. Do not broaden key_gaps or weaken the literal/score/citation checks just to obtain a pass.

Suggested operational provider hard deadline: **30 seconds**, provisionally, distinct from the **under-ten-second latency target**. The one successful transport took 15.042 seconds, mostly before headers; 30 seconds provides margin without adopting the legacy caller's 100 seconds or the diagnostic's 60 seconds as normal behavior. One sample does not establish a percentile/SLA or guarantee success for longer assessments. The target remains unmet; a 15-second validated result would still miss it. No streaming/model/reasoning/retrieval experiment is implied.

Coordinated implementation would require raising the runtime settings maximum/default to 30 seconds, using that only for the provider service race (the policy schema already allows 30 seconds), and setting browser/smoke generation-client caps to 45 seconds to cover body admission/preparation/serialization. Keep inbound request-body reading at 10 seconds, safe status GET at 15 seconds, and immediate user cancellation. Audit any future hosting/proxy timeout separately. No automatic retries. The canonical policy file and current runtime deadline are unchanged in this diagnosis; timeout adjustment is a recommendation for owner review, not authorization to generate again. Both existing paid-call allowances remain exhausted.

## Offline verification

77 focused tests passed across recommendation-validation, recommendation-prompt, recommendation-service and openai-provider. Added four cases for exact missing-field diagnostics, offending-category diagnostics, legitimate missing-data disclosure versus a structured assessed gap, and incorrect score rejection despite valid context labels. Existing prompt preservation, semantic checks, transport failures and test-only-provider behavior remain covered. Typecheck and focused lint PASS; git diff --check PASS. A first lint invocation used the repository root with application-relative paths and found no files; rerunning from app passed. Original ledgers preserved; no new provider request or rejected-response regeneration.

Preserved evidence hashes (SHA-256): original ledger F8BEA126AF8248A03264FAEAA36CB646FA0327FF005F0FACD8063D9F55878A03; separate diagnostic 0D2FC075E14388B7B6A4055C633BC46271C617E8A908BD0B75FABB5D7F5CA301. The index is empty; protected scoring/config/BUILD_PACK/prompt/retrieval/policy/lockfile paths remain unchanged.
