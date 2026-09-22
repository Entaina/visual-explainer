# Table slide

## Concept & limits

Cross-referencing a few variables at projection scale. Density: 1 heading + max 8 rows — overflow paginates to the next slide, never scrolls inside one. Completeness is not an exemption: a table that exists to be exhaustive (an inventory, a catalog) splits its rows across continued slides with the header repeated — the cap is about attention, not about what fits. Stronger alternating row contrast than page tables.

Slidev: default layout + Markdown table (styled by the base rules) — see `../../targets/deck-slidev/TARGET.md`.

## Deck-html implementation

18–20px cell text for projection readability. Reuses the `data-table` pattern from `../css-patterns.md` at slide scale.

```html
<section class="slide slide--table">
  <h2 class="slide__heading reveal">Data Title</h2>
  <div class="table-wrap reveal" style="flex:1; min-height:0;">
    <div class="table-scroll">
      <table class="data-table"> ... </table>
    </div>
  </div>
</section>
```

```css
.slide--table {
  padding: clamp(24px, 4vh, 48px) clamp(24px, 4vw, 60px);
}

.slide--table .data-table {
  font-size: clamp(14px, 1.8vw, 20px);
}

.slide--table .data-table th {
  font-size: clamp(10px, 1.3vw, 14px);
  padding: clamp(8px, 1.5vh, 14px) clamp(12px, 2vw, 20px);
}

.slide--table .data-table td {
  padding: clamp(10px, 1.5vh, 16px) clamp(12px, 2vw, 20px);
}
```
