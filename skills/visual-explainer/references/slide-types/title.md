# Title slide

## Concept & limits

Full-viewport hero that opens the deck and sets its visual tone. Density: 1 heading + 1 subtitle. Composition: centered. Background treatment via gradient, texture, or a generated image (see the deck-html engine's Proactive Imagery).

Slidev: `layout: cover`, with `.cover-kicker`, `.cover-line`, `.cover-orbit` from the base rules — see the mapping in `../../targets/deck-slidev/TARGET.md`.

## Deck-html implementation

80–120px display type.

```html
<section class="slide slide--title">
  <svg class="slide__decor" ...><!-- optional decorative accent --></svg>
  <div class="slide__content reveal">
    <h1 class="slide__display">Deck Title</h1>
    <p class="slide__subtitle reveal">Subtitle or date</p>
  </div>
</section>
```

```css
.slide--title {
  justify-content: center;
  align-items: center;
  text-align: center;
}
```
