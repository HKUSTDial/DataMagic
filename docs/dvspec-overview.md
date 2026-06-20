# DVSpec Overview

DVSpec is DataMagic's declarative representation for data videos. It describes what should be shown, how visual elements are connected to data, how narration should align with scenes, and what should be editable after generation.

## Design Goals

- **Data grounding:** Visual marks refer to source data fields instead of unsupported pixel-level guesses.
- **Editable state:** The specification acts as shared state for generation, preview, and later edits.
- **Scene-level structure:** Each video segment has a clear chart intent, narration, and timing.
- **Template compatibility:** Visual templates can read consistent chart and data-binding fields.

## Simplified DVSpec Example

```json
{
  "meta": {
    "title": "Quarterly Revenue Story",
    "fps": 30
  },
  "scenes": [
    {
      "id": "scene_1",
      "type": "chart",
      "duration_frames": 180,
      "content": {
        "title": "Revenue peaked in Q4",
        "chart_type": "bar_chart",
        "data_binding": {
          "x": "quarter",
          "y": "revenue"
        },
        "narration": "Revenue increased throughout the year and reached its highest level in Q4."
      }
    }
  ]
}
```

This example is intentionally simplified. Production DVSpec may include richer scene plans, style metadata, animation hints, narration assets, edit history, and layout overrides.

## Why DVSpec Matters

Without a shared specification, generated videos are hard to edit and hard to verify. DVSpec gives DataMagic a stable intermediate layer between user intent, source data, generated scenes, runtime preview, and post-generation edits.

