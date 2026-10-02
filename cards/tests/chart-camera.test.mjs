import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {loadTypeScript} from './load-typescript.mjs';
const {calculateChartCamera, chartCameraProfiles} = await loadTypeScript(new URL('../src/camera/chartCamera.ts', import.meta.url));

const sample = JSON.parse(fs.readFileSync(new URL('../templates/chart-focus-push/sample-data.json', import.meta.url)));
const schema = JSON.parse(fs.readFileSync(new URL('../templates/chart-focus-push/schema.json', import.meta.url)));
const componentSource = fs.readFileSync(new URL('../templates/chart-focus-push/ChartFocusPush.tsx', import.meta.url), 'utf8');

const input = {
  fps: 30,
  durationInFrames: 240,
  canvasWidth: 1760,
  canvasHeight: 610,
  focusX: 1410,
  focusY: 128,
};

test('exports all typed chart-camera profiles', () => {
  assert.deepEqual(Object.keys(chartCameraProfiles), [
    'slow_focus_push',
    'overview_pan',
    'parallax_data_glide',
    'timeline_travel',
    'crash_focus',
    'crane_rise_reveal',
    'pull_back_isolation',
  ]);
});

test('slow focus push begins at overview and deterministically settles on focus', () => {
  const start = calculateChartCamera({...input, profile: 'slow_focus_push', frame: 0});
  const middleA = calculateChartCamera({...input, profile: 'slow_focus_push', frame: 130});
  const middleB = calculateChartCamera({...input, profile: 'slow_focus_push', frame: 130});
  const end = calculateChartCamera({...input, profile: 'slow_focus_push', frame: 239});

  assert.deepEqual(start, {scale: 1, x: 0, y: 0, origin: {x: 880, y: 305}});
  assert.deepEqual(middleA, middleB);
  assert.ok(end.scale > 1.13 && end.scale <= 1.141);
  assert.ok(end.x < 0, 'a right-side anomaly should move toward the center');
  assert.ok(end.y > 0, 'an upper anomaly should move toward the center');
});

test('camera calculations clamp frames and focus coordinates', () => {
  const before = calculateChartCamera({...input, profile: 'overview_pan', frame: -50, focusX: -100});
  const after = calculateChartCamera({...input, profile: 'overview_pan', frame: 999, focusX: 9999});
  assert.ok(Number.isFinite(before.x) && Number.isFinite(after.x));
  assert.equal(before.origin.x, input.canvasWidth / 2);
  assert.equal(after.origin.y, input.canvasHeight / 2);
});

test('narrative reveal cameras keep their opening scale inside a readable safe range', () => {
  assert.ok(chartCameraProfiles.crane_rise_reveal.startScale <= 1.4);
  assert.equal(chartCameraProfiles.pull_back_isolation.startScale, 1);
  assert.ok(chartCameraProfiles.pull_back_isolation.endScale >= .9);
});

test('every profile returns finite deterministic transforms', () => {
  for (const profile of Object.keys(chartCameraProfiles)) {
    const first = calculateChartCamera({...input, profile, frame: 160});
    const second = calculateChartCamera({...input, profile, frame: 160});
    assert.deepEqual(first, second);
    assert.ok([first.scale, first.x, first.y, first.origin.x, first.origin.y].every(Number.isFinite));
  }
});

test('sample and schema carry bilingual metadata and aligned chart data', () => {
  assert.equal(schema.title, 'ChartFocusPush / 图表焦点推镜');
  assert.match(sample.metadata.nameZh, /图表/);
  assert.match(sample.metadata.nameEn, /Chart/);
  assert.equal(sample.labels.length, sample.values.length);
  assert.ok(sample.anomalyIndex >= 0 && sample.anomalyIndex < sample.values.length);
  assert.match(sample.source, /synthetic|演示/i);
});

test('native template is frame-driven and keeps a Chinese font fallback', () => {
  assert.match(componentSource, /useCurrentFrame\(\)/);
  assert.match(componentSource, /calculateChartCamera\(/);
  assert.match(componentSource, /Noto Sans SC/);
  assert.doesNotMatch(componentSource, /style=\{\{[^}]*transition\s*:/s);
  assert.doesNotMatch(componentSource, /@keyframes|animationName|animationDuration/);
});
