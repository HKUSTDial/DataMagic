<div align="center">
<img src="./assets/datamagic_logo.png" width="380" alt="DataMagic Logo">

**Turn data into editable animated stories with recipe cards and an Agent Skill.**

*For creators, analysts, and researchers: choose an example, bring your data, and let a coding agent adapt it.*

[![VLDB 2026 Demo](https://img.shields.io/badge/VLDB_2026-Demo_Track-blue)](https://vldb.org/2026/)
[![IEEE VIS 2026](https://img.shields.io/badge/IEEE_VIS_2026-Accepted-007b8f)](https://ieeevis.org/)
[![arXiv](https://img.shields.io/badge/arXiv-2606.20388-b31b1b)](https://arxiv.org/abs/2606.20388)
[![docs](https://github.com/HKUSTDial/DataMagic/actions/workflows/docs.yml/badge.svg)](https://github.com/HKUSTDial/DataMagic/actions/workflows/docs.yml)
[![plugin-scanner](https://github.com/HKUSTDial/DataMagic/actions/workflows/plugin-scanner.yml/badge.svg)](https://github.com/HKUSTDial/DataMagic/actions/workflows/plugin-scanner.yml)
![Status](https://img.shields.io/badge/status-live-brightgreen)

[中文](./README.md) | [English](./README.en.md)

[🎨 Cards](#-datamagic-cards) • [⚡ Quick Start](#-quick-start) • [🧩 Agent Skill](#-agent-skill) • [🌐 Hosted System](#-datamagic-hosted-system) • [📖 Citation](#-citation) • [🤝 Community](#-community)
</div>

DataMagic provides **[Cards](cards/README.en.md)** and the **[datamagic-video Skill](skills/datamagic-video/)** to help creators turn data into animated charts and visual stories. Browse examples, pick a recipe, and work with a coding agent to adapt the data, refine the visuals, and render a video.

This repository offers animation previews, recipes, editable template source, sample data, an Agent Skill, and research documentation for local browsing, template reuse, and data storytelling.

## 🎨 DataMagic Cards

**[Browse the live gallery](https://datamagic.chat/cards/)** — view motion previews and recipes without installing anything.

Browse by purpose: rankings, trends, maps, presenter explanations, or footage-based evidence. Watch an example, copy its implementation instructions, and substitute your own data and media. Useful for creator videos, business explainers, teaching, and research presentations.

| Ranking reveal | Trend explanation | Map story |
|---|---|---|
| [![Countdown ranking](cards/gallery/media/poster/RankedReveal.png)](cards/recipes/RankedReveal.md) | [![Timeline camera](cards/gallery/media/poster/ChartTimelineTravel.png)](cards/recipes/ChartTimelineTravel.md) | [![Regional map](cards/gallery/media/poster/ChoroplethRankMap.png)](cards/recipes/ChoroplethRankMap.md) |
| Reveal entries to build suspense and comparison | Move through time and focus on key changes | Explain regional differences through geography |

| Presenter evidence board | Footage to evidence |
|---|---|
| [![Presenter evidence board](cards/gallery/media/poster/PresenterEvidenceBoard.png)](cards/recipes/PresenterEvidenceBoard.md) | [![Footage to evidence](cards/gallery/media/poster/FootageEvidenceReveal.png)](cards/recipes/FootageEvidenceReveal.md) |
| Introduce the presenter, metrics, and conclusion in stages | Establish the scene before introducing its metrics |

The library currently includes **139 cards, HD MP4 previews, and 8 story blueprints**:

- **All 139 cards include editable source, schemas, and sample data**, ready for local adaptation and rendering.
- Choose from **109 chart and text shots** and **30 advanced story, scene, and camera templates**.
- **8 story blueprints** guide the organization of hooks, evidence, turns, and conclusions for multi-shot data stories.

See [Cards documentation](cards/README.en.md) for the full catalog and usage instructions.

For mobile creators, [9:16 Countdown Ranking](cards/recipes/PortraitRankedReveal.md) uses a dedicated 1080×1920 portrait layout.

## ⚡ Quick Start

### 1. Browse cards locally

```bash
git clone https://github.com/HKUSTDial/DataMagic.git
cd DataMagic
python3 -m http.server 8000 --directory cards/gallery
```

Open [http://localhost:8000](http://localhost:8000). Previews are included; browsing does not require Node dependencies.

### 2. Render an editable example

In another terminal, run from the repository's `cards/` directory (Node.js 20+):

```bash
cd cards
npm ci
npx remotion render src/index.ts ShotCraft-RankedReveal out/ranking.mp4
```

Inspect `templates/ranked-reveal/sample-data.json`, then replace its demonstration data using the [recipe](cards/recipes/RankedReveal.md) and schema. The output is `cards/out/ranking.mp4`. The first render may download a browser; examples do not include narration by default.

### 3. Bring your data to an agent

Open a coding agent in this repository, ask it to read the [datamagic-video Skill](skills/datamagic-video/SKILL.md), and try:

> Use this repository's datamagic-video Skill to turn my supplied CSV into a countdown ranking. Check the data and units first, select a Cards template with source, and preserve correct ordering and labels. Deliver editable source, an MP4, and data/visual checks.

For multi-shot stories, presenter layouts, or footage, also specify the story goal, aspect ratio, media paths, and whether narration is wanted.

## 🧩 Agent Skill

[`datamagic-video`](skills/datamagic-video/) connects recipes to production: select a card for the task; read its recipe, source, schema, and sample; adapt data and media; arrange timing; render; then verify numbers, layout, and key frames.

Three starting points are supported: **one animated chart, reuse of a selected recipe, and a short data story**. Template reuse starts with adapting data and media; short stories combine scene planning, DVSpec, narration, and synchronization rules to organize shots and explanation timing.

Use the repository-based example above, or see the [Skill README](skills/datamagic-video/README.md) for installation and fuller usage instructions.

## 🌐 DataMagic Hosted System

Try the online production workflow at [datamagic.chat](https://datamagic.chat/): upload a table, plan scenes, generate narration, and export a video. The sections below introduce the hosted system's production modes and interface.

**Project homepage:** [datamagic-home.github.io](https://datamagic-home.github.io)

**VIS 2026 full paper:** [DataMagic: Authoring Data Videos through Declarative Multi-Agent Orchestration](https://arxiv.org/abs/2609.33403)

**VLDB 2026 demo paper:** [DataMagic: Transforming Tabular Data into Data Insight Video](https://arxiv.org/abs/2606.20388)

## 🔥 News

- **[2026.09.27]** 📄 Our IEEE VIS 2026 full paper is now available on [arXiv](https://arxiv.org/abs/2609.33403).
- **[2026.08.09]** 📄 Our long paper **[DataMagic: Authoring Data Videos through Declarative Multi-Agent Orchestration](https://arxiv.org/abs/2609.33403)** has been accepted to **IEEE VIS 2026**.
- **[2026.07.05]** ✨ Added a **Customizable Generation Workflow**: DataMagic now surfaces recommended scene plans, visual designs, narrative ordering, and animation highlights before final rendering, so users can review and adjust key decisions instead of editing only after generation.
- **[2026.06.20]** 🚀 DataMagic is now live! Try it at [datamagic.chat](https://datamagic.chat/) — upload your data and generate a narrated data video in minutes.
- **[2026.06.20]** 🧩 Released the **[datamagic-video skill](./skills/datamagic-video/)** — reusable guidance that teaches AI coding agents (Claude Code, Cursor, Codex) to turn tabular data into narrated data videos.
- **[2026.06.18]** 📄 Our paper **"DataMagic: Transforming Tabular Data into Data Insight Video"** has been accepted to **VLDB 2026 Demo Track** and is now available on [arXiv](https://arxiv.org/abs/2606.20388).

## 💡 Why DataMagic?

Most teams already have tables. The hard part is turning those tables into something other people can quickly understand: finding what is worth saying, choosing the right charts, arranging the story, writing narration, timing animations, and producing a video people can actually watch.

DataMagic is built to remove that repetitive work. It helps analyze the data, surface useful insights, and turn them into an editable narrated video you can preview, refine, export, and share.

Today's tools are strong in their own domains: Excel, Vega-Lite, and Matplotlib are great for charts; Tableau, Power BI, and Looker are strong for exploration and monitoring; After Effects, Premiere, and CapCut are good for video editing; Seedance, Sora, and Veo can generate visual footage. But going from a raw table to a playable, editable, and traceable data-story video still requires analysis, chart selection, narration, animation timing, and data checking.

DataMagic focuses on this missing workflow: **turning raw structured data into an editable, traceable, narrated data video**.

## 🪄 What Is DataMagic?

DataMagic is an AI-assisted system for authoring data videos from tabular data. Upload a CSV or Excel table, provide an analysis goal or business question, and DataMagic helps analyze the data, surface insights, plan the story, choose charts, draft narration, synchronize animation, preview the result, and export an MP4 video.

The goal is not just to "generate a video." The numbers, labels, and charts in a DataMagic video should remain connected to the original table. Under the hood, **DVSpec** connects visual elements, narration, and animation timing so the result is easier to inspect, edit, and extend.

## 🔍 What Makes It Different?

| What you want to do | Where common tools fall short | How DataMagic helps |
|---|---|---|
| Turn a table into a video | Analysis, charting, scripting, and editing usually happen in separate tools | One workflow from uploaded data to narrated video |
| Let AI find what matters | Many tools draw charts but do not decide what is worth saying | Analyze the data and organize useful findings into scenes |
| Keep numbers and charts verifiable | Pixel-level video models primarily generate frames; data binding and provenance require extra verification | Bind chart elements to source data through DVSpec |
| Edit after generation | Regeneration or manual video editing is often required | Preview, edit text, refine with natural language, and keep changes local where possible |
| Share the result quickly | Static charts still need someone to explain them | Export a playable animated data story |

### Try the hosted product

1. **Upload your data** — CSV or Excel table
2. **Review and adjust DataMagic recommendations** — scene plans, chart designs, story order, templates, and animation highlights
3. **Export your video** — download the finished data story

## 🎯 Workflows

**Full Pipeline** — Starting from a data table, AI automatically analyzes the data, plans the narrative structure, and generates narration and animations for each scene, with animations synchronized to the narration automatically. The result is a complete multi-scene data video. Best for high-quality presentations such as business reports, research showcases, and sharing analytical conclusions with your team or leadership.

**Fast Generation** — Follows the same process as Full Pipeline — AI still handles content planning and narration — but scene rendering uses pre-built visual templates instead of per-scene AI generation, making it significantly faster with less visual customization. Best for users who prioritize speed, such as recurring report production or when visual style is not a primary concern.

**Single Chart** — No full video needed, just one animated chart to discover or explain a focused data point. Paste your data and quickly generate a single animated chart, ready to embed in a presentation, report, or social media post. Best for quick exploration or communicating a local insight without a full narrative structure.

> [!NOTE]
> **Fast Generation** and **Single Chart** are experimental features currently in beta. They work well for typical inputs but may produce unexpected results in edge cases. Feedback and bug reports via Issues are very welcome.

### Customizable Generation Workflow

Both Full Pipeline and Fast Generation support a customizable mode. DataMagic surfaces its recommendations at key stages, including scene planning, visual candidates, narrative ordering, visual templates, and animation highlights. Users can accept the recommendations or adjust scenes, charts, templates, and story order before final rendering. Fully automatic generation remains available for users who want the fastest end-to-end result.

## 🎬 Demo Video

<div align="center">
<video src="https://github.com/user-attachments/assets/60bf21f9-1b04-4025-9f58-38b73818b068" width="760" controls></video>
</div>

**System walkthrough** — from data upload to narrated animated video.

## 🌟 Examples

<table>
  <tr>
    <td width="50%" align="center" valign="top">
      <video src="https://github.com/user-attachments/assets/76c81435-1ac1-49a0-b21f-413e33b57287" width="100%" controls></video>
      <br><strong>China consumption recovery</strong><br>
      Analyzes China's retail sales and catering revenue from 2019 to 2025, showing consumption resilience and service-sector recovery after the pandemic shock.
    </td>
    <td width="50%" align="center" valign="top">
      <video src="https://github.com/user-attachments/assets/e15d0742-af24-4b30-a640-73264db91d7f" width="100%" controls></video>
      <br><strong>China EV market competition</strong><br>
      Compares 2024 monthly sales, annual pacing, and year-over-year growth across major EV brands, highlighting market leaders and growth inflection points.
    </td>
  </tr>
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

This screenshot shows the hosted product's template browser. For public recipes and reusable source, see [DataMagic Cards](#-datamagic-cards) above.

<div align="center">
<img src="./images/template-gallery.png" width="760" alt="DataMagic template gallery">
</div>

## ✨ Features

DataMagic is built around two core principles: **data-grounded scenes** (every visual element bound directly to a data field, keeping the story fully traceable and editable) and **narration-aware timing** (animations auto-synced with the voiceover, producing a coherent narrative rather than a collection of disconnected charts).

- AI-assisted chart type and visual template recommendation.
- Customizable generation workflow for reviewing and adjusting DataMagic recommendations during scene planning, visual design, narrative arrangement, and animation highlighting.
- Runtime preview, direct visual editing, and natural-language refinement.

## 🧩 Data-Video Skill

If you want to install the Skill into an agent environment rather than use it inside a cloned repository, the existing installation entry points are below. Check that your client supports the relevant plugin commands; see the [Skill README](./skills/datamagic-video/README.md) for configuration and usage.

```bash
claude plugin marketplace add HKUSTDial/DataMagic
claude plugin install datamagic-video@datamagic
```

Codex:

```bash
codex plugin marketplace add HKUSTDial/DataMagic
codex plugin add datamagic-video@datamagic
```

Or install from shell:

```bash
curl -fsSL https://raw.githubusercontent.com/HKUSTDial/DataMagic/main/install.sh | bash
```

Then ask your agent: *"Make a narrated data video from this CSV …"*. See the
[skill README](./skills/datamagic-video/README.md) for details.

## 🤝 Community

Cards, native templates, and the Skill are available in this repository; the hosted system's full backend is not public. ⭐ Star the repository and contribute examples or feedback to improve these resources.

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

- [x] Public recipe cards, animated previews, native template source, and an Agent Skill.
- [x] Core generation modes — Full Pipeline, Fast Generation, and Single Chart.
- [x] Template gallery and runtime editing — preview styles, edit generated text, and refine with natural language.
- [x] Bilingual public documentation — English and Chinese release docs.
- [x] Data-video skill package — reusable guidance for data-video planning, chart selection, DVSpec authoring, and animation design. ([skills/datamagic-video/](./skills/datamagic-video/))
- [ ] More diverse visual styles — richer narrative cards, report themes, domain-specific templates, and presentation-ready layouts.
- [ ] Multitrack workbench and Jianying delivery — an experimental implementation exists; development is on hold until the workflow is simplified and Mac desktop acceptance is completed. ([Experimental notes](cards/workbench/README.md))
- [ ] Recommendation and feedback learning — improve template ranking from user preferences and real generation outcomes.
- [ ] Public implementation materials — clearer notes for the pipeline, DVSpec, template adapters, example datasets, and deployment.
- [ ] Expanded export and sharing workflows.
- [ ] Team/admin monitoring for production deployments.

## 📖 Citation

If you find DataMagic useful in your research or work, please cite:

**IEEE VIS 2026 full paper:**

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

**VLDB 2026 demo paper:**

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

## 📄 License

This repository is released under the MIT License. See [LICENSE](./LICENSE). Report security issues privately using [SECURITY.md](./SECURITY.md).

## 📚 Documentation

- [Data-Video Skill](./skills/datamagic-video/README.md)
- [DataMagic Cards recipes and templates](./cards/README.en.md)
- [Pipeline Overview](./docs/pipeline-overview.md)
- [DVSpec Overview](./docs/dvspec-overview.md)
- [Input and Output Examples](./docs/input-output-examples.md)
- [Help Center](./docs/help-center.md)
- [Release Status](./docs/release-status.md)

<div align="center">
<img src="./assets/framework-1.png" width="760" alt="DataMagic system framework">
</div>
