# Editorial — Data-Video Style Pack

> Calm, data-first, near-monochrome. For analytical / research audiences where the numbers
> lead and restraint signals credibility. Selected when the audience register is `research`
> (see `narration.md`). One of the packs in the data-video style library; overrides the
> `design-system.md` defaults where noted, inherits everything else.

## Key Characteristics (the soul — keep these or it isn't editorial)

- **Light canvas, near-monochrome.** One accent + a neutral ramp. Let the *data* be the color.
- **Generous whitespace.** The chart breathes; margins are wide. A cramped frame breaks the feel.
- **Emphasis by annotation, not spectacle.** Callouts and weight carry focus — never glow.
- **Quiet, precise motion.** Quick draw-ons, no bounce, no pulse. Movement you barely notice.
- **Numbers are the hero.** Large data values, tabular figures, restrained titles, serif headlines.

## Tokens (overrides; light mode)

```
color:
  bg:        #ffffff   (or #fafafa)
  surface:   rgba(15,17,23,0.03)
  text:      #1a202c   textMuted: #4a5568   textFaint: #94a3b8
  accent:    #2563eb   (the single accent — used sparingly)
  highlight: #e11d48   (warm; the highlighted mark ONLY, used rarely)
  series:    [#2563eb, #64748b, #94a3b8, #cbd5e1]   (desaturated blue-grey band)

type:
  display/title: serif — 'Newsreader' / 'Lyon Text' / Georgia, serif; tight tracking (-0.01em)
  body/label/value: clean sans — 'SF Pro Text' / system-ui; value uses tabular figures
  hierarchy: large value, restrained title — the number outsizes the headline

space:  scene padding ≥ xl (64px+); section gaps wide; never fill the frame
motion: draw-on 0.5s easeCubicOut (no bounce); dim → 0.45; stagger 0.10s; NO pulse
```

## Banned (DO NOT)

- **DO NOT** use glow / `drop-shadow` on the highlighted mark — emphasis here is annotation + weight, not light.
- **DO NOT** use the pulse animation (`sin(...)·0.03+1`) — editorial motion holds still, it doesn't breathe.
- **DO NOT** use saturated or neon series colors — series stay inside the desaturated blue-grey band.
- **DO NOT** use more than **one** accent hue.
- **DO NOT** use bouncy / overshooting springs for chart entrances — they ease in, they don't bounce.
- **DO NOT** fill the frame edge-to-edge — wide margins are part of the style.
- **DO NOT** put a heavy opaque black subtitle bar on the light canvas — use a lighter caption treatment.

## Motion & Narration (the dimension a UI style pack can't give)

- **Animation energy: LOW.** Precise draw-ons, settle early, then hold. No glow, no pulse, no scale theatrics.
- **Highlight mechanism:** dim others to 0.45 + a clean annotation/callout + a slightly thicker stroke on the highlighted series. That's it.
- **Narration tone:** measured, precise, third-person analytical. One claim per sentence. No hype words ("surged", "exploded", "game-changing").
- **Subtitle:** light caption (dark text on a faint translucent chip), not the heavy glass box used by `vibrant`.

## Do / Don't

**Do**
- Lead with the value, support with a restrained title.
- Use annotation lines/labels to point at the data the narration names.
- Keep one accent for structure, one warm highlight reserved for the single most important mark.

**Don't**
- Don't decorate. No gradients-for-decoration, no background flourishes, no emoji.
- Don't animate everything at once — stagger, but quietly.
- Don't let a chart touch the subtitle safe zone (see `design-system.md`).
