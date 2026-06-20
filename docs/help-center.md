# Help Center

This guide explains what DataMagic is, which generation mode to choose, how to prepare data, how to write requests, how to edit generated results, and what to do when something goes wrong.

## What Is DataMagic?

DataMagic is an AI data-video system. It turns structured data into narrated animated videos or single animated charts, then keeps the result editable in the browser.

## Which Mode Should I Use?

**Full Video**

Use Full Video when you want a complete data story with multiple scenes, narration, and a presentation-ready flow. It is best for reports, business reviews, research summaries, and data storytelling.

**Single Chart**

Use Single Chart when you already know the data and only need one animated visualization. It is faster and better for quick communication, dashboards, and prepared analyses.

## Data Requirements

- Use CSV files or pasted tables with clear column headers.
- Keep one concept per column, such as date, product, revenue, cost, region, or category.
- Include numeric columns for charts.
- For time-series charts, include a consistent time column such as date, month, quarter, or year.
- Avoid merged cells, empty header rows, explanatory notes inside the table, or deeply nested JSON.

## How to Write a Good Request

Good requests explain the insight, comparison, trend, or ranking the viewer should understand.

Examples:

```text
Compare monthly revenue and highlight the strongest growth month.
```

```text
Show product revenue share and call out the largest category.
```

```text
Explain how customer churn changed by quarter and identify the risk period.
```

Avoid vague requests such as:

```text
Make it nice.
```

## Editing Generated Results

After generation, you can refine the output without starting over.

- Double-click editable text in the preview to change titles, labels, and short descriptions.
- Use visual controls when available to adjust chart colors and emphasis.
- Use the AI edit panel for natural-language edits, such as "make the chart dark" or "rewrite the subtitle more concisely."

## Credits and Generation Time

Generation consumes credits because DataMagic runs AI analysis, scene generation, narration alignment, and render validation.

- Full Video uses more credits because it creates a complete multi-scene video.
- Single Chart is faster and uses fewer credits.
- Generation time depends on dataset complexity, model response speed, and render validation.

## Troubleshooting

### The system says my data cannot be analyzed.

Check that the first row contains column names, at least one numeric column is present, and the table is not empty or mixed with notes.

### The chart is not what I expected.

Use a more specific request, select preferred visual styles before generating, or use the edit panel to ask for a chart-type change.

### The preview looks wrong or a scene fails to render.

Refresh the preview first. If the issue remains, use visual repair when available or regenerate with a clearer request.

### Can I export the generated video?

Open the preview page and use Export when the video is ready. Export availability may depend on the current deployment configuration.

## Contact and Support

For now, contact your deployment administrator or the DataMagic project maintainer. An official support email and public feedback channel will be added before public launch.

