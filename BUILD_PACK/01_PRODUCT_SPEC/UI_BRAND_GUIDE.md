# UI_BRAND_GUIDE.md

## Status

Implementation guidance for Capstone v2 UI/UX.

This document defines the intended visual and interaction system strongly enough for coding agents to implement consistently, while leaving exact component-library and CSS architecture choices open.

The product should feel deliberate, modern, calm, research-backed, and credible to procurement/sustainability users.

Do not reproduce any reference site pixel-for-pixel. Use the references to extract design principles and interaction patterns.

---

# 1. Design references

## Landing page reference — Slite

Reference:
https://www.saasframe.io/examples/slite-landing-page

Borrow these characteristics:
- high ratio of whitespace to text;
- restrained color palette;
- intentional typography hierarchy;
- lightweight animation;
- simple layout rhythm;
- slightly imperfect / grainy / human line quality in borders, dividers, and lightweight illustrations;
- strong visual hierarchy without dense card clutter.

Do not copy Slite branding, illustrations, copy, or exact layout.

## Questionnaire reference — Wayyy Survey Preview

Reference:
https://dribbble.com/shots/20998276-Wayyy-Survey-preview

Borrow these characteristics:
- clean single-focus survey cards;
- spacious input treatment;
- restrained interface chrome;
- strong focus on the active question;
- minimal visual noise.

The Capstone questionnaire is a full page, not a popup/modal.

---

# 2. Product page architecture

## Page 1 — Landing / context

Route conceptually:

`/`

Primary CTA:
**Take the Assessment**

Landing page should include:
- client/problem context;
- About / approach / methodology;
- product/demo placeholder;
- research / verification / provenance;
- primary CTA into the assessment.

Visual direction:
- generous whitespace;
- narrow readable text blocks;
- one dominant accent color;
- restrained illustration;
- subtle movement;
- no generic “green ESG dashboard” treatment.

## Page 2 — Assessment

Route conceptually:

`/assessment`

The assessment is one dedicated page with three states:

1. SME setup;
2. quantitative-data input method;
3. questionnaire.

Do not implement the questionnaire as a modal over the landing page.

## Page 3 — Results

Route conceptually:

`/results`

Results should prioritize:
- overall score(s);
- category scores;
- executive summary;
- key gaps;
- prioritized recommendations;
- evidence/sources;
- prominent report download.

Do not inflate 20–50 questions into an unnecessarily dense BI dashboard.

---

# 3. Assessment setup UX

## SME profile block

Collect the contextual information required by the approved scope/config, including as applicable:
- company name;
- industry / subindustry;
- company size;
- location;
- target market;
- target buyer;
- business goal.

Preserve these values in assessment/session state so users do not re-enter them.

## Quantitative sustainability data method

Before starting the questionnaire, ask:

**How would you like to enter your quantitative sustainability data?**

Options:
1. **Enter manually** — default;
2. **Use emissions calculator**;
3. **Upload utility bills / evidence** — stretch capability only when approved.

Values resolved from the calculator or future evidence-upload flow belong to assessment/session state and should populate the relevant canonical question/metric inputs.

They do not need to be displayed as SME identity/profile fields.

Primary action:
**Start questionnaire**

---

# 4. Questionnaire interaction model

## Full-page vertical card flow

The questionnaire should feel like a vertical wheel/roller of cards rather than a long static form.

The active question:
- remains visually dominant;
- sits near the center of the primary viewport;
- uses a clear card surface;
- preserves generous internal whitespace.

Adjacent previous/next questions may remain partially visible to establish spatial continuity.

Recommended starting behavior:
- active card: full opacity, scale 1;
- adjacent cards: reduced opacity, approximately 0.96 scale;
- vertical transition: approximately 200–300 ms;
- do not use heavy blur or motion that harms readability.

Exact values may be tuned during implementation.

## Answer progression

For simple categorical/boolean choices:
- support click/tap selection;
- support natural keyboard shortcuts where practical;
- auto-advance may occur after an unambiguous selection.

For text/numeric/multi-step inputs:
- require an explicit Continue/Next action when auto-advance would be surprising;
- validate inline before progression where validation is required.

Users must be able to move backward and forward without losing answers.

## Skipping questions

Skipping is explicitly supported.

An unanswered question remains visually identifiable in the progress navigation.

Do not silently coerce missing values to zero or another answer.

At score generation, if questions remain unanswered, show a confirmation state with at least:
- count of unanswered questions;
- **Review missing answers**;
- **Generate score anyway**.

Scoring behavior for unanswered questions must follow the approved deterministic methodology, not ad hoc UI assumptions.

---

# 5. Progress navigation

Use a visible side progress rail on desktop where screen width permits.

The rail should:
- show questionnaire position;
- distinguish answered, unanswered, and current questions;
- allow direct navigation to a question;
- visually group or label questions by category where useful.

Conceptual states:
- answered;
- unanswered;
- current.

Do not rely on color alone; state should also be expressed through shape, fill, label, icon, or another accessible cue.

On smaller screens, adapt the same functionality to a compact progress control without sacrificing direct navigation.

---

# 6. Category orientation

The canonical categories are:
- People;
- Governance;
- Community;
- Resources.

Category transitions may create subtle changes in visual orientation, for example:
- progress-rail accent;
- category label;
- lightweight divider/line illustration;
- subtle background tint;
- short category-heading transition.

The card structure and core controls must remain consistent across categories.

