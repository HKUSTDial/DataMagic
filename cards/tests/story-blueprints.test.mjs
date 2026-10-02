import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const library = JSON.parse(read('gallery/api/library.json'));
const stories = JSON.parse(read('gallery/api/story-blueprints.json'));
const app = read('gallery/app.js');
const page = read('gallery/index.html');

test('eight story blueprints cover every public visualization category', () => {
  assert.equal(stories.blueprints.length, 8);
  const known = new Set(Object.keys(library.categories));
  const covered = new Set();
  for (const story of stories.blueprints) {
    assert.equal(story.beats.length, 4, `${story.id} should have four narrative beats`);
    for (const beat of story.beats) {
      assert.ok(beat.role);
      assert.ok(beat.title.zh && beat.title.en);
      for (const category of beat.categories) {
        assert.ok(known.has(category), `${story.id} references unknown category ${category}`);
        covered.add(category);
      }
    }
  }
  assert.deepEqual([...covered].sort(), [...known].sort());
});

test('new story blueprints use the new recipes in their narrative roles', () => {
  const presenter = stories.blueprints.find(story => story.id === 'presenter_guided_evidence');
  const ranking = stories.blueprints.find(story => story.id === 'countdown_to_winner');
  assert.ok(presenter);
  assert.ok(ranking);
  assert.equal(presenter.beats.find(beat => beat.role === 'evidence')?.categories[0], 'presenter_explainer');
  assert.equal(ranking.beats.find(beat => beat.role === 'reveal')?.categories[0], 'ranking_reveal');
  assert.ok(library.cards.some(card => card.category === 'presenter_explainer'));
  assert.ok(library.cards.some(card => card.category === 'ranking_reveal'));
});

test('public language uses a generic editorial-story label instead of a creator name', () => {
  assert.doesNotMatch(app + JSON.stringify(stories), /小Lin式讲解/);
  assert.equal(stories.blueprints.find(story => story.id === 'editorial_reveal')?.name.zh, '编辑化问题揭示');
  assert.match(page, /id="storyDialog"/);
  assert.match(page, /id="openStories"/);
});

test('story workbench produces a sequence brief and opens recipe shots in-place', () => {
  assert.match(app, /const storyPrompt = story =>/);
  assert.match(app, /SHOT \$\{index \+ 1\}/);
  assert.match(app, /data-story-detail/);
  assert.match(app, /openDetail\(button\.dataset\.storyDetail\)/);
  assert.match(app, /location\.hash === '#stories'/);
});
