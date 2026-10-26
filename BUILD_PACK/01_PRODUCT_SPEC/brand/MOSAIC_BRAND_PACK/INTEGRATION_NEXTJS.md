# Applying MOSAIC to the current app

The app (`app/`, Next.js 16, React 19, Tailwind v4, self-hosted fonts) already centralizes its look in `src/styles/tokens.css` and the `@theme inline` block in `src/app/globals.css`. Components use semantic names (`--accent`, `--surface`, `--text`, `--category-*`). The MOSAIC token file keeps those names, so most of the rebrand is a token swap plus fonts, logo and copy. This is based on a read of the app as of 2026-10-21 (M1.1 tokens, M3 results styles).

Do this only as its own authorized step (see `AGENTS.md` section 0).

## 1. Tokens

| Step | Change |
|---|---|
| 1 | Copy `tokens/mosaic-tokens.css` to `src/styles/tokens.css` (replace). It defines `--mosaic-*` primitives and the existing semantic names. |
| 2 | In `globals.css`, keep the existing `@theme inline` block, or replace it with `tokens/tailwind-v4-theme.css`, which is a superset (adds `font-serif`, `priority`, `source-1..4`, `rounded-tile`, `rounded-chip`, status colours). |
| 3 | `src/styles/results.css` hard-codes six status hexes (`#fff0c2`, `#684300`, `#fbe5e1`, `#852720`, `#e5f3e9`, `#175333`). Replace them with `--status-warning-soft` / `--status-warning`, `--status-error-soft` / `--status-error`, `--status-success-soft` / `--status-success`. |
| 4 | `computed-scores.tsx` already sets `--bar-color: var(--category-<name>)`. No code change: the category tokens resolve to teal by default (`OPEN_ITEMS.md` #1). |
| 5 | Search `src/` for any remaining literal hex or `rgb(` values outside `tokens.css` and move them to tokens. |

Current to MOSAIC, for review:

| App token (M1.1) | Was | Now |
|---|---|---|
| `--surface` | #faf8f3 | #FAF8F3 paper (same) |
| `--surface-raised` | #fffdf9 | #FFFDF9 (same) |
| `--surface-muted` | #efeae1 | #F1EDE4 paper-muted |
| `--text` | #282b29 | #1B2A41 ink |
| `--text-muted` | #5f625c | #5B6B7F slate |
| `--accent` | #9d402d (rust) | #2E7D7A teal |
| `--accent-hover` | #7c3021 | #24605E teal-deep |
| `--accent-soft` | #f2e1d8 | #E3EFEE teal-soft |
| `--on-accent` | #fffdf9 | #FFFDF9 (same) |
| `--border` | #d5d0c5 | #E4E0D6 rule |
| `--border-strong` | #85877c | #7D7A70 rule-strong |
| `--category-people` | #76516b | teal (default) |
| `--category-governance` | #49647c | teal (default) |
| `--category-community` | #886029 | teal (default) |
| `--category-resources` | #4b6e61 | teal (default) |
| `--font-body` | Manrope | Source Sans 3 |
| `--tracking-heading` | -0.04em | -0.01em (serif) |
| new | | `--font-display`, `--accent-text`, `--priority*`, `--source-1..4`, `--status-*`, `--corner-tile`, `--corner-chip`, `--thread-width` |

Watch for: `--accent` was used as text colour in `.section-label`, `.nav-link:hover` and `.text-link`. Teal passes AA on paper (4.6:1) but not on `paper-muted` or `teal-soft`; where accent-coloured text sits on those surfaces, use `--accent-text` (teal-deep).

## 2. Fonts

Copy `fonts/SourceSans3-Variable.woff2`, `fonts/SourceSans3-Italic-Variable.woff2`, `fonts/SourceSerif4-Variable.woff2`, `fonts/SourceSerif4-Italic-Variable.woff2` and both `OFL-*.txt` files to `src/styles/fonts/`. Then in `src/app/layout.tsx`:

```tsx
import localFont from "next/font/local";

const sourceSans = localFont({
  src: [
    { path: "../styles/fonts/SourceSans3-Variable.woff2", style: "normal" },
    { path: "../styles/fonts/SourceSans3-Italic-Variable.woff2", style: "italic" },
  ],
  variable: "--font-source-sans",
  weight: "200 900",
  display: "swap",
});

const sourceSerif = localFont({
  src: [
    { path: "../styles/fonts/SourceSerif4-Variable.woff2", style: "normal" },
    { path: "../styles/fonts/SourceSerif4-Italic-Variable.woff2", style: "italic" },
  ],
  variable: "--font-source-serif",
  weight: "200 900",
  display: "swap",
});

// <html lang="en" className={`${sourceSans.variable} ${sourceSerif.variable}`}>
```

`mosaic-tokens.css` reads `--font-source-sans` and `--font-source-serif`. Remove `Manrope-variable.ttf` and its `OFL.txt` once nothing references them, and update the font-provenance note in the UI review record (source: github.com/google/fonts `ofl/sourcesans3` and `ofl/sourceserif4`, downloaded 2026-10-21, unmodified; WOFF2 is a lossless conversion).

Serif placement (add to `globals.css` base or component layers):

```css
.landing h1, .landing h2 { font-family: var(--font-display); }
.landing h1 { font-variation-settings: "opsz" 32; }
.question-text, .recommendation-title { font-family: var(--font-display); font-weight: var(--weight-semibold); }
```

Use the class names the app already has for the question text and recommendation headline; the ones above are placeholders.

## 3. Logo, favicon, metadata

- Copy `logo/mosaic-lockup.svg`, `logo/mosaic-wordmark.svg`, `logo/mosaic-mark.svg`, `logo/mosaic-mark-straight.svg` to `public/brand/`.
- Copy everything in `favicon/` to `public/` (or use the App Router file conventions: `src/app/favicon.ico`, `src/app/icon.svg`, `src/app/apple-icon.png`, `src/app/opengraph-image.png`).
- Header (`landing-header.tsx` children in `page.tsx`): render `mosaic-mark-straight.svg` at 28 px plus `mosaic-wordmark.svg` at 20 px high, 10 px apart, as one link whose accessible name is "MOSAIC home" (images `alt=""`). Do not put the full lockup in the header: at header height its expansion line is too small to read. Use the full lockup at 96 px or more in the hero or About section, or write the expansion once as live text.
- `layout.tsx` metadata:

```ts
export const metadata: Metadata = {
  title: landingCopy.metadata.title,          // "MOSAIC · context-weighted sustainability assessment"
  description: landingCopy.metadata.description,
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "48x48" }], apple: "/apple-touch-icon.png" },
  manifest: "/site.webmanifest",
  themeColor: "#FAF8F3",
  openGraph: { title: "MOSAIC", description: "Context-weighted sustainability assessment synthesized from standards and frameworks.", images: [{ url: "/og-image-1200x630.png", width: 1200, height: 630 }] },
  robots: { index: false, follow: false },    // keep until the owner approves public indexing
};
```

(In Next 16, `themeColor` belongs in the `viewport` export; move it there if the build warns.)

## 4. Copy

Apply `copy/copy.json` → `landing_replacements` to `src/content/landing.ts`, and lay out the hero, closing band and footer as in `PLACEMENT.md`. Each entry gives the current text (`from`) and the replacement (`to`). Entries marked `open` stay as visible placeholders until the owner confirms the wording. Add the two new footer keys and render them in the footer as plain text.

## 5. Results page specifics

- Exactly one ochre element: the first-ranked recommendation, with a "Start here" tag. Nothing else on the page uses `--priority`.
- Evidence chips: `--source-N` tile chosen by `DocumentIndex.category` (mapping in `BRAND.md` section 3), plus the source name in text. Keep the mapping in presentation code.
- Scope statement near the score summary and in the downloaded report.
- Category bars: teal, labelled, value written beside the bar (already the case).
