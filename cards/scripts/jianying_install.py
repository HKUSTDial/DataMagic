"""Recipient-local Jianying installation for Agents, the workbench and double-click delivery."""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time
import uuid


def tool_for(bundle):
    spec = importlib.util.spec_from_file_location('datamagic_draft_tool', Path(bundle) / 'draft_tool.py')
    tool = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(tool)
    return tool


def preflight(bundle, draft_root=None, donor=None):
    if sys.platform != 'darwin':
        raise ValueError('请在你的 Mac 上运行本机工作台或双击安装入口；服务器不能安装到你的剪映。')
    if sys.version_info < (3, 10):
        raise ValueError('首次使用需要 Python 3.10+。请安装后重试；不会修改系统 Python。')
    bundle = Path(bundle).resolve(strict=True)
    for name in ('draft_tool.py', 'requirements.txt', 'manifest.json'):
        if not (bundle / name).is_file():
            raise ValueError('交付包不完整，请重新导出并保留整个解压文件夹。')
    tool = tool_for(bundle)
    if not hasattr(tool, 'mac_preflight'):
        raise ValueError('这是旧版交付包，请在最新工作台重新导出后重试。')
    tool.validate(bundle)
    root = Path(draft_root).resolve(strict=True) if draft_root else tool.mac_draft_root()
    tool.mac_preflight(root, donor)
    return tool, root


def unique_name(label):
    label = re.sub(r'[/\\:\x00-\x1f]', '-', label).strip(' .')[:32] or 'Cards'
    return f'DataMagic-{label}-{time.strftime("%Y%m%d-%H%M%S")}-{uuid.uuid4().hex[:6]}'


def run(command, timeout=300):
    result = subprocess.run(command, capture_output=True, text=True, timeout=timeout)
    if result.returncode:
        # Do not expose pip mirror credentials, package logs or local device fields.
        raise ValueError('本机依赖准备或草稿工具执行失败。请检查 Python、网络与文件权限后重试；不会覆盖旧草稿。')
    return result.stdout


def prepare_runtime(bundle, runtime, progress):
    runtime = Path(runtime).resolve()
    executable = runtime / 'bin/python'
    requirement = Path(bundle) / 'requirements.txt'
    expected = requirement.read_text(encoding='utf-8')
    marker = runtime / '.datamagic-requirements'
    if not executable.is_file():
        progress('首次准备独立 Python 环境，不修改系统 Python…')
        run([sys.executable, '-m', 'venv', str(runtime)], 120)
    verifier = 'import pyJianYingDraft; from PIL import Image; from pymediainfo import MediaInfo; assert MediaInfo.can_parse()'
    check = subprocess.run([str(executable), '-c', verifier], capture_output=True)
    if check.returncode or not marker.is_file() or marker.read_text(encoding='utf-8') != expected:
        progress('首次安装剪映导出依赖；需要联网，后续可复用…')
        run([str(executable), '-m', 'pip', 'install', '--disable-pip-version-check', '--only-binary=pymediainfo', '-r', str(requirement)])
        run([str(executable), '-c', verifier], 30)
        marker.write_text(expected, encoding='utf-8')
    return executable


def launch_jianying():
    candidates = [Path('/Applications/剪映专业版.app'), Path('/Applications/JianyingPro.app'), Path.home() / 'Applications/剪映专业版.app', Path.home() / 'Applications/JianyingPro.app']
    application = next((str(p) for p in candidates if p.is_dir()), None)
    command = ['open', '-a', application] if application else ['open', '-b', 'com.lemon.lvpro']
    try:
        return subprocess.run(command, capture_output=True, timeout=15).returncode == 0
    except (OSError, subprocess.TimeoutExpired):
        return False


def install(bundle, *, confirmed=False, draft_root=None, donor=None, runtime=None, label='Cards', open_app=True, progress=lambda message: None):
    if not confirmed:
        raise ValueError('需要确认：将安装隔离依赖并新建本机剪映草稿，不覆盖已有草稿。')
    bundle = Path(bundle).resolve(strict=True)
    _, root = preflight(bundle, draft_root, donor)  # All recipient checks precede dependency or draft writes.
    executable = prepare_runtime(bundle, runtime or bundle / '.venv', progress)
    name = unique_name(label)
    progress('正在生成本机草稿、打包素材并登记到剪映…')
    command = [str(executable), str(bundle / 'draft_tool.py'), '--bundle', str(bundle), '--draft-root', str(root), '--name', name, '--platform', 'mac']
    if donor:
        command.extend(['--donor', str(Path(donor).resolve(strict=True))])
    run(command)
    target = root / name
    if not (target / 'datamagic-validation.json').is_file() or not (target / 'draft_info.json').is_file():
        raise ValueError('草稿生成未完成，请重试；旧草稿没有被覆盖。')
    opened = launch_jianying() if open_app else False
    return {'status':'installed', 'draftName':name, 'draftPath':str(target), 'appLaunched':opened, 'desktopValidated':False,
        'message':'草稿已加入剪映。请检查字幕、音频并导出一次。' if opened else '草稿已加入剪映，请手动打开剪映，在草稿列表找到新工程。'}


def dialog(message, confirmation=False):
    buttons = '{"取消", "安装并打开剪映"}' if confirmation else '{"知道了"}'
    script = f'on run argv\n display dialog (item 1 of argv) with title "DataMagic → 剪映" buttons {buttons} default button {2 if confirmation else 1}\nend run'
    return subprocess.run(['osascript', '-e', script, message], capture_output=True).returncode == 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bundle', default=str(Path(__file__).resolve().parent))
    parser.add_argument('--draft-root')
    parser.add_argument('--donor')
    parser.add_argument('--runtime')
    parser.add_argument('--label', default='Cards')
    parser.add_argument('--yes', action='store_true', help='Use only after the user approved local installation')
    parser.add_argument('--preflight', action='store_true')
    parser.add_argument('--json', action='store_true')
    parser.add_argument('--gui', action='store_true')
    parser.add_argument('--no-open', action='store_true')
    args = parser.parse_args()
    def emit(value):
        print(json.dumps(value, ensure_ascii=False) if args.json else value.get('message', str(value)), flush=True)
    try:
        if args.preflight:
            preflight(args.bundle, args.draft_root, args.donor)
            emit({'status':'available','message':'本机安装检查通过；没有修改任何草稿。'})
            return
        approved = args.yes
        if args.gui:
            if sys.platform != 'darwin':
                raise ValueError('这个入口需要在接收者 Mac 上运行。')
            approved = dialog('请先用 Cmd+Q 完全退出剪映。\n确认后自动生成新草稿并打开剪映，不覆盖旧草稿。\n首次需要 Python 3.10+ 和联网安装隔离依赖。', True)
            if not approved:
                return
        result = install(args.bundle, confirmed=approved, draft_root=args.draft_root, donor=args.donor, runtime=args.runtime, label=args.label, open_app=not args.no_open, progress=lambda message: emit({'type':'progress','message':message}))
        emit(result)
        if args.gui:
            dialog(result['message'])
    except (OSError, ValueError, KeyError, subprocess.TimeoutExpired) as error:
        message = str(error)
        emit({'status':'failed','message':message})
        if args.gui and sys.platform == 'darwin':
            dialog(message)
        raise SystemExit(1)


if __name__ == '__main__':
    main()
