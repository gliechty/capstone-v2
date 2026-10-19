# codex.prompting.memory.md
Updated: 2026-10-19. Owner-approved workflow correction; no runtime changes.

## Purpose and lessons
Deliver a working maintainable MOSAIC app with minimal owner coordination. This records corrected practice, not a claim that earlier PM work followed it.
- Preserve deterministic formulas/config and accepted behavior.
- Finish the authorized outcome before optional optimization, research or infrastructure.
- The Oct 16–19 synthetic preview detour was a scope failure. Tests and simulation do not replace real product functionality.
- Do not require new credentials merely because a new host is used; establish exposure history first.
- Test counts are coverage evidence, not proof of usable design or supported recommendations.
- Reuse instructions/results where still valid. No repeated whole-repository reviews, full gates or prose-heavy handoffs without a concrete reason.
- New UI synthetic fixtures/demonstrations always need owner approval. Previously approved automated test data can remain in the saved regression suite; never ship it as real recommendations.
- Prefer editing these controls and the existing execution ledger to creating documents.

## Approved verification register
Snapshot inspected from published checkpoint 026fb85 on 2026-10-19. Today's uncommitted local additions are not visible to PM and are not silently preapproved. Explicitly requested current M3 checks can be recorded with their owner authorization before execution.
Existing files are grandfathered regression coverage, not authority to add new tests. File presence alone does not grant approval.

Commands below run from app/:
| Command | Purpose | When warranted |
|---|---|---|
| npm run typecheck | TypeScript application/domain compatibility | Relevant TS/interface changes; final candidate |
| npm run lint | Existing ESLint correctness, hooks, accessibility and boundary rules | Affected source/config; final candidate |
| npm run test | Existing Vitest unit/component/Golden suite | Affected saved files during changes; full final candidate |
| npm run test:golden | Saved golden-matrix and trace subset | Scoring/config changes; do not duplicate when full unit suite already covered unchanged code |
| npm run build | Production compilation/packaging | Deployable final candidate; build-sensitive changes |
| npm run test:e2e | Existing Playwright Chromium browser suite | Affected saved journeys; final candidate |
| npm run verify | typecheck -> lint -> unit -> build -> Playwright | One final code candidate; not every edit or docs-only work |
| npm run measure:scoring | Saved deterministic scoring timing harness | Approved performance investigation; not routine |
| npm run smoke:recommendations | Real paid provider smoke harness | Explicit bounded call/data/budget authorization only; never routine gate |
| git diff --check | Whitespace/conflict sanity | Final changed diff |
| npm audit --omit=dev | Production dependency advisory check | Dependency changes or release; no automatic fixes |

Browser tests and Playwright are the SAME suite. Axe accessibility checks are embedded in existing browser tests, not an extra independent suite. Golden checks also occur inside the unit suite.
Published Playwright config: Chromium, 1 worker, localhost:3100, offline mode; retries 0 locally / 1 in CI. Vitest uses offline setup and max 2 workers. No GitHub Actions workflow was found in the inspected tree; do not claim a CI run.
Historical private-preview verification (six tests and separate build) does not belong to the normal deployment gate; do not repeat or expand it absent owner approval.
Ad hoc secret scans, new benchmark loops, copied smoke suites or new scripts must have a recorded command and approval; preserve existing secret-handling rules without printing credentials.

