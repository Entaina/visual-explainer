# Content slide

## Concept & limits

One idea with a few supports. Density: 1 heading + 5–6 bullets, max 2 lines each. Composition: asymmetric — content offset to one side (left-heavy or right-heavy), with the other side carrying a visual signal or deliberate whitespace, never a second essay.

Slidev: default layout, with an `.eyebrow` kicker above the heading when it classifies — see `../../targets/deck-slidev/TARGET.md`.

## Deck-html implementation

```html
<section class="slide slide--content">
  <div class="slide__inner">
    <div class="slide__text">
      <h2 class="slide__heading reveal">Heading</h2>
      <ul class="slide__bullets">
        <li class="reveal">First point</li>
        <li class="reveal">Second point</li>
      </ul>
    </div>
    <div class="slide__aside reveal">
      <!-- optional: illustration, icon, mini-diagram, accent SVG -->
    </div>
  </div>
</section>
```

```css
.slide--content .slide__inner {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: clamp(24px, 4vw, 60px);
  align-items: center;
  width: 100%;
}

/* For right-heavy variant: swap to 2fr 3fr */
.slide--content .slide__bullets {
  list-style: none;
  padding: 0;
}

.slide--content .slide__bullets li {
  padding: 8px 0 8px 20px;
  position: relative;
  font-size: clamp(16px, 2vw, 22px);
  line-height: 1.6;
  color: var(--text-dim);
}

.slide--content .slide__bullets li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 18px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}
```
