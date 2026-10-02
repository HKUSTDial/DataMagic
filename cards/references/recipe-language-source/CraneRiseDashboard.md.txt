# Crane Rise Dashboard / 吊臂拉升揭示

- ID: `ShotCraft-CraneRiseDashboard`
- Recipe key: `CraneRiseDashboard`
- Category: `chart_camera`
- Native implementation: `templates/crane-rise-dashboard/CraneRiseDashboard.tsx`

先以关键数据柱近景建立问题，再拉升至完整柱状比较和洞察面板。适用于“一个局部信号如何放回整体结构”的解释，不适合没有明确焦点的普通排名。

## Data contract

`categories` 与 `values` 必须等长；`focusLabel` 必须存在于 categories，`focusValue` 应与对应值一致。所有内容保持结构化、可编辑。

## Camera contract

使用 `crane_rise_reveal`。开头不得裁断焦点数字；拉远后必须完整显示坐标、类别、来源和结论，并至少停留 1.5 秒。

## Files

`templates/crane-rise-dashboard/schema.json`
`templates/crane-rise-dashboard/sample-data.json`

## 对象图像 / Entity imagery

- `categoryIcons[categoryLabel]` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.
