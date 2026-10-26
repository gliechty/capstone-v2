### M4 publication/merge session
Start2026-10-26T11:48:03+07:00, basef9229a1 on milestone-4-branding-video. Initial tree: six scoped M4.5 tests/records files dirty; two unrelated deployment documents modified and incident/skill files untracked, all preserved/excluded. Protocol loaded; M4.5 owner acceptance recorded above. Estimate reconciliation/publication10–20min + diff/PR/check verification5–10min =15–30min combined, moderate confidence, depending on remote required checks. This is publication work, not a rerun of the completed7m22 M4.5 verification; no comparable merge timing available. Coding-token estimate/telemetry unavailable. Reuse existing passing checks; run only repository-required remote checks or invalidated checks. Main is4929f9f (M2); intended history therefore includes accepted M3 and M4. Historical preview files already committed in026fb85 are part of that accepted history, not newly staged incident/deployment changes. No deletion/rewrite of accepted history. End/merge evidence follows at closeout.

## Current authority — M4 accepted; closeout and M5.1 only (owner 2026-10-26)
Live Build Checklist v2.0 F1 and rows24–28 loaded. M4.4 is published f9229a1; owner accepts M4.5 and M4 as complete and authorizes scoped tests/records commit/push and normal PR merge into main. Preserve unrelated dirty deployment/incident/skill files. No deployment. After merge, publish milestone-5-guided-data-entry from updated main and perform M5.1 feasibility/architecture only; no full chat/upload implementation, dependencies, new tests or paid/quota-consuming experiments. M5.2/M5.3 require separate authorization. Historical factors remain reference-only; U-026 benchmark wording and country-specific recommendation tailoring remain unresolved/deferred, Scope3 excluded.

### Current roadmap crosswalk (historical IDs below retained as evidence)
| Previous roadmap | Current checklist |
| --- | --- |
| Unnumbered Laiffi assessment, former row48 | M5.1 feasibility/architecture, row26; new M5.2 chat row27; M5.3 uploads/review row28 |
| M5 config/knowledge maintenance | M6, rows29–34 |
| M5A source-to-config regeneration | M6A, rows35–37; existing approval/IP boundaries retained |
| M6 sliders | M7, rows38–40 |
| M7 Quick assessment | M8, rows41–42 |
| M8 external benchmarks | M9, rows43–45 |
Tuesday priority: M4 closeout → M5.1 recommendation/optional separately authorized one-activity POC → bounded M7 slider demonstration → recorded UI follow-up row51. This crosswalk supersedes old numbering/status, not historical evidence. Neither M5.2/5.3 nor sliders start automatically.

M4.5 closeout2026-10-26: the two owner-approved missing joins pass: one focused unit assertion (23 unchanged cases skipped) and one browser comparison through the real local score endpoint. Manual and calculator paths yield identical entire deterministic responses and visible raw/weighted scores. Mixed electricity/gas fixture transfers U-026=10% total-energy share, not20% electricity-only share; unknown remains unavailable. Saved typecheck and lint on the two changed test files also pass. No runtime fix, full suite/build rerun, paid call or deployment. Existing setup/calculation/restore/Golden evidence reused. No concrete functional blocker found; owner M4.5 review pending. Historical factors remain reference-only; benchmark electricity wording and country-specific recommendation tailoring remain deferred/open as documented.
Effort: session11:31:33–11:38:55+07 =7m22 elapsed delivery at completion checkpoint, including evidence audit, tests, compiler/lint waiting and records; no explicit pause, active/waiting split not measured. Estimate audit/records0–5min +verification10–15min =10–20min combined. Below estimate through existing-fixture/harness reuse and first-pass functional checks; no avoidable test rework observed, no new workflow correction proposed. Earlier fixture-precondition lesson helped; edit-match lesson was not exercised because no runtime text replacements were needed. Coding-token estimate/actual unavailable. Required protocol fields checked. M4.4 commitf9229a199aa9c22066014e4d196a97a17eabfdda pushed and matches origin/milestone-4-branding-video; M4.5 changes (two test files and four existing control documents) unstaged/uncommitted, no merge/deploy; unrelated local work preserved.

## M4.5 verification evidence — 2026-10-26
M4.4 is accepted/complete and published as f9229a199aa9c22066014e4d196a97a17eabfdda. M4.5 focused verification passed; owner review pending. No runtime correction, scoring/config/factor change or deployment.

| Requirement | Evidence reused or remaining gap checked | Result |
|---|---|---|
| Setup, Manual/Calculator eligibility and saved sessions | M4.4 country/setup browser checks and76 unit checks; no invalidating runtime changes | Reused passing evidence |
| Numerical reference, units, coverage and unknown-versus-zero | Accepted M4.1 fixtures and M4.2/M4.4 numerical checks | Reused; historical factors remain reference-only |
| Confirmed mapping, manual overrides, stale-answer invalidation, save failure and refresh | M4.4 calculator unit/browser checks | Reused passing evidence |
| Calculator/manual → questionnaire → real deterministic endpoint → displayed scores | New owner-approved calculator.spec.ts M4.5 case; same existing10000kWh/100000USD fixture; independently entered raw answers I-056=0.00005703, I-062=0.1 plus U-001=No; real score HTTP200 for both paths, entire response equality (overall/category/trace/input) and displayed raw/weighted scores verified | Passed18.0s browser case,1.1min command including startup |
| U-026 total-energy denominator | New owner-approved calculator.test.ts M4.5 case reuses renewable-share-separate oracle:2000 renewable kWh / (10000 electricity +10000 gas) =10%, not electricity-only20%; transferred raw10; unknown portion remains unavailable | Passed1 new unit case;23 previously passing cases deliberately skipped |
| Deterministic correctness and Results behavior | Existing295 unit/Golden +80 browser gate evidence and affected follow-ups, unchanged scoring engine/canonical configuration | Reused; no full-gate rerun |

Commands: npx vitest run tests/unit/calculator.test.ts --maxWorkers=1 -t M4.5; npx playwright test tests/e2e/calculator.spec.ts --grep M4.5. Existing Playwright server uses CAPSTONE_OFFLINE_TESTS=1; real local score endpoint, live provider disabled. No paid generation or new harness/fixture set. Built runtime F4DmjguRwH7SmL_Wk9FXP reused; only tests/records changed since f9229a1. Country metadata still reaches the prompt, but country-specific recommendation tailoring/retrieval is deferred. U-026 inherited electricity benchmark wording remains unresolved for Alan/Henry; no methodology change. Scope3 excluded. Manual review: select China, enter the existing annual calculator sample (10000kWh China national,100000USD same-period revenue; Scope1=None; Scope2/Energy=complete), review mapping and confirm transfer/start; compare I-056/I-062 with equivalent Manual entries, then Review → Generate. Do not generate live AI merely to repeat this offline evidence. M4.5 tests/records remain uncommitted; unrelated files preserved.

M4.5 focused assertions approved by owner2026-10-26: existing tests/unit/calculator.test.ts and tests/e2e/calculator.spec.ts only, existing numerical/session fixtures, real local score endpoint with paid providers disabled by saved Playwright configuration. Verify manual/calculator score equivalence and U-026 mixed-energy mapping. No full gate or new harness.

## M4.5 — quantitative end-to-end verification (2026-10-26)
Protocol/live F1 and row25 loaded. M4.4 accepted and published as f9229a1 on milestone-4-branding-video; no merge/deployment. M4.5 session start11:31:33+07 after checkpoint publication. Scope: reuse existing calculation/transfer/restore/score evidence and verify only manual/calculator-to-score joins, including authorized U-026 total-energy semantics. Country-specific recommendation tailoring stays deferred. Estimate audit/records0–5min +remaining verification10–15min =10–20min combined, moderate confidence; compared with M4.4 follow-up8m30/26m54, no new runtime UI expected. Coding-token forecast/actual telemetry unavailable. New focused assertions approved by the owner and executed; see closeout evidence. Existing passing tests will not be rerun without an invalidated check. No paid calls, new fixtures/harness, deploy or later milestone. M4.5 changes remain uncommitted unless separately authorized. Prior edit-match assertion workflow correction applies if edits are necessary.

## Current acceptance — owner 2026-10-26
M4.4 accepted and complete. Owner authorizes committing/pushing the scoped calculator mapping/autofill, confirmed transfer/start, source/input usability, Country selection/eligibility and Country metadata propagation plus records. This supersedes historical M4.4 pending/no-M4.5 wording below; retain all prior evidence and limitations. M4.5 is next and authorized only for the complete manual/calculator → questionnaire → deterministic score verification, reusing passing evidence and checking remaining gaps. Country-specific recommendation tailoring/retrieval changes remain deferred. Historical factors remain reference-only; U-026 total-energy transfer does not resolve inherited electricity benchmark wording; Scope3 excluded. No deployment, merge, Laiffi, slider or later-step work authorized. Preserve unrelated deployment/incident/skill files.

M4.4 Country selector follow-up2026-10-25: preloaded249 ISO3166-1 countries/territories (codes, English Intl/ICU names; source recorded in app/config/countries.json), no dependency/runtime lookup. Setup supports browse-all arrow, text filtering, highlighted matches, explicit mouse/keyboard selection. Unfinished query stays local and does not overwrite selected/saved Country; Continue shows actionable selection error. Shared listed-country validation at Setup and recommendation-request boundary; absent/blank Country remains valid for old sessions, unlisted legacy text retained for correction without deleting answers. Valid countries such as Japan retain Manual/recommendations; only China gets calculator. Region, scoring, factors, retrieval and existing Country-to-LLM freshness remain unchanged.
Verification: owner-approved additions to existing assessment.spec.ts/calculator.test.ts;76/76 focused unit checks,6/6 affected browser cases42.7s, typecheck/affected lint/build passed. Existing browser checks cover desktop/mobile/accessibility plus China transfer/refresh and Japan/old-session eligibility. Unfinished-search/keyboard selection check passed. Localhost3000 PID6828 build F4DmjguRwH7SmL_Wk9FXP HTTP200/served identity verified; actual browser dropdown visually confirmed, no owner inputs changed. No paid calls/deploy/commit/M4.5; owner acceptance pending.
Effort: start2026-10-25T19:12:10+07, completion checkpoint19:20:40+07 =8m30 elapsed delivery, no explicit pause; active/waiting split not measured. Forecast implementation10–15min +verification5–10min =15–25min total; shorter through existing dropdown/session/test reuse. Coding-token forecast/actual unavailable. Prior working-directory/fixture-precondition correction helped: no path/fixture rerun this follow-up. Avoidable rework: initial text replacement missed the render branch and lint caught unused import; one proposed correction: require an edit-match assertion before launching checks (no tooling). Base5b79ef2, milestone-4-branding-video; unstaged/uncommitted/unpublished, unrelated changes preserved. Protocol fields checked.

M4.4 Country checks approved2026-10-25: existing assessment.spec.ts/calculator.test.ts browse/filter/explicit selection, invalid-country boundary, China-only eligibility, old sessions; verification5–10min included. Search text must remain separate from selected country. Missing Country stays allowed; valid unsupported countries retain Manual/recommendations. No new harness/scope.

### M4.4 Country selector follow-up — 2026-10-25
Protocol/live F1 and row24 loaded. First reading/start19:12:10+07. Scope: preloaded worldwide countries/territories, searchable browse/select control using existing UI patterns, Country validation at setup/request boundaries, old sessions preserved; no wider form redesign, scoring/retrieval/factor change. Implementation10–15min + verification5–10min =15–25min total, moderate confidence; narrower than prior26m54 flow package, reuses its country metadata boundary. Coding-token estimate/telemetry unavailable. Existing checks reusable; new Country assertions approved and executed. Base5b79ef2, milestone-4-branding-video; preserve all uncommitted/unrelated work; no commit/deploy/paid calls/M4.5. Prior workflow correction applied: explicit repository workdir and fixture preconditions before edits/checks.

M4.4 owner approval 2026-10-25: focused calculator unit/browser extensions approved for China-only eligibility and old sessions, country changes, save-failure navigation prevention, automatic unique-factor selection and collapsed-card errors. Country also propagates as untrusted recommendation metadata alongside region, with freshness identity; no scoring/retrieval changes or live calls. Existing affected recommendation assertions adapted; approved focused commands only.

### M4.4 flow/eligibility correction — 2026-10-25

M4.4 flow/eligibility + country-to-LLM correction verified locally, owner acceptance pending. One confirmed save/transfer/start action; blocked storage prevents navigation; Manual Start retained. Optional Country follows archived free-text setup, separate from region; explicit China-only calculator entry/transfer eligibility, old sessions supported, linked answers invalidated on country edits while manual overrides/drafts persist. Country is bounded untrusted request/prompt metadata (parity-9), alongside region, included in freshness identity; scoring and retrieval ranking unchanged. Unique compatible electricity factor auto-selects; source name primary, facility optional; source cards collapse/edit/reopen on errors. Field-local errors retain raw inputs; existing strict grouped-comma parser preserved. Workbook geography selects location; factor selects numeric conversion/provenance. Site/multi-site columns inherited, per-source card/identity UI is v2; matching names do not guarantee no double counting. National+17 locations only; historical factors unapproved for production/global use; U-026 total-energy mapping enabled, benchmark electricity wording remains unresolved.
Verification: 80/80 focused calculator/assessment/recommendation unit checks; typecheck, affected lint and production build pass. Six affected browser cases pass across initial five passes and one corrected-test rerun; prior unaffected browser evidence retained. Blocked-save, unique-factor, China/old-session/Japan, collapsed-card error checks covered; country change/provenance and LLM payload/freshness covered offline. No live generation. Earlier case failure came from missing test reporting dates, corrected using existing fixture values; no runtime workaround. Localhost3000 PID16540 build G54p7frG6UoSQksiKmKW6 HTTP200/served build identity and hydrated Country field verified. No saved owner data cleared. Existing scoring/canonical factors/BUILD_PACK unchanged. No commit/deploy/M4.5; base5b79ef2, milestone-4-branding-video, unstaged/uncommitted/unpublished; unrelated work preserved.
Effort checkpoint: 2026-10-25 18:41:48–19:08:42+07, 26m54 elapsed delivery including reading, implementation, checks/waiting and closeout. No separately measured approval/overnight pause; active/waiting split not measured. Implementation estimate25–40min + verification15–25min =40–65min combined; shorter through reuse of existing calculations, storage and checks. Coding-token estimate/actual unavailable. Avoidable rework: mixed root/app-relative edit paths and incomplete browser fixture setup. One proposed workflow correction: confirm working directory and required fixture preconditions before each edit/check batch. PM decision pending; next applicable step assesses whether adopted correction helped. Prior measurements preserved, protocol fields checked.

Protocol/live F1 and row24 read, existing notes retained. Start18:41:48+07. Owner-authorized scope: ordered confirmed save/transfer/start, optional Country separate from region, explicit China-only entry/transfer eligibility and linked-answer invalidation, unique-factor autoselection, optional facility with source identity preserved, collapsible source cards and actionable numeric errors. Estimate implementation25–40min +verification15–25min =40–65min combined; moderate confidence, broader persistence/state work than prior6m04 presentation-only follow-up. Coding-token estimate/telemetry unavailable. New eligibility/save-failure/factor/card assertions approved by owner; existing checks reused. Base5b79ef2 on milestone-4-branding-video; preserve all prior uncommitted/unrelated work, no commit/deploy/paid calls/M4.5.

M4.4 provenance/behavior evidence2026-10-25: existing transfer button dispatched calculator-apply and recorded source snapshots/answers; AssessmentProvider saved afterward via an effect. It was functional but did not navigate. New combined action checks China eligibility, confirmation, selected mappings, setup and session validity; saves calculator and next assessment state before changing phase. Failure returns an actionable error and leaves current phase/answers untouched. Manual mode retains Start.
Archived Appsmith country was inp_country free text, separately serialized as country beside company_location (regional dropdown); restored optional Country follows that pattern, older sessions may omit it. Country gates the calculator and supplies recommendation metadata alongside region, not question selection/scoring; explicit app/config/calculator-availability.json supports China, not an inference from DEFRA/IPCC source labels. Changing Country invalidates still-linked answers via existing provenance logic; independent manual edits and saved calculator entries remain.
Read-only source workbook verification: 3·Scope 2!A2 explicitly says province toggle updates grid factor; B3 validates against Factors!A19:A37 and C3/E3 label the grid factor and kgCO2e/kWh. Geography selects the location; Reference Factor selects the numerical conversion/source record. V2 removes historical unsupported fallback and now auto-selects one compatible factor; multiple compatible records still require choice. 13·多厂区 Sites!A2/A4:B4 describes optional multi-site rows with Site and Province; it does not require the v2 per-activity Source name + Facility card arrangement. Source cards/internal IDs/name-pair checks are v2 implementation choices supporting approved coverage/deduplication. Facility is now optional but useful to distinguish same-named sources across facilities; matching names cannot guarantee no overlapping inventory. Original workbook/factors untouched.
Shared numberInput/revenueInput already accept grouped thousands with decimal dots; prior served build Uba4bIELeXk-hfRZaO5-A was verified. No retained exact failing100,000 form state is available to attribute that incident to one constraint. Corrected field-error context wiring and source/field-labelled summary links; no indiscriminate punctuation removal.

### M4.4 search/help follow-up — 2026-10-25
Protocol/live F1 and row24 loaded; first reading/start18:21:18+07. Scope: selectable highlighted geography suggestions, inline hover/focus/tap floating help without reflow, short input placeholders, inspect existing geographic coverage. Keep factors/scoring/mappings unchanged, saved data preserved, no new dependency or paid call/deploy/commit. Estimate implementation10–15min + affected verification5–10min =15–25min combined, moderate confidence; narrower than previous input/mapping correction, reuses existing component/test. Coding-token estimate/telemetry unavailable. Base5b79ef2 on milestone-4-branding-video, prior uncommitted work preserved. Existing browser selectors may adapt to the new interaction; no new assertions authorized by this request.

M4.4 dropdown/help closeout2026-10-25T18:27:22+07:00: searchable combobox with explicit browse-all arrow, case-insensitive English/Chinese filtering, highlighted matched letters, explicit click/Enter selection, arrow navigation and Escape; query alone does not change stored geography/factor. Short quantity/revenue/subset/evidence hints moved into placeholders, persistent labels retained. Inline information buttons show floating hover/focus/tap help with Escape/blur dismissal and no layout reflow. Existing catalogue contains national factor plus17 named provincial-level locations (Factors!C19:C36), including Guangdong/Sichuan; not complete all-province coverage. Catalogue is versioned app/config/calculator-reference-v1.json, not a DB; no invented aliases/geographies/factors. Screenshot Sizhuan differs from stored Sichuan. Scoring/mapping/config unchanged.
Affected ESLint and production build/TypeScript passed; existing approved calculator browser1/1 passed36.4s, adapting only interaction selectors from select to combobox/list option; no new assertion/harness/fixture/provider call. Prior20 unit passes retained because arithmetic/mapping unchanged. Port3000 PID26424 serves build Uba4bIELeXk-hfRZaO5-A, HTTP200 and actual served build/browse-all client control verified. No owner storage cleared; no deployment/commit/M4.5. Earlier additional assertion request remains pending, no new assertion coverage claimed.
Effort18:21:18–18:27:22+07 =6m04s elapsed through verification/closeout checkpoint, no explicit pause recorded; active/waiting split not measured. Estimate10–15min implementation +5–10min verification =15–25min; faster because only existing presentation component and test interactions changed, with no arithmetic or catalogue migration. Actual coding tokens unavailable. Exact role/name selector correction from prior item helped: browser check passed first attempt. No additional workflow correction proposed. Base5b79ef2 on milestone-4-branding-video; all changes unstaged/uncommitted/unpublished, unrelated work preserved; acceptance pending.

### M4.4 owner-review continuation — 2026-10-25
Protocol/live F1 and row24 loaded. Start2026-10-25T14:49:31+07:00. Scope: source labels/help/alignment, explicit geography-search state, grouped numeric input and field errors, precise unknown explanations, display precision/history, country-omission evidence, and explicitly confirmed U-026 transfer from renewable total-energy share. Owner supersedes earlier U-026 hold only for that question; inherited benchmark electricity wording remains unresolved for Alan/Henry. Scoring, canonical configuration, factors and original workbook unchanged. Country restoration is a proposal only. Estimate implementation/evidence25–40min +affected verification10–20min =35–60min total, moderate confidence; compared with prior33m08 M4.4 reuse, adds input/error presentation cases. Coding-token forecast/telemetry unavailable. Base5b79ef2, milestone-4-branding-video; preserve existing uncommitted work. New targeted assertions requested separately; existing approved checks reusable. No paid calls, deployment, commit or M4.5.

M4.4 review correction checkpoint2026-10-25 17:44:42+07:00: source names and distinct facility/location identity preserved; short placeholders and accessible native help disclosures; quantity before unit and aligned fields; search explicitly separates unsupported query from selected geography/applied factor; grouped-thousands commas accepted with decimal dot convention while saved raw entries remain unchanged; field-local errors plus source-labelled focus links; metric display rounded only for presentation, raw transfer full precision; Unknown percentages and renewable/waste-specific explanations; earlier snapshot explicitly history. U-026 now transfers renewable total-energy share under existing explicit confirmation/annual/coverage/unknown protections. Other MET_RE_SHARE destinations remain unmapped. Benchmark electricity wording remains unresolved for Alan/Henry, not corrected by enabling transfer; no scoring/config/factor/workbook change.
Country evidence: archived Appsmith export widget inp_country (Country) supplies country separately from dd_company_location/company_location. Earliest v2 model b68b8e8 already lacks separate country, with a country-or-region location hint; b210e8d uses canonical operating region. See app/docs/M3-METADATA-RESTORATION-REVIEW.md lines19–31. Omission predates M4.4. Proposed smallest restoration is optional separate country metadata while retaining regional selection/scoring; not implemented without authorization.
Existing calculator unit20/20, typecheck and affected-file lint pass. Production build compiled/TypeScript passed and generated Gd0fGvU3oGeJf57rz9jCJ; final build exit output lost at interruption, so not reconstructed. Built application starts; existing calculator browser walkthrough1/1 passed30.6s after exact role/name locator adaptation for help controls (initial selector collision, no weakened assertion). Covers transfer/refresh/staleness/manual override/mobile width. HTTP200, served build identity and corrected client bundle verified; localhost127.0.0.1:3000 PID20896. Owner session not cleared. New requested comma/U026 denominator/no-match/error-focus assertions remain unapproved/unexecuted; not claimed verified. Owner example mathematically yields20% with complete energy coverage; prior manual evidence proves calculated values only. No paid call/full-suite rerun/deploy/commit/new milestone. Live row24 updated; owner acceptance remains pending.
Effort continuation: start14:49:31+07, checkpoint17:44:42+07; calendar span2h55m11s includes interruption. Interruption/resumption boundaries not measured; elapsed delivery excluding pause, active/waiting and implementation/verification actual split not measured. No historical timing reconstruction. Forecast25–40min implementation/evidence +10–20min verification =35–60min; coding tokens unavailable. Prior33m08 preserved separately. Expected/actual variance cannot be reliably calculated. Avoidable rework: help/input selector collision; at most one proposed correction: exact role/name locators when introducing help controls, PM decision pending. Base5b79ef2, milestone-4-branding-video; correction unstaged/uncommitted/unpublished; unrelated files preserved. M4.5 not started.

### M4.4 current execution — 2026-10-25
Live F1 and row24 including notes loaded. Scope: inspectable canonical metric-ID/unit mapping, explicitly confirmed calculator-to-questionnaire transfer, provenance, correction/staleness and duplicate-input suppression. Reuse accepted M4.1/M4.2 implementation; no existing M4.4 runtime work found. Preserve scoring/config, original workbook, historical-factor limitations, U-026 pending and Scope3 excluded. M4.5 remains next; then separately authorized Laiffi assessment, slider demonstration and recorded UI follow-up. No deployment or automatic milestone advancement.
Start: 2026-10-25T13:18:22+07:00 (first reading session). Estimate implementation/records45–70min + verification20–35min = total65–105min, moderate confidence. M4.1's27m33s was specification/fixtures; this adds runtime state and UI transfer, so no blanket multiplier. Coding-token forecast and actual telemetry unavailable; no instrumentation. No recorded approval/overnight pause yet. Base5b79ef2, milestone-4-branding-video; existing deployment/incident/.agents changes preserved. New work remains uncommitted.
Owner approves extending existing calculator.test.ts and calculator.spec.ts with existing fixtures only for metric/unit mapping, manual preservation, stale edit/refresh behavior and duplicate-input handling; no new harness or paid calls. End/actual comparison below.

M4.4 verification closeout: saved npm run verify attempted once. Typecheck/lint passed; unit/Golden284 tests passed with one Vitest worker-start timeout in progress-navigator.test.tsx. Only that missing file reran with one worker:11/11 passed (295 total). Calculator focused20/20 passed, including the approved new mapping/session cases. Native Node browser discovery required the explicit JSON import attribute in application/calculator.ts; affected calculator/typecheck/lint/build reran successfully. Browser gate79 passed and one new expectation failed because it rounded an unrounded binary64 answer (0.00006843600000000001); only the test expectation was corrected, with no arithmetic/tolerance change. Affected calculator browser rerun1/1 and affected-file lint passed:80 total browser cases passing. Passing unrelated stages were not restarted. Build/scoring configuration and BUILD_PACK unchanged; git diff --check passed. Existing logs: app/.local/m44-verify.log, m44-worker-rerun.log, m44-calculator-rerun.log, m44-import-typecheck.log, m44-import-lint.log, m44-build.log, m44-browser.log, m44-calculator-browser.log and m44-test-lint.log (ignored generated evidence, not source changes).
Local server restarted only after inspecting port3000 PID26088. Current PID12788, project C:\Users\guyli\Desktop\2.0_BUILD_PACK\app, build jdeciBB6QEOwGhQhqKkfJ. GET /assessment200; served HTML build identity and actual served client transfer-control text verified. Review URL http://localhost:3000/assessment; refresh the existing tab to load new code, preserving sessionStorage. No paid calls, deployment, commit/push, dependency/config/scoring edits or M4.5 work. Source base remains pushed5b79ef2 on milestone-4-branding-video; M4.4 changes are unstaged/uncommitted/unpublished. Existing unrelated deployment/staging/incident/.agents changes preserved. Checklist target row24; acceptance remains owner-controlled.

M4.4 effort closeout: 2026-10-25T13:51:30+07:00; start2026-10-25T13:18:22+07:00, one delivery interval33m08s including reading, implementation, verification/waiting and closeout checkpoint. No explicit approval/overnight pause; calendar span33m08s. Active/waiting and implementation/verification actual splits not measured. Coding-token estimate/actual unavailable. Forecast implementation/records45–70min +verification20–35min =65–105min; actual below forecast because the accepted calculator, session model and fixtures were reused with a small transfer layer. Main avoidable rework: native JSON-import compatibility and an overly rounded browser expectation; the prior import-compatibility lesson was not fully applied. At most one proposed workflow correction: before the next gate, review changed Node-facing imports and numeric expectations against existing conventions (no new tooling/tests). PM decision pending; M4.5 should check whether this prevents repeated rework. Protocol fields checked. Base5b79ef2, milestone-4-branding-video; new work unstaged/uncommitted/unpublished, no merge/deploy.

# EXECUTION_PLAN.md

## Standing migration principle - owner direction 2026-10-23
Investigate differences from the legacy implementation before proposing fixes; a single problematic output does not authorize a new domain-specific rule. Tests must enforce agreed requirements, not silently create them.
Follow the Build Plan, Execution Plan and product vision within current owner authorization. Preserve agreed behavior/contracts while using the approved v2 architecture; legacy code need not be copied literally. Distinguish migration requirements from later quality improvements and present undocumented behavior changes for one consolidated owner decision before editing them. Do not infer rule-level approval from broad milestone acceptance. Reuse existing evidence and approved checks; no new rejection gate, harness or diagnostic subsystem without applicable authorization.

Owner acceptance - 2026-10-23: M4.3 accepted as delivered, including deployed-layout preservation, The Pieces that Matter headline, corrected acronym, compact full-pane video with captions/controls, MOSAIC home navigation and shared assessment/calculator/Results palette. Record scoped commit/push on milestone-4-branding-video; no deployment, merge or M4.4 authorized. This supersedes earlier pending-acceptance wording; historical evidence and affiliation limitations remain. The separately reported AI-generation failure is unresolved and does not alter this branding acceptance.

M4.3 authorization2026-10-21: integrate supplied MOSAIC_BRAND_PACK homepage identity/video on milestone-4-branding-video from ddd3182; homepage only, preserve assessment/calculator. Owner permits plain-text Columbia Climate School and SEE placeholders pending later affiliation branding, no institutional marks/endorsement. Scoped commit/push authorized; no merge/deploy/M4.4. Pack instructions are reference material, not governance. Reference documentation addition under BUILD_PACK/01_PRODUCT_SPEC/brand/MOSAIC_BRAND_PACK explicitly authorized; original baseline files unchanged.

