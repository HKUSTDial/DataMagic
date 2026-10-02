# Anti-Patterns — Common Data Video Mistakes

These are the most frequent ways data videos fail. Each one has a concrete fix.

---

## Storytelling anti-patterns

### Chart dumping
**What it is:** Every column gets its own chart. The video shows 8 charts with no editorial judgment.

**Why it fails:** The viewer doesn't know what matters. The video feels like a report appendix, not a story.

**Fix:** Before planning scenes, identify the 1–3 strongest insights. Only chart what directly serves the story. Everything else is cut.

---

### Opening with context instead of a hook
**What it is:** The first 20 seconds explain data sources, methodology, and caveats before showing anything interesting.

**Why it fails:** Viewer attention peaks at the start. If the first scene is administrative, many viewers disengage before the insight arrives.

**Fix:** Open with the question or the finding. Move caveats to the closing or to supplementary materials.

---

### Mismatched pattern and data shape
**What it is:** Using a `freytag_default` structure on data that clearly calls for `drill_down`, or `time_driven` on data that has no meaningful time order.

**Why it fails:** The narration and scene sequence feel awkward — the viewer senses the story is out of order but can't explain why.

**Fix:** Choose the narrative pattern based on the shape of the data (see `scene-planning.md`), not just the topic category.

---

### The closing that doesn't close
**What it is:** The last scene restates the first chart's finding, or just says "Thank you."

**Why it fails:** The `opening` posed a question. The `closing` must answer it. A restatement is not an answer.

**Fix:** In the closing narration, explicitly respond to the question or thesis stated in the opening. If the opening asked "What drove Q4 growth?", the closing must answer "Software's 25% surge drove Q4 growth."

---

## Chart design anti-patterns

### Truncated y-axis on a bar chart
**What it is:** The y-axis starts at a value other than zero, making small differences look dramatic.

**Why it fails:** A bar chart's visual metaphor is proportional length from zero. Cutting the axis breaks that contract and misleads the viewer.

**Fix:** Always start bar and area chart axes at zero. For line charts where the range of variation is the story, starting above zero is acceptable — but label it explicitly.

---

### Too many series on one chart
**What it is:** A line chart with 9 colored lines, or a bar chart with 12 side-by-side groups.

**Why it fails:** The viewer can't isolate any signal. The chart becomes visual noise.

**Fix:** Cap series at 5–6 for line charts, 8 categories for bar charts. Aggregate the rest as "Other." If more series are essential, use small multiples instead of a single dense chart.

---

### Wrong chart type for the data shape
**What it is:** Using a pie chart for time series, or a line chart for unordered categories.

**Why it fails:** Pie charts imply part-of-whole and are unordered. Line charts imply continuous change over an ordered axis. Using them for the wrong data shape creates false visual implications.

**Fix:** Follow the chart selection decision table in `chart-selection.md`. When in doubt: bar chart for categories, line chart for time.

---

### Mixing incompatible units on one axis
**What it is:** Plotting revenue (dollars) and headcount (people) on the same y-axis.

**Why it fails:** The scale is meaningless and the visual comparison is misleading.

**Fix:** Use a dual-axis chart if both measures are essential, or split into two scenes. Add unit labels to every axis.

---

## Narration anti-patterns

### Narration that describes the chart, not the insight
**What it is:** "The bar chart shows quarterly revenue for four product categories. The x-axis represents quarters Q1 through Q4."

**Why it fails:** The viewer can see the chart. They need to be told what it *means*, not what it *contains*.

**Fix:** State the insight directly. "Software's Q4 revenue jumped 25% — more than any other category."

---

### Narration and chart out of sync
**What it is:** The narration says "Hardware barely moved" while the chart being shown is the pie chart for market share.

**Why it fails:** Viewers integrate visual and audio. When they disagree, trust breaks and comprehension drops.

**Fix:** Each scene's narration must refer only to the data visible in that scene's chart. Cross-scene references belong in the closing summary.

---

### Identical sentence structure across scenes
**What it is:** Every scene narration starts with "In this chart, we can see that…"

**Why it fails:** Repetitive structure signals that the narration was generated without editorial care. It feels robotic.

**Fix:** Vary sentence length, structure, and opening word across scenes. Use contrast, direct statements, and rhetorical questions to maintain engagement.

---

### Narration that ends too early
**What it is:** A 12-second scene whose narration ends at second 4, leaving 8 seconds of silence.

**Why it fails:** The silent gap tells the viewer the scene has ended — they start looking for the next one and miss any remaining animation.

**Fix:** Either extend the narration (add a elaborating sentence), shorten the scene, or let the system derive scene duration from TTS — if the narration is short, the scene will be short automatically.

---

## DVSpec anti-patterns

### Data binding to a non-existent column
**What it is:** `"x": "Quarter"` when the actual column name is `"quarter"` (lowercase).

**Why it fails:** Data bindings are case-sensitive. An unresolved binding produces an empty or broken chart.

**Fix:** Always copy column names directly from the source data. Verify every binding before submitting.

---

### Too many scenes with the same chart type
**What it is:** Five consecutive `bar_chart` scenes with different filters but identical visual structure.

**Why it fails:** Visual repetition without narrative progression feels like a report, not a story. The viewer loses track of why each scene is different.

**Fix:** Vary chart types when the data allows. If multiple bar charts are necessary, insert a `narrative_card` between clusters to mark the narrative transition.

---

### Missing `opening` or `closing`
**What it is:** A DVSpec whose `scenes` array starts with a `chart` and ends with a `chart`.

**Why it fails:** Without an `opening`, the video has no framing. Without a `closing`, the story has no resolution. The viewer is left disoriented.

**Fix:** Every video must begin with `type: "opening"` and end with `type: "closing"`.
