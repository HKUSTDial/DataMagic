<div align="center">
<img src="./assets/datamagic_logo.png" width="380" alt="DataMagic Logo">

**Turn structured data into narrated, animated data stories.**

*For analysts, researchers, and anyone who wants their data to tell a story.*

[![VLDB 2026 Demo](https://img.shields.io/badge/VLDB_2026-Demo_Track-blue)](https://vldb.org/2026/)
[![arXiv](https://img.shields.io/badge/arXiv-2606.20388-b31b1b)](https://arxiv.org/abs/2606.20388)
![Status](https://img.shields.io/badge/status-live-brightgreen)

[English](./README.md) | [中文](./README.zh-CN.md)

[🔥 News](#-news) • [⚡ Quick Start](#-quick-start) • [🌟 Examples](#-examples) • [🎯 Workflows](#-workflows) • [📖 Citation](#-citation) • [🤝 Community](#-community)
</div>

<!-- HERO GIF PLACEHOLDER -->
<!-- Drop your demo GIF at ./images/demo-hero.gif and it will appear here automatically. -->
<!-- See the bottom of this file for recording instructions. -->
<div align="center">
<img src="./images/demo-hero.gif" width="760" alt="DataMagic — from data upload to animated narrated video">
</div>

## Links

**Try it:** [https://datamagic.chat/](https://datamagic.chat/)

**Project homepage:** [https://datamagic-home.github.io](https://datamagic-home.github.io)

**Paper:** [DataMagic: Transforming Tabular Data into Data Insight Video](https://arxiv.org/abs/2606.20388)

## 🔥 News

- **[2026.06.18]** 📄 Our paper **"DataMagic: Transforming Tabular Data into Data Insight Video"** has been accepted to **VLDB 2026 Demo Track** and is now available on [arXiv](https://arxiv.org/abs/2606.20388).
- **[2026.06.20]** 🚀 DataMagic is now live! Try it at [datamagic.chat](https://datamagic.chat/) — upload your data and generate a narrated data video in minutes.
- **[2026.06.20]** 🧩 Released the **[datamagic-video skill](./datamagic-video/)** — reusable guidance that teaches AI coding agents (Claude Code, Cursor, Codex) to turn tabular data into narrated data videos.

## ⚡ Quick Start

1. **Upload your data** — CSV or Excel table
2. **Review AI suggestions** — chart types, narration script, visual style
3. **Export your video** — download the finished data story

## 🎯 Workflows

**Full Pipeline** — Best for a complete, presentation-ready data story. Upload your dataset and DataMagic handles the structure: scene planning, chart selection, narration script, and visual pacing. You review and refine, then export a finished video. Ideal for business reports, research summaries, and stakeholder presentations.

**Fast Generation** — Best when you want a complete narrated video but need it done quickly. DataMagic still handles AI planning and narration, but uses optimized rendering for faster output. A good choice for recurring reports, drafts, or when turnaround time matters.

**Single Chart** — Best for one focused insight. Paste or upload your data and get a single animated chart in seconds — no narration, no multi-scene structure. Perfect for embedding in a slide deck, sharing on social media, or quickly illustrating a data point.

> [!NOTE]
> **Fast Generation** and **Single Chart** are experimental features currently in beta. They work well for typical inputs but may produce unexpected results in edge cases. Feedback and bug reports via Issues are very welcome.

## 🎬 Demo Video

<div align="center">
<video src="https://github.com/user-attachments/assets/60bf21f9-1b04-4025-9f58-38b73818b068" width="760" controls></video>
</div>

**System walkthrough** — from data upload to narrated animated video.

## 🌟 Examples

<table>
  <tr>
    <td width="50%" align="center" valign="top">
      <video src="https://github.com/user-attachments/assets/4600c2ca-72fe-4690-9ad4-3a611ef2ba7e" width="100%" controls></video>
      <br><strong>Q4 sales analysis</strong><br>
      Animated bar and trend visualization for business performance insights.
    </td>
    <td width="50%" align="center" valign="top">
      <video src="https://github.com/user-attachments/assets/1ef81518-b49d-4484-9b92-faaeff9cd188" width="100%" controls></video>
      <br><strong>Renewable energy transition</strong><br>
      A narrated look at global renewable capacity growth from 2018 to 2024, highlighting solar expansion and the declining share of fossil fuels.
    </td>
  </tr>
  <tr>
    <td width="50%" align="center" valign="top">
      <video src="https://github.com/user-attachments/assets/ea70e828-c6fa-4913-a2e5-29799dea1d47" width="100%" controls></video>
      <br><strong>2024 tech revenue leaders</strong><br>
      A comparison of major technology companies by 2024 revenue, showing Amazon's scale alongside Apple, Google, Nvidia, and Meta.
    </td>
    <td width="50%" align="center" valign="top">
      <video src="https://github.com/user-attachments/assets/57a347d5-8076-4662-8f27-ec4051d6e622" width="100%" controls></video>
      <br><strong>Tech growth and market momentum</strong><br>
      An executive-style recap of 2024 tech performance, contrasting revenue scale with fast growth led by Nvidia.
    </td>
  </tr>
</table>

## 🎨 Template Gallery

Over 100 ready-made visual styles across bar, line, pie, scatter, Sankey, waterfall, KPI card, and more — each with a preview and community ratings. Browse and mark your preferred styles before generation.

<div align="center">
<img src="./images/template-gallery.png" width="760" alt="DataMagic template gallery">
</div>

## ✨ Features

Two things set DataMagic apart: **data-grounded scenes** bind every visual element directly to a data field so the story stays traceable and editable; **narration-aware timing** aligns animation pacing with the voiceover so the result feels authored, not assembled.

- Full data-to-video generation from uploaded tabular data.
- Fast runtime video generation with AI planning plus template-based rendering.
- Single Chart mode for quickly creating one animated visualization from pasted or uploaded data.
- AI-assisted chart and style-template recommendation.
- Runtime preview, direct visual editing, and natural-language refinement.
- Data-grounded scenes — visual elements bound to underlying data fields for full traceability.
- Narration-aware timing — animation and voiceover assembled into a coherent story rhythm.

## 🧩 Data-Video Skill

We also publish **[`datamagic-video`](./datamagic-video/)** — a skill that teaches AI coding
agents (Claude Code, Cursor, Codex, …) the *methodology* behind data videos: narrative
patterns, chart selection, DVSpec authoring, narration writing, and animation timing. The
videos it produces render with open tooling, so anyone can generate and watch them — no
account needed.

The hosted product adds premium templates and the full pipeline; the skill gives any agent
strong standalone results and shares the same DVSpec format.

```bash
git clone https://github.com/HKUSTDial/DataMagic
cp -r DataMagic/datamagic-video ~/.claude/skills/datamagic-video   # Claude Code
```

Then ask your agent: *"Make a narrated data video from this CSV …"*. See the
[skill README](./datamagic-video/README.md) for details.

## 🤝 Community

The source code is being progressively open-sourced — ⭐ star this repo to follow updates.

<table>
  <tr>
    <td width="68%" valign="middle">
      <strong>Join the WeChat discussion group</strong><br>
      Share use cases, ask questions, and discuss data visualization or AI-generated videos with the community.
    </td>
    <td width="32%" align="center">
      <img src="./images/wechat-community-qr.jpg" width="180" alt="DataMagic WeChat community QR code"><br>
      <sub>Scan to join</sub>
    </td>
  </tr>
</table>

### Get free credits via WeChat

Follow either official account below and reply **DataMagic** to receive a one-time credit code (20 credits) for the hosted product.

<table>
  <tr>
    <td align="center" width="50%">
      <img src="./images/wechat-qr-dial-lab.jpg" width="160" alt="DIAL Lab WeChat official account QR code"><br>
      <strong>DIAL 实验室</strong><br>
      <sub>Research updates &amp; DataMagic news</sub>
    </td>
    <td align="center" width="50%">
      <img src="./images/wechat-qr-xiege.jpg" width="160" alt="蟹哥聊科研 WeChat official account QR code"><br>
      <strong>蟹哥聊科研</strong><br>
      <sub>Research &amp; AI tool tips</sub>
    </td>
  </tr>
</table>

## 📍 Roadmap

- [x] Core generation modes — Full Pipeline, Fast Generation, and Single Chart.
- [x] Template gallery and runtime editing — preview styles, edit generated text, and refine with natural language.
- [x] Bilingual public documentation — English and Chinese release docs.
- [x] Data-video skill package — reusable guidance for data-video planning, chart selection, DVSpec authoring, and animation design. ([datamagic-video/](./datamagic-video/))
- [ ] More diverse visual styles — richer narrative cards, report themes, domain-specific templates, and presentation-ready layouts.
- [ ] Recommendation and feedback learning — improve template ranking from user preferences and real generation outcomes.
- [ ] Public implementation materials — clearer notes for the pipeline, DVSpec, template adapters, example datasets, and deployment.
- [ ] Expanded export and sharing workflows.
- [ ] Team/admin monitoring for production deployments.

## 📖 Citation

If you find DataMagic useful in your research or work, please cite:

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

## 📚 Documentation

- [Data-Video Skill](./datamagic-video/README.md)
- [Pipeline Overview](./docs/pipeline-overview.md)
- [DVSpec Overview](./docs/dvspec-overview.md)
- [Input and Output Examples](./docs/input-output-examples.md)
- [Help Center](./docs/help-center.md)
- [Release Status](./docs/release-status.md)

<div align="center">
<img src="./assets/framework-1.png" width="760" alt="DataMagic system framework">
</div>

<!--
HOW TO CREATE THE HERO GIF
─────────────────────────────────────────────────────────
What to record (aim for 20–40 seconds total):
  1. Data upload screen — drag in a CSV/Excel file
  2. AI recommendation panel — chart type and narration suggestions appearing
  3. Preview screen — the animated video playing back
  4. (Optional) One-click export

Recording tools:
  • Mac: QuickTime Player → File → New Screen Recording, then crop to the app window
  • Windows: Xbox Game Bar (Win+G) or ShareX

Converting to GIF:
  • Gifski (https://gif.ski) — best quality, drag-and-drop on Mac
  • ffmpeg: ffmpeg -i recording.mp4 -vf "fps=15,scale=1280:-1" -loop 0 demo-hero.gif
  • Keep file size under 8 MB; target 15 fps

Where to save:
  ./images/demo-hero.gif  ← the README already points here
─────────────────────────────────────────────────────────
-->
