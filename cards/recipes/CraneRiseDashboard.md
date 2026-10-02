# 吊臂拉升揭示

[English](en/CraneRiseDashboard.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`CraneRiseDashboard`

## 用途

从一个关键数据柱的近景拉升到完整比较结构，让局部发现自然过渡为全局解释。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/crane-rise-dashboard/CraneRiseDashboard.tsx`
- 数据结构：`templates/crane-rise-dashboard/schema.json`
- 示例数据：`templates/crane-rise-dashboard/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

- 实现源码：`templates/crane-rise-dashboard/CraneRiseDashboard.tsx`

先以关键数据柱近景建立问题，再拉升至完整柱状比较和洞察面板。适用于“一个局部信号如何放回整体结构”的解释，不适合没有明确焦点的普通排名。

## 数据契约

`categories` 与 `values` 必须等长；`focusLabel` 必须存在于 categories，`focusValue` 应与对应值一致。所有内容保持结构化、可编辑。

## 镜头契约

使用 `crane_rise_reveal`。开头不得裁断焦点数字；拉远后必须完整显示坐标、类别、来源和结论，并至少停留 1.5 秒。

## 文件

`templates/crane-rise-dashboard/schema.json`
`templates/crane-rise-dashboard/sample-data.json`

## 对象图像

- `categoryIcons[categoryLabel]` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-CraneRiseDashboard out/CraneRiseDashboard.mp4 --props=templates/crane-rise-dashboard/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
