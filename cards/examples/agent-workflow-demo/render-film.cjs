const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const {bundle}=require('@remotion/bundler');
const {getCompositions,renderStill,renderMedia,openBrowser}=require('@remotion/renderer');
const root=path.resolve(__dirname,'../../..'),assets=path.join(root,'assets/walkthrough-v2');
const browserExecutable='/home/xieyupeng/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';
function sound(name,seconds){const rate=48000,n=Math.round(rate*seconds),b=Buffer.alloc(44+n*2);b.write('RIFF');b.writeUInt32LE(36+n*2,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(n*2,40);let seed=9,prev=0;for(let i=0;i<n;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/2147483648-1,t=i/rate;prev=.82*prev+.18*noise;const v=name==='click'?Math.sin(2*Math.PI*1300*t)*Math.exp(-t*65)*.32:prev*Math.sin(Math.PI*i/n)**2*.65;b.writeInt16LE(Math.round(v*32767),44+i*2)}fs.writeFileSync(path.join(assets,'audio',name+'.wav'),b)}
(async()=>{
 const fonts={};for(const weight of [400,700])fonts[weight]=fs.readFileSync(path.join(root,`cards/gallery/fonts/noto-sans-sc-${weight}.woff2`)).toString('base64');
 fs.mkdirSync(path.join(root,'cards/out'),{recursive:true});fs.writeFileSync(path.join(root,'cards/out/workflow-fonts.json'),JSON.stringify(fonts));
 sound('click',.25);sound('whoosh',.6);
 const stage=path.join(root,'cards/out/workflow-film-public');fs.mkdirSync(path.join(stage,'assets/promo/audio'),{recursive:true});
 fs.cpSync(assets,path.join(stage,'assets/walkthrough-v2'),{recursive:true,filter:p=>!p.endsWith('.mp4')||['gallery.mp4','v1.mp4','v2.mp4'].includes(path.basename(p))});
 fs.copyFileSync(path.join(root,'assets/datamagic_logo.png'),path.join(stage,'assets/datamagic_logo.png'));
 fs.copyFileSync(path.join(root,'assets/promo/audio/music.m4a'),path.join(stage,'assets/promo/audio/music.m4a'));
 const serveUrl=await bundle({entryPoint:path.join(__dirname,'film/Film.tsx'),publicDir:stage});
 const puppeteerInstance=await openBrowser('chrome',{browserExecutable});await new Promise(r=>setTimeout(r,5000));
 const composition=(await getCompositions(serveUrl,{browserExecutable,puppeteerInstance}))[0];const out=path.join(__dirname,'out/film');fs.mkdirSync(out,{recursive:true});
 if(process.argv.includes('--font-check')){
  for(let i=0;i<4;i++)await renderStill({serveUrl,composition,browserExecutable,puppeteerInstance,inputProps:{bgm:false,sound:false},frame:1380+i,output:path.join(out,`font-check-${i}.png`)});
  await renderMedia({serveUrl,composition,browserExecutable,puppeteerInstance,inputProps:{bgm:false,sound:false},muted:true,codec:'h264',concurrency:4,frameRange:[1380,1439],outputLocation:path.join(out,'font-check.mp4')});
  await puppeteerInstance.close({silent:true});console.log('Font preflight completed');return;
 }
 if(process.argv.includes('--stills')){for(const frame of [60,250,470,750,970,1200,1450,1730,1920,2080]){await renderStill({serveUrl,composition,browserExecutable,puppeteerInstance,inputProps:{bgm:false,sound:false},frame,output:path.join(out,frame+'.png')});console.log('still',frame)}await puppeteerInstance.close({silent:true});return}
 if(!process.argv.includes('--audio-only')){await renderMedia({serveUrl,composition,browserExecutable,puppeteerInstance,inputProps:{bgm:false,sound:false},muted:true,codec:'h264',concurrency:4,outputLocation:path.join(out,'picture-master.mp4'),onProgress:p=>{if(p.renderedFrames%300===0)console.log('picture',p.renderedFrames)}})}
 execFileSync(process.execPath,[path.join(__dirname,'mix-film.cjs')],{stdio:'inherit'});
 await puppeteerInstance.close({silent:true});
})().catch(e=>{console.error(e);process.exitCode=1});
