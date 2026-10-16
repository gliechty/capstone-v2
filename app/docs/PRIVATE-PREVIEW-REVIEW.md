# Private preview preparation review — 2026-10-16

## Scope and acceptance

Owner accepted the requested M3.4 UI corrections/loading/card motion; see the explicit acceptance in BUILD_PLAN.md, EXECUTION_PLAN.md and the Results review documents. This package prepares private staging locally, not deployment or M3 acceptance. No scoring/retrieval/config/archived-prompt changes, new dependencies, provider requests, commits or pushes.

## Implementation

Shared RecommendationPresentation renders the existing Results sections and controls for both live controller and the separately gated browser simulation. No change to the normal controller, validation or paid-request boundary. Preview uses an explicit sample-load action, normal assessment session validation, actual questionnaire and authoritative score API. Fixtures are authored and marked synthetic; they are neither real provider output nor evidence of AI quality. All three difficulty badges/source dialogs can be inspected.

Dual gate: build CAPSTONE_BUILD_TARGET=private-preview plus runtime CAPSTONE_PREVIEW_MODE=synthetic. Normal build cannot activate simulation by URL/runtime opt-in alone. A preview build or any preview runtime value disables provider configuration, including accidental live credentials. Deployment entrypoint refuses a key/live-provider setting. Simulation has no provider import or request transport. Scenario controls trigger bounded local timers; refresh/navigation uses a pending receipt and explicit retry, never automatic remount generation. The combined explicit assessment handoff works in the preview.

Routes: /preview, /api/preview-health (404 outside preview); enabled preview /results redirects to /preview. A visible banner labels the entire preview deployment. Build outputs separated into .next-preview and excluded from Git/lint. No user's existing .env.local was edited. Local preview uses a different port/origin so it does not overwrite the owner's current assessment.

## Verification evidence

Focused five unit tests passed: build/runtime gates, key suppression even with live configuration, fixture structure and unchanged engine sample (50.95298602287166 raw / 12.06566709021601 weighted). Separate production preview build passed. Six Chromium preview tests passed: 1440/768/390 layouts and axe, source dialog, zero external/generation requests from UI, delayed success/timeout/error, retry/cancel, refresh recovery, reduced motion, direct generation POST unavailable, actual combined partial-assessment handoff. Initial preview test found ambiguous select labeling; explicit accessible names fixed it, followed by a complete successful preview rerun. No assertion/tolerance weakened.

Compose syntax validation and Node deployment-script syntax checks passed. Production dependency audit: zero vulnerabilities. Protected evidence hashes unchanged and source/deployment credential-pattern scan has zero matches. Screenshots: app/.local/private-preview-review/ (ignored); visually inspect desktop/tablet/mobile and compare with actual app components. Full normal-app gate recorded below after completion.

Local Linux Docker daemon unavailable; no image build/run, resource-limit/egress enforcement or Caddy auth/TLS execution has been verified. These are explicit pre-deployment checks, not implied by browser tests. Caddy executable absent locally. SSH fails authentication, so available host resources/current service state are unknown. Historical configuration and live DNS lookup inform the proposal only.

## Deployment review

Concrete files in app/deploy/preview and runbook PRIVATE-HETZNER-STAGING-PLAN.md. Proposed isolated service: loopback3201, separate internal network, 1 CPU/768MB limit, no existing volumes or DB. Whole-site HTTPS Basic auth at proposed preview.flowagentai.website, protected health/assets/APIs, no key, image identity and health. Existing Appsmith/n8n/Postgres/NocoDB/Caddy must remain intact. SSH identity and DNS/reviewer credentials are owner prerequisites. Do not apply until inventory, exact-image/Caddy checks and deployment approval.

## Open evidence issues

- GROUNDING-001: unsupported whistleblower/grievance claim from Operational Safety excerpts; fixture citations cannot resolve it. Recommendation quality not accepted.
- SCORE-COMPARISON-001: reported manual totals 55.6/13.2 versus 58.3/13.8 lack matching raw inputs/context/traces. No scoring change or invented explanation.
- M3.5 reports, M3.6 experiments and broader M3 acceptance remain pending.

Checklist reconciled read-only in BUILD-CHECKLIST-RECONCILIATION.md. Owner retains staging/commits/pushes.


## Private preview preparation gate — 2026-10-16

PASS: full normal npm run verify (typecheck, lint, 253 unit tests / 30 files including Golden coverage, production build, 70 Chromium tests). Separate preview production build plus six Chromium preview tests passed. Production audit zero vulnerabilities; credential-pattern scan zero matches; four prior evidence hashes unchanged; protected BUILD_PACK/config/domain/lockfile diff empty; Git index empty. Preview select labeling issue was fixed before the complete successful rerun. Generated .next-preview output is excluded from lint/Git; an initial gate was stopped during lint to add that generated-output exclusion, then the full gate passed.

Local preview: http://127.0.0.1:3001/preview, PID 33428, source release preview-970da310fbfe902076ae; health synthetic/billable=false, provider ready=false/private_preview_disabled. Normal verified build xL_3WjPUwlWrhS1Fu-aXT restored on port 3000 (PID16804). No .env.local edit, provider call, server mutation, staging/commit/push. Current branch milestone-3-recommendations.

Prepared concrete deployment files in app/deploy/preview; runbook app/docs/PRIVATE-HETZNER-STAGING-PLAN.md; implementation review app/docs/PRIVATE-PREVIEW-REVIEW.md; checklist reconciliation app/docs/BUILD-CHECKLIST-RECONCILIATION.md. Proposed new service 127.0.0.1:3201, isolated network, 1 CPU/768MB, protected HTTPS preview.flowagentai.website, image/health identity and preview-only rollback. Fresh SSH inventory blocked (no matching configured key/agent; default guyli denied), Docker Linux daemon absent and Caddy not installed locally. Compose and Node script syntax validated; exact-container/egress/Caddy auth/TLS checks remain required before deployment approval. Existing Appsmith/n8n/Postgres/NocoDB services were not changed.

Owner UI acceptance is recorded, not whole M3 acceptance. GROUNDING-001 and SCORE-COMPARISON-001 remain open; synthetic fixtures do not resolve recommendation quality or manual score provenance.
