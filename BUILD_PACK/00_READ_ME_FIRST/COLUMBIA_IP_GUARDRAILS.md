# COLUMBIA_IP_GUARDRAILS.md

## Status

Working IP-risk guardrails for the Capstone v2 build.

**Last researched:** October 2026.

This document summarizes authoritative Columbia sources so implementation agents can recognize when work may cross from ordinary research implementation into potentially valuable new intellectual property.

It is not legal advice and does not determine ownership.

## 1. Why this matters

The current project is a paid Columbia research extension of a Spring 2026 Capstone and is intended to produce a web application suitable for Climate School use.

The exact formal payroll/appointment classification has not yet been established in the Build Pack. Existing personal records describe the work as a paid “Research Assistant (Informal Contract),” but no appointment letter or signed invention agreement has yet been preserved here.

Because employment classification and project terms may materially affect ownership, agents should not assume either that the user owns everything because the original idea was theirs, or that Columbia owns everything because the work is paid.

## 2. Authoritative Columbia policy points

### Patentable inventions / associated technology

Columbia Research states that, unless waived, the University holds rights to patentable inventions/discoveries and associated technology that result primarily from use of University facilities or from the activity of University officers while engaged in University service.

Certain categories—including salaried Officers of Research and Student Officers of Research—must execute invention-assignment agreements.

Sources:
- https://research.columbia.edu/protection-intellectual-property
- https://techventures.columbia.edu/sites/default/files/content/inventionagreementlettermay2024.pdf

### Student release guidance does not broadly cover research-employed students

CTV's student FAQ says it will generally assign/release whatever Columbia rights it may have to a student only when all stated conditions are satisfied.

One condition is that none of the Columbia-affiliated inventors is employed by Columbia in a research setting. The FAQ gives examples including research-related part-time/casual/temp roles and research-assistant positions.

Source:
- https://techventures.columbia.edu/sites/default/files/content/Columbia%20Technology%20Ventures%20-%20FAQ%20for%20students.pdf

Because this project is paid research, do not assume the ordinary student-project release approach applies.

### Copyrightable works and software

Columbia's Copyright Policy states that the University asserts copyright ownership in works of authorship that are:
- created with substantial University resources/support beyond ordinary resources;
- created or commissioned for use by the University; or
- subject to sponsored-project terms requiring University ownership.

The policy expressly includes computer programs/software within copyrightable works and identifies certain works created for specific University use as Institutional Works.

Source:
- https://provost.columbia.edu/content/copyright-policy

### Research data

Columbia Research states that Research Data and other records of University Research belong to the University unless a sponsorship or other agreement provides otherwise.

Source:
- https://research.columbia.edu/content/ownership-data

This is especially relevant before creating proprietary commercial datasets, scraped peer-company data, benchmarking databases, or other data assets inside the paid research project.

### Sponsored-project terms may change the answer

Columbia policy repeatedly notes that sponsor/contract terms can affect intellectual-property and copyright ownership.

The Build Pack currently does not establish whether SEE Foundation or another party has contractual/sponsored-project rights in the paid extension.

This must be verified rather than inferred.

## 3. Agent behavior

### Current-scope implementation

Agents may proceed with work necessary to implement the agreed Climate School research product, including UI/UX, performance/refactoring, testing, config maintenance, approved calculator integration, reliability, deployment, and research transparency.

Permission to proceed is not an ownership conclusion.

### Stop before a new methodological or technical invention

Agents should stop and request human review before implementing a materially new:
- scoring algorithm;
- materiality methodology;
- config-generation algorithm;
- autonomous ingestion/regeneration method that goes materially beyond the preserved Capstone process;
- novel benchmarking/ranking method;
- proprietary retrieval/optimization method intended to create commercial differentiation;
- technical method that may plausibly be patentable.

The agent may describe the problem and why a new approach might help, but should not silently build a novel invention into the paid research codebase.

### Do not build commercial-product differentiation by default

