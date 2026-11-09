## M4.5 accepted and deployed2026-11-10
Annual-period inline feedback, documented therm→kWh conversion, successful-save warning recovery and USD-only revenue entry are live. Saved CNY amounts/currency/scale retained until explicit USD replacement; no FX rate assumed. PR41/d91f0b3 and PR42/61ff575; release mosaic-c45c1e5eb7468d276bd6. Focused25 unit/static/local checks, production build and live calculator smoke passed. Emissions factors/scoring unchanged; no paid calls/API work. Prior live/configuration retained with exact rollback in EXECUTION_PLAN.md. M4.5 complete; deferred methodology and internal notes unchanged.

## M4.5 owner follow-up: therm units and save-warning recovery2026-11-09
Local authorized extension adds NIST-documented EC therm→kWh conversion and clears stale warnings after successful saves. Existing emissions factors, scoring formulas and prior date-validation changes preserved. The previously missing energy/U-026 outputs now resolve for the supplied Beijing example; blank renewable inputs remain unknown. No deployment, paid calls or API/chatbot changes. Focused evidence and local review status in EXECUTION_PLAN.md.

## M4.5 calculator period feedback — LOCAL REVIEW2026-11-09
UI-only red date feedback and annual guidance implemented using existing eligibility; reversed/too-long/partial cases and valid correction covered.25 existing unit checks, scoped lint/type and focused calculator browser journey pass. No methodology/factor/transfer/session changes; deferred calculator notes unchanged. Isolated codex/m4-5-period-feedback from013a214; uncommitted, no deployment/paid calls. Pending owner review; evidence EXECUTION_PLAN.md.

## M13.6 field alignment/helper cleanup — LIVE2026-11-09
Paired desktop fields align; mobile stacks cleanly. Disposable prompts use placeholders/empty select prompts, enduring guidance uses accessible info controls, persistent labels/errors retained. PR39 merged d47c951; deployed mosaic-f072e821be4cc2b04f39. Scoped lint/type, four local and three live browser cases passed; production build/health passed. Behavior/configuration and Quick/Full answers preserved; no paid calls or API/chatbot work. Prior context image/configuration retained; exact rollback in EXECUTION_PLAN.md. F62 remains open for deferred warning and broader polish. Documentation-only closeout, no rebuild/redeployment.

## M13.6 context controls — LIVE2026-11-09
Compact ordered two-market dropdown and editable country→region suggestions deployed as mosaic-6c7a8c84b6e45334ff0f from PR37/896915c. Owner-approved conservative local UN M49 mapping supplies173 suggestions;76 ambiguous/unsupported country codes remain manual with stale region cleared. Saved metadata, market values/order, selection/scoring rules and Quick/Full flows preserved.47 focused unit checks, lint/type, local desktop/mobile flows and3 live smoke cases pass; no paid calls. Current Quick release/configuration retained for exact rollback in EXECUTION_PLAN.md. Context-change warning and broader M13.6 remain deferred; API/chatbot work excluded. Documentation closeout only, no further build/deploy.

## M8 live-demo release — LIVE2026-11-09
Owner-accepted scores-only Quick prototype deployed from PR34/merge35126dc as mosaic-344e536ac9b6bd22d678; focused live Quick→results→Full answer-retention/direct Full smoke passes with0 paid requests. Exact committed main plus scoped M8; API/chatbot work excluded. Prior live image/config and all rollback material retained; exact rollback and bounded Linux build deviation in EXECUTION_PLAN.md. Checklist rows47–48 distinguish this delivered demo package from deferred Quick methodology/integrations/admin/custom modes. Documentation-only closeout publication does not trigger another build/deploy.

## M8.1 — Local Quick prototype ready for owner review2026-11-09
Owner accepts the existing proportional20 selection and provisionally accepts its effort tags for this prototype. Checkpoint da243d4 preserves all experiments before implementation. Implement Setup→Quick questions (skip Data Input), separate labeled subset scores, shared-answer continuation to Full and backward-compatible absent metadata=Full. Scores-only Quick Results approved; Quick portraits/recommendations/Levers/reports deferred to explicit methodology decisions and accessed via Full. No deduplication, retagging, additional selection experiments, admin/custom modes, paid calls, merge or deployment. Evidence: EXECUTION_PLAN.md.

## M8.0 — Quick-assessment preprocessing experiment (2026-11-09)
Owner authorizes isolated answer_effort annotation and five-Golden-SME questionnaire comparison only. Baseline2955a392; branch codex/m8-preprocessing. Original bank, production schema/selection/scoring/portraits and live app unchanged. Separate experimental schema/provenance; no Quick scores. M8.0 pending owner review; M8.1 unstarted. Canonical evidence: EXECUTION_PLAN.md.

## Monday targeted QA — LIVE 2026-11-07
PR31/becc8aa deployed as mosaic-efa0448e0830696ed450; focused live checks pass and rollback retained. F62/F63 updated with broader milestones open. Delivered confirmed D1–D7 from MONDAY_TARGETED_QA: Lever labels, physical input limits, presentation precision/units, optional-site labels and missing-conversion explanation. Preserve scoring/config/full precision/Lever mechanics; timestamps, deferred notes and API MVP excluded. Focused verification and existing-process deployment authorized; canonical evidence EXECUTION_PLAN.md.

## Report generation timestamp — LIVE 2026-11-07
PR30/1002d7c deployed as mosaic-ee526451d52d0284b236; focused checks/build/live PDF and HTML smoke passed, rollback retained, F55 updated. One current export-generation timestamp for PDF/HTML on every download; remove separate assessment date. Current owner chat supersedes conflicting checklist submission-date note. Preserve saved inputs/insights, validation, rollback and API MVP separation; no paid calls. Focused checks and existing-process deployment authorized. Evidence: EXECUTION_PLAN.md.

## Industry benchmark routing — LIVE 2026-11-07
PR28/8912447 deployed as mosaic-c8066648ac8a0a9a9eda; build and focused live smoke passed, rollback retained. F64 updated; broader M14 remains open. Release evidence: EXECUTION_PLAN.md. Historical authorization: owner accepts the training-ID correction and authorizes scoped commit/push/normal PR merge/deployment from codex/training-benchmark-routing, excluding API MVP work. Reuse passing verification; only the necessary production build and focused live smoke remain. Owner accepts fresh assessments with the existing incompatible-version warning; no session migration. Preserve rollback material, threshold values, normalization, proxy choices, AnswerScales and multipliers. Build Checklist F64 records this bounded routing correction separately from broader unfinished M14 methodology. Score effects and release evidence: EXECUTION_PLAN.md.

## Approved M13 package — owner 2026-11-06
Implement the owner's twelve-batch MOSAIC_APPROVED_M13_HANDOFF.md exactly and deploy through the existing release process. This is a scoped delivery within M13.1/.3/.5/.6, with a focused M13.7 check; it does not close those broader milestones. Approved UI/copy and the final mobile anchor correction are live through PR23/PR24, runtime main d98e3f9 and release mosaic-1faa92d13e7a2bfb0cf3; focused local/live checks passed. Build Checklist rows57/59/61/62/63 accurately retain broader incomplete status. Preserve rejected proposals and all rollback material. Canonical evidence and release status: EXECUTION_PLAN.md.

## Delivery protocol routing — 2026-11-04
Use AGENTS.md's Current delivery policy for proportional verification and concise reporting; it supersedes historical blanket gate/effort wording in this plan. This file owns scope/status/dependencies, not release diaries. Detailed evidence belongs in EXECUTION_PLAN.md. The PDF/Results release is complete per owner report; do not reopen it to adopt these documentation changes. No new feature, deployment or Build Checklist update is authorized by this entry.

## Targeted report/Results corrections LIVE - 2026-11-04
Owner-authorized feature aef097113b27408f7b6fc67ce3862dacf51fb9a5 pushed codex/report-pdf; PR17 merged main47ee72c07eb02872d20a1de3a7416c580176853f. Exact merged-source release mosaic-699b545c9b8748466021 deployed through existing process; live image sha256:4c1d725015ff4740f334479123f19bf7515c7c34033f2cf6e53eac50443520aa healthy at https://preview.flowagentai.website. Approved report design/scoring/PDF runtime unchanged. Report dropdown, matching-insight gates, same-tab restoration, opaque navigation and combined-flow copy correction now live. Broader milestones remain open; prior pending-publication entries below are historical.
Evidence and measured effort in EXECUTION_PLAN.md; publication of these closeout records does not change deployed runtime.

## Targeted report/Results release authorized - owner2026-11-04
Owner authorizes commit/push, normal PR merge and live deployment of the reviewed report download control, mandatory matching-insights exports, restoration, Results navigation and banner/copy fixes. Preserve current and prior rollback configurations/images; run established hosted checks using retained matching recommendations, no paid generation. Live F1 and ID-resolved M12.1/M13.1/M13.6 notes loaded. Current origin/main836e262 has no intervening runtime changes; separate PM branch not incorporated. Reuse passing focused checks, final type/lint/build evidence; verify exact merged production image before switching. No PDF-runtime/scoring/design changes.
Start13:35:15.976+07. Estimate publication3-5m +container/release8-14m +live checks4-6m=15-25m, moderate confidence; existing pipeline/cache/container scripts reused. Tokens unavailable, paid/model calls0. Preserve earlier correction intervals and manual-review limitations. Final SHA/release/checkpoint to follow.

Current M12.1/M13.6 owner correction2026-11-04: grouped PDF/HTML download, mandatory matching successful insights, same-tab restoration and opaque Results navigation implemented/verified locally on codex/report-pdf (base f64add0); owner review pending. No commit/push/merge/deployment authorized for this correction. Accepted/live PDF infrastructure and other milestones remain unchanged. Evidence/effort in EXECUTION_PLAN.md.

