import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import ts from 'typescript';
import {createRequire} from 'node:module';
import {categoryGroups,collectionDefinitions} from '../gallery/discovery.js';
const require=createRequire(import.meta.url);
const root=new URL('../',import.meta.url);
const source=fs.readFileSync(new URL('src/editorialStory.ts',root),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const helper={exports:{}};new Function('require','exports','module',compiled)(require,helper.exports,helper);
const {contributionSteps,validateSeries,validateTiers,tierIndex}=helper.exports;
const data=(folder,name='sample-data')=>JSON.parse(fs.readFileSync(new URL(`templates/${folder}/${name}.json`,root)));
test('signed trend supports alternate focus and common signed domains',()=>{
  for(const file of ['sample-data','alternate-data']) {const p=data('presenter-data-takeover',file);validateSeries(p.points,p.domain,p.focusIndex);assert.ok(p.points[p.focusIndex].value<0);}
  const p=data('presenter-data-takeover');assert.throws(()=>validateSeries(p.points,[0,4],3));assert.throws(()=>validateSeries(p.points,[-1,4],3));assert.throws(()=>validateSeries(p.points,p.domain,6));
});
test('contribution endpoint is calculated, including a positive saving contribution',()=>{
  const a=data('contrast-contribution-story'),b=data('contrast-contribution-story','alternate-data');
  assert.equal(contributionSteps(a.baseline,a.contributions,a.maximum).final,5);
  const result=contributionSteps(b.baseline,b.contributions,b.maximum);assert.equal(result.final,26);assert.ok(result.steps[1].value>0);
  assert.throws(()=>contributionSteps(0,a.contributions,40));
  assert.throws(()=>contributionSteps(10,[{...a.contributions[0],value:NaN},...a.contributions.slice(1)],40));
  assert.throws(()=>contributionSteps(10,a.contributions.map(c=>({...c,at:3})),40));
});
test('tier board uses transparent inclusive boundaries and supports declines and jumps',()=>{
  for(const file of ['sample-data','alternate-data']) {const p=data('persistent-tier-board',file);validateTiers(p.tiers,p.items,p.maximum);assert.equal(tierIndex(p.tiers,p.tiers[0].minimum),0);assert.equal(tierIndex(p.tiers,0),2);}
  const p=data('persistent-tier-board','alternate-data');assert.equal(tierIndex(p.tiers,p.items[0].before),0);assert.equal(tierIndex(p.tiers,p.items[0].after),1);assert.equal(tierIndex(p.tiers,p.items[2].after),0);
  assert.throws(()=>validateTiers([...p.tiers].reverse(),p.items,p.maximum));
  assert.throws(()=>validateTiers(p.tiers,p.items.map(item=>({...item,id:'duplicate'})),p.maximum));
  assert.throws(()=>validateTiers(p.tiers,p.items.map(item=>({...item,after:11})),p.maximum));
});
test('discovery puts scenes before chart types and groups every category once',()=>{
  assert.equal(categoryGroups[0].name.zh,'讲解与故事');assert.equal(categoryGroups.at(-1).name.zh,'图表类型');
  const ids=categoryGroups.flatMap(group=>group.ids);assert.equal(ids.length,new Set(ids).size);
  const stories=collectionDefinitions.find(c=>c.id==='storytelling');assert.ok(stories.match({compatibleVisuals:['editorial_story']}));assert.ok(!stories.match({category:'scatter_chart'}));
});
test('new recipes expose source, schema, alternate inputs and explicit silent preview limits',()=>{
  for(const [slug,folder] of [['PresenterDataTakeover','presenter-data-takeover'],['ContrastContributionStory','contrast-contribution-story'],['PersistentTierBoard','persistent-tier-board']]) {
    const schema=JSON.parse(fs.readFileSync(new URL(`templates/${folder}/schema.json`,root)));
    for(const file of ['sample-data','alternate-data']) {const p=data(folder,file);for(const key of schema.required) assert.ok(Object.hasOwn(p,key),`${slug} missing ${key}`);for(const key of Object.keys(p)) assert.ok(Object.hasOwn(schema.properties,key),`${slug} extra ${key}`);}
    const recipe=fs.readFileSync(new URL(`recipes/${slug}.md`,root),'utf8');assert.match(recipe,/silent preview/);assert.ok(recipe.includes(`templates/${folder}/${slug}.tsx`));
    const src=fs.readFileSync(new URL(`templates/${folder}/${slug}.tsx`,root),'utf8');assert.doesNotMatch(src,/animation:|transition:|Math\.random\(|setInterval\(/);
  }
});
