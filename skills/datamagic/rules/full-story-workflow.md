# 从数据策划完整视频 / Plan a complete video from data

Use this route when the user wants to discover findings from a table, author a custom multi-scene video, create a DVSpec plan, or refine an existing DVSpec. It extends recipe-based production with data analysis, scripting and narration.

本流程保留 DataMagic 原有的数据分析与完整视频策划能力。按用户的问题提炼发现、安排故事、选用配方或自定义场景，再按需配旁白、渲染和检查。

## Establish the story

Read [data-analysis.md](data-analysis.md) to inspect columns, units, missing values and candidate findings. Use the user's question and audience to choose a main point supported by the data.

Read [scene-planning.md](scene-planning.md) for a suitable structure:

| Pattern | Useful when |
|---|---|
| Hook then evidence | One striking result leads the story |
| Comparison | The question centers on differences between entities |
| Time-driven | The order of changes explains the finding |
| Drill-down | A total can be explained through its components |
| Build toward a finding | Context and evidence lead to one main conclusion |

Apply the planning guidance to the requested duration. A short composed clip may carry its hook and conclusion inside existing recipes; a custom full video can use explicit opening and closing scenes.

## Select and compose the visuals

Use [chart-selection.md](chart-selection.md) to match visual forms to the actual data. Inspect the library through [cards-workflow.md](cards-workflow.md), reuse suitable implementations, and create custom components where the requested scene needs them. Use [design-system.md](design-system.md) and a relevant [style guide](styles/README.md) to keep typography, colors, layouts and motion coherent.

For a custom multi-scene plan, read [dvspec.md](dvspec.md). Record scene order, data bindings, content, durations and animation targets. For a DVSpec-only request, deliver the plan and its data mapping. For an existing DVSpec, preserve its structure and change the requested elements.

## Narrate, render and review

When narration is requested, read [narration.md](narration.md) to write the script, then [voiceover.md](voiceover.md) for the configured audio workflow. Measure the produced audio and use those durations to finalize scenes and visual emphasis.

Use [remotion-integration.md](remotion-integration.md) for the bundled rendering path, or honor another renderer the user selected. Render the composition and review the result with [self-review.md](self-review.md): data accuracy, label and chart consistency, layout, motion, and audio synchronization where applicable.

Deliver the editable plan, source and props, media provenance, MP4 and render instructions. Keep the scope aligned with the user's request for a recommendation, plan, single chart, or complete video.
