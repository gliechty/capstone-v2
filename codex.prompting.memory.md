# codex.prompting.memory.md

## Current authority and synchronization — owner direction, 2026-10-20
Build Checklist, tab v2.0, is the single project-management authority for current scope, sequence, owner decisions, acceptance and effort/status. Latest explicit owner instructions take precedence. Repository code, canonical configuration and test evidence remain authoritative for implemented behavior; a checkbox does not prove implementation.

Before EVERY milestone step, read the live F1 note and the relevant checklist row values INCLUDING cell notes at https://docs.google.com/spreadsheets/d/1JPxxDzxOuH77i62EUBqgz9T46h-8ck9YtKZQIQa8FdQ/edit?gid=406102921 . Then reconcile supporting AGENTS.md, BUILD_PLAN.md, EXECUTION_PLAN.md and codex.prompting.memory.md before implementation, preserving newer unrelated work. BUILD_PLAN describes product scope/criteria; EXECUTION_PLAN records technical steps/evidence. Neither independently overrides current checklist decisions. Do not reopen accepted work based on historical text. If live checklist access fails, report the blocker; do not treat an old copy as current.

PM maintains the checklist and reconciles completion/commit evidence available in-session. Codex maintains the existing repository instructions/plans and publishes scoped changes only as authorized. No background synchronization exists. At closeout supply affected row, result, measured effort/unavailable telemetry, commit SHA, branch, push/merge state and deployed release when applicable. PM updates the same item; no new tracking document, service or synchronization tooling.

Current disposition (owner2026-10-21): M3 accepted; M4.0 evaluation complete; M4.1 accepted as the reference specification and fixture package with documented limitations. M4.2 authorized next under the live protocol. Historical factors are not production-approved or globally applicable; U-026 autofill pending; Scope3 excluded. Quality tooling/refactoring remains optional final pre-shipping QA on a separate branch. The owner authorizes committing/pushing only scoped M4.1 changes now; subsequent M4.2 changes remain uncommitted unless separately authorized. No merge or deployment authorized. This supersedes conflicting historical status text below.

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


## Verified hosted M3 checkpoint — 2026-10-19
Integrated owner workflow rules from `pm/workflow-effort-controls-2026-10-19` at `0226c9d5686d97d50e8203470415a9e06ccf8858` after functional verification. This is a local documentation integration, not a Git merge/commit; newer uncommitted application and incident work remains preserved.

Current explicit authorization: owner requested the smallest fixed-disclosure correction, reuse of existing approved checks, deployment, and at most the one remaining separately accounted synthetic live verification. Existing files/harnesses were reused; no new test file, harness or synthetic demonstration was created for this correction. The obsolete literal-boilerplate rejection assertion was removed as the directly authorized contract change; the existing round-trip case now uses response-specific notes without boilerplate. Scores, citation identity, category, structured-output and targeted grounding assertions were retained.

Executed commands for this authorized correction (app/):
- `npx vitest run tests/unit/recommendation-validation.test.ts tests/unit/recommendation-prompt.test.ts tests/unit/m3-report-grounding.test.ts tests/unit/recommendation-controller.test.ts --maxWorkers=1` — saved focused files; 46 passed.
- `npm run typecheck` and `npm run lint` — passed.
- Existing `node scripts/deploy.mjs --key=<existing new-host SSH key path>` — existing production Docker build/health/HTTPS workflow; passed, no key material in source/output.
- `npx playwright test --config .local/budget-deploy.config.ts --grep 'hosted readiness'` — saved non-generating hosted check; passed.
- `npx playwright test --config .local/live-deploy.config.ts` — saved explicitly authorized single live request; passed, no retries. The two-request allowance is now exhausted; do not run this paid check again without new owner authorization.

Earlier full gate remains recorded:263 unit passes and68 browser passes; five concrete failures were corrected and five saved browser cases passed after rebuilding. The later targeted change replaces the literal-disclosure acceptance contract; it does not invalidate unchanged scoring/retrieval/Golden evidence. Current focused suite has one fewer rejection case because literal boilerplate is no longer an acceptance requirement. Do not misreport the older full gate as a fresh all-green single command on v6.

