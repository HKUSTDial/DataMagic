import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
import {createRaceFrame, validateRaceProps} from '../templates/bar-chart-race/model.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const json = file => JSON.parse(read(file));

const variants = [
  {key:'editorial-ledger-race', component:'EditorialLedgerRace.tsx', recipe:'EditorialLedgerRace.md'},
  {key:'cinematic-track-race', component:'CinematicTrackRace.tsx', recipe:'CinematicTrackRace.md'},
];

test('both race stories preserve the shared deterministic ranking contract', () => {
  for (const variant of variants) {
    const sample = json(`templates/${variant.key}/sample-data.json`);
    validateRaceProps(sample);
    assert.ok(sample.entities.some(entity => entity.id === sample.story.focusEntityId));
    const opening = createRaceFrame(sample, 0);
    const ending = createRaceFrame(sample, 1);
    assert.equal(opening.rows.length, sample.entities.length);
    assert.equal(ending.rows.length, sample.entities.length);
    for (const row of ending.rows) assert.equal(row.value, sample.snapshots.at(-1).values[row.id]);
  }
});

test('the editorial and cinematic variants have different motion grammars and stable endings', () => {
  const editorial = read('templates/editorial-ledger-race/EditorialLedgerRace.tsx');
  const cinematic = read('templates/cinematic-track-race/CinematicTrackRace.tsx');
  assert.match(editorial, /push\s*=\s*interpolate/);
  assert.match(editorial, /EDITORIAL RACE/);
  assert.match(cinematic, /crashCenter/);
  assert.match(cinematic, /CINEMATIC RACE/);
  for (const source of [editorial, cinematic]) {
    assert.match(source, /motionFrame\s*=\s*Math\.min/);
    assert.match(source, /1\.55 \* fps/);
    assert.doesNotMatch(source, /animation\s*:/);
  }
});

test('both variants publish story schema, 1080p recipe contract, and editable source', () => {
  for (const variant of variants) {
    const schema = json(`templates/${variant.key}/schema.json`);
    assert.ok(schema.required.includes('story'));
    assert.deepEqual(schema.properties.story.required, ['hook','turningPoint','takeaway','focusEntityId']);
    const recipe = read(`recipes/${variant.recipe}`);
    assert.match(recipe, /1920x1080/);
    assert.match(recipe, /静止至少 1\.5 秒/);
    assert.match(read(`recipes/en/${variant.recipe}`), /final static hold at least 1\.5 seconds/);
  }
});
