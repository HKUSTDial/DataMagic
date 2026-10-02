"""Simulate recipient Mac metadata on Linux; NOT a real Mac desktop acceptance test."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
from types import SimpleNamespace
from unittest.mock import patch

source=Path(sys.argv[1]).resolve(strict=True)
spec=importlib.util.spec_from_file_location('draft_tool',source/'draft_tool.py')
tool=importlib.util.module_from_spec(spec);spec.loader.exec_module(tool)
actual_run=subprocess.run
def run(command,*args,**kwargs):
    if command[:1]==['pgrep']:
        return subprocess.CompletedProcess(command,1,b'',b'')
    return actual_run(command,*args,**kwargs)

with tempfile.TemporaryDirectory(prefix='datamagic-mac-structure-') as folder:
    root=Path(folder);donor=root/'Synthetic-Donor';donor.mkdir()
    tool.write_json(donor/'draft_info.json',{'platform':{'os':'mac','device_id':'SYNTHETIC-TEST-NOT-A-REAL-DEVICE','app_version':'test'}})
    original={'all_draft_store':[{'draft_name':'Existing','unchanged':True}]};tool.write_json(root/'root_meta_info.json',original)
    # Override only our OS guard; media probing must still load Linux's real library.
    with patch.object(tool,'sys',SimpleNamespace(platform='darwin')),patch.object(tool.subprocess,'run',side_effect=run):
        target=tool.build(source,root,'DataMagic-Structure-Check','mac')
    content=tool.read_json(target/'draft_info.json');registry=tool.read_json(root/'root_meta_info.json')
    assert registry['all_draft_store'][1]==original['all_draft_store'][0]
    assert registry['all_draft_store'][0]['draft_json_file']==str(target/'draft_info.json')
    assert content['platform']['os']=='mac'
    assert len([t for t in content['tracks'] if t['type']=='text'])==2
    assert len([t for t in content['tracks'] if t['type']=='audio'])==2
    for kind in ('videos','audios'):
        for material in content['materials'][kind]:
            assert Path(material['path']).is_file()
            assert Path(material['path']).is_relative_to(target/'Resources')
    assert list(root.glob('root_meta_info.datamagic-*.bak'))
    assert not tool.read_json(target/'datamagic-validation.json')['desktopOpened']
    print(json.dumps({'macFormatSimulated':True,'metadataRegistration':True,'existingDraftPreserved':True,'mediaSelfContained':True,'textTracks':2,'audioTracks':2,'actualMacDesktopValidated':False}))
