# 持续分层与证据更新 / Persistent Tier Board

## 用途 / Purpose

让榜单成为持续存在的舞台：旧对象保留，只移动新证据改变的对象。适合服务水平、产品评估、质量等级和分层教学，既支持升级也支持回落。
A persistent board updates selected entities without resetting everything at every sentence.

## 实现 / Implementation

- Component: `templates/persistent-tier-board/PersistentTierBoard.tsx`
- Schema: `templates/persistent-tier-board/schema.json`
- Data: `templates/persistent-tier-board/sample-data.json`
- Alternate data: `templates/persistent-tier-board/alternate-data.json`
- Composition: `ShotCraft-PersistentTierBoard`
- Output: 1920×1080, 30 fps, 12 seconds, silent preview.

## 分层规则 / Tier rules

三层 `tiers` 按 `minimum` 降序排列，底层从 0 开始，边界归入上层。这里是“值越大越高层”的量化评估，不是任意主观评级，也不是每一层内部的精确排名。
Use 3–5 entities with unique IDs. Values must fit `[0, maximum]`. Each entity keeps a fixed column so trajectories never collide. The row is computed from the thresholds, not manually assigned.

0–3 秒建立全貌；对象按 `at` 更新，运动 0.85 秒，未更新对象持续保留；9.4–12 秒结论停留。移动中暂显示旧值，落位后显示新值；颜色和边框提示正在迁移。短片不重置榜单。

## 复用与验收 / Reuse and acceptance

默认配送准时率；备用质量分数包含降级和跨两层升级，验证并非只支持向上移动。阈值是明确的作者输入，演示阈值不是行业标准。

- Check threshold boundaries, original placements, all updates, and final placements.
- Do not compare different metrics as if they shared one tier scale.
- Clearly label subjective assessments if supplying them; do not present them as measured quality.
- Keep the threshold legend visible; no drifting camera while reading.
- 本项目独立实现通用分层板表现方式，不使用参考项目的球员照片、人像、声音或源码。

## 对象图像 / Entity imagery

- 实体条目的 `iconSrc` / entity item `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.
