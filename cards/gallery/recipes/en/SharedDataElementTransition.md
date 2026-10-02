# Shared Data Element Transition

[中文](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/SharedDataElementTransition.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`SharedDataElementTransition`

## Purpose

Carry one data object from evidence to conclusion while preserving value, label, and visual identity.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/shared-data-element-transition/SharedDataElementTransition.tsx`
- Schema：`templates/shared-data-element-transition/schema.json`
- Sample data：`templates/shared-data-element-transition/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

- Native implementation: `templates/shared-data-element-transition/SharedDataElementTransition.tsx`

## Files

`templates/shared-data-element-transition/schema.json`
`templates/shared-data-element-transition/sample-data.json`

## Entity imagery

- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.

## Additional authoring constraints

focusIndex must identify an existing data item. Value, unit, label, color and identity stay unchanged across both scenes. Establish the comparison, detach one focused object, then land it in the conclusion layout. Keep titles, source and commentary fixed; end with at least a one-second static hold. Do not connect different metrics or move several data objects simultaneously.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-SharedDataElementTransition out/SharedDataElementTransition.mp4 --props=templates/shared-data-element-transition/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
