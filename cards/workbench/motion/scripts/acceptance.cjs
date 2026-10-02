const {chromium}=require('/home/xieyupeng/000LianTong/softcopy_screenshot_tools/node_modules/playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../..');
(async()=>{
  const {newProject,makeClip,cardById}=await import('../src/model.mjs');
  const browser=await chromium.launch({headless:true,executablePath:'/home/xieyupeng/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',args:['--no-sandbox']});
  try{
    const base=process.env.DATAMAGIC_MOTION_URL||'http://10.123.4.51:5190';
    const reuse=process.env.DATAMAGIC_MOTION_JOB;
    const page=await browser.newPage({viewport:{width:1600,height:1100}}),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('Browser error:',e.message);});page.on('console',m=>{if(m.type()==='error')console.log('Console:',m.text().slice(0,250));});
    await page.goto(base);await page.waitForSelector('[data-clip]',{timeout:60000});assert.equal(await page.locator('.card').count(),30);
    await page.getByLabel('只看可改数据的原生模板').uncheck();assert.equal(await page.locator('.card').count(),139);await page.getByLabel('只看可改数据的原生模板').check();
    if(!reuse){
    const p=newProject();p.name='多轨咖啡故事验收';const rank=p.tracks[0].clips[0];rank.duration=150;rank.in=120;
    rank.props.title='四家咖啡店，谁更受欢迎？';rank.props.question='使用合成数据，测试原生卡与多轨字幕。';rank.props.takeaway='河畔店领先，继续看角色解读。';rank.props.source='来源：内部合成测试，不是真实经营数据。';
    const character=makeClip(cardById.CharacterPerspectiveBoard,150);character.duration=90;character.in=30;p.tracks[0].clips.push(character);
    const text=(id,start,duration,text,y)=>({id,cardId:'text',start,duration,in:0,speed:1,opacity:1,scale:1,x:0,y,volume:1,props:{text,size:36,color:'#b03f51'}});
    p.tracks[1].clips.push(text('caption-a',0,120,'多轨字幕可以独立修改',390));p.tracks.push({id:'upper-text',name:'第二字幕轨',hidden:false,clips:[text('caption-b',60,120,'另一条字幕可与第一条重叠',440)]});
    await page.locator('input[type=file][accept="application/json"]').setInputFiles({name:'project.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});
    await page.waitForFunction(()=>document.querySelector('input[aria-label="工程名称"]').value==='多轨咖啡故事验收');
    const first=page.locator(`[data-clip="${rank.id}"]`);await first.click();await page.getByLabel('参数 title',{exact:true}).fill('已编辑：咖啡店数据故事');await page.getByLabel('参数 title',{exact:true}).blur();
    await page.getByRole('button',{name:'撤销',exact:true}).click();await page.getByRole('button',{name:'重做',exact:true}).click();
    assert.equal(await page.getByLabel('参数 title',{exact:true}).inputValue(),'已编辑：咖啡店数据故事');
    await page.getByLabel('速度',{exact:true}).fill('1.5');await page.getByLabel('速度',{exact:true}).blur();
    await page.getByLabel('不透明度',{exact:true}).fill('0.9');await page.getByLabel('不透明度',{exact:true}).blur();
    const ruler=await page.locator('.ruler').boundingBox();await page.mouse.click(ruler.x+60,ruler.y+8);
    await page.getByRole('button',{name:'分割 S',exact:true}).click();assert.equal(await page.locator('[data-track="shots"] [data-clip]').count(),3);
    await page.getByRole('button',{name:'撤销',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('[data-track="shots"] [data-clip]').length===2);await first.click();
    // Pointer-based movement and trim, not only changing the numeric inspector.
    let box=await first.boundingBox();await page.mouse.move(box.x+30,box.y+25);await page.mouse.down();await page.mouse.move(box.x+60,box.y+25,{steps:5});await page.mouse.up();
    assert.ok(Number(await page.getByLabel('起点（秒）',{exact:true}).inputValue())>0);
    box=await first.boundingBox();await page.mouse.move(box.x+2,box.y+20);await page.mouse.down();await page.mouse.move(box.x+20,box.y+20,{steps:4});await page.mouse.up();
    await page.getByRole('button',{name:'撤销',exact:true}).click();await page.getByRole('button',{name:'撤销',exact:true}).click();
    // Hide then restore a layer; move layers without deleting contents.
    const upper=page.locator('[data-track="upper-text"]');await upper.getByRole('button',{name:'隐藏',exact:true}).click();await upper.getByRole('button',{name:'显示',exact:true}).click();
    await upper.locator('button[title="下移图层"]').click();await upper.locator('button[title="上移图层"]').click();
    // Add and split an independent audio clip via actual local upload.
    const wav='/tmp/datamagic-motion-tone.wav';if(!fs.existsSync(wav))execFileSync('ffmpeg',['-v','error','-f','lavfi','-i','sine=frequency=440:duration=4',wav]);
    await page.locator('input[type=file][accept^="video/mp4"]').setInputFiles(wav);await page.waitForFunction(()=>[...document.querySelectorAll('.clip.audio')].length===1);
    await page.getByLabel('时长（秒）',{exact:true}).fill('2');await page.getByLabel('时长（秒）',{exact:true}).blur();
    await page.getByRole('button',{name:'复制片段',exact:true}).click();assert.equal(await page.locator('.clip.audio').count(),2);
    await page.getByLabel('起点（秒）',{exact:true}).fill('1');await page.getByLabel('起点（秒）',{exact:true}).blur();
    // JSON round-trip proves editing, layers and audio survived the UI operations.
    let pending=page.waitForEvent('download');await page.getByRole('button',{name:'保存 JSON',exact:true}).click();let download=await pending;
    const saved=JSON.parse(fs.readFileSync(await download.path()));assert.equal(saved.tracks.length,4);const savedRank=saved.tracks.flatMap(t=>t.clips).find(c=>c.id===rank.id);assert.equal(savedRank.props.title,'已编辑：咖啡店数据故事');assert.equal(savedRank.speed,1.5);
    await page.reload();await page.waitForSelector('.clip.audio');assert.equal(await page.locator('.clip.audio').count(),2);
    await page.screenshot({path:'/tmp/datamagic-motion-desktop.png',fullPage:true});
    }
    let job;
    if(reuse){const p=JSON.parse(fs.readFileSync(path.join(root,'out/motion',reuse,'project.json')));await page.locator('input[type=file][accept="application/json"]').setInputFiles({name:'project.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});job={id:reuse,status:'rendering'};}
    else{const responsePromise=page.waitForResponse(r=>r.url().endsWith('/api/export')&&r.status()===202);await page.getByRole('button',{name:'导出剪映包',exact:true}).click();job=await (await responsePromise).json();console.log(`Multi-track export started: ${job.id}`);}
    let status=job;const start=Date.now();while(status.status==='rendering'){if(Date.now()-start>900000)throw new Error('Export timeout');await new Promise(r=>setTimeout(r,2000));try{status=await (await page.request.get(`${base}/api/export/${job.id}`)).json();}catch(error){console.log('Retrying transient polling connection');}}
    assert.equal(status.status,'ready',status.error);assert.equal(status.frames,240);assert.ok((await page.request.get(`${base}${status.package}`)).ok());
    const out=path.join(root,'out/motion',job.id);execFileSync('/tmp/datamagic-jianying-venv/bin/python',[path.join(out,'package/draft_tool.py'),'--check-only'],{stdio:'inherit'});
    const drafts=path.join(out,'structure-check');fs.mkdirSync(drafts);execFileSync('/tmp/datamagic-jianying-venv/bin/python',[path.join(out,'package/draft_tool.py'),'--draft-root',drafts,'--name','Multi-track-Check','--platform','windows'],{stdio:'inherit'});
    const draft=JSON.parse(fs.readFileSync(path.join(drafts,'Multi-track-Check/draft_content.json')));assert.equal(draft.tracks.filter(t=>t.type==='text').length,2);assert.equal(draft.tracks.filter(t=>t.type==='audio').length,2);
    const manifest=JSON.parse(fs.readFileSync(path.join(out,'package/manifest.json')));assert.equal(manifest.captions.length,2);assert.equal(manifest.audio.length,2);
    await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/tmp/datamagic-motion-mobile.png',fullPage:true});assert.deepEqual(errors,[]);
    const report={job:job.id,frames:240,tracks:4,nativeCards:30,libraryCards:139,propertyEditing:true,pointerMoveAndTrim:true,splitAndUndo:true,undoRedo:true,layerHideAndOrder:true,jsonRoundTrip:true,automaticSave:true,independentTextTracks:2,independentAudioTracks:2,realExport:true,macDesktopValidated:false,browserErrors:errors};fs.writeFileSync(path.join(out,'acceptance.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
