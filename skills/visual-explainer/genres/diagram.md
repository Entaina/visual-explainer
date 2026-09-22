# Genre: diagram

A visual explanation of a system, concept, dataset, or piece of code — the general-purpose genre when no review genre fits. Target: `../targets/page/`.

## Gather

If the subject is code, read the relevant sources before drawing: entry points, the actual call/data paths, and the names the code uses. A diagram of real code follows `../references/evidence.md` — identifiers spelled as the source spells them, mechanisms as they actually are.

## Shape the content

- Pick the representation with the routing table in `../SKILL.md` ("Choose the representation"): connected flows and topologies → Mermaid; text-heavy explanations → card layouts; matrices → tables; linear history → timeline; metrics → dashboard grid.
- Depict the mechanism, not its name: the path a request takes through a cache says more than a box labeled "cache". Label every arrow (`writes`, `invalidates`, `polls every 30s`).
- To compare options, draw the difference — the edge each option adds or removes.
- One figure, one claim; the caption states it.

## Structure

A single figure or table needs no storyboard. A page with 4+ major sections gets a page-profile storyboard first (`../references/storyboard.md`).

## Render

Deliver through `../targets/page/TARGET.md`.
