# Tracked Video Callout

[中文](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/TrackedVideoCallout.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`TrackedVideoCallout`

## Purpose

Track a device, person, or product in Agnes-generated footage with editable keyframes while keeping titles and takeaways stable.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/video-data-overlay/VideoDataOverlay.tsx`
- Schema：`templates/video-data-overlay/schema.json`
- Sample data：`templates/video-data-overlay/tracked-callout-data.json`
- Sample media: silent preview; align timing separately when adding narration.

## Entity imagery

- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.

## Additional authoring constraints

Use replaceable videoSrc and authored tracking keyframes with normalized coordinates, interpolated on the frame clock. These anchors are supplied data, not automatic detection. Bind the label, metric and image to the same tracked object. Keep the subject, annotation and connector readable; inspect tracking at intermediate frames and freeze the footage and overlay together at the end. Generated footage needs provenance and visual-artifact review.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-TrackedVideoCallout out/TrackedVideoCallout.mp4 --props=templates/video-data-overlay/tracked-callout-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
