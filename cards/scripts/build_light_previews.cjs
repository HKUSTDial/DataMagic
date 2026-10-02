const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const gallery = path.join(root, 'gallery');
const index = path.join(gallery, 'api/library.json');
const library = JSON.parse(fs.readFileSync(index, 'utf8'));
const outputDir = path.join(gallery, 'media/lite');
const probe = file => JSON.parse(execFileSync('ffprobe', ['-v','error','-select_streams','v:0','-show_entries','stream=width,height,nb_frames,duration:format=duration','-of','json',file], {encoding:'utf8'}));
fs.mkdirSync(outputDir, {recursive:true});
let originalBytes = 0, listBytes = 0, encoded = 0;
for (const card of library.cards) {
  const input = path.resolve(gallery, card.preview.mp4);
  if (!input.startsWith(gallery + path.sep)) throw new Error('Invalid preview path');
  const size = fs.statSync(input).size;
  const hash = crypto.createHash('sha256').update(fs.readFileSync(input)).digest('hex').slice(0,12);
  card.preview.assetVersion = hash;
  const filename = `${card.slug}-${hash}-960-v1.mp4`;
  const output = path.join(outputDir, filename);
  let selected = input;
  if (size > 500000) {
    if (!fs.existsSync(output)) {
      const temporary = output + '.building.mp4';
      execFileSync('ffmpeg', ['-hide_banner','-loglevel','error','-y','-i',input,'-map','0:v:0','-vf','scale=960:960:force_original_aspect_ratio=decrease:force_divisible_by=2','-c:v','libx264','-preset','medium','-crf','27','-maxrate','850k','-bufsize','1700k','-threads','2','-an','-movflags','+faststart',temporary], {stdio:'inherit'});
      const a = probe(input), b = probe(temporary);
      if (Math.abs(Number(a.format.duration)-Number(b.format.duration)) > .06 || Number(a.streams[0].nb_frames) !== Number(b.streams[0].nb_frames)) throw new Error(`Timeline changed for ${card.slug}`);
      fs.renameSync(temporary, output);
      encoded++;
    }
    if (fs.statSync(output).size < size) selected = output;
  }
  const metadata = probe(selected).streams[0];
  card.preview.listMp4 = path.relative(gallery, selected).split(path.sep).join('/');
  card.preview.originalBytes = size;
  card.preview.listBytes = fs.statSync(selected).size;
  card.preview.listWidth = metadata.width;
  card.preview.listHeight = metadata.height;
  originalBytes += size;
  listBytes += card.preview.listBytes;
  process.stdout.write(`${card.slug}: ${size} -> ${card.preview.listBytes} bytes\n`);
}
fs.writeFileSync(index + '.building', JSON.stringify(library,null,2) + '\n');
fs.renameSync(index + '.building', index);
process.stdout.write(JSON.stringify({cards:library.cards.length,encoded,originalBytes,listBytes,savedPercent:Number((100*(1-listBytes/originalBytes)).toFixed(1))})+'\n');
