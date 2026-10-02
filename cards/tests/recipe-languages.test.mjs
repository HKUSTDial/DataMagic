import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root = new URL('../', import.meta.url);
const cards = JSON.parse(fs.readFileSync(new URL('gallery/api/library.json', root))).cards;
test('all recipes have Chinese defaults and independent English documents', () => {
  for (const card of cards) {
    for (const lang of ['zh','en']) {
      const file = `recipes/${lang === 'en' ? 'en/' : ''}${card.slug}.md`;
      const text = fs.readFileSync(new URL(file, root), 'utf8');
      assert(text.startsWith(`# ${card.name[lang]}\n`));
      assert.equal(text, fs.readFileSync(new URL(`gallery/${file}`, root), 'utf8'));
      assert.equal(text.match(/^# /gm)?.length, 1);
      assert(text.includes('https://github.com/HKUSTDial/DataMagic'));
      for (const key of ['component','schema','sampleData']) assert(text.includes(card.source[key]), `${file}: ${key}`);
      assert(text.includes(lang === 'zh' ? '## 交付检查' : '## Delivery review'));
      if (lang === 'en') assert.equal(text.split('\n').filter(l => /[\u3400-\u9fff]/.test(l)).length, 1, file);
      else assert(!text.includes('## Runtime animation contract'), file);
    }
    assert(fs.existsSync(new URL(`references/recipe-language-source/${card.slug}.md.txt`, root)));
  }
});
test('gallery resolves the full recipe using the selected language', () => {
  const script = fs.readFileSync(new URL('gallery/recipe.js', root), 'utf8');
  assert(script.includes('`recipes/en/${encodeURIComponent(item.slug)}.md`'));
  assert(script.includes("fetch(recipePath, {cache: 'no-store'})"));
});