Do not radically recolor or redesign the entire interface between categories.

Animation exists to communicate orientation/state change, not to entertain.

---

# 7. Results information architecture

## Quantitative summary

Lead with the authoritative deterministic outputs:
- overall score(s);
- category scores;
- four-category comparison chart;
- any approved descriptive readiness label.

A prominent **Download full report** action should appear near the top.

The current four-category bar-chart model remains a valid baseline unless a demonstrably clearer visualization is proposed.

## Future interactive levers

Interactive levers are stretch scope only.

If implemented, preserve the authoritative/current score visually while displaying the what-if result as a secondary “shadow” or projected state.

Preferred comparison:
- solid/current bar or mark = authoritative score;
- translucent/outlined/ghost mark = projected what-if score.

Never replace the authoritative score with the simulated value.

## AI/recommendation content

Default browser presentation should be a readable vertical narrative rather than requiring tabs.

Preferred hierarchy:

### Executive Summary
Short, prominent narrative.

### Key Gaps
Visual cards for the most material weak areas, with:
- category;
- concise issue statement;
- why it matters;
- supporting evidence/source where available.

### Recommended Actions
Ranked recommendations with:
- action title;
- category;
- concise rationale;
- concrete action;
- evidence/source;
- impact/effort indicators only where supportable.

Tabs may be proposed later if usability testing shows they improve navigation, but are not the default assumption.

Use small information graphics/chips/icons where they improve scanning. Avoid decorative infographic clutter.

## Report download

**Download full report** should be prominent:
- once near the primary score summary;
- optionally repeated after recommendations.

The durable report should be able to include:
- SME profile/context;
- answers;
- skipped questions;
- question-level scores where appropriate;
- category scores;
- overall scores;
- key gaps;
- recommendations;
- evidence/sources;
- configuration/method version.

---

# 8. Visual system

These are implementation defaults, not immutable brand law.

## Layout

Suggested desktop defaults:
- content max width: 1120–1200 px;
- landing-page vertical section spacing: 80–96 px;
- mobile section spacing: 48–64 px;
- readable text columns narrower than full container width;
- results page may be denser than landing page.

## Typography

Use one primary sans-serif family unless there is a clear implementation reason otherwise.

Desired characteristics:
- intentional/editorial rather than generic system-default feel;
- excellent body readability;
- strong hierarchy;
- restrained weight range.

Starting hierarchy:
- display/H1: approximately 52–64 px desktop, 600 weight;
- H2: approximately 34–42 px, 600 weight;
- H3: approximately 24–30 px, 600 weight;
- body: approximately 16–18 px with generous line height;
- metadata/labels: approximately 13–14 px.

Use responsive scaling rather than rigid desktop sizes.

## Surfaces and borders

Starting defaults:
- card radius: 10–14 px;
- primarily 1 px borders;
- soft or no box shadow;
- subtle warm/off-white backgrounds may be preferred to pure white;
- avoid excessive nested cards.

## Line texture / illustration

A slight imperfect/grainy/human line quality is encouraged for:
- decorative borders;
- diagrams;
- section dividers;
- lightweight illustrations.

Do not degrade:
- form controls;
- data visualization;
- text legibility;
- accessibility.

Implement texture as a controlled design layer, not a rasterized screenshot effect.

## Color

Start with:
- neutral base;
- one primary accent;
- at most one secondary accent;
- restrained category accents.

Do not default to generic sustainability green.

Exact palette should be selected during Milestone 1 visual implementation and encoded as tokens.

## Motion

Preferred:
- short fades;
- short vertical slides;
- lightweight scale transitions;
- smooth but fast state changes.

Avoid:
- magnetic cursor physics;
- Tinder-style swipe mechanics;
- large morphing 3D backgrounds;
- gratuitous GSAP-style spectacle;
- animation that delays completion.

Respect reduced-motion preferences.

---

# 9. Tokenization requirement

Implement the selected visual system through reusable design tokens rather than scattered one-off values.

At minimum centralize:
- colors;
- typography;
- spacing;
- radii;
- borders;
- shadows;
- motion durations/easing;
- category accents.

If Tailwind or another token-capable system is chosen, map these to its theme/configuration.

A future brand change should not require manually editing dozens of components.

---

# 10. Accessibility and responsive behavior

Minimum expectations:
- semantic HTML;
- keyboard-operable questionnaire;
- visible focus states;
- sufficient contrast;
- progress/state not communicated by color alone;
- reduced-motion support;
- responsive assessment navigation;
- accessible form labels and errors.

Animation must never be required to understand questionnaire state.

---

# 11. Explicit anti-patterns

Avoid:
- generic purple-gradient AI SaaS styling;
- excessive glassmorphism;
- giant mostly-empty hero sections;
- ubiquitous leaf/globe/recycle icons;
- over-rounded “toy” UI;
- card-on-card-on-card dashboards;
- gratuitous dark mode as the default aesthetic;
- dense long-form survey pages;
- questionnaire modal overlays;
- fake loading telemetry;
- decorative motion that slows task completion.

---

# 12. Milestone 1 review questions

Before approving the product shell, show the human project owner:
- landing page at desktop and mobile widths;
- assessment setup;
- at least one representative questionnaire card;
- progress navigation;
- at least one category transition;
- results-page shell;
- selected font(s);
- color/design tokens;
- motion treatment;
- how reduced-motion behaves.

The implementation may improve on this guide, but material departures from the interaction model should be surfaced rather than silently invented.
