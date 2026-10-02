import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import os
import hashlib
import subprocess

spec = importlib.util.spec_from_file_location('draft_tool',Path(__file__).parents[1] / 'scripts/jianying_draft.py')
tool=importlib.util.module_from_spec(spec)
spec.loader.exec_module(tool)


class GuardTests(unittest.TestCase):
    def fixture(self, folder):
        path=Path(folder)
        (path/'plate.mp4').write_bytes(b'fixture')
        import hashlib
        manifest={'version':1,'width':1920,'height':1080,'fps':30,'totalFrames':300,
          'assets':[{'id':'plate','path':'plate.mp4','sha256':hashlib.sha256(b'fixture').hexdigest()}],
          'shots':[{'startFrame':0,'endFrame':300,'sourceStartFrame':0,'asset':'plate'}],
          'captions':[{'startFrame':0,'endFrame':300,'text':'Hello'}],'audio':[],
          'textStyle':{'size':2.8,'transformX':-.63,'transformY':.02,'maxLineWidth':.28}}
        (path/'manifest.json').write_text(json.dumps(manifest))
        return manifest

    def test_valid_manifest(self):
        with tempfile.TemporaryDirectory() as folder:
            self.fixture(folder)
            self.assertEqual(tool.validate(folder)[0]['totalFrames'],300)

    def test_refuse_traversal_checksum_overlap_and_nonfinite(self):
        for kind in ['traversal','checksum','overlap','nonfinite']:
            with self.subTest(kind=kind),tempfile.TemporaryDirectory() as folder:
                m=self.fixture(folder)
                if kind=='traversal':m['assets'][0]['path']='../plate.mp4'
                if kind=='checksum':m['assets'][0]['sha256']='wrong'
                if kind=='overlap':m['captions'].append({'startFrame':20,'endFrame':40,'text':'Overlap'})
                if kind=='nonfinite':m['textStyle']['size']=float('nan')
                (Path(folder)/'manifest.json').write_text(json.dumps(m))
                with self.assertRaises(ValueError):tool.validate(folder)

    def test_no_overwrite_or_escaped_name(self):
        with tempfile.TemporaryDirectory() as folder:
            self.fixture(folder)
            (Path(folder)/'existing').mkdir()
            with self.assertRaises(FileExistsError):tool.build(folder,folder,'existing')
            with self.assertRaises(ValueError):tool.build(folder,folder,'../escaped')

    def test_overlapping_text_allowed_only_on_distinct_tracks(self):
        with tempfile.TemporaryDirectory() as folder:
            m=self.fixture(folder)
            m['captions'][0]['track']='first'
            m['captions'].append({'track':'second','startFrame':20,'endFrame':40,'text':'Overlap','style':{'size':3.6,'color':'#b03f51','opacity':.9,'scale':1.2,'transformX':0,'transformY':-.4,'maxLineWidth':.9}})
            tool.write_json(Path(folder)/'manifest.json',m)
            tool.validate(folder)
            m['captions'][1]['track']='first'
            tool.write_json(Path(folder)/'manifest.json',m)
            with self.assertRaises(ValueError):tool.validate(folder)

    def test_mac_cannot_be_installed_from_linux_server(self):
        if tool.sys.platform=='darwin':self.skipTest('Linux-only guard')
        with tempfile.TemporaryDirectory() as folder:
            self.fixture(folder)
            with self.assertRaises(ValueError):tool.build(folder,folder,'mac-test','mac')
            self.assertFalse((Path(folder)/'mac-test').exists())


