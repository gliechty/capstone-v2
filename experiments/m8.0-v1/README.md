# M8.0 answer-effort experiment, version 1

Pending owner review. This is an offline questionnaire-selection comparison, not Quick mode or an approved scoring methodology. M8.1 is unstarted. No runtime, production configuration, source Google Sheet, portrait mapping, session, scoring or deployment changes.

## Review files

- `COMPARISON.md`: counts, category/family coverage, and exact Full, boolean/categorical, direct-knowledge and uncertain lists for each Golden SME.
- `golden-comparison.json`: machine-readable equivalent, including unchanged Golden profiles and selection order.
- `GOLDEN_*.csv`: individual lists, with original wording, ID, response type, effort, category, existing family and review status.
- `QuestionBank.experimental.csv` and `.json`: all 161 original rows and all 25 original fields, with only `answer_effort` appended. Includes inactive rows unchanged.
- `QuestionBank.original.csv`: exact read-only source snapshot; preserved bytes and hash allow byte-for-byte reversal across operating systems with different checkout line endings. Active source CSV is independently checked for identical fields/values/order.
- `QuestionBank.experimental.schema.json`: standalone JSON Schema generated from the existing production Zod definition extended only with the effort enum. `compare.mjs` also invokes the complete original Zod validator, including its finite-decimal refinement.
- `answer-effort.audit.json`: original proposals, final experimental assignments, rationale, assumptions, hashes, rule/model/prompt identity and review status.
- `reviews.json`: 43 agent spot-checks (28 changed proposals), each bound to the exact original row hash. These are agent reviews, not owner-approved assignments. The remaining 118 rows retain explicitly unreviewed model proposals.
- `uncertain-assignments.json`: all five `needs_review` assignments, including two not selected by any of the five Golden profiles.
- `model-proposals.json`, `classification-input.json`, `prompt.txt`, `model-usage.json`, `baseline.json`, `validation.json`: reproducibility and validation evidence.

## Findings and recommendation

| Golden SME | Full | Boolean/categorical | Direct knowledge | Needs review in Full |
|---|---:|---:|---:|---:|
| Manufacturing | 56 | 39 | 36 | 1 |
| Food/agro | 55 | 41 | 38 | 1 |
| Business/export services | 63 | 44 | 41 | 1 |
| Construction | 64 | 48 | 43 | 0 |
| Consumer goods | 52 | 38 | 35 | 0 |

Both candidate filters retain all four categories and all five existing archetype families in every Golden SME. This is presence coverage only, not adequate topic breadth or score comparability. Existing `none` family assignments remain `none` and are counted separately; they are not retagged as Measure or treated as a sixth archetype.

Coverage is uneven. The boolean/categorical candidate leaves only one People question for Food and two for Manufacturing/Consumer Goods. Direct knowledge restores two simple numeric questions in every case: U-018 training frequency and U-020 typical weekly full-time working hours. Direct candidates still have only two Community questions except Construction (four), and 16–22 Governance questions. Measure counts fall from 21–25 in Full to 12–15 in direct knowledge; many remaining Measure questions ask about tracking practices, not measured outcomes. Engage remains only two or three questions. Category/family labels do not prove that the same topics or outcome evidence survive.

A roughly 20-question Quick assessment needs further owner-approved selection rules: resolve effort ambiguities, retain category/family and topic representation, choose a small common core plus applicable industry items, handle dependencies (e.g. policy scope or target progress), and use explicit stable tie-breaking. The experiment supports an effort filter as one input; neither response type nor effort alone produces the target length. Do not simply take the first 20 or change weights to make scores resemble Full. Recover/review the legacy curation policy before adopting a ranking rule. No ranking, 20-question cap, score computation or portrait recalculation is implemented here.

## Uncertainty and review limits

The small model assigned high confidence to every row. That confidence is not calibrated and did not prevent mistakes: it classified ordinary training frequency as record lookup, some practice-existence questions as if actual results were requested, and per-employee training averages as lookup. Agent review corrected those cases while preserving the proposals. It sampled all four categories across every response type present (boolean, categorical, numeric, percent); there are no text rows. Other assignments still need owner/domain review.

