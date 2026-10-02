# Chart Focus Push

[中文](../ChartFocusPush.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`ChartFocusPush`

## Purpose

Establish the full trend, then slowly push toward an anomaly without changing the chart geometry.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/chart-focus-push/ChartFocusPush.tsx`
- Schema：`templates/chart-focus-push/schema.json`
- Sample data：`templates/chart-focus-push/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

- Native implementation: `templates/chart-focus-push/ChartFocusPush.tsx`
- Camera utility: `src/camera/chartCamera.ts`

## Use cases

Use when one anomaly, inflection point, or KPI deserves closer attention after the
viewer has seen the whole trend.

## Data contract

- `labels` and `values` must have equal length.
- `anomalyIndex` identifies an existing value and must not alter chart geometry.
- `insight` must explain why the focused value matters.
- Keep a visible source, and clearly mark synthetic or demonstration data.

## Camera contract

- Establish the complete chart before moving the camera.
- Use `slow_focus_push` for explanatory scenes; reserve `crash_focus` for rare,
  high-emphasis beats.
- Keep titles, conclusions, and sources outside the transformed chart stage.
- Drive every transform from the Remotion frame. Do not use CSS transitions.
- Hold the final framing long enough for the annotation to be read.

## Integration

Pass `useCurrentFrame()`, `fps`, `durationInFrames`, the chart-stage dimensions,
and the focused data coordinate into `calculateChartCamera()`. Apply the returned
`scale`, `x`, `y`, and `origin` to the chart layer only.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-ChartFocusPush out/ChartFocusPush.mp4 --props=templates/chart-focus-push/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
