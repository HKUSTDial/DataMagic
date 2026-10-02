import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
import Ajv from 'ajv';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const catalog = JSON.parse(read('src/runtime/catalog.json'));
const ajv = new Ajv({strict:false});
const samples = catalog.map((card) => ({card, data:JSON.parse(read(card.sampleData))}));

test('runtime entity illustrations reference real local files and valid unchanged-label data', () => {
  let count = 0;
  for (const {card, data} of samples) {
    assert.equal(ajv.validate(JSON.parse(read(card.schema)), data), true, `${card.slug}: ${JSON.stringify(ajv.errors)}`);
    const icons = data.sceneContent.entity_icons;
    if (!icons) continue;
    count++;
    const payload = data.sceneContent.template_payload;
    const rows = payload.items || payload.rows || payload.series || [];
    const entities = rows.flatMap(row => [row, ...(row.metrics || [])]);
    for (const [label, src] of Object.entries(icons)) {
      const entity = entities.find((row) => (row.label || row.name) === label);
      assert.ok(entity, `${card.slug}: ${label} must be an exact original entity label`);
      assert.equal(entity.iconSrc, src);
      assert.ok(fs.existsSync(path.join(root, 'public', src)), `${card.slug}: missing ${src}`);
    }
    assert.match(read(card.component), /RuntimeEntity(?:Svg)?Label/);
  }
  assert.equal(count, 38);
});

test('time axes and abstract metric examples do not acquire guessed logos', () => {
  for (const slug of ['BasicBarChart','BasicLineChart','QuarterlyRevenueGroupedBar','BasicStatCards','CorrelationHeatmapMatrix','SalesByRegionDarkColumn']) {
    const {data} = samples.find(({card}) => card.slug === slug);
    assert.equal(data.sceneContent.entity_icons, undefined, slug);
  }
});

test('country and brand rankings use accurate identity assets rather than synthetic replacement marks', () => {
  const coffee = samples.find(({card}) => card.slug === 'CoffeeRatingHorizontalRanking').data.sceneContent.entity_icons;
  assert.deepEqual(coffee, {Ethiopia:'icons/flags/ET.svg',Kenya:'icons/flags/KE.svg',Colombia:'icons/flags/CO.svg',Brazil:'icons/flags/BR.svg',Guatemala:'icons/flags/GT.svg'});
  const brands = samples.find(({card}) => card.slug === 'SteppedLineRanking').data.sceneContent.entity_icons;
  for (const name of ['Apple','Microsoft','Amazon','Google','Nvidia','Meta']) assert.equal(brands[name], `icons/brands/${name.toLowerCase()}.svg`);
});

test('shared renderer preserves exact labels and coordinates inside animated entity groups', () => {
  const helper = read('src/legacy/components/runtime_style_templates/runtimeEntityVisuals.tsx');
  assert.match(helper, /row\?\.label === label \|\| row\?\.name === label/);
  assert.match(helper, /<foreignObject/);
  assert.match(helper, /<Img src=\{source\(src\)\}/);
  assert.match(helper, /if \(!src\) return <text \{\.\.\.props\}>/);
  assert.match(helper, /children \?\? label/);
});

test('SVG labels never contain HTML-only icon label spans', () => {
  for (const {card} of samples) {
    const source = read(card.component);
    const ast = ts.createSourceFile(card.component, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const inspect = (node) => {
      if (ts.isJsxElement(node) && node.openingElement.tagName.getText(ast) === 'text') {
        assert.ok(!node.getText(ast).includes('<RuntimeEntityLabel'), `${card.slug}: SVG text must not contain an HTML span`);
      }
      ts.forEachChild(node, inspect);
    };
    inspect(ast);
  }
});
