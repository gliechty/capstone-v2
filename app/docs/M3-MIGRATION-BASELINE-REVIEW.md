# M3 migration baseline — context contract correction

Date: 2026-10-15. Owner-authorized M3.1/M3.3 correction and minimal existing Results integration. No provider requests, configured-model change, environment-file edit, deployment, staging or commit. M3 remains unaccepted; live-call allowances remain exhausted.

## Revised acceptance contract

The shared prompt/validation contract identity is now **legacy-runtime-v1-validated-transport-4**. This existing identity is included in server configuration fingerprints, result identity and client freshness checks. A version-3 result is stale under version 4 even when input and provider settings match; refresh also clears previously displayed advice after a contract change. This is an intentional human-authorized acceptance change, not an attempt to disguise the earlier rejected live outcome.

Literal industry, employee-band and business-goal repetition is no longer an acceptance requirement. The substring checks and exact-label instruction/data map were removed. No classifier, extra model call, paraphrase dictionary or prose rewriting replaces them. Context still enters the preserved SME prompt section and the model is instructed to tailor recommendations. Existing numeric checks still mask supplied context labels when present so numeric context does not become a false score claim; that is not a context acceptance rule.

The existing Results summary now displays Industry, Employee band and Business goal directly from the validated current assessment setup alongside deterministic results, clearly labeled as setup values rather than generated advice. The existing score-refresh lifecycle supplies this context, clears stale content and rereads it on session edits/restoration. The change does not redesign navigation or implement deferred UX. It does not silently modify model prose.

Unchanged protections: authoritative server-side scoring, exact numeric score closing and other numeric checks; strict response structure and bounded failure handling; citation tuple membership; assessed-category restrictions on recommendations/key gaps; unassessed disclosures in grounding_notes; duplicate suppression, cancellation and stale-response protection; server-only credentials and explicit generation. Provider deadline remains 30 seconds; generation-client caps remain 45 seconds. Under ten seconds is a performance target, not a hard rejection rule.

What passing proves: supported structure, checks against authoritative score values, references belonging to supplied citation tuples, eligible structured categories and current input/configuration identity. It does **not** prove semantic tailoring, factual accuracy, claim-to-excerpt entailment, edition/page accuracy, external source accessibility or legacy parity. General prose quality is not newly made a migration blocker.

## Offline retained-response replay

Source: app/.local/live-corrected-prompt-2026-10-15-response.txt. SHA-256: **7aa4e90a4a1d8ab6d97696f62b0b2f8d22b60b01851a83fff76de95acc643a36**.

Replay command from app: `node scripts/replay-retained-recommendations.mjs`. The harness prohibits fetch, loads no credentials or provider adapter, reconstructs syntheticCase(0) with the canonical catalog, recomputes scores and verifies deep equality against the original recorded assessment. Ranked document IDs, chunk IDs, usable chunk IDs and limitations must exactly equal the original evidence record before validation. It then validates the unmodified assistant text with the revised validator. Original body bytes are hashed before/after; parsed accepted content must equal the retained JSON content, without injected labels.

**Result: PASS offline.** Original version-3 live rejection was one sme_context_missing industry issue. Removing that requirement resolves the rejection; the same two recommendations and one gap pass all remaining checks. Replay record: app/.local/retained-response-replay-v4.json, explicitly labeled offline-replay-not-new-generation. Original live records remain unchanged and continue to record their historical rejection. No fresh provider latency/usage, new live success or M3 acceptance is claimed. The replay is not loaded into the owner's current assessment, session storage or Results UI.

Focused tests cover omitted/paraphrased labels, continued failure on wrong scores/unknown citations/unanswered categories, no prose insertion, old-contract rejection and displayed-result invalidation. Browser checks cover setup-derived context at desktop/mobile and refresh after business-goal edits. The existing static legacy-template equality test remains. An initial focused omission case exposed existing whitespace trimming in the schema; the constructed test string was trimmed before asserting unchanged prose. The validator's existing normalization was not changed.

## Legacy comparison boundary

Use the existing archived diagnosis: Appsmith selected GPT-5.2, the caller allowed 100 seconds, and reasoning/output-token/provider-timeout settings were unspecified. These omissions prevent an exact historical reconstruction. No new archive research or invented default fills them. The v2 system instructions, runtime validation and canonical full-precision scoring intentionally differ from the archive. Matching a model name alone would not establish parity.

