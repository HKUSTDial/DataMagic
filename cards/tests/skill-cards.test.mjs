import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {run, resolveRoot} = require('../../skills/datamagic-video/scripts/cards.cjs');
const cardsRoot = path.resolve(new URL('../', import.meta.url).pathname);

test('skill resolves companion package independently of current directory', () => {
  assert.equal(resolveRoot(), cardsRoot);
  const list = run(['list', '--native', '--query', 'ranking']);
  assert.ok(list.cards.some(card => card.slug === 'RankedReveal'));
  assert.ok(list.cards.every(card => card.native));
  assert.equal(run(['list', '--query', '倒序揭晓']).cards.some(card => card.slug === 'RankedReveal'), true);
});

test('inspect resolves executable source for both advanced and runtime cards', () => {
  const native = run(['inspect', 'RankedReveal']);
  assert.equal(native.native, true);
  for (const file of Object.values(native.files)) assert.ok(fs.statSync(file).size > 0);
  const reference = run(['list']).cards.find(card => !card.native);
  const result = run(['inspect', reference.slug]);
  assert.equal(result.native, false);
  assert.equal(result.editable, true);
  assert.ok(fs.statSync(result.files.component).size > 0);
  assert.ok(fs.statSync(result.files.sampleData).size > 0);
  assert.equal(result.compositionId, `RuntimeTemplatePreview-${reference.slug}`);
});

test('explicit package override, argument errors and unknown recipes are actionable', () => {
  assert.equal(run(['list', '--cards', cardsRoot]).cardsRoot, cardsRoot);
  assert.throws(() => run(['inspect', 'not-a-card']), /Unknown card/);
  assert.throws(() => run(['inspect']), /requires an exact slug/);
  assert.throws(() => run(['list', '--query']), /Missing value/);
  assert.throws(() => run(['list', '--wrong']), /Unknown option/);
  assert.throws(() => run(['list', '--cards', os.tmpdir()]), /No Cards index/);
});
