# Themes

Each file defines one palette plus its font stack as CSS custom properties. All templates and references style through these tokens, so any theme works with any template.

| Theme | File | Character |
|---|---|---|
| Entaina (default) | `entaina.css` | Official Entaina brand tokens. Light-only, three pillar variants via `data-theme`. |
| Midnight Editorial | `midnight-editorial.css` | Deep navy, serif, gold. Cinematic. Dark-first. |
| Warm Signal | `warm-signal.css` | Cream, bold sans, terracotta. Light-first. |
| Terminal Mono | `terminal-mono.css` | Dark, all-mono, green accents. Developer-native. Dark-first. |
| Swiss Clean | `swiss-clean.css` | White, geometric, single blue accent. Analytical. Light-first. |

## How to consume a theme

- **Self-contained HTML pages**: read the chosen file and inline its full contents into the page's `<style>` block. Pages cannot link external stylesheets. Include the Google Fonts `<link>` from the file's header comment and load every weight the CSS uses.
- **Slidev decks**: out of scope for these palettes — a Slidev deck is themed by the target project's own Slidev theme (FYI: the Entaina brand look for Slidev lives in the external `slidev-theme-entaina` package). See `../targets/deck-slidev/TARGET.md`.

## Choosing

Entaina is the default for work, client, and brand contexts. Pick another theme when the user names one, or when the content's domain clearly calls for it (see "Design judgment" in `SKILL.md`). The user's words always win.

### Entaina pillar variants — which pillar, when

The Entaina theme ships three grounds; pick by what the piece is **about**, not by aesthetics:

| Pillar | Ground | Use when the content… | Typical outputs |
|---|---|---|---|
| **Technology** (default, no attribute) | hoki blue | is technical or operational: systems, architecture, code, data, infrastructure — and whenever in doubt | diff/plan reviews, recaps, architecture pages, engineering decks |
| **Innovation** (`data-theme="innovation"`) | copperfield copper | proposes or explores the new: strategy, transformation, product vision, R&D, commercial proposals, roadmaps | pitch decks, AI-adoption proposals, kickoffs, visual plans of strategic scope |
| **People** (`data-theme="people"`) | golden gold | puts people at the center: training, talent, culture, onboarding, workshops, internal comms | training decks, onboarding guides, team retrospectives |

Rules:

- The user's words win; absent them, the review genres default to Technology.
- **One pillar per artifact** — the ground never changes mid-piece. Cross-pillar color is already built in: every variant keeps all three pillar colors as `--node-a/b/c` accents.
- Pillar is *identity*, status is *state*: the semantic colors (`--green/--red/--orange`) keep their meaning in every variant — never repurpose a pillar ground as a verdict.
- A piece that genuinely spans pillars (e.g. a training deck about architecture) follows its **audience's frame**: what the reader comes for decides (people, in that example).

Token contract: `--bg`, `--surface`, `--surface2`, `--surface-elevated`, `--border`, `--border-bright`, `--text`, `--text-dim`, `--accent`, `--accent-dim`, `--node-a/b/c` (+ `-dim`), `--green`, `--red`, `--orange` (+ `-dim`), `--code-bg`, `--code-text`, `--font-display`, `--font-body`, `--font-mono`. A new theme must define all of them.

The runtime theme picker in `references/themes.md` keeps its own palette list for pages where the reader switches themes live; that is a separate, opt-in feature.

## Per-theme deck treatment

Background and decoration direction when a theme drives a slide deck. Different decks with the same theme should still feel distinct — riff on these, don't stamp them.

- **Entaina**: soft radial accent washes per slide; dot-grid behind title slides; pillar colors (`--node-a/b/c`) for card accents.
- **Midnight Editorial**: radial gold glow at top center; decorative corner marks in gold; title slides in dramatic serif at max scale.
- **Warm Signal**: warm radial glow at bottom left; terracotta accent borders on cards; section divider numbers in ultra-light coral.
- **Terminal Mono**: faint dot grid; everything mono; title slides in large weight-400 mono instead of bold display; code slides feel native.
- **Swiss Clean**: clean white or near-black, no gradients; visible grid lines; tight geometric layouts; the single accent used sparingly. Data-heavy analytical content shines here.
