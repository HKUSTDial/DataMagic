import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relativePath => fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
const library = JSON.parse(read('gallery/api/library.json'));

test('every public card has a published recipe document', () => {
  const missing = library.cards
    .map(card => `gallery/recipes/${card.slug}.md`)
    .filter(relativePath => !fs.existsSync(path.join(ROOT, relativePath)));
  assert.deepEqual(missing, []);
});

test('preview details and implementation recipes use separate actions', () => {
  const app = read('gallery/app.js');
  assert.match(app, /data-action="detail"/);
  assert.match(app, /data-action="recipe"/);
  assert.match(app, /openRecipe\(item\)/);
  assert.match(app, /data-action="copy"[\s\S]+复制实现指令/);
  assert.match(app, /button\.dataset\.action === 'copy'\) copyRecipeGuide\(item\)/);
  assert.match(app, /recipeDialog.*showModal/);
  assert.doesNotMatch(app, /window\.open\(url/);
  assert.doesNotMatch(app, /data-action="detail"[^>]+class="recipe-button"/);
});

test('the recipe page exposes implementation and agent-copy surfaces', () => {
  const page = read('gallery/recipe.html');
  const script = read('gallery/recipe.js');
  assert.match(page, /recipe\.js/);
  assert.match(script, /copyPrompt/);
  assert.doesNotMatch(script, /id="copyKey"/);
  assert.doesNotMatch(script, /id="copyMarkdown"/);
  assert.match(script, /recipes\/\$\{encodeURIComponent\(item\.slug\)\}\.md/);
  assert.match(script, /Implementation/);
  assert.match(script, /Preflight checks/);
});

test('copy feedback stays inside the top-layer preview dialog', () => {
  const page = read('gallery/index.html');
  const app = read('gallery/app.js');
  assert.match(page, /id="detailToast"/);
  assert.match(app, /\$\('#detail'\)\?\.open \? \$\('#detailToast'\) : \$\('#toast'\)/);
});

test('recipe back action closes an embedded dialog and returns standalone pages to the library', () => {
  const app = read('gallery/app.js');
  const script = read('gallery/recipe.js');
  assert.match(app, /frameUrl\.searchParams\.set\('embedded', '1'\)/);
  assert.match(app, /shotcraft:close-recipe/);
  assert.match(script, /id="recipeBack" href="index\.html"/);
  assert.match(script, /window\.self !== window\.top/);
  assert.match(script, /window\.parent\.postMessage\(\{type: 'shotcraft:close-recipe'\}, location\.origin\)/);
});
