# Presenter Evidence Board

[中文](../PresenterEvidenceBoard.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`PresenterEvidenceBoard`

## Purpose

A presenter image or video alongside a data board, with timed evidence reveals, emphasis, and a final takeaway.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/presenter-evidence-board/PresenterEvidenceBoard.tsx`
- Schema：`templates/presenter-evidence-board/schema.json`
- Sample data：`templates/presenter-evidence-board/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

## Use cases

The presenter image or video stays beside the board. Reveal rows at 1, 3.2, and 5.4 seconds, then conclude at 6.6 seconds.

## Source files

- Component: `templates/presenter-evidence-board/PresenterEvidenceBoard.tsx`
- Data: `templates/presenter-evidence-board/sample-data.json`
- Schema: `templates/presenter-evidence-board/schema.json`
- Timing helpers: `src/sceneTiming.ts`
- Composition: `ShotCraft-PresenterEvidenceBoard`
- Preview: `gallery/media/PresenterEvidenceBoard.mp4`

## Data contract

Each row supplies a stable ID, label, value, reveal time in seconds, and commentary. Use one zero-based scale and unit for all rows; values must lie within that scale. Reveal events must be at least 0.8 seconds apart. Supports 2–3 rows.


Update captions and takeaway whenever data changes. The template does not infer causal claims or generate narration. Demo numbers are synthetic; replace the source field with verified provenance for factual publication.

## Timing and assets

10 seconds, 1920×1080, 30 fps, H.264 CRF 18. Frame-driven animation; silent preview. The `at` values are authored timings, not automatic word alignment. To synchronize narration, substitute externally aligned word times and adjust the composition duration accordingly.

## Original render example

```bash
npm install
npx remotion render src/index.ts ShotCraft-PresenterEvidenceBoard out/PresenterEvidenceBoard.mp4 --props=templates/presenter-evidence-board/sample-data.json --codec=h264 --crf=18
```

## Agent brief

Use the original PresenterEvidenceBoard component and schema with my data. Preserve editable layers, the shared scale, and attribution. Verify data and commentary agreement. Inspect the opening, every reveal, and ending for clipping, overlap, numeric mapping, and media duration handling. Deliver source, props, and a full-HD MP4.

## Entity imagery

Set an entity's `iconSrc` to a local public asset or supplied image URL. Keep names and values readable; imagery follows entity identity, not current rank, and appears with the entity's reveal. Fictional companies use category illustrations.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-PresenterEvidenceBoard out/PresenterEvidenceBoard.mp4 --props=templates/presenter-evidence-board/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
