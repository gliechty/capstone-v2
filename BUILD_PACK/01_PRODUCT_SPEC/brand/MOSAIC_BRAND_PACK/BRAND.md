# MOSAIC brand specification (web)

Version v1, 2026-10-21. Sources: Hera kit v2 (colour and subtitle source of truth), `BRAND/MOSAIC_BRAND.md` (name and identity, confirmed by the owner 2026-10-07), `UI_BRAND_GUIDE.md` (interaction and accessibility), the v3 explainer film (end-card tagline and credit line). Items marked **[open]** are defaults pending the owner; see `OPEN_ITEMS.md`.

## 1. What MOSAIC is

MOSAIC is an academic research method and web tool from a Columbia Climate School project, not a commercial product. Present it the way a university research project would.

It takes sustainability standards, frameworks, regulations and buyer questionnaires from many organizations, breaks each into single requirements (atomic indicators), and gives more weight to indicators that recur across sources. A business's context (industry, market, buyer, goal, size, location) selects the relevant questions and raises the weight of the ones that matter for it. Results are read against industry benchmarks, and each recommendation cites the source passages it rests on.

Facts the interface must not contradict:
- Context rules only ever raise weights (x1.1 to x1.35). Show matching bars stretching and irrelevant questions fading out, never bars shrinking.
- There is no peer comparison. Comparison is against an industry benchmark.
- Re-running the method on a different document collection is the method's design, not a shipped feature. If it is mentioned, label it "Proposed".
- What-if levers are planned, not built. If shown, label them "Planned feature, illustrative values".

## 2. Name and lines

| Use | Text |
|---|---|
| Name | MOSAIC (always capitals) |
| Expansion (live text: hero eyebrow, method section, footer) | Multi-Organizational Synthesis for Adaptive Indicator Context |
| Primary subtitle (header, hero, social card) | Context-weighted sustainability assessment synthesized from standards and frameworks. |
| Short form (browser tab, footer) | MOSAIC · context-weighted sustainability assessment |
| Method name | Atomic Indicator Synthesis |
| Purpose statement (About, closing section) | Making sustainability standards usable for enterprises without dedicated sustainability teams. |
| Scope statement (required wherever results appear) | MOSAIC complements, and does not replace, formal due diligence or assurance. |
| **Tagline** (hero H1 and closing band; from the film, adopted by the owner 2026-10-21) | The pieces that matter. A clearer way forward. |
| Credit line | Developed by students in Columbia University's M.S. in Sustainability Management. |
| Affiliation line **[open]** | Wording to be confirmed by the owner before public launch. |

All strings, with keys, are in `copy/copy.json`. Where each goes on the page, with sizes per screen width: `PLACEMENT.md`.

## 3. Colour

### Palette

| Token | Hex | Role | On paper |
|---|---|---|---|
| `paper` | #FAF8F3 | Page background | — |
| `paper-raised` | #FFFDF9 | Cards, question surface | — |
| `paper-muted` | #F1EDE4 | Quiet panels, bar tracks on cards | — |
| `ink` | #1B2A41 | Text, headings, line work | 13.6:1 |
| `slate` | #5B6B7F | Secondary text, captions | 5.1:1 |
| `rule` | #E4E0D6 | Hairlines, dividers, empty tiles, bar tracks (decorative) | 1.2:1 |
| `rule-strong` | #7D7A70 | Form-control borders | 4.0:1 |
| `teal` | #2E7D7A | MOSAIC's own work: bars, threads, selected states, buttons | 4.6:1 |
| `teal-deep` | #24605E | Links, hover, text on `teal-soft` | 6.8:1 |
| `teal-soft` | #E3EFEE | Selected option background | — |
| `ochre` | #C99A3B | The one "Start here" item: marker, tile, left rule | 2.4:1 (fill only) |
| `ochre-deep` / `ochre-soft` | #8A6418 / #F4EBD6 | "Start here" tag text / background | 4.5:1 pair |
| `plum` | #86607F | Source type 1 **[open]** | 5.0:1 |
| `slate-blue` | #4C6A9A | Source type 2 | 5.2:1 |
| `sage` | #7E9C6E | Source type 3 | 2.9:1 (fill only) |
| `terracotta` | #B4664A | Source type 4 | 4.0:1 (fill, large text only) |
| `error`, `warning`, `success` (+ `-soft`) | #8E2F25, #5E4A1C, #2D5A3D | Status banners only, always with icon and words | ≥6.6:1 on their soft backgrounds |

