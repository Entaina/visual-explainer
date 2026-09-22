# Evidence rules

Shared by every genre that makes claims about a codebase or document (all review genres, fact-check, and any diagram of real code). These rules bind *before* rendering: gather and verify first, then write.

## The contract

- Every factual claim in the output must be backed by evidence you actually collected this session: command output, file contents, or git history.
- Cite in a form a reader can chase: file paths, `file:line`, command names, commit hashes.
- Do not invent rationale, code paths, function names, or momentum. If the evidence does not say why, the output says "rationale not recorded", not a plausible story.
- Distinguish claim strength explicitly where the genre calls for it: **verified** (inspected), **corrected** (was wrong, fixed against source), **unsupported** (asserted by the source document but not found), **unverifiable** (cannot be checked from here).

## Minimum verification before writing

- Exact identifiers: every file, function, type, and module name referenced in the output exists in the source, spelled as the source spells it.
- Behavior claims: before/after behavior of important changes read from the code, not inferred from names.
- Scope claims: counts (files changed, line counts, rows) come from command output, not estimation.
- Ripple effects: importers/dependents of touched code inspected far enough to support any coupling claims made.

## What is exempt

Subjective design judgment (composition, emphasis, what deserves a diagram) needs no citation. Keep judgment and fact visually separable in the output: a recommendation reads as a recommendation, not as a measured result.
