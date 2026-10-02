# Negative Space Chart Dock / 负空间图表停靠

- ID: `ShotCraft-NegativeSpaceChartDock`
- Recipe key: `NegativeSpaceChartDock`
- Category: `contextual_data_story`
- Native implementation: `templates/negative-space-chart-dock/NegativeSpaceChartDock.tsx`

先声明实景或程序化场景中的视觉主体区域，再把图表放入可用负空间。该模板适合人物讲解、产品、建筑、交通工具和工业设施等“主体不能被遮挡”的画面；不适合主体占满全屏且不存在最小 500×400 可用区域的素材。

## Data and layout contract

`focalBox` 是必须保护的主体矩形，`safeRegion` 是作者或检测器建议的图表区域，均使用 1920×1080 画布像素坐标。布局函数先把区域裁切进 64px 安全区；若建议区域与主体（含 36px 呼吸间距）相撞，则自动在左、右、上、下候选区中选择面积最大的合法区域。没有合法区域时直接报错，不允许带遮挡继续渲染。

`metricValue`、`unit`、`series`、`callout` 与来源均为结构化输入。接入真实视频时可替换背景和 SVG 风机，但必须保留 `focalBox` 约束。

## Motion contract

8 秒、30fps、1920×1080。先建立环境与主体，再将面板停靠进负空间，随后生长数据条并出现结论。所有动画在 6.5 秒前结束，结尾至少静止 1.5 秒。镜头移动不得作用于标题、来源、数据面板或主体保护框坐标。

## Acceptance

- 图表区域与 `focalBox` 在 36px 间距下不相交。
- 所有内容位于 64px 安全区，中文优先使用 `Noto Sans SC`。
- 最终帧的数值、单位、结论和来源均可读。
- 不使用 CSS animation/transition；画面只由 Remotion 帧驱动。

## Files

`templates/negative-space-chart-dock/schema.json`  
`templates/negative-space-chart-dock/sample-data.json`  
`templates/negative-space-chart-dock/layout.mjs`
