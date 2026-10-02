import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {createRaceFrame, validateRaceProps} from '../templates/bar-chart-race/model.js';

const sample = JSON.parse(await readFile(new URL('../templates/bar-chart-race/sample-data.json', import.meta.url)));

test('sample data satisfies the race contract', () => {
  assert.equal(validateRaceProps(sample), sample);
});

test('first and last frames preserve source values', () => {
  const first = createRaceFrame(sample, 0);
  const last = createRaceFrame(sample, 1);
  assert.equal(first.rows.find(row => row.id === 'usa').value, 82);
  assert.equal(last.rows.find(row => row.id === 'china').value, 149);
  assert.equal(first.time, '2018');
  assert.equal(last.time, '2026');
});

test('values and ranks interpolate continuously between snapshots', () => {
  const start = createRaceFrame(sample, 4 / 8);
  const middle = createRaceFrame(sample, 4.5 / 8);
  const end = createRaceFrame(sample, 5 / 8);
  const startChina = start.rows.find(row => row.id === 'china');
  const middleChina = middle.rows.find(row => row.id === 'china');
  const endChina = end.rows.find(row => row.id === 'china');
  assert.ok(startChina.value < middleChina.value);
  assert.ok(middleChina.value < endChina.value);
  assert.ok(middleChina.rank <= Math.max(startChina.rank, endChina.rank));
  assert.ok(middleChina.rank >= Math.min(startChina.rank, endChina.rank));
  assert.equal(new Set(middle.rows.map(row => row.displayRank)).size, sample.entities.length);
  assert.equal(middle.leader.value, Math.max(...middle.rows.map(row => row.value)));
  assert.ok(middle.rows.every(row => row.contentOpacity >= 0 && row.contentOpacity <= 1));
});

test('missing values are treated as zero for entering entities', () => {
  const input = structuredClone(sample);
  delete input.snapshots[0].values.india;
  const first = createRaceFrame(input, 0);
  assert.equal(first.rows.find(row => row.id === 'india').value, 0);
});

test('invalid or unknown data is rejected', () => {
  const input = structuredClone(sample);
  input.snapshots[0].values.unknown = 10;
  assert.throws(() => validateRaceProps(input), /Unknown entity id/);
});

test('optional icons stay attached to their entity across changing ranks', () => {
  const input = structuredClone(sample);
  for (const entity of input.entities) entity.iconSrc = `icons/${entity.id}.svg`;
  input.highlightId = input.entities[1].id;
  for (let step = 0; step <= 50; step++) {
    for (const row of createRaceFrame(input, step / 50).rows) {
      assert.equal(row.iconSrc, `icons/${row.id}.svg`);
      assert.equal(row.color, input.entities.find(entity => entity.id === row.id).color);
    }
  }
});

test('highlighting requires a known entity', () => {
  assert.throws(() => validateRaceProps({...sample, highlightId: 'unknown'}), /highlightId/);
});
