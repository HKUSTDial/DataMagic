# Dark Compact Donut Share

- ID: `StyleTemplate-DarkCompactDonutShare`
- 中文：深色紧凑环形图占比
- Category: `pie_chart`
- Compatible: pie_chart
- Tags: Donut, Dark, Share

## Use

Dark compact donut/share panel for 2-6 part-to-whole slices with center summary and legend.

## Runtime animation contract

- Runtime preview: `RuntimeTemplatePreview-DarkCompactDonutShare`
- Data contract: `positive share items`
- Entrance: `donut reveal`
- Emphasis: `slice focus highlight`
- Highlight targets: slice, label
- Trigger phrase: `Enterprise`
- Suggested narration: Enterprise is the segment that leads the mix.
- Animation intent: Bring the named donut segment forward.
- Preview status: runtime narrative highlight

## Data and review constraints

Keep all values, labels, axes, and chart geometry programmatic and editable. Render representative frames and check overlap, clipping, readability, motion continuity, emphasis timing, and final hold time.

## Reference implementation

DataMagic Remotion composition: `StyleTemplate-DarkCompactDonutShare`

## Editable implementation / 可编辑实现

- Source / 源码: `src/legacy/components/runtime_style_templates/pie_chart/RuntimeDarkCompactDonutShare.tsx` (`DarkCompactDonutShareDemo`)
- Shared render entry / 渲染入口: `src/runtime/RuntimeCard.tsx`
- Sample props / 示例数据: `templates/runtime-cards/DarkCompactDonutShare/sample-data.json`
- Schema / 参数结构: `templates/runtime-cards/DarkCompactDonutShare/schema.json`
- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)

Run from `cards/` / 在 `cards/` 目录运行：

```bash
npx remotion render src/index.ts RuntimeTemplatePreview-DarkCompactDonutShare out/DarkCompactDonutShare.mp4 --props=templates/runtime-cards/DarkCompactDonutShare/sample-data.json
```

Replace `sceneContent.data` and the matching fields in `sceneContent.template_payload` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in `scene.animations` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 `scene.animations` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。
