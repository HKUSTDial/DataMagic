# Choropleth Rank Map

[中文](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/ChoroplethRankMap.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`ChoroplethRankMap`

## Purpose

Map regional metrics to real geographic boundaries with synchronized ranking, values, source, and an editable color scale.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/choropleth-rank-map/ChoroplethRankMap.tsx`
- Schema：`templates/choropleth-rank-map/schema.json`
- Sample data：`templates/choropleth-rank-map/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

## Use cases

Use for a metric attached to countries or regions, especially when geographic
distribution and ranking must be read together.

## Data and map contract

- Region codes use ISO/ADM0 three-letter codes available in the base map.
- Fill intensity, ranking, labels, and values derive from the same `regions` array.
- Natural Earth 1:110m provides the boundary geometry; it is public domain.
- Do not imply precision below the resolution of the supplied boundaries.

## Review

- Unknown region codes must fail validation instead of silently disappearing.
- Small regions remain verifiable in the ranked list even if their map area is tiny.
- Keep the source and boundary attribution visible.

## Native implementation

`templates/choropleth-rank-map/ChoroplethRankMap.tsx`

## Entity imagery

Set an entity's `iconSrc` to a local public asset or supplied image URL. Keep names and values readable; imagery follows entity identity, not current rank, and appears with the entity's reveal. Fictional companies use category illustrations.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-ChoroplethRankMap out/ChoroplethRankMap.mp4 --props=templates/choropleth-rank-map/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
