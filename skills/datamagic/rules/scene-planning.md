# Scene Planning — Structuring a Multi-Scene Data Story

A data video is not a slide deck. Each scene should advance the story, not just present another chart. Plan the narrative pattern first, then assign scene types.

## Step 1 — Choose a narrative pattern

The narrative pattern decides how scenes are sequenced and paced. Choose based on the **shape of the story** the data tells, not just the topic.

### The 5 patterns

---

**`freytag_default`** — General-purpose, single dramatic peak

Builds context → rising insight → peak finding → resolution. The classic story shape.

Use when: the data has one clear "main finding" you want to build toward. Default choice when no other pattern is a strong fit.

```
opening → context chart → rising evidence → peak finding → closing
```

---

**`hook_then_evidence`** — Inverted pyramid / news-style

The most striking finding comes **first**, and subsequent scenes justify or contextualize it.

Use when: one number or finding is so striking that the audience should hear it immediately. Good for: shocking statistics, decisive trends, competitive standouts.

```
opening (lead with the number) → evidence chart 1 → evidence chart 2 → closing
```

---

**`comparison_driven`** — Side-by-side contrast is the spine

The entire story is about A vs B — two entities, regions, periods, or segments.

Use when: the query is fundamentally "Compare X and Y" or "A vs B." Good for: head-to-head benchmarks, market share comparisons, before/after analyses.

```
opening → establish A → establish B → comparison chart → delta / winner → closing
```

---

**`time_driven`** — Chronological progression

Order matters more than priority. The story follows the data's time spine.

Use when: the query is about evolution over time, with explicit time ranges. Good for: histories, trajectories, "how X changed from Y1 to Y2", era-based narratives.

```
opening → early period → mid period → recent period → trend summary → closing
```

---

**`drill_down`** — Total → segments → individual drivers

Starts with the headline number, then zooms into contributing parts to explain why.

Use when: the data naturally decomposes from aggregate to components. Good for: "Why is X high?", revenue → categories → top drivers, root-cause investigations.

```
opening → headline KPI → breakdown chart → top driver highlight → closing
```

---

### Decision heuristics

| Signal in the query | Pattern to use |
|---|---|
| Mentions a dramatic finding ("X grew 300%", "surprising") | `hook_then_evidence` |
| "Compare A and B" or "A vs B" | `comparison_driven` |
| Evolution over time with explicit time ranges | `time_driven` |
| "Why?" or "What drives X?" or asks for decomposition | `drill_down` |
| Everything else | `freytag_default` |

When in doubt, `freytag_default` works well. Never force a pattern that contradicts the data shape.

> **Theoretical basis.** These five patterns reflect the narrative structures studied in data storytelling research. Freytag's Pyramid originates from 19th-century dramatic theory. The inverted pyramid (`hook_then_evidence`) comes from journalism. The comparison-driven, time-driven, and drill-down structures are grounded in empirical work on how people read and produce data videos [Amini et al., 2015; Yang et al., 2022]. Choosing a pattern that fits the data shape — rather than defaulting to a single structure — is one of the practices that most distinguishes authored data stories from chart dumps.

---

## Step 2 — Assign scene types

| Type | Role |
|---|---|
| `opening` | First scene — introduces topic and frames the question |
| `chart` | Animated chart scene — one chart type + data binding + narration |
| `stat_cards` | Headline numbers displayed as cards, no chart |
| `narrative_card` | Transitional text card — chapter break, hook, question, or summary |
| `closing` | Last scene — summarizes and closes the story |

Rules:
- Exactly one `opening` and one `closing` per video.
- `chart`, `stat_cards`, and `narrative_card` can repeat.
- Use `stat_cards` to deliver a striking number before a `chart` that explains it (`hook_then_evidence`).
- Use `narrative_card` as a bridge when switching themes or entering a new pattern phase.

### `narrative_card` subtypes

`narrative_card` scenes serve different structural roles depending on where they appear. Match the subtype to the position in the story arc:

| Subtype | Narrative arc position | Purpose |
|---|---|---|
| `NarrativeStatHook` | **Setting** (early) | Lead with a dramatic number to grab attention before showing the chart |
| `NarrativeContext` | **Setting** (early) | Frame the background — what this data measures and why it matters |
| `NarrativeDefinition` | **Setting** | Explain a key term the audience needs before interpreting the charts |
| `NarrativeMiniTimeline` | **Setting** | Provide historical context as a compact timeline |
| `NarrativeQuestion` | **Before climax** | Pose the question the climax chart answers — builds anticipation |
| `NarrativeChapterTitle` | **Between clusters** | Mark a topic pivot, like a chapter heading |
| `NarrativeVersus` | **Comparison pivot** | Signal a head-to-head contrast ("A vs B") |
| `NarrativeBeforeAfter` | **Structural break** | Mark a before/after split in the narrative |
| `NarrativeBullets` | **Resolution** (late) | Parallel takeaways or summary bullets |
| `NarrativeQuote` | **Resolution** (late) | Let one finding linger as a single highlighted statement |

**Placement principle:** don't insert narrative cards randomly. Use them to create rhythm at structurally important moments — Setting grabs attention, the pre-climax card builds anticipation, the Resolution card gives closure.

Specify the subtype in the `narrative_card` content's `card_type` field when authoring DVSpec.

## Step 3 — Size the video

| Video length | Scene count | Composition |
|---|---|---|
| Short (under 60s) | 3–5 scenes | `opening` + 2–3 `chart`/`stat_cards` + `closing` |
| Standard (60–120s) | 5–8 scenes | Add 1–2 `narrative_card` transitions between clusters |
| Long (120s+) | 8–12 scenes | Multiple chart clusters, each with its own mini-arc |

Scene duration is driven by the narration text and TTS output — you do not need to calculate frame counts manually. Write the narration first; the system aligns timing automatically.

## Step 4 — Sequencing rules

- Lead with the **most important insight**, not chronological data order (unless using `time_driven`).
- Group scenes by theme — do not interleave unrelated charts.
- The `closing` should answer the question posed in the `opening` — close the loop explicitly.
- Never place two `opening` scenes or two `closing` scenes in one video.
- In `drill_down`, place the `stat_cards` scene (headline KPI) **before** the chart that decomposes it.
- In `comparison_driven`, keep the two subjects in adjacent scenes so the contrast is perceptible.

## Example: 5-scene plan using `drill_down` pattern

**Query:** "Why did Q4 revenue surge? Which category drove it?"

```
Scene 1 (opening)        — "Q4 Revenue: What Drove the Surge?"
Scene 2 (stat_cards)     — Headline: Total Q4 revenue = $182,000 (+25% QoQ)
Scene 3 (chart)          — Line chart: quarterly revenue trend by category
Scene 4 (chart)          — Bar chart: Q4 breakdown by category, Software highlighted
Scene 5 (closing)        — "Software's 25% growth in Q4 accounts for the surge."
```

## Example: 4-scene plan using `hook_then_evidence` pattern

**Query:** "Show that Software dominates revenue."

```
Scene 1 (opening)        — "One category stands above the rest."
Scene 2 (stat_cards)     — Software = $182,000 — largest of any category
Scene 3 (chart)          — Bar chart: all categories ranked, Software first
Scene 4 (closing)        — "Software's lead isn't close — it outpaces Hardware by 53%."
```
