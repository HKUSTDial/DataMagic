// Internal browser acceptance: new input -> real render -> download -> editable draft.
const {chromium}=require(process.env.DATAMAGIC_PLAYWRIGHT || '/home/xieyupeng/000LianTong/softcopy_screenshot_tools/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.DATAMAGIC_QA_BROWSER || '/home/xieyupeng/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',args:['--no-sandbox']});
  try{
    const base=process.env.DATAMAGIC_WORKBENCH_URL || 'http://10.123.4.51:5185';
    const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];
    const reuse=process.env.DATAMAGIC_QA_JOB;
    let job=reuse?{id:reuse}:null;
    const names=['河畔店','公园店','车站店','校园店'], values=[96,81,65,48];
    page.on('pageerror',e=>errors.push(e.message));await page.goto(reuse?`${base}/?job=${reuse}`:base);
    await page.waitForFunction(()=>document.querySelector('[name=title]').value.length>0);
    if(!reuse){
    await page.locator('[name=title]').fill('四家咖啡店，谁的销量更高？');
    await page.locator('[name=question]').fill('四家门店日均销量，从第四名开始揭晓。');
    await page.locator('[name=metricLabel]').fill('日均销量');
    await page.locator('[name=unit]').fill('杯');
    await page.locator('[name=takeaway]').fill('河畔店领先第二名 15 杯；示例仅用于测试。');
    await page.locator('[name=source]').fill('来源：内部合成测试数据，不是真实经营统计。');
    for(let i=0;i<4;i++){
      const row=page.locator('.row').nth(i);
      await row.locator('[data-key=label]').fill(names[i]);
      await row.locator('[data-key=value]').fill(String(values[i]));
      await row.locator('[data-key=caption]').fill(`${names[i]}：${values[i]} 杯。`);
    }
    // Exercise the invalid-input path before expensive rendering.
    await page.locator('[name=maximum]').fill('1');await page.locator('#render').click();
    await page.waitForFunction(()=>document.querySelector('#status').textContent.startsWith('未完成：'));
    assert.equal(await page.locator('#video').isVisible(),false);
    await page.locator('[name=maximum]').fill('100');
    const responsePromise=page.waitForResponse(r=>r.url().endsWith('/api/render')&&r.status()===202);
    await page.locator('#render').click();job=await (await responsePromise).json();
    console.log(`Actual render started: ${job.id}`);
    }
    await page.waitForFunction(()=>document.querySelector('#status').textContent.startsWith('已完成真实视频'),null,{timeout:600000});
    const status=await (await page.request.get(`${base}/api/jobs/${job.id}`)).json();
    assert.equal(status.status,'ready');assert.equal(status.desktopValidated,false);
    const source=await (await page.request.get(`${base}${status.data}`)).json();
    assert.equal(source.title,'四家咖啡店，谁的销量更高？');assert.deepEqual(source.rows.map(r=>r.value),values);
    const video=page.locator('#video');await video.evaluate(v=>v.play());
    await page.waitForFunction(()=>document.querySelector('#video').currentTime>0.2);await video.evaluate(v=>v.pause());
    await page.locator('#timeline button').nth(4).click();
    await page.waitForFunction(()=>Math.abs(document.querySelector('#video').currentTime-5.8)<.1,null,{timeout:10000});
    assert.ok(Math.abs(await video.evaluate(v=>v.currentTime)-5.8)<.1);
    const archive=await page.request.get(`${base}${status.package}`);assert.ok(archive.ok());assert.ok((await archive.body()).length>100000);
    await page.screenshot({path:'/tmp/datamagic-workbench-desktop.png',fullPage:true});
    await page.locator('[name=title]').fill('修改后尚未重新生成');assert.match(await page.locator('#version').textContent(),/上次渲染/);
    await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.screenshot({path:'/tmp/datamagic-workbench-mobile.png',fullPage:true});assert.deepEqual(errors,[]);
    const folder=`/home/xieyupeng/DataMagicGitHub/cards/out/workbench/${job.id}`;
    const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','stream=width,height,nb_frames:format=duration','-of','json',`${folder}/package/preview.mp4`],{encoding:'utf8'}));
    assert.equal(probe.streams[0].nb_frames,'300');assert.equal(probe.streams[0].width,1920);
    execFileSync('/tmp/datamagic-jianying-venv/bin/python',[`${folder}/package/draft_tool.py`,'--check-only'],{stdio:'inherit'});
    const draftRoot=`${folder}/structure-check`;fs.mkdirSync(draftRoot);
    execFileSync('/tmp/datamagic-jianying-venv/bin/python',[`${folder}/package/draft_tool.py`,'--draft-root',draftRoot,'--name','Coffee-Test','--platform','windows'],{stdio:'inherit'});
    const draft=JSON.parse(fs.readFileSync(`${draftRoot}/Coffee-Test/draft_content.json`));
    assert.deepEqual(draft.tracks.map(t=>t.type),['video','text']);assert.equal(draft.tracks[0].segments.length,6);assert.equal(draft.tracks[1].segments.length,6);
    const report={job:job.id,title:source.title,values,actualVideo:true,videoProbe:probe,shots:6,editableCaptions:6,zipBytes:(await archive.body()).length,invalidDataRejected:true,stalePreviewWarning:true,mobileOverflow:false,browserErrors:errors,macDesktopValidated:false};
    fs.writeFileSync(`${folder}/acceptance.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