Lesson: fixed application provenance/verification limitations belong in deterministic presentation, not a literal-word gate on model prose. Preserve response-specific disclosure and substantive correctness safeguards. Record unavailable raw response evidence honestly; never reconstruct it or spend another call merely to recover it.

## Owner-approved manual-acceptance regression checks — 2026-10-19
Owner approved updating the existing Skip-retention assertion and adding focused offline checks for deselection/Skip surviving refresh and initial Results access requiring Review + Generate. Files: tests/unit/assessment.test.ts, tests/e2e/assessment.spec.ts, tests/e2e/m3-completion.spec.ts. Reuse existing fixture data; no new synthetic demonstration or paid call. Estimated additional effort20–30 minutes; coding tokens unavailable. Existing downstream Results fixtures may represent an already-authorized Results revisit without altering their scoring/validation assertions.

Existing UI expectations were maintained to match the explicitly authorized changes: equal bounded card height instead of varying height;650 ms card-wheel motion instead of420 ms whole-stage nudge;5x active glyph instead of1.6x; unavailable gap/action labels instead of misleading zero counts. Existing downstream Results fixtures include explicit prior progress. No scoring, budget, stale-result or citation assertions were weakened. The saved mobile touch check now captures the viewport during touch-down rather than a full-page screenshot that can move the release target; all press/cancel/release/accessibility assertions remain.
Verification evidence: full saved gate263 unit passes;68/74 browser passes initially, followed by explicit corrected-file reruns (25/27,5/6, then2/2 touch cases).20 saved restoration/attempt unit cases passed. Do not describe this as a fresh74/74 single gate. No provider calls.

Hosted correction checkpoint: mosaic-8a7cb174fb04e58349cb,2026-10-19 14:49 Bangkok. Existing deployment command plus saved non-generating hosted readiness/budget/report case passed. Public and deployment-test ledgers unchanged by hash; no paid call. M3 manual acceptance remains failed/pending owner review, with original findings9/14 evidence limits still explicit.

## Current owner correction — 2026-10-20
Effort is recorded once per completed checklist item; unavailable timing is “not measured.” Do not reconstruct historical task time. Build Checklist F19 latest note authorizes browser verification of finding4 motion over time and finding5 viewport geometry at100%, using existing assessment.spec.ts data/journey (including reduced motion). Extend its existing roller check for these stated failures; no new synthetic fixture/demo. Reuse existing keyboard/focus, Review/revisit and session checks. Finding9 additional assertions were explicitly approved in the following entry. No paid generation.

Owner approved finding9 focused regressions in recommendation-prompt.test.ts and recommendation-validation.test.ts using existing fixtures: explicit skipped/unknown context, unsupported absence/ROI claims, qualified advice and legitimate paraphrases. No exact-wording requirement or blanket ROI rejection. Command: `npx vitest run tests/unit/recommendation-prompt.test.ts tests/unit/recommendation-validation.test.ts --maxWorkers=1`. No broader test expansion or paid calls.

Completed Oct20 checkpoint: v7 correction deployed as mosaic-a547751983d355dacd22. Approved focused recommendation files48/48 passed. Full saved gate unit phase271/275 initially; fixed help group semantics and saved navigator file11/11 passed. Latest typecheck/lint/build passed. Browser gate71/74 initially; concrete keyboard/viewport/rail fixes followed by affected assessment file25/25. No full-gate restart; no assertions weakened. Existing hosted readiness/budget/report check1/1 passed with expected v7 and all generation POSTs intercepted. Both ledger hashes unchanged from fresh predeploy readings. Per-item effort recorded once in EXECUTION_PLAN.md as not measured where timing absent; coding tokens unavailable. No paid calls or Git publication. Owner visual/M3 acceptance remains pending.

