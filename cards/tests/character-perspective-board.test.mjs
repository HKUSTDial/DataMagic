import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import {loadTypeScript} from './load-typescript.mjs';
const root = new URL('../', import.meta.url);
const {validateStory, heldMediaFrame} = await loadTypeScript(new URL('templates/character-perspective-board/timing.ts', root));
const load = file => JSON.parse(fs.readFileSync(new URL(`templates/character-perspective-board/${file}`, root)));
const sample = load('sample-data.json');
const alternate = load('alternate-data.json');

test('two independent topics use one template with explicit units and story timing', () => {
  for (const data of [sample, alternate]) {
    validateStory(data.rows, data.maximum, 14, data.conclusionAt, data.tiltDegrees);
    assert.ok(fs.existsSync(new URL(`public/${data.presenter.src}`, root)));
    assert.ok(data.source.includes('合成'));
  }
  assert.equal(sample.unit, '%');
  assert.equal(alternate.unit, '分钟');
  assert.ok(alternate.rows[1].value > alternate.rows[2].value);
  assert.notEqual(sample.title, alternate.title);
});
test('reject crowded stories, unsafe perspective, overflowing scales and rushed conclusions', () => {
  const check = (rows = sample.rows, max = sample.maximum, end = sample.conclusionAt, tilt = -7) => validateStory(rows, max, 14, end, tilt);
  assert.throws(() => check(sample.rows, 10));
  assert.throws(() => check(sample.rows, 40, 8));
  assert.throws(() => check(sample.rows, 40, 13));
  assert.throws(() => check(sample.rows, 40, 10.4, 20));
  assert.throws(() => check(sample.rows, 40, 10.4, NaN));
  assert.throws(() => check(sample.rows.map((row, i) => ({...row, at: i ? row.at : 1}))));
});
test('short video holds its last frame rather than looping', () => {
  assert.equal(heldMediaFrame(30, 30, 2), 30);
  assert.equal(heldMediaFrame(419, 30, 2), 59);
  assert.throws(() => heldMediaFrame(30, 30, NaN));
  assert.throws(() => heldMediaFrame(30, 30, 0));
});
test('source uses shared-scale editable bars, stable perspective and no CSS animations', () => {
  const src = fs.readFileSync(new URL('templates/character-perspective-board/CharacterPerspectiveBoard.tsx', root), 'utf8');
  assert.match(src, /row.value \/ props.maximum/);
  assert.match(src, /rotateY\(\$\{props.tiltDegrees\}/);
  assert.match(src, /OffthreadVideo muted/);
  assert.doesNotMatch(src, /animation:|transition:|Math\.sin/);
  const recipe = fs.readFileSync(new URL('recipes/CharacterPerspectiveBoard.md', root), 'utf8');
  assert.match(recipe, /无声/);
  assert.match(recipe, /不与当前文案口型同步/);
  const english = fs.readFileSync(new URL('recipes/en/CharacterPerspectiveBoard.md', root), 'utf8');
  assert.match(english, /silent preview/);
  assert.match(english, /not aligned/);
});
