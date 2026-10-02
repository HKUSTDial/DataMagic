import {posterSource} from './media-policy.js?v=entity-icons-20261002';
import {briefPreview} from './brief-preview.js?v=brief-preview-20261002';
import {implementationBrief} from './implementation-brief.js?v=datamagic-20261002';
const state = {
  lang: localStorage.getItem('dvsc-language') === 'en' ? 'en' : 'zh',
  theme: localStorage.getItem('dvsc-theme') || 'system',
};

const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
const label = value => typeof value === 'object' ? value[state.lang] : value;
const t = (zh, en) => state.lang === 'zh' ? zh : en;
let toastTimer;

const copyText = async text => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    document.body.append(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
};

const showToast = message => {
  const node = $('#toast');
  node.textContent = message;
  node.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove('show'), 1800);
};

const media = item => {
  const video = videoSource(item);
  const poster = esc(posterSource(item) || '');
  if (!video) return `<img src="${poster}" alt="">`;
  return `<span class="media-shell"><img src="${poster}" alt=""><video src="${esc(video)}" poster="${poster}" muted loop playsinline autoplay controls></video></span>`;
};

const recipePrompt = item => implementationBrief(item, state.lang);

const inlineMarkdown = text => esc(text)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

const markdownToHtml = markdown => {
  const lines = markdown.replace(/^---[\s\S]*?---\s*/, '').split(/\r?\n/);
  const html = [];
  let listOpen = false;
  let codeOpen = false;
  let tableOpen = false;
  const closeList = () => { if (listOpen) { html.push('</ul>'); listOpen = false; } };
  const closeTable = () => { if (tableOpen) { html.push('</tbody></table>'); tableOpen = false; } };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith('```')) {
      closeList(); closeTable();
      html.push(codeOpen ? '</code></pre>' : '<pre><code>');
      codeOpen = !codeOpen;
      continue;
    }
    if (codeOpen) { html.push(`${esc(line)}\n`); continue; }
    if (/^\|.*\|$/.test(line) && /^\|?[\s:|-]+\|?$/.test(lines[index + 1] || '')) {
      closeList(); closeTable();
      const cells = line.slice(1, -1).split('|').map(cell => `<th>${inlineMarkdown(cell.trim())}</th>`).join('');
      html.push(`<table><thead><tr>${cells}</tr></thead><tbody>`);
      tableOpen = true;
      index += 1;
      continue;
    }
    if (tableOpen && /^\|.*\|$/.test(line)) {
      const cells = line.slice(1, -1).split('|').map(cell => `<td>${inlineMarkdown(cell.trim())}</td>`).join('');
      html.push(`<tr>${cells}</tr>`);
      continue;
    }
    closeTable();
    if (/^###\s+/.test(line)) { closeList(); html.push(`<h3>${inlineMarkdown(line.replace(/^###\s+/, ''))}</h3>`); continue; }
    if (/^##\s+/.test(line)) { closeList(); html.push(`<h2>${inlineMarkdown(line.replace(/^##\s+/, ''))}</h2>`); continue; }
    if (/^#\s+/.test(line)) { closeList(); html.push(`<h1>${inlineMarkdown(line.replace(/^#\s+/, ''))}</h1>`); continue; }
    if (/^-\s+/.test(line)) {
      if (!listOpen) { html.push('<ul>'); listOpen = true; }
      html.push(`<li>${inlineMarkdown(line.replace(/^-\s+/, ''))}</li>`);
      continue;
    }
    closeList();
    if (line.trim()) html.push(`<p>${inlineMarkdown(line.trim())}</p>`);
  }
  closeList(); closeTable();
  if (codeOpen) html.push('</code></pre>');
  return html.join('');
};

const contractCell = (title, value, code = false) => value ? `<div><span>${esc(title)}</span>${code ? `<code>${esc(value)}</code>` : `<strong>${esc(value)}</strong>`}</div>` : '';

const renderRecipe = (item, markdown) => {
  const source = item.source || {};
  const runtime = item.runtime || {};
  const category = item.category.replaceAll('_', ' ');
  const prompt = recipePrompt(item);
  document.title = `${label(item.name)} · ${t('配方卡', 'Recipe')}`;
  $('#recipeRoot').innerHTML = `
    <a class="recipe-back" id="recipeBack" href="index.html">← ${esc(t('返回案例库', 'Back to library'))}</a>
    <section class="recipe-hero">
      <div><div class="recipe-preview${item.preview?.height > item.preview?.width ? ' portrait-media' : ''}">${media(item)}</div><div class="preview-quality"><span id="recipeQualityLabel">${esc(t('轻量预览', 'Light preview'))} · ${esc(formatBytes(videoBytes(item)))}</span><button id="recipeQuality" type="button">${esc(t('切换高清原片', 'Load HD original'))} ${esc(formatBytes(videoBytes(item, true)))}</button></div></div>
      <div class="recipe-summary">
        <span class="recipe-category">${esc(t('完整实现配方', 'Implementation recipe'))}</span>
        <h1>${esc(label(item.name))}</h1>
        <p>${esc(label(item.description))}</p>
        <div class="tags">${item.tags.map(tag => `<span>${esc(label(tag))}</span>`).join('')}</div>
        <div class="recipe-key"><span>${esc(t('配方标识', 'Recipe key'))}</span><code>${esc(item.slug)}</code></div>
        <div class="recipe-actions">
          <button class="primary" id="copyPrompt" type="button">${esc(t('复制实现指令', 'Copy implementation brief'))}</button>
        </div>
        <p class="recipe-action-help">${esc(t('包含配方、数据契约、实现位置与交付检查，可直接用于代码智能体执行。', 'Includes the recipe, data contract, implementation location, and delivery checks for coding agents.'))}</p>
        ${briefPreview(prompt, state.lang)}
      </div>
    </section>
    <div class="recipe-layout">
      <article class="recipe-article">
        <section class="recipe-section">
          <h2>${esc(t('使用契约', 'Usage contract'))}</h2>
          <div class="contract-grid">
            ${contractCell(t('适配视觉', 'Compatible visuals'), (item.compatibleVisuals || []).join(' · '))}
            ${contractCell(t('数据契约', 'Data contract'), runtime.dataContract)}
            ${contractCell(t('入场动画', 'Entrance'), runtime.entrance)}
            ${contractCell(t('叙事高亮', 'Narrative emphasis'), runtime.emphasis)}
            ${contractCell(t('高亮对象', 'Highlight targets'), (runtime.highlightTargets || []).join(' · '))}
            ${contractCell(t('触发词', 'Trigger phrase'), runtime.triggerPhrase, true)}
          </div>
        </section>
        <section class="recipe-section">
          <h2>${esc(t('动画与叙事意图', 'Motion and narrative intent'))}</h2>
          <p>${esc(runtime.animationIntent || t('按照配方文档中的阶段组织动画，并为阅读保留稳定收尾。', 'Follow the staged motion in the recipe and leave a stable final hold for reading.'))}</p>
          ${runtime.suggestedNarration ? `<h3>${esc(t('建议旁白', 'Suggested narration'))}</h3><p>${esc(runtime.suggestedNarration)}</p>` : ''}
        </section>
        <section class="recipe-section">
          <h2>${esc(t('完整配方文档', 'Full recipe document'))}</h2>
          <div class="markdown-body">${markdownToHtml(markdown)}</div>
        </section>
        <section class="recipe-section">
          <h2>${esc(t('给代码智能体的指令', 'Prompt for coding agents'))}</h2>
          <pre class="agent-prompt">${esc(prompt)}</pre>
        </section>
      </article>
      <aside class="recipe-aside">
        <section>
          <h2>${esc(t('实现位置', 'Implementation'))}</h2>
          <dl>
            <div><dt>${esc(t('模板 ID', 'Template ID'))}</dt><dd>${esc(item.id)}</dd></div>
            <div><dt>${esc(t('实现源码', 'Source'))}</dt><dd>${esc(source.component || source.compositionId || item.id)}</dd></div>
            ${source.schema ? `<div><dt>${esc(t('数据结构', 'Schema'))}</dt><dd>${esc(source.schema)}</dd></div>` : ''}
            ${source.sampleData ? `<div><dt>${esc(t('示例数据', 'Sample data'))}</dt><dd>${esc(source.sampleData)}</dd></div>` : ''}
            <div><dt>${esc(t('配方文件', 'Recipe file'))}</dt><dd>recipes/${esc(item.slug)}.md</dd></div>
          </dl>
        </section>
        <section>
          <h2>${esc(t('交付前检查', 'Preflight checks'))}</h2>
          <ul>
            <li>${esc(t('数据、标签和图形保持可编辑', 'Data, labels, and marks remain editable'))}</li>
            <li>${esc(t('检查重叠、裁切和文字可读性', 'Check overlap, clipping, and readability'))}</li>
            <li>${esc(t('检查高亮时机和动画连续性', 'Check emphasis timing and motion continuity'))}</li>
            <li>${esc(t('结尾保留稳定阅读时间', 'Leave a stable final hold'))}</li>
          </ul>
        </section>
      </aside>
    </div>`;
  $('#copyPrompt').onclick = async () => { await copyText(prompt); showToast(t('已复制实现指令', 'Implementation brief copied')); };
  $('#recipeBack').onclick = event => {
    const embedded = new URLSearchParams(location.search).get('embedded') === '1' || window.self !== window.top;
    if (!embedded) return;
    event.preventDefault();
    window.parent.postMessage({type: 'shotcraft:close-recipe'}, location.origin);
  };
  let hd = false;
  $('#recipeQuality').hidden = videoSource(item) === videoSource(item, true);
  $('#recipeQuality').onclick = () => {
    hd = !hd;
    const video = $('.recipe-preview video');
    const time = video.currentTime;
    video.pause();video.src = videoSource(item, hd);
    video.addEventListener('loadedmetadata', () => { if (time < video.duration) video.currentTime = time; video.play().catch(() => {}); }, {once:true});
    video.load();
    $('#recipeQualityLabel').textContent = `${hd ? t('高清原片', 'HD original') : t('轻量预览', 'Light preview')} · ${formatBytes(videoBytes(item, hd))}`;
    $('#recipeQuality').textContent = hd ? t('切回轻量预览', 'Use light preview') : t('切换高清原片', 'Load HD original');
  };
};

const applyTheme = () => {
  document.documentElement.dataset.theme = state.theme;
  document.querySelectorAll('[data-theme]').forEach(button => button.classList.toggle('active', button.dataset.theme === state.theme));
};

const load = async () => {
  const slug = new URLSearchParams(location.search).get('slug');
  const response = await fetch('api/library.json');
  if (!response.ok) throw new Error(`Library HTTP ${response.status}`);
  const data = await response.json();
  const item = data.cards.find(card => card.slug === slug || card.id === slug);
  if (!item) throw new Error(t('找不到该配方', 'Recipe not found'));
  const recipeResponse = await fetch(`recipes/${encodeURIComponent(item.slug)}.md`);
  const markdown = recipeResponse.ok ? await recipeResponse.text() : `# ${label(item.name)}\n\n${label(item.description)}`;
  renderRecipe(item, markdown);
};

$('#language').textContent = state.lang === 'zh' ? 'EN' : '中文';
$('#brandSuffix').textContent = t('完整配方卡', 'Full recipe');
$('#themeSystem').textContent = t('系统', 'System');
$('#themeLight').textContent = t('浅色', 'Light');
$('#themeDark').textContent = t('深色', 'Dark');
$('#language').onclick = () => {
  localStorage.setItem('dvsc-language', state.lang === 'zh' ? 'en' : 'zh');
  location.reload();
};
$('#themeSwitch').onclick = event => {
  const button = event.target.closest('[data-theme]');
  if (!button) return;
  state.theme = button.dataset.theme;
  localStorage.setItem('dvsc-theme', state.theme);
  applyTheme();
};

applyTheme();
load().catch(error => { $('#recipeRoot').innerHTML = `<p class="recipe-error">${esc(t('配方加载失败', 'Failed to load recipe'))}: ${esc(error.message)}</p>`; });
import {videoSource, videoBytes, formatBytes} from './media-policy.js?v=entity-icons-20261002';
