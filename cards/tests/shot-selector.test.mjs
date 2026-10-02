import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const {inferSelection, taxonomy} = require('../scripts/selection_metadata.cjs');
const library = JSON.parse(fs.readFileSync(path.join(ROOT, 'gallery/api/library.json'), 'utf8'));
const page = fs.readFileSync(path.join(ROOT, 'gallery/index.html'), 'utf8');
const app = fs.readFileSync(path.join(ROOT, 'gallery/app.js'), 'utf8');

test('every public recipe exposes valid shot-selection metadata', () => {
  assert.equal(library.schemaVersion, 2);
  assert.equal(library.cards.length, 139);
  for (const card of library.cards) {
    for (const group of ['dataShapes', 'readingSpeeds', 'narrativeRoles', 'motionStyles']) {
      assert.ok(card.selection[group].length > 0, `${card.id} has no ${group}`);
      for (const value of card.selection[group]) assert.ok(taxonomy[group][value], `${card.id} has invalid ${group}.${value}`);
    }
    assert.deepEqual(card.selection, inferSelection(card), `${card.id} selection metadata drifted`);
  }
});

test('native editorial, map, camera, and transition recipes resolve to distinct strategies', () => {
  const get = id => library.cards.find(card => card.id === id).selection;
  assert.ok(get('ShotCraft-SourceToReconstruction').dataShapes.includes('source_table'));
  assert.ok(get('ShotCraft-MapRouteAccumulation').dataShapes.includes('geography'));
  assert.ok(get('ShotCraft-ChartFocusPush').motionStyles.includes('cinematic'));
  assert.ok(get('ShotCraft-SharedDataElementTransition').narrativeRoles.includes('transition'));
});

test('gallery exposes a four-factor selector with explained three-way comparison', () => {
  assert.match(page, /id="openSelector"/);
  assert.match(page, /id="selectorDialog"/);
  assert.match(page, /id="compareRecommendations"/);
  assert.match(app, /\['dataShapes', 42\]/);
  assert.match(app, /\['narrativeRoles', 28\]/);
  assert.match(app, /state\.recommendations\.slice\(0, 3\)/);
  assert.match(app, /reasons\.join\('\s*·\s*'\)/);
});
