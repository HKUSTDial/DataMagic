# Dual Series Pulse Line

- ID: `StyleTemplate-DualSeriesPulseLine`
- 中文：双系列脉冲折线图
- Category: `line_chart`
- Compatible: line_chart
- Tags: Line, Dual series, Dark

## Use

Use a dark two-series line style for actual-versus-target trend comparisons.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-DualSeriesPulseLine`
- Data contract: `two time series`
- Entrance: `dual line draw`
- Emphasis: `series point highlight`
- Highlight targets: series, point
- Trigger phrase: `Revenue`
- Suggested narration: Revenue remains the series to watch in August.
- Animation intent: Bring the named series forward while muting the other series.
- Preview status: runtime narrative highlight

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-DualSeriesPulseLine`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/line_chart/RuntimeDualSeriesPulseLine.tsx` (`DualSeriesPulseLineDemo`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/DualSeriesPulseLine/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/DualSeriesPulseLine/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-DualSeriesPulseLine out/DualSeriesPulseLine.mp4 --props=templates/runtime-cards/DualSeriesPulseLine/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
