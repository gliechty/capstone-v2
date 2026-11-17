# M10.3 Sustainability portrait: reconcile, then prototype (v5.3)

**Status:** Guy authorized Phase A on 2026-10-28. It is read-only. Phase B waits for Guy's review of the Phase A report.

**Design source:** `MOSAIC_ARCHETYPE_LEXICON.html` in this folder. Claude owns the design, and Codex confirms what the live data supports.

**Out of scope for this task:**
- the admin knowledge-base pipeline;
- any expansion beyond five archetypes plus Explorer;
- any change to the questionnaire.

## Files

- `portrait_family_mapping_v0.1.csv` is the mapping file for the prototype. It is separate from the question bank and versioned, and is described in full in the Mapping file section below.
- `EVIDENCE_PROVENANCE_DRAFT.json` is a proposed input-basis block.
- `ARCHETYPE_SCHEMA_DRAFT.json` holds definitions and an example computed portrait.
- `PORTRAIT_FAMILY_MAPPING_DRAFT.csv` is superseded by the v0.1 file and kept for reference.

## Mapping file (prototype now, pipeline later)

- **Rows are keyed by `question_id`.** Each row keeps its provenance: `mapping_version`, `question_bank_version`, `proposed_by`, `proposed_at`, `rationale`, `reviewed_by`, `reviewed_at`, `mapping_status`, and the question text and answer scale at the time of mapping.
- **Assignment rules use families only, never question IDs.** The ID-level mapping exists for traceability and review.
- **A future pipeline would emit the same columns.** When a knowledge base is published, the pipeline output is one more `mapping_version`. Nothing else changes.
- **Numeric questions get no default family.** Each one is tagged like any other question. 15 rows in v0.1 are numeric. Some are tagged `measure` and some `none`, and all are marked `draft-review`.
- **`reviewed_by` and `reviewed_at` are optional.** They are filled only for spot-checked rows.

## Family tagging approach (beta)

Guy's direction (2026-10-29): this is a decorative beta feature. There is no human review of every question and no heavy model; spot-checks are enough. MOSAIC presents itself as sustainable partly because it uses small models, so the tagger should be small too.

1. **Rules first.**
   - Use answer scales that settle the family on their own, for example `POLICY_3` → commit, `TRACK_REPORT_4` and `ASSURANCE_4` → measure.
   - `PROGRESS_5` (Planned, Partially implemented, Implemented, Sustained) is used on more than plans. Give it to the model unless the question text is itself about a plan or target.
   - Propose the final rule list after checking the scales in the current bank.
2. **A small model for the rest.**
   - The output is a single label from the fixed set `commit | measure | plan | do | engage | none`, plus a one-line reason.
   - The model answers `none` when unsure.
   - An embedding classifier that assigns each question to its nearest labeled example is an acceptable alternative.
3. **Model spec (no specific model is prescribed):**
   - A small, instruction-following model. The one the recommendation agent already uses is fine.
   - Supports structured output or an enum or JSON schema, so only the six labels are possible.
   - A small context window is enough: about 2,000 to 4,000 tokens for instructions, about 15 to 20 labeled examples from v0.1 and one question with its answer scale.
   - Temperature 0. Batch requests, and use prompt caching on the fixed prefix (instructions plus examples).
   - A result cache keyed by a hash of question text, answer scale and prompt version, so unchanged questions are never retagged when a new bank is published.
   - A confidence signal: a `none` answer, low agreement between two short runs, or log-probabilities if the model exposes them. Use it to choose the spot-check sample.
4. **Spot-check, don't review everything.**
   - Check a small random sample plus every low-confidence row. About 10% is a starting suggestion.
   - "Why this archetype?" lists question IDs, so a wrong tag stays visible and can be fixed later.
5. **Record provenance in the mapping file.**
   - `proposed_by` holds the model or rule identifier and its version.
   - `rationale` holds the one-line reason.
   - Also record the prompt version and the run timestamp.
6. **Benchmark once.**
   - Run the tagger on the 62 hand-tagged rows in v0.1, excluding them from its examples or using cross-validation.
   - Report the agreement rate and the disagreements.
   - Guy judges whether that agreement is good enough for beta.

In this task, Phase B may run the tagger once, as an offline script, to produce `portrait_family_mapping_v0.2.csv` for the current bank. It does not build the admin pipeline.

## The question bank will change (context only)

Guy plans an admin feature that will:
- upload a knowledge base;
- extract atomic indicators into a new question bank with recomputed config;
- select the active knowledge base.

For portraits, this means:
- **Validate each newly published configuration version once.** That means bank, mapping and config together. Run the Golden checks and a per-family coverage report against that version. Do not rerun them every time a knowledge base is selected.
- **Record the configuration version on every portrait.** That is the knowledge base, bank, mapping and rule versions. Saved portraits keep the version they were computed on.
- **Coverage warnings only flag.** They never pad the bank to feed the portrait.

