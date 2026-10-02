# Parallax Map Glide / 多层数据地图滑行

- ID: `ShotCraft-ParallaxMapGlide`
- Recipe key: `ParallaxMapGlide`
- Category: `chart_camera`
- Native implementation: `templates/parallax-map-glide/ParallaxMapGlide.tsx`

背景光场、空间底图和数据节点以不同速度轻微滑动。视差只负责建立层次，数值节点始终保持清晰，不使用手持抖动。

## Data contract

每个 region 必须包含名称、数值和合法的经纬度坐标；节点由地图投影计算位置，不接受手工画布坐标伪装地理位置。来源和单位不可省略。

## Camera contract

使用 `parallax_data_glide`。环境、Natural Earth 边界、路线和节点采用递增但克制的位移比例；数据标签不得重叠或离开安全区。

## Files

`templates/parallax-map-glide/schema.json`
`templates/parallax-map-glide/sample-data.json`
