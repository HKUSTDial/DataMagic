# Spatial Percent Overlay / 实景融合百分比

- ID: `ShotCraft-SpatialPercentOverlay`
- Recipe key: `SpatialPercentOverlay`
- Category: `contextual_overlay`
- Compatible: contextual footage, percentage, share, capacity, penetration

## Use / 适用场景

Use when one percentage describes a visible place, industry, object, or region.
The background establishes context; the programmatic overlay carries the exact
metric. 适合产业份额、渗透率、产能占比、覆盖率等“一个场景对应一个主指标”的镜头。

Do not use it for unrelated stock footage or for comparing more than two values.
When the story is a ranking, use a race or ranking recipe instead.

## Data and asset contract / 数据与素材契约

```text
templates/spatial-percent-overlay/schema.json
templates/spatial-percent-overlay/sample-data.json
public/assets/editorial/semiconductor-cleanroom.png
```

- `value` must be between 0 and 100.
- `backgroundSrc` supplies context only. It must not contain baked-in data text.
- Exact values, labels, liquid geometry, and source remain editable.

## Animation contract / 动画契约

- Establish the context before the metric finishes animating.
- Place the percentage vessel in stable negative space without drawing a
  decorative subject-to-callout connector.
- Keep the background push subtle so the reading region remains visually stable.
- Hold the final value for at least 1.5 seconds.
- Drive all motion from Remotion frames; do not use CSS animations.

## Review constraints / 检查项

- Verify that the label, displayed value, liquid level, and source agree.
- Check that the callout does not cover the supplied focal/face region.
- Confirm sufficient contrast over the background at the first and final frames.
- Mark demo data and generated background assets explicitly.

## Native implementation

```text
templates/spatial-percent-overlay/SpatialPercentOverlay.tsx
```

## 对象图像 / Entity imagery

- `entityIconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.
