#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');
const {timeline,srt} = require('./delivery_timeline.cjs');

async function main() {
  const options = Object.fromEntries(process.argv.slice(2).map(a => {
    if (!/^--(out|props|browser|audio|preview)=.+$/.test(a)) throw new Error(`Unknown option: ${a}`);
    const eq = a.indexOf('=');return [a.slice(2,eq),a.slice(eq+1)];
  }));
  if (!options.out) throw new Error('Usage: npm run export:jianying -- --out=/new/output/folder [--props=/data.json] [--browser=/chrome] [--audio=/narration.wav]');
  if (options.preview && options.preview !== 'true') throw new Error('--preview must be true');
  const root = path.resolve(__dirname,'..');
  const props = JSON.parse(fs.readFileSync(options.props || path.join(root,'templates/ranked-reveal/sample-data.json')));
  const manifest = timeline(props);
  if (options.audio) {
    const audio = path.resolve(options.audio);
    const probe = JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration:stream=codec_type','-of','json',audio],{encoding:'utf8'}));
    if (!probe.streams.some(s=>s.codec_type==='audio')) throw new Error('Audio input has no audio stream');
    const seconds = Number(probe.format.duration);
    if (!Number.isFinite(seconds) || seconds <= 0) throw new Error('Invalid audio duration');
    const name = `media/audio${path.extname(audio) || '.wav'}`;
    manifest.assets.push({id:'narration',path:name,type:'audio'});
    manifest.audio.push({asset:'narration',startFrame:0,endFrame:Math.min(300,Math.floor(seconds*30)),sourceStartFrame:0,volume:1});
    if (!manifest.audio[0].endFrame) throw new Error('Audio too short');
    console.log('Audio is placed at zero and truncated at 10 seconds; captions remain authored, not speech-aligned.');
  }
  const out = path.resolve(options.out);
  // Never reuse or overwrite any prior output package.
  fs.mkdirSync(path.dirname(out),{recursive:true});fs.mkdirSync(out);fs.mkdirSync(path.join(out,'media'));
  const {bundle} = require('@remotion/bundler');
  const {selectComposition,renderMedia,renderStill} = require('@remotion/renderer');
  const serveUrl = await bundle({entryPoint:path.join(root,'src/index.ts')});
  const inputProps = {...props,plate:true};
  const common = {serveUrl,inputProps,browserExecutable:options.browser};
  const composition = await selectComposition({...common,id:'ShotCraft-RankedReveal'});
  console.log('Rendering clean chart plate…');
  const rendered=path.join(out,'media/plate-render.mp4');
  await renderMedia({...common,composition,codec:'h264',muted:true,outputLocation:rendered,concurrency:2});
  // Explicitly strip even an encoder-added silent audio track; subtitles/audio are separate.
  execFileSync('ffmpeg',['-v','error','-i',rendered,'-map','0:v:0','-c:v','copy','-an','-movflags','+faststart',path.join(out,'media/plate.mp4')]);
  fs.unlinkSync(rendered);
  await renderStill({...common,composition,frame:240,output:path.join(out,'cover.png')});
  const referenceProps={...props,plate:false};
  const referenceComposition=await selectComposition({...common,inputProps:referenceProps,id:'ShotCraft-RankedReveal'});
  await renderStill({...common,composition:referenceComposition,inputProps:referenceProps,frame:240,output:path.join(out,'reference-with-captions.png')});
  if(options.preview === 'true') {
    console.log('Rendering the actual edited video with captions…');
    await renderMedia({...common,composition:referenceComposition,inputProps:referenceProps,codec:'h264',muted:true,outputLocation:path.join(out,'preview.mp4'),concurrency:2});
  }
  if(options.audio) fs.copyFileSync(path.resolve(options.audio),path.join(out,manifest.assets.at(-1).path));
  const plateProbe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','stream=codec_type,width,height,nb_frames,r_frame_rate:format=duration','-of','json',path.join(out,'media/plate.mp4')],{encoding:'utf8'}));
  const video=plateProbe.streams.find(s=>s.codec_type==='video');
  if(!video || video.width!==manifest.width || video.height!==manifest.height || Number(video.nb_frames)!==manifest.totalFrames || video.r_frame_rate!=='30/1' || plateProbe.streams.some(s=>s.codec_type==='audio') || Math.abs(Number(plateProbe.format.duration)-10)>.04) throw new Error('Plate must match the canvas, be silent, and contain exactly 300 frames');
  for(const asset of manifest.assets) {
    const bytes=fs.readFileSync(path.join(out,asset.path));asset.bytes=bytes.length;asset.sha256=crypto.createHash('sha256').update(bytes).digest('hex');
  }
  fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
  fs.writeFileSync(path.join(out,'source-data.json'),JSON.stringify(props,null,2));
  fs.writeFileSync(path.join(out,'captions.srt'),srt(manifest));
  for(const [src,dst] of [['jianying_draft.py','draft_tool.py'],['jianying_install.py','jianying_install.py'],['jianying-requirements.txt','requirements.txt'],['Open-in-Jianying.command','Open-in-Jianying.command']]) fs.copyFileSync(path.join(__dirname,src),path.join(out,dst));
  fs.chmodSync(path.join(out,'Open-in-Jianying.command'),0o755);
  fs.copyFileSync(path.join(root,'docs/jianying-delivery.md'),path.join(out,'README.md'));
  fs.writeFileSync(path.join(out,'READY.json'),JSON.stringify({complete:true,desktopValidated:false,recipe:'RankedReveal',plateProbe},null,2));
  console.log(`Delivery ready: ${out}\nMac: double-click Open-in-Jianying.command, or let the local Agent install it. Actual desktop open/edit/export still needs verification.`);
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
