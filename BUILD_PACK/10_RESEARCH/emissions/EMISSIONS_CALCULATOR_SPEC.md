# EMISSIONS_CALCULATOR_SPEC.md

## Status

Implementation-facing specification for Capstone v2.0.

The original Alan/Henry workbook remains the historical calculation artifact and regression oracle. This specification defines **what v2.0 should preserve and expose**, not a cell-for-cell transcription of the legacy workbook.

Known legacy workbook formulas must be audited before porting. Do **not** copy formulas blindly.

---

# 1. Purpose

The v2.0 emissions calculator should let an SME convert ordinary operational evidence into canonical sustainability metrics that can be reused by the assessment.

Primary goals:

1. reduce the need for SMEs to calculate emissions/intensity metrics themselves;
2. avoid duplicate entry when a value can already be derived from uploaded evidence or calculator inputs;
3. preserve transparent, deterministic calculations;
4. feed resolved metrics into the same scoring contract used by manually entered questionnaire answers;
5. retain provenance for every calculated value.

The calculator is an **input-resolution service**, not a separate sustainability-rating methodology.

---

# 2. Relationship to the assessment

The assessment should accept a quantitative metric from three paths:

1. **calculator-derived** — enough activity data exists in the current assessment session;
2. **evidence-derived** — the SME uploads utility bills, fuel records, current audits, or similar evidence and a value can be extracted and validated;
3. **manual** — the SME already knows the value and enters it directly.

All three paths converge on the same canonical metric record before scoring.

Example conceptual flow:

```text
Utility bill / fuel receipt / calculator entry / manual answer
                         ↓
               canonical metric resolver
                         ↓
         value + unit + period + provenance
                         ↓
                  MetricBenchmark
                         ↓
             deterministic normalization
                         ↓
                 assessment score
```

A calculated value should be reusable anywhere the same `metric_id` is required.

---

# 3. Scope

## 3.1 In scope for v2.0

The legacy research calculator covers or was intended to cover:

- Scope 1 GHG emissions;
- Scope 2 GHG emissions;
- selected Scope 3 emissions where sufficient activity data exists;
- energy consumption;
- renewable-energy share;
- water consumption / intensity;
- waste quantities / related ESG metrics;
- revenue-based intensity calculations;
- supporting HR/site/activity inputs needed for derived metrics.

The v2 implementation should prioritize the metrics that map to active QuestionBank / MetricBenchmark requirements.

## 3.2 Not required for v2.0

Do not make the calculator responsible for:

- selecting assessment questions;
- assigning base weights;
- applying contextual multipliers;
- determining category weights;
- generating the overall ESG/sustainability score;
- replacing the existing QuestionBank methodology;
- estimating values from unsupported assumptions merely to avoid missing data.

---

# 4. User experience

## 4.1 Entry points

An SME should be able to reach the calculator from either:

- an optional **Calculator / Data Tools** section before or during the assessment; or
- a quantitative question that offers **Calculate this for me**.

The user should not have to know GHG accounting terminology before beginning.

## 4.2 Evidence-first workflow

Where supported, the user may upload:

- electricity bills;
- natural-gas / heating bills;
- fuel receipts or fuel-consumption records;
- vehicle mileage records;
- refrigerant / equipment records;
- current carbon or ESG audits;
- water bills;
- waste records;
- other source documents explicitly supported by the calculator.

The system may use an LLM or document parser to extract candidate values, but extracted numbers must not become scored values without deterministic validation and, where material, user confirmation.

## 4.3 Manual fallback

If evidence is unavailable, the user can enter activity data manually.

If the user already has a verified emissions/intensity figure, they may enter that value directly rather than rebuilding it from raw activity data.

---

# 5. Canonical metric record

Every resolved calculator value should be stored in session state using an auditable structure similar to:

```json
{
  "metric_id": "carbon_intensity_food",
  "value": 0.000123,
  "unit": "tCO2e/USD",
  "period_start": "2025-01-01",
  "period_end": "2025-12-31",
  "scope": "scope_1_plus_2",
  "value_source": "calculator",
  "source_artifacts": [],
  "calculation_method": "activity_data_x_emission_factor",
  "formula_version": "emissions-v2.0.0",
  "factor_library_version": "factor-set-YYYY-MM",
  "user_confirmed": true,
  "calculated_at": "ISO-8601",
  "quality_flags": []
}
```

Required fields:

- `metric_id`
- `value`
- `unit`
- reporting period
- `value_source`
- formula/calculator version
- factor-library version where applicable
- source evidence reference(s), if any
- confirmation / validation state
- data-quality flags

