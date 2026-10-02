# 共享数据元素转场

[English](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/en/SharedDataElementTransition.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`SharedDataElementTransition`

## 用途

让同一个数据对象从完整比较跨入结论场景，保持数值、标签和颜色身份连续。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/shared-data-element-transition/SharedDataElementTransition.tsx`
- 数据结构：`templates/shared-data-element-transition/schema.json`
- 示例数据：`templates/shared-data-element-transition/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

- 实现源码：`templates/shared-data-element-transition/SharedDataElementTransition.tsx`

让一个数据对象从完整比较图中脱离，跨越镜头并进入结论场景。数值、标签和颜色在两个场景中保持一致，适合从“证据”自然衔接到“结论”。

## 数据契约

`focusIndex` 必须指向 `data` 中的有效项。转场前后的主数值、单位、标签和颜色必须来自同一对象，不得为了动画修改数值。

## 运动契约

先建立完整比较，再让焦点对象脱离图表；目的场景出现后，数据对象落入新的信息结构。标题、来源和说明保持在固定层，末段至少静止一秒。

## 误用提醒

不要在两个场景表达不同指标时使用共享元素；这会制造虚假的连续关系。不要同时移动多个数据对象。

## 文件

`templates/shared-data-element-transition/schema.json`
`templates/shared-data-element-transition/sample-data.json`

## 对象图像

- 实体条目的 `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-SharedDataElementTransition out/SharedDataElementTransition.mp4 --props=templates/shared-data-element-transition/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
