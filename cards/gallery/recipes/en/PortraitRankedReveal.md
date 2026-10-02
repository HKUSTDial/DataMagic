# Portrait Countdown Ranking

[中文](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/PortraitRankedReveal.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`PortraitRankedReveal`

## Purpose

A purpose-built 9:16 ranking story: hook, staged countdown, and a retained takeaway, with space reserved for mobile controls and captions.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/portrait-ranked-reveal/PortraitRankedReveal.tsx`
- Schema：`templates/portrait-ranked-reveal/schema.json`
- Sample data：`templates/portrait-ranked-reveal/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

## Use cases

A purpose-built portrait story, not a crop of a landscape chart. Start with a question, reveal 2–4 categories from lowest to highest value, and hold the conclusion. Equal values share a rank.

## Source files

- Component: `templates/portrait-ranked-reveal/PortraitRankedReveal.tsx`
- Data: `templates/portrait-ranked-reveal/sample-data.json`
- Schema: `templates/portrait-ranked-reveal/schema.json`
- Shared timing: `src/sceneTiming.ts`
- Composition: `ShotCraft-PortraitRankedReveal`
- Preview: `gallery/media/PortraitRankedReveal.mp4`

## Data and narrative

Rows contain stable IDs, labels, values, reveal times in seconds, and commentary. Use one zero-based scale (`maximum`); values must be nonnegative and within it. IDs must be unique. Reveals are at least 0.8 seconds apart, in nondecreasing value order. In this 10-second composition, reveal times must be 1.5–7.2 seconds to reserve a hook and final hold.


Labels allow 12 characters, titles 24, questions and takeaways 48, sources 56. These limits count English characters too; abbreviate long text. Recalculate differences and rewrite commentary when values change. Sample values are synthetic and must not be presented as factual statistics.

## Layout and timing

1080×1920, 30 fps, 300 frames, 10 seconds; H.264 CRF 18. Frame-driven animation; silent preview.


Content reserves 80 px left, 160 px right, 135 px top, and 265 px bottom for mobile UI and captions. These are conservative design margins, not a guarantee for every platform. Check the target platform preview. Narration and word alignment are not generated automatically.

## Original render example

From the `cards/` directory:

```bash
npm ci
npx remotion render src/index.ts ShotCraft-PortraitRankedReveal out/portrait.mp4 --props=templates/portrait-ranked-reveal/sample-data.json --codec=h264 --crf=18
```

## Acceptance

Inspect the opening, every reveal, and conclusion. Verify text stays within bounds, hidden values do not leak, bar lengths match numbers, the winner appears last, and the final takeaway/source are readable. Deliver data, source, and the complete portrait MP4.

## Entity imagery

Set an entity's `iconSrc` to a local public asset or supplied image URL. Keep names and values readable; imagery follows entity identity, not current rank, and appears with the entity's reveal. Fictional companies use category illustrations.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-PortraitRankedReveal out/PortraitRankedReveal.mp4 --props=templates/portrait-ranked-reveal/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
