import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import {implementationBrief} from '../gallery/implementation-brief.js';
import {cardStatus, sortRecentCards} from '../gallery/card-history.js';
const library = JSON.parse(fs.readFileSync(new URL('../gallery/api/library.json', import.meta.url)));
const history = JSON.parse(fs.readFileSync(new URL('../gallery/api/card-history.json', import.meta.url)));
const now = Date.parse('2026-10-02T12:00:00Z');
test('briefs use the selected language while preserving executable recipe identities', () => {
  for (const card of library.cards) {
    const zh = implementationBrief(card), en = implementationBrief(card, 'en');
    assert(zh.startsWith('请使用 datamagic Skill'));
    assert(en.startsWith('Use the datamagic Skill'));
    assert(zh.includes(`cards/recipes/${card.slug}.md`));
    assert(en.includes(`cards/recipes/${card.slug}.md`));
    assert(zh.includes(card.name.zh));
    assert(en.includes(card.name.en));
    assert(zh.split('\n').length <= 8);
    assert(!zh.includes('Purpose:'));
  }
});
test('new cards precede updated cards without mutating library order', () => {
  const before = library.cards.map(c => c.slug);
  const sorted = sortRecentCards(library.cards, history, now);
  assert(sorted.slice(0, 3).every(c => cardStatus(c, history, now) === 'new'));
  assert.equal(sorted.filter(c => cardStatus(c, history, now) === 'updated').length,
    Object.keys(history.updated).filter(slug => !history.added[slug]).length);
  assert.deepEqual(library.cards.map(c => c.slug), before);
  for (const slug of [...Object.keys(history.added), ...Object.keys(history.updated)]) assert(before.includes(slug));
});
test('expired and future dates do not create badges or reorder unmarked cards', () => {
  const cards = [{slug: 'a'}, {slug: 'b'}];
  const old = {added: {b: '2026-09-01'}};
  assert.equal(cardStatus(cards[1], old, now), '');
  assert.deepEqual(sortRecentCards(cards, old, now), cards);
  assert.equal(cardStatus(cards[1], {added: {b: '2027-01-01'}}, now), '');
});
