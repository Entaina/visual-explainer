# Diagram slide

## Concept & limits

Relationships and flows at presentation scale. Density: 1 heading + 1 Mermaid diagram, max 8–10 nodes — fewer, larger than page diagrams; labels 18px+, edges 2px+, readable without zoom at distance.

**Mermaid vs. the CSS pipeline variant.** Mermaid renders SVGs at a fixed size the agent can't control. Small diagrams (fewer than ~7 nodes, no branching) render as tiny elements floating in a huge viewport. The rule:

- **Use Mermaid** for complex graphs: 8+ nodes, branching paths, cycles, edge crossings — anything where automatic edge routing saves real effort.
- **Use the CSS pipeline variant** (below) for simple linear flows: A → B → C → D sequences, build steps, deployment stages. CSS cards give full control over sizing and fill the viewport naturally.
- **Never leave a small Mermaid diagram alone on a slide.** Either switch to CSS, or pair it with supporting content in a split layout. A tiny diagram in empty space is a failed slide.

This rule is cross-target: it applies equally when rendering with Slidev (native ` ```mermaid ` blocks — see `../../targets/deck-slidev/TARGET.md`).

## Deck-html implementation

Zoom controls from `../css-patterns.md` apply here.

**Centering fix.** Add `display: flex; align-items: center; justify-content: center;` to `.mermaid-wrap` so the SVG centers within its container; set `transform-origin: center center` so zoom radiates from the middle.

```html
<section class="slide slide--diagram">
  <h2 class="slide__heading reveal">Diagram Title</h2>
  <div class="mermaid-wrap reveal" style="flex:1; min-height:0;">
    <div class="zoom-controls">
      <button onclick="zoomDiagram(this,1.2)" title="Zoom in">+</button>
      <button onclick="zoomDiagram(this,0.8)" title="Zoom out">&minus;</button>
      <button onclick="resetZoom(this)" title="Reset">&#8634;</button>
      <button onclick="openDiagramFullscreen(this)" title="Open full size in new tab">&#x26F6;</button>
    </div>
    <pre class="mermaid">
      graph TD
        A --> B
    </pre>
  </div>
</section>
```

**Click to expand.** Clicking anywhere on the diagram (without dragging) opens it full-size in a new browser tab; the ⛶ button provides the same for discoverability.

```css
.slide--diagram {
  padding: clamp(24px, 4vh, 48px) clamp(24px, 4vw, 60px);
}

.slide--diagram .slide__heading {
  margin-bottom: clamp(8px, 1.5vh, 20px);
}

.slide--diagram .mermaid-wrap {
  border-radius: 12px;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide--diagram .mermaid-wrap .mermaid {
  transform-origin: center center;
}
```

**Auto-fit SVG to container.** Mermaid renders SVGs with fixed dimensions and an inline `max-width` that keeps diagrams tiny inside large slides. The engine's `autoFit()` handles this at runtime; keep the CSS as a belt-and-suspenders fallback:

```css
.slide--diagram .mermaid svg {
  width: 100% !important;
  height: auto !important;
  max-width: 100% !important;
}
```

**Mermaid overrides for presentation scale** (add alongside the standard Mermaid CSS overrides from `../libraries.md`):

```css
.slide--diagram .mermaid .nodeLabel {
  font-size: 18px !important;
}

.slide--diagram .mermaid .edgeLabel {
  font-size: 14px !important;
}

.slide--diagram .mermaid .node rect,
.slide--diagram .mermaid .node circle,
.slide--diagram .mermaid .node polygon {
  stroke-width: 2px;
}

.slide--diagram .mermaid .edge-pattern-solid {
  stroke-width: 2px;
}
```

## CSS Pipeline variant

For simple linear flows where Mermaid would render too small. CSS cards with arrow connectors give full control over sizing and fill the viewport naturally; each step card expands via `flex: 1`. Max 5–6 steps — beyond that, split across two slides.

```html
<section class="slide" style="background-image:radial-gradient(...);">
  <p class="slide__label reveal">Pipeline Label</p>
  <h2 class="slide__heading reveal">Pipeline Title</h2>
  <div class="pipeline reveal">
    <div class="pipeline__step" style="border-top-color:var(--accent);">
      <div class="pipeline__num">01</div>
      <div class="pipeline__name">Step Name</div>
      <div class="pipeline__desc">What this step produces or does</div>
      <div class="pipeline__file">output-file.md</div>
    </div>
    <div class="pipeline__arrow">
      <svg viewBox="0 0 24 24" width="20" height="20"><path d="M5 12h14m-4-4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="pipeline__step"> ... </div>
    <!-- repeat step + arrow pairs -->
  </div>
</section>
```

```css
.pipeline {
  display: flex;
  align-items: stretch;
  gap: 0;
  flex: 1;
  min-height: 0;
  margin-top: clamp(12px, 2vh, 24px);
}

.pipeline__step {
  flex: 1;
  background: var(--surface);
  border: 1px solid var(--border);
  border-top: 3px solid var(--accent);
  border-radius: 10px;
  padding: clamp(14px, 2.5vh, 28px) clamp(12px, 1.5vw, 22px);
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-wrap: break-word;
}

.pipeline__num {
  font-size: clamp(10px, 1.2vw, 13px);
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 1px;
}

.pipeline__name {
  font-size: clamp(16px, 2vw, 24px);
  font-weight: 700;
  margin: clamp(4px, 0.8vh, 8px) 0;
}

.pipeline__desc {
  font-size: clamp(12px, 1.3vw, 16px);
  color: var(--text-dim);
  line-height: 1.5;
  flex: 1;
}

.pipeline__file {
  font-size: clamp(10px, 1.1vw, 12px);
  color: var(--accent);
  background: var(--accent-dim);
  padding: 3px 8px;
  border-radius: 4px;
  margin-top: clamp(8px, 1.5vh, 16px);
  align-self: flex-start;
}

.pipeline__arrow {
  display: flex;
  align-items: center;
  padding: 0 clamp(3px, 0.4vw, 6px);
  color: var(--accent);
  flex-shrink: 0;
  opacity: 0.4;
}

@media (max-width: 768px) {
  .pipeline { flex-direction: column; }
  .pipeline__arrow { justify-content: center; padding: 4px 0; transform: rotate(90deg); }
}
```

Each `.pipeline__step` uses `flex: 1` to fill available width equally, and the pipeline container itself fills available vertical space, so content isn't floating in empty space. The `.pipeline__file` badge anchors each card with a practical detail.
