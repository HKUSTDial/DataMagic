# ChartTimelineTravel / 图表时间线巡航

## 用途 / Purpose

用横向镜头依次讲解 4–5 个时期或里程碑。适合增长阶段、政策演进、产品发展、项目交付和连续实验结果。镜头在每个节点短暂停留，在最后一个时期减速并稳定呈现结论。

Travel through four or five periods with a horizontal chart-focused camera. It works for growth stages, policy evolution, product history, project delivery, and sequential experiment results. The camera pauses briefly at each milestone and brakes into the final conclusion.

## 配方标识 / Recipe key

`ChartTimelineTravel`

## 画面规格 / Composition

- 画布 / Canvas: `1920 × 1080`
- 推荐帧率 / Recommended FPS: `30`
- 推荐时长 / Recommended duration: `300 frames` (10 seconds)
- 字体 / Font stack: `Noto Sans SC`, `PingFang SC`, `Microsoft YaHei`, `Inter`, `sans-serif`

## 数据接口 / Editable data contract

- `locale`: `zh` or `en`
- `title`, `subtitle`, `eyebrow`, `finalTakeaway`, `source`: `{zh, en}`
- `periods`: 4–5 ordered records
- Each period contains `id`, bilingual `label`, numeric `value`, `unit`, bilingual `note`, and `accent`

所有图形位置、折线路径、数字、颜色和说明都由 `periods` 驱动，没有把数据烘焙进图片。

Every point, path segment, value, color, and note is driven by `periods`; no data is baked into an image.

## 运镜逻辑 / Camera behavior

### 中文

1. 标题固定，数据舞台在独立图层中横向移动。
2. 每个时期先保留阅读停顿，再平滑移向下一时期。
3. 前三段使用平滑启停；最后一段使用 cubic ease-out，形成清晰的制动感。
4. 最终时期停稳后再显示结论，避免结论与镜头运动争夺注意力。

### English

1. The title stays fixed while an independent data stage travels horizontally.
2. Every period receives a reading hold before the next move.
3. Earlier moves use smooth acceleration and deceleration; the final move uses cubic ease-out braking.
4. The takeaway appears only after the final period settles.

## 使用建议 / Authoring guidance

- 保持数值单位一致；若单位变化，请先标准化。
- 里程碑说明建议中文不超过 34 字、英文不超过 110 个字符。
- 运镜服务于叙事顺序，不建议随机改变时期顺序。
- 需要更长停顿时，调整 `motion.mjs` 中的 `holdFrames`，不要使用 CSS animation。

- Keep one consistent unit or normalize values before rendering.
- Keep notes under roughly 34 Chinese characters or 110 English characters.
- Camera motion should follow narrative order; avoid random milestone ordering.
- For longer pauses, adjust `holdFrames` in `motion.mjs`; do not add CSS animations.
