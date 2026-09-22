# Storyboard — the intermediate representation

The storyboard is the format-agnostic plan between the source content and the rendered output. It says *what* each unit contains and *how* it is composed, without committing to a render target. It comes in two profiles that share the same process:

- **Deck profile** — units are slides. The same storyboard renders to an HTML deck or a Slidev deck unchanged.
- **Page profile** — units are page sections. Genre files ship a pre-filled section skeleton (their "required sections"); the storyboard instantiates it against the actual source.

**When to write one:**

- Always for decks, whatever the render target.
- For long scrollable pages (4+ major sections) when the source is a structured document. Review genres (diff review, plan review, recap, visual plan) carry their section skeleton in the genre file — instantiate it; invent structure only for what the skeleton does not cover.
- Whenever the user asks to review the plan first.

Skip it for quick single-figure outputs: one diagram, one table, one dashboard.

**Review gate:** share the storyboard with the user before rendering. If the user asked to review it, stop and wait for approval; otherwise present it and continue. Iterating on the storyboard is cheap; iterating on a rendered output is not.

## Process

Skipping this process leads to polished-looking output that silently drops 30–40% of the source material.

**Step 1 — Inventory the source.** Read the entire source and enumerate every section, subsection, card, table row, decision, specification, collapsible detail, and footnote. Count them. A plan with 7 sections, 6 decision cards, a 7-row table, and 3 sub-specs is ~20 distinct content items that all need real estate.

**Step 2 — Map every item.** Assign each inventory item to one or more units. Every item must appear somewhere:

- If a section has 6 decisions, all 6 get space — not the 2 that fit in one split.
- A 7-row table keeps its 7 rows.
- Collapsible details in the source are not optional in the output.
- Do not drop content to hit a target count; add units instead. A 7-section source typically produces 18–25 slides, not 10–13.

**Step 3 — Choose types and compositions.** Deck profile: assign each slide a type (Title, Section Divider, Content, Split, Diagram, Dashboard, Table, Code, Quote, Full-Bleed) and a spatial composition — alternate dense and sparse; three centered slides in a row means push one off-axis. Compositions: centered, left-heavy, right-heavy, edge-aligned, split, full-bleed. Density limits per type are in `slide-types/README.md`; they bind here, at planning time. Page profile: order the genre's section skeleton, mark which sections carry a figure, a table, or collapsible detail.

**Step 4 — Plan the figures.** One figure, one claim; note the claim in the storyboard. Decide Mermaid vs. CSS/layout per the rules in `../SKILL.md`. Write the Mermaid source in the storyboard — it travels unchanged to every render target.

**Step 5 — Verify coverage.** Scan the Step 1 inventory. Anything unmapped? Would a reader of the source notice something missing? If yes, add units.

## Output format

Write the storyboard as a compact Markdown document:

```markdown
# Storyboard: <title>

Fuente: <document/diff/topic> · Género: <genre> · Target: <page | deck-html | deck-slidev> · Tema: entaina · Audiencia: <who>

Inventario: <N> ítems (7 secciones, 6 decisiones, tabla de 7 filas, …)

| # | Tipo | Composición | Contenido (ítems de la fuente) | Figura / afirmación |
|---|------|-------------|--------------------------------|---------------------|
| 1 | Title | centered | título, fecha | — |
| 2 | Content | left-heavy | decisiones 1–3 | — |
| 3 | Diagram | centered | flujo de autenticación | "cada petición pasa dos veces por la caché" |
| … | | | | |

Cobertura: todos los ítems mapeados / pendientes: <list>
```

Language follows the source content; the structure above is what matters, not the labels. In the page profile, the Tipo column holds the section name from the genre skeleton instead of a slide type.

## The test

A reader who has never seen the source should be able to reconstruct every major point from the rendered output alone. If they would miss entire sections, the storyboard is incomplete — fix it here, not in the rendered file.
