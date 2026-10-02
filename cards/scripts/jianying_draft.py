"""Build a new Jianying draft on the recipient machine; never overwrite drafts."""
import argparse
import hashlib
import json
import math
from pathlib import Path, PurePosixPath
import shutil
import subprocess
import sys
import time
import uuid


def read_json(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def write_json(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')


def mac_draft_root():
    return Path.home() / 'Movies/JianyingPro/User Data/Projects/com.lveditor.draft'


def mac_platform(root, donor=None):
    """Read recipient-local platform fields; never invent or print device identifiers."""
    candidates = [Path(donor)] if donor else sorted(Path(root).iterdir())
    for candidate in candidates:
        if not donor and (candidate.name.startswith('.') or candidate.is_symlink()):
            continue
        try:
            device = read_json(candidate / 'draft_info.json').get('platform', {})
        except (OSError, ValueError, UnicodeError, AttributeError):
            continue
        if isinstance(device, dict) and device.get('os') == 'mac' and device.get('device_id'):
            return {k: device[k] for k in ('os','app_version','device_id','hard_disk_id','mac_address') if k in device}
    raise ValueError('没有找到本机可读的 Mac 旧草稿；新版加密草稿暂不支持。可让本机 Agent 指定明文旧草稿（--donor），或先导入 MP4 使用。不会伪造设备字段或修改旧草稿。')


def mac_registry_entry(meta, target, size):
    entry = {k: meta[k] for k in ('draft_name','draft_id','draft_fold_path','draft_root_path','tm_duration','tm_draft_create','tm_draft_modified')}
    entry.update(draft_json_file=str(target / 'draft_info.json'), draft_cover=meta.get('draft_cover',''),
        draft_timeline_materials_size=size, streaming_edit_draft_ready=True, tm_draft_removed=0)
    for key in ('cloud_draft_cover','cloud_draft_sync','draft_cloud_last_action_download','draft_is_ai_shorts','draft_is_cloud_temp_draft','draft_is_invisible','draft_is_pippit_draft','draft_is_web_article_video'):
        entry[key] = False
    for key in ('draft_cloud_purchase_info','draft_cloud_template_id','draft_cloud_tutorial_info','draft_cloud_videocut_purchase_info','draft_new_version','draft_type','draft_web_article_video_enter_from','pippit_avatar_url','pippit_extra_info','pippit_id','pippit_user_name','tm_draft_cloud_completed'):
        entry[key] = ''
    for key in ('tm_draft_cloud_entry_id','tm_draft_cloud_parent_entry_id','tm_draft_cloud_space_id','tm_draft_cloud_user_id'):
        entry[key] = -1
    entry['tm_draft_cloud_modified'] = 0
    return entry


def register_mac(root, registry, original, entry):
    path = root / 'root_meta_info.json'
    # Do not replace changes made by an app or another installer during generation.
    if path.read_bytes() != original:
        raise ValueError('Draft registry changed during generation. Nothing registered; quit Jianying and retry with a new name.')
    registry['all_draft_store'].insert(0, entry)
    shutil.copy2(path, root / f'root_meta_info.datamagic-{uuid.uuid4().hex}.bak')
    temporary = root / f'.datamagic-registry-{uuid.uuid4().hex}.json'
    write_json(temporary, registry)
    if path.read_bytes() != original:
        raise ValueError('Draft registry changed; no existing entries replaced.')
    temporary.replace(path)


def validate(bundle):
    bundle = Path(bundle).resolve()
    m = read_json(bundle / 'manifest.json')
    if m.get('version') != 1:
        raise ValueError('Unsupported manifest version')
    for key in ('fps', 'width', 'height', 'totalFrames'):
        if type(m[key]) is not int or not 0 < m[key] <= 100000:
            raise ValueError('Invalid canvas or clock')
    assets = {}
    for asset in m['assets']:
        name = asset['path']
        if not isinstance(name, str) or '\\' in name or ':' in name or PurePosixPath(name).is_absolute() or '..' in PurePosixPath(name).parts:
            raise ValueError('Asset path must be portable and inside the bundle')
        path = (bundle / name).resolve()
        if not path.is_relative_to(bundle) or not path.is_file() or asset['id'] in assets:
            raise ValueError('Missing, duplicate or escaped asset')
        if hashlib.sha256(path.read_bytes()).hexdigest() != asset['sha256']:
            raise ValueError('Asset checksum mismatch; re-export after replacing media')
        assets[asset['id']] = path
    def bounds(segment):
        start, end = segment['startFrame'], segment['endFrame']
        if type(start) is not int or type(end) is not int or not 0 <= start < end <= m['totalFrames']:
            raise ValueError('Invalid segment bounds')
    previous = 0
    for shot in m['shots']:
        bounds(shot)
        if shot['startFrame'] != previous or shot['asset'] not in assets or type(shot['sourceStartFrame']) is not int or shot['sourceStartFrame'] < 0:
            raise ValueError('Shots must be continuous and reference valid sources')
        previous = shot['endFrame']
    if previous != m['totalFrames']:
        raise ValueError('Shots must cover the entire delivery')
    previous_by_track = {}
    for cue in m['captions']:
        bounds(cue)
        track = cue.get('track','Editable captions')
        if not isinstance(track,str) or not track or len(track)>80 or '\0' in track:
            raise ValueError('Invalid caption track')
        if cue['startFrame'] < previous_by_track.get(track,0) or not isinstance(cue['text'], str) or not cue['text']:
            raise ValueError('Overlapping or empty captions')
        previous_by_track[track] = cue['endFrame']
        if 'style' in cue:
            style=cue['style']
            if not isinstance(style,dict):
                raise ValueError('Invalid caption style')
            for key in ('size','transformX','transformY','maxLineWidth','opacity','scale'):
                if not isinstance(style.get(key),(int,float)) or not math.isfinite(style[key]):
                    raise ValueError('Invalid caption style')
            if not 0<style['size']<=20 or not 0<style['maxLineWidth']<=1 or not 0<=style['opacity']<=1 or not .1<=style['scale']<=4 or max(abs(style['transformX']),abs(style['transformY']))>8:
                raise ValueError('Caption style outside supported range')
            if not isinstance(style.get('color'),str) or len(style['color'])!=7 or not style['color'].startswith('#'):
                raise ValueError('Invalid caption color')
            try: int(style['color'][1:],16)
            except ValueError: raise ValueError('Invalid caption color')
    for audio in m['audio']:
        bounds(audio)
        if audio['asset'] not in assets or type(audio['sourceStartFrame']) is not int or audio['sourceStartFrame'] < 0 or not math.isfinite(audio['volume']) or not 0 <= audio['volume'] <= 2:
            raise ValueError('Invalid audio source or volume')
    style = m['textStyle']
    for key in ('size', 'transformX', 'transformY', 'maxLineWidth'):
        if not isinstance(style[key], (int, float)) or not math.isfinite(style[key]):
            raise ValueError('Invalid text style')
    if not 0 < style['size'] <= 20 or not 0 < style['maxLineWidth'] <= 1 or max(abs(style['transformX']), abs(style['transformY'])) > 1:
        raise ValueError('Text outside supported range')
    return m, assets


def mac_preflight(root, donor=None):
    if sys.platform != 'darwin':
        raise ValueError('Mac installation must run on the recipient Mac, not the server')
    root = Path(root).resolve(strict=True)
    if subprocess.run(['pgrep', '-fi', 'JianyingPro'], capture_output=True).returncode == 0:
        raise ValueError('请先用 Cmd+Q 完全退出剪映，然后再次点击发送。不会强制关闭应用。')
    device = mac_platform(root, donor)
    original = (root / 'root_meta_info.json').read_bytes()
    registry = json.loads(original)
    if not isinstance(registry.get('all_draft_store'), list):
        raise ValueError('Unrecognized Mac registry; no changes made')
    return device, original, registry


def build(bundle, draft_root, name, platform='windows', donor=None):
    if not name or name in ('.', '..') or any(c in name for c in '/\\:\0'):
        raise ValueError('Use a simple new draft name without path separators')
    m, assets = validate(bundle)
    root = Path(draft_root).resolve(strict=True)
    target = root / name
    if target.exists() or target.is_symlink():
        raise FileExistsError('Draft already exists; choose a new name. Nothing overwritten.')
    registry = None
    registry_original = None
    device = None
    if platform == 'mac':
        device, registry_original, registry = mac_preflight(root, donor)
        if any(e.get('draft_name') == name for e in registry['all_draft_store']):
            raise ValueError('Name already registered; choose a new name')
    import pyJianYingDraft as draft
    script = draft.DraftFolder(str(root)).create_draft(name, m['width'], m['height'], fps=m['fps'], allow_replace=False)
    resources = target / 'Resources'
    resources.mkdir()
    local = {}
    for index, (asset_id, original) in enumerate(assets.items()):
        local[asset_id] = resources / f'{index:02d}-{original.name}'
        shutil.copy2(original, local[asset_id])
    # Convert endpoints independently: contiguous frames remain contiguous microseconds.
    us = lambda frame: (frame * 1000000 + m['fps'] // 2) // m['fps']
    rng = lambda start, end: draft.Timerange(us(start), us(end) - us(start))
    script.append_track(draft.TrackSpec(draft.TrackType.video, name='Chart shots'))
    for shot in m['shots']:
        material = draft.VideoMaterial(str(local[shot['asset']]))
        length = shot['endFrame'] - shot['startFrame']
        source = shot['sourceStartFrame']
        if us(source + length) > material.duration + 1000:
            raise ValueError('Video source is shorter than the declared range')
        script.add_segment(draft.VideoSegment(material, rng(shot['startFrame'],shot['endFrame']), source_timerange=rng(source,source+length), volume=0), 'Chart shots')
    text_tracks = list(dict.fromkeys(c.get('track','Editable captions') for c in m['captions']))
    for name_of_track in text_tracks:
        script.append_track(draft.TrackSpec(draft.TrackType.text, name=name_of_track))
    for cue in m['captions']:
        style = cue.get('style',m['textStyle'])
        color=style.get('color')
        rgb=tuple(int(color[i:i+2],16)/255 for i in (1,3,5)) if color else (.56,.20,.25)
        script.add_segment(draft.TextSegment(cue['text'], rng(cue['startFrame'],cue['endFrame']),
            style=draft.TextStyle(size=style['size'],color=rgb,align=1 if color else 0,auto_wrapping=True,max_line_width=style['maxLineWidth']),
            clip_settings=draft.ClipSettings(transform_x=style['transformX'],transform_y=style['transformY'],alpha=style.get('opacity',1),scale_x=style.get('scale',1),scale_y=style.get('scale',1))),cue.get('track','Editable captions'))
    for index, audio in enumerate(m['audio']):
        track = f'Audio {index + 1}'
        script.append_track(draft.TrackSpec(draft.TrackType.audio, name=track))
        material = draft.AudioMaterial(str(local[audio['asset']]))
        source = audio['sourceStartFrame']
        length = audio['endFrame'] - audio['startFrame']
        if us(source+length) > material.duration + 1000:
            raise ValueError('Audio shorter than declared range')
        script.add_segment(draft.AudioSegment(material,rng(audio['startFrame'],audio['endFrame']),source_timerange=rng(source,source+length),volume=audio['volume']),track)
    script.save()
    content = read_json(target / 'draft_content.json')
    meta = read_json(target / 'draft_meta_info.json')
    now = time.time_ns() // 1000
    meta.update(draft_name=name,draft_id=content['id'],draft_fold_path=str(target),draft_root_path=str(root),tm_duration=us(m['totalFrames']),tm_draft_create=now,tm_draft_modified=now)
    if (Path(bundle) / 'cover.png').is_file():
        from PIL import Image
        with Image.open(Path(bundle) / 'cover.png') as cover:
            cover.convert('RGB').save(target / 'draft_cover.jpg', quality=90)
        meta['draft_cover'] = str(target / 'draft_cover.jpg')
    if platform == 'mac':
        for key in ('platform','last_modified_platform'):
            content[key] = {**content.get(key,{}), **device}
        records = []
        for kind in ('videos','audios'):
            for material in content['materials'].get(kind,[]):
                records.append({'id':str(uuid.uuid4()),'type':0,'file_Path':material['path'],'duration':material['duration'], 'extra_info':Path(material['path']).name,'metetype':'video' if kind=='videos' else 'music','width':material.get('width',0),'height':material.get('height',0),'create_time':now//1000000,'import_time':now//1000000,'import_time_ms':now,'item_source':1,'md5':'','roughcut_time_range':{'start':-1,'duration':-1},'sub_time_range':{'start':-1,'duration':-1}})
        for group in meta['draft_materials']:
            if group['type'] == 0:
                group['value'] = records
        meta['draft_timeline_materials_size_'] = sum(p.stat().st_size for p in local.values())
        meta.pop('draft_is_ai_translate', None)
        write_json(target / 'draft_info.json',content)
    write_json(target / 'draft_content.json',content)
    write_json(target / 'draft_meta_info.json',meta)
    for kind in ('videos','audios'):
        for material in content['materials'].get(kind,[]):
            path = Path(material['path']).resolve()
            if not path.is_relative_to(target) or not path.is_file():
                raise ValueError('Draft media references are not self-contained')
    if registry is not None:
        entry = mac_registry_entry(meta, target, sum(p.stat().st_size for p in local.values()))
        register_mac(root, registry, registry_original, entry)
    write_json(target / 'datamagic-validation.json',{'structureValidated':True,'desktopOpened':False,'platform':platform,'shots':len(m['shots']),'captions':len(m['captions']),'audioTracks':len(m['audio']),'durationUs':us(m['totalFrames'])})
    return target


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bundle',default=str(Path(__file__).resolve().parent))
    parser.add_argument('--check-only',action='store_true')
    parser.add_argument('--draft-root')
    parser.add_argument('--name',default='DataMagic-Ranking')
    parser.add_argument('--platform',choices=('auto','windows','mac'),default='auto')
    parser.add_argument('--donor',help='Explicit local plaintext Mac draft directory; never uploaded')
    args = parser.parse_args()
    if args.check_only:
        validate(args.bundle)
        print('Package paths, checksums and timeline valid; desktop compatibility not tested.')
        return
    platform = ('mac' if sys.platform == 'darwin' else 'windows') if args.platform == 'auto' else args.platform
    if platform == 'mac' and not args.draft_root:
        args.draft_root = str(mac_draft_root())
    if not args.draft_root:
        parser.error('--draft-root is required; use Jianying Settings to find your local draft folder')
    result = build(args.bundle,args.draft_root,args.name,platform,args.donor)
    print(f'Draft generated: {result}\nOpen it in Jianying to verify playback, editable captions and shot cuts. Desktop validation is still required.')


if __name__ == '__main__':
    try:
        main()
    except (ValueError,KeyError,OSError,ImportError) as error:
        print(f'Not completed: {error}',file=sys.stderr)
        sys.exit(1)
