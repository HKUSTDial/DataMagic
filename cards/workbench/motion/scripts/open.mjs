#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn,spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
if(!fs.existsSync(path.join(root,'node_modules/@remotion/player'))){console.error('先在 cards 目录运行 npm ci，然后重试。');process.exit(1);}
const generate=spawnSync(process.execPath,[path.join(root,'workbench/motion/scripts/catalog.mjs')],{cwd:root,stdio:'inherit'});if(generate.status)process.exit(generate.status);
const command=[path.join(root,'node_modules/vite/bin/vite.js'),'--config',path.join(root,'workbench/motion/vite.config.mjs')];
const chosen=process.argv.find(a=>a.startsWith('--card='))?.slice(7);
if(chosen&&!JSON.parse(fs.readFileSync(path.join(root,'workbench/motion/src/catalog.json'))).some(c=>c.id===chosen)){console.error('未知卡片标识');process.exit(1);}
if(!process.argv.includes('--no-open'))command.push('--open',chosen?`/?card=${encodeURIComponent(chosen)}`:'/');
const server=spawn(process.execPath,command,{cwd:root,stdio:'inherit'});
process.on('SIGINT',()=>server.kill('SIGINT'));process.on('SIGTERM',()=>server.kill('SIGTERM'));server.on('exit',code=>process.exit(code??1));
