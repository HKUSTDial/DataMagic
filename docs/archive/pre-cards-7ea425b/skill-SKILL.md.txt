---
name: datamagic-video
description: Use when a task involves tabular data (CSV, Excel, database result, structured table) becoming a narrated data video, animated chart, data story, DVSpec, visualization storyboard, voiceover-timed chart sequence, Remotion data-video render, or refinement of an existing data-video result.
metadata:
  tags: datamagic, data-video, dvspec, remotion, data-visualization, narration, animation, storytelling
---

# DataMagic Video

Turn tabular data into a narrated, animated data video. Core artifact: **DVSpec**, a renderer-agnostic screenplay for scenes, data bindings, narration, and animation. Render with any stack; Remotion is reference path.

## Use

- CSV / Excel / structured table -> multi-scene narrated video
- Pasted data -> animated chart or short data story
- Existing DVSpec / render -> refine, debug, or improve
- Goal only, no render requested -> produce DVSpec plan

Do not use for raw video editing, non-data text-to-video, or live dashboards.

## Core Rules

- Plan first. DVSpec before render.
- Data leads story. Pick narrative pattern from data shape, not topic.
- Narration leads viewer eye. Animation follows narration timing.
- Read only needed rule files. Heavy details live under `rules/`.
- Before calling work done: run `rules/self-review.md`.

## Router

| Task | Read |
|---|---|
| Profile data, find candidate insights | `rules/data-analysis.md` |
| Choose narrative pattern, scenes | `rules/scene-planning.md` |
| Pick chart type, axes, scales | `rules/chart-selection.md` |
| Author or validate DVSpec | `rules/dvspec.md` |
| Choose visual system, tokens, motion defaults | `rules/design-system.md` |
| Pick style pack | `rules/styles/README.md` |
| Render DVSpec to video with Remotion | `rules/remotion-integration.md` |
| Add TTS, audio-driven duration, subtitles | `rules/voiceover.md` |
| Write narration script | `rules/narration.md` |
| Refine existing output | `rules/refinement.md` |
| Diagnose bad output | `rules/anti-patterns.md` |
| Final quality gate | `rules/self-review.md` |

## Workflows

Full video:

`data-analysis` -> `scene-planning` -> `chart-selection` -> `dvspec` -> `design-system` -> `styles` -> `remotion-integration` -> `voiceover` -> `narration` -> `self-review`

DVSpec only:

`data-analysis` -> `scene-planning` -> `chart-selection` -> `dvspec`

Single animated chart:

`data-analysis` -> `chart-selection` -> `dvspec` -> `design-system` -> `remotion-integration`

Refinement:

`refinement` -> changed domain rule(s) -> `self-review`

## Narrative Patterns

| Pattern | Use when | Climax |
|---|---|---|
| `freytag_default` | One main finding builds over time | 60-75% |
| `hook_then_evidence` | One striking number should open | first chart scene |
| `comparison_driven` | A vs B is story spine | largest contrast |
| `time_driven` | chronological change drives story | sharpest shift |
| `drill_down` | total -> segment -> cause | deepest zoom |

See `rules/scene-planning.md` before locking pattern.
