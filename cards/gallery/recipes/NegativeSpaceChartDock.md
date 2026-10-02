# 负空间图表停靠

[English](en/NegativeSpaceChartDock.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`NegativeSpaceChartDock`

## 用途

根据主体保护区和安全区域自动寻找图表停靠位置，避免覆盖实景视觉主体。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/negative-space-chart-dock/NegativeSpaceChartDock.tsx`
- 数据结构：`templates/negative-space-chart-dock/schema.json`
- 示例数据：`templates/negative-space-chart-dock/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

- 实现源码：`templates/negative-space-chart-dock/NegativeSpaceChartDock.tsx`

先声明实景或程序化场景中的视觉主体区域，再把图表放入可用负空间。该模板适合人物讲解、产品、建筑、交通工具和工业设施等“主体不能被遮挡”的画面；不适合主体占满全屏且不存在最小 500×400 可用区域的素材。

## 数据与布局契约

`focalBox` 是必须保护的主体矩形，`safeRegion` 是作者或检测器建议的图表区域，均使用 1920×1080 画布像素坐标。布局函数先把区域裁切进 64px 安全区；若建议区域与主体（含 36px 呼吸间距）相撞，则自动在左、右、上、下候选区中选择面积最大的合法区域。没有合法区域时直接报错，不允许带遮挡继续渲染。

`metricValue`、`unit`、`series`、`callout` 与来源均为结构化输入。接入真实视频时可替换背景和 SVG 风机，但必须保留 `focalBox` 约束。

## 运动契约

8 秒、30fps、1920×1080。先建立环境与主体，再将面板停靠进负空间，随后生长数据条并出现结论。所有动画在 6.5 秒前结束，结尾至少静止 1.5 秒。镜头移动不得作用于标题、来源、数据面板或主体保护框坐标。

## 验收

- 图表区域与 `focalBox` 在 36px 间距下不相交。
- 所有内容位于 64px 安全区，中文优先使用 `Noto Sans SC`。
- 最终帧的数值、单位、结论和来源均可读。
- 不使用 CSS animation/transition；画面只由 Remotion 帧驱动。

## 文件

`templates/negative-space-chart-dock/schema.json`  
`templates/negative-space-chart-dock/sample-data.json`  
`templates/negative-space-chart-dock/layout.mjs`

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-NegativeSpaceChartDock out/NegativeSpaceChartDock.mp4 --props=templates/negative-space-chart-dock/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
