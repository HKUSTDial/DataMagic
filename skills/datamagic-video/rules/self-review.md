# Self-Review — Run This Before Declaring the Video Done

Generation is not finished when the code compiles — it is finished when it passes this
review. **Before you tell the user the video is ready, walk every item below and fix what
fails.** Most "the output feels off / amateur" problems are a failure to do this pass.

Go section by section. For each unchecked box, either fix it or state explicitly why it
does not apply.

## 1. Narrative

- [ ] A narrative pattern was chosen from the data shape (not defaulted blindly) — see `scene-planning.md`.
- [ ] Exactly one `opening` and one `closing`. The closing answers the question the opening posed (loop closed).
- [ ] Scenes are ordered by importance/story, not raw data order (unless `time_driven`).
- [ ] Every scene advances the story. No "here's another chart" filler.

## 2. Chart & data integrity

- [ ] Each `chart_type` fits the data shape (`line_chart` only with ≥3 time points, etc. — `chart-selection.md`).
- [ ] Chart values are read from `content.data` via `data_binding` — **no literal numbers hardcoded in JSX**.
- [ ] Column names match the source data exactly (case-sensitive).
- [ ] Mixed units are never drawn on one shared scale.

## 3. Design system (the look)

- [ ] **One theme object**, threaded to every scene. No scene invents its own stray colors.
- [ ] A visual **preset was chosen from the audience register** (executive→corporate / research→editorial / casual→vibrant) and applied consistently.
- [ ] ≤ 3 type sizes per frame; ≤ 6 data hues per chart; text passes 4.5:1 contrast; numbers use tabular figures.
- [ ] **Subtitle safe zone respected:** every label, axis tick, legend, callout, and the lowest mark sits above y≈840 (1080p). Nothing readable hides behind the subtitle.
- [ ] **Anti-clutter:** chart-first (title + one chart + optional compact legend). No invented "REPORT"/"Source:"/"Methodology:" chrome. Labels are selective, not on every mark.

## 4. Animation

- [ ] Every chart scene has **both** an entrance and an emphasis. No static chart that only fades in.
- [ ] Emphasis starts **after** the entrance completes (they don't overlap).
- [ ] Highlight = dim others to **~0.45** (still readable) + **attention color** + a clear callout + **calm pulse 1.0–1.03×** (not a big scale jump). Glow only if the style pack uses one.
- [ ] One emphasis mechanism used consistently across the whole video.
- [ ] Multiple simultaneous highlights are collected into a set and applied in one pass; marks are restored when emphasis ends.
- [ ] Motion eases (`easeCubicOut`/`spring`), never linear. Scene holds still after the first ~40%.

## 5. Timing & audio sync (most common silent bug)

- [ ] Narration audio is **delayed with `<Sequence from={...}>`**, NOT trimmed with `<Audio startFrom={...}>`. (Using `startFrom` to delay cuts later segments to silence and leaves dead gaps — verify by watching, not just compiling.)
- [ ] Scene durations come from `calculateMetadata` measuring the audio — **no hardcoded frame counts**.
- [ ] Animation `trigger` indices resolve to the start frame of the matching narration segment.
- [ ] Watch the whole thing: voice, subtitle, and the animation it describes fire **together**. No segment where audio finishes and the scene sits silent.

## 6. Narration & subtitles

- [ ] One data claim per sentence; ~8–14 words; no filler ("As we can see…").
- [ ] Tone matches the story stage (setting / rising / climax / resolution).
- [ ] One subtitle segment on screen at a time, in a consistent dark glass box across all scenes.

---

## The 30-second gut check

Play it once at full speed with sound. Ask:

1. Could a stranger follow the story without pausing?
2. Does the highlighted thing actually grab the eye at the moment the voice names it?
3. Does anything look *busy*, *off-brand*, or *broken* in a single frame?
4. Is there any silent dead air, or any caption hiding behind the subtitle bar?

If any answer is "no," it is not done. Fix and re-watch.
