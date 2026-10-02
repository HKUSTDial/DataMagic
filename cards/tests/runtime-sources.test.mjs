import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const Ajv = require('ajv');
const root = path.resolve(new URL('../', import.meta.url).pathname);
const library = require('../gallery/api/library.json');
const catalog = require('../src/runtime/catalog.json');
const runtime = library.cards.filter(card => card.source.adapter === 'datamagic');
const loadJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

test('all runtime cards map to bundled components, props, schemas and render IDs', () => {
  const ajv = new Ajv({strict:false});
  assert.equal(catalog.length, 109);
  assert.equal(new Set(catalog.map(item => item.previewId)).size, 109);
  for (const card of runtime) {
    const entry = catalog.find(item => item.slug === card.slug);
    assert.ok(entry, card.slug);
    assert.equal(entry.component, card.source.component);
    assert.equal(card.source.bundled, true);
    assert.equal(card.source.renderCompositionId, entry.previewId);
    for (const field of ['component', 'schema', 'sampleData', 'entryComponent']) assert.ok(fs.statSync(path.join(root, card.source[field])).size > 0, `${card.slug}:${field}`);
    const props = loadJson(card.source.sampleData);
    const validate = ajv.compile(loadJson(card.source.schema));
    assert.ok(validate(props), `${card.slug}: ${JSON.stringify(validate.errors)}`);
    assert.equal(props.sceneContent.style_template_id, entry.id);
    assert.equal(props.scene.content, undefined, 'sample content has a single editable copy');
  }
});

test('legacy dependency closure stays inside Cards and resolves every local import', () => {
  const base = path.join(root, 'src/legacy');
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) {walk(file); continue;}
      if (!/\.tsx?$/.test(file)) continue;
      const parsed = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
      for (const node of parsed.statements) {
        if ((!ts.isImportDeclaration(node) && !ts.isExportDeclaration(node)) || !node.moduleSpecifier) continue;
        const name = node.moduleSpecifier.text;
        if (!name.startsWith('.')) {assert.ok(['react', 'remotion'].includes(name), `${file}: external ${name}`); continue;}
        const candidate = path.resolve(path.dirname(file), name);
        assert.ok(candidate.startsWith(base + path.sep), `${file}: dependency escaped package`);
        assert.ok(['', '.ts', '.tsx', '.json', '/index.ts', '/index.tsx'].some(ext => fs.existsSync(candidate + ext)), `${file}: unresolved ${name}`);
      }
      for (const asset of fs.readFileSync(file, 'utf8').matchAll(/staticFile\('([^']+)'\)/g)) assert.ok(fs.existsSync(path.join(root, 'public', asset[1])), `Missing asset: ${asset[1]}`);
    }
  }
  walk(base);
});

test('runtime data extraction preserves replacement labels, numeric values and display values', () => {
  const file = path.join(root, 'src/legacy/components/runtime_style_templates/runtimeSlots.ts');
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,
    {exports, require:createRequire(file)});
  const data = [{label:'A', value:13, display_value:'13件'}, {label:'B', value:47, display_value:'47件'}];
  const props = {title:'新数据', style_template_id:'StyleTemplate-BasicBarChart', data,
    template_payload:{title:'新数据', points:data}};
  const points = exports.runtimePoints(props, {});
  assert.deepEqual(JSON.parse(JSON.stringify(points.map(p => ({label:p.label, value:p.value, display:p.displayValue})))),
    data.map(p => ({label:p.label, value:p.value, display:p.display_value})));
  assert.equal(exports.slotTitle(props), '新数据');
  const scene = {time_range:[0, 6], animations:[{type:'emphasis', effect:'highlight', time_start:3.2, duration:1.1, target_data:{data_filter:{label:'门店订单'}}}]};
  const contract = exports.runtimeAnimationContract('bar', scene, 120, 30);
  assert.equal(contract.active, true, 'explicit public timing works without product debug metadata');
  assert.equal(exports.runtimeContractMatches(contract, '门店订单'), true);
  assert.equal(exports.runtimeContractMatches(contract, '线上订单'), false);
});
