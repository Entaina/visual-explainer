# Quote slide

## Concept & limits

A pause on one idea. Density: 1 short quote (~25 words / ~150 characters max) + 1 attribution. Quotes over 150 characters trigger the engine's `autoFit()` review warning — move longer quotes to a content slide instead of shrinking them. Generous whitespace is the design.

Slidev: `layout: quote`; the giant quote mark and cite styling come from the base rules — put no literal quotation marks in the text. See `../../targets/deck-slidev/TARGET.md`.

## Deck-html implementation

36–48px serif with dramatic line-height; oversized quotation mark as decoration.

```html
<section class="slide slide--quote">
  <div class="slide__quote-mark reveal">&ldquo;</div>
  <blockquote class="reveal">
    The best code is the code you don't have to write.
  </blockquote>
  <cite class="reveal">&mdash; Someone Wise</cite>
</section>
```

```css
.slide--quote {
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: clamp(60px, 10vh, 120px) clamp(60px, 12vw, 200px);
}

.slide__quote-mark {
  font-size: clamp(80px, 14vw, 180px);
  line-height: 0.5;
  opacity: 0.08;
  font-family: Georgia, serif;
  pointer-events: none;
  margin-bottom: -20px;
}

.slide--quote blockquote {
  font-size: clamp(24px, 4vw, 48px);
  font-weight: 400;
  line-height: 1.35;
  font-style: italic;
  margin: 0;
}

.slide--quote cite {
  font-family: var(--font-mono);
  font-size: clamp(11px, 1.4vw, 14px);
  font-style: normal;
  margin-top: clamp(16px, 3vh, 32px);
  display: block;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-dim);
}
```
