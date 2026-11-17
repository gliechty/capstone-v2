# M8.0: 20-question proportional candidate — pending owner review

Allocation: constrained proportional quotas (20 × eligible share). Fix categories below min(2, available) at that minimum, then redistribute remaining slots proportionally among the others. Repeat if needed. Floor quotas, award spare slots by descending fractional remainder; exact ties use production category order People, Governance, Community, Resources. No category exceeds available questions. No availability ceiling binds in these five cases.

Ranking: descending base_weight × existing profile multiplier (existing product/cap1.5 and rule matching). Equal weights use original QuestionBank row order. Full numeric precision determines rank; displayed weights below are abbreviated. Category scoring weights do not allocate slots or change within-category ranking. Questions are shown grouped by category and ranked within it, not as a proposed UI order.

Fixed comparator uses the same effort pool and weight ranking with Governance6/People4/Resources8/Community2; Food lacks a fourth People item, so its spare slot goes to Resources. This isolates allocation effects: earlier topic/family-balancing suggestions are NOT applied to either set. No family coverage is forced, duplicate removed or dependency repaired. Existing tags, including unreviewed proposals, are unchanged.

## GOLDEN_01_MANUFACTURING

| Category | Eligible | Raw quota | Constrained quota | Floor | Final | Fixed |
|---|---:|---:|---:|---:|---:|---:|
| People | 4 | 2.2222 | 2.1176 | 2 | 2 | 4 |
| Governance | 19 | 10.5556 | 10.0588 | 10 | 10 | 6 |
| Community | 2 | 1.1111 | 2.0000 | 2 | 2 | 2 |
| Resources | 11 | 6.1111 | 5.8235 | 5 | 6 | 8 |

Minimum bindings by round: Community → none. Largest-remainder extra slots: Resources.

| Family | Proportional | Fixed |
|---|---:|---:|
| commit | 1 | 1 |
| measure | 11 | 10 |
| plan | 2 | 1 |
| do | 4 | 5 |
| engage | 2 | 1 |
| none | 0 | 2 |

Shared: 16/20. Only proportional: U-007, U-015, M-014, M-022. Only fixed: U-020, M-029, I-032, I-048.

### Exact proportional set

