const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'../../..'),out=path.join(root,'assets/walkthrough');
const url=process.env.WALKTHROUGH_URL||'http://127.0.0.1:18640';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
 try{
  if(!process.argv.includes('--evidence-only')){
  const context=await browser.newContext({viewport:{width:1280,height:640},recordVideo:{dir:path.join(root,'cards/out/walkthrough-recordings'),size:{width:1280,height:640}}});
  await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:url});
  const page=await context.newPage();
  await page.goto(url+'/cards/gallery/index.html');await page.waitForSelector('.card');
  const search=page.locator('#search');await search.fill('BarChartRace');await wait(500);
  await page.screenshot({path:path.join(out,'gallery-selected.png')});
  await page.locator('[data-action="detail"][data-id="ShotCraft-BarChartRace"]').click();
  await page.waitForFunction(()=>document.querySelector('#detailBody video')?.readyState>=2);
  await wait(4000);await page.locator('#detailCopy').click();
  const copied=await page.evaluate(()=>navigator.clipboard.readText());
  if(!copied.includes('BarChartRace')||!copied.toLowerCase().includes('source'))throw Error('Copied instructions incomplete');
  fs.writeFileSync(path.join(__dirname,'copied-implementation.txt'),copied+'\n');
  await wait(1500);await page.screenshot({path:path.join(out,'gallery-copy.png')});
  const recording=page.video();await page.close();await recording.saveAs(path.join(out,'gallery-recording.webm'));await context.close();
  }
  const evidence=await browser.newPage({viewport:{width:1280,height:640}});
  for(const step of ['intro','data','brief','run','revision','check']){
   await evidence.goto(url+'/assets/walkthrough/review.html?step='+step);
   await evidence.waitForFunction(()=>window.ready===true);
   await evidence.screenshot({path:path.join(out,step+'.png')});
  }
  console.log(process.argv.includes('--evidence-only')?'Updated evidence screenshots; retained existing gallery recording.':'Captured real gallery interaction; copied brief verified; evidence pages captured.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
