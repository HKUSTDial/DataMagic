# 动态柱状图竞赛

[English](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/en/BarChartRace.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`BarChartRace`

## 用途

面向多实体时序排名的连续竞赛图，支持数值插值、动态换位、进入退出和稳定实体配色。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/bar-chart-race/BarChartRace.tsx`
- 数据结构：`templates/bar-chart-race/schema.json`
- 示例数据：`templates/bar-chart-race/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

## 数据契约

```text
templates/bar-chart-race/schema.json
templates/bar-chart-race/sample-data.json
```

### 对象 Logo 与图标

每个对象可以设置 `iconSrc`，例如 `icons/coffee/latte.svg`；图标与名称一起跟随对象移动。品牌排名可换为自己的 Logo，国家榜单可换为旗帜，人物榜单可换为头像。推荐将素材保存到 `public/` 后使用本地路径。


可选的 `highlightId` 会加强指定对象，并适当淡化其他柱子，保留各自配色。完整咖啡示例见 `examples/agent-workflow-demo/`。

## 实现源码

```text
templates/bar-chart-race/BarChartRace.tsx
templates/bar-chart-race/model.js
```

## 补充制作约束

- 适合 5–15 个对象在有序时间点上的领先、超越、进入、退出和名次变化；若逐期精确比较更重要，选择小多图或折线图。
- 使用稳定对象定义与有序快照，相邻快照的数值与名次连续插值，不排序后跳位。
- 对象颜色与身份保持稳定，Top-N 边界渐隐不改身份。
- 所有动画由 Remotion 帧驱动，结尾留足阅读时间。
- 核对首末数值，测试并列、缺失值、新进入对象和极端值，检查每次交叉时标签与数值，明确演示数据并显示来源。
- `iconSrc` 指向 `public/` 本地图像，始终跟随稳定 `id`；无图像时保留颜色标记。
- `highlightId` 突出指定对象，但保留其他对象不同配色。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-BarChartRace out/BarChartRace.mp4 --props=templates/bar-chart-race/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
