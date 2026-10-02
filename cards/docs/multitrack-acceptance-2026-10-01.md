# Multitrack workbench acceptance — 2026-10-01

This records Linux/internal-browser verification, not Mac Jianying desktop acceptance or a public deployment.

## Implemented path

Local gallery → selected card launch instructions → live Remotion Player → frame-based visual/text/audio tracks → edited MP4 or portable Jianying package. The workbench registers 139 cards: 30 native schema-editable templates and 109 baked reference videos. It supports local media import, clip move/trim/split, cross-track placement, layer visibility/order, constant speed, transforms, undo/redo, autosave, and project JSON import/export. Native template clocks retain source duration when trimmed.

The editor is localhost-first. The public static gallery does not run an unauthenticated rendering server. Template source and generated assets remain distinct from internal reference footage.

## Evidence

- 109 Node tests passed; template and workbench TypeScript checks passed.
- Workbench production build passed. Its approximately 699KB gzip JS bundle remains a build size warning; it is a local editor, not added to the public gallery startup.
- Python suite: 17 tests, 14 passed and 3 old media integration tests skipped. Separate real multitrack package checks described below ran successfully.
- Dependency audit: zero reported vulnerabilities at verification time.
- Updated Agent Skill passed the skill validator and routes local workbench delivery separately from template rendering.
- Real browser acceptance tested property edits, pointer move/trim, split and undo, layer hide/order, JSON round-trip, autosave, 139/30 library counts, and 390px layout. No browser page errors were recorded.
- Export `44aaef5c-34f1-469c-bc48-2b24ac01c5b1`: 8 seconds, 1920×1080, 240 frames, four workbench tracks, two native cards, two overlapping independent text clips and two audio clips. Actual MP4 (~1.5MB) and ZIP (~2.5MB) were generated. Asset checksums/paths validated; a structural Windows-format draft had two text tracks and two audio tracks. This is a technical test composition, not a finished promotional story.
- Browser/render comparison at frames 30, 90 and 210 found mean absolute RGB differences of 0.253, 0.288 and 0.426 on a 0–255 scale. Images are not byte-identical; after isolating editor CSS, inspection found no missing template headers/footers or major layout divergence at those sampled frames. This does not certify all frames of all templates.
- Independent-worker MP4 export `8e77aca0-e6f7-4ef3-bbfa-d07b93d5f03b` succeeded for the same 240-frame project. Ninety status polls and editor requests remained responsive; maximum measured status latency was 2ms on the internal test host. This is not a public-network latency guarantee.

Test outputs live under ignored `cards/out/motion/<id>/`; they are not committed deliverables. The repeatable scripts are `workbench/motion/scripts/acceptance.cjs`, `parity.mjs`, and `worker-acceptance.mjs`; internal browser/Python paths must be adjusted on another machine.

## Fixes found during acceptance

1. Keep original template duration inside trimmed clips rather than substituting timeline clip duration.
2. Isolate editor CSS from template rendering.
3. Generate UUIDs on insecure internal HTTP without requiring `crypto.randomUUID`.
4. Capture undo snapshots before deferred React state updates; ignore unchanged edits.
5. Run export compilation/probing/rendering in a separate process so HTTP progress queries do not stall.
6. Preserve autosaved state on immediate reload, reject unsafe media paths, and permit caption overlap only on independent draft text tracks.

## Remaining release gate

On the recipient Mac, completely quit Jianying, unpack the portable ZIP, and run its `Open-in-Jianying.command`. Verify the draft opens without missing assets, both text layers are independently editable, audio can be adjusted, shots can be trimmed, and MP4 export succeeds. Record macOS and Jianying versions. Encrypted-only donor libraries must fail clearly; do not upload device-bearing generated drafts.

Until that test passes, label Mac Jianying integration experimental. The editor source is ready for review/release preparation; this work did not push GitHub changes or deploy the editor to the public server.
