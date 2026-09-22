# Genre: fact-check

The verifier — the one genre that consumes outputs instead of producing new ones. It checks a previously generated document against the actual code and git history, corrects it in place, and reports what changed.

## Scope

The argument names the document. With no argument, use the most recently modified HTML file in the output directory (`VISUAL_EXPLAINER_OUTPUT_DIR` or `~/.agent/diagrams/`). Works on:

- **HTML pages and HTML decks** — correct in place, keep the existing page style, re-deliver with `../targets/page/TARGET.md`'s render script.
- **Markdown documents** — correct in place, report the path in chat.
- **Slidev decks** — correct `slides.md` in place (content and presenter notes only; never the managed blocks in `style.css`).

## Claim extraction

Read the target document. Extract verifiable claims about file paths, function/type/module names, behavior, architecture, data flow, APIs, commands, dependencies, tests, performance/security assertions, and git history. Skip subjective design opinions.

## Verification

For each claim, inspect the actual source or git history — re-read referenced files; for diff reviews, compare before/after with `git show` or the relevant range; for plan documents, verify referenced files/functions/types exist and behave as described. Classify every claim with the four verdicts from `../references/evidence.md`: verified, corrected, unsupported, unverifiable.

## Output

Preserve the document's structure. Correct factual errors in place and add a verification summary listing what was checked and what changed, with each correction citing its evidence.
