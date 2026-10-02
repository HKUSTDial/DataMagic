# Generated Video Metric Overlay

[中文](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/VideoMetricOverlay.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`VideoMetricOverlay`

## Purpose

Use a continuous Agnes-generated MP4 as the context layer and place synchronized metrics in protected negative space.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/video-data-overlay/VideoDataOverlay.tsx`
- Schema：`templates/video-data-overlay/schema.json`
- Sample data：`templates/video-data-overlay/negative-space-data.json`
- Sample media: silent preview; align timing separately when adding narration.

## Entity imagery

- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.

## Additional authoring constraints

Use replaceable MP4 videoSrc under public/ and 1–4 metrics in reserved negative space. metrics drives labels, values, units, colors and bar lengths; title, subtitle, source and conclusion stay fixed. The sample is generated continuous footage, normalized to 1920×1080, 30fps, 8 seconds. See templates/video-data-overlay/assets/recycling-facility-agnes.json for provenance. Reveal metrics in order and freeze footage and data together for the final 1.2 seconds. Inspect deformation, shake, text artifacts, subject occlusion and contrast; regenerate or use an accepted cached asset if unsuitable. Keep the source within the 64px safe area.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-VideoMetricOverlay out/VideoMetricOverlay.mp4 --props=templates/video-data-overlay/negative-space-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
