---
type: llm
focus: last_message
---
PASS if the final chat reply is a short prose summary (a few sentences naming the page and perhaps one headline takeaway per engine) that points the reader to the generated HTML page for the full comparison.

FAIL if the final reply reproduces the full comparison inline (a markdown/ASCII table or an exhaustive per-cell listing), making the HTML page redundant.
