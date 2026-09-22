# Section Divider slide

## Concept & limits

Breathing room between topics. Density: 1 oversized number + 1 heading + optional subhead. Composition: centered, dominated by negative space — the pause is the point.

Slidev: `layout: section` (accent bar and type scale come from the base rules) — see `../../targets/deck-slidev/TARGET.md`.

## Deck-html implementation

Oversized decorative number (200px+, ultra-light weight) with heading. SVG accent marks optional.

```html
<section class="slide slide--divider">
  <span class="slide__number">02</span>
  <div class="slide__content">
    <h2 class="slide__heading reveal">Section Title</h2>
    <p class="slide__subtitle reveal">Optional subheading</p>
  </div>
</section>
```

```css
.slide--divider {
  justify-content: center;
}

.slide--divider .slide__number {
  font-size: clamp(100px, 22vw, 260px);
  font-weight: 200;
  line-height: 0.85;
  opacity: 0.08;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  pointer-events: none;
  font-variant-numeric: tabular-nums;
}
```
