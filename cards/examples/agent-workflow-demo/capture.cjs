const fs=require('node:fs');const path=require('node:path');const {execFileSync}=require('node:child_process');
const {chromium}=require('/home/xieyupeng/000LianTong/softcopy_screenshot_tools/node_modules/playwright');
const out=path.resolve(__dirname,'../../../assets/walkthrough-v2');fs.mkdirSync(out,{recursive:true});
const privateOut=path.resolve(__dirname,'../../out/agent-workflow-private');fs.mkdirSync(privateOut,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'/home/xieyupeng/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',args:['--no-sandbox']});
 try {
 const context=await browser.newContext({viewport:{width:1920,height:1080},deviceScaleFactor:2,recordVideo:{dir:privateOut,size:{width:1920,height:1080}},permissions:['clipboard-read','clipboard-write']});
 await context.addInitScript(()=>localStorage.setItem('umami.disabled','1'));
 const page=await context.newPage();const start=Date.now();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:18642/cards/gallery/');await page.locator('[data-action="detail"]').first().waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(900);
 const offset=(Date.now()-start)/1000;
 await page.screenshot({path:path.join(out,'gallery.png')});
 await page.locator('#search').click();await page.locator('#search').pressSequentially('动态柱状图竞赛',{delay:160});await page.waitForTimeout(1400);
 await page.locator('[data-action="detail"][data-id="ShotCraft-BarChartRace"]').click();await page.waitForTimeout(4500);
 await page.screenshot({path:path.join(out,'detail-before.png')});
 const button=page.locator('#detailCopy');const bounds=await button.boundingBox();await button.screenshot({path:path.join(out,'copy-button.png')});
 await button.click();const clipboard=await page.evaluate(()=>navigator.clipboard.readText());
 if(!clipboard.includes('BarChartRace')||!clipboard.includes('Editable source'))throw Error('Wrong copied recipe');
 await page.screenshot({path:path.join(out,'detail-after.png')});await page.waitForTimeout(1600);
 fs.writeFileSync(path.join(__dirname,'copied-implementation.txt'),clipboard);
 fs.writeFileSync(path.join(out,'capture-layout.json'),JSON.stringify({viewport:{width:1920,height:1080},dpr:2,copyButton:bounds,offset,errors},null,2));
 const recording=await page.video().path();await context.close();
 execFileSync('/home/xieyupeng/miniconda3/envs/autodv/bin/ffmpeg',['-y','-hide_banner','-loglevel','error','-ss',String(offset),'-i',recording,'-t','10','-vf','fps=30','-an','-c:v','libx264','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',path.join(out,'gallery.mp4')]);
 // Verify the deployed release separately, without generating analytics events.
 const online=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});await online.addInitScript(()=>localStorage.setItem('umami.disabled','1'));
 const live=await online.newPage();await live.goto('https://datamagic.chat/cards/',{waitUntil:'domcontentloaded',timeout:60000});await live.locator('[data-action="detail"]').first().waitFor();
 const intro=await live.locator('#introCopy').textContent();if(!intro.includes('均提供'))throw Error('Online release stale');
 await live.locator('#search').fill('动态柱状图竞赛');await live.locator('[data-action="detail"][data-id="ShotCraft-BarChartRace"]').click();if(await live.locator('#detailBody a[href^="workbench"]').count())throw Error('Paused workbench advertised');
 await live.locator('#detailCopy').click();if(!(await live.evaluate(()=>navigator.clipboard.readText())).includes('Editable source'))throw Error('Online copy stale');
 await live.screenshot({path:path.join(privateOut,'online-desktop.png')});await live.setViewportSize({width:390,height:844});if(await live.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow');
 fs.writeFileSync(path.join(__dirname,'deployment-check.json'),JSON.stringify({date:new Date().toISOString(),cards:139,intro,copy:true,mobileOverflow:false,workbenchHidden:true},null,2));
 console.log('Captured real gallery and copy action; online desktop/mobile verified.');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});
