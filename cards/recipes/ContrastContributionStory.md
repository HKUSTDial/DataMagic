# 反差设问与贡献拆解 / Contrast Hook & Contribution Story

## 用途 / Purpose

先展示醒目增长，再提出“为何结果不同”，最后用可加总的正负贡献解释。不是让图形夸张晃动，而是让论证产生转折。
A bold numerical hook leads into a checkable contribution bridge rather than decorative motion.

## 实现 / Implementation

- Component: `templates/contrast-contribution-story/ContrastContributionStory.tsx`
- Schema: `templates/contrast-contribution-story/schema.json`
- Data: `templates/contrast-contribution-story/sample-data.json`
- Alternate data: `templates/contrast-contribution-story/alternate-data.json`
- Composition: `ShotCraft-ContrastContributionStory`
- Output: 1920×1080, 30 fps, 12 seconds, silent preview.

## 数据与节拍 / Data and beats

开场百分比由 `hook.before` 与 `hook.after` 计算，不手写百分比。示例营收 100→120，原利润 10；新增营收 +20、材料成本 -15、其他成本 -10，计算终点为 5。简化账本的隐含总成本由 90→115，不代表真实财报。

`baseline + sum(contributions.value)` is the computed endpoint. All cumulative positions must fit `[0, maximum]`; this version does not support cumulative totals below zero. Use 2–3 additive contributions in the same unit and accounting scope. The hook may describe a different measure, so explicitly check its relationship to the story; the template cannot prove that relationship.

0–2 秒开场；2 秒展开证据；各项在 `at` 秒揭示（默认 3.2、5.2、7.2）；9.2–12 秒保留结果。数值标签使用原始贡献，终点由代码计算。

## 复用与验收 / Reuse and acceptance

备用家庭账本示例包含“节省支出”的正贡献，避免把所有成本词自动画成负值。替换问题、账本、单位、尺度及结论，不需改变组件。

- Check that the hook, authored captions and takeaway agree with the supplied arithmetic.
- Never mix percentages and absolute amounts in one additive bridge.
- Do not call a visual accounting decomposition causal proof.
- 检查开场、每次贡献入场、最终终点，确认负贡献从上一累计值向下，末段不再运动。
- 无参考创作者素材或代码；示例为合成数据，保留来源标注。

## 对象图像 / Entity imagery

- 实体条目的 `iconSrc` / entity item `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.
