const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const {bundle}=require('@remotion/bundler');
const {getCompositions,renderStill,renderMedia}=require('@remotion/renderer');
const root=path.resolve(__dirname,'../../..');
const out=path.join(root,'assets/walkthrough');
async function main(){
 fs.mkdirSync(out,{recursive:true});
 const started=Date.now();
 const log=[];
 const record=text=>{const line=`[+${((Date.now()-started)/1000).toFixed(1)}s] ${text}`;log.push(line);console.log(line);fs.writeFileSync(path.join(__dirname,'render.log'),log.join('\n')+'\n');};
 const dataLog=execFileSync(process.execPath,[path.join(__dirname,'build-props.cjs')],{encoding:'utf8'}).trim();record(dataLog);
 const url=await bundle({entryPoint:path.join(__dirname,'entry.tsx'),publicDir:path.join(root,'cards/public')});record('Bundled actual BarChartRace source and custom props.');
 const browserExecutable=process.env.REMOTION_BROWSER_EXECUTABLE||undefined;
 const comps=await getCompositions(url,{browserExecutable});
 const results=[];
 for(const [version,id]of [['v1','CoffeeRaceV1'],['v2','CoffeeRaceV2']]){
  const composition=comps.find(c=>c.id===id);const start=Date.now();
  record(`Rendering ${id}: ${composition.width}×${composition.height}, ${composition.durationInFrames} frames.`);
  await renderMedia({serveUrl:url,browserExecutable,composition,codec:'h264',concurrency:2,outputLocation:path.join(out,`coffee-race-${version}.mp4`)});
  for(const frame of [30,180,composition.durationInFrames-1])await renderStill({serveUrl:url,browserExecutable,composition,frame,output:path.join(out,`${version}-${frame}.png`)});
  record(`Completed ${id} in ${((Date.now()-start)/1000).toFixed(1)}s, including 3 review frames.`);
  results.push({id,version,width:composition.width,height:composition.height,frames:composition.durationInFrames,fps:composition.fps,renderSeconds:(Date.now()-start)/1000});
 }
 record('Both renders completed; output metadata and final hold still require verification.');
 fs.writeFileSync(path.join(__dirname,'render-report.json'),JSON.stringify({node:process.version,elapsedSeconds:(Date.now()-started)/1000,results},null,2)+'\n');
}
main().catch(e=>{console.error(e);process.exitCode=1});
