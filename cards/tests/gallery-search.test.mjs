import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {createCardSearchIndex, matchesCardSearch, normalizeSearch} from '../gallery/search.js';
import {collectionDefinitions} from '../gallery/discovery.js';
const library = JSON.parse(fs.readFileSync(new URL('../gallery/api/library.json', import.meta.url)));
const index = createCardSearchIndex(library.cards, library.categories, collectionDefinitions);
const results = query => library.cards.filter(card => matchesCardSearch(index, card, query)).map(card => card.slug);

test('Chinese everyday phrases find their intended examples', () => {
  for (const [query, slug] of [['猫主持', 'CharacterPerspectiveBoard'], ['国家排名', 'BarChartRace'],
    ['条形图竞赛', 'BarChartRace'], ['柱状图', 'BasicBarChart'], ['曲线图', 'BasicLineChart'],
    ['甜甜圈图', 'MarketShareDonut'], ['桑基图', 'SupplyFlowSankey'], ['地图滑动', 'ParallaxMapGlide']]) {
    assert(results(query).includes(slug), query);
  }
});
test('Chinese and English metadata is indexed together, independently of UI language', () => {
  assert(results('猫 presenter').includes('CharacterPerspectiveBoard'));
  assert(results('BAR chart RACE').includes('BarChartRace'));
  assert(results('地图故事').includes('ParallaxMapGlide'));
});
test('multiple terms use AND matching and normalize full-width input', () => {
  assert(results('国家，排名').includes('BarChartRace'));
  assert(!results('猫 地图').includes('CharacterPerspectiveBoard'));
  assert.equal(normalizeSearch('ＢＡＲ'), 'bar');
  assert.equal(results('   ').length, library.cards.length);
});
test('internal source paths, encoding hashes and adapter names are not search terms', () => {
  assert.deepEqual(results('shotcraft-native'), []);
  assert.deepEqual(results('templates/bar-chart-race'), []);
  assert.deepEqual(results('不存在的示例xyz'), []);
});
