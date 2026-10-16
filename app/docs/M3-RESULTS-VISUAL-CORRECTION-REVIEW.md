# Results visual correction review

2026-10-16. Owner-authorized UI correction; no M3 acceptance. All edits unstaged/uncommitted. No provider requests.

## Running-build finding

Before editing: port 3000 returned Results HTTP 200, build pyP0WZFxiihNHSBwYP_2e. All 12 HTML-referenced JS/CSS assets matched .next byte-for-byte. The app route uses the same Recommendations/ComputedScores components as browser tests; no alternate live render branch exists. Exposed citations, bottom difficulty text and visible provider settings were implementation omissions. This differs from the previously fixed stale-build incident. The current attachment contained text only; no claimed screenshots were attached, and the user's incognito tab was not accessible through browser tooling. No user assessment was changed.

## Requirement checklist

1. Composition: replaced inherited narrow evidence max-width with intentional responsive composition; full-width cards, readable prose, wrapping metadata and bibliography. Visual evidence pending below.
2. Context: compact actual industry, size, buyer, markets and goal. Missing values omitted; removed the requested sentence. Disclosure distinguishes recommendation inputs from scoring. selectQuestions uses industry/size/markets/location; resolveBenchmark and category weights use industry; resolveMultiplier can match industry, market, buyer and goal. No claim that every context field always changes a score. Notes are outside deterministic input.
3. Clutter: coverage remains visible; numeric/missing-answer/method details live in existing score explanation; provider details and validation limits in accessible native information disclosures. One top research/AI notice; regeneration secondary. Report placeholder is a small disabled text action, not implemented.
4. Gaps: generated gap statement is headline, category a badge. Unanswered items have a separate incomplete notice and action using the existing review-missing reducer. No invented gaps or changed recommendation counts.
5. Actions: category and difficulty badges precede title/body; Low green, Medium amber, High displayed as Hard/red. Underlying content unchanged. Anticipated ROI is deferred: needs owner-approved definition, time horizon, baseline, calculation criteria and supporting evidence before implementation.
6. Citations: Sources (N) opens a native modal dialog per insight, preserving its exact evidence list. Keyboard activation/Escape, focus return and accessible naming. Links/metadata stay within the dialog.
7. Evidence: explanation of native metadata retrieval, then assessment grounding notes, bibliography grouped by exact document title/publisher/link, then expandable provenance limitations. Duplicate section strings deduplicated; overlapping original strings retained verbatim to avoid inventing page ranges. No live search/embedding/page-verification claim. Generated grounding prose is retained, not rewritten to hide its limitations.
8. Score/content audit: see below. Runtime scoring, retrieval, prompts and validation are untouched.

## Separate score and claim audit

The latest retained live application response is the earlier two-answer Governance assessment: U-001=No, U-002=Yes; Manufacturing, 251–500, APAC, EU, Enterprise, Investor readiness; raw 50.95298602287166 / weighted 12.06566709021601 (51.0 / 12.1 displayed). Its original input identity is checked before offline rendering. It is not either new four-answer manual run.

No retained raw inputs, matching calculation traces, or generated responses for the reported 55.6/13.2 and 58.3/13.8 runs were found. Neither can be reconstructed from rounded totals or answer counts. Missing evidence: both complete answer maps, context, config/method identities and matching traces. Cause remains unresolved; no scoring change or reverse-inferred answers.

The configured Chemicals Operational Safety excerpt at pp.34–35 covers PSIC/PSTIR/PSISR, Tier 1/2 incidents, root causes, corrective actions and operator training. The p.35 excerpt covers reportable transport incidents and corrective actions. Neither explicitly establishes a grievance/whistleblower channel, confidentiality or non-retaliation. Thus these excerpts alone do not directly support that recommendation. The exact new recommendation/citation tuple is unavailable, so a complete claim audit of the manual output is not possible. Other library excerpts discuss grievance mechanisms, but their presence is not evidence they were supplied or cited for that response. No retrieval or prompt changes were made. Claim-level grounding remains an M3.6 evaluation concern.

## Verification and screenshots

Final offline npm run verify PASS: typecheck, lint, 248 unit tests in 29 files (including Golden coverage), production build, 65 Chromium tests. Production dependency audit: zero vulnerabilities. Source credential-pattern scan: zero matches. Protected BUILD_PACK/config/domain/archived-prompt/lockfile diffs empty; prior live evidence hashes unchanged; index empty. Controlled response interception is test-only; retained live replay uses the original matching synthetic identity in an isolated test browser and is never loaded into the user's assessment. Source binaries and provider output are not newly requested.

Initial focused checks: typecheck/lint pass; 3 focused unit tests pass; 4 rendered browser checks pass (1440/768/390 plus original retained-live replay). Initial full gate had 247 passing tests and one unchanged navigator test exceeding its existing 5-second timeout; all 11 navigator tests passed unchanged in isolation. Final gate rerun passed without changing navigator code, assertions or timeouts. Owner reports roughly eight seconds for the manual generation; this is not an independently captured timing/usage measurement and no ledger entry was fabricated.

## Visual evidence and acceptance limits

Visually inspected desktop 1440, tablet 768 and mobile 390 screenshots, plus the longer original retained live narrative. The final context strip wraps industry intentionally; cards align, prose uses deliberate readable measures, and evidence uses two narrative columns only on wide desktop, stacking on tablet/mobile. Dialog checks include keyboard activation, Escape, focus return and axe; page/dialog axe checks and horizontal-overflow checks pass. All three difficulty colors/text were exercised (High is presentation-mapped to Hard). Native controls and existing CSS primitives implement the ui-ux-pro-max/ui-styling guidance; no library added.

