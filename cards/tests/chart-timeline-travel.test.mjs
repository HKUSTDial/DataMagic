import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {cameraStateAtFrame} from '../templates/chart-timeline-travel/motion.mjs';

const readJson = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
const readText = path => fs.readFileSync(new URL(path, import.meta.url), 'utf8');

const sample = readJson('../templates/chart-timeline-travel/sample-data.json');
const schema = readJson('../templates/chart-timeline-travel/schema.json');
const component = readText('../templates/chart-timeline-travel/ChartTimelineTravel.tsx');

const bilingual = value => typeof value?.zh === 'string' && value.zh.length > 0
  && typeof value?.en === 'string' && value.en.length > 0;

test('sample contains five ordered, bilingual, independently editable milestones', () => {
  assert.equal(sample.periods.length, 5);
  assert.ok(['zh', 'en'].includes(sample.locale));
  assert.ok(bilingual(sample.eyebrow));
  assert.ok(bilingual(sample.title));
  assert.ok(bilingual(sample.subtitle));
  assert.ok(bilingual(sample.finalTakeaway));
  assert.ok(bilingual(sample.source));

  const ids = new Set();
  for (const period of sample.periods) {
    assert.match(period.id, /^[a-z0-9-]+$/);
    assert.ok(!ids.has(period.id), `Duplicate period id: ${period.id}`);
    ids.add(period.id);
    assert.ok(bilingual(period.label));
    assert.ok(bilingual(period.note));
    assert.equal(typeof period.value, 'number');
    assert.ok(Number.isFinite(period.value));
    assert.match(period.accent, /^#[0-9A-Fa-f]{6}$/);
  }
});

test('schema requires four or five periods and bilingual text', () => {
  assert.equal(schema.properties.periods.minItems, 4);
  assert.equal(schema.properties.periods.maxItems, 5);
  assert.deepEqual(schema.$defs.localizedText.required, ['zh', 'en']);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.$defs.period.additionalProperties, false);
});

test('camera advances monotonically and settles exactly on the final period', () => {
  const fps = 30;
  const states = Array.from({length: 301}, (_, frame) => cameraStateAtFrame({frame, fps, periodCount: 5}));
  assert.equal(states[0].focusIndex, 0);
  for (let index = 1; index < states.length; index++) {
    assert.ok(states[index].focusIndex >= states[index - 1].focusIndex, `Camera moved backwards at frame ${index}`);
    assert.ok(states[index].activeIndex >= 0 && states[index].activeIndex < 5);
  }
  assert.equal(states.at(-1).focusIndex, 4);
  assert.equal(states.at(-1).activeIndex, 4);
  assert.equal(states.at(-1).settled, true);
});

test('the final camera move brakes as it approaches the last milestone', () => {
  const fps = 30;
  const earlyA = cameraStateAtFrame({frame: 174, fps, periodCount: 5}).focusIndex;
  const earlyB = cameraStateAtFrame({frame: 178, fps, periodCount: 5}).focusIndex;
  const lateA = cameraStateAtFrame({frame: 198, fps, periodCount: 5}).focusIndex;
  const lateB = cameraStateAtFrame({frame: 202, fps, periodCount: 5}).focusIndex;
  assert.ok(earlyB - earlyA > lateB - lateA, 'Final motion should decelerate near the destination');
});

test('component is 1920x1080, frame-driven, and avoids CSS animation APIs', () => {
  assert.match(component, /width:\s*1920/);
  assert.match(component, /height:\s*1080/);
  assert.match(component, /useCurrentFrame\(\)/);
  assert.match(component, /useVideoConfig\(\)/);
  assert.match(component, /cameraStateAtFrame/);
  assert.match(component, /Noto Sans SC/);
  assert.doesNotMatch(component, /\banimation\s*:/);
  assert.doesNotMatch(component, /\btransition\s*:/);
});

