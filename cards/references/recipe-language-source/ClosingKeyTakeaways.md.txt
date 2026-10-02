# Closing Key Takeaways

- ID: `StyleTemplate-ClosingKeyTakeaways`
- 中文：结尾关键结论
- Category: `narrative_scene`
- Compatible: closing
- Tags: Closing, Takeaways, Dark

## Use

Use a dark closing with three numbered takeaway cards (01/02/03) for short narrative conclusions.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-ClosingKeyTakeaways`
- Data contract: `title, takeaways`
- Entrance: `takeaway reveal`
- Emphasis: `bullet emphasis`
- Highlight targets: takeaways
- Trigger phrase: `takeaways`
- Suggested narration: Three takeaways summarize the signal for the next decision.
- Animation intent: Reveal closing takeaways one by one.
- Preview status: runtime motion

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-ClosingKeyTakeaways`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/text/RuntimeClosingKeyTakeaways.tsx` (`RuntimeClosingKeyTakeaways`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/ClosingKeyTakeaways/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/ClosingKeyTakeaways/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-ClosingKeyTakeaways out/ClosingKeyTakeaways.mp4 --props=templates/runtime-cards/ClosingKeyTakeaways/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
