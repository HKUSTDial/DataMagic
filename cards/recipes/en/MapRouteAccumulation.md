# Map Route Accumulation

[中文](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/MapRouteAccumulation.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`MapRouteAccumulation`

## Purpose

Draw geographic great-circle routes in narrative order while accumulating structured values for trade, migration, or supply-chain stories.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/map-route-accumulation/MapRouteAccumulation.tsx`
- Schema：`templates/map-route-accumulation/schema.json`
- Sample data：`templates/map-route-accumulation/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

## Use cases

Use for trade, migration, logistics, investment, or network expansion where the
order and accumulated total matter.

## Data and map contract

- Coordinates are `[longitude, latitude]` and remain inside valid geographic ranges.
- Route geometry uses great-circle interpolation rather than straight screen lines.
- The cumulative counter is the sum of route values multiplied by reveal progress.
- Natural Earth 1:110m provides the public-domain boundary geometry.

## Review

- Verify origin and destinations against the source data.
- Route head, line, destination marker, list value, and cumulative total must agree.
- Avoid more than eight simultaneous routes in one shot.

## Native implementation

`templates/map-route-accumulation/MapRouteAccumulation.tsx`

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-MapRouteAccumulation out/MapRouteAccumulation.mp4 --props=templates/map-route-accumulation/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
