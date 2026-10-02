const fs = require('node:fs');
const path = require('node:path');
const {bundle} = require('@remotion/bundler');
const {getCompositions, renderStill, renderMedia, openBrowser} = require('@remotion/renderer');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'out/entity-icons-review');
const localChrome = '/home/xieyupeng/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || (fs.existsSync(localChrome) ? localChrome : undefined);
async function main() {
  const only = process.argv.find(x => x.startsWith('--only='))?.slice(7).split(',');
  const slugs = new Set(only || JSON.parse(fs.readFileSync(path.join(root,'references/entity-imagery-audit.json'),'utf8')).changedSlugs);
  const library = JSON.parse(fs.readFileSync(path.join(root, 'gallery/api/library.json')));
  const cards = library.cards.filter(c => slugs.has(c.slug));
  if (cards.length !== slugs.size) throw Error('Unknown card in icon audit');
  fs.mkdirSync(out, {recursive:true});
  const serveUrl = await bundle({entryPoint:path.join(root, 'src/index.ts'), publicDir:path.join(root, 'public')});
  const common = {serveUrl, browserExecutable, timeoutInMilliseconds:120000};
  const posterBrowser = await openBrowser('chrome', {browserExecutable});
  const compositions = new Map((await getCompositions(serveUrl, {browserExecutable})).map(c => [c.id, c]));
  const results = [];
  const queue = [...cards];
  async function worker() {
    const puppeteerInstance = await openBrowser('chrome', {browserExecutable});
    const workerOptions = {...common, puppeteerInstance};
    try {
    while (queue.length) {
      const card = queue.shift();
      const runtime = card.id.startsWith('StyleTemplate-');
      const composition = compositions.get(runtime ? `RuntimeTemplatePreview-${card.slug}` : card.id);
      if (!composition) throw Error(`Missing ${card.slug}`);
      const inputProps = JSON.parse(fs.readFileSync(path.join(root, card.source.sampleData)));
      const report = {slug:card.slug, frames:composition.durationInFrames, width:composition.width, height:composition.height};
      for (const [name, frame] of [['middle', Math.floor(composition.durationInFrames*.48)], ['final', composition.durationInFrames-24]]) {
        const output = path.join(out, `${card.slug}-${name}.png`);
        await renderStill({...workerOptions, composition, inputProps, frame, output});
        if (name === 'final') {
          // Keep the public poster path stable, including WebP runtime posters.
          const poster = path.join(root, 'gallery', card.preview.poster);
          if (poster.endsWith('.png')) fs.copyFileSync(output, poster);
          else {
            const page = await posterBrowser.newPage({context:()=>null,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:null,onLog:()=>{}});
            const uri = 'data:image/png;base64,' + fs.readFileSync(output).toString('base64');
            const encoded = await page.evaluate(async src => {
              const img = new Image(); img.src = src; await img.decode();
              const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
              canvas.getContext('2d').drawImage(img,0,0);
              return canvas.toDataURL('image/webp',.86).split(',')[1];
            }, uri);
            fs.writeFileSync(poster, Buffer.from(encoded,'base64'));
            await page.close();
          }
        }
      }
      console.log(`Stills: ${card.slug}`);
      if (!process.argv.includes('--stills')) {
        const destination = path.join(root, 'gallery', card.preview.mp4);
        const temporary = path.join(out, `${card.slug}.mp4`);
        await renderMedia({...workerOptions, composition, inputProps, codec:'h264', crf:20, muted:true, concurrency:2, offthreadVideoThreads:2,
          onProgress: p => {if (p.renderedFrames > 0 && p.renderedFrames % 90 === 0) console.log(`${card.slug}: ${p.renderedFrames}/${composition.durationInFrames}`)},
          ffmpegOverride: ({args}) => [...args.slice(0,-1), '-threads', '2', args.at(-1)], outputLocation:temporary});
        fs.renameSync(temporary, destination);
        console.log(`Video: ${card.slug}`);
      }
      results.push(report);
      fs.writeFileSync(path.join(out, 'render-report.json'), JSON.stringify(results,null,2));
    }
    } finally { await puppeteerInstance.close({silent:true}); }
  }
  try { await Promise.all(Array.from({length:3}, worker)); }
  finally { await posterBrowser.close({silent:true}); }
  console.log(`Updated ${results.length} entity previews`);
}
main().catch(e => {console.error(e); process.exitCode=1});
