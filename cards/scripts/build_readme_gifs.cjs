// README teasers only: the gallery continues to use bandwidth-efficient MP4.
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const gallery = path.resolve(__dirname, '../gallery');
const slugs = ['CharacterPerspectiveBoard', 'PresenterDataTakeover', 'RankedReveal', 'FootageEvidenceReveal', 'ChartTimelineTravel', 'ChoroplethRankMap'];
const outputDir = path.join(gallery, 'media/readme');
fs.mkdirSync(outputDir, {recursive: true});
let totalBytes = 0;
for (const slug of slugs) {
  if (process.argv[2] && process.argv[2] !== slug) continue;
  const input = path.join(gallery, 'media', `${slug}.mp4`);
  const output = path.join(outputDir, `${slug}.gif`);
  const footage = slug === 'FootageEvidenceReveal';
  const fps = footage ? 6 : 10;
  const width = footage ? 400 : 480;
  const colors = footage ? 48 : 96;
  // Preserve the entire narrative and its timing; reduce resolution, fps and
  // palette instead of dropping the reveal or accelerating the camera.
  execFileSync(process.env.FFMPEG_BIN || 'ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-threads', '2', '-i', input,
    '-filter_complex_threads', '1', '-filter_complex',
    `[0:v]fps=${fps},scale=${width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=${colors}:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle`,
    '-an', '-loop', '0', output,
  ], {stdio: 'inherit'});
  const bytes = fs.statSync(output).size;
  totalBytes += bytes;
  process.stdout.write(`${slug}: ${(bytes / 1024).toFixed(0)} KiB\n`);
}
process.stdout.write(`Total: ${(totalBytes / 1024 / 1024).toFixed(2)} MiB\n`);
