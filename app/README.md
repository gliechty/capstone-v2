# Capstone v2 application scaffold

This single package lives beside the immutable Build Pack. M1.1 provides the UI system and landing-page shell; M1.2–M1.3 add a mock assessment interaction preview.
The root page introduces the research. The assessment CTA opens /assessment. The demo video remains a placeholder.

## Local setup

Use Node.js 24 LTS and its bundled npm.

```sh
npm ci
npx playwright install chromium
npm run verify
npm run dev
```

Run commands from this directory. On Windows PowerShell, use npm.cmd / npx.cmd if execution policy blocks their PowerShell wrappers.
On Linux CI, provision Chromium system dependencies with `npx playwright install --with-deps chromium`.

## Verification

`npm run verify` stops on the first failure and runs:
1. Next route type generation and TypeScript checks, including the isolated domain project.
2. ESLint with zero warnings allowed.
3. Vitest unit/component tests and architecture failure-path tests.
4. A production Next build.
5. Playwright against that production build, including accessibility and 404 checks.

Individual commands: `typecheck`, `lint`, `test`, `build`, `test:e2e`.
Build before running `test:e2e` alone. Port 3100 must be available; tests never reuse an unrelated server.
Test artifacts are ignored. Browser binaries are installed outside the source tree.
Golden scoring tests are deferred to M2 because there is no selection/scoring engine yet.

## Boundaries and portability

See [the approved architecture](docs/adr/0001-approved-architecture.md).
The deterministic domain has no framework, Node, browser, storage, network, or AI dependencies.
ESLint enforces relative imports inside src/domain, with tests for forbidden imports, re-exports, dynamic imports, and ambient inputs.
A separate TypeScript project provides only ECMAScript types, without DOM/Node ambient types.
These are engineering guardrails, not a sandbox against deliberately evasive code.

The scaffold requires no database, credentials, remote fonts, or external runtime service.
`npm run build` / `npm run start` work on a compatible Node host.
Container packaging is deferred; no deployment has been performed.
Dependency locking and the Node major are recorded. Security/dependency checks must be reviewed before public deployment.

## Scope

The assessment flow uses reducer/context and validated browser session storage. No canonical config importer, scoring,
results page, recommendations, calculator, database or maintenance feature is implemented.
Zod validates session snapshots. Radix remains an approved option only when an interaction needs it.

## Lint compatibility and dependency risk

See [ADR 0002](docs/adr/0002-eslint-10-next-plugin.md) for the approved direct Next plugin, React and accessibility checks.
The known development-only braces advisory remains visible in npm audit; see [the risk register](docs/DEPENDENCY_RISKS.md).

## M1.1 visual review

See [the UI review record](docs/M1.1-UI-REVIEW.md) for tokens, font licensing, copy provenance, scope decisions and browser coverage.

## M1.2–M1.3 interaction review

See [the assessment review record](docs/M1.2-M1.3-REVIEW.md) for setup assumptions, mock-only scope, session retention and test coverage.