### Proposed next live check (not authorized or implemented)

After new authorization, run two sequential one-shot requests: gpt-5.4-mini and gpt-5.2, with identical Governance-only synthetic input, version-4 prompt, evidence, schema and validator. The retained response used version 3; comparing only a new GPT-5.2 call against it would confound prompt and model changes.

Official compatibility/pricing checked 2026-10-15: [GPT-5.2](https://developers.openai.com/api/docs/models/gpt-5.2) supports Responses, Structured Outputs and low reasoning; standard uncached input/output prices are $1.75/$14 per million tokens. [GPT-5.4-mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) prices are $0.75/$4.50 per million input/output tokens.

Proposed settings: low reasoning, max_output_tokens 4000, non-streaming Responses, store:false, unchanged schema and validation, no tools/retries/fallback generation. Keep 30-second provider and 45-second client/watchdog caps with immediate cancellation. Under ten seconds remains the target. Record model identity, header/body/total timing, validation, usage and estimated cost. Retain synthetic output locally even if rejected, excluding credentials/headers; rejected output stays outside Results.

Conservative reservations using the existing byte-as-token bound plus framing allowance: (400000 + 8192) input tokens and 4000 output tokens. GPT-5.4-mini: **$0.324144**; GPT-5.2: **$0.770336**; total **$1.094480**. Proposed new authorization ceiling: **$1.10**. These estimates are not expected charges or invoice guarantees; preflight must check actual prompt/framing and context limits before dispatch. No cached-input discount assumed. Preserve exhausted ledgers and record the pair separately. Never refund reservations to enable retries. Stop after at most two attempts, or earlier on a blocking configuration/authorization failure.

Execution requires a narrowly scoped comparison harness/model-identity allowlist change after authorization; neither is implemented here. Do not switch the configured application model or edit .env.local. These selected controls are a modern comparison, not recovered historical defaults. Archived reasoning/output/provider timeout remain unknown; Appsmith allowed 100 seconds.

Human review should compare usability, score fidelity, category eligibility, cited claims and timing. A single pair cannot establish model superiority, latency distributions or Appsmith parity. Broader prose-quality, claim-to-source grounding, model selection and latency evaluation remain under M3.6; no experiments have started.

## Verification

- Offline replay: PASS with unchanged retained response and original matching synthetic scores/evidence.
- Focused tests: 69 passed across prompt, validation, controller and service suites.
- Full offline gate: CAPSTONE_OFFLINE_TESTS=1 npm --prefix app run verify — exit 0. Typecheck, lint, 240 unit tests across 25 files (including Golden/trace coverage), production build and 55 browser tests passed. Browser suite took 4.9 minutes. Generation disabled throughout verification.
- An initial gate run exposed a new test's shared citation-fixture mutation; cloning each candidate fixed isolation. No production safeguard or tolerance was weakened. The complete gate then passed.
- Mobile Results screenshot reviewed: context fits the existing layout separately from generated content. Desktop/mobile and refresh-after-context-edit checks pass.
- Changed-source secret scan and built-client provider-boundary scan: no matches. git diff --check passes; staging index empty; local evidence/build/browser outputs ignored.
- BUILD_PACK, deterministic domain/configuration, numeric policy, retrieval, archived prompt and dependency lockfile unchanged. Original ledgers and retained response hashes unchanged. No provider generation, environment edit, model switch, deployment or M3 acceptance. Everything unstaged/uncommitted.

Remaining limitations: existing percentage/numeric prose recognition limits, absent country/revenue-band metadata, historical source/page evidence limitations, and lack of semantic claim-to-source proof. Citation membership is not entailment. Live version-4 validation and human recommendation review await new authorization.

## Subsequent owner decision — 2026-10-15
Offline context-contract correction accepted. The proposed GPT-5.2 comparison and harness are deferred to M3.6. One separately authorized v4 browser request passed; see [live walkthrough evidence](M3-LIVE-AI-REVIEW.md#owner-acceptance-and-one-shot-v4-browser-walkthrough--2026-10-15). All M3 remains open. No additional generation allowance remains.
