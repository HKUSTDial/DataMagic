# Negative Space Chart Dock

[中文](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/NegativeSpaceChartDock.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`NegativeSpaceChartDock`

## Purpose

Resolve a chart dock from focal and safe regions without covering the contextual subject.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/negative-space-chart-dock/NegativeSpaceChartDock.tsx`
- Schema：`templates/negative-space-chart-dock/schema.json`
- Sample data：`templates/negative-space-chart-dock/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

- Native implementation: `templates/negative-space-chart-dock/NegativeSpaceChartDock.tsx`

## Files

`templates/negative-space-chart-dock/schema.json`  
`templates/negative-space-chart-dock/sample-data.json`  
`templates/negative-space-chart-dock/layout.mjs`

## Additional authoring constraints

focalBox protects the subject and safeRegion proposes chart placement, in 1920×1080 pixels. Clip to a 64px safe area and reserve a 36px subject gap. If the proposal collides, choose the largest legal left/right/top/bottom region; fail if none exists. A usable region needs at least 500×400. Keep metricValue, unit, series, callout and source structured. The 8-second, 30fps motion ends by 6.5s for a 1.5s static hold. Camera movement must not transform titles, sources, data panels or protection-box coordinates.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-NegativeSpaceChartDock out/NegativeSpaceChartDock.mp4 --props=templates/negative-space-chart-dock/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