Without explicit human approval following IP review, agents should not implement:
- subscription/billing systems;
- commercial multi-tenant customer product features;
- proprietary buyer/procurement intelligence;
- proprietary peer-company scraping/market-intelligence datasets;
- commercial ranking/benchmarking products;
- other distinct SaaS differentiation outside the approved research deliverable.

If such an opportunity arises, surface it briefly and stop before implementation.

### Commercial opportunity discovered during implementation

If ordinary implementation work reveals a potentially valuable commercial capability, method, dataset, workflow, or product feature that is **not necessary to satisfy the approved Climate School scope**, stop before designing, prototyping, or implementing it in detail.

Identify the opportunity only at the level necessary to explain:
- what was discovered;
- why it appears commercially relevant;
- why it is not required for the current research deliverable;
- what minimal non-commercial implementation can proceed without it.

Then invoke the `IP REVIEW REQUIRED` structure below and wait for human direction.

Do not use agent autonomy to turn an incidental research-build discovery into embryonic SaaS differentiation inside the paid-research codebase.

## 4. Agent IP-review trigger

When a proposed change may create something materially beyond the current research requirement, output:

### IP REVIEW REQUIRED

**Proposed capability:**  
[one sentence]

**Why it is beyond the current baseline:**  
[one or two sentences]

**Potentially affected category:**  
- pre-existing concept
- new copyrightable software
- potentially patentable method/algorithm
- University Research Data
- commercial product differentiation
- unclear

**Can the current research build proceed without it?**  
Yes / No

**Suggested non-implementing fallback:**  
[what can be done now without creating the new capability]

Then stop that feature until the human project owner approves the next step.

## 5. Provenance separation

### Pre-paid-research baseline
Preserve the Spring 2026 Capstone artifacts, pre-existing prompts, canonical config concepts, pre-existing product/SaaS concepts, dated documents, and hashes.

See `IP_BASELINE.md`.

### Paid research
Use clear Git history for code, new configuration, methodological changes, research outputs, datasets, and agent-generated implementation.

### Future commercial work
If/when a separate commercial workstream begins:
- use a separate repository/workspace;
- avoid using paid Columbia research time for that work;
- do not copy University-owned Research Data or confidential/sponsor-restricted material without clearance;
- record which inputs are pre-existing/public/licensed versus produced in the paid research project.

Repository separation is useful evidence of boundaries, but does not itself establish ownership.

## 6. Specific unresolved facts

Before commercial implementation, resolve at least:
1. What is the user's formal Columbia appointment/payroll classification?
2. Was an Invention Agreement or other IP assignment signed?
3. Is this extension governed by any SEE/sponsor agreement, grant, or statement of work?
4. Does Columbia consider the v2 application a work “created or commissioned for use by the University” under its Copyright Policy?
5. How does Columbia distinguish the pre-existing Spring 2026 Capstone/background concepts from new work created during the paid extension?
6. What rights, license, or release would be needed to use paid-extension code or research outputs in a later commercial product?

## 7. Recommended authoritative clarification

Send CTV a narrow factual request.

Suggested questions:
1. I completed the original Spring 2026 Capstone as a student and documented software/product concepts before beginning the paid extension. How does Columbia treat that pre-existing/background work?
2. What is my formal appointment category for IP-policy purposes, and am I subject to an Invention Agreement?
3. For code created during this paid research extension to build a Climate School-hosted web application, what copyright or patent rights would Columbia assert?
4. If I later develop a separate commercial product based on pre-existing concepts, what clearance or license would be needed to use any code, methods, or research outputs first created during the paid extension?
5. Are any SEE Foundation, grant, or sponsored-project terms relevant to ownership or commercialization?

Authoritative contacts/sources:
- https://techventures.columbia.edu/
- https://research.columbia.edu/protection-intellectual-property

## 8. Operating principle

> **Do not use agent autonomy to create valuable new commercial or patentable functionality inside an ambiguous paid-research IP boundary.**

Agents should have broad freedom to improve implementation of the agreed research product while stopping before they independently invent functionality whose ownership or commercial reuse could become important later.
