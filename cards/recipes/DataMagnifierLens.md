# 数据放大镜

[English](en/DataMagnifierLens.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`DataMagnifierLens`

## 用途

沿趋势扫描并在关键异常停留放大，把“看见走势”和“解释异常”组织成同一个动态图表镜头。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/data-magnifier-lens/DataMagnifierLens.tsx`
- 数据结构：`templates/data-magnifier-lens/schema.json`
- 示例数据：`templates/data-magnifier-lens/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

## 适用情境

适合异常点、
峰值、拐点与政策发生时刻，不适合同时解释多个不相关异常。

## 实现源码

`templates/data-magnifier-lens/DataMagnifierLens.tsx`

## 补充制作约束

- `labels` 与 `values` 等长，放大镜只强调已有数值，不改变图表几何。
- `insight` 解释焦点并保留来源。
- 先建立完整趋势再停在焦点；最终标注至少停留 1.5 秒，镜片位置由图表坐标计算，不手工猜像素。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-DataMagnifierLens out/DataMagnifierLens.mp4 --props=templates/data-magnifier-lens/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
