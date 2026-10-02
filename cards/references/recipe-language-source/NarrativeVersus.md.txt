# Narrative Versus

- ID: `StyleTemplate-NarrativeVersus`
- 中文：叙事对比
- Category: `narrative_card`
- Compatible: narrative_card
- Tags: Narrative, Versus, Comparison

## Use

Two-column head-to-head card with a vertical VS divider. Each side shows an entity label, headline claim, and supporting description. Use before or after a direct comparison chart.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-NarrativeVersus`
- Data contract: `two opposing points`
- Entrance: `versus reveal`
- Emphasis: `side emphasis`
- Highlight targets: left, right
- Trigger phrase: `cost pressure`
- Suggested narration: Revenue rose quickly, but cost pressure still matters.
- Animation intent: Reveal a two-sided comparison card.
- Preview status: runtime motion

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-NarrativeVersus`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/text/RuntimeNarrativeVersus.tsx` (`RuntimeNarrativeVersus`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/NarrativeVersus/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/NarrativeVersus/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-NarrativeVersus out/NarrativeVersus.mp4 --props=templates/runtime-cards/NarrativeVersus/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
