import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import test from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const loadTs = relative => {
  const source = fs.readFileSync(new URL(relative, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React}}).outputText;
  const module = {exports: {}};
  const localRequire = id => id === '../../src/sceneTiming' ? loadTs('../src/sceneTiming.ts') : id === '../../src/entityVisuals' ? loadTs('../src/entityVisuals.tsx') : require(id);
  new Function('require', 'exports', 'module', compiled)(localRequire, module.exports, module);
  return module.exports;
};
const {validatePortraitRanking} = loadTs('../templates/portrait-ranked-reveal/PortraitRankedReveal.tsx');
const sample = JSON.parse(fs.readFileSync(new URL('../templates/portrait-ranked-reveal/sample-data.json', import.meta.url), 'utf8'));

test('portrait sample supports a full hook, countdown, and conclusion hold', () => {
  assert.doesNotThrow(() => validatePortraitRanking(sample));
  const sorted = [...sample.rows].sort((a, b) => a.at - b.at);
  assert.ok(sorted[0].at >= 1.5);
  assert.ok(sorted.at(-1).at <= 7.2);
  assert.equal(sorted.at(-1).value, Math.max(...sample.rows.map(row => row.value)));
  assert.equal(sorted.at(-1).value - sorted.at(-2).value, 12);
});

test('portrait contract rejects crowded layouts, invalid timing, and misleading order', () => {
  assert.throws(() => validatePortraitRanking({...sample, rows: [...sample.rows, {...sample.rows[0], id: 'fifth', at: 8}]}));
  assert.throws(() => validatePortraitRanking({...sample, title: 'x'.repeat(29)}));
  assert.throws(() => validatePortraitRanking({...sample, rows: sample.rows.map((row, i) => i === 0 ? {...row, value: 99} : row)}));
  assert.throws(() => validatePortraitRanking({...sample, rows: sample.rows.map((row, i) => i === 3 ? {...row, at: 8} : row)}));
});
