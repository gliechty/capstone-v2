# EXTERNAL_SERVICES.md

## Purpose

Inventory of networked services and platform dependencies used by the current v1 Capstone application.

This distinguishes:

1. services deployed on the Capstone server;
2. external SaaS/API dependencies;
3. infrastructure dependencies;
4. platform/vendor auxiliary services.

---

## 1. Runtime dependency map

```text
User browser
    |
    | HTTPS
    v
Caddy on Hetzner host
    |------------------------------|
    |                              |
    v                              v
appsmith.flowagentai.website       n8n.flowagentai.website
127.0.0.1:9080                     127.0.0.1:5678
    |                              |
    | UI + scoring                 | question selection / RAG / LLM orchestration
    |                              |
    |                              +--> Google Sheets / Google APIs
    |                              |
    |                              +--> OpenAI API
    |
    +--> n8n webhooks

Local Docker network: `ai-capstone_default`

NocoDB --> PostgreSQL
```

---

## 2. External SaaS / API dependencies

| Service | Current v1 role | Consumer | Required for v1? | Migration treatment |
|---|---|---|---:|---|
| Google Sheets / Google APIs | Runtime configuration and retrieval datasets: QuestionBank, AnswerScales, MetricBenchmarks, MultiplierRules, CategoryWeights, DocumentIndex, DocumentChunks | n8n | Yes | Preserve behavior for parity; v2 may migrate canonical data into a database after regression testing |
| OpenAI API | Final recommendation generation in the RAG/output workflow | n8n | Yes for recommendations | Put behind a provider abstraction in v2; deterministic selection/scoring must remain model-independent |

### Google Sheets / Drive data dependencies

Known authoritative runtime/config datasets include:

- QuestionBank `Test_Questions`
- AnswerScales
- MetricBenchmarks
- MultiplierRules
- CategoryWeights
- DocumentIndex
- DocumentChunks

The Build Pack preserves clean canonical CSV versions so the migration does not depend on Google Sheets remaining available forever.

### OpenAI

The final recommendation workflow currently uses an OpenAI model through n8n.

Model selection is an implementation dependency of the recommendation layer, **not** part of the deterministic scoring methodology.

Do not make question selection, normalization, weighting, or overall score generation dependent on OpenAI availability.

---

## 3. Infrastructure dependencies

| Service / infrastructure | Role |
|---|---|
| Hetzner VPS | Hosts the complete v1 application stack |
| DNS for `flowagentai.website` | Routes public subdomains to the server |
| Caddy | Host-level reverse proxy and HTTPS termination |
| Docker Engine | Runs PostgreSQL, NocoDB, n8n, and Appsmith |
| Docker named volumes | Persist PostgreSQL, n8n, and Appsmith state |

Known public application hostnames:

- `n8n.flowagentai.website`
- `appsmith.flowagentai.website`

Exact DNS provider was not captured and should not be invented.

Caddy manages HTTPS automatically; the exact ACME certificate authority used by the current host was not captured.

---

## 4. Server-local platform dependencies

These are important components but are **not external SaaS dependencies**:

### PostgreSQL 15

Container:

`ai-capstone_postgres_1`

Role:

- backing database for NocoDB
- no production Capstone domain tables were found in prior database inspection

### NocoDB

Container:

`ai-capstone_nocodb_1`

Role:

- legacy/testing data service
- previous inspection found only the `test_smes` user model
- not authoritative for the final production scoring/config model

### n8n

Container:

`ai-capstone_n8n_1`

Role:

- question-selection endpoint
- retrieval orchestration
- recommendation prompt construction
- OpenAI invocation
- response formatting

### Appsmith EE

Container:

`appsmith`

Role:

- v1 user interface
- authoritative v1 scoring implementation through `AssessmentScoring`
- calls n8n webhooks for selected questions and recommendations

---

## 5. Known application endpoints

Current v1 application behavior uses:

- `/webhook/final-preview-questions`
- `/webhook/capstone-ai-output-final`

The externally reachable base URL is controlled by `WEBHOOK_URL` / reverse-proxy configuration.

---

## 6. Credential locations / handling

Known credential classes:

| Credential class | Current storage/consumer | Build Pack rule |
|---|---|---|
| PostgreSQL password | Docker Compose environment | Preserve name/purpose only |
| NocoDB DB connection | `NC_DB` | Preserve schema/role, not secret value |
| n8n encryption key | Docker Compose environment | Preserve securely outside Build Pack |
| Google API / Sheets credential | n8n credential store | Preserve credential reference/type only |
| OpenAI API credential | n8n credential store | Preserve credential reference/type only |
| Appsmith internal/vendor keys | Appsmith runtime | Do not copy secret values into project docs |

---

## 7. Platform/vendor auxiliary services

The Appsmith EE runtime exposes configuration names for Appsmith cloud services, BetterBugs, Segment, and license verification.

These are platform-level Appsmith dependencies rather than Capstone business-logic dependencies.

For v2 migration:

- do not replicate them unless the chosen Appsmith deployment still requires them;
- do not treat them as product requirements;
- do not put their key values into the Build Pack.

---

## 8. v2 portability rule

The v2 application should keep business logic independent from any one integration provider.

Preferred boundaries:

```text
Assessment domain
    |
    +-- Config repository interface
    +-- Evidence/document repository interface
    +-- Recommendation-model provider interface
    +-- Authentication/storage adapters
```

This makes Google Sheets and OpenAI replaceable implementation adapters rather than hard-coded product logic.

---

## 9. Explicitly not established

The current evidence does **not** establish:

- a production Redis dependency;
- a production vector database;
- a deployed embedding service;
- a production external NocoDB Cloud dependency;
- GitHub as a runtime dependency;
- a payment/email service dependency;
- the DNS registrar/provider;
- the exact ACME certificate authority selected by Caddy.

Do not add these to the v1 architecture without new evidence.