## Owner step-effort protocol — 2026-10-20
Standing protocol; supersedes conflicting historical effort instructions. No new verification commands or measurement tools are authorized.
- Work on one milestone step at a time; do not silently bundle adjacent steps.
- Before starting each step, explicitly confirm that this protocol has been loaded. Before the first implementation command, record the step ID, scope, expected time range, expected coding-token range and start timestamp (including timezone) in the existing step record. State assumptions/confidence. Check whether actual coding-token telemetry is available; if not, record **unavailable immediately**. An unsupported token forecast must also be unavailable, not invented.
- Track time and accessible coding-token telemetry while working. At completion, record the end timestamp and elapsed time **once** in that same step record. Distinguish waiting and active time only where measurable; otherwise record **not measured**. Never invent active time or token counts, reconstruct historical timing, infer tokens from prose, or substitute application API usage for coding-agent tokens.
- Measure effort to improve delivery efficiency, reduce owner intervention and prevent repeated scope/test churn.
- At each step's closeout, compare expected versus actual effort, identify the main avoidable delay or rework, and propose at most one concrete workflow correction in the existing step record. If evidence is unavailable, say so; do not invent variance or causes. PM records the decision in the existing Build Checklist; the next applicable step checks whether the adopted correction helped and records the evidence or its absence. Do not implement additional tooling merely to measure effort. Proposed architecture/tooling/test changes remain subject to existing scope and approval rules.
- Include the commit SHA and publication state in the handoff: branch, whether changes are uncommitted/staged/committed, whether pushed (or not verified), and PR/merge status when known. Distinguish the base commit from any uncommitted work; never imply a local change is published. Git staging/commits/pushes remain owner-controlled.
- PM reconciles the existing Build Checklist whenever commit/completion evidence is received. Supply the step record and evidence in the handoff; do not claim PM synchronization until confirmed or create another tracking document.
- At closeout, check that all required fields are present: protocol-loaded confirmation, step ID, scope, expected time/token ranges or justified unavailable, telemetry availability, start/end timestamps, elapsed time, measurable active/waiting time or not measured, actual tokens or unavailable, expected-versus-actual explanation, proposed correction (or none), commit SHA and publication state. Missing measurements remain explicit; they are never filled by guessing.


## M4.0 historical audit proposal — superseded, 2026-10-20
The owner narrowed M4.0 to tool evaluation. The baseline harness and broad measurement batch below are withdrawn, not pending execution.
No commands in this section are approved by their presence here. No new tool, test, scan or benchmark has run. Existing saved checks remain available; do not rerun passing checks for this documentation checkpoint.

Preliminary decisions: retain existing ESLint/TypeScript/domain-boundary controls. Evaluate jscpd and Knip for distinct duplication/unused-code evidence; Prettier for policy suitability without a bulk formatting rewrite; Oxlint only for demonstrated coverage/performance benefit; dependency-cruiser against existing boundary coverage. Archlint candidate identity is `archlinter/archlint`, npm `@archlinter/cli`, pending compatibility/source review. `sirknigget/antislop` source/license remain unverified; do not substitute another similarly named project. These are audit dispositions, not final adoption or permission to install.

Proposed first approval batch (from app/):
1. Registry metadata only, no install or package execution:
   `@('jscpd','oxlint','prettier','knip','dependency-cruiser','@archlinter/cli') | ForEach-Object { npm view $_ version license engines peerDependencies repository.url dist.integrity --json }`
   Purpose: identify exact versions/provenance/Node24 compatibility before proposing executable pilots. Existing correctness checks cannot establish third-party compatibility or license suitability. Only public package names go to npm; no application source or secrets uploaded.
2. Create and run `node scripts/quality-baseline.mjs --label before` using Node built-ins only, after approval. Scope: physical/nonblank source lines separately for production src/ and tests/, supported code/CSS extensions; exclude generated files, dependencies and assets; record build bytes excluding .next/cache and client chunk bytes separately, in decimal MB. Record environment and Git revision/dirty status, never environment-variable values. Write ignored `.local/m4-quality/before.json`. Missing/stale build outputs must be labelled, not treated as a current production baseline. No builds, provider requests, browser navigation, Docker/remote access or timing benchmarks in this command.
   Purpose: establish repeatable size/LOC definitions before refactoring; saved functional tests cannot reveal duplication/size change or establish these baseline quantities. This is product-baseline measurement, not extra tooling to measure coding-agent effort.
