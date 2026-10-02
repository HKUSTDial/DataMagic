# Entity imagery

The 139-card catalog was reviewed for meaningful image associations. 60 previews now include identity-bound imagery: 22 native examples and 38 runtime examples. Time-axis labels, coordinate values, abstract measures and text-only editorial layouts are kept readable without unrelated decoration.

- Native examples use optional `iconSrc` on entities, rows, regions, items or series. Existing JSON schemas document each placement.
- Runtime examples accept exact-label `sceneContent.entity_icons` mappings, or supported row-level `iconSrc`. Do not map these by array index or rank.
- Keep labels, units and numeric values visible. Reveal entity images with their names, and preserve supplied imagery across transitions and rank changes.
- Flag SVGs are from flag-icons under MIT; the bundled LICENSE and source README are in `public/icons/flags`.
- Six brand marks are sourced from Simple Icons under CC0-1.0; provenance is in `public/icons/brands`. Generic fictional entities use illustrations, not invented official logos.
- Coffee/category/region illustrations are original code-native SVGs. Region locator pictures are schematic and are not maps or national emblems.

Use `node scripts/render_entity_previews.cjs` to rebuild the audited examples, then `npm run preview:lite` to update the bandwidth-efficient list videos. The full audit is retained in `references/entity-imagery-audit.json`; `--only=SlugA,SlugB` can render specific cards independently.

## Verification (2026-10-02)

All 60 updated videos pass full decoding, resolution, frame-count and asset-hash checks through `scripts/verify_entity_previews.cjs`. Static text regions in three representative previews were checked across consecutive frames for font fluctuations. Type checking and all 132 tests pass. The complete catalog's list previews total 30.49 MB, versus 78.51 MB for original MP4s; the gallery retains lazy loading. The 72-second narrated walkthrough and 30-second promotional film were also rebuilt with the updated examples.
