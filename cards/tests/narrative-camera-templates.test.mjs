import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const json = path => JSON.parse(read(path));

test('crane reveal keeps category/value alignment and an exact focus value', () => {
  const data=json('../templates/crane-rise-dashboard/sample-data.json');
  assert.equal(data.categories.length,data.values.length);
  const index=data.categories.indexOf(data.focusLabel);
  assert.ok(index>=0);
  assert.equal(data.values[index],data.focusValue);
});

test('parallax markers use valid longitude-latitude coordinates', () => {
  const data=json('../templates/parallax-map-glide/sample-data.json');
  assert.ok(data.regions.every(r=>r.coordinate.length===2&&Math.abs(r.coordinate[0])<=180&&Math.abs(r.coordinate[1])<=90));
  assert.match(read('../templates/parallax-map-glide/ParallaxMapGlide.tsx'),/parallax_data_glide/);
  assert.match(read('../templates/parallax-map-glide/ParallaxMapGlide.tsx'),/world-110m/);
});

test('pull-back focus resolves to an existing editable data item', () => {
  const data=json('../templates/pull-back-isolation/sample-data.json');
  assert.ok(data.focusIndex>=0&&data.focusIndex<data.items.length);
  assert.match(read('../templates/pull-back-isolation/PullBackIsolation.tsx'),/pull_back_isolation/);
});

test('all new camera templates are frame driven and avoid CSS animation', () => {
  for(const path of ['../templates/crane-rise-dashboard/CraneRiseDashboard.tsx','../templates/parallax-map-glide/ParallaxMapGlide.tsx','../templates/pull-back-isolation/PullBackIsolation.tsx']){
    const source=read(path); assert.match(source,/useCurrentFrame/); assert.doesNotMatch(source,/animation:/);
  }
});