### Saved files covered by this baseline
- `app/tests/e2e/assessment.spec.ts`
- `app/tests/e2e/private-preview-disabled.spec.ts`
- `app/tests/e2e/recommendations.spec.ts`
- `app/tests/e2e/results.spec.ts`
- `app/tests/e2e/scaffold.spec.ts`
- `app/tests/e2e/score-explanation.spec.ts`
- `app/tests/unit/assessment-notes.test.ts`
- `app/tests/unit/assessment.test.ts`
- `app/tests/unit/config-selection.test.ts`
- `app/tests/unit/domain-boundary.test.ts`
- `app/tests/unit/evidence-controls.test.ts`
- `app/tests/unit/generation-intent.test.ts`
- `app/tests/unit/golden-matrix-report.test.ts`
- `app/tests/unit/golden-matrix.test.ts`
- `app/tests/unit/lint-config.test.ts`
- `app/tests/unit/live-smoke.test.ts`
- `app/tests/unit/openai-provider.test.ts`
- `app/tests/unit/private-preview.test.ts`
- `app/tests/unit/progress-navigator.test.tsx`
- `app/tests/unit/recommendation-attempt.test.ts`
- `app/tests/unit/recommendation-client.test.ts`
- `app/tests/unit/recommendation-config-failure.test.ts`
- `app/tests/unit/recommendation-controller.test.ts`
- `app/tests/unit/recommendation-prompt.test.ts`
- `app/tests/unit/recommendation-retrieval.test.ts`
- `app/tests/unit/recommendation-service.test.ts`
- `app/tests/unit/recommendation-validation.test.ts`
- `app/tests/unit/results-disclosure.test.tsx`
- `app/tests/unit/results.test.tsx`
- `app/tests/unit/scaffold.test.tsx`
- `app/tests/unit/score-config-failure.test.ts`
- `app/tests/unit/score-refresh.test.ts`
- `app/tests/unit/score-request.test.ts`
- `app/tests/unit/scoring.test.ts`
- `app/tests/unit/session-freshness.test.ts`
- `app/tests/unit/trace.test.ts`

### Existing Build Pack evidence
`BUILD_PACK/07_GOLDEN_TESTS/REGRESSION_MATRIX.md` exists with five historical v1 capture cases, expected outputs and qualifications. It is NOT a comprehensive executable test policy; historical PASS means capture QA, not v2 parity. Preserve it unchanged. Runnable commands are in app/package.json; test implementations are under app/tests/.

### Permission for new tests
Before adding a test/assertion/fixture/harness/benchmark or conducting an unlisted check:
“This could catch [specific failure affecting user]. Existing [test] does not cover it because [reason]. Proposed saved file/command: [...]. Expected extra time [...], coding tokens [estimate/unavailable], application API spend [...]. May I add and run it?”
Record approval and command here before execution. Do not ask again for the exact scope already explicitly authorized. Correct a broken existing test only within its intended assertions; do not weaken coverage or slip new tests under a repair label.

## Effort measurement and prompt contract
Start: item ID, user-visible outcome, in/out scope, saved checks to run, expected active-time range and coding-token range, assumptions/confidence. Where a token estimate lacks a defensible baseline, say “uncalibrated; unavailable” and explain once.
End: use the Send effort report to PM format in EXECUTION_PLAN.md. Record actual tokens only from available session/tool telemetry; identify input/output/cached categories where available, no double-counting cached input. Do not inspect private session logs or credentials to obtain metrics. If task boundaries cannot be separated, report session total with that limitation.
Application recommendation tokens/cost are a separate budget, never a substitute for coding-agent tokens. Calendar duration is not active labor. Historical missing estimates stay missing; no hindsight budgets.
PM compares estimate/actual and acceptance in the existing execution ledger/checklist. Update this file with a brief specific lesson after a meaningful overrun; do not accumulate narrative postmortems.
A forecast overrun requires a concise cause/new estimate. Pause for new scope or spending authority, not merely for an ordinary estimate miss.

## Lightweight coordination
Use EXECUTION_PLAN.md's current-state block as the local source; no Buzz/Notion, no new status document or polling daemon.
Recommended optional sharing: a dedicated GitHub issue whose BODY is overwritten at meaningful state changes (start/blocked/verification/complete), containing timestamp, task/revision, result, blocker and effort summary only. This avoids pushing application code or conflicting with the active branch.
Issue creation/updates are a proposal only until owner authorizes that publishing channel. Until then owner-manual Git publication supplies the shared snapshot. PM checks timestamp and explicitly reports stale/unpublished state; never claims to observe a running local agent.
