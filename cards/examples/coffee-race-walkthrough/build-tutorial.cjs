const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../..'),out=path.join(root,'assets/walkthrough');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'datamagic-walkthrough-'));
const ffmpeg=process.env.FFMPEG||'ffmpeg';
const font=process.env.PROMO_FONT||'/usr/share/fonts/truetype/droid/DroidSansFallbackFull.ttf';
const run=args=>execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-y',...args],{stdio:'inherit'});
const parts=[['intro.png',5],['gallery-recording.webm',12],['data.png',6],['brief.png',7],['run.png',8],['coffee-race-v1.mp4',12],['revision.png',6],['coffee-race-v2.mp4',14],['check.png',6]];
const clips=[];
for(const [i,[file,seconds]]of parts.entries()){
 const output=path.join(temp,`${i}.mp4`);clips.push(output);
 const isImage=file.endsWith('.png');
 const imageOptions=isImage?['-loop','1','-framerate','30']:[];
 const vf='scale=1280:640:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:0:color=0x142238,setsar=1,fps=30,tpad=stop_mode=clone:stop_duration=12';
 run([...imageOptions,'-i',path.join(out,file),'-t',String(seconds),'-vf',vf,'-an','-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-threads','2',output]);
}
const silent=path.join(temp,'silent.mp4');
run([...clips.flatMap(file=>['-i',file]),'-filter_complex',clips.map((_,i)=>`[${i}:v]`).join('')+`concat=n=${clips.length}:v=1:a=0[v]`,'-map','[v]','-c:v','libx264','-preset','fast','-crf','22','-threads','2','-an',silent]);
const voice=JSON.parse(fs.readFileSync(path.join(out,'audio/voice-manifest.json')));
const filters=voice.segments.map((s,i)=>`[${i}:a]adelay=${Math.round(s.start*1000)}:all=1[a${i}]`);
filters.push(voice.segments.map((_,i)=>`[a${i}]`).join('')+`amix=inputs=${voice.segments.length}:normalize=0,apad,atrim=duration=76[a]`);
run([...voice.segments.flatMap(s=>['-i',path.join(out,'audio',s.file)]),'-filter_complex',filters.join(';'),'-map','[a]','-ar','48000','-ac','2',path.join(temp,'voice.wav')]);
run(['-i',path.join(temp,'voice.wav'),'-stream_loop','-1','-i',path.join(root,'assets/promo/audio/music.m4a'),'-filter_complex','[0:a]asplit[v][sc];[1:a]volume=0.65,atrim=duration=76,afade=t=out:st=74:d=2[bg];[bg][sc]sidechaincompress=threshold=0.018:ratio=5:attack=12:release=300[duck];[v][duck]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-2:LRA=7[a]','-map','[a]','-t','76','-ar','48000',path.join(temp,'mix.wav')]);
const captions=[];
for(const [i,s]of voice.segments.entries()){
 if(s.start+s.renderedSeconds>s.end+.04)throw Error('Speech exceeds scene');
 if(s.loudness.integratedLUFS< -19.5||s.loudness.integratedLUFS> -16.5)throw Error('Speech loudness failed');
 const textFile=path.join(temp,`caption-${i}.txt`);fs.writeFileSync(textFile,s.text);
 captions.push(`drawtext=fontfile='${font}':textfile='${textFile}':fontsize=28:fontcolor=white:x=(w-text_w)/2:y=665:enable='gte(t,${s.start})*lt(t,${s.start+s.renderedSeconds})'`);
}
run(['-i',silent,'-i',path.join(temp,'mix.wav'),'-map','0:v:0','-map','1:a:0','-vf',captions.join(','),'-c:v','libx264','-preset','medium','-crf','22','-threads','2','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-t','76','-movflags','+faststart',path.join(out,'datamagic-first-video-zh.mp4')]);
run(['-ss','1','-i',path.join(out,'datamagic-first-video-zh.mp4'),'-frames:v','1',path.join(out,'cover.jpg')]);
const stamp=t=>new Date(Math.round(t*1000)).toISOString().slice(11,23);
fs.writeFileSync(path.join(out,'narration.zh.vtt'),'WEBVTT\n\n'+voice.segments.map(s=>`${stamp(s.start)} --> ${stamp(s.start+s.renderedSeconds)}\n${s.text}\n`).join('\n'));
console.log('Rendered 76-second tutorial: real gallery recording, evidence pages, full V1/V2 output; narration and embedded captions.');