Owner acceptance — 2026-10-21: M4.2 accepted as delivered, including the remaining calculator corrections and documented historical-factor limitations. Commit/push the scoped calculator follow-up and records on milestone-4-calculator. Then create milestone-4-branding-video from that checkpoint for M4.3 Claude branding/video; branch preparation only, no implementation, build, merge or deployment. Preserve unrelated work. This supersedes historical pending-acceptance wording below.

## Current authority and synchronization — owner direction, 2026-10-20
Build Checklist, tab v2.0, is the single project-management authority for current scope, sequence, owner decisions, acceptance and effort/status. Latest explicit owner instructions take precedence. Repository code, canonical configuration and test evidence remain authoritative for implemented behavior; a checkbox does not prove implementation.

Before EVERY milestone step, read the live F1 note and the relevant checklist row values INCLUDING cell notes at https://docs.google.com/spreadsheets/d/1JPxxDzxOuH77i62EUBqgz9T46h-8ck9YtKZQIQa8FdQ/edit?gid=406102921 . Then reconcile supporting AGENTS.md, BUILD_PLAN.md, EXECUTION_PLAN.md and codex.prompting.memory.md before implementation, preserving newer unrelated work. BUILD_PLAN describes product scope/criteria; EXECUTION_PLAN records technical steps/evidence. Neither independently overrides current checklist decisions. Do not reopen accepted work based on historical text. If live checklist access fails, report the blocker; do not treat an old copy as current.

PM maintains the checklist and reconciles completion/commit evidence available in-session. Codex maintains the existing repository instructions/plans and publishes scoped changes only as authorized. No background synchronization exists. At closeout supply affected row, result, measured effort/unavailable telemetry, commit SHA, branch, push/merge state and deployed release when applicable. PM updates the same item; no new tracking document, service or synchronization tooling.

Current disposition (owner2026-10-21): M3 accepted; M4.0 evaluation complete; M4.1 accepted as the reference specification and fixture package with documented limitations. M4.2 accepted by the owner on2026-10-21; verified evidence and limitations retained. Historical factors are not production-approved or globally applicable; U-026 autofill pending; Scope3 excluded. Quality tooling/refactoring remains optional final pre-shipping QA on a separate branch. M4.1 is published; the owner now authorizes committing/pushing only scoped M4.2 calculator work and its records on milestone-4-calculator. No merge or deployment authorized. This supersedes conflicting historical status text below.

### M4.3 deployed-layout correction — 2026-10-22
Protocol/live F1 and row23 loaded. Start11:05:53+07:00 (initial read immediately before timestamp not measured). Base9420a5a; branch milestone-4-branding-video; unrelated staging/incident/.agents work preserved. Scope: restore deployed homepage composition from retained release mosaic-a547751983d355dacd22, branding/content inside existing dimensions, single Sustainability hero, compact two-column video card, no new sections or application-wide styles. Latest owner instruction overrides earlier supplied placement expansion. No deployment/M4.4. Estimate implementation/records8-12min +verification6-10min =14-22min combined; medium confidence, narrower than previous33m05s branding integration and retaining unaffected checks. Actual coding telemetry available in existing session log; reliable forecast unavailable. Use existing affected homepage checks/build and authorized same-viewport visual comparison at100% zoom; no new tests/harness. Previous proposed selector/landmark review applies: restore single CTA and original section list before checking.

Correction completed locally2026-10-22 11:15:47+07:00; elapsed9m54s from11:05:53, no pauses; initial read just before timestamp not measured. Forecast14-22min; faster because retained deployment source and existing checks were reusable, despite a UTF-8 conversion fix and one video containment adjustment. Active time not measured. One workflow correction: when branding an accepted page, compare against its deployed source/dimensions before applying pack placement guidance. Prior selector-review correction helped avoid repeated-CTA/landmark failures in this pass.

Baseline: retained source archive app/.local/mosaic-a547751983d355dacd22.tar, corresponding page/layout match Git ddd3182; live https://preview.flowagentai.website/ observed same composition. Restored deployed section/order/containers/columns/padding/breakpoints/CTA and Manrope typography. Homepage-only palette retained; logo stays within original440x320 illustration coordinate box. Single Sustainability, in your context headline; extra subtitle/closing section removed. Video uses original placeholder padding and object-contain, native controls/captions/fullscreen, no autoplay. Concise copy preserves layout; film's future document-collection limitation remains in existing collapsed limitations. No scoring/calculator/application-wide style changes.

Comparison at100% zoom: desktop1440x900 section heights baseline=corrected601.875/438.792/371.5/617.906/575.292px; mobile390x844945.719/630.292/592.563/1156.167/849.25px. Headline64px/73.6px desktop and40px/46px mobile unchanged. Video playback advanced with captions visibly rendered inside the compact desktop card; native fullscreen control visible, no cropping/stretching. Existing scaffold unit4/4, affected lint, build/TypeScript and homepage browser10/10 passed; after encoding/copy/containment correction only invalidated responsive3 rerun,3/3 passed24.3s. No new tests/harness/full suite/provider calls. Local final build xd5dmVERbEXu0MUregICM onport3000 PID20756; screenshot proof outsideGit. Homepage shown locally for owner review; not deployed.

Coding telemetry through11:15:30+07 from existing session counters (baseline04:05:53.314Z): input4,189,167, cached subset4,145,536; output10,149, reasoning subset2,267; total4,199,316. Repeated cached conversation input included, application API tokens excluded; remaining closeout after snapshot excluded. Forecast unavailable. Correction remains unstaged/uncommitted onmilestone-4-branding-video, base9420a5a (previously pushed); no new commit/push/merge/deployment. Unrelated staging/incident/.agents work preserved. Acceptance pending; M4.4 not begun.

### M4.3 homepage branding/video — layout correction requested; owner acceptance pending2026-10-22
Protocol/live F1 and row23 loaded; start21:06:49+07:00. Base ddd3182c405c086af39bb882e031b8eb4359834e, branch milestone-4-branding-video, only unrelated staging/incident/.agents changes initially present and preserved. Estimate integration/records15-25min +verification10-15min =25-40min elapsed; medium confidence with supplied complete media and existing homepage checks. Larger than19m46s calculator review due media/responsive/full gate, not new engine logic. Coding-token forecast unavailable; existing session token_count telemetry found after initial unavailable report. Baseline event13:57:53.482Z before task: input236372735, cached-input231324288, output731017, reasoning194127, total237103752. Final delta will be linked to this step/base; cached inputs and output separated, reasoning a subset, no application API usage counted. No instrumentation added. Scope: homepage-only styles using next/font/local, supplied logos/favicon/social/video/poster/captions; no autoplay, existing CTA, no unsupported source-grounding claim. Owner confirms temporary plain-text affiliation names. Full verification once at final candidate, existing scaffold expectations adapted for new text/video; actual local playback/captions/desktop/mobile explicitly authorized, no synthetic demo.

M4.3 verification/closeout checkpoint2026-10-22 10:52:57+07:00: supplied identity, homepage-only palette/type, favicon/social image, 90-second responsive film/poster/English captions/controls, no autoplay, prominent assessment links and truthful current-method limitations implemented. Existing assessment/calculator/runtime methodology unchanged. Plain-text affiliation names are owner-authorized placeholders; no institutional logos/endorsement. Archived pack retained as reference, including its unresolved options, without adopting questionnaire/Results changes.

Saved gate evidence: typecheck and lint passed; unit coverage291/291 after affected scaffold/progress-navigator rerun. Initial browser run70/75 passed; five failures were ambiguous duplicate CTA test locators and duplicate closing landmark name. Fixed only these; affected lint, scaffold4/4, production build/TypeScript and five browser cases5/5 passed (1.1min), retaining other70 passed cases. A resumed scaffold worker-start timeout ran no assertions; bundled-runtime rerun passed with unchanged assertions/deadlines. No new test cases, paid calls or full-gate repetition. Git diff whitespace review passed; scoped file/content review excludes credentials, private responses/ledgers, generated outputs, ZIP and unrelated incident/staging work. Font OFL licenses retained.

Actual localhost verification: PID14124 serves app/ production build zOG3WYhO98WYev_UR3LnK on127.0.0.1:3000, HTTP200 and served build ID match. Desktop1080p and mobile390px720p playback advanced with visible English captions; duration90s, controls enabled, autoplay false; paused after inspection. Desktop/mobile layout inspected, mobile CTA visible, existing responsive/axe checks passed at1440/390/320px. User assessment not accessed or changed. Local screenshot retained outside Git. No deployment. Absolute social-card host remains a deployment-time metadata concern; no public branding release claimed.

Effort: start2026-10-21 21:06:49+07:00; last recorded prior-session event21:24:46.042; resume2026-10-22 10:39:34; functional/documentation checkpoint10:52:57. Observed session windows17m57s +13m23s =31m20s through this checkpoint, including reading, implementation and verification; not active-time measurement. Overnight interval between observations13h14m48s is excluded, but exact interruption boundary and any test execution after interruption are not measured. Full wall span13h46m08s includes that overnight interval; final Git/checklist publication closeout recorded in row23. Forecast15-25min implementation/records +10-15min verification =25-40min combined; observed31m20s through checkpoint falls within range, subject to pause-boundary limitation and remaining publication overhead. Main avoidable rework: obsolete homepage selectors and non-unique accessible region name; one proposed correction: review existing selectors/landmark names when introducing repeated CTAs before the release gate. PM records decision; next applicable homepage step checks benefit.

Actual Codex session telemetry through2026-10-22T03:52:43.610Z, relative to recorded pre-M4.3 baseline/base ddd3182: input10,844,314 (cached-input subset10,668,544), output20,245 (reasoning subset5,192), total10,864,559. These are cumulative coding-agent processing counters including repeatedly cached conversation input, not unique code tokens or application API tokens; closeout after this snapshot is excluded. No instrumentation introduced. Forecast unavailable. Publication is authorized only on milestone-4-branding-video; exact SHA and push result go in checklist/handoff, acceptance remains pending.

### M4.2 acceptance and Git closeout — 2026-10-21
Protocol/live F1 and rows22-23 loaded; start20:55:46+07:00 (initial read before timestamp not measured). Scope: acceptance records, reviewed calculator follow-up commit/push, then new M4.3 branch only. Estimate records/Git2-4min +diff/publication verification1-2min =3-6min elapsed; medium confidence, smaller than prior4m31s code/build follow-up. Coding-token forecast/telemetry unavailable. Existing passing calculator browser1/1, lint/build/TypeScript and actual localhost Beta-label evidence retained; no new tests or rebuild. Final SHA/publication/end/elapsed recorded in live checklist at handoff. M4.2 limitations unchanged: historical factors reference-only, no global fallback, U-026 pending, Scope3 excluded, autofill M4.4. M4.3 implementation awaits separate authorization and approved Claude assets.

### M4.2 local-server follow-up — 2026-10-21
Protocol/live F1 and row22 loaded. Start20:27:49+07:00 (initial read immediately before timestamp not measured). Scope: remove redundant quantitative Skip, preserve legacy saved data, identify/rebuild/restart localhost3000 and verify actual browser label; read workbook hidden-sheet metadata. Estimate implementation/restart4-7min +verification3-5min =7-12min elapsed, medium confidence; narrower than previous19m46s correction. Coding tokens forecast/actual unavailable. No provider calls, full gate, deployment or new milestone. Changes remain uncommitted.

Follow-up result: removed quantitative Skip radio; old stored skip choice renders as Manual without deleting stored entries or assessment answers. Existing approved calculator browser case adapted to Manual persistence, passed1/1 (8.2s test/17.0s runner); affected ESLint, production build/TypeScript and diff check passed. No full suite/provider call. Port3000 was PID36912, Node next start, started19:20:02, actual process working directory C:/Users/guyli/Desktop/2.0_BUILD_PACK/app; HTTP served old build dhEMOlxu7mDF9j1K0Mii7 while disk was newer. Stopped only that process before rebuild. New PID32780 serves build5NpkxamDvEZDqdZ9wjuXm from same project on127.0.0.1:3000. Actual browser http://localhost:3000/assessment confirmed exact Beta label and no Skip using the existing approved calculator-check profile in a separate tab; owner's tab/storage untouched. Factors is sheet19 with state=hidden in original workbook XML; workbook not modified. No deployment.
Follow-up closeout checkpoint20:32:20+07:00 minus20:27:49 =4m31s elapsed; initial pre-clock read and final record-write duration not measured, no explicit pauses; active/waiting split not measured. Forecast7-12min; narrower direct fix and fast affected checks finished sooner. Coding tokens unavailable. Main avoidable rework was serving an old process after rebuilding its .next directory. One workflow correction: stop the identified local server before rebuilding, restart from that project and confirm served build ID plus actual browser label before handoff. Prior role-based locator correction helped: affected calculator walkthrough passed first attempt. Base8dcb0038e134ca087d97e4d1f31e20c208bedc6f remains pushed; this follow-up unstaged/uncommitted on milestone-4-calculator. Required fields checked; M4.2 acceptance still pending.

### M4.2 review/correction checkpoint - 2026-10-21
Protocol loaded: live F1 and current M4.2 row read. Start2026-10-21T20:00:46+07:00 (initial Git/read command immediately preceded this clock checkpoint; not reconstructed). Estimate10-20min implementation/read/closeout +10-15min affected verification =20-35min elapsed, medium confidence, calibrated against earlier21m42s resumed delivery with a larger implementation/full browser gate. Coding-token estimate/telemetry unavailable. No active-time claim. Owner authorizes bounded usability corrections, completeness audit, and scoped M4.2 commit/push. Created milestone-4-calculator from a008733, preserving all uncommitted work; no existing local/remote branch of that name. Previous correction applied: use approved focused test entrypoints before wider affected checks.
Roadmap synchronization: live checklist now M4.3 homepage branding/video (not started), M4.4 metric mapping/autofill, M4.5 quantitative review. Historical M4.3 autofill/M4.4 review references below retain their original numbering; current interpretation follows this paragraph. No branding, global factor research, Scope3, autofill or deployment in this checkpoint.

M4.2 completeness against accepted M4.1 (classification: inherited workbook / approved correction / new UI choice):
| Required capability | Implemented evidence | Missing/deferred item |
|---|---|---|
| Scope1/2 measured activity, units and multi-location totals (inherited + corrected references) | calculator domain; accepted gas/fuel/mileage/refrigerant/heat/process and multi-site numeric cases | Therm/mileage energy unavailable where reference conversion is absent; no invented factors |
| Energy, water, waste and intensities (inherited + approved corrections) | Separate unit conversion incl MWh/kWh and tonnes/kg; USD/millions; source water totals and waste subsets | No FX selection; partial-period water stays period quantity, not annualized |
| Missing/zero, denominator and overlap handling (approved corrections) | Explicit complete/none/incomplete choices; contradictions rejected; absent quantities unknown; zero/negative revenue leaves absolute results; duplicate location/source rejected | Differently named overlapping sources require honest user identification |
| Renewable shares separate from location-based emissions (approved correction) | Electricity and total-energy percentages computed independently without Scope2 deduction | U-026 mapping unresolved; no market-based claims |
| Geography dropdown (inherited interaction restored) | Supported China geography selector and only compatible factor options; no typed spelling required | Factor validity year/geographic suitability still unverified, reference-only; no global fallback |
| Correction/review/persistence (accepted requirement + new UI choices) | Full-page Data Input; Business location example; automatic UUIDs; Quantity before Unit; recalculation/refresh; manual/Skip preserve answers and methodology | Browser-tab persistence, not durable evidence repository; one previous reviewed snapshot, not full audit history |
| Spend/bin estimates (documented formulas only) | Deliberately absent from initial measured-quantity package | Require attributable prices/currency/period or kg/lift; not a current measured-fixture blocker |
| Autofill, uploads, Scope3 | Not implemented in this step | Autofill M4.4; U-026 pending; Scope3 excluded; extraction outside M4.2 |
Review found two genuine small specification gaps and corrected them: MWh conversion and negative revenue retaining absolute quantities. No additional blocking requirement found in the accepted measured-quantity package. No workbook/fixture edits, methodology replacement or canonical scoring changes. UI uses existing components/styling; no technical factor-cell metadata required to fill the form. Historical provenance remains in calculation details. Current correction checkpoints reuse existing approved calculator test files, including selector/coverage expectations; no broader test expansion.

Workbook interaction provenance (read-only XML inspection): `3·Scope 2!B3` has a list validation referencing `Factors!$A$19:$A$37`; labels in A19:A36 and values in C19:C36 provide China national plus 17 provincial grid factors. A37/C37 is labelled Global average but cites MEE national (fallback); it remains excluded under CALC-05. The dropdown has showErrorMessage=0, so its existence is not proof of strict Excel rejection. Other fuel/GWP references include DEFRA/IPCC labels without verified geography/year. Beta entry now explicitly says China grid factors; it does not mislabel all non-electricity arithmetic as China-only. Search is case-insensitive and selection supplies the canonical geography; factors are filtered to match.

Information architecture: workbook supplies source/activity quantities, units, factor/geography selection and calculation categories. Full-page source cards, generated internal IDs, review/persistence controls and explicit coverage choices are v2 UI choices, not a reproduction of workbook layout. Manual means enter known values in the questionnaire; Skip means proceed without calculating now. Both preserve existing answers and use identical assessment methodology. Coverage applies to all relevant sources in the reporting period/boundary: complete requires entered sources, none explicitly confirms zero applicable sources, incomplete retains unknown totals/known subtotals. A blank entered quantity stays unknown even with complete coverage.

Affected verification after review corrections: calculator unit16/16, existing assessment browser25/25, final calculator browser1/1 (7.7s test;15.7s runner), typecheck, affected ESLint and production build passed. Retain prior291/291 unit/Golden and75/75 full browser evidence for unaffected behavior; no full-gate restart. Initial calculator browser setup raced with restoration; seeded the existing fixture before app initialization. The coverage dropdown locator was then corrected to its accessible role/name; assertions and numeric tolerances preserved. These were test setup/locator failures, not evidence of a calculator formula failure. Final calculator walkthrough verifies case-insensitive search, compatible factor options, explicit coverage, recalculation/refresh, mobile width, Manual/Skip persistence and unchanged questionnaire answers. No provider calls or new fixtures.

Checkpoint handoff: scoped files reviewed; original workbook, accepted fixtures, scoring/canonical configuration and dependencies unchanged. Unrelated staging/incident/.agents work excluded. Commit/push authorized to milestone-4-calculator; no merge/deploy/acceptance claim. Final SHA, publication status and end/elapsed comparison will be recorded once in live F22 after publication so Git/PM closeout is included rather than estimated. Coding-token telemetry unavailable.

### M4.2 active step — 2026-10-21
Live F1 and v2.0 rows21–23 read, including notes. Latest owner accepted M4.1 despite stale pending checkbox; M4.1 published as215b7f0 on milestone-3-recommendations. Protocol loaded; M4.2 only. Scope: pure deterministic calculator domain, validated input/result boundary, standalone calculator UI with correction/stale handling, units/coverage and traceable historical factors. No M4.3 mapping/autofill, Scope3, scoring/config changes, paid calls, dependencies or deployment. Historical factors explicit reference values, not production-approved/global; U-026 autofill held. No new factor decision blocks historical-reference implementation.
Pre-implementation start2026-10-21T17:15:27+07:00. Expected active4–10h (row22), low-to-medium confidence for engine/UI/verification; elapsed dependent on verification and owner response. Expected coding-token range unavailable (uncalibrated), actual telemetry unavailable. Active/waiting split not measured. Base215b7f0; unrelated staging/incident/.agents work preserved; M4.2 changes uncommitted. Focused test approval requested asynchronously for calculator.test.ts/calculator.spec.ts using accepted fixtures; no new tests authored until approved. Reuse saved typecheck/lint/build/full gate once at final candidate. No synthetic UI demo without authorization.
Owner protocol correction2026-10-21: M4.2 paused; proposed calculator checks and UI layout remain unapproved. Revised REMAINING elapsed delivery forecast: implementation60-100min (remaining reading, domain/boundary completion, UI/persistence integration and documentation closeout); verification35-55min (includes proposed focused calculator check authoring/execution, one saved release gate and bounded affected fixes). Combined95-155min, no overlapping allocations; explicit approval/overnight pauses excluded and recorded separately. Conditional on approval of the checks/layout; no tests authorized by this forecast. Low-to-medium confidence: M4.1 took27m33s overall with an included10-minute continuation versus30-60min forecast, but M4.2 adds executable runtime, persistence/UI and a full application gate; no blanket multiplier. Existing partial implementation reduces remaining work. Previous4-10h forecast retained above as historical; already-spent delivery time cannot be reconstructed from incomplete session boundaries. Coding tokens unavailable. This protocol-only interruption is separate from M4.2 delivery; no new M4.2 code or checks executed during it. Standing protocol published as a008733a888373f18d0cd77bd853be8ef0db557e; M4.2 remains uncommitted.
Resume2026-10-21T17:43:43+07:00: protocol loaded and live F1/row22 reread. Owner approved proposed focused calculator checks and placement within existing full-page Data Input, existing styling/components, manual/calculator/Skip options, preserved entries and reviewable calculated values. No modal, separate design system or M4.3 autofill. Remaining forecast implementation60-100min plus verification35-55min =95-155min elapsed delivery, including reading/closeout and proposed checks, unchanged low-to-medium confidence/calibration above. Coding-token telemetry unavailable. Approval/protocol interruption preceded this session; exact earlier pause boundaries not measured, no reconstruction.
Previous workflow correction applied: exact workbook and method already approved, U-026/factor provenance isolated per calculation rather than blocking independent implementation. Result/published SHA/end/effort audit pending closeout.

#### M4.2 implementation review - ready for owner review
- Existing full-page Data Input now offers manual entry, calculator and Skip; upload remains unavailable. Existing field/choice/card styling, no modal, new route or design system. Manual/Skip preserve calculator entries and existing questionnaire answers. Calculator values are explicitly for review, not automatically transferred to assessment answers.
- Pure calculator domain + strict application boundary + separate validated sessionStorage adapter/reducer. Raw entries and previous reviewed inputs persist in the tab; derived values recompute on restoration. Edits immediately hide current results until Calculate for review. Incompatible saved calculator data yields a warning without touching assessment answers.
- Explicit period, source/site identity, units, historical factor selection/geography, evidence reference, source coverage and optional same-period revenue. Scope1/2, energy, water, waste, USD intensities and separately labelled renewable-electricity/total-energy shares. Partial coverage gives known subtotals; blank remains unknown; confirmed zero stays zero; zero/missing/non-USD revenue leaves absolute quantities available without invented FX. Overlapping site/source entries fail; users must identify the same physical source consistently. This is not proof that differently named sources never overlap.
- Historical runtime factor catalog is copied from accepted factor records, not synthetic fixture cases. Original workbook and accepted fixtures remain untouched. No global fallback or production factor approval. Therm/mileage energy remains unknown where reference conversions are absent; spend/bin pathways are not invented. Explicit renewable portions never discount location-based Scope2 emissions. U-026 mapping and all M4.3 autofill remain pending; Scope3 excluded. No scoring, canonical configuration, retrieval/provider or deployment change.
- Approved unit checks reuse accepted numerical expectations with the existing 32*EPSILON*max(1,abs(reference)) binary64 policy. Browser check uses the existing assessment setup and accepted electricity/correction values to cover review, edit invalidation, refresh, manual/Skip and unchanged answers. Existing calculator-disabled assertion updated to enabled, other assertions preserved. No new synthetic product or provider call.

Verification closeout: all saved release-gate phases completed successfully. Focused calculator unit checks16/16; full unit/Golden suite291/291 across34 files; full browser suite75/75 (7.4min), including the new Data Input calculator walkthrough and unchanged-answer checks. Typecheck (including pure-domain boundary), ESLint and production build passed. Initial gate stopped on a test fixture lookup type error; corrected without changing expectations. Browser collection initially rejected an unnecessary test-side import of the runtime JSON; removed that import. Review aligned save/load size bounds for supported drafts. Only affected checks/build were repeated; the full unit suite was not restarted. The final focused numeric comparisons use existing NUMERIC-POLICY tolerance, not widened decimal-place assertions. Existing inactive I-045 config warning remains unchanged. No paid provider calls, installed dependencies, canonical/scoring/BUILD_PACK edits, staging, commit, push or deployment for M4.2. Unrelated incident/staging/.agents changes preserved; generated build/test outputs remain excluded from Git.
Manual review: Setup -> Data Input -> calculator; enter period/site/source/quantity and explicitly select a suitable historical reference factor/geography, confirm coverage and limitations, Calculate for review. Edit a quantity and observe results disappear until recalculation; refresh and switch Manual/Skip to confirm entries persist. Questionnaire answers receive no automatic transfer. Owner acceptance remains pending; no factor decision blocks this historical-reference implementation. Production factor suitability remains unresolved by design.

M4.2 completion effort (recorded once): resumed session 2026-10-21T17:43:43+07:00 to closeout checkpoint2026-10-21T18:05:25+07:00 =21m42s measured elapsed delivery, including reading, implementation, verification and closeout. Forecast60-100min implementation plus35-55min verification =95-155min remaining; proposed calculator checks included. No approval/overnight pause occurred in this resumed interval. Earlier interrupted M4.2 work and protocol/approval pause boundaries were not fully measured, so whole-step delivery total remains not measured; do not treat21m42s as the whole-step total or active time. Coding-token forecast/actual telemetry unavailable. Variance: resumed delivery was shorter than forecast because the accepted specification, existing partial domain code and existing UI/persistence patterns allowed a small implementation, and saved checks completed without application regressions. Main avoidable rework: new test-entrypoint typing/JSON-import corrections. At most one proposed workflow correction: check new test-entrypoint compatibility during existing focused verification before the package gate; PM records the decision, next applicable step checks its effect. No new timing/test tooling. Base a008733a888373f18d0cd77bd853be8ef0db557e on milestone-3-recommendations is published; M4.2 changes unstaged/uncommitted, no new SHA/push/merge/deployment. Required effort fields checked; missing historical measurements explicit. Owner review pending.

### M4.1 accepted step — 2026-10-20 delivery / 2026-10-21 acceptance
Owner continuation confirmed the exact Advanced workbook as working reference, approved correcting confirmed formula-reference/missing-data/double-counting defects in the implementation specification, and required renewable share separate from location-based emissions. U-026 autofill remains an individual unresolved mapping, not a package blocker. Prior requests to select replacement factors or resolve U-026 before independent work are superseded. Scope3 is discovery only; do not add functionality absent from the reference. Complete supported numerical fixtures with explicit historical factor provenance; no M4.2.
Continuation protocol: live F1 and row21 reread; no conflicting new row note. Start2026-10-20T21:57:29+07:00; expected active30–60min, medium confidence for bounded spec/fixture completion using existing evidence. Expected and actual coding tokens unavailable; active/waiting split not measured. Latest owner authorization covers numerical fixture creation and arithmetic/source readback for these fixtures; no new engine test runner or application tests. Original start and provisional forecast below remain historical evidence.
Protocol loaded: live F1 and v2.0 row21 values/notes read before implementation; row21 incomplete, M3 accepted, M4.0 closed. Current owner authorizes M4.1 only; changes uncommitted. Scope: reconcile preserved emissions workbook against spec and active metric contracts, document verified formulas/units/discrepancies, prepare calculator regression fixtures where methodology is unambiguous. No M4.2 engine/UI, scoring/config change, factor invention, tooling installation or paid calls. Preserve BUILD_PACK and unrelated local work.
Pre-implementation start2026-10-20T21:39:56+07:00; initial governance reads excluded. Expected active2–6h (checklist provisional), low confidence pending formula audit; elapsed depends on methodology decisions and is not forecast reliably. Expected coding-token range unavailable (uncalibrated); actual telemetry checked: unavailable. Active/waiting split not measured. Base736823eca9cdfcbfe57f30da4b1648c3ed127ff3, branch milestone-3-recommendations. Runtime unchanged at entry; unrelated staging/incident/.agents work preserved. End/elapsed/variance pending completion. Previous correction applied: live protocol/row reconciled first; no reopened M3 or tooling work.
Read-only workbook/source inspection is evidence gathering, not a new test harness. New executable regression checks require the existing approval process before creation/execution; fixture expectations involving disputed methodology remain blocked for owner review. No full verification gate for documentation-only findings.

### M4.1 initial evidence reconciliation — historical proposals resolved below
Read-only workbook/formula inspection; no workbook recalculation or test execution claimed. BUILD_PACK, runtime, canonical config and scoring unchanged. Fixtures below are review specifications, not executed regression cases or application data. Existing scoring Golden cases are not calculator oracles.

**Source identity.** The operational workbook is `BUILD_PACK/10_RESEARCH/alan_henry/raw/SME_ESG_Calculator_China_Advanced.xlsx`, SHA256 `c9457d72bced186be7994b805bd2312673b7c345797166ec60bac688061e9dee`. `BUILD_PACK/10_RESEARCH/emissions/raw/ESG_Intensity_Proportion_Calculator.xlsx` and its alan_henry copy share SHA256 `b753c27c288a28094ec915f36ff5d3e62091e937ea9e43fbca1596c4a2b656f4`; their two sheets calculate indicator-weight proportions, not operational emissions. Neither file is edited. Operational workbook has no external links, named ranges or cell comments; representative formula caches Scope1 F9, Scope2 F9 and Summary B8 are absent. Formula inspection does not establish Excel execution parity.

