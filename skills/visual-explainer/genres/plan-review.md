# Genre: plan review

Compare an implementation plan against the current codebase. Review family: `../references/reviews.md` applies. Target: `../targets/page/`.

## Scope

The argument is the plan path or plan text. With no argument, ask for the plan.

## Gather

Read the plan in full. Extract goals, assumptions, proposed files/functions/types, migrations, tests, rollout/release notes, and explicit risks. Read every referenced file, plus importers/dependents that may be affected. Search for existing patterns, similar implementations, public API boundaries, config/schema files, and tests.

## Verify

`../references/evidence.md` binds. For each proposed change: does the referenced file/function/type exist? Does current behavior match what the plan assumes? What ripple effects is it missing? Does the proposed test coverage fit the current test style? Cite plan sections and `file:line` evidence.

## Section skeleton

1. **Plan summary** — problem, core idea, scope.
2. **Accuracy verdict** — correct, stale, risky, unsupported, missing (per claim class).
3. **Current architecture** — diagram of the affected subsystem only.
4. **Proposed architecture** — matching visual diff against the current state.
5. **Gap/risk matrix** — correctness, tests, API, data model, UX, security/privacy, performance, maintainability, release.
6. **File-by-file review** — proposed edit, current reality, recommendation.
7. **Better plan** — concrete corrections or simplifications.
8. **Decision** — approve, revise, or reject, with rationale.
