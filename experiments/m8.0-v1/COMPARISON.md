# M8.0 candidate comparison — pending owner review

| Golden SME | Full | Boolean/categorical | Direct knowledge | Direct numeric/percent | Needs review |
|---|---:|---:|---:|---:|---:|
| 01_MANUFACTURING | 56 | 39 | 36 | 2 | 1 |
| 02_FOOD_AGRO | 55 | 41 | 38 | 2 | 1 |
| 03_BUSINESS_EXPORT | 63 | 44 | 41 | 2 | 1 |
| 04_CONSTRUCTION | 64 | 48 | 43 | 2 | 0 |
| 05_CONSUMER_GOODS | 52 | 38 | 35 | 2 | 0 |

Full uses the unchanged production applicability selector and existing Golden SME profiles. These are questionnaire counts, not scores. No question-count cap is applied. Direct-knowledge selections include unreviewed model proposals; review status accompanies every row. No owner-approved effort assignments are claimed.

## GOLDEN_01_MANUFACTURING

Direct numeric/percent IDs: U-018, U-020. Boolean/categorical questions that are not direct knowledge: U-002, U-008, U-027, I-013, I-037.

| Coverage | Full | Boolean/categorical | Direct knowledge |
|---|---:|---:|---:|
| categories: People | 6 | 2 | 4 |
| categories: Governance | 24 | 22 | 19 |
| categories: Community | 4 | 2 | 2 |
| categories: Resources | 22 | 13 | 11 |
| families: commit | 7 | 7 | 7 |
| families: measure | 25 | 19 | 15 |
| families: plan | 6 | 6 | 5 |
| families: do | 6 | 4 | 5 |
| families: engage | 2 | 2 | 2 |
| families: none | 10 | 1 | 2 |

Lost coverage relative to Full: {"boolean_categorical":{"categories":[],"families":[]},"direct_knowledge":{"categories":[],"families":[]}}.

