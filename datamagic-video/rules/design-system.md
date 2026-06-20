# Design System — Raising the Floor Without Capping the Ceiling

This file makes data videos look *intentional* instead of *assembled*. It is structured in
four layers so it raises baseline quality **without** forcing every video to look identical:

1. **Always** — invariants. Hard rules. Breaking them always looks wrong, so locking them costs no creativity.
2. **Defaults** — a solid starting palette/scale/timing. Use them unless you have a reason. They are a *floor, not a ceiling.*
3. **Presets** — curated moods chosen from the audience register. Variety that is *selected*, not random.
4. **Deviating coherently** — how to go custom without falling apart.

> Read this *after* `scene-planning.md` (story) and *before* `remotion-integration.md` (code).
> The audience register you picked for narration (`narration.md`) also selects the visual preset — one signal drives both.

---

## Layer 1 — Always (invariants, never violate)

These are non-negotiable. They prevent mistakes, not expression.

**Color**
- One global theme per video. Every scene shares the same background family, accent, and neutrals. Never let a scene invent an unrelated color.
- Max **6** data hues in one chart. Beyond that, aggregate as "Other."
- Reserve **one warm attention color** (coral/red, e.g. `#ff6b6b` / `#ef4444`) used *only* for the highlighted mark. It is not a data-series color. Highlight = warm color + glow; the data palette stays cooler so the highlight always pops.
- When emphasizing, dim non-highlighted marks to **~0.45 opacity, not lower** — they must stay readable as context. Killing them to ~0.1 looks like a bug, not a focus. (This is the single most common amateur mistake.)
- Text must clear **4.5:1** contrast against its background. Light text on light fills is a bug.

**Type**
- One type scale per video (defaults below). Never more than **3** sizes visible in a single frame.
- One typeface family. Weight (400/700/800) carries hierarchy, not different fonts.
- Numbers in charts/cards use **tabular figures** (`font-variant-numeric: tabular-nums`) so they don't jitter when counting up.

**Space**
- One spacing unit (8px grid). Pad scene edges to at least **64px**. Content never touches the frame edge.
- One chart per `chart` scene. Never two charts side by side competing for attention.

**Subtitle safe zone (critical, and easy to forget)**
- The bottom **~22%** of the frame is reserved for the narration subtitle. On a 1080p (1920×1080) canvas, keep **all** readable content above **y ≈ 840**; on 720p keep it above **y ≈ 520**.
- "All readable content" means everything: axis ticks, category labels, legends, value labels, callouts, the lowest bar/row, glows. Not just the chart box — the *labels* are what collide.
- If content would drop into the zone, **shrink the chart** (reduce height, font, row gap, or move legend to the top-right) — never push the chart down, and never rely on an empty spacer.
- Show **one** subtitle segment at a time, in a dark glass box (≈ `rgba(0,0,0,0.86)` + `backdrop-blur`, radius 10, padding 18×36, white 24px/600). Keep it identical across every scene.

**Content discipline (the anti-clutter rules — this is what separates polished from amateur)**
- **Chart-first.** A chart scene = a title + (optional) one compact KPI/legend + one chart. Nothing else.
- **No fake report chrome.** Do not invent "REPORT 04", source lines, period stamps, "Methodology:", "Analysis based on…", normalized-index footnotes, or disclaimer footers. If the data doesn't contain it, it doesn't go on screen. Put context in narration instead, and leave the bottom of the card empty.
- **Selective labels.** Do not label every bar/point. With 5+ marks, label only the one(s) the narration calls out; let axes and the highlight carry the rest. Labeling everything is visual noise.
- **No decorative containers.** Cards/panels are background surfaces, not borders-for-decoration. Don't wrap a chart in a box just to fill space; prefer broad, open reading surfaces over tight framed boxes.

**Motion**
- Animation must **ease**, never linear. Use `spring()` / `easeCubicOut` for entrances, a calm pulse for emphasis, eased `interpolate` for fades.
- Every chart scene needs **both** an entrance (data appears) and an emphasis (attention is directed). A static chart that just fades in is a failure (see `anti-patterns.md`).
- Emphasis starts **after** the entrance finishes — never overlap them, or the viewer can't tell growth from focus.
- Nothing moves for the whole scene. Animate in the first ~40%, then **hold still** so the viewer can read.

---

## Layer 2 — Defaults (use unless you have a reason)

A complete starter system. Adopting it verbatim yields a clean, professional result. It is the floor — adapt it to the data's domain and audience.

### Type scale (1080p)

| Token | px | Use |
|---|---|---|
| `display` | 72 / 800 | Opening & closing headline |
| `title` | 48 / 700 | Scene title |
| `value` | 56 / 800 | Stat card number, highlighted data value |
| `body` | 32 / 400 | Subtitle, closing body |
| `label` | 20 / 500 | Axis labels, card labels |
| `caption` | 18 / 400 | Subtitles / on-screen narration |

(`px / weight`. Font: Inter, or any clean grotesque.)

### Spacing

`xs 8 · sm 16 · md 24 · lg 40 · xl 64 · 2xl 96`. Scene padding = `xl` minimum.

### Motion timing (at 30fps)

