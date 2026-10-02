# DVSpec — Data Video Specification (the planning "screenplay")

DVSpec is a declarative plan for a data video — the **screenplay** you author before writing any Remotion code. It describes every scene: what data is shown, how visual marks bind to data fields, what narration plays, and what animations fire and when.

DVSpec is the portable, inspectable artifact of this skill. You can hand it to a teammate, diff it, review it, and edit it without touching rendering code. Once the DVSpec plan is solid, map it to a Remotion composition via `remotion-integration.md`.

## Why plan with DVSpec first

Without a structured plan, a generated video is a black box — hard to edit, hard to verify. DVSpec separates **what the video says** (data, narration, story order) from **how it renders** (Remotion components, easing, layout). Author the story as a DVSpec plan; then realize it in Remotion. Every later edit goes through the DVSpec, so the video stays traceable to the original data.

> **Note on fidelity.** DVSpec is the conceptual model behind DataMagic. This skill uses it as a planning representation that you compile to Remotion yourself (see `remotion-integration.md`). DataMagic's hosted product compiles the same DVSpec with its own premium templates and renderer — the structure below is the shared contract.

## Top-level structure

```json
{
  "meta": {
    "title": "string — video title",
    "fps": 30,
    "width": 1920,
    "height": 1080,
    "language": "en",
    "mode": "light"
  },
  "scenes": [ /* array of scene objects */ ]
}
```

`fps` defaults to 30. `width`/`height` default to 1920×1080.

`mode` controls the global visual theme: `"light"` | `"dark"` | `"balanced"`. Applied system-wide — not per scene.

## Scene object structure

A scene is a 5-tuple:

```json
{
  "id": "scene_1",
  "type": "opening | chart | stat_cards | narrative_card | closing",
  "content": { /* visualization config — see below */ },
  "narration": [ /* ordered narration segments — see below */ ],
  "animation": [ /* animation effects — see below */ ]
}
```

Scene duration is derived automatically from the TTS audio generated from `narration`. Do not set it manually.

## Scene types

| Type | Role |
|---|---|
| `opening` | First scene — introduces topic and frames the question |
| `chart` | Animated chart scene — one chart type + data binding + narration |
| `stat_cards` | Headline numbers displayed as cards, no chart |
| `narrative_card` | Pure text: chapter card, transition, or commentary |
| `closing` | Last scene — summarizes and closes the story |

Exactly one `opening` and one `closing` per video. `chart`, `stat_cards`, and `narrative_card` can repeat.

## The `narration` field

`narration` is an ordered array of text segments. Each segment maps to one sentence or clause of speech:

```json
"narration": [
  "Revenue increased throughout the year.",
  "Software accelerated sharply in Q4 to reach 182,000."
]
```

After TTS processing, each segment is assigned a precise `time_start` and `time_end` derived from the actual audio. You write the text; the system computes the timing.

**One segment per animation cue.** If an animation should fire mid-narration, split the narration at that point so each cue has its own segment index.

## The `animation` field

`animation` is an array of animation effects. Each effect is a 4-tuple:

```json
{
  "type": "emphasis",
  "target_data": { "category": "Software" },
  "trigger": 1,
  "style": { "effect": "pulse", "color": "#f59e0b" }
}
```

### `type`
The animation category. Common values: `"emphasis"` (highlight a data point), `"enter"` (animate element in), `"exit"` (animate element out).

### `target_data` — semantic referencing
Specifies **which data record to animate** using key-value pairs from the source data — not DOM IDs or pixel coordinates.

```json
"target_data": { "sale_date": "2025-01-30" }
"target_data": { "category": "Software", "quarter": "Q4" }
```

At render time, the system finds all records matching these conditions and binds the animation to the corresponding chart elements. This means the reference remains valid even if the data order changes, the chart type switches, or the dataset is updated.

### `trigger` — narration-indexed timing
`trigger` is the **0-based index** of the narration segment that fires this animation — not an absolute timestamp.

```json
"trigger": 0    // fires when the first narration sentence plays
"trigger": 1    // fires when the second narration sentence plays
"trigger": null // fires at scene start, before any narration
```

The renderer computes the exact trigger moment from the TTS audio duration of the preceding segments. When narration text is revised, trigger timing updates automatically — no manual recalculation needed.

**Why this matters:** Separating *logical intent* ("fire when the second sentence plays") from *physical timing* ("fire at 4.3 seconds") means you write animation logic once and it stays correct across narration edits, voice speed changes, and language switches.

## Content fields by scene type

### `opening` scene

```json
{
  "headline": "string — large title text",
  "subtitle": "string — optional supporting line",
  "narration": "string"
}
```

### `chart` scene

