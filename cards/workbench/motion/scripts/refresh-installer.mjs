// Repackage already-verified media with the current recipient tools; never overwrite an export.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const source=process.argv[2];if(!/^[a-f0-9-]{36}$/.test(source||''))throw new Error('Pass a completed Jianying export ID');
const original=path.join(root,'out/motion',source);const ready=JSON.parse(fs.readFileSync(path.join(original,'READY.json')));if(!ready.package)throw new Error('A complete Jianying package is required');
const id=randomUUID(),out=path.join(root,'out/motion',id);fs.mkdirSync(out);const pkg=path.join(out,'package');fs.cpSync(path.join(original,'package'),pkg,{recursive:true,filter:file=>!path.basename(file).startsWith('.')&&path.basename(file)!=='__pycache__'});
for(const file of ['film.mp4','project.json'])fs.copyFileSync(path.join(original,file),path.join(out,file));
for(const [from,to] of [['jianying_draft.py','draft_tool.py'],['jianying_install.py','jianying_install.py'],['jianying-requirements.txt','requirements.txt'],['Open-in-Jianying.command','Open-in-Jianying.command']])fs.copyFileSync(path.join(root,'scripts',from),path.join(pkg,to));
fs.chmodSync(path.join(pkg,'Open-in-Jianying.command'),0o755);
execFileSync('python3',[path.join(pkg,'draft_tool.py'),'--bundle',pkg,'--check-only'],{stdio:'inherit'});
execFileSync('python3',['-m','zipfile','-c',path.join(out,'delivery.zip'),pkg]);
fs.writeFileSync(path.join(out,'READY.json'),JSON.stringify({...ready,id,video:`/exports/${id}/film.mp4`,project:`/exports/${id}/project.json`,package:`/exports/${id}/delivery.zip`,mediaFromExport:source,installerRefreshed:true},null,2));console.log(JSON.stringify({id,source,installerRefreshed:true}));
