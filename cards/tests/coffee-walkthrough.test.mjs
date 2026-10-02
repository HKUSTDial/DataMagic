import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRaceFrame} from '../templates/bar-chart-race/model.js';
const root=new URL('../examples/coffee-race-walkthrough/',import.meta.url);
const read=name=>JSON.parse(fs.readFileSync(new URL(name,root),'utf8'));
test('coffee walkthrough maps all 36 CSV values in both versions',()=>{
 const rows=fs.readFileSync(new URL('sales.csv',root),'utf8').trim().split(/\r?\n/).slice(1).map(line=>line.split(','));
 for(const version of ['v1','v2']){
  const props=read(version+'.json');
  for(const [i,row] of rows.entries()){
   const frame=createRaceFrame(props,i/(rows.length-1));
   props.entities.forEach((e,j)=>assert.equal(frame.rows.find(r=>r.id===e.id).value,Number(row[j+1])));
  }
 }
});
test('revision preserves data and highlights only latte',()=>{
 const a=read('v1.json'),b=read('v2.json');
 assert.deepEqual(a.snapshots,b.snapshots);assert.notEqual(a.title,b.title);
 assert.equal(b.entities.find(e=>e.label==='拿铁').color,'#7c3aed');
 assert.ok(b.entities.filter(e=>e.label!=='拿铁').every(e=>e.color==='#94a3b8'));
 assert.equal(createRaceFrame(b,1).leader.value,1450);
 const report=read('verification.json');assert.equal(report.results[1].frames-report.results[0].frames,60);
 assert.ok(report.finalHoldMaxMeanPixelDifference<.1);
});