Kit colours are paper, ink, slate, rule, teal, ochre and the four source colours. Everything else is derived by this pack for UI states and contrast; `tokens/mosaic.tokens.json` tags each value with its origin.

### Meanings (fixed everywhere)

1. **Teal = MOSAIC's computation.** Score bars, weight bars, the thread that links a recommendation to its source passage, selected context values, primary buttons, focus outline. Bars are teal on a `rule` or `paper-muted` track.
2. **Ochre = the single top priority.** One per screen, on the "Start here" recommendation. Never used for warnings, highlights or decoration.
3. **Source colours = provenance.** A small square tile (about 0.75em, `corner-tile` radius) beside a text label, on evidence chips and source passages. Never used for topics (energy, water, safety), categories (People, Governance, Community, Resources), scores or states.
4. **Ink and slate carry everything else.**

### Source-type mapping (web default) **[open]**

The kit gives each source organization one colour. The corpus has 44 documents from many organizations, so the web maps by source type, using `DocumentIndex.category`:

| Tile | DocumentIndex.category | Chip label |
|---|---|---|
| Slate blue | reporting_standard, disclosure_framework | Reporting standard / Disclosure framework |
| Sage | operational_guidance | Guidance |
| Terracotta | buyer_signal, supplier_requirements | Buyer requirement |
| Plum | regulatory_reference | Regulation |

The chip text names the actual source (for example "GRI 308"); the tile only shows its type. Keep this as one lookup table in presentation code, not in scoring config.

### Categories **[open]**

Default: all four category bars use teal, because a score is MOSAIC's own computation, and the category is named in text beside each bar. Category orientation in the questionnaire (progress rail, card label) uses the category name and a small neutral marker, not a colour change. The four `--category-*` tokens remain so this can change in one place (alternative in `OPEN_ITEMS.md` #1).

## 4. Typography

| Role | Family | Weight | Size token | Notes |
|---|---|---|---|---|
| Landing display H1 | Source Serif 4 | 600 | `display` | `-0.01em` tracking |
| Landing section H2 | Source Serif 4 | 600 | `heading` | |
| App headings (assessment, results) | Source Sans 3 | 600 | `heading` / `subheading` | |
| Question text on the card | Source Serif 4 | 600 | `subheading` | **[open]** see `OPEN_ITEMS.md` #4 |
| Recommendation headline | Source Serif 4 | 600 | `subheading` | |
| Body, labels, buttons, numbers | Source Sans 3 | 400 / 600 | `body` / `small` | `font-variant-numeric: tabular-nums` for scores |
| Pull quotes from source passages | Source Serif 4 Italic | 400 | `body` | Always with a citation |

- The wordmark is a logo file, not live text. If live text is unavoidable (for example in alt-free contexts such as a `<title>`), use plain "MOSAIC".
- Source Serif 4 is a variable font with an optical-size axis. At very large sizes the automatic optical size turns thin; for display text above about 48 px set `font-variation-settings: "opsz" 32` so it matches the logo's weight.
- Use only weights 400 and 600. Line height 1.7 for body, 1.15 for headings. Text columns at most `text-width` (40rem).

Fonts: `fonts/` holds the unmodified variable TTFs from Google Fonts and lossless WOFF2 conversions, under the SIL Open Font License 1.1 (`OFL-SourceSans3.txt`, `OFL-SourceSerif4.txt`). Do not subset or rename them; the Source Sans 3 licence reserves the font name "Source".

## 5. Logo

The mark is a 3 by 3 grid of rounded square tiles, each slightly rotated as if set by hand. The centre tile is ochre (the top priority); the others are the four source colours (many organizations, one structure).

| File | Use |
|---|---|
| `logo/mosaic-lockup.svg` | Film end card, slides, posters and print (mark, wordmark, expansion). Not the site header. Min height 96 px, or the expansion line drops below about 12 px and becomes hard to read. |
| `logo/mosaic-wordmark.svg` | Site header (beside the straight mark) and footer. Min height 18 px. |
| `logo/mosaic-mark.svg` | Mark alone, 32 px and above (hero, About). |
| `logo/mosaic-mark-straight.svg` | Mark alone below 32 px, avatars. |
| `logo/mosaic-lockup-stacked.svg` | Centred placements: end of page, print, posters. |
| `logo/mosaic-lockup-reversed.svg` | Dark backgrounds only (rare; slides, video). |
| `logo/tiles/*.svg` | Single tiles for provenance chips and illustration. |
| `favicon/` | `favicon.ico`, `favicon.svg`, 16/32/48 PNG, `apple-touch-icon.png`, 192/512 and maskable icons, `og-image-1200x630.png`, `site.webmanifest`. |

