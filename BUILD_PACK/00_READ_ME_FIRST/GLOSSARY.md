# GLOSSARY.md

## Purpose

This glossary defines the canonical project language for Capstone v2.

Agents should use these terms consistently and should not silently rename, merge, or reinterpret them. If a term needs to change, surface the proposed change for human review.

---

## Product and user context

### SME
Small or medium enterprise.

The primary user of the current Climate School assessment.

### Buyer
A company or procurement organization evaluating, onboarding, sourcing from, or managing suppliers.

In the broader product vision, buyer context can affect which sustainability indicators are commercially relevant.

### Supplier
An SME or other company providing goods or services to a buyer.

In the current Climate School build, the primary assessment user is generally the supplier/SME.

### Procurement readiness
The degree to which an SME can provide the sustainability data, disclosures, systems, and performance evidence likely to matter in a target procurement context.

The Capstone score is intended to support this type of judgment. It is not a universal statement of whether a company is “sustainable.”

### Target market
The market or region in which the SME is seeking to sell or qualify.

### Target buyer
The buyer, buyer type, or procurement context the SME is trying to satisfy.

### Business goal
The SME's stated objective for using the assessment, such as improving procurement readiness, meeting a buyer requirement, or improving a particular sustainability outcome.

### Contextual relevance
The central product principle that the commercial importance of a sustainability indicator depends on context, including buyer, market, industry, business goal, standards, and moment in time.

### Configurable assessment
An assessment whose questions, weights, benchmarks, multipliers, and related behavior are driven by explicit configuration rather than hard-coded application logic.

### Assessment project
A future SaaS concept in which a user creates a distinct assessment configuration based on a chosen knowledge base and custom direction.

Examples could include a general assessment, a China assessment, or a buyer-specific assessment.

### Sync
A future SaaS/stretch concept in which the system regenerates or updates candidate assessment configuration from a selected knowledge base and contextual direction.

This is not part of the current core runtime unless explicitly approved.

---

## Scope and product tiers

### Current Scope
Capabilities presently intended for the Climate School v2 research build.

Current Scope is governed by `CLIMATE_SCHOOL_SCOPE_DRAFT.md` and later by Professor Guo's approved scope.

### Stretch
Capabilities that are desirable and should not be architecturally blocked, but are not required for the first v2 build unless explicitly approved.

Examples include assisted utility-bill extraction and automated source-to-config regeneration.

### SaaS
Future commercial product capabilities outside the current paid Climate School build.

Examples include buyer accounts, multi-tenant dashboards, paid market intelligence, configurable buyer projects, billing, and commercial supplier intelligence.

### Research / verification page
The public-facing portion of the product that explains methodology, source basis, provenance, limitations, and verification evidence.

---

## Canonical configuration entities

The entities in this section are conceptually distinct even if their physical storage changes.

### QuestionBank
The canonical set of assessment questions and their metadata.

QuestionBank controls question identity, wording, applicability, scoring references, category/subcategory, base weight, metric linkage, and related configuration.

### AnswerScales
Configuration that maps categorical or structured responses to deterministic normalized scores.

### MetricBenchmarks
Configuration used to score quantitative metrics relative to relevant benchmarks or targets.

### MultiplierRules
Contextual weighting rules that adjust question importance based on conditions such as industry, market, buyer, or business goal.

### CategoryWeights
Configuration controlling the relative contribution of sustainability categories to weighted overall scoring.

### DocumentIndex
The metadata index for the sustainability/source corpus used in retrieval and recommendation grounding.

### DocumentChunks
Preprocessed source excerpts used as evidence for retrieval and recommendation generation.

### Canonical config
The authoritative version of the assessment configuration used for runtime behavior.

Raw historical/source files may exist separately, but runtime behavior should resolve to one explicit canonical configuration.

---

## Methodology and scoring

### Deterministic
Given the same valid inputs and configuration, the computation returns the same result.

Question selection and scoring are intended to remain deterministic.

### Normalization
The process of converting an answer or quantitative value into the standardized score used by the scoring engine.

### Normalization method
A named deterministic scoring rule, such as boolean identity, direct percentage, benchmark ratio, Gaussian/target scoring, inverse percentage, exponential decay, banded scoring, or min-max normalization.

### Base weight
The starting importance assigned to a question before contextual multiplier rules are applied.

### Multiplier
A deterministic contextual adjustment applied to question weight.

### Adjusted weight
The effective question weight after applicable multiplier rules have been applied.

### Benchmark
A reference value or target used to interpret a quantitative metric.

### Category
A top-level sustainability grouping used for aggregation.

Current v1 categories include People, Governance, Community, and Resources. These current values are configuration, not permanent engine constraints.

### Category score
The deterministic aggregate score for a sustainability category.

### Raw overall score
The overall score before application of industry-specific category weighting.

### Weighted overall score
The overall score after category weights are applied.

### Capstone baseline
The Spring 2026 methodology, configuration, prompts, application behavior, and related artifacts preserved in the Build Pack.

The baseline is a regression reference and methodological ancestor, not a mandatory v2 architecture.

---

## Quantitative metrics and emissions

### metric_id
The stable identifier connecting a quantitative assessment question to the canonical metric being scored.

### Canonical metric
A normalized metric definition used by the assessment regardless of whether the value came from manual entry, a calculator, or extracted evidence.