Do not silently collapse **missing**, **zero**, and **not applicable** into the same state.

---

# 6. Core calculation model

## 6.1 General GHG formula

For activity-based emissions:

```text
emissions_CO2e = activity_quantity × emission_factor
```

The calculation layer must explicitly track:

- activity type;
- activity unit;
- factor value;
- factor unit;
- factor source;
- factor geography;
- factor year/version;
- conversion factors;
- resulting tCO2e.

Unit conversion must occur before aggregation.

## 6.2 Scope 1

Potential supported activity classes include:

- stationary fuel combustion;
- mobile / company-controlled vehicle fuel;
- refrigerants / fugitive emissions where data is available;
- other direct sources supported by the chosen factor library.

Scope 1 total:

```text
scope_1_tCO2e = Σ validated_direct_emission_sources
```

## 6.3 Scope 2

At minimum support purchased electricity.

Where the necessary factor set exists:

```text
scope_2_tCO2e = electricity_consumption × electricity_emission_factor
```

The data model should leave room to distinguish location-based and market-based Scope 2 accounting, but v2.0 should not pretend to calculate a market-based result unless contractual / supplier-specific energy attributes are actually available.

## 6.4 Scope 3

Scope 3 should be modular and explicitly partial.

Only calculate a Scope 3 category when the necessary activity data and a supported calculation method exist.

Never present an incomplete subset as a complete corporate Scope 3 inventory.

Store:

- included Scope 3 categories;
- excluded / unknown categories;
- category-specific methodology;
- coverage warning.

## 6.5 Combined emissions

Where an assessment metric requires Scope 1 + 2:

```text
scope_1_2_tCO2e = scope_1_tCO2e + scope_2_tCO2e
```

Do not combine incompatible reporting periods or organizational boundaries.

---

# 7. Intensity calculations

The assessment contains quantitative questions that may require intensity rather than absolute totals.

Where revenue is the denominator:

```text
emissions_intensity = emissions_tCO2e / annual_revenue_USD
```

Equivalent intensity calculations may apply to energy, water, or waste where a canonical metric requires them.

Rules:

- denominator must cover the same reporting period as the numerator;
- revenue currency must be normalized before use;
- denominator source must be retained;
- divide-by-zero is invalid;
- missing denominator means **unknown**, not zero;
- the final unit must exactly match the associated `MetricBenchmark`.

Example compatibility already identified in the current system:

`carbon_intensity_food` expects a value compatible with `tCO2e/USD`.

---

# 8. Energy and renewable-energy metrics

Where available, resolve:

- total electricity consumption;
- total energy consumption;
- renewable electricity / energy quantity;
- renewable share.

Conceptual renewable share:

```text
renewable_share_pct =
    renewable_energy_quantity / total_energy_quantity × 100
```

Only combine energy quantities after unit normalization.

Do not infer renewable status from a utility/provider name without evidence.

---

# 9. Water and waste

The calculator may resolve environmental operating metrics beyond GHG where they map to the QuestionBank.

Examples:

```text
water_intensity = water_volume / denominator
waste_intensity = waste_mass / denominator
waste_diversion_pct = diverted_waste / total_waste × 100
```

The specific denominator and unit must come from the canonical `metric_id` / MetricBenchmark definition rather than from a generic calculator default.

---

# 10. Organizational and temporal boundaries

Every calculator run must establish:

- reporting period;
- sites included;
- legal/operational boundary where relevant;
- currency / revenue period;
- whether data is complete for the declared boundary.

Multi-site values must be calculated at site/source level and then aggregated.

Do not aggregate records with incompatible:

- periods;
- units;
- factors;
- organizational boundaries.

---

# 11. Emission-factor management

Emission factors must not be hard-coded invisibly inside UI logic.

Use a versioned factor library containing at least:

- `factor_id`
- activity / fuel type
- geography
- year / validity period
- input unit
- factor value
- factor unit
- source organization
- source citation / URL
- active/version status

The calculator output must record which factor version was used.

Factor updates should not silently recalculate historical completed assessments.

---

# 12. Evidence extraction and validation

Document extraction can assist users but must not become opaque scoring logic.

For each extracted candidate value:

1. identify source document;
2. identify page/section or visible location where feasible;
3. extract quantity + unit + period;
4. normalize the unit deterministically;
5. flag ambiguous values;
6. request user confirmation where ambiguity materially affects the calculation;
7. preserve original extracted text/value as provenance.

Example:

```json
{
  "source_artifact": "electricity_bill_march.pdf",
  "candidate_value": 4231,
  "candidate_unit": "kWh",
  "period": "2026-03",
  "confidence": 0.94,
  "user_confirmed": true
}
```