| ID | Question | Type | Category | Family | Base × multiplier = effective |
|---|---|---|---|---|---|
| U-018 | How many times per year does your company provide health and safety training to employees? | numeric | People | do | 3.5 × 1.25 = 4.375 |
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | People | commit | 3.75 × 1 = 3.75 |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | Governance | measure | 4.26 × 1.15 = 4.899 |
| M-010 | Does your company publish a sustainability or ESG report aligned with a recognised framework (e.g. GRI, ISSB, SASB)? | categorical | Governance | measure | 4.26 × 1.15 = 4.899 |
| M-011 | Does your company disclose the nature of its business operations and principal sustainability-related activities in a publicly available report? | boolean | Governance | measure | 4.26 × 1.15 = 4.899 |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | Governance | do | 4 × 1 = 4 |
| M-001 | Are your Scope 1 and Scope 2 emissions verified by an independent third party? | categorical | Governance | measure | 4 × 1 = 4 |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | Governance | do | 3.97 × 1 = 3.97 |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | Governance | engage | 3.97 × 1 = 3.97 |
| U-015 | Has your company set specific, measurable sustainability targets? | categorical | Governance | plan | 3.93 × 1 = 3.93 |
| M-014 | Does your company track progress against sustainability plans or commitments you have previously disclosed? | categorical | Governance | measure | 3.93 × 1 = 3.93 |
| M-022 | Do you actively track and report progress against your sustainability targets? (If you don't have targets, leave blank) | categorical | Governance | measure | 3.93 × 1 = 3.93 |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | Community | engage | 4 × 1 = 4 |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | Community | do | 3.7 × 1 = 3.7 |
| U-029 | Does your company track the total volume of water it uses or withdraws? | categorical | Resources | measure | 3.61 × 1.35 = 4.8735 |
| U-030 | Does your company track the total amount of waste it generates? | categorical | Resources | measure | 4.08 × 1.15 = 4.692 |
| M-038 | Does your company disclose its spending on sustainability-related research, innovation, or product improvements? | categorical | Resources | measure | 4.26 × 1 = 4.26 |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | Resources | measure | 4.02 × 1 = 4.02 |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | Resources | measure | 4.02 × 1 = 4.02 |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | Resources | plan | 4 × 1 = 4 |

### Review flags (not selection constraints)

- U-004, M-010, M-011: Overlapping public reporting: report existence, framework alignment and disclosed content.
- M-001: Verification scope presupposes an emissions inventory; U-023/U-024 ask about measurement but do not establish completed independent assurance. 
- M-010: Framework-aligned reporting presupposes a sustainability report; differing options may distinguish partial alignment. U-004 included
- M-011: Disclosure of operations/activities presupposes a public report; broader reports may also satisfy its wording. U-004 included
- M-022: Existing wording says leave blank without targets; preserve that condition. U-015 included
- M-014: Progress tracking presupposes previously disclosed plans/commitments; no single prerequisite ID establishes disclosure. 
- Unreviewed model effort proposals selected: U-004, M-010, M-011, U-006, U-014, U-007, U-015, U-034, U-029, U-030, M-038, U-024, U-028. All assignments remain pending owner approval.
- U-018 effort assumption: Training frequency is an ordinary recurring business fact, not a request to total employee attendance or training hours.
- U-019 effort assumption: People boolean sample: labour policy existence is ordinarily known to management.
- U-004 effort assumption: Includes any external sustainability summary or ESG report.
- M-010 effort assumption: Recognised framework means GRI, ISSB, SASB or similar.
- M-011 effort assumption: Includes a publicly available report.
- U-006 effort assumption: Question asks about having an approach, not its results.
- M-001 effort assumption: Asks whether emissions receive third-party verification, not for emissions totals; assume manager knows verification scope.
- U-014 effort assumption: Environmental criteria may be informal or formal.
- U-007 effort assumption: Covers any ongoing engagement, not only formal programs.
- U-015 effort assumption: Targets must be specific and measurable.
- M-014 effort assumption: Asks whether progress is tracked, not to quantify progress; management normally knows its tracking practice.
- M-022 effort assumption: Asks whether target progress is tracked/reported; no numeric progress must be supplied. Existing skip wording preserved.
- U-034 effort assumption: Any support for women-owned businesses counts.
- U-033 effort assumption: Community boolean sample: running or supporting a formal programme is ordinary management knowledge.
- U-029 effort assumption: Tracking may be partial or full.
- U-030 effort assumption: Tracking may be partial or full.
- M-038 effort assumption: Question asks whether spending is disclosed.
- U-023 effort assumption: Resources categorical sample: question asks whether Scope 1 is measured, not for a calculated emissions total.
- U-024 effort assumption: Includes estimated or calculated Scope 2 emissions.
- U-028 effort assumption: Plan may be formal or informal.

Exact fixed comparator IDs, in category/rank order: U-018, U-019, U-020, M-029, U-004, M-010, M-011, U-006, M-001, U-014, U-034, U-033, U-029, U-030, M-038, U-023, U-024, U-028, I-032, I-048. Full wording/weights/flags are in comparison.json and the corresponding fixed CSV.

## GOLDEN_02_FOOD_AGRO

| Category | Eligible | Raw quota | Constrained quota | Floor | Final | Fixed |
|---|---:|---:|---:|---:|---:|---:|
| People | 3 | 1.5789 | 2.0000 | 2 | 2 | 3 |
| Governance | 17 | 8.9474 | 8.2424 | 8 | 8 | 6 |
| Community | 2 | 1.0526 | 2.0000 | 2 | 2 | 2 |
| Resources | 16 | 8.4211 | 7.7576 | 7 | 8 | 9 |

Minimum bindings by round: People, Community → none. Largest-remainder extra slots: Resources.

| Family | Proportional | Fixed |
|---|---:|---:|
| commit | 3 | 3 |
| measure | 9 | 8 |
| plan | 1 | 1 |
| do | 5 | 6 |
| engage | 1 | 1 |
| none | 1 | 1 |

Shared: 18/20. Only proportional: I-008, U-014. Only fixed: U-018, M-037.

### Exact proportional set

| ID | Question | Type | Category | Family | Base × multiplier = effective |
|---|---|---|---|---|---|
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | People | commit | 3.75 × 1 = 3.75 |
| U-020 | On average, how many hours per week does a full-time employee at your company work? | numeric | People | none | 3.75 × 1 = 3.75 |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | Governance | measure | 4.26 × 1 = 4.26 |
| M-010 | Does your company publish a sustainability or ESG report aligned with a recognised framework (e.g. GRI, ISSB, SASB)? | categorical | Governance | measure | 4.26 × 1 = 4.26 |
| U-010 | Has your company made a public commitment to fight corruption and bribery in all your business activities? | categorical | Governance | commit | 3.54 × 1.15 = 4.071 |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | Governance | do | 4 × 1 = 4 |
| M-001 | Are your Scope 1 and Scope 2 emissions verified by an independent third party? | categorical | Governance | measure | 4 × 1 = 4 |
| I-003 | Does your company hold third-party certified animal-welfare standards for its operations? | categorical | Governance | commit | 3.99 × 1 = 3.99 |
| I-008 | Does your company track the survival or health rate of farmed animals or aquatic species in your operations? | boolean | Governance | measure | 3.99 × 1 = 3.99 |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | Governance | do | 3.97 × 1 = 3.97 |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | Community | engage | 4 × 1 = 4 |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | Community | do | 3.7 × 1 = 3.7 |
| I-023 | Do your farming or aquaculture operations follow a biodiversity or ecosystem-management approach (e.g. preventing escapes of farmed species)? | categorical | Resources | do | 3.78 × 1.35 = 5.103 |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | Resources | measure | 4.02 × 1.25 = 5.025 |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | Resources | measure | 4.02 × 1.25 = 5.025 |
| I-040 | Does your company report direct (Scope 1) GHG emissions from agricultural activities (livestock, manure, fertiliser, on-farm fuel)? | categorical | Resources | measure | 4.02 × 1.25 = 5.025 |
| I-041 | Does your company report indirect GHG emissions from purchased energy used in food production or processing (Scope 2)? | boolean | Resources | measure | 4.02 × 1.25 = 5.025 |
| U-030 | Does your company track the total amount of waste it generates? | categorical | Resources | measure | 4.08 × 1.15 = 4.692 |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | Resources | plan | 4 × 1 = 4 |
| M-036 | Does your company actively identify non-renewable materials in its production and work to reduce them? | categorical | Resources | do | 4 × 1 = 4 |

### Review flags (not selection constraints)

- U-023, I-040: General Scope 1 measurement versus agricultural Scope 1 reporting; substantial topic overlap, differing sector/reporting scope.
- U-024, I-041: General Scope 2 measurement versus food-production Scope 2 reporting; substantial topic overlap, differing sector/reporting scope.
- U-004, M-010: Overlapping public reporting: report existence, framework alignment and disclosed content.
- U-028, M-036: Plan to reduce non-renewable/hazardous materials versus active identification/reduction; related progression.
- M-001: Verification scope presupposes an emissions inventory; U-023/U-024 ask about measurement but do not establish completed independent assurance. 
- M-010: Framework-aligned reporting presupposes a sustainability report; differing options may distinguish partial alignment. U-004 included
- Unreviewed model effort proposals selected: U-004, M-010, U-010, U-006, I-003, U-014, U-034, I-023, U-024, I-040, I-041, U-030, U-028, M-036. All assignments remain pending owner approval.
- U-019 effort assumption: People boolean sample: labour policy existence is ordinarily known to management.
- U-020 effort assumption: Typical weekly hours for a full-time employee are normally known from standard schedules; variable overtime may require records.
- U-004 effort assumption: Includes any external sustainability summary or ESG report.
- M-010 effort assumption: Recognised framework means GRI, ISSB, SASB or similar.
- U-010 effort assumption: Includes any formal public statement or policy.
- U-006 effort assumption: Question asks about having an approach, not its results.
- M-001 effort assumption: Asks whether emissions receive third-party verification, not for emissions totals; assume manager knows verification scope.
- I-003 effort assumption: Refers to third-party certified standards, if any.
- I-008 effort assumption: Asks whether animal health is tracked, not for a rate; operational management normally knows the monitoring practice.
- U-014 effort assumption: Environmental criteria may be informal or formal.
- U-034 effort assumption: Any support for women-owned businesses counts.
- U-033 effort assumption: Community boolean sample: running or supporting a formal programme is ordinary management knowledge.
- I-023 effort assumption: Includes escape-prevention or similar practices.
- U-023 effort assumption: Resources categorical sample: question asks whether Scope 1 is measured, not for a calculated emissions total.
- U-024 effort assumption: Includes estimated or calculated Scope 2 emissions.
- I-040 effort assumption: Includes livestock, manure, fertilizer, and on-farm fuel.
- I-041 effort assumption: Includes purchased energy for production or processing.
- U-030 effort assumption: Tracking may be partial or full.
- U-028 effort assumption: Plan may be formal or informal.
- M-036 effort assumption: Question asks whether the company actively does this.

Exact fixed comparator IDs, in category/rank order: U-019, U-020, U-018, U-004, M-010, U-010, U-006, M-001, I-003, U-034, U-033, I-023, U-023, U-024, I-040, I-041, U-030, U-028, M-036, M-037. Full wording/weights/flags are in comparison.json and the corresponding fixed CSV.

## GOLDEN_03_BUSINESS_EXPORT

| Category | Eligible | Raw quota | Constrained quota | Floor | Final | Fixed |
|---|---:|---:|---:|---:|---:|---:|
| People | 6 | 2.9268 | 2.7692 | 2 | 3 | 4 |
| Governance | 22 | 10.7317 | 10.1538 | 10 | 10 | 6 |
| Community | 2 | 0.9756 | 2.0000 | 2 | 2 | 2 |
| Resources | 11 | 5.3659 | 5.0769 | 5 | 5 | 8 |

Minimum bindings by round: Community → none. Largest-remainder extra slots: People.

| Family | Proportional | Fixed |
|---|---:|---:|
| commit | 3 | 3 |
| measure | 9 | 9 |
| plan | 1 | 3 |
| do | 5 | 3 |
| engage | 2 | 1 |
| none | 0 | 1 |

Shared: 16/20. Only proportional: U-006, U-014, U-007, I-005. Only fixed: U-020, M-033, M-035, U-022.

### Exact proportional set

| ID | Question | Type | Category | Family | Base × multiplier = effective |
|---|---|---|---|---|---|
| I-015 | Does your company track gender representation across all levels of management and the wider workforce? | boolean | People | measure | 3.4 × 1.25 = 4.25 |
| I-016 | Does your company conduct regular employee-engagement surveys? | categorical | People | measure | 4 × 1 = 4 |
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | People | commit | 3.75 × 1 = 3.75 |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | Governance | measure | 4.26 × 1.25 = 5.325 |
| M-011 | Does your company disclose the nature of its business operations and principal sustainability-related activities in a publicly available report? | boolean | Governance | measure | 4.26 × 1.25 = 5.325 |
| I-002 | Does your company have an approach to identifying and managing information-security vulnerabilities? | categorical | Governance | do | 3.82 × 1.35 = 5.157 |
| I-007 | Does your company provide employees with regular training on data security and cyber risks? | categorical | Governance | do | 3.82 × 1.35 = 5.157 |
| IM-1 | Does your company have written policies on how it collects, uses, and protects customer data and privacy? | categorical | Governance | commit | 3.64 × 1.35 = 4.914 |
| M-002 | Has your company established mechanisms to prevent illegal or unfair business practices? | categorical | Governance | commit | 3.23 × 1.25 = 4.0375 |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | Governance | do | 4 × 1 = 4 |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | Governance | do | 3.97 × 1 = 3.97 |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | Governance | engage | 3.97 × 1 = 3.97 |
| I-005 | Do you track monetary losses from legal proceedings related to false or deceptive advertising? (Skip if not applicable) | boolean | Governance | measure | 3.95 × 1 = 3.95 |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | Community | engage | 4 × 1 = 4 |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | Community | do | 3.7 × 1 = 3.7 |
| M-038 | Does your company disclose its spending on sustainability-related research, innovation, or product improvements? | categorical | Resources | measure | 4.26 × 1 = 4.26 |
| U-030 | Does your company track the total amount of waste it generates? | categorical | Resources | measure | 4.08 × 1 = 4.08 |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | Resources | measure | 4.02 × 1 = 4.02 |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | Resources | measure | 4.02 × 1 = 4.02 |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | Resources | plan | 4 × 1 = 4 |

### Review flags (not selection constraints)

- U-004, M-011: Overlapping public reporting: report existence, framework alignment and disclosed content.
- M-011: Disclosure of operations/activities presupposes a public report; broader reports may also satisfy its wording. U-004 included
- Unreviewed model effort proposals selected: U-004, M-011, I-002, I-007, IM-1, M-002, U-006, U-014, U-007, U-034, M-038, U-030, U-024, U-028. All assignments remain pending owner approval.
- I-015 effort assumption: Asks whether workforce representation is tracked, not for employee counts or percentages.
- I-016 effort assumption: People categorical sample: recurring employee survey practice is ordinarily known.
- U-019 effort assumption: People boolean sample: labour policy existence is ordinarily known to management.
- U-004 effort assumption: Includes any external sustainability summary or ESG report.
- M-011 effort assumption: Includes a publicly available report.
- I-002 effort assumption: Approach may be informal or formal.
- I-007 effort assumption: Regular means periodic, not one-off.
- IM-1 effort assumption: Policies cover collection, use, and protection.
- M-002 effort assumption: Includes policies, controls, or training mechanisms.
- U-006 effort assumption: Question asks about having an approach, not its results.
- U-014 effort assumption: Environmental criteria may be informal or formal.
- U-007 effort assumption: Covers any ongoing engagement, not only formal programs.
- I-005 effort assumption: Asks whether losses are tracked, not their monetary value; a manager normally knows the business tracking practice.
- U-034 effort assumption: Any support for women-owned businesses counts.
- U-033 effort assumption: Community boolean sample: running or supporting a formal programme is ordinary management knowledge.
- M-038 effort assumption: Question asks whether spending is disclosed.
- U-030 effort assumption: Tracking may be partial or full.
- U-023 effort assumption: Resources categorical sample: question asks whether Scope 1 is measured, not for a calculated emissions total.
- U-024 effort assumption: Includes estimated or calculated Scope 2 emissions.
- U-028 effort assumption: Plan may be formal or informal.

Exact fixed comparator IDs, in category/rank order: I-015, I-016, U-019, U-020, U-004, M-011, I-002, I-007, IM-1, M-002, U-034, U-033, M-038, U-030, U-023, U-024, U-028, M-033, M-035, U-022. Full wording/weights/flags are in comparison.json and the corresponding fixed CSV.

## GOLDEN_04_CONSTRUCTION

| Category | Eligible | Raw quota | Constrained quota | Floor | Final | Fixed |
|---|---:|---:|---:|---:|---:|---:|
| People | 7 | 3.2558 | 3.2308 | 3 | 3 | 4 |
| Governance | 16 | 7.4419 | 7.3846 | 7 | 8 | 6 |
| Community | 4 | 1.8605 | 2.0000 | 2 | 2 | 2 |
| Resources | 16 | 7.4419 | 7.3846 | 7 | 7 | 8 |

Minimum bindings by round: Community → none. Largest-remainder extra slots: Governance.

| Family | Proportional | Fixed |
|---|---:|---:|
| commit | 2 | 3 |
| measure | 8 | 8 |
| plan | 1 | 1 |
| do | 6 | 6 |
| engage | 3 | 2 |
| none | 0 | 0 |

Shared: 18/20. Only proportional: U-014, U-007. Only fixed: U-019, M-037.

### Exact proportional set

| ID | Question | Type | Category | Family | Base × multiplier = effective |
|---|---|---|---|---|---|
| U-018 | How many times per year does your company provide health and safety training to employees? | numeric | People | do | 3.5 × 1.25 = 4.375 |
| IM-3 | Does your company have a formal workplace health and safety management system that covers all your construction sites and worksites? | categorical | People | commit | 3.5 × 1.25 = 4.375 |
| IM-4 | Does your company perform hazard identification and risk assessments for all operational processes? | categorical | People | do | 3.5 × 1.25 = 4.375 |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | Governance | measure | 4.26 × 1.25 = 5.325 |
| M-010 | Does your company publish a sustainability or ESG report aligned with a recognised framework (e.g. GRI, ISSB, SASB)? | categorical | Governance | measure | 4.26 × 1.25 = 5.325 |
| U-010 | Has your company made a public commitment to fight corruption and bribery in all your business activities? | categorical | Governance | commit | 3.54 × 1.15 = 4.071 |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | Governance | do | 4 × 1 = 4 |
| I-014 | Does your company provide Environmental Product Declarations (EPDs) for any of its products? | boolean | Governance | measure | 4 × 1 = 4 |
| M-001 | Are your Scope 1 and Scope 2 emissions verified by an independent third party? | categorical | Governance | measure | 4 × 1 = 4 |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | Governance | do | 3.97 × 1 = 3.97 |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | Governance | engage | 3.97 × 1 = 3.97 |
| I-076 | Does your company perform stakeholder engagement as part of project-planning or site-selection due diligence? | categorical | Community | engage | 3.54 × 1.25 = 4.425 |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | Community | engage | 4 × 1 = 4 |
| U-030 | Does your company track the total amount of waste it generates? | categorical | Resources | measure | 4.08 × 1 = 4.08 |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | Resources | measure | 4.02 × 1 = 4.02 |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | Resources | measure | 4.02 × 1 = 4.02 |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | Resources | plan | 4 × 1 = 4 |
| I-021 | Does your company use environmentally-focused design principles (e.g. green-building standards, eco-design) when designing products or structures? | categorical | Resources | do | 4 × 1 = 4 |
| I-033 | Has your company conducted a Life-Cycle Assessment (LCA) - a formal study of the environmental impact of a product from raw materials to end-of-life - for any of its products or construction materials? | categorical | Resources | measure | 4 × 1 = 4 |
| M-036 | Does your company actively identify non-renewable materials in its production and work to reduce them? | categorical | Resources | do | 4 × 1 = 4 |

### Review flags (not selection constraints)

- U-004, M-010: Overlapping public reporting: report existence, framework alignment and disclosed content.
- U-028, M-036: Plan to reduce non-renewable/hazardous materials versus active identification/reduction; related progression.
- M-001: Verification scope presupposes an emissions inventory; U-023/U-024 ask about measurement but do not establish completed independent assurance. 
- M-010: Framework-aligned reporting presupposes a sustainability report; differing options may distinguish partial alignment. U-004 included
- Unreviewed model effort proposals selected: IM-3, IM-4, U-004, M-010, U-010, U-006, I-014, U-014, U-007, U-034, U-030, U-024, U-028, I-021, M-036. All assignments remain pending owner approval.
- U-018 effort assumption: Training frequency is an ordinary recurring business fact, not a request to total employee attendance or training hours.
- IM-3 effort assumption: System should cover all sites and worksites.
- IM-4 effort assumption: Question asks whether assessments are done for all processes.
- U-004 effort assumption: Includes any external sustainability summary or ESG report.
- M-010 effort assumption: Recognised framework means GRI, ISSB, SASB or similar.
- U-010 effort assumption: Includes any formal public statement or policy.
- U-006 effort assumption: Question asks about having an approach, not its results.
- I-014 effort assumption: Question asks whether any products have EPDs.
- M-001 effort assumption: Asks whether emissions receive third-party verification, not for emissions totals; assume manager knows verification scope.
- U-014 effort assumption: Environmental criteria may be informal or formal.
- U-007 effort assumption: Covers any ongoing engagement, not only formal programs.
- I-076 effort assumption: Community categorical sample: engagement as part of site planning is a known operating practice.
- U-034 effort assumption: Any support for women-owned businesses counts.
- U-030 effort assumption: Tracking may be partial or full.
- U-023 effort assumption: Resources categorical sample: question asks whether Scope 1 is measured, not for a calculated emissions total.
- U-024 effort assumption: Includes estimated or calculated Scope 2 emissions.
- U-028 effort assumption: Plan may be formal or informal.
- I-021 effort assumption: Includes green-building or eco-design practices.
- I-033 effort assumption: Commissioning an LCA for any product is usually known to an informed owner; producing an LCA would be different work.
- M-036 effort assumption: Question asks whether the company actively does this.

Exact fixed comparator IDs, in category/rank order: U-018, IM-3, IM-4, U-019, U-004, M-010, U-010, U-006, I-014, M-001, I-076, U-034, U-030, U-023, U-024, U-028, I-021, I-033, M-036, M-037. Full wording/weights/flags are in comparison.json and the corresponding fixed CSV.

## GOLDEN_05_CONSUMER_GOODS

| Category | Eligible | Raw quota | Constrained quota | Floor | Final | Fixed |
|---|---:|---:|---:|---:|---:|---:|
| People | 4 | 2.2857 | 2.1818 | 2 | 2 | 4 |
| Governance | 17 | 9.7143 | 9.2727 | 9 | 9 | 6 |
| Community | 2 | 1.1429 | 2.0000 | 2 | 2 | 2 |
| Resources | 12 | 6.8571 | 6.5455 | 6 | 7 | 8 |

Minimum bindings by round: Community → none. Largest-remainder extra slots: Resources.

| Family | Proportional | Fixed |
|---|---:|---:|
| commit | 3 | 2 |
| measure | 8 | 9 |
| plan | 2 | 1 |
| do | 4 | 6 |
| engage | 2 | 1 |
| none | 1 | 1 |

Shared: 17/20. Only proportional: U-007, U-015, U-001. Only fixed: M-029, U-018, I-049.

### Exact proportional set

| ID | Question | Type | Category | Family | Base × multiplier = effective |
|---|---|---|---|---|---|
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | People | commit | 3.75 × 1 = 3.75 |
| U-020 | On average, how many hours per week does a full-time employee at your company work? | numeric | People | none | 3.75 × 1 = 3.75 |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | Governance | measure | 4.26 × 1.15 = 4.899 |
| M-010 | Does your company publish a sustainability or ESG report aligned with a recognised framework (e.g. GRI, ISSB, SASB)? | categorical | Governance | measure | 4.26 × 1.15 = 4.899 |
| M-011 | Does your company disclose the nature of its business operations and principal sustainability-related activities in a publicly available report? | boolean | Governance | measure | 4.26 × 1.15 = 4.899 |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | Governance | do | 4 × 1 = 4 |
| M-001 | Are your Scope 1 and Scope 2 emissions verified by an independent third party? | categorical | Governance | measure | 4 × 1 = 4 |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | Governance | do | 3.97 × 1 = 3.97 |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | Governance | engage | 3.97 × 1 = 3.97 |
| U-015 | Has your company set specific, measurable sustainability targets? | categorical | Governance | plan | 3.93 × 1 = 3.93 |
| U-001 | Does your company have a written environmental policy that applies to your own operations? | boolean | Governance | commit | 3.86 × 1 = 3.86 |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | Community | engage | 4 × 1 = 4 |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | Community | do | 3.7 × 1 = 3.7 |
| M-038 | Does your company disclose its spending on sustainability-related research, innovation, or product improvements? | categorical | Resources | measure | 4.26 × 1 = 4.26 |
| U-030 | Does your company track the total amount of waste it generates? | categorical | Resources | measure | 4.08 × 1 = 4.08 |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | Resources | measure | 4.02 × 1 = 4.02 |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | Resources | measure | 4.02 × 1 = 4.02 |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | Resources | plan | 4 × 1 = 4 |
| I-024 | Does your company maintain a list of chemicals or substances that are restricted or banned from use in your products or manufacturing processes? | boolean | Resources | commit | 3.98 × 1 = 3.98 |
| I-036 | Does your company implement input-stream management (controlling chemical recipes/reagents) in its manufacturing? | categorical | Resources | do | 3.98 × 1 = 3.98 |

### Review flags (not selection constraints)

- U-004, M-010, M-011: Overlapping public reporting: report existence, framework alignment and disclosed content.
- M-001: Verification scope presupposes an emissions inventory; U-023/U-024 ask about measurement but do not establish completed independent assurance. 
- M-010: Framework-aligned reporting presupposes a sustainability report; differing options may distinguish partial alignment. U-004 included
- M-011: Disclosure of operations/activities presupposes a public report; broader reports may also satisfy its wording. U-004 included
- Unreviewed model effort proposals selected: U-004, M-010, M-011, U-006, U-014, U-007, U-015, U-034, M-038, U-030, U-024, U-028, I-024, I-036. All assignments remain pending owner approval.
- U-019 effort assumption: People boolean sample: labour policy existence is ordinarily known to management.
- U-020 effort assumption: Typical weekly hours for a full-time employee are normally known from standard schedules; variable overtime may require records.
- U-004 effort assumption: Includes any external sustainability summary or ESG report.
- M-010 effort assumption: Recognised framework means GRI, ISSB, SASB or similar.
- M-011 effort assumption: Includes a publicly available report.
- U-006 effort assumption: Question asks about having an approach, not its results.
- M-001 effort assumption: Asks whether emissions receive third-party verification, not for emissions totals; assume manager knows verification scope.
- U-014 effort assumption: Environmental criteria may be informal or formal.
- U-007 effort assumption: Covers any ongoing engagement, not only formal programs.
- U-015 effort assumption: Targets must be specific and measurable.
- U-001 effort assumption: Governance boolean sample: existence of the business environmental policy is ordinary management knowledge.
- U-034 effort assumption: Any support for women-owned businesses counts.
- U-033 effort assumption: Community boolean sample: running or supporting a formal programme is ordinary management knowledge.
- M-038 effort assumption: Question asks whether spending is disclosed.
- U-030 effort assumption: Tracking may be partial or full.
- U-023 effort assumption: Resources categorical sample: question asks whether Scope 1 is measured, not for a calculated emissions total.
- U-024 effort assumption: Includes estimated or calculated Scope 2 emissions.
- U-028 effort assumption: Plan may be formal or informal.
- I-024 effort assumption: List may be in procurement or manufacturing controls.
- I-036 effort assumption: Includes controlling chemical recipes or reagents.

Exact fixed comparator IDs, in category/rank order: U-019, U-020, M-029, U-018, U-004, M-010, M-011, U-006, M-001, U-014, U-034, U-033, M-038, U-030, U-023, U-024, U-028, I-024, I-036, I-049. Full wording/weights/flags are in comparison.json and the corresponding fixed CSV.
