# Dark Compact Scatter Panel

[中文](../DarkCompactScatterPanel.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`DarkCompactScatterPanel`

## Purpose

Dark compact scatter panel for 4-7 named entities on two numeric dimensions with direct labels.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`src/legacy/components/runtime_style_templates/scatter_chart/RuntimeDarkCompactScatterPanel.tsx`
- Schema：`templates/runtime-cards/DarkCompactScatterPanel/schema.json`
- Sample data：`templates/runtime-cards/DarkCompactScatterPanel/sample-data.json`
- Render entry：`src/runtime/RuntimeCard.tsx`
- Component export：`DarkCompactScatterPanelDemo`

## Data and authoring constraints

Replace `sceneContent.data` and matching `sceneContent.template_payload` fields together. Text scenes use titles, copy, bullets and their payload fields. Update targets in `scene.animations` when changing labels. Follow the supported component data shape and keep values and text programmatic.

- Data contract：`x/y scatter items`
- Entrance strategy：`point reveal`
- Emphasis strategy：`compact point highlight`
- Sample trigger：`Enterprise`
- Highlight targets：`point, label`

Update labels, triggers and commentary with the data; do not retain mismatched sample narration. The default render is 1280×720, 30fps, 180 frames (6 seconds); gallery media may be a separate higher-resolution output.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts RuntimeTemplatePreview-DarkCompactScatterPanel out/DarkCompactScatterPanel.mp4 --props=templates/runtime-cards/DarkCompactScatterPanel/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
