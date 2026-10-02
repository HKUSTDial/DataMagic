const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || '/home/xieyupeng/000LianTong/softcopy_screenshot_tools/node_modules/playwright');
const base = process.env.GALLERY_URL || 'https://datamagic.chat/cards/';
(async () => {
  const local = fs.readFileSync(path.resolve(__dirname, '../gallery/api/library.json'));
  const response = await fetch(base + 'api/library.json?verify=entity-icons');
  assert(response.ok);
  assert.equal(await response.text(), local.toString());
  const browser = await chromium.launch({headless: true, executablePath: process.env.CHROME_PATH || '/home/xieyupeng/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome', args: ['--no-sandbox']});
  const errors = [];
  try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + 'index.html#BarChartRace', {waitUntil: 'domcontentloaded'});
    await page.waitForSelector('#detail[open] video');
    const video = page.locator('#detail[open] video');
    await video.evaluate(v => {v.muted = true; v.play().catch(() => {});});
    await page.waitForFunction(() => {
      const video = document.querySelector('#detail[open] video');
      return video && video.currentTime > 0 && video.videoWidth > 0;
    }, null, {timeout: 60000});
    const info = await video.evaluate(v => ({width: v.videoWidth, height: v.videoHeight, time: v.currentTime, src: v.currentSrc}));
    assert(info.src.includes('?v='));
    await page.screenshot({path: path.resolve(__dirname, '../out/entity-icons-public-desktop.png')});
    await page.setViewportSize({width: 390, height: 844});
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({path: path.resolve(__dirname, '../out/entity-icons-public-mobile.png')});
    assert.equal(errors.length, 0);
    console.log(JSON.stringify({cards: 139, playback: info, errors, mobileOverflow: false}));
  } finally {await browser.close();}
})().catch(error => {console.error(error); process.exitCode = 1;});
