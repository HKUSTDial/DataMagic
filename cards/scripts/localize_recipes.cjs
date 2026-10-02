const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const library = JSON.parse(fs.readFileSync(path.join(root, 'gallery/api/library.json')));
const notes = require('./recipe-language-notes.cjs');
const archive = path.join(root, 'references/recipe-language-source');
const han = /[\u3400-\u9fff]/;
const headings = {
  'Use':'适用场景', 'Purpose':'用途', 'Data contract':'数据契约', 'Data and map contract':'数据与地图契约',
  'Data and asset contract':'数据与素材契约', 'Animation contract':'动画契约', 'Camera contract':'镜头契约',
  'Motion contract':'运动契约', 'Data and layout contract':'数据与布局契约', 'Review':'检查项', 'Review constraints':'检查项',
  'Native implementation':'实现源码', 'Files':'文件', 'Integration':'接入方式', 'Acceptance':'验收', 'Misuse':'误用提醒',
  'Composition safeguards':'画面保护约束', 'Entity imagery':'对象图像', '素材与数据':'Media and data',
  '运动与验收':'Motion and acceptance', '跟踪契约':'Tracking contract', '数据契约':'Data contract',
  '镜头结构':'Shot structure', '使用':'Usage', '中文':'Chinese', 'English':'英文',
};
const fields = {'Component':'组件', 'Schema':'数据结构', 'Data':'示例数据', 'Default data':'默认数据', 'Alternate data':'备用数据',
  'Composition':'渲染标识', 'Alternate composition':'备用渲染标识', 'Output':'输出规格', 'Native output':'输出规格',
  'Sample presenter':'主持素材', 'Timing helpers':'时间辅助函数', 'Shared timing':'共享时间函数', 'Preview':'预览',
  'Native implementation':'实现源码', 'Camera utility':'镜头函数', 'Delivery':'交付规格'};

