# Data Magnifier Lens

[中文](../DataMagnifierLens.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`DataMagnifierLens`

## Purpose

Scan a trend and magnify the key anomaly, combining overview and focused explanation in one data shot.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/data-magnifier-lens/DataMagnifierLens.tsx`
- Schema：`templates/data-magnifier-lens/schema.json`
- Sample data：`templates/data-magnifier-lens/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

## Use cases

Use when a trend has one event that deserves a close explanation.

## Data contract

- `labels` and `values` must have equal length.
- The lens highlights an existing value and never changes chart geometry.
- Explain the focused value in `insight` and retain the source.

## Animation contract

- Establish the full trend before stopping at the focus point.
- Keep the final callout visible for at least 1.5 seconds.
- Drive lens position from chart coordinates, not hand-tuned pixels.

## Native implementation

`templates/data-magnifier-lens/DataMagnifierLens.tsx`

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-DataMagnifierLens out/DataMagnifierLens.mp4 --props=templates/data-magnifier-lens/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
