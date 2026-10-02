import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../../assets/promo/',import.meta.url);
const read=p=>JSON.parse(fs.readFileSync(new URL(p,root),'utf8'));
test('each narrated sentence stays within its matching showcase scene',()=>{
  const spec=read('narration.json');
  const intervals=[[0,3],[3,7],[7,11],[11,15],[15,19],[19,23],[23,27],[27,30]];
  const names=['opening','presenter','handoff','ranking','footage','timeline','map','create'];
  assert.equal(spec.segments.length,intervals.length);
  for(const [i,s] of spec.segments.entries()) {
    assert.ok(s.id.endsWith(names[i]));
    assert.ok(s.start>=intervals[i][0]);
    assert.ok(s.end<=intervals[i][1]);
    assert.ok(s.end>s.start);
  }
});
test('generated speech fits the timeline and has a caption for each sentence',()=>{
  const spec=read('narration.json'), rendered=read('audio/voice-manifest.json');
  const captions=fs.readFileSync(new URL('narration.zh.vtt',root),'utf8');
  for(const s of spec.segments) {
    const voice=rendered.segments.find(v=>v.id===s.id);
    assert.equal(voice.text,s.text);
    assert.equal(voice.start,s.start);
    assert.ok(voice.start+voice.renderedSeconds<=s.end+.04);
    assert.ok(fs.statSync(new URL('audio/'+voice.file,root)).size>44);
    assert.ok(captions.includes(s.text));
    assert.ok(voice.loudness.integratedLUFS>=-19.5 && voice.loudness.integratedLUFS<=-16.5);
    assert.ok(voice.loudness.truePeakDBTP<=-1.8);
  }
});
