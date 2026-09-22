# Deck-html engine

The machinery every HTML deck shares, whatever its slide types: scroll-snap engine, typography scale, transitions, navigation chrome, auto-fit, the overflow delivery check, decoration, imagery, and height breakpoints. Per-type layouts live in `../../references/slide-types/`.

Before generating, also read `../../references/css-patterns.md` for shared patterns (Mermaid zoom controls, overflow protection, depth tiers, status badges) and `../../references/libraries.md` for Mermaid theming, Chart.js, and font pairings — those apply to slides too; this file adds the deck layer on top.

Every slide gets one `100dvh` viewport budget, but that CSS height does not prove that its content fits. Because the default slide clips overflow, run the delivery check below before shipping instead of relying on the browser to reveal a problem.

## Slide Engine Base

The deck is a scroll-snap container. Each slide is allocated one viewport; only a passing delivery check proves that its content fits inside that `100dvh` budget.

```html
<body>
<div class="deck">
  <section class="slide slide--title"> ... </section>
  <section class="slide slide--content"> ... </section>
  <section class="slide slide--diagram"> ... </section>
  <!-- one <section> per slide -->
</div>
</body>
```

```css
/* Scroll-snap container */
.deck {
  height: 100dvh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Individual slide — keep overflow hidden only after the delivery check passes */
.slide {
  height: 100dvh;
  scroll-snap-align: start;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(40px, 6vh, 80px) clamp(40px, 8vw, 120px);
  isolation: isolate; /* contain z-index stacking */
}
```

## Typography Scale

Slide typography is 2–3× larger than scrollable pages. Page-sized text on a viewport-sized canvas looks like a mistake.

```css
.slide__display {
  font-size: clamp(48px, 10vw, 120px);
  font-weight: 800;
  letter-spacing: -3px;
  line-height: 0.95;
  text-wrap: balance;
}

.slide__heading {
  font-size: clamp(28px, 5vw, 48px);
  font-weight: 700;
  letter-spacing: -1px;
  line-height: 1.1;
  text-wrap: balance;
}

.slide__body {
  font-size: clamp(16px, 2.2vw, 24px);
  line-height: 1.6;
  text-wrap: pretty;
}

.slide__label {
  font-family: var(--font-mono);
  font-size: clamp(10px, 1.2vw, 14px);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-dim);
}

.slide__subtitle {
  font-family: var(--font-mono);
  font-size: clamp(14px, 1.8vw, 20px);
  color: var(--text-dim);
  letter-spacing: 0.5px;
}
```

| Element | Size range | Notes |
|---------|-----------|-------|
| Display (title slides) | 48–120px | `10vw` preferred, weight 800 |
| Section numbers | 100–240px | Ultra-light (weight 200), decorative |
| Headings | 28–48px | `5vw` preferred, weight 700 |
| Body / bullets | 16–24px | `2.2vw` preferred, 1.6 line-height |
| Code blocks | 14–18px | `1.8vw` preferred, mono |
| Quotes | 24–48px | `4vw` preferred, serif italic |
| Labels / captions | 10–14px | Mono, uppercase, dimmed |

## Cinematic Transitions

IntersectionObserver adds `.visible` when a slide enters the viewport. Slides animate in once and stay visible when scrolling back. Gate hidden states on a `.js` class so decks stay readable in no-JS previews such as QuickLook.

```html
<script>document.documentElement.classList.add('js');</script>
```

```css
/* Slide entrance — fade + lift + subtle scale */
.slide {
  transition:
    opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.js .slide {
  opacity: 0;
  transform: translateY(40px) scale(0.98);
}

.slide.visible {
  opacity: 1;
  transform: none;
}

/* Staggered child reveals — add .reveal to each content element */
.js .slide .reveal {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide.visible .reveal {
  opacity: 1;
  transform: none;
}

/* Stagger delays — up to 6 children per slide */
.slide.visible .reveal:nth-child(1) { transition-delay: 0.1s; }
.slide.visible .reveal:nth-child(2) { transition-delay: 0.2s; }
.slide.visible .reveal:nth-child(3) { transition-delay: 0.3s; }
.slide.visible .reveal:nth-child(4) { transition-delay: 0.4s; }
.slide.visible .reveal:nth-child(5) { transition-delay: 0.5s; }
.slide.visible .reveal:nth-child(6) { transition-delay: 0.6s; }

@media (prefers-reduced-motion: reduce) {
  .slide,
  .slide .reveal {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
```

## Navigation Chrome

All navigation is `position: fixed` with high z-index, layered above slides. It must stay readable on mixed dark/light backgrounds through a subtle backdrop and text shadow.

Use the full implementation from `./exemplars/slide-deck.html`. Keep it inline and self-contained; do not add an external `engine.js` asset.

