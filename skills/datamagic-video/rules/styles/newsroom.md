# Newsroom — Data-Video Style Pack

> Authoritative news / financial-reporting look. For headlines, market recaps, and factual
> briefings where the data *is* the story and credibility matters. Pull this pack when the
> topic is news, finance, or reporting (regardless of audience register). Overrides the
> `design-system.md` defaults where noted, inherits the rest.

## Key Characteristics (keep these or it isn't newsroom)

- **Lower-third framing.** A persistent title/figure strip near the bottom-third anchors every
  scene, like a broadcast chyron — a recurring frame the viewer locks onto.
- **Two-color discipline + one alert.** A neutral base, one brand color, one alert accent
  (up/down, gain/loss). Nothing else.
- **Data-forward and dated.** Tabular figures are emphatic; values carry a period or source
  framing in the narration ("As of Q4…").
- **Crisp, factual motion.** Clean slide-ins and cuts; no playful bounce. Information first.
- **Up/down semantics.** Gains and losses use the alert colors consistently (green up, red down).

## Tokens (overrides; light or dark news palette)

```
color:
  bg:        #0e1726 (dark) or #ffffff (light) — pick one and stay
  surface:   rgba(255,255,255,0.06) (dark) / rgba(15,23,42,0.04) (light)
  text:      #f8fafc / #0f172a   textMuted: #94a3b8 / #475569
  accent:    #1d4ed8   (news blue — brand/structure)
  positive:  #16a34a   negative: #dc2626   (gain/loss — used semantically, always)
  highlight: #dc2626   (alert; reserved for the called-out figure)
  series:    [#1d4ed8, #64748b, #94a3b8]   (restrained; alert colors carry meaning)

type:
  display/title: strong grotesque or slab — Inter / 'Roboto Condensed'; weight 700–800; tight
  value: large, weight 800, tabular figures; show units/period
  lower-third: title strip in a contrasting band

space:  reserve a lower-third band; keep the chart in the upper two-thirds
motion: crisp slide-ins for the lower-third; draw-on 0.5s no bounce; dim → 0.45; stagger 0.10s;
        emphasis via callout + alert color (glow optional, subtle)
```

## Banned (DO NOT)

- **DO NOT** use playful bounce, emoji, neon, or decorative gradients — this is reporting, not a promo.
- **DO NOT** use gain/loss colors decoratively — green/red mean up/down, nothing else.
- **DO NOT** editorialize beyond the data in narration — state facts, attribute periods/sources.
- **DO NOT** drop the lower-third framing — it's the anchor that makes it read as news.
- **DO NOT** use more than one brand accent plus the two semantic alert colors.

## Motion & Narration

- **Animation energy: MEDIUM.** Crisp, purposeful motion — lower-third slides in, chart draws on, figure is called out. No theatrics.
- **Highlight mechanism:** dim others to 0.45 + alert color on the key figure + a clean callout with value and period. Subtle glow optional.
- **Narration tone:** news-anchor cadence — factual, third-person, dated and attributed. "Shares closed up 4.2% on the quarter." No hype, no opinion.
- **Subtitle:** clean caption; can integrate with the lower-third rather than a separate floating box.

## Do / Don't

**Do**
- Anchor every scene with the lower-third title/figure strip.
- Use green/red strictly for direction; attribute the period or source in narration.

**Don't**
- Don't let the chart wander into the lower-third band. Don't dramatize. Don't add a second brand color.
