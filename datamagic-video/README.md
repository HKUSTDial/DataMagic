# datamagic-video — a data-video skill for AI coding agents

A **skill** that teaches AI coding agents (Claude Code, Cursor, Codex, …) how to turn a
**table of data into a narrated, animated data video** — the right narrative structure, the
right chart, narration that leads the eye, and animation timed to the voiceover.

At its core is a **DVSpec** — a *renderer-agnostic* plan for the video. It compiles with open
tooling (Vega-Lite / ECharts / D3 for charts, Remotion / GSAP / Anime.js for animation), so
anyone can generate and watch the result — no DataMagic account required. The skill ships a
worked **reference path using Remotion**; the methodology itself is independent of any renderer.

> This skill distills the methodology behind [DataMagic](https://github.com/HKUSTDial/DataMagic)
> (VLDB 2026 Demo). The hosted DataMagic product adds premium templates and a full multi-agent
> pipeline; this skill helps any agent produce strong data videos on its own, and shares the
> same DVSpec format.

## What it does

Given a CSV/Excel table and a goal, the skill guides the agent through:

1. **Profile the data** — field types, candidate insights
2. **Plan the story** — pick a narrative pattern, lay out scenes
3. **Choose charts** — match chart type to data shape
4. **Author a DVSpec** — a portable, renderer-agnostic JSON "screenplay" of the video
5. **Render it** — compile the DVSpec to a video (the skill's reference path uses Remotion)
6. **Add voiceover** — free TTS, with scene duration derived from the audio
7. **Self-review** — a checklist the agent runs before declaring it done

## Install

The skill is a single folder (`SKILL.md` + `rules/`). Drop it where your agent looks for skills.

**Claude Code** — copy into your skills directory:

```bash
git clone https://github.com/HKUSTDial/DataMagic
cp -r DataMagic/datamagic-video ~/.claude/skills/datamagic-video
```

(or place it in a project-local `.claude/skills/` folder)

**Cursor / Codex / other agents** — point the agent at this folder, or copy `SKILL.md` and
`rules/` into the location your tool reads instructions from. The content is plain Markdown
and tool-agnostic.

## Use

Once installed, just ask in natural language:

> "Make a narrated data video from this CSV: <paste your data or path>"

The agent reads `SKILL.md` (the router), follows the pipeline, and produces a DVSpec plan and
a Remotion project. To get audio + a rendered MP4, you'll need Node.js (for Remotion) and
Python with `edge-tts` (free voiceover) — the skill explains the steps.

## What's inside

| File | Purpose |
|---|---|
| `SKILL.md` | Entry point / router — read first |
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

## License & citation

If you use this in research or work, please cite DataMagic — see the
[main repository](https://github.com/HKUSTDial/DataMagic) for the BibTeX entry.
