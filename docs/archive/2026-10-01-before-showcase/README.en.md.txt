<div align="center">
<img src="./assets/datamagic_logo.png" width="380" alt="DataMagic Logo">

**Pick an effect. Tell a story with your data.**

*A reusable recipe library for animated charts and data stories, for creators, analysts, and researchers.*

[![IEEE VIS 2026](https://img.shields.io/badge/IEEE_VIS_2026-Accepted-007b8f)](https://arxiv.org/abs/2609.33403)
[![VLDB 2026 Demo](https://img.shields.io/badge/VLDB_2026-Demo_Track-blue)](https://arxiv.org/abs/2606.20388)

[中文](README.md) | [English](README.en.md)

[Browse recipes](https://datamagic.chat/cards/) · [Start creating](#create) · [Build a story](#stories) · [Try online](https://datamagic.chat/) · [Research & citation](#research)
</div>

DataMagic offers **139 motion recipe cards**, each with a preview, editable source, and sample data. Choose an effect and give its implementation instructions and your data to a coding agent. The companion `datamagic-video` Skill guides the agent through reading the recipe, adapting the template, rendering, and checking the result.

<a id="examples"></a>

## Explore the effects

Click an image to watch its animation, or open the recipe for implementation details and source locations.

| Character host and data board | Presenter-to-chart handoff | Countdown ranking |
|---|---|---|
| [![Character perspective board](cards/gallery/media/poster/CharacterPerspectiveBoard.png)](https://datamagic.chat/cards/#CharacterPerspectiveBoard) | [![Presenter data takeover](cards/gallery/media/poster/PresenterDataTakeover.png)](https://datamagic.chat/cards/#PresenterDataTakeover) | [![Countdown ranking](cards/gallery/media/poster/RankedReveal.png)](https://datamagic.chat/cards/#RankedReveal) |
| Explain with a character, perspective board, and staged evidence. [Recipe](cards/recipes/CharacterPerspectiveBoard.md) | Shift attention between the presenter and the data. [Recipe](cards/recipes/PresenterDataTakeover.md) | Build suspense and comparison through sequential reveals. [Recipe](cards/recipes/RankedReveal.md) |

| Footage to evidence | Travel through a trend | Maps and regional comparison |
|---|---|---|
| [![Footage to evidence](cards/gallery/media/poster/FootageEvidenceReveal.png)](https://datamagic.chat/cards/#FootageEvidenceReveal) | [![Timeline camera](cards/gallery/media/poster/ChartTimelineTravel.png)](https://datamagic.chat/cards/#ChartTimelineTravel) | [![Regional map and ranking](cards/gallery/media/poster/ChoroplethRankMap.png)](https://datamagic.chat/cards/#ChoroplethRankMap) |
| Establish the scene, then introduce its key metrics. [Recipe](cards/recipes/FootageEvidenceReveal.md) | Move along a timeline and pause at important changes. [Recipe](cards/recipes/ChartTimelineTravel.md) | Explain differences through geography and rankings. [Recipe](cards/recipes/ChoroplethRankMap.md) |

The library also covers bars, lines, shares, scatterplots, flows, openings, conclusions, and transitions, plus a [9:16 portrait ranking](cards/recipes/PortraitRankedReveal.md) for mobile content. Adapt the data, copy, colors, media, and timing, and keep the editable source.

**[Explore all recipes →](https://datamagic.chat/cards/)**

<a id="create"></a>

## Create with your content

### 1. Pick an effect

Watch the gallery previews and click “Copy implementation instructions.” If you are still choosing an effect, give the agent your data and intended use so it can suggest suitable recipes.

### 2. Give the recipe and data to your agent

Clone the repository and open your coding agent in its directory:

```bash
git clone https://github.com/HKUSTDial/DataMagic.git
cd DataMagic
```

Paste the implementation instructions, attach your data, and describe the result you want:

> Use this repository's datamagic-video Skill to adapt RankedReveal to my sales.csv. Keep the sequential reveal, use my brand colors, and deliver an MP4 with editable source.

The companion Skill helps the agent locate source files, map data fields, adapt the visuals, and check the result. You can also start with a goal:

> I want to explain how sales changed across regions. Recommend suitable recipes for this CSV, then use the best fit to create a short video.

### 3. Review and refine

Check the values, labels, and conclusion. Ask the agent to adjust the result: “Hold the ending for two more seconds,” “Highlight the East region,” or “Adapt the layout for mobile viewing.”

[Usage and installation guide](skills/datamagic-video/README.md) · [Browse and render locally](cards/README.en.md)

<a id="stories"></a>

## Build a story from several shots

Open with a question, present evidence through charts, then develop the explanation through comparisons, turns, and a conclusion. **8 story blueprints** offer starting structures for the agent to select recipes and compose shots around your content.

> Use this quarterly sales table to make a 30-second story: introduce the growth, compare regional contributions, and summarize the main finding. Reuse library recipes and keep colors and captions consistent.

For deeper data analysis, scripts, and narration, follow [Plan a complete video from data](skills/datamagic-video/rules/full-story-workflow.md). The same Skill draws on analysis, narrative planning, and timing guidance as the task requires.

<a id="online"></a>

## Try automatic generation online

The [DataMagic online system](https://datamagic.chat/) combines table upload, data analysis, scene planning, narration, and video export. Review its recommendations and adjust the content and visuals.

Here is an existing complete data story:

<video src="https://github.com/user-attachments/assets/e15d0742-af24-4b30-a640-73264db91d7f" width="760" controls></video>

China EV market competition: monthly sales, annual pacing, and growth across brands.

**[Explore the system walkthrough, generation modes, and more complete examples →](docs/online-system.md)**

<a id="research"></a>

## Research and documentation

DataMagic research studies data binding, narrative orchestration, and narration timing, informing both recipe reuse and complete video production.

- [IEEE VIS 2026: Authoring Data Videos through Declarative Multi-Agent Orchestration](https://arxiv.org/abs/2609.33403)
- [VLDB 2026 Demo: Transforming Tabular Data into Data Insight Video](https://arxiv.org/abs/2606.20388)
- [Project homepage](https://datamagic-home.github.io) · [Pipeline](docs/pipeline-overview.md) · [DVSpec](docs/dvspec-overview.md) · [Input/output examples](docs/input-output-examples.md)

<details>
<summary>Cite DataMagic (BibTeX)</summary>

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

</details>

## What's next

- [ ] More story recipes, domain examples, and portrait layouts.
- [ ] More reuse examples across different datasets and topics.
- [ ] Multitrack workbench and Jianying delivery: simplify the workflow and complete Mac desktop validation; retained as a future TODO.

<a id="community"></a>

## Community and contributions

Share what you create, contribute a recipe, or report an issue through [GitHub Issues](https://github.com/HKUSTDial/DataMagic/issues). [Contributing guide](CONTRIBUTING.md)

<img src="./images/wechat-community-qr.jpg" width="180" alt="DataMagic WeChat community QR code">

[Online system and trial credits](docs/online-system.md) · [Document history](docs/archive/README.md) · [MIT License](LICENSE) · [Security reports](SECURITY.md)

