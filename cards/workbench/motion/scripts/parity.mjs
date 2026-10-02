import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
const require=createRequire(import.meta.url);
const {chromium}=require('/home/xieyupeng/000LianTong/softcopy_screenshot_tools/node_modules/playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const id=process.argv[2];if(!/^[a-f0-9-]{36}$/.test(id||''))throw new Error('Pass a completed export ID');
const exported=path.join(root,'out/motion',id);const project=JSON.parse(fs.readFileSync(path.join(exported,'project.json')));
const output=path.join(root,'out/motion',`parity-${Date.now()}`);fs.mkdirSync(output);
const browser=await chromium.launch({headless:true,executablePath:'/home/xieyupeng/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',args:['--no-sandbox']});
try{
  const page=await browser.newPage({viewport:{width:1920,height:1400},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://10.123.4.51:5190/?parity=1');await page.waitForSelector('[data-clip]');
  await page.locator('input[type=file][accept="application/json"]').setInputFiles({name:'parity.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(project))});
  await page.addStyleTag({content:'.workspace{display:block;padding:0;margin:0}.library,.inspector,#root>header,#root>footer,.timeline-panel,.preview-heading,.transport,.status,.export-results{display:none!important}.center{padding:0;border:0;margin:0;border-radius:0;width:1920px}#motion-preview{width:1920px;height:1080px}'});
  await page.evaluate(()=>document.fonts.ready);
  const serveUrl=await bundle({entryPoint:path.join(root,'workbench/motion/src/render.tsx'),publicDir:path.join(exported,'render-public')});
  const browserExecutable=process.env.DATAMAGIC_RENDER_BROWSER||'/home/xieyupeng/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell';
  const inputProps={project};const composition=await selectComposition({serveUrl,id:'DataMagic-Motion',inputProps,browserExecutable});
  for(const frame of [30,90,210]){
    await page.evaluate(f=>window.__datamagicMotionSeek(f),frame);
    await page.waitForFunction(f=>Math.abs(Number(document.querySelector('.transport span').textContent.split(' / ')[0])-f/30)<.02,frame);
    await page.waitForFunction(()=>[...document.images].filter(i=>i.closest('#motion-preview')).every(i=>i.complete));
    await page.evaluate(()=>document.fonts.ready);await page.locator('#motion-preview').screenshot({path:path.join(output,`preview-${frame}.png`)});
    await renderStill({serveUrl,composition,inputProps,browserExecutable,frame,output:path.join(output,`render-${frame}.png`)});
  }
  if(errors.length)throw new Error(errors.join('; '));
  const script='from PIL import Image,ImageChops,ImageStat\nimport json,sys,pathlib\np=pathlib.Path(sys.argv[1]); result=[]\nfor f in [30,90,210]:\n a=Image.open(p/f"preview-{f}.png").convert("RGB"); b=Image.open(p/f"render-{f}.png").convert("RGB")\n if a.size!=b.size: raise ValueError((a.size,b.size))\n d=ImageChops.difference(a,b); mean=sum(ImageStat.Stat(d).mean)/3; result.append({"frame":f,"meanAbsoluteChannelDifference":mean,"exact":d.getbbox() is None})\n if mean>1: raise ValueError(result)\n(p/"parity.json").write_text(json.dumps(result,indent=2)); print(json.dumps(result))';
  console.log(execFileSync('/tmp/datamagic-jianying-venv/bin/python',['-c',script,output],{encoding:'utf8'}));
  console.log(`Parity artifacts: ${output}`);
}finally{await browser.close();}
