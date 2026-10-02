# Source to Insight / 来源到洞察

- ID: `ShotCraft-SourceToInsight`
- Recipe key: `SourceToInsight`
- Category: `editorial_explainer`

## Use / 适用场景

Use when the audience needs to see how source rows become a ranked visual and
takeaway. 适合方法讲解、数据来源交代、论文复现和事实核查镜头。

## Data contract / 数据契约

- The table and bars must use the same `rows` array.
- Any total stated in `takeaway` must be derivable from the supplied rows.
- Mark synthetic or demo data explicitly.

## Animation contract / 动画契约

- Reveal source rows first, transformation second, result last.
- Keep each stage in a stable region to preserve reading order.
- Do not animate the result before the relevant source rows are visible.

## Native implementation

`templates/source-to-insight/SourceToInsight.tsx`

## 对象图像 / Entity imagery

- 实体条目的 `iconSrc` / entity item `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.