```json
{
  "title": "string — chart headline (shown on screen)",
  "chart_type": "bar_chart",
  "data_binding": {
    "x": "column_name",
    "y": "column_name",
    "color": "column_name",    // optional: series dimension
    "size": "column_name",     // optional: bubble size (scatter only)
    "label": "column_name"     // optional: explicit label field
  },
  "filters": [                 // optional: subset of data
    { "field": "region", "value": "APAC" }
  ],
  "sort": "desc",              // optional: "asc" | "desc" | null
  "highlight": "Software",     // optional: value to emphasize
  "narration": "string — what the voiceover says during this scene"
}
```

**Supported `chart_type` values:**

Core: `bar_chart` `line_chart` `pie_chart` `scatter_chart` `radar_chart` `heatmap`

Advanced: `waterfall_chart` `comparison_chart` `flow_sankey` `trend_analysis`

See `chart-selection.md` for data shape requirements per type.

### `stat_cards` scene

```json
{
  "items": [
    {
      "label": "Total Revenue",
      "value": "182,000",
      "unit": "$",
      "change": "+25%",
      "change_direction": "up"
    }
  ],
  "narration": "string"
}
```

`change_direction`: `"up"` | `"down"` | `"neutral"` — controls color treatment of the delta.

### `narrative_card` scene

```json
{
  "body": "string — the text content to display",
  "narration": "string — may match or paraphrase body"
}
```

### `closing` scene

```json
{
  "summary": "string — closing statement",
  "narration": "string"
}
```

## Data binding rules

- `data_binding` fields reference **column names exactly as they appear in the source data**. Case-sensitive.
- `x` must reference a dimension (categorical or temporal column).
- `y` must reference a measure (numeric column).
- `color` must reference a dimension with ≤ 8 distinct values.
- Do not bind the same column to both `x` and `color`.

## Narration rules

- Each scene's `narration` should complete within the scene's `duration_frames` at normal speaking pace (~150 words/minute).
- Rule of thumb: 1 second of narration ≈ 2.5 words. A 10-second scene fits ~25 words.
- Narration should state the **insight**, not describe the chart mechanics ("Revenue peaked in Q4" not "The bar for Q4 is the tallest").
- Narration across scenes should flow as a connected story, not a list of isolated facts.

## Complete example

```json
{
  "meta": {
    "title": "Q4 Revenue Story",
    "fps": 30,
    "width": 1920,
    "height": 1080,
    "language": "en",
    "mode": "light"
  },
  "scenes": [
    {
      "id": "scene_1",
      "type": "opening",
      "duration_frames": 120,
      "content": {
        "headline": "Q4 Revenue: What Drove the Surge?",
        "subtitle": "Quarterly performance by product category",
        "narration": "Revenue grew throughout the year. Let's look at what drove the Q4 surge."
      }
    },
    {
      "id": "scene_2",
      "type": "chart",
      "duration_frames": 300,
      "content": {
        "title": "Revenue peaked in Q4",
        "chart_type": "line_chart",
        "data_binding": {
          "x": "quarter",
          "y": "revenue",
          "color": "category"
        },
        "narration": "Revenue increased each quarter, with Software accelerating sharply in Q4 to reach 182,000."
      }
    },
    {
      "id": "scene_3",
      "type": "chart",
      "content": {
        "title": "Software led all categories in Q4",
        "chart_type": "bar_chart",
        "data_binding": {
          "x": "category",
          "y": "revenue"
        },
        "filters": [{ "field": "quarter", "value": "Q4" }],
        "sort": "desc"
      },
      "narration": [
        "In Q4, Software outperformed every other category.",
        "Its lead over Hardware exceeded 50%."
      ],
      "animation": [
        {
          "type": "emphasis",
          "target_data": { "category": "Software" },
          "trigger": 0,
          "style": { "effect": "pulse", "color": "#f59e0b" }
        }
      ]
    },
    {
      "id": "scene_4",
      "type": "closing",
      "duration_frames": 150,
      "content": {
        "summary": "Software growth of 25% drove the Q4 surge.",
        "narration": "The Q4 surge was a Software story. At 25% growth, it outpaced every other category and lifted the overall total."
      }
    }
  ]
}
```

## Validation checklist

Before submitting a DVSpec for generation:

- [ ] Every `data_binding` field references a real column in the source data
- [ ] Every `chart_type` value is from the supported list above
- [ ] Each scene's narration fits within its `duration_frames` at ~150 wpm
- [ ] No two scenes have the same `id`
- [ ] The `scenes` array starts with `type: "opening"` and ends with `type: "closing"`
- [ ] The `scenes` array has at least 3 entries
- [ ] `meta.mode` is one of `"light"`, `"dark"`, `"balanced"`
