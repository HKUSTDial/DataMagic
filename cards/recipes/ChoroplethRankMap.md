# Choropleth Rank Map / 区域分级着色地图

- ID: `ShotCraft-ChoroplethRankMap`
- Recipe key: `ChoroplethRankMap`
- Category: `map_visualization`

## Use / 适用场景

Use for a metric attached to countries or regions, especially when geographic
distribution and ranking must be read together. 适合市场规模、覆盖率、风险和区域差异。

## Data and map contract / 数据与地图契约

- Region codes use ISO/ADM0 three-letter codes available in the base map.
- Fill intensity, ranking, labels, and values derive from the same `regions` array.
- Natural Earth 1:110m provides the boundary geometry; it is public domain.
- Do not imply precision below the resolution of the supplied boundaries.

## Review / 检查项

- Unknown region codes must fail validation instead of silently disappearing.
- Small regions remain verifiable in the ranked list even if their map area is tiny.
- Keep the source and boundary attribution visible.

## Native implementation

`templates/choropleth-rank-map/ChoroplethRankMap.tsx`
# 对象图像 / Entity imagery

对象可设置 `iconSrc`，指向 public 中的国旗、品牌素材或类别插图；保持名称和数值可读，图像随对象身份移动，不按当前排名重新分配。倒序揭晓时图标与名称同步出现。示例公司使用通用类别插图。

Set an entity's `iconSrc` to a local public asset or supplied image URL. Keep names and values readable; imagery follows entity identity, not current rank, and appears with the entity's reveal. Fictional companies use category illustrations.
