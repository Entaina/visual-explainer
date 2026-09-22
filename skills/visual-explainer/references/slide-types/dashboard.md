# Dashboard slide

## Concept & limits

Metrics scanned at a glance. Density: 1 heading + max 6 KPI cards. **Hero values must be short** — numbers, percentages, 1–3 word labels; ideal length 1–6 characters at hero scale. Longer strings like `store=false` belong in the label or body text, not the hero row.

Slidev: `layout: fact` for a single figure; a small HTML grid styled with tokens for several — see `../../targets/deck-slidev/TARGET.md`.

## Deck-html implementation

KPI cards at presentation scale (48–64px hero numbers). Mini-charts via Chart.js or SVG sparklines. The engine's `autoFit()` scales down overflowing values as a safety net — treat any such shrink as a review warning, not a pass.

```html
<section class="slide slide--dashboard">
  <h2 class="slide__heading reveal">Metrics Overview</h2>
  <div class="slide__kpis">
    <div class="slide__kpi reveal">
      <div class="slide__kpi-val" style="color:var(--accent)">247</div>
      <div class="slide__kpi-label">Lines Added</div>
    </div>
    <!-- more KPI cards -->
  </div>
</section>
```

```css
.slide--dashboard .slide__kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(140px, 20vw, 220px), 1fr));
  gap: clamp(12px, 2vw, 24px);
}

.slide__kpi {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: clamp(16px, 3vh, 32px) clamp(16px, 2vw, 24px);
  min-width: 0;
  overflow: hidden;
}

.slide__kpi-val {
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 800;
  letter-spacing: -1.5px;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.slide__kpi-label {
  font-family: var(--font-mono);
  font-size: clamp(9px, 1.2vw, 13px);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-dim);
  margin-top: 8px;
}
```
