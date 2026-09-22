---
type: llm
weight: 2
focus: trace
---
Judge the final slides.md content as written during the session (visible in Write/Edit tool calls).

PASS if ALL hold:
- Around six slides (4–9 acceptable), each with a presenter note (`<!-- ... -->`), the first note stating an estimated duration.
- The three Git file states are each given real coverage, with at least one figure or visual composition showing the transitions between them (not only bullet lists).
- Slide layouts vary (not every slide is the default layout with bullets).
- No hardcoded colors in slide content; styling left to the theme.

FAIL if any:
- Slides without presenter notes.
- One wall-of-bullets slide per state with no visual of the transitions.
- Inline color styling in slides.md.
