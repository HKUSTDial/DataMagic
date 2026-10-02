import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
import {collectionDefinitions, categoryGroups} from '../gallery/discovery.js';

const require = createRequire(import.meta.url);
const source = fs.readFileSync(new URL('../src/sceneTiming.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText;
const helper = {exports: {}};
new Function('require', 'exports', 'module', compiled)(require, helper.exports, helper);
const {validateRows, activeRow, reveal} = helper.exports;
const library = JSON.parse(fs.readFileSync(new URL('../gallery/api/library.json', import.meta.url)));

test('geographic collection excludes contextual percentage scenes', () => {
  const maps = collectionDefinitions.find(item => item.id === 'maps');
  for (const slug of ['SpatialPercentOverlay', 'FootageEvidenceReveal']) assert.equal(maps.match(library.cards.find(item => item.slug === slug)), false);
  for (const slug of ['ChoroplethRankMap', 'ParallaxMapGlide']) assert.equal(maps.match(library.cards.find(item => item.slug === slug)), true);
});

test('each category appears exactly once in the grouped sidebar', () => {
  const ids = categoryGroups.flatMap(group => group.ids);
  assert.equal(new Set(ids).size, ids.length);
  for (const card of library.cards) assert.ok(ids.includes(card.category), card.category);
  for (const collection of collectionDefinitions) assert.ok(library.cards.some(collection.match), collection.id);
});

test('reveals preserve authored order and reject invalid scales or crowded events', () => {
  const rows = [{id: 'a', label: 'A', value: 86, at: 4, caption: ''}, {id: 'b', label: 'B', value: 57, at: 1, caption: ''}];
  validateRows(rows, 100, 10);
  assert.equal(activeRow(rows, 0), undefined);
  assert.equal(activeRow(rows, 1).id, 'b');
  assert.equal(activeRow(rows, 4).id, 'a');
  assert.equal(reveal(0, 1), 0);
  assert.equal(reveal(10, 1), 1);
  assert.throws(() => validateRows(rows, 80, 10));
  assert.throws(() => validateRows([rows[0], {...rows[1], id: 'a'}], 100, 10));
  assert.throws(() => validateRows([rows[0], {...rows[1], at: 4.1}], 100, 10));
  assert.throws(() => validateRows(rows, 100, 4.5));
});

test('new recipe files and sample data agree with their runtime constraints', () => {
  for (const slug of ['PresenterEvidenceBoard', 'FootageEvidenceReveal', 'RankedReveal']) {
    const card = library.cards.find(item => item.slug === slug);
    assert.ok(card, slug);
    const data = JSON.parse(fs.readFileSync(new URL(`../${card.source.sampleData}`, import.meta.url)));
    validateRows(data.rows, data.maximum, slug === 'FootageEvidenceReveal' ? 8 : 10);
    assert.ok(fs.existsSync(new URL(`../${card.source.schema}`, import.meta.url)));
    const recipe = fs.readFileSync(new URL(`../recipes/${slug}.md`, import.meta.url), 'utf8');
    assert.ok(recipe.includes(card.source.component));
    assert.ok(recipe.includes('silent preview'));
  }
});
