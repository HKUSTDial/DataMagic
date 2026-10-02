# 基础折线图

[English](en/BasicLineChart.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`BasicLineChart`

## 用途

适合折线图场景，以“基础折线图”组织数据并保持可编辑的数据映射。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`src/legacy/components/runtime_style_templates/line_chart/RuntimeBasicLineChart.tsx`
- 数据结构：`templates/runtime-cards/BasicLineChart/schema.json`
- 示例数据：`templates/runtime-cards/BasicLineChart/sample-data.json`
- 渲染入口：`src/runtime/RuntimeCard.tsx`
- 导出组件：`BasicLineChartDemo`

## 数据与制作约束

替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 的对应字段；文字场景同步修改标题、正文、要点与其参数。改标签后同步调整 `scene.animations` 的高亮对象。按组件和共享函数支持的数据结构修改，不把数值或文字烘焙成图片。

- 数据契约标识：`time series`
- 入场策略标识：`line draw`
- 高亮策略标识：`point focus highlight`
- 示例触发词：`Aug`
- 高亮对象：`point, label, value`

标签、高亮触发词和解读必须随数据更新，不能保留与新数据不符的示例旁白。默认渲染规格为 1280×720、30fps、180 帧（6 秒）；网站预览可能来自另一次更高分辨率输出。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts RuntimeTemplatePreview-BasicLineChart out/BasicLineChart.mp4 --props=templates/runtime-cards/BasicLineChart/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
