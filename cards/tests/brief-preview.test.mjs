import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import {briefPreview} from '../gallery/brief-preview.js';
test('brief preview is read-only, escaped, and describes supported coding agents', () => {
  const html = briefPreview('Example\n</textarea><script>unsafe</script>');
  assert.match(html, /textarea readonly/);
  assert.match(html, /&lt;\/textarea&gt;/);
  assert.doesNotMatch(html, /<script>/);
  for (const agent of ['Codex', 'Claude Code', 'Cursor']) assert(html.includes(agent));
  assert.match(html, /DataMagic 仓库/);
  assert.match(briefPreview('example', 'en'), /Open the DataMagic repository/);
});
test('both entry points preview exactly the prompt their copy button uses', () => {
  const app = fs.readFileSync(new URL('../gallery/app.js', import.meta.url), 'utf8');
  const recipe = fs.readFileSync(new URL('../gallery/recipe.js', import.meta.url), 'utf8');
  assert.match(app, /briefPreview\(recipePrompt\(item\), state.lang\)/);
  assert.match(recipe, /briefPreview\(prompt, state.lang\)/);
  assert.match(recipe, /copyText\(prompt\)/);
});
