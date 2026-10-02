// Rebuild the silent, real-recipe showcase. Requires FFmpeg with drawtext/libx264.
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const ffmpeg = process.env.FFMPEG || 'ffmpeg';
const font = process.env.PROMO_FONT || '/usr/share/fonts/truetype/droid/DroidSansFallbackFull.ttf';
const latinFont = process.env.PROMO_LATIN_FONT || '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
if (!fs.existsSync(font)) throw new Error('Set PROMO_FONT to a Chinese-capable .ttf font.');
if (!fs.existsSync(latinFont)) throw new Error('Set PROMO_LATIN_FONT to a Latin .ttf font.');
const out = path.join(root, 'assets/promo');
const temp = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'datamagic-promo-'));
fs.mkdirSync(out, {recursive:true});
const scenes = [
  ['CharacterPerspectiveBoard', '角色主持，让数据有故事', 'Character-led data stories'],
  ['PresenterDataTakeover', '讲到关键处，让图表成为主角', 'Give the evidence the spotlight'],
  ['BarChartRace', '动态柱状图，呈现排名变化', 'Watch rankings change in motion', 3.5],
  ['FootageEvidenceReveal', '从实景出发，用数据解释', 'From footage to evidence'],
  ['ChartTimelineTravel', '跟随时间，聚焦关键变化', 'Follow the trend, explain the change'],
  ['ParallaxMapGlide', '多层地图滑行，连接数据与空间', 'Explore data through layered maps', 2],
];
const run = args => execFileSync(ffmpeg, ['-hide_banner','-loglevel','error','-y',...args], {stdio:'inherit'});
const brandDir=path.join(temp,'brand');
execFileSync(process.execPath,[path.join(__dirname,'render_promo_brand.cjs'),brandDir],{stdio:'inherit',env:process.env});
const text = (value,size,y,color='white') => `drawtext=fontfile='${/[\u3400-\u9fff]/.test(value)?font:latinFont}':text='${value}':fontsize=${size}:fontcolor=${color}:x=(w-text_w)/2:y=${y}`;
const encode = ['-an','-c:v','libx264','-preset','medium','-crf','24','-pix_fmt','yuv420p','-threads','2'];
for (const lang of ['zh','en']) {
  const parts = [];
  parts.push(path.join(brandDir,`${lang}-intro.mp4`));
  for (const [slug,zh,en,start=1] of scenes) {
    const file=path.join(temp,`${lang}-${slug}.mp4`);
    const input=path.join(root,'cards/gallery/media',`${slug}.mp4`);
    if (!fs.existsSync(input)) throw new Error(`Missing preview: ${input}`);
    // Preserve the whole frame, placing captions outside the original artwork.
    const vf=`scale=1080:608:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:78:color=0x101c2b,setsar=1,fps=30,${text(lang==='zh'?zh:en,30,22)},${text('DataMagic  |  '+slug+'  |  DEMO DATA',16,694,'0xa8bbcf')}`;
    run(['-ss',String(start),'-i',input,'-t','4','-vf',vf,...encode,file]);
    parts.push(file);
  }
  parts.push(path.join(brandDir,`${lang}-outro.mp4`));
  const inputs=parts.flatMap(p=>['-i',p]);
  run([...inputs,'-filter_complex',parts.map((_,i)=>`[${i}:v]`).join('')+`concat=n=${parts.length}:v=1:a=0[v]`,'-map','[v]',...encode,'-movflags','+faststart',path.join(out,`datamagic-showcase-${lang}.mp4`)]);
}
run(['-ss','1.7','-i',path.join(out,'datamagic-showcase-zh.mp4'),'-frames:v','1',path.join(out,'cover.jpg')]);
// Lightweight brand-opening preview for contexts without video support.
run(['-i',path.join(out,'datamagic-showcase-zh.mp4'),'-t','3','-filter_complex','fps=12,scale=640:-2:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer','-loop','0',path.join(out,'preview.gif')]);
console.log(JSON.stringify({output:out,temporarySegments:temp,seconds:30,languages:['zh','en']}));
