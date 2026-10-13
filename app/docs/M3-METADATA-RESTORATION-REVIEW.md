# M3 metadata restoration — mapping and correction review

Status: locally implemented under owner authorization, 2026-10-13; **not human-accepted**. Branch: `milestone-3-recommendations`. Foundation checkpoint `7480686` preserves the verified M3.1–M3.3 work. Remote documentation `e162192` was integrated by merge commit `49f9cbe` without rebasing or rewriting history. This correction is committed separately. No live calls, dependencies, deployment, M3.4 results integration or M3.6 experiments.

## Source and complete setup mapping

Authority: `BUILD_PACK/02_LEGACY_APPSMITH/export/appsmith-sandboxes-v1-export-2026-10-02.json`, unpublished **SME Assessment Tool** widgets and `AssessmentScoring.getSelectedSME` / scoring payload assembly. The original setup has twelve controls; two target-market controls become one ordered list. The quantitative input-method choice is a subsequent flow step, not SME metadata.

| Original widget | Legacy payload | Current v2 mapping / treatment |
| --- | --- | --- |
| `inp_company_name` | `company_name` | `profile.companyName` → recommendation `companyName` → prompt `company_name`; untrusted descriptive text, no scoring effect |
| `dd_industry` | `industry` | `profile.industry` → validated `context.industry`; selection, scoring, retrieval and prompt |
| `inp_subindustry` | `subindustry` | Optional `profile.subindustry` → recommendation `subindustry`; retrieval tags/summary and prompt, no scoring effect |
| `dd_employee_band` | `employee_band` | `profile.companySize` → `context.companySize` → prompt `employee_band`; selection/scoring context and size-appropriate advice |
| `dd_revenue_band` | `revenue_band` | **Omitted**; not collected, inferred or accepted as an extra request key. See decision below |
| `dd_company_location` | `company_location` | `profile.location` → `context.location`; region (not country), scoring/selection context, retrieval and prompt |
| `inp_country` | `country` | **Omitted**; not collected, inferred or accepted as an extra request key. See decision below |
| `dd_target_market_1` | first `target_market_region` item | First `profile.targetMarket` selection → first `context.targetMarkets` entry; ordered primary market preserved |
| `dd_target_market_2` | second `target_market_region` item | Optional second selection → second entry; no fabricated second market |
| `dd_target_buyer` | `target_buyer` | `profile.targetBuyer` → `context.targetBuyer`; scoring context, retrieval and prompt |
| `dd_business_goal` | `business_goal` | `profile.businessGoal` → `context.businessGoal`; preserved choice vocabulary, retrieval and prompt |
| `inp_notes` | `notes` | **Restored** optional Additional Context / Requirements → `profile.notes` → recommendation top-level `notes` → retrieval context and prompt `sme.notes`; no scoring/selection effect |

The legacy `getSelectedSME` helper comma-joins the two markets for matching; recommendation payload assembly supplies the ordered array. V2 preserves primary/secondary order in its array projection.

Existing choice vocabularies remain in the unchanged setup configuration. Free text is not treated as verified evidence or instructions.

**Country:** the preserved native ranker uses company region/target markets, not country. Its omission therefore does not remove a native country-ranking signal, but it limits jurisdiction-specific recommendation context. Recommend a separately reviewed optional country field before country-specific advice is offered; do not infer country from APAC/EU or notes. Country alone would not prove legal applicability. Until approved, retain the explicit unavailable-context declaration.

**Revenue band:** Appsmith offered `<$1M`, `$1M-$5M`, `$5M-$15M`, `$15M-$25M`, `$25M-$50M`, `$50M+`. The runtime prompt uses revenue alongside employee count for scale-appropriate recommendations, including the under-$5M small-SME guidance. Its omission removes that sizing signal; employee count is available but is not a revenue estimate. The preserved ranker does not directly rank by revenue. Recommend separately approving restoration of the preserved vocabulary after clarifying currency/period meaning and voluntary disclosure. Until then, do not infer turnover or apply a revenue-based threshold as if it were known. Neither omitted field is silently restored or inserted into deterministic scoring.

## Compatibility, limits and propagation

