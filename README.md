<div align="center">
<img src="./assets/datamagic_logo.png" width="380" alt="DataMagic Logo">

**挑一个喜欢的效果，用自己的数据讲故事。**

*可复用的动态图表与数据故事配方库，面向创作者、分析师和研究者。*

[![IEEE VIS 2026](https://img.shields.io/badge/IEEE_VIS_2026-Accepted-007b8f)](https://arxiv.org/abs/2609.33403)
[![VLDB 2026 Demo](https://img.shields.io/badge/VLDB_2026-Demo_Track-blue)](https://arxiv.org/abs/2606.20388)

[中文](README.md) | [English](README.en.md)

[观看展示](#showcase) · [浏览配方](https://datamagic.chat/cards/) · [开始制作](#create) · [组合故事](#stories) · [在线体验](https://datamagic.chat/) · [研究与引用](#research)
</div>

DataMagic 提供 **139 张动态配方卡**，每张都有动画预览、可编辑源码和示例数据。选中一个效果，将实现指令和自己的数据交给编程智能体；配套的 `datamagic` Skill 会指导它读取配方、修改模板、渲染视频并检查结果。

## ✨ 最近更新

- **[2026.10.02]** 🎉 发布 **[DataMagic 动态配方库](https://datamagic.chat/cards/)**：139 张可预览、可编辑的数据图表与故事配方，配套 **[datamagic Skill](skills/datamagic/)**，让编程智能体用你的数据制作视频。
- **[2026.08.09]** 📄 我们的长文 **[DataMagic: Authoring Data Videos through Declarative Multi-Agent Orchestration](https://arxiv.org/abs/2609.33403)** 被 **IEEE VIS 2026** 录用。
- **[2026.06.20]** 🚀 **[DataMagic 在线系统](https://datamagic.chat/)** 正式上线，支持从表格数据生成带旁白的数据视频。
- **[2026.06.18]** 📄 我们的论文 **[DataMagic: Transforming Tabular Data into Data Insight Video](https://arxiv.org/abs/2606.20388)** 被 **VLDB 2026 Demo Track** 录用。

<a id="showcase"></a>

## 🎬 先看效果：把数据变成可以讲述的画面

角色主持、透视数据板、动态柱状图竞赛、实景证据、趋势运镜与多层地图滑行——下面的完整 30 秒集锦展示六种表达方式。

https://github.com/user-attachments/assets/6e9b939a-60e8-4e03-ae8a-b60fb23cf9c7

展示片使用库内实际动画与演示数据，适合快速了解效果；下面每张卡片都能进一步查看对应配方。用自己的数据制作时，图表数值、文字和素材可以独立替换。

<a id="examples"></a>

## ✨ 看看可以做什么

下方 GIF 自动展示动画效果；点击动图观看高清预览，点击配方查看实现说明与源码位置。

| 角色主持与数据板 | 主持人让位，图表接管 | 倒序揭晓排行榜 |
|---|---|---|
| [![角色主持与透视数据板](cards/gallery/media/readme/CharacterPerspectiveBoard.gif)](https://datamagic.chat/cards/#CharacterPerspectiveBoard) | [![主持人与数据交接](cards/gallery/media/readme/PresenterDataTakeover.gif)](https://datamagic.chat/cards/#PresenterDataTakeover) | [![倒序揭晓排行榜](cards/gallery/media/readme/RankedReveal.gif)](https://datamagic.chat/cards/#RankedReveal) |
| 用角色、透视数据板和分步证据组织讲解。[配方](cards/recipes/CharacterPerspectiveBoard.md) | 随讲解切换人物与数据的主次。[配方](cards/recipes/PresenterDataTakeover.md) | 从悬念到揭晓，逐步建立比较。[配方](cards/recipes/RankedReveal.md) |

| 实景转入数据证据 | 沿时间线讲变化 | 地图与区域比较 |
|---|---|---|
| [![实景转入数据证据](cards/gallery/media/readme/FootageEvidenceReveal.gif)](https://datamagic.chat/cards/#FootageEvidenceReveal) | [![趋势时间线镜头](cards/gallery/media/readme/ChartTimelineTravel.gif)](https://datamagic.chat/cards/#ChartTimelineTravel) | [![区域地图与排名](cards/gallery/media/readme/ChoroplethRankMap.gif)](https://datamagic.chat/cards/#ChoroplethRankMap) |
| 先展示场景，再引入关键指标。[配方](cards/recipes/FootageEvidenceReveal.md) | 镜头沿时间推进，停留在关键变化。[配方](cards/recipes/ChartTimelineTravel.md) | 结合地理分布与排名解释差异。[配方](cards/recipes/ChoroplethRankMap.md) |

配方库还包含柱状图、折线图、占比、散点、流程、开场、结尾和转场等效果，以及适合手机内容的 [9:16 竖屏榜单](cards/recipes/PortraitRankedReveal.md)。你可以修改数据、文案、颜色、素材和动画节奏，保存可继续编辑的源码。

**[浏览全部配方 →](https://datamagic.chat/cards/)**

## 🎯 为不同的数据内容找到表达方式

| 你想讲什么 | 可以选择的画面 | 适合的内容 |
|---|---|---|
| 一个值得解释的现象 | 主持人、角色窗口、透视数据板 | 财经讲解、科普、自媒体解读 |
| 谁领先，谁发生了变化 | 排名揭晓、竞赛柱状图、名次变化 | 行业榜单、品牌竞争、赛事数据 |
| 增长从哪里来 | 趋势扫描、重点放大、贡献比较 | 财报、经营复盘、产品增长 |
| 不同地方有什么差异 | 区域地图、路线累积、地图排名 | 城市、人口、区域经济与交通 |
| 现场画面说明了什么 | 实景转入证据、负空间数据叠加 | 工业、环境、新闻与纪录式内容 |

### 看得到，也改得动

- **从喜欢的效果开始**：先看动画，再选配方；也可以让 Agent 根据数据推荐。
- **保留调好的镜头节奏**：复用对应源码，调整入场、聚焦、高亮和结尾停留。
- **用自己的数据与品牌**：替换数值、标签、单位、标题、颜色和素材；国家用国旗，品牌用 Logo，类别用插图，图像随对象移动、换位与揭晓。
- **从图表扩展到讲解**：将人物、实景、图表和结论组合成连续的叙事镜头。
- **继续编辑与复用**：保存视频和实现源码，下一次换主题时继续修改。

<a id="create"></a>

## 🚀 用自己的内容制作

### 先看一次真实上手过程

用咖啡店销量 CSV 生成带饮品图标的动态柱状图，再修改标题、突出拿铁、延长结尾。各饮品保留不同配色，图标与名称一起随排名移动。下面的 72 秒演示从中文搜索“动态柱状图竞赛”开始，串起选配方、复制指令、提出任务、生成与修改，配有中文旁白与内嵌字幕。页面操作为真实录屏，任务面板为标注清楚的流程演示；修改后的成片完整播放。

<video src="assets/walkthrough-v2/datamagic-workflow-v2.mp4" poster="assets/walkthrough-v2/v2-final.png" width="960" style="max-width:100%;height:auto" controls playsinline preload="none">
  <a href="assets/walkthrough-v2/datamagic-workflow-v2.mp4">播放完整上手演示</a>
</video>

[播放 / 下载新版](assets/walkthrough-v2/datamagic-workflow-v2.mp4) · [数据、指令与复现记录](cards/examples/agent-workflow-demo/README.md) · [新旧版对比页](assets/walkthrough-v2/index.html) · [旧版保留](assets/walkthrough/datamagic-first-video-zh.mp4)

### 1. 选择一个效果

在配方库里查看动画，点击“复制实现指令”。还没确定效果时，也可以把数据和用途交给智能体，让它推荐合适的配方。

支持中文和英文关键词搜索，不必输入代码标识。例如搜“猫主持”“柱状”或“条形图竞赛”，也可以用空格组合关键词，如“国家 排名”。

### 2. 把配方和数据交给 Agent

下载仓库，在仓库目录中打开你使用的编程智能体：

```bash
git clone https://github.com/HKUSTDial/DataMagic.git
cd DataMagic
```

粘贴实现指令，附上数据文件和要求，例如：

> 使用仓库里的 datamagic Skill，把我的 sales.csv 做成 RankedReveal 倒序排行榜。保留逐项揭晓的节奏，换成中文标题和我的品牌配色，输出 MP4 和可编辑源码。

配套 Skill 会帮助智能体查找源码、映射数据字段、修改画面并检查结果。你也可以描述用途：

> 我想讲清楚各地区销量的变化。先根据这份 CSV 推荐合适的配方，再用其中最合适的效果制作一个短视频。

### 3. 查看结果，继续调整

检查视频中的数值、标签和结论，再让智能体调整节奏、颜色或布局。例如：“结尾多停留两秒”“突出华东地区”“换成更适合手机阅读的版式”。

[完整使用与安装说明](skills/datamagic/README.md) · [本地浏览和手动渲染](cards/README.md)

### 也可以这样开始

**有喜欢的讲解形式：**

> 使用 CharacterPerspectiveBoard，让猫主持在左侧讲解，右侧保留倾斜数据板。把我的数据映射到图表，逐项高亮，最后停留展示结论。先复用现有示例素材。

**要做移动端内容：**

> 使用 PortraitRankedReveal，把这份榜单做成 9:16 竖屏视频。从最后一名逐项揭晓，保留清楚可读的名称、数值和单位。

**想要品牌统一：**

> 保留这个配方的运镜与结构，将标题、颜色和素材替换为我的品牌风格，核对数值和标签后输出视频与源码。

<a id="stories"></a>

## 🎞️ 把多个镜头组成故事

用开场提出问题，用图表给出证据，再通过对比、转折和结论推进讲解。库中的 **8 套故事蓝图**提供编排起点，智能体可以按你的内容选择配方并组合镜头。

> 用这份季度销售数据做一个 30 秒故事：先展示增长，再比较各地区贡献，最后总结主要发现。请复用库里的配方，统一颜色和字幕样式。

需要更完整的数据分析、脚本和旁白时，可以进一步使用 [从数据策划完整视频](skills/datamagic/rules/full-story-workflow.md) 中的流程。数据分析、叙事规划和动画时序规则都由同一个 Skill 按任务调用。

## 📦 仓库里有什么

| 内容 | 入口 |
|---|---|
| 动画预览、配方说明与源码索引 | [在线案例库](https://datamagic.chat/cards/) · [配方目录](cards/recipes/) |
| 模板源码、示例数据与渲染方法 | [Cards 开发说明](cards/README.md) |
| Agent 使用与安装 | [datamagic 使用指南](skills/datamagic/README.md) |
| 多镜头故事的策划与制作 | [完整故事工作流](skills/datamagic/rules/full-story-workflow.md) |
| 展示短片、封面与可复现制作脚本 | [展示素材说明](docs/showcase.md) |
| 自动生成系统的案例与详细介绍 | [在线系统](docs/online-system.zh-CN.md) |

<a id="online"></a>

## 🪄 进一步探索：DataMagic 自动生成系统

[DataMagic 在线系统](https://datamagic.chat/) 提供从上传表格、分析数据、规划场景到生成旁白和导出视频的制作流程。你可以查看系统推荐，并调整内容和视觉效果。

系统案例包括中国新能源汽车竞争格局等完整数据故事，展示从表格到多镜头视频的制作流程。

**[查看系统演示、生成模式和更多完整案例 →](docs/online-system.zh-CN.md)**

<a id="research"></a>

## 📚 研究与文档

DataMagic 的研究围绕数据绑定、叙事编排与旁白同步展开，为配方复用和完整视频制作提供方法基础。

- [IEEE VIS 2026：Authoring Data Videos through Declarative Multi-Agent Orchestration](https://arxiv.org/abs/2609.33403)
- [VLDB 2026 Demo：Transforming Tabular Data into Data Insight Video](https://arxiv.org/abs/2606.20388)
- [项目主页](https://datamagic-home.github.io) · [Pipeline](docs/pipeline-overview.zh-CN.md) · [DVSpec](docs/dvspec-overview.zh-CN.md) · [输入输出示例](docs/input-output-examples.zh-CN.md)

### 引用 DataMagic

如果 DataMagic 对你的研究或工作有帮助，欢迎引用：

**IEEE VIS 2026 长文：**

```bibtex
@misc{xie2026datamagicauthoringdata,
  title={DataMagic: Authoring Data Videos through Declarative Multi-Agent Orchestration},
  author={Yupeng Xie and Zhenyang Wang and Liangwei Wang and Jiayi Zhu and Zhouan Shen and Yuyu Luo},
  year={2026},
  eprint={2609.33403},
  archivePrefix={arXiv},
  primaryClass={cs.HC},
  url={https://arxiv.org/abs/2609.33403},
}
```

## 🗺️ 接下来的计划

- [ ] 增加更多故事化配方、行业案例和竖屏版式。
- [ ] 完善不同数据与主题下的复用示例。
- [ ] 多轨工作台与剪映交付：后续简化操作并完成 Mac 真机验证，当前保留为 TODO。

<a id="community"></a>

## 🤝 交流与贡献

欢迎分享用配方做出的作品、贡献新案例，或通过 [Issues](https://github.com/HKUSTDial/DataMagic/issues) 反馈问题。[参与贡献](CONTRIBUTING.md)

<img src="./images/wechat-community-qr.jpg" width="180" alt="DataMagic 微信交流群二维码">

[在线系统与体验额度](docs/online-system.zh-CN.md) · [文档历史](docs/archive/README.md) · [MIT License](LICENSE) · [安全反馈](SECURITY.md)
