# Shared Data Element Transition / 共享数据元素转场

- ID: `ShotCraft-SharedDataElementTransition`
- Recipe key: `SharedDataElementTransition`
- Category: `data_transition`
- Native implementation: `templates/shared-data-element-transition/SharedDataElementTransition.tsx`

让一个数据对象从完整比较图中脱离，跨越镜头并进入结论场景。数值、标签和颜色在两个场景中保持一致，适合从“证据”自然衔接到“结论”。

## Data contract

`focusIndex` 必须指向 `data` 中的有效项。转场前后的主数值、单位、标签和颜色必须来自同一对象，不得为了动画修改数值。

## Motion contract

先建立完整比较，再让焦点对象脱离图表；目的场景出现后，数据对象落入新的信息结构。标题、来源和说明保持在固定层，末段至少静止一秒。

## Misuse

不要在两个场景表达不同指标时使用共享元素；这会制造虚假的连续关系。不要同时移动多个数据对象。

## Files

`templates/shared-data-element-transition/schema.json`
`templates/shared-data-element-transition/sample-data.json`

## 对象图像 / Entity imagery

- 实体条目的 `iconSrc` / entity item `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.
