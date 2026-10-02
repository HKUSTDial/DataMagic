const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {execFileSync,spawnSync}=require('node:child_process');
const folder=path.resolve(__dirname,'../../../assets/walkthrough');
const ffmpeg=process.env.FFMPEG||'ffmpeg';
const probe=process.env.FFPROBE||(ffmpeg.includes('/')?path.join(path.dirname(ffmpeg),'ffprobe'):'ffprobe');
const video=path.join(folder,'datamagic-first-video-zh.mp4');
const info=JSON.parse(execFileSync(probe,['-v','error','-show_streams','-show_format','-of','json',video]));
const v=info.streams.find(s=>s.codec_type==='video'),a=info.streams.find(s=>s.codec_type==='audio');
assert.equal(Number(v.nb_frames),2280);assert.equal(v.width,1280);assert.equal(v.height,720);assert.equal(a.channels,2);assert.ok(Math.abs(Number(info.format.duration)-76)<.05);
function measure(file,start,end){
 const trim=start===undefined?'':`atrim=start=${start}:end=${end},asetpts=PTS-STARTPTS,`;
 const r=spawnSync(ffmpeg,['-hide_banner','-i',file,'-vn','-af',trim+'loudnorm=I=-16:TP=-2:LRA=7:print_format=json','-f','null','-'],{encoding:'utf8'});
 assert.equal(r.status,0);
 const m=JSON.parse(r.stderr.match(/\{[^{}]*"input_i"[^{}]*\}/g).at(-1));
 return {lufs:Number(m.input_i),truePeak:Number(m.input_tp)};
}
const total=measure(video);assert.ok(Math.abs(total.lufs+16)<1.5);assert.ok(total.truePeak<=-1);
const spec=JSON.parse(fs.readFileSync(path.join(folder,'audio/voice-manifest.json')));
const segments=[];
const starts=[0,5,17,23,30,38,50,56,70],ends=[5,17,23,30,38,50,56,70,76];
for(const [i,s] of spec.segments.entries()){
 assert.ok(s.start>=starts[i]&&s.start+s.renderedSeconds<=ends[i]);
 const voice=measure(path.join(folder,'audio',s.file));
 assert.ok(voice.lufs>=-19.5&&voice.lufs<=-16.5);assert.ok(voice.truePeak<=-1.8);
 segments.push({id:s.id,voice,mixed:measure(video,s.start,s.start+s.renderedSeconds)});
}
const mixedSpread=Math.max(...segments.map(s=>s.mixed.lufs))-Math.min(...segments.map(s=>s.mixed.lufs));
assert.ok(mixedSpread<3,'Mixed sentence levels jump');
const report={passed:true,duration:76,frames:2280,width:1280,height:720,bytes:fs.statSync(video).size,total,mixedSpread:Number(mixedSpread.toFixed(2)),segments};
fs.writeFileSync(path.join(folder,'qa-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
