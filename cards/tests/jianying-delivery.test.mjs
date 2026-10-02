import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {timeline,srt}=require('../scripts/delivery_timeline.cjs');
const sample=require('../templates/ranked-reveal/sample-data.json');
const copy=()=>structuredClone(sample);

test('delivery cuts and editable captions share the exact template events',()=>{
  const m=timeline(sample);
  assert.deepEqual(m.shots.map(s=>s.startFrame),[0,30,78,126,174,210]);
  assert.equal(m.shots.at(-1).endFrame,300);
  assert.equal(m.captions.at(-1).text,sample.takeaway);
  assert.equal(m.captions.at(-1).startFrame,210);
  assert.equal(m.audio.length,0);
  assert.equal(m.timingAuthority,'authored-template-events-not-measured-speech');
  assert.ok(m.assets.every(a=>!a.path.startsWith('/')&&!a.path.includes('..')));
  assert.match(srt(m),/00:00:05,800 --> 00:00:07,000/);
});
test('non-frame reveal uses the first visible frame rather than early rounding',()=>{
  const p=copy();p.rows.at(-1).at=1.001;
  assert.equal(timeline(p).captions[1].startFrame,31);
});
test('export refuses unsupported layout, invalid scales, crowded events and unexpected props',()=>{
  const five=copy();five.rows.push({...five.rows[0],id:'extra',at:7});assert.throws(()=>timeline(five));
  const negative=copy();negative.rows[0].value=-1;assert.throws(()=>timeline(negative));
  const crowd=copy();crowd.rows[0].at=4.3;assert.throws(()=>timeline(crowd));
  const wrong=copy();wrong.plate=true;assert.throws(()=>timeline(wrong));
  const unknown=copy();unknown.rows[0].id=unknown.rows[1].id;assert.throws(()=>timeline(unknown));
});
