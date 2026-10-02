# Recipient-local Jianying handoff — 2026-10-01

This completes the delivery interaction beyond downloading a server ZIP. The reference project's approach is local Agent execution: generate a clean visual plate and native text/audio tracks, adapt recipient Mac draft metadata, install/register the draft, then let the user verify it in Jianying. See its [delivery instructions](https://github.com/Vincentwei1021/video-shotcraft/blob/main/references/jianying-export.md). Our adapter remains independently implemented.

## Implemented

- Local Mac workbench: **发送到剪映** confirms once, renders the edited project when needed, reuses a current completed package, prepares isolated dependencies, creates/registers a uniquely named draft, and attempts to launch Jianying. The browser shows installation progress and errors. Old success messages are cleared before a new installation attempt.
- Agent: `send-to-jianying.mjs --package=... --check` is read-only preflight; `--yes` runs the same installer after local-install consent. The Skill instructs the Agent to perform these steps rather than asking the user to type commands.
- Remote-rendered package: unzip and double-click `Open-in-Jianying.command`. Native graphical confirmation replaces typing `yes` or shell commands. Dependencies stay in the package's `.venv`; the local workbench reuses `out/jianying-runtime/`.
- Preflight checks the recipient OS, Python version, package integrity, app-not-running condition, readable recipient donor metadata, and draft registry before dependency/draft writes. It does not force-quit Jianying, invent device fields, overwrite existing drafts, or install to system Python.
- Desktop writes require a Mac server, a loopback peer and loopback Host, same-origin POST, a local capability token, and explicit confirmation. Remote/server visitors receive an explanatory dialog instead of a false local-install success.
- Runtime checks include the ability to load MediaInfo, not merely import Python packages. Official pymediainfo wheels [bundle the media library on Intel and ARM Macs](https://pymediainfo.readthedocs.io/en/stable/introduction.html#pypi-on-linux-macos-and-windows); unsupported environments stop rather than proceeding with a missing parser.

## Verified

- 114 Node tests passed, including loopback/DNS-rebinding checks, confirmation/token/origin guards, incomplete-package rejection, asynchronous installer progress, and failure handling.
- Python installer tests verified no action without confirmation, refusal on Linux, read-only checks against real manifest/donor/registry fixtures, prerequisite failure before dependency writes, unique safe names, runtime reuse, and preserved installed drafts when app launch fails.
- Template/workbench type checks and production build passed; dependency audit reported zero vulnerabilities.
- `desktop-ui-acceptance.cjs` exercised the real browser editor with simulated Mac capability and installer responses: cancel causes no export; confirmation connects render/install; unchanged packages are reused; failures clear old success; 390px layout has no overflow. Actual remote install requests to the Linux server were refused. Mac installation in this test is explicitly simulated.
- Real export `ab32cdb6-aab3-46ca-bc28-e2836af91a10` produced an 8-second, 240-frame MP4 and a ZIP containing the new GUI launcher, installer, draft tool, media and manifest. The full browser editing/export acceptance passed again with no page errors. Linux Windows-format structural checks found two text tracks and two audio tracks.
- `mac-structure-acceptance.py` generated recipient-Mac-format metadata using synthetic donor fields in an isolated temporary library. It checked registry backup, old-entry preservation, resource-local media, and two text/audio tracks. This is a format simulation, not Mac application validation.
- `refresh-installer.mjs` can refresh recipient scripts in a new export ID without rerendering unchanged media or overwriting existing outputs. It skips runtime/cache directories and validates media checksums before ZIP creation.

## Remaining actual desktop check

No actual Mac or Jianying GUI is available on this Linux host. Python 3.10+, first-use network access, system download permissions, and readable donor drafts remain real prerequisites. Encrypted-only libraries or incompatible versions fail clearly. Launching an app is not proof that a draft loaded: a recipient must open the new draft, edit text/audio, trim a shot and export MP4, recording macOS/Jianying versions. Until then, Mac compatibility remains experimental. This change has not been pushed to GitHub or deployed as a public editor service.
