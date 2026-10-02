# Long Trendline

- ID: `StyleTemplate-LongTrendline`
- 中文：长序列趋势线
- Category: `line_chart`
- Compatible: line_chart, trend_analysis
- Tags: Trend, TimeSeries, Long

## Use

Use for single-series time series with 15-30 ordered points. Sparse x-axis labels, area fill under the line, top-right peak KPI.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-LongTrendline`
- Data contract: `long time series`
- Entrance: `line draw`
- Emphasis: `point focus highlight`
- Highlight targets: point, value
- Trigger phrase: `August`
- Suggested narration: August is the latest high in the long trend.
- Animation intent: Mark the named late-period point.
- Preview status: runtime narrative highlight

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-LongTrendline`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/line_chart/RuntimeLongTrendline.tsx` (`LongTrendlineDemo`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/LongTrendline/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/LongTrendline/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-LongTrendline out/LongTrendline.mp4 --props=templates/runtime-cards/LongTrendline/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
