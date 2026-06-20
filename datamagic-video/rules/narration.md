# Narration — Writing Scripts and Aligning with Animation

Narration is what makes a data video feel authored rather than assembled. Good narration guides the viewer's attention before the chart finishes rendering.

## How timing works

**Write the narration text; timing is automatic.**

TTS (text-to-speech) generates the audio from your narration text and captures word-level timestamps. Scene duration is then derived from the actual audio length, not set manually — Remotion's `calculateMetadata` sizes each scene to its voiceover (see `voiceover.md` for the free `edge-tts` path and the wiring).

This means:
- Do not obsess over frame counts or word limits when writing narration.
- The right question is: does this narration say the right thing at the right level of detail?
- Shorter narration → shorter scene. If you want a scene to breathe, write more narration, not fewer words.

**Rough calibration** (for sanity-checking, not enforcing):

| Intended scene length | Approximate narration length |
|---|---|
| 4–5 seconds | 1 short sentence (~10–12 words) |
| 6–8 seconds | 1–2 sentences (~15–20 words) |
| 10–12 seconds | 2–3 sentences (~25–30 words) |
| 14–16 seconds | 3–4 sentences (~35–45 words) |

At natural speaking pace (~150 wpm), 1 second ≈ 2.5 words. Use this only to catch obvious mismatches (e.g., a 200-word narration on a simple chart).

## Core principle: lead the eye

Narration should describe the insight that is **about to become visible**, so the viewer knows what to look for before the animation completes. Never narrate what the viewer can already read from the static chart.

**Wrong:** "The bar for Software is the tallest in the Q4 group."
**Right:** "Software pulled ahead of every other category in Q4, posting 25% growth."

The animation should confirm what the narration just promised — not repeat it.

## Writing style

**State the insight, not the chart mechanics.** One sentence per scene is the ideal; two short sentences is the maximum for a standard chart scene.

- Lead with the finding: "Revenue peaked in Q4" not "Looking at the data, we can see that…"
- Use concrete numbers: "Revenue hit $182,000" beats "Revenue was high."
- Use relative comparisons: "50% higher than Hardware" gives the number meaning.
- Avoid passive voice: "Software outpaced Hardware" not "Hardware was outpaced by Software."
- Avoid axis jargon: "the trend" not "the slope of the line."
- Avoid over-hedging: use "Revenue peaked" not "Revenue appears to have peaked."

## Stage-aware narration tone

Narration tone should change as the story arc progresses. The same factual content lands differently depending on whether the viewer is being oriented, built up toward a peak, or settling after it.

**Setting scenes** (early `chart` or `stat_cards` scenes, context-establishment)
Conversational, scene-setting. Introduce what's being measured and why it matters. Don't reveal the peak yet.
> "First, the overall landscape. Total revenue reached $4.2 billion across all categories in Q4."

**Rising scenes** (middle `chart` scenes building toward the climax)
Build momentum. Each sentence should add a new layer or implicitly raise a question.
> "But not all categories grew equally. Hardware held steady while Software started pulling ahead."

**Climax scene** (the single most important finding)
The strongest narration in the video. Be maximally specific — use the most striking number, name the surprise, make it unmistakable.
> "Software surged 25% in Q4 — more than triple the growth of any other category."

**Resolution scenes** (late scenes, `stat_cards`, summary content)
Settle the tension. Summarize or give perspective. Don't introduce new claims.
> "Across all categories, Q4 growth averaged 12% — a strong finish driven almost entirely by Software."

## Narrative arc and flow

Read all scene narrations back-to-back as a piece of continuous writing. It should flow like a short essay, not a list of captions.

| Scene position | Narration role |
|---|---|
| `opening` | Set the question or thesis. End with a forward hook. |
| Setting `chart` / `stat_cards` | Introduce context, conversational tone |
| Rising `chart` scenes | Build toward the climax, momentum tone |
| Climax `chart` | Most specific, data-rich, impactful sentence in the video |
| Resolution `chart` / `stat_cards` | Settle, summarize, perspective tone |
| `narrative_card` | One clear pivot sentence — bridge or question |
| `closing` | Resolve the question posed in the opening |

**Transition openers** to vary cross-scene flow: "Behind this number…", "The breakdown tells a clearer story.", "Zooming out…", "The contrast becomes sharper when…", "What drove this?"

## Subtitle readability rules

Narration text becomes on-screen subtitles. Each narration segment must stay readable as a subtitle:

- **8–12 words per sentence** is the target. Longer sentences wrap to 3+ lines and become hard to read.
- **One concrete data claim per sentence.** Don't pack two insights into one subtitle.
- **Don't restate what's already visible** in chart labels — the subtitle should add meaning, not repeat what the axes say.
- **Avoid generic filler phrases**: "across the board", "this highlights a clear distinction", "maintain a consistent pattern", "despite lower levels" — these add words without adding insight.
- **Multi-sentence narration**: split into separate array entries in the DVSpec `narration` field. Each entry becomes one subtitle and one potential animation trigger index.

## Audience register

Adjust tone to match the intended viewer:

**Executive / business**
Confident and direct. Quantify outcomes. Skip methodology.
> "Software delivered the highest Q4 return — a 25% surge while every other category flatlined."

**Research / analytical**
Precise and qualified. Name the data fields. Acknowledge limitations if relevant.
> "Across all four quarters, Software revenue shows a monotonic increase, with Q4 representing a 25% quarter-over-quarter gain — the largest single-quarter jump in the dataset."

**Casual / social**
Punchy and conversational. Use contrast and surprise.
> "Software didn't just win Q4 — it ran away with it. While Hardware barely moved, Software jumped 25%."

## Multi-language narration

When generating narration in languages other than English:

- Match the formality register to the target audience (Chinese business writing is typically more formal than casual spoken Chinese).
- Keep sentences short — TTS rhythm differs by language; long subordinate clauses in German or Japanese can create awkward pauses.
- Numbers should be stated in the target language's natural form (e.g., "一亿八千二百万" vs "182 million" vs "1억 8,200만").
- Avoid idiomatic English phrases translated literally — rewrite for the target language's conventions.

## Common mistakes

- Restating axis labels as narration ("The x-axis shows quarters and the y-axis shows revenue").
- Narrating trends or data not visible in the current scene's chart.
- Using the same sentence opener for every scene — vary the structure.
- Writing the narration after the DVSpec is locked — write narration and DVSpec together so they stay in sync.
- Narration that ends more than 20% before the scene ends — the viewer sits in silence. Either add a sentence or shorten the scene.
