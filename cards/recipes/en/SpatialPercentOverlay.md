# Contextual Percent Overlay

[中文](../SpatialPercentOverlay.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`SpatialPercentOverlay`

## Purpose

Place an editable percentage vessel, labels, and source in contextual negative space while preserving focal clearance and readability.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/spatial-percent-overlay/SpatialPercentOverlay.tsx`
- Schema：`templates/spatial-percent-overlay/schema.json`
- Sample data：`templates/spatial-percent-overlay/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

## Use cases

Use when one percentage describes a visible place, industry, object, or region.
The background establishes context; the programmatic overlay carries the exact
metric.

Do not use it for unrelated stock footage or for comparing more than two values.
When the story is a ranking, use a race or ranking recipe instead.

## Data and asset contract

```text
templates/spatial-percent-overlay/schema.json
templates/spatial-percent-overlay/sample-data.json
public/assets/editorial/semiconductor-cleanroom.png
```

- `value` must be between 0 and 100.
- `backgroundSrc` supplies context only. It must not contain baked-in data text.
- Exact values, labels, liquid geometry, and source remain editable.

## Animation contract

- Establish the context before the metric finishes animating.
- Place the percentage vessel in stable negative space without drawing a
  decorative subject-to-callout connector.
- Keep the background push subtle so the reading region remains visually stable.
- Hold the final value for at least 1.5 seconds.
- Drive all motion from Remotion frames; do not use CSS animations.

## Review constraints

- Verify that the label, displayed value, liquid level, and source agree.
- Check that the callout does not cover the supplied focal/face region.
- Confirm sufficient contrast over the background at the first and final frames.
- Mark demo data and generated background assets explicitly.

## Native implementation

```text
templates/spatial-percent-overlay/SpatialPercentOverlay.tsx
```

## Entity imagery

- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-SpatialPercentOverlay out/SpatialPercentOverlay.mp4 --props=templates/spatial-percent-overlay/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
