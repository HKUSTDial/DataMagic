# 地图路径累积

[English](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/en/MapRouteAccumulation.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`MapRouteAccumulation`

## 用途

按叙事顺序绘制跨地区大圆路径，同时累积每条流向的结构化数值，适合贸易、迁移和供应链故事。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/map-route-accumulation/MapRouteAccumulation.tsx`
- 数据结构：`templates/map-route-accumulation/schema.json`
- 示例数据：`templates/map-route-accumulation/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

## 适用情境

适合跨地区流向、供应链、迁移和传播路径。

## 实现源码

`templates/map-route-accumulation/MapRouteAccumulation.tsx`

## 补充制作约束

- 坐标为合法范围内的 `[longitude, latitude]`，路径使用大圆插值，不是屏幕直线。
- 累计值为各路线值乘揭示进度之和；底图使用公有领域 Natural Earth 1:110m。
- 核对起终点、路线头、连线、目的地标记、列表值和累计值一致，同一镜头不超过 8 条同步路线。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-MapRouteAccumulation out/MapRouteAccumulation.mp4 --props=templates/map-route-accumulation/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
