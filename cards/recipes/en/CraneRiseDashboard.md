# Crane Rise Dashboard

[中文](../CraneRiseDashboard.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`CraneRiseDashboard`

## Purpose

Rise from one key data bar into the full comparison structure, moving from detail to system.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/crane-rise-dashboard/CraneRiseDashboard.tsx`
- Schema：`templates/crane-rise-dashboard/schema.json`
- Sample data：`templates/crane-rise-dashboard/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

- Native implementation: `templates/crane-rise-dashboard/CraneRiseDashboard.tsx`

## Files

`templates/crane-rise-dashboard/schema.json`
`templates/crane-rise-dashboard/sample-data.json`

## Entity imagery

- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.

## Additional authoring constraints

categories and values must have equal lengths. focusLabel must exist in categories and focusValue must match that value. Use crane_rise_reveal; the opening must not crop the focused number. After pulling out, show axes, categories, source and conclusion completely, and hold at least 1.5 seconds.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-CraneRiseDashboard out/CraneRiseDashboard.mp4 --props=templates/crane-rise-dashboard/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
