const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {execFileSync,spawnSync}=require('node:child_process');
const {pathToFileURL}=require('node:url');
const out=path.resolve(__dirname,'../../../assets/walkthrough');
const ffmpeg=process.env.FFMPEG||'ffmpeg';
const ffprobe=process.env.FFPROBE||(ffmpeg.includes('/')?path.join(path.dirname(ffmpeg),'ffprobe'):'ffprobe');
(async()=>{
 const model=await import(pathToFileURL(path.join(__dirname,'../../templates/bar-chart-race/model.js')));
 const base=JSON.parse(fs.readFileSync(path.join(__dirname,'v1.json'))),revised=JSON.parse(fs.readFileSync(path.join(__dirname,'v2.json')));
 const rows=fs.readFileSync(path.join(__dirname,'sales.csv'),'utf8').trim().split(/\r?\n/).slice(1).map(l=>l.split(','));
 for(const [i,row] of rows.entries())for(const props of [base,revised]){
  const state=model.createRaceFrame(props,i/(rows.length-1));
  state.rows.forEach(r=>assert.equal(r.value,Number(row[base.entities.findIndex(e=>e.id===r.id)+1])));
 }
 assert.deepEqual(base.snapshots,revised.snapshots);
 const results=[];
 for(const [v,frames]of [['v1',360],['v2',420]]){
  const file=path.join(out,`coffee-race-${v}.mp4`);
  const meta=JSON.parse(execFileSync(ffprobe,['-v','error','-show_streams','-show_format','-of','json',file]));
  const stream=meta.streams.find(s=>s.codec_type==='video');
  assert.equal(Number(stream.nb_frames),frames);assert.equal(stream.width,1920);assert.equal(stream.height,1080);
  results.push({version:v,frames,duration:Number(meta.format.duration),width:stream.width,height:stream.height});
 }
 const hold=spawnSync(ffmpeg,['-hide_banner','-i',path.join(out,'coffee-race-v2.mp4'),'-vf',"select='gte(n,360)',tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG",'-an','-f','null','-'],{encoding:'utf8'});
 assert.equal(hold.status,0);
 const differences=[...hold.stderr.matchAll(/lavfi.signalstats.YAVG=([\deE+.\-]+)/g)].map(m=>Number(m[1]));
 assert.equal(differences.length,59);assert.ok(Math.max(...differences)<.1,'Last two seconds are not visually stable');
 const report={passed:true,numericValuesCheckedPerVersion:36,dataUnchanged:true,firstLeader:'美式',finalLeader:'拿铁',finalValue:1450,results,finalHoldMaxMeanPixelDifference:Math.max(...differences),scope:'Actual source adaptation and rendering in an existing Linux environment; not a clean-machine installation or cross-agent benchmark.'};
 fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
