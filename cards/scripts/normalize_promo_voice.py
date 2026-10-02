"""Two-pass speech normalization with padded analysis, trimmed delivery and QA."""
import argparse
import json
import math
from pathlib import Path
import re
import subprocess
import tempfile


def measure(ffmpeg, file, filters=''):
    chain = (filters + ',' if filters else '') + 'loudnorm=I=-18:TP=-2:LRA=7:print_format=json'
    result = subprocess.run([ffmpeg, '-hide_banner', '-i', str(file), '-af', chain, '-f', 'null', '-'], capture_output=True, text=True, check=True)
    stats = json.loads(re.findall(r'\{[^{}]*"input_i"[^{}]*\}', result.stderr)[-1])
    return {k: float(stats[k]) for k in ('input_i', 'input_tp', 'input_lra', 'input_thresh', 'target_offset')}


def normalize_clip(ffmpeg, source, target, speed):
    with tempfile.TemporaryDirectory(prefix='datamagic-level-') as tmp:
        paced = Path(tmp) / 'paced.wav'
        subprocess.run([ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source), '-af', f'atempo={speed:.6f}', '-ar', '48000', '-ac', '1', str(paced)], check=True)
        import wave
        with wave.open(str(paced)) as audio:
            duration = audio.getnframes() / audio.getframerate()
        # Always cross the short-term analysis window; silence is removed afterwards.
        padding = 'apad=pad_dur=3'
        first = measure(ffmpeg, paced, padding)
        if not all(math.isfinite(v) for v in first.values()):
            raise RuntimeError(f'Silent or invalid input: {source}')
        normalizer = (f'loudnorm=I=-18:TP=-2:LRA=7:linear=true:'
                      f'measured_I={first["input_i"]}:measured_TP={first["input_tp"]}:'
                      f'measured_LRA={first["input_lra"]}:measured_thresh={first["input_thresh"]}:'
                      f'offset={first["target_offset"]}')
        result = Path(tmp) / 'normalized.wav'
        subprocess.run([ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(paced), '-af', f'{padding},{normalizer},atrim=duration={duration:.8f}', '-ar', '48000', '-ac', '1', str(result)], check=True)
        checked = measure(ffmpeg, result)
        if not (-19.5 <= checked['input_i'] <= -16.5 and checked['input_tp'] <= -1.8):
            raise RuntimeError(f'Loudness QA failed for {source.name}: {checked}')
        target.write_bytes(result.read_bytes())
        return duration, {'integratedLUFS': checked['input_i'], 'truePeakDBTP': checked['input_tp'], 'method': 'padded two-pass, trimmed, measured'}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--ffmpeg', default='ffmpeg')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[2]
    folder = root / 'assets/promo/audio'
    manifest = json.loads((folder / 'voice-manifest.json').read_text())
    for segment in manifest['segments']:
        source = root / 'cards/out/promo-voice' / segment['file']
        duration, metrics = normalize_clip(args.ffmpeg, source, folder / segment['file'], segment['speed'])
        if duration > segment['end'] - segment['start'] + .04:
            raise RuntimeError('Speech no longer fits its scene')
        segment['renderedSeconds'] = round(duration, 4)
        segment['loudness'] = metrics
        print(segment['id'], metrics, flush=True)
    (folder / 'voice-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
