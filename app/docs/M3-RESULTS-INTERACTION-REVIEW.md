# Focused M3 Results interaction review

2026-10-16. Owner-authorized Results interaction and layout pass; M3 remains open. No provider calls. Changes remain unstaged/uncommitted.

## Implementation and decisions

- Review now offers Generate score and recommendations. Partial assessments explicitly confirm the unanswered count and limited basis. Invalid nonblank answers must be corrected/cleared; missing answers retain existing semantics. The primary flow routes directly to Results; existing boundary sessions remain compatible.
- An ephemeral, input-bound SPA intent grants one automatic recommendation attempt. It is claimed synchronously once before async generation. It is not serialized into storage or the URL; reload cannot recreate consent. Changed inputs discard it and a 15-second handoff expiry prevents much-later navigation from using it. Interrupted handoffs can be explicitly requested again on Results. This is client interaction duplicate protection, not durable server billing idempotency or a public spending control.
- Existing scoring and recommendation controllers remain separate. Scores display independently of generation, with existing cancel/retry, input/config/provider identity and stale-response safeguards. No unconditional mount generation and no automatic retry. Existing server score recomputation and output validation remain untouched.
- Deterministic scores appear first; the executive summary stays expanded directly below, including a loading state while generation runs. Gaps/actions show counts and use native keyboard-operable details/summary, initially closed. Evidence is disclosed separately. Open/closed preferences are session-scoped to the result input identity; they never persist generated content or authorize generation. Technical score explanations retain their existing disclosures.
- Consistent centered container, card widths/padding and typography. Corrected action-list styling leaking into nested citation list rows. Existing brand tokens, native controls and CSS; no dependency additions.

## Skills

Used installed ui-ux-pro-max quick-reference guidance for existing-UI review and ui-styling guidance (including accessibility and responsive references). No dedicated frontend-design skill was installed. Applied native semantic controls, visible focus, readable wrapping, touch spacing and reduced-motion support using established project tokens. No new library or skill was installed. The existing-UI quick-reference guidance was used without installing a Python runtime or generating a competing design system.

## Verification

Final npm run verify PASS: typecheck, lint, 247 unit tests in 28 files (including deterministic Golden coverage), production build, and 61 Chromium browser tests. Focused unit checks: 15 passed; rebuilt in-flight refresh/navigation browser checks: 2 passed. Ordinary tests and browser server ran with CAPSTONE_OFFLINE_TESTS=1; no provider calls. Production server was stopped before rebuilding its shared .next directory.

Visually inspected full-page Results at desktop 1440, tablet 768 and mobile 390 pixels: collapsed/expanded content, evidence/action wrapping, consistent card alignment; inspected pending generation and interrupted recovery. Keyboard disclosure and axe checks pass; no horizontal overflow at tested widths. Screenshots and logs remain ignored under test-results and .local/results-ui-verify.log.

Production dependency audit: zero vulnerabilities. Scoped credential-pattern scan and client-bundle credential/provider-endpoint scan: zero matches. BUILD_PACK, canonical config, deterministic domain, archived prompt and lockfile diffs are empty; prior live evidence hashes unchanged; index empty. This is offline interaction verification, not new live-provider evidence or milestone acceptance.

Local diagnostic scripts/evidence under the already ignored app/.local directory are now excluded from ESLint; production source lint rules are unchanged. Initial verification iterations exposed test-worker startup/working-directory issues, a test event-helper typing error, navigation timing and legacy layout selectors. These were corrected without relaxing score, freshness or output validation assertions. The new in-flight refresh test then exposed premature receipt removal on transport failure (60/61 browser tests passed). Receipt clearing now requires a received response; the focused refresh/navigation regressions both pass after rebuilding. Assertions verify the receipt, one POST before explicit retry, unchanged scores, recovery wording, absence of stuck loading and rejection of the late original result.

## Limits and scope

An input-hash-only session receipt is written before dispatch and cleared on a received terminal outcome. Refresh/navigation during generation shows an explicit interrupted/retry state without replaying consent or claiming provider cancellation. Storage write failure prevents dispatch. The provider may still finish or charge after the client stops waiting; retry is a new explicit request. Refresh deliberately does not resume or regenerate paid work. Generated narrative is not newly persisted by this package. Citation membership still does not establish claim-to-source entailment. The broader five-stage navigator, reports, model comparison and retrieval experiments remain deferred. Existing provider configuration (v4, low reasoning, 4000 output tokens, 30-second provider / 45-second client caps) is unchanged.

## Manual review

Use the verified local server at http://127.0.0.1:3000. From Review, use Generate score and recommendations and confirm partial assessment when relevant. Scores appear first while the summary generates; gaps/actions/evidence disclose on demand. A configured generation action sends provider work and may incur charges. Refresh/navigation during pending generation must not automatically resend; Retry is explicit new work and provider outcome of the interrupted request is unknown. No generated response is durably recovered by this package. All agent verification used controlled transport or disabled generation.

Verified-build restart completed: Results GET 200; readiness GET 200, ready=true, v4 contract, gpt-5.4-mini / low / 4000 tokens / 30000 ms. No generation was dispatched. Local server remains running on port 3000 for owner testing.

Owner manual review found further presentation omissions after the prior functional gate. The corrective visual acceptance record is M3-RESULTS-VISUAL-CORRECTION-REVIEW.md; prior passing tests did not establish owner visual acceptance.


## Owner acceptance: focused Results UI corrections — 2026-10-16

Owner explicitly accepted the requested Results UI corrections, loading feedback and slower card transitions. This includes the compact context/hierarchy, source dialogs, evidence ordering, reduced clutter, spinner/two-second rotating wording, visible selection confirmation and slower motion. Retained gate: 248 unit tests and 69 browser tests, typecheck/lint/build passed. This is scoped UI acceptance only: not whole M3, recommendation quality, reports, retrieval experiments or deployment acceptance. GROUNDING-001 (unsupported whistleblower citation) and SCORE-COMPARISON-001 (55.6/13.2 versus 58.3/13.8 without matching input maps/traces) remain OPEN.

Next authorized package: read-only Hetzner inspection and local isolated protected non-billable preview preparation using actual UI/deterministic scoring with labeled synthetic narrative scenarios. No server mutation, DNS changes, paid requests, staging, commits or pushes. Deployment approval follows review of concrete files and remaining prerequisites.
