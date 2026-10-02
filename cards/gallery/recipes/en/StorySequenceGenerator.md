# Four-shot Story Generator

[中文](../StorySequenceGenerator.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`StorySequenceGenerator`

## Purpose

Compile a topic, categorical data, and takeaway into four continuous question, context, evidence, and conclusion shots.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/story-sequence-generator/StorySequenceGenerator.tsx`
- Schema：`templates/story-sequence-generator/schema.json`
- Sample data：`templates/story-sequence-generator/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

## Usage

```bash
npx remotion render src/index.ts ShotCraft-StorySequenceGenerator story.mp4 --props=story-data.json
```

## Entity imagery

- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.

## Additional authoring constraints

blueprintId selects one of six story structures. Supply title, question, takeaway and 3–8 items with unique id, label, value and optional color, plus source, unit and accent. Four shots: question with slow push; context with a wide overview pan; ranked evidence with a light crash focus; conclusion retaining shared entity identity. Output 1920×1080, 30fps, 12 seconds, with a final static hold of at least 1.2 seconds. Titles, chapters, source and conclusion stay outside camera transforms.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-StorySequenceGenerator out/StorySequenceGenerator.mp4 --props=templates/story-sequence-generator/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
