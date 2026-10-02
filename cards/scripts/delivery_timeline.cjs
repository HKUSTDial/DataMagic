const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function timeline(props) {
  const schema = JSON.parse(fs.readFileSync(path.join(__dirname, '../templates/ranked-reveal/schema.json')));
  const Validator = schema.$schema?.includes('2020-12') ? require('ajv/dist/2020').default : require('ajv');
  const validate = new Validator({strict:false}).compile(schema);
  assert.ok(validate(props), `Unsupported or missing input fields: ${JSON.stringify(validate.errors)}`);
  for (const [key, spec] of Object.entries(schema.properties)) if (spec.type === 'string' && props[key] !== undefined) {
    assert.equal(typeof props[key], 'string', key);
    assert.ok(props[key].length >= (spec.minLength || 0) && props[key].length <= (spec.maxLength ?? Infinity), key);
    assert.ok(!/[\r\n\0]/.test(props[key]), key);
  }
  assert.ok(Number.isFinite(props.maximum) && props.maximum > 0);
  assert.ok(Array.isArray(props.rows) && props.rows.length >= 2 && props.rows.length <= 4, 'Delivery supports 2–4 rows; five rows need layout review');
  const sorted = [...props.rows].sort((a, b) => a.at - b.at);
  assert.equal(new Set(sorted.map(r => r.id)).size, sorted.length);
  for (const [i, r] of sorted.entries()) {
    assert.ok(Object.keys(r).every(key => ['at','caption','id','label','value','iconSrc','color'].includes(key)));
    assert.ok(typeof r.id === 'string' && r.id.length > 0);
    assert.ok(typeof r.label === 'string' && r.label.length > 0 && r.label.length <= 18);
    assert.ok(typeof r.caption === 'string' && r.caption.length > 0 && r.caption.length <= 55 && !/[\r\n\0]/.test(r.caption));
    assert.ok(Number.isFinite(r.value) && r.value >= 0 && r.value <= props.maximum);
    assert.ok(Number.isFinite(r.at) && r.at >= 0 && r.at <= 7.5);
    assert.ok(i === 0 || r.at - sorted[i - 1].at >= .8, 'Reveals need readable spacing');
  }
  const fps = 30, totalFrames = 300;
  // First frame satisfying seconds >= at, matching the actual component.
  const ceilFrame = s => Math.ceil(s * fps - 1e-9);
  const end = ceilFrame(sorted.at(-1).at + 1.2);
  assert.ok(totalFrames - end >= fps, 'Conclusion needs at least one second');
  const cues = [{startFrame:0,text:'从榜单末位开始，逐项揭晓。'}, ...sorted.map(r => ({startFrame:ceilFrame(r.at), text:r.caption})), {startFrame:end,text:props.takeaway}];
  const captions = cues.map((c, i) => ({...c, endFrame:cues[i + 1]?.startFrame ?? totalFrames})).filter(c => c.endFrame > c.startFrame && c.text);
  const cuts = [...new Set([0, ...sorted.map(r => ceilFrame(r.at)), end, totalFrames])].sort((a,b)=>a-b);
  return {version:1, recipe:'RankedReveal', fps, width:1920, height:1080, totalFrames,
    assets:[{id:'plate',path:'media/plate.mp4',type:'video'}],
    shots:cuts.slice(0,-1).map((startFrame,i)=>({id:`shot-${i+1}`,startFrame,endFrame:cuts[i+1],asset:'plate',sourceStartFrame:startFrame})),
    captions, audio:[], textStyle:{size:2.8,transformX:-.63,transformY:.02,maxLineWidth:.28},
    capabilities:{editable:['shot-order','shot-trim','captions','audio'],baked:['chart-data','chart-labels','title','source','chart-animation']},
    timingAuthority:'authored-template-events-not-measured-speech'};
}
function srt(manifest) {
  const stamp = f => {
    const ms = Math.round(f * 1000 / manifest.fps);
    return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`;
  };
  return manifest.captions.map((c,i)=>`${i+1}\n${stamp(c.startFrame)} --> ${stamp(c.endFrame)}\n${c.text}\n`).join('\n');
}
module.exports={timeline,srt};
