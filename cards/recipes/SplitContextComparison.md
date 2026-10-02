# Split Context Comparison / 双场景数据对比

- ID: `ShotCraft-SplitContextComparison`
- Recipe key: `SplitContextComparison`
- Category: `contextual_data_story`
- Native implementation: `templates/split-context-comparison/SplitContextComparison.tsx`

将同一指标放进两个程序化原创场景：观众先辨认“比较的对象”，再读取双方数值，最后由中间差值和一句结论完成收束。适合使用成本、改造前后、地区差异或两种策略的对比；不适合口径不同却被强行并列的数据。

## Data contract

`left` 与 `right` 独立提供名称、数值、单位、解释、强调色和场景类型，所有文字与数字均可编辑。两个 `unit` 应保持同一量纲；`differenceValue` 与 `takeaway` 必须由输入数据校验后填写。演示中的汽车、道路、充电桩和加油机均为 SVG 程序化绘制，不依赖外部素材。

## Motion contract

8 秒、30fps、1920×1080。标题出现后，两个场景从画面两侧克制地进入；主体、指标、差值和结论依次揭示。所有运动在 6.6 秒前结束，结尾保留 1.4 秒静止阅读。固定标题、来源和结论不得跟随场景运动。

## Composition safeguards

内容保持在 64px 安全区内；差值徽章只能位于两个场景之间，不遮挡主体数值；长标题应在接入时限制为两行以内。中文字体优先使用 `Noto Sans SC`。

## Files

`templates/split-context-comparison/schema.json`  
`templates/split-context-comparison/sample-data.json`  
`templates/split-context-comparison/motion.mjs`

## 对象图像 / Entity imagery

- `left.iconSrc` / `right.iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.
