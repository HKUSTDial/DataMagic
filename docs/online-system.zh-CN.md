# DataMagic 在线系统

[English](online-system.md) · [返回 DataMagic](../README.md)

从一份 CSV 或 Excel 表格开始，DataMagic 在线系统帮助你分析数据、规划故事、生成旁白与动画，并导出完整视频。你可以在关键阶段检查和调整内容，把分析结论组织成适合汇报、教学和分享的数据故事。

**[在线体验：datamagic.chat](https://datamagic.chat/)**

## 制作流程

1. **上传数据**：提供表格和希望回答的问题。
2. **规划内容**：查看推荐的发现、场景顺序、图表和模板。
3. **调整讲解**：修改文案、旁白、视觉样式和动画高亮。
4. **预览与导出**：检查结果，下载 MP4。

## 生成模式

| 模式 | 制作方式 | 适用场景 |
|---|---|---|
| 完整流程 | 从数据分析到叙事规划，逐场景生成画面、旁白和动画 | 业务汇报、研究展示、完整专题 |
| 快速生成（Beta） | 规划内容与旁白，使用预置模板渲染场景 | 定期报告、快速制作 |
| 单图表生成（Beta） | 围绕一个数据重点制作动态图表 | 演示文稿、局部洞察、社交媒体 |

完整流程和快速生成支持定制化模式：在场景计划、可视化方案、叙事顺序和动画高亮等阶段查看系统推荐，按需要增删场景、切换模板或调整顺序。也可以选择全自动流程。

## 系统演示

<div align="center">
<video src="https://github.com/user-attachments/assets/60bf21f9-1b04-4025-9f58-38b73818b068" width="760" controls></video>
</div>

从上传数据、规划场景到输出带旁白的动态视频。

## 🌟 生成示例

<table>
  <tr>
    <td width="50%" align="center" valign="top">
      <video src="https://github.com/user-attachments/assets/76c81435-1ac1-49a0-b21f-413e33b57287" width="100%" controls></video>
      <br><strong>中国消费复苏趋势</strong><br>
      分析 2019-2025 年社会消费品零售总额与餐饮收入变化，展示疫情冲击后的消费韧性与服务型消费复苏。
    </td>
    <td width="50%" align="center" valign="top">
      <video src="https://github.com/user-attachments/assets/e15d0742-af24-4b30-a640-73264db91d7f" width="100%" controls></video>
      <br><strong>中国新能源汽车竞争格局</strong><br>
      对比 2024 年主要新能源汽车品牌月度销量、全年节奏与同比增长，呈现头部品牌的规模优势和增长拐点。
    </td>
  </tr>
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

## 模板与编辑

模板浏览界面支持预览视觉风格、查看社区评分并标记偏好。生成后，可以编辑文本、调整画面或用自然语言继续修改。

<div align="center">
<img src="../images/template-gallery.png" width="760" alt="DataMagic 在线系统模板浏览界面">
</div>

希望自行复用某个效果时，可以在 [DataMagic 配方库](../cards/README.md) 中找到动画预览、示例数据和可编辑源码，再由配套 Skill 帮助制作。

## 数据与故事如何连接

DataMagic 使用 **DVSpec** 记录场景、数据绑定、旁白和动画时序，让图表中的数字和标签对应到源数据，并让动画配合讲解推进。

[Pipeline 说明](pipeline-overview.zh-CN.md) · [DVSpec 设计](dvspec-overview.zh-CN.md) · [输入输出示例](input-output-examples.zh-CN.md) · [帮助中心](help-center.zh-CN.md)

<div align="center">
<img src="../assets/framework-1.png" width="760" alt="DataMagic 数据视频生成架构">
</div>

## 🔥 动态

- **[2026.09.27]** 📄 IEEE VIS 2026 长文已上线 [arXiv](https://arxiv.org/abs/2609.33403)。
- **[2026.08.09]** 📄 我们的长文 **[DataMagic: Authoring Data Videos through Declarative Multi-Agent Orchestration](https://arxiv.org/abs/2609.33403)** 被 **IEEE VIS 2026** 录用。
- **[2026.07.05]** ✨ 新增 **定制化生成流程**：DataMagic 会先展示推荐的场景计划、可视化方案、叙事编排和动画高亮方式，用户可以在生成前逐步确认和调整。
- **[2026.06.20]** 🚀 DataMagic 正式上线！前往 [datamagic.chat](https://datamagic.chat/) 试用，上传数据即可在几分钟内生成带旁白的数据视频。
- **[2026.06.20]** 🧩 发布 **[datamagic-video skill](../skills/datamagic-video/)**，可复用的指导，教 AI 编程智能体（Claude Code、Cursor、Codex）把表格数据变成带旁白的动态数据视频。
- **[2026.06.18]** 📄 我们的论文 **"DataMagic: Transforming Tabular Data into Data Insight Video"** 被 **VLDB 2026 Demo Track** 录用，现已上线 [arXiv](https://arxiv.org/abs/2606.20388)。

## 在线体验额度

关注以下任一微信公众号，回复 **DataMagic**，即可获得一次性兑换码（20 点额度），用于在线产品。

<table>
  <tr>
    <td align="center" width="50%">
      <img src="../images/wechat-qr-dial-lab.jpg" width="160" alt="DIAL实验室微信公众号二维码"><br>
      <strong>DIAL 实验室</strong><br>
      <sub>实验室动态 &amp; DataMagic 最新进展</sub>
    </td>
    <td align="center" width="50%">
      <img src="../images/wechat-qr-xiege.jpg" width="160" alt="蟹哥聊科研微信公众号二维码"><br>
      <strong>蟹哥聊科研</strong><br>
      <sub>科研干货 &amp; AI 工具分享</sub>
    </td>
  </tr>
</table>

[研究论文与引用](../README.md#research) · [交流社区](../README.md#community) · [返回首页](../README.md)
