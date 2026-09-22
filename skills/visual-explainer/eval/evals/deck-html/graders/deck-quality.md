---
type: llm
weight: 2
focus: { source: file, path: "out/deck.html" }
---
Evaluate the delivered HTML deck.

PASS if ALL hold:
- It is a slide deck (viewport-sized slides with navigation), not a scrollable article.
- 6–8 slides covering: composite index column order, the prefix rule, and when an index does not help — each with real content, none dropped to fit.
- Compositions vary across slides (not three centered slides in a row); at least one slide uses a figure, table, or code sample rather than bullets.
- Styling is coherent and token-based (CSS custom properties), with visible navigation chrome (progress/dots/counter or equivalent).

FAIL if any:
- Scrollable document pretending to be a deck.
- A topic from the request is missing.
- Every slide is the same centered-bullets composition.
