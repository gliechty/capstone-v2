# AGENTS.md: MOSAIC brand pack

Instructions for an AI coding agent (Codex or similar) applying the MOSAIC identity to the Capstone v2 web app (Columbia Climate School). Read this file first, then the files it names. Everything here is about appearance and wording. Nothing here changes scoring, config, retrieval or prompts.

Pack version: v1, 2026-10-21. Built from the MOSAIC Hera kit v2 (2026-10-07), `BRAND/MOSAIC_BRAND.md`, `UI_BRAND_GUIDE.md` and the v3 explainer film.

## 0. Authority and scope

1. This pack does not authorize work by itself. The repository's own `AGENTS.md`, `BUILD_PLAN.md` and the live Build Checklist still decide what you may do and when. Applying the rebrand is a separate step: do it only when the owner has authorized it as its own step, and do not fold it into another milestone step (for example M4.2).
2. When this pack and `UI_BRAND_GUIDE.md` differ on colour, type, logo or wording, this pack wins, because it is the later, owner-confirmed identity. On interaction model, page architecture and accessibility, `UI_BRAND_GUIDE.md` still governs.
3. Anything listed in `OPEN_ITEMS.md` is not final. Implement the stated default, keep it a single token or copy entry so it can be changed in one place, and mention it in your handoff.
4. Keep the accepted layout. Spacing, radii, motion and the questionnaire roller keep their M1 values (they are carried into `tokens/mosaic-tokens.css` unchanged). A rebrand should change colour, type, logo and words, not move components.

## 1. Read order

1. `BRAND.md`: the full identity: name, colour meanings, type, logo use, layout, voice, do and don't.
2. `copy/copy.json`: every approved string, plus proposed replacements for the current landing copy.
3. `PLACEMENT.md`: where each item goes (header, hero, film, method, results, footer, icons, social card) and its size per breakpoint.
4. `INTEGRATION_NEXTJS.md`: the exact file-by-file mapping onto the current app (`app/src/styles/tokens.css`, `globals.css`, `layout.tsx`, `content/landing.ts`).
5. `OPEN_ITEMS.md`: unconfirmed decisions and their defaults.
6. `tokens/`: `mosaic.tokens.json` (W3C design-tokens format), `mosaic-tokens.css`, `tailwind-v4-theme.css` (the app uses Tailwind v4), `tailwind-v3-preset.cjs` (only for a v3 project).

## 2. Hard rules (MUST / MUST NOT)

Name and words
- MUST write the name as MOSAIC, in capitals. The expansion "Multi-Organizational Synthesis for Adaptive Indicator Context" is live text (hero eyebrow, method section, footer), never only an image. Elsewhere write MOSAIC.
- The tagline is "The pieces that matter. A clearer way forward." (hero H1 and closing band). It is the only tagline.
- MUST NOT introduce any other product name, brand name or marketing tagline. MOSAIC is the only name in this codebase. If old copy names the product something else, replace it with MOSAIC.
- MUST show the scope statement wherever results appear: "MOSAIC complements, and does not replace, formal due diligence or assurance."
- MUST NOT describe comparison with "peers" or other companies. Comparisons are against an industry benchmark.
- MUST NOT promise outcomes (winning buyers, contracts, savings, certification). Self-reported results are labelled "Self-reported. Not a certification."
- MUST NOT use hype words ("revolutionary", "game-changing", "AI-powered", "cutting-edge") or exclamation marks.
- In public-facing copy, MUST NOT use engineering jargon ("RAG", "deterministic", "config-driven", "LLM", "embeddings"); say what it means for the user instead. Never say "transparent code".

Colour (each colour has one meaning; see `BRAND.md` section 3)
- Teal means MOSAIC's own work: score and weight bars, connecting threads, selected states, primary buttons, focus rings.
- Ochre marks the single highest-priority item ("Start here"). At most one ochre element per screen.
- The four source colours (plum, slate blue, sage, terracotta) mean provenance only: which kind of source a passage came from. They MUST NOT encode topics, categories, scores or status.
- MUST NOT use generic sustainability green, leaf/globe/recycling imagery, gradients, glows, neon, glassmorphism, or a dark default theme.
- MUST NOT use Columbia blue or any Columbia University logo, crown, seal or wordmark. The affiliation appears only as plain text, in the approved wording (`OPEN_ITEMS.md` #3).
- MUST NOT convey state by colour alone. Pair colour with a label, icon, shape or fill pattern.
- MUST NOT hard-code hex values in components. Use tokens.

Logo
- MUST use the supplied files in `logo/` and `favicon/` as they are. Do not redraw, recolour, stretch, outline, shadow, animate-spin or re-typeset the logo.
- MUST use `mosaic-mark-straight.svg` (or `favicon/`) below 32 px; the hand-set `mosaic-mark.svg` above that.
- Clear space around the logo is at least one tile width on every side.

Type
- Source Sans 3 for interface, body, labels and numbers. Source Serif 4 (600) for the landing display headings, question text and recommendation headlines only. Self-host the fonts in `fonts/`; no font CDN (the app is built to run with no remote fonts).

## 3. Definition of done for the rebrand step

- `tokens.css` swapped for the MOSAIC tokens with the existing semantic names kept, so no component needs a hex edit.
- Manrope replaced by Source Sans 3 and Source Serif 4 via `next/font/local`; Manrope file and its licence removed only if nothing else uses them.
- Header shows the straight mark + wordmark (`PLACEMENT.md`); hero shows the expansion eyebrow and the tagline H1; favicon, apple-touch icon, web manifest and Open Graph image wired in `layout.tsx` metadata.
- Film section plays `film/` MP4s with captions and poster, per `PLACEMENT.md`; no autoplay.
- Landing copy updated from `copy/copy.json` (`landing_replacements`), with institutional wording left as a flagged placeholder.
- Results page: category bars and score bars teal with labels; exactly one ochre "Start here" item; provenance chips use the source-type colour with a text label; scope statement present.
- Contrast: all text meets WCAG 2.2 AA (4.5:1, or 3:1 for 24 px+ / 18.66 px bold+); control borders meet 3:1. The tokens are chosen to pass when used as documented in `BRAND.md` section 3.
- Reduced motion still removes movement.
- Use only the verification the repository's approved test register allows; this pack asks for no new tests. Report visual checks as screenshots at 1440, 768 and 390 px if the owner asks for a visual review.
- Handoff lists every `OPEN_ITEMS.md` default you implemented.
