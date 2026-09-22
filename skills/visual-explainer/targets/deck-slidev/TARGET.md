# Target: deck-slidev

A slide deck as ordinary project source, rendered by Slidev (`npx slidev slides.md`). Right for versioned, composable, maintained decks — the deck lives in a repository and evolves. Follow the target project's own conventions first (directory layout, composition via `src:` imports, theme); this target defines only what the project does not.

**Theming is not this target's concern.** A Slidev theme is a project dependency like any other: the deck uses whatever theme the project or the user provides, and Slidev's own default when none is. Install and reference themes per their docs; when the active theme documents extra layouts, classes or defaults (in its README), read them and use them when mapping the storyboard.

## Setup (when the project has no Slidev yet)

```bash
npm i -D @slidev/cli
```

Register scripts in `package.json` (`slides:dev` / `slides:build` / `slides:export` → `slidev [build|export] <path>/slides.md`) and gitignore `dist/` and `.slidev/`. Multiple decks in one repo just share the dependency — no special mode.

## Deck files

```text
<deck-dir>/
├── slides.md    ← the deck
└── style.css    ← OPTIONAL, 100% deck-owned: deck-specific rules only
```

- **Never copy a theme's look into `style.css`** — it loads on top of the theme and duplicates it. `style.css` is for rules this deck alone needs.
- **Before adding a deck-local `global-top.vue`/`global-bottom.vue`, check the active theme**: Slidev stacks global layers, so if the theme already ships that layer (navigation chrome, watermarks), a local copy renders twice.
- Fonts, palettes and chrome are the theme's business, configured where the theme documents.
- Offline assets (logos, images) go in `<deck-dir>/public/`.

## slides.md skeleton

```markdown
---
title: <Deck title>
mdc: true
---

# <Deck title>

<subtitle or date>

<!--
Duración estimada: N min.
Notas de facilitación de la slide de apertura.
-->

---
layout: section
---

# <Section title>

<!--
Duración estimada: 30 s.
Transición entre bloques.
-->

---
layout: two-cols
layoutClass: gap-8
---

# <Heading>

- First point
- Second point

::right::

```mermaid {theme: 'base', themeVariables: {primaryColor: '#ececec', primaryBorderColor: '#888888', primaryTextColor: '#333333', lineColor: '#888888'}}
graph TD
  A[Source] -->|writes| B[Store]
```

---
layout: quote
---

# One short quote, under 150 characters.

Attribution

---

# Closing slide

Transition to the next piece, or a comprehension check.

<!--
Cierre: pregunta de comprobación o transición.
-->
```

Add `theme: <name>` to the frontmatter when the project uses one. The Mermaid `themeVariables` above are neutral placeholders — derive them from the active theme's palette.

## Mapping storyboard slide types to Slidev

Plain Slidev layouts, valid with any theme:

| Storyboard type | Slidev |
|---|---|
| Title | `layout: cover` (or the plain first slide) |
| Section Divider | `layout: section` |
| Content | default layout, bullets |
| Split | `layout: two-cols` (+ `::right::`), `layout: image-right` |
| Diagram | default layout + ` ```mermaid ` block |
| Dashboard / KPI | `layout: fact` for a single figure; a small HTML grid for several |
| Table | default layout + Markdown table |
| Code | default layout + fenced code with Shiki line highlighting (` ```ts {2,5-7} `) |
| Quote | `layout: quote` (no literal quotation marks in the text) |
| Full-Bleed | `layout: image`, or `layout: cover` with a background |

A theme may enrich these with its own classes and layouts — its README is the reference.

## Rules

- Presenter notes (`<!-- ... -->`) on every slide; the first note states the estimated duration.
- Prefer Slidev's native features over custom HTML: layouts, Mermaid blocks, Shiki highlighting, `v-click` reveals. Reach for custom HTML only when no layout fits.
- Keep the density limits from `../../references/slide-types/README.md`; they bind regardless of render target.
- Do not inline colors in slides; style through the active theme's variables.
- Deck-specific rules in `style.css` go in rem sized for Slidev's 980×552 canvas — never vw/vh (Slidev scales the canvas with a transform, so viewport units double-scale).
- Two Slidev internals to remember when styling: `layout: two-cols` renders the class `.two-columns` (slots in `.col-left`/`.col-right`), and `layout: cover` wraps the slide content in a `div.my-auto`.
- Decks meant for composition (`src:` imports) must be understandable on their own and end with a transition or comprehension check.
- Exporting: if the theme animates slide entrances and `slides:export` captures them mid-animation, pass `--wait 1000`.

## Delivery check

Mechanical part first:

```
node <skill-dir>/scripts/check_artifact.mjs <deck-dir>/slides.md --kind slidev
```

It verifies presenter notes on every slide (duration in the first), no inline colors outside Mermaid blocks, and the countable density limits; it warns about deck-local global layers (possible duplication with the theme's). Then preview with `npm run slides:dev` and walk every slide for overflow before handing over.

## Migrating a legacy deck (pre-2026 scheme of this skill)

Older decks carry blocks this skill used to manage in `style.css` (`== visual-explainer:theme/base ==` markers) plus a local `global-top.vue`. That look now lives in the external `slidev-theme-entaina` package. One-off manual migration: add the project's chosen theme as a dependency and reference it in the frontmatter, delete the local `global-top.vue`, and strip everything above the "Deck-specific rules" separator from `style.css` (keeping what's below). The delivery check flags the leftovers.