| Requested view | Local screenshot |
| --- | --- |
| Scores and compact context (full page) | [Scores/context](../.local/results-visual-correction/01-scores-context.png) |
| Expanded gap | [Gap](../.local/results-visual-correction/02-expanded-gap.png) |
| Expanded action with top badges and source control | [Action](../.local/results-visual-correction/03-expanded-action.png) |
| Open source dialog | [Dialog](../.local/results-visual-correction/04-source-dialog.png) |
| Reordered evidence section | [Evidence](../.local/results-visual-correction/05-evidence.png) |
| Mobile layout | [Mobile](../.local/results-visual-correction/06-mobile.png) |
| Original retained response, offline | [Retained response](../.local/results-visual-correction/07-retained-response.png) |

Screenshots are ignored local review artifacts, not fabricated live calls. The original manual-run screenshots/inputs/output were not supplied. UI requirements 1–7 are implemented and locally verified; owner visual acceptance remains pending. Requirement 8 is partially unresolved: exact score-difference attribution and a complete claim-by-claim audit of the new manual response need the missing evidence described above. The observed operational-safety support gap is explicitly flagged. Anticipated ROI remains a separate proposal; reports remain unimplemented by authorization.

Verified-build restart: port 3000 serves build 5nkbYvFhaJfRipDZgVno4, Results HTTP 200 and all 12 referenced assets match disk. Readiness GET HTTP 200, ready=true, v4 contract, unchanged gpt-5.4-mini / low / 4000 tokens / 30000 ms; client cap remains 45000 ms. No generation dispatched. Server remains running for owner manual review.


## Loading/motion closeout authorization — 2026-10-16

Owner authorized the remaining M3.4 loading spinner, approximately two-second rotating words, slower confirmed selection/card transition, delayed offline and reduced-motion verification, plus a private Hetzner staging PLAN only. No provider calls, deployment, commits or pushes. M3/recommendation quality remains unaccepted.

Implemented: 800 ms pointer selection pause with visible Selected confirmation; 420 ms card entry; loading spinner and cosmetic words every 2000 ms. Words do not claim measured provider progress. Reduced motion uses static text/ring and no card animation. Six focused browser checks, typecheck/lint/build passed; full offline gate result recorded below after completion.

GROUNDING-001 — OPEN: Chemicals Operational Safety pp.34–35 / p.35 excerpts do not directly support the reported whistleblower/grievance-channel, confidentiality or non-retaliation recommendation. Citation membership is insufficient proof of claim support. Exact latest manual output is unavailable, limiting complete claim audit. Do not mark recommendation quality accepted; broader grounding evaluation remains M3.6.

Staging proposal: [private Hetzner plan](PRIVATE-HETZNER-STAGING-PLAN.md). Owner supplied capstone-ai (89.167.6.61); remote inspection blocked by unavailable SSH authentication, not by missing host identity. Existing trusted-host BatchMode connection as default user guyli failed with Permission denied; no remote command ran. Local setup inspected. Prefer isolated loopback service plus authenticated SSH tunnel, disabled provider/no credentials, and separately labeled non-billable synthetic preview if authorized. No existing remote services inspected or modified.


Final loading/motion package gate: npm run verify PASS (typecheck, lint, 248 unit tests / 29 files including Golden coverage, production build, 69 Chromium tests). Six focused browser checks also passed. Delayed responses prove one request, scores retained, two-second rotation, static reduced-motion feedback and completion cleanup. Selection confirmation remains visible at 600 ms, advances after the 800 ms pause; 420 ms card animation is disabled for reduced motion. Loading screenshots inspected in both modes; responsive Results/source-dialog checks passed at 1440/768/390. Production audit zero vulnerabilities; credential-pattern scan zero matches. Protected BUILD_PACK/domain/config/lockfile diff empty, prior four evidence hashes unchanged, index empty; generated outputs ignored. No provider calls.

Local operational recovery: no listener was present initially. Final verified build 7XkDJeIhEZ9UV7jnWUUxu restarted in persistent hidden process 16232; /results HTTP 200, readiness v4 / gpt-5.4-mini / low / 4000 / 30000 ms confirmed without generation. Client cap unchanged at 45000 ms. Ready for manual testing at http://127.0.0.1:3000. Local existing live settings are unchanged; the proposed non-billable staging preview is not deployed. All edits unstaged/uncommitted. M3 and recommendation quality remain unaccepted.


## Owner acceptance: focused Results UI corrections — 2026-10-16

Owner explicitly accepted the requested Results UI corrections, loading feedback and slower card transitions. This includes the compact context/hierarchy, source dialogs, evidence ordering, reduced clutter, spinner/two-second rotating wording, visible selection confirmation and slower motion. Retained gate: 248 unit tests and 69 browser tests, typecheck/lint/build passed. This is scoped UI acceptance only: not whole M3, recommendation quality, reports, retrieval experiments or deployment acceptance. GROUNDING-001 (unsupported whistleblower citation) and SCORE-COMPARISON-001 (55.6/13.2 versus 58.3/13.8 without matching input maps/traces) remain OPEN.

Next authorized package: read-only Hetzner inspection and local isolated protected non-billable preview preparation using actual UI/deterministic scoring with labeled synthetic narrative scenarios. No server mutation, DNS changes, paid requests, staging, commits or pushes. Deployment approval follows review of concrete files and remaining prerequisites.
