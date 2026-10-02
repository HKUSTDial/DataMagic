// Frame-driven logo animation. Original asset remains unchanged.
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {spawnSync}=require('node:child_process');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root=path.resolve(__dirname,'../..');
const out=process.argv[2] || path.join(root,'cards/out/promo-brand');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'datamagic-brand-'));
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
 try {
 const page=await browser.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
 await page.setContent('<html><body style="margin:0"><canvas width="1280" height="720"></canvas></body></html>');
 const logo='data:image/png;base64,'+fs.readFileSync(path.join(root,'assets/datamagic_logo.png')).toString('base64');
 await page.evaluate(async src=>{
   const img=new Image();img.src=src;await img.decode();
   const c=document.querySelector('canvas'),ctx=c.getContext('2d');
   const clamp=x=>Math.max(0,Math.min(1,x));
   const ease=x=>1-(1-clamp(x))**3;
   window.paint=(f,lang,mode)=>{
     const t=f/30, intro=mode==='intro';
     ctx.fillStyle='#ffffff';ctx.fillRect(0,0,1280,720);
     // Fine data-grid fragments retreat while the brand resolves.
     ctx.save();ctx.globalAlpha=.055*(1-ease((t-.9)/.9));ctx.strokeStyle='#7545c4';ctx.lineWidth=1;
     for(let x=0;x<1280;x+=64){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,720);ctx.stroke();}
     for(let y=0;y<720;y+=64){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1280,y);ctx.stroke();}ctx.restore();
     const scale=intro?1.08-.08*ease(t/1.4):.94+.06*ease(t/.75);
     ctx.save();ctx.translate(640,320);ctx.scale(scale,scale);ctx.translate(-640,-320);
     const x=140,y=intro?185:135,w=1000,h=img.height/img.width*w;
     // Animate independent vertical data columns using clips of the actual logo.
     const boundaries=[0,185,333,480,680];
     for(let i=0;i<4;i++){
       const amount=intro?ease((t-.08-i*.10)/.65):ease(t/.5);
       const left=x+boundaries[i]/img.width*w,right=x+boundaries[i+1]/img.width*w;
       ctx.save();ctx.beginPath();ctx.rect(left,y+h*(1-amount),right-left,h*amount);ctx.clip();ctx.drawImage(img,x,y,w,h);ctx.restore();
     }
     const word=ease((t-(intro?.52:.12))/.70);
     ctx.save();ctx.beginPath();ctx.rect(x+680/img.width*w,y,(w-680/img.width*w)*word,h);ctx.clip();ctx.drawImage(img,x,y,w,h);ctx.restore();
     ctx.restore();
     // Seeded data particles converge into the growing chart, then disappear.
     if(intro){const p=ease(t/.85);ctx.save();ctx.globalAlpha=(1-p)*.65;
       for(let i=0;i<24;i++){const angle=i*2.39996;const radius=110+(i%5)*33;const tx=270+(i%4)*23,ty=385-(i%4)*28;
         const px=tx+Math.cos(angle)*radius*(1-p),py=ty+Math.sin(angle)*radius*(1-p);
         ctx.fillStyle=i%4===0?'#edbd43':'#7542cf';ctx.beginPath();ctx.arc(px,py,2+i%3,0,Math.PI*2);ctx.fill();}
       ctx.restore();}
     const a=ease((t-(intro?.95:.5))/.4);
     ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.fillStyle='#17243c';
     ctx.font='500 30px sans-serif';
     ctx.fillText(lang==='zh'?(intro?'让数据，讲个好故事。':'选配方，换数据，生成视频。'):(intro?'Turn your data into a story.':'Choose a recipe. Add your data. Create.'),640,(intro?548:490)+10*(1-a));
     ctx.fillStyle='#7650b7';ctx.font='500 16px sans-serif';
     ctx.fillText(intro?'DATA STORIES  /  EDITABLE RECIPES  /  MOTION':'datamagic.chat/cards',640,intro?592:548);
     if(!intro){ctx.fillStyle='#68748a';ctx.fillText('github.com/HKUSTDial/DataMagic',640,582);}
     ctx.restore();
     // A quiet top label and single landing accent keep attention on the logo.
     ctx.globalAlpha=.75*ease(t/.5);ctx.font='500 14px sans-serif';ctx.fillStyle='#6d5c93';ctx.textAlign='center';ctx.fillText('D A T A M A G I C   /   C R E A T E   W I T H   D A T A',640,102);ctx.globalAlpha=1;
     if(intro&&t>2.68){ctx.fillStyle=`rgba(16,28,43,${ease((t-2.68)/.32)})`;ctx.fillRect(0,0,1280,720);}
   };
 },logo);
 for(const lang of ['zh','en']) for(const mode of ['intro','outro']){
   const dir=path.join(temp,lang+'-'+mode);fs.mkdirSync(dir);
   for(let f=0;f<90;f++){
     await page.evaluate(({f,lang,mode})=>window.paint(f,lang,mode),{f,lang,mode});
     await page.screenshot({path:path.join(dir,String(f).padStart(3,'0')+'.png')});
   }
   const result=spawnSync(process.env.FFMPEG||'ffmpeg',['-hide_banner','-loglevel','error','-y','-framerate','30','-i',path.join(dir,'%03d.png'),'-c:v','libx264','-crf','20','-pix_fmt','yuv420p','-threads','2','-an',path.join(out,`${lang}-${mode}.mp4`)],{stdio:'inherit'});
   if(result.status!==0)throw Error('Brand encoding failed');
   console.log(`Rendered ${lang}-${mode}`);
 }
 }finally{await browser.close();}
})();
