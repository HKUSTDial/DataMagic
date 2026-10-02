// Keep the original 1080p master; create a lightweight README playback copy.
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const fs = require('node:fs');
const dir = path.resolve(__dirname, '../../assets/walkthrough-v2');
const input = path.join(dir, 'datamagic-workflow-v2.mp4');
const output = path.join(dir, 'datamagic-workflow-v2-web.mp4');
execFileSync(process.env.FFMPEG_BIN || 'ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y', '-i', input,
  '-map', '0:v:0', '-map', '0:a:0', '-vf', 'scale=1280:720', '-r', '24',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-threads', '4',
  '-c:a', 'aac', '-b:a', '64k', '-movflags', '+faststart', output,
], {stdio: 'inherit'});
console.log({originalBytes: fs.statSync(input).size, webBytes: fs.statSync(output).size});
