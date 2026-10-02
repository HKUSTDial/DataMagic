# Create with DataMagic recipes

[返回首页](../../README.md) · [Homepage](../../README.en.md) · [Browse effects](https://datamagic.chat/cards/)

The `datamagic` Skill is the agent guide for the DataMagic recipe library. It helps a coding agent find an effect, read its implementation, adapt your data and media, render a video, and check the result.

配套 Skill 把“看到一个喜欢的效果”和“用自己的内容做出来”连起来：选配方、读源码、换数据、调整画面、渲染并检查结果。

## Start in the repository / 在仓库中开始

Clone the repository and open your coding agent in it:

```bash
git clone https://github.com/HKUSTDial/DataMagic.git
cd DataMagic
```

Ask the agent to use `skills/datamagic/SKILL.md`. The `cards/` directory contains the previews, source, schemas, sample props, and render entry. For local rendering, use Node.js 20.10+ and install the package dependencies with `npm ci` inside `cards/`.

### Use an effect you selected / 复用选好的效果

Watch the gallery preview, copy its implementation instructions, and provide your data or media.

> 使用 datamagic Skill，把 RankedReveal 换成我的 sales.csv，保留倒序揭晓的节奏，改成中文和品牌配色。输出 MP4 和可编辑源码。
>
> Use datamagic to adapt RankedReveal to my sales.csv. Keep the countdown reveal, apply my brand colors, and deliver an MP4 with editable source.

### Find an effect for your goal / 根据用途选配方

> 我想比较各地区的销售变化。看看这份 CSV，推荐适合的配方，说明各自能讲清楚什么。
>
> Inspect this CSV and recommend recipes for explaining sales changes across regions. Explain what each one would help communicate.

The agent searches by data shape and purpose, then explains the fit. If you ask it to make the video as well, it can choose a suitable recipe and continue.

### Build a story / 组合成故事

> 用这份季度数据做一个 30 秒故事：开场展示增长，中间比较地区贡献，最后总结发现。复用库里的配方，统一颜色和文字样式。
>
> Make a 30-second story from this quarterly data: open with the growth, compare regional contributions, then close with the main finding. Reuse library recipes and keep the styling consistent.

The agent plans the beats, selects recipes, and composes the shots. Add your preferred aspect ratio, supplied media, and narration requirements when relevant.

## Find source files / 查找配方与源码

From the repository root:

```bash
node skills/datamagic/scripts/cards.cjs list --query ranking
node skills/datamagic/scripts/cards.cjs inspect RankedReveal
```

The helper returns absolute paths and the render Composition ID. All 139 cards have editable source, schemas and sample data. For the complete local workflow, see [Cards documentation](../../cards/README.en.md) / [中文](../../cards/README.md).

## Install into your agent / 安装到智能体环境

You can also install the Skill as a plugin. Keep a local DataMagic checkout for the recipe assets and source; point a separately installed Skill to it with `--cards /path/to/DataMagic/cards`.

### Claude Code

```bash
claude plugin marketplace add HKUSTDial/DataMagic
claude plugin install datamagic@datamagic
```

### Codex

```bash
codex plugin marketplace add HKUSTDial/DataMagic
codex plugin add datamagic@datamagic
```

### Repository installer

The repository's [install.sh](../../install.sh) supports both clients:

```bash
bash install.sh --only claude
# or
bash install.sh --only codex
```

## Deeper authoring / 进阶制作

For analysis-led videos, custom scripts, narration, or DVSpec plans, use [Plan a complete video from data](rules/full-story-workflow.md). The same Skill draws on these rules when the task needs them.

原来的数据分析、叙事规划、旁白和 DVSpec 工作流继续保留为进阶能力。制作时按任务调用；已有配方的替换和调整从模板直接开始。

| Resource | Purpose |
|---|---|
| [SKILL.md](SKILL.md) | Select the appropriate route for the user's task |
| [cards-workflow.md](rules/cards-workflow.md) | Inspect, adapt, compose and render recipes |
| [cards.cjs](scripts/cards.cjs) | Locate the library and resolve source files |
| [full-story-workflow.md](rules/full-story-workflow.md) | Plan a custom video from data |
| [self-review.md](rules/self-review.md) | Review values, visuals and any audio |
| [Document history](../../docs/archive/README.md) | Previous README and Skill snapshots |

[DataMagic research and citation](../../README.en.md#research) · [在线系统](../../docs/online-system.zh-CN.md) · [MIT License](../../LICENSE)
