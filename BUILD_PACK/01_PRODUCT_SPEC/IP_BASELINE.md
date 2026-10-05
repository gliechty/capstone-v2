# IP_BASELINE.md

## Purpose

This document records ideas, methods, artifacts, and product concepts that existed **before the current paid Columbia research extension**.

It is a provenance record, not a legal determination of ownership.

It should be read together with:

- the preserved Spring 2026 Capstone artifacts;
- dated prompts/workbooks/config files;
- Git history where available;
- `COLUMBIA_IP_GUARDRAILS.md`.

---

## 1. Pre-existing Capstone work

The following originated in the Spring 2026 Capstone and predate the paid research extension.

### Core product / methodology

- SME sustainability assessment oriented toward procurement readiness;
- contextual assessment based on company and market circumstances rather than a universal generic ESG score;
- deterministic, config-driven question selection;
- deterministic answer normalization and scoring;
- base weights;
- contextual multiplier rules;
- category weights;
- metric benchmarks;
- category and overall scoring;
- source-grounded recommendations downstream of deterministic scoring.

### Canonical configuration concepts

- `QuestionBank`
- `AnswerScales`
- `MetricBenchmarks`
- `MultiplierRules`
- `CategoryWeights`
- `DocumentIndex`
- `DocumentChunks`

The exact storage technology may change. These concepts and their role in the Capstone method predate the paid research extension.

### Source → assessment methodology

The Capstone research process included a prompt-assisted transformation chain broadly involving:

- source-document review/extraction;
- AtomicIndicators;
- normalization;
- clustering;
- frequency/context analysis;
- base-weight generation;
- QuestionBank formation/refinement;
- retrieval/document metadata preparation.

The preserved prompts and workbooks in the Build Pack are the provenance record for the specific process.

### Recommendation / evidence concept

The Capstone application already used:

- SME assessment context;
- deterministic score outputs;
- a sustainability-source corpus;
- retrieval;
- an LLM recommendation step;
- evidence/source references.

---

## 2. Pre-existing future SaaS concept: procurement teams

Before the paid research extension, the broader product concept included use by large-company procurement organizations.

A buyer such as Amazon, Walmart, or another large organization could customize/share an assessment with potential suppliers as a pre-boarding or procurement-cycle tool.

### Supplier-side value

- understand what the buyer values;
- identify disclosures/operational improvements to optimize;
- improve readiness for procurement opportunities.

### Buyer-side value

- collect richer upstream sustainability information;
- organize/compare potential suppliers;
- communicate procurement sustainability priorities;
- understand relative supplier performance in relevant peer contexts;
- potentially broaden the pool of SMEs capable of meeting buyer requirements.

No claim is made here that any particular post-extension code implementing this concept is pre-existing.

---

## 3. Pre-existing future SaaS concept: configurable assessment projects

Before the paid research extension, the product concept also included logged-in users creating multiple assessment projects from a dashboard.

A project could be customized by:

- uploading a defined knowledge base;
- selecting documents already held in a database;
- adding custom contextual instructions or priorities.

Examples included:

- “we care about water this year”;
- “our goal as a business is to decrease our supplier carbon footprint by 20%.”

The user could then initiate a synchronization/regeneration process that would derive candidate assessment configuration from the selected sources and direction.

Conceptually derived outputs included:

- indicators;
- questions;
- base weights;
- multiplier rules;
- category weights;
- related retrieval/configuration artifacts.

The process was intended to be repeatable, allowing multiple assessment variants such as:

- a general questionnaire;
- a China questionnaire;
- a buyer-specific questionnaire;
- another context-specific assessment.

---

## 4. Pre-existing commercial thesis

Before the paid research extension, the broader commercial concept included:

- a low-cost or free supplier-facing assessment;
- suppliers voluntarily providing structured sustainability information in exchange for actionable insight;
- large buyers paying for supplier intelligence / procurement workflow value;
- supplier data becoming more valuable as participation grows;
- the assessment acting as a bridge between SMEs and large-company procurement teams.

The commercial thesis was not that the system creates the one correct sustainability score.

It was that sustainability relevance is contextual, and that a configurable assessment could help identify which indicators matter most to a buyer / market / industry / goal context while collecting structured supplier information at scale.

This section records the concept only. It does not claim that code, data, algorithms, or implementation first created during the paid research extension are pre-existing.

---

## 5. What this baseline does NOT claim as pre-existing

### Interactive sliders / levers

The interactive lever/sliders concept belongs to the paid research-extension period and is not claimed here as a pre-existing product concept.

### New implementation code

Code written or generated during the paid research extension is not made “pre-existing” by implementing an older idea.

### New methods or algorithms

A novel algorithm, scoring method, ingestion process, optimization, or other technical invention first developed during the paid research extension must be evaluated based on when and how it was actually created.

### Research-extension datasets

New data, derived research data, validation data, or source collections created during University research are not claimed here as pre-existing.

---

## 6. Columbia policy context — authoritative links

This section records the Columbia sources that are relevant to the provenance boundary. It does not interpret them as a legal conclusion.

### Protection of Intellectual Property

Columbia Research states that, unless waived, the University holds rights to patentable inventions/discoveries and associated technology that result primarily from use of University facilities or from the activity of University officers while engaged in University service.

It also describes invention-assignment requirements for specified research appointment categories.

Source:
https://research.columbia.edu/protection-intellectual-property

### Columbia Copyright Policy

The University's Copyright Policy covers computer programs/software and describes circumstances in which Columbia asserts copyright, including certain works supported by University resources, commissioned by the University, created for specific University use, or subject to sponsored-project obligations.

Source:
https://provost.columbia.edu/content/copyright-policy

### Ownership of Research Data

Columbia Research states that Research Data and other records of University Research belong to the University unless a sponsorship or other agreement provides otherwise.

Source:
https://research.columbia.edu/content/ownership-data

### Columbia Technology Ventures

CTV handles technology transfer, patent/IP management, licensing, startup-related technology transfer, and related matters.

Source:
https://techventures.columbia.edu/

Columbia Research notes that CTV is involved in launching **20+ patent-based startups each year**, illustrating that commercialization/licensing pathways exist when University IP is involved.

Source:
https://research.columbia.edu/resources-technology-transfer

### Student / research-employment issue

CTV's student guidance should be consulted before relying on assumptions about student ownership or release of University rights, particularly where the student is employed in a research setting.

Relevant CTV student FAQ:
https://techventures.columbia.edu/sites/default/files/content/Columbia%20Technology%20Ventures%20-%20FAQ%20for%20students.pdf

---

## 7. Provenance practices

To keep this baseline useful:

- preserve the Spring 2026 Build Pack as a dated snapshot;
- preserve original prompts/workbooks/source artifacts where possible;
- preserve file dates and hashes;
- use Git history for new implementation work;
- document the date and context of material product/method decisions;
- keep pre-paid-research concepts distinguishable from paid-extension implementation;
- do not retroactively describe paid-research inventions as pre-existing ideas.

A separate repository or local copy can help demonstrate provenance, but storage location alone does not determine legal ownership.

---

## 8. Legal-status disclaimer

This document records chronology and provenance only.

Columbia's ownership rights may depend on:

- employment/appointment status;
- University funding or resources;
- whether work was created for University use;
- whether work is patentable;
- any signed invention/assignment agreement;
- sponsored-project terms;
- University research-data rules;
- the facts and circumstances of creation.

Those questions are governed by applicable Columbia policy, agreements, and law.
