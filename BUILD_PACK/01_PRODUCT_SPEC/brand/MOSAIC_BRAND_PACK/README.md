# MOSAIC brand pack v1 (2026-10-21)

The complete web identity for MOSAIC (Multi-Organizational Synthesis for Adaptive Indicator Context), packaged for an AI coding agent such as Codex. Hand the agent this folder and tell it to start with `AGENTS.md`.

Open `specimen.html` in a browser to see the tokens, fonts, logo and key components together.

| Path | What it is |
|---|---|
| `CODEX_PROMPT.md` | The prompt to paste into Codex to apply the pack to the existing app |
| `AGENTS.md` | Entry point for the coding agent: authority, read order, hard rules, definition of done |
| `BRAND.md` | Full specification: name and lines, colour meanings, type, logo use, components, voice, imagery |
| `copy/copy.json` | Every approved string, with status, plus proposed replacements for the app's current landing copy |
| `PLACEMENT.md` | Where every brand item goes on the site, with sizes for mobile, tablet and desktop; where the acronym expansion and tagline appear |
| `INTEGRATION_NEXTJS.md` | File-by-file steps for the existing Next.js app, including old-to-new token mapping |
| `OPEN_ITEMS.md` | Seven unconfirmed decisions, each with the default the pack uses |
| `tokens/` | `mosaic.tokens.json` (W3C format), `mosaic-tokens.css`, `tailwind-v4-theme.css`, `tailwind-v3-preset.cjs`, and `build_tokens.py`, which regenerates all four |
| `logo/` | Lockup, stacked and reversed lockups, wordmark, mark (hand-set and straight), single tiles. SVG and PNG, text outlined |
| `favicon/` | `favicon.ico`, `favicon.svg`, PNG sizes, apple-touch icon, 192/512/maskable icons, `site.webmanifest`, `og-image-1200x630.png` |
| `fonts/` | Source Sans 3 and Source Serif 4, variable TTF (unmodified, from Google Fonts) and WOFF2, with OFL licences |
| `film/` | The narrated explainer as MP4 (1080p and 720p), captions (WebVTT) and poster frame, ready for the site |
| `reference/` | Frames from the video kit, for style reference only |
| `specimen.html` | Visual check page |

Where it came from: the MOSAIC Hera kit v2 (colours and subtitle), `BRAND/MOSAIC_BRAND.md` (identity), `BUILD_PACK/01_PRODUCT_SPEC/UI_BRAND_GUIDE.md` (interaction and accessibility), and the v3 explainer film (closing line and credit line). Values added for interface states and contrast are tagged `derived` in the tokens file.

Suggested home in the repository: `BUILD_PACK/01_PRODUCT_SPEC/brand/`, with a one-line pointer added to `UI_BRAND_GUIDE.md` section 8 and to the root `AGENTS.md` read order. The pack does not make those edits itself.
