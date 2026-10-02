# 竖屏倒序榜单

[English](en/PortraitRankedReveal.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`PortraitRankedReveal`

## 用途

独立设计的 9:16 榜单故事：先设问，再逐项揭晓，最后保留领先结论。为手机留出右侧操作区与底部字幕区。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/portrait-ranked-reveal/PortraitRankedReveal.tsx`
- 数据结构：`templates/portrait-ranked-reveal/schema.json`
- 示例数据：`templates/portrait-ranked-reveal/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

## 适用情境

针对手机重新布局的 9:16 数据故事，不是把横屏画面裁窄。先提出问题，再从末位揭晓 2–4 个对象，最后保留结论。相同数值并列同一排名。

## 源码与文件

- 组件：`templates/portrait-ranked-reveal/PortraitRankedReveal.tsx`
- 示例数据：`templates/portrait-ranked-reveal/sample-data.json`
- 数据结构：`templates/portrait-ranked-reveal/schema.json`
- 共享时间函数：`src/sceneTiming.ts`
- 渲染标识：`ShotCraft-PortraitRankedReveal`
- 预览：`gallery/media/PortraitRankedReveal.mp4`

## 数据与叙事

`rows` 含稳定 `id`、`label`、`value`、揭晓秒数 `at` 和 `caption`。共同零基线由 `maximum` 指定。数值非负且不超尺度，ID 唯一。揭晓间隔至少 0.8 秒，顺序必须从低值到高值。10 秒模板的 `at` 范围是 1.5–7.2 秒，给开场与结论留时间。


标签最多 12 字，标题 24 字，问题和结论 48 字，来源 56 字。英文同样按字符计数，超长英文请主动缩写，不保证长段落自动适配。替换数据时重新计算差距并改写说明，不能沿用旧结论。

## 画面与动画

1080×1920，30 fps，300 帧，10 秒；H.264，CRF 18。所有动画使用帧时间，无 CSS 动画。默认演示无配音。


主要内容在左 80、右 160、上 135、下 265 像素的安全范围内；右侧和底部预留给移动端按钮、字幕。不同平台覆盖区域不同，实际发布仍需预览检查。没有自动配音或自动词级同步。

## 使用

```bash
npm ci
npx remotion render src/index.ts ShotCraft-PortraitRankedReveal out/portrait.mp4 --props=templates/portrait-ranked-reveal/sample-data.json --codec=h264 --crf=18
```

## 验收

检查开场、每次揭晓与结尾；标题不截断，未揭晓值不泄露，条长与数值一致，最高值最后出现，结论与来源可读。交付数据、源码和完整竖屏 MP4，而不仅是最后一帧。

## 对象图像

对象可设置 `iconSrc`，指向 public 中的国旗、品牌素材或类别插图；保持名称和数值可读，图像随对象身份移动，不按当前排名重新分配。倒序揭晓时图标与名称同步出现。示例公司使用通用类别插图。

## 补充制作约束

- 使用 2–4 项非负数据，从低到高揭晓，同值并列。
- 每行包含唯一 `id`、标签、数值、秒单位揭晓时间和解读。
- 共同尺度 `maximum` 从零开始，数值不得越界。
- 揭晓间隔至少 0.8 秒；10 秒片段中，揭晓时间须位于 1.5–7.2 秒。
- 标签最多 12 字符，标题 24，设问和结论 48，来源 56，英文字符同样计数。
- 改数据后重算差值并改写解读，合成值不得当真实统计。
- 画布 1080×1920、30fps、300 帧、10 秒；H.264 CRF 18。
- 保留左 80、右 160、上 135、下 265px 边距，并在目标平台核验；这些不是所有平台的安全保证。
- 不自动生成旁白或逐词对齐。
- 检查每次揭晓，确保隐藏值不提前泄露，条长与数值一致，第一名最后出现，结论和来源可读。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-PortraitRankedReveal out/PortraitRankedReveal.mp4 --props=templates/portrait-ranked-reveal/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
