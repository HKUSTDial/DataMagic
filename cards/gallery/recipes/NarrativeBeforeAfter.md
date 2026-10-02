# Narrative Before After

- ID: `StyleTemplate-NarrativeBeforeAfter`
- 中文：叙事前后
- Category: `narrative_card`
- Compatible: narrative_card
- Tags: Narrative, Before, After

## Use

Two-panel card with BEFORE and AFTER states: time label, key metric, and context line per panel. Muted top bar for before, bright accent for after. Use when a policy, event, or trend created a clear break point.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-NarrativeBeforeAfter`
- Data contract: `before and after points`
- Entrance: `before-after reveal`
- Emphasis: `side emphasis`
- Highlight targets: before, after
- Trigger phrase: `after`
- Suggested narration: The before and after view shows the operational shift.
- Animation intent: Reveal the before and after contrast.
- Preview status: runtime motion

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-NarrativeBeforeAfter`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/text/RuntimeNarrativeBeforeAfter.tsx` (`RuntimeNarrativeBeforeAfter`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/NarrativeBeforeAfter/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/NarrativeBeforeAfter/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-NarrativeBeforeAfter out/NarrativeBeforeAfter.mp4 --props=templates/runtime-cards/NarrativeBeforeAfter/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