The LLM must not choose an emission factor or transform a final score on its own.

---

# 13. Session-memory behavior

Calculator-derived metrics should be available to the current assessment session.

When a QuestionBank item requests a metric already resolved in session:

- display the resolved value;
- show its source (`Calculated`, `Uploaded evidence`, or `Manual`);
- allow the user to inspect/edit/recalculate it;
- avoid asking the SME to type the same value again.

If the user changes underlying inputs, dependent metrics must be marked stale and recalculated.

A future user-account system may persist these records across sessions, but persistence is not required to define the calculation contract.

---

# 14. QuestionBank / MetricBenchmark integration

The calculator should integrate via `metric_id`, not question wording.

```text
QuestionBank.metric_id
        ↓
session resolved_metrics[metric_id]
        ↓
MetricBenchmarks[metric_id]
        ↓
AssessmentScoring.normalize(...)
```

This preserves separation between:

- data acquisition;
- calculation;
- normalization;
- weighting;
- contextual multiplier logic;
- aggregation.

A calculator output may populate multiple questions only when they genuinely reference the same canonical metric.

---

# 15. Missing-data rules

The following states must remain distinct:

- zero;
- missing / unknown;
- not applicable;
- not provided;
- extracted but unconfirmed;
- calculated from incomplete coverage.

Rules:

- blank inputs must not automatically become zero;
- incomplete Scope 3 must not be represented as full Scope 3 = 0;
- missing denominator must not generate intensity = 0;
- do not award a scoring benefit merely because data is absent.

The UI should make data completeness visible.

---

# 16. Legacy workbook audit issues

Before implementation, reconcile the original workbook against its intended methodology.

Known issues identified during prior review include:

1. some **fuel-spend** calculations appeared to reference energy-content values rather than emissions factors;
2. some **vehicle-fuel** calculations appeared to reference energy-content values rather than emissions factors;
3. some **multi-site gas** calculations appeared to reference energy-content values rather than emissions factors;
4. some blank / missing inputs could propagate as **zero** rather than remain missing.

These issues mean the workbook should be used as a **behavioral/research reference**, not blindly translated formula-for-formula.

For each migrated formula, independently verify:

- factor type;
- unit dimensionality;
- conversion;
- reporting boundary;
- missing-value behavior.

---

# 17. Validation / regression

Before v2.0 release, create fixtures representing at least:

1. electricity-only SME;
2. electricity + stationary fuel;
3. vehicle fuel / mileage;
4. multi-site SME;
5. renewable-energy mix;
6. missing revenue denominator;
7. partial Scope 3;
8. uploaded evidence with user correction;
9. genuine zero activity;
10. blank / unknown activity.

For each fixture, preserve:

- inputs;
- factor IDs/versions;
- expected intermediate calculations;
- expected final metric values;
- expected units;
- expected missing-data / quality flags.

Where the legacy workbook calculation is known to be correct, its output can serve as a regression oracle. Where the legacy formula is questionable, document the reconciliation rather than forcing parity.

---

# 18. Acceptance criteria

The v2.0 implementation is acceptable when:

- calculations are deterministic for identical inputs + factor version;
- all units are explicit and validated;
- every calculated metric has provenance;
- every factor is versioned and attributable;
- missing values remain distinguishable from zero;
- multi-site aggregation is traceable;
- relevant resolved values can populate assessment questions without duplicate entry;
- manual overrides remain possible and are logged;
- calculator outputs map through `metric_id`;
- scoring still occurs in the deterministic assessment scoring layer;
- changing a calculator value updates the downstream score consistently;
- no LLM-generated numeric claim is used in scoring without deterministic validation.

---

# 19. Recommended v2 architecture

```text
Uploaded evidence / Manual activity entry
                 ↓
        Evidence + Input Resolver
                 ↓
       Normalized Activity Records
                 ↓
     Deterministic Calculator Engine
                 ↓
      Versioned Factor Library
                 ↓
       Canonical Resolved Metrics
                 ↓
        Session Metric Store
             ↙       ↘
 Questionnaire      Metric display /
 pre-fill           calculator UI
             \       /
             MetricBenchmark
                  ↓
          AssessmentScoring
```

Keep the calculator domain separate from the scoring domain.

---

# 20. Product role

The emissions calculator is valuable in v2.0 because it lowers the data-literacy burden on SMEs while improving the quality of quantitative assessment inputs.

Its role is:

> **turn SME operational data into validated assessment metrics.**

Its role is **not**:

> independently decide what sustainability topics matter or how much they should count.

Those decisions remain in the Capstone QuestionBank / configuration / weighting methodology.
