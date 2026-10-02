# Map Route Accumulation / 地图路径累积

- ID: `ShotCraft-MapRouteAccumulation`
- Recipe key: `MapRouteAccumulation`
- Category: `map_visualization`

## Use / 适用场景

Use for trade, migration, logistics, investment, or network expansion where the
order and accumulated total matter. 适合跨地区流向、供应链、迁移和传播路径。

## Data and map contract / 数据与地图契约

- Coordinates are `[longitude, latitude]` and remain inside valid geographic ranges.
- Route geometry uses great-circle interpolation rather than straight screen lines.
- The cumulative counter is the sum of route values multiplied by reveal progress.
- Natural Earth 1:110m provides the public-domain boundary geometry.

## Review / 检查项

- Verify origin and destinations against the source data.
- Route head, line, destination marker, list value, and cumulative total must agree.
- Avoid more than eight simultaneous routes in one shot.

## Native implementation

`templates/map-route-accumulation/MapRouteAccumulation.tsx`
