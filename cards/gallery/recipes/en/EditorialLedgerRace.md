# Editorial Ledger Race

[中文](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/EditorialLedgerRace.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- Recipe key：`EditorialLedgerRace`

## Purpose

Turn ranking change into an editorial story with a question, tracked entity, turning-point note, and final claim.

## Getting started

Give the [DataMagic repository](https://github.com/HKUSTDial/DataMagic) to your coding agent and ask it to configure the `datamagic` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md). File paths below are relative to `cards/`.

## Source and data

- Component：`templates/editorial-ledger-race/EditorialLedgerRace.tsx`
- Schema：`templates/editorial-ledger-race/schema.json`
- Sample data：`templates/editorial-ledger-race/sample-data.json`
- Sample media: silent preview; align timing separately when adding narration.

- Delivery: 1920x1080, 30 fps, frame-driven, final static hold at least 1.5 seconds

## Use cases

Use when ranking change needs to feel like an evidence-led editorial story rather than a sports scoreboard. The shot combines a question, continuous ranking, one tracked entity, a turning-point note, and a final claim.

Do not use for second-by-second live monitoring or when saturated team colors are essential. Prefer `CinematicTrackRace` for high-energy competition.

## Data contract

Stable entities and ordered snapshots use the same deterministic interpolation model as `BarChartRace`. The additional `story` object supplies `hook`, `turningPoint`, `takeaway`, and `focusEntityId`. Every visible number and rank remains derived from structured data.

## Animation contract

- Begin with the editorial question and complete comparison.
- Interpolate values and rank positions continuously.
- Apply one restrained slow push while the evidence develops.
- Keep the tracked entity visually stable across every period.
- Reveal the takeaway only after the final ranking settles.
- Hold the complete final state for at least 1.5 seconds.

## Review constraints

- Confirm the focus id exists and its value matches the current snapshot.
- Keep source, title, question, and final conclusion outside the moving chart layer.
- Check all rank crossings for label and value collisions.
- Mark synthetic data explicitly.

## Native implementation

```text
templates/editorial-ledger-race/EditorialLedgerRace.tsx
templates/editorial-ledger-race/schema.json
templates/editorial-ledger-race/sample-data.json
```

## Entity imagery

- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.

## Render

Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.

```bash
npm ci
npx remotion render src/index.ts ShotCraft-EditorialLedgerRace out/EditorialLedgerRace.mp4 --props=templates/editorial-ledger-race/sample-data.json
```

## Delivery review

Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.
