# Source to Reconstruction

[中文](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/SourceToReconstruction.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`SourceToReconstruction`

## Purpose

Scan a source table and reconstruct it as editable marks while preserving provenance and field mappings.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/source-to-reconstruction/SourceToReconstruction.tsx`
- Schema：`templates/source-to-reconstruction/schema.json`
- Sample data：`templates/source-to-reconstruction/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

- Native implementation: `templates/source-to-reconstruction/SourceToReconstruction.tsx`

## Files

- `templates/source-to-reconstruction/schema.json`
- `templates/source-to-reconstruction/sample-data.json`
- `templates/source-to-reconstruction/SourceToReconstruction.tsx`

## Entity imagery

- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.

## Additional authoring constraints

rows is the sole source for both the original table and rebuilt chart. Each row includes label, value and sourceText; highlightIndex identifies an existing row and exact conclusions must derive from rows. Label synthetic sources and do not fabricate financial-report screenshots. Use editable paper/table typography in two stable regions. Preserve labels, values, units, source and takeaway inside a 64px safe area on a 1920×1080 canvas. Scan at 0–2.3s, connect/rebuild at 2.0–4.7s, reveal the conclusion at 5.0–5.8s, and hold entirely static at 7.0–8.0s. All animation is frame-driven.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-SourceToReconstruction out/SourceToReconstruction.mp4 --props=templates/source-to-reconstruction/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
