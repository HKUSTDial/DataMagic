// Browser workflow simulation. This does NOT certify the real Mac application.
const {chromium}=require('/home/xieyupeng/000LianTong/softcopy_screenshot_tools/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'/home/xieyupeng/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',args:['--no-sandbox']});
  try{
    const base=process.env.DATAMAGIC_MOTION_URL||'http://10.123.4.51:5190';
    const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
    for(let i=0;i<40;i++){try{const r=await page.request.get(base,{timeout:2000});if(r.ok())break;}catch{}await new Promise(r=>setTimeout(r,1000));}
    let loaded=page.waitForResponse(r=>r.url().endsWith('/api/desktop'));await page.goto(base);await page.waitForSelector('[data-clip]');await loaded;
    const capability=await (await page.request.get(`${base}/api/desktop`)).json();assert.equal(capability.canInstall,false);assert.equal(capability.token,undefined);
    let remoteWrites=0;page.on('request',r=>{if(r.method()==='POST')remoteWrites++;});await page.getByRole('button',{name:'发送到剪映',exact:true}).click();await page.locator('.desktop-help').waitFor({state:'visible'});assert.match(await page.locator('.desktop-help').textContent(),/服务器|Mac/);assert.equal(remoteWrites,0);await page.getByRole('button',{name:'知道了',exact:true}).click();
    const denied=await page.request.post(`${base}/api/desktop/install`,{data:{exportId:'00000000-0000-0000-0000-000000000000',confirm:true,token:'invalid'}});assert.ok(!denied.ok());
    let exports=0,installs=0,fail=false;const token='synthetic-local-test-token';
    await page.route('**/api/desktop',r=>r.fulfill({json:{platform:'darwin',local:true,canInstall:true,token,reason:'Mock Mac, no actual desktop writes'}}));
    await page.route('**/api/export',r=>{exports++;assert.equal(r.request().postDataJSON().kind,'jianying');return r.fulfill({status:202,json:{id:'00000000-0000-0000-0000-000000000000',status:'ready',video:'/mock.mp4',package:'/mock.zip',project:'/mock.json'}});});
    await page.route('**/api/desktop/install',r=>{installs++;const body=r.request().postDataJSON();assert.equal(body.token,token);assert.equal(body.confirm,true);return r.fulfill({status:202,json:{id:'11111111-1111-1111-1111-111111111111',status:'installing',progress:'模拟本机依赖准备'}});});
    await page.route('**/api/desktop/install/11111111-1111-1111-1111-111111111111',r=>r.fulfill({json:fail?{status:'failed',error:'缺少可读旧草稿，未安装'}:{status:'installed',draftName:'DataMagic-模拟测试',appLaunched:true,desktopValidated:false,message:'模拟完成，未操作真实剪映。'}}));
    loaded=page.waitForResponse(r=>r.url().endsWith('/api/desktop'));await page.reload();await page.waitForSelector('[data-clip]');await loaded;
    page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'发送到剪映',exact:true}).click();assert.equal(exports,0);assert.equal(installs,0);
    page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'发送到剪映',exact:true}).click();await page.locator('.desktop-result').waitFor();assert.equal(exports,1);assert.equal(installs,1);assert.match(await page.locator('.desktop-result').textContent(),/模拟测试/);
    fail=true;page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'发送到剪映',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[role=status]').textContent.includes('缺少可读旧草稿'));assert.equal(exports,1,'current package is reused');assert.equal(installs,2);assert.equal(await page.locator('.desktop-result').count(),0,'failure must not leave stale success banner');
    await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
    console.log(JSON.stringify({remoteWritesBlocked:true,cancelDoesNotExport:true,confirmedRenderAndInstallWorkflow:true,currentPackageReused:true,installationFailureShown:true,mobileOverflow:false,browserErrors:errors,macInstallerSimulated:true,actualMacDesktopValidated:false}));
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
