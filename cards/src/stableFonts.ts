import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

// Full CJK faces avoid worker-dependent fallback while subset stylesheets load.
// Font files are local: previews and standalone renders need no font network.
if (typeof document !== 'undefined') {
  const handle = delayRender('Load complete Cards fonts');
  Promise.all([400, 700].map(async weight => {
    const font = new FontFace('Noto Sans SC', `url(${staticFile(`fonts/noto-sans-sc-${weight}.woff2`)})`, {weight: String(weight)});
    await font.load();
    document.fonts.add(font);
  })).then(async () => {
    await Promise.all([400, 600, 700].map(weight => document.fonts.load(`${weight} 24px Inter`)));
    await document.fonts.ready;
    continueRender(handle);
  }).catch(cancelRender);
}
