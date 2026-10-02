# Narrative Bullets Illustrated

- ID: `StyleTemplate-NarrativeBulletsIllustrated`
- 中文：叙事要点插画式
- Category: `narrative_card`
- Compatible: narrative_card
- Tags: Narrative, Bullets, Illustrated, Image, Takeaways

## Use

Left bullet takeaways + right thematic illustration. Use for resolution-stage summaries that benefit from a visual anchor alongside key points.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-NarrativeBulletsIllustrated`
- Data contract: `bullets plus illustration`
- Entrance: `illustrated bullet reveal`
- Emphasis: `bullet emphasis`
- Highlight targets: bullets, illustration
- Trigger phrase: `signals`
- Suggested narration: Three signals explain the pattern with supporting context.
- Animation intent: Reveal illustrated bullets one by one.
- Preview status: runtime motion

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-NarrativeBulletsIllustrated`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/text/RuntimeNarrativeBulletsIllustrated.tsx` (`RuntimeNarrativeBulletsIllustrated`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/NarrativeBulletsIllustrated/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/NarrativeBulletsIllustrated/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-NarrativeBulletsIllustrated out/NarrativeBulletsIllustrated.mp4 --props=templates/runtime-cards/NarrativeBulletsIllustrated/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
