---
name: visual-explainer
description: Generate visual explanations for systems, code changes, plans, data, and technical concepts, as self-contained HTML pages or Slidev decks. Use when the user asks for a diagram, architecture overview, visual diff or plan review, project recap, comparison table, slide deck, visual plan, or to fact-check a generated document — or when a table would have 4+ rows or 3+ columns. After generating a plan, diff, or substantial implementation, offering a visual explanation is often worth it. Plans with a format-agnostic storyboard, renders with a theme from themes/, delivers through dependency-free scripts.
license: MIT
compatibility: Requires Node.js (delivery scripts, Slidev) and a browser to view output. Optional surf-cli for AI image generation, glimpseui for native windows.
metadata:
  author: eLafo (fork of nicobailon/visual-explainer, MIT)
  version: "0.2.0" # x-release-please-version
---

# Visual Explainer

One skill, three orthogonal axes:

- **Genre** (`genres/`) — *what to say*: a content contract per kind of output (gathering recipe, evidence rules, section skeleton). Genres never contain format or style rules.
- **Target** (`targets/`) — *how to deliver*: page, HTML deck, or Slidev deck. Each target directory is self-contained (rules in `TARGET.md`, `exemplars/` to imitate, `assets/` copied verbatim) and never contains content rules.
- **Theme** (`themes/`) — *the skin*: token files the page and deck-html targets consume; contract in `themes/README.md`. (Slidev decks are themed by the target project's own Slidev theme — not by this skill.) Entaina is the default for work, client, and brand contexts; the user's words win, then the target project's design system, then this default.

The pipeline between them: gather → verify → **storyboard** (`references/storyboard.md`, the format-agnostic intermediate plan) → render through a target → deliver with a script. Resolve every relative path from this skill's directory.

## Dispatch

| Request / subcommand | Genre | Target |
|---|---|---|
| diagram, "explain X visually", architecture, comparison | `genres/diagram.md` | page |
| diff-review `[ref]` | `genres/diff-review.md` | page |
| plan-review `[plan]` | `genres/plan-review.md` | page |
| project-recap | `genres/project-recap.md` | page |
| visual-plan `<topic>` | `genres/visual-plan.md` | page |
| slides `<topic>` `[--slidev]` | `genres/deck.md` | deck-html **or** deck-slidev |
| fact-check `[doc]` | `genres/fact-check.md` | (consumes existing outputs) |

The genre × target matrix is populated by **lifecycle**: one-shot ephemeral output → page; maintained, versioned, presented → deck. Only the deck genre crosses targets; its genre file owns that decision.

## Global invariants

These bind every genre and every target:

- Prefer a visual page over terminal ASCII when the output is inherently visual. A table with 4+ rows or 3+ columns renders as HTML with only a short chat summary.
- Storyboard first for every deck and for long structured pages (`references/storyboard.md`); skip only for quick single-figure outputs.
- Style through theme tokens only; never hardcode palette colors in components. Load every font weight the CSS uses — no faux-bold.
- Evidence rules (`references/evidence.md`) bind any output that makes claims about real code or documents.
- Structure must encode something true: 01/02/03 markers only when order matters, eyebrow labels only when they classify, dividers only at real seams.
- Microcopy is design material: name things by what readers recognize; controls say exactly what happens; specific beats clever.
- Dashboards are scanned, not read: summary before detail; state encoded in form (pills, chips, severity stripes); semantic color separate from the accent hue.
- Entrance/hover animation only when it clarifies hierarchy; respect `prefers-reduced-motion`; no continuous glow or pulse on static content.
- Calibrate treatment: reviews, memos, audits get polished-utilitarian; showcases and narrative decks get editorial. Anchor the aesthetic to the content's domain (CLI/infra → terminal-inspired; metrics → data-dense; plans → blueprint; recaps → editorial; prose → paper/ink).
- Generate a Markdown companion only when the user explicitly asks for AI-readable output; ask before replacing an existing one.

## Choose the representation

| Content | Default representation |
|---|---|
| Flowchart, pipeline, state machine, decision tree | Mermaid |
| Sequence, ER/schema, class, C4, topology-focused architecture | Mermaid |
| Text-heavy architecture, module internals, implementation plans | CSS grid cards, optionally with a Mermaid overview |
| 15+ element architecture | Hybrid: small Mermaid overview + CSS detail cards |
| Comparison/audit/status matrix | Semantic HTML `<table>` |
| Timeline/roadmap | CSS timeline |
| Dashboard/metrics | CSS grid + charts/KPIs |
| Slide deck | `genres/deck.md` decides the target |

**Mermaid — what to draw** (rendering rules live in each target): depict the mechanism, not its name; label every arrow (`writes`, `invalidates`, `polls every 30s`); to compare options, draw the difference; one figure, one claim, stated in the caption.

## Scripts

Dependency-free Node, runnable from anywhere:

- `scripts/render.mjs <input.html> [--filename <name>] [--no-open] [--viewer browser|glimpse|auto]` — validates, normalizes, and delivers a page or HTML deck to `VISUAL_EXPLAINER_OUTPUT_DIR` (default `~/.agent/diagrams/`), then opens it.
- `scripts/check_themes.mjs` — verifies every theme file satisfies the token contract.
- `scripts/check_artifact.mjs <file> --kind page|deck-html|slidev` — deterministic delivery check for a produced artifact; run it on every deliverable before handing over.

If a subagent/task tool is available, scouting source context with it before generating is usually worth it for large sources; otherwise gather directly.

## Optional generated images

If `surf` is available, generated images may be embedded as base64 for hero banners or conceptual illustrations. Skip them for data-heavy, structural, or Mermaid/CSS-suitable content — output must stand on CSS, typography, and diagrams alone.

## Final checklist

- Storyboard written and coverage verified for decks and long structured pages.
- Theme applied through tokens; fonts loaded with all used weights.
- The target's own delivery check passed (`targets/*/TARGET.md`), including `scripts/check_artifact.mjs` on the deliverable.
- Evidence cited for every factual claim (review genres and fact-check).
- Visual hierarchy makes the main idea obvious in the first viewport, and the styling would still be recognizable next to a generic template.
