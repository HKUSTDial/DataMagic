# Weekly Activity Heatmap

- ID: `StyleTemplate-WeeklyActivityHeatmap`
- 中文：每周活跃度热力图
- Category: `heatmap`
- Compatible: heatmap
- Tags: Heatmap, Calendar, Activity

## Use

Use a calendar-style heatmap for two-dimensional intensity over day-of-week × hour-of-day or category × period.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-WeeklyActivityHeatmap`
- Data contract: `x/y/intensity matrix`
- Entrance: `activity cell reveal`
- Emphasis: `cell focus highlight`
- Highlight targets: cell, day, period
- Trigger phrase: `Wed`
- Suggested narration: Wed contains the weekly activity peak.
- Animation intent: Highlight the peak activity row.
- Preview status: runtime narrative highlight

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-WeeklyActivityHeatmap`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/heatmap/RuntimeWeeklyActivityHeatmap.tsx` (`WeeklyActivityHeatmapDemo`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/WeeklyActivityHeatmap/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/WeeklyActivityHeatmap/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-WeeklyActivityHeatmap out/WeeklyActivityHeatmap.mp4 --props=templates/runtime-cards/WeeklyActivityHeatmap/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
