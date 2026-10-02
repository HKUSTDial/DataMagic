import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const component = fs.readFileSync(new URL('../templates/story-sequence-generator/StorySequenceGenerator.tsx', import.meta.url), 'utf8');
const schema = JSON.parse(fs.readFileSync(new URL('../templates/story-sequence-generator/schema.json', import.meta.url), 'utf8'));
const sample = JSON.parse(fs.readFileSync(new URL('../templates/story-sequence-generator/sample-data.json', import.meta.url), 'utf8'));
const root = fs.readFileSync(new URL('../src/Root.tsx', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../gallery/app.js', import.meta.url), 'utf8');
const recipe = fs.readFileSync(new URL('../recipes/StorySequenceGenerator.md', import.meta.url), 'utf8');

test('generic renderer supports six plans and a bounded categorical dataset', () => {
  assert.equal(schema.properties.blueprintId.enum.length, 6);
  assert.equal(schema.properties.items.minItems, 3);
  assert.equal(schema.properties.items.maxItems, 8);
  assert.ok(schema.properties.blueprintId.enum.includes(sample.blueprintId));
  assert.ok(sample.items.length >= 3 && sample.items.length <= 8);
  assert.equal(new Set(sample.items.map(item => item.id)).size, sample.items.length);
  assert.ok(sample.items.every(item => Number.isFinite(item.value)));
  assert.match(app, /presenter_guided_evidence.*countdown_to_winner/);
  assert.match(app, /不支持通用四镜头渲染/);
});

test('native composition is a deterministic four-shot 12-second film with a final hold', () => {
  assert.match(root, /id="ShotCraft-StorySequenceGenerator"/);
  assert.match(root, /durationInFrames=\{360\}/);
  assert.match(component, /const shotStarts = \[0, 90, 180, 270\]/);
  assert.match(component, /durationInFrames - Math\.round\(1\.2 \* fps\)/);
  assert.match(component, /translateX\(/);
  assert.match(component, /scale\(/);
  assert.doesNotMatch(component, /animation:|transition:/);
  assert.match(recipe, /1920×1080/);
  assert.match(recipe, /静止 1\.2 秒/);
});

test('story workbench generates validated render data instead of only an agent brief', () => {
  assert.match(app, /parseStoryRows/);
  assert.match(app, /请输入 3–8 行数据/);
  assert.match(app, /downloadStoryProject/);
  assert.match(app, /ShotCraft-StorySequenceGenerator story\.mp4 --props=story-data\.json/);
  assert.match(app, /生成四镜头项目/);
  assert.match(app, /渲染目标：4 个镜头 · 12 秒 · 1080P/);
  assert.match(app, /尚未渲染视频/);
  assert.match(app, /非本次数据/);
});
