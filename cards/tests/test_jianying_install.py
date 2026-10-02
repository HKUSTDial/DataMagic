import importlib.util
import hashlib
import json
import shutil
from pathlib import Path
from types import SimpleNamespace
import tempfile
import unittest
from unittest.mock import patch

spec=importlib.util.spec_from_file_location('installer',Path(__file__).parents[1]/'scripts/jianying_install.py')
installer=importlib.util.module_from_spec(spec)
spec.loader.exec_module(installer)


class InstallerTests(unittest.TestCase):
    def test_recipient_preflight_checks_real_manifest_donor_and_registry_read_only(self):
        with tempfile.TemporaryDirectory() as folder:
            base=Path(folder);bundle=base/'package';bundle.mkdir();root=base/'drafts';root.mkdir();donor=root/'Donor';donor.mkdir()
            shutil.copyfile(Path(__file__).parents[1]/'scripts/jianying_draft.py',bundle/'draft_tool.py')
            (bundle/'requirements.txt').write_text('pyJianYingDraft==0.3.0\n');(bundle/'plate.mp4').write_bytes(b'fixture')
            m={'version':1,'width':1920,'height':1080,'fps':30,'totalFrames':30,'assets':[{'id':'plate','path':'plate.mp4','sha256':hashlib.sha256(b'fixture').hexdigest()}],'shots':[{'startFrame':0,'endFrame':30,'sourceStartFrame':0,'asset':'plate'}],'captions':[],'audio':[],'textStyle':{'size':3,'transformX':0,'transformY':0,'maxLineWidth':.9}}
            (bundle/'manifest.json').write_text(json.dumps(m));(root/'root_meta_info.json').write_text('{"all_draft_store":[]}');(donor/'draft_info.json').write_text('{"platform":{"os":"mac","device_id":"synthetic-test-only"}}')
            original=(root/'root_meta_info.json').read_bytes();before=sorted(root.iterdir())
            with patch.object(installer.sys,'platform','darwin'),patch.object(installer.subprocess,'run',return_value=SimpleNamespace(returncode=1)):
                _,checked=installer.preflight(bundle,root);self.assertEqual(checked,root)
            self.assertEqual(before,sorted(root.iterdir()));self.assertEqual(original,(root/'root_meta_info.json').read_bytes())
            with patch.object(installer.sys,'platform','darwin'),patch.object(installer.subprocess,'run',return_value=SimpleNamespace(returncode=0)):
                with self.assertRaisesRegex(ValueError,'Cmd\\+Q'):installer.preflight(bundle,root)

    def test_confirmation_required_before_any_filesystem_write(self):
        with patch.object(installer,'preflight') as check,patch.object(installer,'prepare_runtime') as prepare:
            with self.assertRaises(ValueError):installer.install('/nonexistent',confirmed=False)
            check.assert_not_called();prepare.assert_not_called()

    def test_server_does_not_install_dependencies_or_touch_mac(self):
        with patch.object(installer.sys,'platform','linux'),patch.object(installer,'prepare_runtime') as prepare:
            with self.assertRaisesRegex(ValueError,'Mac'):installer.preflight('/nonexistent')
            prepare.assert_not_called()

    def test_preflight_failure_precedes_dependency_install(self):
        with tempfile.TemporaryDirectory() as folder,patch.object(installer,'preflight',side_effect=ValueError('缺少可读旧草稿')),patch.object(installer,'prepare_runtime') as prepare:
            with self.assertRaises(ValueError):installer.install(folder,confirmed=True)
            prepare.assert_not_called()

    def test_draft_names_are_unique_and_cannot_escape_library(self):
        first=installer.unique_name('../bad/name:example');second=installer.unique_name('../bad/name:example')
        self.assertNotEqual(first,second)
        self.assertNotIn('/',first);self.assertNotIn(':',first)

    def test_ready_runtime_is_reused_without_pip_or_venv(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);bundle=root/'bundle';bundle.mkdir();runtime=root/'runtime';(runtime/'bin').mkdir(parents=True)
            (bundle/'requirements.txt').write_text('pyJianYingDraft==0.3.0\n');(runtime/'bin/python').write_text('fixture');(runtime/'.datamagic-requirements').write_text('pyJianYingDraft==0.3.0\n')
            with patch.object(installer.subprocess,'run',return_value=SimpleNamespace(returncode=0)) as subprocess_run,patch.object(installer,'run') as run:
                self.assertEqual(installer.prepare_runtime(bundle,runtime,lambda m:None),runtime/'bin/python');run.assert_not_called();self.assertEqual(subprocess_run.call_count,1)

    def test_app_launch_failure_does_not_remove_installed_draft(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);bundle=root/'bundle';bundle.mkdir()
            def build(command,timeout=300):
                name=command[command.index('--name')+1];target=root/name;target.mkdir();(target/'datamagic-validation.json').write_text('{}');(target/'draft_info.json').write_text('{}')
            with patch.object(installer,'preflight',return_value=(None,root)),patch.object(installer,'prepare_runtime',return_value=Path('/fixture/python')),patch.object(installer,'run',side_effect=build),patch.object(installer,'launch_jianying',return_value=False):
                result=installer.install(bundle,confirmed=True);self.assertEqual(result['status'],'installed');self.assertFalse(result['appLaunched']);self.assertFalse(result['desktopValidated']);self.assertTrue(Path(result['draftPath']).is_dir())


if __name__=='__main__':unittest.main()
