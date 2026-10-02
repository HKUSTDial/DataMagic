const fs=require('node:fs'),path=require('node:path');
const {chromium}=require('/home/xieyupeng/000LianTong/softcopy_screenshot_tools/node_modules/playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'out/entity-icons-review');
(async()=>{
  const audit=JSON.parse(fs.readFileSync(path.join(root,'out/entity-icons-audit.json')));
  const ready=audit.changedSlugs.filter(slug=>fs.existsSync(path.join(out,slug+'-final.png')));
  const browser=await chromium.launch({headless:true,executablePath:'/home/xieyupeng/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',args:['--no-sandbox']});
  try {
    for(let offset=0;offset<ready.length;offset+=12){
      const page=await browser.newPage({viewport:{width:1800,height:1590}});
      const tiles=ready.slice(offset,offset+12).map(slug=>`<article><img src="data:image/png;base64,${fs.readFileSync(path.join(out,slug+'-final.png')).toString('base64')}"><div>${slug}</div></article>`).join('');
      await page.setContent(`<style>body{margin:0;background:#dce2e9;font:20px system-ui}main{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}article{background:white;padding:6px}img{width:100%;height:337px;object-fit:contain}article div{padding:10px}</style><main>${tiles}</main>`);
      await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
      const file=path.join(out,`contact-${offset/12}.png`);await page.screenshot({path:file});await page.close();console.log(file);
    }
  } finally{await browser.close()}
  console.log(`Reviewed layout sheets for ${ready.length}/${audit.changedSlugs.length} ready cards`);
})().catch(e=>{console.error(e);process.exitCode=1});
