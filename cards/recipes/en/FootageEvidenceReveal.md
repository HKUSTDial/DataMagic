# Footage to Evidence

[中文](../FootageEvidenceReveal.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`FootageEvidenceReveal`

## Purpose

Establish continuous footage, then introduce a stable evidence area with shared-scale metrics and a takeaway. Short clips hold their final frame.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/footage-evidence-reveal/FootageEvidenceReveal.tsx`
- Schema：`templates/footage-evidence-reveal/schema.json`
- Sample data：`templates/footage-evidence-reveal/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

## Use cases

Establish the footage, introduce a left evidence area at 1.5 seconds, reveal shared-scale metrics, then hold the takeaway.

## Source files

- Component: `templates/footage-evidence-reveal/FootageEvidenceReveal.tsx`
- Data: `templates/footage-evidence-reveal/sample-data.json`
- Schema: `templates/footage-evidence-reveal/schema.json`
- Timing helpers: `src/sceneTiming.ts`
- Composition: `ShotCraft-FootageEvidenceReveal`
- Preview: `gallery/media/FootageEvidenceReveal.mp4`

## Data contract

Each row supplies a stable ID, label, value, reveal time in seconds, and commentary. Use one zero-based scale and unit for all rows; values must lie within that scale. Reveal events must be at least 0.8 seconds apart. Supports 2–3 rows.


Update captions and takeaway whenever data changes. The template does not infer causal claims or generate narration. Demo numbers are synthetic; replace the source field with verified provenance for factual publication.

## Timing and assets

8 seconds, 1920×1080, 30 fps, H.264 CRF 18. Frame-driven animation; silent preview. The `at` values are authored timings, not automatic word alignment. To synchronize narration, substitute externally aligned word times and adjust the composition duration accordingly.

## Original render example

```bash
npm install
npx remotion render src/index.ts ShotCraft-FootageEvidenceReveal out/FootageEvidenceReveal.mp4 --props=templates/footage-evidence-reveal/sample-data.json --codec=h264 --crf=18
```

## Agent brief

Use the original FootageEvidenceReveal component and schema with my data. Preserve editable layers, the shared scale, and attribution. Verify data and commentary agreement. Inspect the opening, every reveal, and ending for clipping, overlap, numeric mapping, and media duration handling. Deliver source, props, and a full-HD MP4.

## Entity imagery

- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-FootageEvidenceReveal out/FootageEvidenceReveal.mp4 --props=templates/footage-evidence-reveal/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
