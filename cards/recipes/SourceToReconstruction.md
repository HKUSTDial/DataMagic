# 原稿到可编辑复刻

[English](en/SourceToReconstruction.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`SourceToReconstruction`

## 用途

从程序化原稿和表格中扫描字段，再重构为可编辑图表，保留数据来源与映射关系。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/source-to-reconstruction/SourceToReconstruction.tsx`
- 数据结构：`templates/source-to-reconstruction/schema.json`
- 示例数据：`templates/source-to-reconstruction/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

- 实现源码：`templates/source-to-reconstruction/SourceToReconstruction.tsx`

## 适用情境

先让观众看到财报、报告表格或资料摘录的程序化替身，再通过字段扫描和匹配连线，将同一份数据重构成可编辑图表。适合交代数据来源、解释图表加工过程和增强事实可信度；不适合把无法核验的网页截图装饰成“来源”。

## 数据契约

- `rows` 是原稿表格和结果图表的唯一数据源，禁止为左右两侧分别录入数值。
- 每行必须保留 `label`、数值 `value` 和简短原文摘录 `sourceText`。
- `highlightIndex` 必须指向现有行；结论中的精确数值必须能由 `rows` 推导。
- 演示或合成数据必须在 `source` 中明确标注，不得伪造真实财报截图。

## 视觉契约

- 原稿使用程序化纸张、表格和排印结构，不依赖不可编辑的位图。
- 保留“原稿快照”和“重构结果”两个稳定区域，通过逐行连线呈现字段对应关系。
- 最终图表必须保留标签、数值、单位、来源和结论，并确保 64px 安全区。
- 中文字体使用 `Noto Sans SC` 回退；画布为 1920×1080。

## 动画契约

- 0–2.3 秒：展示并扫描原始表格。
- 2.0–4.7 秒：逐行匹配字段，重构独立柱状图。
- 5.0–5.8 秒：呈现可核验结论。
- 7.0–8.0 秒：所有元素完全静止，用于阅读和转场。
- 所有运动由 Remotion 帧驱动，不使用 CSS animation。

## 文件

- `templates/source-to-reconstruction/schema.json`
- `templates/source-to-reconstruction/sample-data.json`
- `templates/source-to-reconstruction/SourceToReconstruction.tsx`

## 对象图像

- 实体条目的 `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-SourceToReconstruction out/SourceToReconstruction.mp4 --props=templates/source-to-reconstruction/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
