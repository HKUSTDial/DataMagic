# 双场景数据对比

[English](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/en/SplitContextComparison.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`SplitContextComparison`

## 用途

把同一指标放回两个程序化情境中比较，让数值差异与真实使用语境同时可读。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/split-context-comparison/SplitContextComparison.tsx`
- 数据结构：`templates/split-context-comparison/schema.json`
- 示例数据：`templates/split-context-comparison/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

- 实现源码：`templates/split-context-comparison/SplitContextComparison.tsx`

将同一指标放进两个程序化原创场景：观众先辨认“比较的对象”，再读取双方数值，最后由中间差值和一句结论完成收束。适合使用成本、改造前后、地区差异或两种策略的对比；不适合口径不同却被强行并列的数据。

## 数据契约

`left` 与 `right` 独立提供名称、数值、单位、解释、强调色和场景类型，所有文字与数字均可编辑。两个 `unit` 应保持同一量纲；`differenceValue` 与 `takeaway` 必须由输入数据校验后填写。演示中的汽车、道路、充电桩和加油机均为 SVG 程序化绘制，不依赖外部素材。

## 运动契约

8 秒、30fps、1920×1080。标题出现后，两个场景从画面两侧克制地进入；主体、指标、差值和结论依次揭示。所有运动在 6.6 秒前结束，结尾保留 1.4 秒静止阅读。固定标题、来源和结论不得跟随场景运动。

## 画面保护约束

内容保持在 64px 安全区内；差值徽章只能位于两个场景之间，不遮挡主体数值；长标题应在接入时限制为两行以内。中文字体优先使用 `Noto Sans SC`。

## 文件

`templates/split-context-comparison/schema.json`  
`templates/split-context-comparison/sample-data.json`  
`templates/split-context-comparison/motion.mjs`

## 对象图像

- `left.iconSrc` / `right.iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-SplitContextComparison out/SplitContextComparison.mp4 --props=templates/split-context-comparison/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