Estimated additional active effort for this batch20–35min; expected/actual coding tokens unavailable; application API cost $0. Exact pinned executable pilots and any new repeated build/browser/container measurements will be presented after this metadata review, avoiding speculative installs. No tool is added to the permanent gate without a justified decision. Whole-step effort and closing mini-audit live in EXECUTION_PLAN.md.


## M4.0 historical tool evaluation — complete, adoption deferred, 2026-10-20
Owner adopted the maintainability/delivery-efficiency directive in AGENTS.md. Evaluation only; no packages installed, analyzers run, source formatting/refactoring, new tests or benchmarks. Actual scan findings, speed gains and token savings are unverified.

| Priority / tool | Evaluation and recommendation | Limits / adoption condition |
|---|---|---|
| 1. Knip | Recommend a future bounded pilot. Adds project-wide unused-file/export/dependency detection beyond current ESLint unused-variable and domain rules. Official Next plugin recognizes App Router entry points. | Review scripts, dynamic entries and framework exports before treating findings as dead code; no auto-delete. Useful if it produces actionable findings without extensive ignore maintenance. |
| 2. Prettier | Recommend for future formatting standardization, separate from correctness linting. Current ESLint configuration focuses on correctness and provides no equivalent whole-project formatter. | It does not catch scoring/session bugs. Agree a small configuration and ignores; avoid mixing bulk formatting with functional changes. No formatter setup or rewrite authorized now. |
| 3. dependency-cruiser | Defer adoption, but record real incremental capability: whole-project circular dependency detection and cross-layer rules outside src/domain. Existing custom ESLint rule restricts domain imports; it does not compute graph cycles, including cycles within domain. | No actual cycles or cross-layer defect established. Do not replace the domain nondeterminism guards: dependency graph rules do not replace those. Reconsider when a concrete graph/boundary need justifies configuration cost. |

Preserve existing TypeScript/ESLint. Other previously listed analyzers are deferred from this focused pass. Prefer a small useful set over redundant gates; no automatic test reruns for this documentation-only evaluation.
Sources inspected: app/package.json; app/eslint.config.mjs; app/tools/eslint/domain-boundary.mjs. Official references: https://knip.dev/reference/plugins/next ; https://knip.dev/overview/getting-started ; https://prettier.io/docs/comparison ; https://github.com/sverweij/dependency-cruiser . Package-version compatibility, exact licensing for a selected release and runtime results remain to be checked before installation; this evaluation is not installation approval.


## M4.1 numerical-fixture authorization — 2026-10-20
Owner explicitly requested completion of the specification and supported numerical fixtures against SME_ESG_Calculator_China_Advanced.xlsx, preserving the workbook. Approved corrections: wrong factor references, missing/zero distinction, double-counting prevention, and renewable share separate from location-based emissions. Allowed work: read-only workbook/formula/factor inspection; author regression data under app/tests/fixtures/; verify saved JSON, cited source cells and independently calculated expected arithmetic with existing Python Decimal/openpyxl. This is fixture authoring/readback, not permission to add a calculator engine, executable regression suite, synthetic UI demonstration, dependency or benchmark. No M4.2, provider calls or full application gate. Retain unsupported/provenance-limited cases explicitly; no external factor replacement is approved. U-026 autofill stays pending without blocking other metrics.

M4.1 verification result: fixture JSON read back;22 unique cases,56 preserved factor-cell matches,51 independent decimal arithmetic expectations and factor joins checked with no issues. Source workbook hash unchanged. No executable engine tests or full application gate run; no calculator runtime exists yet. Scope3 excluded by latest owner instruction; U-026 autofill pending individually. See EXECUTION_PLAN.md reconciled specification and closeout for provenance limits and effort. This is evidence for reference-fixture correctness, not real-world factor approval or M4.2 authorization.
