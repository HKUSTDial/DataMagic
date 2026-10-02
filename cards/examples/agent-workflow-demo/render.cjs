const fs=require('node:fs');const path=require('node:path');
const {bundle}=require('@remotion/bundler');const {getCompositions,renderMedia,renderStill}=require('@remotion/renderer');
(async()=>{
 const version=process.argv[2];if(!['v1','v2'].includes(version))throw Error('Use v1 or v2');
 const props=JSON.parse(fs.readFileSync(path.join(__dirname,version+'.json'),'utf8'));
 fs.mkdirSync(path.join(__dirname,'out'),{recursive:true});
 const fonts={};for(const weight of [400,700])fonts[weight]=fs.readFileSync(path.resolve(__dirname,`../../gallery/fonts/noto-sans-sc-${weight}.woff2`)).toString('base64');
 fs.mkdirSync(path.resolve(__dirname,'../../out'),{recursive:true});fs.writeFileSync(path.resolve(__dirname,'../../out/workflow-fonts.json'),JSON.stringify(fonts));
 const serveUrl=await bundle({entryPoint:path.join(__dirname,'entry.tsx'),publicDir:path.resolve(__dirname,'../../public')});
 const browserExecutable='/home/xieyupeng/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell';
 const id=version==='v1'?'AgentCoffeeV1':'AgentCoffeeV2';
 const composition=(await getCompositions(serveUrl,{inputProps:props,browserExecutable})).find(c=>c.id===id);
 const start=Date.now();
 for(const [tag,frame]of [['opening',30],['middle',180],['final',composition.durationInFrames-1]])await renderStill({serveUrl,composition,inputProps:props,browserExecutable,frame,output:path.join(__dirname,'out',`${version}-${tag}.png`)});
 if(process.argv.includes('--stills'))return;
 await renderMedia({serveUrl,composition,inputProps:props,browserExecutable,codec:'h264',concurrency:4,outputLocation:path.join(__dirname,'out',version+'.mp4')});
 const report={version,id,width:composition.width,height:composition.height,fps:composition.fps,frames:composition.durationInFrames,seconds:(Date.now()-start)/1000};
 fs.writeFileSync(path.join(__dirname,'out',version+'-render.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exitCode=1});
