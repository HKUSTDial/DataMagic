# Contrast Hook & Contribution Story

[中文](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/ContrastContributionStory.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`ContrastContributionStory`

## Purpose

A bold hook leads into a signed contribution bridge, with a computed endpoint and a checkable shared scale.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/contrast-contribution-story/ContrastContributionStory.tsx`
- Schema：`templates/contrast-contribution-story/schema.json`
- Sample data：`templates/contrast-contribution-story/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

## Use cases

A bold numerical hook leads into a checkable contribution bridge rather than decorative motion.

## Implementation

- Component: `templates/contrast-contribution-story/ContrastContributionStory.tsx`
- Schema: `templates/contrast-contribution-story/schema.json`
- Data: `templates/contrast-contribution-story/sample-data.json`
- Alternate data: `templates/contrast-contribution-story/alternate-data.json`
- Composition: `ShotCraft-ContrastContributionStory`
- Output: 1920×1080, 30 fps, 12 seconds, silent preview.

## Data and beats

`baseline + sum(contributions.value)` is the computed endpoint. All cumulative positions must fit `[0, maximum]`; this version does not support cumulative totals below zero. Use 2–3 additive contributions in the same unit and accounting scope. The hook may describe a different measure, so explicitly check its relationship to the story; the template cannot prove that relationship.

## Reuse and acceptance

- Check that the hook, authored captions and takeaway agree with the supplied arithmetic.
- Never mix percentages and absolute amounts in one additive bridge.
- Do not call a visual accounting decomposition causal proof.

## Entity imagery

- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.

## Additional authoring constraints

Begin with the large hook, then reveal the contribution bridge and hold the final checkable result. The default and alternate datasets exercise negative and positive contributions; rewrite captions and source when replacing them.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-ContrastContributionStory out/ContrastContributionStory.mp4 --props=templates/contrast-contribution-story/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
