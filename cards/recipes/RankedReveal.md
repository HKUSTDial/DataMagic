# 倒序揭晓排行榜

[English](en/RankedReveal.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`RankedReveal`

## 用途

从末位逐项揭晓排名，已出现的对象持续保留，数值与条长来自同一数据，最后强调领先差距。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/ranked-reveal/RankedReveal.tsx`
- 数据结构：`templates/ranked-reveal/schema.json`
- 示例数据：`templates/ranked-reveal/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

## 适用情境

排名位置固定，按 at 从末位逐项揭晓；已揭晓的行保留。最终强调第一名及差距。

## 源码与文件

- 组件：`templates/ranked-reveal/RankedReveal.tsx`
- 示例数据：`templates/ranked-reveal/sample-data.json`
- 数据结构：`templates/ranked-reveal/schema.json`
- 时间辅助函数：`src/sceneTiming.ts`
- 渲染标识：`ShotCraft-RankedReveal`
- 预览：`gallery/media/RankedReveal.mp4`

## 数据契约

`rows` 包含稳定的 `id`、标签 `label`、数值 `value`、揭示时间 `at`（秒）和解读 `caption`。`maximum` 定义所有条形共同的零基线尺度，数值必须在 0 到 maximum 之间。相邻揭示至少间隔 0.8 秒。


标题、问题、结论、指标名称、单位与来源均可替换。改变数值后应同时修改 caption 和 takeaway，不能保留旧结论。

## 动画与素材

10 秒，1920×1080，30 fps，H.264，CRF 18。所有动画按帧计算，可以逐帧定位。此预览无配音。


条形按数值同比例绘制，未揭晓数据不提前显示。预览采用倒序时序，既可用于前三名揭晓，也可用于 2–5 项榜单。\n\nBars use proportional values. Unrevealed entries remain hidden; settled entries persist. The same component supports a top-three countdown or a 2–5-item list.

## 使用

```bash
npm install
npx remotion render src/index.ts ShotCraft-RankedReveal out/RankedReveal.mp4 --props=templates/ranked-reveal/sample-data.json --codec=h264 --crf=18
```

## 给代码智能体的指令

使用 RankedReveal 的原始组件和 schema，以我的数据替换示例。保留独立图层、共同尺度和来源标注。先检查数据与结论是否一致，再渲染开场、每个揭示节点及结尾；检查重叠、截断、数值映射和短素材行为。输出源码、数据文件与高清 MP4。

## 对象图像

对象可设置 `iconSrc`，指向 public 中的国旗、品牌素材或类别插图；保持名称和数值可读，图像随对象身份移动，不按当前排名重新分配。倒序揭晓时图标与名称同步出现。示例公司使用通用类别插图。

## 补充制作约束

- 使用 2–5 行，每行有唯一身份、标签、数值、秒单位揭晓时间和解读。
- 共同零基线、同单位，数值不得越界，事件间隔至少 0.8 秒。
- 位置保持稳定，从末位逐项揭晓，已揭晓内容保留，最终强调领先者与差距。
- 名次由值计算，同值并列，作者的揭晓顺序与排名计算独立。
- 数据变化时同步改写解读和结论，不自动推断因果或生成旁白。
- 10 秒、1920×1080、30fps、H.264 CRF 18；`at` 不是自动逐词对齐，旁白时间需另外准备。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-RankedReveal out/RankedReveal.mp4 --props=templates/ranked-reveal/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
