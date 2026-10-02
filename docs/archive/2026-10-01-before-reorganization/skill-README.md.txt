# datamagic-video — a data-video skill for AI coding agents

A **skill** for turning tables into animated charts and data stories. It connects agents to
[DataMagic Cards](../../cards/README.en.md): find a recipe, inspect its preview, read its
schema and editable source, replace the data, render, and check the result.

At its core is a **DVSpec** — a *renderer-agnostic* plan for the video. It compiles with open
tooling (Vega-Lite / ECharts / D3 for charts, Remotion / GSAP / Anime.js for animation), so
anyone can generate and watch the result — no DataMagic account required. The skill ships a
worked **reference path using Remotion**; the methodology itself is independent of any renderer.

> This skill distills the methodology behind [DataMagic](https://github.com/HKUSTDial/DataMagic)
> ([IEEE VIS 2026 paper](https://arxiv.org/abs/2609.33403) and VLDB 2026 Demo).
> Explore editable examples in Cards and use this Skill to adapt them to your data.

## Start with Cards

For a local, inspectable setup, clone the repository and keep `cards/` beside `skills/`.
From the repository root:

```bash
node skills/datamagic-video/scripts/cards.cjs list --native --query ranking
node skills/datamagic-video/scripts/cards.cjs inspect RankedReveal
```

Ask your agent:

> "Use the datamagic-video Skill and RankedReveal card with this CSV. Save new props
> and a silent MP4 in my output folder. Check the values and opening, middle and final frames."

The helper returns absolute paths, independent of the current directory. If you copied only
the Skill, supply `--cards /path/to/DataMagic/cards`; the Skill alone does not contain the
companion templates or previews. All 139 cards include executable source, schemas and
sample props; inspect returns the corresponding render Composition ID.

## What it does

For native template reuse, a data mapping and beat plan are sufficient. For a custom
multi-scene story, the Skill guides the agent through:

1. **Profile the data** — field types, candidate insights
2. **Plan the story** — pick a narrative pattern, lay out scenes
3. **Choose charts** — match chart type to data shape
4. **Author a DVSpec** — a portable, renderer-agnostic JSON "screenplay" of the video
5. **Render it** — compile the DVSpec to a video (the skill's reference path uses Remotion)
6. **Add voiceover when requested** — select a TTS option, with scene duration derived from the audio
7. **Self-review** — a checklist the agent runs before declaring it done

## Install

Source repo: <https://github.com/HKUSTDial/DataMagic>

### Claude Code plugin

```text
claude plugin marketplace add HKUSTDial/DataMagic
claude plugin install datamagic-video@datamagic
```

### Codex plugin

```bash
codex plugin marketplace add HKUSTDial/DataMagic
codex plugin add datamagic-video@datamagic
```

### One-line shell install

```bash
curl -fsSL https://raw.githubusercontent.com/HKUSTDial/DataMagic/main/install.sh | bash
```

Install only one agent:

```bash
curl -fsSL https://raw.githubusercontent.com/HKUSTDial/DataMagic/main/install.sh | bash -s -- --only claude
curl -fsSL https://raw.githubusercontent.com/HKUSTDial/DataMagic/main/install.sh | bash -s -- --only codex
```

## Use

Once installed, just ask in natural language:

> "Make a narrated data video from this CSV: <paste your data or path>"

The agent reads `SKILL.md` and selects native-card adaptation, a custom chart, or a
multi-scene story. Rendering the bundled templates requires Node.js 20+ and `npm ci` in
`cards/`. Voiceover is optional and requires a separately configured TTS path; templates
do not generate talking presenters or video footage.

## What's inside

| File | Purpose |
|---|---|
| `SKILL.md` | Entry point / router — read first |
| `rules/cards-workflow.md` | Recipe selection, source adaptation, rendering and QA |
| `scripts/cards.cjs` | Locate companion Cards and resolve actual public resources |
| `rules/data-analysis.md` | Profiling tabular data into candidate insights |
| `rules/scene-planning.md` | The 5 narrative patterns and scene layout |
| `rules/chart-selection.md` | Choosing the right chart for the data shape |
| `rules/dvspec.md` | The DVSpec format (the planning "screenplay") |
| `rules/design-system.md` | Color, type, spacing, motion, subtitle safe zone, anti-clutter |
| `rules/remotion-integration.md` | Rendering a DVSpec to video (reference path: Remotion) |
| `rules/voiceover.md` | Free/BYO-key TTS + narration-driven timing |
| `rules/narration.md` | Writing narration scripts and subtitles |
| `rules/refinement.md` | Editing an existing result |
| `rules/self-review.md` | The pre-finish quality checklist |
| `rules/anti-patterns.md` | Common mistakes and how to avoid them |

## Relationship to DataMagic

- **This skill** → plan a data video and render it anywhere with open tooling (Remotion shown as the reference path). Great standalone.
- **[DataMagic hosted](https://datamagic.chat/)** → upload data, get a premium video with
  refined templates and the full pipeline. No setup.

The DVSpec format is the bridge: the same plan this skill authors is what DataMagic renders at
full fidelity.

## Status

This is an **early release**. Native reuse and custom generation have different requirements;
check the selected recipe and report any untested audio or playback checks. Issues and suggestions are welcome on the
[main repository](https://github.com/HKUSTDial/DataMagic).

## License & citation

If you use this in research or work, please cite DataMagic — see the
[main repository](https://github.com/HKUSTDial/DataMagic) for the BibTeX entry.
