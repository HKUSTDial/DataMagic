# Wide Comparison Grid

- ID: `StyleTemplate-WideComparisonGrid`
- 中文：宽幅对比网格
- Category: `comparison_chart`
- Compatible: comparison_chart
- Tags: Comparison, Grid, MultiMetric

## Use

Use for 6-10 categories with 2-3 metrics each. Wide table layout: category column + 2-3 metric columns side by side.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-WideComparisonGrid`
- Data contract: `grouped comparison values`
- Entrance: `grid reveal`
- Emphasis: `group focus highlight`
- Highlight targets: group, metric, value
- Trigger phrase: `Q4`
- Suggested narration: Q4 carries the strongest comparison signal.
- Animation intent: Highlight the named comparison grid group.
- Preview status: runtime narrative highlight

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-WideComparisonGrid`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/comparison_chart/RuntimeWideComparisonGrid.tsx` (`WideComparisonGridDemo`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/WideComparisonGrid/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/WideComparisonGrid/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-WideComparisonGrid out/WideComparisonGrid.mp4 --props=templates/runtime-cards/WideComparisonGrid/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