## Phase A: read-only reconciliation (no code changes)

1. **Mapping file.**
   - Match every row of `portrait_family_mapping_v0.1.csv` to the current canonical question bank.
   - Report missing IDs and any changes to wording, answer scale or response type.
   - Review the `draft-review` rows, including all numeric rows.
   - Say where a versioned mapping file fits next to the current bank and config build.
2. **Guy's test entry.**
   - Claude's worked example uses the review screen Guy pasted on 2026-10-28 at 06:54 UTC. It showed 45 answered and 11 unanswered, with U-031 skipped.
   - Guy's other notes mention 25% waste diversion and calculator-transferred values.
   - Identify the saved assessment or assessments, and which one matches the snapshot. Do not assume they are the same.
3. **Scoring outputs.**
   - Confirm `SCORING_OUTPUTS.category_scores` per category for confirmed answers.
   - Confirm whether any topic-level score exists.
   - Confirm how numeric answers are scored today.
4. **Levers ranking.**
   - What the ranking is based on.
   - Whether it can be read without what-if values.
   - Whether each Lever maps to a question, and so to a family.
5. **Input basis.**
   - Where the app stores, per answer: manual entry, calculator or document upload.
   - Where it stores document counts, sites and periods.
   - If nothing is stored, report it as `unknown`, not manual.
6. **Context.**
   - Check the `SME_CONTEXT` fields, including `notes`, `employee_band` and `revenue_band`.
   - `revenue_band` is currently listed as unavailable.
7. **Tagging model.**
   - Which small model and provider client the app already uses, and whether they support structured output and prompt caching.
   - Any rule-ready answer scales in the current bank.
8. **Configuration versioning.**
   - What version identifiers exist today for the bank, config and scoring method.
   - Where a portrait would record them.

**Report:** a short table of what exists, what differs from the shared v1 copy, what is missing, and open questions for Guy.

## Phase B rules (for reference; build only after Guy reviews Phase A)

Calculate every portrait independently. No expected result is given for any case.

1. **Inputs.**
   - Use confirmed answers only.
   - Never use Lever what-if values.
   - Exclude `RETRIEVED_DOCUMENTS` and `RETRIEVED_CHUNKS`.
2. **Family score.**
   - A family's score is the share of the best answer across its answered mapped questions.
   - Skipped questions are never counted as low.
   - How numeric answers score inside a family is an open item from Phase A, step 3. The options are the existing numeric scoring, or counting a figure as known. Guy decides.
3. **Readability.** This replaces the earlier rule.
   - A family needs at least 2 applicable mapped questions in the business's question set. Below that, it reads "Not assessed in this question set". That is a property of the question set, never of the business.
   - A family that is assessed is readable when at least half of its applicable questions are answered.
   - There is no other minimum. A small family that is fully answered is always readable.
4. **Portrait in progress.**
   - Shown when fewer than 3 families are readable.
   - There is no separate overall-answer minimum.
5. **Archetype.**
   - The strongest readable family at or above `strength_floor` sets it:

     | Family | Archetype |
     |---|---|
     | commit | Anchor |
     | measure | Chronicler |
     | plan | Navigator |
     | do | Steward |
     | engage | Partner |

   - If no family reaches the floor, the result is Explorer.
   - Ties go to the family with more answered questions, then to the order commit, measure, plan, do, engage.
   - Anchor means Commit is strongest. It does not mean balance.
6. **Next step.**
   - The next step is the weakest readable family.
   - Its action is the top Lever in that family, labeled "Top Lever in <family>".
   - If no Lever sits in that family, use the overall top Lever, labeled "Overall top Lever".
7. **Strength.** The highest existing category score. Ties are shown together.
8. **Input basis.**
   - Each family is labeled manual, calculator, document upload, mixed or unknown.
   - The label shows where answers came from, not how accurate they are.
   - It never changes a score.
9. **Explanation.**
   - A fixed template filled with the computed facts.
   - No AI.
10. **Never used as evidence:** text length, fluency, filling an optional field, Lever values, retrieved documents.

**One value to propose:** `strength_floor`. Judge it by the portraits it produces on the Golden assessments and the reconciled test entry.

## Hypotheses to evaluate (not established facts)

Report evidence for or against each one in Phase B:
- The weakest family is less stable than the strongest. It changes more often when one answer changes.
- Many businesses share the same weakest family, likely Plan or Measure.
- Do is thin in universal questions, and is often unreadable or "Not assessed".
- A small-model tagger agrees with the hand tags well enough for beta.
- One archetype, for example the Chronicler or the Anchor, is over-represented.
- The test entry's Commit lead holds once the test entry is reconciled with the saved assessment.
