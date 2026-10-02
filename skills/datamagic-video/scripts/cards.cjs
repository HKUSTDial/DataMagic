#!/usr/bin/env node
// Dependency-free discovery for repository and plugin-root installs.
const fs = require('node:fs');
const path = require('node:path');

function resolveRoot(explicit) {
  if (explicit) {
    const root = path.resolve(explicit);
    if (!fs.existsSync(path.join(root, 'gallery/api/library.json'))) throw new Error(`No Cards index at ${root}`);
    return root;
  }
  let dir = __dirname;
  while (true) {
    const root = path.join(dir, 'cards');
    if (fs.existsSync(path.join(root, 'gallery/api/library.json'))) return root;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error('Companion Cards package missing. Pass --cards /path/to/DataMagic/cards.');
}

function resource(root, relative) {
  if (typeof relative !== 'string' || !relative) throw new Error('Missing resource path');
  const file = path.resolve(root, relative);
  if (!file.startsWith(root + path.sep)) throw new Error(`Resource escapes Cards: ${relative}`);
  if (!fs.existsSync(file)) throw new Error(`Missing resource: ${file}`);
  return file;
}

function run(args) {
  const options = {};
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const value = args[i];
    if (value === '--native') options.native = true;
    else if (value === '--cards' || value === '--query') {
      if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Missing value for ${value}`);
      options[value.slice(2)] = args[++i];
    } else if (value.startsWith('--')) throw new Error(`Unknown option: ${value}`);
    else positional.push(value);
  }
  const [command = 'list', slug] = positional;
  if (!['list', 'inspect'].includes(command) || positional.length > 2 || (command === 'list' && slug)) {
    throw new Error('Usage: cards.cjs list [--native] [--query text] [--cards path] | inspect <slug> [--cards path]');
  }
  const root = resolveRoot(options.cards);
  const library = JSON.parse(fs.readFileSync(resource(root, 'gallery/api/library.json'), 'utf8'));
  if (command === 'list') {
    const query = (options.query || '').toLocaleLowerCase();
    const cards = library.cards.filter(card => (!options.native || card.source.adapter === 'shotcraft-native') && JSON.stringify({slug:card.slug, name:card.name, description:card.description, tags:card.tags, category:card.category, selection:card.selection, compatibleVisuals:card.compatibleVisuals}).toLocaleLowerCase().includes(query));
    return {cardsRoot:root, count:cards.length, cards:cards.map(card => ({slug:card.slug, name:card.name, category:card.category, native:card.source.adapter === 'shotcraft-native', editable:Boolean(card.source.component), selection:card.selection}))};
  }
  if (!slug) throw new Error('inspect requires an exact slug');
  const card = library.cards.find(card => card.slug === slug);
  if (!card) throw new Error(`Unknown card: ${slug}`);
  const native = card.source.adapter === 'shotcraft-native';
  return {cardsRoot:root, card, native, editable:Boolean(card.source.component), compositionId:card.source.renderCompositionId || card.source.compositionId || card.id,
    files:{recipe:resource(root, `recipes/${card.slug}.md`), poster:resource(root, `gallery/${card.preview.poster}`), video:resource(root, `gallery/${card.preview.mp4}`),
      ...Object.fromEntries(['component', 'schema', 'sampleData', 'entryComponent'].filter(key => card.source[key]).map(key => [key, resource(root, card.source[key])]))},
    note:'Editable public template. Read schema, source, shared imports and composition before adapting.'};
}

if (require.main === module) {
  try { process.stdout.write(JSON.stringify(run(process.argv.slice(2)), null, 2) + '\n'); }
  catch (error) { process.stderr.write(error.message + '\n'); process.exitCode = 1; }
}
module.exports = {run, resolveRoot};
