# Contributing to DataMagic

Thanks for your interest in DataMagic. The repo is currently **docs-first** —
the production product lives at [datamagic.chat](https://datamagic.chat/), while this
repository holds the public documentation, the published paper artifacts, and the
[`datamagic-video`](./datamagic-video/) skill for AI coding agents.

So contributions today land in one of four buckets:

| Bucket | Examples |
|---|---|
| Docs (Chinese / English) | typo fixes, clearer explanations, broken links, missing context |
| The `datamagic-video` skill | new rule pages, refining narrative patterns, chart-selection guidance, anti-patterns |
| Examples | new input/output examples under `docs/input-output-examples*.md` |
| Infrastructure | CI, link checking, lint config |

Please open an Issue first for anything beyond a small fix so we can align on scope.

## Quick start

```bash
git clone https://github.com/HKUSTDial/DataMagic
cd DataMagic
```

The repo has no build step. To preview your edits, just open the Markdown files
locally (or in your editor's preview pane). To match what CI checks, run:

```bash
# Markdown lint (matches the rules in .markdownlint.json)
npx --yes markdownlint-cli@0.41.0 "**/*.md" --ignore node_modules

# Link check on a single file
npx --yes markdown-link-check@3.12.2 -c .markdown-link-check.json README.md
```

## Style

- Keep both `README.md` (中文) and `README.en.md` (English) in sync when editing
  shared sections (links, badges, examples, roadmap).
- For per-doc Chinese / English pairs under `docs/`, edit both files in the same PR.
- Don't add new top-level files unless necessary — prefer extending an existing doc.
- The `datamagic-video` skill has its own conventions; read `datamagic-video/SKILL.md`
  before adding or restructuring rules there.

## CI

Every push and PR runs the `docs` workflow ([.github/workflows/docs.yml](./.github/workflows/docs.yml)):

- **markdownlint** — across the whole repo, using `.markdownlint.json`
- **link check** — only the Markdown files changed in the PR, using
  `.markdown-link-check.json`

Both jobs run on Node 20 and finish in well under a minute. Please make sure they
pass locally before opening a PR.

## Reporting issues

For product bugs (the hosted app at datamagic.chat), please include a reproducer,
the dataset shape, and the generation mode you used (Full Pipeline / Fast / Single
Chart). For skill / docs issues, link the exact file and line.
