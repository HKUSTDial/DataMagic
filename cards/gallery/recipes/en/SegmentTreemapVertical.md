# Segment Treemap Vertical

[中文](../SegmentTreemapVertical.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`SegmentTreemapVertical`

## Purpose

Vertical stack of full-width bands for 7-12 share segments.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`src/legacy/components/runtime_style_templates/pie_chart/RuntimeSegmentTreemapVertical.tsx`
- Schema：`templates/runtime-cards/SegmentTreemapVertical/schema.json`
- Sample data：`templates/runtime-cards/SegmentTreemapVertical/sample-data.json`
- Render entry：`src/runtime/RuntimeCard.tsx`
- Component export：`SegmentTreemapVerticalDemo`

## Data and authoring constraints

Replace `sceneContent.data` and matching `sceneContent.template_payload` fields together. Text scenes use titles, copy, bullets and their payload fields. Update targets in `scene.animations` when changing labels. Follow the supported component data shape and keep values and text programmatic.

- Data contract：`positive share items`
- Entrance strategy：`segment reveal`
- Emphasis strategy：`segment focus highlight`
- Sample trigger：`Mobile App`
- Highlight targets：`segment, legend, value`

Update labels, triggers and commentary with the data; do not retain mismatched sample narration. The default render is 1280×720, 30fps, 180 frames (6 seconds); gallery media may be a separate higher-resolution output.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts RuntimeTemplatePreview-SegmentTreemapVertical out/SegmentTreemapVertical.mp4 --props=templates/runtime-cards/SegmentTreemapVertical/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
