# Slide types — the catalog

The ten slide types every deck is built from, one file per type. This index is what the storyboard needs (Step 3: choose types and compositions); open a type's file only when rendering that type. Each file has two layers: **Concept & limits** (cross-target — binds at storyboard time and for both deck targets) and **Deck-html implementation** (markup and CSS for the HTML deck target; Slidev renders the same types through the mapping table in `../../targets/deck-slidev/TARGET.md`).

## Catalog

| Type | Use for | Density limit (one `100dvh` budget) | File |
|---|---|---|---|
| Title | Deck opening; sets tone | 1 heading + 1 subtitle | `title.md` |
| Section Divider | Pause between topics | 1 number + 1 heading + optional subhead | `section-divider.md` |
| Content | One idea with few supports | 1 heading + 5–6 bullets (max 2 lines each) | `content.md` |
| Split | Contrast two things | 1 heading + 2 panels, each follows its inner type's limits | `split.md` |
| Diagram | Relationships and flows | 1 heading + 1 Mermaid diagram (max 8–10 nodes) — or its CSS pipeline variant for simple linear flows | `diagram.md` |
| Dashboard | Metrics scanned at a glance | 1 heading + 6 KPI cards; hero values ≤6 chars | `dashboard.md` |
| Table | Cross-referencing 2–3 variables | 1 heading + 8 rows; overflow paginates to next slide | `table.md` |
| Code | One focused code point | 1 heading + 10 lines of code | `code.md` |
| Quote | A pause on one idea | 1 short quote (~150 chars max) + 1 attribution | `quote.md` |
| Full-Bleed | Visual anchor moment; closing | 1 heading + 1 subtitle over background | `full-bleed.md` |

Density limits are hard: if content exceeds them, split across slides — never scroll within a slide, and never treat `autoFit()` shrinking as a pass. The countable ones (table rows, bullets, code lines, quote length, KPI count) are enforced by `../../scripts/check_artifact.mjs` on both deck targets.

## Compositional Variety

Consecutive slides must vary their spatial approach. Three centered slides in a row means push one off-axis.

Compositions to alternate between:

- Centered (title slides, quotes)
- Left-heavy: content on the left 60%, breathing room on the right
- Right-heavy: content on the right 60%, visual or whitespace on the left
- Edge-aligned: content pushed to bottom or top, large empty space opposite
- Split: two distinct panels filling the viewport
- Full-bleed: background dominates, minimal overlaid text

Plan the slide sequence considering layout rhythm, not just content order: assign a composition to each slide at storyboard time, before writing anything.

## Presentation Readability

Slides get projected, screen-shared, viewed at distance. Design accordingly:

- **Minimum body text: 16px.** Nothing smaller except labels and captions.
- **One focal point per slide.** Not three competing elements.
- **Higher contrast than pages.** Dimmed text (`--text-dim`) should still be easily readable at distance — test against the background.
- **Nav chrome opacity.** Dots and progress bar must be visible on any slide background without being distracting (backdrop blur or text shadow — see the deck-html engine).
- **Simpler Mermaid diagrams.** Max 8–10 nodes, 18px+ labels, 2px+ edges, readable without zoom at presentation distance.
