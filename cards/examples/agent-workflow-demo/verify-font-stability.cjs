const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../..'),preflight=process.argv.includes('--preflight');
const video=preflight?path.join(__dirname,'out/film/font-check.mp4'):path.join(root,'assets/walkthrough-v2/datamagic-workflow-v2.mp4');
const ff='/home/xieyupeng/miniconda3/envs/autodv/bin/ffmpeg';
function measure(file,seconds,crop){const [w,h,x,y]=crop,n=w*h;const b=execFileSync(ff,['-hide_banner','-loglevel','error','-ss',String(seconds),'-i',file,'-vf',`crop=${w}:${h}:${x}:${y},format=gray`,'-frames:v','12','-f','rawvideo','-'],{maxBuffer:n*13});assert.equal(b.length,n*12);const differences=[];for(let f=1;f<12;f++){let total=0;for(let i=0;i<n;i++)total+=Math.abs(b[f*n+i]-b[(f-1)*n+i]);differences.push(total/n)}return {max:Math.max(...differences),mean:differences.reduce((a,b)=>a+b,0)/11}}
const regions=[['completedText',[1100,55,530,350]],['sidebar',[290,330,140,260]],['panelTitle',[300,55,150,160]]];
const report={video,regions:regions.map(([name,crop])=>({name,...measure(video,preflight?0:46,crop)}))};
if(!preflight)for(const seconds of [22,32,46,69])report.regions.push({name:`sceneHeadingAt${seconds}s`,...measure(video,seconds,[1000,75,88,40])});
for(const r of report.regions)assert(r.max<.1,`${r.name} changed: ${r.max}`);
const old=path.join(__dirname,'out/font-fix-before/datamagic-workflow-v2.mp4');if(fs.existsSync(old))report.before=measure(old,46,regions[0][1]);
fs.writeFileSync(path.join(__dirname,preflight?'font-preflight.json':'font-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