### Required reader controls

- Top progress bar.
- Visible prev/next arrow buttons at the bottom left (`.deck-arrows`), disabled at the ends.
- Expandable right-side reader rail. At rest it is compact dots. On hover or keyboard focus it expands to show slide titles.
- Slide counter with reading percent, for example `4 / 12 · 33%`.
- Keyboard hints that mention arrows, `O` for outline, and `?` for help.
- Outline overlay opened by `O`.
- Help overlay opened by `?`.
- `#slide-N` deep links. A URL hash always wins over saved resume state.
- Resume with `localStorage`, keyed by path, document title, and slide count to reduce stale resumes after a deck is overwritten. Resume must **read back** (hash first, then `localStorage`) — writing the key without restoring it is the classic hand-rolled failure.

Copy the chrome from the exemplar, class names included — do not paraphrase it into a reduced version. The delivery check (`check_artifact.mjs --kind deck-html`) keys on the canonical classes (`deck-arrow`, `deck-dot-label`) and on resume reading back.

### Progressive enhancement rules

- Hide entrance states behind `.js` so decks remain visible with JavaScript disabled.
- Instantiate the deck engine from the inline non-module script, not from the Mermaid module callback. The deck must still become readable if Mermaid fails to load.
- Use DOM creation and `textContent` for dynamic slide titles. Do not build outline rows with untrusted `innerHTML`.
- Use real `<button type="button">` controls with `aria-label`, `aria-current`, and visible focus states.
- Do not let slide-level keyboard navigation run while focus is inside Mermaid, tables, code scroll regions, form controls, or contenteditable regions.

### Shape of the right rail

```css
.deck-dots {
  position: fixed;
  right: clamp(12px, 2vw, 24px);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  width: 36px;
  max-height: min(70dvh, 560px);
  overflow-y: auto;
  backdrop-filter: blur(4px);
}

.deck-dots:hover,
.deck-dots:focus-within {
  width: min(240px, calc(100vw - 32px));
}

.deck-dot {
  display: grid;
  grid-template-columns: 8px minmax(0, 1fr);
  gap: 0;
  width: 20px;
}

.deck-dots:hover .deck-dot,
.deck-dots:focus-within .deck-dot {
  gap: 10px;
  width: 100%;
}

.deck-dot-label {
  max-width: 0;
  overflow: hidden;
  opacity: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.deck-dots:hover .deck-dot-label,
.deck-dots:focus-within .deck-dot-label {
  max-width: 180px;
  opacity: 0.9;
}
```

### SlideEngine responsibilities

The inline `SlideEngine` should own only deck reading behavior:

1. Build the progress bar, reader rail, counter, hint text, and outline/help overlay.
2. Extract slide titles from `.slide__display`, `.slide__heading`, `blockquote`, or `.slide__kpi-label`.
3. Navigate with arrows, PageUp/PageDown, Space, Home/End, touch swipes, rail buttons, and outline buttons.
4. Observe visible slides and update progress, active rail item, counter, hash, and resume key.
5. Restore from `#slide-N` first, then from localStorage when no hash exists.

Do not add quiz widgets, fact ledgers, validation scripts, fork updaters, or a separate engine file as part of the slide navigation layer.

## Auto-Fit

A single post-render function that handles known rendering overflow cases. Agents can't perfectly predict how text reflows at every viewport size, so `autoFit()` is a safety net, never proof that the slide budget passed. Call it after Mermaid/Chart.js render but before SlideEngine init, then run the delivery check.

```javascript
function autoFit() {
  // Mermaid SVGs: fill container instead of rendering at intrinsic size
  document.querySelectorAll('.mermaid svg').forEach(function(svg) {
    svg.removeAttribute('height');
    svg.style.width = '100%';
    svg.style.maxWidth = '100%';
    svg.style.height = 'auto';
    svg.parentElement.style.width = '100%';
  });

  // KPI values: visually scale down text that overflows card width
  document.querySelectorAll('.slide__kpi-val').forEach(function(el) {
    if (el.scrollWidth > el.clientWidth) {
      var s = el.clientWidth / el.scrollWidth;
      el.style.transform = 'scale(' + s + ')';
      el.style.transformOrigin = 'left top';
      var slide = el.closest('.slide');
      if (slide) slide.setAttribute('data-auto-fit', 'KPI value');
    }
  });

  // Blockquotes: reduce font proportionally only as a last-resort fallback
  document.querySelectorAll('.slide--quote blockquote').forEach(function(el) {
    var len = el.textContent.trim().length;
    if (len > 150) {
      var scale = Math.max(0.5, 150 / len);
      var fs = parseFloat(getComputedStyle(el).fontSize);
      el.style.fontSize = Math.max(16, Math.round(fs * scale)) + 'px';
      var slide = el.closest('.slide');
      if (slide) slide.setAttribute('data-auto-fit', 'quote');
    }
  });
}
```

