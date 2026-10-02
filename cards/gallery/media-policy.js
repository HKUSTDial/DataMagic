export const LIST_VIDEO_LIMIT = 2;
export const versionedAsset = (item, source) => source && item.preview?.assetVersion ? `${source}${source.includes('?') ? '&' : '?'}v=${encodeURIComponent(item.preview.assetVersion)}` : source;
export const posterSource = item => versionedAsset(item, item.preview?.poster);
export const videoSource = (item, hd = false) => versionedAsset(item, hd ? item.preview?.mp4 : (item.preview?.listMp4 || item.preview?.mp4));
export const videoBytes = (item, hd = false) => hd ? item.preview?.originalBytes : (item.preview?.listBytes || item.preview?.originalBytes);
export const formatBytes = bytes => Number.isFinite(bytes) ? (bytes < 1000000 ? `${Math.round(bytes/1000)} KB` : `${(bytes/1000000).toFixed(2)} MB`) : '';
export function defaultDataSaver(storage, connection) {
  const saved = storage.getItem('dvsc-data-saver');
  return saved === 'on' || (saved !== 'off' && Boolean(connection?.saveData || ['slow-2g','2g'].includes(connection?.effectiveType)));
}
export function releaseVideo(video) {
  video.pause();
  if (video.hasAttribute('src')) {
    video.removeAttribute('src');
    video.load();
  }
}
