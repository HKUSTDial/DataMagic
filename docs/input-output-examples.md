# Input and Output Examples

DataMagic supports both complete data-video generation and faster single-chart generation. The examples below show the public-facing shape of inputs and outputs.

## Example Input: Full Video

**User goal**

```text
Analyze quarterly sales performance and explain which product category drove the strongest growth.
```

**Table**

```csv
quarter,category,revenue,growth_rate
Q1,Software,128000,0.08
Q2,Software,146000,0.14
Q3,Hardware,119000,0.05
Q4,Software,182000,0.25
```

**Expected output**

- A multi-scene animated data video.
- Narration that explains the key trend.
- Charts selected according to the data fields and user goal.
- A browser preview where text, layout, and visual style can be edited.

## Example Input: Single Chart

**Chart goal**

```text
Show the revenue ranking by category and highlight the strongest performer.
```

**Data**

```csv
category,revenue
Software,182000
Hardware,119000
Services,97000
Accessories,44000
```

**Expected output**

- One animated chart scene.
- A recommended chart type and visual template.
- Fast preview and editable chart elements.

## Demo Assets

- Demo video: [https://datamagic-home.github.io/#video](https://datamagic-home.github.io/#video)
- Example gallery: [https://datamagic-home.github.io/#samples](https://datamagic-home.github.io/#samples)

