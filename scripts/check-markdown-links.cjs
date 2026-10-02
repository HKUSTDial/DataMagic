// Check every changed document, but request each shared URL only once.
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const extract = require('markdown-link-extractor');
const check = require('markdown-link-check');
const config = JSON.parse(fs.readFileSync('.markdown-link-check.json', 'utf8'));
const files = (process.env.FILES || '').split('\n').filter(f => f && fs.existsSync(f));
const owners = new Map();
let references = 0;
for (const file of files) {
  const base = pathToFileURL(path.resolve(file));
  for (const raw of extract(fs.readFileSync(file, 'utf8'))) {
    if (config.ignorePatterns?.some(p => new RegExp(p.pattern).test(raw))) continue;
    let url = new URL(raw, base).href;
    const ownFile = /^https:\/\/github\.com\/HKUSTDial\/DataMagic\/blob\/main\/([^?#]+)(?:[?#].*)?$/.exec(url);
    // A link into this same repository is checked against the checked-out
    // files (including new PR files), not GitHub's rate-limited HTML renderer.
    if (ownFile) url = pathToFileURL(path.resolve(decodeURIComponent(ownFile[1]))).href;
    if (!owners.has(url)) owners.set(url, new Set());
    owners.get(url).add(file);
    references++;
  }
}
console.log(`Checking ${files.length} documents, ${references} references, ${owners.size} unique links.`);
const markdown = [...owners.keys()].map(url => `[link](<${url}>)`).join('\n');
check(markdown, {...config, baseUrl: pathToFileURL(process.cwd() + path.sep).href}, (error, results) => {
  if (error) {console.error(error.message); process.exitCode = 1; return;}
  const dead = results.filter(r => r.status === 'dead');
  for (const result of dead) console.error(`Broken link: ${result.link}\nDocuments: ${[...owners.get(result.link) || []].join(', ')}`);
  console.log(`Checked ${results.length} unique links; ${dead.length} broken.`);
  if (dead.length) process.exitCode = 1;
});
