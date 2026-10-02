# 区域分级着色地图

[English](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/en/ChoroplethRankMap.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`ChoroplethRankMap`

## 用途

将地区指标映射到真实地理边界，并同步显示排名、数值、来源和可编辑的颜色尺度。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/choropleth-rank-map/ChoroplethRankMap.tsx`
- 数据结构：`templates/choropleth-rank-map/schema.json`
- 示例数据：`templates/choropleth-rank-map/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

## 适用情境

适合市场规模、覆盖率、风险和区域差异。

## 实现源码

`templates/choropleth-rank-map/ChoroplethRankMap.tsx`

## 对象图像

对象可设置 `iconSrc`，指向 public 中的国旗、品牌素材或类别插图；保持名称和数值可读，图像随对象身份移动，不按当前排名重新分配。倒序揭晓时图标与名称同步出现。示例公司使用通用类别插图。

## 补充制作约束

- 区域使用底图中存在的 ISO/ADM0 三字母代码。
- 填色强度、排名、标签和数值都来自同一 `regions`。
- 边界使用公有领域的 Natural Earth 1:110m，不声称超过底图分辨率的精度。
- 未知代码必须报错，不静默丢失；小区域仍可在排名列表核验。
- 保留数据来源与边界署名。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-ChoroplethRankMap out/ChoroplethRankMap.mp4 --props=templates/choropleth-rank-map/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