Three cases, one function:
- **Mermaid:** SVGs render with fixed dimensions inside flex containers — force them to fill available width.
- **KPI values:** Long text strings at hero scale overflow card boundaries — `transform: scale()` shrinks visually without reflow. Mark the slide so the delivery check can still call out the fallback.
- **Blockquotes:** Quotes over the ~150-character budget get proportionally smaller font. The 0.5 floor prevents unreadably small text, but `data-auto-fit="quote"` is still a review warning — split it into a content slide rather than treating the shrink as a pass.

## Delivery Overflow Check

`100dvh` is a hard content budget, not an instruction to hide overflow. Run the check at the target viewport and at a short landscape height with `prefers-reduced-motion: reduce` enabled. The reference template disables entrance states in that mode, outlines failures, and prints the offending slide numbers. It also keeps slides marked by `autoFit()` visible as review warnings, so a fallback cannot silently turn an over-budget slide into a pass.

The check is intentionally self-contained and should run after fonts and Mermaid/Chart.js content settle. The reference template invokes the same check after rendering whenever reduced motion is enabled; retain that invocation in a custom deck or run this snippet manually during review:

```javascript
function checkSlideOverflow() {
  var failures = [];
  document.querySelectorAll('.slide').forEach(function(slide, index) {
    var excess = Math.ceil(slide.scrollHeight - slide.clientHeight);
    var autoFit = slide.getAttribute('data-auto-fit');
    var reasons = [];
    if (excess > 1) reasons.push('vertical overflow ' + excess + 'px');
    if (autoFit) reasons.push('autoFit: ' + autoFit);

    if (reasons.length) {
      var kind = excess > 1 ? 'overflow' : 'auto-fit';
      slide.setAttribute('data-slide-check', kind);
      slide.setAttribute(
        'data-slide-check-label',
        excess > 1
          ? 'OVERFLOW — split or reduce (' + excess + 'px)'
          : 'AUTO-FIT USED — review budget (' + autoFit + ')'
      );
      failures.push('Slide ' + (index + 1) + ': ' + reasons.join('; '));
    } else {
      slide.removeAttribute('data-slide-check');
      slide.removeAttribute('data-slide-check-label');
    }
  });

  if (failures.length) {
    console.error(
      'Slide delivery check failed. ' + failures.join(' | ') +
      '. Split or reduce content; autoFit is only a safety net.'
    );
  } else {
    console.info('Slide delivery check passed: no vertical overflow or autoFit fallback.');
  }
  return failures;
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  requestAnimationFrame(checkSlideOverflow);
}
```

Do not ship with `data-slide-check` warnings unresolved. A flagged slide needs fewer items, a smaller composition, or another slide; do not solve a vertical failure by adding an inner scroller or by lowering readable type below the typography minimum.

## Decorative SVG Elements

Inline SVG accents lift slides from functional to editorial. Use sparingly — one or two per slide, never on every slide.

### Corner Accent

```html
<!-- Top-right corner mark -->
<svg class="slide__decor slide__decor--corner" width="120" height="120" viewBox="0 0 120 120">
  <line x1="120" y1="0" x2="120" y2="40" stroke="var(--accent)" stroke-width="2" opacity="0.2"/>
  <line x1="80" y1="0" x2="120" y2="0" stroke="var(--accent)" stroke-width="2" opacity="0.2"/>
</svg>
```

```css
.slide__decor {
  position: absolute;
  pointer-events: none;
  z-index: 0;
}

.slide__decor--corner {
  top: 0;
  right: 0;
}
```

### Section Divider Mark

```html
<!-- Horizontal rule with diamond -->
<svg class="slide__decor slide__decor--divider" width="200" height="20" viewBox="0 0 200 20">
  <line x1="0" y1="10" x2="85" y2="10" stroke="var(--accent)" stroke-width="1" opacity="0.3"/>
  <rect x="92" y="3" width="14" height="14" transform="rotate(45 99 10)" fill="none" stroke="var(--accent)" stroke-width="1" opacity="0.3"/>
  <line x1="115" y1="10" x2="200" y2="10" stroke="var(--accent)" stroke-width="1" opacity="0.3"/>
</svg>
```

### Geometric Background Pattern

```css
/* Faint grid dots behind a slide */
.slide--with-grid::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
  background-size: 32px 32px;
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
}
```

### Per-Slide Background Variation

Vary gradient direction and accent glow position across slides to create visual rhythm. Don't use a uniform background for every slide.

