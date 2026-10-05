# PRODUCT_VISION.md

## Purpose

This document gives implementation agents the product context needed to make good tradeoffs without prescribing a fixed architecture.

Detailed current-build requirements live in `CLIMATE_SCHOOL_SCOPE_DRAFT.md`.

---

## 1. Origin and client problem

The product began as a Spring 2026 Columbia Climate School capstone for SEE Foundation.

The problem is broader than fragmented sustainability standards.

For SMEs, the field itself is difficult to interpret. Standards bodies, ratings firms, consultants, buyers, regulators, and other actors often speak with confidence about which sustainability metrics matter, even though the answer varies by buyer, market, industry, regulatory regime, and moment in time.

For many SMEs, “sustainability” is not an abstract optimization problem. It is partly a business-survival problem: understanding what information and operational maturity are most likely to help the company qualify for contracts, remain visible to large buyers, and survive another year.

For large companies, sustainability priorities also move. Reporting standards, regulations, procurement requirements, decarbonization targets, water priorities, human-rights expectations, and other concerns can rise or fall in prominence over time.

The product is intended to bridge those two realities.

---

## 2. Core thesis

> **Sustainability performance is real; its commercial relevance is not static.**

The product does not attempt to define the one correct sustainability score.

Instead, it asks:

> **Given this buyer, market, industry, business goal, source base, and moment in time, what sustainability information is most likely to matter?**

In that sense, sustainability exists commercially **in the eyes of the buyer**.

The assessment therefore treats question relevance and weighting as contextual rather than universal.

Important methodological note:

The current Capstone system does not estimate literal calibrated probabilities. Unless and until such a model is added and validated, product language should describe weights as proxies for **expected relevance / likelihood of mattering**, not as statistical probabilities.

---

## 3. Product role: a bridge between SMEs and buyers

The long-term concept is not simply “another ESG rating.”

It is a bridge between large buyers and SMEs that may currently sit outside, or at the edge of, formal procurement systems.

### For SMEs

The product should:

- demystify what sustainability means in a specific commercial context;
- identify which data, disclosures, systems, and operational improvements matter most;
- provide actionable guidance rather than only a score;
- help the SME become more legible to large procurement organizations;
- reduce the cost and complexity of responding to sustainability expectations;
- increase the SME's chances of qualifying for contracts.

### For buyers

The product could:

- collect structured upstream supplier data at scale;
- identify which SMEs have relevant data available;
- assess whether supplier systems are mature enough to collect and manage required information;
- compare supplier performance within appropriate market / industry / niche contexts;
- expand visibility into SMEs that might otherwise remain outside the buyer's existing supplier-intelligence systems;
- feed richer sustainability information into procurement workflows.

The system therefore creates value on both sides of the procurement relationship.

---

## 4. Data-network thesis

The commercial opportunity is not only the assessment itself.

A low-friction, useful assessment can give large numbers of SMEs a reason to contribute structured sustainability information voluntarily in exchange for practical insight.

Over time, that data—subject to appropriate consent, privacy, security, and governance—could become a valuable supplier-intelligence asset for buyers.

The intended commercial logic is therefore closer to:

- **free or very low-cost utility for SMEs**;
- **paid intelligence / workflow value for buyers**.

The SME receives actionable insight and visibility.

The buyer receives richer, more structured, more comparable supplier information and configurable procurement intelligence.

The assessment is therefore also a potential **data-acquisition mechanism**: useful enough that SMEs choose to participate, producing a broader supplier data pool than a high-friction, high-cost certification model might achieve.

---

## 5. Market adjacency / validation

This concept is not based on the assumption that no one else connects procurement and sustainability data.

Established platforms already demonstrate demand for large-scale supplier sustainability intelligence.

For example, IntegrityNext currently states that:

- more than **2 million suppliers** are active in its network;
- more than **500 procurement teams** use its sustainable-procurement platform;
- the platform integrates with ERP, e-sourcing, and supplier-portal workflows.

Sources:
- https://www.integritynext.com/sustainable-procurement
- https://www.integritynext.com/about-us/partners

Those figures validate the scale of the market and the value of supplier-network effects.

The product thesis here is differentiated by emphasis:

- do not assume one static “perfect” sustainability score;
- configure relevance around buyer / market / industry / goal context;
- make the assessment useful enough for SMEs to complete voluntarily;
- use structured supplier participation to create buyer-side intelligence;
- allow future buyer-defined assessment projects built from selected knowledge bases and priorities.

