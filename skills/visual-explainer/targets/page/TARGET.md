# Target: page

A complete, self-contained HTML document delivered as a one-shot artifact. No external requests: embedded CSS, self-contained favicon, any needed JS inline. The theme file's contents are inlined into the page `<style>` block, and the Google Fonts `<link>` from the theme's header comment is included with every weight the CSS uses.

## Exemplars

Imitate structure and mechanics from `exemplars/`; content always comes from the genre.

| Content shape | Exemplar |
|---|---|
| Text-heavy architecture, module internals, card layouts | `exemplars/architecture.html` |
| Mermaid diagrams of any kind | `exemplars/mermaid-flowchart.html` |
| Data tables, comparisons, audits, matrices | `exemplars/data-table.html` |

Deeper patterns: `../../references/css-patterns.md` (layout, type scale, overflow, depth, collapsibles), `../../references/libraries.md` (Mermaid and library specifics), `../../references/responsive-nav.md` (pages with 4+ major sections).

## Page invariants

- Semantic HTML where it helps accessibility and copy/paste: `<table>`, headings, lists, `<details>`, captions.
- Type scale in `rem` with one root knob: `html { font-size: 16px }` (16–18px range). Minimums at the chosen root: body ≥ 14px, secondary text and labels ≥ 11px, code/mono ≥ 12px. Mermaid SVG labels remain in px.
- Prevent overflow: `min-width: 0` on grid/flex children, `overflow-wrap: break-word`, scroll containers for wide tables/code. No horizontal page scroll at desktop width.
- Interactive elements keep visible keyboard focus states.
- Both color schemes when the theme defines them (tokens on `:root`, `prefers-color-scheme` redefines tokens only); single-theme themes (Entaina) stay single deliberately.
- Diagrams sit in `<figure>` with a claim-stating `<figcaption>`, plus `role="img"` and a matching `aria-label` on the shell wrapper.

## Mermaid on pages

- `theme: 'base'` with `themeVariables` derived from the page palette; ELK layout for complex diagrams when available.
- Never bare `<pre class="mermaid">`. Use the canonical `diagram-shell` pattern from `exemplars/mermaid-flowchart.html`: `.diagram-shell` > `.mermaid-wrap` > `.zoom-controls` + `.mermaid-viewport` > `.mermaid-canvas` — with zoom in/out/reset/expand, Ctrl/Cmd+scroll zoom, drag panning, click-to-expand.
- `flowchart TD` for complex diagrams; `LR` only for simple 3–4 node linear flows. `<br/>` in quoted labels, never escaped `\n`.
- Never define a page-level `.node` class (Mermaid owns it); namespace page classes (`.ve-card`).
- 15+ elements: hybrid pattern — small Mermaid overview + CSS detail cards, not one giant diagram.

## Delivery

Write the finished document to a work file, then deliver it with the render script:

```
node <skill-dir>/scripts/render.mjs <input.html> [--filename <name>] [--no-open] [--viewer browser|glimpse|auto] [--out-dir <dir>]
```

The script validates that the input is a complete HTML document, normalizes it (`html lang`, viewport meta, self-contained favicon, display-math escaping), writes it to the output directory (`VISUAL_EXPLAINER_OUTPUT_DIR` or `~/.agent/diagrams/`) under a descriptive filename, and opens it in the chosen viewer. Use `--viewer glimpse` only when the user wants a native Glimpse window and `glimpseui` is installed; `auto` tries glimpse then falls back to the browser.

## Delivery check

Mechanical part first:

```
node <skill-dir>/scripts/check_artifact.mjs <delivered.html> --kind page [--min-sections N] [--expect-table] [--expect-mermaid]
```

Then judgment: no console errors, no horizontal overflow at desktop width, tables preserve rows/columns and wrap long text, hierarchy makes the main idea obvious in the first viewport, and the styling would still be recognizable next to a generic dark/violet template.