```css
/* Vary these per slide via inline style or nth-child */
.slide:nth-child(odd) {
  background-image: radial-gradient(ellipse at 20% 80%, var(--accent-dim) 0%, transparent 50%);
}

.slide:nth-child(even) {
  background-image: radial-gradient(ellipse at 80% 20%, var(--accent-dim) 0%, transparent 50%);
}
```

## Proactive Imagery

Slides should reach for visuals before defaulting to text alone. If a slide could be more compelling with an image, chart, or diagram, add one. Plan images right after the storyboard: run `which surf`; if surf-cli is available, plan 2–4 generated images (title slide and one full-bleed slide at minimum) and generate them before writing HTML so they can be embedded as base64 data URIs.

**surf-cli integration:** if available, **generate 2–4 images minimum** for any deck over 10 slides. This is not optional when surf is available — a deck with AI-generated imagery is dramatically more compelling than one with only CSS gradients. Target these slides in priority order:

1. **Title slide** (always): background image that sets the deck's visual tone. Match the topic and palette. Use `--aspect-ratio 16:9`.
2. **Full-bleed slide** (always if deck has one): immersive background for the deck's visual anchor moment. Style should match the theme — photo-realistic for Midnight Editorial, abstract/geometric for Swiss Clean, circuit-board or terminal aesthetic for Terminal Mono.
3. **Content slides with conceptual topics** (1–2 if the deck has room): illustration in the `.slide__aside` area for slides about abstract concepts. Use `--aspect-ratio 1:1`.

**Generate images before writing HTML** so they're ready to embed. The workflow:

```bash
# Check availability
which surf

# Generate (one per target slide)
surf gemini "descriptive prompt matching deck palette" --generate-image /tmp/ve-slide-title.png --aspect-ratio 16:9

# Base64 encode for self-containment (macOS)
TITLE_IMG=$(base64 -i /tmp/ve-slide-title.png)
# Linux: TITLE_IMG=$(base64 -w 0 /tmp/ve-slide-title.png)

# Embed in the slide
# <div class="slide__bg" style="background-image:url('data:image/png;base64,${TITLE_IMG}')"></div>

# Clean up
rm /tmp/ve-slide-title.png
```

**Prompt craft for slides:** Be specific about style, dominant colors, and mood. Pull colors from the theme's CSS variables. Examples:
- Terminal Mono: "dark abstract circuit board pattern, green (#50fa7b) traces on near-black (#0a0e14), minimal, technical"
- Midnight Editorial: "deep navy abstract composition, warm gold accent light, cinematic depth of field, premium editorial feel"
- Warm Signal: "warm cream textured paper with terracotta geometric accents, confident modern design"

**When surf fails or isn't available:** Degrade gracefully to CSS gradients and SVG decorations. Use the `.slide__bg--gradient` pattern with bold `linear-gradient` or `radial-gradient` backgrounds. The deck should stand on its own visually without generated images — they enhance, they don't carry. Note the fallback in an HTML comment (`<!-- surf unavailable, using CSS gradient fallback -->`) so future edits know to retry.

**Inline data visualizations:** Proactively add SVG sparklines next to numbers, mini-charts on dashboard slides, and small Mermaid diagrams on split slides even when not explicitly requested. A number with a sparkline next to it tells a better story than a number alone.

**When to skip images:** Pure structural or data-heavy decks (code reviews, table comparisons) may not need generated images. Never error on missing surf.

## Responsive Height Breakpoints

Height-based scaling is more critical for slides than width. Each breakpoint progressively reduces padding, font sizes, and hides decorative elements.

```css
/* Compact viewports */
@media (max-height: 700px) {
  .slide {
    padding: clamp(24px, 4vh, 40px) clamp(32px, 6vw, 80px);
  }
  .slide__display { font-size: clamp(36px, 8vw, 72px); }
  .slide--divider .slide__number { font-size: clamp(80px, 16vw, 160px); }
}

/* Small tablets / landscape phones */
@media (max-height: 600px) {
  .slide__decor { display: none; } /* hide decorative SVGs */
  .slide--quote { padding: clamp(32px, 6vh, 60px) clamp(40px, 8vw, 100px); }
  .slide__quote-mark { display: none; }
}

/* Aggressive: landscape phones */
@media (max-height: 500px) {
  .slide {
    padding: clamp(16px, 3vh, 24px) clamp(24px, 5vw, 48px);
  }
  .deck-dots { display: none; } /* dots clutter tiny viewports */
  .slide__display { font-size: clamp(28px, 7vw, 48px); }
}

/* Width breakpoint for grids */
@media (max-width: 768px) {
  .slide--content .slide__inner { grid-template-columns: 1fr; }
  .slide--content .slide__aside { display: none; }
  .slide--split .slide__panels { grid-template-columns: 1fr; }
  .slide--dashboard .slide__kpis { grid-template-columns: repeat(2, 1fr); }
}
```
