---
name: datamagic-video
description: >-
  Renderer-agnostic methodology for turning tabular data into narrated, animated data videos
  (DVSpec planning + a reference rendering path). Use whenever the task involves
  turning tabular data (CSV/Excel/structured table) into a narrated, animated data video:
  profiling data, choosing a narrative pattern, planning scenes, selecting chart types,
  authoring a DVSpec plan, writing narration, compiling the plan to a video (Remotion shown as
  the reference path), adding voiceover, or refining a result. Also trigger on: "data video", "data story",
  "animated chart", "narrated visualization", "DVSpec", "data storytelling", or any request
  to turn structured data into a video.
metadata:
  tags: datamagic, data-video, dvspec, remotion, data-visualization, narration, animation, storytelling
---

# DataMagic Data Video — read this first

This skill turns **raw tabular data into a narrated, animated data video**. Its core artifact is
a **DVSpec** — a *renderer-agnostic* plan for the whole video (scenes, data bindings, narration,
animation). DVSpec is compiled into a real video by a rendering stack, and it is **not tied to
any single one**: the chart layer can be Vega-Lite / ECharts / D3, the animation layer can be
GSAP / Anime.js / Remotion.

## What this skill is

- A **renderer-agnostic methodology** for data videos: profiling data, choosing a narrative
  pattern, selecting charts, writing narration, timing animation, and authoring a DVSpec. This
  is the heart of the skill and applies no matter how you render.
- A **worked reference rendering path using Remotion** (`remotion-integration.md` + `voiceover.md`),
  shown because code-first composition is the most natural fit for coding agents. Swap in another
  stack and the planning rules don't change — only the rendering API does.

```
DVSpec  (renderer-agnostic plan — the core artifact)
   │  compile with any stack:
   │    charts:    Vega-Lite · ECharts · D3 · custom
   │    animation: Remotion · GSAP · Anime.js
   ▼
Narrated, animated video
```

For generic Remotion mechanics (`interpolate`, `spring`, `Audio`, `calculateMetadata`, …), defer
to the `remotion-best-practices` skill. You do **not** need DataMagic's hosted product to use this
skill — it shares the same DVSpec format; the hosted product just adds premium templates and the
full multi-agent pipeline.

## Capability map

| You want to… | Go to |
|---|---|
| Understand the data before planning | `rules/data-analysis.md` |
| Choose a narrative pattern and plan scenes | `rules/scene-planning.md` |
| Pick the right chart type | `rules/chart-selection.md` |
| Write a DVSpec plan (the "screenplay") | `rules/dvspec.md` |
| Choose colors, type, spacing, motion tokens | `rules/design-system.md` |
| Render the plan to video (reference path: Remotion) | `rules/remotion-integration.md` |
| Add voiceover and narration-driven timing | `rules/voiceover.md` |
| Write narration scripts | `rules/narration.md` |
| Edit or refine a result | `rules/refinement.md` |
| **Self-check before declaring done** | `rules/self-review.md` |
| Diagnose a poor output | `rules/anti-patterns.md` |

## What this skill handles

- Tabular data (CSV, Excel, structured table) → multi-scene narrated animated video
- Single-chart animated visualization from pasted or uploaded data
- DVSpec planning, narration writing, and Remotion composition authoring
- Free or BYO-key voiceover with timing derived from the audio

## What this skill does not cover

- Editing existing raw video footage (trimming, recoloring, reframing)
- Generating video from unstructured text with no data table
- Live / real-time data dashboards

---

## Pipeline

```
Raw data (CSV/Excel)
    ↓  data-analysis.md
Data profiling — field types, candidate insights
    ↓  scene-planning.md
Narrative pattern + scene plan
    ↓  chart-selection.md + dvspec.md
DVSpec plan — data bindings, narration segments, animation triggers
    ↓  remotion-integration.md
Remotion composition — one component per scene
    ↓  voiceover.md
TTS audio + calculateMetadata → duration derived from audio (no manual frame-counting)
    ↓
Render with Remotion → MP4 you can watch
    ↓  self-review.md   ← MANDATORY: walk the checklist, watch it once, fix what fails
Self-review
    ↓  refinement.md
Refine
```

**Always run `self-review.md` before telling the user it's done.** Compiling is not finishing — the review pass is what closes the gap between "technically correct" and "actually good."

**Plan before you render.** Author the DVSpec plan first (it is the portable "screenplay"),
then map it to Remotion. Narration is written *globally* after scene order is fixed, so each
sentence can reference adjacent scenes and form a continuous arc.

---

## Routing guide

**Full video from data, standalone (Remotion):**
→ `data-analysis.md` → `scene-planning.md` → `chart-selection.md` → `dvspec.md`
  → `design-system.md` → `remotion-integration.md` → `voiceover.md` → `narration.md`

**Single chart:**
→ `data-analysis.md` → `chart-selection.md` → `dvspec.md` → `design-system.md` → `remotion-integration.md`

**Just plan / produce a DVSpec (no render):**
→ `data-analysis.md` → `scene-planning.md` → `chart-selection.md` → `dvspec.md`

**Editing an existing result:**
→ `refinement.md`

**Output looks wrong:**
→ `anti-patterns.md`

---

## Narrative patterns — quick reference

The narrative pattern is chosen from the shape of the data story, not the topic.

| Pattern | Use when | Climax position |
|---|---|---|
| `freytag_default` | One main finding to build toward | Middle-to-late (60–75%) |
| `hook_then_evidence` | One striking number should come first | First chart scene IS the climax |
| `comparison_driven` | Story is fundamentally A vs B | Scene with the largest contrast |
| `time_driven` | Chronological order is the spine | Scene with the most dramatic shift |
| `drill_down` | Total → segments → why (root-cause) | Deepest zoom-in scene |

See `rules/scene-planning.md` for the full decision guide and examples.
