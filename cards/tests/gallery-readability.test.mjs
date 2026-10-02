import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../gallery/styles.css', import.meta.url), 'utf8');
const page = fs.readFileSync(new URL('../gallery/index.html', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../gallery/app.js', import.meta.url), 'utf8');

test('collection navigation uses readable typography and generous hit areas', () => {
  assert.match(css, /\.collections-head strong \{ font-size: 18px;/);
  assert.match(css, /\.collections-head span \{[^}]*font-size: 14px;/);
  assert.match(css, /\.collection-button strong \{ font-size: 15px;/);
  assert.match(css, /\.collection-button small \{[^}]*font-size: 13px;/);
  assert.match(css, /min-height: 92px/);
});

test('story generation is a tool action rather than a hero content card', () => {
  const intro = page.slice(page.indexOf('<section class="intro">'), page.indexOf('<section class="browser">'));
  assert.doesNotMatch(intro, /id="openStories"/);
  assert.match(page, /class="story-tool-open" id="openStories"/);
  assert.doesNotMatch(page + app, /故事编排工作台/);
  assert.match(page + app, /四镜头故事方案/);
  assert.match(app, /网页本身不会生成 MP4/);
  assert.match(app, /按用途选配方/);
});
