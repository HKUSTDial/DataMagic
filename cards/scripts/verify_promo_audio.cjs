const fs=require('node:fs');
const path=require('node:path');
const {execFileSync,spawnSync}=require('node:child_process');
const folder=path.resolve(__dirname,'../../assets/promo');
const ffmpeg=process.env.FFMPEG||'ffmpeg';
const ffprobe=process.env.FFPROBE||(ffmpeg.includes('/')?path.join(path.dirname(ffmpeg),'ffprobe'):'ffprobe');
const manifest=JSON.parse(fs.readFileSync(path.join(folder,'audio/voice-manifest.json')));
function measure(file,start,end) {
  const trim=start===undefined?'':`atrim=start=${start}:end=${end},asetpts=PTS-STARTPTS,`;
  const result=spawnSync(ffmpeg,['-hide_banner','-i',file,'-vn','-af',trim+'loudnorm=I=-18:TP=-2:LRA=7:print_format=json','-f','null','-'],{encoding:'utf8'});
  if(result.status!==0) throw Error(result.stderr);
  const raw=JSON.parse(result.stderr.match(/\{[^{}]*"input_i"[^{}]*\}/g).at(-1));
  return {lufs:Number(raw.input_i),truePeak:Number(raw.input_tp)};
}
const report={speech:[],outputs:[],mixedSentences:[]};
for(const s of manifest.segments) {
  const metrics=measure(path.join(folder,'audio',s.file));
  if(!Number.isFinite(metrics.lufs)||metrics.lufs< -19.5||metrics.lufs> -16.5||metrics.truePeak> -1.8)throw Error('Speech level failed: '+s.id+JSON.stringify(metrics));
  report.speech.push({id:s.id,...metrics});
}
for(const suffix of ['zh-voiced','zh-music','en-music']) {
  const file=path.join(folder,`datamagic-showcase-${suffix}.mp4`);
  const probe=JSON.parse(execFileSync(ffprobe,['-v','error','-show_streams','-show_format','-of','json',file]));
  const v=probe.streams.find(s=>s.codec_type==='video'),a=probe.streams.find(s=>s.codec_type==='audio');
  const metrics=measure(file);
  if(!a||a.channels!==2||Number(v.nb_frames)!==900||Math.abs(Number(probe.format.duration)-30)>.05||metrics.truePeak> -1)throw Error('Output failed: '+suffix);
  const target=suffix==='zh-voiced'?-16:-21;
  if(!Number.isFinite(metrics.lufs)||Math.abs(metrics.lufs-target)>1.5)throw Error('Output loudness failed: '+suffix);
  report.outputs.push({version:suffix,duration:Number(probe.format.duration),...metrics});
  if(suffix==='zh-voiced')for(const s of manifest.segments)report.mixedSentences.push({id:s.id,...measure(file,s.start,s.start+s.renderedSeconds)});
}
const spread=rows=>Math.max(...rows.map(r=>r.lufs))-Math.min(...rows.map(r=>r.lufs));
report.speechSpreadLU=Number(spread(report.speech).toFixed(2));
report.mixedSpreadLU=Number(spread(report.mixedSentences).toFixed(2));
if(report.speechSpreadLU>2||report.mixedSpreadLU>3)throw Error('Sentence loudness jump: '+JSON.stringify(report));
fs.writeFileSync(path.join(folder,'audio/qa-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
