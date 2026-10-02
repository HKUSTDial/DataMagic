import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const source=process.argv[2];assert.match(source||'',/^[a-f0-9-]{36}$/);
const base=process.env.DATAMAGIC_MOTION_URL||'http://10.123.4.51:5190';
const project=JSON.parse(fs.readFileSync(path.join(root,'out/motion',source,'project.json')));
for(let attempt=0;attempt<40;attempt++){try{const r=await fetch(base,{signal:AbortSignal.timeout(2000)});if(r.ok)break;}catch{}if(attempt===39)throw new Error('Workbench did not start');await new Promise(r=>setTimeout(r,1000));}
const response=await fetch(`${base}/api/export`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({project,kind:'mp4'})});assert.equal(response.status,202);let status=await response.json();console.log(`Worker MP4 export: ${status.id}`);
let samples=0,maxStatusLatencyMs=0;const deadline=Date.now()+15*60*1000;
while(status.status==='rendering'){
  await new Promise(r=>setTimeout(r,1500));assert.ok(Date.now()<deadline,'Render timed out');const start=Date.now();
  const progress=await fetch(`${base}/api/export/${status.id}`,{signal:AbortSignal.timeout(5000)});assert.ok(progress.ok);status=await progress.json();maxStatusLatencyMs=Math.max(maxStatusLatencyMs,Date.now()-start);samples++;
  const editor=await fetch(base,{signal:AbortSignal.timeout(5000)});assert.ok(editor.ok,'Editor remains responsive during rendering');
}
assert.equal(status.status,'ready',status.error);assert.equal(status.frames,240);assert.ok((await fetch(`${base}${status.video}`,{method:'HEAD'})).ok);
const report={job:status.id,frames:status.frames,independentRenderProcess:true,editorResponsive:true,pollSamples:samples,maxStatusLatencyMs};fs.writeFileSync(path.join(root,'out/motion',status.id,'worker-acceptance.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
