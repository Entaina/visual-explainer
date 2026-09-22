# Genre: deck

A slide deck — a narrative told in slides, not a paginated article. Slides only when the user asks for them (the slides subcommand, or natural language like "as a slide deck"); never auto-select this genre. This is the only genre that crosses render targets, so it carries a format decision step.

## Decide the target (lifecycle rule)

- **One-shot artifact** — the deck is delivered as a link or file and nobody maintains it → `../targets/deck-html/`.
- **Maintained source** — the deck belongs to a repository, is versioned, composed via `src:` imports, or the user says Slidev (`--slidev`) → `../targets/deck-slidev/`.

When the project already manages decks as Slidev source, that convention wins without asking. When neither signal exists, HTML is the default.

## Storyboard first — mandatory

Write the deck-profile storyboard per `../references/storyboard.md`: inventory the source, map every item, choose a narrative arc, assign each slide a type and composition from `../references/slide-types/README.md`. Share it; pause for approval only when the user asked to review it. The storyboard is format-agnostic — the target decision can even change after it is approved without redoing it.

## Content rules

- Density limits from `../references/slide-types/README.md` bind at storyboard time and at render time.
- Visual-first: diagrams, charts, tables, SVG accents; generated images only when they clarify the story.
- Vary compositions — three centered slides in a row is a smell.
- Do not drop content to fit a slide count; add slides.
- Every slide gets presenter notes; the first note states estimated duration.
- End with a transition or comprehension check.

## Render

Deliver through the chosen target's `TARGET.md`. The same storyboard drives both.
