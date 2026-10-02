import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const bump = read('../templates/bump-chart-story/sample-data.json');
const lens = read('../templates/data-magnifier-lens/sample-data.json');
const source = read('../templates/source-to-insight/sample-data.json');

test('bump chart keeps one value per period and stable identities', () => {
  assert.ok(bump.periods.length >= 3);
  assert.equal(new Set(bump.series.map(item => item.name)).size, bump.series.length);
  for (const item of bump.series) assert.equal(item.values.length, bump.periods.length);
});

test('magnifier labels and values stay aligned', () => {
  assert.equal(lens.labels.length, lens.values.length);
  assert.ok(lens.values.every(Number.isFinite));
  assert.match(lens.source, /synthetic|demo|演示/i);
});

test('source-to-insight sample retains valid traceable rows', () => {
  assert.ok(source.rows.length >= 3);
  assert.equal(new Set(source.rows.map(row => row.label)).size, source.rows.length);
  assert.ok(source.rows.every(row => Number.isFinite(row.value)));
  assert.equal(source.rows[0].value + source.rows[1].value, 1742);
});
