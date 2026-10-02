# Story Sequence Generator

把同一份分类数据组织成一条完整的四镜头数据故事，而不是四张互不相关的图表。

## 数据契约

- `blueprintId`：六套故事结构之一。
- `title`、`question`、`takeaway`：主题、开场问题和最终可验证结论。
- `items`：3–8 个稳定身份的数据对象，包含唯一 `id`、标签、数值与可选颜色。
- `source`、`unit`、`accent`：来源、单位和全片连续强调色。

## 镜头结构

1. 问题：主问题与领先信号建立悬念，使用克制的慢推。
2. 情境：总量与全部对象铺开，使用宽幅概览横移。
3. 证据：排序比较并推向关键对象，使用轻量冲击聚焦。
4. 结论：共享对象身份延续到最终主张，最后至少静止 1.2 秒。

## 使用

```bash
npx remotion render src/index.ts ShotCraft-StorySequenceGenerator story.mp4 --props=story-data.json
```

输出为 1920×1080、30fps、12 秒。标题、章节、来源与结论均位于相机变换层之外；所有数据图形保持程序化和可编辑。

## 对象图像 / Entity imagery

- 实体条目的 `iconSrc` / entity item `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.
