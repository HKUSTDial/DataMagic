# Data-Video Style Library

A **style pack** is a complete, repeatable look for a data video. Pick **one** pack per video,
apply it over the `design-system.md` defaults (it overrides where it says so, inherits the rest),
and keep it consistent across every scene.

## Why a pack is more than a color theme

A data video coordinates four kinds of components — **visual, motion, narrative, and audio** —
not just static visuals. So a style pack here defines not only color / type / space but also
**motion energy** and **narration tone**. That coupling is what makes these packs different from
a web/UI design system, and it's why two videos with the same palette can still feel completely
different.

Two principles shape every pack:

- **Energy should match intent.** Higher saturation and faster, springier motion raise arousal
  and make a moment memorable; restraint and slower, quieter motion read as analytical and
  credible. Each pack picks a point on that axis on purpose.
- **One look, end to end.** A single consistent visual style across the whole video aids
  comprehension and feels professional. Never mix packs within one video.

## Choosing a pack

Default: derive from the **audience register** you chose for narration (`narration.md`).

| Audience register | Pack | Feel |
|---|---|---|
| `research` / analytical | **editorial** | Calm, data-first, near-monochrome, low motion |
| `executive` / corporate | **corporate** | Restrained, authoritative, dark, calm motion |
| `casual` / social | **vibrant** | High-energy, saturated, punchy motion |
| news / financial / reporting | **newsroom** | Authoritative news look, lower-thirds, factual |

Topic can also pull a pack: a financial recap leans **newsroom**; a board deck leans
**corporate**; a research summary leans **editorial**; a social explainer leans **vibrant**.

## Pack files

- [`editorial.md`](./editorial.md) — calm, data-first, near-monochrome
- [`corporate.md`](./corporate.md) — restrained dark authority
- [`vibrant.md`](./vibrant.md) — high-energy, saturated, punchy
- [`newsroom.md`](./newsroom.md) — authoritative news / financial reporting

## The shape of a pack

Every pack uses the same sections so they're easy to scan and swap:

1. **Key Characteristics** — the few rules that *are* the style; lose these and it's a different look.
2. **Tokens** — concrete color / type / space / motion values overriding the defaults.
3. **Banned (DO NOT)** — the named defaults and clichés this style forbids.
4. **Motion & Narration** — animation energy, highlight mechanism, narration tone, subtitle style.
5. **Do / Don't** — closing rules of thumb.

To add a pack, copy that shape. Keep it concrete (hex, px, spring params), and make the
Banned list specific — naming what to avoid is what keeps an agent from drifting back to
generic defaults.
