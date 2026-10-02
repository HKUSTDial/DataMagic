# Split Context Comparison

[中文](../SplitContextComparison.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`SplitContextComparison`

## Purpose

Compare one metric across two programmatic contexts so the numeric difference retains real-world meaning.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/split-context-comparison/SplitContextComparison.tsx`
- Schema：`templates/split-context-comparison/schema.json`
- Sample data：`templates/split-context-comparison/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

- Native implementation: `templates/split-context-comparison/SplitContextComparison.tsx`

## Files

`templates/split-context-comparison/schema.json`  
`templates/split-context-comparison/sample-data.json`  
`templates/split-context-comparison/motion.mjs`

## Entity imagery

- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.

## Additional authoring constraints

left and right each supply a label, value, unit, explanation, accent and scene type. Use comparable units; verify differenceValue and takeaway against the input. The sample vehicles, road and facilities are editable SVG. Output 1920×1080, 30fps, 8 seconds; motion ends by 6.6s for a 1.4s static hold. Preserve the 64px safe area, place the difference badge between contexts without covering values, limit long titles to two lines and use Noto Sans SC for Chinese. Fixed titles, source and conclusion must not follow scene movement.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-SplitContextComparison out/SplitContextComparison.mp4 --props=templates/split-context-comparison/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
