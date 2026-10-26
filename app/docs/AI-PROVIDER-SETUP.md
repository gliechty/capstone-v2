# AI provider setup and Columbia credential handoff

> Current contract (owner scope correction): legacy-runtime-v1-validated-transport-4. Literal summary labels are no longer required; authoritative setup context appears separately in Results. Numeric/reference/category safeguards remain. Retained response passes offline replay only; no new live generation or M3 acceptance. See [migration baseline review](M3-MIGRATION-BASELINE-REVIEW.md). Prior version-3 sections are historical evidence. Offline correction gate: typecheck, lint, 240 unit tests, build and 55 browser tests PASS; 69 focused tests PASS. The linked review records the unchanged-response replay and pending two-request comparison proposal ($1.10 new ceiling). No live request is authorized by these documents; previous allowances remain exhausted. Keep the configured model and .env.local unchanged.

> 2026-10-15: the five-attempt live smoke allowance is exhausted (0/5, all timeouts). Do not rerun generation or reset the ledger. The separately authorized sixth diagnostic has also been consumed: HTTP 200 at ~15 seconds, rejected by application validation. See M3-LIVE-AI-REVIEW.md; no further call is authorized. The commands below document the original setup, not renewed authorization.

Status: local-only implementation. Live verification is pending; no key was present at the 2026-10-14 configuration check. Ordinary verification is offline. This is not a public-deployment guide.

## Runtime configuration

From the repository root, work in `app`. Edit the ignored `app/.env.local` locally using your editor; create it only if absent, and preserve any existing values. Never paste a key into chat or commit it. `.env.example` contains names and placeholders only. Set:

```dotenv
RECOMMENDATION_PROVIDER=openai
RECOMMENDATION_MODEL=gpt-5.4-mini
RECOMMENDATION_REASONING=low
RECOMMENDATION_TIMEOUT_MS=30000
RECOMMENDATION_MAX_OUTPUT_TOKENS=4000
OPENAI_API_KEY=<enter your funded project key locally>
```

The existing local file is not automatically updated by code defaults. If it currently says `RECOMMENDATION_TIMEOUT_MS=10000`, replace ONLY that line with `RECOMMENDATION_TIMEOUT_MS=30000`; do not replace the entire file or expose its key. Explicit effective environment settings take precedence over the default. Restart the updated server; rebuild before production start. Safe status should show timeoutMs 30000 and promptVersion legacy-runtime-v1-validated-transport-4. No generation is authorized by this configuration edit.

Generation-client caps are 45 seconds, provider maximum/default 30 seconds, request-body read 10 seconds and safe status GET 15 seconds. Client cancellation stops waiting immediately; provider cancellation/billing outcome is not confirmed by that action. The under-ten-second performance target is separate from these hard failure caps and is not yet achieved. Scoring remains available during provider failure.

The explicit provider and model are required. Missing credentials or invalid settings disable generation without affecting builds or scores. Supported reviewed model identifiers are `gpt-5.4-mini` and its `gpt-5.4-mini-2026-03-17` snapshot; no substitute is selected. Supported reasoning values: none, low, medium, high, xhigh. The smoke baseline specifically requires the approved alias and low reasoning. Timeout defaults to 30,000 ms and must be an integer from 1 to 30,000 ms; output bound 1–8,000 tokens (initial 4,000). Output tokens include reasoning; a bounded request can finish incomplete and still incur cost. There are no automatic retries.

Runtime configuration is read on each server operation, not bundled into client code. Next loads environment files when the server starts: existing process environment takes precedence, then `.env.$NODE_ENV.local`, `.env.local` (except test mode), `.env.$NODE_ENV`, `.env`. The first defined value wins. Restart after editing environment files; editing `.env.local` does not replace an already-loaded process value. Hosting must inject the same names through its environment or secret manager, with no source-code changes. Never use `NEXT_PUBLIC_` for any of these values. There is no personal-key fallback.

## Build, local startup and safe check

PowerShell, repository root:

```powershell
Set-Location C:\Users\guyli\Desktop\2.0_BUILD_PACK\app
npm.cmd run verify
npm.cmd run start -- --hostname 127.0.0.1 --port 3000
```

`verify` includes the production build and offline unit/browser tests. If only rebuilding after a source change, use `npm.cmd run build`, then the same `start` command. Stop a running server with Ctrl+C before restarting. Credential changes require a restart but no source edit or rebuild. Keep the server bound to loopback; do not expose it through a tunnel, reverse proxy or public listener.

In a second terminal:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/assessment-recommendations
```

This GET performs no provider request and returns only safe readiness, approved settings and version identities. `ready: true` confirms local configuration parsing and key presence, not funded quota, authorization or provider health. No credential value, hash or provider error body is returned. If `code` is `offline_tests`, check whether a parent process exported `CAPSTONE_OFFLINE_TESTS=1`; never remove that fence from ordinary test configurations.

## Bounded synthetic live smoke

Pricing checked 2026-10-14 against the [official model page](https://developers.openai.com/api/docs/models/gpt-5.4-mini): standard input $0.75 / million tokens, output $4.50 / million. Cached-input discounts are ignored conservatively. No tools, regional routing, background mode or premium service tier are requested. The runner refuses its pricing record after seven days; recheck official prices and review the cost bound before changing that record.

With the explicitly configured loopback server running:

```powershell
npm.cmd run smoke:recommendations -- --confirm-synthetic-budget
```

Optional port override: append `--url=http://127.0.0.1:3000`. The runner sends only five synthetic manufacturing profiles with simple yes/no answers and different notes; it imports no archived SME fixtures. The server retrieves canonical excerpts using the unchanged ranker. At most FIVE automated generation attempts across invocations are allowed, including failed, timed-out or interrupted attempts. A process lock and durable ignored `app/.local/live-smoke-ledger.json` reserve each attempt before sending. Do not delete/reset the ledger or an interrupted lock to obtain more attempts; preserve and review them first. The local API additionally permits one active generation and five accepted attempts per minute per process. This is not an account-wide provider spending limit.

