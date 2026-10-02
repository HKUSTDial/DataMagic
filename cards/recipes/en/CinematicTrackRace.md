# Cinematic Track Race

[中文](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/CinematicTrackRace.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`CinematicTrackRace`

## Purpose

Use dark lanes, a leader spotlight, and one crash focus on the pivotal overtake for a high-energy race sequence.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/cinematic-track-race/CinematicTrackRace.tsx`
- Schema：`templates/cinematic-track-race/schema.json`
- Sample data：`templates/cinematic-track-race/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

- Delivery: 1920x1080, 30 fps, frame-driven, final static hold at least 1.5 seconds

## Use cases

Use for a high-energy ranking sequence where one decisive overtake deserves a single visual impact. Lanes, leader spotlight, progress, turning-point note, and final takeaway form one short competition story.

Do not use when the audience must inspect every intermediate value slowly. Prefer `EditorialLedgerRace` for evidence-heavy reading.

## Data contract

Stable entities and ordered snapshots use the shared deterministic race model. The `story` object defines the hook, turning point, takeaway, and tracked entity. Labels, lane length, rank, leader, and values remain programmatic.

## Animation contract

- Establish all lanes before accelerating the race.
- Interpolate rank and values continuously between snapshots.
- Use one brief crash focus near the pivotal overtake; never repeat it.
- Keep fixed UI, source, and conclusion outside the crash-transformed layer.
- Settle into the final result and hold it for at least 1.5 seconds.

## Review constraints

- Verify the crash focus does not clip labels, values, or the leader panel.
- Confirm the tracked value and final winner against input data.
- Keep glow subordinate to data geometry and preserve readable contrast.
- Mark synthetic data explicitly.

## Native implementation

```text
templates/cinematic-track-race/CinematicTrackRace.tsx
templates/cinematic-track-race/schema.json
templates/cinematic-track-race/sample-data.json
```

## Entity imagery

- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-CinematicTrackRace out/CinematicTrackRace.mp4 --props=templates/cinematic-track-race/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
