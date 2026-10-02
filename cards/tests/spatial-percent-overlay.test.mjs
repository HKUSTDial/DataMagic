import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const sample = JSON.parse(fs.readFileSync(new URL('../templates/spatial-percent-overlay/sample-data.json', import.meta.url)));
const component = fs.readFileSync(new URL('../templates/spatial-percent-overlay/SpatialPercentOverlay.tsx', import.meta.url), 'utf8');

test('spatial percentage sample keeps data-bearing fields valid', () => {
  assert.ok(sample.value >= 0 && sample.value <= 100);
  assert.match(sample.accentColor, /^#[0-9a-f]{6}$/i);
  assert.match(sample.source, /synthetic|demo|演示/i);
});

test('spatial percentage keeps the liquid circle without a nested rectangular card', () => {
  assert.match(component, /clipPath id="spatial-percent-circle"/);
  assert.match(component, /waveY/);
  assert.match(component, /borderRadius: '50%'/);
  assert.doesNotMatch(component, /left: 58, right: 58, top: 118/);
  assert.doesNotMatch(component, /backgroundColor: 'rgba\(5,17,29,.72\)'/);
  assert.doesNotMatch(component, /connectorProgress|connectorX|anchorX/);
});
