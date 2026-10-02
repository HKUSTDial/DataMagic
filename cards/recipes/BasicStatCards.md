# Basic Stat Cards

- ID: `StyleTemplate-BasicStatCards`
- 中文：基础指标卡片
- Category: `stat_cards`
- Compatible: stat_cards, hero_number
- Tags: Basic, KPI, Cards

## Use

Use the original compact stat-card layout for 2-4 key metrics or a single hero metric.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-BasicStatCards`
- Data contract: `KPI cards`
- Entrance: `card reveal`
- Emphasis: `KPI card highlight`
- Highlight targets: card, metric, value
- Trigger phrase: `Revenue`
- Suggested narration: Revenue is the metric to watch at 241K.
- Animation intent: Highlight the named KPI card and value.
- Preview status: runtime narrative highlight

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-BasicStatCards`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/stat_cards/RuntimeBasicStatCards.tsx` (`BasicStatCardsDemo`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/BasicStatCards/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/BasicStatCards/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-BasicStatCards out/BasicStatCards.mp4 --props=templates/runtime-cards/BasicStatCards/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
