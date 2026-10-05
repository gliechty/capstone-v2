# Atomic Indicators Legacy Pipeline — Methodology

**Source workbook:** `AtomicIndicators.xlsx`  
**Source tab:** `Why Steps`  
**Status:** Legacy-method provenance record. Source wording preserved verbatim.  
**Important:** This documents the v1 derivation method; it is not, by itself, the v2.1 production design.

## Original methodology

We developed a structured, repeatable methodology to translate diverse sustainability frameworks and guidance documents into a standardized SME assessment tool. The process began with atomic extraction, where individual disclosures and requirements were captured from source documents without interpretation. These indicators were then clustered into thematic groups and analyzed for frequency across the full document set, using frequency as a proxy for materiality. From this, we generated a weighted universe of indicators that informed the creation of a QuestionBank: first through a set of universal, high-signal questions, and then through contextual expansion based on industry, geography, buyer expectations, and business goals. At runtime, the system deterministically selects relevant questions based on SME attributes, applies base weights derived from frequency, adjusts scores using rule-based multipliers tied to contextual tags, and normalizes quantitative inputs through predefined benchmarks. Final scores are aggregated using industry-specific category weights, and an AI layer is used only to generate structured, explainable recommendations grounded in retrieved source material.

This approach is intentionally modular and replicable: the same pipeline can be applied to a different set of source documents, industries, or regulatory contexts by re-running the atomic extraction and updating the configuration layers (QuestionBank, MultiplierRules, AnswerScales, and benchmarks). The system’s primary strengths are its transparency, auditability, and separation of concerns—question selection and scoring are fully deterministic and traceable back to source material, while AI is used in a constrained, non-decision-making role to interpret results rather than generate them. Weighting is grounded in observable signal frequency and then refined through contextual multipliers, balancing empirical rigor with practical flexibility. However, the system is not without limitations: clustering introduces some subjectivity, frequency does not perfectly capture real-world materiality, and the quality of outputs depends on the completeness and relevance of the underlying document set. Additionally, rule-based multipliers require careful data alignment and ongoing maintenance. Despite these constraints, the framework provides a defensible and extensible foundation for SME sustainability assessment that avoids opaque, black-box modeling while still leveraging AI where it adds value responsibly.

End-to-End Methodology (High-Level)

1. Atomic Extraction (per document)

Input: Individual source documents (frameworks, standards, reports)

Output: Atomic indicators

Each row represents a single disclosure / requirement / signal

No interpretation, no grouping, no deduplication

👉 Goal: Preserve raw signal from source material

2. Indicators → Clustered Indicators

Group semantically similar indicators

Example:

“Tracks GHG emissions”

“Measures carbon footprint”

→ clustered under Emissions Tracking

👉 Goal: reduce redundancy while maintaining traceability

3. Atomic + Cluster Mapping

Each atomic indicator is:

preserved

assigned to a cluster

👉 You now have:

raw indicators

structured grouping layer

4. Cluster Frequency Analysis

Count how often each cluster appears across all documents

👉 Output:

frequency per cluster

proxy for importance / materiality

5. Atomic Weighted Candidates

Map cluster frequency → weights

Each indicator inherits weight from its cluster

👉 This produces:

a ranked universe of sustainability signals

6. QuestionBank — Step 1 (Universal Questions)

Generate core questions from highest-frequency clusters

Apply:

clean wording

appropriate answer scale

category / subcategory

Assign:

base_weight (from frequency)

👉 Output:

universal, high-signal questions

applicable across most SMEs

7. QuestionBank — Step 2 (Contextual Expansion)

Add conditional questions based on:

Industry

Market / geography

Buyer expectations

Business goal

Also add:

metric-based questions (linked to benchmarks)

maturity / progression logic

👉 Output:

full QuestionBank (~140 questions)

includes:

triggers (industry / market)

size filters

tags for multiplier logic

Supporting Layers Added After QB

8. MultiplierRules

Tag-based + context-based adjustments

Driven by:

industry

region

buyer

business goal

👉 Adds contextual materiality

9. AnswerScales

Standardized response structures:

YN

PARTIAL_3

MATURITY_4

NUMERIC_INPUT, etc.

👉 Ensures consistent scoring

10. MetricBenchmarks

Normalize numeric inputs

Map raw values → comparable scores

👉 Enables quantitative rigor

11. CategoryWeights

Final aggregation layer

Industry-specific weighting of:

People

Governance

Community

Resources

👉 Produces final SME score

Final System Behavior

At runtime:

SME profile →

Deterministic question selection →

User answers →

Base weights applied →

Multipliers applied →

Metrics normalized →

Category weights applied →

Final score + RAG output generated

Key Design Principles (what makes this strong)

Deterministic core (no AI choosing questions)

Explainable weighting (frequency → weights)

Context-aware scoring (multipliers)

Auditable lineage (question → cluster → source)

Separation of concerns:

selection

scoring

explanation
