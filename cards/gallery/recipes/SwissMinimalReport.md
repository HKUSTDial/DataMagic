# Swiss Minimal Report

- ID: `StyleTemplate-SwissMinimalReport`
- 中文：瑞士极简报告
- Category: `bar_chart`
- Compatible: bar_chart, comparison_chart
- Tags: Swiss, Minimal, Report

## Use

Use a Swiss minimal report style for precise executive reporting with strict grid and sparse color.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-SwissMinimalReport`
- Data contract: `category values`
- Entrance: `report row reveal`
- Emphasis: `row focus highlight`
- Highlight targets: row, label, value
- Trigger phrase: `Aug`
- Suggested narration: August is the strongest reported value.
- Animation intent: Highlight the named report row.
- Preview status: runtime narrative highlight

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-SwissMinimalReport`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/comparison_chart/RuntimeSwissMinimalReport.tsx` (`SwissMinimalReportDemo`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/SwissMinimalReport/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/SwissMinimalReport/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-SwissMinimalReport out/SwissMinimalReport.mp4 --props=templates/runtime-cards/SwissMinimalReport/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
