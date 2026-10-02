# 主持人让位与数据接管

[English](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/en/PresenterDataTakeover.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`PresenterDataTakeover`

## 用途

主持人先设问，再缩为圆形小窗，让正负趋势图接管主画面；源视频时钟连续，最后聚焦关键季度。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/presenter-data-takeover/PresenterDataTakeover.tsx`
- 数据结构：`templates/presenter-data-takeover/schema.json`
- 示例数据：`templates/presenter-data-takeover/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

## 适用情境

主持人先建立问题，再缩为圆形小窗，把主画面交给图表；讲到重点时其余数据退为中性。适合经济、业务与科学趋势讲解。

## 实现

- 组件：`templates/presenter-data-takeover/PresenterDataTakeover.tsx`
- 数据结构：`templates/presenter-data-takeover/schema.json`
- 示例数据：`templates/presenter-data-takeover/sample-data.json`
- 备用数据：`templates/presenter-data-takeover/alternate-data.json`
- 渲染标识：`ShotCraft-PresenterDataTakeover`
- 主持素材：`public/assets/character-perspective-board/cat-host.mp4`

## 节奏与数据

0–1.8 秒主持与设问；1.8–3 秒缩窗交接；3.2 秒起逐项入场；7.2 秒聚焦 `focusIndex`；9–12 秒保留结论。
4–7 个有序时间点，值必须落在共同 `domain` 内；上下限必须跨越零，零线稳定。正负是数值方向，不自动表示利好或利空。

## 主持人与复用

主持素材只保留一个播放实例并在同一时钟上持续播放，不在缩窗时重启。图片与视频均可替换；短视频停在末帧，不循环。现有猫动作不是为当前文案生成的口型。默认季度示例与备用周订单示例均为合成数据。

## 验收

- 检查第 1、3、6、8、11 秒：缩窗不遮挡数据，零线不移，值与标记一致。
- 时间标签、共同尺度、负值、焦点索引与结论须核对，末段留足阅读时间。
- 无参考创作者片段、人像、声音或代码；通用表现方式由本项目独立实现。

## 补充制作约束

- 所有值使用跨越零的共同尺度；不要省略不利时期或为了戏剧效果重排时间。
- `focusIndex` 由作者指定，不是自动异常检测。
- 缩窗只改变裁剪，不重启素材时钟；需配音时另外设置对应节拍。
- 不要把完整 16:9 图表直接裁进小面板，使用组件自身的重排布局。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-PresenterDataTakeover out/PresenterDataTakeover.mp4 --props=templates/presenter-data-takeover/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
