# ADR 0001: Approved application architecture

Status: Approved by the project owner in chat on 2026-10-05.
Implementation authorization: initial Milestone 1 scaffold and testing infrastructure only.
This record is outside BUILD_PACK; preserved baseline artifacts remain unchanged.

## Decisions

- One Next.js App Router / React / strict TypeScript application, one npm package.
- No monorepo, separate API service, or orchestrator.
- Framework-independent deterministic domain in src/domain.
- React reducer and scoped context for Milestone 1 assessment state when authorized.
  Do not add Zustand.
- Tailwind with centralized CSS-variable design tokens. Use selective Radix
  primitives only when an interaction materially benefits from their accessibility.
  No broad component framework. Current tokens are infrastructure defaults,
  not an approved product palette or final typography.
- No database or persistence implementation in Milestone 1's current scaffold.
- Later PostgreSQL integration should use Drizzle or another reviewed explicit
  typed migration/data-access layer. SQL/data access stays in adapters, never UI
  or domain code. The specific dependency/version is selected before introduction.
- Zod for runtime validation when input/storage/API/provider boundaries are built.
- Vitest and React Testing Library for unit/component tests; Playwright and axe
  for browser/accessibility checks.
- One verification command runs typecheck, lint, tests, production build, and
  browser checks. Security/dependency checks supplement this before public deployment.

## Dependency direction

Routes and UI call application use cases. Use cases coordinate the deterministic
domain and adapters. Domain code imports only other domain code through relative
paths. It accepts explicit validated values/config snapshots and returns results.
Framework types, database records/clients, provider responses, I/O and mutable
ambient state do not enter the core.

ESLint rejects cross-boundary imports, re-exports, external packages, module loaders,
computed dynamic imports, framework directives, and common nondeterministic globals.
A separate domain TypeScript project omits browser and Node ambient types.
Tests exercise accepted and rejected dependencies against the actual lint configuration.
Do not disable these checks to accommodate a feature; review the boundary first.

Application services own orchestration, explicit errors and authorization boundaries.
Thin server endpoints validate untrusted inputs and recompute authoritative scores
from trusted config. Never trust scores supplied by a client.
Client components own interactions, not independent scoring implementations.

## State and error patterns (future implementation)

Use one assessment reducer with scoped contexts. Stable question IDs key answers;
stable metric IDs key resolved metrics. Keep raw input, missing/skipped states,
validated values, provenance, input revision and config/method versions explicit.
Derived results become stale when their inputs change.
Planned session retention uses a small validated browser-session storage adapter;
it does not promise account-based or cross-device persistence.
Storage failures are visible. Do not implement this adapter in the initial scaffold.

Validate external boundaries once with explicit schemas; infer TypeScript types.
Use consistent safe error codes/messages, field errors and request IDs.
Keep secrets and SME data out of routine logs. Do not hide failures with plausible
mock results. Recommendation failure must not block deterministic results/reports.

## Config and methodology (later milestones)

Preserve QuestionBank, AnswerScales, MetricBenchmarks, MultiplierRules,
CategoryWeights, DocumentIndex and DocumentChunks as separately identifiable,
versionable and auditable entities. No full import/publication pipeline in M1.

M2 introduces validated immutable config snapshots behind ConfigRepository.
Pin an assessment to its config/method version. M5 can introduce persistent versioned
publication behind that boundary, with one active authority, validation before
activation and permanent retention of the original baseline.
CategoryWeights.xlsx / Sheet1 is authoritative; preserve source precision.
Resolve duplicate chunk IDs/title joins through explicit provenance-preserving
mappings, not fuzzy guesses or silent cleanup.

M2 must document numeric representation/comparison policy and produce structured
calculation traces. No formula or methodological changes are authorized here.
Golden captures remain unchanged and are not a substitute for source authority.

## Later capabilities and extension seams

- Authentication: request identity/authorization at application-service boundaries.
- Billing: entitlement checks around use cases; never inside scoring.
- Document processing: artifact adapter -> candidates -> validation/confirmation
  -> resolved canonical metrics. No unconfirmed extraction affects scoring.
- Calculator: separate deterministic metric calculation with unit, reporting-period,
  factor and formula provenance; feeds scoring through metric_id.
- Knowledge-base ingestion: candidate source/index/chunk datasets -> validation
  -> versioned publication.
- Automated source-to-config regeneration: separately approval-gated candidate
  producer, not automatic activation; Milestone 5A is not authorized.
- AI replacement: provider-neutral recommendation contracts and isolated adapters.
  Retrieve evidence and validate output; report actual progress and failures.
- Storage: repository/artifact adapters keep persistence details out of the core.
- Deployment: validated environment configuration and a composition root; no
  hard-coded hostnames or provider credentials. Self-hosted Node/Docker is the target.

These seams are documented, not speculative interface implementations. Future
commercial features require the applicable scope/IP review.

## Alternatives and consequences

A separate Vite frontend/API would add deployment and contract coordination.
A monorepo is unnecessary for one application. Reducer/context is sufficient until
actual complexity justifies another state library. Tailwind supersedes the original
CSS Modules proposal by explicit owner instruction. Accessible native elements are
preferred before adding Radix. No data-access dependency is needed without a database.

Later PostgreSQL provides a growth path for versioned shared data at the cost of
another service. SQLite remains a possible reviewed deployment alternative.
A typed migration layer replaces the original raw-pg proposal.

Keep domain modules independent so provider/storage/UI changes do not reconstruct
assessment logic. Do not add queues, Redis, vector services or a plugin framework
without a measured requirement and any required human review.

## Current scope and review gate

Build the minimal Next scaffold, styling infrastructure, enforceable domain boundary,
tests and verification scripts. A clearly labelled scaffold marker is the only page.
Do not implement landing content, assessment flow, selection/scoring, recommendations,
calculator, persistence or maintenance. No product sample data or fake API responses.

No milestone is marked complete by this ADR. Stop after scaffold verification for
human review; later product work and milestone transitions require authorization.
