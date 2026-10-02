# Bump Chart Story

[中文](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/BumpChartStory.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`BumpChartStory`

## Purpose

Reveal overtakes, reversals, and rank changes with continuous trajectories, source values, and stable entity colors.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/bump-chart-story/BumpChartStory.tsx`
- Schema：`templates/bump-chart-story/schema.json`
- Sample data：`templates/bump-chart-story/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

## Use cases

Use when the story is about who overtook whom, not only who has the largest
final value.

## Data contract

- Every series must provide one numeric value for every period.
- Rank and label are derived from the same values; do not provide rank separately.
- Keep 3–6 series visible so moving labels remain readable.

## Animation contract

- Reveal the trajectory continuously, then hold the final ranking.
- Use stable colors for entities across all periods.
- Avoid abrupt rank jumps or independently animated labels.

## Native implementation

`templates/bump-chart-story/BumpChartStory.tsx`

## Entity imagery

Set an entity's `iconSrc` to a local public asset or supplied image URL. Keep names and values readable; imagery follows entity identity, not current rank, and appears with the entity's reveal. Fictional companies use category illustrations.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-BumpChartStory out/BumpChartStory.mp4 --props=templates/bump-chart-story/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
