<div align="center">
<img src="./assets/datamagic_logo.png" width="380" alt="DataMagic Logo">

**将结构化数据转化为带旁白的动态数据故事。**

*无需写脚本，无需做动画，上传数据即可生成专业的数据故事视频。*

[![VLDB 2026 Demo](https://img.shields.io/badge/VLDB_2026-Demo_Track-blue)](https://vldb.org/2026/)
[![arXiv](https://img.shields.io/badge/arXiv-2606.20388-b31b1b)](https://arxiv.org/abs/2606.20388)
[![docs](https://github.com/HKUSTDial/DataMagic/actions/workflows/docs.yml/badge.svg)](https://github.com/HKUSTDial/DataMagic/actions/workflows/docs.yml)
![Status](https://img.shields.io/badge/状态-上线中-brightgreen)

[中文](./README.md) | [English](./README.en.md)

[🔥 动态](#-动态) • [⚡ 快速上手](#-快速上手) • [🌟 生成示例](#-生成示例) • [🎯 生成模式](#-生成模式) • [📖 引用](#-引用) • [🤝 交流社区](#-交流社区)
</div>

## 论文与项目相关链接

**在线试用：** [https://datamagic.chat/](https://datamagic.chat/)

**项目主页：** [https://datamagic-home.github.io](https://datamagic-home.github.io)

**论文：** [DataMagic: Transforming Tabular Data into Data Insight Video](https://arxiv.org/abs/2606.20388)

## 🔥 动态

- **[2026.06.20]** 🚀 DataMagic 正式上线！前往 [datamagic.chat](https://datamagic.chat/) 试用，上传数据即可在几分钟内生成带旁白的数据视频。
- **[2026.06.20]** 🧩 发布 **[datamagic-video skill](./datamagic-video/)**，可复用的指导，教 AI 编程智能体（Claude Code、Cursor、Codex）把表格数据变成带旁白的动态数据视频。
- **[2026.06.18]** 📄 我们的论文 **"DataMagic: Transforming Tabular Data into Data Insight Video"** 被 **VLDB 2026 Demo Track** 录用，现已上线 [arXiv](https://arxiv.org/abs/2606.20388)。

## 💡 为什么需要 DataMagic？

很多时候，我们手里已经有了一份表格，却还要花大量时间回答这些问题：数据里到底有什么值得讲？应该画什么图？怎么把图串成一个清楚的故事？如果要给团队、客户或课堂展示，还要写旁白、配动画、录屏或剪视频。

DataMagic 想解决的就是这个过程中的重复劳动：让 AI 先帮你分析数据、发现重点，再把这些重点组织成一段可以直接播放、修改和分享的数据视频。

今天的工具各有擅长的环节：Excel、Vega-Lite、Matplotlib 适合做图，Tableau、Power BI、Looker 适合探索和监控，After Effects、Premiere、CapCut 适合精修视频，Seedance、Sora、Veo 等视频生成模型适合生成视觉画面。但从“原始表格”到“可播放、可编辑、可追溯的数据故事视频”，中间仍然需要分析、选图、写旁白、配动画和检查数据准确性。

DataMagic 面向的正是这个缺口：**把原始结构化数据转化为可编辑、可追溯、带旁白的数据视频**。

## 🪄 DataMagic 是什么？

DataMagic 是一个 AI 辅助的数据视频生成系统。你可以上传 CSV 或 Excel 表格，给出一个分析目标或业务问题，DataMagic 会帮助分析数据、挖掘洞察、规划故事结构、选择图表、生成旁白、同步动画、预览结果，并导出 MP4 视频。

它的核心不是简单地“生成一个视频”，而是让视频里的数字、标签和图表都能对应回原始数据。技术上，DataMagic 使用 **DVSpec** 把视觉元素、旁白和动画时序连接起来，让结果更容易检查、修改和继续生成。

## 🔍 DataMagic 有什么不同？

| 用户想做的事 | 常见工具的问题 | DataMagic 的做法 |
|---|---|---|
| 从一张表快速变成视频 | 分析、作图、写稿、剪辑通常分散在不同工具里 | 从上传数据到生成带旁白视频的一体化流程 |
| 让 AI 帮忙发现重点 | 很多工具只负责画图，不负责判断哪些数据值得讲 | 自动分析数据并组织成可讲述的场景 |
| 保证数字和图表可核查 | 像素级视频模型主要生成画面，数据绑定和溯源需要额外验证 | 图表元素通过 DVSpec 绑定到源数据 |
| 生成后还能改 | 往往需要重新生成或手动剪辑 | 支持预览、文本编辑、自然语言调整，并尽可能保持局部更新 |
| 直接用于汇报和分享 | 静态图表仍然需要人工讲解 | 导出可播放、可分享的动态数据故事 |

## ⚡ 快速上手

1. **上传数据**：CSV 或 Excel 表格
2. **查看 AI 推荐**：图表类型、旁白脚本、视觉风格
3. **导出视频**：下载生成好的数据故事视频

## 🎯 生成模式

**完整流程**：从一份数据表格出发，AI 自动分析数据、规划叙事结构、为每个场景生成旁白和动效，动效与旁白自动同步，最终输出一段完整的多场景数据视频。适合需要高质量呈现的场合，比如业务汇报、研究展示，以及向团队或领导展示分析结论。

**快速生成**：流程与完整流程相同，AI 同样负责规划内容和生成旁白，区别在于场景渲染使用预置视觉模板而非逐场景 AI 生成，因此速度更快，但视觉上没有完整流程那么精细。适合对效率要求更高的用户，比如需要定期产出报告、或对视觉风格没有特别要求的场景。

**单图表生成**：不需要完整视频，只需要一张能帮助发现或说明重点的动态图表。粘贴数据，快速生成一张带动效的图表，直接用在 PPT、对外报告或社交媒体里。适合快速探索一个数据重点，或表达一个不需要完整叙事结构的局部洞察。

> [!NOTE]
> **快速生成** 与 **单图表生成** 目前处于测试阶段（Beta）。常见用例下运行正常，但在一些边缘情况下可能出现非预期结果。欢迎通过 Issues 反馈问题。

## 🎬 演示视频

<div align="center">
<video src="https://github.com/user-attachments/assets/60bf21f9-1b04-4025-9f58-38b73818b068" width="760" controls></video>
</div>

**系统流程展示**：从上传数据到输出带旁白的动态视频。

## 🌟 生成示例

<table>
  <tr>
    <td width="50%" align="center" valign="top">
      <video src="https://github.com/user-attachments/assets/4600c2ca-72fe-4690-9ad4-3a611ef2ba7e" width="100%" controls></video>
      <br><strong>Q4 销售分析</strong><br>
      基于销售数据的动态柱状图和趋势可视化。
    </td>
    <td width="50%" align="center" valign="top">
      <video src="https://github.com/user-attachments/assets/1ef81518-b49d-4484-9b92-faaeff9cd188" width="100%" controls></video>
      <br><strong>全球可再生能源转型</strong><br>
      围绕 2018-2024 年全球可再生能源装机容量展开叙事，突出太阳能快速增长以及化石能源占比下降。
    </td>
  </tr>
  <tr>
    <td width="50%" align="center" valign="top">
      <video src="https://github.com/user-attachments/assets/ea70e828-c6fa-4913-a2e5-29799dea1d47" width="100%" controls></video>
      <br><strong>2024 科技公司营收排行</strong><br>
      对比主要科技公司的 2024 年营收表现，展示 Amazon 的规模优势以及 Apple、Google、Nvidia、Meta 等公司的位置。
    </td>
    <td width="50%" align="center" valign="top">
      <video src="https://github.com/user-attachments/assets/57a347d5-8076-4662-8f27-ec4051d6e622" width="100%" controls></video>
      <br><strong>科技增长与市场动能</strong><br>
      以执行摘要的方式回顾 2024 年科技行业表现，对比营收规模与增长速度，并突出 Nvidia 的高增长动能。
    </td>
  </tr>
</table>

## 🎨 模板库

内置 100+ 种视觉风格，覆盖柱状图、折线图、饼图、散点图、桑基图、瀑布图、KPI 卡片等类型，每种样式均有预览图和社区评分。生成前可提前浏览并标记偏好风格。

<div align="center">
<img src="./images/template-gallery.png" width="760" alt="DataMagic 模板库">
</div>

## ✨ 功能概览

DataMagic 以**数据绑定场景**（视觉元素直接绑定数据字段，可追溯可编辑）和**旁白感知时序**（动画与旁白自动对齐，生成有叙事感的完整视频）为核心。

- AI 辅助推荐图表类型和视觉模板。
- 支持运行时预览、直接视觉编辑和自然语言修改。

## 🧩 数据视频 Skill

我们同时公开 **[`datamagic-video`](./datamagic-video/)**，一个把数据视频方法论教给 AI 编程智能体（Claude Code、Cursor、Codex 等）的 skill，涵盖叙事模式、图表选择、DVSpec 编写、旁白写作、动画时序。它产出的视频用开源工具链即可渲染，任何人都能生成、能观看，无需账号。

托管产品提供精修模板和完整 pipeline；skill 让任何智能体都能独立产出优秀的数据视频，并共享同一套 DVSpec 格式。

```bash
git clone https://github.com/HKUSTDial/DataMagic
cp -r DataMagic/datamagic-video ~/.claude/skills/datamagic-video   # Claude Code
```

然后对智能体说：「帮我用这个 CSV 生成一个带旁白的数据视频……」。详见 [skill 说明](./datamagic-video/README.md)。

## 🤝 交流社区

源码将逐步开源，欢迎 ⭐ Star 本仓库关注进展。

<table>
  <tr>
    <td width="68%" valign="middle">
      <strong>加入微信交流群</strong><br>
      欢迎分享使用案例、提问反馈，或交流数据可视化、AI 生成视频相关话题。
    </td>
    <td width="32%" align="center">
      <img src="./images/wechat-community-qr.jpg" width="180" alt="DataMagic 微信交流群二维码"><br>
      <sub>扫码加入</sub>
    </td>
  </tr>
</table>

### 关注公众号，免费领取额度

关注以下任一微信公众号，回复 **DataMagic**，即可获得一次性兑换码（20 点额度），用于在线产品。

<table>
  <tr>
    <td align="center" width="50%">
      <img src="./images/wechat-qr-dial-lab.jpg" width="160" alt="DIAL实验室微信公众号二维码"><br>
      <strong>DIAL 实验室</strong><br>
      <sub>实验室动态 &amp; DataMagic 最新进展</sub>
    </td>
    <td align="center" width="50%">
      <img src="./images/wechat-qr-xiege.jpg" width="160" alt="蟹哥聊科研微信公众号二维码"><br>
      <strong>蟹哥聊科研</strong><br>
      <sub>科研干货 &amp; AI 工具分享</sub>
    </td>
  </tr>
</table>

## 📍 当前状态

- [x] 核心生成模式：完整流程、快速生成和单图表生成。
- [x] 模板库和运行时编辑：预览视觉风格、编辑生成文本，并通过自然语言继续优化。
- [x] 中英文公开文档：面向英文和中文用户的发布说明。
- [x] 数据视频 skill 包：沉淀数据视频规划、图表选择、DVSpec 编写和动画设计的可复用指导。（[datamagic-video/](./datamagic-video/)）
- [ ] 更多样的视觉风格：扩展叙事卡片、报告主题、领域化模板和适合演示的版式。
- [ ] 推荐与反馈学习：基于用户偏好和真实生成结果改进模板排序。
- [ ] 公开实现资料：完善 pipeline、DVSpec、模板适配器、示例数据集和部署说明。
- [ ] 扩展导出格式与分享流程。
- [ ] 面向部署场景的团队和后台监控能力。

## 📖 引用

如果 DataMagic 对你的研究或工作有帮助，欢迎引用：

```bibtex
@misc{xie2026datamagictransformingtabulardata,
  title={DataMagic: Transforming Tabular Data into Data Insight Video},
  author={Yupeng Xie and Chen Ma and Zhenyang Wang and Liangwei Wang and Jiayi Zhu and Chuxuan Zeng and Zhouan Shen and Boyan Li and Yuyu Luo},
  year={2026},
  eprint={2606.20388},
  archivePrefix={arXiv},
  primaryClass={cs.HC},
  url={https://arxiv.org/abs/2606.20388},
}
```

## 📚 文档

- [数据视频 Skill](./datamagic-video/README.md)
- [核心 Pipeline 说明](./docs/pipeline-overview.zh-CN.md)
- [DVSpec 设计说明](./docs/dvspec-overview.zh-CN.md)
- [输入输出示例](./docs/input-output-examples.zh-CN.md)
- [帮助中心](./docs/help-center.zh-CN.md)
- [发布状态](./docs/release-status.zh-CN.md)

<div align="center">
<img src="./assets/framework-1.png" width="760" alt="DataMagic 系统架构图">
</div>