// Existing translated paragraphs are retained, not summarized. English-only
// constraints have reviewed Chinese counterparts in recipe-language-notes.cjs.
function nativeBody(source, lang) {
  let code = false, section = '', body = [], out = [];
  const flush = () => {
    if (body.some(x => x.trim())) out.push((section ? `${section}\n\n` : '') + body.join('\n').trim());
    body = [];
  };
  for (let line of source.split('\n').slice(1)) {
    if (line.startsWith('```')) {code = !code; body.push(line); continue;}
    if (code) {body.push(line); continue;}
    if (/^#{1,3} /.test(line)) {
      flush();
      const level = line.match(/^#+/)[0].length;
      const text = line.replace(/^#+ /, '');
      const parts = text.split(' / ');
      let title = parts.find(p => han.test(p) === (lang === 'zh'));
      if (!title) title = headings[text] || text;
      if (['用途','适用场景','Purpose','Use'].includes(title)) title = lang === 'zh' ? '适用情境' : 'Use cases';
      if (title === 'Render') title = 'Original render example';
      section = `${'#'.repeat(Math.max(2, level))} ${title}`;
      continue;
    }
    if (!line.trim()) {body.push(''); continue;}
    if (/^- (?:ID|Recipe key|Category|Compatible|Tags|中文)[:：]/.test(line)) continue;
    const field = line.match(/^- ([A-Za-z ]+): (.*)/);
    if (field && fields[field[1]]) {
      if (lang === 'en') body.push(line);
      else if (!/[A-Za-z]{3,} [A-Za-z]{3,}/.test(field[2].replace(/`[^`]*`/g, ''))) body.push(`- ${fields[field[1]]}：${field[2]}`);
      continue;
    }
    if (/^(?:- )?`[^`]+`\s*$/.test(line)) {body.push(line); continue;}
    if (lang === 'en' && han.test(line) && /^[A-Za-z]/.test(line)) {
      const prefix = line.slice(0, line.search(han)).trim();
      if (prefix) body.push(prefix);
      continue;
    }
    if (han.test(line) === (lang === 'zh')) {
      // Bilingual inline field prefixes are labels only, not identifiers.
      if (lang === 'zh') {
        line = line.replace(/ \/ entity item `iconSrc`/, '');
        if (/^[A-Za-z]/.test(line)) line = line.slice(line.search(han));
      }
      body.push(line);
    }
  }
  flush();
  return out.join('\n\n');
}

function recipe(card, source, lang) {
  const zh = lang === 'zh', name = card.name[lang], s = card.source;
  const composition = s.renderCompositionId || s.previewCompositionId || card.id;
  const text = zh ? {
    key:'配方标识', use:'用途', files:'源码与数据', component:'组件源码', schema:'数据结构', sample:'示例数据',
    setup:'开始使用', notes:'数据与制作约束', render:'渲染', review:'交付检查',
  } : {key:'Recipe key', use:'Purpose', files:'Source and data', component:'Component', schema:'Schema', sample:'Sample data',
    setup:'Getting started', notes:'Data and authoring constraints', render:'Render', review:'Delivery review'};
  const github = 'https://github.com/HKUSTDial/DataMagic';
  const switchLink = zh ? `[English](en/${card.slug}.md)` : `[中文](../${card.slug}.md)`;
  let result = `# ${name}\n\n${switchLink} · [GitHub](${github})\n\n- ${text.key}：\`${card.slug}\`\n\n## ${text.use}\n\n${card.description[lang]}\n\n## ${text.setup}\n\n`;
  result += zh
    ? `首次使用，可把 [DataMagic 仓库](${github}) 交给编程智能体，请它配置 \`datamagic\` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](${github}/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 \`cards/\` 目录。\n\n`
    : `Give the [DataMagic repository](${github}) to your coding agent and ask it to configure the \`datamagic\` Skill and use this recipe. Reuse an existing checkout when available. Supply your data, media and requested changes. See the [setup guide](${github}/blob/main/skills/datamagic/README.md). File paths below are relative to \`cards/\`.\n\n`;
  result += `## ${text.files}\n\n- ${text.component}：\`${s.component}\`\n- ${text.schema}：\`${s.schema}\`\n- ${text.sample}：\`${s.sampleData}\`\n`;
  if (s.entryComponent) result += `- ${zh ? '渲染入口' : 'Render entry'}：\`${s.entryComponent}\`\n`;
  if (s.exportName) result += `- ${zh ? '导出组件' : 'Component export'}：\`${s.exportName}\`\n`;
  if (s.adapter !== 'datamagic') result += `- ${zh ? '示例预览：无声；加入旁白后需单独对齐时间。' : 'Sample media: silent preview; align timing separately when adding narration.'}\n`;
  if (s.adapter === 'datamagic') {
    result += `\n## ${text.notes}\n\n` + (zh
      ? '替换数据时，同步调整 `sceneContent.data` 与 `sceneContent.template_payload` 的对应字段；文字场景同步修改标题、正文、要点与其参数。改标签后同步调整 `scene.animations` 的高亮对象。按组件和共享函数支持的数据结构修改，不把数值或文字烘焙成图片。\n\n'
      : 'Replace `sceneContent.data` and matching `sceneContent.template_payload` fields together. Text scenes use titles, copy, bullets and their payload fields. Update targets in `scene.animations` when changing labels. Follow the supported component data shape and keep values and text programmatic.\n\n');
    const r = card.runtime || {};
    for (const [key, label] of [['dataContract', zh?'数据契约标识':'Data contract'], ['entrance',zh?'入场策略标识':'Entrance strategy'], ['emphasis',zh?'高亮策略标识':'Emphasis strategy'], ['triggerPhrase',zh?'示例触发词':'Sample trigger'], ['highlightTargets',zh?'高亮对象':'Highlight targets']]) {
      if (r[key]) result += `- ${label}：\`${Array.isArray(r[key]) ? r[key].join(', ') : r[key]}\`\n`;
    }
    result += zh ? '\n标签、高亮触发词和解读必须随数据更新，不能保留与新数据不符的示例旁白。默认渲染规格为 1280×720、30fps、180 帧（6 秒）；网站预览可能来自另一次更高分辨率输出。\n' : '\nUpdate labels, triggers and commentary with the data; do not retain mismatched sample narration. The default render is 1280×720, 30fps, 180 frames (6 seconds); gallery media may be a separate higher-resolution output.\n';
  } else {
    result += `\n${nativeBody(source, lang)}\n`;
    if (notes[lang][card.slug]) {
      const content = zh ? notes[lang][card.slug].split('。').filter(Boolean).map(s => `- ${s}。`).join('\n') : notes[lang][card.slug];
      result += `\n## ${zh ? '补充制作约束' : 'Additional authoring constraints'}\n\n${content}\n`;
    }
  }
  result += `\n## ${text.render}\n\n` + (zh ? '在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。\n\n' : 'Install dependencies and render from `cards/`. Use the resolution, duration and frame rate declared by the composition and recipe.\n\n');
  result += `\`\`\`bash\nnpm ci\nnpx remotion render src/index.ts ${composition} out/${card.slug}.mp4 --props=${s.sampleData}\n\`\`\`\n\n## ${text.review}\n\n`;
  result += zh
    ? '核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。\n'
    : 'Verify input/output values, labels, units, entity identities, icons and colors. Inspect opening, middle, every reveal and ending for overlap, clipping, contrast, continuity and reading holds; check narration/caption synchronization when audio is present. Label demonstration data and generated media. Deliver MP4, editable source, props and a reproducible render command.\n';
  return result;
}

function build() {
  fs.mkdirSync(archive, {recursive:true});
  for (const card of library.cards) {
    const original = path.join(archive, `${card.slug}.md.txt`);
    if (!fs.existsSync(original)) fs.copyFileSync(path.join(root, 'recipes', `${card.slug}.md`), original);
    const source = fs.readFileSync(original, 'utf8');
    for (const lang of ['zh','en']) {
      const relative = `recipes/${lang === 'en' ? 'en/' : ''}${card.slug}.md`;
      for (const prefix of ['', 'gallery/']) {
        const file = path.join(root, prefix, relative);
        fs.mkdirSync(path.dirname(file), {recursive:true});
        fs.writeFileSync(file, recipe(card, source, lang));
      }
    }
  }
  console.log(`Built ${library.cards.length} Chinese and English recipes; original documents retained.`);
}
if (require.main === module) build();
module.exports = {build};
