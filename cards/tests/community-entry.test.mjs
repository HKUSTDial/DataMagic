import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

test('both homepages place the two community entries before getting started', () => {
  for (const name of ['README.md', 'README.en.md']) {
    const text = read(name);
    assert.equal(text.split('<a id="community"></a>').length, 2);
    assert.ok(text.indexOf('<a id="community"></a>') < text.indexOf('<a id="create"></a>'));
    const section = text.split('<a id="community"></a>')[1].split('<a id="create"></a>')[0];
    assert.match(section, /wechat-community-qr\.jpg/);
    assert.match(section, /wechat-qr-xiege\.jpg/);
    assert.doesNotMatch(section, /wechat-qr-dial-lab/);
    assert.match(section, /管理员|administrator/);
    assert.match(section, /\|:---:\|:---:\|/);
  }
});

test('gallery community QR assets match the original images', () => {
  const html = read('cards/gallery/index.html');
  assert.match(html, /id="communityOpen"[^>]*aria-controls="communityDialog"/);
  assert.match(html, /id="communityDialog"[^>]*aria-labelledby="communityTitle"/);
  for (const name of ['wechat-community-qr.jpg', 'wechat-qr-xiege.jpg']) {
    assert.match(html, new RegExp(`media/community/${name.replaceAll('.', '\\.')}`));
    assert.deepEqual(fs.readFileSync(path.join(root, 'images', name)), fs.readFileSync(path.join(root, 'cards/gallery/media/community', name)));
  }
  assert.doesNotMatch(html, /wechat-qr-dial-lab/);
});
