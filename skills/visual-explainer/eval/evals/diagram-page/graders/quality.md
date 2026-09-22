---
type: llm
weight: 2
focus: { source: file, path: "out/diagrama.html" }
---
Evaluate the delivered HTML page.

PASS if ALL hold:
- The diagram depicts the mechanism, not just named boxes: the request's path CDN → API gateway → service → Redis cache → database is traversable, and the cache hit vs. miss distinction is visible.
- Arrows carry labels describing what happens (e.g. "rate limit", "cache miss"), not bare lines.
- The figure has a caption that states a claim about the system, not a title that merely names it.
- The page is visually themed (coherent palette and typography via CSS custom properties), not browser-default HTML.

FAIL if any:
- Boxes connected by unlabeled arrows.
- Cache behavior (hit/miss) not distinguishable.
- No caption, or caption merely repeats the diagram's name.
- Unstyled or default-looking output.
