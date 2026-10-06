# ADR 0002: ESLint 10 with direct Next rules

Status: Approved by the project owner; implemented 2026-10-06.
Scope: scaffold tooling only. Supersedes the initial bundled lint preset choice.

Keep ESLint 10 and Next 16.3.8. Remove eslint-config-next, whose bundled React,
import and JSX accessibility plugins exclude ESLint 10 in their peer ranges.
The installed React plugin also failed at runtime on removed context.getFilename.

Use @next/eslint-plugin-next@16.3.8 directly with its entire Core Web Vitals rule set.
Use @eslint/js recommended, typescript-eslint recommended and official React Hooks
recommended rules. Use the maintained ESLint React plugin for selected React/DOM
correctness checks and ESLint Community's jsx-a11y-x recommended configuration for
static accessibility. Both replacement packages declare compatible peers.
Map Next Image/Link components for accessibility checks.

React checks cover missing list keys/component display names, direct state mutation,
nested component definitions, conflicting children props, JSX comments/namespaces,
invalid DOM properties, void-element children and conflicting dangerouslySetInnerHTML.
This is explicit correctness coverage, not a claim of identical coverage to every old
react/recommended rule. TypeScript handles typed JSX contracts. Hooks rules are not
duplicated, and no styling or React API migration rules are imposed.

Tests exercise actual invalid Next, React, Hooks and accessibility source and verify
all upstream Core Web Vitals rules retain their severity. Domain boundary enforcement
and its tests remain intact. Browser axe checks supplement static checks.

No forced peer overrides, compatibility shims or package downgrades are used.
The remaining braces development advisory is documented in ../DEPENDENCY_RISKS.md.
It remains visible to npm audit. No public deployment is authorized.

References:
- https://nextjs.org/docs/app/api-reference/config/eslint#using-the-plugin-directly
- https://github.com/eslint-community/eslint-plugin-jsx-a11y-x
- https://eslint-react.xyz/docs/rules
