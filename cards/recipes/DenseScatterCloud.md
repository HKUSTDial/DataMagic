# Dense Scatter Cloud

- ID: `StyleTemplate-DenseScatterCloud`
- 中文：密集散点图云
- Category: `scatter_chart`
- Compatible: scatter_chart
- Tags: Scatter, Cloud, Outliers

## Use

Use for two-dimensional scatter with 12-30 named entities. Only 1-3 hero outliers carry visible labels.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-DenseScatterCloud`
- Data contract: `x/y scatter items`
- Entrance: `point cloud reveal`
- Emphasis: `point focus highlight`
- Highlight targets: point, label
- Trigger phrase: `Enterprise`
- Suggested narration: Enterprise is the outlier to watch.
- Animation intent: Highlight the named scatter point and label.
- Preview status: runtime narrative highlight

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-DenseScatterCloud`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/scatter_chart/RuntimeDenseScatterCloud.tsx` (`DenseScatterCloudDemo`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/DenseScatterCloud/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/DenseScatterCloud/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-DenseScatterCloud out/DenseScatterCloud.mp4 --props=templates/runtime-cards/DenseScatterCloud/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
