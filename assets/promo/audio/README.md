# Showcase audio

- The eight speech clips listed in `voice-manifest.json`: Chinese AI narration generated locally with IndexTTS2, one sentence per shot. Earlier unused clips may remain for comparison; only manifest entries enter the mix. The reference voice comes from the project's existing voice pool; reference recordings and model weights are not bundled.
- `voice-manifest.json`: generated segment durations, text and placement. The editable timing source is `../narration.json`.
- `music.m4a`: original procedural chord, pluck and pulse score, 120 BPM.
- `sfx.m4a`: original procedural scene-change and ranking cues.
- `score-manifest.json`: synthesis seed, cue times and mix targets.

Rebuild music, effects and the three final video mixes from the repository root with `node cards/scripts/score_promo.cjs` (FFmpeg required). Set `FFMPEG` if the executable is not on PATH. Narration ducks the music; speech-free versions retain music and effects. The synthesizer uses no third-party music or sound-effect samples.

## Checks performed

- All three outputs: 30 seconds, 900 video frames, 1280×720, stereo AAC.
- Latest Chinese narrated mix: -16.09 LUFS, -2.03 dBTP after AAC encoding. All eight standalone sentences span only 0.56 LU; their corresponding final-video intervals span 0.97 LU.
- Each short clip is normalized with padded two-pass analysis, trimmed back to its original duration, and measured again. This prevents the earlier sub-three-second normalization failure.
- `qa-report.json` records all eight speech clips, all eight final voiced intervals, and all three complete output tracks. `verify_promo_audio.cjs` measures the actual media each time mixing finishes and fails if loudness, peak, duration or sentence-level spread is out of bounds.
- Desktop browser decoded audio for all three player selections; controls start unmuted at full player volume. The 390-pixel layout has no horizontal overflow.
- Automatic speech recognition was used as a spot check, not as a listening-quality certification. The opening and closing speech-only clips matched the intended words. A small ASR model produced some homophone substitutions on the mixed soundtrack; voice preference and pronunciation should also be reviewed by listening.