## M12.1 direct PDF LIVE — 2026-11-04
Owner conditional acceptance satisfied: production-container PDF checks pass within existing resource limits; scoped implementation3076cc55aff8a2a9bf45bdbb14723f147568fcdd pushed codex/report-pdf, PR15 merged main97fb9c69a0e92bb87981c4304c3c602708753555. Exact merged-source release mosaic-6e890d869c932c799388 built/verified before switching via the existing release process; live image sha256:b66324fe3eff1c6e5409a4a8613080a219cfdeae3321c0c1a2194ebc73cd6d22 (511542642bytes). Container healthy, init=true, existing768MiB/1CPU/128PID/read-only/tmp64MiB constraints unchanged. Rollback image a08976e8a8577aeeecf6efb53e8a497c28f7d5a2d603c113a42ede19ae174fb4 and previous compose retained; credentials/operating/public and verification-ledger hashes unchanged.
Final exact-image measurements3698/2037/2000ms, peak332177408bytes (316.8MiB, whole container including verification sampler), zero remaining browser processes/temp profiles; simultaneous requests200/503, arbitrary HTML/URL400. No-network synthetic verification with no production credentials/budget mounts. Final image passed after enabling standard init child reaping; failed1.5GiB build cap retried successfully at2GiB/half CPU without live health degradation. Runtime Chromium adds approximately231MiB versus previous image; no external conversion service or model calls.
Public site PDF and HTML downloads verified with retained fictional Golden Agro and exact-input saved recommendations (one intercepted response, zero model calls); session unchanged, raw52.2/weighted52.1, Mediator,13 pages/35 links. Live PDF651425bytes inspected, Manrope/branding/chart/contents preserved; no visible Columbia or raw technical IDs. Combined hosted PDF+HTML download sequence9612ms, not a pure PDF generation benchmark. Existing local unit/type/lint/build evidence retained: full unit317/318 then affected Results2/2 correction passes, focused report/PDF10/10; browser101pass/1skip/known unrelated64-question rail failure750vs734. No report styles/scoring/configuration changes.
Temporary test containers, failed-build container, candidate image/tag, scripts, synthetic-input directory and upload removed individually after retaining local evidence; no broad Docker cleanup. Running live and rollback images verified afterward. Local sample .local/report-review/mosaic-live-report.pdf; preview3108 remains isolated. Broader M12.1 multi-format scope remains open; direct PDF and HTML capability accepted/live.
Measured PDF interval2026-11-03T23:54:13.069+07 to2026-11-04T00:49:43.739+07=55m31s elapsed through verified deployment/cleanup checkpoint, no explicit pauses; subsequent final bookkeeping unmeasured. Forecast45–65m implementation +20–30m verification=65–95m; reuse shortened delivery despite constrained build/download time. Prior53m39 retained separately; cumulative109m10 measured, historical pre-clock/bookkeeping unmeasured. Coding-token forecast/actual unavailable; application API spend0. Main avoidable rework: Docker availability and missing child reaping in container, caught before deployment. One workflow correction: include init and check build/runtime resource budgets at the first Chromium container trial. Documentation-only closeout publication follows; no runtime redeployment needed.
## M12.1 direct PDF verified; conditional publication authorized — owner2026-11-04
Owner now authorizes commit/push/merge/deploy after container verification fits existing limits; supersedes earlier review-only hold for this bounded PDF addition. Same approved HTML/print styles, fonts/logos/charts/scoring/mappings unchanged; original HTML download retained. Structured-only same-origin endpoint recalculates current snapshot, matches saved recommendation input identity, derives selected scenario from actual top-five Levers, never accepts HTML/URLs/client scores/assets. Embedded installed assets, script-disabled Chromium with browser requests blocked; no model calls. Body600KB/5s, one job per process/no queue, launch10s plus render20s, owned process-tree cleanup; retryable errors. Runtime playwright-core1.63.0 already pinned in test tree is now an explicit production dependency; Docker includes matching Chromium headless shell/dependencies.
Local build/type/lint pass. Full unit317/318 initially: stale report-helper wording corrected plus no-assessment PDF disabled assertion, affected2/2 pass; all10 PDF/report assertions pass. Full browser101pass/1skip/known unrelated64-question rail failure750vs734 retained; no weakened tests. Desktop/mobile direct download, HTML and hypothetical export pass. Both local/actual-container PDFs13 pages,35 link annotations;8 contents destinations pages2/3/4/5/7/8/9/10; all pages visually inspected, Manrope embedded, original branding and pentagon legible.
Docker Desktop startup failed; no reset/retry. Owner authorized isolated existing-host build/test only, then deployment after verified. No checked-in CI workflow. Temporary candidate image d102bfc066e28d3a53c6495b8ba935f2555cb9ec8a044d38e9137854886299d5 (511549732bytes vs prior269615253bytes) built via production Dockerfile/pinned Node digest.1.5GiB build cap exhausted during types;2GiB/half-core cap passed with live health preserved. Actual container used no network/ports/credentials/budget mounts; existing768MiB/1CPU/128PID/read-only/tmp64MiB limits. Test found zombie Chromium children; standard compose init:true resolves child reaping, verified0 remaining processes/directories after repeated requests. Generation3899/2063/2327ms; cgroup peak325533696bytes (310.5MiB), within768MiB; concurrent200/503, arbitrary HTML/URL400. All live compose/release/rollback hashes unchanged during verification. Linux sample retained locally in .local/report-review/mosaic-direct-report-linux.pdf. No synthetic artifacts in production source.
Work interval started2026-11-03T23:54:13.069+07; ongoing through publication, final elapsed recorded once at closeout. Estimate65–95m, coding tokens unavailable, API spend0. Rework: loopback test boundary, Docker startup, build cap and child reaping; reuse existing origin helper and init, no new framework. Existing broader multi-format M12.1 remains open. Deployment must use exact merged source, verify its image before switching via existing release process, retain rollback and verify hosted download with saved fictional data only.
## M12.1 direct PDF — approved local implementation 2026-11-03
Owner approves Chromium runtime and focused download/rendering/request-safety assertions. Reuse approved HTML/print styles, retain HTML, internally construct from structured snapshots only, identity-match saved recommendations, recompute actual/scenario through existing engine; no models, classification or scoring changes. One PDF job per process, bounded request/render duration, embedded first-party assets, no external browser requests, process-tree cleanup and retryable error. Local only on codex/report-pdf from main b8435b0; no merge/deployment, M12.1 stays open pending PDF acceptance. Preserve other worktrees/servers.
Live F1 and ID-confirmed M12.1 row55 notes and standing protocol loaded. First timed reading2026-11-03T23:54:13.069+07 (earlier feasibility/approval exchange not measured); estimate45–65m implementation +20–30m verification=65–95m. Existing report reuse offsets new runtime/container boundary work; moderate confidence. Coding-token forecast/actual unavailable; model cost0. No explicit pause yet. Docker Desktop startup failed before any build with its inference-manager socket error; no settings reset/retry/live-server build. Container verification blocked unless an existing alternative is available.
Approved checks: extend existing m3-report-grounding.test.ts and assessment.spec.ts for structured-only input, matching recommendations, separate scenarios, request limits/origin/concurrency/retry and real PDF download; existing production build/type/lint plus render comparison/links and representative latency/process memory. No new fixture project. Commands npx vitest run tests/unit/m3-report-grounding.test.ts --maxWorkers=1; npx playwright test tests/e2e/assessment.spec.ts --grep "PDF download|levers use approved Golden". Final measured evidence follows.
## M12.1 accepted and deployed — 2026-11-03
Owner-approved report committed89afd80a3bbd5b946ba80a137043f817b1a42266, pushed codex/assessment-report and merged PR13 to main03db3bb5767eba5499f676af4581a0cd5718dec5. Exact merged-source release mosaic-0a65aa7bc5c26d41139b is live at https://preview.flowagentai.website; image sha256:a08976e8a8577aeeecf6efb53e8a497c28f7d5a2d603c113a42ede19ae174fb4 healthy. Prior image/compose retained for rollback; credentials/operating/public and verification budget hashes unchanged. Other worktrees, servers and landing/video preserved.
Hosted export verified with approved Golden Agro saved answers and exact-input saved recommendations in an isolated browser, generation intercepted (one retained response, zero model calls). Download437230bytes includes matching advice, Mediator portrait,52.2 raw/52.1 weighted, embedded font and contents. Render inspected: fonts/images loaded, no visible technical identifiers or Columbia. Existing13-page print/mobile/link evidence retained. Existing focused report4/4 and lint/type/build pass; prior full browser100pass/1skip/known unrelated rail failure remains disclosed, no weakened assertion. Broader multi-format M12.1 scope remains open; accepted first-pass HTML/print-to-PDF is deployed.
Publication interval2026-11-03T23:18:09.214+07 to23:27:10.746+07=9m02s checkpoint, no pauses; forecast3–5m records/Git +6–10m deployment/verification=9–15m. Prior44m37s retained, cumulative53m39s measured; subsequent final records/checklist bookkeeping unmeasured. Upload dominated this interval; within estimate, no further workflow correction. Coding-token forecast/actual unavailable; application model calls/cost0. This documentation-only closeout requires no runtime redeployment.
## M12.1 accepted publication/deployment — owner2026-11-03
Owner accepts the MOSAIC-only branded report and explicitly authorizes scoped commit/push/merge into main and live deployment. Live F1 and M12.1 row55 notes loaded; origin/main b3fc609 still equals feature base. Include only report exporter/presentation/portable assets, download integration and existing four records. Exclude .local sample, scripts, screenshots/PDF and all unrelated work. Existing report4/4, affected lint/TypeScript/build and rendered13-page evidence retained; prior broader gate100 browser pass/1skip/known unrelated rail failure and corrected immutable-source check remain disclosed. No new assertions/model calls or scoring changes.
Publication start2026-11-03T23:18:09.2143163+07; estimate3–5m Git/records +6–10m release/verification=9–15m, moderate confidence using prior8m15 landing release and established deployment. Coding-token forecast/actual unavailable. Export exact merged main into isolated packaging directory; normalize packaged deploy.sh LF before hashing/upload. Preserve host credentials, operating budget, ledgers, prior image/compose, all worktrees and local servers. Verify public export using approved retained fictional assessment and matching saved recommendations only, with generation intercepted/no paid request. Final commit/merge/release/effort evidence follows in the checklist and scoped records.
## M12.1 reader-facing copy correction — owner2026-11-03
Owner removes Columbia entirely, including Research project, cover origin statement and recurring footer attribution. Raw configuration/method/bank hash/mapping/rule/template identifiers moved out of visible/printed copy into escaped non-visible HTML metadata; no audit values or calculations changed. Reader-facing methodology now explains that results reflect the answers/rules at creation and are not a verified audit. Initial technical disclosure over-prioritized developer reproducibility; keep technical metadata separate from user explanations. Existing MOSAIC lockup/watermark/contents, answers/recommendations and hypothetical distinctions preserved.
Live F1/M12.1 and standing protocol loaded; same isolated codex/assessment-report baseb3fc609, no commit/push/merge/deploy/model calls. Existing report4/4, affected lint, build/TypeScript and diff check pass.13-page PDF rebuilt, affected cover/portrait/methodology pages visually inspected; extracted PDF text confirms no Columbia, Research project or raw version/hash strings. HTML font/images/anchors and mobile390 width pass. Prior full-gate evidence and unrelated rail failure retained, not rerun. Preview3106 updated; review pending.
Measured23:14:33.6407990+07 to 2026-11-03T23:16:46.3759563+07:00 = 133 seconds elapsed; no pauses. Initial pre-clock read/final bookkeeping unmeasured. A separate pre-edit forecast for this small follow-up was not recorded; variance unavailable, not reconstructed. Prior34m00s+8m24s preserved without overlap. Coding tokens unavailable; model calls/cost0. No additional workflow correction.
## M12.1 cover / repeating branding revision — owner2026-11-03
Live F1/M12.1 notes and standing protocol reloaded. Owner requests grid+MOSAIC lockup at top-left cover/bottom-left following pages, compact linked cover contents, removed detached tagline and grid watermark on every page. Supplied BRAND.md/OPEN_ITEMS.md prohibit University marks; owner explicitly chooses plain-text Columbia Climate School for now, superseding the requested school-logo placement. Retain research-origin/no-endorsement language; no institutional logo or publication permission inferred. Supplied combined lockup includes superseded acronym, so original grid and wordmark assets are paired proportionally instead. Footer SVG is a layout wrapper embedding both original byte-preserved assets, not redrawn paths. School name is plain text top-right/bottom-right. Existing scoring, sample answers/recommendations, portrait and hypothetical values unchanged; no model calls/dependencies/merge/deployment.
Compact cover retains six context fields; remaining supplied context preserved in methodology. Eight TOC links resolve to PDF pages2,3,4,5,7,8,9,10, matching summary/portrait/gaps/recommendations/Levers/methodology/references/evidence. All13 final pages inspected including continuation pages; pale grid repeats throughout, later pages carry one correctly proportioned footer lockup, readable page number and school attribution. Mobile390 has no overflow; keyboard disclosure works, fonts/images load, HTML anchors valid. Native Chromium paged-media footer/margins; existing browser print-to-PDF format retained. Local preview3106 and same HTML/PDF filenames updated.
Existing report4/4, affected lint/TypeScript and production build pass. Initial report-prefix assertion caught a conditional scenario TOC addition; removed it to preserve the unchanged actual-report prefix, no assertions weakened. Reused preceding full gate and known unrelated64-question rail limitation; no redundant full suite. First printed footer background tiled; corrected using embedded original assets in a single fixed-size layout wrapper. Duplicate context and table spill corrected by removing duplication and print spacing. No unrelated worktree/server changes.
Revision measured23:00:07.3378844+07 to 2026-11-03T23:08:31.5059882+07:00 = 504 seconds elapsed through checkpoint; initial pre-clock read/final bookkeeping unmeasured, no explicit pause (owner answer arrived during independent work). Forecast15–25m edits +10–15m verification=25–40m; existing sample/assets/checks shortened delivery. Prior34m00s interval remains separate, not double-counted. Coding tokens unavailable; model calls/cost0. Main rework: paged-media background tiling and small spillover; no additional workflow correction beyond existing LF preparation recommendation. Branch codex/assessment-report, baseb3fc609; unstaged/uncommitted/unpushed, no merge/deployment, local review pending. Broader M12 multi-format scope open.
## M12.1 local-review verification and effort checkpoint — 2026-11-03T22:57:52.9770397+07:00
Sample ready at http://127.0.0.1:3106/ and /golden-agro-mosaic-report.pdf; standalone HTML383671bytes approximately,13-page print sample, all pages visually inspected plus desktop1440/mobile390 cover/summary/portrait. Original Manrope bytes embedded with OFL; loaded font and rendered glyphs, vector chart labels, watermark opacity0.045, keyboard disclosure, no mobile overflow and27 PDF link annotations checked. Four source destinations resolve through connected Drive; sharing unchanged. Final sample uses original55-answer fixture and input-matched saved recommendations, no provider calls. Climate School asset/permission limitation retained.
Verification: existing report unit4/4 and focused scenario/export browser1/1 pass. Standing full gate attempted once: type/domain and lint pass;311/312 units initially, only immutable source bytes failed due new Windows worktree CRLF conversion. Restored exact pinned LF bytes in this worktree (all seven match manifest); failed config-selection file21/21 passes; no canonical Git diff or assertion changes. Production build passes. Full browser stage100 passed,1 skipped,1 known unrelated failure:64-question rail scrollHeight750 versus clientHeight734 at assessment.spec.ts448. Existing historical rail limitation confirmed; no report failure, no broad UI fix or gate restart. Report/download/portrait/Golden/source/dialog/offline checks pass. General gate is therefore not all-green; accepted unaffected evidence retained.
Measured interval22:23:53.2800052+07 to 2026-11-03T22:57:52.9770397+07:00 = 2040 seconds elapsed through closeout checkpoint; no explicit pauses. Initial pre-clock reading and final bookkeeping after checkpoint not measured. Calendar span equals measured interval; no active-time claim. Compared with65–95min forecast, reuse of retained sample, recommendations, report core, assets and existing checks shortened delivery. Avoidable rework: Windows source-byte conversion and two small print pagination adjustments. One proposed workflow correction: preserve pinned LF source bytes when preparing a new worktree before the immutable-source test. Coding-token forecast/actual unavailable; model calls/cost0.
Branch codex/assessment-report, base b3fc60968fc584addfbfc03e986a96b597add7cf; scoped changes unstaged/uncommitted/unpushed, no new SHA/PR/merge/deployment. Local artifacts/scripts remain .local review evidence, not production files. Other worktrees/servers and landing/video untouched. M12.1 first-pass owner acceptance pending; broader multi-format milestone remains open. Final checklist readback follows this checkpoint.
## M12.1 first-pass branded report — owner2026-11-03, local review
Live F1 and ID-resolved M12.1 (row55) including notes loaded; current owner authorizes one bounded HTML/print-to-PDF presentation pass, not a new multi-format system. Isolated codex/assessment-report from origin/main b3fc60968fc584addfbfc03e986a96b597add7cf. Preserve other worktrees, saved assessments, landing/video and running servers; no model calls, scoring/configuration/mapping changes, dependencies, merge or deployment. Existing report/download and recommendation identity safeguards retained. No new assertions or test harness; existing report/Levers checks and approved gate only, plus owner-requested rendered visual verification.
Scope: cover/context/date qualification; actual score/category/coverage summary; existing paired portrait and pentagon; saved gaps/recommendations with anchored original references; independently hypothetical top-five existing Levers; methodology and complete actual-answer evidence. Portable embedded Manrope font with OFL, supplied MOSAIC logo watermark and portrait/category SVGs; proportion-preserving images. Climate School logo absent from inspected repository and supplied MOSAIC_BRAND_PACK; institutional-use permission not documented. Plain-text origin attribution and no-endorsement/certification qualification retained; do not invent institutional artwork.
Sample reuses retained LANDING_EXPANSION/walkthrough/raw_clips/sample-metadata.json (GOLDEN_02_FOOD_AGRO, Golden Agro Foods Co. fictional) and successful recommendation-attempt-2-response.json. SHA-256 input identity ad98c147a5ee5071842472e495b9f026b8e847875d1194176458f560ac582b84 verified before rendering. No new answers/recommendations. Exact actual raw52.24439089851655, weighted52.14993859317272;55 answered/0 missing; The Mediator (Engage+Commit). Sample date is explicitly the retained3Nov walkthrough snapshot; general exports say assessment date not recorded rather than inventing one. Four cited Drive file destinations resolved through connected account; public/recipient access not asserted.
Delivery start2026-11-03T22:23:53.2800052+07; initial reading before clock not measured. Forecast implementation/records45–65m plus rendered/automated verification20–30m=65–95m, moderate confidence; more print-pagination work than recent narrow landing changes, reuse of existing engine/export offsets that. Coding-token forecast/actual telemetry unavailable; application model/API spend0. No approval/overnight pause. Final elapsed/verification checkpoint recorded below once at closeout. Local review artifacts/scripts under .local are not production assets or a new test harness. Preview http://127.0.0.1:3106/; test port3107 separate from existing3103/3105. No commit/push/merge/deployment; acceptance pending.
## M13.1 hero acronym live correction — owner2026-11-03
Owner explicitly supplies new hero identity: MOSAIC - Measuring Organizational Sustainability Across Industries and Contexts. Supersedes the retained historic acronym for the requested line above H1. Only homepage hero identity content/binding changes; fonts/layout/other copy/core app unchanged. Live F1/M13.1 notes and standing protocol loaded. Start16:27:14+07; estimate1–2m copy/publication +4–6m build/release/verification=5–8m using prior8m15 release, moderate confidence. Coding tokens unavailable; no provider calls. Existing lint/unit checks reused; production build/TypeScript and hosted visual/readback verification through established release process. Normalize packaged deploy.sh LF before hashing/upload. Owner requests live patch; scoped commit/push/merge/deploy authorized by continuation. Final release/effort evidence in checklist/handoff.
## M13.1 accepted landing package LIVE — 2026-11-03
Owner explicitly authorizes deployment. Merged source030b6cdf15ba457fcd9aee4253a7db92470f001f (feature74c68d4, PR#10) exported from Git and deployed via existing new-host workflow as mosaic-bccf7a0d02bce0da6e4f. Image sha256:ed3e9d352328814ee46098000029196a03db09d96fd03bcd43306acaebd98d5b; Next build8BncdPkwkJjC258CoCGqm. https://preview.flowagentai.website serves accepted landing page. Initial package shell CRLF stopped before service mutation; normalized deploy.sh only in isolated packaging copy to LF, no source/runtime edits. Prior image9775825e0076f35ef974c5d19ee7afb2c1794ad7e510252e7274e9eaab72f77c retained in release.previous.env and prior compose retained for rollback. No other host/worktree/local-server changes.
Production build/TypeScript passed; healthy container, Caddy validation/reload successful. Homepage/assessment/Results/report PDF/screenshot/captions HTTP200. Reused modal review at1440/390: Close/Escape work, focus returns to trigger, URL unchanged; hosted image decoded before visual inspection. Report SHA3c67b1b11bce6512031bb7d1f033313fec1ebaa4b2e49d713a4680d40cdc1d78 matches reviewed artifact. Read-only AI readiness ready/parity-9 with existing configuration; no generation or provider call. Credential/operating/public-ledger/verification-ledger SHA256 hashes unchanged before/after, existing budget preserved. Core app, scoring/config and deployed film/captions unchanged. Existing offline verification retained. Locked dependency installation emitted existing npm audit advisories (1 high/1 critical); no dependency upgrade or new security-clearance claim.
Protocol/live F1/M13.1 row56 loaded. Deployment start16:12:29+07, estimate5–10m release +3–5m verification=8–15m, moderate confidence based on earlier15m12 media release. Earlier implementation/publication intervals retained separately. Coding-token forecast/actual unavailable; application API usage0. Final elapsed checkpoint recorded in the existing checklist/handoff after publication. Main avoidable retry: archived shell CRLF; one correction: normalize the packaging shell to LF before hashing/upload, even when exporting from Git. This records the earlier line-ending correction was not fully effective when applied only by relying on Git archive. Accepted landing scope live; broader M13 copy/icon/attribution follow-ups remain separate.
## M13.1 landing package ACCEPTED — owner2026-11-03
Owner approves all reviewed landing-page changes and authorizes scoped commit/push/merge into main; no deployment requested. Live F1/M13.1 row56 and standing protocol loaded. Diff against current origin/main63c3525 confirms app/src/domain,application,adapters,features,config,dependencies and public/media unchanged: assessment/calculator/scoring/question selection/archetypes/recommendations/Levers/report-generation runtime preserved. Homepage-only components/content/CSS, six real-app screenshots, original-wording linked research PDF, affected copy/link/disclosure test expectations and existing records constitute the entire package. Source research raw files untouched. Reviewed build_0UnmALIVJ-N2a0CGOOfu remains at3105; other worktrees/servers preserved.
Existing passing evidence reused: affected lint/build/TypeScript,4 homepage unit checks,10 homepage browser checks and2 assessment-entry checks; final modal3 responsive checks and desktop/mobile Close/Escape/focus review pass. No further application edits or redundant tests at acceptance. Prior known unrelated questionnaire rail limitation retained. Publication interval starts16:09:02+07 (initial read before clock unmeasured); estimate2–4m records/Git +1–2m merge verification=3–6m, based on prior narrow publication; coding-token estimate/actual unavailable, API calls0. Branch codex/landing-content; commit/remote/merge evidence to be confirmed in checklist/handoff. Broader M13.1 final copy/icon/attribution follow-ups remain separate; accepted scope does not close the entire milestone.
## M13.1 screenshot modal follow-up — 2026-11-03
Owner-authorized small interaction correction: six screenshots now open native modal dialogs using existing Results dialog behavior and shared design tokens, with visible Close screenshot control, Escape dismissal and focus restoration. No navigation away, dependency, image/content/scoring changes or provider calls. Live F1/M13.1 and current instructions loaded; local codex/landing-content base63c3525, uncommitted/unpushed, no merge/deployment. Own preview only refreshed at http://127.0.0.1:3105/ build_0UnmALIVJ-N2a0CGOOfu. Existing4 unit checks, affected lint and production build/TypeScript passed; existing responsive checks reused. Manual desktop1440/mobile390 modal opening, Close/Escape dismissal, unchanged URL and restored trigger focus observed; captures inspected. No new automated assertions/harness. Prior unrelated passing evidence retained.
Forecast2–3m implementation +3–5m verification=5–8m; measured16:03:04+07 to 2026-11-03T16:06:44.0412165+07:00 = 220 seconds elapsed through closeout checkpoint, no pauses; final bookkeeping unmeasured. Earlier intervals retained separately. Reusing native dialog and existing checks shortened work; no material rework or additional workflow correction. Coding-token estimate/actual unavailable; application API usage0. Owner review pending.
## M13.1 research/screenshots follow-up ready locally — 2026-11-03
Owner-authorized inline-spacing correction, real-app screenshots and source-grounded research/download update complete on codex/landing-content (base63c3525), uncommitted/unpushed; no merge/deployment. Live F1 and ID-resolved M13.1 row56 notes loaded; existing UI/Drive/DOCX/PDF guidance used. Inline S.E.E. link now wraps without button-height spacing. Six byte-preserved screenshots reused from approved LANDING_EXPANSION walkthrough (GOLDEN_02 fictional-company example), including actual successful recommendation/Sources captures; captions identify illustrative fictional-company assessment and images open full size. No new answers, recommendation calls or synthetic rendering. Existing overview video/brand assets/scoring/config untouched; other worktrees/servers preserved.
Research title now External validation & comparative research. Concise disclosures distinguish authors' listed-company external-rater agreement and separate50-firm Capstone re-reading from current-app Golden checks; note extraction noise, transferred weights, lack of outcome validation and obsolete intensity-workbook weights. No claim that alternative research weighting is implemented. Source folder1OBrou7gspPLafaDrlUwMM0m5Oq-2T4Rt read via Drive. Downloaded ESG_Rating_Team_Report.docx matches retained source SHA4f5f3691de04105740e05ae96e81c7c2689e9f617fde3bab51d3ca2a57e82213. Installed Word exports13-page app/public/research/ESG_Rating_Team_Report.pdf, SHA3c67b1b11bce6512031bb7d1f033313fec1ebaa4b2e49d713a4680d40cdc1d78. Original full text exactly equal after XML hyperlink wrapping; wording/tables/equations preserved. All13 rendered pages inspected. Four embedded Drive links to named methodology, regression note, file guide and China calculator retain existing permissions; local read/download links added. Automatic review rejected blanket companion copying and broad firm-data links; neither was performed. Firm-answer/score/weight dataset filenames remain unlinked; only the explicitly requested report is served publicly. No source sharing changes.
Verification:4 existing homepage unit checks, affected lint, production build/TypeScript pass.10 existing homepage browser checks pass at1440/390/320 including expanded axe, keyboard, motion and anchors; one superseded-copy locator corrected and only that check rerun1/1. Desktop/mobile context/screenshots/research/download controls inspected. Six screenshot URLs and PDF HTTP200; PDF application/pdf506372bytes,4 link annotations/4 canonical Drive targets. Current preview http://127.0.0.1:3105/ buildf4VgjlKT9SoCa777No05Q. Existing unaffected assessment/scoring verification retained; no new harness/dependencies/API calls. Original report/source hashes retained. Working changes pending owner review.
Effort:2026-11-03T15:45:28+07–15:57:31+07=12m03 elapsed through verification/closeout checkpoint; final bookkeeping unmeasured, no pauses. Forecast25–40m implementation/source work +10–15m verification=35–55m. Faster due retained source/screenshots and existing verification. Earlier15m08 and3m13 remain distinct, not double-counted. Coding-token estimate/actual and active-time split unavailable; application API usage0. Main rework: Word Find hyperlink iteration stalled; stopped only identified hidden conversion processes, switched to bounded XML wrapping, conversion/cleanup succeeded. One correction: use bounded source-position/XML edits for links before a single Word export. Prior stable-disclosure locator correction held; new failure was obsolete text expectation only.
## M13.1 owner hero/attribution follow-up — 2026-11-03
Live F1/M13.1 notes and standing protocol reloaded. Owner requests separate main title/italic smaller subtitle, MOSAIC plus existing acronym above italic navigator line, and linked Society of Entrepreneurs and Ecology (S.E.E.) capstone attribution. Implemented using shared h3-size typography inside semantic hgroup subtitle (avoids skipped heading level), existing fonts/colors and supplied HTTPS link; expanded origin copy uses same organization name. Video/assets/methods unchanged. Current preview http://127.0.0.1:3105/ build3jqSrYfcjc04M1bYclreA; only own identified preview restarted. Local codex/landing-content from63c3525 remains uncommitted/unpushed, no merge/deployment.
Existing4 homepage unit checks, affected lint, build/TypeScript and3 responsive/expanded-accessibility browser checks pass at1440/390/320. Desktop/mobile captures inspected; S.E.E. URL resolves to named organization. Earlier passing unaffected checks retained. No new tests/dependencies/API calls. Forecast2–4m edits +3–6m verification=5–10m; measured15:29:55+07 to 2026-11-03T15:33:07.9984276+07:00 = 193 seconds elapsed, no pauses; initial read before clock unmeasured. Prior15m08 retained separately. Reuse shortened follow-up; stable disclosure locator correction remained successful. No new workflow correction. Coding-token estimate/actual unavailable. Review pending.
## M13.1 landing content ready for local review — 2026-11-03
Local content/hierarchy implementation complete on codex/landing-content, isolated from current main63c352508ddc97d347f23dc54adab0f46f859a4d. Owner review pending; all changes uncommitted, not staged/pushed/merged/deployed. Preview http://127.0.0.1:3105/ (Next build q7MDw463-AU6Hx8vVkjCY, offline provider mode). Other worktrees/servers preserved. Overview narrated film, matching captions, frame and assets unchanged; existing tokens/fonts/icon assets reused. Capstone origin, six result explanations, three detailed native method disclosures, two research sections and clearly unavailable planned-video slots implemented. Research summaries/original-work links remain pending real author material; no invented findings/links/approval or new acronym expansion.
Technical reconciliation: selection/score-assessment confirms context selection separate from multipliers, 1.5 product cap, scored-answer denominators and unredistributed missing category weights; archived PROMPT_base_weights.md supports historical 75/25 rank preparation only, not a newly reproduced live derivation. RAG retrieve/prepare/validate-output and policy confirm metadata/text ranking with up to8 documents/18 chunks, versioned prompt with answers/scores/context, structural validation rather than citation/semantic verification; no embeddings/live web search/admin regeneration claims. Portrait/Levers/report/calculator statements match current code and eligibility. Illustrative extraction and numerical example explicitly labeled. Public methodological detail preserved without editorial production instructions. No engine/config/mapping/scoring changes, dependencies or API calls.
Verified: affected ESLint, production build/TypeScript and4 existing homepage unit checks pass. Existing browser suite7 unchanged checks pass; three responsive checks initially failed in the adapted test's shrinking open-details locator during closing (axe had passed); corrected stable summary selector and all3 pass at1440/390/320, including expanded-content axe/keyboard toggling. Two affected assessment-entry accessibility checks pass. Final focused5 checks59.9s; total12 distinct affected browser checks passing, no assertions weakened. Desktop/mobile hero, outputs and expanded scoring captures visually inspected; navigation/link targets and sticky anchors verified. git diff --check clean. Prior unrelated full-gate evidence retained; no redundant scoring/provider checks. Preview images under ignored app/.local/landing-review.
Effort protocol/live F1 and ID-resolved M13.1 row56 notes loaded. Measured session2026-11-03T15:05:37+07–15:20:45+07=15m08 elapsed through implementation/verification; final record/checklist bookkeeping after checkpoint not measured. No pauses; measured calendar span15m08. Forecast35–55m implementation/reconciliation +15–25m verification=50–80m, moderate confidence; faster through reuse of existing components, dependencies and focused checks. Coding-token forecast/actual and active-time split unavailable; application API usage0. Avoidable rework was mutable locator cleanup; one correction: use stable summary locators when toggling disclosure state. Previous dependency-copy correction helped: build passed without junction issue. Checklist update only M13.1, preserving portrait final-copy/icon follow-up, F1 and other milestones. Acceptance remains pending local review.
## M13.1 landing content — local implementation authorized2026-11-03
Live F1 and ID-resolved M13.1 row56 notes, current repository instructions/plans and supplied landing/video handoff read. Owner authorizes local content/information-hierarchy implementation only, preserving design tokens/assets and deployed overview film/captions. Separate codex/landing-content worktree from currentmain63c3525; no merge/deployment/paid calls/scoring changes. Handoff is reference content, not authority for media production or proposed acronym rebrand. Existing brand/attribution retained; no invented author findings/links/approvals. Native disclosures with planned-video labels; author-approved research summaries/original links pending.
Start15:05:37+07. Forecast35–55m reconciliation/implementation +15–25m verification=50–80m, moderate confidence; broader than prior15m12 video replacement because detailed technical claims require code/config reconciliation. Coding-token forecast/actual unavailable. Reuse existing homepage unit/browser keyboard/axe/link/responsive tools, adapting copy/section expectations; no new harness or provider calls. Prior correction applied: physical copy of existing dependencies, not junction. Local preview/tests use separately verified unused ports. Record final evidence/effort in existing records only.

## M13.2 supplied narrated film + captions LIVE — 2026-11-03
Owner-authorized replacement delivered, preserving existing frame/borders/poster/layout/controls and surrounding copy. Both older MP4 resolutions and old VTT retained in app/public/media for rollback; new versioned MP4/VTT added. Matching20-cue English captions attached kind=captions,srcLang=en,label=English,default. Intentional81.55/83.06 reveal cues retained. No transcription, conversion, styling, scoring, recommendation or dependency changes.
Implementation f382aec40d89beed236dda49e05afee74be1c058 pushed on codex/m13.2-narrated-video; PR#8 https://github.com/gliechty/capstone-v2/pull/8 merged main ee6fab5040082555666b6e12e03b3d9ce6746066. Exact merged app deployed as mosaic-0ac1f02b37339c84dd07; image9775825e0076f35ef974c5d19ee7afb2c1794ad7e510252e7274e9eaab72f77c; buildgQahEjLhiod_f61vM5m_V. https://preview.flowagentai.website live200. Browser1440/390 selects new film;1920x1080,91.76s,video/audio decoding/no error,20 captions0.19–89.8 with English/en/captions, active83.2s reveal confirmed. Hosted desktop/mobile captures inspected. Supplied MP4 SHA033abe8f4ae5005a9bccb2733e9c11358f209fe07959f545043e8eb1ad786464 identical live; VTT text/timings identical after newline normalization (served SHA1920c8df4cee8680fc2f570b50867e5a74567aefd50d403065399cd56d9593d9). Old assets present, credentials/operating/both budget-ledger hashes unchanged; prior image61a16b1a06ad retained in release.previous.env. Other worktrees/local servers untouched; no AI calls.
Verification:4 existing homepage unit tests; affected lint; final production build/TypeScript;3 existing desktop/mobile/narrow responsive/accessibility checks pass25.9s. Existing real-media inspection reused; no new assertions/harness. Prior unrelated full-gate evidence/rail limitation retained, not rerun for media-only change. Final candidate uses matching captions with no lint exception. Initial stale fallback-link expectation corrected; initial Turbopack junction issue resolved using copied existing dependencies, no package installation/change.
Protocol/live F1/ID-resolved row57 loaded. Measured2026-11-03T12:42:07+07–12:57:19+07=15m12 elapsed; forecast8–15m implementation/release +5–10m verification=13–25m, within range. No measured approval pause (independent work continued until captions arrived); initial pre-clock read and final bookkeeping after checkpoint unmeasured. Coding-token estimate/actual and active-time split unavailable; provider usage0. Main avoidable delay: dependency junction rejected by build. One correction: use a physical copy of existing locked dependencies for isolated Turbopack worktrees. Previous named-role locator correction retained and existing UI checks passed. M13.2 update scoped to supplied replacement; no broader copy/attribution/brand approval inferred. Records-only publication follows, app unchanged/no second rollout needed.

## M13.2 narrated video replacement — owner authorized2026-11-03
Live F1 and ID-resolved M13.2 row57 notes plus standing protocol loaded. Owner supplies narrated1080p MP4 and explicitly requests live replacement while keeping both versions and identical page presentation. Current instruction supersedes prior review-pending note for this asset; no Guo/script approval inferred beyond owner deployment authorization. Start12:42:07+07; initial pre-clock read unmeasured. Estimate8–15m asset/release work +5–10m verification=13–25m, moderate confidence using prior deployment27m55 but much narrower media-only change. Coding-token forecast/actual unavailable. Isolated codex/m13.2-narrated-video frommain76779a1; preserve all other worktrees/servers.
Versioned public/media/mosaic-explainer-narrated-2026-11-03-1080p.mp4 retains exact supplied bytes;1920x1080,91.76s,H264/AAC. Both source entries and fallback download target new video; old720p/1080p/poster/VTT retained. Poster/frame/classes/borders/controls/layout/copy unchanged; accessible duration corrected92s. Old captions detached because no matching new transcript supplied; no invented captions or media conversion. Existing approved real-video playback and scaffold desktop/mobile checks reused, label expectation adapted only; no new tests/providers/dependencies. Prior full scoring/Results evidence retained; unrelated16px rail failure unchanged.

## M10.1 (formerly M10.3) accepted and deployed — 2026-11-02
Owner accepts current portraits for demo. Feature e98f67c and scoped existing-check correction8349ed0 pushed on codex/m10.3-portraits; PR#6 https://github.com/gliechty/capstone-v2/pull/6 merged into main a084f6cbc48692c6c0a3f18f550178b7647cd9d3. Exact merged application tree equals accepted branch. Deployed through existing workflow as mosaic-36cdd6dde631b986e201, image sha256:61a16b1a06ad032d8ca2fc097d91c52f8e1349a1da2dcb1c81bc551143617c98, Next build VnI5Jqm2WT0qNrXEUABYd. Public https://preview.flowagentai.website /assessment /results HTTP200 and served accepted archetype introduction confirmed. Hosted readiness/budget-denial/report and all five full-precision Golden scoring comparisons pass2/2 (20.4s); no actual AI generation. Credentials, operating settings and both persistent budget ledgers unchanged by SHA256; prior image7bcde821141e plus previous compose/release retained. No other worktrees or local servers changed.
Full typecheck/lint,312 unit tests and accepted build pass. Browser final100 pass,1 existing skip,1 known unrelated64-question desktop rail failure (16px overflow after navigation); questionnaire code/styles unchanged, failure recorded without weakening assertion or bundling unrelated fix. Results test selectors now distinguish category chart/portrait chart and heading/link, and use configured origin. Source-integrity test passed using exact pinned Git source bytes; temporary checkout-byte adjustments restored, no config changes. Application/provider calls0; coding-token estimate/actual unavailable.
Live checklist concurrently refactored former M10.3 -> M10.1 row52; final publication evidence belongs there. M13.1 now row56 retains requested final explanatory-copy/icons approval note; shared visual polish may be coordinated with M13.3 per current PM note. Current section is demo-accepted; minor pre-release copy/icon changes remain possible. No new methodology work authorized. Preserve F1 and all other milestone status/history.
Publication interval2026-11-02T13:06:29+07 to13:34:24+07 =27m55 elapsed, no explicit pauses. Prior106m13 retained once ->134m08 cumulative measured. Calendar/review gaps and final bookkeeping after this checkpoint unmeasured; elapsed is not active time. Forecast10–20m publication/records +5–15m verification=15–35m; within forecast, full browser gate and focused correction reruns dominated. Earlier heading-locator correction helped portrait checks but missed broader Results locators. One proposed correction: when adding a second chart or action link, scope existing cross-page assertions to their named region/role before the final gate. No new tooling. This records-only closeout is to be published separately; no application redeploy required for unchanged app tree.

## M10.3 accepted for demo — publication/merge/deployment authorized2026-11-02
Owner accepts current paired portraits and explanatory hierarchy as demo-ready; explicitly authorizes scoped commit, push, merge into main and live-server deployment. Final copy/icons may receive minor pre-release adjustments; record final approval follow-up in existing M13.1, without starting its implementation. This supersedes pending-acceptance/no-publication wording below. Preserve other worktrees, servers, uncommitted work and historical evidence. Live F1, ID-resolved M10.3 row56 and M13.1 row60 values/notes loaded.
Publication start13:06:29+07. Estimate10–20m Git/deployment/records +5–15m verification=15–35m, moderate confidence against prior9m47 deployment and existing procedures; coding-token estimate/actual unavailable. Prior106m13 measured retained once; owner-review gap unmeasured. Existing accepted candidate is frozen except required scoped release corrections. Run existing full gate once, retain passing checks and rerun only concrete failures. No paid/provider calls; preserve credentials, operating allowance and both budget ledgers. Current main5fab089 remains ancestor; no unmerged conversational-entry dependency. Existing live image7bcde821141e/release mosaic-a888f72da846c7742c57 healthy at read-only preflight; rollout/merge evidence pending. Apply prior packaging LF correction in ignored exact-Git release package, not tracked shell rewrite.

## M10.3 explanatory hierarchy — ready for local review2026-11-02
Presentation only: supplied Your sustainability archetype introduction and category/approach distinction above card; paired family names beneath title; Commit · Anchor style labels and definitions for all five families; two-sentence deterministic reading grounded in rankings/answer counts, no As an Anchor opening or buyer-reaction inference. Chart explains all-applicable credit/unanswered effect. Hero dots labeled Approach development, not verified organizational maturity; combined numeric percentage only in existing disclosure. Full methodology/exclusions/ties/IDs/evidence retained. Template4; classification, percentages, maturity math/thresholds, mappings, scoring and Levers unchanged. No AI calls.
27 existing unit +4 affected desktop/mobile checks pass; build/TypeScript/scoped lint/diff pass, prior unrelated checks retained. Preview http://127.0.0.1:3103/results PID16584 buildUt5nuidMOXbk3uCMriyxj HTTP200/identity verified; refresh existing tab preserves session. Captures app/.local/hierarchy-review inspected. Isolated codex/m10.3-portraits base3afc3ab; all v2 changes remain uncommitted/unpushed, visual review pending, no merge/deployment. Only M10.3 checklist updated.

## M10.3 top-two maturity revision — local review pending2026-11-02
Owner confirms all-applicable eligible denominator, equal-weight percentages, category-normalized possible weights for ties ONLY, and focused maturity/tie tests. This supersedes prior50% strength/half-coverage/three-family gates and no-maturity instructions for portraits only. Any two families with at least one valid eligible answer receive a supplied ordered pair; fewer than two -> Portrait in progress. Unanswered eligible items remain missing but contribute no earned credit against full denominator. Existing exclusions/numeric credit/provenance retained. Emerging<=50%, Growing>50–75%, Mature>75%; hero arithmetic mean and constituent dots/text labels. Sustainability scoring/actual-answer Lever ranking unchanged.
Local runtime uses portrait_rules_v0.2.json (portrait-beta-2/template3) and portrait_subtypes_v0.2.json; original v0.1 references retained as superseded evidence. Family mapping/tags unchanged. No API-provider calls/dependencies/merge/deploy. Approved27 portrait/scoring +9 existing score/Results unit checks and6 desktop/mobile browser checks pass; build/types/domain/affected lint/diff pass. Preview3103 updated/HTTP200 buildFtLd85Q6rQWf7ciyTZTF-, PID26508. Refresh existing Results tab to preserve session. Branch codex/m10.3-portraits base3afc3ab, scoped changes uncommitted/unpushed; visual acceptance pending. EXECUTION_PLAN records methodology/verification/effort.

## M10.3 paired portraits — local review pending2026-11-02
Twenty ordered top-two subtypes implemented in isolated codex/m10.3-portraits, base3afc3ab; uncommitted/unpushed, no merge/deploy. Both readable and >=existing0.5, existing ties/fallbacks/pentagon/personal reading/Levers unchanged. All20 supplied SVGs inspected72/48px; subtitle copy explicitly describes answer patterns.25 unit +6 desktop/mobile browser checks, build/types/domain/affected lint pass; two labeled Golden-derived examples and preview3103 ready. EXECUTION_PLAN holds exact source reconciliation, evidence, limitations and measured19m03 v2 (prior68m21 separately retained; combined87m24). No new AI calls/dependencies/scoring/tagging or other worktree changes. Implementation acceptance remains pending owner visual review; v1 acceptance remains historical.

## M10.3 paired subtype implementation — authorized2026-11-02
Live F1 and ID-resolved M10.3 row56/notes and standing protocol loaded. Start11:02:30+07. Owner authorizes20 ordered strongest+second-strongest pairs, both readable and >=existing0.5 floor, existing ties, unchanged single/Explorer/in-progress fallback. Preserve pentagon/personal reading/next Lever, no scoring/tagging/dependencies/dark theme/AI calls. Supplied handoff is reference only; owner supersedes stale TBD floor, bars, and copy restrictions that conflict with accepted personal reading. Existing v1 remains accepted/published3afc3ab; v2 acceptance pending visual review. Clean isolated codex/m10.3-portraits; other worktrees/servers untouched. Estimate60–90m implementation/assets/records +45–60m focused verification=105–150m (1h45–2h30), moderate confidence; supplied20 assets/pairs reduce prior3–5h plan. Coding-token forecast/actual unavailable. Prior v1 measured68m21 retained separately; weekend/review gap and previous read-only ZIP audit not measured. Approved focused extensions in existing scoring.test.ts and assessment.spec.ts:20 lookup/order/ties/coverage/floor/fallback/accessibility; existing Golden fixtures reused and clearly identified review examples. No commit/push/merge/deploy. New preview uses own available3103, browser checks3203; port checks show both free. Prior workflow correction: inspect labels/version metadata before final build.
## M10.3 accepted — publication authorized2026-10-30
Owner accepts current pentagon, fixed contextual reading, Why this archetype disclosure, and supplied secondary/tertiary icon hierarchy; authorizes scoped commit/push and Build Checklist completion. No merge/deployment. Prototype ed42a35 plus these accepted refinements remain on codex/m10.3-portraits. Live F1 and ID-resolved M10.3 row56/notes loaded; standing protocol loaded. Publication session start16:57:38+07; initial read before clock unmeasured. Estimate records/Git2–3m +publication/checklist verification1–2m=3–5m, moderate confidence using prior scoped-publication procedure. Prior66m09 measured retained once; coding-token forecast/actual unavailable. No test rerun for unchanged accepted candidate; retained31 affected unit,2 desktop/mobile browser, build/types/domain/affected lint evidence and limitations. Exact staged scope reviewed; no credentials, saved business answers, ignored logs or unrelated work included. No new provider calls. Final SHA, remote verification and effort checkpoint supplied to existing checklist/handoff after push; no major later milestone starts.

Archetypes v2.0 planning only: owner must choose ordered strongest+second-strongest or strongest+weakest among five readable families, selecting two DISTINCT families (5x4=20). Recommend top-two identity with weakest family retained separately as next approach: explains what distinguishes the business without making its weakest area its identity. Pair order matters. Claude must provide20 stable pair IDs/names, short descriptors/readings, primary SVG artwork and small variants consistent with current lexicon, plus Explorer/in-progress and any primary-only fallback treatment. Pair qualification, tied/near-tied families, low or unreadable secondary, and same-family extreme ties require approved rules before implementation; do not invent new separation thresholds. Current0.5 floor/readability/exclusions and sustainability scoring remain unless explicitly changed. Top-two second place may be weak in absolute terms; a minimum-strength requirement or relative-language/fallback policy needs owner choice. Weakest means weakest READABLE evidence, never skipped/unassessed. Keep exact family values/coverage available and version assignment/template/artwork separately. Reuse161-row v0.2 mapping if bank unchanged; no re-tagging API batch needed. Bounded validation should exercise20 ordered pair lookups, swaps/ties/unknowns/fallbacks plus existing Golden and desktop/mobile accessibility—not tune to illustrative names. New assertions require approval at implementation boundary. AI-generated richer readings are separate from20-way assignment: current agent contribution remains matching leading action title only; no new calls/schema/generation authorized. Estimated implementation/asset wiring/records2–3h +focused verification1–2h=3–5h after approved rules and complete artwork/copy; provisional, moderate-low confidence, excludes Claude delivery/reviews/generative expansion. No v2 work begun.
## M10.3 owner checkpoint and UI continuation — 2026-10-30
Owner confirms Explorer then Anchor60%/5-of-9 in local fictional SME review; extra People answer was intentional. Authorizes commit of reviewed prototype, then UI refinement: archetype meaning plus SME explanation, five-axis pentagon with shaded answer-credit shape, compact hierarchy and expandable provenance. No scoring/mapping changes or new calls. Commit only, no push/merge/deploy. Live F1/M10.3 row56 and standing protocol loaded. Session start16:05:53+07; initial read seconds before timestamp unmeasured. Estimate implementation/records15–25m +verification5–10m=20–35m, moderate confidence, narrower than prior33m14 prototype continuation due component reuse. Coding-token forecast/actual unavailable. Prior41m22 measured retained separately; owner-review pause boundaries unmeasured. Existing approved checks reusable; focused chart assertions requested separately. Previous HTML-semantics correction applied during initial composition. UI refinement remains uncommitted for review after prototype checkpoint.
## M10.3 current authority — owner2026-10-30
Phase A completion and bounded Phase B authorized in isolated codex/m10.3-portraits worktree. v5.3 and explicit beta decisions control; see EXECUTION_PLAN.md M10.3 record. No scoring/questionnaire/maturity/admin changes, merge or deployment. Tagging spend and genuinely new assertions await separate requested approval. Preserve prior records and concurrent Laiffi work. Live M10.3 found by ID at row56; F1 read, never overwritten. Current M5 crosswalk in live F1: M5.2 live clarification prototype; M5.3 interaction/architecture; M5.4 mapping/calculation; M5.5 full chat; M5.6 uploads; M5.7 release. This is reference only; no other milestone execution authorized here.

M7.5 publication authorization — owner2026-10-28: commit/push the reviewed mobile navigation and associated UI/test/record changes; minor UI polish deferred. This supersedes historical uncommitted/pending-publication wording below. No deployment or next-step authorization. Existing verification evidence retained without rerun; publication SHA supplied in handoff/checklist. Broader native-device limitations remain recorded.

M7.5 popout correction verified locally2026-10-28: mobile five-question panel follows the explored marker/thumb, with inspected row aligned near that position and panel clamped to viewport. Explored row is light green; actual current question retains its distinct marker. Redundant Jump dropdown removed; rail keyboard/touch navigation retained. Pressed feedback preserved. Desktop/data/scoring unchanged. Local build CjqGuNSBVBmhDYjraOi-B HTTP200/served identity confirmed, PID23152. Owner/native Samsung review pending. Uncommitted on codex/m7.4-assessment-ui base4346afa; no deployment/provider calls. Current live checklist M7.5 is row43 (rows shifted; earlier row42 references historical).

M7.5 mobile owner correction verified locally2026-10-28: press/drag explores magnified neighborhoods with pointer capture; tap maps to actual visible marker centers, drag to stable slots; no click-time remapping. Mobile-only grid/fieldset minimum-width constraints prevent intrinsic content expansion beneath the rail. Desktop scales/layout unchanged. Build7i4M9LY1SzrFP91S-tT8T HTTP200/served identity verified at localhost3000, PID40352.10 affected browser checks pass1.5min; build/types/affected lint pass. Uncommitted on codex/m7.4-assessment-ui base4346afa; no deployment/provider calls, owner/native-device acceptance pending.

## M7.5 local audit ready for owner review — 2026-10-28
Accepted M7.4 base4346afa retained on codex/m7.4-assessment-ui. One demonstrated phone-only correction:6rem scroll clearance below two-line sticky stage navigation prevents enlarged-text question-heading occlusion; desktop behavior and auto-advance unchanged. Local build0rjOCStW9NV4jQUggwK_y, HTTP200/served identity verified, PID34692. Changes uncommitted/unpushed; no deployment or paid calls. Owner acceptance and native-device verification pending; no later milestone started.

## M7.5 mobile usability — started 2026-10-28
Live Build Checklist F1 and row42 including notes loaded. Owner authorizes M7.5 only, prioritizing questionnaire readability and categorical auto-advance; preserve accepted desktop behavior. Branch codex/m7.4-assessment-ui includes4346afa102c707050727880d59342f6e64704f52; initial tree clean. No deployment, paid calls or subsequent milestone. Historical no-M7.5 text below is superseded only by this authorization.

## M7.4 accepted and complete — owner 2026-10-28
Owner accepted the final local assessment UI: responsive cards, compact header/help, missing-only review, taller rail, moderate bubble magnification, attached orange current brackets and corrected endpoint spacing. This supersedes historical pending-review states below. Scoped commit/push on codex/m7.4-assessment-ui is authorized; no deployment or M7.5. Preserve prior evidence and unrelated work. This acceptance checkpoint contains the nine scoped UI/test/control files; publication SHA is recorded in Build Checklist row41 and the handoff after push.

M7.4 endpoint spacing corrected2026-10-28: desktop edge damping removed, so first/last neighbors use the same spread distances as middle. Sizes3/2.5/2/1.5/1 and attached brackets unchanged; mobile already undamped. Local build w8konXQ28RQ0lya2aJFCK HTTP200/served identity verified, PID19696.2 existing affected browser checks pass19.6s; build/type/affected lint pass. Uncommitted codex/m7.4-assessment-ui base2ccfca2, no paid calls/deployment; owner review pending.

M7.4 owner clarification locally verified2026-10-28: current brackets share bubble transform (move/scale together); size increases halved from original, giving300/250/200/150/100% normal size. Status dots/dashes and hit targets preserved. Build iqP8lE3bDVEqbXAoKDnx3 served localhost3000 HTTP200/identity verified, PID612.5 affected browser checks pass55.1s; build/TypeScript/affected lint pass. Uncommitted codex/m7.4-assessment-ui base2ccfca2, no deployment/paid calls; owner review pending.

M7.4 original ballooning restored2026-10-28 at owner direction, superseding reduced-scale record below: exact a66c3ca5/4/3/2/1 size formula plus original spread/origin restored; orange brackets remain independently unscaled. Local build kla-zKu6DnJFVWr8cEHUI HTTP200/served identity verified, PID8036.5 affected browser checks pass56.7s; build/TypeScript/affected lint pass. Uncommitted codex/m7.4-assessment-ui base2ccfca2, no deployment/paid calls, owner review pending.

M7.4 gentle hover restored2026-10-28: hovered120%, immediate neighbors115%, next pair105%, others100%. Fixed orange brackets/hit slots, no vertical spreading; existing nearby-question panel, keyboard and reduced-motion behavior preserved. Local build vlVVzsi-ZY6Dh10TKNXGf at localhost3000 HTTP200/served identity verified.5 affected browser checks pass57.8s, build/TypeScript and affected lint pass. Uncommitted codex/m7.4-assessment-ui base2ccfca2; no paid calls/deployment; owner review pending.

M7.4 owner-review corrections locally verified2026-10-28; acceptance pending. Natural-height responsive question cards and readable type, non-overlapping answer actions, compact About this assessment disclosure below stages, toolbar count/help, concise mobile jump control, and fixed orange brackets around unchanged status dots/dashes. Marker magnification removed; existing nearby-question panel/keyboard navigation retained. Build r8eBNBs6_B5j7CfCa2gMj at http://localhost:3000/assessment, served identity/HTTP200 verified. All changes remain unstaged/uncommitted on codex/m7.4-assessment-ui base2ccfca2; no providers/deployment.

M7.4 locally implemented/verified2026-10-28, owner review pending. Branch codex/m7.4-assessment-ui from2ccfca2; changes unstaged/uncommitted/unpushed. Orange secondary accents, skipped/unanswered-only review with direct jumps, and full-stage question rail with persistent diamond/number marker. Existing scores, answers, calculator, Levers and provider behavior unchanged. Localhost3000 build ZlWQ4KQTq26v5ywomZbcg HTTP200/served identity verified. No paid calls/deployment; M7.5 remains separate.

## M7.4 — assessment UI start / owner authorization 2026-10-28
Standing protocol and live Build Checklist v2.0 F1 plus row41 values/notes loaded; row42 identifies separate M7.5 mobile audit. Latest owner instruction authorizes M7.4 only on a new UI branch. M7.3 already accepted, committed and pushed: implementation a66c3ca, release records2ccfca2; remote milestone-7-sliders verified at2ccfca2bbb3fd471850fc9f936116e5985771b7d. Clean starting working tree; no duplicate commit required. New local branch codex/m7.4-assessment-ui starts at that checkpoint; preserved M5/sliders branches and unrelated original checkout.
Scope: coherent orange secondary/action accent; skipped/unanswered-only review with direct question navigation and distinct existing statuses; taller readable desktop/mobile rail, move answered count/help outside its allocation, persistent orange current marker plus non-color cue and keyboard access. Preserve accepted layout outside these adjustments, answers, scoring, calculator, Levers and provider behavior. Reuse existing skipped state, review/jump actions and navigation components. M7.5 broad mobile audit, M10 polish, M12 reports, M5/M6 remain separate; no paid calls or deployment.
Effort: first audit timestamp not measured; first recorded timestamp2026-10-28T11:20:29+07:00 (initial reading before this is not measured). Estimate implementation including audit/records20–35min +affected verification10–20min =30–55min combined, moderate confidence. Calibrated against M7.2 review correction25m38: this reuses existing state/scoring and adds bounded rail/filter presentation, while desktop/mobile viewport work may require iteration. Coding-token forecast and actual telemetry unavailable; active/wait split not measured. No retrospective reconstruction. End/elapsed/variance recorded once at completion, not yet complete. Prior deployment LF correction is not applicable to this local UI step.
Verification plan: reuse approved assessment browser checks and saved typecheck/lint/build as affected; inspect desktop/mobile at100% zoom. Audit existing assertions before changing tests; obtain authorization for genuinely new assertions. No tests run at this planning checkpoint. No runtime implementation yet: scope/estimate presented to owner before implementation. M7.4 records remain uncommitted; new branch not pushed, no PR/merge.
Current2026-10-27: M7.3 accepted/complete. Accepted M7 Levers implementation a66c3ca pushed and live at https://preview.flowagentai.website, release mosaic-a7a30a44c5bc64d35aac; non-generating HTTPS/build/budget verification passed. USD1/day and saved data preserved. No main merge; M7.4 deferred until tomorrow, not started. Full deployment/effort evidence in EXECUTION_PLAN.md.

Owner acceptance2026-10-27: M7.3 accepted and complete with documented limitations/deferred polish. Owner now authorizes scoped commit/push and deployment of accepted M7 Levers to the existing clean MOSAIC server. Supersedes earlier no-commit/no-deployment wording for this release only. M7.4 deferred until tomorrow; no implementation now. Release session start2026-10-27T21:19:10+07; estimate commit/package3–5min +server build/verification5–7min =8–12min total, based on prior M4 deployment9m47. Coding-token forecast/telemetry unavailable. Preserve saved data, credentials and USD1/day Bangkok budget; no paid generation tests. Existing passing evidence reused.

Current2026-10-27: M7.3 technical review complete, ready for owner acceptance; M7.1/M7.2 already accepted. Existing evidence satisfies bounded Levers requirements; no scoring/config changes or test reruns needed. Deferred M10 cosmetics and M12 reports remain separate. M7.4 not started. Work remains local/uncommitted on milestone-7-sliders basefb9206e; no deployment or publication. Detailed review/effort in EXECUTION_PLAN.md.

Current owner acceptance2026-10-26: M7.2 accepted/DONE locally; cosmetics deferred to M10.1/M10.2 pending Guo review. M12.1 is the final report presentation and multi-format export milestone, planned only. M7.3 remains a separate gate. No publication/deployment or later implementation in this closeout.

Current M7 status2026-10-26: M7.1 accepted/published fb9206e; M7.2 personalized levers with owner-authorized compact sticky feedback and scenario-report appendix ready for local review, uncommitted, not deployed. Existing-engine ranking and combined scenarios preserve actual answers; unbounded numeric cases excluded without methodology changes. Verification/effort and local walkthrough in EXECUTION_PLAN.md. M7.3 does not start automatically.

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

Current2026-10-26: M4.4 accepted/complete, published f9229a1. M4.5 direct manual/calculator-to-score and U-026 total-energy checks passed; owner review pending, tests/records uncommitted. Existing evidence reused; no runtime correction, deployment, paid calls or later-step work. Country-specific recommendation tailoring deferred; historical-factor and benchmark limitations remain.

## Current acceptance — owner 2026-10-26
M4.4 accepted and complete. Owner authorizes committing/pushing the scoped calculator mapping/autofill, confirmed transfer/start, source/input usability, Country selection/eligibility and Country metadata propagation plus records. This supersedes historical M4.4 pending/no-M4.5 wording below; retain all prior evidence and limitations. M4.5 is next and authorized only for the complete manual/calculator → questionnaire → deterministic score verification, reusing passing evidence and checking remaining gaps. Country-specific recommendation tailoring/retrieval changes remain deferred. Historical factors remain reference-only; U-026 total-energy transfer does not resolve inherited electricity benchmark wording; Scope3 excluded. No deployment, merge, Laiffi, slider or later-step work authorized. Preserve unrelated deployment/incident/skill files.

M4.4 owner2026-10-25: replace free-text Country entry with preloaded worldwide searchable dropdown and bounded input validation; retain region, saved data, China-only calculator support and Country-to-LLM context. No wider scope or deployment.

M4.4 current owner authorization2026-10-25: Country restoration is now authorized (supersedes earlier proposal-only wording); keep region and question selection/scoring unchanged. China-only calculator eligibility is explicit configuration, enforced at entry/transfer; preserve entries and independent manual edits. Use selected values and start questionnaire is the single Calculator action, validated and saved before navigation; Manual retains Start. Unique geography factor automatic, optional facility, collapsible source cards and actionable numeric errors are within this correction. U-026 total-energy mapping remains authorized; benchmark electricity wording unresolved. No commit/deployment/M4.5; owner acceptance pending.

M4.4 owner clarification2026-10-25: U-026 transfer is authorized from renewable TOTAL-energy share, with explicit confirmation and existing coverage/unknown handling. Inherited benchmark electricity wording remains unresolved for Alan/Henry; scoring/config unchanged. Earlier U-026-pending statements below are historical. Owner review corrections underway, no acceptance or M4.5/deployment.

Current authorization — owner2026-10-25: resume M4.4 calculator metric mapping/autofill only. Live checklist F1 and row24 read; M4.3 is accepted and deployed. Preserve existing work, scoring/config and historical-factor limitations; U-026 pending, Scope3 excluded. Complete local review, leave changes uncommitted; no deployment or M4.5. Next sequence: M4.5, separately scoped Laiffi assessment, slider demonstration, recorded UI follow-up. This supersedes historical no-M4.4/status wording below.

# BUILD_PLAN.md

Owner acceptance - 2026-10-23: M4.3 accepted as delivered, including deployed-layout preservation, The Pieces that Matter headline, corrected acronym, compact full-pane video with captions/controls, MOSAIC home navigation and shared assessment/calculator/Results palette. Record scoped commit/push on milestone-4-branding-video; no deployment, merge or M4.4 authorized. This supersedes earlier pending-acceptance wording; historical evidence and affiliation limitations remain. The separately reported AI-generation failure is unresolved and does not alter this branding acceptance.

Latest M4.3 authorization2026-10-22: apply supplied brand colors across assessment, calculator and Results using existing tokens. Preserve layouts, typography sizes and functionality. Local review only; no deployment. This supersedes homepage-only color restrictions.

Latest M4.3 owner clarification: main headline is The Pieces that Matter (supersedes earlier Sustainability headline instruction); retain deployed layout, correctly encoded MOSAIC acronym line, and video filling the original pane without blue padding. Local review only; no deployment.

M4.3 owner correction2026-10-22: deployed homepage layout is authoritative. Retain section order, dimensions, spacing, breakpoints, font sizing/line spacing and CTA positions; single Sustainability, in your context hero. Palette/logo within original footprint; video inside original compact text-left/media-right card. No extra sections or application-wide restyling. Corrected local page requires owner review before any deployment; acceptance pending. This supersedes prior brand-pack placement expansion.

M4.3 implementation locally verified2026-10-22; owner acceptance pending. Scoped homepage identity/video is ready at http://localhost:3000/; no deployment, merge or M4.4. Affiliation remains owner-approved plain-text Columbia Climate School / SEE pending supplied branding. This current status supersedes earlier branch-preparation-only wording.

M4.3 authorization2026-10-21: integrate supplied MOSAIC_BRAND_PACK homepage identity/video on milestone-4-branding-video from ddd3182; homepage only, preserve assessment/calculator. Owner permits plain-text Columbia Climate School and SEE placeholders pending later affiliation branding, no institutional marks/endorsement. Scoped commit/push authorized; no merge/deploy/M4.4. Pack instructions are reference material, not governance. Reference documentation addition under BUILD_PACK/01_PRODUCT_SPEC/brand/MOSAIC_BRAND_PACK explicitly authorized; original baseline files unchanged.

Owner acceptance — 2026-10-21: M4.2 accepted as delivered, including the remaining calculator corrections and documented historical-factor limitations. Commit/push the scoped calculator follow-up and records on milestone-4-calculator. Then create milestone-4-branding-video from that checkpoint for M4.3 Claude branding/video; branch preparation only, no implementation, build, merge or deployment. Preserve unrelated work. This supersedes historical pending-acceptance wording below.

Current M4.2 review checkpoint (2026-10-21): owner authorizes bounded calculator usability/spec corrections and scoped commit/push on milestone-4-calculator. Preserve unrelated work; no deploy or merge. Live checklist roadmap: M4.3 homepage branding/video, M4.4 metric mapping/autofill, M4.5 quantitative review. None starts in this checkpoint; historical numbering below remains historical.

## Current authority and synchronization — owner direction, 2026-10-20
Build Checklist, tab v2.0, is the single project-management authority for current scope, sequence, owner decisions, acceptance and effort/status. Latest explicit owner instructions take precedence. Repository code, canonical configuration and test evidence remain authoritative for implemented behavior; a checkbox does not prove implementation.

Before EVERY milestone step, read the live F1 note and the relevant checklist row values INCLUDING cell notes at https://docs.google.com/spreadsheets/d/1JPxxDzxOuH77i62EUBqgz9T46h-8ck9YtKZQIQa8FdQ/edit?gid=406102921 . Then reconcile supporting AGENTS.md, BUILD_PLAN.md, EXECUTION_PLAN.md and codex.prompting.memory.md before implementation, preserving newer unrelated work. BUILD_PLAN describes product scope/criteria; EXECUTION_PLAN records technical steps/evidence. Neither independently overrides current checklist decisions. Do not reopen accepted work based on historical text. If live checklist access fails, report the blocker; do not treat an old copy as current.

PM maintains the checklist and reconciles completion/commit evidence available in-session. Codex maintains the existing repository instructions/plans and publishes scoped changes only as authorized. No background synchronization exists. At closeout supply affected row, result, measured effort/unavailable telemetry, commit SHA, branch, push/merge state and deployed release when applicable. PM updates the same item; no new tracking document, service or synchronization tooling.

Current disposition (owner2026-10-21): M3 accepted; M4.0 evaluation complete; M4.1 accepted as the reference specification and fixture package with documented limitations. M4.2 accepted by the owner on2026-10-21; verified evidence and limitations retained. Historical factors are not production-approved or globally applicable; U-026 autofill pending; Scope3 excluded. Quality tooling/refactoring remains optional final pre-shipping QA on a separate branch. M4.1 is published; the owner now authorizes committing/pushing only scoped M4.2 calculator work and its records on milestone-4-calculator. No merge or deployment authorized. This supersedes conflicting historical status text below.

M4.2 local delivery checkpoint2026-10-21: calculator engine and existing Data Input stage integration implemented and locally verified; owner review pending. Historical factors remain reference-only, U-026 pending, Scope3 excluded. No M4.4 autofill, deployment or milestone advancement; scoped M4.2 checkpoint authorized. See EXECUTION_PLAN.md for evidence and effort.

## Standing delivery-effort protocol — owner direction, 2026-10-21

Use live F1 and the reconciled protocol in AGENTS.md / EXECUTION_PLAN.md / codex.prompting.memory.md for every milestone step. Forecast implementation and verification separately, state their non-overlapping combined total, and measure elapsed delivery across sessions including reading and closeout. Record approval/overnight pauses separately; elapsed is not active time. Calibrate against comparable work (M4.1:27m33s overall, including the10-minute final continuation versus30–60-minute forecast), accounting for scope differences rather than a blanket multiplier. Preserve historical measurements and unavailable coding tokens; record one closing comparison and at most one correction. Historical active-time forecast wording below is evidence, not current guidance. No tools/tests/UI layout are approved by this correction.

## Historical delivery direction — superseded by current authority above

## Current delivery direction — 2026-10-19

Latest owner scope correction (2026-10-20): M4.0 is a focused tool check: Knip and Prettier first, then dependency-cruiser incremental value. No installs or refactoring; custom baseline/performance work is withdrawn. This supersedes broader M4.0 descriptions below. Maintainability and delivery-efficiency directive is recorded in AGENTS.md.

Current authorization update (2026-10-20): owner authorized **M4.0 only**, starting with repository/checklist audit and effort estimate; exact new tool/measurement commands require approval before execution. M3 remains accepted. Merge, M4.1 onward and deployment are not authorized by this step. Preserve existing changes; leave new work uncommitted. This supersedes older text describing all of M4 as unapproved.

Latest checkpoint (2026-10-20 Asia/Bangkok): **Milestone 3 COMPLETE — explicitly accepted by the owner on 2026-10-20**, as delivered at https://preview.flowagentai.website, revision `mosaic-a547751983d355dacd22`, prompt contract v7. Acceptance includes the disclosed v7 offline-only verification and deferred issues; it does not establish a new v7 live-generation result or resolve broader grounding, historical score-comparison or operational evidence limitations. Implementation checkpoint `fe20fa6` is on `milestone-3-recommendations`. This acceptance record remains uncommitted. Merge and M4 require separate owner approval; no additional implementation, provider call or deployment is authorized by acceptance. Public $1/day Bangkok budget and exhausted separate agent verification allowance remain unchanged. See EXECUTION_PLAN.md current state for the acceptance record and preserved evidence.

Complete M3 as the normal publicly accessible assessment on the existing clean host: real scoring, real OpenAI recommendations, required durable report, no synthetic substitute or unrequested login. Synthetic UI demonstrations require explicit approval. M3 acceptance remains human-owned. Framework/model/retrieval research is deferred from this closeout; retain it as backlog, not a release blocker. Follow the saved test register and effort-reporting policy in `codex.prompting.memory.md`. Historical narrower authorizations below are superseded only where this current owner direction conflicts.

Before M4.1, complete M4.0: evaluate deterministic quality tools, record a baseline, refactor only if justified, and repeat identical measurements with functionality preserved. M4.0 is planned, not permission to interrupt M3.



## Purpose

This document defines the major build milestones and human review gates for Capstone v2.

The project owner decides when a milestone is complete and when the build may advance.

Implementation agents may propose substeps and implementation approaches within a milestone, but may not silently advance to the next milestone.

The intended workflow is:

> **Build → test → inspect → understand → redirect if necessary → continue.**

This is not a one-prompt autonomous build.

---

# Milestone 1 — Product shell and assessment entry

## Goal

Create the two-surface product shell and a usable entry into the assessment without over-investing in visual polish before the core engine is proven.

## Expected outcomes

### Public/context page
- client problem / product context;
- About / approach section;
- video placeholder;
- research / verification section;
- clear CTA such as **Take the Assessment**.

### Assessment entry
- launch the dedicated full-page assessment flow;
- collect SME metadata/context;
- preserve session state;
- let the user choose the approved quantitative-data input method;
- route into the vertical single-focus questionnaire experience;
- preserve skip/revisit behavior and visible unanswered-question state.

The detailed interaction and visual rules are defined in `BUILD_PACK/01_PRODUCT_SPEC/UI_BRAND_GUIDE.md`. Agents may improve implementation details, but should not silently replace the defined full-page questionnaire interaction model with a modal, long static form, or materially different flow.

## Review gate

Stop and show:
- page structure;
- assessment-entry flow;
- conformance with `UI_BRAND_GUIDE.md`, including landing, assessment setup, representative question card, progress navigation, category transition, and results shell;
- selected fonts/design tokens/motion treatment and reduced-motion behavior;
- major UX assumptions or proposed deviations;
- selected stack / implementation approach if not previously approved;
- where future authentication, billing, document/evidence processing, knowledge-base ingestion, provider replacement, and deployment/environment configuration would attach without reconstructing the deterministic assessment core;
- the selected cross-cutting architecture patterns (state, persistence, validation, API/error boundaries) that later milestones should follow unless a reviewed change is approved.

Do not implement deferred commercial/stretch features merely to prove extensibility.

Do not spend significant time on visual polish before Milestone 2 is proven.

---

# Milestone 2 — Deterministic assessment core and Golden parity

## Goal

Reproduce the core config-driven Capstone assessment behavior independently of the legacy Appsmith/n8n implementation.

## Expected outcomes

The new system can:
- load the canonical configuration;
- keep canonical config entities conceptually distinct;
- select the correct questions from SME metadata/context;
- preserve question ordering;
- normalize answers deterministically;
- resolve metric benchmarks;
- apply base weights;
- apply contextual multiplier rules;
- apply category weights;
- calculate category scores;
- calculate raw overall score;
- calculate industry-weighted overall score;
- display basic score/category visualizations comparable to v1.

## Required verification

Golden Cases must verify:
- selected question IDs/order match;
- answer normalization matches;
- base weights match;
- multiplier application matches;
- category weights match;
- category scores match;
- final raw and weighted scores match at the defined canonical precision;
- intermediate calculation traces identify the first divergent stage when a v1/v2 result differs.

Before approving Milestone 2, document the numeric policy:
- preserve source/config precision;
- do not round intermediate calculations unless the methodology explicitly requires it;
- keep presentation rounding separate from calculation values;
- define any comparison tolerances explicitly and justify them;
- do not widen tolerances merely to make Golden Tests pass.

Also verify:
- answers do not silently disappear during navigation or focus changes;
- current config values are not hard-coded as permanent engine constraints;
- known v1 defects are not preserved merely for parity.

## Review gate

Stop and show:
- Golden Test results;
- any deviations from v1;
- any config/schema changes;
- representative computed output;
- performance observations;
- any methodology issue discovered.

The deterministic core must be approved before recommendation logic becomes authoritative.

---

# Milestone 3 — Recommendations, results, and durable report

## Goal

Layer grounded recommendations and a usable results experience onto the proven deterministic core.

## Expected outcomes

Results should include, as appropriate:
- overall score(s);
- category scores;
- question-level answers/scores;
- visual score/category display;
- key gaps;
- prioritized recommendations;
- supporting evidence/sources;
- clearer, more readable results than v1.

The user can download/save a durable report, at minimum as PDF or equivalent.

The report should include:
- SME profile/context;
- question-by-question answers;
- question scores;
- category scores;
- overall scores;
- key gaps;
- recommendations;
- relevant supporting evidence/sources.

## Recommendation quality checks

Recommendation regression should verify:
- no contradiction of deterministic scores;
- no invented source/evidence;
- major gaps remain materially aligned with the SME's weak areas;
- recommendations remain relevant to profile/context;
- output schema is valid;
- any numeric score repeated in prose exactly matches authoritative deterministic computation.

Exact prose matching is not required.

## Performance

Aim for approximately **10 seconds or less** under normal test conditions where practical.

## Failure behavior

If the recommendation model fails or times out:
- deterministic assessment results must still load;
- charts/scores/report generation must still work;
- the system may present deterministic **priority gaps** based on the lowest relevant question/category scores;
- do not label these as AI recommendations unless a deterministic remediation mapping exists.

If later desired, fixed/config-driven remediation guidance can be attached to low-scoring questions/categories as a non-AI fallback.

## Review gate

Show:
- Golden recommendation comparisons;
- latency measurements;
- failure behavior;
- PDF/report output;
- external API dependencies.

---

# Milestone 4 — Emissions calculator and quantitative input flow

## Goal

Integrate the emissions calculator as a practical assessment input-resolution capability.

## Expected user choices

The user can choose to:
- manually enter known emissions / water / energy / related quantitative data;
- use the emissions calculator;
- later, if approved, upload utility bills/evidence for assisted extraction.

## Current-scope requirements

- calculator inputs resolve to canonical metrics;
- values map through stable `metric_id` or equivalent identity;
- resolved values can autofill relevant assessment fields;
- the same value is not requested twice unnecessarily;
- units/provenance remain explicit;
- user can inspect/correct relevant values;
- missing data is not silently treated as zero;
- calculator logic remains separate from scoring semantics.

## Stretch within this area

Utility-bill/evidence upload may use GenAI to:
- interpret source documents;
- identify candidate inputs;
- report missing/ambiguous information;
- ask clarifying questions;
- populate calculator fields behind the scenes.

User confirmation is required before extracted values affect deterministic scoring.

## Review gate

Demonstrate at least one full flow:

`SME setup → calculator/manual data → resolved metric → questionnaire autofill → deterministic score`.

---

# Milestone 5 — Guided data entry: chat/upload with Laiffi where suitable

M5.1: feasibility and architecture only, using the revised owner-supplied proposal and current code. Standalone third Data Input path; gather confirmed facts, obtain compatible factors where needed, calculate deterministically, show pertinent proposed answers, confirm, then questionnaire. Preserve the independent calculator without exposing its source cards/totals in this experience. Assess units, geography, periods, Scope1/2 boundaries, terms, retention, attribution, costs/quota and smallest useful implementation. No metric/scoring/benchmark change. Optional one-activity POC requires a concrete separate allowance. M5.2 chat and M5.3 uploads/review remain planned, not automatically authorized. See current EXECUTION_PLAN assessment and live rows26–28.

# Milestone 6 — Basic config and knowledge-base maintenance (formerly M5)
## CURRENT / REQUIRED

## Goal

Allow authorized Climate School maintainers to perform routine updates to approved configuration and source/knowledge-base documents without editing application source code.

## Expected outcomes

An authorized maintainer can:
- replace/update approved canonical config datasets;
- update source/knowledge-base documents;
- validate changed configuration before activation;
- identify/select the live configuration version;
- retain the original Capstone configuration as a permanent fallback.

Routine maintenance must not require editing application source code. The canonical configuration entities remain conceptually distinct.

Automated source-document processing that regenerates configuration is a separate approval-gated capability in Milestone 5A.

## Review gate

Show:
- an approved config/source update through the maintenance flow;
- validation before activation;
- live-version identification/selection;
- fallback to the original Capstone configuration.

---

# Milestone 6A — Automated source-document to config regeneration (formerly M5A)
## NEEDS EXPLICIT APPROVAL BEFORE IMPLEMENTATION

## Goal

Allow future Climate School maintainers to refresh the application's knowledge base and derived configuration without repeating the original Capstone process manually.

## Functional intent

An authorized admin can:
- upload/add new source documents or standards;
- select which source set should be processed;
- initiate the preserved Capstone transformation sequence with a single action;
- review generated outputs before they become live;
- select/publish an approved configuration version;
- retain the original Capstone configuration as a permanent fallback.

## Processing sequence

The automated workflow should preserve the original Capstone prompt order and methodological sequence as closely as practicable, including:
- document indexing;
- document chunking;
- AtomicIndicator extraction;
- AtomicIndicator normalization/transformation;
- clustering/frequency/context processing;
- base-weight generation;
- MultiplierRules generation;
- CategoryWeights generation;
- QuestionBank generation/refinement;
- related retrieval/config outputs.

The exact implementation/orchestration may improve for reliability and speed.

However:
- semantic changes to the preserved prompts/method require human approval;
- implementation-level formatting/schema changes are allowed where needed for reliable automation;
- generated config must be validated before publication;
- the existing Capstone baseline must remain available as a permanent rollback/fallback.

This workflow is a maintenance process, not an interactive runtime path, and **does not need to meet the ~10-second recommendation target**.

## Review gate

Before implementation:
- confirm this milestone is within approved research scope/IP boundary.

After implementation:
- demonstrate processing of a small test source set;
- show generated artifacts;
- show validation;
- show version selection/publish;
- show rollback to the Capstone baseline.

---

# Milestone 7 — Interactive levers (formerly M6)
## STRETCH

## Goal

Let the user explore how plausible operational improvements could affect assessment outcomes.

## Expected behavior

- recommendation prose may explain opportunities but does not define mappings, bounds or scoring; deterministic counterfactual comparison selects opportunities;
- eligible opportunities are mapped to known manipulable canonical metrics;
- owner correction2026-10-26: standalone Results section Explore your improvement levers selects up to4–5 answered/scored opportunities by attainable industry-weighted score gain, using the existing engine and fixed remaining answers/context; unanswered and zero-gain questions are not levers;
- the user can adjust those values;
- relevant what-if scores/metrics update immediately through one combined scenario recomputation, without changing actual answers; selected levers stay stable and Reset to actual answers restores baseline. M7.1 revised specification, interaction details, unresolved numeric precision/bounds and Golden worked example are in EXECUTION_PLAN.md; owner accepted M7.1 on2026-10-26 and authorized M7.2 locally. Percentage controls step1 point with finer numeric entry and exact reset; binary/categorical controls retain existing options; numeric cases without finite defensible optimum/range are excluded without method changes. No deployment.

Only metrics with a defined deterministic relationship to scoring should become levers.

Accepted M7.1 design: the deterministic engine selects and ranks eligible levers. Recommendation prose may provide context but does not select levers or define scoring relationships. This supersedes the historical proposal for model-assisted selection.

## Review gate

Show:
- why each lever was selected;
- its canonical metric mapping;
- baseline vs what-if score;
- no hidden change to scoring methodology.

---

# Milestone 8 — Quick vs Full assessment (formerly M7)
## STRETCH / METHODOLOGY REVIEW

## Goal

Explore whether a shorter assessment can provide useful screening value without misleading users about comparability.

Do not implement until the scoring/comparability method is explicitly approved.

Potential models include:
- distinct screening score;
- core-question-only score;
- statistically calibrated approximation;
- another reviewed method.

Do not simply remove questions and reuse the same score label.

## Review gate

Methodology proposal must be approved before coding.

---

# Milestone 9 — Alan/Henry external benchmark layer (formerly M8)
## RESEARCH EXPERIMENT

## Goal

Explore whether Alan/Henry's large-company China/HKEX/EU research can provide useful external context without altering the core SME score.

Potential uses include:
- peer/external benchmark display;
- contextual recommendation evidence;
- research/verification-page comparisons;
- reporting-frequency comparisons.

Do not:
- mix these data into the core SME score by default;
- alter core weights from this dataset without explicit methodological approval;
- present large-company observations as direct SME peer truth.

## Review gate

Show exactly what the source data supports before deciding how it appears in the product.

---

# Milestone 12 — Final report presentation and multi-format downloads
## M12.1 — Planned, not started
Owner2026-10-26 requests a final Report milestone. Planned only, not started: improve report color, MOSAIC branding, readable formatting/hierarchy and page layout; provide several downloadable formats (exact set to be selected when scoped). Preserve authoritative actual scores/answers, evidence/limitations and separately labeled hypothetical appendix. Current HTML/print-to-PDF functionality remains accepted as the working baseline. Review proposed formats/layout before implementation; no new library, provider call or deployment authorized by this planning entry. Final delivery placement after applicable functional work/review; optional research is not a prerequisite.

## Deferred visual wrap-up cross-reference
Owner2026-10-26: M7.2 accepted/DONE. Cosmetic follow-up only, pending Guo review: distinguish actual/hypothetical colors; per-card signed point changes with up/down arrows and accessible non-color cues; consider removing visible keyboard-help copy while retaining keyboard access; number levers sequentially in current leverage order; icons via M10.2; minor site-wide branding/color/polish coherence. Do not change ranking, scoring or add independent gains to combined scenario scores. Exact per-card contribution presentation to be scoped when scheduled; not a blocker for accepted M7.2.
M10.1/M10.2 are existing checklist backlog IDs; M11.1 optional research remains separate and is not a prerequisite for final report delivery.

# Cross-cutting portability and security requirements

## Deployment portability

The v2 research application must be deployable from a clean clone onto a fresh compatible host without changing application business logic.

Requirements:
- no Hetzner-specific business logic or hard-coded hostnames in the application core;
- secrets and provider credentials supplied externally through environment/secret configuration;
- changing OpenAI/Google/other provider credentials must not require source-code edits;
- database/schema initialization and migrations must be reproducible;
- required host/runtime assumptions must be documented;
- deployment configuration should be version-controlled where practical, with secret values excluded;
- provider-specific integrations should sit behind replaceable adapters/interfaces.

The exact deployment mechanism is not prescribed here; the implementation may propose Docker, containers, platform deployment, or another reproducible approach.

## Security gate

Before exposing a capability publicly, verify appropriate controls for its attack surface, including:
- server-side input/schema validation;
- parameterized/safe database access;
- authorization for privileged/admin actions when applicable;
- secrets excluded from source/client bundles/logs;
- dependency and secret scanning where tooling is available;
- least-privilege credentials;
- file-type/size/content validation for upload features when present;
- non-sensitive production error handling.

Do not expose maintenance/admin functionality publicly merely because user accounts/authentication are deferred.

# Cross-cutting reliability requirements

These apply to all milestones.

## Deterministic core remains available

Failure of OpenAI or another model provider must not prevent:
- questionnaire completion;
- deterministic scoring;
- charts;
- deterministic priority-gap display;
- durable report generation.

## Config identity

Each assessment/report should record the configuration/method version used so results can be interpreted later.

## External dependencies

Avoid unnecessary chains of third-party APIs.

A noncritical external dependency should degrade gracefully where practical rather than taking down the core assessment.

## Human milestone ownership

Only the human project owner may mark a milestone complete or authorize the next milestone.

---

# Milestone status

- [X] Milestone 1 — Product shell and assessment entry
- [X] Milestone 2 — Deterministic assessment core and Golden parity
- [X] Milestone 3 — Recommendations, results, and durable report — owner accepted 2026-10-20
- [ ] Milestone 4 — Emissions calculator and quantitative input flow
- [ ] Milestone 5 — Basic config and knowledge-base maintenance — CURRENT / REQUIRED
- [ ] Milestone 5A — Automated source-document to config regeneration — NEEDS APPROVAL
- [ ] Milestone 6 — Interactive levers — STRETCH
- [ ] Milestone 7 — Quick vs Full assessment — STRETCH / METHODOLOGY REVIEW
- [ ] Milestone 8 — Alan/Henry external benchmark layer — RESEARCH EXPERIMENT

## Milestone 2 acceptance — 2026-10-12

The owner explicitly accepted Milestone 2 on 2026-10-12 following the human walkthrough: the eight-question test matched expected scores, and the Q23 edit, recalculation and refresh worked. This acceptance includes the outstanding M2.6 explanations, calculation trace and numeric-policy review, and completes M2.1–M2.7. See app/docs/M2.7-MILESTONE-2-REVIEW.md for retained verification evidence, accepted numeric differences and evidence limitations. Questionnaire review/navigation issues remain deferred to M3.4/M3.6 as documented in EXECUTION_PLAN.md. The owner separately authorized merging PR #3; it merged into main on 2026-10-12 using merge commit `4929f9f2969fa946da1066ea3825921349ecf641`. The M2 branch and shared history are preserved. The current branch is `milestone-3-recommendations`, created from synchronized main at that merge commit. At the merge handoff, M3 implementation was unstarted; the subsequent limited authorization is recorded below.

## Active package — M3.1–M3.3, authorized 2026-10-13

The owner authorized the recommendation foundation: provider-neutral service, native metadata retrieval, preserved prompt assembly and validated outputs, using controlled local provider test doubles. Live external calls remain gated on provider/model, budget and SME data approval; no credentials are requested. Implementation is recorded in app/docs/M3.1-M3.3-REVIEW.md and EXECUTION_PLAN.md. The local foundation was accepted on 2026-10-14; live-provider work is governed by the subsequent limited authorization below. Milestone 3 remains incomplete; deferred questionnaire polish, reports and framework experiments remain pending. No deployment or merge is authorized.

## Targeted metadata restoration — authorized 2026-10-13

The owner authorized restoration of Appsmith Additional Context / Requirements (`notes`) only, preserving valid sessions/answers and deterministic behavior. See app/docs/M3-METADATA-RESTORATION-REVIEW.md for the complete legacy setup mapping, country/revenue omissions and verification. The local foundation and this correction were accepted on 2026-10-14. That acceptance does not accept live integration or authorize deferred M3.4 navigation, reports or retrieval experiments. The verified foundation was checkpointed as `7480686` before integrating remote documentation `e162192` through a merge.

## Current limited live-AI package — authorized 2026-10-14

The owner accepts the LOCAL M3.1–M3.3 foundation and notes restoration. Human walkthrough: answers/notes survive refresh; notes-only edits left raw 58.3 and industry-weighted 13.8 unchanged. This is not acceptance of live generation or Milestone 3.

Authorized now: actual server-only OpenAI Responses adapter (gpt-5.4-mini, low reasoning baseline), runtime configuration, existing prompt/application validation, and only M3.4 explicit generation controls, validated narrative/evidence, loading/failure/cancel/retry and stale-result protection in the existing Results layout. M3.2 retrieval remains unchanged. See app/docs/M3-LIVE-AI-REVIEW.md and app/docs/AI-PROVIDER-SETUP.md.

After explicit local provider/model/key configuration, at most five automated synthetic-profile generation attempts are authorized within an estimated US$2 total, counting failures/timeouts. No archived/confidential SME transmission. No credentials are present at the recorded check; live verification remains pending. Ordinary verification remains offline. No deployment/main merge or deferred M3.4 navigation/Skip/technical-JSON work, M3.5 report or M3.6 experiments are authorized. Whole M3.4 and Milestone 3 remain open.

The full offline package gate passed on 2026-10-14: typecheck, lint, 227 unit tests, production build and 55 browser tests. Live verification and acceptance of the new package remain pending.

Operating correction: leave this package uncommitted; the owner handles staging, commits and pushes manually. Routine scoped work and documentation remain authorized; respect platform controls and stop only for genuinely unresolved material decisions.
## Current M3.1/M3.3 correction — authorized 2026-10-15, offline only

The original five-attempt live allowance and the separately authorized sixth diagnostic are exhausted. The sixth request returned HTTP 200 after about 15 seconds but failed unchanged application validation. No further provider request is authorized; earlier allowance/configuration statements above describe the prior checkpoint. Both ignored ledgers are preserved.

The owner authorized prompt-contract clarification and coordinated operational deadlines: exact summary labels; assessed/unassessed category lists; assessed-only recommendations and key gaps; missing-data disclosures in grounding_notes; counts as maxima. Prompt version is legacy-runtime-v1-validated-transport-3, preserving the archived legacy template, scoring, retrieval and validation safeguards. Provider default/maximum is 30 seconds and generation-client caps 45 seconds; cancellation and the separate under-ten-second performance target remain. The explicit existing app/.env.local value 10000 is preserved and still takes precedence until the owner replaces that single line with RECOMMENDATION_TIMEOUT_MS=30000 and restarts the updated server. No secret or environment file was printed or overwritten.

See app/docs/M3-LIVE-AI-REVIEW.md and EXECUTION_PLAN.md for verification and configuration precedence. This correction does not accept the live package or Milestone 3 and does not authorize new calls, deferred milestones, deployment, staging, commits or pushes.


### Latest live evidence — 2026-10-15

After the prompt/deadline correction, the owner authorized exactly one additional synthetic request under a separate $0.35 budget. Readiness verified 30000 ms / prompt version 3; reserved $0.324144 and dispatched once. HTTP 200 in about 8.94 seconds service total, but application validation rejected a missing exact industry label. Synthetic response retained only as local diagnostic evidence. No validated live acceptance. All allowances are now exhausted; see EXECUTION_PLAN.md and app/docs/M3-LIVE-AI-REVIEW.md. Existing ledgers and environment preserved; changes remain unstaged/uncommitted.


### Current migration-baseline scope correction — 2026-10-15

The owner removed literal summary context labels as an acceptance requirement and authorized minimal separate setup-context display in Results. Contract version 4 preserves numeric/structure/citation/category/freshness safeguards. Retained synthetic output passes the revised validator offline; no new live success or Appsmith parity is claimed. Broader prose, claim grounding, model selection and latency evaluation belong to M3.6, not additional migration blockers. See app/docs/M3-MIGRATION-BASELINE-REVIEW.md and EXECUTION_PLAN.md. No live calls, configured-model/.env.local change, deferred milestones, deployment or Git publication authorized; M3 remains unaccepted.

Owner decision 2026-10-15: offline v4 context-contract correction accepted, not all M3. One separately authorized synthetic browser generation passed and the notes-only followup preserved scores; evidence is in app/docs/M3-LIVE-AI-REVIEW.md. GPT-5.2 comparison/harness deferred to M3.6. Design-planning checkpoints retained in EXECUTION_PLAN.md without implementation authorization. The single additional allowance is consumed; no further paid calls authorized.

## Focused Results interaction/UI package — authorized 2026-10-16

Owner authorizes combined Generate score and recommendations action (including partial confirmation), immediate independent scores, one explicitly requested recommendation attempt, failure/retry/cancel and duplicate/stale protection; balanced responsive Results layout; expanded executive summary and collapsed counted gaps/actions with evidence/technical disclosure. Use installed UI/accessibility guidance and existing design primitives. No paid calls, new AI components, scoring/retrieval/config/validation/provider changes, commits or pushes. Newer uncommitted work and ledgers must be preserved. This supersedes the earlier restriction on this specific Results transition/layout work, not the rest of deferred navigation, M3.5 reports or M3.6 experiments. M3 is not accepted. Implementation/verification record: app/docs/M3-RESULTS-INTERACTION-REVIEW.md.

## Results visual correction — owner authorized 2026-10-16

Correct presentation omissions from manual review: compact stored context and accurate score-driver explanation; progressive technical information; top action category/difficulty badges; per-insight accessible source dialogs; reordered/grouped evidence; separate missing-information notice and existing unanswered-item navigation. Use ui-ux-pro-max and ui-styling. No scoring/retrieval/prompt/config/provider changes, paid calls, reports, anticipated ROI, commits or pushes. M3 acceptance is unchanged. Review and per-requirement evidence: app/docs/M3-RESULTS-VISUAL-CORRECTION-REVIEW.md.


## Owner acceptance: focused Results UI corrections — 2026-10-16

Owner explicitly accepted the requested Results UI corrections, loading feedback and slower card transitions. This includes the compact context/hierarchy, source dialogs, evidence ordering, reduced clutter, spinner/two-second rotating wording, visible selection confirmation and slower motion. Retained gate: 248 unit tests and 69 browser tests, typecheck/lint/build passed. This is scoped UI acceptance only: not whole M3, recommendation quality, reports, retrieval experiments or deployment acceptance. GROUNDING-001 (unsupported whistleblower citation) and SCORE-COMPARISON-001 (55.6/13.2 versus 58.3/13.8 without matching input maps/traces) remain OPEN.

Next authorized package: read-only Hetzner inspection and local isolated protected non-billable preview preparation using actual UI/deterministic scoring with labeled synthetic narrative scenarios. No server mutation, DNS changes, paid requests, staging, commits or pushes. Deployment approval follows review of concrete files and remaining prerequisites.

Private staging preparation locally verified: actual UI/authoritative scoring with separately gated synthetic scenarios, concrete isolated deployment files and rollback plan. Review: app/docs/PRIVATE-PREVIEW-REVIEW.md. Deployment remains unapproved and blocked on SSH inventory and exact-container/Caddy checks. UI acceptance does not accept M3 or close grounding/score-comparison issues.

M10.3 local prototype2026-10-30 ready for owner review under v5.3/approved beta rules; mapping v0.2 and evidence in EXECUTION_PLAN.md. No acceptance/commit/merge/deployment; preview3103.

M10.3 owner-reviewed prototype committed ed42a35 (local only); subsequent pentagon/meaning/disclosure UI refinement verified and uncommitted for review2026-10-30. Same preview3103; no scoring/mapping changes or deployment.

M10.3 narrative refinement2026-10-30: fixed context/answer-grounded reading with optional identity-matched existing recommendation title; semantic family/category disclosure; template2. Verified locally, uncommitted; no extra calls or classification/scoring changes.

M10.3 supplied icon hierarchy2026-10-30 verified locally: family/category secondary and tertiary icons within portrait only; preview3103. Refinements uncommitted, no API calls/scoring changes/deployment.

M13.2 caption dependency resolved2026-11-03: owner supplied matching20-cue English WebVTT timed0:00.19–1:29.80 to this91.76s film; intentional81.55/83.06 reveal cues preserved verbatim. Attach kind=captions,srcLang=en,label=English,default as existing behavior. Previous VTT remains unchanged for rollback. Owner initially requested waiting, then immediately supplied captions; no measured approval pause claimed. Temporary missing-caption limitation above is superseded; no lint exception used. Resume original authorized live replacement.
