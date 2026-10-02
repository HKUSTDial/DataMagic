# Editorial Ledger Race

- ID: `ShotCraft-EditorialLedgerRace`
- 中文：编辑账本式竞赛
- Category: `race_chart`
- Compatible: time series, ranking, editorial story
- Tags: Editorial, Race, Turning Point, Slow Push
- Delivery: 1920x1080, 30 fps, frame-driven, final static hold at least 1.5 seconds

## Use

Use when ranking change needs to feel like an evidence-led editorial story rather than a sports scoreboard. The shot combines a question, continuous ranking, one tracked entity, a turning-point note, and a final claim.

Do not use for second-by-second live monitoring or when saturated team colors are essential. Prefer `CinematicTrackRace` for high-energy competition.

## Data contract

Stable entities and ordered snapshots use the same deterministic interpolation model as `BarChartRace`. The additional `story` object supplies `hook`, `turningPoint`, `takeaway`, and `focusEntityId`. Every visible number and rank remains derived from structured data.

## Animation contract

- Begin with the editorial question and complete comparison.
- Interpolate values and rank positions continuously.
- Apply one restrained slow push while the evidence develops.
- Keep the tracked entity visually stable across every period.
- Reveal the takeaway only after the final ranking settles.
- Hold the complete final state for at least 1.5 seconds.

## Review constraints

- Confirm the focus id exists and its value matches the current snapshot.
- Keep source, title, question, and final conclusion outside the moving chart layer.
- Check all rank crossings for label and value collisions.
- Mark synthetic data explicitly.

## Native implementation

```text
templates/editorial-ledger-race/EditorialLedgerRace.tsx
templates/editorial-ledger-race/schema.json
templates/editorial-ledger-race/sample-data.json
```

## 对象图像 / Entity imagery

- 实体条目的 `iconSrc` / entity item `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.
