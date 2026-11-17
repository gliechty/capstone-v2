# M8.0 further offline comparison — pending owner review

Open COMPARISON.md for exact wording of all100 proportional selections, category rounding/redistribution, effective weights, family coverage and per-question effort assumptions. comparison.json also contains every ranked eligible question, matched multiplier rule IDs, full numeric precision, and exact fixed-comparator sets. Ten CSVs provide each SME's proportional and fixed20 sets separately.

All five candidates contain20 unique direct-knowledge questions. Existing Full selection and eligible IDs/order match the saved experiment. No effort tags, scoring, application, configuration or deployment changed; no model/factor calls. M8.1 remains unstarted. The previous experiment commit2d4b9f4 remains unchanged; this continuation is local/uncommitted on codex/m8-preprocessing.

## Material differences from fixed6 Governance /4 People /8 Resources /2 Community

- Manufacturing:10/2/6/2 instead of6/4/8/2. Adds supplier engagement and targets/progress (U-007,U-015,M-014,M-022); loses weekly hours, labour-incident recording and circular-economy revenue/take-back (U-020,M-029,I-032,I-048).16/20 shared.
- Food/agro:8/2/8/2 instead of the capacity-adjusted6/3/9/2. Adds animal-health tracking and supplier criteria (I-008,U-014); loses training frequency and packaging (U-018,M-037).18/20 shared.
- Business/export:10/3/5/2 instead of6/4/8/2. Adds due diligence, supplier criteria/engagement and tracking advertising-related legal losses (U-006,U-014,U-007,I-005); loses weekly hours,1.5°C transition plan, climate materiality explanation and climate-risk assessment (U-020,M-033,M-035,U-022).16/20 shared.
- Construction:8/3/7/2 instead of6/4/8/2. Adds supplier criteria/engagement (U-014,U-007); loses labour-policy and packaging questions (U-019,M-037).18/20 shared. Governance/Resources remainder tie is resolved by the documented production-category order.
- Consumer goods:9/2/7/2 instead of6/4/8/2. Adds supplier engagement, sustainability targets and environmental policy (U-007,U-015,U-001); loses labour-incident recording, training frequency and finished-product substance testing (M-029,U-018,I-049).17/20 shared.

This comparison holds within-category weight ranking constant. It does not implement the earlier proposal's optional deduplication/family-balancing/dependency repair. The proportional policy reflects the existing pool's composition, including its concentration of Governance questions; it is not an independent assessment of desired topic balance. All five families survive, but Measure dominates8–11/20, often through questions about tracking/reporting practices rather than outcome values. No candidate scores or comparability claims.

## Review flags

Every set contains overlapping reporting questions (U-004 with M-010 and/or M-011). Food includes general and sector-specific Scope1/Scope2 pairs (U-023/I-040 and U-024/I-041). Food and Construction include both materials-reduction plan and implementation questions (U-028/M-036). They are related, not automatically interchangeable; no removal was forced.

M-001 assumes an emissions inventory/knowledge of verification scope. M-010/M-011 assume a public report; U-004 is selected with them. Manufacturing M-022 includes its target prerequisite U-015; M-014 additionally presupposes previously disclosed commitments, which cannot be established by a single prerequisite question. These are semantic review flags, not new app validation rules.

U-018 (selected in Manufacturing/Construction) assumes ordinary training frequency; U-020 (Food/Consumer) assumes typical scheduled weekly hours rather than a calculated workforce/overtime mean. Specialist assurance, certification, laboratory/testing and reporting-practice questions assume an informed manager; another respondent may need records. Selected unreviewed model proposals and all assumptions are individually listed. None of the five needs_review items enters either candidate; no effort tag is upgraded or approved here.

Reproduce offline with node experiments/m8.0-v1/twenty.mjs using the existing dependency location described in the parent README. Exact existing resolveMultiplier and selectQuestions functions are imported in memory, without app edits. Weights are base_weight times the capped profile multiplier; no answers are provided or scored. Source order breaks equal question weights. The allocation uses constrained proportional quotas plus largest remainders, not two guaranteed slots followed by proportional distribution of the remainder (which would be a different policy).