This is a positioning hypothesis, not a claim that the market is empty or that the concept is legally unique.

---

## 6. Current research product

The current Climate School product is primarily an SME-facing assessment.

It should:

- collect relevant company/context information;
- select an appropriate assessment from configuration;
- compute transparent quantitative scores;
- use relevant benchmarks and contextual weighting;
- produce useful quantitative outputs and visualizations;
- generate source-grounded recommendations;
- help users understand how operational changes affect assessment outcomes;
- remain understandable and auditable as a research product.

The product should feel like modern software rather than a research prototype.

---

## 7. Product principles

### Contextual, not universal

The same company may reasonably receive different emphasis for different buyers, markets, or goals.

### Config-driven

Assessment behavior should remain driven by explicit, maintainable configuration rather than hidden logic or ad hoc AI judgment.

### Explainable

A user or researcher should be able to understand where questions, scores, weights, benchmarks, and recommendations came from.

### Useful

The application should tell an SME what to do next, not simply assign a score.

### Quantitative where possible

Metrics, benchmarks, calculators, score changes, and scenario outputs should make the product more actionable than a narrative assessment alone.

### Fast

The product should respond like modern software. Avoid unnecessary computation and unnecessary chains of external API calls.

### Scalable and maintainable

Implementation choices should support growth in users, configuration, source material, supplier data, buyer workflows, and future modules without requiring a ground-up rewrite of the core assessment.

This does not require solving hypothetical hyperscale problems in the research build. It means preferring efficient, modern, well-structured implementations over obvious prototype dead ends.

### Modular

Future capabilities should be attachable without entangling or replacing the core deterministic assessment.

---

## 8. Longer-term product direction

The current Climate School build is one expression of a broader product concept.

Future versions could support additional calculators, evidence ingestion, refreshed standards, richer benchmarking, market intelligence, buyer-defined assessments, supplier discovery, procurement integrations, and commercial SaaS workflows.

These possibilities should inform optionality but should not cause the current research build to overengineer features that are not yet required.

---

## 9. Pre-existing future business concept: buyer / procurement use

A future version could serve large-company procurement teams as well as SMEs.

A buyer such as Amazon, Walmart, or another large procurement organization could define or customize a supplier sustainability assessment and share it with potential suppliers as part of the procurement or pre-boarding process.

### Supplier value

- understand what the buyer is prioritizing;
- see which disclosures or operational improvements matter most;
- receive specific guidance before or during procurement;
- improve readiness for a wider set of procurement opportunities.

### Buyer value

- receive more structured upstream sustainability data;
- compare or filter potential suppliers using relevant criteria;
- communicate changing sustainability priorities to the supplier base;
- understand supplier performance relative to an appropriate peer set;
- potentially expand the set of SMEs able to meet procurement expectations.

This is a future commercial/product concept, not a requirement of the current Climate School build.

---

## 10. Pre-existing future business concept: configurable assessment projects

A future user could log in to a dashboard and create multiple assessment projects.

Each project could be configured from a defined knowledge base.

A user could:

- upload source/standards documents;
- search or select documents already available in the system;
- add custom contextual direction such as “we care about water this year” or “our business goal is to decrease supplier carbon footprint by 20%”;
- save the project inputs;
- initiate a synchronization/regeneration process.

The system would then use the selected knowledge base and contextual direction to generate or update candidate assessment configuration, including:

- indicators;
- questions;
- base weights;
- multiplier rules;
- category weights;
- related retrieval/configuration artifacts.

The process would be repeatable, allowing variants such as:

- a general assessment;
- a China-specific assessment;
- a buyer-specific assessment;
- another context-specific assessment.

The underlying idea is that the product becomes a **configurable assessment engine**, rather than a single permanently fixed questionnaire.

This concept predates the current paid research extension. Implementation of the commercial workflow is outside the current Climate School scope unless separately approved.

---

## 11. Relationship between research build and future product

The Climate School build should stand on its own as a useful, maintainable research application.

It should not be distorted into a premature SaaS platform.

At the same time, implementation choices should avoid unnecessarily closing off future directions already inherent in the product concept.

> **Build the current product well; preserve reasonable optionality for the future; do not build the future product before it is required.**
