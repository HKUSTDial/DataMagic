# Voiceover — Narration Audio and Narration-Driven Timing

A data video is narrated. This file covers generating the voiceover audio from the DVSpec `narration` segments and letting the **audio drive scene duration** — so you never hand-count frames.

This file **inlines** the audio wiring a data video needs — delaying each narration segment, measuring it, and driving scene duration from the audio — so you don't need another skill to ship sound. (For audio features beyond narration — waveform visualizers, SFX, music ducking — the `remotion-best-practices` skill is an optional reference.)

## Core principle: audio drives duration

Do **not** set scene durations manually. Generate the narration audio first, measure it, and size each scene to its audio (plus a small padding). This mirrors how DataMagic aligns animation to narration.

```
narration text  →  TTS  →  per-segment MP3 + durations  →  calculateMetadata  →  scene frames
```

## TTS options (choose by budget and quality)

| Option | Cost | API key | Quality | Word-level timing | Use for |
|---|---|---|---|---|---|
| **edge-tts** | Free | None | High (Azure Neural voices) | Yes (WordBoundary) | Default / standalone / testing |
| Azure TTS | Paid (free tier) | Yes | High | Yes | Production, when you have a key |
| ElevenLabs | Paid | Yes | Very high | Limited | Premium voices |
| OpenAI TTS | Paid | Yes | High | No | Quick BYO-key option |
| macOS `say` | Free | None | OK | No | Offline smoke test only |

**Recommended default: `edge-tts`.** It is free, needs no API key, uses the same Microsoft Neural voices as Azure, and exposes word-level boundaries — which is exactly what narration-indexed animation triggers need.

> Caveat: `edge-tts` calls Microsoft Edge's read-aloud endpoint unofficially. It can rate-limit or change without notice, and its terms are a gray area. It is ideal for free/standalone/testing; for production, use a keyed provider (Azure is the same voices, officially).

## Generating audio with edge-tts (free path)

Install: `pip install edge-tts`. Generate one MP3 per DVSpec narration segment (so each segment maps to a Remotion `<Audio>` and can anchor an animation trigger).

```python
# generate_voiceover.py
import asyncio, json
import edge_tts

VOICE = "en-US-AriaNeural"   # pick per meta.language; see `edge-tts --list-voices`

async def synth(text, out_path):
    communicate = edge_tts.Communicate(text, VOICE)
    await communicate.save(out_path)

async def main():
    dvspec = json.load(open("src/data/dvspec.json"))
    for scene in dvspec["scenes"]:
        for i, seg in enumerate(scene.get("narration", [])):
            await synth(seg, f"public/voiceover/{scene['id']}-{i}.mp3")

asyncio.run(main())
```

Run before rendering:

```bash
python generate_voiceover.py
```

For **word-level timing** (needed if you want sub-segment animation precision), use `Communicate.stream()` and collect `WordBoundary` events instead of `.save()` — each yields the word and its offset. For most data videos, per-segment timing is enough; reach for word boundaries only when an emphasis must land on a specific word.

### Voice by language

Match the voice to `meta.language`. Examples: `en-US-AriaNeural`, `zh-CN-XiaoxiaoNeural`, `ja-JP-NanamiNeural`, `de-DE-KatjaNeural`. List all: `edge-tts --list-voices`.

## Narration-driven duration with calculateMetadata

Measure each scene's total audio (sum of its segment MP3s), add padding, and set scene/composition duration. The data-video-specific part is summing per-segment durations per scene and exposing per-segment start frames so animation triggers can resolve (see `remotion-integration.md`). The `calculateMetadata` code is below.

```tsx
const FPS = 30;
const PADDING_FRAMES = 12; // ~0.4s breathing room after narration

// For each scene: durations of its narration segments, in order
const segDurations = await Promise.all(
  scene.narration.map((_, i) =>
    getAudioDuration(staticFile(`voiceover/${scene.id}-${i}.mp3`)),
  ),
);

const sceneFrames =
  Math.ceil(segDurations.reduce((s, d) => s + d * FPS, 0)) + PADDING_FRAMES;

// Per-segment start frames within the scene (for animation triggers)
const segmentStartFrames = segDurations.reduce<number[]>((acc, d, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + Math.ceil(segDurations[i - 1] * FPS));
  return acc;
}, []);
```

- `sceneFrames` sizes the scene's `<Series.Sequence>`.
- `segmentStartFrames[trigger]` converts a DVSpec animation `trigger` index into the frame it fires on (see `remotion-integration.md`).
- Total composition duration = sum of all `sceneFrames`.

## Playing audio in a scene

Render each narration segment's `<Audio>` at its segment start frame within the scene — delay it with `<Sequence from={…}>`, **never** `<Audio startFrom={…}>` (that trims the file instead of delaying it) — so subtitles, audio, and animation stay aligned.

## Subtitles

Each narration segment is also an on-screen subtitle (see `narration.md` for the 8–12-word rule). Show the segment's text while its audio plays — drive subtitle visibility from the same `segmentStartFrames`, so caption, voice, and emphasis animation fire together.

## Checklist

- [ ] One MP3 per narration segment, named `<scene-id>-<index>.mp3`
- [ ] `calculateMetadata` sizes every scene from its audio (no hardcoded durations)
- [ ] `segmentStartFrames` computed and threaded to scenes for trigger resolution
- [ ] Voice matches `meta.language`
- [ ] A small padding follows each narration (no abrupt cut)
