# Deterministic scoring numeric and trace policy

Applies to M2.6 and the accepted M2.3–M2.5 engine. Method version: `v1-formulas-full-precision-v2.1`. Trace schema version: 1. This package adds observability, not a scoring-method change.

## Source precision and representation

Versioned canonical repository files remain authoritative. Numeric configuration retains its original decimal strings, including full-precision category weights. The engine converts these strings at the calculation boundary to JavaScript IEEE 754 binary64 numbers. This is finite floating-point arithmetic, not arbitrary-precision decimal arithmetic. Raw answer strings remain unchanged in the input snapshot and each trace row; parsed numeric operands are separate in normalization_inputs. Benchmark and answer-scale records retain their source strings for audit.

Malformed numbers and non-finite calculations fail explicitly. Blank answers are missing, not zero. Invalid nonblank drafts fail rather than silently becoming missing or zero. Skipping an unanswered question leaves it unscored; the existing questionnaire's Skip action does not erase an already entered answer or draft. This package does not change that behavior.

## Intermediate and presentation rounding

No decimal rounding occurs between normalization, base weighting, multiplication, earned/possible points, category aggregation, and overall aggregation. Existing clamping, bands, benchmark selection, optional-parameter semantics and the preserved final multiplier cap are methodology, not rounding, and remain unchanged.

Normal results display one decimal. The explanation displays two decimals for readable operands and contributions. These formatted strings never feed calculation, storage or a subsequent score. Technical JSON uses JSON.stringify's round-trip representation of the actual finite binary64 values, without toFixed. It is exact for that stored number, not a claim of exact decimal mathematics.

Category percentage-point and overall contributions in the trace are diagnostic decompositions computed by the engine from its already calculated earned/possible totals. Aggregation still uses the authoritative category totals, not a sum of presentation-rounded contributions. Small last-bit differences can arise when summing decomposed contributions in a different operation order.

## Comparison policy and historical artifacts

IDs, order, methods, matched-rule IDs, source records and raw strings compare exactly. Values copied into the trace must strictly equal the corresponding engine intermediates. JSON round trips must preserve those values.

Independent full-precision replay and decomposition comparisons allow an absolute difference of at most 32 * Number.EPSILON * max(1, abs(reference)). This existing small allowance covers floating-point operation-order differences, with a unit-scale floor near zero; it is not a tolerance for decimal rounding, config differences or methodology drift. Do not widen it to make a fixture pass.

Historical Golden artifacts include presentation-rounded intermediates and, in some captures, rounded category weights. Existing tests separately replay the unmodified preserved Appsmith scorer and compare those captured values at their documented precision. A second isolated test-only replay removes legacy decimal formatting and compares full-precision behavior with unmodified canonical weights. The runtime does not execute or import legacy code.

Manufacturing category totals were captured at whole-point precision. Its historical weighted overall 24.8 is not treated as a full-precision canonical expectation; its historical weighted breakdown is absent. Other captured weighted breakdowns can be reproduced using their separately recorded historical weights in the legacy test replay only. See M2.3-M2.5-REVIEW.md for the accepted differences. Historical artifacts are never rewritten, promoted to more precision than they contain, or used to round the new engine's intermediate values.

## Trace contract and legacy comparison

The engine emits traceSchemaVersion, configVersion, methodVersion, an input snapshot, ordered trace rows, category totals/contributions and overall totals in the scored assessment. The API exposes that record without independently recalculating any field. Company name and subindustry are not needed by scoring and are not sent to the endpoint.

Scored rows include raw_answer, response_type, normalization_method, normalization_inputs, normalized_score, benchmark/answer_scale, base_weight, matched_multiplier_rule_ids, multiplier/product/cap, weighted_score, final_score, total_possible, category_contribution and config/method identity. Missing rows contain identity/raw input and status only: no invented numeric score or possible points.

Benchmark identity is the JSON-encoded composite [metric_id, benchmark_group_type, benchmark_group_value] already identifying the canonical record. Source identifies MetricBenchmarks; record retains exact parameters, unit, notes and available source metadata. No external source URL or independent validation claim is invented. Parsed and effective numeric values are in normalization_inputs, including percent conversion, effective cap or decay defaults where applicable.

Legacy getAllAnsweredQuestionDebug fields question_id, normalization_method, normalized_score, base_weight, multiplier, weighted_score, final_score and total_possible map directly by name. Compare matched_multiplier_rule_ids with matched_rules[].rule_id; compare only status=scored rows because the old debug array excludes missing answers. Golden final_score_possible maps to total_possible. Benchmark records are compared with the preserved getMetric resolver. All five industry fixtures exercise this mechanical mapping.

## Availability and freshness

The POST response and the optional Scored assessment JSON disclosure retain the structured record for later audit/report consumers. Raw browser session data remains the sole persisted authority; derived traces are not cached in sessionStorage. Refreshing recalculates them from the raw answers and current trusted configuration. This avoids a second persistent result authority or a new report/persistence feature.

Results immediately invalidate when the session adapter saves changed scoring inputs, when a relevant storage/focus event reveals a change, or when a page is hidden. Page restoration forces a new calculation. Input snapshots are checked again before publishing a response, and generation checks plus abort signals prevent an older response/error from replacing newer work. A failed session write blocks calculation from the older saved snapshot within that page lifetime. As before, leaving/reloading after an unsaved-write warning can lose unsaved edits; this is not durable storage.

Unavailable, invalid or incompatible session/config data produces an explicit unavailable state, never a retained score or plausible fallback. No authentication, database, report generation, provider call or M2.7 acceptance functionality is introduced.
