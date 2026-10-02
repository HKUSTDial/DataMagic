# 倒序揭晓排行榜 / Countdown Ranking Reveal

## 用途 / Purpose

排名位置固定，按 at 从末位逐项揭晓；已揭晓的行保留。最终强调第一名及差距。

Keep rank positions stable and reveal rows in authored at order, from bottom to top. Retain revealed rows and end on the winner and margin.

## 源码与文件 / Source files

- Component: `templates/ranked-reveal/RankedReveal.tsx`
- Data: `templates/ranked-reveal/sample-data.json`
- Schema: `templates/ranked-reveal/schema.json`
- Timing helpers: `src/sceneTiming.ts`
- Composition: `ShotCraft-RankedReveal`
- Preview: `gallery/media/RankedReveal.mp4`

## 数据契约 / Data contract

`rows` 包含稳定的 `id`、标签 `label`、数值 `value`、揭示时间 `at`（秒）和解读 `caption`。`maximum` 定义所有条形共同的零基线尺度，数值必须在 0 到 maximum 之间。相邻揭示至少间隔 0.8 秒。

Each row supplies a stable ID, label, value, reveal time in seconds, and commentary. Use one zero-based scale and unit for all rows; values must lie within that scale. Reveal events must be at least 0.8 seconds apart. Supports 2–5 rows. Rank is computed from values; ties share a rank. Authored reveal order is independent of rank.

标题、问题、结论、指标名称、单位与来源均可替换。改变数值后应同时修改 caption 和 takeaway，不能保留旧结论。

Update captions and takeaway whenever data changes. The template does not infer causal claims or generate narration. Demo numbers are synthetic; replace the source field with verified provenance for factual publication.

## 动画与素材 / Timing and assets

10 秒，1920×1080，30 fps，H.264，CRF 18。所有动画按帧计算，可以逐帧定位。此预览无配音。

10 seconds, 1920×1080, 30 fps, H.264 CRF 18. Frame-driven animation; silent preview. The `at` values are authored timings, not automatic word alignment. To synchronize narration, substitute externally aligned word times and adjust the composition duration accordingly.

条形按数值同比例绘制，未揭晓数据不提前显示。预览采用倒序时序，既可用于前三名揭晓，也可用于 2–5 项榜单。\n\nBars use proportional values. Unrevealed entries remain hidden; settled entries persist. The same component supports a top-three countdown or a 2–5-item list.

## 使用 / Render

```bash
npm install
npx remotion render src/index.ts ShotCraft-RankedReveal out/RankedReveal.mp4 --props=templates/ranked-reveal/sample-data.json --codec=h264 --crf=18
```

## 给代码智能体的指令 / Agent brief

使用 RankedReveal 的原始组件和 schema，以我的数据替换示例。保留独立图层、共同尺度和来源标注。先检查数据与结论是否一致，再渲染开场、每个揭示节点及结尾；检查重叠、截断、数值映射和短素材行为。输出源码、数据文件与高清 MP4。

Use the original RankedReveal component and schema with my data. Preserve editable layers, the shared scale, and attribution. Verify data and commentary agreement. Inspect the opening, every reveal, and ending for clipping, overlap, numeric mapping, and media duration handling. Deliver source, props, and a full-HD MP4.
# 对象图像 / Entity imagery

对象可设置 `iconSrc`，指向 public 中的国旗、品牌素材或类别插图；保持名称和数值可读，图像随对象身份移动，不按当前排名重新分配。倒序揭晓时图标与名称同步出现。示例公司使用通用类别插图。

Set an entity's `iconSrc` to a local public asset or supplied image URL. Keep names and values readable; imagery follows entity identity, not current rank, and appears with the entity's reveal. Fictional companies use category illustrations.
