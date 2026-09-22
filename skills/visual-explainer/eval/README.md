# visual-explainer — eval suite

Official-format eval suite for the skill, runnable with `claude plugin eval` (early access). Format reference: <https://code.claude.com/docs/en/plugin-evals.md>; method reference: <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices.md> (evaluation-first authoring: core cases + edges + negative activation).

`claude plugin eval` only runs against plugins, not bare skill directories, so this directory is the minimal official wrapper: `.claude-plugin/plugin.json` plus `skills/visual-explainer` symlinked to the skill root. The skill itself stays a plain portable skill.

## Cases

| Case | Tags | What it proves |
|---|---|---|
| `diagram-page` | core, page | Page genre end to end: mechanism diagram, render.mjs delivery, check_artifact self-check |
| `slidev-deck` | core, slidev | Slidev target: project-source deck, storyboard first, presenter notes, self-check |
| `deck-html` | core, deck | Lifecycle rule picks deck-html (one-shot) over Slidev; storyboard; varied compositions |
| `table-trigger` | edge, activation | Implicit trigger: a 4×4 comparison becomes an HTML table page, chat gets a short summary |
| `fact-check` | edge, fact-check | Verifier genre: false claims corrected in place against the code, verification summary added |
| `no-activation` | negative, activation | Near-miss: a plain code edit request must not invoke the skill |

The deterministic backbone is `scripts/check_artifact.mjs`: SKILL.md obliges the agent to self-check every deliverable with it, so `regex` graders on the trace ("passes the … delivery check") verify the mechanical contract without needing a command grader. `llm` graders judge only what is genuinely judgment (mechanism shown, storyboard coverage, composition variety).

## Running

```bash
claude plugin eval skills/visual-explainer/eval \
  --scaffold \
  --allow-tools Bash Write Edit \
  --runs 2 \
  --threshold 0.8 \
  --model claude-sonnet-5 \
  --no-publish
```

- `--scaffold` is required by the `fact-check` case (its `scaffold.sh` plants the fixture repo and the report with false claims).
- `--allow-tools Bash Write Edit` is required: the skill writes artifacts and runs its scripts; case frontmatter can only pre-allow read-only tools.
- Pin `--model` (and `--judge-model`) for comparable runs; the sandbox does not inherit `ANTHROPIC_MODEL`.
- Filter while iterating: `--case diagram-page`, or `--tag core`, `--tag activation`.
- Cost control: `--max-cost-usd 10`. Results land in `evals/results/<timestamp>/` (gitignored) with `aggregate-result.json` + a self-contained `report.html`.

Early access: if the command prints "early access", it is not enabled for this account/session — `claude update`, fresh session; on Bedrock/Vertex/gateways, enablement comes from your Anthropic contact. Self-test: `claude plugin eval` in an empty directory should print "No eval cases found".

## Design notes

- Output paths are made deterministic per case via `append_system_prompt` (`--out-dir ./out --filename <name>`), so `file_exists` and file-focused graders have exact targets; the prompts themselves stay natural.
- `tool_used: Skill` graders confirm activation; in two-arm mode the runner excludes them from the without-arm score automatically. The negative case uses `min: 0, max: 0` + `arm: with-only`.
- Caveat: the runner hides the plugin's eval directory from the agent, but this wrapper's symlink also exposes the skill root (which contains `eval/`); a determined agent could read case definitions through it. Acceptable for now — none of the prompts reward that — but keep grader rubrics free of copy-paste-able answers.
- Manual fallback (pi or any harness without `claude plugin eval`): run each case's prompt in a fresh session with only this skill loaded, apply the graders by hand, and detect activation by whether the agent read `SKILL.md` — per `skills/skill-builder/references/evaluation.md`.
