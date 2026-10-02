// Original procedural score + action cues, then mix the local narration.
// No sampled music or third-party SFX. Seeded synthesis, 120 BPM, 48 kHz stereo.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const out = path.join(root, 'assets/promo');
const audioDir = path.join(out, 'audio');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'datamagic-score-'));
const ffmpeg = process.env.FFMPEG || 'ffmpeg';
const sampleRate = 48000, duration = 30, frames = sampleRate * duration;
fs.mkdirSync(audioDir, {recursive:true});
const music = new Float32Array(frames * 2), sfx = new Float32Array(frames * 2);
const tau = 2 * Math.PI;
let seed = 20261001;
const noise = () => {seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2147483648 - 1;};
const hz = midi => 440 * 2 ** ((midi - 69) / 12);
function add(buffer, start, length, fn, pan=0) {
  const begin = Math.round(start * sampleRate), n = Math.round(length * sampleRate);
  const left = Math.sqrt((1-pan)/2), right = Math.sqrt((1+pan)/2);
  for (let i=0;i<n && begin+i<frames;i++) {
    if (begin+i<0) continue;
    const x=fn(i/sampleRate,i,n);
    buffer[(begin+i)*2] += x*left;
    buffer[(begin+i)*2+1] += x*right;
  }
}
function note(start,midi,length,gain,pan=0) {
  const f=hz(midi);
  add(music,start,length,(t)=>gain*(1-Math.exp(-t*120))*Math.exp(-t*2.8)*(Math.sin(tau*f*t)+.23*Math.sin(tau*2*f*t)+.06*Math.sin(tau*3*f*t)),pan);
}
const chords=[[50,57,61,66],[47,54,57,62],[43,50,57,59],[45,52,57,61]];
for(let bar=0;bar<8;bar++) {
  const start=bar===0?0:3+(bar-1)*4;
  const chord=chords[bar%4];
  for(const [i,midi] of chord.entries()) {
    const f=hz(midi);
    add(music,start,4.8,t=>.025*Math.min(1,t/.45)*Math.min(1,(4.8-t)/1.2)*(Math.sin(tau*f*t)+.2*Math.sin(tau*f*2.002*t)),(i-1.5)*.35);
  }
  for(let step=0;step<8;step++) note(start+step*.5,chord[[0,2,1,3,2,1,3,2][step]]+12,1.8,.038,step%2?.35:-.35);
}
// Soft pulse supports the four-second scene changes; no hard trailer impacts.
for(let t=3;t<27;t+=.5) {
  add(music,t,.18,x=>.022*Math.sin(tau*(65*x+1.8*(1-Math.exp(-x*45))))*Math.exp(-x*28));
  if(Math.round(t*2)%2) add(music,t,.08,x=>.007*noise()*Math.exp(-x*65),.2);
}
const cues=[3,7,11,15,19,23,27];
// Ascending signature follows the four growing data columns in the logo.
for(const [at,midi] of [[.08,62],[.18,66],[.28,69],[.38,74]]) {
  const f=hz(midi);
  add(sfx,at,1.1,t=>.036*(1-Math.exp(-t*200))*Math.exp(-t*5)*Math.sin(tau*f*t),-.15);
}
add(sfx,1.05,1.25,t=>.033*(1-Math.exp(-t*100))*Math.exp(-t*4)*(Math.sin(tau*hz(86)*t)+.3*Math.sin(tau*hz(90)*t)),.25);
for(const at of cues) {
  let filtered=0;
  add(sfx,at-.22,.48,(t)=>{filtered=.80*filtered+.20*noise();return .12*filtered*Math.sin(Math.PI*t/.48)**2;});
  add(sfx,at,.32,t=>.055*Math.sin(tau*110*t)*Math.exp(-t*18));
}
// Three quiet bell accents follow the ranking reveals; closing chord resolves.
for(const [at,midi] of [[11.55,74],[12.75,78],[14.0,81],[27.15,74]]) {
  const f=hz(midi);
  add(sfx,at,.75,t=>.04*(1-Math.exp(-t*250))*Math.exp(-t*7)*Math.sin(tau*f*t),.1);
}
function wav(file,buffer) {
  const bytes=Buffer.alloc(44+frames*4);
  bytes.write('RIFF'); bytes.writeUInt32LE(bytes.length-8,4); bytes.write('WAVEfmt ',8);
  bytes.writeUInt32LE(16,16); bytes.writeUInt16LE(1,20);bytes.writeUInt16LE(2,22);
  bytes.writeUInt32LE(sampleRate,24);bytes.writeUInt32LE(sampleRate*4,28);bytes.writeUInt16LE(4,32);bytes.writeUInt16LE(16,34);bytes.write('data',36);bytes.writeUInt32LE(frames*4,40);
  for(let i=0;i<buffer.length;i++) {
    const t=Math.floor(i/2)/sampleRate;
    const fade=Math.min(1,t/.3,(duration-t)/1.25);
    const value=buffer[i]*Math.max(0,fade);
    if(Math.abs(value)>1)throw Error('Synthesis clipped');
    bytes.writeInt16LE(Math.round(value*32767),44+i*2);
  }
  fs.writeFileSync(file,bytes);
}
const run=args=>execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-y',...args],{stdio:'inherit'});
for(const [name,buffer,lufs] of [['music',music,-26],['sfx',sfx,-29]]) {
  const source=path.join(temp,name+'.wav');wav(source,buffer);
  run(['-i',source,'-af',`loudnorm=I=${lufs}:TP=-3:LRA=7`,'-ar','48000','-c:a','aac','-b:a','192k',path.join(audioDir,name+'.m4a')]);
}
const spec=JSON.parse(fs.readFileSync(path.join(audioDir,'voice-manifest.json'),'utf8'));
const timeline=JSON.parse(fs.readFileSync(path.join(out,'narration.json'),'utf8'));
for (const segment of spec.segments) {
  const cue=timeline.segments.find(s=>s.id===segment.id);
  if (!cue || cue.text!==segment.text) throw Error('Regenerate narration after text edits');
  Object.assign(segment,{start:cue.start,end:cue.end});
  if(segment.start+segment.renderedSeconds>segment.end+.04) throw Error('Narration exceeds slot: '+segment.id);
}
fs.writeFileSync(path.join(audioDir,'voice-manifest.json'),JSON.stringify(spec,null,2)+'\n');
const voiceInputs=spec.segments.flatMap(s=>['-i',path.join(audioDir,s.file)]);
const filters=spec.segments.map((s,i)=>`[${i}:a]adelay=${Math.round(s.start*1000)}:all=1[v${i}]`);
filters.push(spec.segments.map((_,i)=>`[v${i}]`).join('')+`amix=inputs=${spec.segments.length}:normalize=0,apad,atrim=duration=30[v]`);
run([...voiceInputs,'-filter_complex',filters.join(';'),'-map','[v]','-ar','48000','-ac','2',path.join(temp,'voice.wav')]);
run(['-i',path.join(audioDir,'music.m4a'),'-i',path.join(audioDir,'sfx.m4a'),'-filter_complex','[0:a][1:a]amix=inputs=2:normalize=0,loudnorm=I=-21:TP=-2:LRA=7[a]','-map','[a]','-ar','48000',path.join(temp,'music-mix.wav')]);
run(['-i',path.join(audioDir,'music.m4a'),'-i',path.join(audioDir,'sfx.m4a'),'-i',path.join(temp,'voice.wav'),'-filter_complex','[2:a]asplit[v][sc];[0:a][sc]sidechaincompress=threshold=0.018:ratio=5:attack=12:release=300[bed];[bed][1:a][v]amix=inputs=3:normalize=0,loudnorm=I=-16:TP=-2:LRA=7[a]','-map','[a]','-ar','48000',path.join(temp,'voiced-mix.wav')]);
const captionFont=process.env.PROMO_FONT || '/usr/share/fonts/truetype/droid/DroidSansFallbackFull.ttf';
if(!fs.existsSync(captionFont)) throw Error('Set PROMO_FONT to a Chinese-capable font');
const captionFilters=['drawbox=x=0:y=686:w=iw:h=34:color=0x101c2b:t=fill'];
for(const [i,s] of spec.segments.entries()) {
  const textFile=path.join(temp,`caption-${i}.txt`);
  fs.writeFileSync(textFile,s.text);
  const end=Math.min(s.end,s.start+s.renderedSeconds);
  captionFilters.push(`drawtext=fontfile='${captionFont}':textfile='${textFile}':fontsize=26:fontcolor=white:x=(w-text_w)/2:y=689:enable='gte(t,${s.start})*lt(t,${end})'`);
}
for(const [lang,mix,suffix] of [['zh','voiced','voiced'],['zh','music','music'],['en','music','music']]) {
  const videoOptions=mix==='voiced'?['-vf',captionFilters.join(','),'-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p','-threads','2']:['-c:v','copy'];
  run(['-i',path.join(out,`datamagic-showcase-${lang}.mp4`),'-i',path.join(temp,`${mix}-mix.wav`),'-map','0:v:0','-map','1:a:0',...videoOptions,'-c:a','aac','-b:a','160k','-t','30','-movflags','+faststart',path.join(out,`datamagic-showcase-${lang}-${suffix}.mp4`)]);
}
const timestamp=t=>new Date(Math.round(t*1000)).toISOString().slice(11,23);
fs.writeFileSync(path.join(out,'narration.zh.vtt'),'WEBVTT\n\n'+spec.segments.map(s=>`${timestamp(s.start)} --> ${timestamp(Math.min(s.end,s.start+s.renderedSeconds))}\n${s.text}\n`).join('\n'));
fs.writeFileSync(path.join(audioDir,'score-manifest.json'),JSON.stringify({duration,sampleRate,bpm:120,seed:20261001,cues,source:'Procedural original synthesis in cards/scripts/score_promo.cjs',mixes:{voiced:'-16 LUFS target; music ducks under voice',music:'-21 LUFS target'},outputs:['zh-voiced','zh-music','en-music']},null,2)+'\n');
console.log(JSON.stringify({outputs:out,temporaryStems:temp}));
execFileSync(process.execPath,[path.join(__dirname,'verify_promo_audio.cjs')],{stdio:'inherit',env:process.env});
