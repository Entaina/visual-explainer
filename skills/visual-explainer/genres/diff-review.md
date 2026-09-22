# Genre: diff review

A visual review of code changes. Review family: the shared skeleton, color language, and page conventions in `../references/reviews.md` apply. Target: `../targets/page/`.

## Scope

Interpret the argument as a branch, commit, range, PR, or `HEAD`. With no argument, compare the working tree against `main`/`master`.

## Gather

Run the relevant git commands for: diff stats, name-status, changed files, line counts, public API/type/function changes, added/removed files, docs/changelog changes, tests touched, dependencies/config changes. Read changed files in full plus the surrounding code paths needed to validate behavior. If reviewing committed work, read commit messages. If this session created the work, use available progress/plan notes for rationale.

## Verify

`../references/evidence.md` binds. Before writing, know and can cite: exact changed files and line-count scope; each function/type/module name referenced; before/after behavior of important changes; likely coupling and test impact.

## Section skeleton

1. **Executive summary** — intuition, problem solved, factual scope.
2. **File map** — full tree, color-coded new/modified/deleted; compact, `<details>` if long.
3. **Architecture impact** — diagram when relationships matter.
4. **Before/after behavior** — side-by-side comparison of the important changes.
5. **Risk review** — correctness, tests, API compatibility, security/privacy, performance, maintainability.
6. **Coupling map** — dependencies, hidden coupling, migration/release concerns.
7. **Review recommendation** — merge readiness, blockers, follow-ups.
