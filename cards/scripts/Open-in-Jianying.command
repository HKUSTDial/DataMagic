#!/bin/bash
# Double-click entry: confirmation and results are graphical, not shell commands.
set -e
cd "$(dirname "$0")"
if [ "$(uname -s)" != "Darwin" ]; then
  printf 'This launcher is for macOS only.\n'
  exit 1
fi
if ! command -v python3 >/dev/null 2>&1; then
  osascript -e 'display dialog "首次需要 Python 3.10+。安装后重新双击此文件；不会修改系统 Python。" with title "DataMagic → 剪映" buttons {"知道了"}'
  exit 1
fi
python3 jianying_install.py --gui --bundle .
