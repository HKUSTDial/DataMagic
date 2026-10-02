import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const libraryUrl = new URL('../gallery/api/library.json', import.meta.url);
const mediaUrl = new URL('../gallery/media/', import.meta.url);
const library = JSON.parse(fs.readFileSync(libraryUrl, 'utf8'));

test('the public library contains 109 runtime DataMagic cards and 30 native recipe cards', () => {
  const datamagic = library.cards.filter(card => card.source?.adapter === 'datamagic');
  const native = library.cards.filter(card => card.source?.adapter === 'shotcraft-native');
  assert.equal(datamagic.length, 109);
  assert.equal(native.length, 30);
  assert.equal(library.cards.length, 139);
  assert.equal(library.cards.length, datamagic.length + native.length);
  assert.ok(datamagic.every(card => ['runtime_highlight', 'runtime_motion'].includes(card.preview?.mode)));
});

test('all DataMagic cards expose reusable runtime animation metadata', () => {
  const cards = library.cards.filter(card => card.source?.adapter === 'datamagic');
  for (const card of cards) {
    assert.equal(card.runtime?.supported, true, card.slug);
    assert.equal(card.source.previewCompositionId, `RuntimeTemplatePreview-${card.slug}`, card.slug);
    assert.ok(card.runtime.triggerPhrase, card.slug);
    assert.ok(card.runtime.emphasis, card.slug);
    assert.ok(card.runtime.animationIntent, card.slug);
    assert.ok(card.runtime.highlightTargets.length > 0, card.slug);
  }
});

test('all DataMagic runtime cards have rendered MP4 previews', () => {
  const cards = library.cards.filter(card => card.source?.adapter === 'datamagic');
  for (const card of cards) {
    assert.equal(card.preview.mp4, `media/${card.slug}.mp4`, card.slug);
    const video = new URL(`${card.slug}.mp4`, mediaUrl);
    assert.ok(fs.statSync(video).size > 4096, card.slug);
  }
});
