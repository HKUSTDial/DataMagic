# 主持人与图表舞台

[English](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/en/PresenterChartStage.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`PresenterChartStage`

## 用途

程序化主持人轮廓与可编辑图表分区协作，按照讲解节拍切换注意力和结论。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/presenter-chart-stage/PresenterChartStage.tsx`
- 数据结构：`templates/presenter-chart-stage/schema.json`
- 示例数据：`templates/presenter-chart-stage/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

- 实现源码：`templates/presenter-chart-stage/PresenterChartStage.tsx`

## 适用情境

主持人位于一侧，数据图表位于另一侧；讲解到关键节拍时，主持人手势、当前柱体、上下文注释和结论协同聚焦。适合商业解读、财报讲解、知识视频和播客式数据段落。主持人为程序化轮廓，既可作为无素材版本直接使用，也可在后续替换为绿幕或分割后的人物素材。

## 数据契约

- `presenterSide` 仅接受 `left` 或 `right`，图表必须自动排布到相反一侧。
- `activeBeat` 指向 `chartData` 中当前讲解项，必须位于数组范围内。
- 每个 `chartData` 项包含 `label`、`value` 和讲解语境 `context`。
- `takeaway` 应解释当前节拍为何重要，而不是简单重复数值。
- 演示数据必须通过 `source` 明确标注。

## 舞台契约

- 人物轮廓、姓名牌、标题和来源保持在 64px 安全区内。
- 人物始终面向图表，左右切换不能镜像文字或图表。
- 固定标题与来源不随图表高亮移动；程序化人物不得遮挡标签或数值。
- 中文字体使用 `Noto Sans SC` 回退；画布为 1920×1080。

## 动画契约

- 0–1.6 秒：主持人、标题和图表舞台建立空间关系。
- 1.2–3.0 秒：柱体按顺序出现。
- 2.1–4.4 秒：主持人手势指向图表，`activeBeat` 高亮并显示语境。
- 4.8–5.7 秒：结论卡进入。
- 7.0–8.0 秒：人物、图表和固定 UI 完全静止。
- 所有运动由 Remotion 帧驱动，不使用 CSS animation。

## 文件

- `templates/presenter-chart-stage/schema.json`
- `templates/presenter-chart-stage/sample-data.json`
- `templates/presenter-chart-stage/PresenterChartStage.tsx`

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-PresenterChartStage out/PresenterChartStage.mp4 --props=templates/presenter-chart-stage/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
