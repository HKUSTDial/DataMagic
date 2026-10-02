const {chromium}=require('/home/xieyupeng/000LianTong/softcopy_screenshot_tools/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'/home/xieyupeng/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',args:['--no-sandbox']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(process.env.DATAMAGIC_GALLERY_QA_URL || 'http://10.123.4.51:5187/');await page.waitForSelector('.card');
    assert.equal(await page.locator('.discovery-tools').getAttribute('open'),null);
    await page.locator('.discovery-tools summary').click();await page.locator('#openSelector').click();
    await page.locator('#runSelector').click();assert.equal(await page.locator('.selector-result').count(),3);
    await page.locator('#closeSelector').click();await page.locator('#openStories').click();
    await page.locator('#storyProjectTitle').fill('咖啡店销量测试');await page.locator('#storyProjectRows').fill('河畔店,96\n公园店,81\n校园店,48');
    await page.locator('#generateStoryProject').click();assert.match(await page.locator('#storyGenerated').textContent(),/尚未渲染视频/);
    const downloaded=page.waitForEvent('download');await page.locator('#downloadStoryProject').click();const download=await downloaded;
    const data=JSON.parse(fs.readFileSync(await download.path()));assert.equal(data.title,'咖啡店销量测试');assert.deepEqual(data.items.map(i=>i.value),[96,81,48]);
    for(const id of ['presenter_guided_evidence','countdown_to_winner']){await page.locator(`[data-story="${id}"]`).click();assert.equal(await page.locator('#generateStoryProject').isDisabled(),true);}
    await page.locator('#closeStories').click();await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:'/tmp/datamagic-gallery-tools-desktop.png',fullPage:false});
    await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
    console.log(JSON.stringify({selectorCandidates:3,planDataExport:true,unsupportedPlansBlocked:2,planningToolsCollapsed:true,mobileOverflow:false,errors}));
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