### Resolved metric
A canonical metric value that is ready to be used by the deterministic scoring engine.

A resolved metric should retain its unit and provenance.

### Metric provenance
Information describing where a metric value came from.

Examples include manual entry, calculator output, uploaded evidence, source artifact, reporting period, formula version, and confirmation status.

### Emissions calculator
The preserved calculator capability that converts activity/operational data into emissions or related canonical metrics.

In v2 it is an input-resolution tool, not a separate scoring methodology.

### Autofill
Reusing a metric already resolved during the current session so the user does not have to enter the same information again.

### Evidence upload
A stretch capability in which utility bills or similar documents are parsed to identify candidate operational/metric inputs.

Extracted values must be validated before affecting deterministic scoring.

### Interactive lever
A control, such as a slider, that lets the user change an input and immediately explore how the modeled assessment result changes.

Levers are a what-if/scenario layer, not a new scoring methodology.

---

## Knowledge base and AI

### Knowledge base
The source material used to derive assessment configuration and/or ground recommendations.

Depending on context, this may refer to the full research corpus or to the subset selected for a future configurable assessment project.

### Source corpus
The collection of standards, research, guidance, policy, and other documents represented in the knowledge base.

### AtomicIndicator
A discrete sustainability concept extracted from a source document during the original Capstone preprocessing methodology.

### Cluster
A grouping of related AtomicIndicators used during the Capstone transformation process.

### Source-to-config pipeline
The upstream process that transforms source documents into structured indicators and candidate assessment configuration.

The original Capstone process was partly manual and prompt-assisted.

### RAG
Retrieval-Augmented Generation.

In this project, it refers to retrieving relevant source material before generating grounded recommendations.

### Retrieval
The process of selecting relevant documents/chunks for recommendation generation.

The final v1 implementation uses deterministic metadata ranking rather than vector embeddings.

### Grounded recommendation
An AI-generated recommendation informed by deterministic assessment results and retrieved source evidence.

### Grounding
Constraining or informing model output with relevant source material so recommendations can be linked back to evidence.

### Recommendation model
The LLM used to transform assessment context, scores, answers, and retrieved evidence into recommendations.

The model/provider is an implementation dependency, not part of the scoring methodology.

---

## Build, testing, and governance

### Build Pack
The preserved set of v1 artifacts, methodology, configuration, architecture evidence, regression cases, scope documents, and build-control documentation.

The Build Pack is a baseline and evidence set, not a target architecture.

### Current Architecture
The evidence-based description of how v1 actually works.

`CURRENT_ARCHITECTURE.md` is descriptive/forensic, not prescriptive.

### Legacy Map
The functional mapping between meaningful v1 behaviors and v2 treatment.

`LEGACY_MAP.md` preserves capability and methodology boundaries without dictating where implementation must live.

### Build Charter
The rules governing how implementation agents may work on the project.

It defines invariants, agent freedom, engineering-quality expectations, review gates, and known AI failure modes.

### Climate School Scope
The current definition of what the paid research build should deliver.

### Product Vision
The strategic context for why the product exists, its central thesis, intended value, and possible longer-term direction.

### IP Baseline
The provenance record of product concepts, methods, and artifacts that existed before the current paid research extension.

It is not a legal ownership determination.

### Columbia IP Guardrails
The build-control document describing when agents should stop before generating potentially valuable new commercial or patentable functionality inside an unresolved paid-research IP boundary.

### Golden Test
A representative known-good assessment case used to detect accidental regressions.

Golden Tests are a baseline, not a ceiling.

### Regression
A change that unintentionally breaks behavior that should have been preserved.

### Intentional improvement
A deliberate change from the baseline that is documented, reviewed when required, and tested directly.

### Milestone
A human-defined build phase with a clear objective and review point.

The project owner—not the implementation agent—decides when a milestone is complete and when the build advances.

### Human review gate
A point at which the agent must stop and surface a proposal before proceeding.

Examples include material formula changes, canonical-config semantic changes, major new dependencies, or movement into a new milestone.

### IP REVIEW REQUIRED
The explicit stop condition defined in `COLUMBIA_IP_GUARDRAILS.md` for potentially new commercial, patentable, research-data, or otherwise ambiguous IP creation.

---

## Legacy technologies

These technologies describe v1 implementation and are not automatically v2 requirements.

### Appsmith
The v1 UI platform and location of the authoritative `AssessmentScoring` implementation.

### n8n
The v1 orchestration layer used for question selection and recommendation/RAG workflows.

### NocoDB
Legacy/test infrastructure in v1. It is not the authoritative production config store.

### PostgreSQL
Database technology present in v1 primarily as the NocoDB backing database.

Its role may change in v2.

### Google Sheets
The authoritative v1 runtime location for much of the canonical configuration and retrieval data.

The data/config contracts matter; Google Sheets itself is not necessarily a v2 requirement.

---

## Naming rule

If an implementation agent encounters two terms that appear redundant, it should not merge them merely for cleanliness.

Before changing project terminology or combining concepts, check:

1. `GLOSSARY.md`;
2. `BUILD_CHARTER.md`;
3. the relevant canonical config;
4. `LEGACY_MAP.md`.

If the distinction still appears unnecessary, surface the proposed change for human review.
