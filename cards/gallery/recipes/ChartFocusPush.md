# Chart Focus Push / 图表焦点推镜

- ID: `ShotCraft-ChartFocusPush`
- Recipe key: `ChartFocusPush`
- Category: `camera_enhanced_chart`
- Native implementation: `templates/chart-focus-push/ChartFocusPush.tsx`
- Camera utility: `src/camera/chartCamera.ts`

## Use / 适用场景

Use when one anomaly, inflection point, or KPI deserves closer attention after the
viewer has seen the whole trend. 适合先交代完整趋势，再强调一个异常点、拐点或
关键指标；不适合同时追逐多个互不相关的焦点。

## Data contract / 数据契约

- `labels` and `values` must have equal length.
- `anomalyIndex` identifies an existing value and must not alter chart geometry.
- `insight` must explain why the focused value matters.
- Keep a visible source, and clearly mark synthetic or demonstration data.

## Camera contract / 镜头契约

- Establish the complete chart before moving the camera.
- Use `slow_focus_push` for explanatory scenes; reserve `crash_focus` for rare,
  high-emphasis beats.
- Keep titles, conclusions, and sources outside the transformed chart stage.
- Drive every transform from the Remotion frame. Do not use CSS transitions.
- Hold the final framing long enough for the annotation to be read.

## Integration / 接入方式

Pass `useCurrentFrame()`, `fps`, `durationInFrames`, the chart-stage dimensions,
and the focused data coordinate into `calculateChartCamera()`. Apply the returned
`scale`, `x`, `y`, and `origin` to the chart layer only.
