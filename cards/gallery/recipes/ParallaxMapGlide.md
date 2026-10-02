# 多层数据地图滑行

[English](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/en/ParallaxMapGlide.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`ParallaxMapGlide`

## 用途

让环境、空间底图和数据节点以克制的速度差滑行，建立地理数据的层次与方向感。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/parallax-map-glide/ParallaxMapGlide.tsx`
- 数据结构：`templates/parallax-map-glide/schema.json`
- 示例数据：`templates/parallax-map-glide/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

- 实现源码：`templates/parallax-map-glide/ParallaxMapGlide.tsx`

背景光场、空间底图和数据节点以不同速度轻微滑动。视差只负责建立层次，数值节点始终保持清晰，不使用手持抖动。

## 数据契约

每个 region 必须包含名称、数值和合法的经纬度坐标；节点由地图投影计算位置，不接受手工画布坐标伪装地理位置。来源和单位不可省略。

## 镜头契约

使用 `parallax_data_glide`。环境、Natural Earth 边界、路线和节点采用递增但克制的位移比例；数据标签不得重叠或离开安全区。

## 文件

`templates/parallax-map-glide/schema.json`
`templates/parallax-map-glide/sample-data.json`

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-ParallaxMapGlide out/ParallaxMapGlide.mp4 --props=templates/parallax-map-glide/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
