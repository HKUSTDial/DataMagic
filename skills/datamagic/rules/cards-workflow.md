# DataMagic Cards: inspect, adapt, render

## Locate and select

Run `scripts/cards.cjs list` from this Skill with an optional `--query` and `--native` filter. Search covers slug, bilingual name, description, tags, category and selection metadata; it is a text filter, not a semantic recommender. Read the returned candidates and choose using the actual data shape, narrative role, and dimensions. Use `inspect <exact-slug>` to resolve the recipe and assets.

The repository's `cards/gallery/api/library.json` is authoritative. The helper searches ancestors of the Skill for the companion `cards/`; `--cards` overrides this for a separately copied Skill. Do not assume the working directory is the repository. If absent, ask for the companion package or create an independent implementation using available instructions and disclose the limitation.

Every card includes component, schema and sample paths. Advanced templates use `source.adapter = shotcraft-native`; chart and text templates use `datamagic`. Resolve the helper's `compositionId` for rendering. Runtime cards additionally use `src/runtime/RuntimeCard.tsx` and shared modules under `src/legacy/`; both their original `StyleTemplate-*` and `RuntimeTemplatePreview-*` IDs are registered.

## Adapt a template

Read the complete selected recipe, component, imported shared modules, schema, sample JSON and its composition registration. Advanced templates are registered in `src/Root.tsx`; chart and text templates are registered in `src/runtime/RuntimeCardsRoot.tsx`. Inspect the poster or a preview frame. Preserve its reveal order, hold time and settled state unless intentionally redesigning them. Use the declared width, height, fps and duration; changing just the output size is not a portrait layout.

For runtime cards, registrations are in `src/runtime/RuntimeCardsRoot.tsx`. Props contain `sceneContent` and `scene`: synchronize data, display values, template payload, titles and labels, and update `scene.animations` target filters when labels change. Use the component and `runtimeSlots.ts` to determine which payload fields that template reads. Runtime cards render at 1280×720, 30 fps, 6 seconds. Keep shared imports when extracting a standalone example.

Map the user's columns to props, keeping a source-file-to-props mapping. Validate required types, limits, finite values, labels and units. Derive scales, ordering and claims from those props; do not leave the sample takeaway or hardcode example values. Do not mix incomparable units or invent causality. Unsupported data (negative values on positive-only bars, too many rows, ties requiring a different claim) needs a different recipe or an explicitly tested modification.

Write the new props and any component changes into the user's requested output folder. Do not replace library samples, the gallery or production files unless requested. Refer to bundled templates directly for a props-only adaptation; for a standalone project preserve shared imports and media dependencies.

From `cards/`, after dependencies are available:

```bash
npm run typecheck
npx remotion render src/index.ts ShotCraft-RankedReveal out/ranking.mp4 --props=/absolute/path/new-props.json
npx remotion still src/index.ts ShotCraft-RankedReveal out/ranking-middle.png --props=/absolute/path/new-props.json --frame=150
```

Use the selected Composition ID, not always RankedReveal. Browser overrides may be needed in headless environments; report infrastructure failures separately from template defects. Do not modify global browser settings. `public/` holds render media; relative media paths are interpreted there, not relative to the props file. Check media existence/duration, rights and generated-media disclosures. A static presenter image is not a talking presenter. These templates do not supply TTS or a video generation service.

## Build a short story

Read only a relevant plan in `cards/gallery/api/story-blueprints.json`. Blueprints describe narrative structure; they are not all directly renderable by a universal composition. Choose compatible scene components, register a sequence with a consistent visual system, and compute total duration from scene durations (subtract transition overlaps). Check local frame offsets so each reveal runs within its own scene.

For a custom narrative developed from data, read [full-story-workflow.md](full-story-workflow.md). Add narration when requested: write the script with `narration.md`, follow `voiceover.md` for audio, and align emphasis to measured duration. For direct recipe composition, use a concise beat plan and the selected components' data and timing contracts.

## Review and deliver

Check the source-to-props mapping, rank/ties, values, units, scale and conclusion. Render both the full MP4 and stills at opening, active reveal and conclusion. View the stills for clipping, collisions, contrast, safe margins and legibility at intended display size; view the video when playback is available to assess motion. A successful render does not prove visual quality.

Apply `self-review.md` to the actual route. For silent native clips, measured-audio timing and subtitle checks are not applicable; preserve the template's declared timeline. Report any unperformed audio/playback checks. Deliver editable props/source, output paths, render command, provenance and a short QA record. Keep internal test reports out of the public gallery unless the user requests publication.
