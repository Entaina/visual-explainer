# Genre: visual plan

A visual implementation plan for a proposed change. Review family: `../references/reviews.md` applies. Target: `../targets/page/`.

## Gather

Research before planning: read the relevant repo files to identify entry points, existing patterns, affected modules, public APIs, tests, config/schema/data model, similar features, and constraints from README/CHANGELOG/docs.

## Verify

`../references/evidence.md` binds: the plan builds only on verified current state. Proposals are judgment and read as such.

## Section skeleton

1. **Goal and scope** — what will change and what is intentionally out.
2. **Current state** — short diagram or table of the existing architecture.
3. **Proposed design** — architecture/data/control flow.
4. **Implementation sequence** — ordered phases with dependencies.
5. **File map** — files to create/edit/delete and why.
6. **Interfaces and contracts** — types, APIs, schemas, CLI flags, config, events.
7. **Risk and decision matrix** — correctness, tests, migration, release, UX, security/privacy, performance.
8. **Test plan** — unit/integration/e2e/edge cases mapped to files.
9. **Acceptance checklist** — observable done criteria.

Hierarchy: overview and architecture dominate; detailed file/test/reference sections stay compact or collapsible.
