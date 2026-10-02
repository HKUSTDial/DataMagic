import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relativePath => fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
const page = read('gallery/index.html');
const app = read('gallery/app.js');
const styles = read('gallery/styles.css');

test('gallery exposes structured bilingual narrative collections', () => {
  const discovery = read('gallery/discovery.js');
  assert.match(page, /id="collections"/);
  for (const id of ['ranking', 'trends', 'maps', 'context', 'presenter', 'hooks', 'evidence']) {
    assert.match(discovery, new RegExp(`id: '${id}'`));
  }
  assert.match(discovery, /主持人讲解/);
  assert.match(discovery, /Map stories/);
  assert.match(discovery, /Trends & change/);
  assert.match(discovery, /Hooks & focus/);
  assert.match(app, /collection\.match\(item\)/);
});

test('selection is capped at three and comparison synchronizes playback', () => {
  assert.match(page, /id="compareDialog"/);
  assert.match(page, /id="compareSelected"/);
  assert.match(app, /state\.selected\.size >= 3/);
  assert.match(app, /slice\(0, 3\)/);
  assert.match(app, /items\.length < 2/);
  assert.match(app, /video\.currentTime = anchor/);
  assert.match(app, /video\.play\(\)\.catch/);
  assert.match(app, /videos\.forEach\(video => video\.pause\(\)\)/);
});

test('motion preview has a seekable normalized timeline', () => {
  assert.match(app, /id="detailTimeline" type="range" min="0" max="1000"/);
  assert.match(app, /video\.currentTime = \(Number\(range\.value\) \/ 1000\) \* video\.duration/);
  assert.match(app, /video\.addEventListener\('timeupdate', sync\)/);
  assert.match(styles, /\.preview-timeline/);
});

test('agent reuse validation remains internal while responsive comparison styles stay published', () => {
  assert.doesNotMatch(page, /href="experiments\.html"/);
  assert.doesNotMatch(page + app, /Agent 复用验证|Agent reuse validation/);
  assert.match(styles, /\.compare-body\.compare-2/);
  assert.match(styles, /@media \(max-width: 760px\)[\s\S]+\.compare-body/);
});
