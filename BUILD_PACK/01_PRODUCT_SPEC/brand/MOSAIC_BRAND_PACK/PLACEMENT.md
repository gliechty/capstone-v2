# Placement guide

Where each brand item goes on the site, with sizes per screen width. Breakpoints are the Tailwind defaults the app already uses: **mobile** < 640 px, **tablet** 640–1023 px, **desktop** ≥ 1024 px. Sizes are CSS pixels. Spacing tokens are in `tokens/mosaic-tokens.css`.

## 1. The name, the expansion and the tagline

Three different jobs, so three different placements:

| Item | Job | Form | Where |
|---|---|---|---|
| **MOSAIC** | Identity | Logo (straight mark + wordmark) | Header on every page, footer |
| **Multi-Organizational Synthesis for Adaptive Indicator Context** | Explains the acronym | **Live text**, not part of a logo | Once in the hero, once at the start of the method section, once in the footer |
| **The pieces that matter. A clearer way forward.** | Tagline | Live text, serif display heading | Hero H1; repeated once as the closing line before the footer |

Why the expansion is text, not a lockup:
- It is a sentence people should be able to read, search, select and have read aloud by a screen reader. Text does all of that; an image of text does not.
- In the logo files the expansion is about one eighth of the logo's height. At header size (28–40 px) that is 4–5 px, which nobody can read. It only becomes readable when the lockup is 96 px or taller, which is too big for a header.
- Search engines and the social card pick it up only as text.

So keep the full lockup (`logo/mosaic-lockup.svg`, mark + wordmark + expansion) for places where the logo is the whole picture: the end card of the film, slides, posters and print. On the site, the header carries the short logo and the expansion appears in text near it.

Hero pattern (top of the landing page):

```
[eyebrow, sans, small, slate]   MOSAIC · Multi-Organizational Synthesis for Adaptive Indicator Context
[H1, serif display, ink]        The pieces that matter.
                                A clearer way forward.
[subtitle, serif italic]        Context-weighted sustainability assessment synthesized from standards and frameworks.
[body, sans]                    What matters to your business, your market, and your buyers? ...
[button]                        Take the Assessment
```

The eyebrow is the first and most prominent mention of the expansion. In the method section, spell it out once more with a line on what each word means (see `BRAND.md` section 1 or `MOSAIC_BRAND.md`). Everywhere else, write MOSAIC.

## 2. Site placements

### Header (every page)

| | Mobile | Tablet | Desktop |
|---|---|---|---|
| Logo | Straight mark 24 px + wordmark 16 px high | Mark 28 px + wordmark 20 px | Mark 28 px + wordmark 20 px |
| Gap mark to wordmark | 8 px | 10 px | 10 px |
| Header height | 56 px | 64 px | 72 px |
| Navigation | Collapses to a menu button (44×44 px target) | Inline links if they fit, else menu | Inline links, `small` size, slate, teal-deep on hover |
| Expansion or tagline | No | No | No |
| Background | Paper, 1 px rule bottom border once scrolled | same | same |

The mark and wordmark form one link to the home page, accessible name "MOSAIC home", both images `alt=""`. Leave at least one tile's width of clear space around the mark.

### Hero (landing page)

| | Mobile | Tablet | Desktop |
|---|---|---|---|
| Eyebrow (expansion) | 13 px, wraps to two lines | 14 px | 14 px |
| H1 tagline | 40 px | 48–56 px | 64 px, `opsz` 32 |
| Subtitle | 19 px serif italic | 22 px | 24–28 px |
| Text column | Full width minus 20 px gutters | 36rem | 40rem |
| Illustration or mark | Hidden or below the button | Beside text if space, else below | Right column, mark at 160–220 px or the tile-settle animation |
| Button | Full width | Auto width | Auto width |

`display`, `heading` and `subheading` tokens already scale with `clamp()`, so these sizes come from the tokens. Don't add fixed sizes.

