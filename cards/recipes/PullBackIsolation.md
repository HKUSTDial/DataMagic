# Pull Back Isolation / 拉远孤立异常

- ID: `ShotCraft-PullBackIsolation`
- Recipe key: `PullBackIsolation`
- Category: `chart_camera`
- Native implementation: `templates/pull-back-isolation/PullBackIsolation.tsx`

先让观众读取完整群体，再拉远并降低非焦点对象的亮度，从平均结构中孤立真正异常值。不可通过改变柱高或数值制造差异。

## Data contract

`focusIndex` 必须指向 items 中的有效对象；结论必须解释该对象为何异常，所有显示值与输入数据一致。

## Camera contract

使用 `pull_back_isolation`。非焦点对象仍需保留足够轮廓作为比较上下文，最终结论停留不少于 1.5 秒。

## Files

`templates/pull-back-isolation/schema.json`
`templates/pull-back-isolation/sample-data.json`

## 对象图像 / Entity imagery

- 实体条目的 `iconSrc` / entity item `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.
