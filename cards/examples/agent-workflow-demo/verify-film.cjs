const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{execFileSync,spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../..'),dir=path.join(root,'assets/walkthrough-v2'),bin='/home/xieyupeng/miniconda3/envs/autodv/bin/';
const voice=JSON.parse(fs.readFileSync(path.join(dir,'audio/voice-manifest.json')));
const report={voiceLUFS:voice.segments.map(s=>s.loudness.integratedLUFS),files:[]};
assert(Math.max(...report.voiceLUFS)-Math.min(...report.voiceLUFS)<1.5);
for(const s of voice.segments){assert(s.start+s.renderedSeconds<72);assert(s.loudness.truePeakDBTP<=-1.8)}
for(const file of ['datamagic-workflow-v2.mp4','datamagic-workflow-v2-no-bgm.mp4']){
 const p=path.join(dir,file),meta=JSON.parse(execFileSync(bin+'ffprobe',['-v','quiet','-show_streams','-show_format','-of','json',p],{encoding:'utf8'}));
 const v=meta.streams.find(s=>s.codec_type==='video');assert.equal(v.width,1920);assert.equal(v.height,1080);assert.equal(Number(v.nb_frames),2160);assert(Math.abs(Number(meta.format.duration)-72)<.1);assert(meta.streams.some(s=>s.codec_type==='audio'));
 const measured=spawnSync(bin+'ffmpeg',['-hide_banner','-i',p,'-af','loudnorm=I=-18:TP=-1:LRA=11:print_format=json','-f','null','-'],{encoding:'utf8'});assert.equal(measured.status,0);const loud=JSON.parse(measured.stderr.match(/\{\s*"input_i"[\s\S]*?\}/)[0]);assert(Number(loud.input_tp)<0);
 report.files.push({file,bytes:fs.statSync(p).size,duration:Number(meta.format.duration),frames:Number(v.nb_frames),integratedLUFS:Number(loud.input_i),truePeakDBTP:Number(loud.input_tp)});
}
fs.writeFileSync(path.join(__dirname,'film-verification.json'),JSON.stringify(report,null,2));console.log(report);
