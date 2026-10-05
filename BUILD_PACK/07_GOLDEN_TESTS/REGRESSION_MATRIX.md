# Golden Regression Matrix — SME Sustainability Assessment (live v1)

Captured 2026-10-03 (UTC ≈06:36–07:27) from the live Appsmith app (`SME Assessment Tool` page) by browser automation. Inputs came from `GOLDEN_CASES_SEED.json` (`answer` field only; `legacy_answer` was ignored). The app was reloaded before each case.

| Case | Industry | Employee band | Markets | Expected questions | Selection | Scores captured | Recommendations captured | QA |
|---|---|---|---|---:|---|---|---|---|
| GOLDEN_01_MANUFACTURING | Manufacturing (Industrial / Components) | 251-500 | North America / Oceania | 56 | MATCH (56/56, same order) | Rendered UI — raw 23.7%, weighted 24.8%, 4 category scores, 56 question cards; no weighted breakdown | Raw JSON (5 recs / 3 gaps) | **PASS** |
| GOLDEN_02_FOOD_AGRO | Food & Agro-processing | 51-250 | North America / LATAM | 55 | MATCH (55/55, same order) | Raw payload — raw 52.2%, weighted 52, full breakdown | Raw JSON (5 / 3) | **PASS** |
| GOLDEN_03_BUSINESS_EXPORT | Business / Export Services | 1001+ | APAC / EU | 63 | MATCH (63/63, same order) | Raw payload — raw 65.1%, weighted 64.9, full breakdown | Raw JSON (5 / 3) | **PASS** |
| GOLDEN_04_CONSTRUCTION | Construction / Materials | 501-1000 | EU / LATAM | 64 | MATCH (64/64, same order) | Raw payload — raw 44.8%, weighted 43, full breakdown | Raw JSON (5 / 3) | **PASS** |
| GOLDEN_05_CONSUMER_GOODS | Consumer Goods (Apparel / FMCG) | 251-500 | North America / APAC | 52 | MATCH (52/52, same order) | Raw payload — raw 72.9%, weighted 70.4, full breakdown | Raw JSON (5 / 3) | **PASS** (1 soft flag) |

**Totals:** 5 PASS · 0 PARTIAL · 0 FAIL

## Qualification — historical capture QA and canonical authority

- The five PASS cases represent historical capture QA; they do not by themselves prove a new implementation's parity.
- Manufacturing lacks a complete captured weighted-category breakdown.
- Consumer Goods preserves historical LLM prose stating 70.3%, while authoritative deterministic output is 70.4%.
- `BUILD_PACK/04_CONFIG/raw/CategoryWeights.xlsx`, tab `Sheet1`, is authoritative for canonical category-weight values, even where historical Golden captures contain rounded weights.
- `GOLDEN_CASES_SEED.json` and the original capture runbook are not currently included in the Build Pack.

Historical Golden JSON captures remain preserved unchanged; missing historical artifacts have not been reconstructed.


## How each case was captured

- **Question selection:** the actual IDs came from the Start Assessment network response (`questions[].question_id`) and were cross-checked against the rendered question cards. All five sets match the seed exactly, with no missing or unexpected IDs. The order also matches.
- **Answers:** every non-null seeded answer was entered and then confirmed against the app's own `Answer:` echo on each question card, for 289 answers in total. Case 1's I-056 is `null` and was left blank, and the app let the case submit without it.
- **Scoring:**
  - Cases 2–5 were captured from the scoring payload the app sends with the recommendation request: `raw_overall`, `weighted_overall`, `category_scores`, `weighted_category_breakdown` and `category_weights`. These were copied verbatim.
  - Case 1 was captured from the rendered results card only, because the payload intercept was added after case 1 ran. `weighted_category_breakdown` is therefore `null` for case 1; it was not reconstructed.
  - Question-level scores for all cases come from the rendered question cards.
- **Recommendations:** the raw n8n/OpenAI response is stored verbatim in `recommendation_output_raw`. `recommendation_output` is the parsed `output_text`.
- **Transcription check:** every transcribed raw payload and response was checked with a SHA-256 hash computed in the browser and again in the packaging environment. All hashes matched.

## Hard-assertion results (all cases)

- Valid JSON and complete schema: `executive_summary`, `priority_recommendations`, `key_gaps` and `grounding_notes` are present.
- Each case has 5 recommendations and 3 key gaps, which is within the limits of at most 5 and at most 3.
- Every evidence object has a non-empty `doc_title`, `source`, `pages_or_section` and `link`.
- No internal question IDs (U-/I-/M-/IM-), multiplier rule IDs (MR-) or chunk IDs appear in the user-facing prose. SASB metric codes such as `FB-FR-430a.1` are public standard references, not internal IDs.
- SME context: for cases 2–5, the payload `sme_context` echoes the seed profile.

## Soft or semantic flags (don't block PASS)

- **GOLDEN_05:** `executive_summary` gives the industry-weighted score as **70.3%**, but the scoring payload's `weighted_score` is **70.4**. The LLM restated the number incorrectly. The other four cases restate both scores correctly.

## Browser and app defects found during execution

1. **Answers are lost silently when the page doesn't have keyboard focus (high).**
   - When the browser window or tab isn't focused (for example, the user is typing in another panel), text entered into a question input appears in the box but is never saved to app state. The card keeps showing `Answer: blank`, and the list later re-renders the input as empty.
   - This was reproduced with both scripted and real keyboard input.
   - The console logs `Unexpected token ')'` from `main.*.js` on the failed input events.
   - Any user who switches windows mid-entry is exposed to this. The automation worked around it by confirming every answer against the card's `Answer:` echo before scoring.
2. **The page stalls when the tab is in the background (medium).** In a hidden tab, the question list stays on skeleton placeholders, and dropdown or rendered values lag behind the real state. This is mainly an automation risk, but it also affects users who switch tabs while the page loads.
3. **The M-022 card shows an empty Category label (low, case 1).**
   - The question card renders an empty `Category:` line.
   - The score widget still counts M-022 under Governance: Governance's possible score of 9424 equals 9030.7 from the labelled Governance cards plus 393 from M-022.
4. **Some evidence links have trailing whitespace (low).** In cases 2 and 5, some evidence `link` values end in a space, for example `...?usp=share_link `. The links still resolve once trimmed, but strict URL comparison in future regression checks will fail unless values are trimmed.
5. **Employee band is reformatted (informational).** Selected bands come back with spaces, for example `51-250` becomes `51 - 250` in `sme_context.employee_band`. Future assertions should normalise whitespace.
6. **Unanswered questions drop out of the possible score (informational, case 1).** I-056 was left blank, and the app excluded it from `total_possible` instead of scoring it as 0.

## Notes for future runs

- Enter the profile `notes` text into **Additional Context / Requirements**, as was done here. That text is passed to the LLM.
- Recommendation prose varies between runs, so compare against these files with the runbook's hard and soft assertions, not word for word.
- For a complete case 1 baseline that includes `weighted_category_breakdown`, re-run case 1 with the scoring payload intercepted. All other values here are final.