**Verified formula/discrepancy register (all cell names below refer to the operational workbook).**
| ID | Evidence | Disposition / proposed treatment |
|---|---|---|
| CALC-01 | `2·Scope 1!F5` money branch multiplies gas kWh by `Factors!C63=1` (energy content), unlike quantity branch using C13:C15 emissions factors. `13·多厂区 Sites!I6:I15` repeats C63. | Confirmed dimensional mismatch. Proposed gas emissions factor is workbook C13=0.184 kgCO2e/kWh, subject to factor provenance approval; do not port energy content as emissions. |
| CALC-02 | `2·Scope 1!F6` uses C65=10.7/C66=9.7 kWh/litre for vehicle emissions, both litres and spend branches. Workbook emissions factors C7=2.68/C8=2.31 kgCO2e/litre exist. | Confirmed wrong factor family; correct only under approved reconciliation, preserve original as historical defect. |
| CALC-03 | `2·Scope 1!F9`, `3·Scope 2!F9`, `4·Energy!E9`, `6·Waste!F9` use SUM of blank outputs. Summary B5:B7 inherits zero. Energy B12 treats missing renewable numerator as zero. Summary B49:B52 hides genuine zero site totals. | Conflicts with spec sections5/15: missing, partial and genuine zero must remain distinct. Preserve known subtotals with explicit coverage, not a complete inventory inferred from missing inputs. |
| CALC-04 | `3·Scope 2!F6=-F5*D6/100`, included in F9, deducts any declared renewable share. | Spec requires evidence for market-based claims. Propose location-based electricity result without this automatic discount; renewable share separate. Needs owner methodology decision before fixtures define final emissions. |
| CALC-05 | Scope2 D3/F5 and site H6:H15 silently fall back to Factors C37, labelled Global average but sourced as MEE national fallback. Provincial rows say MEE~; most factors have organisation abbreviations but no source URL/year. | Not a validated global factor library. Preserve historical factors for reference; no global fallback or production factor approval inferred. Need chosen geography/year/source/version. |
| CALC-06 | Company B7 is millions; B8 is CNY. Summary B8 divides tCO2e by millions of revenue; canonical carbon metrics require tCO2e/USD. Energy B13 is MWh/million revenue; canonical unit kWh/USD. Water B9 m3/million revenue; canonical m3/USD. | Convert amounts/units explicitly and require reporting-period USD revenue (or attributable FX). Never relabel CNY/million as USD. No implicit FX rate. |
| CALC-07 | Typical prices Factors C78:C83 have source 'edit', no currency/date; waste bin masses C71:C74 say 'approx'. | Spend/bin pathways are estimates requiring explicit, attributable user values; do not silently adopt defaults as verified evidence. |
| CALC-08 | Scope1 F9 sums fuel F6 plus mileage F7 without deduplication. Process B9 sums measured emissions plus calculated clinker/lime. Summary B7/B8 ignores separate site gas totals and process totals. | Need mutually exclusive methods per source and explicit single-/multi-site boundary; avoid double counting and omitted emissions. Propose one source-level calculation per activity, selected site coverage and separately identified process sources. |
| CALC-09 | Company revenue checks mostly test blank only; zero can divide by zero. Scope3 calculation sheets absent. Water main-supply-only input does not establish all-source withdrawal. | Zero denominator invalid; partial Scope3 stays partial/unknown; preserve source coverage. No invented Scope3 model or all-source total. |
| CALC-10 | U-026 text asks all-energy renewable share; active MET_RE_SHARE benchmark name says renewable electricity share. Energy B12 uses total energy denominator. | Genuine existing semantic conflict; do not change canonical config or auto-map calculator share until owner selects intended denominator. |

**Metric join/units verified from active canonical files (no modifications).** I-052–I-056 map to carbon_intensity_{bus,cg,const,food,manuf} in tCO2e/USD; I-058–I-062 to energy_intensity_* in kWh/USD; I-065–I-069 to water_intensity_* in m3/USD; I-071–I-075 to waste_intensity_* in kg/USD. U-031 waste_diverted_percent and U-032 hazardous_waste_percent use percent; IM-5/IM-6 water_withdrawal_m3 uses m3/yr and question text requests source breakdown. U-026/MET_RE_SHARE '%' is blocked by CALC-10. Do not map by similarly worded questions or alter industry applicability. Water totals require all included sources; waste tonnes convert to kg before intensity. USD denominator must match period/boundary; do not round intermediate inputs. Accepted M3 Skip-clears-answer behavior supersedes historical Skip-retention wording in NUMERIC-POLICY; no reopening that accepted behavior.

**Fixture specification, pending factor/method decisions (spec section17).** No new fixture file, runner or executable assertions added.
| Case | Expected relationship / state | Evidence and remaining dependency |
|---|---|---|
| Electricity only | kWh * selected kgCO2e/kWh /1000 = tCO2e; unreported sources remain unknown | Scope2 F5 quantity branch; approved factor identity/geography/year and coverage required |
| Electricity + stationary fuel | Separate electricity and gas results, then sum only compatible complete boundaries | Scope1 F5 quantity branch; exclude erroneous spend factor; selected factor required |
| Vehicle fuel/mileage | litres * kgCO2e/litre /1000 OR km * kgCO2e/km /1000 for same source, not both | CALC-02/08 decisions; exact miles conversion must be explicit (legacy uses1.609) |
| Multi-site | Sum site-specific emissions after per-site factors; record missing site/activity coverage | Sites H/I/J; CALC-01/05/08; no top-level duplication |
| Renewable mix | renewable quantity / approved denominator *100; share alone does not establish emissions discount | CALC-04/10 require owner decision |
| Missing revenue | Absolute known quantities retained; intensity unknown. Zero revenue invalid | Spec7/15, CALC-06/09 |
| Partial Scope3 | Categories included/excluded explicit; no complete Scope3 inventory or Scope1+2 contamination | No legacy Scope3 oracle; no new category method invented |
| Evidence correction | Corrected activity supersedes prior candidate, provenance retained, dependents stale until recalculated | Spec12/13; input-resolution fixture only, upload UI/extractor outside M4.1 |
| Genuine zero | Explicit zero activity gives zero for that source; does not imply absent sources are zero | Spec5/15; no denominator-zero intensity |
| Blank/unknown | Unknown source/total stays unknown; known subtotal marked incomplete | Spec15, CALC-03 |

**Historical decision requests — superseded by the owner continuation and reconciled specification below.** (1) Approve corrected factor-family references and explicit coverage/deduplication instead of reproducing the documented workbook defects. (2) Select first supported geography/factor source/year; recommend direct measured activity and explicitly supplied same-period USD revenue initially, with spend/bin estimates disabled until attributable prices/densities exist; reject silent global fallback. (3) Confirm location-based electricity emissions without automatic renewable deduction and decide whether U-026 means all-energy or electricity-only share. Recommendation: keep emissions and renewable share separate; do not resolve the existing canonical semantic conflict silently. This is a methodology/evidence stop, not routine implementation permission. No M4.2 code started; M4.1 remains incomplete pending decisions and approved numerical regression coverage.

### M4.1 implementation specification — reconciled reference v1
**Authority and scope.** Owner explicitly selected `SME_ESG_Calculator_China_Advanced.xlsx` as the working reference, subject to audit; this resolves the earlier inferred source selection. The source/hash above is unchanged. The owner approved correcting confirmed formula-reference, missing-data and double-counting defects in this implementation specification. This section supersedes pending-decision wording in the initial audit. Scope is Scope1/2, energy, water and waste quantitative inputs only. Scope3 was subsequently excluded explicitly: no Scope3 fixture, method, engine or further investigation. U-026 remains a mapping hold only. This is specification/regression data, not M4.2 implementation or production factor approval.

**Factor provenance and geography (preserve, do not replace).** Workbook company reporting-year default is2025 (`1·Company!B5`), currency CNY(RMB) in B8, revenue in millions in B7. This is not a factor publication/validity year. `Factors` has no factor-year column, URLs, cell comments or hyperlinks; row labels alone do not independently validate editions or geography. A complete56-record inventory of relevant numerical factors is in `app/tests/fixtures/calculator-reference-v1.json`; IDs `legacy-C<row>` identify their preserved value cells and version `china-advanced-workbook-c9457d72bced` ties them to the source SHA. Each record stores the original label/unit/value/source, geography where stated, null validity year/source URL and `production_approved:false`. These are test/reference identities, not new canonical configuration entities or an active production factor library.

| Family / cells | Preserved values / evidence | Applicability limit |
|---|---|---|
| Combustion C6:C9, gas-unit C13:C15 | DEFRA label; gas0.184 kgCO2e/kWh,2.02 kgCO2e/m3,5.29 kgCO2e/therm; diesel2.68, petrol2.31, LPG1.56 kgCO2e/litre | Source edition/year and use geography unspecified; energy basis/gas coverage not documented |
| Grid C19:C36 | China national0.5703 labelled MEE; seventeen provincial rows labelled MEE~, e.g. Sichuan0.14/Shanxi0.79 kgCO2e/kWh | Provincial approximations, no validity year; not global factors |
| Grid C37 | Label Global average, value0.5703, source MEE national(fallback) | Misleading global label; never silently select this fallback |
| Heat C41 |0.17 kgCO2e/kWh, DEFRA | Source edition/year/geography unspecified |
| Refrigerants C45:C50 | AR5-labelled GWP values, e.g. R-410A2088 | Retain AR5 label; reference does not supply citation or GWP time horizon; top-up proxy applicability must be explicit |
| Mileage C54:C58 | DEFRA per-km values; Diesel van0.253 kgCO2e/km | Vehicle assumptions/year unspecified; no fuel-use/energy inference |
| Energy C62:C67 | Electricity/gas-kWh1; gas-m310.55, diesel10.7, petrol9.7, LPG7.1 kWh/input-unit, IPCC on conversions | Energy factors are never emissions factors; no therm-to-kWh conversion in this reference |
| Waste bins C71:C74 |110/30/45/80 kg per lift, source approx | Estimates require named bin type and evidence; never substitute for measured mass silently |
| Prices C78:C83 |0.15/0.07/1.5/1.4/0.08/2, source edit | Currency/date not stated. No implicit CNY or FX inference; user-attributable unit prices required before spend conversion |
| Process C92:C93 | Clinker0.52, lime0.75 tCO2e/t, IPCC | Source edition/year/boundary unspecified; measured and activity estimates must not overlap |

**Calculation contract for M4.2 to implement later.**
1. Every activity carries a stable source/site identity, reporting period, activity type, quantity/unit, method, provenance and confirmation state. Every factor-based result cites exact factor ID/version and original operand. Preserve raw inputs; use finite nonnegative numeric quantities with explicit units. Reject invalid nonblank/negative/nonfinite values; do not repair them to zero. Annual revenue for intensity is positive and matches the numerator's period/boundary. This describes a contract, not a replacement of existing state/API architecture.
2. `source_tCO2e = activity * factor_kgCO2e_per_activity_unit /1000`; process factors expressed in tCO2e/t do not divide again. Gas-by-unit uses C13/C14/C15; gas-spend resolves kWh first then uses C13, not C63. Vehicle litres use C7/C8 (fuel type), not C65/C66; those latter factors remain valid only for energy. Site gas uses C13, not C63. Kilograms of refrigerant multiplied by its preserved GWP then divided by1000 is the legacy proxy, explicitly flagged; no assertion of modern regulatory compliance.
3. Scope2 location-based electricity uses an explicitly selected matching geography factor. Heat uses its own factor. Sum compatible source results; do not deduct a renewable percentage. A missing or unmatched geography/factor leaves that emissions result unresolved while the measured energy quantity remains available. Historical factors may support these reference fixtures; activating real-world factors requires attributable geography/year/source decisions at the affected path, not a blocker for all arithmetic/specification work.
4. Choose exactly one method per physical activity/source/period (e.g. litres OR mileage, measured process OR activity estimate). Multiple records may be summed only for non-overlapping activity portions with explicit identity/coverage. Reject unresolved overlap rather than silently choose one. Company totals are either the aggregate of selected site records or a declared company-level input, never both added together. Process emissions join Scope1 once; site Scope1/2 join company totals once. A standalone subtotal must not be presented as a complete company inventory.
5. Preserve states: provided zero; unknown/not provided; explicitly not applicable; unconfirmed extracted input; partial known subtotal; invalid input. Missing/unknown must remain null/unavailable, not numeric zero. Complete totals require all declared applicable sources covered. Non-applicable sources are excluded explicitly, not inferred from blank cells. All-known zero activities produce genuine zero. Partial totals expose a known subtotal and coverage flags; complete inventory/derived intensity stays unresolved where missing sources could change it. An unknown renewable quantity does not block otherwise known location-based emissions.
6. Energy is the sum of non-overlapping, compatible, known consumption quantities converted to kWh: electricity kWh; gas kWh or gas m3*C64; liquid fuel litres*C65/C66/C67. Preserve energy conversions separately from emissions. No energy estimate from mileage, refrigerants or missing therm conversion. Purchased heat supplied in kWh can be retained as its own known energy quantity; any total must declare included activity classes, not claim complete coverage while omitting purchased heat. Renewable share may be calculated for explicit electricity and total-energy denominators separately; renewable quantity cannot exceed its matching denominator. Zero denominator gives undefined share, not0%; unknown numerator remains unknown.
7. Water totals are measured withdrawal by source, summed once in m3. A mains-only workbook input is a mains subtotal unless other applicable sources are explicitly covered/not applicable. `water_withdrawal_m3` maps to m3/yr only for a complete annual reporting period; do not annualize partial periods silently. Waste streams use measured tonnes or kg, converted before aggregation; hazardous classification is a subset, not an additional stream. Diverted mass is recycled/reused/composted or recovered material with documented destination; not inferred from a bin label alone. Rate=diverted_mass/total_mass*100, hazardous fraction similarly; numerator cannot exceed total, and zero total yields undefined rate. The source workbook's food/organic-as-recycling assumption must be explicit confirmed composting/recovery, not automatic diversion.
8. Intensity uses canonical units: tCO2e/USD, kWh/USD, m3/USD, kg/USD. Revenue entered in millions is multiplied by1,000,000 before division; MWh*1000=kWh and tonnes*1000=kg. Preserve CNY amounts as CNY. Require an explicitly confirmed same-period USD amount or an attributable conversion before resolving USD intensity; never select an FX rate. Missing revenue leaves absolute quantities available; zero/negative revenue invalidates intensity, not the independent absolute calculation.
9. Spend-based quantity=spend/unit_price only where currency, price unit, period and provenance are explicitly supplied; reject/hold absent or nonpositive prices. Bin counts require documented kg/lift and estimated-data flags. These formulas are reconciled, but unknown workbook price currency/date does not authorize live default use. The initial supported fixtures use measured quantities; no invented prices, FX, international factors or time series.
10. Preserve accepted numeric policy: raw decimal source strings; finite binary64 at future calculation boundary; no intermediate display rounding; exact IDs/units/status/coverage matching. Numerical fixtures use independently calculated decimal expectations, not rounded workbook outputs or future engine self-oracles. If executed against binary64 later, use the existing NUMERIC-POLICY comparison bound; no relaxed tolerances. Formula caches inspected are absent, so no Excel parity/recalculation claim is made.
11. Confirmed input correction replaces the effective activity, retaining original evidence and supersession provenance. Dependent quantities become stale and must recompute before autofill; never accumulate old plus corrected amounts. Unconfirmed extraction stays unavailable for scoring. This is an input-contract fixture only; upload/extractor/session/UI implementation belongs to later authorized steps.

**Autofill mapping readiness.** The exact question/metric/unit joins listed in the initial audit remain unchanged. Resolve by existing metric_id and selected industry/period, never by text or question position. Carbon/energy/water/waste intensity families are eligible only when units, boundary, completeness and factor applicability are satisfied. U-031 waste_diverted_percent and U-032 hazardous_waste_percent use explicit mass ratios; IM-5/IM-6 retain source breakdown with the annual total. U-026/MET_RE_SHARE is deliberately pending: both share quantities may exist, but neither automatically fills the question. This hold does not affect other metrics. No QuestionBank, benchmark, selector or scorer changes.

**Numerical fixtures delivered.** `app/tests/fixtures/calculator-reference-v1.json` is offline regression data, with22 cases and56 historical factor records. It includes complete electricity/gas arithmetic and USD intensity; corrected vehicle factors; gas unit variants; mileage; refrigerant/heat references; corrected per-site aggregation; renewable share without emissions deduction; measured water/waste ratios; explicit USD-million conversion; missing/zero/non-USD revenue; zero/blank/partial activity; overlapping vehicle methods; unknown grid geography; confirmed input correction; process-method alternatives; missing renewable quantity. Each case includes source refs, input operands, intermediate expressions/expected decimals, units, output states and quality flags. All cases are marked non-production-autofill because they are reference test data; that marker is not a new runtime schema or a ban on future approved calculator autofill. `legacy-C37` is recorded only as audit evidence, never used by a fixture. No Scope3 case or new executable test runner.

**Unresolved items, not package-wide blockers.**
- U-026 denominator semantics/autofill: held individually, no canonical edit.
- Real-world factor release: geography, validity year, primary citation and applicability for imported DEFRA/IPCC/AR5/MEE-labelled values remain unverified. No replacements chosen. Resolve only when activating that factor for a concrete calculation; China factors are not global.
- Optional spend/bin/miles paths: price provenance/currency/date, bin-mass support and an explicit miles conversion policy (legacy1.609) remain needed before those paths become trusted production outputs; km/measured-mass paths remain supported.
- No cached Excel outputs/recalculation evidence; mathematical expectations are independently authored, not historical captured outputs. M4.2 engine integration and executable regression suite remain unimplemented and require their own authorized step.

### M4.1 owner acceptance and publication — 2026-10-21
Owner accepted the reference specification and fixture package, including limitations, and authorized scoped commit/push. Live F1 and rows21–23 read: Sheet row21 still says pending; this latest explicit acceptance supersedes it. PM reconciliation needs final commit SHA/push state, not inference from checkbox. Source reviewed: four control Markdown files and only app/tests/fixtures/calculator-reference-v1.json; no credentials/private responses/ledgers/generated outputs in scoped changes. Existing unrelated files excluded. Publication task expected5–10min; measured start2026-10-21T17:13:46+07:00; token estimate/actual unavailable; active time not measured. No tests rerun for previously verified reference data; no method changes. Publication completion/SHA provided in handoff. M4.2 begins after publication and its own effort record.

### M4.1 closeout evidence — 2026-10-20
- Delivered reconciled implementation specification in this existing document and `app/tests/fixtures/calculator-reference-v1.json`; no new review document or runtime engine. Exact workbook confirmed by owner; all approved corrections specified, Scope3 excluded, U-026 held individually. No additional factor decision blocks delivery of these reference fixtures. Production factor activation and later engine implementation are explicitly unverified.
- Verification: JSON readback;22 unique cases,56 factor records matching original workbook cells and51 arithmetic expectations checked independently with Python Decimal. Factor IDs/versions and joins consistent; no fixture uses misleading C37 global fallback; all reference data non-production. Workbook SHA unchanged: c9457d72bced186be7994b805bd2312673b7c345797166ec60bac688061e9dee. No formula-cache/native Excel recalculation or engine-test parity claim. Saved `git diff --check` passed. No BUILD_PACK, app/src, canonical config or package/lock changes. No application test rerun: deliverable is specification and numerical data, with no calculator runtime implemented.
- End2026-10-20T22:07:29+07:00. Measured whole-step wall interval from21:39:56 is27m33s, includes owner clarification/waiting; active/waiting split not measured. Latest continuation21:57:29–22:07:29 is10m, not an additional total. Initial governance reads and final closeout write/readback excluded. Actual coding tokens unavailable. Whole-step active forecast2–6h and continuation30–60min were provisional; they are not comparable to unmeasured active time. Work was narrowed to supported reference arithmetic with prior audit reused, no engine, external factor replacement or test harness. Do not reconstruct historical active effort.
- Main avoidable rework: first treating unresolved U-026/global-factor choices as blockers to all fixture work. One proposed workflow correction: isolate unresolved mappings/factor applicability per calculation while completing independently supported reference cases. The prior F1-first correction was followed; evidence of a measured efficiency gain is unavailable. PM records the decision and next applicable step evaluates it.
- Base commit736823eca9cdfcbfe57f30da4b1648c3ed127ff3, branch milestone-3-recommendations. This specification/fixture delivery is unstaged/uncommitted/unpushed; no merge, deployment, paid calls or M4.2. Existing unrelated staging/incident/.agents work preserved. Required protocol fields checked; PM reconciliation target v2.0 row21. Completion checkbox/human acceptance not changed by Codex.

### Documentation synchronization checkpoint — 2026-10-20
Protocol loaded from live F1 and rows20–21 before edits. Scope: reconcile four existing Markdown files and publish only those files; no tests, installs, automation, runtime changes, merge or M4.1 implementation. Expected active5–10min, medium confidence; expected coding tokens unavailable (uncalibrated); actual telemetry unavailable. Measured start2026-10-20T21:24:59+07:00 before edits; earlier reads excluded. Base316c82582c9863fdfc756a7154c21fc9fc687efb, branch milestone-3-recommendations; index initially empty, unrelated local files preserved. Owner authorizes this scoped documentation commit/push only. Final SHA/publication outcome supplied in handoff; PM reconciles rows20–21. M4.0 total effort not measured; do not convert superseded forecasts or intermittent timestamps into actual step effort.
Documentation review end2026-10-20T21:26:16+07:00; measured interval1m17s, excluding initial reads and subsequent Git publication. Active/waiting split not measured; coding tokens unavailable. Expected active5–10min cannot be directly compared with partial elapsed. No new avoidable rework evidenced in this checkpoint; proposed workflow correction: use the live F1/row reconciliation before each step to prevent stale status from reopening accepted work. PM records the decision; next step checks effectiveness. Required fields reviewed; final publication SHA/status follows in handoff.


## Current state and effort ledger — 2026-10-20
This section supersedes conflicting historical status/authorization text below; historical evidence remains preserved.
- Active outcome: **M3 COMPLETE — owner accepted 2026-10-20**, including disclosed v7 offline-only verification and deferred issues. Acceptance supersedes earlier failed/pending milestone status; historical findings and evidence remain preserved. Merge and M4 require separate owner approval. No tests or paid generation performed for this documentation-only acceptance.
- Source state: milestone-3-recommendations at implementation checkpoint `fe20fa6`; acceptance documentation remains unstaged/uncommitted. Deployed content revision mosaic-a547751983d355dacd22, image sha256:dcd53f8201fbfaae285be1b8aeb3783772045ebc4eb61a9e53faed2dc18554cd, prompt contract v7. Public URL https://preview.flowagentai.website. Existing unrelated local files preserved; no staging/commit/push/merge by this acceptance task.
- Current authorization: normal public deployment on 2.28.206.236; no login/synthetic product. Existing local MOSAIC key may be transferred securely. $1/day application budget, midnight Asia/Bangkok; two deployed verification calls/$1 separately. No automatic retry or budget reset to evade allowance.
- Historical pre-acceptance-test result: v6 real hosted request accepted; report download, source dialogs, notes invalidation and unchanged51.0/12.1 scores passed. Shared public ledger0 attempts at the earlier automated checkpoint (superseded by the manual-attempt diagnosis below); separate deployment ledger2 attempts/$0.648288 reserved, exhausted by count. No further agent paid tests authorized. Current disposition: owner accepted delivered M3 on2026-10-20 with disclosed limitations; no further correction cycle is authorized. Historical score inputs remain unavailable; general claim entailment is not guaranteed. Egress firewall reboot persistence remains an operational follow-up, not a verified property.
- Current sequence: M3 accepted; M4.0 evaluation complete; M4.1 next. Tool installation/refactoring deferred to optional final pre-shipping QA on a separate branch. This task only publishes documentation; no merge or M4.1 implementation. Model/framework/retrieval research and icon lexicon remain deferred.
- Verification authority: saved test register in codex.prompting.memory.md. New tests require plain-English justification and owner approval before implementation/execution.
- Status visibility: update this section locally at start, blocked, verification and completion. Timestamp in Asia/Bangkok; record task, source revision/dirty state, last result and next action. A shared snapshot is only as current as its publication timestamp.

### M4.0 historical step record — closed by current owner decision — 2026-10-20
- **Current scope correction:** focused tool-selection evaluation only, in order Knip, Prettier, then incremental value of dependency-cruiser. No installation, analyzer execution, refactoring, custom baseline harness or performance study. This supersedes the broader historical scope/estimates/proposed commands below and in the original checklist; PM should reconcile that scope from this handoff. M4.0 is not marked human-accepted.
- Current continuation: protocol loaded; expected active5–10min, medium confidence, using existing audit and official docs. Coding-token estimate/actual telemetry unavailable. Measured continuation starts2026-10-20T20:47:10+07:00 before documentation edits (initial read excluded); original step start below is preserved. Whole-step active/waiting time not measured; old3–8h forecast is superseded, not a forecast for this narrower task. No implementation/test execution.
- Continuation documentation/evaluation end2026-10-20T20:48:22+07:00; measured interval1m12s, excluding initial read and final saved-diff verification. Active/waiting split not measured; tokens unavailable. Whole-step elapsed/active totals cannot be reconstructed from intermittent work. Expected active5–10min cannot be directly compared with this partial elapsed interval. Main avoidable rework: the earlier interpretation expanded a tool check into baseline/benchmark planning. One proposed workflow correction: define the decision the owner needs before introducing measurement work. PM records the decision and the next applicable step checks whether it helped. Base SHA316c82582c9863fdfc756a7154c21fc9fc687efb; branch milestone-3-recommendations; documentation unstaged/uncommitted, no push/merge. Required effort fields checked with unavailable measurements explicit; owner acceptance remains pending.
- Protocol loaded before work; scope: deterministic quality-tool evaluation, reproducible baseline, and only evidence-justified refactoring. Current checkpoint is read-only audit plus this documentation; no runtime changes, tests, installations, new scans or benchmarks executed.
- Start:2026-10-20T20:09:57+07:00. Expected audit/proposal active time10–15min, medium confidence. Whole-step provisional forecast3–8 active hours matches Checklist G20, low confidence until tool/baseline approval and findings. Assumes existing architecture, saved checks and no major refactor. Expected coding-token range **unavailable** (no calibrated baseline); actual coding-token telemetry checked at start: **unavailable**. Active/waiting split **not measured**. End/elapsed and variance are pending step completion, not reconstructed at this interim checkpoint.
- Baseline: branch `milestone-3-recommendations`, HEAD `316c82582c9863fdfc756a7154c21fc9fc687efb`; locally recorded origin matches, no fresh fetch. Existing BUILD_PLAN.md, staging/incident documents and untracked .agents/ preserved. Current documentation remains unstaged/uncommitted, unpublished; no commit/push/merge authorized. PM reconciles the Checklist from handoff evidence.
- Checklist audit: read v2.0 A20:H22 including notes. M4.0 completion is false; M3 accepted; M4.1/M4.2 remain pending. No Sheet edits. The preceding protocol correction is being applied through this single-step record; evidence of delivery-efficiency improvement is not yet available.
- Existing coverage: ESLint10/Next/React/hooks/accessibility rules plus domain-boundary rule/tests; strict TypeScript and separate domain compilation; unit/Golden/browser checks. Retain these. Existing `npm run measure:scoring` measures warm engine and score-endpoint timings across five Golden cases; it does not measure browser render latency or cold startup. No new timing run yet.
- Next: review the focused tool decisions in codex.prompting.memory.md. Earlier baseline-script proposal withdrawn under the narrowed scope. Adoption/execution remains a later decision; no M4.1 work.

### Effort reconciliation and future step protocol — 2026-10-20
Owner requests one milestone step at a time, a pre-work effort audit, ongoing time/token tracking, and a closing variance mini-audit with development-system/architecture recommendations when justified. See AGENTS.md current One-step delivery section. M3 remains accepted; no M4 or merge authorization follows.

Build Checklist v2.0 I14:L19 now records M3.1–M3.6 elapsed/active totals as **not measured**, coding-agent tokens as **unavailable**, and a short per-step audit/recommendation. Headers added at I1:L1. Existing G/H forecasts, statuses, original14 findings, notes and other cells preserved. Values/notes/wrapped formatting verified via Sheets readback; browser visual inspection unavailable because the browser is signed out. The twelve-minute-fifty-one-second disclosure interval and approximately33-minute correction/deployment interval remain partial shared evidence in I19's note, not invented step totals. No numerical variance or additive M3 total can be justified from those records.

