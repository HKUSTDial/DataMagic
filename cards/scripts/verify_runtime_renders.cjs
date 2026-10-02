#!/usr/bin/env node
// Render every runtime card from bundled source, without the product backend.
const fs = require('node:fs');
const path = require('node:path');
const {bundle} = require('@remotion/bundler');
const {getCompositions, renderStill, renderMedia} = require('@remotion/renderer');
const root = path.resolve(__dirname, '..');
const catalog = require('../src/runtime/catalog.json');
const out = path.resolve(process.argv[2] || path.join(root, 'out/runtime-source-check'));
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || undefined;
async function main() {
  fs.mkdirSync(out, {recursive:true});
  const serveUrl = await bundle({entryPoint:path.join(root, 'src/index.ts'), publicDir:path.join(root, 'public')});
  const common = {serveUrl, browserExecutable};
  const compositions = await getCompositions(serveUrl, {browserExecutable});
  const all = new Map(compositions.map(item => [item.id, item]));
  const results = [];
  for (const card of catalog) {
    for (const id of [card.id, card.previewId]) if (!all.has(id)) throw new Error(`Composition missing: ${id}`);
    const composition = all.get(card.previewId);
    const inputProps = JSON.parse(fs.readFileSync(path.join(root, card.sampleData), 'utf8'));
    await renderStill({...common, composition, inputProps, frame:120, output:path.join(out, `${card.slug}.png`)});
    results.push({slug:card.slug, id:card.previewId, frame:120, width:composition.width, height:composition.height});
    console.log(`Still ${results.length}/${catalog.length}: ${card.slug}`);
  }
  for (const slug of ['BasicBarChart', 'DarkSignalTrendline', 'NarrativeContextIllustrated', 'ClosingActionPlan']) {
    const card = catalog.find(item => item.slug === slug);
    const composition = all.get(card.previewId);
    const inputProps = JSON.parse(fs.readFileSync(path.join(root, card.sampleData), 'utf8'));
    for (const frame of [30, 179]) await renderStill({...common, composition, inputProps, frame, output:path.join(out, `${slug}-${frame}.png`)});
    await renderMedia({...common, composition, inputProps, codec:'h264', muted:true, concurrency:2, outputLocation:path.join(out, `${slug}.mp4`)});
    console.log(`Video: ${slug}`);
  }
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify({runtimeCards:results.length, registeredCompositions:compositions.length, stills:results, videos:['BasicBarChart', 'DarkSignalTrendline', 'NarrativeContextIllustrated', 'ClosingActionPlan']}, null, 2));
}
main().catch(error => {console.error(error); process.exitCode = 1;});