### Film section ("See the approach in practice")

The finished film is in `film/` (see `film/README.md`): `mosaic-explainer-1080p.mp4` with the narration, `mosaic-explainer-720p.mp4` for smaller screens, `mosaic-explainer.en.vtt` captions and `mosaic-explainer-poster.jpg`. Use these files; don't embed the HTML player on the site.

| | Mobile | Tablet | Desktop |
|---|---|---|---|
| Width | Full text column (gutter to gutter) | Full content width, max 720 px | Max 960 px, centred |
| Source | 720p | 1080p | 1080p |
| Frame | 16:9 (`aspect-ratio: 16 / 9`), `corner-panel` radius, 1 px rule border | same | same |

- `<video controls preload="metadata" playsinline poster="...">` with the MP4 as `<source type="video/mp4">` and `<track kind="captions" srclang="en" label="English" src="...vtt" default>`. No autoplay, no loop.
- Under the video, one line in `small` slate: "90 seconds · narrated · captions available".
- Serve the files from the app's own `public/` folder or the site's media host. Each 1080p file is small enough to self-host; a streaming host isn't needed.

### Method / About section

- First line of the section: the expansion as an H3-sized serif line, then a short list of what each word means (Multi-Organizational, Synthesis, Adaptive, Indicator, Context).
- The hand-set mark (`mosaic-mark.svg`) may sit beside it at 96–128 px on desktop; hide it on mobile.
- Method name "Atomic Indicator Synthesis" appears here as a label.

### Closing band (end of landing page, before the footer)

- "The pieces that matter. A clearer way forward." as an H2, centred, serif.
- Below it, the button "Take the Assessment".
- Optional: the stacked lockup (`mosaic-lockup-stacked.svg`) at 120 px high on desktop only, above the line. Not on mobile.

### Assessment and results pages

- Header as above; no hero, no tagline, no expansion.
- Results: the scope statement under the score summary, in `small` slate text, on every screen width.
- One ochre "Start here" item only.
- The downloaded report (PDF/HTML) has the wordmark at the top left (24 px high), the scope statement in the first section, and the short form "MOSAIC · context-weighted sustainability assessment" plus the date in the footer of each page.

### Footer (every page)

| | Mobile | Tablet and desktop |
|---|---|---|
| Layout | Stacked, left-aligned | Two columns: identity left, links right |
| Logo | Wordmark 18 px high | Wordmark 18 px high |
| Lines under it, `small` slate | Expansion · Credit line · Affiliation line · Scope statement | same |
| Links | The footer links the app already has (for example Back to top) | same |

## 3. Browser and sharing assets

| Asset | File | Spec | Where it shows |
|---|---|---|---|
| Favicon | `favicon/favicon.svg` + `favicon.ico` (16/32/48) | Straight mark, transparent | Browser tab, bookmarks |
| Apple touch icon | `favicon/apple-touch-icon.png` | 180×180, paper background, mark inset 12% | iPhone/iPad home screen |
| App icons | `favicon/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Maskable version keeps the mark inside the centre 60% | Android home screen, via `site.webmanifest` |
| Social card | `favicon/og-image-1200x630.png` | 1200×630, mark + wordmark + expansion + subtitle | Link previews (LinkedIn, Slack, email, X) |
| Page title | text | "MOSAIC · context-weighted sustainability assessment" on the landing page; "Results · MOSAIC", "Assessment · MOSAIC" on others | Browser tab |
| Meta description | text | The subtitle plus one sentence; under 160 characters | Search results |

The social card uses the subtitle, not the tagline, because link previews need to say what MOSAIC is. A tagline version can be rendered if the owner prefers it.

## 4. Film and slides (outside the site)

- The film's end card keeps the full lockup with the tagline, as made.
- Slides and posters: stacked lockup on title and closing slides, minimum 96 px high on a 1080p slide; straight mark + wordmark in the corner of content slides at 24 px.
