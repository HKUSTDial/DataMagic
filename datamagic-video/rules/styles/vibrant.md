# Vibrant — Data-Video Style Pack

> High-energy, saturated, punchy. For casual / social audiences where the goal is to grab
> attention and make one number stick. Selected when the audience register is `casual`.
> Overrides the `design-system.md` defaults where noted, inherits the rest.

> **Energy without the AI cliché.** Vibrant is loud, but it gets there with **scale, solid
> contrast, and motion** — *not* purple gradients, neon, or glow-on-everything (see the
> "No AI-default aesthetic" invariant in `design-system.md`). Think sports broadcast / modern
> editorial poster: a near-black or single bold solid background, one electric accent, big type.

## Key Characteristics (keep these or it isn't vibrant)

- **Solid, bold, high-contrast.** One **solid** background (near-black or a single saturated brand color), one electric accent. No multi-stop gradients.
- **Big and loud type.** Oversized display and value sizes; few words on screen at once. Scale is the energy.
- **Punchy motion.** Springy entrances that overshoot a little; fast staggers. (Energy is in the *timing*, not in glow.)
- **One hero per scene.** A single number or mark dominates in the accent; everything else is neutral grey.
- **Lead with the hook.** The most striking figure comes first and hits hard.

## Tokens (overrides; solid dark mode)

```
color:
  bg:        #0a0a0b   (solid near-black — NOT a gradient)
  surface:   rgba(255,255,255,0.06)
  text:      #ffffff   textMuted: #a1a1aa   textFaint: #52525b
  accent:    #ff5a36   (one electric solid — orange-red; swap for a single brand color)
  highlight: #ff5a36   (the accent itself carries the hero; or a bright contrast like #ffd23f)
  series:    [#ff5a36, #a1a1aa, #71717a, #52525b]   (ONE accent + a neutral grey ramp — not a rainbow)

type:
  display: oversized — geometric sans (Sora / Space Grotesk) weight 800; value even larger
  hierarchy: the value is the biggest thing on screen
  tabular figures on numbers

space:  generous; the hero fills its area; bold, not delicate
motion: springs punchy (damping ~10–11, stiffness ~130, overshoot ok); dim → 0.45;
        stagger 0.06s; glow OFF or very subtle; pulse light (≤ 1.03×). Contrast carries focus.
```

## Banned (DO NOT)

- **DO NOT** use gradient backgrounds — especially the purple/blue "AI" gradient. One solid bg.
- **DO NOT** use a rainbow/neon series palette — one accent + a neutral grey ramp.
- **DO NOT** rely on glow to create energy — energy is scale + contrast + motion timing.
- **DO NOT** use tiny dense labels or per-mark labeling — vibrant shows fewer, bigger numbers.
- **DO NOT** bury the hook — the headline number leads, it doesn't arrive at the end.
- **DO NOT** let motion be sleepy — sluggish springs kill the style; keep it snappy.

## Motion & Narration

- **Animation energy: HIGH.** Snappy, overshooting springs; bold count-ups; pulse on the hero. Energy is in the timing and the contrast — not glow.
- **Highlight mechanism:** dim others to 0.45 + the electric accent (vs neutral greys) + pulse (1.0–1.03×) + a big, confident callout. No glow — the solid-color contrast carries it.
- **Narration tone:** energetic, conversational, hook-forward. Short, punchy lines. A little drama is fine — "Disney+ went from nowhere to neck-and-neck."
- **Subtitle:** standard dark glass box; can sit a touch larger.

## Do / Don't

**Do**
- Open on the most surprising number. Make it huge. Count it up.
- Keep each scene to one hero; let color and motion celebrate it.

**Don't**
- Don't drown the hook in supporting detail. Don't go grey. Don't slow the motion down.
