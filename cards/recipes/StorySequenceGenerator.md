# 四镜头故事生成器

[English](en/StorySequenceGenerator.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`StorySequenceGenerator`

## 用途

把主题、分类数据与结论直接编译为问题、情境、证据和结论四个连续镜头，并输出可渲染项目数据。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/story-sequence-generator/StorySequenceGenerator.tsx`
- 数据结构：`templates/story-sequence-generator/schema.json`
- 示例数据：`templates/story-sequence-generator/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

把同一份分类数据组织成一条完整的四镜头数据故事，而不是四张互不相关的图表。

## 数据契约

- `blueprintId`：六套故事结构之一。
- `title`、`question`、`takeaway`：主题、开场问题和最终可验证结论。
- `items`：3–8 个稳定身份的数据对象，包含唯一 `id`、标签、数值与可选颜色。
- `source`、`unit`、`accent`：来源、单位和全片连续强调色。

## 镜头结构

1. 问题：主问题与领先信号建立悬念，使用克制的慢推。
2. 情境：总量与全部对象铺开，使用宽幅概览横移。
3. 证据：排序比较并推向关键对象，使用轻量冲击聚焦。
4. 结论：共享对象身份延续到最终主张，最后至少静止 1.2 秒。

## 使用

```bash
npx remotion render src/index.ts ShotCraft-StorySequenceGenerator story.mp4 --props=story-data.json
```

输出为 1920×1080、30fps、12 秒。标题、章节、来源与结论均位于相机变换层之外；所有数据图形保持程序化和可编辑。

## 对象图像

- 实体条目的 `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-StorySequenceGenerator out/StorySequenceGenerator.mp4 --props=templates/story-sequence-generator/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