### full (56)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| U-001 | Does your company have a written environmental policy that applies to your own operations? | boolean | direct_knowledge | Governance | commit | agent_spot_checked_pending_owner_review |
| U-002 | Do you collect and review data on the quality of your sustainability-related information (e.g. checking accuracy of environmental data)? | categorical | record_lookup | Governance | measure | agent_spot_checked_pending_owner_review |
| U-003 | Does your company have a formal grievance or whistleblower mechanism that employees or stakeholders can use to report concerns? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| U-005 | Has your company set a target to reduce its greenhouse gas emissions? | boolean | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | direct_knowledge | Governance | engage | model_proposal_pending_owner_review |
| U-008 | Do you maintain documentation or records of how your environmental data (e.g. emissions, energy) is compiled and checked? | categorical | record_lookup | Governance | measure | model_proposal_pending_owner_review |
| U-009 | Does your company have a code of conduct or social-responsibility standards that you expect your suppliers to follow? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-010 | Has your company made a public commitment to fight corruption and bribery in all your business activities? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-012 | Does your environmental policy address how your products or services affect customers or distributors (downstream impacts)? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-013 | Does your company have a plan to transition its business model to be more low-carbon or sustainable? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-015 | Has your company set specific, measurable sustainability targets? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-018 | How many times per year does your company provide health and safety training to employees? | numeric | direct_knowledge | People | do | agent_spot_checked_pending_owner_review |
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | direct_knowledge | People | commit | agent_spot_checked_pending_owner_review |
| U-020 | On average, how many hours per week does a full-time employee at your company work? | numeric | direct_knowledge | People | none | agent_spot_checked_pending_owner_review |
| U-021 | What percentage of employees voluntarily left your company in the last 12 months? | percent | calculation_aggregation | People | none | agent_spot_checked_pending_owner_review |
| U-022 | Has your company assessed which climate-related risks (e.g. extreme weather, rising costs) could affect its business? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-025 | Does your company track its total energy consumption? | boolean | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-026 | What percentage of your energy comes from renewable sources? (Skip if unsure) | numeric | calculation_aggregation | Resources | none | model_proposal_pending_owner_review |
| U-027 | Have you identified which of your suppliers face significant actual or potential negative environmental impacts? | categorical | record_lookup | Resources | plan | model_proposal_pending_owner_review |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-029 | Does your company track the total volume of water it uses or withdraws? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-030 | Does your company track the total amount of waste it generates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-031 | What percentage of your waste is diverted from landfill (recycled, reused, composted) by mass? Skip if unsure | percent | calculation_aggregation | Resources | none | agent_spot_checked_pending_owner_review |
| U-032 | What percentage of your total waste is hazardous by mass? (Skip if unsure) | percent | calculation_aggregation | Resources | none | model_proposal_pending_owner_review |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | direct_knowledge | Community | do | agent_spot_checked_pending_owner_review |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | direct_knowledge | Community | engage | model_proposal_pending_owner_review |
| U-035 | How many employee volunteer hours did your company support in the last year, on average, per employee? | numeric | calculation_aggregation | Community | none | agent_spot_checked_pending_owner_review |
| U-036 | What percentage of pre-tax profit did your company donate or invest in community initiatives last year? | percent | calculation_aggregation | Community | none | agent_spot_checked_pending_owner_review |
| I-004 | How many process-safety or transport incidents has your company recorded in the past year? | numeric | record_lookup | Governance | measure | model_proposal_pending_owner_review |
| I-013 | Does your company assess the quality of activity data and emission factors used for GHG reporting? | categorical | record_lookup | Governance | measure | model_proposal_pending_owner_review |
| I-025 | Does your company monitor air pollution emissions from your operations - such as smoke, dust, nitrogen oxides, or other particulates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| I-030 | What percentage of your raw materials are sourced from renewable resources? | percent | needs_review | Resources | none | agent_spot_checked_pending_owner_review |
| I-032 | Does your company generate revenue from remanufactured products or remanufacturing services? | boolean | direct_knowledge | Resources | none | model_proposal_pending_owner_review |
| I-037 | For products such as diesel engines or industrial equipment, do you publish NOx and particulate-matter performance data? | categorical | record_lookup | Resources | measure | model_proposal_pending_owner_review |
| I-048 | Does your company operate take-back programmes to collect end-of-life products for remanufacturing or recycling? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-056 | What is your total Scope 1 and Scope 2 greenhouse-gas emissions divided by annual revenue (tCO2e/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| I-062 | What is your total annual energy consumption divided by annual revenue (kWh/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| I-064 | What share of revenue comes from products specifically designed to reduce resource use during their use phase? | percent | calculation_aggregation | Resources | none | model_proposal_pending_owner_review |
| I-069 | What is your total annual water withdrawal divided by annual revenue (m³/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| I-075 | What is your total annual waste generated divided by annual revenue (kg/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| M-001 | Are your Scope 1 and Scope 2 emissions verified by an independent third party? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-003 | Does your company disclose the total number of directors on your board? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-008 | Does your company have a Whistleblowing Policy to protect employees who report concerns? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-010 | Does your company publish a sustainability or ESG report aligned with a recognised framework (e.g. GRI, ISSB, SASB)? | categorical | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-011 | Does your company disclose the nature of its business operations and principal sustainability-related activities in a publicly available report? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-014 | Does your company track progress against sustainability plans or commitments you have previously disclosed? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-018 | How many substantiated customer-privacy-breach complaints has your company received in the past year? | numeric | record_lookup | Governance | measure | agent_spot_checked_pending_owner_review |
| M-022 | Do you actively track and report progress against your sustainability targets? (If you don't have targets, leave blank) | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-024 | On average, how many training hours does each employee receive per year? | numeric | calculation_aggregation | People | do | agent_spot_checked_pending_owner_review |
| M-029 | Does your company record child-labour or forced-labour incidents identified in your operations or supply chain? | categorical | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| M-038 | Does your company disclose its spending on sustainability-related research, innovation, or product improvements? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |

### boolean_categorical (39)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| U-001 | Does your company have a written environmental policy that applies to your own operations? | boolean | direct_knowledge | Governance | commit | agent_spot_checked_pending_owner_review |
| U-002 | Do you collect and review data on the quality of your sustainability-related information (e.g. checking accuracy of environmental data)? | categorical | record_lookup | Governance | measure | agent_spot_checked_pending_owner_review |
| U-003 | Does your company have a formal grievance or whistleblower mechanism that employees or stakeholders can use to report concerns? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| U-005 | Has your company set a target to reduce its greenhouse gas emissions? | boolean | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | direct_knowledge | Governance | engage | model_proposal_pending_owner_review |
| U-008 | Do you maintain documentation or records of how your environmental data (e.g. emissions, energy) is compiled and checked? | categorical | record_lookup | Governance | measure | model_proposal_pending_owner_review |
| U-009 | Does your company have a code of conduct or social-responsibility standards that you expect your suppliers to follow? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-010 | Has your company made a public commitment to fight corruption and bribery in all your business activities? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-012 | Does your environmental policy address how your products or services affect customers or distributors (downstream impacts)? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-013 | Does your company have a plan to transition its business model to be more low-carbon or sustainable? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-015 | Has your company set specific, measurable sustainability targets? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | direct_knowledge | People | commit | agent_spot_checked_pending_owner_review |
| U-022 | Has your company assessed which climate-related risks (e.g. extreme weather, rising costs) could affect its business? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-025 | Does your company track its total energy consumption? | boolean | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-027 | Have you identified which of your suppliers face significant actual or potential negative environmental impacts? | categorical | record_lookup | Resources | plan | model_proposal_pending_owner_review |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-029 | Does your company track the total volume of water it uses or withdraws? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-030 | Does your company track the total amount of waste it generates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | direct_knowledge | Community | do | agent_spot_checked_pending_owner_review |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | direct_knowledge | Community | engage | model_proposal_pending_owner_review |
| I-013 | Does your company assess the quality of activity data and emission factors used for GHG reporting? | categorical | record_lookup | Governance | measure | model_proposal_pending_owner_review |
| I-025 | Does your company monitor air pollution emissions from your operations - such as smoke, dust, nitrogen oxides, or other particulates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| I-032 | Does your company generate revenue from remanufactured products or remanufacturing services? | boolean | direct_knowledge | Resources | none | model_proposal_pending_owner_review |
| I-037 | For products such as diesel engines or industrial equipment, do you publish NOx and particulate-matter performance data? | categorical | record_lookup | Resources | measure | model_proposal_pending_owner_review |
| I-048 | Does your company operate take-back programmes to collect end-of-life products for remanufacturing or recycling? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| M-001 | Are your Scope 1 and Scope 2 emissions verified by an independent third party? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-003 | Does your company disclose the total number of directors on your board? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-008 | Does your company have a Whistleblowing Policy to protect employees who report concerns? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-010 | Does your company publish a sustainability or ESG report aligned with a recognised framework (e.g. GRI, ISSB, SASB)? | categorical | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-011 | Does your company disclose the nature of its business operations and principal sustainability-related activities in a publicly available report? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-014 | Does your company track progress against sustainability plans or commitments you have previously disclosed? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-022 | Do you actively track and report progress against your sustainability targets? (If you don't have targets, leave blank) | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-029 | Does your company record child-labour or forced-labour incidents identified in your operations or supply chain? | categorical | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| M-038 | Does your company disclose its spending on sustainability-related research, innovation, or product improvements? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |

### direct_knowledge (36)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| U-001 | Does your company have a written environmental policy that applies to your own operations? | boolean | direct_knowledge | Governance | commit | agent_spot_checked_pending_owner_review |
| U-003 | Does your company have a formal grievance or whistleblower mechanism that employees or stakeholders can use to report concerns? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| U-005 | Has your company set a target to reduce its greenhouse gas emissions? | boolean | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | direct_knowledge | Governance | engage | model_proposal_pending_owner_review |
| U-009 | Does your company have a code of conduct or social-responsibility standards that you expect your suppliers to follow? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-010 | Has your company made a public commitment to fight corruption and bribery in all your business activities? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-012 | Does your environmental policy address how your products or services affect customers or distributors (downstream impacts)? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-013 | Does your company have a plan to transition its business model to be more low-carbon or sustainable? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-015 | Has your company set specific, measurable sustainability targets? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-018 | How many times per year does your company provide health and safety training to employees? | numeric | direct_knowledge | People | do | agent_spot_checked_pending_owner_review |
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | direct_knowledge | People | commit | agent_spot_checked_pending_owner_review |
| U-020 | On average, how many hours per week does a full-time employee at your company work? | numeric | direct_knowledge | People | none | agent_spot_checked_pending_owner_review |
| U-022 | Has your company assessed which climate-related risks (e.g. extreme weather, rising costs) could affect its business? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-025 | Does your company track its total energy consumption? | boolean | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-029 | Does your company track the total volume of water it uses or withdraws? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-030 | Does your company track the total amount of waste it generates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | direct_knowledge | Community | do | agent_spot_checked_pending_owner_review |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | direct_knowledge | Community | engage | model_proposal_pending_owner_review |
| I-025 | Does your company monitor air pollution emissions from your operations - such as smoke, dust, nitrogen oxides, or other particulates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| I-032 | Does your company generate revenue from remanufactured products or remanufacturing services? | boolean | direct_knowledge | Resources | none | model_proposal_pending_owner_review |
| I-048 | Does your company operate take-back programmes to collect end-of-life products for remanufacturing or recycling? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| M-001 | Are your Scope 1 and Scope 2 emissions verified by an independent third party? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-003 | Does your company disclose the total number of directors on your board? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-008 | Does your company have a Whistleblowing Policy to protect employees who report concerns? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-010 | Does your company publish a sustainability or ESG report aligned with a recognised framework (e.g. GRI, ISSB, SASB)? | categorical | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-011 | Does your company disclose the nature of its business operations and principal sustainability-related activities in a publicly available report? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-014 | Does your company track progress against sustainability plans or commitments you have previously disclosed? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-022 | Do you actively track and report progress against your sustainability targets? (If you don't have targets, leave blank) | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-029 | Does your company record child-labour or forced-labour incidents identified in your operations or supply chain? | categorical | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| M-038 | Does your company disclose its spending on sustainability-related research, innovation, or product improvements? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |

### needs_review (1)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| I-030 | What percentage of your raw materials are sourced from renewable resources? | percent | needs_review | Resources | none | agent_spot_checked_pending_owner_review |

## GOLDEN_02_FOOD_AGRO

Direct numeric/percent IDs: U-018, U-020. Boolean/categorical questions that are not direct knowledge: U-002, U-008, U-027, I-010, I-035.

| Coverage | Full | Boolean/categorical | Direct knowledge |
|---|---:|---:|---:|
| categories: People | 5 | 1 | 3 |
| categories: Governance | 20 | 20 | 17 |
| categories: Community | 4 | 2 | 2 |
| categories: Resources | 26 | 18 | 16 |
| families: commit | 8 | 8 | 7 |
| families: measure | 21 | 16 | 13 |
| families: plan | 7 | 7 | 6 |
| families: do | 9 | 8 | 9 |
| families: engage | 2 | 2 | 2 |
| families: none | 8 | 0 | 1 |

Lost coverage relative to Full: {"boolean_categorical":{"categories":[],"families":[]},"direct_knowledge":{"categories":[],"families":[]}}.

### full (55)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| U-001 | Does your company have a written environmental policy that applies to your own operations? | boolean | direct_knowledge | Governance | commit | agent_spot_checked_pending_owner_review |
| U-002 | Do you collect and review data on the quality of your sustainability-related information (e.g. checking accuracy of environmental data)? | categorical | record_lookup | Governance | measure | agent_spot_checked_pending_owner_review |
| U-003 | Does your company have a formal grievance or whistleblower mechanism that employees or stakeholders can use to report concerns? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| U-005 | Has your company set a target to reduce its greenhouse gas emissions? | boolean | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | direct_knowledge | Governance | engage | model_proposal_pending_owner_review |
| U-008 | Do you maintain documentation or records of how your environmental data (e.g. emissions, energy) is compiled and checked? | categorical | record_lookup | Governance | measure | model_proposal_pending_owner_review |
| U-009 | Does your company have a code of conduct or social-responsibility standards that you expect your suppliers to follow? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-010 | Has your company made a public commitment to fight corruption and bribery in all your business activities? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-012 | Does your environmental policy address how your products or services affect customers or distributors (downstream impacts)? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-013 | Does your company have a plan to transition its business model to be more low-carbon or sustainable? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-015 | Has your company set specific, measurable sustainability targets? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-018 | How many times per year does your company provide health and safety training to employees? | numeric | direct_knowledge | People | do | agent_spot_checked_pending_owner_review |
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | direct_knowledge | People | commit | agent_spot_checked_pending_owner_review |
| U-020 | On average, how many hours per week does a full-time employee at your company work? | numeric | direct_knowledge | People | none | agent_spot_checked_pending_owner_review |
| U-021 | What percentage of employees voluntarily left your company in the last 12 months? | percent | calculation_aggregation | People | none | agent_spot_checked_pending_owner_review |
| U-022 | Has your company assessed which climate-related risks (e.g. extreme weather, rising costs) could affect its business? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-025 | Does your company track its total energy consumption? | boolean | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-026 | What percentage of your energy comes from renewable sources? (Skip if unsure) | numeric | calculation_aggregation | Resources | none | model_proposal_pending_owner_review |
| U-027 | Have you identified which of your suppliers face significant actual or potential negative environmental impacts? | categorical | record_lookup | Resources | plan | model_proposal_pending_owner_review |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-029 | Does your company track the total volume of water it uses or withdraws? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-030 | Does your company track the total amount of waste it generates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-031 | What percentage of your waste is diverted from landfill (recycled, reused, composted) by mass? Skip if unsure | percent | calculation_aggregation | Resources | none | agent_spot_checked_pending_owner_review |
| U-032 | What percentage of your total waste is hazardous by mass? (Skip if unsure) | percent | calculation_aggregation | Resources | none | model_proposal_pending_owner_review |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | direct_knowledge | Community | do | agent_spot_checked_pending_owner_review |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | direct_knowledge | Community | engage | model_proposal_pending_owner_review |
| U-035 | How many employee volunteer hours did your company support in the last year, on average, per employee? | numeric | calculation_aggregation | Community | none | agent_spot_checked_pending_owner_review |
| U-036 | What percentage of pre-tax profit did your company donate or invest in community initiatives last year? | percent | calculation_aggregation | Community | none | agent_spot_checked_pending_owner_review |
| I-003 | Does your company hold third-party certified animal-welfare standards for its operations? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| I-006 | Does your company report the rate of major non-conformances found during food-safety audits (for example those conducted to internationally recognised standards)? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| I-008 | Does your company track the survival or health rate of farmed animals or aquatic species in your operations? | boolean | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| I-010 | Does your company collect primary (directly measured) data for processes under its ownership or control for GHG reporting? | categorical | record_lookup | Governance | measure | agent_spot_checked_pending_owner_review |
| I-022 | What % of your products contain genetically modified organisms (GMOs)? | percent | needs_review | Resources | none | agent_spot_checked_pending_owner_review |
| I-023 | Do your farming or aquaculture operations follow a biodiversity or ecosystem-management approach (e.g. preventing escapes of farmed species)? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-026 | Does your company use cover crops or other carbon-sequestration practices on its agricultural land? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-029 | Does your company use land-management practices (e.g. conservation tillage, cover crops) to improve soil carbon or reduce emissions? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-031 | Does your company have a soil-management plan for its farming or agricultural operations? | boolean | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| I-035 | Does your company comply with all applicable animal-welfare laws and regulations? | categorical | record_lookup | Resources | commit | agent_spot_checked_pending_owner_review |
| I-040 | Does your company report direct (Scope 1) GHG emissions from agricultural activities (livestock, manure, fertiliser, on-farm fuel)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| I-041 | Does your company report indirect GHG emissions from purchased energy used in food production or processing (Scope 2)? | boolean | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| I-047 | Has your company identified the main threats to soil health in your agricultural activities? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| I-055 | What is your total Scope 1 and Scope 2 greenhouse-gas emissions divided by annual revenue (tCO2e/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| I-061 | What is your total annual energy consumption divided by annual revenue (kWh/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| I-068 | What is your total annual water withdrawal divided by annual revenue (m³/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| I-074 | What is your total annual waste generated divided by annual revenue (kg/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| M-001 | Are your Scope 1 and Scope 2 emissions verified by an independent third party? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-010 | Does your company publish a sustainability or ESG report aligned with a recognised framework (e.g. GRI, ISSB, SASB)? | categorical | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-028 | How many recordable workplace injuries occurred per 100 employees in the past year? | numeric | calculation_aggregation | People | measure | model_proposal_pending_owner_review |
| M-036 | Does your company actively identify non-renewable materials in its production and work to reduce them? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| M-037 | Does your company use eco-friendly or biodegradable packaging for its products? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |

### boolean_categorical (41)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| U-001 | Does your company have a written environmental policy that applies to your own operations? | boolean | direct_knowledge | Governance | commit | agent_spot_checked_pending_owner_review |
| U-002 | Do you collect and review data on the quality of your sustainability-related information (e.g. checking accuracy of environmental data)? | categorical | record_lookup | Governance | measure | agent_spot_checked_pending_owner_review |
| U-003 | Does your company have a formal grievance or whistleblower mechanism that employees or stakeholders can use to report concerns? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| U-005 | Has your company set a target to reduce its greenhouse gas emissions? | boolean | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | direct_knowledge | Governance | engage | model_proposal_pending_owner_review |
| U-008 | Do you maintain documentation or records of how your environmental data (e.g. emissions, energy) is compiled and checked? | categorical | record_lookup | Governance | measure | model_proposal_pending_owner_review |
| U-009 | Does your company have a code of conduct or social-responsibility standards that you expect your suppliers to follow? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-010 | Has your company made a public commitment to fight corruption and bribery in all your business activities? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-012 | Does your environmental policy address how your products or services affect customers or distributors (downstream impacts)? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-013 | Does your company have a plan to transition its business model to be more low-carbon or sustainable? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-015 | Has your company set specific, measurable sustainability targets? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | direct_knowledge | People | commit | agent_spot_checked_pending_owner_review |
| U-022 | Has your company assessed which climate-related risks (e.g. extreme weather, rising costs) could affect its business? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-025 | Does your company track its total energy consumption? | boolean | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-027 | Have you identified which of your suppliers face significant actual or potential negative environmental impacts? | categorical | record_lookup | Resources | plan | model_proposal_pending_owner_review |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-029 | Does your company track the total volume of water it uses or withdraws? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-030 | Does your company track the total amount of waste it generates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | direct_knowledge | Community | do | agent_spot_checked_pending_owner_review |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | direct_knowledge | Community | engage | model_proposal_pending_owner_review |
| I-003 | Does your company hold third-party certified animal-welfare standards for its operations? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| I-006 | Does your company report the rate of major non-conformances found during food-safety audits (for example those conducted to internationally recognised standards)? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| I-008 | Does your company track the survival or health rate of farmed animals or aquatic species in your operations? | boolean | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| I-010 | Does your company collect primary (directly measured) data for processes under its ownership or control for GHG reporting? | categorical | record_lookup | Governance | measure | agent_spot_checked_pending_owner_review |
| I-023 | Do your farming or aquaculture operations follow a biodiversity or ecosystem-management approach (e.g. preventing escapes of farmed species)? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-026 | Does your company use cover crops or other carbon-sequestration practices on its agricultural land? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-029 | Does your company use land-management practices (e.g. conservation tillage, cover crops) to improve soil carbon or reduce emissions? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-031 | Does your company have a soil-management plan for its farming or agricultural operations? | boolean | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| I-035 | Does your company comply with all applicable animal-welfare laws and regulations? | categorical | record_lookup | Resources | commit | agent_spot_checked_pending_owner_review |
| I-040 | Does your company report direct (Scope 1) GHG emissions from agricultural activities (livestock, manure, fertiliser, on-farm fuel)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| I-041 | Does your company report indirect GHG emissions from purchased energy used in food production or processing (Scope 2)? | boolean | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| I-047 | Has your company identified the main threats to soil health in your agricultural activities? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| M-001 | Are your Scope 1 and Scope 2 emissions verified by an independent third party? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-010 | Does your company publish a sustainability or ESG report aligned with a recognised framework (e.g. GRI, ISSB, SASB)? | categorical | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-036 | Does your company actively identify non-renewable materials in its production and work to reduce them? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| M-037 | Does your company use eco-friendly or biodegradable packaging for its products? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |

### direct_knowledge (38)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| U-001 | Does your company have a written environmental policy that applies to your own operations? | boolean | direct_knowledge | Governance | commit | agent_spot_checked_pending_owner_review |
| U-003 | Does your company have a formal grievance or whistleblower mechanism that employees or stakeholders can use to report concerns? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| U-005 | Has your company set a target to reduce its greenhouse gas emissions? | boolean | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | direct_knowledge | Governance | engage | model_proposal_pending_owner_review |
| U-009 | Does your company have a code of conduct or social-responsibility standards that you expect your suppliers to follow? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-010 | Has your company made a public commitment to fight corruption and bribery in all your business activities? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-012 | Does your environmental policy address how your products or services affect customers or distributors (downstream impacts)? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-013 | Does your company have a plan to transition its business model to be more low-carbon or sustainable? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-015 | Has your company set specific, measurable sustainability targets? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-018 | How many times per year does your company provide health and safety training to employees? | numeric | direct_knowledge | People | do | agent_spot_checked_pending_owner_review |
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | direct_knowledge | People | commit | agent_spot_checked_pending_owner_review |
| U-020 | On average, how many hours per week does a full-time employee at your company work? | numeric | direct_knowledge | People | none | agent_spot_checked_pending_owner_review |
| U-022 | Has your company assessed which climate-related risks (e.g. extreme weather, rising costs) could affect its business? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-025 | Does your company track its total energy consumption? | boolean | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-029 | Does your company track the total volume of water it uses or withdraws? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-030 | Does your company track the total amount of waste it generates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | direct_knowledge | Community | do | agent_spot_checked_pending_owner_review |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | direct_knowledge | Community | engage | model_proposal_pending_owner_review |
| I-003 | Does your company hold third-party certified animal-welfare standards for its operations? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| I-006 | Does your company report the rate of major non-conformances found during food-safety audits (for example those conducted to internationally recognised standards)? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| I-008 | Does your company track the survival or health rate of farmed animals or aquatic species in your operations? | boolean | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| I-023 | Do your farming or aquaculture operations follow a biodiversity or ecosystem-management approach (e.g. preventing escapes of farmed species)? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-026 | Does your company use cover crops or other carbon-sequestration practices on its agricultural land? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-029 | Does your company use land-management practices (e.g. conservation tillage, cover crops) to improve soil carbon or reduce emissions? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-031 | Does your company have a soil-management plan for its farming or agricultural operations? | boolean | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| I-040 | Does your company report direct (Scope 1) GHG emissions from agricultural activities (livestock, manure, fertiliser, on-farm fuel)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| I-041 | Does your company report indirect GHG emissions from purchased energy used in food production or processing (Scope 2)? | boolean | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| I-047 | Has your company identified the main threats to soil health in your agricultural activities? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| M-001 | Are your Scope 1 and Scope 2 emissions verified by an independent third party? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-010 | Does your company publish a sustainability or ESG report aligned with a recognised framework (e.g. GRI, ISSB, SASB)? | categorical | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-036 | Does your company actively identify non-renewable materials in its production and work to reduce them? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| M-037 | Does your company use eco-friendly or biodegradable packaging for its products? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |

### needs_review (1)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| I-022 | What % of your products contain genetically modified organisms (GMOs)? | percent | needs_review | Resources | none | agent_spot_checked_pending_owner_review |

## GOLDEN_03_BUSINESS_EXPORT

Direct numeric/percent IDs: U-018, U-020. Boolean/categorical questions that are not direct knowledge: U-002, U-008, U-027, M-007, M-017.

| Coverage | Full | Boolean/categorical | Direct knowledge |
|---|---:|---:|---:|
| categories: People | 11 | 4 | 6 |
| categories: Governance | 28 | 26 | 22 |
| categories: Community | 5 | 2 | 2 |
| categories: Resources | 19 | 12 | 11 |
| families: commit | 11 | 11 | 10 |
| families: measure | 21 | 16 | 14 |
| families: plan | 7 | 7 | 6 |
| families: do | 10 | 8 | 8 |
| families: engage | 2 | 2 | 2 |
| families: none | 12 | 0 | 1 |

Lost coverage relative to Full: {"boolean_categorical":{"categories":[],"families":[]},"direct_knowledge":{"categories":[],"families":[]}}.

### full (63)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| U-001 | Does your company have a written environmental policy that applies to your own operations? | boolean | direct_knowledge | Governance | commit | agent_spot_checked_pending_owner_review |
| U-002 | Do you collect and review data on the quality of your sustainability-related information (e.g. checking accuracy of environmental data)? | categorical | record_lookup | Governance | measure | agent_spot_checked_pending_owner_review |
| U-003 | Does your company have a formal grievance or whistleblower mechanism that employees or stakeholders can use to report concerns? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| U-005 | Has your company set a target to reduce its greenhouse gas emissions? | boolean | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | direct_knowledge | Governance | engage | model_proposal_pending_owner_review |
| U-008 | Do you maintain documentation or records of how your environmental data (e.g. emissions, energy) is compiled and checked? | categorical | record_lookup | Governance | measure | model_proposal_pending_owner_review |
| U-009 | Does your company have a code of conduct or social-responsibility standards that you expect your suppliers to follow? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-010 | Has your company made a public commitment to fight corruption and bribery in all your business activities? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-012 | Does your environmental policy address how your products or services affect customers or distributors (downstream impacts)? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-013 | Does your company have a plan to transition its business model to be more low-carbon or sustainable? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-015 | Has your company set specific, measurable sustainability targets? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-018 | How many times per year does your company provide health and safety training to employees? | numeric | direct_knowledge | People | do | agent_spot_checked_pending_owner_review |
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | direct_knowledge | People | commit | agent_spot_checked_pending_owner_review |
| U-020 | On average, how many hours per week does a full-time employee at your company work? | numeric | direct_knowledge | People | none | agent_spot_checked_pending_owner_review |
| U-021 | What percentage of employees voluntarily left your company in the last 12 months? | percent | calculation_aggregation | People | none | agent_spot_checked_pending_owner_review |
| U-022 | Has your company assessed which climate-related risks (e.g. extreme weather, rising costs) could affect its business? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-025 | Does your company track its total energy consumption? | boolean | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-026 | What percentage of your energy comes from renewable sources? (Skip if unsure) | numeric | calculation_aggregation | Resources | none | model_proposal_pending_owner_review |
| U-027 | Have you identified which of your suppliers face significant actual or potential negative environmental impacts? | categorical | record_lookup | Resources | plan | model_proposal_pending_owner_review |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-029 | Does your company track the total volume of water it uses or withdraws? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-030 | Does your company track the total amount of waste it generates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-031 | What percentage of your waste is diverted from landfill (recycled, reused, composted) by mass? Skip if unsure | percent | calculation_aggregation | Resources | none | agent_spot_checked_pending_owner_review |
| U-032 | What percentage of your total waste is hazardous by mass? (Skip if unsure) | percent | calculation_aggregation | Resources | none | model_proposal_pending_owner_review |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | direct_knowledge | Community | do | agent_spot_checked_pending_owner_review |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | direct_knowledge | Community | engage | model_proposal_pending_owner_review |
| U-035 | How many employee volunteer hours did your company support in the last year, on average, per employee? | numeric | calculation_aggregation | Community | none | agent_spot_checked_pending_owner_review |
| U-036 | What percentage of pre-tax profit did your company donate or invest in community initiatives last year? | percent | calculation_aggregation | Community | none | agent_spot_checked_pending_owner_review |
| I-002 | Does your company have an approach to identifying and managing information-security vulnerabilities? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| I-005 | Do you track monetary losses from legal proceedings related to false or deceptive advertising? (Skip if not applicable) | boolean | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| I-007 | Does your company provide employees with regular training on data security and cyber risks? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| I-015 | Does your company track gender representation across all levels of management and the wider workforce? | boolean | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| I-016 | Does your company conduct regular employee-engagement surveys? | categorical | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| I-017 | What percentage of executive and senior management positions are held by women? | percent | calculation_aggregation | People | none | model_proposal_pending_owner_review |
| I-020 | What was your total (voluntary + involuntary) employee turnover rate (%) in the last 12 months? | percent | calculation_aggregation | People | none | model_proposal_pending_owner_review |
| I-052 | What is your total Scope 1 and Scope 2 greenhouse-gas emissions divided by annual revenue (tCO2e/USD)? | numeric | calculation_aggregation | Resources | measure | agent_spot_checked_pending_owner_review |
| I-058 | What is your total annual energy consumption divided by annual revenue (kWh/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| I-065 | What is your total annual water withdrawal divided by annual revenue (m³/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| I-071 | What is your total annual waste generated divided by annual revenue (kg/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| IM-1 | Does your company have written policies on how it collects, uses, and protects customer data and privacy? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-002 | Has your company established mechanisms to prevent illegal or unfair business practices? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-003 | Does your company disclose the total number of directors on your board? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-007 | Does your company ensure timely payment of all applicable taxes, levies, and duties? | categorical | record_lookup | Governance | do | agent_spot_checked_pending_owner_review |
| M-008 | Does your company have a Whistleblowing Policy to protect employees who report concerns? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-011 | Does your company disclose the nature of its business operations and principal sustainability-related activities in a publicly available report? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-015 | Does your company have written procedures for sustainable sourcing of inputs from suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| M-016 | Does your company maintain a written anti-corruption and anti-bribery policy? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-017 | Do any members of your board or senior leadership have sustainability-linked incentives in their compensation? | categorical | record_lookup | Governance | commit | model_proposal_pending_owner_review |
| M-018 | How many substantiated customer-privacy-breach complaints has your company received in the past year? | numeric | record_lookup | Governance | measure | agent_spot_checked_pending_owner_review |
| M-023 | What % of your input materials are sustainably sourced (e.g. certified, recycled, or local) by estimated spend? | percent | calculation_aggregation | Governance | none | agent_spot_checked_pending_owner_review |
| M-024 | On average, how many training hours does each employee receive per year? | numeric | calculation_aggregation | People | do | agent_spot_checked_pending_owner_review |
| M-029 | Does your company record child-labour or forced-labour incidents identified in your operations or supply chain? | categorical | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| M-031 | What percentage of your workers are covered by collective bargaining agreements? | percent | calculation_aggregation | People | none | model_proposal_pending_owner_review |
| M-033 | Does your company have a plan to ensure its business model is compatible with the transition to a 1.5°C climate pathway? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| M-035 | Has your company explained why climate change is or is not considered a material topic for your business? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| M-038 | Does your company disclose its spending on sustainability-related research, innovation, or product improvements? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| M-039 | Has your company implemented a Zero-Liquid-Discharge mechanism or similar advanced water-treatment system? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| M-040 | What percentage of your input materials are sourced directly from small-scale or micro enterprises? | percent | needs_review | Community | none | agent_spot_checked_pending_owner_review |

### boolean_categorical (44)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| U-001 | Does your company have a written environmental policy that applies to your own operations? | boolean | direct_knowledge | Governance | commit | agent_spot_checked_pending_owner_review |
| U-002 | Do you collect and review data on the quality of your sustainability-related information (e.g. checking accuracy of environmental data)? | categorical | record_lookup | Governance | measure | agent_spot_checked_pending_owner_review |
| U-003 | Does your company have a formal grievance or whistleblower mechanism that employees or stakeholders can use to report concerns? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| U-005 | Has your company set a target to reduce its greenhouse gas emissions? | boolean | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | direct_knowledge | Governance | engage | model_proposal_pending_owner_review |
| U-008 | Do you maintain documentation or records of how your environmental data (e.g. emissions, energy) is compiled and checked? | categorical | record_lookup | Governance | measure | model_proposal_pending_owner_review |
| U-009 | Does your company have a code of conduct or social-responsibility standards that you expect your suppliers to follow? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-010 | Has your company made a public commitment to fight corruption and bribery in all your business activities? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-012 | Does your environmental policy address how your products or services affect customers or distributors (downstream impacts)? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-013 | Does your company have a plan to transition its business model to be more low-carbon or sustainable? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-015 | Has your company set specific, measurable sustainability targets? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | direct_knowledge | People | commit | agent_spot_checked_pending_owner_review |
| U-022 | Has your company assessed which climate-related risks (e.g. extreme weather, rising costs) could affect its business? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-025 | Does your company track its total energy consumption? | boolean | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-027 | Have you identified which of your suppliers face significant actual or potential negative environmental impacts? | categorical | record_lookup | Resources | plan | model_proposal_pending_owner_review |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-029 | Does your company track the total volume of water it uses or withdraws? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-030 | Does your company track the total amount of waste it generates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | direct_knowledge | Community | do | agent_spot_checked_pending_owner_review |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | direct_knowledge | Community | engage | model_proposal_pending_owner_review |
| I-002 | Does your company have an approach to identifying and managing information-security vulnerabilities? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| I-005 | Do you track monetary losses from legal proceedings related to false or deceptive advertising? (Skip if not applicable) | boolean | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| I-007 | Does your company provide employees with regular training on data security and cyber risks? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| I-015 | Does your company track gender representation across all levels of management and the wider workforce? | boolean | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| I-016 | Does your company conduct regular employee-engagement surveys? | categorical | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| IM-1 | Does your company have written policies on how it collects, uses, and protects customer data and privacy? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-002 | Has your company established mechanisms to prevent illegal or unfair business practices? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-003 | Does your company disclose the total number of directors on your board? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-007 | Does your company ensure timely payment of all applicable taxes, levies, and duties? | categorical | record_lookup | Governance | do | agent_spot_checked_pending_owner_review |
| M-008 | Does your company have a Whistleblowing Policy to protect employees who report concerns? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-011 | Does your company disclose the nature of its business operations and principal sustainability-related activities in a publicly available report? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-015 | Does your company have written procedures for sustainable sourcing of inputs from suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| M-016 | Does your company maintain a written anti-corruption and anti-bribery policy? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-017 | Do any members of your board or senior leadership have sustainability-linked incentives in their compensation? | categorical | record_lookup | Governance | commit | model_proposal_pending_owner_review |
| M-029 | Does your company record child-labour or forced-labour incidents identified in your operations or supply chain? | categorical | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| M-033 | Does your company have a plan to ensure its business model is compatible with the transition to a 1.5°C climate pathway? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| M-035 | Has your company explained why climate change is or is not considered a material topic for your business? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| M-038 | Does your company disclose its spending on sustainability-related research, innovation, or product improvements? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| M-039 | Has your company implemented a Zero-Liquid-Discharge mechanism or similar advanced water-treatment system? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |

### direct_knowledge (41)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| U-001 | Does your company have a written environmental policy that applies to your own operations? | boolean | direct_knowledge | Governance | commit | agent_spot_checked_pending_owner_review |
| U-003 | Does your company have a formal grievance or whistleblower mechanism that employees or stakeholders can use to report concerns? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| U-005 | Has your company set a target to reduce its greenhouse gas emissions? | boolean | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | direct_knowledge | Governance | engage | model_proposal_pending_owner_review |
| U-009 | Does your company have a code of conduct or social-responsibility standards that you expect your suppliers to follow? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-010 | Has your company made a public commitment to fight corruption and bribery in all your business activities? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-012 | Does your environmental policy address how your products or services affect customers or distributors (downstream impacts)? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-013 | Does your company have a plan to transition its business model to be more low-carbon or sustainable? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-015 | Has your company set specific, measurable sustainability targets? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-018 | How many times per year does your company provide health and safety training to employees? | numeric | direct_knowledge | People | do | agent_spot_checked_pending_owner_review |
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | direct_knowledge | People | commit | agent_spot_checked_pending_owner_review |
| U-020 | On average, how many hours per week does a full-time employee at your company work? | numeric | direct_knowledge | People | none | agent_spot_checked_pending_owner_review |
| U-022 | Has your company assessed which climate-related risks (e.g. extreme weather, rising costs) could affect its business? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-025 | Does your company track its total energy consumption? | boolean | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-029 | Does your company track the total volume of water it uses or withdraws? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-030 | Does your company track the total amount of waste it generates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | direct_knowledge | Community | do | agent_spot_checked_pending_owner_review |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | direct_knowledge | Community | engage | model_proposal_pending_owner_review |
| I-002 | Does your company have an approach to identifying and managing information-security vulnerabilities? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| I-005 | Do you track monetary losses from legal proceedings related to false or deceptive advertising? (Skip if not applicable) | boolean | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| I-007 | Does your company provide employees with regular training on data security and cyber risks? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| I-015 | Does your company track gender representation across all levels of management and the wider workforce? | boolean | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| I-016 | Does your company conduct regular employee-engagement surveys? | categorical | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| IM-1 | Does your company have written policies on how it collects, uses, and protects customer data and privacy? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-002 | Has your company established mechanisms to prevent illegal or unfair business practices? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-003 | Does your company disclose the total number of directors on your board? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-008 | Does your company have a Whistleblowing Policy to protect employees who report concerns? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-011 | Does your company disclose the nature of its business operations and principal sustainability-related activities in a publicly available report? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-015 | Does your company have written procedures for sustainable sourcing of inputs from suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| M-016 | Does your company maintain a written anti-corruption and anti-bribery policy? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-029 | Does your company record child-labour or forced-labour incidents identified in your operations or supply chain? | categorical | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| M-033 | Does your company have a plan to ensure its business model is compatible with the transition to a 1.5°C climate pathway? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| M-035 | Has your company explained why climate change is or is not considered a material topic for your business? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| M-038 | Does your company disclose its spending on sustainability-related research, innovation, or product improvements? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| M-039 | Has your company implemented a Zero-Liquid-Discharge mechanism or similar advanced water-treatment system? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |

### needs_review (1)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| M-040 | What percentage of your input materials are sourced directly from small-scale or micro enterprises? | percent | needs_review | Community | none | agent_spot_checked_pending_owner_review |

## GOLDEN_04_CONSTRUCTION

Direct numeric/percent IDs: U-018, U-020. Boolean/categorical questions that are not direct knowledge: U-002, U-008, U-027, I-038, I-043, M-006, M-017.

| Coverage | Full | Boolean/categorical | Direct knowledge |
|---|---:|---:|---:|
| categories: People | 10 | 5 | 7 |
| categories: Governance | 20 | 20 | 16 |
| categories: Community | 6 | 4 | 4 |
| categories: Resources | 28 | 19 | 16 |
| families: commit | 9 | 9 | 8 |
| families: measure | 22 | 16 | 12 |
| families: plan | 11 | 11 | 9 |
| families: do | 10 | 9 | 10 |
| families: engage | 3 | 3 | 3 |
| families: none | 9 | 0 | 1 |

Lost coverage relative to Full: {"boolean_categorical":{"categories":[],"families":[]},"direct_knowledge":{"categories":[],"families":[]}}.

### full (64)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| U-001 | Does your company have a written environmental policy that applies to your own operations? | boolean | direct_knowledge | Governance | commit | agent_spot_checked_pending_owner_review |
| U-002 | Do you collect and review data on the quality of your sustainability-related information (e.g. checking accuracy of environmental data)? | categorical | record_lookup | Governance | measure | agent_spot_checked_pending_owner_review |
| U-003 | Does your company have a formal grievance or whistleblower mechanism that employees or stakeholders can use to report concerns? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| U-005 | Has your company set a target to reduce its greenhouse gas emissions? | boolean | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | direct_knowledge | Governance | engage | model_proposal_pending_owner_review |
| U-008 | Do you maintain documentation or records of how your environmental data (e.g. emissions, energy) is compiled and checked? | categorical | record_lookup | Governance | measure | model_proposal_pending_owner_review |
| U-009 | Does your company have a code of conduct or social-responsibility standards that you expect your suppliers to follow? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-010 | Has your company made a public commitment to fight corruption and bribery in all your business activities? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-012 | Does your environmental policy address how your products or services affect customers or distributors (downstream impacts)? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-013 | Does your company have a plan to transition its business model to be more low-carbon or sustainable? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-015 | Has your company set specific, measurable sustainability targets? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-018 | How many times per year does your company provide health and safety training to employees? | numeric | direct_knowledge | People | do | agent_spot_checked_pending_owner_review |
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | direct_knowledge | People | commit | agent_spot_checked_pending_owner_review |
| U-020 | On average, how many hours per week does a full-time employee at your company work? | numeric | direct_knowledge | People | none | agent_spot_checked_pending_owner_review |
| U-021 | What percentage of employees voluntarily left your company in the last 12 months? | percent | calculation_aggregation | People | none | agent_spot_checked_pending_owner_review |
| U-022 | Has your company assessed which climate-related risks (e.g. extreme weather, rising costs) could affect its business? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-025 | Does your company track its total energy consumption? | boolean | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-026 | What percentage of your energy comes from renewable sources? (Skip if unsure) | numeric | calculation_aggregation | Resources | none | model_proposal_pending_owner_review |
| U-027 | Have you identified which of your suppliers face significant actual or potential negative environmental impacts? | categorical | record_lookup | Resources | plan | model_proposal_pending_owner_review |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-029 | Does your company track the total volume of water it uses or withdraws? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-030 | Does your company track the total amount of waste it generates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-031 | What percentage of your waste is diverted from landfill (recycled, reused, composted) by mass? Skip if unsure | percent | calculation_aggregation | Resources | none | agent_spot_checked_pending_owner_review |
| U-032 | What percentage of your total waste is hazardous by mass? (Skip if unsure) | percent | calculation_aggregation | Resources | none | model_proposal_pending_owner_review |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | direct_knowledge | Community | do | agent_spot_checked_pending_owner_review |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | direct_knowledge | Community | engage | model_proposal_pending_owner_review |
| U-035 | How many employee volunteer hours did your company support in the last year, on average, per employee? | numeric | calculation_aggregation | Community | none | agent_spot_checked_pending_owner_review |
| U-036 | What percentage of pre-tax profit did your company donate or invest in community initiatives last year? | percent | calculation_aggregation | Community | none | agent_spot_checked_pending_owner_review |
| I-014 | Does your company provide Environmental Product Declarations (EPDs) for any of its products? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| I-018 | Does your company track diversity and inclusion metrics (e.g. gender, ethnicity) for its construction-sector workforce? | boolean | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| I-019 | Does your company provide employees with training on environmental regulations and clean-up procedures relevant to construction? | boolean | direct_knowledge | People | do | model_proposal_pending_owner_review |
| I-021 | Does your company use environmentally-focused design principles (e.g. green-building standards, eco-design) when designing products or structures? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-028 | What percentage of the wood-fibre materials you purchase originates from certified forestlands? | percent | calculation_aggregation | Resources | none | agent_spot_checked_pending_owner_review |
| I-033 | Has your company conducted a Life-Cycle Assessment (LCA) - a formal study of the environmental impact of a product from raw materials to end-of-life - for any of its products or construction materials? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| I-038 | Has your company identified how many of its construction sites or controlled lots are in flood-risk zones? | categorical | record_lookup | Resources | plan | model_proposal_pending_owner_review |
| I-039 | Has your company carried out a climate-change risk-exposure analysis for your operations or project pipeline? | categorical | direct_knowledge | Resources | plan | agent_spot_checked_pending_owner_review |
| I-043 | Does your company report its order backlog from renewable-energy or green-building projects? | categorical | record_lookup | Resources | measure | model_proposal_pending_owner_review |
| I-044 | Does your company have a formal process for integrating environmental considerations into site selection and site design? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-050 | Does your company have a documented strategy for managing physical and financial climate risks across construction projects? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| I-054 | What is your total Scope 1 and Scope 2 greenhouse-gas emissions divided by annual revenue (tCO2e/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| I-060 | What is your total annual energy consumption divided by annual revenue (kWh/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| I-063 | How many environmental permit non-compliance incidents has your company recorded in the past year? | numeric | record_lookup | Resources | measure | model_proposal_pending_owner_review |
| I-067 | What is your total annual water withdrawal divided by annual revenue (m³/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| I-073 | What is your total annual waste generated divided by annual revenue (kg/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| I-076 | Does your company perform stakeholder engagement as part of project-planning or site-selection due diligence? | categorical | direct_knowledge | Community | engage | agent_spot_checked_pending_owner_review |
| I-078 | Does your company assess the adequacy of existing public infrastructure (electricity, water, wastewater) when selecting sites? | categorical | direct_knowledge | Community | plan | model_proposal_pending_owner_review |
| IM-3 | Does your company have a formal workplace health and safety management system that covers all your construction sites and worksites? | categorical | direct_knowledge | People | commit | model_proposal_pending_owner_review |
| IM-4 | Does your company perform hazard identification and risk assessments for all operational processes? | categorical | direct_knowledge | People | do | model_proposal_pending_owner_review |
| M-001 | Are your Scope 1 and Scope 2 emissions verified by an independent third party? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-006 | Does your company publish the assurance provider's full report alongside its emissions disclosure? | boolean | record_lookup | Governance | measure | model_proposal_pending_owner_review |
| M-010 | Does your company publish a sustainability or ESG report aligned with a recognised framework (e.g. GRI, ISSB, SASB)? | categorical | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-016 | Does your company maintain a written anti-corruption and anti-bribery policy? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-017 | Do any members of your board or senior leadership have sustainability-linked incentives in their compensation? | categorical | record_lookup | Governance | commit | model_proposal_pending_owner_review |
| M-028 | How many recordable workplace injuries occurred per 100 employees in the past year? | numeric | calculation_aggregation | People | measure | model_proposal_pending_owner_review |
| M-031 | What percentage of your workers are covered by collective bargaining agreements? | percent | calculation_aggregation | People | none | model_proposal_pending_owner_review |
| M-033 | Does your company have a plan to ensure its business model is compatible with the transition to a 1.5°C climate pathway? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| M-035 | Has your company explained why climate change is or is not considered a material topic for your business? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| M-036 | Does your company actively identify non-renewable materials in its production and work to reduce them? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| M-037 | Does your company use eco-friendly or biodegradable packaging for its products? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |

### boolean_categorical (48)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| U-001 | Does your company have a written environmental policy that applies to your own operations? | boolean | direct_knowledge | Governance | commit | agent_spot_checked_pending_owner_review |
| U-002 | Do you collect and review data on the quality of your sustainability-related information (e.g. checking accuracy of environmental data)? | categorical | record_lookup | Governance | measure | agent_spot_checked_pending_owner_review |
| U-003 | Does your company have a formal grievance or whistleblower mechanism that employees or stakeholders can use to report concerns? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| U-005 | Has your company set a target to reduce its greenhouse gas emissions? | boolean | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | direct_knowledge | Governance | engage | model_proposal_pending_owner_review |
| U-008 | Do you maintain documentation or records of how your environmental data (e.g. emissions, energy) is compiled and checked? | categorical | record_lookup | Governance | measure | model_proposal_pending_owner_review |
| U-009 | Does your company have a code of conduct or social-responsibility standards that you expect your suppliers to follow? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-010 | Has your company made a public commitment to fight corruption and bribery in all your business activities? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-012 | Does your environmental policy address how your products or services affect customers or distributors (downstream impacts)? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-013 | Does your company have a plan to transition its business model to be more low-carbon or sustainable? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-015 | Has your company set specific, measurable sustainability targets? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | direct_knowledge | People | commit | agent_spot_checked_pending_owner_review |
| U-022 | Has your company assessed which climate-related risks (e.g. extreme weather, rising costs) could affect its business? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-025 | Does your company track its total energy consumption? | boolean | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-027 | Have you identified which of your suppliers face significant actual or potential negative environmental impacts? | categorical | record_lookup | Resources | plan | model_proposal_pending_owner_review |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-029 | Does your company track the total volume of water it uses or withdraws? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-030 | Does your company track the total amount of waste it generates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | direct_knowledge | Community | do | agent_spot_checked_pending_owner_review |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | direct_knowledge | Community | engage | model_proposal_pending_owner_review |
| I-014 | Does your company provide Environmental Product Declarations (EPDs) for any of its products? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| I-018 | Does your company track diversity and inclusion metrics (e.g. gender, ethnicity) for its construction-sector workforce? | boolean | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| I-019 | Does your company provide employees with training on environmental regulations and clean-up procedures relevant to construction? | boolean | direct_knowledge | People | do | model_proposal_pending_owner_review |
| I-021 | Does your company use environmentally-focused design principles (e.g. green-building standards, eco-design) when designing products or structures? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-033 | Has your company conducted a Life-Cycle Assessment (LCA) - a formal study of the environmental impact of a product from raw materials to end-of-life - for any of its products or construction materials? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| I-038 | Has your company identified how many of its construction sites or controlled lots are in flood-risk zones? | categorical | record_lookup | Resources | plan | model_proposal_pending_owner_review |
| I-039 | Has your company carried out a climate-change risk-exposure analysis for your operations or project pipeline? | categorical | direct_knowledge | Resources | plan | agent_spot_checked_pending_owner_review |
| I-043 | Does your company report its order backlog from renewable-energy or green-building projects? | categorical | record_lookup | Resources | measure | model_proposal_pending_owner_review |
| I-044 | Does your company have a formal process for integrating environmental considerations into site selection and site design? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-050 | Does your company have a documented strategy for managing physical and financial climate risks across construction projects? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| I-076 | Does your company perform stakeholder engagement as part of project-planning or site-selection due diligence? | categorical | direct_knowledge | Community | engage | agent_spot_checked_pending_owner_review |
| I-078 | Does your company assess the adequacy of existing public infrastructure (electricity, water, wastewater) when selecting sites? | categorical | direct_knowledge | Community | plan | model_proposal_pending_owner_review |
| IM-3 | Does your company have a formal workplace health and safety management system that covers all your construction sites and worksites? | categorical | direct_knowledge | People | commit | model_proposal_pending_owner_review |
| IM-4 | Does your company perform hazard identification and risk assessments for all operational processes? | categorical | direct_knowledge | People | do | model_proposal_pending_owner_review |
| M-001 | Are your Scope 1 and Scope 2 emissions verified by an independent third party? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-006 | Does your company publish the assurance provider's full report alongside its emissions disclosure? | boolean | record_lookup | Governance | measure | model_proposal_pending_owner_review |
| M-010 | Does your company publish a sustainability or ESG report aligned with a recognised framework (e.g. GRI, ISSB, SASB)? | categorical | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-016 | Does your company maintain a written anti-corruption and anti-bribery policy? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-017 | Do any members of your board or senior leadership have sustainability-linked incentives in their compensation? | categorical | record_lookup | Governance | commit | model_proposal_pending_owner_review |
| M-033 | Does your company have a plan to ensure its business model is compatible with the transition to a 1.5°C climate pathway? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| M-035 | Has your company explained why climate change is or is not considered a material topic for your business? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| M-036 | Does your company actively identify non-renewable materials in its production and work to reduce them? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| M-037 | Does your company use eco-friendly or biodegradable packaging for its products? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |

### direct_knowledge (43)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| U-001 | Does your company have a written environmental policy that applies to your own operations? | boolean | direct_knowledge | Governance | commit | agent_spot_checked_pending_owner_review |
| U-003 | Does your company have a formal grievance or whistleblower mechanism that employees or stakeholders can use to report concerns? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| U-005 | Has your company set a target to reduce its greenhouse gas emissions? | boolean | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | direct_knowledge | Governance | engage | model_proposal_pending_owner_review |
| U-009 | Does your company have a code of conduct or social-responsibility standards that you expect your suppliers to follow? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-010 | Has your company made a public commitment to fight corruption and bribery in all your business activities? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-012 | Does your environmental policy address how your products or services affect customers or distributors (downstream impacts)? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-013 | Does your company have a plan to transition its business model to be more low-carbon or sustainable? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-015 | Has your company set specific, measurable sustainability targets? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-018 | How many times per year does your company provide health and safety training to employees? | numeric | direct_knowledge | People | do | agent_spot_checked_pending_owner_review |
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | direct_knowledge | People | commit | agent_spot_checked_pending_owner_review |
| U-020 | On average, how many hours per week does a full-time employee at your company work? | numeric | direct_knowledge | People | none | agent_spot_checked_pending_owner_review |
| U-022 | Has your company assessed which climate-related risks (e.g. extreme weather, rising costs) could affect its business? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-025 | Does your company track its total energy consumption? | boolean | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-029 | Does your company track the total volume of water it uses or withdraws? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-030 | Does your company track the total amount of waste it generates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | direct_knowledge | Community | do | agent_spot_checked_pending_owner_review |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | direct_knowledge | Community | engage | model_proposal_pending_owner_review |
| I-014 | Does your company provide Environmental Product Declarations (EPDs) for any of its products? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| I-018 | Does your company track diversity and inclusion metrics (e.g. gender, ethnicity) for its construction-sector workforce? | boolean | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| I-019 | Does your company provide employees with training on environmental regulations and clean-up procedures relevant to construction? | boolean | direct_knowledge | People | do | model_proposal_pending_owner_review |
| I-021 | Does your company use environmentally-focused design principles (e.g. green-building standards, eco-design) when designing products or structures? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-033 | Has your company conducted a Life-Cycle Assessment (LCA) - a formal study of the environmental impact of a product from raw materials to end-of-life - for any of its products or construction materials? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| I-039 | Has your company carried out a climate-change risk-exposure analysis for your operations or project pipeline? | categorical | direct_knowledge | Resources | plan | agent_spot_checked_pending_owner_review |
| I-044 | Does your company have a formal process for integrating environmental considerations into site selection and site design? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-050 | Does your company have a documented strategy for managing physical and financial climate risks across construction projects? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| I-076 | Does your company perform stakeholder engagement as part of project-planning or site-selection due diligence? | categorical | direct_knowledge | Community | engage | agent_spot_checked_pending_owner_review |
| I-078 | Does your company assess the adequacy of existing public infrastructure (electricity, water, wastewater) when selecting sites? | categorical | direct_knowledge | Community | plan | model_proposal_pending_owner_review |
| IM-3 | Does your company have a formal workplace health and safety management system that covers all your construction sites and worksites? | categorical | direct_knowledge | People | commit | model_proposal_pending_owner_review |
| IM-4 | Does your company perform hazard identification and risk assessments for all operational processes? | categorical | direct_knowledge | People | do | model_proposal_pending_owner_review |
| M-001 | Are your Scope 1 and Scope 2 emissions verified by an independent third party? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-010 | Does your company publish a sustainability or ESG report aligned with a recognised framework (e.g. GRI, ISSB, SASB)? | categorical | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-016 | Does your company maintain a written anti-corruption and anti-bribery policy? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-033 | Does your company have a plan to ensure its business model is compatible with the transition to a 1.5°C climate pathway? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| M-035 | Has your company explained why climate change is or is not considered a material topic for your business? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| M-036 | Does your company actively identify non-renewable materials in its production and work to reduce them? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| M-037 | Does your company use eco-friendly or biodegradable packaging for its products? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |

### needs_review (0)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|


## GOLDEN_05_CONSUMER_GOODS

Direct numeric/percent IDs: U-018, U-020. Boolean/categorical questions that are not direct knowledge: U-002, U-008, U-027, I-009, I-012.

| Coverage | Full | Boolean/categorical | Direct knowledge |
|---|---:|---:|---:|
| categories: People | 6 | 2 | 4 |
| categories: Governance | 22 | 21 | 17 |
| categories: Community | 4 | 2 | 2 |
| categories: Resources | 20 | 13 | 12 |
| families: commit | 8 | 8 | 8 |
| families: measure | 21 | 16 | 12 |
| families: plan | 7 | 7 | 6 |
| families: do | 7 | 5 | 6 |
| families: engage | 2 | 2 | 2 |
| families: none | 7 | 0 | 1 |

Lost coverage relative to Full: {"boolean_categorical":{"categories":[],"families":[]},"direct_knowledge":{"categories":[],"families":[]}}.

### full (52)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| U-001 | Does your company have a written environmental policy that applies to your own operations? | boolean | direct_knowledge | Governance | commit | agent_spot_checked_pending_owner_review |
| U-002 | Do you collect and review data on the quality of your sustainability-related information (e.g. checking accuracy of environmental data)? | categorical | record_lookup | Governance | measure | agent_spot_checked_pending_owner_review |
| U-003 | Does your company have a formal grievance or whistleblower mechanism that employees or stakeholders can use to report concerns? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| U-005 | Has your company set a target to reduce its greenhouse gas emissions? | boolean | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | direct_knowledge | Governance | engage | model_proposal_pending_owner_review |
| U-008 | Do you maintain documentation or records of how your environmental data (e.g. emissions, energy) is compiled and checked? | categorical | record_lookup | Governance | measure | model_proposal_pending_owner_review |
| U-009 | Does your company have a code of conduct or social-responsibility standards that you expect your suppliers to follow? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-010 | Has your company made a public commitment to fight corruption and bribery in all your business activities? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-012 | Does your environmental policy address how your products or services affect customers or distributors (downstream impacts)? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-013 | Does your company have a plan to transition its business model to be more low-carbon or sustainable? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-015 | Has your company set specific, measurable sustainability targets? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-018 | How many times per year does your company provide health and safety training to employees? | numeric | direct_knowledge | People | do | agent_spot_checked_pending_owner_review |
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | direct_knowledge | People | commit | agent_spot_checked_pending_owner_review |
| U-020 | On average, how many hours per week does a full-time employee at your company work? | numeric | direct_knowledge | People | none | agent_spot_checked_pending_owner_review |
| U-021 | What percentage of employees voluntarily left your company in the last 12 months? | percent | calculation_aggregation | People | none | agent_spot_checked_pending_owner_review |
| U-022 | Has your company assessed which climate-related risks (e.g. extreme weather, rising costs) could affect its business? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-025 | Does your company track its total energy consumption? | boolean | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-026 | What percentage of your energy comes from renewable sources? (Skip if unsure) | numeric | calculation_aggregation | Resources | none | model_proposal_pending_owner_review |
| U-027 | Have you identified which of your suppliers face significant actual or potential negative environmental impacts? | categorical | record_lookup | Resources | plan | model_proposal_pending_owner_review |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-029 | Does your company track the total volume of water it uses or withdraws? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-030 | Does your company track the total amount of waste it generates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-031 | What percentage of your waste is diverted from landfill (recycled, reused, composted) by mass? Skip if unsure | percent | calculation_aggregation | Resources | none | agent_spot_checked_pending_owner_review |
| U-032 | What percentage of your total waste is hazardous by mass? (Skip if unsure) | percent | calculation_aggregation | Resources | none | model_proposal_pending_owner_review |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | direct_knowledge | Community | do | agent_spot_checked_pending_owner_review |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | direct_knowledge | Community | engage | model_proposal_pending_owner_review |
| U-035 | How many employee volunteer hours did your company support in the last year, on average, per employee? | numeric | calculation_aggregation | Community | none | agent_spot_checked_pending_owner_review |
| U-036 | What percentage of pre-tax profit did your company donate or invest in community initiatives last year? | percent | calculation_aggregation | Community | none | agent_spot_checked_pending_owner_review |
| I-009 | Does your company collect primary (directly measured) data for processes under its ownership or control for GHG reporting? | categorical | record_lookup | Governance | measure | agent_spot_checked_pending_owner_review |
| I-012 | Does your company assess the quality of activity data and emission factors used for GHG reporting? | categorical | record_lookup | Governance | measure | model_proposal_pending_owner_review |
| I-024 | Does your company maintain a list of chemicals or substances that are restricted or banned from use in your products or manufacturing processes? | boolean | direct_knowledge | Resources | commit | model_proposal_pending_owner_review |
| I-027 | Has your company set product-level GHG-reduction targets for your apparel or consumer-goods range? | boolean | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| I-036 | Does your company implement input-stream management (controlling chemical recipes/reagents) in its manufacturing? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-049 | Does your company conduct laboratory testing on finished products to check for restricted or harmful substances? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-053 | What is your total Scope 1 and Scope 2 greenhouse-gas emissions divided by annual revenue (tCO2e/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| I-059 | What is your total annual energy consumption divided by annual revenue (kWh/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| I-066 | What is your total annual water withdrawal divided by annual revenue (m³/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| I-072 | What is your total annual waste generated divided by annual revenue (kg/USD)? | numeric | calculation_aggregation | Resources | measure | model_proposal_pending_owner_review |
| M-001 | Are your Scope 1 and Scope 2 emissions verified by an independent third party? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-003 | Does your company disclose the total number of directors on your board? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-008 | Does your company have a Whistleblowing Policy to protect employees who report concerns? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-010 | Does your company publish a sustainability or ESG report aligned with a recognised framework (e.g. GRI, ISSB, SASB)? | categorical | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-011 | Does your company disclose the nature of its business operations and principal sustainability-related activities in a publicly available report? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-018 | How many substantiated customer-privacy-breach complaints has your company received in the past year? | numeric | record_lookup | Governance | measure | agent_spot_checked_pending_owner_review |
| M-024 | On average, how many training hours does each employee receive per year? | numeric | calculation_aggregation | People | do | agent_spot_checked_pending_owner_review |
| M-029 | Does your company record child-labour or forced-labour incidents identified in your operations or supply chain? | categorical | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| M-038 | Does your company disclose its spending on sustainability-related research, innovation, or product improvements? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |

### boolean_categorical (38)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| U-001 | Does your company have a written environmental policy that applies to your own operations? | boolean | direct_knowledge | Governance | commit | agent_spot_checked_pending_owner_review |
| U-002 | Do you collect and review data on the quality of your sustainability-related information (e.g. checking accuracy of environmental data)? | categorical | record_lookup | Governance | measure | agent_spot_checked_pending_owner_review |
| U-003 | Does your company have a formal grievance or whistleblower mechanism that employees or stakeholders can use to report concerns? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| U-005 | Has your company set a target to reduce its greenhouse gas emissions? | boolean | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | direct_knowledge | Governance | engage | model_proposal_pending_owner_review |
| U-008 | Do you maintain documentation or records of how your environmental data (e.g. emissions, energy) is compiled and checked? | categorical | record_lookup | Governance | measure | model_proposal_pending_owner_review |
| U-009 | Does your company have a code of conduct or social-responsibility standards that you expect your suppliers to follow? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-010 | Has your company made a public commitment to fight corruption and bribery in all your business activities? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-012 | Does your environmental policy address how your products or services affect customers or distributors (downstream impacts)? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-013 | Does your company have a plan to transition its business model to be more low-carbon or sustainable? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-015 | Has your company set specific, measurable sustainability targets? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | direct_knowledge | People | commit | agent_spot_checked_pending_owner_review |
| U-022 | Has your company assessed which climate-related risks (e.g. extreme weather, rising costs) could affect its business? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-025 | Does your company track its total energy consumption? | boolean | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-027 | Have you identified which of your suppliers face significant actual or potential negative environmental impacts? | categorical | record_lookup | Resources | plan | model_proposal_pending_owner_review |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-029 | Does your company track the total volume of water it uses or withdraws? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-030 | Does your company track the total amount of waste it generates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | direct_knowledge | Community | do | agent_spot_checked_pending_owner_review |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | direct_knowledge | Community | engage | model_proposal_pending_owner_review |
| I-009 | Does your company collect primary (directly measured) data for processes under its ownership or control for GHG reporting? | categorical | record_lookup | Governance | measure | agent_spot_checked_pending_owner_review |
| I-012 | Does your company assess the quality of activity data and emission factors used for GHG reporting? | categorical | record_lookup | Governance | measure | model_proposal_pending_owner_review |
| I-024 | Does your company maintain a list of chemicals or substances that are restricted or banned from use in your products or manufacturing processes? | boolean | direct_knowledge | Resources | commit | model_proposal_pending_owner_review |
| I-027 | Has your company set product-level GHG-reduction targets for your apparel or consumer-goods range? | boolean | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| I-036 | Does your company implement input-stream management (controlling chemical recipes/reagents) in its manufacturing? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-049 | Does your company conduct laboratory testing on finished products to check for restricted or harmful substances? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| M-001 | Are your Scope 1 and Scope 2 emissions verified by an independent third party? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-003 | Does your company disclose the total number of directors on your board? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-008 | Does your company have a Whistleblowing Policy to protect employees who report concerns? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-010 | Does your company publish a sustainability or ESG report aligned with a recognised framework (e.g. GRI, ISSB, SASB)? | categorical | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-011 | Does your company disclose the nature of its business operations and principal sustainability-related activities in a publicly available report? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-029 | Does your company record child-labour or forced-labour incidents identified in your operations or supply chain? | categorical | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| M-038 | Does your company disclose its spending on sustainability-related research, innovation, or product improvements? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |

### direct_knowledge (35)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|
| U-001 | Does your company have a written environmental policy that applies to your own operations? | boolean | direct_knowledge | Governance | commit | agent_spot_checked_pending_owner_review |
| U-003 | Does your company have a formal grievance or whistleblower mechanism that employees or stakeholders can use to report concerns? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-004 | Does your company publish a sustainability or ESG report (even informally, such as a summary for clients or stakeholders)? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| U-005 | Has your company set a target to reduce its greenhouse gas emissions? | boolean | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-006 | Does your company use due diligence to identify negative sustainability impacts in your supply chain or operations? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-007 | Does your company engage with your suppliers on environmental issues (e.g. energy, waste, emissions)? | categorical | direct_knowledge | Governance | engage | model_proposal_pending_owner_review |
| U-009 | Does your company have a code of conduct or social-responsibility standards that you expect your suppliers to follow? | boolean | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-010 | Has your company made a public commitment to fight corruption and bribery in all your business activities? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-012 | Does your environmental policy address how your products or services affect customers or distributors (downstream impacts)? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| U-013 | Does your company have a plan to transition its business model to be more low-carbon or sustainable? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-014 | Does your company consider environmental criteria when selecting or evaluating suppliers? | categorical | direct_knowledge | Governance | do | model_proposal_pending_owner_review |
| U-015 | Has your company set specific, measurable sustainability targets? | categorical | direct_knowledge | Governance | plan | model_proposal_pending_owner_review |
| U-018 | How many times per year does your company provide health and safety training to employees? | numeric | direct_knowledge | People | do | agent_spot_checked_pending_owner_review |
| U-019 | Does your company have a written policy that covers labour rights and fair working conditions for all employees? | boolean | direct_knowledge | People | commit | agent_spot_checked_pending_owner_review |
| U-020 | On average, how many hours per week does a full-time employee at your company work? | numeric | direct_knowledge | People | none | agent_spot_checked_pending_owner_review |
| U-022 | Has your company assessed which climate-related risks (e.g. extreme weather, rising costs) could affect its business? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-023 | Does your company measure or estimate greenhouse-gas emissions that come directly from your own operations  -  for example from company vehicles, boilers, or on-site processes (sometimes called Scope 1 emissions)? | categorical | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-024 | Does your company measure or estimate greenhouse-gas emissions from the electricity or heat it purchases from external suppliers (sometimes called Scope 2 emissions)? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-025 | Does your company track its total energy consumption? | boolean | direct_knowledge | Resources | measure | agent_spot_checked_pending_owner_review |
| U-028 | Does your company have a plan to reduce the use of non-renewable or hazardous materials in its products or processes? | categorical | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| U-029 | Does your company track the total volume of water it uses or withdraws? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-030 | Does your company track the total amount of waste it generates? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |
| U-033 | Does your company run or support a formal community investment, philanthropy, or local-impact programme? | boolean | direct_knowledge | Community | do | agent_spot_checked_pending_owner_review |
| U-034 | Does your company support women-owned businesses or promote inclusive procurement in its supplier relationships? | categorical | direct_knowledge | Community | engage | model_proposal_pending_owner_review |
| I-024 | Does your company maintain a list of chemicals or substances that are restricted or banned from use in your products or manufacturing processes? | boolean | direct_knowledge | Resources | commit | model_proposal_pending_owner_review |
| I-027 | Has your company set product-level GHG-reduction targets for your apparel or consumer-goods range? | boolean | direct_knowledge | Resources | plan | model_proposal_pending_owner_review |
| I-036 | Does your company implement input-stream management (controlling chemical recipes/reagents) in its manufacturing? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| I-049 | Does your company conduct laboratory testing on finished products to check for restricted or harmful substances? | categorical | direct_knowledge | Resources | do | model_proposal_pending_owner_review |
| M-001 | Are your Scope 1 and Scope 2 emissions verified by an independent third party? | categorical | direct_knowledge | Governance | measure | agent_spot_checked_pending_owner_review |
| M-003 | Does your company disclose the total number of directors on your board? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-008 | Does your company have a Whistleblowing Policy to protect employees who report concerns? | categorical | direct_knowledge | Governance | commit | model_proposal_pending_owner_review |
| M-010 | Does your company publish a sustainability or ESG report aligned with a recognised framework (e.g. GRI, ISSB, SASB)? | categorical | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-011 | Does your company disclose the nature of its business operations and principal sustainability-related activities in a publicly available report? | boolean | direct_knowledge | Governance | measure | model_proposal_pending_owner_review |
| M-029 | Does your company record child-labour or forced-labour incidents identified in your operations or supply chain? | categorical | direct_knowledge | People | measure | agent_spot_checked_pending_owner_review |
| M-038 | Does your company disclose its spending on sustainability-related research, innovation, or product improvements? | categorical | direct_knowledge | Resources | measure | model_proposal_pending_owner_review |

### needs_review (0)

| ID | Wording | Response | Effort | Category | Family | Review |
|---|---|---|---|---|---|---|

