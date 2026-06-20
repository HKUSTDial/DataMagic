<div align="center">
<img src="./assets/datamagic_logo.png" width="380" alt="DataMagic Logo">

**将结构化数据转化为带旁白的动态数据故事。**

*为数据分析师、研究人员，以及所有希望让数据开口说话的人打造。*

[![VLDB 2026 Demo](https://img.shields.io/badge/VLDB_2026-Demo_Track-blue)](https://vldb.org/2026/)
[![arXiv](https://img.shields.io/badge/arXiv-2606.20388-b31b1b)](https://arxiv.org/abs/2606.20388)
![Status](https://img.shields.io/badge/状态-上线中-brightgreen)

[English](./README.md) | [中文](./README.zh-CN.md)

[🔥 动态](#-动态) • [⚡ 快速上手](#-快速上手) • [🌟 生成示例](#-生成示例) • [🎯 使用模式](#-使用模式) • [📖 引用](#-引用) • [🤝 交流社区](#-交流社区)
</div>

<!-- 动图占位 -->
<!-- 将 demo GIF 放到 ./images/demo-hero.gif，这里会自动显示。 -->
<!-- 制作说明见文件底部注释。 -->
<div align="center">
<img src="./images/demo-hero.gif" width="760" alt="DataMagic — 从上传数据到输出带旁白动态视频">
</div>

## 链接

**项目主页：** [https://datamagic-home.github.io](https://datamagic-home.github.io)

**在线试用：** [https://datamagic.chat/](https://datamagic.chat/)

**论文：** [DataMagic: Transforming Tabular Data into Data Insight Video](https://arxiv.org/abs/2606.20388)

## 🔥 动态

- **[2026.06.18]** 📄 论文已上线 arXiv：[DataMagic: Transforming Tabular Data into Data Insight Video](https://arxiv.org/abs/2606.20388)。
- **[2026.06.01]** 🎉 我们的论文 **"DataMagic: Transforming Tabular Data into Data Insight Video"** 被 **VLDB 2026 Demo Track** 录用！
- **[2026.05]** 🚀 DataMagic 正式上线！在线系统现已开放，上传数据即可在几分钟内生成带旁白的数据视频。

## ⚡ 快速上手

1. **上传数据** — CSV 或 Excel 表格
2. **查看 AI 推荐** — 图表类型、旁白脚本、视觉风格
3. **导出视频** — 下载生成好的数据故事视频

## 🎯 使用模式

**完整流程** — 适合需要完整叙事的数据演示：业务汇报、研究总结、向团队或领导展示分析结论。上传数据后，AI 自动规划场景结构、推荐图表、生成旁白，你只需审阅调整，即可导出完整的数据故事视频。

**快速生成** — 适合需要完整视频但对速度有要求的场景：周期性报告、快速出草稿、赶时间的演示准备。AI 仍会完成规划和旁白，但渲染速度更快，更快拿到可用的视频。

**Single Chart（单图表模式）** — 适合只需要表达一个核心数据洞察的场景：插入 PPT、发布社交媒体、会议中快速分享一个趋势图。粘贴数据后几秒内得到一张带动效的图表，简洁直接。

> [!NOTE]
> **快速生成** 与 **Single Chart** 目前处于测试阶段（Beta）。常见用例下运行正常，但在一些边缘情况下可能出现非预期结果。欢迎通过 Issues 反馈问题。

## 🎬 演示视频

<div align="center">
<video src="https://github.com/user-attachments/assets/60bf21f9-1b04-4025-9f58-38b73818b068" width="760" controls></video>
</div>

**系统流程展示** — 从上传数据到输出带旁白的动态视频。

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

DataMagic 有两个核心差异点：**数据绑定场景**——每个视觉元素直接绑定到数据字段，故事全程可追溯、可编辑；**旁白感知时序**——动画节奏与解说词自动对齐，输出的视频是有叙事感的完整作品，而不是拼凑的图表集合。

- 上传表格数据后自动生成完整数据视频。
- 快速生成模式：保留 AI 规划与旁白，通过运行时模板更快生成完整视频。
- Single Chart 模式：通过粘贴或上传数据快速生成单个动态图表。
- AI 辅助推荐图表类型和视觉模板。
- 支持运行时预览、直接视觉编辑和自然语言修改。
- 数据绑定场景——视觉元素与底层数据字段一一对应，强调可追溯性。
- 旁白感知时序——动画节奏与解说词对齐，生成有叙事结构的数据视频。

## 🤝 交流社区

源码将逐步开源——欢迎 ⭐ Star 本仓库关注进展。

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

- [x] 核心生成模式 — 完整流程、快速生成和 Single Chart。
- [x] 模板库和运行时编辑 — 预览视觉风格、编辑生成文本，并通过自然语言继续优化。
- [x] 中英文公开文档 — 面向英文和中文用户的发布说明。
- [ ] 数据视频 skill 包 — 沉淀数据视频规划、图表选择、DVSpec 编写和动画设计的可复用指导。
- [ ] 更多样的视觉风格 — 扩展叙事卡片、报告主题、领域化模板和适合演示的版式。
- [ ] 推荐与反馈学习 — 基于用户偏好和真实生成结果改进模板排序。
- [ ] 公开实现资料 — 完善 pipeline、DVSpec、模板适配器、示例数据集和部署说明。
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

- [核心 Pipeline 说明](./docs/pipeline-overview.zh-CN.md)
- [DVSpec 设计说明](./docs/dvspec-overview.zh-CN.md)
- [输入输出示例](./docs/input-output-examples.zh-CN.md)
- [帮助中心](./docs/help-center.zh-CN.md)
- [发布状态](./docs/release-status.zh-CN.md)

<div align="center">
<img src="./assets/framework-1.png" width="760" alt="DataMagic 系统架构图">
</div>

<!--
如何制作动图（Hero GIF）
─────────────────────────────────────────────────────────
录制内容（目标时长 20–40 秒）：
  1. 数据上传界面 — 拖入 CSV/Excel 文件
  2. AI 推荐面板 — 图表类型和旁白建议出现的过程
  3. 预览界面 — 动态视频播放
  4. （可选）一键导出

录制工具：
  • Mac：QuickTime Player → 文件 → 新建屏幕录制，然后裁剪到应用窗口
  • Windows：Xbox Game Bar（Win+G）或 ShareX

转换为 GIF：
  • Gifski（https://gif.ski）— 质量最好，Mac 上可拖拽使用
  • ffmpeg：ffmpeg -i recording.mp4 -vf "fps=15,scale=1280:-1" -loop 0 demo-hero.gif
  • 文件大小控制在 8 MB 以内，建议 15 fps

保存路径：
  ./images/demo-hero.gif  ← README 已经指向这里
─────────────────────────────────────────────────────────
-->
