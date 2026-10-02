# Persistent Tier Board

[中文](../PersistentTierBoard.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`PersistentTierBoard`

## Purpose

Keep a tier board alive as evidence changes. Entities move according to explicit thresholds, supporting improvements and declines.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/persistent-tier-board/PersistentTierBoard.tsx`
- Schema：`templates/persistent-tier-board/schema.json`
- Sample data：`templates/persistent-tier-board/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

## Use cases

A persistent board updates selected entities without resetting everything at every sentence.

## Implementation

- Component: `templates/persistent-tier-board/PersistentTierBoard.tsx`
- Schema: `templates/persistent-tier-board/schema.json`
- Data: `templates/persistent-tier-board/sample-data.json`
- Alternate data: `templates/persistent-tier-board/alternate-data.json`
- Composition: `ShotCraft-PersistentTierBoard`
- Output: 1920×1080, 30 fps, 12 seconds, silent preview.

## Tier rules

Use 3–5 entities with unique IDs. Values must fit `[0, maximum]`. Each entity keeps a fixed column so trajectories never collide. The row is computed from the thresholds, not manually assigned.

## Reuse and acceptance

- Check threshold boundaries, original placements, all updates, and final placements.
- Do not compare different metrics as if they shared one tier scale.
- Clearly label subjective assessments if supplying them; do not present them as measured quality.
- Keep the threshold legend visible; no drifting camera while reading.

## Entity imagery

- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.

## Additional authoring constraints

The board and threshold legend stay visible. Establish all initial positions, move only the selected entities at their authored times, and hold the complete final state. Replace tier labels, thresholds, entity values and captions together.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-PersistentTierBoard out/PersistentTierBoard.mp4 --props=templates/persistent-tier-board/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
