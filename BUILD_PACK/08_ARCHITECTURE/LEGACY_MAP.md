# LEGACY_MAP.md

## Purpose

This is a **functional migration map**, not a target-architecture specification.

It records what v1 does, what behavior or methodological intent matters, and what v2 must preserve, deliberately improve, remove, or leave extensible. It intentionally does **not** prescribe where a capability must live, which service must own it, or which technical pattern an implementation agent must use.

The Build Pack is a baseline and regression reference, not a blueprint.

## Decision legend

- **PRESERVE** — retain the user-visible or methodological behavior unless there is an explicit improvement.
- **IMPROVE** — preserve the intent while permitting a better implementation or method.
- **REMOVE** — known legacy behavior that should not constrain v2.
- **ADD** — desired capability absent from v1, subject to approved scope.
- **DEFER** — future-facing capability that the architecture should not block, but v2 need not implement.

## Functional map

| Capability | v1 baseline | v2 acceptance boundary | Decision |
|---|---|---|---|
| SME context/profile | Industry, size, geography, target market, buyer, business goal, notes | The assessment can use the context required to produce a relevant assessment and recommendations | PRESERVE / IMPROVE |
| Question selection | Deterministic filtering by active, industry, market/location and size | Applicable questions are selected reproducibly and explainably from configuration | PRESERVE |
| Buyer / business-goal relevance | Affect weighting/retrieval/recommendations, but not v1 question selection | Buyer/goal may influence question relevance where justified without making runtime selection opaque or LLM-arbitrary | ADD / IMPROVE |
| Universal/core questions | Common questions preserve comparability | Contextual tailoring must not eliminate an appropriate common/core assessment basis | PRESERVE |
| Answer collection | Appsmith questionnaire | Users can reliably complete and revise all selected questions; answers cannot disappear silently | PRESERVE / IMPROVE |
| Quantitative metric entry | Primarily manual | Manual values remain supported; calculated or evidence-derived values may be reused when available | PRESERVE / ADD |
| Answer normalization | Deterministic configured methods | Identical valid inputs/config produce reproducible normalized values | PRESERVE |
| Metric benchmarks | Config-driven benchmark lookup | Quantitative scoring remains explicit, unit-aware, reproducible and auditable | PRESERVE / IMPROVE |
| Base weights | Config-driven | Weighting remains traceable to a published/versioned methodology | PRESERVE |
| Context multipliers | Deterministic rules | Contextual importance can change weights through transparent, bounded, testable rules | PRESERVE / IMPROVE |
| Category scoring | Deterministic aggregation | Category results remain reproducible and explainable | PRESERVE |
| Overall scoring | Raw + industry-weighted outputs | Overall scores follow a documented descendant of the Capstone method; deliberate methodological improvements are allowed and documented | PRESERVE / IMPROVE |
| AI in scoring | Not used | AI must not silently substitute probabilistic judgment for deterministic assessment computation | PRESERVE boundary |
| Config-driven behavior | Runtime behavior largely driven by QuestionBank and related config | Core methodology can evolve through validated/versioned configuration rather than code rewrites | PRESERVE / IMPROVE |
| Knowledge corpus | DocumentIndex + DocumentChunks | Recommendation evidence remains traceable to source material | PRESERVE |
| Retrieval | Deterministic metadata ranking; top documents/chunks | Evidence supplied to recommendations is relevant, testable and source-grounded; retrieval implementation may improve | PRESERVE intent / IMPROVE method |
| Recommendations | LLM downstream of deterministic assessment | Recommendations use SME context, answers, scores and grounded evidence; outputs are structurally valid and useful | PRESERVE / IMPROVE |
| Evidence citations | Human-readable source metadata | Recommendations retain inspectable evidence provenance | PRESERVE |
| Model/provider | OpenAI through n8n | Model dependency should not define the product or scoring methodology; implementation may use the best suitable provider/configuration | IMPROVE |
| Results experience | Scores, category breakdown, summary, gaps, recommendations | Results are understandable, actionable and professionally presented | PRESERVE / IMPROVE |
| Loading/progress UI | Simulated rotating Appsmith stages | Do not represent simulated progress as real system telemetry | REMOVE |
| Legacy sandbox/test infrastructure | Appsmith sandboxes + NocoDB test data | Preserve only insofar as useful for test evidence; it is not product functionality | REMOVE from product |
| Stable data identity | Some title-based joins / duplicate chunk IDs | Persistent entities have reliable identity and integrity; implementation should not depend on fragile display-string joins | IMPROVE |
| Emissions calculator | Separate research artifact | If approved, operational data can resolve canonical assessment metrics without changing the deterministic scoring contract | ADD, scope-gated |
| Evidence uploads | Not present | If approved, uploaded evidence can reduce duplicate/manual entry while keeping scored numeric values validated | ADD, scope-gated |
| Standards ingestion / config regeneration | Offline/manual research workflow | Future architecture should not preclude repeatable source ingestion, regeneration, validation and publishing | DEFER |
| Accounts / multi-user SaaS | Not present | Do not require for Columbia v2 unless approved; architecture should not make later addition unnecessarily difficult | DEFER |
| Peer / external ESG benchmark | Alan/Henry research only | Keep separate from core Capstone score unless deliberately introduced as a distinct product signal | DEFER |

## Golden tests: baseline, not ceiling

`07_GOLDEN_TESTS` defines representative known-good v1 behavior.

Use it to detect **accidental regressions**, especially in:

- question applicability;
- normalization;
- scoring;
- weighting;
- category/overall results;
- recommendation structure and grounding.

A v2 implementation does **not** have to reproduce a legacy implementation detail merely because the golden test records it.

When v2 deliberately improves a behavior or methodology:

1. identify the deviation from v1;
2. explain why it is an intended improvement;
3. test the new behavior directly;
4. update or supplement the relevant regression expectation.

The question is not “does the new code look like v1?” It is “does it preserve or intentionally improve the capability and methodological contract?”

## Architecture freedom

Implementation agents are free to propose, test and revise architecture provided the resulting system:

- satisfies the approved functional requirements;
- preserves or explicitly improves the Capstone methodological lineage;
- remains deterministic and auditable where computation affects assessment results;
- supports modular addition/replacement of major capabilities and integrations;
- performs materially better than the v1 baseline where latency or reliability is a known problem;
- has a credible path to production-grade security, maintainability and commercial-scale operation;
- passes functional, regression, integration and end-to-end testing.

No v1 technology—Appsmith, n8n, Google Sheets, NocoDB, Caddy, Docker, Hetzner, or a specific model provider—is automatically a v2 requirement.

## Scope boundary

This map does not decide the final Columbia deliverable. `CLIMATE_SCHOOL_SCOPE_DRAFT.md` should define **required outcomes and acceptance criteria**, not prescribe an internal architecture unless a technical constraint is explicitly required by Professor Guo, Columbia, deployment, security, or interoperability needs.