Each attempt conservatively reserves `(400,000 prompt bytes + 8,192 schema/framing tokens) × $0.75/M + output bound × $4.50/M`, treating every UTF-8 byte as a token. Default bound: $0.324144 per attempt / $1.62072 for five; maximum configurable output bound: $0.342144 / $1.71072. Reservations are never refunded to enable extra attempts. Reported usage yields a separate estimated actual cost when available; failures without usage retain the full reservation estimate. The runner refuses reservations exceeding US$2. Provider invoices remain authoritative; this is a conservative estimate, not billing control.

Rows record case ID, model/reasoning/bounds, outcome, validation status, timing, available usage and estimated cost. They omit prompts, SME answers, generated prose, credentials and raw provider errors. Inspect the ledger locally after the run. It is preliminary evidence, not M3.6 acceptance or proof of an under-ten-second target. If any case fails validation, preserve the failure; do not loosen scoring/citation checks to obtain a pass.

## Short real-output walkthrough (after activation)

1. Enter a synthetic business and optional notes. Answer questions and review. **Generate score and recommendations** explicitly requests both; confirm partial assessment when applicable. This action may incur provider charges when configured.
2. Scores appear first and independently. The executive summary is directly below with generation status. The one-use Review handoff starts one recommendation attempt; direct opening or refresh does not grant generation consent.
3. No second Results click is needed for the Review action. Loading exposes **Cancel generation**; duplicate clicks are disabled. Gaps/actions/evidence start collapsed. Refresh or navigation during generation shows an interrupted state and explicit **Retry recommendations** when its result cannot be recovered. Provider outcome is unknown; retry requests new work and may incur another charge. Failures leave scores available.
4. Review exact displayed score restatements and source links. Structural/reference validation does not certify factual entailment or source pages.
5. Return to assessment, edit only notes and return to Results. Scores remain unchanged; advice must be regenerated explicitly. Answer/context changes also invalidate advice. Refresh clears advice rather than storing generated material as current.

Manual generation also costs money; the five-attempt smoke allowance is for the separately invoked automated runner, not permission for an agent to generate unlimited manual requests.

## Columbia handoff, disabling and retention

Columbia supplies a key from its own funded project in the same server-only variable. Replace development credentials locally/in the deployment secret store, remove any higher-precedence process value, restart, run the safe GET check, then perform only a separately authorized generation. Revoke the old key in its owning project when appropriate; the application does not manage billing or credentials. No developer key is copied into source, reports or browser storage.

To disable generation, set `RECOMMENDATION_PROVIDER=disabled` and restart. Remove the key from the runtime environment if it is no longer needed. Deterministic assessment remains functional.

Requests use `store:false`, which avoids Responses application-state storage. This is not Zero Data Retention: standard abuse-monitoring retention and other provider policy exceptions may still apply. See [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data). Do not send confidential SME data on the basis of synthetic-test authorization. Production deployment requires separate authorization, authentication/entitlement and durable abuse/spend controls, privacy/retention decisions and the deployment security gate.


Latest live status (2026-10-15): the owner activated 30000 ms and the version-3 prompt was confirmed through safe GET. A separately authorized seventh request under a new $0.35 allowance ran exactly once and failed only the exact industry-label check. Its response is retained locally for diagnosis. All allowances are exhausted; no further generation is authorized. See M3-LIVE-AI-REVIEW.md.

Current owner status 2026-10-15: offline v4 correction accepted; one separately authorized live browser request passed. Its allowance is consumed. GPT-5.2 comparison/harness deferred to M3.6. The owner's existing port-3000 process still reported v3 during this check; restart the normal application to load v4 before a future authorized run. Temporary port-3002 verification did not edit .env.local or switch the model. See M3-LIVE-AI-REVIEW.md for timing, retained synthetic evidence and notes walkthrough.

### Avoid stale local build assets
Stop the app's next start server before npm run build or npm run verify (which replaces .next). Restart it after completion, then reload the existing browser tab without clearing assessment storage. Serving an old process against a new build caused the 2026-10-16 Results chunk 404; restarting fixed it without code changes. Port 3000 now serves v4. Use npm run dev for ordinary source iteration. No provider generation is authorized by a restart.

### Results visual review update — 2026-10-16
The same Results route now shows a compact actual context strip, secondary Regenerate action, source dialogs per insight, and technical/provider information behind accessible disclosures. Evidence is grouped by document without changing original page/section strings. Review unanswered items uses the existing assessment reducer. No provider/prompt/retrieval/scoring setting changed. See M3-RESULTS-VISUAL-CORRECTION-REVIEW.md; no new provider allowance or milestone acceptance is implied.
