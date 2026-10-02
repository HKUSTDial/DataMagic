# Pull Back Isolation

[中文](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/PullBackIsolation.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`PullBackIsolation`

## Purpose

Show the cohort, then pull back and dim neighbors to isolate the true outlier.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/pull-back-isolation/PullBackIsolation.tsx`
- Schema：`templates/pull-back-isolation/schema.json`
- Sample data：`templates/pull-back-isolation/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

- Native implementation: `templates/pull-back-isolation/PullBackIsolation.tsx`

## Files

`templates/pull-back-isolation/schema.json`
`templates/pull-back-isolation/sample-data.json`

## Entity imagery

- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.

## Additional authoring constraints

The highlighted entity must exist in the supplied data. Show the whole comparison first, isolate the selected evidence without changing its value or identity, then pull back to the conclusion. Keep the source and conclusion on fixed layers and hold the ending for reading.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-PullBackIsolation out/PullBackIsolation.mp4 --props=templates/pull-back-isolation/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
