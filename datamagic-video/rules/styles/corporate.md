# Corporate — Data-Video Style Pack

> Restrained, authoritative, dark. For executive / boardroom audiences where calm and clarity
> signal credibility. Selected when the audience register is `executive`. Overrides the
> `design-system.md` defaults where noted, inherits the rest.

## Key Characteristics (keep these or it isn't corporate)

- **Dark, sober canvas.** Deep navy / slate, never pure black. One accent, lots of neutral.
- **Authority through restraint.** No flourish. Weight and spacing carry hierarchy, not effects.
- **Calm motion.** Slow, settled springs; nothing bounces or pulses hard. Confidence, not energy.
- **One number at a time.** Each scene makes a single point cleanly; no busy dashboards.
- **Quiet emphasis.** A subtle glow + callout, not a fireworks highlight.

## Tokens (overrides; dark mode)

```
color:
  bg:        #0f1117   (or gradient → #1a1f2e, deep navy/slate)
  surface:   rgba(255,255,255,0.05)
  text:      #ffffff   textMuted: #a0aec0   textFaint: #64748b
  accent:    #5b8def   (calm slate-blue — the single structural accent)
  highlight: #f6ad55   (warm, used sparingly on the one key mark)
  series:    [#5b8def, #7f9cf5, #a0aec0, #cbd5e1]   (low-saturation blue-grey)

type:
  display/title: clean grotesque — Inter / 'SF Pro Display'; weight 700; tight, not airy
  value: large, weight 800, tabular figures
  hierarchy: strong title, large value; restrained labels

space:  scene padding ≥ xl; comfortable but not sprawling
motion: springs slow & settled (damping ~18, stiffness ~90); dim → 0.45; stagger 0.12s;
        glow subtle; pulse minimal (≤ 1.02×) or none
```

## Banned (DO NOT)

- **DO NOT** use saturated / neon colors or gradients-for-decoration.
- **DO NOT** use bouncy, overshooting springs — corporate motion is settled, never playful.
- **DO NOT** crowd a scene with multiple charts or dense KPI walls — one point per scene.
- **DO NOT** use more than one structural accent.
- **DO NOT** use emoji, exclamation marks, or hype words anywhere on screen or in narration.

## Motion & Narration

- **Animation energy: LOW–MEDIUM.** Settled springs, calm draw-ons. Emphasis is deliberate, not flashy.
- **Highlight mechanism:** dim others to 0.45 + a subtle glow + a clean callout with the figure. No big scale jump.
- **Narration tone:** confident, measured, executive. Decisive statements; no filler, no hype. "Revenue rose 25%," not "Revenue absolutely exploded."
- **Subtitle:** standard dark glass box, consistent across scenes.

## Do / Don't

**Do**
- Lead with the headline figure; let whitespace and weight do the work.
- Reserve the warm highlight for the single most important mark per scene.

**Don't**
- Don't decorate. Don't animate everything at once. Don't let motion call attention to itself.
