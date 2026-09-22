# Review-family invariants

The review genres — diff review, plan review, project recap, visual plan — share one skeleton and one visual language. Each genre file carries only its specifics (scope detection, gathering recipe, section skeleton); everything here applies to all of them.

## The shared skeleton

Every review genre runs the same four phases, in order:

1. **Gather** — run the genre's data-gathering recipe before writing any output. Commands and files, not memory.
2. **Verify** — apply `evidence.md` to everything gathered. The genre's section skeleton says what must be verifiable.
3. **Storyboard** — instantiate the genre's section skeleton as a page-profile storyboard (`storyboard.md`); for long sources, share it first.
4. **Render** — deliver through the genre's target. Review genres are one-shot artifacts: target `page`.

## Color language

Reviews encode state in color, consistently, through the theme's semantic tokens — never the accent hue:

| Meaning | Token |
|---|---|
| Removed / before / blocker | `--red` (+ `--red-dim` fills) |
| Added / after / pass | `--green` (+ `--green-dim`) |
| Modified / risk / needs attention | `--orange` (+ `--orange-dim`) |
| Neutral context | `--accent` / `--text-dim` |

Semantic color marks state only. If everything is amber, nothing is.

## Page conventions for reviews

- Executive summary first: the one-screen verdict a reader scans before deciding to read on.
- 4+ major sections → responsive section navigation (`responsive-nav.md`).
- File maps and command lists as compact reference tables; long trees inside `<details>`.
- Matrices (risk, gap, accuracy) as semantic `<table>`, one row per dimension, verdict column colored by the language above.
- Diagrams follow the skill's Mermaid rules; show only the affected subsystem, not the whole world.
- End with an explicit decision or recommendation section — a review that does not conclude is a tour, not a review.
