# M3 live provider and limited Results integration review

> Current contract (owner scope correction): legacy-runtime-v1-validated-transport-4. Literal summary labels are no longer required; authoritative setup context appears separately in Results. Numeric/reference/category safeguards remain. Retained response passes offline replay only; no new live generation or M3 acceptance. See [migration baseline review](M3-MIGRATION-BASELINE-REVIEW.md). Prior version-3 sections are historical evidence. Offline correction gate: typecheck, lint, 240 unit tests, build and 55 browser tests PASS; 69 focused tests PASS. The linked review records the unchanged-response replay and pending two-request comparison proposal ($1.10 new ceiling). No live request is authorized by these documents; previous allowances remain exhausted. Keep the configured model and .env.local unchanged.

Date: 2026-10-14. Branch: `milestone-3-recommendations`. Baseline: `b056f0a`, integrated by fast-forward with a clean working tree. This package remains uncommitted for owner review. No staging, commit, push, main merge or deployment is authorized under the latest operating instruction.

## Acceptance and scope

The owner accepted the prior LOCAL M3.1–M3.3 foundation and notes restoration on 2026-10-14. Human evidence: answers and notes survived refresh; notes-only edits preserved displayed raw 58.3 and industry-weighted 13.8. This accepts local behavior, not the present live adapter, a real-provider result or Milestone 3.

| Row | Current position |
| --- | --- |
| M3.1 | Server-only OpenAI Responses adapter and runtime settings implemented; offline verification passed; first live smoke failed 0/5, allowance exhausted |
| M3.2 | Accepted native metadata baseline reused unchanged: 8 documents / 18 chunks, stable joins, ordering and exclusions |
| M3.3 | Actual adapter connected to preserved prompt and application validation; offline verification passed; real-provider smoke timed out 5/5, no validated output |
| M3.4 authorized subset | Explicit Generate/Regenerate, validated advice/evidence, loading/cancel/error/retry and freshness protection in existing Results layout |
| M3.4 remainder | PENDING: stage navigation, Review/generation button placement, intermediate-screen removal, blank/Skip behavior and technical-JSON presentation |
| M3.5 | PENDING: durable report/PDF |
| M3.6 | PENDING: full failure/latency review and native/LlamaIndex/LangChain experiments; this package supplies only preliminary checks |

No new dependency, SDK, database, authentication, upload, calculator, embedding or framework experiment. BUILD_PACK, canonical config, source exclusions, deterministic scoring, numeric policy and Golden fixtures remain protected.

## Implementation and controls

