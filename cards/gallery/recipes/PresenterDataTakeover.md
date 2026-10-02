# 主持人让位与数据接管 / Presenter-to-Data Handoff

## 用途 / Purpose

主持人先建立问题，再缩为圆形小窗，把主画面交给图表；讲到重点时其余数据退为中性。适合经济、业务与科学趋势讲解。
A character poses a question, yields the main frame to evidence, and remains in a circular inset.

## 实现 / Implementation

- Component: `templates/presenter-data-takeover/PresenterDataTakeover.tsx`
- Schema: `templates/presenter-data-takeover/schema.json`
- Data: `templates/presenter-data-takeover/sample-data.json`
- Alternate data: `templates/presenter-data-takeover/alternate-data.json`
- Composition: `ShotCraft-PresenterDataTakeover`
- Output: 1920×1080, 30 fps, 12 seconds, silent preview.
- Sample presenter: `public/assets/character-perspective-board/cat-host.mp4`

## 节奏与数据 / Timing and data

0–1.8 秒主持与设问；1.8–3 秒缩窗交接；3.2 秒起逐项入场；7.2 秒聚焦 `focusIndex`；9–12 秒保留结论。
4–7 个有序时间点，值必须落在共同 `domain` 内；上下限必须跨越零，零线稳定。正负是数值方向，不自动表示利好或利空。

Keep all data on the shared signed scale. Do not omit unfavorable periods or reorder time to dramatize the chart. The focus index is author-specified, not an automatically detected anomaly. Use narration-specific beats if adapting the timing.

## 主持人与复用 / Presenter and reuse

主持素材只保留一个播放实例并在同一时钟上持续播放，不在缩窗时重启。图片与视频均可替换；短视频停在末帧，不循环。现有猫动作不是为当前文案生成的口型。默认季度示例与备用周订单示例均为合成数据。
The crop changes, not the media clock. Replace media and all editorial fields; no generated voice, lip-sync, or automatic causal explanation is included.

## 验收 / Acceptance

- 检查第 1、3、6、8、11 秒：缩窗不遮挡数据，零线不移，值与标记一致。
- 时间标签、共同尺度、负值、焦点索引与结论须核对，末段留足阅读时间。
- Do not crop a complete 16:9 chart into a small panel. This component has its own reflowed data area.
- 无参考创作者片段、人像、声音或代码；通用表现方式由本项目独立实现。
