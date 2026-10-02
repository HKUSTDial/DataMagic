// Audio fallback compiler: uses the same narration manifest and film/timeline.ts as Remotion.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),{execFileSync}=require('node:child_process');
const {transformSync}=Module.createRequire(require.resolve('@remotion/bundler'))('esbuild');
const root=path.resolve(__dirname,'../../..'),dir=path.join(root,'assets/walkthrough-v2');
const m=new Module(__filename);m._compile(transformSync(fs.readFileSync(path.join(__dirname,'film/timeline.ts'),'utf8'),{loader:'ts',format:'cjs'}).code,__filename);const {SFX,TOTAL,FPS}=m.exports;
const voices=JSON.parse(fs.readFileSync(path.join(dir,'audio/voice-manifest.json'))).segments;
const picture=path.join(__dirname,'out/film/picture-master.mp4'),ffmpeg='/home/xieyupeng/miniconda3/envs/autodv/bin/ffmpeg';
for(const bgm of [true,false]){
 const args=['-hide_banner','-loglevel','error','-y','-i',picture],filters=[],labels=[];let i=1;
 const add=(file,delay,volume,duration,loop=false)=>{if(loop)args.push('-stream_loop','-1');args.push('-i',path.join(dir,'audio',file));const tag='a'+i;filters.push(`[${i}:a]aresample=48000,atrim=duration=${duration},asetpts=PTS-STARTPTS,volume=${volume}${loop?',afade=t=in:st=0:d=1,afade=t=out:st=70.5:d=1.5':''},adelay=${Math.round(delay*1000)}:all=1[${tag}]`);labels.push(`[${tag}]`);i++};
 for(const s of voices)add(s.file,s.start,1,s.renderedSeconds);
 for(const s of SFX)add(s.src,s.from/FPS,s.volume,s.duration/FPS);
 if(bgm)add('music.wav',0,.075,TOTAL/FPS,true);
 filters.push(`${labels.join('')}amix=inputs=${labels.length}:normalize=0:dropout_transition=0,apad,atrim=duration=${TOTAL/FPS}[mixed]`);
 const output=path.join(dir,bgm?'datamagic-workflow-v2.mp4':'datamagic-workflow-v2-no-bgm.mp4');
 args.push('-filter_complex',filters.join(';'),'-map','0:v:0','-map','[mixed]','-c:v','copy','-c:a','aac','-b:a','192k','-movflags','+faststart',output);execFileSync(ffmpeg,args);console.log(output);
}
