# 来源到洞察

[English](en/SourceToInsight.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`SourceToInsight`

## 用途

把原始表格、结构转换和可视化结论放在一个可追溯的解释镜头中，适合方法说明与数据来源交代。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/source-to-insight/SourceToInsight.tsx`
- 数据结构：`templates/source-to-insight/schema.json`
- 示例数据：`templates/source-to-insight/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

## 适用情境

适合方法讲解、数据来源交代、论文复现和事实核查镜头。

## 实现源码

`templates/source-to-insight/SourceToInsight.tsx`

## 对象图像

- 实体条目的 `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。

## 补充制作约束

- 表格与柱子使用同一 `rows` 数组；结论中的总量必须能从数据推导，明确标注合成或演示数据。
- 先呈现来源行，再转换，最后展示结果；各阶段位置稳定，相关来源尚未出现时不得提前展示结果。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-SourceToInsight out/SourceToInsight.mp4 --props=templates/source-to-insight/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