Five assignments are explicitly uncertain: I-022 product GMO percentage (denominator); I-030 renewable materials percentage (basis); IM-5 and IM-6 source-specific water breakdown requested through a scalar response; M-040 micro/small supplier percentage (basis). No denominator, response format or methodology is changed. They are excluded from direct knowledge. Per-SME lists identify the applicable uncertain items; IM-5/IM-6 do not apply to the five Golden profiles.

U-020 assumes typical scheduled hours are ordinary manager knowledge. Variable overtime, shifts or a request for an actual workforce-wide mean could require aggregation. U-018 assumes usual training frequency, rather than reconstructing attendance. Practice-existence answers assume an informed owner/manager; specialist data provenance or proof of compliance may require consulting staff. Effort is typical answering work, not importance, sustainability performance, assurance of accuracy or a completion-time guarantee.

## Reusable preprocessing/publication contract

1. Start from a pinned approved QuestionBank and its existing schema; record source bytes, config/baseline commit and row hashes. Preserve every original field, value, ID, row order, active flag and external Commit/Measure/Plan/Do/Engage mapping. Append only `answer_effort` to a separately versioned experimental artifact.
2. Allowed values are exactly `direct_knowledge`, `record_lookup`, `calculation_aggregation`, `needs_review`. Use wording/options and typical respondent work; never classify solely by response type. Prompt version 1 contains contextual rules for simple facts, records, ratios, averages and factor-based totals. There is no automatic response-type override.
3. For future KB extraction, carry forward unchanged **approved** tags and their approval provenance when the full original-row content hash matches. A changed question/answer context must be flagged for reassessment; do not silently copy its old classification. Preserve its historical assignment and why it became stale. These experimental assignments are not approved tags.
4. Store every model/rule proposal separately from review/approval. Keep rationale, assumptions, exact model/prompt/rule version, source hash and reviewer/date. An administrator may override an assignment with an explicit value, reason, reviewer and timestamp tied to the current hash. Overrides take precedence only for that unchanged content; changed questions require renewed review. No admin interface or publication service is built.
5. Ambiguous/unapproved mappings remain reviewable. `needs_review` stays outside the direct-knowledge candidate. Before any future publication, resolve required reviews, validate the schema and preservation checks, and obtain separate authorization. No experiment file is loaded by the app.
6. Apply the existing SME applicability selector **first**; filter the resulting ordered list to boolean/categorical or direct knowledge. Do not change scoring, benchmarks, weights, answer scales, portraits or sessions. Omitted-by-design questions and candidate scores must never be presented as Full-equivalent.

## Reproduction and isolation

Branch `codex/m8-preprocessing`, worktree `.m8-preprocessing`, baseline `2955a3922a8da5a4be4b24dd2797f9a19efb309e` (timestamp documentation PR #33 merge). The experiment is a separate local commit, not merged or deployed. Its commit can be reverted independently with `git revert <experiment-commit>`; baseline remains a complete rollback target. No existing rollback material is altered.

Run `node experiments/m8.0-v1/compare.mjs` from the repository root to reproduce the offline comparison and validations from saved proposals/reviews. Set `M8_DEPENDENCY_ROOT` to an existing app installation containing the pinned TypeScript and Zod dependencies; this work used sibling `.m13-approved/app` read-only. No install or package change is needed. The scripts transpile/import the original schema and selector without rewriting them. `prepare.mjs` is initial packaging, not a paid call; do not overwrite an archived experiment for a new source version.

`classify.mjs` is a separate, explicit paid action, not part of validation. It refuses another call when successful proposals exist and reserves a conservative request/output bound before sending. The owner authorized at most two requests and USD0.30 for this experiment only. One successful request used 14,822 input and 7,336 output tokens, USD0.0441285 at standard uncached rates; no second request. Only QuestionBank context was sent, no Golden SME answers/profiles, factor requests or live app endpoint. Existing credentials were read privately, not copied into artifacts. Future calls require a new explicit allowance; the old switch is not continuing authorization.
