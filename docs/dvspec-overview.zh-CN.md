# DVSpec 设计说明

DVSpec 是 DataMagic 用来描述数据视频的声明式规格。它说明视频中要展示什么、视觉元素如何绑定到底层数据、旁白如何与场景对齐，以及生成后哪些内容可以继续编辑。

## 设计目标

- **数据绑定：** 视觉元素引用真实数据字段，而不是依赖不可追溯的像素级猜测。
- **可编辑状态：** DVSpec 作为生成、预览和后续编辑共享的中间状态。
- **场景结构：** 每个视频片段都有明确的图表意图、旁白和时间节奏。
- **模板兼容：** 不同视觉模板可以读取统一的图表字段和数据绑定信息。

## 简化 DVSpec 示例

```json
{
  "meta": {
    "title": "Quarterly Revenue Story",
    "fps": 30
  },
  "scenes": [
    {
      "id": "scene_1",
      "type": "chart",
      "duration_frames": 180,
      "content": {
        "title": "Revenue peaked in Q4",
        "chart_type": "bar_chart",
        "data_binding": {
          "x": "quarter",
          "y": "revenue"
        },
        "narration": "Revenue increased throughout the year and reached its highest level in Q4."
      }
    }
  ]
}
```

这个示例经过刻意简化。真实生产环境中的 DVSpec 可能包含更丰富的场景规划、样式元数据、动画提示、旁白资源、编辑历史和布局覆盖信息。

## 为什么需要 DVSpec

如果没有共享规格，生成出来的视频很难验证，也很难继续修改。DVSpec 在用户意图、源数据、生成场景、运行时预览和后续编辑之间提供了稳定的中间层。

