# Area Stack Trend

- ID: `StyleTemplate-AreaStackTrend`
- 中文：面积堆叠趋势
- Category: `line_chart`
- Compatible: line_chart, trend_analysis
- Tags: Stacked, Area, Trend

## Use

Stacked area chart for 3-5 series stacking into a total over 5-15 time periods.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-AreaStackTrend`
- Data contract: `multi-series time series`
- Entrance: `stacked area draw`
- Emphasis: `series focus highlight`
- Highlight targets: series, area, label
- Trigger phrase: `Mobile`
- Suggested narration: Mobile remains the largest channel in 2024.
- Animation intent: Bring the named channel forward while muting the other stacked areas.
- Preview status: runtime narrative highlight

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-AreaStackTrend`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/line_chart/RuntimeAreaStackTrend.tsx` (`AreaStackTrendDemo`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/AreaStackTrend/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/AreaStackTrend/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-AreaStackTrend out/AreaStackTrend.mp4 --props=templates/runtime-cards/AreaStackTrend/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
