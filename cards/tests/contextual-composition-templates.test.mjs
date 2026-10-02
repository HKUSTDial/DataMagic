import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {comparisonMotionAtFrame} from '../templates/split-context-comparison/motion.mjs';
import {boxesOverlap, dockMotionAtFrame, resolveDockRegion} from '../templates/negative-space-chart-dock/layout.mjs';

const readText = path => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const readJson = path => JSON.parse(readText(path));

const comparison = readJson('../templates/split-context-comparison/sample-data.json');
const comparisonSchema = readJson('../templates/split-context-comparison/schema.json');
const comparisonSource = readText('../templates/split-context-comparison/SplitContextComparison.tsx');
const dockSample = readJson('../templates/negative-space-chart-dock/sample-data.json');
const dockSchema = readJson('../templates/negative-space-chart-dock/schema.json');
const dockSource = readText('../templates/negative-space-chart-dock/NegativeSpaceChartDock.tsx');

test('split comparison keeps two editable contexts on one data scale', () => {
  assert.equal(comparison.left.unit, comparison.right.unit);
  assert.equal(typeof comparison.left.value, 'number');
  assert.equal(typeof comparison.right.value, 'number');
  assert.notEqual(comparison.left.scene, comparison.right.scene);
  assert.match(comparison.left.accent, /^#[0-9a-f]{6}$/i);
  assert.match(comparison.right.accent, /^#[0-9a-f]{6}$/i);
  assert.equal(comparisonSchema.additionalProperties, false);
  assert.deepEqual(comparisonSchema.$defs.context.properties.scene.enum, ['electric', 'fuel']);
});

test('comparison choreography is deterministic and preserves a static ending', () => {
  const at = frame => comparisonMotionAtFrame({frame, fps: 30});
  assert.deepEqual(at(0), at(0));
  assert.equal(at(0).split, 0);
  assert.equal(at(197).settled, false);
  assert.equal(at(198).settled, true);
  assert.deepEqual(at(198), at(239));
});

test('sample chart dock is inside 64px safe area and never covers the focal subject', () => {
  const region = resolveDockRegion({focalBox: dockSample.focalBox, safeRegion: dockSample.safeRegion});
  assert.ok(region.x >= 64 && region.y >= 64);
  assert.ok(region.x + region.width <= 1920 - 64);
  assert.ok(region.y + region.height <= 1080 - 64);
  assert.equal(boxesOverlap(region, dockSample.focalBox, 36), false);
  assert.equal(region.relocated, false);
});

test('dock resolver relocates a colliding recommendation and rejects impossible layouts', () => {
  const focalBox = {x: 1210, y: 235, width: 520, height: 610};
  const relocated = resolveDockRegion({focalBox, safeRegion: {x: 1100, y: 180, width: 650, height: 700}});
  assert.equal(relocated.relocated, true);
  assert.equal(boxesOverlap(relocated, focalBox, 36), false);
  assert.throws(() => resolveDockRegion({
    focalBox: {x: 200, y: 150, width: 1520, height: 780},
    safeRegion: {x: 300, y: 200, width: 600, height: 500},
  }), /No non-overlapping chart dock/);
});

test('negative-space motion settles for at least the final second', () => {
  const at = frame => dockMotionAtFrame({frame, fps: 30});
  assert.equal(at(194).settled, false);
  assert.equal(at(195).settled, true);
  assert.deepEqual(at(195), at(239));
});

test('both templates are 1920x1080, frame-driven, Chinese-safe and CSS-animation free', () => {
  for (const source of [comparisonSource, dockSource]) {
    assert.match(source, /width:1920/);
    assert.match(source, /height:1080/);
    assert.match(source, /useCurrentFrame\(\)/);
    assert.match(source, /useVideoConfig\(\)/);
    assert.match(source, /Noto Sans SC/);
    assert.doesNotMatch(source, /\banimation\s*:/);
    assert.doesNotMatch(source, /\btransition\s*:/);
  }
  assert.match(comparisonSource, /程序化电动汽车充电场景/);
  assert.match(comparisonSource, /程序化燃油汽车加油场景/);
  assert.match(dockSource, /resolveDockRegion/);
  assert.deepEqual(dockSchema.required.includes('focalBox'), true);
  assert.deepEqual(dockSchema.required.includes('safeRegion'), true);
});
