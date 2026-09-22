# visual-explainer — evals

Eval set for the skill, in the [Agent Skills eval format](https://agentskills.io/skill-creation/evaluating-skills): the cases live in `evals.json`, the fixtures in `files/`, and the results in a workspace **outside** the skill directory. Harness-agnostic — any agent that can spawn a clean session per run can execute it.

## Cases

| Case | Tags | What it proves |
|---|---|---|
| `diagram-page` | core, page | Page genre end to end: mechanism diagram, render.mjs delivery, check_artifact self-check |
| `slidev-deck` | core, slidev | Slidev target: project-source deck, storyboard first, presenter notes, self-check |
| `deck-html` | core, deck | Lifecycle rule picks deck-html (one-shot) over Slidev; storyboard; varied compositions |
| `table-trigger` | edge, activation | Implicit trigger: a 4×4 comparison becomes an HTML table page, chat gets a short summary |
| `fact-check` | edge, fact-check | Verifier genre: false claims corrected in place against the code, verification summary added |
| `no-activation` | negative, activation | Near-miss: a plain code edit request must not invoke the skill |

Beyond the standard fields (`id`, `prompt`, `expected_output`, `files`, `assertions`), cases carry `name` (used for the workspace directory), `tags` (for filtering), and — on the negative case only — `arm: with_skill`, because a baseline run for "the skill must not activate" is meaningless.

## Running

Run every case twice: once **with** the skill and once **without** it (the baseline). Each run starts in a clean session, so the agent follows only what `SKILL.md` says. When iterating on an existing version, snapshot it first and use the snapshot as the baseline instead.

Instructions for a single run:

```
Execute this task:
- Skill path: <repo>/skills/visual-explainer   (omit entirely for the baseline arm)
- Task: <the case's prompt, verbatim>
- Input files: copy the case's `files` into the working directory, keeping their paths
  below `files/<case>/` (so `files/fact-check/out/report.html` lands at `out/report.html`)
- Working directory and outputs: <workspace>/iteration-N/eval-<name>/<arm>/outputs/
- Set VISUAL_EXPLAINER_OUTPUT_DIR to that outputs directory and pass --no-open to
  render.mjs, so deliverables land there and no browser opens
```

Record `total_tokens` and `duration_ms` for each run in `timing.json` next to the outputs — they are not persisted anywhere else, and the token delta against the baseline is half of what the eval measures.

## Grading

Evaluate each assertion against the run's outputs and write `grading.json` with `passed` plus concrete evidence quoting the output. Assertions worded "The transcript shows …" are graded against the execution transcript, not the files; the rest against `outputs/`.

The deterministic backbone is `scripts/check_artifact.mjs`: `SKILL.md` obliges the agent to self-check every deliverable with it, so those transcript assertions verify the mechanical contract without a second implementation. Everything else is judgment — mechanism shown, storyboard coverage, composition variety — and is graded by an LLM or by eye.

Aggregate the iteration into `benchmark.json` (pass rate, tokens and duration per arm, plus the deltas) and record human review in `feedback.json`, one entry per case: a specific complaint, or empty when the output looked fine.

```
<repo>/skills/visual-explainer/evals/      # this directory: cases and fixtures
visual-explainer-workspace/
└── iteration-1/
    ├── eval-diagram-page/
    │   ├── with_skill/{outputs,timing.json,grading.json}
    │   └── without_skill/{outputs,timing.json,grading.json}
    ├── …
    ├── benchmark.json
    └── feedback.json
```

Keep the workspace out of this repository.

## Iterating

Between iterations, prune the assertion set as the method prescribes: drop assertions that pass in **both** arms (they measure the model, not the skill), investigate the ones that fail in both (usually a broken assertion or an impossible case), and study the ones that pass only with the skill — that is where the skill earns its keep. Then feed failed assertions, human feedback and transcripts, alongside the current `SKILL.md`, to a model and ask for changes that generalize instead of patching the specific case.

Caveat: this directory lives inside the skill, so an agent running a case can read the assertions if it goes looking. None of the prompts reward that, but keep the wording free of copy-pasteable answers.
