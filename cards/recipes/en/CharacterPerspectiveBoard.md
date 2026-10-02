# Character Presenter & Perspective Board

[中文](../CharacterPerspectiveBoard.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`CharacterPerspectiveBoard`

## Purpose

A cat or custom presenter with a stable perspective data board: question, staged evidence, takeaway. Includes household and logistics datasets.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/character-perspective-board/CharacterPerspectiveBoard.tsx`
- Schema：`templates/character-perspective-board/schema.json`
- Sample data：`templates/character-perspective-board/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

## Use cases

A reusable character-led explanation: question, staged evidence, takeaway.

## Implementation

- Component: `templates/character-perspective-board/CharacterPerspectiveBoard.tsx`
- Schema: `templates/character-perspective-board/schema.json`
- Default data: `templates/character-perspective-board/sample-data.json`
- Alternate data: `templates/character-perspective-board/alternate-data.json`
- Composition: `ShotCraft-CharacterPerspectiveBoard`
- Alternate composition: `CharacterPerspectiveBoard-Alternate`
- Native output: 1920×1080, 30 fps, 14 seconds / silent preview.
- Sample presenter: `public/assets/character-perspective-board/cat-host.mp4`

## Story beats

Question first, reveal one row per beat, retain evidence and hold the takeaway.

`rows[].at` and `conclusionAt` are explicit seconds; align them to your own narration if adding audio. The preview does not synthesize speech or lip-sync; existing cat motions are illustrative and not aligned to these new words.

## Data and media

Replace all editorial fields, values, scale, and presenter media. Use a shared unit and comparison basis. Short footage holds its last frame; it never loops. Label generated media and synthetic data.

## Motion constraints

Board slides in once; perspective stays fixed while reading. No continuous rocking, no CSS animation. Revealed rows stay visible. Leave at least two seconds for the final takeaway.

## Reuse validation

Render both datasets, then inspect the question, each reveal, final values, and conclusion.


```bash
npm run render:advanced -- --only=CharacterPerspectiveBoard
npx remotion render src/index.ts CharacterPerspectiveBoard-Alternate /tmp/character-logistics.mp4 --concurrency=1 --muted
npm run preview:lite
```

## Sample provenance

The supplied cat footage is a previously generated fictional character, redistributed without audio. This independently implemented recipe contains no reference creator footage, voice, likeness, or copied source code.

## Entity imagery

- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.

## Additional authoring constraints

Use 2–3 nonnegative rows on one maximum scale; labels up to 12 characters and values up to four digits. Compare one metric, unit, time range and accounting basis; a growth comparison is not a causal proof. Presenter media is replaceable under public/ and needs its actual durationSeconds. Tilt defaults to -7 degrees, supports -10 to 10, with zero frontal. Default household percentages and alternate logistics minutes share the component without source changes. The assets are a previously generated fictional cat, not footage or likeness of a reference creator.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-CharacterPerspectiveBoard out/CharacterPerspectiveBoard.mp4 --props=templates/character-perspective-board/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
