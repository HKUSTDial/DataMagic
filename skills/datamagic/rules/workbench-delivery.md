# Multitrack workbench and Jianying delivery

Use when the user wants to continue editing Cards in a browser or deliver to Jianying. Locate the companion `cards/` with the existing Cards helper; do not assume a server path or silently install dependencies.

From that Cards directory, with Node 20.10+, dependencies, ffmpeg/ffprobe and a usable Chrome available:

```bash
npm ci
node workbench/motion/scripts/open.mjs --card=RankedReveal
```

Use the actually selected slug. `--no-open` starts without opening a browser. Default address is `http://127.0.0.1:5190/`; this is a local editing tool, not a public deployment. Preserve existing browser-saved edits; an explicitly requested card can be added rather than replacing the saved project.

The project has version 2, 30fps, 1080p landscape/portrait, frame-based tracks and clips. 30 native templates expose their existing JSON schemas and props. 109 reference previews can be placed as baked videos but do not become editable charts. Each clip supports start, duration, source in, constant speed, opacity, scale, position and volume. Higher-index tracks are higher layers. Native source clocks retain the original template's duration even when clipped; do not substitute edited clip duration into the template's own reveal validation.

The workbench saves locally and imports/exports project JSON. Preserve user audio and image provenance; imported assets remain on the machine running the tool. Its MP4 exporter uses the same composition as its Player. The 109 chart/text cards now have editable source for standalone rendering, while this paused experimental workbench still places their previews as baked media. Do not imply its editor exposes their new runtime props or automatically generates narration.

Jianying export renders the current visual composite into a clean plate, split at visual clip boundaries. Builtin text clips become separate native text tracks, and audio clips (including embedded video audio) become separate audio assets with authored trim/speed/volume applied. Put text tracks above visual tracks before Jianying export. Visual layering and chart labels remain baked; data changes belong in the workbench. Font and layout conversion require recipient desktop review.

## Send to Jianying on the recipient Mac

Prefer the local workflow, matching the reference project's Agent-driven delivery: do the mechanics for the user rather than handing them installation commands. The local workbench's **发送到剪映** button renders the current project if necessary, prepares a reusable isolated Python environment, creates and registers a new draft, and attempts to launch Jianying. It requires a loopback connection to a Mac server; a browser on a Mac visiting a Linux server is not sufficient.

For an existing completed package, the Agent can check without installing:

```bash
node workbench/motion/scripts/send-to-jianying.mjs --package=/absolute/path/package --check
```

After the user approves local dependency preparation and creating a new draft, completely quit Jianying with Cmd+Q, then execute on the recipient Mac:

```bash
node workbench/motion/scripts/send-to-jianying.mjs --package=/absolute/path/package --yes
```

The helper uses `out/jianying-runtime/` for reusable dependencies, never system Python. Python 3.10+ is required; if missing, explain setup without silently installing system tools. `--draft-root=` and `--donor=` allow explicit recipient-local overrides. Do not force-kill Jianying or repeat a failed install indefinitely; stop at unreadable/encrypted donor drafts, changed registry, or incompatible versions and report the precise blocker.

For a package rendered elsewhere, the user can unzip and double-click `Open-in-Jianying.command`; graphical confirmation replaces typing shell commands. Download permissions or macOS security can require right-click Open or Agent assistance—do not disable system security. Do not describe a server URL as one-click access to the user's local draft library.

The installer reads device fields only on the recipient Mac from a readable local draft; encrypted-only draft libraries fail clearly. Never distribute a generated Mac draft containing device identifiers. Share the original portable package. A successful render, installer-process simulation, or structural draft test is not desktop acceptance: report actual tested steps and request open/edit/export verification on the recipient Mac. Launching the app alone is not proof the draft loaded.
