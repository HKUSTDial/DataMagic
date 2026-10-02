# Opening Split Metrics

- ID: `StyleTemplate-OpeningSplitMetrics`
- 中文：开场分屏指标
- Category: `narrative_scene`
- Compatible: opening
- Tags: Opening, Split, Metrics

## Use

Use a light split-screen opening that hands off two decisive headline numbers next to a wrapping title and one-sentence subtitle.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-OpeningSplitMetrics`
- Data contract: `title, subtitle, metrics`
- Entrance: `split reveal`
- Emphasis: `metric spotlight`
- Highlight targets: title, metrics
- Trigger phrase: `headline metrics`
- Suggested narration: Two headline metrics frame the story before the charts begin.
- Animation intent: Reveal title and two metric anchors across the split layout.
- Preview status: runtime motion

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-OpeningSplitMetrics`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/text/RuntimeOpeningSplitMetrics.tsx` (`RuntimeOpeningSplitMetrics`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/OpeningSplitMetrics/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/OpeningSplitMetrics/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-OpeningSplitMetrics out/OpeningSplitMetrics.mp4 --props=templates/runtime-cards/OpeningSplitMetrics/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