Official API references checked on 2026-10-14: [Responses text generation](https://developers.openai.com/api/docs/guides/text), [strict structured output and supported schema subset](https://developers.openai.com/api/docs/guides/structured-outputs), [reasoning/output-token limits](https://developers.openai.com/api/docs/guides/reasoning), and [gpt-5.4-mini settings/pricing](https://developers.openai.com/api/docs/models/gpt-5.4-mini). Actual provider acceptance remains pending live verification.

- The server composition root reads explicit provider/model/reasoning/timeout/output settings for each operation. Default disabled; no missing-key build failure, client configuration or personal-key fallback. Safe GET status never calls OpenAI. See [setup and Columbia handoff](AI-PROVIDER-SETUP.md).
- Platform fetch sends one Responses API request to a fixed HTTPS endpoint, with no redirects/retries/tools, `store:false`, strict JSON-schema output and a signal. The adapter bounds the response envelope at 200,000 bytes before parsing; application output remains limited to 40,000 bytes. Existing request/prompt limits and ten-second maximum provider deadline remain. Semantic Zod refinements, string limits and URL validation stay in the application validator; unsupported transport string keywords are omitted from the provider schema only.
- Refusal, incomplete output, malformed envelopes, wrong returned model, authentication, quota, rate limiting, transport failure, cancellation and deadline failures return safe explicit codes. Raw errors/provider content are not logged or reflected. Available usage is retained even when application validation rejects the prose.
- Trusted raw answers are validated and scored server-side. Unchanged retrieval and prompt assembly feed the provider; no client score is accepted and no generated numeric repair occurs. Provider/model/reasoning/bounds join existing input/config/method/prompt/policy identity.
- Results generation occurs only from an explicit button. Scores, charts, explanations and labeled deterministic lowest-category comparisons remain independent. Fictional narrative is removed from the active Results page. Structured text is rendered as React text; source links come from validated citation membership and use safe external-link attributes.
- A controller rejects duplicate submission and stale/cancelled/out-of-order responses. It compares canonical parsed input (including notes), configuration, method, prompt, policy and provider settings before display. Session events, focus/restoration and a thirty-second safe configuration check invalidate changed results; configuration is also checked before and after generation. Runtime settings changed elsewhere may remain visible until the next check, at most thirty seconds while the page is active. Generated content is held only in page memory; refresh/navigation clears it and never incurs automatic generation charges.
- Loopback request/origin checks, one active server generation and five admissions/minute constrain local use. Next's loopback forwarded socket address is accepted; public forwarded addresses and cross-origin requests are rejected. This is not public authentication, distributed rate limiting or a provider billing cap.
- Unit and browser runners set an offline fence even if credentials exist locally; the real adapter independently refuses normal-test network access. Injected controlled transports are test-only. The endpoint still refuses `test_only` output; no runtime mock fallback is added.

## Live verification and preliminary performance

At the 2026-10-14 offline checkpoint, no external AI request had been made. A safe boolean-only local check found no `.env.local`, explicit OpenAI provider, approved model or key. Live verification is **PENDING**, not passed. Provider latency, output quality, refusal frequency and real schema compatibility remain unmeasured.

The separately invoked `npm run smoke:recommendations -- --confirm-synthetic-budget` requires explicit local configuration and uses only synthetic profiles plus canonical source excerpts. A persistent ignored ledger and lock enforce at most five attempts and estimated US$2 reservations across runs. Failed and timed-out attempts count. It records settings, validation, endpoint/retrieval/provider timing, usage when available and estimated cost without sensitive text. Official pricing and the conservative reservation calculation are in the setup guide. At that checkpoint no smoke ledger had been generated. The 2026-10-15 owner-run results below supersede that live-pending status.

Timing definitions: retrievalMs includes request validation, trusted scoring and evidence preparation; providerMs measures provider waiting/response parsing (on failures, elapsed time since preparation); totalMs is application-service elapsed time before HTTP serialization; endpointMs is observed by the smoke client. Offline test timings are not provider performance claims. The ten-second deadline is an execution bound, not evidence that valid recommendations meet the under-ten-second target. Cancellation may not prevent charges already incurred upstream.

## 2026-10-15 live-timeout diagnosis — allowance exhausted

The owner-run first live smoke produced **0/5 accepted results**. All five attempts used gpt-5.4-mini, low reasoning, 4,000 maximum output tokens and a 10,000 ms provider deadline. Every validation outcome is not_accepted. No further generation was attempted during diagnosis. The original ignored ledger remains byte-for-byte preserved: SHA-256 F8BEA126AF8248A03264FAEAA36CB646FA0327FF005F0FACD8063D9F55878A03.

| Case | Attempt UTC (2026-10-15) | Preparation* ms | Provider* ms | Service ms | Endpoint ms | Outcome / HTTP | Usage |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- |
| synthetic-1 | 05:43:19.717Z | 104.21 | 10022.13 | 10126.53 | 10260.65 | timeout / 503 | null |
| synthetic-2 | 05:43:29.988Z | 57.15 | 10015.62 | 10072.92 | 10211.30 | timeout / 503 | null |
| synthetic-3 | 05:43:40.204Z | 65.45 | 10013.49 | 10078.99 | 10211.94 | timeout / 503 | null |
| synthetic-4 | 05:43:50.422Z | 79.89 | 10005.12 | 10085.09 | 10228.42 | timeout / 503 | null |
| synthetic-5 | 05:44:00.655Z | 63.85 | 10005.81 | 10069.70 | 10220.49 | timeout / 503 | null |

*Historical retrievalMs includes validation, trusted scoring and evidence preparation, but excludes prompt assembly. Historical failure providerMs also includes that small assembly interval. These are preserved observations, not retroactively corrected measurements. New preparationMs includes prompt assembly, and new providerMs starts at the provider race consistently for success/failure.

All five usage fields are null, contrary to the initial description of failures “with usage.” Each $0.324144 estimatedUsd is the runner's conservative reservation fallback, not measured billing. Total reservation is $1.620720. Actual incurred charges are unknown; cancellation does not establish zero cost. The five-attempt allowance is exhausted even though its estimated dollar budget has remaining capacity. Do not reset/delete the ledger or rerun generation.

### Observed chain and remaining uncertainty

The service races provider completion against its own timer. At the deadline it rejects with its timeout sentinel and aborts the signal passed to fetch. The route maps unavailable results to HTTP 503; this is not evidence of an upstream 503. The adapter performs one non-streaming POST with redirect:error, store:false and no automatic retries; fetch resolves at headers, then reads a bounded 200,000-byte envelope, parses it and applies unchanged application validation. Usage is available only after a complete recognized envelope. Body-reader errors map to invalid_response, but the deadline rejects before aborting so its timeout classification wins. Late settlement cannot produce accepted content.

The ledger contains no header/body timings or upstream status. It cannot establish whether any request reached generation, whether credentials were accepted, or whether the delay was network, provider processing or response transfer. Model latency, bad credentials and outage remain hypotheses, not diagnoses. Local preparation is small relative to the observed deadline; no optimization or model/prompt changes are justified by these measurements.

A single non-generating connectivity check on 2026-10-15 used Node v24.19.0 fetch GET https://api.openai.com/v1/models, no Authorization header/body, redirect:error and a 10-second abort cap. It returned the expected HTTP 401 at headers in 587.00 ms; the body was cancelled without printing it. This demonstrates connectivity at that moment only, not key validity, model access or generation health. No local credentials were read or transmitted by this check.

### Minimal diagnostic correction

A provider-neutral optional diagnostic callback now reports only fixed stage names, UTF-8 request/response byte counts, upstream HTTP status, header elapsed time and body-read elapsed time. Service metrics include prompt byte count, preparation time and the stage captured at timeout (awaiting_headers, reading_body, body_complete, or provider when no stage was reported). Header timing starts immediately before transport; body timing ends at EOF before JSON parsing. No time-to-first-token claim is made for this non-streaming request. Metrics are snapshots; aborted/late providers cannot mutate returned observations. No credentials, prompts, SME text, raw provider responses or raw exceptions are logged. Existing deadlines, output limits, prompt, retrieval and output checks are unchanged.

### Timeout caps and one-request proposal (NOT authorized or executed)

| Layer | Current cap / behavior | Proposed diagnostic treatment |
| --- | --- | --- |
| Runtime settings | default and maximum 10,000 ms | Leave unchanged |
| Service policy schema | maximum 30,000 ms; normal policy 10,000 ms | Leave unchanged; cannot pass 60,000 through existing service |
| Service generation race | policy timeout; aborts fetch including body reads | Diagnostic-only harness owns a single 60,000 ms race/AbortController |
| API inbound body read | 10,000 ms before service execution | Not used by direct harness; leave unchanged |
| Browser and smoke generation client | 25,000 ms | Not used by direct harness; leave unchanged |
| Browser/smoke safe status GET | 15,000 ms | No generation; retain if used for preflight |
| Caller disconnect/cancel | propagates AbortSignal; can end earlier | Harness cancellation stops work and counts attempt |
| Native fetch / network / host | no custom dispatcher/connect/headers/body timeout configured; underlying Node/OS/provider limits may fail earlier | Keep native transport; explicit 60-second abort is the maximum, not a promise of completion |
| Next hosting | local Node route, no maxDuration/proxy deadline configured in repository | No deployment or hosting change; direct local harness avoids HTTP/framework caps |

After explicit owner approval, implement and offline-test a **one-shot local server-only diagnostic harness**, then send exactly one request using syntheticCase(0, current sessionVersion), identical to synthetic-1. Reuse canonical scoring, prepareEvidence, assemblePrompt, the actual openAIProvider and validateRecommendationOutput functions without modifying their semantics. Reuse all request/prompt/response bounds; validate raw answers before preparation. The only execution difference is the harness-owned 60,000 ms provider deadline. A 75-second whole-process watchdog covers preparation/cleanup; it must never extend the provider deadline. This bypasses HTTP/service timing orchestration for diagnosis only and is not an integrated endpoint performance test.

Require model gpt-5.4-mini, reasoning low, output cap 4,000, identical non-streaming schema/store:false, unchanged sources/8-document/18-chunk retrieval and full validation. No archived/confidential SME data. No retries, model fallbacks, shortened prompt, altered reasoning, extra generation or score repair. Refuse execution on setting drift. Preserve the original ledger read-only; acquire an exclusive one-shot lock and persist a separate ignored diagnostic reservation BEFORE dispatch, with the original ledger hash and one-attempt limit. Interrupted/error/timeout outcomes consume that attempt. Report only safe metrics, validation issue codes/paths and usage/cost when available; no raw content. A result taking over ten seconds remains a failure of the normal under-ten-second target even if the diagnostic completes.

Pricing rechecked 2026-10-15 against the [official model page](https://developers.openai.com/api/docs/models/gpt-5.4-mini): $0.75/M input and $4.50/M output. Under the existing conservative reservation convention (400,000 prompt bytes treated as tokens + 8,192 schema/framing allowance, no cache discount, 4,000 output tokens), additional estimate = $0.324144; cumulative six-attempt reservation = $1.944864. This is an estimated reserve, not a provider-enforced billing cap or actual charge. The harness should check its schema/framing fits the existing allowance before dispatch. Longer wall time alone does not increase the output-token cap. Approval is needed for the sixth attempt despite the cumulative estimate remaining below $2.

Normal runtime remains capped at ten seconds, and the under-ten-second goal remains unmet. This diagnosis does not accept the live package or begin deferred M3.4 UX, M3.5 or M3.6.

## 2026-10-15 separately authorized diagnostic — consumed, stop

The owner explicitly authorized exactly ONE additional synthetic request, at most 60 seconds, no retries, with unchanged gpt-5.4-mini / low reasoning / 4,000-token limit, prompt, retrieval and validation. Additional reservation $0.324144; cumulative reservation $1.944864. This supersedes the pending-authorization proposal above only for this single attempt. It does not authorize further calls, changed validation or a longer normal runtime deadline.

The isolated local harness reused syntheticCase(0), canonical scoring, native prepareEvidence, assemblePrompt, the actual OpenAI adapter and validateRecommendationOutput. It loaded TypeScript via the already installed Vite tooling; no dependency was added. Local dry-run preflight performed no generation. Exactly one dispatch was made, with a 60-second abort/race and a 75-second post-reservation watchdog. The normal configuration and service policy were never overridden, so no restoration edit was necessary. HTTP application/client caps were not used: this is provider diagnosis, not an integrated endpoint timing result.

| Observation | Result |
| --- | --- |
| Attempt timestamp | 2026-10-15 06:30:03.038 UTC (13:30:03.038 Bangkok) |
| Case / separate record | synthetic-1 / app/.local/live-diagnostic-2026-10-15.json |
| Local preparation | 122.9231 ms |
| Prompt / complete request | 62,395 / 67,922 UTF-8 bytes |
| Time to response headers | 14,943.2468 ms |
| Upstream status | HTTP 200 |
| Body read to EOF | 88.2277 ms; 21,092 bytes |
| Total provider phase | 15,041.5322 ms |
| Final stage | body_complete; no timeout |
| Validation outcome | invalid_output / not_accepted |
| Input / output tokens | 14,541 / 2,277 (provider-reported) |
| Usage-based estimated charge | $0.02115225, using $0.75/M input and $4.50/M output, no cache discount |
| Reservation | $0.324144 additional; $1.944864 cumulative |

The preserved original five attempts still have unknown actual usage. Their $1.620720 reservation plus this request's usage-based estimate is $1.64187225, but that mixed accounting figure is NOT a measured cumulative bill. Keep the full authorized cumulative reservation $1.944864 recorded; unused reservation does not authorize another call.

The unchanged validator returned eight issues:

| Code | Paths / count |
| --- | --- |
| sme_context_missing | executive_summary, twice (two required literal context labels absent) |
| unanswered_category | priority_recommendations.0, .1, .2, .3 |
| unanswered_category | key_gaps.1, .2 |

The provider returned a complete parseable envelope with usage, but the generated content is not an accepted recommendation. No validated recommendations or citations are available to publish for review. Raw rejected provider content was not logged or retained; only safe metrics and validation paths were saved. No score-mismatch or citation-membership issue was reported in the returned issue list; this does not establish semantic accuracy or source entailment. Exact-wording and percentage-validation limitations remain unchanged, and no checks were weakened or incorrect scores repaired.

This attempt demonstrates that the configured credentials/model could return an HTTP 200 completed response at this time, with almost all measured provider waiting before headers. A 15-second completion would miss the normal ten-second deadline; the under-ten-second performance target remains unmet. It does not retrospectively locate the five prior timeouts, or distinguish network transit, provider queueing and generation within time-to-headers.

The separate reservation was created exclusively before dispatch and is permanent: rerunning the harness refuses any second attempt. The original ledger SHA-256 remains F8BEA126AF8248A03264FAEAA36CB646FA0327FF005F0FACD8063D9F55878A03; the harness also verified the environment file was byte-identical and runtime timeout remained 10,000 ms. No temporary runtime override remains. The diagnostic record is ignored by Git. Scoring, config, BUILD_PACK, prompt/retrieval, output validation, policy and lockfile diffs remain empty against the pre-package baseline.

Verification before dispatch: three local harness tests PASS (exclusive reservation, single dispatch/timeout/late completion, successful completion and no retry on failure); focused script lint PASS; dry-run bounds/settings checks PASS. Existing full-gate and diagnosis tests remain historical evidence, not rerun for this one-off request. No generation beyond this attempt occurred. All changes remain unstaged/uncommitted. Both allowances are now exhausted; stop pending owner review. No M3 acceptance, deferred UX, M3.5 or M3.6 work.

## Offline follow-up on 2026-10-15

See [offline diagnosis](M3-OFFLINE-GENERATION-DIAGNOSIS.md). Rejected prose was not retained, so no exact missing-label/category attribution or excerpts are possible. No provider requests were made. Added safe context-field/category identifiers to future validation errors without changing acceptance rules. Offline verification: 77 focused tests, typecheck, focused lint and diff checks PASS. Verified legacy model GPT-5.2 and Appsmith generation timeout 100 seconds; provider defaults remain unknown. Prompt clarification and a 30-second operational provider deadline are proposals only; normal runtime remains 10 seconds and both call allowances remain exhausted. Protected-path statements above describe their historical checkpoints: this follow-up intentionally changes diagnostic metadata in validate-output.ts only, preserving its acceptance semantics.

## 2026-10-15 authorized prompt and operational-timeout correction

Implemented offline under explicit owner authorization; no provider request. Prompt version is now `legacy-runtime-v1-validated-transport-3`. The archived legacy template remains byte-for-byte unchanged. The trusted system instruction now requires exact summary-label wording/spacing/punctuation, applies assessed-category restrictions to BOTH recommendation related_categories and key_gaps.category, treats null as unassessed rather than zero, routes missing-data disclosures to grounding_notes, and makes five recommendations/three gaps maxima rather than quotas. Validation context supplies required_summary_labels, allowed_assessed_categories and unassessed_categories, derived from validated input/trusted scoring. A genuinely assessed zero-percent category remains eligible. Existing exact closing, incorrect-score rejection, citation membership, untrusted-data boundary and source limitations remain intact. No output repair or validator relaxation.

Operational provider configuration now defaults to and permits at most **30,000 ms**. Browser and existing smoke generation-client caps are **45,000 ms**. Status GET stays 15,000 ms; inbound body-read timeout stays 10,000 ms. The canonical policy JSON remains unchanged; the server composition applies validated provider settings to the service race, whose existing schema already permits 30 seconds. Cancellation still immediately aborts, and there are no automatic retries. The under-ten-second performance target remains separate and unmet by the prior 15-second sample. Thirty seconds is a bounded operational allowance, not evidence that the latency target is met.

**Configuration precedence:** readProviderConfiguration reads the effective process environment; an explicit RECOMMENDATION_TIMEOUT_MS wins over the new 30,000 ms fallback. The owner's existing app/.env.local explicitly sets 10000 and was not changed or printed. To activate the new deadline, replace ONLY that line with:

```dotenv
RECOMMENDATION_TIMEOUT_MS=30000
```

Restart the local server after the edit; rebuild first if using a production start so the prompt/code changes are included. If a launch environment defines the same variable, ensure it does not override the intended file value. Safe configuration status should report timeoutMs 30000 and the new prompt version; checking status does not generate. Changing this setting is not authorization to click Generate or rerun either exhausted runner. The six prior attempts remain historical evidence under the previous prompt/deadline; neither ledger is rewritten. The separate diagnostic runner remains an exhausted one-shot record, not a current runtime entry point.

Focused tests: **80 passed across six files** (prompt, validation, provider/service, client and smoke safety). Coverage proves configuration fallback versus explicit 10000/30000 and rejection above 30000; changed settings alter fingerprint; exact labels/category lists are supplied; zero differs from null; 45-second generation and 15-second status caps preserve caller abort. Existing legacy-template equality, context-masking score rejection and citation/category guards remain covered. Full offline `npm run verify` PASS on 2026-10-15: typecheck, lint, all 236 unit tests across 25 files (44.41 seconds), production build and all 55 Chromium browser tests (4.8 minutes). The first gate passed typecheck/lint but found three controller fixture failures: the controlled provider declared timeoutMs 10000 while safe configuration used the new 30000 default. Freshness validation correctly rejected that mismatch. The fixture was aligned to 30000; all five controller tests passed before rerunning the complete gate. No assertions or validation were weakened. Three separate diagnostic-harness safety tests also passed with local doubles. Logs: `%TEMP%/capstone-m3-prompt-timeout-verify.log` (pass), `%TEMP%/capstone-m3-prompt-timeout-verify-first.log` (retained first failure). Revised prompt effectiveness against a real model remains unverified; no call allowance is renewed.

Preservation/security checks: .env.local and both ledgers byte-identical; the existing explicit local timeout is still 10000 (checked without printing other environment values). Protected BUILD_PACK/canonical/domain/legacy-template/policy/lockfile paths unchanged; prompt assembly alone has the authorized instruction/context revision, with ranking/retrieval untouched. Changed-file secret-pattern scan: zero matches across 45 files at scan time; production client scan: zero key/provider-boundary matches across 15 chunks. These are scoped heuristic checks, not a deployment security approval. No dependency/lockfile changes; previously recorded dependency findings remain historical and no network audit was needed for this offline correction. Generated output and local evidence remain ignored. git diff --check passes; index empty. All work is uncommitted. No deferred milestones, external requests, staging or commits.

## 2026-10-15 corrected-prompt live attempt — separately authorized and consumed

The owner restarted the updated server with RECOMMENDATION_TIMEOUT_MS=30000 and authorized exactly one more synthetic Governance-only request, no retries, with a new separate budget up to $0.35. Safe GET to the running loopback server returned ready:true, timeoutMs 30000, promptVersion legacy-runtime-v1-validated-transport-3, gpt-5.4-mini / low / 4,000 tokens. The local composition matched the running server's configuration fingerprint and canonical/session versions. Preflight confirmed the conservative request reservation $0.324144 fits $0.35 (400,000 prompt-byte allowance + 8,192 framing allowance at $0.75/M, 4,000 output tokens at $4.50/M). Actual assembled prompt was 63,311 bytes; schema/framing allowance check used 2,744 bytes. No generation occurred during readiness/preflight.

Executed exactly once at **2026-10-15T07:05:54.679Z** (14:05:54.679 Bangkok). The isolated harness used the unchanged application recommendation service, provider adapter and validator, with the normal 30-second service race; it did not invoke the Results UI or change runtime configuration. Its transport wrapper retained only the bounded synthetic provider response body (up to 200,000 bytes), never credentials or request/response headers. There were no retries. This is application-service/provider timing, not an HTTP endpoint latency measurement.

| Metric | Result |
| --- | --- |
| Upstream status | HTTP 200 |
| Preparation including prompt | 9.7990 ms |
| Time to response headers | 8,631.2655 ms |
| Body read to EOF | 223.1232 ms |
| Provider phase | 8,864.2139 ms |
| Service total including validation | 8,937.7519 ms |
| Request / response bytes | 68,867 / 21,319 |
| Input / output tokens | 14,714 / 1,647 |
| Usage-based estimated charge | **$0.018447**; cache discounts ignored |
| Validation | **invalid_output / not_accepted** |
| Provider dispatch count | **1** |

The new reservation is separate from the exhausted prior allowances. Earlier reservations total $1.944864; adding $0.324144 gives cumulative reservations **$2.269008**, not an actual bill. The first five requests still have unknown usage/charges. Unused allowance does not authorize another attempt. This observed service time is under ten seconds, but the result was rejected; it is not a successful validated under-ten-second recommendation or a performance SLA.

### Precise retained violation

Only one issue was reported: `sme_context_missing` at `executive_summary`, `contextField: industry`.

Required exact label: **Manufacturing (Industrial / Components)**.

Relevant synthetic response excerpt: “...fits a 251 - 500 employee manufacturer in APAC selling to EU enterprise buyers.” The summary uses a semantic description rather than the required exact industry label. It includes the exact employee band and Investor readiness, and ends with the required raw 51.0% / industry-weighted 12.1% score sentence. No repair or relaxed match was applied.

The response contains two priority recommendations, each with related_categories [Governance], and one key_gap with category Governance. Missing-data disclosure is in grounding_notes: “Only Governance was answered in the scoring outputs; People, Community, and Resources were unassessed, so no weakness is inferred for those categories and no recommendations are created for them.” Thus the previous unanswered-category errors did not recur in this output. Other current checks reported no violations, but that does not establish semantic accuracy or citation entailment. Because the output failed validation, no recommendations/citations are presented as accepted advice or displayed in the normal Results UI.

### Retained local evidence and verification

- Separate permanent reservation/result: app/.local/live-corrected-prompt-2026-10-15.json.
- Retained synthetic provider body, including rejected text: app/.local/live-corrected-prompt-2026-10-15-response.txt (21,319 bytes, ignored by Git). Treat it as untrusted diagnostic evidence, not accepted content. No request headers or credential are retained.
- Both previous ledgers remain byte-identical; the owner's updated .env.local is also unchanged by this run. Scoring, prompt, retrieval, model settings, runtime and validation safeguards were not modified during the request.
- Five controlled harness tests passed before dispatch: bounded retention/header exclusion, malformed-response retention, exclusive reservation, timeout/late-completion handling and no retry. Focused harness lint passed. No runtime changes needed a new full gate; preserve the prior complete offline gate evidence.

All three allowances are now exhausted. Stop for human review. No further provider request, regeneration, weakening of exact labels, acceptance, deferred milestone work, staging or commit is authorized. The new one-shot runner refuses repeat execution if its permanent record or response file exists.

## Verification evidence

2026-10-15 diagnosis: focused OpenAI adapter/service/smoke checks PASS (45 tests across three files), including waiting-for-headers versus reading-body deadlines, propagated abort, immutable late-completion metrics and exact safe UTF-8 byte counts. Typecheck and lint PASS after correcting an initially caught timer-scope error. Golden matrix PASS (15 tests); 60 focused tests total. git diff --check PASS; protected-path diff remains empty for BUILD_PACK, canonical config, scoring, prompt/retrieval, output validation, policy and lockfile. Ledger hash unchanged and index empty. No live generation used for these checks. The prior full gate below remains historical evidence; this narrowly scoped diagnosis uses focused checks, not a new full-package acceptance claim.


Focused adapter/configuration, controller, smoke-safety and Results tests: 23 tests passed across four files. Existing service/config-failure coverage also passed (included in the initial 42 passing tests). An initial parallel focused run failed to start a jsdom worker within the test-runner worker deadline; the affected Results tests passed in the focused single-worker rerun without relaxed assertions or timeouts. A controller test exposed input-object property-order dependence; the shared identity serializer now parses the explicit request schema before sorting answer keys. No scoring or comparison tolerance changed.

The first full gate stopped at the existing 50-position navigator test's five-second deadline (226 tests passed, one timed out at 6.155 seconds under the default worker pool). Test assertions/deadlines were preserved; Vitest concurrency is now bounded to two workers to avoid measured Windows contention. The second gate passed typecheck, lint, all 227 unit tests across 24 files (40.80 seconds), and the production build, then exposed a browser-fixture import incompatibility: Playwright/Node required a JSON import attribute for the unit fixture's policy import. The browser transport fixture is now self-contained and explicitly test-only; runtime code and validation were not loosened. Focused browser checks then found Next normalizes the loopback Request.url hostname; the local-origin guard now compares the validated loopback Host header against Origin while retaining cross-origin rejection. All 15 focused adapter/boundary tests and all three focused recommendation browser tests passed after that fix (browser run 14.9 seconds). The next full run passed 52 browser tests and exposed three old assertions: one unscoped status locator now matched both score and recommendation status, and two still required fictional narrative. They now scope the scoring status and assert the truthful empty recommendation state plus disabled generation. All original score/trace/restoration assertions remain; all nine affected browser tests passed (51.8 seconds). Final `npm run verify` PASSED on 2026-10-14: typecheck, lint, 227 unit tests across 24 files (46.47 seconds), production build and all 55 Chromium browser tests (4.8 minutes), including Golden and trace regression coverage. The tested tree is the uncommitted working tree based on b056f0a; there is no new tested commit under the owner's no-commit instruction. Complete log: `%TEMP%/capstone-m3-live-verify.log`; prior failed-run logs are retained with first/import-failure/old-assertions suffixes. The generated desktop Results screenshot was visually inspected; scores, readable explanations, explicit disabled generation and truthful empty states retain the existing layout. Retain the existing M2 and foundation verification records as historical evidence.

Security/protected-path checks on 2026-10-14: production `npm audit --omit=dev --json` reports zero vulnerabilities. The full audit retains the four previously documented high development-only lint-chain entries (@next/eslint-plugin-next, fast-glob, micromatch, braces); no dependency or lockfile changes. Changed/new-file secret-pattern scan has zero matches; the production client chunks contain no OPENAI_API_KEY, provider endpoint or test-secret marker. These heuristic checks are not a guarantee against every secret format. `git diff --check` passes. Protected-path diff against b056f0a is empty for BUILD_PACK, canonical config, domain/scoring, score-request/summary, prompt assembly, output validator, recommendation policy/template, numeric-policy document and package-lock. Generated build/test output, .env.local and the future smoke ledger are ignored. The index is empty; all scoped changes remain unstaged.

## Preserved limitations and deviations

- The preserved runtime prompt semantics, native ranking, 8/18 selection and `capstone-doc-005` exclusion are unchanged. Transport schema constraints supplement existing validation; they do not replace it.
- Country/revenue-band remain omitted and disclosed. Notes retain the 1,000-character policy and are untrusted context, never scoring inputs.
- Exact summary wording/context labels can reject legitimate paraphrases. Percentage presence in supplied answers/excerpts does not prove semantic accuracy or citation entailment. Context-label masking still must reject incorrect generated scores. Real-provider failures must be recorded, not repaired by widening validation.
- Source binary editions, page accuracy and external accessibility remain unverified; stable IDs and citation membership do not certify evidence. Manufacturing's missing historical weighted breakdown, accepted M2 numeric differences and historical Consumer Goods AI prose discrepancy remain unchanged.
- The active UI now truthfully withholds narrative until validated generation; deterministic gap labels are calculated comparisons, not AI advice or a readiness rating. Navigation and technical-JSON presentation remain as before.
- `store:false` does not grant Zero Data Retention or confidential-data approval. Public use remains blocked pending a separate deployment/security/privacy/cost-control gate.

## Human walkthrough and next gate

The original five-attempt smoke allowance is now exhausted. Do not generate again without new explicit authorization. The separately approved diagnostic above has also been consumed and failed application validation. Review these results; no further generation is authorized. Confirm notes/answer edits remove stale advice, scores remain available during AI failure, and refresh makes no paid call.

The owner handles staging/commits/pushes. New live integration and limited M3.4 acceptance remain pending. Stop at this package; do not begin deferred navigation, reports or retrieval experiments.

## Owner acceptance and one-shot v4 browser walkthrough — 2026-10-15

The owner accepted the offline context-contract correction as reviewed, not all of M3. GPT-5.2 comparison and its harness are deferred to M3.6; the former $1.10 proposal is not active authorization. Configured model remains gpt-5.4-mini.

Exactly one separately authorized synthetic request was dispatched through the application's actual Generate recommendations button in a fresh Playwright browser context. The owner's port-3000 server reported v3; it was left untouched. The existing verified v4 production build ran temporarily on loopback port 3002 with bounded local provider-body capture and an exclusive one-dispatch lock. Readiness confirmed v4, gpt-5.4-mini, low reasoning, 4000 output tokens, 30000ms provider and 45000ms generation-client caps. No runtime source, model configuration or .env.local was changed. Prior assessments/browser storage were untouched.

Before dispatch, the conservative $0.324144 reservation fit the new $0.35 ceiling. No retry or regeneration occurred. Separate evidence: app/.local/live-v4-browser-attempt.json; application response: live-v4-browser-application-response.json; original provider body: live-v4-browser-provider-response.txt (17956 bytes). Files contain synthetic evidence only; no request headers/credentials were recorded. Prior ledgers and retained response hashes are unchanged. Cumulative reservations across all eight attempts: $2.593152; reservations are not actual cumulative billing because the first five failures lack usage.

Result: HTTP 200, available, all application checks passed. Preparation 115.064ms; provider headers 6886.532ms; body completion 46.054ms; total provider 6945.670ms; service total 7082.010ms; browser click-to-complete 7474.145ms. Usage: 14691 input / 1173 output tokens. Estimated cost: $0.01629675 at the verified $0.75/$4.50 per-million rates. One observation meets the under-ten-second target; it does not establish p95 or general reliability.

Visible walkthrough: one Governance recommendation, one Governance gap, authoritative Manufacturing / 251 - 500 / Investor readiness context, and all three citation tuples displayed. Recommendation: Publish a written environmental policy and assign ownership. It proposes a practical policy, responsible leader, annual review and data-quality process. Sources are Industrial Machinery & Goods Sustainability Accounting Standard (Activity Metrics p.6) and Chemicals (Safety & Environmental Stewardship pp.29-30; Operational Safety pp.34-35). Membership checks pass; claim-to-excerpt support remains a human-review limitation. No source links were opened to claim independent verification.

Notes-only followup used the actual setup textarea, Continue to input method, Start questionnaire, then Results. Answers and all other profile fields were unchanged; scores remained 51.0 raw / 12.1 weighted; previous advice was absent and Generate was available. All generation POSTs were blocked in followup; none were attempted. Existing navigation clears non-persisted advice as well, so this live walkthrough alone does not isolate notes identity invalidation from navigation clearing. Six focused offline controller tests passed, including notes-only invalidation of displayed output. Initial walkthrough harness mistakes (returning from incomplete setup and comparing innerText with textContent) were corrected without application changes or paid retries.

Screenshots retained locally: live-v4-browser-accepted.png and live-v4-browser-notes-edited.png. Earlier full offline gate remains valid: typecheck/lint/build, 240 unit tests and 55 browser tests passed. No runtime edits were made in this walkthrough package. All changes remain unstaged/uncommitted. M3 acceptance, deployment and merge remain pending.

## Local Results failure diagnosis — 2026-10-16

Owner paused live verification; no provider calls authorized or made. Reproduced in a fresh isolated Chromium context on port 3000 using synthetic Manufacturing / 251 - 500 / Investor readiness, only U-001=No and U-002=Yes. Generate score anyway reached the existing calculation boundary; View calculated results then failed. Captured actual exception before changes: `ChunkLoadError: Failed to load chunk /_next/static/chunks/2anb62sazz0_d.js from module 64893`. Browser console recorded three resource 404 errors for this chunk. Reload showed the server-rendered Results shell without working calculations. Session restoration still contained both original answers, profile and boundary phase.

Cause: stale production process using a replaced build directory. PID 20720 started on 2026-10-15 at 14:02 Bangkok time, before the verified build written around 15:09. Its readiness still returned prompt v3. The requested chunk existed on disk (24169 bytes, written 15:09:20), but the old process returned 404. This is a server/build asset mismatch, not evidence of an incognito/session/scoring defect. Earlier offline verification rebuilt the same .next directory while this production server remained alive.

Old production stdout could not be recovered: no app terminal was attached and no matching production log was available. The existing development log belonged to a different run and was not treated as this incident's server exception. Direct browser exception, failed HTTP responses, process/build timestamps and readiness were captured instead. Restart output was captured to app/.local/ui-failure-restarted-server.log; it contains clean startup and no exception during reproduction.

Fix: stop only the identified stale Next process and restart the unchanged, already-verified build on the same 127.0.0.1:3000 address. No rebuild, cache deletion, runtime code edit, configuration change, browser-storage clearing or scoring workaround. Restarted server reports v4 and remains available for the owner.

Verification: repeated identical Generate score anyway / View calculated results transition and reload. Both show 51.0 raw, 12.1 weighted, 2 answered / 55 unanswered, with original answers intact. Zero page exceptions, console errors, HTTP error responses or recommendation-generation attempts. Generation POSTs were blocked by the isolated diagnostic browser. Prior live ledgers remain unchanged. No full verification rebuild was necessary for this operational correction; the existing offline gate evidence is retained.

Evidence (ignored local files): ui-failure-3000.json/png before restart; ui-failure-after-restart-3000.json/png after restart; ui-failure-restarted-server.log. Initial restart was safely aborted by an incorrect diagnostic assumption that the chunk must be absent on disk; after verifying the asset existed but was served as 404, only the confirmed process was restarted. No source changes were made to conceal the error.

Prevention: stop any next start process serving this app before npm run build or npm run verify replaces .next; restart after the build/gate completes. Do not run production servers against a directory being rebuilt. Use npm run dev for ordinary source iteration. After a build restart, reload the existing assessment tab (do not clear session storage) and verify the safe readiness contract before any separately authorized generation. This incident does not authorize design/navigation changes or additional paid calls.


### GROUNDING-001 — open, 2026-10-16
The reported whistleblower/grievance recommendation is not directly supported by the cited Chemicals Operational Safety excerpts (pp.34–35 / p.35). Citation membership does not establish claim-level support. The latest manual response is not retained, so a complete tuple/claim audit remains unavailable. Recommendation quality is NOT accepted. Preserve this defect for M3.6 grounding evaluation; no new generation, prompt/retrieval changes or fabricated evidence in this UI closeout.


## Hosted shared daily budget and deployment verification — 2026-10-19
Owner authorized US$1 per day across all public visitors, changing at midnight Asia/Bangkok, with deployment-test accounting separate. Implemented a host-persisted ledger, exclusive cross-process lock, atomic writes, integer-nanodollar comparison, conservative pre-dispatch US$0.324144 reservation and settlement from reported input/output token usage. Unknown usage retains the reservation. No visitor API-key input. All existing ledger histories are preserved. A native accessible modal displays the exact owner-approved text; focus returns to generation, and matching existing recommendations, deterministic scores and downloadable reports remain available. Credential reuse was explicitly confirmed safe by the owner; secure transfer completed without changing local .env.local or exposing its value.

Deployed normal application release `mosaic-cb95e176f427805cb4d0`, image `sha256:de74aad8caee3757f2310762dfc6441102644daa328d10d488146dfaefe8a795`, at https://preview.flowagentai.website. Host budget directory `/opt/mosaic-app/budget` is bind-mounted at `/budget`; ledger files mode0600. Effective runtime public budget=1. Public and verification files are distinct. No old-host changes, commits or pushes. Previous images retained. The egress iptables rules are runtime controls; persistence across host reboot has not been established by this package and is not claimed.

Verification: 263 unit tests passed, including Bangkok midnight, concurrent separate-process reservation, persistence, settlement, unknown usage and independent test/public accounting. Typecheck/lint/build passed. Full offline browser run:68 passed/5 failed; the five failures were then fixed and all five passed in a rebuilt focused rerun (38.5s). Failures were two ambiguous selectors after stage navigation, two report-download cases caused by extra fields sent to the strict scoring request schema, and modal focus restoration. No assertions/tolerances were weakened. Production dependency audit:0 vulnerabilities; scoped credential-pattern scan:0 findings; deployment shell LF confirmed; BUILD_PACK and canonical config unchanged. Hosted readiness/modal/keyboard/scores/report check passed without a provider call. Initial hosted readiness correctly exposed a Next.js internal request-URL mismatch; the corrected boundary checks the configured public Host and browser Origin, retains forwarding/cross-site rejection, and passed focused tests plus hosted readiness. All five Golden inputs have exactly matching local/hosted API projections, including complete traces; endpoint round trips381–464ms. This does not reconstruct missing historical inputs for SCORE-COMPARISON-001.

One separately authorized synthetic deployment generation was executed, no retry. Server reservation US$0.324144 of the separate two-request/US$1 allowance; public ledger remains0 records and its full US$1 is available. Provider HTTP200, application HTTP503 `invalid_output`, single violation `evidence_limitation_missing` at `grounding_notes`. Headers11896.13ms, body35.90ms, provider11939.52ms, local preparation73.67ms, service total12022.50ms, browser elapsed14179ms. Usage14782 input /1864 output tokens; standard-price estimate US$0.0194745 (cached discounts not credited). Under-ten-second target not met;30-second deadline respected. Rejected advice was not displayed. No further generation was attempted.

The retained API diagnostic contains metrics/issues/assessment/evidence identity, but the application intentionally excludes rejected provider text; therefore the generated grounding_notes excerpt is not retained. The existing validator requires the literal phrase `unverified` or `not independently verified`. Without the raw text, this result cannot distinguish absent disclosure from a legitimate paraphrase. Safeguards were not weakened, no exact excerpt invented, and no successful live recommendation claimed. One deployment-test request remains under the original allowance; it has not been automatically reused/reset. This is an unresolved live-validation issue, not M3 acceptance. GROUNDING-001 has a targeted actual-source regression guard and prompt instruction; broader claim-to-source support and recommendation quality remain unaccepted. Historical score comparison and evidence limitations remain open.


## Hosted v6 fixed-disclosure correction — verified 2026-10-19
The v5 rejection was the literal phrase gate `unverified|not independently verified` on grounding_notes. It represents fixed application verification limitations, not a response-specific substantive finding. The retained v5 API diagnostic contains no rejected prose, so exact replay was impossible; no text was reconstructed and no extra call used to recover it. Existing approved checks were reused. The unchanged substantive checks still validate authoritative scores, structure, citation identities, assessed categories, bounded inference and the targeted unsupported-whistleblower citation case.

`EVIDENCE_DISCLOSURE` now supplies fixed text to Results and the saved report independently of model output. Model grounding_notes remain required for assessment/advice-specific limitations. Contract6 invalidates older advice through existing freshness checks; the archived template and retrieval/scoring/config are unchanged. The existing round-trip test now omits boilerplate, and its obsolete literal-rejection mutation was removed as the authorized contract change; no new tests/harnesses/fixtures were added during this correction.

Verification:46 saved focused tests passed; typecheck/lint and the actual deployed production build passed. Saved non-generating hosted readiness/budget-modal/report check passed. The ONE remaining authorized live request passedHTTP200 and application validation: service7696.70ms, browser9919ms; headers7531.90ms/body107.06ms; input14808/output1821 tokens; standard-price estimate$0.0193005. Real recommendations displayed, source dialog opened, report downloaded, and notes-only editing invalidated advice while scores remained51.0 raw/12.1 weighted; exactly one generation POST. Both test ledger records are retained, total reservation$0.648288 and estimated usage cost$0.038775. Public ledger0 records. No retries or further paid tests authorized.

Retained local artifacts: `.local/hosted-live-response-v6.json`, `.local/hosted-m3-report.html`, `.local/disclosure-live-check.log`, and the saved accepted Results screenshot. The original v5 diagnostic remains separately intact. The report was inspected for the fixed disclosure, separate assessment-specific notes, context, answers/question scores and current scores; HTML is the plan-authorized durable format and supports browser Print→Save as PDF.

Deployment: https://preview.flowagentai.website; source content revision `mosaic-34c4bd0708919cc4af97`; image `sha256:3332b78081ca3f763992b7f6d15cf3715cdadfaa76e1239da0ceeecf50871e20`. Previous image `sha256:de74aad8caee3757f2310762dfc6441102644daa328d10d488146dfaefe8a795` retained, alongside `.previous` deployment configuration. Repeatable command from repository root: `node app/scripts/deploy.mjs --key=C:\Users\guyli\.ssh\mosaic_preview_ed25519`. Preserve credential and budget files during rollback; never reset ledgers. Runtime egress-rule persistence across host reboot remains unverified; no restart experiment performed.

Requirement reconciliation and final manual acceptance steps are in EXECUTION_PLAN.md. Current accepted response makes bounded practical governance suggestions; cited operational standards support disclosure topics, not proof that those governance processes are mandated. General claim entailment, page/source accessibility and recommendation quality remain human-review matters. Historical unmatched score screenshots remain unexplained; current five-case full-trace parity is verified. Research experiments remain deferred. Implementation/automated verification ready for review; M3 human acceptance pending. No commit, push, merge or M4 implementation.
