# DataMagic Cards

[English](README.en.md) · [返回 DataMagic](../README.md)

DataMagic 的开放数据视频配方库，提供 139 张配方卡、高清动态预览、可编辑源码、示例数据和动画规则。选择喜欢的效果，替换自己的数据与素材，本地渲染成片。

## 公开内容

- **139 张配方卡均附源码、JSON schema 和示例数据**，支持由 Agent 修改和直接运行。
- **109 个图表与文字镜头**：包含条形图、趋势、占比、散点、流程、开场、讲解与结尾，保留数据绑定和动画高亮能力。
- **30 个进阶模板**：包含竖屏榜单、角色主持、数据接管、贡献故事、分层更新、地图、实景与镜头运动。
- **8 套故事蓝图**：提供开场、证据、转折和结论的编排指南，帮助选择配方、准备素材并组织连续镜头。

卡片目录中保留 `ShotCraft-*` 等历史 Composition ID，方便已有项目继续使用；项目品牌为 DataMagic Cards。它是 DataMagic 的公开组成部分。

## 浏览画廊

公开地址：**[https://datamagic.chat/cards/](https://datamagic.chat/cards/)**，无需安装即可浏览。

网页是静态页面，不需要安装 Node 依赖或启动 DataMagic 后端。请在仓库根目录运行：

```bash
python3 -m http.server 5180 --directory cards/gallery
```

浏览器打开 `http://localhost:5180/`。页面提供搜索、专题筛选、中英文切换、并排比较、配方查看和实现指令复制。预览 MP4 和字体随目录提供，克隆后即可本地浏览。不要直接双击 HTML；页面通过 HTTP 读取 JSON 数据。

## 使用可编辑模板

精品故事示例：[角色主持与透视数据板](recipes/CharacterPerspectiveBoard.md)。使用已有生成猫视频，支持自定义角色图片或视频；家庭开支与物流提速两组输入共用同一模板。默认 14 秒无声预览，不提供自动配音或口型同步。

新增故事配方：[主持人让位与数据接管](recipes/PresenterDataTakeover.md)、[反差设问与贡献拆解](recipes/ContrastContributionStory.md)、[持续分层与证据更新](recipes/PersistentTierBoard.md)。均提供 12 秒无声预览及备用主题数据。

左栏优先按场景浏览：讲解与故事 → 实景与情境 → 镜头与转场 → 图表类型。顶部“故事化讲解”专题聚合不同图表形式，不改变底层数据类型。

```bash
cd cards
npm ci
npm test
npm run typecheck
npm run studio
```

需要 Node.js 20 或更高版本。每张原生配方列出了源码、schema 和示例数据路径，均相对于 `cards/`。例如渲染主持人配方：

```bash
npx remotion render src/index.ts ShotCraft-PresenterEvidenceBoard out/presenter.mp4 \
  --props=templates/presenter-evidence-board/sample-data.json
```

竖屏榜单使用独立的 1080×1920 Composition，而不是裁切横屏：

```bash
npx remotion render src/index.ts ShotCraft-PortraitRankedReveal out/portrait.mp4 \
  --props=templates/portrait-ranked-reveal/sample-data.json --codec=h264 --crf=18
```

该模板按“设问 → 倒序揭晓 → 结论”组织 10 秒故事，预留手机右侧操作区和底部字幕区。实际平台覆盖区域仍需预览检查。

替换 props 中的数据和素材即可创建自己的版本。重渲染库中的指定预览：

```bash
npm run render:advanced -- --only=PresenterEvidenceBoard --force
```

### 使用图表与文字镜头

109 个图表与文字镜头的源码位于 `src/legacy/components/runtime_style_templates/`；每张卡片的示例数据和 schema 位于 `templates/runtime-cards/<卡片标识>/`。

例如，替换基础柱状图的示例数据后，在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-BasicBarChart out/basic-bar.mp4 \
  --props=templates/runtime-cards/BasicBarChart/sample-data.json
```

图表与文字镜头默认 1280×720、30 fps、6 秒。数据参数由 `sceneContent` 和 `scene` 组成；数据、显示值与 `template_payload` 的对应字段应同步替换，标签改变时也需更新动画高亮目标。每份配方列出源码、样例、schema 和运行命令。

## 目录

```text
cards/
├── gallery/       静态页面、卡片索引、故事蓝图、字体、封面和 MP4
├── recipes/       139 份配方文档
├── templates/     进阶模板及 runtime-cards/ 下的图表镜头样例与 schema
├── src/           Remotion 注册、runtime/ 渲染入口和 legacy/ 图表源码
├── public/        模板渲染所需的示例素材
├── tests/         数据、动画与资源完整性检查
└── scripts/       原生预览渲染与选镜元数据
```

## 示例与使用范围

### 网页轻量预览

列表默认使用轻量视频，电脑最多同时播放 2 个，手机最多 1 个；离开可视区域会释放视频源。页头“省流模式”开启后只显示封面，点击案例才加载视频。详情默认也使用轻量版，可按实际文件大小切换高清原片；原片保持不变。

需要重建轻量预览时，在安装 FFmpeg（含 `ffprobe`）后运行 `npm run preview:lite`。它只为超过 500KB 的原片生成最长边 960px 的静音预览，保留时间线并使用内容哈希文件名；只有文件确实变小时才采用。重新渲染原片后也应运行此命令，再检查画面和测试。

示例数值为演示或合成数据，不能作为真实统计结论。虚构主持人图片和工业场景视频为生成素材，默认不含配音，也没有自动口型生成；使用自己的素材时，按配方替换相应路径与时长。

代码按仓库根目录的 [MIT License](../LICENSE) 发布。依赖和随附字体遵循各自许可证；使用 Remotion 渲染时请查看其许可条件。地图使用 Natural Earth 公开地理数据。

## TODO：工作台与剪映交付

- [ ] 简化多轨编辑与本机启动流程。
- [ ] 完成 Mac 剪映实际打开、编辑和导出验收。

这部分已有实验代码，暂缓推进，不作为本轮稳定功能推广。保留[工作台说明](workbench/README.md)和[剪映交付记录](docs/jianying-delivery.md)供后续继续；图表动画仍是视频底片，不是剪映原生图表。本轮使用路径是浏览配方、替换数据、由 Agent 或原生模板生成视频。
