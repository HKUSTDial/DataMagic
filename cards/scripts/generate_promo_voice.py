"""Generate local IndexTTS2 narration. Model and reference are supplied explicitly."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
from normalize_promo_voice import normalize_clip

parser = argparse.ArgumentParser()
parser.add_argument('--model-root', type=Path, required=True)
parser.add_argument('--reference', type=Path, required=True)
parser.add_argument('--ffmpeg', default='ffmpeg')
parser.add_argument('--spec', type=Path)
parser.add_argument('--output', type=Path)
parser.add_argument('--raw-dir', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[2]
spec = json.loads((args.spec.resolve() if args.spec else root / 'assets/promo/narration.json').read_text())
out = args.output.resolve() if args.output else root / 'assets/promo/audio'
out.mkdir(parents=True, exist_ok=True)
raw = args.raw_dir.resolve() if args.raw_dir else root / 'cards/out/promo-voice'
raw.mkdir(parents=True, exist_ok=True)
sys.path.insert(0, str(args.model_root.resolve()))
os.chdir(args.model_root)
import soundfile as sf
import torchaudio
import torch
import random
import numpy as np

torch.manual_seed(42)
random.seed(42)
np.random.seed(42)
def save_audio(path, waveform, sample_rate, **kwargs):
    sf.write(path, waveform.squeeze().cpu().numpy(), sample_rate, subtype='PCM_16')
torchaudio.save = save_audio
from indextts.infer_v2 import IndexTTS2
tts = IndexTTS2(cfg_path=str(args.model_root / 'checkpoints/config.yaml'), model_dir=str(args.model_root / 'checkpoints'), use_fp16=True, use_cuda_kernel=False, use_deepspeed=False)
for segment in spec['segments']:
    source = raw / (segment['id'] + '.wav')
    tts.infer(spk_audio_prompt=str(args.reference), emo_audio_prompt=str(args.reference), emo_alpha=0.12, text=segment['text'], output_path=str(source), use_random=False, verbose=False)
    info = sf.info(source)
    available = segment['end'] - segment['start']
    speed = max(1.0, info.duration / available)
    if speed > 1.35:
        raise RuntimeError(f"Shorten text for {segment['id']}: needs {speed:.2f}x speed")
    target = out / (segment['id'] + '.wav')
    _, metrics = normalize_clip(args.ffmpeg, source, target, speed)
    segment['loudness'] = metrics
    segment['renderedSeconds'] = round(sf.info(target).duration, 4)
    segment['speed'] = round(speed, 6)
    segment['file'] = target.name
    print(json.dumps(segment, ensure_ascii=False), flush=True)
(out / 'voice-manifest.json').write_text(json.dumps(spec, ensure_ascii=False, indent=2) + '\n')
