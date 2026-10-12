# Development dependency risk register

Reviewed 2026-10-06. Owner approved retaining the direct Next plugin and documenting
this risk. It is not a public-deployment security signoff.

## braces: GHSA-vfj7-8cjw-p6xm / CVE-2026-93687

Dependency chain:
`@next/eslint-plugin-next@16.3.8 -> fast-glob@3.3.1 -> micromatch@4.0.8 -> braces@3.0.3`.

The advisory describes stack exhaustion from deeply nested brace patterns.
It currently lists no patched braces release. Four high audit entries arise from
this one advisory propagated through the chain; they are not four separate exploits.

This chain is development-only: the plugin is a devDependency and is used by ESLint,
not imported by application source. It must stay out of the deployed runtime.
The inspected Next plugin uses fast-glob in `getRootDirs` only when
`settings.next.rootDir` is explicitly set to a string or array. This scaffold
leaves that setting unset and uses the single package's working directory instead.
A lint-configuration regression test checks that rootDir stays unset.
This observation limits the inspected path's exposure; it does not remove the advisory
or claim that the dependency is universally safe.

Do not pass untrusted root/glob patterns into lint configuration. Reassess on plugin,
workspace-layout, rootDir or deployment changes. Check upstream fixes and rerun
`npm audit` and `npm audit --omit=dev` before public deployment.
No overrides, forced audit fixes, downgrades or blanket audit suppression are used.
The audit intentionally remains visible and separate from functional verification.

References:
- https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
- Installed Next plugin: dist/utils/get-root-dirs.js

## M2 closeout recheck — 2026-10-12

Production audit returned zero vulnerabilities. The full audit still returns four high entries for this same development-only chain; its nonzero result is recorded in M2.7-MILESTONE-2-REVIEW.md. No dependency or lockfile change, forced fix, suppression or deployment-security approval was made.
