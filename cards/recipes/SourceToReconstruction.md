# Source to Reconstruction / 原始资料到可编辑复刻

- ID: `ShotCraft-SourceToReconstruction`
- Recipe key: `SourceToReconstruction`
- Category: `editorial_explainer`
- Native implementation: `templates/source-to-reconstruction/SourceToReconstruction.tsx`

## Use / 适用场景

先让观众看到财报、报告表格或资料摘录的程序化替身，再通过字段扫描和匹配连线，将同一份数据重构成可编辑图表。适合交代数据来源、解释图表加工过程和增强事实可信度；不适合把无法核验的网页截图装饰成“来源”。

## Data contract / 数据契约

- `rows` 是原稿表格和结果图表的唯一数据源，禁止为左右两侧分别录入数值。
- 每行必须保留 `label`、数值 `value` 和简短原文摘录 `sourceText`。
- `highlightIndex` 必须指向现有行；结论中的精确数值必须能由 `rows` 推导。
- 演示或合成数据必须在 `source` 中明确标注，不得伪造真实财报截图。

## Visual contract / 视觉契约

- 原稿使用程序化纸张、表格和排印结构，不依赖不可编辑的位图。
- 保留“原稿快照”和“重构结果”两个稳定区域，通过逐行连线呈现字段对应关系。
- 最终图表必须保留标签、数值、单位、来源和结论，并确保 64px 安全区。
- 中文字体使用 `Noto Sans SC` 回退；画布为 1920×1080。

## Animation contract / 动画契约

- 0–2.3 秒：展示并扫描原始表格。
- 2.0–4.7 秒：逐行匹配字段，重构独立柱状图。
- 5.0–5.8 秒：呈现可核验结论。
- 7.0–8.0 秒：所有元素完全静止，用于阅读和转场。
- 所有运动由 Remotion 帧驱动，不使用 CSS animation。

## Files

- `templates/source-to-reconstruction/schema.json`
- `templates/source-to-reconstruction/sample-data.json`
- `templates/source-to-reconstruction/SourceToReconstruction.tsx`

## 对象图像 / Entity imagery

- 实体条目的 `iconSrc` / entity item `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.
