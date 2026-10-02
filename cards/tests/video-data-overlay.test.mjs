import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const component = fs.readFileSync(new URL('../templates/video-data-overlay/VideoDataOverlay.tsx', import.meta.url), 'utf8');
const schema = JSON.parse(fs.readFileSync(new URL('../templates/video-data-overlay/schema.json', import.meta.url), 'utf8'));
const negative = JSON.parse(fs.readFileSync(new URL('../templates/video-data-overlay/negative-space-data.json', import.meta.url), 'utf8'));
const tracked = JSON.parse(fs.readFileSync(new URL('../templates/video-data-overlay/tracked-callout-data.json', import.meta.url), 'utf8'));
const root = fs.readFileSync(new URL('../src/Root.tsx', import.meta.url), 'utf8');
const video = new URL('../public/assets/recycling-facility-agnes.mp4', import.meta.url);
const provenance = JSON.parse(fs.readFileSync(new URL('../templates/video-data-overlay/assets/recycling-facility-agnes.json', import.meta.url), 'utf8'));

test('both video-data modes use a real replaceable MP4 and valid editable data', () => {
  assert.deepEqual(schema.properties.layout.enum, ['negative_space', 'tracked_callout']);
  for (const sample of [negative, tracked]) {
    assert.equal(sample.videoSrc, 'assets/recycling-facility-agnes.mp4');
    assert.ok(sample.metrics.length >= 1 && sample.metrics.length <= 4);
    assert.ok(sample.metrics.every(metric => Number.isFinite(metric.value)));
    assert.ok(sample.tracking.keyframes.length >= 2);
    assert.ok(sample.tracking.keyframes.every(point => point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1));
  }
  assert.ok(fs.statSync(video).size > 100_000);
  assert.equal(provenance.provider, 'agnes');
  assert.equal(provenance.model, 'agnes-video-v2.0');
  assert.equal(provenance.output.width, 1920);
  assert.equal(provenance.output.height, 1080);
});

test('video layer, tracking anchors, and the final hold are frame driven', () => {
  assert.match(component, /OffthreadVideo/);
  assert.match(component, /staticFile\(props\.videoSrc\)/);
  assert.match(component, /Freeze frame=\{motionFrame\}/);
  assert.match(component, /durationInFrames - Math\.round\(1\.2 \* fps\)/);
  assert.match(component, /trackingPosition/);
  assert.match(component, /keyframes/);
  assert.doesNotMatch(component, /animation:|transition:/);
});

test('negative-space and tracked-callout compositions are separately registered', () => {
  assert.match(root, /id="ShotCraft-VideoMetricOverlay"/);
  assert.match(root, /id="ShotCraft-TrackedVideoCallout"/);
  assert.match(root, /durationInFrames=\{240\}/);
});
