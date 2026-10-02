# Bar Chart Race

- ID: `ShotCraft-BarChartRace`
- 中文：动态柱状图竞赛
- Category: `race_chart`
- Compatible: time series, ranking, bar chart
- Tags: Bar Chart Race, Ranking, Time Series, Top N

## Use

Use for 5–15 entities observed over multiple ordered time points when the story is about leadership, overtaking, entry, exit, or changing rank.

Do not use when exact comparison across every time point is more important than movement. In that case, prefer small multiples or a line chart.

## Data contract

The template consumes stable entity definitions and ordered snapshots. Values, labels, colors, ranks, and bar geometry remain programmatic and editable. See:

```text
templates/bar-chart-race/schema.json
templates/bar-chart-race/sample-data.json
```

### Entity logos and icons / 对象 Logo 与图标

An entity may include `iconSrc`, a local file path relative to `public/` (SVG, PNG or another supported image format). The image stays attached to that entity's stable `id` as the ranking changes. Keep the text label for readability. Entities without an image retain the original color marker.

每个对象可以设置 `iconSrc`，例如 `icons/coffee/latte.svg`；图标与名称一起跟随对象移动。品牌排名可换为自己的 Logo，国家榜单可换为旗帜，人物榜单可换为头像。推荐将素材保存到 `public/` 后使用本地路径。

Optional `highlightId` emphasizes one entity, slightly fading other bars while preserving their distinct colors. The coffee example supplies six independently drawn SVG icons in `public/icons/coffee/` and shows a purple latte highlight.

可选的 `highlightId` 会加强指定对象，并适当淡化其他柱子，保留各自配色。完整咖啡示例见 `examples/agent-workflow-demo/`。

## Animation contract

- Interpolate values between adjacent snapshots.
- Interpolate rank positions rather than jumping after a sort.
- Keep entity colors stable across all frames.
- Fade entities near the Top-N boundary without changing their identity.
- Hold the final snapshot long enough to read.
- Drive every animation from the Remotion frame; do not use CSS animation.

## Review constraints

- Verify first and final values against the input.
- Test ties, missing values, entering entities, and extreme values.
- Check labels and values at every rank crossing.
- Mark synthetic demo data explicitly.
- Display a source on the rendered frame.

## Native implementation

```text
templates/bar-chart-race/BarChartRace.tsx
templates/bar-chart-race/model.js
```
