# Presenter Chart Stage / 主持人与图表舞台

- ID: `ShotCraft-PresenterChartStage`
- Recipe key: `PresenterChartStage`
- Category: `spatial_overlay`
- Native implementation: `templates/presenter-chart-stage/PresenterChartStage.tsx`

## Use / 适用场景

主持人位于一侧，数据图表位于另一侧；讲解到关键节拍时，主持人手势、当前柱体、上下文注释和结论协同聚焦。适合商业解读、财报讲解、知识视频和播客式数据段落。主持人为程序化轮廓，既可作为无素材版本直接使用，也可在后续替换为绿幕或分割后的人物素材。

## Data contract / 数据契约

- `presenterSide` 仅接受 `left` 或 `right`，图表必须自动排布到相反一侧。
- `activeBeat` 指向 `chartData` 中当前讲解项，必须位于数组范围内。
- 每个 `chartData` 项包含 `label`、`value` 和讲解语境 `context`。
- `takeaway` 应解释当前节拍为何重要，而不是简单重复数值。
- 演示数据必须通过 `source` 明确标注。

## Stage contract / 舞台契约

- 人物轮廓、姓名牌、标题和来源保持在 64px 安全区内。
- 人物始终面向图表，左右切换不能镜像文字或图表。
- 固定标题与来源不随图表高亮移动；程序化人物不得遮挡标签或数值。
- 中文字体使用 `Noto Sans SC` 回退；画布为 1920×1080。

## Animation contract / 动画契约

- 0–1.6 秒：主持人、标题和图表舞台建立空间关系。
- 1.2–3.0 秒：柱体按顺序出现。
- 2.1–4.4 秒：主持人手势指向图表，`activeBeat` 高亮并显示语境。
- 4.8–5.7 秒：结论卡进入。
- 7.0–8.0 秒：人物、图表和固定 UI 完全静止。
- 所有运动由 Remotion 帧驱动，不使用 CSS animation。

## Files

- `templates/presenter-chart-stage/schema.json`
- `templates/presenter-chart-stage/sample-data.json`
- `templates/presenter-chart-stage/PresenterChartStage.tsx`
