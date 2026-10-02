# Narrative Before After

[中文](../NarrativeBeforeAfter.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`NarrativeBeforeAfter`

## Purpose

Two-panel card with BEFORE and AFTER states: time label, key metric, and context line per panel. Muted top bar for before, bright accent for after. Use when a policy, event, or trend created a clear break point.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`src/legacy/components/runtime_style_templates/text/RuntimeNarrativeBeforeAfter.tsx`
- Schema：`templates/runtime-cards/NarrativeBeforeAfter/schema.json`
- Sample data：`templates/runtime-cards/NarrativeBeforeAfter/sample-data.json`
- Render entry：`src/runtime/RuntimeCard.tsx`
- Component export：`RuntimeNarrativeBeforeAfter`

## Data and authoring constraints

Replace `sceneContent.data` and matching `sceneContent.template_payload` fields together. Text scenes use titles, copy, bullets and their payload fields. Update targets in `scene.animations` when changing labels. Follow the supported component data shape and keep values and text programmatic.

- Data contract：`before and after points`
- Entrance strategy：`before-after reveal`
- Emphasis strategy：`side emphasis`
- Sample trigger：`after`
- Highlight targets：`before, after`

Update labels, triggers and commentary with the data; do not retain mismatched sample narration. The default render is 1280×720, 30fps, 180 frames (6 seconds); gallery media may be a separate higher-resolution output.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts RuntimeTemplatePreview-NarrativeBeforeAfter out/NarrativeBeforeAfter.mp4 --props=templates/runtime-cards/NarrativeBeforeAfter/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
