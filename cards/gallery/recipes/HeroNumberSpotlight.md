# Hero Number Spotlight

- ID: `StyleTemplate-HeroNumberSpotlight`
- 中文：核心数字聚焦
- Category: `stat_cards`
- Compatible: hero_number, stat_cards
- Tags: Hero number, Metric, Impact

## Use

Use a hero-number spotlight style where one key metric dominates the scene with a short supporting label.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-HeroNumberSpotlight`
- Data contract: `hero KPI`
- Entrance: `spotlight reveal`
- Emphasis: `hero KPI highlight`
- Highlight targets: hero number, supporting metric
- Trigger phrase: `Revenue`
- Suggested narration: Revenue takes the spotlight as the key KPI.
- Animation intent: Spotlight the named hero metric.
- Preview status: runtime narrative highlight

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-HeroNumberSpotlight`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/stat_cards/RuntimeHeroNumberSpotlight.tsx` (`HeroNumberSpotlightDemo`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/HeroNumberSpotlight/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/HeroNumberSpotlight/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-HeroNumberSpotlight out/HeroNumberSpotlight.mp4 --props=templates/runtime-cards/HeroNumberSpotlight/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
