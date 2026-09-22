# Target: deck-html

A slide deck as a single self-contained HTML page — a different medium from a scrollable page, not a paginated article. One-shot artifact: right when the deck is delivered as a link or file, with no repository maintaining it (that case is `../deck-slidev/`).

## Exemplar and engine

`exemplars/slide-deck.html` is the canonical implementation: imitate its slide engine, chrome, and slide-type markup. Keep everything inline and self-contained; do not extract an external `engine.js`. The shared machinery — scroll-snap engine, typography scale, transitions, navigation chrome, auto-fit, overflow check, decoration, imagery, height breakpoints — is specified in `./engine.md`; per-type layouts in `../../references/slide-types/`.

## Deck invariants

- Each slide gets one `100dvh` viewport budget with **no page-level scrolling**. The template's `overflow: hidden` clips excess silently — treat the budget as hard: split dense content across slides, never drop it.
- Slide typography keeps the template's viewport-responsive `clamp()` scale and `autoFit()` runtime fitting — do not convert slide styles to rem (that contract is for scrollable pages).
- Use the slide types and density limits from `../../references/slide-types/README.md`; both bind at storyboard time and again here.
- Larger type, fewer objects per slide, varied compositions.
- Nav chrome is copied from the exemplar (class names included), never paraphrased: visible prev/next arrows, slide count with reading percent, keyboard and touch navigation, expandable reader rail with slide titles, outline/help overlays, `#slide-N` deep links, and resume state that both writes **and restores**. See `./engine.md` "Required reader controls".
- Build slides with the published type patterns and class names from `../../references/slide-types/` — ad-hoc markup loses the fixes baked into them (spacing, anchoring, overflow behavior).
- Mermaid inside slides follows the page rules (`../page/TARGET.md` "Mermaid on pages"), with one addition: linear flows under ~7 nodes render tiny in a slide — use the CSS Pipeline variant from `../../references/slide-types/diagram.md` instead.

## Delivery

Same mechanism as pages — the deck is an HTML document:

```
node <skill-dir>/scripts/render.mjs <deck.html> [--filename <name>] [--no-open]
```

## Delivery check

Mechanical part first:

```
node <skill-dir>/scripts/check_artifact.mjs <deck.html> --kind deck-html [--min-slides N]
```

Besides document shape and chrome, it enforces the countable density limits per slide (table rows, bullets, code lines, quote length, KPI count) and that resume state is restored, not just written.

Then the runtime check: enable `prefers-reduced-motion: reduce` at the target viewport **and** a short landscape height, then fix every vertical-overflow and `autoFit()` warning the template reports (`checkSlideOverflow()` in the console) before handing over. A deck that overflows under reduced motion is not done.
