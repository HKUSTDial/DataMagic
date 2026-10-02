# 主持人逐项解读 / Presenter Evidence Board

## 用途 / Purpose

主持人图片或视频和数据板并列。1 秒开始展示第一行，随后依次解释第二、第三行，6.6 秒归纳结论。

The presenter image or video stays beside the board. Reveal rows at 1, 3.2, and 5.4 seconds, then conclude at 6.6 seconds.

## 源码与文件 / Source files

- Component: `templates/presenter-evidence-board/PresenterEvidenceBoard.tsx`
- Data: `templates/presenter-evidence-board/sample-data.json`
- Schema: `templates/presenter-evidence-board/schema.json`
- Timing helpers: `src/sceneTiming.ts`
- Composition: `ShotCraft-PresenterEvidenceBoard`
- Preview: `gallery/media/PresenterEvidenceBoard.mp4`

## 数据契约 / Data contract

`rows` 包含稳定的 `id`、标签 `label`、数值 `value`、揭示时间 `at`（秒）和解读 `caption`。`maximum` 定义所有条形共同的零基线尺度，数值必须在 0 到 maximum 之间。相邻揭示至少间隔 0.8 秒。

Each row supplies a stable ID, label, value, reveal time in seconds, and commentary. Use one zero-based scale and unit for all rows; values must lie within that scale. Reveal events must be at least 0.8 seconds apart. Supports 2–3 rows.

标题、问题、结论、指标名称、单位与来源均可替换。改变数值后应同时修改 caption 和 takeaway，不能保留旧结论。

Update captions and takeaway whenever data changes. The template does not infer causal claims or generate narration. Demo numbers are synthetic; replace the source field with verified provenance for factual publication.

## 动画与素材 / Timing and assets

10 秒，1920×1080，30 fps，H.264，CRF 18。所有动画按帧计算，可以逐帧定位。此预览无配音。

10 seconds, 1920×1080, 30 fps, H.264 CRF 18. Frame-driven animation; silent preview. The `at` values are authored timings, not automatic word alignment. To synchronize narration, substitute externally aligned word times and adjust the composition duration accordingly.

默认素材 `public/assets/fictional-presenter.png` 是本项目新生成的虚构人物静态图，并非口型同步主持人视频。可将 presenter.type 改为 video，提供 src 和经 ffprobe 测量的 durationSeconds；图层使用静音，末帧保持而不循环。\n\nThe default presenter is a newly AI-generated fictional still portrait. A video source is supported with a measured duration; audio is muted and a short clip holds its final frame. Provide your own appropriately usable presenter footage.

## 使用 / Render

```bash
npm install
npx remotion render src/index.ts ShotCraft-PresenterEvidenceBoard out/PresenterEvidenceBoard.mp4 --props=templates/presenter-evidence-board/sample-data.json --codec=h264 --crf=18
```

## 给代码智能体的指令 / Agent brief

使用 PresenterEvidenceBoard 的原始组件和 schema，以我的数据替换示例。保留独立图层、共同尺度和来源标注。先检查数据与结论是否一致，再渲染开场、每个揭示节点及结尾；检查重叠、截断、数值映射和短素材行为。输出源码、数据文件与高清 MP4。

Use the original PresenterEvidenceBoard component and schema with my data. Preserve editable layers, the shared scale, and attribution. Verify data and commentary agreement. Inspect the opening, every reveal, and ending for clipping, overlap, numeric mapping, and media duration handling. Deliver source, props, and a full-HD MP4.
# 对象图像 / Entity imagery

对象可设置 `iconSrc`，指向 public 中的国旗、品牌素材或类别插图；保持名称和数值可读，图像随对象身份移动，不按当前排名重新分配。倒序揭晓时图标与名称同步出现。示例公司使用通用类别插图。

Set an entity's `iconSrc` to a local public asset or supplied image URL. Keep names and values readable; imagery follows entity identity, not current rank, and appears with the entity's reveal. Fictional companies use category illustrations.
