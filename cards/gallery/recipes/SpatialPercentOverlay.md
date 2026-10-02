# 实景融合百分比

[English](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/en/SpatialPercentOverlay.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`SpatialPercentOverlay`

## 用途

把可编辑的百分比液位、标签和来源放入实景负空间，同时保留主体避让与清晰阅读层级。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/spatial-percent-overlay/SpatialPercentOverlay.tsx`
- 数据结构：`templates/spatial-percent-overlay/schema.json`
- 示例数据：`templates/spatial-percent-overlay/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

## 适用情境

适合产业份额、渗透率、产能占比、覆盖率等“一个场景对应一个主指标”的镜头。

## 数据与素材契约

```text
templates/spatial-percent-overlay/schema.json
templates/spatial-percent-overlay/sample-data.json
public/assets/editorial/semiconductor-cleanroom.png
```

## 实现源码

```text
templates/spatial-percent-overlay/SpatialPercentOverlay.tsx
```

## 对象图像

- `entityIconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。

## 补充制作约束

- 仅用于一个场景对应一个百分比，不用于无关素材或两个以上值的比较；排名应选排名配方。
- `value` 在 0–100 之间，`backgroundSrc` 只提供情境，不包含烘焙的数据文字；数值、标签、液面和来源保持可编辑。
- 先建立情境，把容器放进稳定负空间，不画装饰性主体连线。
- 背景推近克制，结尾至少停留 1.5 秒，所有运动由帧驱动。
- 核对标签、数值、液面与来源一致，不遮挡主体或人脸，检查首末帧对比度，标注演示数据及生成背景。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-SpatialPercentOverlay out/SpatialPercentOverlay.mp4 --props=templates/spatial-percent-overlay/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
