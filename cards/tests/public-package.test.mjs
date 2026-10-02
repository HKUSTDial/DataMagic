import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const library = JSON.parse(fs.readFileSync(new URL('gallery/api/library.json', root), 'utf8'));

test('every public card has a recipe and bundled browsing assets', () => {
  for (const card of library.cards) {
    for (const relative of [
      `recipes/${card.slug}.md`,
      `gallery/recipes/${card.slug}.md`,
      `gallery/${card.preview.poster}`,
      `gallery/${card.preview.mp4}`,
    ]) {
      const file = new URL(relative, root);
      assert.ok(fs.existsSync(file), `${card.slug}: missing ${relative}`);
      assert.ok(fs.statSync(file).size > 0, `${card.slug}: empty ${relative}`);
    }
    {
      for (const field of ['component', 'schema', 'sampleData']) {
        assert.ok(fs.existsSync(new URL(card.source[field], root)), `${card.slug}: missing ${field}`);
      }
    }
  }
});

test('native sample media is bundled under the public rendering directory', () => {
  for (const card of library.cards.filter(card => card.source.adapter === 'shotcraft-native')) {
    const data = JSON.parse(fs.readFileSync(new URL(card.source.sampleData, root), 'utf8'));
    for (const asset of [data.videoSrc, data.backgroundSrc, data.presenter?.src].filter(Boolean)) {
      assert.ok(fs.existsSync(new URL(`public/${asset}`, root)), `${card.slug}: missing ${asset}`);
    }
  }
});
