# Split slide

## Concept & limits

Contrast two things: before/after, text + diagram, decision + evidence. Density: 1 heading + 2 panels, each panel following its inner type's limits. Composition: asymmetric two-panel (60/40 or 70/30) — the panels need not weigh equally; the structure itself communicates a relationship.

Slidev: `layout: two-cols` (+ `::right::`) or `layout: image-right`; wrap each side in `.panel .panel-before` / `.panel .panel-after` for the edge-to-edge composition — see `../../targets/deck-slidev/TARGET.md`.

## Deck-html implementation

Each panel has its own background tier. Zero padding on the slide itself — panels fill edge to edge.

```html
<section class="slide slide--split">
  <div class="slide__panels">
    <div class="slide__panel slide__panel--primary">
      <h2 class="slide__heading reveal">Left Panel</h2>
      <div class="slide__body reveal">Content...</div>
    </div>
    <div class="slide__panel slide__panel--secondary">
      <!-- diagram, image, code block, or contrasting content -->
    </div>
  </div>
</section>
```

```css
.slide--split {
  padding: 0;
}

.slide--split .slide__panels {
  display: grid;
  grid-template-columns: 3fr 2fr;
  height: 100%;
}

.slide--split .slide__panel {
  padding: clamp(40px, 6vh, 80px) clamp(32px, 4vw, 60px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.slide--split .slide__panel--primary {
  background: var(--surface);
}

.slide--split .slide__panel--secondary {
  background: var(--surface2);
}
```
