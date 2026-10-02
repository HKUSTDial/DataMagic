# 剪映交付 / Jianying delivery — experimental

交付有两个入口：**[多轨工作台](../workbench/README.md)** 支持原生模板、参考视频、自有媒体、独立文字和音频组合导出；下面的命令行快捷适配器仅支持 **RankedReveal 倒序揭晓排行榜**，2–4 项，1920×1080、30fps、10 秒。
Use the multitrack workbench for mixed timelines. The standalone CLI adapter documented below remains RankedReveal-only.

工作台包中，视觉图层合成为底片，并按镜头边界拆成可裁剪片段；工作台独立文字层转为原生文本轨，音频转为独立音轨，支持同时重叠的多个文字/音频轨。模板内部的图表标签和动画仍是底片，不是剪映原生图表。文字层须位于视觉层上方；工作台在导出前检查这一限制。Mac 创建方法和真机验收要求与下文一致。

## 生成交付包 / Export a portable package

在仓库 `cards/` 下安装 Node 依赖后：

```bash
npm run export:jianying -- --out=/absolute/path/new-package
```

可选 `--props=/absolute/path/my-data.json`、`--browser=/absolute/path/chrome`。
可选 `--audio=/absolute/path/narration.wav` 将已有音频独立放到时间线起点，最长截为 10 秒；不会生成声音或自动对齐字幕。字幕时间来自模板的作者事件。
每次使用新输出目录；不会覆盖之前的输出。失败目录没有 `READY.json`，不可作为完整交付包。

包中包含 `media/plate.mp4`（无讲解字幕、无音轨）、`captions.srt`、`manifest.json`、`source-data.json`、封面、草稿工具和固定依赖版本。数据标签、标题、来源和图表动画仍在底片内。

## 在接收者电脑生成草稿 / Build on the recipient machine

将整个交付包下载并解压到自己的电脑。要求 Python 3.10+；先退出剪映，保留已有草稿的备份。

### Mac 快速测试

**推荐：在 Mac 本机工作台点“发送到剪映”**。确认后自动完成渲染、依赖准备、草稿安装和尝试打开剪映；不用下载和解压。

服务器生成的包：先用 Cmd+Q 完全退出剪映，解压后**双击 `Open-in-Jianying.command`**，在图形提示里确认。不必手工输入安装命令。需要 Python 3.10+；下载文件权限或 macOS 安全提示可能影响双击，可右键打开或交给本机 Agent 执行。手动备用入口：

```bash
bash Open-in-Jianying.command
```

确认后会先检查包和本机剪映，再创建独立 Python 环境、安装固定版本依赖、生成新草稿并尝试打开剪映。后续复用环境，不反复安装；不安装到系统 Python，不覆盖旧草稿。下载包使用包内 `.venv`，本机工作台使用 `cards/out/jianying-runtime/`。

Agent 安装入口见[工作台指南](../workbench/README.md)：智能体在本机执行检查和安装，不再要求用户手工复制草稿目录。服务端禁止远程写入草稿；缺少明文旧草稿仍然会停止，这与参考项目的适配边界一致。

工具默认查找 `~/Movies/JianyingPro/User Data/Projects/com.lveditor.draft`，自动扫描其中的可读 Mac 草稿。自定义草稿目录请使用下面的手动命令。设备字段仅在本机读取和使用，不上传，也不打印。

### 手动执行 / Manual execution

```bash
python -m venv .venv
# Windows: .venv\Scripts\python.exe；Mac: .venv/bin/python
python -m pip install -r requirements.txt
python draft_tool.py --check-only
python draft_tool.py --draft-root "你的剪映草稿目录" --name "DataMagic-Ranking-01"
```

上述 `python` 请使用新建 venv 的解释器。默认自动识别 Mac／Windows。媒体复制到草稿内部，绝不引用服务器路径；同名草稿拒绝覆盖。

Mac 模式是 **实验性适配，尚未在真机验证**。必须在接收者 Mac 上执行，自动查找本机可读取的旧草稿以取得平台字段；也可显式指定：

```bash
.venv/bin/python draft_tool.py --draft-root "你的剪映草稿目录" --name "DataMagic-Ranking-01" --platform mac --donor "本机明文旧草稿目录"
```

若旧草稿已加密或找不到，不尝试解密、伪造设备标识；工具中止，此时可手动导入底片和 SRT。Mac 模式新增登记项前备份 `root_meta_info.json`，不删除旧草稿。生成后的 Mac 草稿可能包含本机设备字段，**不要公开上传**；对外分享原始交付包，让对方重新生成。

草稿入口使用 `draft_info.json`，媒体放在草稿内的 `Resources/`，并登记媒体池和草稿列表，封面使用 JPEG。若生成期间草稿列表发生变化，会拒绝替换列表；失败可能留下新建的未登记草稿目录，不会覆盖或删除原有草稿，请换名称重试。

## 可编辑范围 / Editing boundaries

- 剪映：每个揭晓阶段的镜头可裁剪、重排、变速；讲解字幕是原生文本轨；提供音频时为独立音轨。
- 模板：图表数字、排名、标题、标签和动画必须修改 `source-data.json` 后重新渲染，不是剪映原生图表。
- 字幕字体与位置是近似换算，首次导入需检查；不要把“生成 JSON 成功”当作剪映已经打开成功。
- 无旁白的示例是无声交付，不能宣称口播同步或口型已验证。
- 交付包不包含浏览器编辑服务；本机多轨工作台随仓库提供。旧 `workbench/server.py` 仅保留为榜单回归测试入口。不支持海外 CapCut，也不保证任意剪映版本兼容。

## 验收 / Desktop acceptance

1. 打开草稿，不出现损坏、丢失素材、权限警告。
2. 播放完整 10 秒；字幕只出现一份，逐项揭晓与读数正确。
3. 双击字幕，修改内容、字号与颜色。
4. 裁剪或重排一个镜头；有音频时修改音量。
5. 在剪映导出 MP4，记录操作系统、剪映版本和上述结果。

当前服务器只验证结构、时间线与素材完整性，**Mac／Windows 剪映打开及导出仍待真机验收**。

实现使用固定依赖 [pyJianYingDraft](https://github.com/GuanYixuan/pyJianYingDraft)。
分层交付与 Mac 格式差异参考 [Video ShotCraft 导出说明](https://github.com/Vincentwei1021/video-shotcraft/blob/main/references/jianying-export.md)；本项目适配代码独立编写，并未直接移植该模块。
