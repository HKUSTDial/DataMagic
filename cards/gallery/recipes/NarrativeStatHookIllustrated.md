# Narrative Stat Hook Illustrated

- ID: `StyleTemplate-NarrativeStatHookIllustrated`
- 中文：叙事指标钩子插画式
- Category: `narrative_card`
- Compatible: narrative_card
- Tags: Narrative, StatHook, Illustrated, Image

## Use

Left circular illustration + right oversized stat number. Use when a dramatic number is paired with a thematic image to create visual impact.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-NarrativeStatHookIllustrated`
- Data contract: `title, metric, illustration`
- Entrance: `illustrated stat reveal`
- Emphasis: `number emphasis`
- Highlight targets: number, illustration
- Trigger phrase: `Revenue`
- Suggested narration: Revenue is the illustrated stat that anchors the story.
- Animation intent: Anchor the narrative around an illustrated number.
- Preview status: runtime motion

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-NarrativeStatHookIllustrated`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/text/RuntimeNarrativeStatHookIllustrated.tsx` (`RuntimeNarrativeStatHookIllustrated`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/NarrativeStatHookIllustrated/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/NarrativeStatHookIllustrated/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-NarrativeStatHookIllustrated out/NarrativeStatHookIllustrated.mp4 --props=templates/runtime-cards/NarrativeStatHookIllustrated/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
