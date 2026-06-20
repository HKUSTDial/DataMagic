# Refinement — Natural-Language Editing Patterns

After a video is generated, users refine it through natural-language requests. This guide covers the common edit intents and how to map them to DVSpec changes.

## Edit intent taxonomy

### 1. Chart type change

**User says:** "Change the bar chart to a line chart", "Make scene 2 a pie chart", "Use a scatter plot instead"

**DVSpec change:** Update `content.chart_type` in the target scene. Re-validate data binding against the new chart type's axis requirements (see `chart-selection.md`).

**Watch for:** Pie/donut require a dimension + measure only — remove `color` binding if it conflicts. Line chart requires a temporal or ordered `x`.

---

### 2. Data filter / focus

**User says:** "Only show Q4 data", "Focus on the top 3 categories", "Remove Hardware from the chart"

**DVSpec change:**
- Add or update `content.filters` array for value-based filtering.
- For "top N": add `sort: "desc"` and note the limit in `style_hint` or as a filter.

---

### 3. Highlight / emphasis

**User says:** "Highlight Software in red", "Emphasize the Q4 bar", "Make the biggest bar stand out"

**DVSpec change:** Set `content.highlight` to the value to emphasize. The template handles the visual treatment.

---

### 4. Narration edit

**User says:** "Change the narration for scene 2", "Make the voiceover shorter", "Rewrite the narration in a more casual tone"

**DVSpec change:** Update `content.narration` for the target scene. Re-check word count against `duration_frames` using the ~2.5 words/second rule (see `narration.md`).

---

### 5. Scene reordering

**User says:** "Move the KPI scene to the beginning", "Swap scene 2 and scene 3"

**DVSpec change:** Reorder the `scenes` array. Ensure narrative flow still makes sense after the swap (re-read the narration sequence).

---

### 6. Scene addition

**User says:** "Add a scene showing growth rates", "Add a title card at the start", "Insert a text summary after the bar chart"

**DVSpec change:** Insert a new scene object at the correct position. Assign a unique `id`. Set `duration_frames` appropriate to the scene type.

---

### 7. Scene deletion

**User says:** "Remove the last scene", "Delete the pie chart", "Cut the intro"

**DVSpec change:** Remove the scene from the `scenes` array. Check that the surrounding narration still flows without the deleted bridge.

---

### 8. Visual style change

**User says:** "Make it darker", "Use a light theme", "Switch to a balanced style"

**DVSpec change:** Update `meta.mode`. Valid values: `"light"` | `"dark"` | `"balanced"`. This is a global setting — it applies to the entire video, not individual scenes.

---

### 9. Duration / pacing change

**User says:** "Make it shorter", "Give the bar chart more time", "Speed up the intro"

**DVSpec change:** Adjust `duration_frames`. Recalculate narration fit. Total video length = sum of all `duration_frames` ÷ `meta.fps`.

---

### 10. Title / text edit

**User says:** "Change the headline", "Update the subtitle", "Fix the chart title"

**DVSpec change:** Update `content.headline`, `content.subtitle`, or `content.title` in the target scene.

---

## Identifying the target scene

When the user's edit request does not name a scene by `id`, infer the target from:

- Scene number ("scene 2", "the second chart")
- Scene type ("the bar chart", "the closing", "the opening card")
- Content reference ("the scene about Software", "where it shows Q4")

If ambiguous, ask: "Which scene would you like to change — the Q4 trend chart or the category breakdown?"

## Validation after any edit

After applying edits, run the DVSpec validation checklist from `dvspec.md`:

- Data bindings still reference real columns
- Chart types still match the data shape
- Narration still fits the scene duration
- Scene IDs are still unique
- Narrative flow still makes sense end-to-end
