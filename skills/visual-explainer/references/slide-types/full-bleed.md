# Full-Bleed slide

## Concept & limits

The deck's visual anchor moment — often the closing. Background dominates the viewport; density: 1 heading + 1 subtitle overlaid. Composition: full-bleed, content anchored to an edge (usually bottom-left), zero slide padding.

Slidev: `layout: cover` + `class: bleed` (dark gradient, perspective grid, bottom-left content; `.bleed-note` for a closing question box), or `layout: image` — see `../../targets/deck-slidev/TARGET.md`.

## Deck-html implementation

Background image (generated or CSS gradient) with a gradient scrim ensuring text contrast.

```html
<section class="slide slide--bleed">
  <div class="slide__bg" style="background-image:url('data:image/png;base64,...')"></div>
  <div class="slide__scrim"></div>
  <div class="slide__content">
    <h2 class="slide__heading reveal">Headline Over Image</h2>
    <p class="slide__subtitle reveal">Supporting text</p>
  </div>
</section>
```

```css
.slide--bleed {
  padding: 0;
  justify-content: flex-end;
  color: #ffffff;
}

.slide__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.slide__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%);
  z-index: 1;
}

.slide--bleed .slide__content {
  position: relative;
  z-index: 2;
  padding: clamp(40px, 6vh, 80px) clamp(40px, 8vw, 120px);
}

/* When no generated image, use a bold CSS gradient background */
.slide__bg--gradient {
  background: linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 60%, var(--bg) 40%) 100%);
}
```
