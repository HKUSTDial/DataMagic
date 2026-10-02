#!/usr/bin/env node
// Agent entry: run on the recipient Mac after explicit local-install approval.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const args=process.argv.slice(2);
const option=name=>args.find(a=>a.startsWith(`--${name}=`))?.slice(name.length+3);
const bundle=option('package');
if(!bundle||!fs.existsSync(path.resolve(bundle,'manifest.json'))){console.error('请指定已完成的交付包：--package=/absolute/path/package');process.exit(1);}
const check=args.includes('--check');
if(process.platform!=='darwin'){console.error('发送到剪映须在接收者 Mac 上执行；不能从服务器写入你的 Mac 草稿库。');process.exit(1);}
if(!check&&!args.includes('--yes')){console.error('先向用户确认本机依赖安装与新建草稿，再传 --yes；检查模式使用 --check。');process.exit(1);}
const command=[path.join(root,'scripts/jianying_install.py'),'--bundle',path.resolve(bundle),'--runtime',path.join(root,'out/jianying-runtime'),'--json',check?'--preflight':'--yes'];
for(const key of ['draft-root','donor','label'])if(option(key))command.push(`--${key}`,option(key));
const child=spawn('python3',command,{stdio:'inherit'});child.on('error',()=>{console.error('需要可用 Python 3.10+，请安装后重试。');process.exitCode=1;});child.on('exit',code=>{process.exitCode=code??1;});
