---
name: datamagic
description: Find, adapt, and render DataMagic recipes for animated charts and data stories. Use when a user selects a gallery example, wants an effect made with their own data or media, needs recipe recommendations, wants to combine shots into a story, or refines an existing data-video result.
metadata:
  tags: datamagic, data-video, recipes, visualization, remotion, narration, storytelling
---

# DataMagic: create with recipes

Help the user turn a chosen effect or a story goal into an editable video using the DataMagic recipe library. The gallery previews, recipe documents, template source, sample props, and this Skill form one workflow.

## Choose the route

| User's starting point | Action |
|---|---|
| A selected card, gallery link, slug, or copied implementation instructions | Read that recipe and adapt its source. Preserve the visual structure and reveal rhythm unless the user asks to redesign them. |
| Data and a goal, but no selected effect | Inspect the data shape, search the library, and explain suitable candidates. If asked to recommend, return recommendations; if asked to make a video, choose the best fit and proceed. |
| A story spanning several shots | Choose a narrative structure, match recipes to its beats, and compose them with consistent styling and timing. |
| An existing output to improve | Inspect its props, source, and render; apply the requested change and review the affected frames. |

Read [cards-workflow.md](rules/cards-workflow.md) for recipe discovery, adaptation, rendering, and review.

## Locate the recipe

Use the bundled helper from any working directory:

```bash
node <skill-directory>/scripts/cards.cjs list --query ranking
node <skill-directory>/scripts/cards.cjs inspect RankedReveal
```

The helper resolves the companion `cards/` directory and returns absolute paths plus the render Composition ID. All 139 cards include source, schemas and sample props. Search all cards by default; `--native` narrows to the advanced subset when useful.

For a separately installed Skill, pass `--cards /path/to/DataMagic/cards`. If the companion package is missing, use an available local checkout or help obtain the requested repository before referring to its files. Honor the user's rendering environment and dependency-installation preferences.

## Adapt and deliver

- Read the chosen recipe, source, shared imports, schema, sample props and preview before adapting it.
- Map the user's data to the actual input fields. Keep values, units, labels, ordering, display strings and claims consistent with that data.
- Preserve the selected effect's layout and animation characteristics. Apply requested changes to text, color, media, timing or aspect ratio; portrait output needs an appropriate layout.
- Save new props and custom source in the user's output location. Keep reusable library samples intact unless the user asks to update them.
- Render and inspect opening, active reveal and ending frames. Check numeric accuracy, clipping, collisions and legibility. Deliver the MP4, editable files and reproducible render command.
- Use [self-review.md](rules/self-review.md) for the actual task; apply audio-specific checks when audio is present.

For a single template, data mapping and a short timing plan are sufficient. For a multi-shot story, read the relevant blueprint in `cards/gallery/api/story-blueprints.json` and [scene-planning.md](rules/scene-planning.md), then compose compatible shots. Retain each template's source clock when trimming or sequencing it.

## Add deeper authoring as needed

When the user wants analysis-led authoring, a custom long-form story, an existing DVSpec edit, or a DVSpec-only plan, read [full-story-workflow.md](rules/full-story-workflow.md). It preserves the data-analysis, narration and DVSpec workflow for these tasks.

| Need | Read |
|---|---|
| Understand columns, units or candidate findings | [data-analysis.md](rules/data-analysis.md) |
| Match chart form to data | [chart-selection.md](rules/chart-selection.md) |
| Organize story beats | [scene-planning.md](rules/scene-planning.md) |
| Unify colors, typography and motion | [design-system.md](rules/design-system.md) |
| Add narration or subtitles | [narration.md](rules/narration.md), then [voiceover.md](rules/voiceover.md) |
| Refine or troubleshoot a result | [refinement.md](rules/refinement.md), [anti-patterns.md](rules/anti-patterns.md) |

Add voiceover when requested, align visual emphasis to measured audio, and preserve user-supplied media and provenance. If the user explicitly asks about the experimental workbench or Jianying delivery, read [workbench-delivery.md](rules/workbench-delivery.md); that work is currently a TODO and is separate from the default render workflow.
