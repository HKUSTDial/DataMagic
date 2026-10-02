# Chart Timeline Travel

[中文](../ChartTimelineTravel.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`ChartTimelineTravel`

## Purpose

Travel milestone by milestone with reading pauses, then brake smoothly into the final conclusion.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/chart-timeline-travel/ChartTimelineTravel.tsx`
- Schema：`templates/chart-timeline-travel/schema.json`
- Sample data：`templates/chart-timeline-travel/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

## Use cases

Travel through four or five periods with a horizontal chart-focused camera. It works for growth stages, policy evolution, product history, project delivery, and sequential experiment results. The camera pauses briefly at each milestone and brakes into the final conclusion.

## Recipe key

`ChartTimelineTravel`

## Editable data contract

- `locale`: `zh` or `en`
- `title`, `subtitle`, `eyebrow`, `finalTakeaway`, `source`: `{zh, en}`
- `periods`: 4–5 ordered records
- Each period contains `id`, bilingual `label`, numeric `value`, `unit`, bilingual `note`, and `accent`


Every point, path segment, value, color, and note is driven by `periods`; no data is baked into an image.

### English

1. The title stays fixed while an independent data stage travels horizontally.
2. Every period receives a reading hold before the next move.
3. Earlier moves use smooth acceleration and deceleration; the final move uses cubic ease-out braking.
4. The takeaway appears only after the final period settles.

## Authoring guidance

- Keep one consistent unit or normalize values before rendering.
- Keep notes under roughly 34 Chinese characters or 110 English characters.
- Camera motion should follow narrative order; avoid random milestone ordering.
- For longer pauses, adjust `holdFrames` in `motion.mjs`; do not add CSS animations.

## Additional authoring constraints

For longer pauses, change holdFrames in motion.mjs. Do not randomize milestone order. Keep one unit, and keep notes to roughly 34 Chinese characters or 110 English characters.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-ChartTimelineTravel out/ChartTimelineTravel.mp4 --props=templates/chart-timeline-travel/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
