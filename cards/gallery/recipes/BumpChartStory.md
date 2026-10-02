# 动态排名轨迹

[English](en/BumpChartStory.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`BumpChartStory`

## 用途

用连续排名轨迹揭示超越、反转与格局变化，保留每个时期的原始数值与稳定实体颜色。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/bump-chart-story/BumpChartStory.tsx`
- 数据结构：`templates/bump-chart-story/schema.json`
- 示例数据：`templates/bump-chart-story/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

## 适用情境

适合市场份额、国家排名、品牌竞争和年度榜单变化。

## 实现源码

`templates/bump-chart-story/BumpChartStory.tsx`

## 对象图像

对象可设置 `iconSrc`，指向 public 中的国旗、品牌素材或类别插图；保持名称和数值可读，图像随对象身份移动，不按当前排名重新分配。倒序揭晓时图标与名称同步出现。示例公司使用通用类别插图。

## 补充制作约束

- 每个系列每个时期都必须提供数值。
- 名次和标签由同一组值推导，不单独录入排名。
- 保持 3–6 个系列可见，连续揭示轨迹后保留最终排名；颜色跨期稳定，避免突跳或独立运动的标签。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-BumpChartStory out/BumpChartStory.mp4 --props=templates/bump-chart-story/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
