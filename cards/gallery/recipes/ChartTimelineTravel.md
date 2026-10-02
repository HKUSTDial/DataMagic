# 图表时间线巡航

[English](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/en/ChartTimelineTravel.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`ChartTimelineTravel`

## 用途

镜头沿多个数据时期逐段巡航，在每个里程碑留出阅读停顿，并在结论节点减速停稳。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/chart-timeline-travel/ChartTimelineTravel.tsx`
- 数据结构：`templates/chart-timeline-travel/schema.json`
- 示例数据：`templates/chart-timeline-travel/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

## 适用情境

用横向镜头依次讲解 4–5 个时期或里程碑。适合增长阶段、政策演进、产品发展、项目交付和连续实验结果。镜头在每个节点短暂停留，在最后一个时期减速并稳定呈现结论。

## 配方标识

`ChartTimelineTravel`

## 画面规格

- 画布 / Canvas: `1920 × 1080`
- 推荐帧率 / Recommended FPS: `30`
- 推荐时长 / Recommended duration: `300 frames` (10 seconds)
- 字体 / Font stack: `Noto Sans SC`, `PingFang SC`, `Microsoft YaHei`, `Inter`, `sans-serif`

## 数据接口

所有图形位置、折线路径、数字、颜色和说明都由 `periods` 驱动，没有把数据烘焙进图片。

### 中文

1. 标题固定，数据舞台在独立图层中横向移动。
2. 每个时期先保留阅读停顿，再平滑移向下一时期。
3. 前三段使用平滑启停；最后一段使用 cubic ease-out，形成清晰的制动感。
4. 最终时期停稳后再显示结论，避免结论与镜头运动争夺注意力。

## 使用建议

- 保持数值单位一致；若单位变化，请先标准化。
- 里程碑说明建议中文不超过 34 字、英文不超过 110 个字符。
- 运镜服务于叙事顺序，不建议随机改变时期顺序。
- 需要更长停顿时，调整 `motion.mjs` 中的 `holdFrames`，不要使用 CSS animation。

## 补充制作约束

- `locale` 为 `zh` 或 `en`；标题、副标题、眉题、最终结论和来源使用 `{zh, en}`。
- `periods` 为 4–5 个有序记录，每项包含 `id`、双语 `label`、数值 `value`、`unit`、双语 `note`、`accent`。
- 节点、路径、颜色和说明均由数据驱动，不烘焙进图片。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-ChartTimelineTravel out/ChartTimelineTravel.mp4 --props=templates/chart-timeline-travel/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