Standing per-step protocol (supersedes earlier bundled-step and direct-checklist-update instructions):
- Work on one milestone step at a time; do not silently bundle adjacent steps.
- Before starting each step, explicitly confirm this protocol and the live checklist row/notes have been loaded. Start the delivery record at the first reading/audit session, before implementation: step ID, scope, timestamp/timezone, separate implementation and verification elapsed-time estimates, combined total without overlap, assumptions/confidence and comparable completed work. Record coding-token estimate and actual telemetry availability; unsupported forecasts and missing telemetry are **unavailable** immediately.
- Measure elapsed delivery time across work sessions, including reading, implementation, verification and closeout. Record session start/end timestamps and explicit approval/overnight pauses separately. Sum non-overlapping delivery intervals; retain calendar span and recorded pauses separately. Never label elapsed time active time. Unmeasured intervals remain **not measured**; never reconstruct historical timing, invent active time/tokens or double-count overlapping work/checks. At completion record the end timestamp and elapsed total **once** in the existing step record.
- Calibrate forecasts using comparable completed work and explain scope differences. M4.1 recorded **27m33s overall**; its included final continuation took **10 minutes against a 30–60-minute forecast**. The continuation is included, not additive. Preserve those historical measurements; do not apply a blanket speed multiplier. New runtime/UI work and verification differ from reference-specification work.
- Measure effort to improve delivery efficiency, reduce owner intervention and prevent repeated scope/test churn.
- At each step's closeout, compare expected versus actual effort, identify the main avoidable delay or rework, and propose at most one concrete workflow correction in the existing step record. If evidence is unavailable, say so; do not invent variance or causes. PM records the decision in the existing Build Checklist; the next applicable step checks whether the adopted correction helped and records the evidence or its absence. Do not implement additional tooling merely to measure effort. Proposed architecture/tooling/test changes remain subject to existing scope and approval rules.
- Include the commit SHA and publication state in the handoff: branch, whether changes are uncommitted/staged/committed, whether pushed (or not verified), and PR/merge status when known. Distinguish the base commit from any uncommitted work; never imply a local change is published. Git staging/commits/pushes remain owner-controlled.
- PM reconciles the existing Build Checklist whenever commit/completion evidence is received. Supply the step record and evidence in the handoff; do not claim PM synchronization until confirmed or create another tracking document.
- At closeout verify required fields: protocol-loaded confirmation, step ID/scope, separate implementation and verification estimates and combined total, calibration/assumptions, expected tokens or unavailable, telemetry availability, session start/end timestamps, recorded pauses/calendar span, elapsed delivery total, actual tokens or unavailable, one expected-versus-actual explanation, at most one proposed correction (or none), commit SHA and publication state. Missing evidence stays explicit.


This administrative handoff: expected active10–15min (low confidence), tokens unavailable. Measured elapsed checkpoint12:52:54–12:55:08UTC =2m14s through Sheet verification; initial skill read and final local documentation lie outside that interval. Active time not measured; coding tokens unavailable; no application API calls. Mini-audit: no valid active-time/token variance; missing historical per-step telemetry prevents reconstruction. Recommended correction is the timestamp/token-baseline and single-step protocol above, not a new framework or instrumentation project. Local records remain uncommitted.

### Administrative step DOC-EFFICIENCY — 2026-10-20
Protocol loaded before edits. Scope: add the delivery-efficiency objective and one-correction feedback loop to the three existing protocol documents; commit/push only those documents with the owner-specified message. Expected active2–4min, medium confidence; expected tokens unavailable (uncalibrated); actual coding-token telemetry unavailable, checked before edits. Start2026-10-20T20:05:59+07:00 (13:05:59UTC). Base commit `fe20fa68ad85d39d60f3ce7d39fc7778b09d2488`, branch `milestone-3-recommendations`. Index initially empty; unrelated changes excluded. Owner explicitly authorizes this three-document commit/push only; no tests, deployment or merge. Final commit SHA/push outcome will be in the handoff, avoiding a self-referential commit hash in its own contents.
Documentation end2026-10-20T20:06:42+07:00; elapsed43s through diff review, excluding subsequent Git publication. Active/waiting split not measured; coding tokens unavailable. Expected active2–4min is not directly comparable with measured elapsed; no evidence of avoidable delay or rework in this bounded edit. Proposed correction: none beyond the requested feedback loop. Required protocol fields reviewed; PM owns recording the decision and the next applicable step checks its effect.

### Administrative step DOC-PROTOCOL — 2026-10-20
Protocol loaded: confirmed before edits. Scope: refine standing instructions in AGENTS.md, EXECUTION_PLAN.md and codex.prompting.memory.md only; no implementation/test/milestone work. Expected active time2–4min, medium confidence; expected coding-token range unavailable (no calibrated baseline). Actual coding-token telemetry checked: unavailable through exposed per-task tools; recorded before edits. Start2026-10-20T19:59:15+07:00 (12:59:15UTC); preceding commentary is outside the measured interval.
Publication baseline: `fe20fa68ad85d39d60f3ce7d39fc7778b09d2488`, branch `milestone-3-recommendations`; matches locally recorded origin tracking state, no fresh remote fetch. This documentation remains unstaged/uncommitted and unpublished. PR/merge state not freshly queried; no merge performed or authorized. Unrelated local changes preserved. PM reconciles Build Checklist from this completion evidence; no Sheet edit in this task.
End2026-10-20T20:00:18+07:00 (13:00:18UTC); measured elapsed1m03s through exact saved-instruction readback. Active/waiting split not measured; actual coding tokens unavailable. Expected active2–4min cannot be compared quantitatively to elapsed time; this was a small existing-text refinement with no implementation or test cycle. Proposed workflow correction: none beyond the requested protocol. Required-field closeout audit complete; saved protocol read back in all three files. Final record write follows this endpoint. No tests run.

### Explicit M3 owner acceptance — 2026-10-20
> I accept M3 as delivered, including the disclosed v7 offline-only verification and deferred issues. Record M3 as complete. Leave changes uncommitted; merge and M4 remain subject to separate approval.

M3.1–M3.6 are complete within the delivered baseline and explicitly deferred scope, including the current4/5/11 presentation corrections. This is acceptance of delivery with limitations, not proof of universal recommendation quality, a new live v7 run, or closure of GROUNDING-001/SCORE-COMPARISON-001. Preserve the deferred applicability, plain-language explanation, narrative-answer, provenance, cosmetic, methodology and research items. No merge, M4 start, provider request or deployment follows automatically.

Acceptance-record effort: elapsed **not measured**; active **not measured**; coding-agent tokens **unavailable**. Documentation only; no test rerun or application API spend. Owner handles commits/pushes; this record is left unstaged/uncommitted.

### M3 scope freeze and acceptance handoff — 2026-10-20
Owner requests closeout now, using existing implementation and verification evidence. Functional scope is frozen at deployed revision `mosaic-a547751983d355dacd22` (prompt v7); no runtime edits, deployments, provider calls or test reruns in this closeout. Cosmetic refinements, findings6–8/10, broader methodology, grounding/model/framework/retrieval research and M4 remain deferred. Owner accepted this delivered checkpoint on2026-10-20, as recorded above. It supersedes older instructions to correct already-deployed items or repeat a live walkthrough as a mandatory gate.

| Requirement | Existing implementation and evidence | Closeout disposition |
|---|---|---|
| M3.1 provider service | Server-only provider boundary; authoritative score recomputation, bounded execution, explicit failures; exact public origin; shared persistent $1/day Bangkok reservation/settlement and separate test ledger. Saved concurrency/failure checks and v6 live success. | Implemented and verified within recorded conditions. 30s provider /45s client unchanged. |
| M3.2 retrieval | Native metadata ranking, stable joins/order, preserved8-document/18-chunk baseline; saved retrieval/legacy comparisons. | Satisfied baseline; country/revenue omissions and source limitations remain explicit. |
| M3.3 generation | Structured prompt/output, numeric/citation/category checks, fixed deterministic disclosure, bounded grounding guards; v7 question-level unknown/ROI correction48 focused passes. | Offline verified v7. No new v7 live generation; not automatically a new paid-test requirement. General claim entailment/quality is not guaranteed. |
| M3.4 assessment/Results | Review-gated combined generation; immediate scores, loading, retry/cancel, one-use handoff, interruption/freshness protection; Skip/deselect, sticky stages, bounded cards; context, sources and disclosures. | Saved browser checks and affected reruns pass; owner already accepted1/2/13 and sticky behavior. Latest4/5/11 presentation included in owner acceptance2026-10-20; further polish deferred. |
| M3.5 durable report | Downloadable self-contained HTML: context, answers, question/category/overall scores, gaps/actions, sources, config/method and limitations; usable without AI. | Saved report checks, prior live download and owner/PM content audit satisfy equivalent-report baseline. Dedicated print/PDF visual audit not performed. |
| M3.6 release regression | Single saved gate plus concrete fixes and passing affected reruns; Golden coverage retained, hosted non-generating check passed; v6 service7.70s/browser9.92s live evidence. | Required baseline regression recorded. No claim of a fresh all-green monolithic run or measured v7 live latency/p95. Experiments explicitly deferred. |

No concrete unresolved functional blocker is established by current evidence. Remaining acceptance caveats: GROUNDING-001 is mitigated by a targeted guard but broader source support remains open; SCORE-COMPARISON-001 lacks original matching inputs (later50.5/48.8 arithmetic reconciles, five matched Golden full traces agree); egress firewall persistence across host reboot is unverified. These are not silently closed or permission to expand this package. Owner accepted the delivered scope with these limitations on2026-10-20; M3 is COMPLETE. Merge and M4 remain separately gated.

#### Existing verification process and lean policy recommendation
Recorded durations below come only from saved logs; no new timing runs. All commands run from app/ unless specified.

| Command | Purpose | Recorded duration | Necessary when | Overlap |
|---|---|---|---|---|
| `npm run verify` | Sequential typecheck, lint, all units, production build, browser suite | End-to-end duration not measured; Oct20 invocation stopped at4 unit failures, subsequently fixed | Once per final release candidate | Includes all five commands below; do not repeat them first by default |
| `npm run typecheck`; `npm run lint` | Type/contracts and static rules | Separate totals unavailable | Affected code/config changes; included in release gate | Build also checks Next TypeScript; domain-only check/lint retain distinct coverage |
| `npm run test` | Unit, provider-double, scoring/Golden regressions |105.83s in Oct20 gate;271/275 then affected navigator11/11 in10.32s | Release gate; focused files during development | `test:golden` is a subset, not an additional default release step |
| `npm run build` | Production compilation/routes | Total unavailable; saved rebuild2 phases2.8s compile,12.3s TypeScript,479ms static generation | Release candidate or source changes before browser checks | Deployment Docker build also compiles the actual image; preserve that necessary fidelity check |
| `npm run test:e2e` | Offline browser journeys, failures, accessibility and viewports |7.2min (71/74); affected assessment rerun25/25 in3.1min after fixes | Once at release; affected files after concrete fixes | Repeating whole suite after focused fixes duplicates unchanged coverage |
| `npx vitest run tests/unit/recommendation-prompt.test.ts tests/unit/recommendation-validation.test.ts --maxWorkers=1` | Approved unknown/ROI regression |3.21s,48 passed | Prompt/validator development | Included in full unit suite |
| `npx playwright test --config .local/budget-deploy.config.ts --grep 'hosted readiness'` | Existing non-generating HTTPS/readiness, budget modal, scores/report smoke |12.7s,1 passed | After deployment | Complements local suite; does not prove new live AI generation |

Sources: existing `app/.local/m3-oct20-*-*.log` evidence listed in the completed checkpoint above, plus `m3-oct20-rebuild2.log`. The roughly20-minute experience is not a measured default-gate total: the serial browser phase alone took7.2min, affected rerun3.1min, and units105.83s. Unit log attributes60% to environments and21% imports across33 isolated workers. Browser checks include real800ms answer confirmation across a full questionnaire (~51s), multiple viewport/accessibility journeys, server startup and failure artifacts. Repeated compilation/static checks and corrective reruns add time; no exact20-minute sum or new benchmark is claimed.

Recommended policy (no scripts/coverage changed): focused saved checks during development; one `npm run verify` release gate; after concrete fixes rerun only failed/invalidated checks and rebuild when browser/image source changed, carrying forward unaffected passes. Include applicable saved dependency/security review at release, reusing evidence when dependency/config scope is unchanged. Use the small existing non-generating hosted smoke after deployment. Paid live checks require separate authorization/budget and a concrete integration need; v7 offline-only status is disclosed, not an automatic demand for another call. No full gate for documentation-only edits. Do not disable isolation, remove assertions or introduce tools to chase duration in this closeout.

#### Git checkpoint and effort
Reviewed tracked diff and intended new application/deployment/test files. Proposed single coherent hosted-M3 checkpoint includes root controls/test register, app/src, app/tests, app/deploy/app, app/scripts/deploy.mjs and app/docs/M3-LIVE-AI-REVIEW.md. Shared state/contracts make splitting budget/report/Results corrections less useful. Exclude and preserve `.agents/`, the two `app/docs/HETZNER-*` incident documents and the modified historical `app/docs/PRIVATE-HETZNER-STAGING-PLAN.md`; historical control-document references to these local records remain preserved. Private `.local/` responses/ledgers, environment credentials, generated outputs and dependencies are excluded. Credential-pattern review and exact local credential comparison found no real secret in proposed files; one existing example.org user:pass rejection fixture is intentional. Deployment deploy.sh is LF-only. BUILD_PACK, domain/scoring, canonical config, archived content and dependency manifests have no diff. Index remains untouched; owner performs staging/commit/push/PR. No merge authorization inferred.

Effort item M3-CLOSEOUT: scope/evidence/Git handoff completed; expected active15–25min, elapsed **not measured**, active **not measured**, coding-agent tokens **unavailable**, application-provider calls0/cost$0. No retrospective timing reconstruction. Remaining work: owner acceptance and manual Git publication; no agent test or deployment command running from this closeout.

### Current correction package — 2026-10-20
Latest owner walkthrough / PM artifact audit from Build Checklist v2.0 F19 note (2026-10-19 15:32 Bangkok) supersedes older pending dispositions below. Findings 1, 2 and 13 are owner-accepted for that walkthrough; 11 sticky behavior is accepted but desktop size rejected. Findings 4/5 remain rejected: jolty wheel motion, inconsistent moving surfaces, oversized card and hidden adjacent previews at 100% zoom. Current work: 4/5/11 visual corrections, 9 item-level unknown-as-negative and unsupported measured-ROI advice correction; machine-owned verification of 3/12 and old Skip conflicts. Findings 6–8/10 remain deferred.
- The later owner live run SUCCEEDED. Do not require paid repetitions solely to resolve historic timeout uncertainty; deadlines remain unchanged. No paid calls authorized for this package.
- PM inspected the report generated 2026-10-19T08:22:52.656Z: 44 scored / 12 unanswered; question totals8579.93/17004.50 give50.4568203% (50.5 displayed), weighted48.7511813 (48.8 displayed). This is PM-reported internal arithmetic reconciliation, not independent benchmark validation. Original49.3/47.3 evidence is historical, not the latest report.
- Reported water tracking No and hazardous-waste8 are stored answers: preserve them; do not infer intent. Advice incorrectly states no energy tracking where that item is unanswered; all categories having some answers does not imply all items answered. Highest-ROI wording lacks cost/benefit evidence.
- Owner explicitly requested Playwright verification at100% and motion over time using the existing UI. Reuse saved assessment fixtures/checks; no synthetic product or new fixture set. Owner subsequently approved the focused finding9 checks in the two named files;48 checks passed. No broader test expansion.
- Effort rule (owner2026-10-20): record effort once per completed checklist item. Unavailable elapsed/active timing is **not measured**. No retrospective time reconstruction or allocation of shared-package time. Coding tokens unavailable without telemetry. Package forecast1–3 active hours, low confidence; no per-item actual recorded before completion.

### Completed correction checkpoint and effort — 2026-10-20
Implementation/verification checkpoint only; this does not mark M3 or new visual/advice behavior human-accepted.

| Item | Completed outcome | Elapsed | Active | Coding-agent tokens | Acceptance |
|---|---|---|---|---|---|
| 3 | Existing focus/reduced-motion checks passed; radio-to-Continue order preserved | not measured | not measured | unavailable | Machine check complete |
| 4 | Opaque directional wheel with matching outgoing controls; intermediate frames inspected | not measured | not measured | unavailable | Owner review pending |
| 5 | Normal-zoom viewport bounds, persistent position, visible adjacent previews and stable mobile/desktop sizing | not measured | not measured | unavailable | Owner review pending |
| 9 | v7 item-level unknown context and bounded unsupported-absence/ROI safeguards;48 approved focused checks | not measured | not measured | unavailable | Offline verified; no v7 live generation |
| 11 | Compact sticky stage bar with existing state/accessibility | not measured | not measured | unavailable | Compact sizing review pending |
| 12 | Existing first-Results/legitimate-revisit checks passed | not measured | not measured | unavailable | Machine check complete |
| M3.5 display polish | Reused setup labels; point totals formatted to2 decimals in report only, no calculation rounding | not measured | not measured | unavailable | Existing report regression passed; print/PDF visual audit not performed |

One effort entry per completed current item; no retrospective allocation or reconstruction. Initial package forecast1–3 active hours with low confidence, token estimate unavailable. Application-provider spend$0; no live calls. Items1/2/13 retain prior owner acceptance without inventing new effort entries.
- Verification: the single full saved gate passed typecheck/lint then recorded271/275 unit passes, with4 navigator failures caused by the help disclosure's group semantics. Fixed the implementation without weakening assertions; affected navigator file passed11/11. Latest typecheck/lint/build passed. Completed saved browser gate71/74; fixed Tab order, help-control footprint and rail endpoint overflow, then affected assessment file passed25/25. All initial failures are covered by passing affected reruns; do not describe this as a single clean275/74 run. The48 finding9 focused checks include the initially malformed test score-request corrected to the existing strict schema.
- Saved logs: app/.local/m3-oct20-final-verify.log, m3-oct20-navigator-final.log, m3-oct20-browser-gate.log, m3-oct20-assessment-final.log and m3-oct20-advice-check.log. Visual evidence is from the existing approved assessment journey, including motion frames; no new fixture set/product or separate review document.
- Deployment: existing scripts/deploy.mjs workflow completed for mosaic-a547751983d355dacd22. Saved non-generating hosted readiness/budget/report check passed1/1 with v7, gpt-5.4-mini/low/4000, provider30000ms; client45000ms unchanged. All generation POSTs in that check were intercepted; no claim of a new live AI success. Prior owner live success remains separate evidence.
- Ledgers unchanged across this deployment/check: public SHA256006539c6e20583fb4e11df29209f13e414d574ec8f8095edac621c583027c3be; separate deployment-test SHA256c16b4850bc90177352e433d6dec09d58f353d007b97d2f88de6e98c6934d8806. The fresh public hash includes owner activity after the previous checkpoint; it was not reset. $1/day Bangkok and exhausted agent test allowance remain distinct.
- Limits: bounded language guards do not prove general entailment or catch every paraphrase. Existing substantive score/citation/category protections remain. Missing-item disclosures are requested semantically, not enforced through literal boilerplate. Unknown remains unknown; saved water/hazardous-waste answers and existing downloaded reports were not rewritten. Generic whistleblower/source-support concerns remain open. Source membership is not proof of claim support. No new model, retrieval or methodology work.
- Next: owner reviews current4/5/11 visuals and decides M3 acceptance. New-v7 live prose/latency is not claimed verified; no extra paid call is authorized or required solely to reconstruct historical failures. Findings6–8/10 and research experiments stay deferred. All local changes remain unstaged/uncommitted; deployment does not imply acceptance.

### Failed manual acceptance — owner direction and bounded diagnosis, 2026-10-19
- Original findings recovered from Build Checklist, v2.0 F14:F19 and full F19 note, 2026-10-19. Numbers 1–5, 9, 11–14 are current; 6–8 and 10 remain deferred. The source below preserves the owner wording and historical OPEN dispositions.

### Original numbered findings

1. There is no way to 'deselect' an option in the questionnaire. I.e. if I read 'skip if unknown' after typing 'no' to whether we count emissions, I'm unable to change the answer: skip maintains the 'no' entry and simply skips. Hitting 'Skip' should remove any stored answer for the question and advance the card. Clicking an already-checked answer should toggle (from yes-no).
2. The navigation is still a bit awkward, not fluid. I see that the active 'bubble' is increased in size most, with the adjacent two in each direction increased in size a bit more. It would be much better to have the selected bubble increase by 5x, then by 4x for the question immediately before and after, then 3x for the questions before and after those, then 2x. These should pop out, but not in 'steppes.'
3. Sometimes when advancing between pages or generally clicking 'Enter', the following page/question arrived with a red selection box around a piece of text. This serves no purpose. Clicking away removes it, but it should not have been there to begin with. Purpose unclear.
4. Card animations need to be more fluid. There is no discernible 'roll' of the card wheel. Once a question is answered, the animation waits for a few ms, then immediately presents the next card. The animation should make it evident that the partial cards above and below the current are cards in a 'wheel'; clicking an answer 'turns' the wheel one card.
5. Card size varies widely between questions - due to question length, available answers, etc. Within some bounds, of course, the card height should remain constant, and the text size/spacing adjusted to fit...rather than allowing the card to balloon in height to accommodate.
6. This for later: there are still question-answer match errors. A construction company (cement) gets a question about wood fibers. This needs to become a separate QA test we set up in a later step/Milestone.
7. Some of the questions are still complicated for SMEs. Perhaps we implement an icon ('(?)' or 'what's this?' link) with genAI-generated layman's explanations. For example: "Has your company carried out a climate-change risk-exposure analysis for your operations or project pipeline?" is largely technical/industry jargonspeak. The button/icon would explain this in SME-friendly terms, with potential examples.
8. I'm not sure about the whole No/Skip methodology here. We could also add a field like 'Other answer:' consistently, in a later iteration. This would allow an SME to specify in greater detail, at least for the agent's consideration. For example, "Does your company report its order backlog from renewable-energy or green-building projects?" could take a response like "we have sold cement to renewable energy or green-building projects, but don't report customer information. This is protected."
9. I skipped ALL energy/$, waste and water questions. This is crucial information. Verify that the agent output accurately took this into account, and whether the received score adequately reflects the SME's performance.
10. Another audit type we could require later: questions like "Does your company assess the adequacy of existing public infrastructure (electricity, water, wastewater) when selecting sites?" have obvious problems. What does 'adequacy' mean? How is this a sustainability question? This was an AI-generated question, from some indicator. What is the indicator? Where is the provenance in this whole question phase/step?
11. The phase-navigation (Set up, Data Input, questions, review, results) is not synched appropriately. I'm only on the question phase - have not yet reviewed or generated results, i.e., have not navigated to those pages. Yet they still all show up in the same way on the page. Further, this menu is not sticky.
12. I was able to navigate straight to the Results page from the questionnaire. This should not be possible without visiting the 'review' page, and clicking 'generate score and recommendations' or whatever.
13. The agent failed to run from Review > Generate score and recs button. I had to click 'Regenerate' on the Results page.
14. Regarding 13) above...the agent is the issue, timeout maybe. This failed on Results > 'Regenerate' a second time.

