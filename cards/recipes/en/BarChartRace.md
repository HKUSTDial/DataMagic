# Bar Chart Race

[中文](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/BarChartRace.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`BarChartRace`

## Purpose

A continuous race for multi-entity time series with value interpolation, rank transitions, entry and exit, and stable entity colors.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/bar-chart-race/BarChartRace.tsx`
- Schema：`templates/bar-chart-race/schema.json`
- Sample data：`templates/bar-chart-race/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

## Use cases

Use for 5–15 entities observed over multiple ordered time points when the story is about leadership, overtaking, entry, exit, or changing rank.

Do not use when exact comparison across every time point is more important than movement. In that case, prefer small multiples or a line chart.

## Data contract

The template consumes stable entity definitions and ordered snapshots. Values, labels, colors, ranks, and bar geometry remain programmatic and editable. See:

```text
templates/bar-chart-race/schema.json
templates/bar-chart-race/sample-data.json
```

### Entity logos and icons

An entity may include `iconSrc`, a local file path relative to `public/` (SVG, PNG or another supported image format). The image stays attached to that entity's stable `id` as the ranking changes. Keep the text label for readability. Entities without an image retain the original color marker.


Optional `highlightId` emphasizes one entity, slightly fading other bars while preserving their distinct colors. The coffee example supplies six independently drawn SVG icons in `public/icons/coffee/` and shows a purple latte highlight.

## Animation contract

- Interpolate values between adjacent snapshots.
- Interpolate rank positions rather than jumping after a sort.
- Keep entity colors stable across all frames.
- Fade entities near the Top-N boundary without changing their identity.
- Hold the final snapshot long enough to read.
- Drive every animation from the Remotion frame; do not use CSS animation.

## Review constraints

- Verify first and final values against the input.
- Test ties, missing values, entering entities, and extreme values.
- Check labels and values at every rank crossing.
- Mark synthetic demo data explicitly.
- Display a source on the rendered frame.

## Native implementation

```text
templates/bar-chart-race/BarChartRace.tsx
templates/bar-chart-race/model.js
```

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-BarChartRace out/BarChartRace.mp4 --props=templates/bar-chart-race/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
