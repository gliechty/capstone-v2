# Prompt for Codex: apply the MOSAIC brand

Paste everything below the line into Codex. First unzip the pack to `BUILD_PACK/01_PRODUCT_SPEC/brand/MOSAIC_BRAND_PACK/` in the repository, and add a row for this step to the Build Checklist.

---

Owner authorization: I authorize one new step, **BRAND-1: apply the MOSAIC identity to the existing app**. It is separate from M4.2. Do not bundle it with any other step.

Follow the repository protocol as usual: read `AGENTS.md`, the live Build Checklist row for BRAND-1 and its notes, then start the delivery record (implementation and verification estimates, timestamps).

The brand pack is at `BUILD_PACK/01_PRODUCT_SPEC/brand/MOSAIC_BRAND_PACK/`. Read its `AGENTS.md` first, then `BRAND.md`, `copy/copy.json`, `PLACEMENT.md`, `INTEGRATION_NEXTJS.md` and `OPEN_ITEMS.md`. Where the pack and `UI_BRAND_GUIDE.md` disagree on colour, type, logo or wording, the pack wins. On interaction model and accessibility, the guide still wins.

In scope:
1. Replace `app/src/styles/tokens.css` with the pack's `tokens/mosaic-tokens.css` (it keeps the existing semantic token names), extend the `@theme inline` block from `tokens/tailwind-v4-theme.css`, and move the six hard-coded status colours in `results.css` to the status tokens.
2. Replace Manrope with self-hosted Source Sans 3 and Source Serif 4 (WOFF2 from `fonts/`, via `next/font/local`, licences alongside). Serif goes only where `BRAND.md` section 4 says.
3. Header: straight mark plus wordmark as one "MOSAIC home" link. Hero: expansion eyebrow, tagline H1 "The pieces that matter. / A clearer way forward.", subtitle, existing CTA. Add a closing band and footer lines as described in `PLACEMENT.md`.
4. Favicon set, web manifest and Open Graph image in `layout.tsx` metadata. Keep `robots: noindex`.
5. Apply `copy/copy.json` → `landing_replacements` to `app/src/content/landing.ts`. Items marked `open` stay as visible placeholders.
6. Film section: replace the video placeholder with the files in `film/` (copy them to `app/public/media/`), with controls, captions on, poster, no autoplay.
7. Results page colour rules: category bars teal (default in `OPEN_ITEMS.md` #1), exactly one ochre "Start here" item, scope statement under the score summary.

Out of scope: scoring, config, retrieval, prompts, report logic, M4.2 calculator work, new dependencies, new tests or fixtures, deployment. Do not resolve anything in `OPEN_ITEMS.md`; implement the stated default.

Verification: use only the approved test register. Run the saved gate once on the final candidate. If any existing UI test asserts old copy or colours, report it and ask before changing it. Provide screenshots of landing, assessment and results at 1440, 768 and 390 px.

Leave all changes uncommitted. In the handoff, list the changed files, every open-item default you implemented, anything in the pack you could not follow and why, and the delivery record fields the protocol requires.
