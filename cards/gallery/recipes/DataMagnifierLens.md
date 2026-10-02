# Data Magnifier Lens / 数据放大镜

- ID: `ShotCraft-DataMagnifierLens`
- Recipe key: `DataMagnifierLens`
- Category: `editorial_explainer`

## Use / 适用场景

Use when a trend has one event that deserves a close explanation. 适合异常点、
峰值、拐点与政策发生时刻，不适合同时解释多个不相关异常。

## Data contract / 数据契约

- `labels` and `values` must have equal length.
- The lens highlights an existing value and never changes chart geometry.
- Explain the focused value in `insight` and retain the source.

## Animation contract / 动画契约

- Establish the full trend before stopping at the focus point.
- Keep the final callout visible for at least 1.5 seconds.
- Drive lens position from chart coordinates, not hand-tuned pixels.

## Native implementation

`templates/data-magnifier-lens/DataMagnifierLens.tsx`