These are tuned to a calm, professional feel. Prefer **time-based** easing (`easeCubicOut` over a fixed number of seconds) for chart marks; reserve `spring()` for text/cards.

| Token | Spec | Use |
|---|---|---|
| bar entrance | `easeCubicOut`, **0.6s** per bar, **0.12s** stagger between bars | Bars grow from baseline |
| value labels | fade **0.4s**, **+0.3s** after its bar starts | Labels appear just behind the bar |
| dot entrance | `easeCubicOut`, **0.5s**, **0.08s** stagger | Scatter dots fade + grow radius |
| line draw | `stroke-dashoffset`, start **0.2s**, **0.6s** to draw | Line charts |
| `fade` | `interpolate` over ~15 frames | Opacity in/out, text |
| `dim` | `interpolate` to **0.45** over ~12 frames | Dimming non-highlighted marks (keep readable) |
| emphasis pulse | `sin(progress·π·4)·0.03 + 1` → **1.0–1.03×**, calm | Highlighted mark breathes; do not scale big |
| card pop-in | `spring({ damping: 14, stiffness: 120 })` | stat_cards, opening text |

### Default palette — "balanced" (mode-aware)

```
dark mode:
  bg:        #0f1117  (or gradient → #1a1f2e)
  surface:   rgba(255,255,255,0.06)
  text:      #ffffff   textMuted: #a0aec0   textFaint: #718096
  accent:    #667eea   (data primary)
  highlight: #ff6b6b   (warm attention color — highlighted mark ONLY, never a series)
  positive:  #68d391   negative: #fc8181
  series:    [#667eea, #f6ad55, #68d391, #fc8181, #76e4f7, #b794f4]

light mode:
  bg:        #ffffff  (or gradient → #f7fafc)
  surface:   rgba(15,17,23,0.04)
  text:      #1a202c   textMuted: #4a5568   textFaint: #718096
  accent:    #5a67d8
  highlight: #ef4444   (warm attention color — highlighted mark ONLY)
  positive:  #38a169   negative: #e53e3e
  series:    [#5a67d8, #dd6b20, #38a169, #e53e3e, #319795, #805ad5]
```

Implement these as a single `theme` object and thread it everywhere (see `remotion-integration.md` → Theme).

---

## Layer 3 — Presets (pick by audience register)

Don't make every video look the same. Pick a **mood** from the same audience signal that set the narration tone. Each preset is a coherent *deviation* from the defaults — still inside the invariants.

| Register (from narration.md) | Preset | Palette feel | Type | Motion energy |
|---|---|---|---|---|
| **executive** | **Corporate** | dark, restrained — one accent + lots of neutral; deep navy/slate bg | tighter scale, more weight-700 | calm, slower springs (`damping 18`), minimal flourish |
| **research** | **Editorial** | light, neutral, data-first — near-monochrome with a single accent; generous whitespace | smaller titles, large data values, lots of `textMuted` | precise, quick draw-ons, no bounce; emphasis via annotation not glow |
| **casual** | **Vibrant** | high saturation, gradient backgrounds, bold accent + secondary | large `display`/`value`, fewer words on screen | punchy, springy (`damping 10`), bigger scale-ups, glow allowed |

**How to apply:** choose the preset once, up front, then it overrides the relevant default tokens (palette saturation, type emphasis, spring damping, whether glow is used). Everything else inherits Layer-2 defaults. This is how you get variety *with* quality instead of *instead of* it.

> Topic can nudge the palette **hue** within a preset: finance → cooler blues/greens; health → teal/coral; energy/climate → amber/green. Keep the *structure* (one accent + neutrals + semantic colors); change only the hue family.

---

## Layer 4 — Deviating coherently

When the data's brand or domain calls for a custom look, you may leave the defaults — but keep these relationships intact, or it falls apart:

- **Structure, not just color.** A valid palette is: **1 accent** + a **neutral ramp** (bg → surface → text) + **2 semantic** colors (positive/negative). Don't add a second accent unless you have a comparison story that needs it.
- **Limit hues.** ≤ 6 data hues, and they should share a saturation/lightness band so no single series screams unless it's the highlight.
- **Preserve the contrast ladder.** bg darkest/lightest → surface → faint text → muted text → full text → accent. If a custom color breaks the ladder, fix the ladder.
- **One emphasis language.** Pick *how* you highlight (glow, or scale, or annotation, or desaturate-others) and use the **same** mechanism for every highlight in the video. Mixing emphasis styles reads as inconsistent.
- **Match motion to mood.** If you slow the springs for a calm executive feel, slow *all* of them. Don't mix calm entrances with punchy emphasis.

---

## Quick self-check (run before declaring done)

- [ ] One theme object, threaded to every scene — no per-scene stray colors
- [ ] Preset chosen from audience register, applied consistently
- [ ] Every chart scene: entrance **and** emphasis; the climax mark has a callout
- [ ] Highlight uses one emphasis mechanism throughout
- [ ] ≤ 3 type sizes per frame, ≤ 6 data hues per chart
- [ ] Text passes 4.5:1 contrast; numbers use tabular figures
- [ ] Motion eases; scene holds still after the first ~40%
