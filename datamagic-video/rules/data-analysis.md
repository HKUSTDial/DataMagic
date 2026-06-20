# Data Analysis — Profiling Tabular Data

Before planning any scene or chart, you must understand the shape of the data. This stage determines what stories are actually possible.

## Step 1 — Profile the columns

For each column, identify:

| Property | What to check |
|---|---|
| **Type** | Numeric, categorical, temporal, or boolean |
| **Role** | Measure (something you quantify) vs. dimension (something you group by) |
| **Range** | Min, max, number of distinct values |
| **Completeness** | Any nulls or blanks? |

**Temporal columns** — detect date/year/quarter/month patterns even if stored as strings. They almost always become the x-axis of a trend scene.

**Categorical columns** — count distinct values. ≤ 8 categories work well in a single chart. More than that, consider aggregation or a "top N" framing.

## Step 2 — Surface candidate insights

Look for the following patterns in the data:

- **Trend** — a measure changes consistently over time → line or bar (time on x)
- **Ranking** — a measure differs across categories → bar chart, sorted descending
- **Composition** — parts sum to a meaningful whole → pie, stacked bar, or waterfall
- **Comparison** — two or more measures side-by-side for the same categories → grouped bar or dual-axis
- **Correlation** — two numeric measures that may co-vary → scatter plot
- **Flow / change** — values that transition from one state to another → Sankey or waterfall
- **Single KPI** — one headline number with context → KPI card

Always identify the **strongest 1–3 insights** before planning scenes. Not every column needs a scene.

## Step 3 — Map to a user goal

If the user has stated a goal (e.g., "explain which category drove growth"), filter the insights to those that directly serve that goal. The story should answer the user's question, not enumerate every column.

## Common mistakes to avoid

- Do not treat an ID column as a measure or a category axis.
- Do not create a chart when fewer than 3 data points exist in a series — state the insight as a text scene instead.
- Do not ignore units — revenue in dollars, growth in percent, and headcount in people should never be mixed on the same axis without a dual-axis setup or normalization.
