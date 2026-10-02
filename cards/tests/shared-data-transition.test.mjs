import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const data=JSON.parse(read('../templates/shared-data-element-transition/sample-data.json'));
test('shared transition focus resolves to one unchanged datum',()=>{assert.ok(data.focusIndex>=0&&data.focusIndex<data.data.length);const focus=data.data[data.focusIndex];assert.equal(focus.label,'研发');assert.equal(focus.value,68);});
test('shared transition is frame driven and reserves a final hold',()=>{const source=read('../templates/shared-data-element-transition/SharedDataElementTransition.tsx');assert.match(source,/useCurrentFrame/);assert.match(source,/durationInFrames-fps-1/);assert.doesNotMatch(source,/animation:/);});
