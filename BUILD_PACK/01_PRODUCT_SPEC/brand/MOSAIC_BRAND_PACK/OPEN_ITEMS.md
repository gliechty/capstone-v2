# Open items

Decisions not yet confirmed by the owner. Each has a default that is implemented as a single token or copy entry, so changing it is a one-place edit. Agents: implement the default and list it in your handoff. Do not resolve these yourself.

| # | Item | Default in this pack | Alternative | Where it lives |
|---|---|---|---|---|
| 1 | Category colours (People, Governance, Community, Resources) | All four bars teal, named in text. Keeps the kit rule that teal is MOSAIC's computation and source colours are provenance only. | Give each category one of the four source colours, as `UI_BRAND_GUIDE.md` first suggested. Then source chips must drop their colour (ink tile + text) so one colour never has two meanings on the same page. | `--category-*` in `tokens/build_tokens.py` (CATEGORY) |
| 2 | Plum as a source colour | Plum #86607F is source type 1 (it replaced teal in kit v2 so teal could mean "MOSAIC's work"). | Revert to the original tiles with ink weight bars. | `--mosaic-plum`, logo files |
| 3 | Affiliation wording | Visible placeholder "[Affiliation wording to be confirmed]". Do not ship publicly until replaced. Plain text only, no University marks or colours. | Owner-approved line. | `copy/copy.json` → `identity.affiliation_line`, `landing_replacements.hero.attribution`, `footer.attribution` |
| 4 | Serif for question text | Question text and recommendation headlines in Source Serif 4 (as in the kit and film). | Sans throughout the app, serif only for the landing display headings (the stricter wording in `MOSAIC_BRAND.md`). | `.question-text` rule (`INTEGRATION_NEXTJS.md` section 2) |
| 5 | Source-type colour mapping | Four source types from `DocumentIndex.category` (standard/framework, guidance, buyer requirement, regulation). | Map by organization, or show no tile colour on the web. | Presentation lookup table |
| 6 | Logo designer pass | Use the supplied refined sketch on web and video. | A designer redraws the mark before print. | `logo/` |
| 7 | Search indexing | `robots: noindex` stays until the owner approves public launch. | Index once affiliation wording is confirmed. | `layout.tsx` metadata |
