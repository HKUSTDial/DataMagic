# DataMagic Cards

[中文](README.md) · [Back to DataMagic](../README.en.md)

DataMagic's open data-video recipe library: 139 cards with HD motion previews, editable source, sample data, and animation rules. Pick an effect, adapt your data and media, and render locally.

## Public contents

- **All 139 cards include source, JSON schemas and sample props**, ready for agent-assisted adaptation and local rendering.
- **109 chart and text shots** cover bars, trends, shares, scatterplots, flows, openings, explanations and conclusions, with data binding and timed emphasis.
- **30 advanced templates** cover portrait ranking, characters, data handoff, contribution stories, tier updates, maps, footage and camera motion.
- **8 story blueprints** guide hooks, evidence, turns and conclusions for selecting recipes and organizing continuous shots.

Historical Composition IDs such as `ShotCraft-*` remain compatible with existing projects. The project brand is DataMagic Cards, an open component of DataMagic.

## Browse the gallery

**[Live gallery: datamagic.chat/cards/](https://datamagic.chat/cards/)** — browse without installing anything.

From the repository root, start the static gallery without Node dependencies or a DataMagic backend:

```bash
python3 -m http.server 5180 --directory cards/gallery
```

Open `http://localhost:5180/`. Search, browse collections, switch languages, compare previews, view recipes, and copy implementation briefs. MP4 previews and fonts are included for local browsing. Serve the page over HTTP rather than opening the HTML file directly, because it fetches JSON indexes.

## Use a native template

```bash
cd cards
npm ci
npm test
npm run typecheck
npm run studio
```

Requires Node.js 20 or newer. Source, schema, and sample paths in recipes are relative to `cards/`. For example:

```bash
npx remotion render src/index.ts ShotCraft-PresenterEvidenceBoard out/presenter.mp4 \
  --props=templates/presenter-evidence-board/sample-data.json
```

For a native 1080×1920 portrait story, not a crop of the landscape composition:

```bash
npx remotion render src/index.ts ShotCraft-PortraitRankedReveal out/portrait.mp4 \
  --props=templates/portrait-ranked-reveal/sample-data.json --codec=h264 --crf=18
```

The 10-second template follows a hook → countdown → takeaway, reserving right-side and bottom space for mobile controls and captions. Check the target platform's overlay positions before publication.

Replace props and media to create a new version. To regenerate one gallery preview:

```bash
npm run render:advanced -- --only=PresenterEvidenceBoard --force
```

### Render a chart or text shot

The 109 chart and text implementations live under `src/legacy/components/runtime_style_templates/`. Each card has sample props and a schema under `templates/runtime-cards/<slug>/`.

From `cards/`, render a basic bar chart:

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-BasicBarChart out/basic-bar.mp4 \
  --props=templates/runtime-cards/BasicBarChart/sample-data.json
```

Chart and text shots default to 1280×720, 30 fps, 6 seconds. Props contain `sceneContent` and `scene`; update data, display values and matching `template_payload` fields together, and update animation targets when changing labels. Each recipe lists its source, sample, schema and render command.

## Structure

```text
cards/
├── gallery/       Static pages, card index, story blueprints, fonts, posters, MP4s
├── recipes/       139 recipe documents
├── templates/     Advanced templates and runtime-cards/ samples and schemas
├── src/           Registration, runtime/ entry and legacy/ chart source
├── public/        Sample media for native rendering
├── tests/         Data, animation, and asset-integrity checks
└── scripts/       Native preview rendering and selection metadata
```

## Examples and usage

### Lightweight web previews

The list uses lightweight videos with at most two playing on desktop or one on mobile. Offscreen sources are released. Enable **Data saver** to show posters only until you open a case. Details default to the light version and show file sizes before switching to the unchanged HD original.

With FFmpeg and `ffprobe` installed, run `npm run preview:lite` to rebuild variants after rendering originals. Originals over 500KB receive silent previews with a maximum dimension of 960px, an unchanged timeline, and content-hashed URLs. A variant is selected only if it is smaller. Inspect the result and rerun tests before publication.

Example values are synthetic or illustrative, not real statistical evidence. The fictional presenter image and industrial footage are generated samples. Examples have no narration or automatic lip synchronization; replace media paths and durations when using your own assets.

Code is published under the root [MIT License](../LICENSE). Dependencies and bundled fonts retain their own licenses; check Remotion's terms when rendering. Maps use public Natural Earth geographic data.

## TODO: Workbench and Jianying delivery

- [ ] Simplify multitrack editing and local setup.
- [ ] Complete actual Mac Jianying open/edit/export acceptance.

Experimental code is preserved, but development is on hold and these are not promoted as stable release features. The [workbench guide](workbench/README.md) and [delivery notes](docs/jianying-delivery.md) remain for future work. Chart animation stays baked video, not native Jianying chart objects. The current focus is browsing recipes, substituting data, and generating videos through an Agent or a native template.
