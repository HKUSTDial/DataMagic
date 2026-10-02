# Light Wide Comparison

- ID: `StyleTemplate-LightWideComparison`
- 中文：浅色宽幅对比
- Category: `comparison_chart`
- Compatible: comparison_chart
- Tags: Comparison, Wide, Light

## Use

Light multi-entity comparison table for 7-10 rows × 4 metrics with mini progress bars and alternating row shading.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-LightWideComparison`
- Data contract: `grouped comparison values`
- Entrance: `wide group reveal`
- Emphasis: `group focus highlight`
- Highlight targets: group, bar, value
- Trigger phrase: `Q4`
- Suggested narration: Q4 is the comparison group to watch.
- Animation intent: Highlight the named wide comparison group.
- Preview status: runtime narrative highlight

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-LightWideComparison`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/comparison_chart/RuntimeLightWideComparison.tsx` (`LightWideComparisonDemo`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/LightWideComparison/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/LightWideComparison/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-LightWideComparison out/LightWideComparison.mp4 --props=templates/runtime-cards/LightWideComparison/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
