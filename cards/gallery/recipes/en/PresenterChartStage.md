# Presenter Chart Stage

[中文](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/PresenterChartStage.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`PresenterChartStage`

## Purpose

Coordinate a programmatic presenter silhouette with an editable chart and narrative beats.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/presenter-chart-stage/PresenterChartStage.tsx`
- Schema：`templates/presenter-chart-stage/schema.json`
- Sample data：`templates/presenter-chart-stage/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

- Native implementation: `templates/presenter-chart-stage/PresenterChartStage.tsx`

## Files

- `templates/presenter-chart-stage/schema.json`
- `templates/presenter-chart-stage/sample-data.json`
- `templates/presenter-chart-stage/PresenterChartStage.tsx`

## Additional authoring constraints

presenterSide is left or right; place the chart on the opposite side without mirroring text. activeBeat identifies an existing chartData entry; each entry contains label, value and context. takeaway explains the beat rather than repeating its number, and source labels demonstration data. The sample presenter is a programmatic silhouette, replaceable with keyed or segmented media. Keep the presenter, nameplate, labels, title and source within the 64px safe area; use Noto Sans SC and a 1920×1080 canvas. Establish at 0–1.6s, reveal bars at 1.2–3.0s, gesture/highlight at 2.1–4.4s, show the conclusion at 4.8–5.7s, and keep everything static at 7.0–8.0s. All motion is frame-driven.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-PresenterChartStage out/PresenterChartStage.mp4 --props=templates/presenter-chart-stage/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
