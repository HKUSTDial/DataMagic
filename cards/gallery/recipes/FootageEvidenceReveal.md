# 实景转入数据证据

[English](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/en/FootageEvidenceReveal.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`FootageEvidenceReveal`

## 用途

先观看连续实景视频，再引入稳定数据区，依次展示同尺度指标和结论。短素材末帧停留，不循环。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/footage-evidence-reveal/FootageEvidenceReveal.tsx`
- 数据结构：`templates/footage-evidence-reveal/schema.json`
- 示例数据：`templates/footage-evidence-reveal/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

## 适用情境

先展示连续背景，1.5 秒引入左侧深色证据区，再逐项揭示指标，最后保留结论。

## 源码与文件

- 组件：`templates/footage-evidence-reveal/FootageEvidenceReveal.tsx`
- 示例数据：`templates/footage-evidence-reveal/sample-data.json`
- 数据结构：`templates/footage-evidence-reveal/schema.json`
- 时间辅助函数：`src/sceneTiming.ts`
- 渲染标识：`ShotCraft-FootageEvidenceReveal`
- 预览：`gallery/media/FootageEvidenceReveal.mp4`

## 数据契约

`rows` 包含稳定的 `id`、标签 `label`、数值 `value`、揭示时间 `at`（秒）和解读 `caption`。`maximum` 定义所有条形共同的零基线尺度，数值必须在 0 到 maximum 之间。相邻揭示至少间隔 0.8 秒。


标题、问题、结论、指标名称、单位与来源均可替换。改变数值后应同时修改 caption 和 takeaway，不能保留旧结论。

## 动画与素材

8 秒，1920×1080，30 fps，H.264，CRF 18。所有动画按帧计算，可以逐帧定位。此预览无配音。


背景 `public/assets/recycling-facility-agnes.mp4` 复用本项目已有的 8 秒 AI 生成素材。它提供情境，不是数据的证据。左侧为预先指定的信息区域，没有自动主体检测；替换视频后应逐帧确认主体不被遮挡。\n\nThe existing 8-second AI-generated recycling clip supplies context, not evidence of the metrics. Layout uses an authored left-side information area, not automatic subject detection. Set videoDurationSeconds from media metadata. Short footage holds its last frame; it never loops.

## 使用

```bash
npm install
npx remotion render src/index.ts ShotCraft-FootageEvidenceReveal out/FootageEvidenceReveal.mp4 --props=templates/footage-evidence-reveal/sample-data.json --codec=h264 --crf=18
```

## 给代码智能体的指令

使用 FootageEvidenceReveal 的原始组件和 schema，以我的数据替换示例。保留独立图层、共同尺度和来源标注。先检查数据与结论是否一致，再渲染开场、每个揭示节点及结尾；检查重叠、截断、数值映射和短素材行为。输出源码、数据文件与高清 MP4。

## 对象图像

- 实体条目的 `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。

## 补充制作约束

- 先建立视频情境，1.5 秒引入左侧证据区，再逐项揭晓同尺度指标并保留结论。
- 使用 2–3 行，同单位、共同零基线，数值不得越界，揭晓间隔至少 0.8 秒。
- 改数据同时更新解读和结论；不自动推断因果或生成旁白。
- 8 秒、1920×1080、30fps、H.264 CRF 18；`at` 是秒单位人工时间点，旁白对齐需另外准备，并调整片长。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-FootageEvidenceReveal out/FootageEvidenceReveal.mp4 --props=templates/footage-evidence-reveal/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