class MacAdapterTests(unittest.TestCase):
    def test_scan_skips_encrypted_and_nonmac_drafts(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            for name, data in [('01-encrypted', b'\xffencrypted'), ('02-windows', b'{"platform":{"os":"windows","device_id":"test"}}')]:
                (root/name).mkdir(); (root/name/'draft_info.json').write_bytes(data)
            (root/'03-local').mkdir()
            tool.write_json(root/'03-local/draft_info.json', {'platform': {'os':'mac','device_id':'synthetic-test-only','app_version':'test','unneeded':'ignored'}})
            device = tool.mac_platform(root)
            self.assertEqual(device, {'os':'mac','device_id':'synthetic-test-only','app_version':'test'})
            with self.assertRaises(ValueError): tool.mac_platform(root, root/'01-encrypted')

    def test_missing_donor_is_read_only_and_skips_symlinks(self):
        with tempfile.TemporaryDirectory() as folder, tempfile.TemporaryDirectory() as external:
            root = Path(folder)
            tool.write_json(Path(external)/'draft_info.json', {'platform':{'os':'mac','device_id':'synthetic'}})
            (root/'outside').symlink_to(external, target_is_directory=True)
            before = sorted(root.iterdir())
            with self.assertRaises(ValueError): tool.mac_platform(root)
            self.assertEqual(sorted(root.iterdir()), before)

    def test_registry_adds_new_entry_and_preserves_old_drafts(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            existing = {'draft_name':'Original','custom':'keep'}
            registry = {'all_draft_store':[existing], 'other':'keep'}
            path = root/'root_meta_info.json'; tool.write_json(path, registry)
            original = path.read_bytes()
            meta = {'draft_name':'New','draft_id':'test-id','draft_fold_path':str(root/'New'),'draft_root_path':str(root),'tm_duration':10000000,'tm_draft_create':1,'tm_draft_modified':1}
            entry = tool.mac_registry_entry(meta, root/'New', 123)
            self.assertTrue(entry['draft_json_file'].endswith('draft_info.json'))
            self.assertNotIn('platform', entry)
            tool.register_mac(root, registry, original, entry)
            after = tool.read_json(path)
            self.assertEqual(after['all_draft_store'][1], existing)
            self.assertEqual(after['other'], 'keep')
            backups = list(root.glob('root_meta_info.datamagic-*.bak'))
            self.assertEqual(backups[0].read_bytes(), original)

    def test_registry_change_is_not_overwritten(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder); path = root/'root_meta_info.json'
            registry = {'all_draft_store':[]}; tool.write_json(path, registry)
            original = path.read_bytes()
            tool.write_json(path, {'all_draft_store':[{'draft_name':'Added elsewhere'}]})
            changed = path.read_bytes()
            with self.assertRaises(ValueError): tool.register_mac(root, registry, original, {})
            self.assertEqual(path.read_bytes(), changed)


@unittest.skipUnless(os.environ.get('DATAMAGIC_DELIVERY_BUNDLE'), 'Set DATAMAGIC_DELIVERY_BUNDLE to test actual rendered media')
class IntegrationTests(unittest.TestCase):
    def test_plate_only_removes_caption_region_not_chart(self):
        from PIL import Image,ImageChops
        bundle=Path(os.environ['DATAMAGIC_DELIVERY_BUNDLE'])
        plate=Image.open(bundle/'cover.png').convert('RGB')
        reference=Image.open(bundle/'reference-with-captions.png').convert('RGB')
        bbox=ImageChops.difference(plate,reference).getbbox()
        self.assertIsNotNone(bbox)
        self.assertGreaterEqual(bbox[0],70)
        self.assertGreaterEqual(bbox[1],400)
        self.assertLessEqual(bbox[2],650)
        self.assertLessEqual(bbox[3],570)

    def test_rendered_package_produces_editable_text_and_continuous_shots(self):
        bundle=Path(os.environ['DATAMAGIC_DELIVERY_BUNDLE'])
        with tempfile.TemporaryDirectory() as folder:
            target=tool.build(bundle,folder,'rendered-check')
            content=tool.read_json(target/'draft_content.json')
            self.assertEqual(content['duration'],10000000)
            tracks=content['tracks']
            self.assertEqual([t['type'] for t in tracks],['video','text'])
            self.assertEqual(len(tracks[0]['segments']),6)
            self.assertEqual(len(tracks[1]['segments']),6)
            ranges=[s['target_timerange'] for s in tracks[0]['segments']]
            self.assertEqual(ranges[0]['start'],0)
            for a,b in zip(ranges,ranges[1:]):self.assertEqual(a['start']+a['duration'],b['start'])
            for video in content['materials']['videos']:
                self.assertTrue(Path(video['path']).is_file())
                self.assertTrue(Path(video['path']).is_relative_to(target))
            self.assertFalse(tool.read_json(target/'datamagic-validation.json')['desktopOpened'])
            with self.assertRaises(FileExistsError):tool.build(bundle,folder,'rendered-check')

    def test_overlapping_audio_gets_independent_editable_tracks(self):
        original=Path(os.environ['DATAMAGIC_DELIVERY_BUNDLE'])
        with tempfile.TemporaryDirectory() as folder:
            bundle=Path(folder)/'bundle'
            tool.shutil.copytree(original,bundle)
            audio=bundle/'media/test-tone.wav'
            subprocess.run(['ffmpeg','-v','error','-f','lavfi','-i','sine=frequency=440:duration=2',str(audio)],check=True)
            m=tool.read_json(bundle/'manifest.json')
            m['assets'].append({'id':'tone','path':'media/test-tone.wav','sha256':hashlib.sha256(audio.read_bytes()).hexdigest()})
            m['audio']=[{'asset':'tone','startFrame':0,'endFrame':60,'sourceStartFrame':0,'volume':.5},{'asset':'tone','startFrame':30,'endFrame':90,'sourceStartFrame':0,'volume':.3}]
            tool.write_json(bundle/'manifest.json',m)
            root=Path(folder)/'drafts';root.mkdir()
            target=tool.build(bundle,root,'audio-check')
            content=tool.read_json(target/'draft_content.json')
            self.assertEqual([t['type'] for t in content['tracks']],['video','text','audio','audio'])


if __name__=='__main__':unittest.main()