### Current correction status by original finding — 2026-10-19
Source: [Build Checklist, v2.0 F14:F19 and full F19 note](https://docs.google.com/spreadsheets/d/1JPxxDzxOuH77i62EUBqgz9T46h-8ck9YtKZQIQa8FdQ/edit?gid=406102921#gid=406102921). Spreadsheet read only; original findings above are unchanged. All visual changes await owner review; M3 acceptance remains failed/pending correction.

| Finding | Local work / actual files | Verification / remaining issue |
|---|---|---|
| 1 | Existing Skip/deselect clearing retained. | Owner ACCEPTED Oct19 walkthrough. Saved clearing/refresh checks passed again; source review confirms legacy skipped+nonblank conflicts are preserved and block generation in Review/model/ResultsGate. No guessed answer corrections or new legacy-conflict fixture. |
| 2 | Accepted5/4/3/2 emphasis retained; desktop endpoint spread bounded to avoid overflowing the shorter rail. | Owner accepted appearance Oct19. Navigator unit and desktop/mobile checks passed; no new bubble design. |
| 3 | Existing noninteractive-heading outline rule retained; restored radio-to-Continue Tab order after moving supplementary help after actions. | Saved keyboard/reduced-motion and accessibility cases passed. Machine verification complete; no separate owner repetition requested. |
| 4 | assessment-flow.tsx/assessment.css: opaque outgoing/incoming card surfaces with matching controls,650ms directional movement,800ms selected confirmation and reduced-motion support. | Intermediate0/325/649ms frames and settled UI inspected; monotonic movement/opacity check passed. New owner visual acceptance pending. |
| 5 | Viewport-relative bounded active card, compact readable adjacent previews, persistent question position, sticky active controls and compact optional navigation help. | Saved1440x768 normal-zoom viewport/controls bounds and stable sizing checks pass; mobile320/390 and64-question rail pass. New owner visual acceptance pending. |
| 6 | Deferred applicability QA (cement / wood fibre). | No canonical selection or question-bank changes. |
| 7 | Deferred plain-language explanations. | No explanation-generation feature or new calls. |
| 8 | Deferred unknown/No/not-applicable methodology and optional narrative answers. | No scoring or answer-model semantics beyond explicitly authorized clearing. |
| 9 | prepare.ts v7 supplies authoritative unanswered-question identities/titles/categories as unknown, including within assessed categories. Instructions distinguish unknown from No, require item-level grounding notes and qualitative priorities instead of uncalculated ROI. claim-support.ts/validate-output.ts add bounded guards for reported false tracking-absence and unsupported ROI claims; no prose rewriting. |48 approved focused checks passed, including qualified advice/paraphrases, assessed-category missing energy, scores/citations and unassessed-category protections. Later PM report arithmetic50.5/48.8 reconciles; original49.3/47.3 remains historical evidence. No new live call; broad semantic correctness is not proven. |
| 10 | Deferred question-to-indicator/source provenance audit. | No retrieval/config changes. |
| 11 | Compact inline sticky desktop stage bar; distinct state and keyboard access retained. | Sticky behavior previously owner-accepted. New compact footprint <=64px and accessible desktop/mobile checks passed; visual acceptance pending. |
| 12 | Existing Review + Generate first-Results gate and legitimate revisit behavior retained. | Saved M3-completion tests pass at1440/390, including direct URL denial and non-generating refresh. Machine verification complete. |
| 13 | Existing one-use combined-generation handoff retained. | Owner ACCEPTED later Oct19 live walkthrough; combined/duplicate/interruption regression checks pass. No additional paid calls. |
| 14 | Provider30s/client45s and safe diagnostics retained. | Later owner run SUCCEEDED; no new timeout reported. Historical causation/p95 remain unproven, not a demand for repeated paid tests. No deadline change. |

### Owner-supplied assessment evidence

- Industry Construction / Materials (cement); size 251–500; target buyer Government; markets EU and Eastern Europe; goal Meet buyer sustainability requirements.
- Raw score 49.3/100; industry-weighted 47.3/100; 45 answered and 11 unanswered. Category scores: People 100.0, Governance 43.8, Community 67.5, Resources 28.4.
- Displayed earned/possible points: 8582.43 / 17404.50. Their ratio supports the rounded raw total only; it does not independently verify every input, category or weighted total.
- UI states missing answers contribute neither earned nor possible points; unscored category weights are not redistributed. These are partial-assessment scores, not proof of whole-company readiness.
- User reported skipping all energy/revenue, waste and water questions. Yet the pasted calculation list marked water tracking and hazardous-waste percentage as scored. Investigate retained answers and Skip behavior; do not assume the user's intention was captured.
- Listed unanswered items include energy tracking, renewable percentage, waste tracking/diversion, wood-fibre percentage, climate risk-exposure analysis, emissions/revenue, energy/revenue, water/revenue, waste/revenue and infrastructure adequacy.
- No accepted recommendation prose was supplied for this failed run. It is therefore impossible to confirm that generated advice handled missing information correctly from this record alone. A zero gap/action count after generation failure is not evidence of no gaps.
- Reported timeout text: "Generation deadline was exceeded. No recommendations were accepted. You can retry explicitly."
- Screenshots were supplied in the PM conversation but are not repository files. The descriptions and pasted score evidence above are available to Codex without requiring the owner to re-paste the findings.


### Local diagnosis and correction progress

- Current corrections (owner grouping, not replacement numbering): answer deselection/Skip clearing; navigation bubble magnification, focus styling, wheel animation and stable card sizing; sticky/current/completed stage navigation; Review-before-Results gating; combined-generation behavior; live timeout; incomplete-data presentation.
- Later backlog: question applicability, plain-language explanations, optional narrative answers and question-to-indicator/source provenance. No scoring-methodology change.
- Existing hosted records read without generation: public ledger has entries at 13:02:48, 13:04:47 and 13:05:34 Asia/Bangkok. First two settled usage costs are $0.0232815 and $0.024924, proving provider interaction/usage, not successful validation or delivery. Third retains $0.324144 with unknown usage. Current accounted public total is $0.3723495. Separate deployment ledger remains two attempts/$0.648288 reserved; no allowance reset or extra call.
- Exact failure/deadline per ledger entry is NOT established: public ledger stores reservation/usage, not response code, validation issues or timing; reservation precedes provider dispatch. First two attempts returned usage; third dispatch/completion is unknown. Bounded container log inspection found no timeout or recommendation-metric records; two Server Reference ID format errors (received "x") cannot be attributed to these attempts. Retained local v5/v6 evidence is from prior agent verification, not these manual attempts. No manual response reconstructed. Subsequently recovered F19 note quotes the generation-deadline message; that message maps to the server service deadline, rather than the45 s client transport deadline. It supports at least one reported server timeout, but does not correlate each ledger entry to a failure stage. Two settled-usage entries are not evidence that both timed out.
- Timeout implementation: 30-second provider race/abort; 45-second generation-client cap; 15-second readiness fetch; separate request-body deadline. Client transport exceptions are mapped generically to provider_failure. Without the original response/network evidence, do not select a deadline or increase a cap by assumption.
- Skip defect confirmed in pre-correction source: reducer explicitly preserves answers while adding the active ID to skipped; progressLabel prioritizes a valid answer over skipped. Scoring requests use raw answers, so a retained valid answer remains assessed. Native radio handlers select again rather than deselect. Saved sessions persist both answers and skipped unchanged. The owner's exact question IDs/values are unverified: answers live in browser-tab sessionStorage, not server storage, and browser policy blocked observation of the existing hosted tab. Do not circumvent that control or claim code inspection is a recovered session.
- Review/generation defect confirmed in pre-correction source: stage Results is enabled after any answer; its handler navigates directly without the explicit combined-generation intent. Review's Generate action does create that intent. Stage navigation exposes current state but lacks sticky/completed treatment. The pre-correction incomplete notice/counts did not establish acceptance; the current correction adds explicit category coverage and avoids zero gap/action claims on AI failure.
- Smallest correction order: (a) clear/deselect answers and persist the corrected state without changing calculation formulas; (b) gate initial Results through Review and preserve one-use combined-generation, refresh/cancellation protections; (c) finish scoped navigation/focus/motion/card sizing; (d) clearly present incomplete coverage; (e) resolve live failure from retained diagnostics before altering timeouts. No provider calls or code/test changes during the initial diagnosis; subsequent authorized local implementation is recorded in the numbered table above.
- Reuse approved assessment/session, progress-navigator, generation-intent/attempt/controller/client/service/provider, results/disclosure and existing assessment/recommendations/M3-completion browser checks; use the saved full gate only on the final correction candidate. Existing assessment.test.ts explicitly expects Skip to preserve a draft and therefore required a changed assertion for the new clearing contract. Owner subsequently explicitly approved that update plus offline clearing/refresh and Review-gate coverage in assessment.test.ts, assessment.spec.ts and m3-completion.spec.ts. No new synthetic demonstration or paid test is authorized.
- Verification for this correction: full saved `npm run verify` completed typecheck/lint,263 unit tests (including Golden), production build and74 browser cases:68 passed /6 failed. Concrete motion/geometry failures were corrected; affected27-case browser rerun passed25 with2 touch cases remaining. Final rebuilt6-case restoration/Review/mobile subset passed5 with1 touch case remaining; changing only the existing active-touch screenshot from full-page to viewport capture retained every touch assertion and both320/390 touch cases then passed. Latest typecheck/lint/build passed.20 existing session/attempt unit checks passed after legacy revisit compatibility. No new full-gate claim: initial failures plus their explicit passing reruns are preserved in app/.local/m3-*-check/verify logs. Visual inspection used screenshots generated by these saved tests, not a new synthetic demonstration.
- Deployment completion14:49 Bangkok: existing `node scripts/deploy.mjs --key=<existing new-host SSH key>` deployed mosaic-8a7cb174fb04e58349cb. Existing saved `npx playwright test --config .local/budget-deploy.config.ts --grep 'hosted readiness'` passed1/1: trusted HTTPS, ready v6, gpt-5.4-mini/low/4000 tokens/30000 ms, mocked budget-denial modal, authoritative scores and report download. All generation POSTs in that check were intercepted locally; no provider generation occurred. The fixture's existing Results revisit now includes progress4; no new synthetic demonstration/harness was introduced.
- Both server ledgers are byte-for-byte unchanged across deployment and non-generating verification: public SHA256 `6c86efb9794ae2545af11d7d2de1044b3cadd1c89d01999a4e7d5d096a8a7f9a`; deployment-test SHA256 `c16b4850bc90177352e433d6dec09d58f353d007b97d2f88de6e98c6934d8806`. Public daily allowance remains$1/Bangkok; separate agent verification allowance remains exhausted. Existing rollback release files retain the preceding image; no old-host work or DNS change.
- Manual acceptance next: refresh the hosted app; review any flagged old Skip/answer conflicts, check numbered UI corrections1–5/11–12, confirm partial-coverage presentation9 and use the normal explicit combined action13 only when the owner elects to spend public allowance. If generation fails, the new Last generation failure details expose safe stage/timing/issue codes. Historical response-specific validation failures and the larger-assessment timeout remain unproven/resolved only by future authorized evidence; do not mark14 or all M3 accepted. Unsupported whistleblower grounding remains open.
- Effort record: expected3–5 active hours for corrections; total elapsed and active time were not fully instrumented and are unavailable. The recorded verification/work interval14:16:08–14:49 Bangkok covers at least33 minutes and excludes earlier checklist reconciliation/implementation; it is not total task labor. Coding-agent tokens unavailable (no telemetry); application-provider spend$0. Remaining work is owner visual/manual acceptance, historical score/input reconciliation and live reliability evidence; no new paid call authorized.
- Scope preservation: no edits to BUILD_PACK, deterministic domain, canonical app/config or app/src/content; prompt/retrieval/model/deadlines and ledgers unchanged. Index remains empty; all implementation/docs remain uncommitted. No dependencies added. Findings6–8/10 deferred; exact historical score/input reconciliation, unsupported whistleblower grounding and broader recommendation reliability remain open.
- Forecast: diagnosis/status 15–25 active minutes; subsequent correction and existing offline verification provisionally 3–5 active hours, with all14 findings now recovered; exact manual response bodies and raw saved answers remain unavailable. Coding-token estimate/actual unavailable (no telemetry/calibrated baseline). No application API spend authorized or incurred for diagnosis. Changes remain unstaged/uncommitted; no new review document.

| Milestone | Expected active time (accepted baseline) | Expected coding tokens | Recorded elapsed | Actual coding tokens | Acceptance |
|---|---|---|---|---|---|
| M1 | Not recorded retrospectively | Not recorded | Oct 6 14:19–Oct 7 14:59, ~24h40m commit window | Unavailable | Accepted |
| M2 | Not recorded retrospectively | Not recorded | Oct 7 15:07–Oct 12 13:55, ~4d23h | Unavailable | Accepted Oct 12 |
| M3 | Historical estimates retained above | Unavailable / uncalibrated | Whole-step effort not measured; partial evidence preserved | Unavailable | Accepted2026-10-20 |
| M4.0 | N/A — evaluation/decision, not a build step; superseded forecasts preserved in history | N/A; no calibrated forecast | Not measured; no retrospective reconstruction | Unavailable | Complete by owner decision2026-10-20; checklist row20 |

For each work item, add/update one row here with estimate, actual, measurement source, variance and owner acceptance. Do not create another KPI document. Time spent waiting/building must be distinguishable from active work if available. An estimate is not a spending approval.
Completion message: **Send effort report to PM: step [ID]; implementation/verification/combined forecast [...]; elapsed delivery [...]; calendar span/explicit pauses [...]; coding tokens [measured/unavailable]; one variance explanation [...]; at most one correction [...]; acceptance [...]; SHA/branch/publication state [...].**







## Purpose



This document is the operational build roadmap for Capstone v2.



It sits below `BUILD_PLAN.md`:



- `BUILD_PLAN.md` defines major milestones and human review gates.

- `EXECUTION_PLAN.md` breaks those milestones into right-sized implementation steps.

- The Google Sheet `Build Checklist` → `v2.0` mirrors this plan for human project tracking.



If this file and the Google Sheet diverge, apply the current F1 authority protocol: latest explicit owner instructions first, live checklist for project-management decisions, repository evidence for implemented behavior. Reconcile supporting Markdown before implementation; do not independently override checklist decisions.



Implementation agents may propose smaller substeps within an authorized execution step, but they may not silently advance to another step or milestone.



The intended loop is:



> Select step → implement → test → inspect → understand → commit → mark complete → continue.



---



# Status conventions



- `COMPLETE` — implemented, verified, reviewed, committed.

- `CURRENT` — explicitly authorized for implementation.

- `PENDING` — not yet authorized.

- `BLOCKED` — requires methodology, scope, IP, or other explicit approval.

- `STRETCH` — optional after required scope is stable.

- `RESEARCH` — experimental work that must not silently alter the core product.



Agents may maintain routine status wording when explicitly authorized; acceptance must cite a documented human decision, never a commit alone. Only the human project owner may change a step to `COMPLETE` or authorize the next step.



---



# Milestone 1 — Product shell and assessment entry



## M1.0 — Scaffold + architecture baseline

**Status:** COMPLETE



### Purpose

Create a safe, reproducible technical foundation before product features.



### Output

- Next.js / React / TypeScript application scaffold

- testing infrastructure

- linting and architecture-boundary enforcement

- design-token foundation

- architecture decision records

- single verification command: `npm run verify`



### Dependencies

Approved architecture and Build Pack control documents.



### Notes

Completed on branch `milestone-1-scaffold`.



No substantive Capstone product functionality was implemented in this step.



---



## M1.1 — UI system + landing-page shell

**Status:** COMPLETE



### Purpose

Establish the product visual language and the public/context surface.



### Output

- approved design-token implementation

- typography

- spacing

- color system

- borders/radii

- motion treatment

- reduced-motion behavior

- responsive landing-page shell

- problem/context section

- About / approach section

- video placeholder

- research / verification section

- clear `Take the Assessment` CTA



### Dependencies

- M1.0

- `BUILD_PACK/01_PRODUCT_SPEC/UI_BRAND_GUIDE.md`



### Boundaries

Do not implement:

- assessment setup

- questionnaire behavior

- scoring

- recommendations

- calculator

- database/persistence

- admin/maintenance features

- commercial/stretch features



Keep visual polish controlled until the deterministic core is proven.



---


### Notes

Implemented and verified. Public-facing copy remains provisional pending research/client review; this does not block the approved UI shell.


## M1.2 — Assessment setup + session state

**Status:** COMPLETE



### Purpose

Collect SME context and begin a resilient assessment session.



### Output

- dedicated full-page assessment setup flow

- SME metadata/context fields

- quantitative-input method choice

- React reducer/context state

- browser session persistence

- route into questionnaire flow



### Dependencies

- M1.1

- approved SME metadata/context fields



### Notes

Manual quantitative input is the initial default.



Calculator and upload paths may remain disabled/placeholders until their milestones.



---



## M1.3 — Questionnaire shell + progress/navigation

**Status:** COMPLETE



### Purpose

Implement the approved assessment interaction model before real scoring logic.



### Output

- vertical single-focus / roller-style question cards

- active-card emphasis

- desktop progress rail

- compact mobile progress equivalent

- skip behavior

- revisit behavior

- answered/unanswered/current state

- direct question navigation

- category-transition treatment

- final unanswered-question review behavior

- reduced-motion support



### Dependencies

- M1.2

- `UI_BRAND_GUIDE.md`



### Notes

Representative or mock questions may be used at this stage.



Missing answers must never silently become zero.



---



## M1.4 — Results shell + Milestone 1 review

**Status:** COMPLETE



### Purpose

Prove the end-to-end product shell without pretending scoring or recommendations are implemented.



### Output

- `/results` route

- score-summary shell

- category visualization shell

- executive-summary section shell

- gaps section shell

- recommendation section shell

- prominent report-download CTA shell

- Milestone 1 review package



### Dependencies

M1.1–M1.3.



### Review gate

Stop and review Milestone 1 before beginning Milestone 2.



---



# Milestone 2 — Deterministic assessment core and Golden parity



## M2.1 — Canonical config schemas + loader

**Status:** COMPLETE



### Purpose

Make the preserved Capstone configuration readable by the new application without hard-coding it.



### Output

Typed schemas and repository/loading interfaces for:

- QuestionBank

- AnswerScales

- MetricBenchmarks

- MultiplierRules

- CategoryWeights

- DocumentIndex

- DocumentChunks



Also:

- validation

- config-version identity

- explicit load failures



### Dependencies

- Milestone 1 approved

- canonical clean config files



### Notes

No production database is required for this step.



Versioned repository files may serve as the initial runtime authority.



---



## M2.2 — Deterministic question selection + ordering

**Status:** COMPLETE

Implementation and verification completed for the explicitly authorized M2.1 + M2.2 package. See `app/docs/M2.1-M2.2-REVIEW.md` and `app/docs/CONFIG-MIGRATION.md`. M2.1–M2.2 were accepted by human review and committed; this does not complete Milestone 2. M2.3–M2.5 were subsequently explicitly authorized as a separate work package.



### Purpose

Reproduce which questions each SME receives and in what order.



### Output

Pure deterministic selection and ordering engine driven by:

- active state

- industry

- market/location

- size

- priority/order rules



### Dependencies

M2.1.



### Verification

Golden cases must match expected question IDs and ordering.



### Notes

Do not introduce buyer/goal-based question selection unless explicitly approved as a methodology change.



---



## M2.3 — Answer persistence + normalization/benchmarks

**Status:** COMPLETE

Implemented and verified on 2026-10-10 as part of the explicitly authorized M2.3–M2.5 package; accepted by human review on 2026-10-11. See `app/docs/M2.3-M2.5-REVIEW.md`. This does not complete Milestone 2 or authorize M2.6/M2.7.



### Purpose

Reliably capture answers and reproduce normalized question scores.



### Output

- answer-state integration

- robust persistence through navigation/focus changes

- normalization library

- benchmark resolver

- missing-data handling

- question-level normalized outputs



### Dependencies

M2.1–M2.2.



### Notes

Fix the v1 answer-loss/focus-change defect.



Missing values must never silently become zero.



---



## M2.4 — Base weights + contextual multipliers

**Status:** COMPLETE

Implemented and verified on 2026-10-10 as part of the explicitly authorized M2.3–M2.5 package; accepted by human review on 2026-10-11. See `app/docs/M2.3-M2.5-REVIEW.md`. This does not complete Milestone 2 or authorize M2.6/M2.7.



### Purpose

Reproduce contextual weighting deterministically.



### Output

- base-weight application

- multiplier-rule matching

- matched rule IDs

- resulting multiplier

- explainable multiplier trace



### Dependencies

M2.1–M2.3.



### Notes

Do not convert current config values or caps into permanent engine assumptions.



---



## M2.5 — Category weighting + score aggregation

**Status:** COMPLETE

Implemented and verified on 2026-10-10 as part of the explicitly authorized M2.3–M2.5 package; accepted by human review on 2026-10-11. See `app/docs/M2.3-M2.5-REVIEW.md`. This does not complete Milestone 2 or authorize M2.6/M2.7.



### Purpose

Reproduce category and overall scoring.



### Output

- weighted question contributions

- category aggregation

- category scores

- raw overall score

- industry-weighted overall score



### Dependencies

M2.4.



### Notes

Calculation precision must remain separate from presentation rounding.



---



## M2.6 — Calculation trace + numeric policy

**Status:** COMPLETE

Implemented and verified on 2026-10-11 under separate explicit M2.6 authorization; accepted by the owner on 2026-10-12 as part of final Milestone 2 acceptance, including explanations, calculation trace and numeric policy. See `app/docs/M2.6-REVIEW.md`, `app/docs/NUMERIC-POLICY.md` and the acceptance record in `app/docs/M2.7-MILESTONE-2-REVIEW.md`.



### Purpose

Make every score explainable and every parity failure diagnosable.



### Output

Structured calculation trace containing, where applicable:

- question ID

- raw answer

- normalization method and inputs

- normalized score

- benchmark ID/source

- base weight

- matched multiplier rule IDs

- resulting multiplier

- category

- category weight

- weighted contribution

- overall contribution

- config/method version



Also:

- documented numeric representation policy

- source/config precision rules

- intermediate-rounding rules

- presentation-rounding rules

- explicit Golden comparison tolerance



### Dependencies

M2.3–M2.5.



### Notes

Never widen tolerances merely to make Golden Tests pass.



---



## M2.7 — Golden parity + basic score visualizations

**Status:** COMPLETE

Implemented and verified on 2026-10-12; accepted by the owner on 2026-10-12 following the human walkthrough. The eight-question test matched expected scores, and the Q23 edit, recalculation and refresh worked. Final acceptance includes M2.6 and completes Milestone 2; see app/docs/M2.7-MILESTONE-2-REVIEW.md. Questionnaire review/navigation issues are deferred to M3.4/M3.6. PR #3 merged into main on 2026-10-12 with separate owner authorization; see the merge/branch record below. M3.1–M3.3 were subsequently authorized for local implementation on 2026-10-13; live provider integration and M3.4–M3.6 remain gated.



### Purpose

Prove the deterministic core against the preserved v1 behavior.



### Output

- Golden Test matrix for all five Golden SMEs

- selected-question parity

- normalization parity

- weight parity

- multiplier parity

- category-score parity

- overall-score parity

- documented reconciliation of known v1 defects

- basic overall/category score visualizations

- Milestone 2 review package



### Dependencies

M2.1–M2.6 plus Golden fixtures.



### Review gate

The deterministic core must be approved before recommendation logic becomes authoritative.



---



# Milestone 3 — Recommendations, results, and durable report

## M3 implementation packages — proposed 2026-10-12; first package authorized 2026-10-13

M2 was explicitly accepted on 2026-10-12. With separate owner merge authorization, PR #3 merged into main on 2026-10-12 using merge commit `4929f9f2969fa946da1066ea3825921349ecf641` (parents: previous main `8cae855` and acceptance commit `c9cb2b8`). Local main was synchronized, then `milestone-3-recommendations` was created from that merged main. `milestone-2-deterministic-core` remains preserved locally and remotely at `c9cb2b8`; shared history was not rewritten. The current branch is `milestone-3-recommendations`; the branch handoff itself did not authorize implementation. On 2026-10-13 the owner authorized M3.1–M3.3 using controlled local provider test doubles. See app/docs/M3.1-M3.3-REVIEW.md. That initial authorization excluded live calls. The 2026-10-14 limited live-AI authorization below now governs M3.1/M3.3 and a subset of M3.4; deferred navigation, M3.5 and M3.6 remain PENDING.

### Targeted metadata restoration — authorized 2026-10-13

The owner authorized restoring only Additional Context / Requirements (`notes`) through setup, compatible session persistence and the local recommendation foundation. See [metadata mapping and correction review](app/docs/M3-METADATA-RESTORATION-REVIEW.md). This does not authorize the remainder of M3.4, live calls, retrieval experiments, deployment or acceptance. Foundation checkpoint: `7480686`; remote documentation `e162192` integrated without rewriting history.

### Current limited authorization and operating correction — 2026-10-14

The owner accepted the LOCAL recommendation foundation and notes restoration: answers/notes survived refresh and notes-only edits preserved displayed raw 58.3 / industry-weighted 13.8. The new package implements M3.1 OpenAI runtime configuration, M3.3 Responses generation through unchanged prompt/validation, and ONLY M3.4 generation controls, validated narrative/evidence and loading/failure/freshness states in the existing Results layout. See [current review](app/docs/M3-LIVE-AI-REVIEW.md) and [provider/Columbia setup](app/docs/AI-PROVIDER-SETUP.md).

Provider baseline: gpt-5.4-mini, low reasoning, explicit configuration, default disabled. Live smoke is limited to five automated synthetic-profile attempts and estimated US$2 after local provider/model/key configuration; failures and timeouts count. No confidential/archived SME transmission, paid ordinary tests, deployment, main merge, deferred navigation, report work or retrieval experiments. Live verification remains pending without credentials; Milestone 3 remains open.

**Owner operating correction:** leave changes uncommitted. The owner handles staging, commits and pushes manually, superseding earlier commit/push instructions. Routine repository reads, scoped edits, tests and review-document updates are authorized without repeated conversational permission requests. Respect platform permission controls and explain actual blockers. Preserve methodology, architecture, scope, data-transmission and spending limits, with human stops for genuinely unresolved material decisions. Let running verification finish; do not restart completed work solely because of this correction.

### 2026-10-15 focused live-timeout diagnosis

M3.1/M3.3 live smoke FAILED: 0/5, all local timeout / HTTP 503 / not_accepted at the configured 10,000 ms deadline. gpt-5.4-mini / low / 4,000 output tokens throughout. Ledger usage is null for every attempt; estimated spend is a reservation, not observed usage. All five attempts count; allowance exhausted. Original app/.local/live-smoke-ledger.json preserved without reset or retry.

| Case | Attempt UTC (2026-10-15) | Preparation* ms | Provider* ms | Service ms | Endpoint ms | Outcome / HTTP | Usage |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- |
| synthetic-1 | 05:43:19.717Z | 104.21 | 10022.13 | 10126.53 | 10260.65 | timeout / 503 | null |
| synthetic-2 | 05:43:29.988Z | 57.15 | 10015.62 | 10072.92 | 10211.30 | timeout / 503 | null |
| synthetic-3 | 05:43:40.204Z | 65.45 | 10013.49 | 10078.99 | 10211.94 | timeout / 503 | null |
| synthetic-4 | 05:43:50.422Z | 79.89 | 10005.12 | 10085.09 | 10228.42 | timeout / 503 | null |
| synthetic-5 | 05:44:00.655Z | 63.85 | 10005.81 | 10069.70 | 10220.49 | timeout / 503 | null |

See [live diagnosis and one-request proposal](app/docs/M3-LIVE-AI-REVIEW.md#2026-10-15-live-timeout-diagnosis--allowance-exhausted) for full cap inventory, safe diagnostics, connectivity observation and uncertainty. An unauthenticated non-generating models GET returned expected 401 in 587 ms; no key or SME data sent. No additional generation during diagnosis. Normal default/maximum remains 10 seconds and the under-ten-second target is not met. Proposed next action, pending explicit approval: one synthetic-1 diagnostic using the unchanged adapter/model/low reasoning/4,000-token cap/prompt/retrieval/validation, a separate server-only 60-second deadline and one-shot reservation; estimated extra $0.324144 / cumulative $1.944864, actual billing unknown. No 60-second path has been implemented or executed. Diagnostic checks: 45 provider/service/smoke tests and 15 Golden matrix tests PASS; typecheck, lint and diff checks PASS. Original full gate retained as historical evidence; no full gate rerun for this focused diagnosis. All changes remain unstaged/uncommitted; owner handles Git. No acceptance or scope expansion.

### 2026-10-15 one additional diagnostic: authorized, executed, exhausted

Owner authorized exactly one additional synthetic diagnostic (60-second maximum; unchanged gpt-5.4-mini / low / 4,000 output tokens / prompt / retrieval / validation). Executed once at 06:30:03.038 UTC through the isolated server-only harness; no retries. Upstream HTTP 200; headers 14,943.2468 ms, body 88.2277 ms, provider total 15,041.5322 ms, preparation 122.9231 ms. Validation FAILED: two sme_context_missing issues in executive_summary; unanswered_category in four priority recommendations and two key gaps. No validated advice/citations published. Provider usage: 14,541 input / 2,277 output; estimated charge $0.02115225. Additional reservation $0.324144 and cumulative reservation $1.944864 preserved; prior five calls' actual charges remain unknown.

Separate ignored record: app/.local/live-diagnostic-2026-10-15.json, permanently prevents repeat execution. Original five-attempt ledger and environment file unchanged; runtime configuration remains 10,000 ms (never overridden). Three controlled harness tests, focused lint and no-generation preflight passed before dispatch. The normal under-ten-second target is unmet. Both allowances are exhausted. See [full live diagnostic evidence](app/docs/M3-LIVE-AI-REVIEW.md). No new calls, validation relaxation, acceptance or scope advancement. Changes remain unstaged/uncommitted; stop for owner review.

### 2026-10-15 offline follow-up: contract diagnosis only

No further provider calls. Rejected diagnostic prose was not retained, so the exact two missing labels and six rows' specific category choices cannot be recovered. The synthetic case observed only Governance. Verified prompt/validator ambiguity: summary asks explicit naming but validator requires literal labels; key_gaps has an observed-category restriction not stated explicitly in the prompt. Missing-data disclosure passes in grounding_notes. Safe diagnostic fields now identify missing contextField and offending canonical categories; acceptance rules unchanged. Offline verification: 77 focused tests, typecheck, focused lint and diff checks PASS. See [offline analysis, archived configuration comparison and smallest correction](app/docs/M3-OFFLINE-GENERATION-DIAGNOSIS.md).

Legacy Appsmith generation action had a 100-second timeout (both published/unpublished); n8n selected GPT-5.2 with empty options. Actual provider/workflow default deadlines, reasoning/output caps and latency are not captured. Proposed, not applied: clarify exact summary labels and allowed assessed categories for both recommendation/gap arrays; place unassessed disclosures in grounding_notes. Proposed operational provider deadline 30 seconds with 45-second generation-client caps, preserving the under-ten-second target and no retries. Current runtime remains 10 seconds; no further paid-call allowance or new scope. Changes remain unstaged/uncommitted.

### 2026-10-15 authorized prompt/deadline correction (offline)

Implemented prompt version legacy-runtime-v1-validated-transport-3: explicit exact summary labels, assessed/unassessed category lists, restrictions for both recommendation/gap arrays, missing-data disclosure in grounding_notes, counts as maxima. Archived template, scoring, retrieval and validation safeguards preserved. Runtime provider default/maximum 30 seconds; generation clients 45 seconds; request-body read 10 seconds and safe status 15 seconds unchanged. Immediate cancellation and the distinct under-ten-second performance target remain.

Explicit existing .env.local value 10000 still takes precedence; file preserved. Owner's single-line activation edit: `RECOMMENDATION_TIMEOUT_MS=30000`, then restart updated server. Both ledgers remain untouched and allowances exhausted. No provider calls authorized by this correction. Focused checks: 80 tests PASS, plus five controller and three diagnostic-harness safety tests. Full offline npm run verify PASS: typecheck, lint, 236 unit tests, production build, 55 Chromium browser tests. First gate exposed a fixture timeout mismatch; fixture aligned with new default, freshness assertions preserved, full gate rerun passed. No live verification of the revised prompt. See [live review](app/docs/M3-LIVE-AI-REVIEW.md). Changes unstaged/uncommitted; acceptance and later milestones remain gated.

### 2026-10-15 corrected-prompt one-request authorization: consumed

Owner authorized exactly one synthetic Governance-only live request with a new separate budget up to $0.35. Running-server safe readiness verified timeout 30000 and prompt legacy-runtime-v1-validated-transport-3; gpt-5.4-mini / low / 4000 unchanged. Preflight reserve $0.324144 fit the new allowance; cumulative reservations $2.269008. Dispatched exactly once at 07:05:54.679 UTC; upstream HTTP 200, headers 8631.2655 ms, body 223.1232 ms, provider 8864.2139 ms, service total 8937.7519 ms. Usage 14,714 input / 1,647 output; estimated charge $0.018447.

Validation FAILED on one exact industry-label omission (sme_context_missing at executive_summary, industry): response said "manufacturer" rather than "Manufacturing (Industrial / Components)". Two recommendations and one gap used Governance; missing-data disclosures were in grounding_notes. No rejected content entered Results UI. Synthetic body retained locally in app/.local/live-corrected-prompt-2026-10-15-response.txt; separate permanent record app/.local/live-corrected-prompt-2026-10-15.json. Previous ledgers and owner-edited environment file preserved. Five offline harness safety tests and focused lint passed. See live review for precise excerpts. All allowances exhausted; stop. No runtime correction, relaxed safeguards, later scope or Git operations performed.

### 2026-10-15 owner scope correction: migration baseline before editorial optimization

Explicitly remove literal industry/employee-band/business-goal repetition as a hard acceptance requirement. Implemented shared prompt/validation identity legacy-runtime-v1-validated-transport-4; current authoritative setup values display separately in the existing Results summary. No generated prose is repaired or relabeled as model output. Numeric, schema, citation-membership, assessed-category, cancellation/duplicate/stale and paid-control safeguards remain. No new semantic classifier or paraphrase rules. Existing 30-second provider / 45-second client caps remain.

Retained version-3 synthetic output replays successfully under the revised validator, with original matching scores/evidence and unchanged response bytes. This is offline replay, not a new live success or current-session advice. Original ledgers retain historical failures. See [baseline correction review](app/docs/M3-MIGRATION-BASELINE-REVIEW.md). No provider request or model/environment change. Full offline gate PASS: typecheck, lint, 240 unit tests, build and 55 browser tests; 69 focused tests also passed. M3 acceptance and exhausted live allowances remain gated. The linked review proposes a separately authorized two-request same-input GPT-5.4-mini/GPT-5.2 check with version 4, low reasoning, 4000 output tokens, 30-second provider/45-second client caps and a new $1.10 ceiling. No harness/model switch or paid execution is authorized by this proposal.

### First package: M3.1–M3.3

- Application recommendation service and provider-neutral request/result contract, with a server-only provider adapter. Recompute authoritative scores from trusted config and validated raw inputs; never accept client scores. Keep provider calls independent of the score endpoint.
- Port deterministic metadata document/chunk ranking from the final n8n workflow. Retain the documented 8-document/18-chunk baseline as explicit retrieval configuration, stable source-order tie handling and version identity. Use migrated stable document IDs; regression-test the deliberate improvement over legacy title joins and its evidence-set effects.
- Assemble the preserved runtime prompt with context, answered questions, deterministic outputs and retrieved evidence. Preserve semantic instructions; adapting interpolation and structured transport is implementation work, while material prompt changes require review.
- Validate JSON shape, ranks/counts, category names, source membership, allowed citation URLs, page/section provenance, absence of internal IDs and score restatements. Treat SME text/source excerpts as untrusted data, never instructions. Do not let generated text create new citations or overwrite scores. Do not silently repair incorrect numbers into apparently validated prose.
- Provider failures/timeouts/malformed responses return explicit recommendation-unavailable status. Bound request/output size and duration; avoid unbounded retries, sensitive logs, invented fallbacks or introducing a new SDK/service without evidence of need. Isolated HTTP via existing platform fetch is sufficient as the initial adapter proposal.
- Unit/retrieval fixtures and adapter contract tests precede credentialed smoke/latency tests. Exact prose parity is not required. Live-call cost and data approval must be established before external calls.

### Second package: M3.4–M3.6

- Include the owner-requested questionnaire review/navigation polish recorded under M3.4; verify it at M3.6 without changing deterministic scoring or blank-answer semantics.
- Replace fictional narrative only when validated generated output exists; retain current score/chart/explanation authority. Tie recommendation results to the same input/config/method identity and reject stale responses.
- Integrate evidence links and unavailable/retry states in the existing vertical results layout. Provide deterministic priority gaps separately and label their origin.
- Produce a print-ready durable report initially (browser Save as PDF), containing context, answers/skips, scores, versions, available recommendations and evidence. Omit unavailable AI content truthfully; report generation and all deterministic results remain usable during provider failure.
- Complete browser, citation/score consistency, stale-response, failure/timeout and report regression checks. Measure retrieval/provider/end-to-end latency under stated conditions; optimize only from evidence.
- Run the owner-requested LlamaIndex/LangChain experiment defined in M3.6 after establishing the native TypeScript baseline. Evaluate both frameworks separately, targeting complete validated recommendations in under 10 seconds; report quality, cost and latency before proposing production adoption.

### Required evidence and limitations

- Runtime prompt: `BUILD_PACK/06_AI_RAG/prompts/PROMPT_recommendation_runtime.md`; source node `Build Recommendation Prompt` in `BUILD_PACK/03_LEGACY_N8N/workflows/n8n-output-rag-final-2026-10-02.json`. Inspect the actual normalization/ranking/formatting nodes before porting, using `AI_PIPELINE_CURRENT.md` as a map, not target architecture.
- `PROMPT_INDEX.md` distinguishes runtime from offline extraction/generation. DocumentIndex/DocumentChunks provenance prompts explain existing records; do not run source-to-config regeneration in M3.
- Existing canonical 44 documents/428 chunks and `app/docs/CONFIG-MIGRATION.md` provide stable identity, not independently verified source content. Nine reconciled title pairs, duplicate legacy chunk IDs, edition ambiguity and inconsistent Scope 3 page references remain explicit. Preserved Drive binaries were not independently verified.
- Validate citation membership and safe link structure deterministically; do not equate that with external accessibility, source edition or factual verification. Trim presentation URL whitespace without silently rewriting canonical records. Unsupported/ambiguous evidence must be excluded or surfaced; any material source correction needs a reviewed provenance-preserving update.
- Golden outputs provide structural/grounding examples, not a prose oracle. Consumer Goods' historical prose says 70.3 while deterministic output is 70.4. M3 must use the accepted current canonical scores, including M2's documented differences.
- Optional notes are now collected and propagated under the accepted metadata correction. Country/revenue_band remain omitted and explicitly disclosed; do not invent values or silently restore them. See app/docs/M3-METADATA-RESTORATION-REVIEW.md.

### Server environment names and remaining live decisions

Runtime server names are documented in `app/.env.example` and app/docs/AI-PROVIDER-SETUP.md. The current adapter defaults to disabled and requires explicit provider/model/key configuration:

| Name | Purpose |
| --- | --- |
| `RECOMMENDATION_PROVIDER` | Explicit adapter selection |
| `RECOMMENDATION_MODEL` | gpt-5.4-mini baseline; reviewed snapshot supported, no silent substitution |
| `RECOMMENDATION_REASONING` | Supported effort; initial low |
| `OPENAI_API_KEY` | Server-only secret if the OpenAI adapter is selected |
| `RECOMMENDATION_TIMEOUT_MS` | Validated bounded provider deadline |
| `RECOMMENDATION_MAX_OUTPUT_TOKENS` | Validated cost/output bound |

No `NEXT_PUBLIC_` secret or client-controlled provider URL. The 2026-10-14 authorization selects OpenAI gpt-5.4-mini / low and at most five synthetic automated attempts within estimated US$2 after explicit local configuration. At the 2026-10-14 offline check no key was present. The subsequent owner-run five-attempt smoke failed on 2026-10-15; allowance exhausted (see diagnosis above). Confidential/archived SME transmission and public deployment are not authorized. Public exposure still requires authentication/abuse/spend/privacy controls. Citation/edition ambiguities remain excluded or disclosed. M2 acceptance and merge remain complete; local M3 foundation/notes acceptance does not accept the new live package.





## M3.1 — Recommendation service + provider boundary

**Status:** IMPLEMENTED / VERIFIED — human milestone acceptance pending

Historical package record (superseded by the current-state checkpoint above): the local M3.1–M3.3 foundation was accepted on 2026-10-14. The then-current live-provider extension is implemented and offline-verified (227 unit / 55 browser tests; full gate passed 2026-10-14); live verification and acceptance remain pending. See `app/docs/M3-LIVE-AI-REVIEW.md`; retain the original foundation review as historical verification evidence.



### Purpose

Replace the v1 n8n recommendation runtime with a maintainable application service boundary.



### Output

- recommendation-service interface

- server-side provider adapter

- model configuration

- structured request/response schema

- timeout/error handling

- provider-replacement seam



### Dependencies

- M2 approved

- preserved runtime recommendation prompt



### Notes

Do not recreate n8n literally unless justified.



Deterministic scoring must remain available if the model provider is unavailable.



---



## M3.2 — RAG source/chunk retrieval

**Status:** COMPLETE — accepted local native baseline, 2026-10-14

The accepted native TypeScript retrieval baseline is reused unchanged. Stable identities, ordering, 8-document/18-chunk selection and source exclusions retain their existing verification. No retrieval redesign or experiment is authorized in this package.



### Purpose

Reproduce grounded evidence selection before recommendation generation.



### Output

- DocumentIndex ranking

- DocumentChunks ranking

- document/chunk join logic

- evidence bundle passed to recommendation generation



### Dependencies

M3.1 plus canonical DocumentIndex/DocumentChunks.



### Notes

Start from preserved v1 metadata-ranking behavior.



Vector/embedding retrieval is not required unless separately justified.



---



## M3.3 — Structured recommendation generation

**Status:** IMPLEMENTED / VERIFIED — v6 hosted live path; human milestone acceptance pending

Historical package record (superseded by the current-state checkpoint above): the local M3.1–M3.3 foundation was accepted on 2026-10-14. The then-current live-provider extension is implemented and offline-verified (227 unit / 55 browser tests; full gate passed 2026-10-14); live verification and acceptance remain pending. See `app/docs/M3-LIVE-AI-REVIEW.md`; retain the original foundation review as historical verification evidence.



### Purpose

Generate grounded recommendations consistent with authoritative deterministic results.



### Output

- model call

- structured output parsing/validation

- evidence/source validation

- numeric-score consistency checks

- schema-valid recommendation payload



### Dependencies

M3.1–M3.2.



### Verification

Recommendations must:

- not contradict deterministic scores

- not invent sources

- align materially with weak areas

- remain relevant to SME context

- repeat scores exactly when scores appear in prose



Exact prose parity is not required.



---



## M3.4 — Results, gaps, recommendations + evidence UI

**Status:** IMPLEMENTED / VERIFIED — authorized Results/navigation closeout; human milestone acceptance pending

Historical limited-package record (superseded by the current-state checkpoint above): authorized 2026-10-14: explicit generation/regeneration, validated recommendations/evidence, loading/error/cancel/retry and freshness checks in the existing Results layout. This subset passed the full offline gate on 2026-10-14 (227 unit / 55 browser tests) and is not yet human-accepted. Navigation, questionnaire controls/Skip behavior and technical-JSON presentation below remain deferred; M3.4 as a whole is not complete.



### Purpose

Turn deterministic and AI outputs into a clear results narrative.



### Output

- overall score display

- category score display

- executive summary

- visual key-gap cards

- ranked recommended actions

- evidence/source presentation

- authoritative score charts



### Dependencies

M2.7 and M3.3.



### Notes

Default to a vertical narrative rather than tabs.



The current deterministic score remains authoritative.

### Deferred questionnaire review/navigation polish — human feedback 2026-10-12

Owner-requested follow-up from the M2 walkthrough; schedule with M3.4 in the M3.4–M3.6 package. This is a future implementation item, not an M2 blocker or authorization to begin M3.

- Make **Review Answers** available from every question, including the first, middle and last. Place the action consistently outside the question-card content (for example, below the active card), rather than making the last card the only discoverable route.
- Remove the per-card blank-answer gate and the message "Enter an answer or choose Skip." A blank question may advance or open answer review without an explicit Skip action; the last question must behave consistently with the rest.
- Use the existing answer-review screen to summarize unanswered/skipped questions and offer review of missing answers or explicit generation of a partial score.
- Preserve current drafts when opening review. Keep Skip available as an optional action, maintain existing answer retention and stale-result protection, and retain validation of invalid nonblank values. Do not coerce blanks or invalid values to zero, alter scoring/denominator rules, or change canonical configuration.
- Check that the action is discoverable and usable on desktop, narrow/mobile layouts and keyboard navigation. Keep its label distinct from the later score-generation confirmation.

Acceptance at M3.6: verify entry to review from the first, a middle and the last question; blank final-question access without Skip; unchanged answers/drafts and missing counts; valid partial-score confirmation; and continued rejection of invalid nonblank scoring inputs.

### Additional review/results UX — human feedback 2026-10-14

During the rebuilt `72f9eb3` walkthrough, the owner confirmed answers and Additional Context / Requirements persist after refresh and found **How this score was calculated** useful. The owner then edited only the additional context and recalculated; before/after screenshots show the same displayed raw score (58.3) and industry-weighted score (13.8), with four answered questions. This completes the reported manual notes/persistence check; it is not a new numeric oracle or formal package/milestone acceptance.

- Put the primary **Generate score / Generate score anyway** action near the top of Review Answers, alongside the answered/unanswered summary, so users need not scroll through the entire questionnaire. Retain a matching bottom action if useful; both must perform the same operation.
- Make score generation lead directly to the results page and its calculation/loading/error states. Remove the intervening **Your answers are ready for calculation / View calculated results** screen from the normal flow; move any necessary calculation/data-handling notice inline. This navigation change does not authorize live AI calls or change server validation, answer retention, missing-data semantics or deterministic scoring.
- Retain the readable calculation explanations and per-question breakdowns.
- The owner questioned the user-facing purpose of raw technical JSON. Presentation recommendation for M3.4 review: label it clearly as advanced audit/debug detail, keep it collapsed and outside the primary reading flow, and avoid raw JSON blocks in the default printable report. Preserve full-precision structured traces and their config/method/rule provenance; this is a presentation decision, not removal of the audit capability.

Extend M3.6 acceptance checks to cover the top-of-review generation action on desktop/mobile and keyboard, direct results navigation without the extra confirmation screen, calculation loading/failure states, preserved answers on return, and continued access to readable calculations and optional technical audit detail. These items are planned with M3.4/M3.5; this record does not begin implementation.

### Proposed five-stage navigation — owner discussion 2026-10-14

The owner proposes a horizontal connected step indicator at the top of the assessment and results pages: **Set Up > Data Input > Questions > Review > Results**, with completed stages green and inaccessible stages gray. The purpose is to revisit business context, the chosen input method or answers directly, then return to updated results. Record this as a design proposal for M3.4; implementation and final interaction details remain pending.

Recommended interaction rules to resolve with the package:
- Keep the navigation consistently visible, with a compact accessible treatment on narrow screens that does not cover content. Preserve the existing vertical results narrative; these are process stages, not tabs for result sections.
- Separate completion from availability: distinguish the current stage, completed stages, accessible incomplete stages and locked stages with text/icons as well as color. Explain why a stage is locked. Set Up must always be accessible for correction, and previously accessible stages must remain reachable when their prerequisites remain valid.
- Require valid business setup and an available input method to proceed into questions. Incomplete questionnaires remain valid for review and partial scoring; do not require every answer or explicit Skip before enabling Review. Invalid nonblank answers must remain visible and correctable, and must not be silently scored or discarded.
- Initially generate a score from Review with clear answered/unanswered counts, then allow revisiting Results directly while current prerequisites remain valid. Treat returning to Results after scoring-input edits as a request to recompute authoritative scores. Show loading or unavailable/validation states; never present an old score as current.
- Preserve answers, notes and navigation position when moving between stages. Re-evaluate the selected questionnaire after context changes using existing deterministic selection rules; only currently applicable valid answers contribute. Disclose any newly unanswered questions without silently resetting the assessment.
- Notes-only edits leave deterministic scores unchanged but make any previous recommendations outdated. Recommendation responses and reports must match current input/config/method/policy/prompt identity; do not trigger paid AI generation merely by navigating between stages. An explicit regenerate action may request new advice once live calls are approved.
- This navigation proposal does not implement utility-bill upload or the emissions calculator. Those input methods remain visibly unavailable until their own authorized milestones.

Extend M3.6 browser checks to cover forward/backward stage navigation, keyboard/mobile access, partial questionnaires, invalid setup/answers, context edits that change selected questions, refresh persistence, and stale or out-of-order score/recommendation responses after edits.





---



## M3.5 — Durable report / PDF

**Status:** IMPLEMENTED / VERIFIED — downloadable print-ready HTML; human milestone acceptance pending



### Purpose

Create a portable assessment record independent of the live browser session.



### Output

Downloadable report containing:

- SME profile/context

- answers/skips

- question scores

- category scores

- overall scores

- gaps

- recommendations

- evidence/sources

- config/method version



### Dependencies

M3.4.



### Notes

Print-ready HTML is acceptable initially if it satisfies the durable-report requirement.



---



## M3.6 — Failure, latency + recommendation regression review

**Status:** REQUIRED REGRESSION VERIFIED — research experiments deferred by current owner direction; human milestone acceptance pending



### Purpose

Prove the recommendation layer is reliable and degrades gracefully.



### Output

- provider-failure tests

- timeout tests

- deterministic fallback behavior

- recommendation regression checks

- questionnaire-to-answer-review navigation and blank-answer regression checks from M3.4

- latency measurements

- runnable LlamaIndex and LangChain prototypes, comparative benchmark results and an adoption recommendation

- Milestone 3 review package



### Dependencies

M3.1–M3.5.



### Notes

Aim for approximately 10 seconds or less under normal test conditions where practical.



Scores, charts, deterministic gaps, and report generation must still work when AI fails.

### Deferred recommendation-quality evaluation — M3.6 only

After a working migration baseline and separate authorization: evaluate broader prose quality, claim-to-source support/entailment, model selection and latency distribution. Distinguish citation membership from evidence actually supporting a claim; record human rubric and disagreements. Do not turn each editorial preference into a new migration rejection rule. The separately proposed small GPT-5.2 same-input check is a bounded live-review proposal, not completion of this evaluation or proof of Appsmith parity. No framework, model, grounding or latency experiments are implemented now.

### Planned LlamaIndex / LangChain experiment — owner request 2026-10-13

Detailed future protocol: [M3.6 retrieval accuracy, performance and efficiency evaluation](app/docs/M3.6-RETRIEVAL-EVALUATION-PLAN.md), integrated from `e162192`. This is planning only; experiments remain PENDING.

**Purpose:** Build demonstrable hands-on experience with both frameworks and test whether they help deliver assessment recommendations in **under 10 seconds**. This is planned work within M3.6, after the native baseline exists; this M3.6 experiment remains PENDING. Framework use alone does not establish a speed improvement.

**Scope**

- Build small, runnable TypeScript prototypes behind the same retrieval/provider contracts: native TypeScript as the control, LlamaIndex for evidence retrieval/assembly, and LangChain for recommendation orchestration and structured output. Exercise actual framework capabilities; installing packages alone is not a completed experiment. Test each separately before considering a combined stack.
- Keep experimental adapters isolated from the default runtime. Record package versions and dependency implications. A vector database, embeddings, a new managed service or a replacement of the application architecture is not required by this experiment.
- Preserve canonical config, deterministic scoring, accepted numeric policy and BUILD_PACK. Keep framework code outside the deterministic domain. Use the existing source identities, evidence validation and explicit failure behavior.

**Comparison and timing**

- Use the same five SME test contexts, versioned corpus, approved provider/model and generation settings, prompt instructions and comparable evidence/output budgets. Use fixed evidence for an overhead comparison; evaluate retrieval differences separately. Record any changed ranking, prompt, model or concurrency so benefits are not incorrectly attributed to a framework.
- Measure from the user's recommendation request until complete, validated recommendations are visible. Break out retrieval/evidence assembly, provider generation, parsing/validation and total elapsed time. Report sample counts, median, p95, failures/timeouts and token usage/cost; distinguish cold starts, warm uncached runs and cached results. First-token time or a progress indicator does not satisfy the completion target.
- Target **under 10 seconds under documented normal test conditions**. Profile bottlenecks and test bounded optimizations without reducing required output or validation quality. Report misses honestly; this is a measured target, not a promised service guarantee. Existing provider/model, live-call budget and data-transmission approvals apply.

**Quality and review evidence**

- Apply the same checks to each variant: structured validity, authoritative score consistency, citation/source membership, relevance to SME context and priority gaps, plus stale-response and provider-failure behavior. Compare grounded quality as well as speed; exact prose parity is not required.
- Include runnable commands, pinned versions, test conditions, measurements and a brief architecture/tradeoff note in the M3 review package. Recommend retaining native TypeScript, adopting a useful framework component, or deferring adoption based on the evidence.
- Preserve enough implementation and evaluation evidence to support an accurate CV description such as "implemented and evaluated LlamaIndex and LangChain recommendation prototypes." Distinguish prototype experience from production deployment; production adoption is a separate outcome of review.




---



# Milestone 4 — Emissions calculator and quantitative input flow



## M4.0 — Deterministic quality-tool evaluation + refactor if needed

**Status:** COMPLETE — owner closed evaluation on2026-10-20; checklist row20. No tools installed. Tooling/refactoring deferred to optional, time-allowing final pre-shipping QA on a separate branch. M4.1 next; original broader scope below is historical, not an execution prerequisite.
Evaluate jscpd, ESLint/Oxlint, Prettier, Knip, dependency-cruiser, Archlint (verify exact identity), and sirknigget/antislop (verify license/code). Select the smallest useful long-term set based on coverage, overlap, maintainability and false positives. Extend codex.prompting.memory.md with the Markdown adopt/pilot/defer/reject summary; do not create a milestone document.

Record production/test LOC separately excluding generated files/dependencies; production build/client JavaScript/container sizes in MB with definitions; build duration and approximate assessment/scoring/Results speed on the same environment and fixtures. Repeat timing samples with median/range and separate cold/warm conditions. No paid provider speed tests.

Present and obtain approval for exact new analysis/benchmark commands before running them under the test policy. Refactor only evidence-backed dead code, duplication, complexity or architecture defects. Preserve scoring, config, sessions, APIs, recommendation safeguards and accessibility. Run the same before/after measurements and approved regression gate. Fix/revert regressions, document benefit/limitations, and retain no-op outcome if a refactor is not warranted.


## M4.1 — Reconcile calculator methodology + fixtures

**Status:** ACCEPTED — owner2026-10-21 accepted reference specification/fixtures with documented limitations. Historical factors remain reference-only; U-026 pending; Scope3 excluded. M4.2 separately authorized.



### Purpose

Turn the preserved spreadsheet into a trustworthy implementation reference.



### Output

- verified calculator formula decisions

- discrepancy log

- unit assumptions

- calculator regression fixtures



### Dependencies

- M3 approved

- emissions calculator workbook/spec



### Notes

Do not blindly port unverified spreadsheet formulas.



---



## M4.2 — Calculator engine + UI

**Status:** ACCEPTED by owner2026-10-21. Remaining calculator follow-up verified; scoped commit/push authorized. Not deployed or merged. M4.3 branch preparation only; implementation not started.



### Purpose

Provide a usable deterministic emissions-calculation path.



### Output

- calculator inputs

- unit handling

- deterministic calculations

- validation

- correction/edit flow

- calculator UI



### Dependencies

M4.1.



### Notes

Calculator logic remains separate from scoring semantics.



---



## M4.3 — M1 follow-up: homepage branding and video

Historical scheduling: not started in M4.2. Subsequently completed and owner-accepted; branding/video/palette deployed with5b79ef2. This accepted work is not reopened by M4.4.

## M4.4 — Canonical metric mapping + autofill

**Status:** Implementation complete and locally verified; owner review pending. M4.5 has not started.



### Purpose

Resolve quantitative values into assessment inputs without asking for the same information twice.



### Output

- stable `metric_id` mapping

- units/provenance

- questionnaire autofill

- duplicate-input suppression

- user correction capability



#### M4.4 implementation and local walkthrough (2026-10-25)
- `app/src/application/calculator-mapping.ts` joins accepted calculator outputs to selected canonical `metricId` and exact presentation units; no title/position matching and no question/benchmark/scoring changes. Plain-decimal transport preserves the number, without intermediate rounding.
- Intensities: carbon_intensity_{bus,cg,const,food,manuf} → tCO2e/USD; energy equivalents → kWh/USD; water → m3/USD; waste → kg/USD. Waste diversion/hazardous metrics → percent; water_withdrawal_m3 → m3/yr with source snapshot/breakdown. Canonical MET_RE_SHARE (including U-026) remains held; no denominator chosen. Unknown/partial totals, missing USD revenue and partial annual periods are not filled or annualized.
- Existing Data Input calculator adds inspectable destination/value/unit rows and explicit business/period/boundary confirmation. Existing questionnaire entries are unchecked by default; replacement requires selecting the destination. Only confirmed selected values transfer, to all selected destinations requested by the user. Raw answers still go through the existing deterministic scoring path; the calculator does not compute assessment scores.
- A validated optional transfer snapshot preserves original source quantities, period, revenue, factor identities and evidence in the existing assessment session. Old sessions without this field remain valid. Review and the relevant question expose provenance. Forward navigation bypasses confirmed calculator answers, while Review/direct question navigation allows editing. Manual corrections detach that answer from the transfer; calculator edits clear only untouched transferred answers and require recalculation/reconfirmation. Switching to manual does not clear answers or change scoring. Company/industry/location changes clear still-linked values before reuse.
- Historical factors stay reference-only with explicit acknowledgement, not production-approved/global. Scope3 excluded. No recommendation behavior change, paid calls, deployment or M4.5 acceptance claim.
- Local walkthrough: Data Input → calculator → use your existing annual entries and same-period USD revenue → Calculate for review → inspect question IDs/metric IDs/units → confirm boundaries and Use selected values in questionnaire → Start questionnaire → Review all answers → inspect calculator source details or edit a transferred answer. Return to Data Input and change a source: untouched transferred answers become unknown until reconfirmed, while manual corrections remain. Refresh preserves entries and reviewed transfers. Do not Generate recommendations for this local mapping review.

### Dependencies

M4.2 plus canonical metric identities.



---



## M4.5 — End-to-end quantitative flow + review

**Status:** PENDING



### Purpose

Prove calculator/manual values correctly enter the deterministic assessment core.



### Output

Demonstrated flow:



`SME setup → manual/calculator data → resolved metric → questionnaire autofill → deterministic score`



Plus Milestone 4 review package.



### Dependencies

M4.1–M4.3 and Milestone 2 engine.



### Notes

Utility-bill/evidence extraction remains stretch unless explicitly approved.



---



# Milestone 5 — Basic config and knowledge-base maintenance

**Milestone classification:** CURRENT / REQUIRED



## M5.1 — Persistence + config/version data model

**Status:** PENDING



### Purpose

Introduce durable storage only once maintenance/versioning requires it.



### Output

- typed persistence/data-access layer

- schema migrations

- config-version records

- source/document records

- publication state



### Dependencies

M4 approved plus architecture review.



### Notes

This is the likely point to introduce PostgreSQL and a typed data layer such as Drizzle.



Do not scatter raw database access throughout the application.



---



## M5.2 — Protected maintainer/admin boundary

**Status:** PENDING



### Purpose

Keep privileged maintenance capabilities separate from the public assessment.



### Output

- protected maintenance route/service boundary

- authorization approach appropriate to deployment

- clear separation from public runtime



### Dependencies

M5.1 plus security requirements.



### Notes

Do not expose admin functionality publicly merely because end-user accounts are deferred.



---



## M5.3 — Config import, staging + validation

**Status:** PENDING



### Purpose

Let maintainers update approved config datasets without application source-code edits.



### Output

- import flow

- staging state

- schema validation

- referential validation

- validation report before activation



### Dependencies

M5.1–M5.2.



### Notes

Canonical config entities remain independently addressable and versioned.



---



## M5.4 — Knowledge-base/source maintenance

**Status:** PENDING



### Purpose

Let maintainers update recommendation source material safely.



### Output

- source/document update flow

- DocumentIndex maintenance

- DocumentChunks maintenance

- validation



### Dependencies

M5.1–M5.3.



### Notes

Automated source-to-config regeneration belongs to Milestone 5A.



---



## M5.5 — Activation, live-version selection + fallback

**Status:** PENDING



### Purpose

Make configuration changes reversible and auditable.



### Output

- publish/select live config version

- assessment/report records retain config version

- original Capstone config retained permanently

- rollback/fallback flow



### Dependencies

M5.3–M5.4.



---



## M5.6 — Maintenance security/deployment + review

**Status:** PENDING



### Purpose

Prove the maintenance path is safe, portable, reproducible, and operational.



### Output

- security checks

- clean-clone deployment/migration test

- backup/fallback demonstration

- Milestone 5 review package



### Dependencies

M5.1–M5.5.



---



# Milestone 5A — Automated source-document to config regeneration

**Milestone classification:** NEEDS EXPLICIT APPROVAL



## M5A.0 — Scope/IP approval gate

**Status:** BLOCKED



### Purpose

Confirm automated source-to-config regeneration is within approved scope and IP boundaries before implementation.



### Output

Explicit human authorization and documented research/IP boundary.



### Dependencies

- Prof. Guo / funded-scope clarification

- Columbia IP guardrails



### Notes

Do not design or prototype detailed commercial/proprietary differentiation merely because it becomes technically possible.



---



## M5A.1 — Automated source-to-config pipeline

**Status:** BLOCKED



### Purpose

Automate the preserved Capstone transformation sequence for future source sets.



### Potential output

- document indexing

- document chunking

- AtomicIndicator extraction

- AtomicIndicator normalization/transformation

- clustering/frequency/context processing

- base-weight generation

- MultiplierRules generation

- CategoryWeights generation

- QuestionBank generation/refinement

- related retrieval/config artifacts



### Dependencies

M5A.0 approval plus preserved provenance/prompts.



### Notes

This is a maintenance workflow, not a runtime assessment path.



Semantic prompt/method changes require human approval.



---



## M5A.2 — Review, publish + rollback

**Status:** BLOCKED



### Purpose

Keep regenerated configuration human-reviewed, versioned, and reversible.



### Output

- generated-artifact review

- validation

- version publication

- rollback to original Capstone baseline

- Milestone 5A review package



### Dependencies

M5A.1.



---



# Milestone 6 — Interactive levers

**Milestone classification:** STRETCH



## M6.1 — Define eligible lever mappings

**Status:** STRETCH



### Purpose

Identify operational variables with a deterministic relationship to scoring.



### Output

Approximately 2–3 candidate levers mapped to:

- canonical metrics

- current values

- allowed ranges

- deterministic scoring paths



### Dependencies

Validated scoring/calculator outputs plus methodology review.



### Notes

AI may rank eligible levers but may not invent the mathematical relationship between a lever and score.



---



## M6.2 — What-if sliders + shadow score

**Status:** STRETCH



### Purpose

Let users explore plausible improvement scenarios without overwriting authoritative results.



### Output

- slider controls

- immediate deterministic recomputation

- authoritative current score

- clearly distinct what-if / ghost score



### Dependencies

M6.1 plus deterministic engine.



---



## M6.3 — Lever review gate

**Status:** STRETCH



### Purpose

Verify mappings and ensure no scoring methodology was silently altered.



### Output

- lever rationale

- canonical metric mapping

- baseline vs what-if examples

- Milestone 6 review package



### Dependencies

M6.1–M6.2.



---



# Milestone 7 — Quick vs Full assessment

**Milestone classification:** STRETCH / METHODOLOGY REVIEW



## M7.0 — Quick vs Full methodology approval

**Status:** BLOCKED



### Purpose

Define how a shortened assessment can produce useful screening value without misleading comparability.



### Output

Approved methodology proposal, potentially using:

- distinct screening score

- core-question-only score

- statistically calibrated approximation

- another explicitly reviewed method



### Dependencies

Validated deterministic engine plus methodology review.



### Notes

Do not simply remove questions and reuse the Full score label.



---



## M7.1 — Implement + validate shortened assessment

**Status:** BLOCKED



### Purpose

Build the approved Quick mode only after its methodology is approved.



### Output

- Quick assessment flow

- approved score treatment

- validation evidence

- Milestone 7 review package



### Dependencies

M7.0 approval.



---



# Milestone 8 — Alan/Henry external benchmark layer

**Milestone classification:** RESEARCH EXPERIMENT



## M8.1 — Audit Alan/Henry research applicability

**Status:** RESEARCH



### Purpose

Define exactly what the large-company China/HKEX/EU research can legitimately support.



### Output

- source/coverage/fit memo

- limitations

- allowable comparison claims

- explicit distinction from SME evidence



### Dependencies

Preserved Alan/Henry research package.



### Notes

The source population is not SMEs.



---



## M8.2 — External benchmark experiment/display

**Status:** RESEARCH



### Purpose

Test an external-context layer without contaminating the core SME score.



### Potential output

- peer/external benchmark display

- contextual recommendation evidence

- verification/research-page comparison

- reporting-frequency comparison



### Dependencies

M8.1.



### Notes

Do not alter core weights or scores by default.



---



## M8.3 — Adoption decision + review

**Status:** RESEARCH



### Purpose

Decide whether the experimental benchmark layer belongs in the product.



### Output

- experiment findings

- limitations

- keep / modify / drop decision

- Milestone 8 review package



### Dependencies

M8.1–M8.2.



---



# Cross-cutting execution rules



These apply to every execution step.



## Scope discipline

- Work only on the explicitly authorized step.

- Do not silently begin the next step.

- Do not add stretch/commercial functionality because it seems convenient.

- If a required change crosses milestone or IP boundaries, stop for review.



## Build Pack protection

- Do not modify `BUILD_PACK` during ordinary implementation unless explicitly authorized.

- Treat it as the evidence/methodology baseline.



## Deterministic-core protection

- Scoring remains deterministic.

- AI may not replace config-driven scoring logic.

- AI failure must not break the core assessment once that capability exists.



## Config protection

Keep these conceptual entities distinct:

- QuestionBank

- AnswerScales

- MetricBenchmarks

- MultiplierRules

- CategoryWeights

- DocumentIndex

- DocumentChunks



## Testing

Before a step is presented as complete:

- run relevant unit tests

- run integration/browser tests where appropriate

- run typecheck

- run lint

- run build

- run Golden Tests when applicable

- test relevant error/failure paths

- verify no secrets or generated junk are being committed



Use `npm run verify` as the baseline verification command once applicable.



## Git discipline

- Keep changes scoped to the current execution step.

- Do not commit or push unless explicitly authorized.

- Keep commits coherent and reviewable.

- Do not rewrite shared history.

- Never commit secrets.



## Completion report

At the end of each meaningful execution step, report:



### Changed

What was implemented or modified.



### Verified

Tests/checks run and results.



### Decisions

Notable implementation choices.



### Deviations

Any intentional difference from spec/baseline.



### Risks / open questions

Anything needing human review.



### Next

The next proposed action without starting it.



---



# Current position

- M1.0–M1.4 — COMPLETE (previously implemented and human-reviewed).
- M2.1 — COMPLETE (accepted by human review; see the M2.2 package acceptance record above).
- M2.2 — COMPLETE (accepted by human review; see the M2.2 package acceptance record above).
- M2.3–M2.5 — COMPLETE; implemented, verified, and accepted by human review on 2026-10-11.
- M2.6 — COMPLETE; implemented and verified on 2026-10-11; accepted by the owner in the final M2 walkthrough on 2026-10-12.
- M2.7 — COMPLETE; implemented, verified and explicitly accepted on 2026-10-12. Milestone 2 is complete; see app/docs/M2.7-MILESTONE-2-REVIEW.md. Questionnaire review/navigation follow-ups remain deferred to M3.4/M3.6. PR #3 merged into main as `4929f9f2969fa946da1066ea3825921349ecf641` on 2026-10-12.
- Current branch — `milestone-3-recommendations`, created from synchronized main at `4929f9f2969fa946da1066ea3825921349ecf641`; the M2 branch/history remain preserved. Local foundation/notes accepted 2026-10-14. M3.1/M3.3 live extension and limited M3.4 Results integration are CURRENT, pending live verification and review. M3.2 native baseline is accepted and unchanged. Remaining M3.4 navigation, M3.5 and M3.6 are PENDING.
- All later steps remain subject to their existing status and explicit human authorization.

## Owner acceptance and one-shot v4 browser walkthrough — 2026-10-15

The owner accepted the offline context-contract correction as reviewed, not all of M3. GPT-5.2 comparison and its harness are deferred to M3.6; the former $1.10 proposal is not active authorization. Configured model remains gpt-5.4-mini.

Exactly one separately authorized synthetic request was dispatched through the application's actual Generate recommendations button in a fresh Playwright browser context. The owner's port-3000 server reported v3; it was left untouched. The existing verified v4 production build ran temporarily on loopback port 3002 with bounded local provider-body capture and an exclusive one-dispatch lock. Readiness confirmed v4, gpt-5.4-mini, low reasoning, 4000 output tokens, 30000ms provider and 45000ms generation-client caps. No runtime source, model configuration or .env.local was changed. Prior assessments/browser storage were untouched.

Before dispatch, the conservative $0.324144 reservation fit the new $0.35 ceiling. No retry or regeneration occurred. Separate evidence: app/.local/live-v4-browser-attempt.json; application response: live-v4-browser-application-response.json; original provider body: live-v4-browser-provider-response.txt (17956 bytes). Files contain synthetic evidence only; no request headers/credentials were recorded. Prior ledgers and retained response hashes are unchanged. Cumulative reservations across all eight attempts: $2.593152; reservations are not actual cumulative billing because the first five failures lack usage.

Result: HTTP 200, available, all application checks passed. Preparation 115.064ms; provider headers 6886.532ms; body completion 46.054ms; total provider 6945.670ms; service total 7082.010ms; browser click-to-complete 7474.145ms. Usage: 14691 input / 1173 output tokens. Estimated cost: $0.01629675 at the verified $0.75/$4.50 per-million rates. One observation meets the under-ten-second target; it does not establish p95 or general reliability.

Visible walkthrough: one Governance recommendation, one Governance gap, authoritative Manufacturing / 251 - 500 / Investor readiness context, and all three citation tuples displayed. Recommendation: Publish a written environmental policy and assign ownership. It proposes a practical policy, responsible leader, annual review and data-quality process. Sources are Industrial Machinery & Goods Sustainability Accounting Standard (Activity Metrics p.6) and Chemicals (Safety & Environmental Stewardship pp.29-30; Operational Safety pp.34-35). Membership checks pass; claim-to-excerpt support remains a human-review limitation. No source links were opened to claim independent verification.

Notes-only followup used the actual setup textarea, Continue to input method, Start questionnaire, then Results. Answers and all other profile fields were unchanged; scores remained 51.0 raw / 12.1 weighted; previous advice was absent and Generate was available. All generation POSTs were blocked in followup; none were attempted. Existing navigation clears non-persisted advice as well, so this live walkthrough alone does not isolate notes identity invalidation from navigation clearing. Six focused offline controller tests passed, including notes-only invalidation of displayed output. Initial walkthrough harness mistakes (returning from incomplete setup and comparing innerText with textContent) were corrected without application changes or paid retries.

Screenshots retained locally: live-v4-browser-accepted.png and live-v4-browser-notes-edited.png. Earlier full offline gate remains valid: typecheck/lint/build, 240 unit tests and 55 browser tests passed. No runtime edits were made in this walkthrough package. All changes remain unstaged/uncommitted. M3 acceptance, deployment and merge remain pending.

### Design-planning checkpoints retained — no implementation authorization

Before deferred M3.4 work: review a concrete design/interaction plan for the existing five-stage navigation proposal, partial-assessment Review access, top-of-review score action, direct Results transition, notes/answer persistence and stale-result behavior. Include desktop/mobile and keyboard states, prerequisite/locked states and loading/error handling; seek owner review before design implementation. Preserve the recorded calculation-explanation and advanced-audit-detail requirements.

Before M3.5: review durable-report content, source/grounding disclosures, printable layout and advanced-audit presentation before implementing report/PDF work. At M3.6: evaluate the reviewed navigation/report designs, failure/latency regressions, prose quality, claim-to-source grounding, and the deferred same-input GPT-5.2 comparison/harness alongside the existing retrieval evaluation plan. These are planning checkpoints only; no design implementation, model switch or experiment starts here.

### Local Results operational fix — 2026-10-16
Live walkthrough paused. A stale next start process serving a replaced .next build caused ChunkLoadError / HTTP 404 on Results. Restarting the unchanged verified build fixed the two-answer partial-assessment transition and refresh: 51.0 raw, 12.1 weighted, answers preserved; zero browser errors or provider requests. Details and before/after evidence in app/docs/M3-LIVE-AI-REVIEW.md. Stop the production server before build/verify replaces its build directory; restart after completion. No runtime or methodology change, no M3 acceptance.

## Focused Results interaction/UI package — authorized 2026-10-16

Owner authorizes combined Generate score and recommendations action (including partial confirmation), immediate independent scores, one explicitly requested recommendation attempt, failure/retry/cancel and duplicate/stale protection; balanced responsive Results layout; expanded executive summary and collapsed counted gaps/actions with evidence/technical disclosure. Use installed UI/accessibility guidance and existing design primitives. No paid calls, new AI components, scoring/retrieval/config/validation/provider changes, commits or pushes. Newer uncommitted work and ledgers must be preserved. This supersedes the earlier restriction on this specific Results transition/layout work, not the rest of deferred navigation, M3.5 reports or M3.6 experiments. M3 is not accepted. Implementation/verification record: app/docs/M3-RESULTS-INTERACTION-REVIEW.md.

Latest owner clarification: scores first, executive summary immediately below with loading; test refresh/navigation during generation, unknown provider outcome and explicit recovery without duplicate automatic dispatch. Restart only the final verified build for manual testing. No provider calls authorized by this verification.

Focused Results package verification complete (2026-10-16): npm run verify PASS — typecheck/lint, 247 unit tests, production build, 61 browser tests; production audit zero vulnerabilities. Desktop/tablet/mobile and pending/recovery visual review complete. Refresh transport-failure receipt defect corrected and verified; no automatic duplicate generation, unchanged scores and explicit unknown-outcome recovery. No provider calls; protected baseline and ledgers unchanged. M3 remains unaccepted; all edits unstaged/uncommitted. See app/docs/M3-RESULTS-INTERACTION-REVIEW.md.

## Results visual correction — owner authorized 2026-10-16

Correct presentation omissions from manual review: compact stored context and accurate score-driver explanation; progressive technical information; top action category/difficulty badges; per-insight accessible source dialogs; reordered/grouped evidence; separate missing-information notice and existing unanswered-item navigation. Use ui-ux-pro-max and ui-styling. No scoring/retrieval/prompt/config/provider changes, paid calls, reports, anticipated ROI, commits or pushes. M3 acceptance is unchanged. Review and per-requirement evidence: app/docs/M3-RESULTS-VISUAL-CORRECTION-REVIEW.md.

Results visual correction gate PASS (2026-10-16): typecheck/lint, 248 unit tests, build, 65 browser tests; desktop/tablet/mobile and retained-response visual inspection complete. All seven UI requirements implemented; score comparison and exact new manual-response audit remain evidence-limited. No provider calls or changes to scoring/config/retrieval/provider settings/ledgers. M3 unaccepted; changes unstaged/uncommitted. See M3-RESULTS-VISUAL-CORRECTION-REVIEW.md for screenshot checklist and transient unchanged-test timeout history.


## Loading/motion closeout authorization — 2026-10-16

Owner authorized the remaining M3.4 loading spinner, approximately two-second rotating words, slower confirmed selection/card transition, delayed offline and reduced-motion verification, plus a private Hetzner staging PLAN only. No provider calls, deployment, commits or pushes. M3/recommendation quality remains unaccepted.

Implemented: 800 ms pointer selection pause with visible Selected confirmation; 420 ms card entry; loading spinner and cosmetic words every 2000 ms. Words do not claim measured provider progress. Reduced motion uses static text/ring and no card animation. Six focused browser checks, typecheck/lint/build passed; full offline gate result recorded below after completion.

GROUNDING-001 — OPEN: Chemicals Operational Safety pp.34–35 / p.35 excerpts do not directly support the reported whistleblower/grievance-channel, confidentiality or non-retaliation recommendation. Citation membership is insufficient proof of claim support. Exact latest manual output is unavailable, limiting complete claim audit. Do not mark recommendation quality accepted; broader grounding evaluation remains M3.6.

Staging proposal: [private Hetzner plan](app/docs/PRIVATE-HETZNER-STAGING-PLAN.md). Owner supplied capstone-ai (89.167.6.61); remote inspection blocked by unavailable SSH authentication, not by missing host identity. Existing trusted-host BatchMode connection as default user guyli failed with Permission denied; no remote command ran. Local setup inspected. Prefer isolated loopback service plus authenticated SSH tunnel, disabled provider/no credentials, and separately labeled non-billable synthetic preview if authorized. No existing remote services inspected or modified.


Final loading/motion package gate: npm run verify PASS (typecheck, lint, 248 unit tests / 29 files including Golden coverage, production build, 69 Chromium tests). Six focused browser checks also passed. Delayed responses prove one request, scores retained, two-second rotation, static reduced-motion feedback and completion cleanup. Selection confirmation remains visible at 600 ms, advances after the 800 ms pause; 420 ms card animation is disabled for reduced motion. Loading screenshots inspected in both modes; responsive Results/source-dialog checks passed at 1440/768/390. Production audit zero vulnerabilities; credential-pattern scan zero matches. Protected BUILD_PACK/domain/config/lockfile diff empty, prior four evidence hashes unchanged, index empty; generated outputs ignored. No provider calls.

Local operational recovery: no listener was present initially. Final verified build 7XkDJeIhEZ9UV7jnWUUxu restarted in persistent hidden process 16232; /results HTTP 200, readiness v4 / gpt-5.4-mini / low / 4000 / 30000 ms confirmed without generation. Client cap unchanged at 45000 ms. Ready for manual testing at http://127.0.0.1:3000. Local existing live settings are unchanged; the proposed non-billable staging preview is not deployed. All edits unstaged/uncommitted. M3 and recommendation quality remain unaccepted.


## Owner acceptance: focused Results UI corrections — 2026-10-16

Owner explicitly accepted the requested Results UI corrections, loading feedback and slower card transitions. This includes the compact context/hierarchy, source dialogs, evidence ordering, reduced clutter, spinner/two-second rotating wording, visible selection confirmation and slower motion. Retained gate: 248 unit tests and 69 browser tests, typecheck/lint/build passed. This is scoped UI acceptance only: not whole M3, recommendation quality, reports, retrieval experiments or deployment acceptance. GROUNDING-001 (unsupported whistleblower citation) and SCORE-COMPARISON-001 (55.6/13.2 versus 58.3/13.8 without matching input maps/traces) remain OPEN.

Next authorized package: read-only Hetzner inspection and local isolated protected non-billable preview preparation using actual UI/deterministic scoring with labeled synthetic narrative scenarios. No server mutation, DNS changes, paid requests, staging, commits or pushes. Deployment approval follows review of concrete files and remaining prerequisites.

Checklist reconciled read-only against the Google Drive v2.0 table; see app/docs/BUILD-CHECKLIST-RECONCILIATION.md. No checklist checkbox is treated as authorization for broader M3/M5/research work.


## Private preview preparation gate — 2026-10-16

PASS: full normal npm run verify (typecheck, lint, 253 unit tests / 30 files including Golden coverage, production build, 70 Chromium tests). Separate preview production build plus six Chromium preview tests passed. Production audit zero vulnerabilities; credential-pattern scan zero matches; four prior evidence hashes unchanged; protected BUILD_PACK/config/domain/lockfile diff empty; Git index empty. Preview select labeling issue was fixed before the complete successful rerun. Generated .next-preview output is excluded from lint/Git; an initial gate was stopped during lint to add that generated-output exclusion, then the full gate passed.

Local preview: http://127.0.0.1:3001/preview, PID 33428, source release preview-970da310fbfe902076ae; health synthetic/billable=false, provider ready=false/private_preview_disabled. Normal verified build xL_3WjPUwlWrhS1Fu-aXT restored on port 3000 (PID16804). No .env.local edit, provider call, server mutation, staging/commit/push. Current branch milestone-3-recommendations.

Prepared concrete deployment files in app/deploy/preview; runbook app/docs/PRIVATE-HETZNER-STAGING-PLAN.md; implementation review app/docs/PRIVATE-PREVIEW-REVIEW.md; checklist reconciliation app/docs/BUILD-CHECKLIST-RECONCILIATION.md. Proposed new service 127.0.0.1:3201, isolated network, 1 CPU/768MB, protected HTTPS preview.flowagentai.website, image/health identity and preview-only rollback. Fresh SSH inventory blocked (no matching configured key/agent; default guyli denied), Docker Linux daemon absent and Caddy not installed locally. Compose and Node script syntax validated; exact-container/egress/Caddy auth/TLS checks remain required before deployment approval. Existing Appsmith/n8n/Postgres/NocoDB services were not changed.

Owner UI acceptance is recorded, not whole M3 acceptance. GROUNDING-001 and SCORE-COMPARISON-001 remain open; synthetic fixtures do not resolve recommendation quality or manual score provenance.


## SSH access and current host inspection — 2026-10-16

Root password SSH access confirmed using owner-entered local password; no credential contents stored or SSH configuration changed. Read-only confirmation completed with exit0. See app/docs/HETZNER-READONLY-INSPECTION.md (relative from repository root) for the fresh inventory and conditional deployment/rollback proposal based on checkpoint026fb85. This supersedes the earlier authentication blocker; unattended key access is still not configured.

NEW DEPLOYMENT BLOCKER: only 768–821 MiB memory available, no swap, approximately four-core load; Postgres container repeatedly373–395% CPU with an unexplained dropdbfindmnt process around390% CPU/30% host memory. Purpose/provenance not verified; no diagnosis claimed. Preserve services and defer adding preview load until bounded investigation/capacity review. Compose v2 availability and exact-container/egress/Caddy auth/TLS verification remain outstanding. No server mutation, DNS changes, provider calls or Git publication. M3 remains open.

### Process investigation supersedes unidentified-process status — 2026-10-16

Authorized read-only investigation identifies suspected Postgres-container compromise: /tmp/.perf.c/dropdbfindmnt (PID1158558, UID999, parent postgres) is explicitly an added writable-layer file, absent from the image baseline. Approximately390% CPU; hidden added artifacts; captured connection only to container loopback. Initial access, malware identity, exfiltration and host compromise are not established. See app/docs/HETZNER-READONLY-INSPECTION.md for hash, image identity, timestamps, socket evidence and limitations. Recommend evidence preservation followed by separately authorized containment with legacy-service impact review. No server mutations or preview deployment; M3 open. Changes remain unstaged/uncommitted.

## Containment preparation — 2026-10-18

Bounded read-only SSH check completed at08:00:44UTC. No effective container network isolation observed: same Postgres container attached to shared bridge, published5432 on IPv4/IPv6, empty DOCKER-USER chains, UFW inactive, established external sockets. Previous process name absent; rbashenv now approximately390%CPU, identity/hash not yet equated with prior binary. Host compromise remains unconfirmed. Proposed temporary full Postgres veth quarantine plus IPv4/IPv6 host5432 DROP rules, with database-dependent outage, console recovery, verification and exact rollback in app/docs/HETZNER-CONTAINMENT-PROPOSAL.md. Preparation only: requires owner approval; no firewall/interface/server changes, paid snapshots, deployment, commits or pushes. Preview paused; M3 open.

Local evidence SHA256: hetzner-process-inspection.txt =3134FEE7059A4E4F101545C1F3BF5202C0E0D2618D4C3A98CB87A299D074CBC1; hetzner-containment-20261018.txt =F5B665F84EC8C2B6A048F3E8E09AD25C214B9EAFE3EC07C06CFB0C8E43077D45. Missing bridge sysctls and nft backend warnings retained as limitations; no claim of all checks returning zero.

## Quarantine applied and incident handoff — 2026-10-18

Owner confirmed browser recovery shell access. Authorized script completed at approximately08:25UTC (15:25Bangkok); evidence app/.local/hetzner-quarantine-reconnect-20261018.txt. Fresh enumeration found only loopback and eth0@if8; verified reciprocal exclusive host peer vethb10db41, no other running Docker container sharing the network namespace. Current container ID/image/PID/start remained unchanged.

Applied only tagged capstone-incident-20261018 IPv4/IPv6 INPUT DROP rules for TCP5432 and host vethb10db41 DOWN. Postgres stayed running; no restart, deletion, cleanup, broad firewall flush or restoration. Link administratively DOWN, bridge port disabled, container NO-CARRIER. Host-to-DB and NocoDB-namespace-to-DB probes failed; DB-to-host and DB-to-NocoDB failed. RX/TX counters identical before/after verification; prior external sockets retained ESTABLISHED labels but accumulated unsent queues, not proof of connectivity. Existing SSH command completed after changes; port22 listens on both families and fresh external IPv4 TCP22 connects. External IPv4 TCP5432 times out. External IPv6 probes fail for lack of client route, so external IPv6 reachability unverified; server IPv6 rule and link isolation verified. Appsmith/n8n HTTPS roots200; DB-dependent operations unavailable as expected, no application writes tested.

Temporary runtime quarantine only: Docker restart/recreation may recreate/enable peer links; host reboot loses unsaved firewall/interface controls. No host-trust/eradication claim. Incident investigation stopped per owner; no automatic rollback. Owner/admin recovery should preserve isolation and assess clean recovery separately. Do not deploy on this host or copy its containers, files or secrets. New preview uses clean host and checkpoint026fb85. No commits/pushes.

## Clean private preview deployed — 2026-10-18

Checkpoint 026fb85 deployed to new Hetzner CX23 mosaic-preview (171012360), 2.28.206.236. Owner-created DNS preview.flowagentai.website TTL900; trusted HTTPS and reviewer authentication verified. Exact-image six-browser-test gate passed through SSH forwarding; paid provider blocked and synthetic health confirmed. Detailed immutable image/base identities, private-network Caddy upstream adaptation, DNS-cache limitation and rollback: app/docs/PRIVATE-HETZNER-STAGING-PLAN.md, Clean preview deployment. Old host remains isolated; no investigation/cleanup/restoration. No paid AI calls or Git publication. M3 and grounding/score-comparison issues remain open.

Authenticated public HTTPS browser gate: four additional tests passed across desktop/tablet/mobile and delayed recovery; local DNS-cache resolver mapping only, certificate validation retained.

## Owner removes preview login — 2026-10-18

Owner explicitly requested removal of preview login, superseding protected-preview access requirements for this deployment. Removed only Caddy basic_auth block on new mosaic-preview server; configuration validated and reloaded. Unauthenticated HTTPS /preview returns200, health confirms checkpoint026fb85 synthetic/billable=false, recommendation endpoint remains unavailable/local_only. HTTPS, headers, network isolation and paid-provider disablement retained. Preview is now public to anyone with URL; noindex is not access control. Server-side prior Caddy configuration retained for rollback. Local normal DNS still reports NXDOMAIN although independent public DNS and mobile access work; no fixed local-resolution ETA established. No app/scoring changes, commits or pushes; M3 remains open.

## Deployment fidelity and work discipline — owner correction, 2026-10-19

A request to host the working app means preserve its existing landing, assessment, Results and AI workflow. Do not substitute a simulation/test harness, redirect users into diagnostic controls, or introduce login/onboarding requirements without explaining the concrete user-facing difference and obtaining applicable authorization. Explicit synthetic-only authorization remains binding until changed; clearly call out its incompatibility with live-AI parity rather than presenting it as equivalent. Latest owner direction is the normal hosted app, no private/offline banner or login, and the existing AI integration; key transfer and hosted spending controls remain unresolved.

Use the smallest deployment changes needed. Reuse accepted implementation and verification evidence; do not restart research, redesign UI, or add dependencies/experiments for deployment. Verify the actual landing-to-results journey and required live capability before claiming the app is ready. A health check or synthetic test alone is not evidence of live AI availability. Report exact missing credentials, budget or security decisions early, continue independent work, and avoid repeated permission requests for already authorized routine work. Do not silently weaken validation or create unbounded public billable access. Keep changes uncommitted under the owner's existing Git instruction.

## Normal hosted workflow restoration — 2026-10-19

Normal checkpoint026fb85 image built and deployed to mosaic-preview. Removed synthetic mode from deployed app by using normal build; existing runtime/scoring/retrieval unchanged. Public root and /results200, /preview redirects to root; offline banner and testing controls absent. No login. Details and immutable image: app/deploy/app/README.md. AI is NOT claimed operational: existing local-only boundary, key transfer permission and total spending cap remain unresolved. No provider calls or secret transfer. AGENTS.md now requires deployment fidelity and accurate capability verification. M3 remains open; edits uncommitted.

Verification: normal production build and container health passed. Two focused authenticated-free HTTPS browser checks passed (17.4s) at1440/390: homepage CTA, setup entry, normal Results with synthetic raw-answer fixture and authoritative51.0/12.1 scores, refresh, no offline banner or simulation controls, no horizontal overflow. Initial fixture used incomplete config version and was correctly rejected; corrected to canonical catalog/setup identity without application changes. Tests made no provider calls; no live-AI success claimed.


### Owner operating budget — 2026-10-19
Shared public live-generation allowance: US$1 per Asia/Bangkok calendar day (midnight UTC+07:00), until changed by owner authorization. Persist the history of reservations/settlements on the host across app restarts; serialize reservation and settlement with an exclusive cross-process lock and atomic file replacement. Reserve the estimated maximum before dispatch; reconcile reported input/output usage at configured model standard prices, retaining the full reservation when usage is unknown or settlement fails. Block requests that cannot fit. Deployment verification retains its separate lifetime two-request/$1 reservation ledger and cannot spend/reset public usage. Budget denial must show the owner's accessible modal while scores and existing matching results remain available; never request visitor API keys. Implementation and verification in progress; M3 acceptance remains pending.


Budget package checkpoint: deployed release `mosaic-cb95e176f427805cb4d0`; shared public US$1/day Asia/Bangkok, persistent host ledger, separate verification ledger. Offline263 unit tests passed;68 browser passes plus5 corrected focused passes; hosted budget UI and five-case full-trace parity passed. One authorized live deployment test returned `invalid_output` / `evidence_limitation_missing`; no retry. Public allowance untouched, deployment reservation$0.324144; one of two test requests remains. Detailed timings, exact limitations and failure evidence: app/docs/M3-LIVE-AI-REVIEW.md. M3 remains open and unaccepted; no successful hosted live recommendation is claimed.


### M3 hosted closeout requirement reconciliation — 2026-10-19 12:09 Asia/Bangkok
| Requirement | Implementation / evidence | Remaining |
|---|---|---|
| M3.1 provider boundary | Normal public same-origin endpoint, server credentials,30s provider/45s client deadlines, persistent shared Bangkok-day budget; v6 liveHTTP200 accepted | Human acceptance; no more agent calls under exhausted allowance |
| M3.2 native retrieval | Preserved8-document/18-chunk baseline, stable joins and saved five-SME legacy replay | No implementation change; country/revenue omissions and source metadata limitations retained |
| M3.3 structured recommendations | Trusted raw-answer scoring, score/citation/category/schema guards, response-specific grounding; fixed verification disclosure moved to shared deterministic UI/report text | Broad factual/claim support and prose quality need human review; no universal entailment claim |
| M3.4 Results/navigation | Combined explicit action, immediate scores, loading/cancel/retry/one-use handoff, source dialogs, context, collapsible sections, blank review and direct five-stage navigation | Proposed connected/green-completed-stage visual treatment remains a design proposal; current functional navigation is available for acceptance |
| M3.5 durable report | Saved HTML contains context, answers/skips, question/category/overall scores, gaps/actions/citations, versions, fixed disclosure and response-specific notes; print-to-PDF supported | Owner review of the downloaded report; native PDF generation not required by plan |
| M3.6 required regression | Prior full saved gate plus concrete fixes; current46 focused checks,typecheck/lint,production build,hosted checks and one accepted live walkthrough; latency7.70s service/9.92s browser | Research/model/framework/retrieval experiments explicitly deferred; no new suites/benchmarks |
| GROUNDING-001 | Actual preserved Chemicals safety excerpt fails the targeted whistleblower/grievance support regression; prompt disallows unrelated safety citations for that advice; accepted live result does not repeat it | Ordinary citations support disclosure topics, not proof that suggested governance processes are mandated. Human judgment remains necessary |
| SCORE-COMPARISON-001 | All five matched Golden inputs yield exactly equal local/deployed full traces and API fields,381–464ms prior endpoint round trips | Historical55.6/13.2 versus58.3/13.8 inputs unavailable; historical cause cannot be reconstructed |

Current v6 correction uses one shared application disclosure in Results and reports. Only the literal `unverified` / `not independently verified` model-boilerplate gate was removed. No score, source identity, assessed-category, structured output, bounded-inference or targeted claim-support check was removed. Archived prompt, canonical config, scoring and retrieval remain unchanged. Previous rejected prose was not retained; exact replay was impossible and no reconstruction was attempted.

Latest live evidence: input14808/output1821 tokens; estimated standard-price cost$0.0193005; headers7531.90ms, body107.06ms, service7696.70ms, browser9919ms. Combined two-test reservation$0.648288; estimated reported usage cost$0.038775. These application tokens are NOT coding-agent tokens. Public daily$1 remains untouched. Synthetic test inputs were used with a real provider response; no synthetic advice was substituted.

Workflow rules from0226c9d were integrated locally after verification, preserving newer edits and history. Approved checks and the exhausted live allowance are recorded in codex.prompting.memory.md. No docs-only full gate.

Manual acceptance: open public URL; create/review context and answers; generate once; inspect scores/summary/actions/citations and fixed disclosure; download report and use browser Print→Save as PDF if desired; edit only notes and confirm advice invalidates without score changes; refresh without automatic generation. Accept M3 explicitly only after reviewing quality and the stated evidence limits. No M4 work starts before that acceptance.

Effort item M3-HOSTED-DISCLOSURE: first clock checkpoint11:59:16 to12:09:46 Asia/Bangkok =10m30s measured elapsed through functional verification/ledger confirmation; initial inspection before the first checkpoint was not timed. Active labor and coding-agent tokens unavailable. No initial time/token estimate was recorded retrospectively; documentation-only remaining-work forecast5–10 active minutes was given at the final checkpoint. Final elapsed interval will be reported in the handoff; acceptance pending.

Final measured effort checkpoint:11:59:16–12:12:07 Asia/Bangkok =12m51s elapsed from first clock reading; initial inspection before that reading was not timed. Active time and coding-agent tokens unavailable. Original estimate not recorded; final documentation-only forecast5–10 active minutes was given, but active labor was not measured so variance is unavailable. M3 acceptance pending; no commands/tests/provider calls remain running. Hosted application stays running. All changes remain unstaged/uncommitted.

M4.3 owner follow-up: remove the light-blue video padding; video occupies the entire original right pane with object-contain, preserving aspect ratio/native controls and unchanged outer layout. Small continuation of the reviewed correction; no deployment or commit. Expected implementation1min +build/local verification2-3min; coding-token forecast unavailable.

M4.3 owner follow-up clarification2026-10-22: replace the main hero headline with The Pieces that Matter, superseding the earlier Sustainability-headline direction. Correctly encoded MOSAIC acronym line restored above it. Video occupies full original pane, zero inset/padding; object-contain may letterbox to avoid cropping/stretching. Reuse build and existing responsive checks; no new tests or deployment.

Follow-up verified: build/TypeScript passed; existing responsive checks3/3 passed. Actual localhost shows correctly encoded acronym and The Pieces that Matter headline. Video pane padding/inset0px; video width equals pane width, object-contain retained. Build wvCMgpRhR-OogNh6PpgZ_, PID8848. Follow-up elapsed/token allocation not measured; no retrospective reconstruction. All corrections remain uncommitted, no deployment.

M4.3 owner follow-up: assessment/Results home navigation now MOSAIC home with supplied mark and explicit /#top target, preventing restoration to a lower landing scroll position. Video letterbox uses film paper color rather than black; no crop/stretch or layout change. Brand document section3 defines palette meanings fixed everywhere, but app-wide recoloring remains outside current homepage scope. Reuse affected lint/build and existing homepage/assessment checks; actual home-navigation inspection authorized by request. No deployment.

Home-link/video follow-up verification: affected lint and final build/TypeScript passed; existing assessment/homepage checks5/5 passed. Actual browser return from assessment resolves /#top with scrollY0; supplied mark and MOSAIC home label verified. Full navigation is intentional (two documented local no-html-link-for-pages exceptions), avoiding observed Next fragment accumulation while retaining sessionStorage. Video top edge visually confirmed paper-colored, no black strip; native controls retained. Local PID39760. No provider calls/deployment/commit. Follow-up timing/token allocation not measured.


M4.3 shared-palette continuation2026-10-22: live F1/row23 and standing protocol loaded; start13:10:59+07 (initial read just before clock not measured). Owner now authorizes colors across assessment/calculator/Results, superseding homepage-only color scope. Preserve layouts, typography metrics and behavior; no deployment. Base9420a5a with existing uncommitted M4.3 corrections and unrelated files preserved. Estimate implementation/records4-6min +verification4-7min =8-13min elapsed, medium confidence; narrower than9m54s layout correction because shared semantic tokens already exist. Actual token telemetry available, forecast unavailable. Reuse saved build and affected browser files/cases; no new fixtures/tests.
M4.3 shared-palette closeout2026-10-22: final build/TypeScript passed; existing affected browser checks11/11 (homepage, assessment, calculator refresh/manual preservation, Golden Results and empty Results), then final warning/error color correction rerun3/3 assessment checks. No new tests/provider calls. Actual localhost assessment shows teal; Golden Results screenshot reviewed. Layout/type metrics/function unchanged. Final build6MPU2UnMOMTSFdx5QeaNx, PID17676. Base9420a5a; changes uncommitted/unpublished; acceptance pending, no deployment/M4.4. Checklist row23 reconciled.
Elapsed13:10:59–13:20:22+07=9m23s through closeout checkpoint; no explicit pauses, initial read not measured. Forecast4–6min implementation/records +4–7min verification=8–13min; within range. Active/wait split not measured. Main avoidable rework: build captured warning colors before final CSS review; proposed one workflow correction: finish palette review before launching build. PM decision pending. Partial actual coding telemetry through13:14:11:1,493,841 total,1,490,844 input (1,472,640 cached),2,997 output (522 reasoning subset); later work/closeout excluded, not application tokens. Complete task token total unavailable at this checkpoint.
M4.3 acceptance/publication continuation2026-10-23: standing protocol/live F1 and row23 loaded. First clock11:06:47+07; initial log/Git read before clock not measured. Scope records, scoped commit/push, read-only diagnosis of reported recommendation failure. Estimate records/Git3–5min +read-only verification2–3min =5–8min; medium confidence from prior checkpoint, no implementation/test reruns required. Coding-token forecast/actual unavailable for this continuation. Reuse completed M4.3 build/affected checks; no source changes since verification.
Failure triage: local PID17676 responds; non-generating readiness GET returns ready=true, gpt-5.4-mini/low/4000, timeout30000ms, prompt transport-7. Existing stdout/stderr contain no failed generation response. Available IAB tab is blank setup, with no browser errors; owner's failing result is not visible there. This establishes configuration readiness only, not successful provider connectivity or generation. Exact user-facing failure requested; no provider call, ledger reset, response reconstruction or runtime fix made.
## M3.3 owner migration-scope correction - 2026-10-23
Standing protocol/live F1 and M3.3 row16 loaded. Start11:49:32+07 (initial reading before timestamp not measured). Scope: remove targeted GROUNDING-001 keyword citation gate, adapt existing affected tests, audit other rejection rules and reconcile records. Estimate implementation/audit/records4–6min +verification2–4min=6–10min elapsed, medium confidence, reusing existing checks and fixture data; coding-token estimate/telemetry unavailable. No other rule changes, tooling, provider calls or deployment. Leave changes uncommitted.
Owner explicitly removes unsupported_claim_citation as an acceptance condition. Delete the targeted helper and invocation; retain item-level unknown/ROI guards, structure, score, category and citation-identity validation. Existing two grounding tests now demonstrate that in-allowlist citations are not rejected by topic keywords; this does not certify claim support. Archived prompt and current prompt instructions remain unchanged. Broader claim-to-source evaluation is deferred quality work, not a migration blocker. Historical mitigation claims below are superseded by this decision.
### Existing rejection-rule authority audit (code/records only)
Legacy diagnosis M3-OFFLINE-GENERATION-DIAGNOSIS.md records Appsmith JSON.parse/catch and no semantic/schema validation in the inspected actions. Thus server rejection gates are v2 additions even when based on legacy prose instructions. General M3 acceptance is not evidence of individual design approval.
- Explicitly authorized: structural response validation, trusted deterministic score consistency and citation membership (M3.1–M3.3 authorization/current owner instruction); assessed-only recommendation AND key-gap categories, missing-data in grounding_notes and maximum counts (owner correction recorded M3-LIVE-AI-REVIEW.md transport-3); no confirmed absence from skipped inputs and unsupported measured/highest ROI guards, allowing qualified advice (codex.prompting.memory.md finding9 approval). Preserve all.
- Implementation details without separate rule-level approval located: exact mandatory summary closing sentence and prohibition of all other numeric score prose (stricter than numeric correctness); numeric percentage allowlist (only values in percent answers/excerpts); mandatory lowest-scored-category inclusion; only two accepted uncited-inference phrases; exact duplicate-title rejection/contiguous ranks; hard120-word action ceiling; narrative URL/internal-ID bans and schema-specific character/evidence caps. The legacy prompt motivates priority ranking, avoiding duplicates, approximately120 words, natural-language inference examples, no narrative URLs/internal IDs and JSON shape/counts, but it did not enforce these with a rejecting validator. Some score-format constraints were later explicitly retained in correction records; initial specific hard-gate approval remains undocumented. Do not infer that undocumented means definitively unauthorized. No changes to these rules in this task.
- Targeted whistleblower/grievance guard: historical GROUNDING-001 mitigation recorded; no specific original keyword-gate approval located. Explicitly removed by owner2026-10-23. Prompt-level request for relevant evidence remains; citation membership does not establish support. General claim-support evaluation remains deferred, not a replacement gate or diagnostic subsystem.
- Already removed before this task: literal industry/size/goal summary-label requirement (v4 owner correction), and mandatory fixed evidence-limit boilerplate (v6 owner correction). Do not restore either.
No claims of exact legacy runtime parity beyond available archived nodes; provider defaults and original effective runtime configuration remain evidence limitations. Transport/resource bounds, provider failures, freshness/cancellation, request admission and spending controls are separate operational protections, unchanged.
Owner supplied a separate subsequent failure: invalid_output/unlabeled_inference, total19.10s/provider19.02s, headers19.01s/body0.01s. Code rejects evidence-free advice unless why_it_matters or recommended_action contains exactly one of two regex phrases: a practical next step would be | this suggests. Legacy prompt presents these as natural-language examples; no separate approval located for making them exhaustive. This rule remains unchanged pending explicit owner decision; proposed smallest fix is removal of that phrase gate, retaining prompt guidance and other checks. No rejected prose retained, so wording in this particular response is unknown. Local production server still serves prior build during this correction's verification; no claim that the new source was loaded.
Correction verification closeout2026-10-23 11:56:18+07:58 existing focused checks passed; affected ESLint and typecheck passed. No new test cases, paid calls or deployment. Source changes uncommitted on milestone-4-branding-video, base7b86f70; running localhost retains prior production build pending rebuild. Elapsed6m46s from11:49:32 through verification closeout, within6–10min forecast. Initial reading and final checklist write not measured; no explicit pauses; active/wait split and coding tokens unavailable. Main avoidable delay not established; no further workflow correction proposed. Other local changes preserved. No other rejection gate changed.
### M3.3 migration-parity continuation - 2026-10-23
Live F1/row16 and standing protocol reloaded. Start12:02:32+07; implementation/audit/records5–8min +build/local verification2–4min=7–12min elapsed, medium confidence, reusing58 passing checks/lint/typecheck from the preceding bounded correction. Actual coding tokens/forecast unavailable. The interrupted preceding comparison continuation had no new file changes; its elapsed time was not measured and is not reconstructed. Current source remains based on7b86f70 on milestone-4-branding-video. Existing unrelated work preserved; no commits/deployment/provider calls. The separate inference-gate removal proposal was cancelled, not approved.

### Appsmith-to-v2 comparison (existing artifacts only; current as of this correction)
| Surface | Archived Appsmith/n8n path | Current v2 / evidence limits |
| --- | --- | --- |
| Inputs | Company, industry/subindustry, employee/revenue bands, location/country, markets, buyer, goal, notes; client scores and answered questions | Validated context/raw answers; server recomputes accepted M2 scores. Notes restored; country/revenue band unavailable. V7 also supplies unknown question-level inputs. No invented context. |
| Prompt | Build Recommendation Prompt interpolates four JSON blocks and semantic instructions | Archived static template preserved; extra system/validation instructions. Legacy examples became stricter gates in several places, inventoried below. |
| Retrieval | Metadata-ranked8 documents/18 chunks with title-based joins | Same baseline ranks/limits; stable identities resolve documented joins; unsafe/unresolved citations and doc005 withheld, so usable set can be smaller. No replacement sources or new retrieval method in this correction. |
| Model/settings | Export says GPT-5.2; model options empty; Appsmith HTTP allowance100s | gpt-5.4-mini, low reasoning,4000 output tokens; operational provider30s/client45s (readiness15s), no automatic retries. Old diagnosis table's10s/25s values are historical, not current. Archived reasoning/token/provider-timeout defaults unknown. |
| Parsing | getParsedRecommendations selects output[0].content[0].text then JSON.parse; parse failure returns null | Bounded provider envelope +strict JSON schema, followed by application validator. No semantic rejection found in inspected legacy nodes/actions. |
| Rejection | Invalid/unavailable JSON cannot be parsed; other deployed guards/defaults not evidenced | Explicit failures for configuration, input, provider, limits, identity/freshness and content rules below. Parseable legacy content was not automatically subject to these v2 gates; actual display still depends on expected UI fields. |
Sources: existing M3-OFFLINE-GENERATION-DIAGNOSIS.md and M3.1-M3.3-REVIEW.md, their cited BUILD_PACK Appsmith/n8n exports, preserved legacy-prompt.json, current prepare/contracts/validate-output/provider/controller/route source. Missing evidence: actual deployed legacy revision/SDK defaults, model snapshot behind alias, provider/proxy effective timeout, and current rejected prose/citation. No exact live parity or semantic correctness claimed.

### Bounded output-rejection inventory and disposition
Every row below is unchanged except the explicitly removed keyword guard. Approval describes the located record, not inferred permission from acceptance.
| Condition/code | Trigger | Appsmith equivalent | Documented authorization | Recommendation |
| --- | --- | --- | --- | --- |
| invalid_transport / malformed_json | Not a string or invalid JSON | JSON.parse/catch; invalid input fails | Agreed parsing/structured contract | Keep |
| schema | Wrong/missing/extra fields/types; invalid enum, duplicate categories; max5 actions/3 gaps; min1 action; title200/text4000/link2000 chars, max8 citations | Prompt shape/max5/3, but no schema rejection evidenced | Strict structure/count maxima approved; exact incidental caps not separately approved | Keep agreed shape/counts and bounded resource safety; retain incidental caps pending owner review |
| response_too_large | UTF-8 content exceeds40000 bytes | No equivalent explicit limit found | Bounded execution approved; exact threshold implementation choice | Keep resource limit |
| score_mismatch | Summary does not end with exact supplied score sentence, even if numbers correct | Prompt requests correct closing scores, not that exact sentence | Score correctness approved; exact format retained in later records, original hard-format decision not separately located | Preserve score correctness; propose relaxing wording only after explicit decision/design |
| unstructured_score_claim | Regex sees numeric score/rating/overall/percentile or out-of100 elsewhere | Prompt discourages score dominance; no equivalent parser rejection | Numeric protections approved; blanket prose prohibition not separately approved | Decision: retain until behavior-preserving numeric alternative is separately authorized; do not simply drop correctness checks |
| unsupported_percentage | Narrative percentage absent from percent answers and supplied excerpts | Prompt forbids unsupported numeric thresholds; no numeric allowlist gate | Broad numeric grounding approved; exact allowlist logic not separately approved | Decision: defer this lexical quality gate while retaining score checks |
| unknown_citation | Any title/issuer/page/link tuple not in supplied allowlist | Prompt asks cited fields; no identity validator evidenced | Explicit citation-membership approval | Keep |
| unanswered_category | Gap or action names a wholly unassessed category | No equivalent rejection evidenced | Explicit owner prompt/category correction | Keep |
| unknown_answer_as_absence | Bounded patterns describe missing energy/water/waste tracking as absence without qualification | No equivalent rejection evidenced | Explicit finding9 approval, with qualified discussion allowed | Keep approved correction |
| unsupported_roi_claim | Unqualified measured/highest/quantified ROI or payback patterns without supplied calculation | No equivalent rejection evidenced | Explicit finding9 approval | Keep approved correction |
| priority_gap_missing | No recommendation includes any lowest observed category | Legacy prompt prioritizes low scores, not mandatory inclusion gate | Hard inclusion gate not separately approved | Decision: make prompt guidance only |
| unlabeled_inference | An action has no evidence and neither why_it_matters nor recommended_action contains either fixed phrase | Legacy prompt gives those phrases as natural-language examples | Exhaustive two-phrase gate not separately approved; removal proposal cancelled, awaiting consolidated decision | Decision: make prompt guidance only; do not substitute another classifier |
| action_length | Action exceeds120 whitespace-delimited words | Legacy prompt says approximately120 words | Hard cutoff not separately approved | Decision: prompt guidance only |
| rank_order / duplicate_recommendation | Rank differs from index+1 / case-insensitive title repeated | Prompt asks ranking and avoiding similar recommendations | Exact hard editorial gates not separately approved | Decision: prompt guidance only; retain structural rank type/range |
| narrative_url / internal_id | Narrative contains URL/Markdown-link pattern or literal canonical internal ID | Prompt explicitly prohibits these, but parser does not enforce | Legacy requirement documented; separate reject-entire-output decision not located | Recommend retain as explicit presentation requirements only if owner confirms blocking behavior |
| unsupported_claim_citation | Topic-specific whistleblower/grievance keyword/excerpt mismatch | No equivalent legacy rule | Owner explicitly ordered removal | Removed; broader source-support review deferred |
Already removed historically: literal summary context labels (v4) and fixed evidence-limit boilerplate (v6), both by explicit owner correction. Existing deterministic evidence disclosure remains.
Operational exclusions are separate from output-quality gates: invalid requests/configuration, unsafe/withheld evidence or no answers/evidence, request/prompt/body bounds, provider refusal/incomplete/bad envelope/model mismatch,30s/45s deadlines, cancellation/stale identities, same-origin/local admission and hosted shared budget. Bounded execution, server-only providers, failure handling, freshness/duplicate controls and spending limits are approved. Exact thresholds/single-text-envelope restrictions and doc005 exclusion are documented implementation/evidence choices without separate rule-level approval located; keep unchanged here. No further provider comparison, source research or broad historical audit.

Two-phrase requirement in plain English: when an action has no citations, v2 accepts it only if its explanation or action contains 'a practical next step would be' or 'this suggests'. Other cautious wording can still fail. This converts two examples in the legacy prompt into an exhaustive password-like wording requirement; it is not semantic evidence validation. The19.02s failure identifies this gate but retained prose is unavailable, so no specific rejected wording is asserted.
Migration-parity local closeout2026-10-23: final build/TypeScript passed; prior58 focused cases/affected lint/typecheck reused, no source changes invalidated them. Local PID38228 serves build5QGsuqhdZL9do0Jp34zzq; assessment HTTP200 HTML matches that build ID; readiness GET ready=true. Compiled unsupported_claim_citation absent; unchanged unlabeled_inference present. No provider POST, user tab/session changes, paid calls or deployment. All correction changes uncommitted, base7b86f70 on milestone-4-branding-video; unrelated files preserved. Standing principle saved/read back in AGENTS.md, this plan and checklist F1; row16 reconciled. Accepted M4.3 not reopened.
End12:07:01+07, elapsed4m29s from12:02:32 through local verification; final record write excluded. Forecast7–12min combined (5–8 audit/records +2–4 verification); faster due reuse of existing audit and58 passing tests. No explicit pause; active/wait split not measured; coding tokens unavailable. No avoidable rework established in this continuation; no extra workflow correction beyond owner-directed migration principle. Remaining undocumented gates presented for a consolidated decision, unchanged.


### M3.3 owner-authorized recommendation delivery parity — continuation 2026-10-23 12:20:52 +07:00
Protocol and live F1/M3.3 row loaded. Base 7b86f70 on milestone-4-branding-video; scoped earlier guard/principle edits retained; unrelated incident records and .agents preserved. Owner supersedes semantic safeguards: remove all v2-only semantic/editorial output rejection, retain prompt guidance and technical protections; restore legacy evidence inclusion; replay five immutable archived outputs through real validation/display using existing infrastructure; build/restart localhost, scoped commit/push, no deployment/provider calls. Estimate: implementation/replays 12–20 minutes; verification/records 5–10; combined 17–30 minutes, moderate confidence based on prior bounded guard correction but broader affected tests/browser replay. Coding-token estimate/telemetry unavailable. Prior interrupted reading interval not measured and not reconstructed.

#### M3.3 parity correction — verified outcome and publication checkpoint
This owner decision supersedes historical inventory dispositions to retain score/category/unknown/ROI gates. Removed output rejection for whistleblower/grievance keywords, exact score closing/other numeric prose, percentage allowlists, lowest-category inclusion, prescribed inference phrases, word/count/character limits, duplicate titles/categories, consecutive ranks, category/difficulty enums, unassessed-category/unknown-answer/ROI prose, narrative URLs/internal IDs and exact citation-tuple membership. Extra JSON fields and original strings are preserved. Prompt guidance and archived legacy template remain unchanged; deterministic scoring remains authoritative and is not overwritten by generated prose.
Remaining output acceptance conditions: string transport, JSON.parse success, required renderable field types, existing40000-byte response bound, and HTTP(S) source-link format for safe clickable external links. Source identity/claim correctness are not certified by display. Provider/envelope failures, refusal/incomplete responses, request/config validation, same-origin admission, budget reservations, duplicate suppression, cancellation/freshness and30s provider/45s client caps remain technical controls. No replacement semantic filter, retry, repair call or diagnostic subsystem.
Retrieval now includes the complete legacy-ranked8-document/18-chunk selection; removed doc005 exclusion and post-ranking link/blank-section filtering. Stable joins/ranking/canonical records unchanged. Original link metadata remains intact; doc005 source/page provenance is disclosed, not treated as an exclusion. No concrete inclusion obstacle found in the five cases. Policy native-metadata-v2-legacy-inclusion and contract legacy-runtime-v1-parity-8 invalidate older recommendation identities.

| Archived case | Service replay | Real Results display | Actions / gaps | Citation occurrences / bibliography entries |
| --- | --- | --- | --- | --- |
| GOLDEN_01_MANUFACTURING | PASS | PASS | 5 / 3 | 11 / 5 |
| GOLDEN_02_FOOD_AGRO | PASS | PASS | 5 / 3 | 11 / 4 |
| GOLDEN_03_BUSINESS_EXPORT | PASS | PASS | 5 / 3 | 15 / 3 |
| GOLDEN_04_CONSTRUCTION | PASS | PASS | 5 / 3 | 13 / 2 |
| GOLDEN_05_CONSUMER_GOODS | PASS | PASS | 5 / 3 | 10 / 3 |

Existing service tests now consume each archived raw output[0].content[0].text. Authorized browser replays pass those unchanged raw strings through the actual validator, controlled HTTP transport, controller and Results components with matching Golden assessment context/answers. They verify original summary/action/gap text, citation titles/issuers/sections/links and separate canonical scores. Browser routes exist only inside existing test infrastructure. Historical generated-score differences, including manufacturing evidence limitations, remain unchanged; no live generation or factual-quality certification is claimed.
Verification: saved gate typecheck/lint passed;291 unit checks now pass (initial289/291 plus affected20/20 rerun after two stale expectations corrected). The existing Results destination assertion now matches previously accepted /#top; no branding runtime change. Final build/TypeScript passed;80/80 Playwright checks passed in6.9min, including all five Golden displays. Initial focused invocation used the wrong working directory (no tests executed), then86/87 passed and the corrected service file26/26 passed. Browser collection initially required explicit JSON import attributes; only the affected import lint/build/browser stages were rerun after that concrete compatibility fix. Passing full stages were not restarted. Evidence remains in ignored .local/m3-parity-v8-{verify,affected,build,browser}.log and existing test-results; no new review document or harness.
Localhost PID26088 serves build GDN1FOKIHXnw4qNTbgzvn: GET /assessment200 with matching build ID; non-generating readiness ready=true, v8, gpt-5.4-mini, low reasoning,4000 tokens,30000ms. Existing sessions and both spending ledgers untouched. No paid call, deployment or hosted-restoration claim.
Diff reviewed: only recommendation correction, associated existing tests/instructions/records; BUILD_PACK and app/config unchanged. No credentials, private responses, ledgers or generated files staged. Unrelated staging/incident documents and .agents remain excluded. Authorized publication is a scoped commit on milestone-4-branding-video based on7b86f70; exact SHA/push status and final completion timestamp/elapsed (including Git closeout) are reconciled once in Build Checklist v2.0 F16 at handoff. No merge.
Effort: start12:20:52+07; forecast implementation/replays12–20min +verification/records5–10min=17–30min. No explicit approval/overnight pause during this continuation; active/wait split and coding tokens unavailable. End/combined elapsed and expected-versus-actual comparison are recorded in the existing checklist step note after publication, avoiding reconstruction or double-counting. Main observed rework: stale expectations and JSON-import compatibility on browser replay. One proposed workflow correction: reconcile affected contract expectations and native import compatibility before the release gate; PM records adoption, next applicable step checks its effect.

### Authorized deployment of 5b79ef2 — 2026-10-23
Owner authorizes the existing clean MOSAIC server deployment, including accepted branding/video and recommendation parity correction; this supersedes prior no-deployment wording only for this checkpoint. Standing protocol/live F1 and rows16/23 loaded. Start13:15:01+07 (initial reading before clock not measured). Scope exact committed source, existing deployment script, preserved credentials/operating configuration and persistent public/test ledgers, non-generating hosted verification; no new features/paid tests. Estimate deployment5–10min +verification/records3–5min=8–15min, moderate confidence based on existing release procedure; upload/build duration uncertain. Coding-token estimate/actual unavailable. Base5b79ef2300909b51d503da61b330950bb004c9a5; unrelated local records preserved. Before release: old image dcd53f8201fb, container63369b332690,27GB disk free; daily limit1 and persistent /budget mount verified. Archive committed source rather than working-tree changes. Reuse completed291-unit/80-browser parity evidence; no full suite rerun.

Deployment complete2026-10-23 13:25:41+07: commit5b79ef2300909b51d503da61b330950bb004c9a5 deployed to existing clean server2.28.206.236 as mosaic-276c14b7b68ebe1a4824, image sha256:eead7a5e6948852a0b0da2f0c158fbe24e3a1d0a5b86dd9c30acabd2a8ff41e5, Next build hWeBp6Mk9S19--2t4jkTS. Exact Git archive supplied application code/assets/config; committed deploy.sh CRLF was converted to LF only in the ignored temporary deployment package before execution. No tracked runtime changes. Existing release script reused; old image dcd53f8201fb retained in release.previous.env/compose.previous.yaml; inspect private IP/Caddy upstream if rolling back, never restore ledgers.
HTTPS200 and HTML build identity match; actual hosted homepage shows MOSAIC/The Pieces that Matter. Logo, wordmark, poster, both MP4 resolutions and captions return200. Browser video metadata readyState4,duration90s,controls=true,autoplay=false,no media error. Readiness true with legacy-runtime-v1-parity-8/native-metadata-v2-legacy-inclusion; gpt-5.4-mini/low/4000/30000ms unchanged. Existing hosted readiness/Bangkok budget denial/report check passed1/1 (19.4s), with every generation POST intercepted. Only its saved expected contract version changed to v8; no new test/harness or paid call. Prior291-unit/80-browser results reused.
Public ledger SHA256006539c6e20583fb4e11df29209f13e414d574ec8f8095edac621c583027c3be and separate verification ledger c16b4850bc90177352e433d6dec09d58f353d007b97d2f88de6e98c6934d8806 unchanged before/after deploy and hosted check. Credential/operating files unchanged by fingerprint; daily limit1, Asia/Bangkok accounting and same persistent /budget mount retained. No saved assessment reset, schema migration, DNS change, old-host access or new feature. Container healthy. Live generation itself was deliberately not tested.
Effort closeout:13:15:01–13:25:41+07=10m40s through verified deployment/closeout checkpoint, within8–15min forecast (deployment5–10 +verification/records3–5). Initial reading before timestamp not measured; no explicit approval/overnight pause; active/wait split and coding tokens unavailable. Existing release procedure kept scope bounded; avoidable rework was discovering committed shell CRLF. Proposed one workflow correction: enforce LF for deployment shell files at the next authorized packaging change; no additional tooling/code implemented here. Prior proposed contract-check correction was not applicable to this deployment-only task. Deployed source remains the pushed5b79ef2; these deployment record updates remain uncommitted; no new commit/merge. Checklist rows16/23 reconciled separately.
