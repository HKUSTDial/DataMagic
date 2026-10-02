# Parallax Map Glide

[中文](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/ParallaxMapGlide.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`ParallaxMapGlide`

## Purpose

Glide environment, spatial base, and data markers at restrained relative speeds for geographic depth.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/parallax-map-glide/ParallaxMapGlide.tsx`
- Schema：`templates/parallax-map-glide/schema.json`
- Sample data：`templates/parallax-map-glide/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

- Native implementation: `templates/parallax-map-glide/ParallaxMapGlide.tsx`

## Files

`templates/parallax-map-glide/schema.json`
`templates/parallax-map-glide/sample-data.json`

## Additional authoring constraints

Each region needs a name, value and valid longitude/latitude. Use map projection rather than invented canvas locations; source and unit are required. Use parallax_data_glide with restrained, increasing displacement ratios across environment, Natural Earth boundaries, routes and nodes. Labels must remain readable, nonoverlapping and within the safe area. No handheld shake.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-ParallaxMapGlide out/ParallaxMapGlide.mp4 --props=templates/parallax-map-glide/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
