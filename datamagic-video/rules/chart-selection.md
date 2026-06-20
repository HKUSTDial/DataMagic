# Chart Selection — Choosing the Right Chart Type

Chart selection is driven by data shape and story intent, not aesthetics. Use this guide to pick the right chart type before authoring a DVSpec scene.

## Decision table

| Data pattern | Recommended chart | Constraints |
|---|---|---|
| One measure over time | `line_chart` | **Requires ≥ 3 time points.** Use `bar_chart` if only 2–3 points |
| Multi-series trend + forecast | `trend_analysis` | Supports historical + predicted lines; ≥ 3 points per series |
| Ranking across categories | `bar_chart` (sorted) | Default go-to for categorical comparisons |
| Part-of-whole (≤ 6 parts) | `pie_chart` | Keep to ≤ 6 slices; aggregate rest as "Other" |
| Multi-category × multi-metric | `comparison_chart` | ≤ 2 metrics recommended; more becomes hard to read |
| Two numeric measures (correlation) | `scatter_chart` | Both axes must be numeric measures |
| Flow or redistribution / funnel | `flow_sankey` | Requires source column + target column + value column |
| Cumulative change from baseline | `waterfall_chart` | Requires ordered items + delta / contribution values |
| Multi-dimension profile | `radar_chart` | 4–8 axes; all axes must share a comparable scale |
| Density across two dimensions | `heatmap` | Requires row dimension + column dimension + numeric value |
| Headline numbers (no chart) | use `stat_cards` scene type | Not a `chart_type` — see scene-planning.md |

## Chart type properties (for DVSpec `chart_type` field)

Use these exact string values in the `chart_type` field of a DVSpec scene:

**Core charts** — general purpose, supported for all datasets:
```
bar_chart, line_chart, pie_chart, scatter_chart, radar_chart, heatmap
```

**Advanced charts** — require specific data shapes (see notes below):
```
waterfall_chart   — stepped contribution bridge (requires ordered items + delta values)
comparison_chart  — multi-category × multi-metric side-by-side (≤ 2 metrics recommended)
flow_sankey       — source → target flow / allocation / funnel
trend_analysis    — historical + forecast multi-line trend
```

## Axis assignment rules

- **x-axis** — always a dimension (category or time). Never a measure.
- **y-axis** — always a measure (numeric). Label with units.
- **color / series** — a second dimension that creates multiple series.
- **size** — a second measure (bubble charts only).

## Sorting rules

- Bar charts showing ranking → sort by value descending unless time is on the x-axis.
- Pie/donut → sort slices from largest to smallest, clockwise from 12 o'clock.
- Stacked bar → sort stack layers by total value of largest-to-smallest.

## Scale rules

- Start numeric axes at zero for bar and area charts — truncated axes are misleading.
- Line charts may start above zero if the range of variation is the key story.
- Use log scale only when the data spans multiple orders of magnitude and the ratio between values is the story.

## Accessibility notes

- Avoid relying on color alone to distinguish series — pair color with labels or patterns.
- Maximum 8 distinct colors in a single chart. Aggregate remaining categories as "Other."
