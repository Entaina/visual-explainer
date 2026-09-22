# visual-explainer

Entaina's Agent Skill for generating visual explanations: self-contained HTML pages (diagrams, architecture overviews, diff and plan reviews, recaps, comparison tables, slide decks) and Slidev decks as project source — with a storyboard as the intermediate plan, token-based themes, and a mechanical check on every deliverable.

The skill is a flat, portable directory (`skills/visual-explainer/`): markdown + assets + dependency-free Node scripts, with no harness APIs. This repository additionally wraps it as a Claude Code plugin, a Codex plugin, and a pi package.

It is a fork of [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer) — see [Credits](#credits).

## Installation by harness

### Claude Code

Through Entaina's marketplace:

```
/plugin marketplace add Entaina/claude-marketplace
/plugin install visual-explainer@entaina
```

Or straight from this repository (it is a valid plugin too): `/plugin install` with the repo URL.

### Claude Cowork

Add the `skills/visual-explainer/` folder as a skill from Cowork's skill settings (folder or zip upload).

### Codex

As a Codex plugin, with this repository acting as the marketplace:

```
codex plugin marketplace add Entaina/visual-explainer
codex plugin add visual-explainer@entaina
```

`codex plugin list` shows the status and `codex plugin remove visual-explainer@entaina` uninstalls it. To work off a clone, `codex plugin marketplace add /path/to/clone` does the same locally.

This is declared by the portable root manifest (`plugin.json`, [agent-plugins 1.0.0](https://agent-plugins.org/schemas/1.0.0/plugin.schema.json) schema) and the marketplace entry (`.agents/plugins/marketplace.json`). Codex exposes it as the skill `visual-explainer:visual-explainer`.

### pi

As a pi package, from npm:

```
pi install npm:@entaina/visual-explainer
```

Or from the repository, to track `main` instead of the published releases:

```
pi install git:github.com/Entaina/visual-explainer
```

`pi install` writes to user settings (`~/.pi/agent/settings.json`); `-l` installs into the project only (`.pi/settings.json`). A local path works as well (`pi install ./visual-explainer`), and `pi remove <source>` uninstalls.

The root `package.json` carries the `pi` manifest that declares the skill, so pi loads it as `visual-explainer` and exposes it as `/skill:visual-explainer [subcommand]` (for example `/skill:visual-explainer diff-review`). Without installing the package you can also add `skills/visual-explainer` to the `skills` array in settings, or pass it per run with `pi --skill skills/visual-explainer`.

### Other harnesses (AGENTS.md)

Copy `skills/visual-explainer/` into the repository (say, under `skills/`) and add the trigger to your `AGENTS.md`:

> For diagrams, visual reviews, recaps, comparison tables or slides, read `skills/visual-explainer/SKILL.md` and follow it.

Nothing else to integrate: everything resolves through file reads and the shell.

## Requirements

- Node.js ≥ 18 (delivery and check scripts; Slidev in deck projects).
- A browser to view the generated pages.
- Optional: `surf-cli` (generated images), `glimpseui` (native window).

## Layout

- `genres/` — content contracts per kind of output (diagram, diff-review, plan-review, recap, visual-plan, deck, fact-check).
- `targets/` — delivery: HTML page, HTML deck, Slidev deck (the last one themed by the destination project; the Entaina look for Slidev lives in [`slidev-theme-entaina`](https://github.com/Entaina/slidev-theme-entaina)).
- `themes/` — token-based palettes for pages and HTML decks, including the Entaina pillar variants.
- `references/` — storyboard (the intermediate representation), slide-type catalogue, evidence and review rules.
- `scripts/` — `render.mjs` (delivery), `check_artifact.mjs` and `check_themes.mjs` (verification), with tests (`node --test scripts/`).
- `evals/` — evaluation cases in the [Agent Skills format](https://agentskills.io/skill-creation/evaluating-skills): `evals.json` with prompts and assertions, fixtures under `files/`, and the method to run them in its README.
- Installation manifests: `.claude-plugin/plugin.json` (Claude Code), `plugin.json` + `.agents/plugins/marketplace.json` (Codex), and `package.json` with the `pi` key (pi).

## Releases

Versioning is automated with [release-please](https://github.com/googleapis/release-please) from [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). A `feat:` or `fix:` commit on `main` opens a release pull request carrying the CHANGELOG and the version bump across all four manifests (`package.json`, `plugin.json`, `.claude-plugin/plugin.json`, and the `version` line in `SKILL.md`); merging it publishes the tag, the GitHub release, and the npm package.

## Credits

Derivative work of [**nicobailon/visual-explainer**](https://github.com/nicobailon/visual-explainer), by Nico Bailon: the idea of the skill, its repertoire of visual genres (diagrams, diff and plan reviews, recaps, decks, fact-check) and the base this version was written on all come from there. Thanks for publishing it under MIT.

This version is rewritten and maintained by Entaina: reorganized around the three axes genre × target × theme, with the storyboard introduced as the intermediate plan between content and format, token-based themes added (including the Entaina pillar variants) along with the Slidev target, and verification replaced by dependency-free Node scripts plus an eval suite. The packaging and per-harness installation differences are ours too.

The original copyright notice (© 2025 Nico Bailon) is preserved in [`LICENSE`](LICENSE) and [`skills/visual-explainer/LICENSE`](skills/visual-explainer/LICENSE).

## License

MIT, like the original project.
