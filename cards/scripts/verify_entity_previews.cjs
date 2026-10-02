const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),gallery=path.join(root,'gallery');
const ffmpeg=process.env.FFMPEG||'ffmpeg',ffprobe=process.env.FFPROBE||'ffprobe';
const audit=JSON.parse(fs.readFileSync(path.join(root,'references/entity-imagery-audit.json')));
const library=JSON.parse(fs.readFileSync(path.join(gallery,'api/library.json')));
const files=[];
for(const slug of audit.changedSlugs){
  const card=library.cards.find(c=>c.slug===slug),file=path.join(gallery,card.preview.mp4);
  const probe=JSON.parse(execFileSync(ffprobe,['-v','error','-show_streams','-show_format','-of','json',file],{encoding:'utf8'}));
  const video=probe.streams.find(s=>s.codec_type==='video');
  const [n,d]=video.avg_frame_rate.split('/').map(Number),fps=n/d,seconds=Number(probe.format.duration);
  assert.equal(Number(video.nb_frames),Math.round(fps*seconds),slug);
  assert(seconds>=3&&seconds<=30,slug);
  const portrait=slug==='PortraitRankedReveal';
  assert.equal(video.width,card.id.startsWith('StyleTemplate-')?1280:portrait?1080:1920,slug);
  assert.equal(video.height,portrait?1920:card.id.startsWith('StyleTemplate-')?720:1080,slug);
  const bytes=fs.statSync(file).size,hash=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0,12);
  assert.equal(card.preview.assetVersion,hash,slug+' cached media identity');
  assert.equal(card.preview.originalBytes,bytes,slug);
  execFileSync(ffmpeg,['-v','error','-i',file,'-map','0:v:0','-f','null','-'],{stdio:'pipe'});
  files.push({slug,width:video.width,height:video.height,frames:Number(video.nb_frames),duration:seconds,bytes,listBytes:card.preview.listBytes,hash});
}
const fontChecks=[];
for(const [slug,crop]of [['BarChartRace',[1000,85,70,105]],['SteppedLineRanking',[900,65,90,68]],['CoffeeRatingHorizontalRanking',[600,70,88,45]]]){
  const card=library.cards.find(c=>c.slug===slug),[w,h,x,y]=crop,size=w*h;
  const pixels=execFileSync(ffmpeg,['-v','error','-ss','2.5','-i',path.join(gallery,card.preview.mp4),'-vf',`crop=${w}:${h}:${x}:${y},format=gray`,'-frames:v','12','-f','rawvideo','-'],{maxBuffer:size*13});
  assert.equal(pixels.length,size*12);
  let maximum=0;
  for(let frame=1;frame<12;frame++){let change=0;for(let i=0;i<size;i++)change+=Math.abs(pixels[frame*size+i]-pixels[(frame-1)*size+i]);maximum=Math.max(maximum,change/size);}
  assert(maximum<.1,`${slug} text fluctuates: ${maximum}`);fontChecks.push({slug,maxPixelDifference:maximum});
}
const report={totalCards:library.cards.length,updatedCards:files.length,files,fontChecks};
fs.writeFileSync(path.join(root,'out/entity-icons-verification.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({updated:files.length,fontChecks,totalOriginalBytes:files.reduce((n,f)=>n+f.bytes,0),totalListBytes:files.reduce((n,f)=>n+f.listBytes,0)}));
