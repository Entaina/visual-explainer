# Code slide

## Concept & limits

One focused code point — what changed, the key pattern, the API shape. Density: 1 heading + max 10 lines of code. Composition: centered on the viewport for focus; the code needs space to think.

Slidev: default layout + fenced code with Shiki line highlighting (` ```ts {2,5-7} `) — see `../../targets/deck-slidev/TARGET.md`.

## Deck-html implementation

18px mono on a recessed dark background. Floating filename label.

```html
<section class="slide slide--code">
  <h2 class="slide__heading reveal">What Changed</h2>
  <div class="slide__code-block reveal">
    <span class="slide__code-filename">worker.ts</span>
    <pre><code>function processQueue(items) {
  // highlighted code here
}</code></pre>
  </div>
</section>
```

```css
.slide--code {
  align-items: center;
}

.slide__code-block {
  background: var(--code-bg, #1a1a2e);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: clamp(24px, 4vh, 48px) clamp(24px, 4vw, 48px);
  max-width: 900px;
  width: 100%;
  position: relative;
}

.slide__code-filename {
  position: absolute;
  top: -12px;
  left: 24px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 4px;
  background: var(--accent);
  color: var(--bg);
}

.slide__code-block pre {
  margin: 0;
  overflow-x: auto;
}

.slide__code-block code {
  font-family: var(--font-mono);
  font-size: clamp(14px, 1.6vw, 18px);
  line-height: 1.7;
  color: var(--code-text, #e6edf3);
}
```
