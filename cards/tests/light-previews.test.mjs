import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import test from 'node:test';
const gallery = new URL('../gallery/',import.meta.url);
const library = JSON.parse(fs.readFileSync(new URL('api/library.json',gallery),'utf8'));

test('every list preview exists, has correct byte metadata, and never costs more than the original',()=>{
  let originalTotal=0, listTotal=0;
  for(const card of library.cards){
    const preview=card.preview;
    const original=fs.statSync(new URL(preview.mp4,gallery)).size;
    const lite=fs.statSync(new URL(preview.listMp4,gallery)).size;
    assert.equal(preview.originalBytes,original,card.slug);
    assert.equal(preview.listBytes,lite,card.slug);
    assert.ok(lite<=original,card.slug);
    assert.ok(preview.listWidth>0&&preview.listHeight>0);
    originalTotal+=original;listTotal+=lite;
  }
  assert.ok(listTotal<originalTotal*.5,'list previews should save at least half the aggregate bytes');
});

test('encoded preview URLs follow source content and MP4 metadata precedes frame data',()=>{
  for(const card of library.cards.filter(c=>c.preview.listMp4!==c.preview.mp4)){
    const hash=crypto.createHash('sha256').update(fs.readFileSync(new URL(card.preview.mp4,gallery))).digest('hex').slice(0,12);
    assert.ok(card.preview.listMp4.includes(hash),card.slug);
    const data=fs.readFileSync(new URL(card.preview.listMp4,gallery));
    const positions={};let offset=0;
    while(offset+8<=data.length){
      let size=data.readUInt32BE(offset);const type=data.toString('ascii',offset+4,offset+8);
      if(size===1)size=Number(data.readBigUInt64BE(offset+8));
      if(size===0)size=data.length-offset;
      if(size<8||offset+size>data.length)throw new Error(`Invalid MP4 box: ${card.slug}`);
      positions[type] ??= offset;offset+=size;
    }
    assert.ok(positions.moov<positions.mdat,card.slug);
  }
});