Text in the logo files is outlined, so they render without fonts. SVGs carry a content-credentials metadata block; leave it in. Alt text: "MOSAIC" for the wordmark and lockup, empty (`alt=""`) when the mark sits beside the visible word.

The logo is a refined sketch, clean for web and video. A designer's pass is suggested before print **[open]**.

Signature motion (optional, landing only): scattered source-coloured tiles drift in and settle into the 3 by 3 grid, once, about 1.2 s, ease-in-out. Skipped entirely under `prefers-reduced-motion`.

## 6. Layout and components

Keep the M1 layout: content width 74rem, text width 40rem, generous section spacing, 1 px borders, soft or no shadow, warm paper backgrounds, no nested cards. The `UI_BRAND_GUIDE.md` interaction model (full-page assessment, vertical question roller, side progress rail, vertical results narrative, prominent "Download full report") is unchanged.

Brand-specific component rules:
- **Primary button:** teal fill, `on-teal` text, `corner-control` radius, hover `teal-deep`. One primary button per view.
- **Links:** `teal-deep`, underlined.
- **Focus:** 3 px teal outline, 4 px offset.
- **Selected context option:** `teal-soft` background, `teal-deep` text, a check icon, and a 1 px teal border.
- **Question card:** `paper-raised`, serif question text, answer options in sans, provenance chips at the foot of the card if shown.
- **Score and weight bars:** teal on a `rule` track, value written as a number beside the bar. A what-if or projected value is an outlined or translucent teal bar beside the solid current bar, never replacing it.
- **"Start here" recommendation:** the only ochre element: a 4 px ochre left rule or a small ochre tile, plus an `ochre-soft`/`ochre-deep` "Start here" tag in words.
- **Evidence chip:** source tile + source name + passage reference, in ink on `paper-muted`. Opening it shows the passage in serif italic, linked by a solid 3 px teal thread or rule.
- **Status banners:** status colour pair, icon and words. Never ochre, never a source colour.
- **Line texture:** the slightly hand-drawn line quality from the film is allowed on decorative dividers and illustrations only, never on controls, charts or text.

## 7. Voice

Measured, precise, plain. Name the method plainly ("atomic indicators", "recurrence weighting", "grounded in cited passages") and explain each term once. Short sentences. Describe what the user gets, not how the system is engineered.

| Write | Avoid |
|---|---|
| "Questions are chosen for your industry, market and buyers." | "AI-powered dynamic questionnaire" |
| "Each recommendation cites the passage it rests on." | "RAG-grounded outputs" |
| "Scores follow fixed rules. The AI writes the recommendations, not the scores." | "deterministic config-driven engine" |
| "Compared with an industry benchmark" | "compared with your peers" |
| "May help you prepare for buyer questionnaires." | "Win more contracts" |
| "Self-reported. Not a certification." | "Certified sustainable" |
| "MOSAIC complements, and does not replace, formal due diligence or assurance." | (omitting the caveat) |

Avoid jargon such as RAG, deterministic, config-driven, LLM, embeddings, and the phrase "transparent code" (users never see code). Avoid hype words and exclamation marks. Keep energy-savings figures off the site until they are measured.

## 8. Imagery

- Flat editorial vector illustration, thin ink line work, generous whitespace, simple geometric shapes: documents as page shapes, indicators as tiles, links as teal threads.
- People, if shown, are simple flat figures without detailed faces.
- Charts are simple and labelled, never decorative.
- No stock photos of leaves, wind turbines, globes, handshakes or hands holding plants. No 3D, no gradients, no glow.
- Reference images from the film kit are in `reference/` for style only; they are video frames, not UI mock-ups. `recommendation-traced-to-source.png` shows the traceable-recommendation idea.

## 9. Do and don't (quick list)

Do: one ochre per screen; label every colour; teal for anything MOSAIC computes; serif for questions and recommendations; plain-text affiliation; scope statement near results; cite sources.

Don't: another product name or tagline; Columbia blue or University marks; green "eco" styling; source colours for topics or categories; colour-only state; peer comparison; outcome promises; hype; redrawn or recoloured logo; font CDN.
