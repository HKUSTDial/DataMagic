# Closing Simple Outro

- ID: `StyleTemplate-ClosingSimpleOutro`
- 中文：结尾简洁片尾
- Category: `narrative_scene`
- Compatible: closing
- Tags: Closing, Outro, Minimal

## Use

Use a simple closing outro with one final title and one short closing line. Avoid summary bullets, scorecards, and action lists.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-ClosingSimpleOutro`
- Data contract: `title, subtitle`
- Entrance: `closing reveal`
- Emphasis: `takeaway emphasis`
- Highlight targets: title, subtitle
- Trigger phrase: `takeaway`
- Suggested narration: The takeaway is simple: growth is strongest when efficiency follows.
- Animation intent: Close with one clean final message.
- Preview status: runtime motion

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-ClosingSimpleOutro`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/text/RuntimeClosingSimpleOutro.tsx` (`RuntimeClosingSimpleOutro`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/ClosingSimpleOutro/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/ClosingSimpleOutro/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-ClosingSimpleOutro out/ClosingSimpleOutro.mp4 --props=templates/runtime-cards/ClosingSimpleOutro/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
