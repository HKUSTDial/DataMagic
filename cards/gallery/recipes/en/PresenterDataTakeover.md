# Presenter-to-Data Handoff

[中文](../PresenterDataTakeover.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`PresenterDataTakeover`

## Purpose

A presenter poses a question, shrinks into a circular inset, and hands the frame to a signed trend chart with a retained focal period.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/presenter-data-takeover/PresenterDataTakeover.tsx`
- Schema：`templates/presenter-data-takeover/schema.json`
- Sample data：`templates/presenter-data-takeover/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

## Use cases

A character poses a question, yields the main frame to evidence, and remains in a circular inset.

## Implementation

- Component: `templates/presenter-data-takeover/PresenterDataTakeover.tsx`
- Schema: `templates/presenter-data-takeover/schema.json`
- Data: `templates/presenter-data-takeover/sample-data.json`
- Alternate data: `templates/presenter-data-takeover/alternate-data.json`
- Composition: `ShotCraft-PresenterDataTakeover`
- Output: 1920×1080, 30 fps, 12 seconds, silent preview.
- Sample presenter: `public/assets/character-perspective-board/cat-host.mp4`

## Timing and data

Keep all data on the shared signed scale. Do not omit unfavorable periods or reorder time to dramatize the chart. The focus index is author-specified, not an automatically detected anomaly. Use narration-specific beats if adapting the timing.

## Presenter and reuse

The crop changes, not the media clock. Replace media and all editorial fields; no generated voice, lip-sync, or automatic causal explanation is included.

## Acceptance

- Do not crop a complete 16:9 chart into a small panel. This component has its own reflowed data area.

## Additional authoring constraints

Timing: question 0–1.8s; inset handoff 1.8–3s; reveals from 3.2s; focusIndex at 7.2s; conclusion 9–12s. Use 4–7 ordered points in a shared domain whose lower and upper bounds straddle zero. Positive and negative signs do not automatically mean good or bad. Keep one presenter playback instance on one clock; short footage holds its last frame. Inspect 1, 3, 6, 8, and 11 seconds, the zero line, focus index, values, and conclusion. Both datasets are synthetic.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-PresenterDataTakeover out/PresenterDataTakeover.mp4 --props=templates/presenter-data-takeover/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