- `inp_notes.maxChars` is `1000`. `application/assessment-notes.ts` defines the shared 1,000 UTF-16-code-unit maximum, matching JavaScript/HTML length semantics. The textarea, form validation, persisted profile and server request use this limit. Empty and whitespace-only notes are allowed; strings are preserved verbatim, without trimming or truncation. Nonstring/null and over-limit data fail validation.
- Session version stays 3: this is an additive compatible field with a schema default. Old valid snapshots lacking notes restore with `notes: ""`, preserving phase, question, answers and skipped IDs. Existing invalid/incompatible snapshots remain rejected. No canonical/config version change or destructive migration.
- `recommendationRequestFromSession` is a pure, validated projection for the future caller; it includes notes as recommendation metadata outside deterministic `context`. It sends no request. Results UI integration remains pending.
- The existing service hashes the parsed request, including defaulted notes. Absent and empty notes have the same identity; editing notes changes identity even when scores are identical. Future M3.4 consumers must compare the complete identity before displaying a response. There is no recommendation cache or current recommendation UI to invalidate in this package.
- Notes reach the original metadata tag/summary matching rules and the SME prompt JSON. The legacy static prompt is unchanged. Prompt version advances to `legacy-runtime-v1-validated-transport-2`; `country` and `revenue_band` remain explicitly unavailable. User instructions embedded in notes remain quoted data under the trusted system instruction, never executable instructions or a source of authoritative scores.
- Question selection and scoring inputs exclude notes. No scoring code, formulas, numeric policy, canonical configuration or BUILD_PACK changes.

## Validation limitations retained

The exact closing sentence and literal industry/employee-band/business-goal requirements can reject legitimate paraphrases. Context-label masking applies only to those validated labels for the summary score-claim scan; it does **not** mask notes. The retained regression proves a configured ratings goal passes while an additional incorrect generated numeric rating still fails. Masking and lexical checks are not exhaustive semantic contradiction detection.

Percentage validation only checks whether a number appears in raw percentage answers or somewhere in the supplied excerpt bundle. It does not prove the proposed claim, unit, applicability or its particular citation is supported. Notes do not expand the supported-percentage allowlist. Citation tuple membership likewise is not factual entailment. Scope 3 exclusions and all prior source/numeric evidence limitations remain in force. Real-provider behavior and advice quality remain untested.

## Verification

Focused checks: 80 tests passed across the initial five affected suites; the subsequent notes security regression brought the dedicated notes suite to 10 passing tests. Typecheck passed. The focused Chromium edit/refresh/backward-compatibility test passed (8.2 seconds test time). The corrected desktop/mobile setup plus notes browser run passed all three tests (26.9 seconds total). Final `npm run verify` passed on 2026-10-13: typecheck, lint, all 206 unit tests across 21 files, production build and all 52 Chromium browser tests (4.1 minutes). The complete log is `%TEMP%/capstone-m3-notes-verify.log`. After the browser gate, report regeneration passed all 7 retrieval and 22 Golden/trace tests; all five Golden matrix rows are PASS. Generated evidence reports remain ignored. Deterministic Golden coverage is retained. Production dependency audit returned zero vulnerabilities; changed-file secret-pattern scan and protected-path/whitespace checks passed. The four previously documented development-only lint-chain advisories remain; dependencies are unchanged. Tests cover missing/blank/populated/maximum notes, invalid and over-limit input, reducer editing, session round-trip and browser refresh, request projection, changed recommendation identity, preserved question selection/answers/scores, actual provider-prompt propagation, literal legacy retrieval behavior and untrusted embedded instructions. Existing score-mask and percentage regression tests are retained.

The first full gate passed typecheck/lint and 205 of 206 unit tests, but the unchanged 50-position navigator test exceeded its existing 5,000 ms deadline (5,465 ms). No assertion or timeout was relaxed. The failed-run log is retained at `%TEMP%/capstone-m3-notes-unit-timeout.log`; the unchanged navigator suite then passed all 11 tests in isolation, and all 206 unit tests passed in the next full run. Final gate results are recorded above.

The existing desktop/mobile setup tests initially expected two textboxes; restoring the authorized notes field makes three. Their explicit count is updated to three with an additional exact-label visibility assertion; market ordering, layout, accessibility and focus assertions remain intact. The prior run passed the other 50 browser checks; its log is `%TEMP%/capstone-m3-notes-setup-expectation.log`. This is an intentional expectation update for the added control, not a scoring or tolerance change.

## Review walkthrough and next

Open setup, enter optional context, refresh, edit it and return to the questionnaire; previously saved answers remain. Repeat with an old valid v3 snapshot lacking notes. Review the mapping and unresolved country/revenue decisions before freezing M3.6 evaluation cases. See [the future evaluation plan](M3.6-RETRIEVAL-EVALUATION-PLAN.md). Live calls stay disabled and package acceptance is pending source review.
