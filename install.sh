#!/usr/bin/env bash
# DataMagic plugin installer.

set -euo pipefail

REPO="HKUSTDial/DataMagic"
PLUGIN="datamagic-video"
MARKETPLACE="datamagic"

usage() {
  cat <<'EOF'
Usage: bash install.sh [--only claude|codex|all] [--ref REF]

Examples:
  curl -fsSL https://raw.githubusercontent.com/HKUSTDial/DataMagic/main/install.sh | bash
  curl -fsSL https://raw.githubusercontent.com/HKUSTDial/DataMagic/main/install.sh | bash -s -- --only codex
  bash install.sh --only claude

Options:
  --only <target>  claude, codex, or all (default: all)
  --ref <ref>      Git ref for Codex marketplace add (default: main)
  -h, --help       Show help
EOF
}

target="all"
ref="main"

while [ "$#" -gt 0 ]; do
  case "$1" in
    --only)
      target="${2:-}"
      [ -n "$target" ] || { echo "error: --only requires claude, codex, or all" >&2; exit 2; }
      shift 2
      ;;
    --ref)
      ref="${2:-}"
      [ -n "$ref" ] || { echo "error: --ref requires a value" >&2; exit 2; }
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "error: unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

case "$target" in
  claude|codex|all) ;;
  *) echo "error: --only must be claude, codex, or all" >&2; exit 2 ;;
esac

install_claude() {
  if ! command -v claude >/dev/null 2>&1; then
    echo "datamagic: skip Claude Code; claude command not found" >&2
    return 0
  fi
  claude plugin marketplace add "$REPO"
  claude plugin install "$PLUGIN@$MARKETPLACE"
}

install_codex() {
  if ! command -v codex >/dev/null 2>&1; then
    echo "datamagic: skip Codex; codex command not found" >&2
    return 0
  fi
  codex plugin marketplace add "$REPO" --ref "$ref"
  codex plugin add "$PLUGIN@$MARKETPLACE"
}

case "$target" in
  claude) install_claude ;;
  codex) install_codex ;;
  all)
    install_claude
    install_codex
    ;;
esac
