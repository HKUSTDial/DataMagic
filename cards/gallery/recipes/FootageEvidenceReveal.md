# 实景转入数据证据 / Footage to Evidence

## 用途 / Purpose

先展示连续背景，1.5 秒引入左侧深色证据区，再逐项揭示指标，最后保留结论。

Establish the footage, introduce a left evidence area at 1.5 seconds, reveal shared-scale metrics, then hold the takeaway.

## 源码与文件 / Source files

- Component: `templates/footage-evidence-reveal/FootageEvidenceReveal.tsx`
- Data: `templates/footage-evidence-reveal/sample-data.json`
- Schema: `templates/footage-evidence-reveal/schema.json`
- Timing helpers: `src/sceneTiming.ts`
- Composition: `ShotCraft-FootageEvidenceReveal`
- Preview: `gallery/media/FootageEvidenceReveal.mp4`

## 数据契约 / Data contract

`rows` 包含稳定的 `id`、标签 `label`、数值 `value`、揭示时间 `at`（秒）和解读 `caption`。`maximum` 定义所有条形共同的零基线尺度，数值必须在 0 到 maximum 之间。相邻揭示至少间隔 0.8 秒。

Each row supplies a stable ID, label, value, reveal time in seconds, and commentary. Use one zero-based scale and unit for all rows; values must lie within that scale. Reveal events must be at least 0.8 seconds apart. Supports 2–3 rows.

标题、问题、结论、指标名称、单位与来源均可替换。改变数值后应同时修改 caption 和 takeaway，不能保留旧结论。

Update captions and takeaway whenever data changes. The template does not infer causal claims or generate narration. Demo numbers are synthetic; replace the source field with verified provenance for factual publication.

## 动画与素材 / Timing and assets

8 秒，1920×1080，30 fps，H.264，CRF 18。所有动画按帧计算，可以逐帧定位。此预览无配音。

8 seconds, 1920×1080, 30 fps, H.264 CRF 18. Frame-driven animation; silent preview. The `at` values are authored timings, not automatic word alignment. To synchronize narration, substitute externally aligned word times and adjust the composition duration accordingly.

背景 `public/assets/recycling-facility-agnes.mp4` 复用本项目已有的 8 秒 AI 生成素材。它提供情境，不是数据的证据。左侧为预先指定的信息区域，没有自动主体检测；替换视频后应逐帧确认主体不被遮挡。\n\nThe existing 8-second AI-generated recycling clip supplies context, not evidence of the metrics. Layout uses an authored left-side information area, not automatic subject detection. Set videoDurationSeconds from media metadata. Short footage holds its last frame; it never loops.

## 使用 / Render

```bash
npm install
npx remotion render src/index.ts ShotCraft-FootageEvidenceReveal out/FootageEvidenceReveal.mp4 --props=templates/footage-evidence-reveal/sample-data.json --codec=h264 --crf=18
```

## 给代码智能体的指令 / Agent brief

使用 FootageEvidenceReveal 的原始组件和 schema，以我的数据替换示例。保留独立图层、共同尺度和来源标注。先检查数据与结论是否一致，再渲染开场、每个揭示节点及结尾；检查重叠、截断、数值映射和短素材行为。输出源码、数据文件与高清 MP4。

Use the original FootageEvidenceReveal component and schema with my data. Preserve editable layers, the shared scale, and attribution. Verify data and commentary agreement. Inspect the opening, every reveal, and ending for clipping, overlap, numeric mapping, and media duration handling. Deliver source, props, and a full-HD MP4.

## 对象图像 / Entity imagery

- 实体条目的 `iconSrc` / entity item `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.
