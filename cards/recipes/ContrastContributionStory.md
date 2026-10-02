# 反差设问与贡献拆解

[English](en/ContrastContributionStory.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`ContrastContributionStory`

## 用途

先用醒目数字建立反差，再逐项累积正负贡献；起点、变化与终点来自同一账本，可核对而不是只做视觉隐喻。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/contrast-contribution-story/ContrastContributionStory.tsx`
- 数据结构：`templates/contrast-contribution-story/schema.json`
- 示例数据：`templates/contrast-contribution-story/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

## 适用情境

先展示醒目增长，再提出“为何结果不同”，最后用可加总的正负贡献解释。不是让图形夸张晃动，而是让论证产生转折。

## 实现

- 组件：`templates/contrast-contribution-story/ContrastContributionStory.tsx`
- 数据结构：`templates/contrast-contribution-story/schema.json`
- 示例数据：`templates/contrast-contribution-story/sample-data.json`
- 备用数据：`templates/contrast-contribution-story/alternate-data.json`
- 渲染标识：`ShotCraft-ContrastContributionStory`

## 数据与节拍

开场百分比由 `hook.before` 与 `hook.after` 计算，不手写百分比。示例营收 100→120，原利润 10；新增营收 +20、材料成本 -15、其他成本 -10，计算终点为 5。简化账本的隐含总成本由 90→115，不代表真实财报。


0–2 秒开场；2 秒展开证据；各项在 `at` 秒揭示（默认 3.2、5.2、7.2）；9.2–12 秒保留结果。数值标签使用原始贡献，终点由代码计算。

## 复用与验收

备用家庭账本示例包含“节省支出”的正贡献，避免把所有成本词自动画成负值。替换问题、账本、单位、尺度及结论，不需改变组件。

- 检查开场、每次贡献入场、最终终点，确认负贡献从上一累计值向下，末段不再运动。
- 无参考创作者素材或代码；示例为合成数据，保留来源标注。

## 对象图像

- 实体条目的 `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。

## 补充制作约束

- `baseline + sum(contributions.value)` 计算最终值；所有累计位置必须落在 `[0, maximum]` 内，不支持累计总额低于零。
- 使用 2–3 项同单位、同统计口径的可加贡献。
- 开场数字可能是另一种指标，必须检查其与故事的关系，模板不能证明关系。
- 核对开场、解读和结论与算术一致；不混加百分比和绝对量，不把会计拆解当作因果证明。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-ContrastContributionStory out/ContrastContributionStory.mp4 --props=templates/contrast-contribution-story/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
