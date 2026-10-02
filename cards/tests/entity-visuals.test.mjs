import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';
import Ajv2020 from 'ajv/dist/2020.js';
const root = path.resolve(import.meta.dirname, '..');
const library = JSON.parse(fs.readFileSync(path.join(root, 'gallery/api/library.json')));
const ajv = new Ajv({strict:false, allErrors:true});
const ajv2020 = new Ajv2020({strict:false, allErrors:true});

test('every card sample validates and all entity imagery resolves locally', () => {
  let icons = 0;
  for (const card of library.cards) {
    const sample = JSON.parse(fs.readFileSync(path.join(root, card.source.sampleData)));
    const schema = JSON.parse(fs.readFileSync(path.join(root, card.source.schema)));
    const validator = schema.$schema?.includes('2020-12') ? ajv2020 : ajv;
    delete schema.$schema;
    const valid = validator.compile(schema);
    assert(valid(sample), `${card.slug}: ${JSON.stringify(valid.errors)}`);
    function visit(value, key='') {
      if (typeof value === 'string' && (key === 'iconSrc' || key === 'icon_src' || key === 'entity_icons')) {
        if (!/^(https?:|data:|blob:)/.test(value)) assert(fs.existsSync(path.join(root,'public',value)), `${card.slug}: ${value}`);
        icons++;
      } else if (value && typeof value === 'object') {
        for (const [k,v] of Object.entries(value)) visit(v, key === 'entity_icons' ? key : k);
      }
    }
    visit(sample);
  }
  assert(icons > 20, `Expected entity imagery across cards, got ${icons}`);
});

test('country flags are bound to country identity, not rank', () => {
  const sample = JSON.parse(fs.readFileSync(path.join(root,'templates/bar-chart-race/sample-data.json')));
  assert.equal(sample.entities.find(e => e.id === 'china').iconSrc, 'icons/flags/CN.svg');
  assert.equal(sample.entities.find(e => e.id === 'usa').iconSrc, 'icons/flags/US.svg');
  assert.equal(new Set(sample.entities.map(e => e.iconSrc)).size, sample.entities.length);
});

test('countdown icons do not reveal an entity ahead of its reveal beat', () => {
  const code = fs.readFileSync(path.join(root,'templates/ranked-reveal/RankedReveal.tsx'),'utf8');
  assert.match(code, /visible \? <EntityIcon/);
});
