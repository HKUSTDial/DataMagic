# Cinematic Track Race

- ID: `ShotCraft-CinematicTrackRace`
- 中文：电影赛道式竞赛
- Category: `race_chart`
- Compatible: time series, ranking, high-energy reveal
- Tags: Cinematic, Race, Crash Focus, Spotlight
- Delivery: 1920x1080, 30 fps, frame-driven, final static hold at least 1.5 seconds

## Use

Use for a high-energy ranking sequence where one decisive overtake deserves a single visual impact. Lanes, leader spotlight, progress, turning-point note, and final takeaway form one short competition story.

Do not use when the audience must inspect every intermediate value slowly. Prefer `EditorialLedgerRace` for evidence-heavy reading.

## Data contract

Stable entities and ordered snapshots use the shared deterministic race model. The `story` object defines the hook, turning point, takeaway, and tracked entity. Labels, lane length, rank, leader, and values remain programmatic.

## Animation contract

- Establish all lanes before accelerating the race.
- Interpolate rank and values continuously between snapshots.
- Use one brief crash focus near the pivotal overtake; never repeat it.
- Keep fixed UI, source, and conclusion outside the crash-transformed layer.
- Settle into the final result and hold it for at least 1.5 seconds.

## Review constraints

- Verify the crash focus does not clip labels, values, or the leader panel.
- Confirm the tracked value and final winner against input data.
- Keep glow subordinate to data geometry and preserve readable contrast.
- Mark synthetic data explicitly.

## Native implementation

```text
templates/cinematic-track-race/CinematicTrackRace.tsx
templates/cinematic-track-race/schema.json
templates/cinematic-track-race/sample-data.json
```

## 对象图像 / Entity imagery

- 实体条目的 `iconSrc` / entity item `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.
