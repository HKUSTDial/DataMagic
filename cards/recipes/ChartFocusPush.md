# 图表焦点推镜

[English](en/ChartFocusPush.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`ChartFocusPush`

## 用途

先建立完整趋势，再用缓慢推镜靠近异常节点；镜头只调度注意力，不改变图表数据几何。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/chart-focus-push/ChartFocusPush.tsx`
- 数据结构：`templates/chart-focus-push/schema.json`
- 示例数据：`templates/chart-focus-push/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

- 实现源码：`templates/chart-focus-push/ChartFocusPush.tsx`
- 镜头函数：`src/camera/chartCamera.ts`

## 适用情境

适合先交代完整趋势，再强调一个异常点、拐点或
关键指标；不适合同时追逐多个互不相关的焦点。

## 补充制作约束

- `labels`、`values` 等长，`anomalyIndex` 指向已有值且不改变图表几何；`insight` 解释重要性，保留来源并标注演示数据。
- 先展示全图，讲解用 `slow_focus_push`，少量强强调节拍才用 `crash_focus`。
- 标题、来源、结论不进入图表变换层，所有变换由 Remotion 帧驱动，不用 CSS transition，末段留阅读停顿。
- 将 `useCurrentFrame()`、`fps`、`durationInFrames`、图表尺寸和焦点坐标传入 `calculateChartCamera()`，只把返回的 `scale`、`x`、`y`、`origin` 应用到图表层。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-ChartFocusPush out/ChartFocusPush.mp4 --props=templates/chart-focus-push/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
