import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {LIST_VIDEO_LIMIT, videoSource, posterSource, videoBytes, defaultDataSaver, releaseVideo} from '../gallery/media-policy.js';

const app = fs.readFileSync(new URL('../gallery/app.js', import.meta.url), 'utf8');

test('gallery cards lazy-load posters and do not autoplay before observation', () => {
  assert.match(app, /loading="\$\{imageLoading\}" decoding="async"/);
  assert.match(app, /data-managed-media preload="none"/);
  assert.equal(LIST_VIDEO_LIMIT, 2);
  assert.doesNotMatch(app, /data-managed-media preload="none"[^;]+autoplay/);
  assert.doesNotMatch(app, /<video \$\{videoAttributes\} poster=/);
});

test('gallery loads only visible playable media and releases other sources', () => {
  assert.doesNotMatch(app, /mediaLoadObserver/);
  assert.match(app, /mediaPlaybackObserver = new IntersectionObserver/);
  assert.match(app, /\{threshold: \[0, 0\.55, 1\]\}/);
  assert.match(app, /releaseVideo\(video\)/);
  assert.match(app, /document\.addEventListener\('visibilitychange', syncCardPlayback\)/);
});

test('light video selection preserves an explicit HD path and actual byte counts', () => {
  const item = {preview:{mp4:'original.mp4',listMp4:'lite.mp4',originalBytes:9000000,listBytes:700000}};
  assert.equal(videoSource(item),'lite.mp4');assert.equal(videoSource(item,true),'original.mp4');
  assert.equal(videoBytes(item),700000);assert.equal(videoBytes(item,true),9000000);
  assert.equal(videoSource({preview:{mp4:'small.mp4'}}),'small.mp4');
});

test('explicit data saver preference overrides network hints', () => {
  const storage = value => ({getItem:()=>value});
  assert.equal(defaultDataSaver(storage(null),{saveData:true}),true);
  assert.equal(defaultDataSaver(storage('off'),{saveData:true}),false);
  assert.equal(defaultDataSaver(storage('on'),{}),true);
  assert.equal(defaultDataSaver(storage(null),{effectiveType:'2g'}),true);
  assert.equal(defaultDataSaver(storage(null),undefined),false);
});

test('release stops playback and clears the media source once, allowing poster display', () => {
  let src = 'lite.mp4', pauses = 0, loads = 0;
  const video = {pause:()=>pauses++,hasAttribute:()=>Boolean(src),removeAttribute:()=>{src=null;},load:()=>loads++};
  releaseVideo(video);assert.equal(src,null);assert.equal(pauses,1);assert.equal(loads,1);
  releaseVideo(video);assert.equal(loads,1);assert.equal(pauses,2);
});

test('preview dialogs release video resources when closed', () => {
  for (const dialog of ['detail', 'selectorDialog', 'compareDialog']) {
    assert.match(app, new RegExp(`\\$\\('#${dialog}'\\)\\.addEventListener\\('close'`));
  }
  assert.match(app, /video\.removeAttribute\('src'\)/);
  assert.match(app, /video\.load\(\)/);
});
test('updated video and poster identity bypasses stale browser media caches', () => {
  const item = {preview:{mp4:'original.mp4', listMp4:'lite.mp4', poster:'poster.png', assetVersion:'abcd1234'}};
  assert.equal(videoSource(item), 'lite.mp4?v=abcd1234');
  assert.equal(videoSource(item,true), 'original.mp4?v=abcd1234');
  assert.equal(posterSource(item), 'poster.png?v=abcd1234');
});
