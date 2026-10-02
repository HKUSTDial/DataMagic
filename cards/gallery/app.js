import {collectionDefinitions, categoryGroups} from './discovery.js';
import {createCardSearchIndex, matchesCardSearch} from './search.js?v=zh-search-20261002';
import {briefPreview} from './brief-preview.js?v=recipe-languages-20261002';
import {implementationBrief} from './implementation-brief.js?v=recipe-languages-20261002';
import {cardStatus, sortRecentCards} from './card-history.js?v=datamagic-20261002';
import {LIST_VIDEO_LIMIT, videoSource, posterSource, videoBytes, formatBytes, defaultDataSaver, releaseVideo} from './media-policy.js?v=entity-icons-20261002';

const state = {
  data: null,
  stories: null,
  lang: localStorage.getItem('dvsc-language') === 'en' ? 'en' : 'zh',
  theme: localStorage.getItem('dvsc-theme') || 'system',
  dataSaver: defaultDataSaver(localStorage, navigator.connection),
  category: 'all',
  collection: 'all',
  query: '',
  selected: new Set(),
  selector: {
    dataShapes: 'categorical',
    readingSpeeds: 'explain',
    narrativeRoles: 'evidence',
    motionStyles: 'guided',
    preferNative: true,
  },
  recommendations: [],
  story: 'editorial_reveal',
  storyProject: {
    draft: {
      title: '六类城市公共空间的夏季使用强度',
      question: '真正留住人的，究竟是哪一种公共空间？',
      takeaway: '滨水步道领先；连续遮阴与可停留设施，比单纯扩大面积更能提升使用强度。',
      source: 'DataMagic Cards 演示数据',
      unit: '分',
      rows: '滨水步道,86\n社区口袋公园,74\n街区市集,68\n商业广场,57\n城市绿道,52\n纪念广场,39',
    },
    generated: null,
  },
};

const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
const label = value => typeof value === 'object' ? value[state.lang] : value;
const t = (zh, en) => state.lang === 'zh' ? zh : en;
let mediaPlaybackObserver;
const visibleCardVideos = new Map();
const activeCardVideos = new Set();
const MAX_CONCURRENT_CARD_VIDEOS = LIST_VIDEO_LIMIT;
let toastTimer;

const activeCollection = () => collectionDefinitions.find(collection => collection.id === state.collection);

const selectorQuestionDefinitions = [
  {key: 'dataShapes', title: {zh: '1. 数据是什么形状？', en: '1. What shape is the data?'}},
  {key: 'readingSpeeds', title: {zh: '2. 观众需要多快看懂？', en: '2. How fast should it read?'}},
  {key: 'narrativeRoles', title: {zh: '3. 这个镜头负责什么？', en: '3. What is this shot doing?'}},
  {key: 'motionStyles', title: {zh: '4. 需要多明显的运动？', en: '4. How much motion is needed?'}},
];

const taxonomyLabel = (group, key) => label(state.data?.selectionTaxonomy?.[group]?.[key] || key);
const readingLabel = (item, key) => item.preview?.durationSeconds
  ? `${taxonomyLabel('readingSpeeds', key).split(' · ')[0]} · ${item.preview.durationSeconds} ${t('秒', 'sec')}`
  : taxonomyLabel('readingSpeeds', key);

const selectionSummary = item => {
  const selection = item.selection || {};
  return [
    selection.dataShapes?.[0] ? taxonomyLabel('dataShapes', selection.dataShapes[0]) : '',
    selection.readingSpeeds?.[0] ? readingLabel(item, selection.readingSpeeds[0]) : '',
  ].filter(Boolean);
};

const scoreRecommendation = item => {
  const selection = item.selection || {};
  const dimensions = [
    ['dataShapes', 42],
    ['readingSpeeds', 18],
    ['narrativeRoles', 28],
    ['motionStyles', 12],
  ];
  let score = 0;
  const reasons = [];
  for (const [group, weight] of dimensions) {
    const chosen = state.selector[group];
    if ((selection[group] || []).includes(chosen)) {
      score += weight;
      reasons.push(t(`匹配“${taxonomyLabel(group, chosen)}”`, `Matches “${taxonomyLabel(group, chosen)}”`));
    } else if (group === 'dataShapes') score -= 24;
  }
  const native = item.source?.adapter === 'shotcraft-native';
  if (state.selector.preferNative && native) score += 8;
  if (item.preview?.mp4) score += 2;
  return {item, score, match: Math.max(0, Math.min(100, score)), reasons, native};
};

const getRecommendations = () => {
  const ranked = state.data.cards.map(scoreRecommendation).sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id));
  const chosen = [];
  for (const candidate of ranked) {
    if (chosen.length >= 3) break;
    if (chosen.length && chosen.some(entry => entry.item.category === candidate.item.category) && ranked.some(entry => entry.score >= candidate.score && !chosen.some(picked => picked.item.category === entry.item.category))) continue;
    chosen.push(candidate);
  }
  for (const candidate of ranked) {
    if (chosen.length >= 3) break;
    if (!chosen.includes(candidate)) chosen.push(candidate);
  }
  return chosen;
};

const renderSelectorQuestions = () => {
  const taxonomy = state.data.selectionTaxonomy;
  $('#selectorQuestions').innerHTML = selectorQuestionDefinitions.map(question => `<fieldset>
    <legend>${esc(label(question.title))}</legend>
    <div class="selector-options">${Object.entries(taxonomy[question.key]).map(([id, name]) => `<button type="button" data-selector-group="${question.key}" data-selector-value="${id}" class="${state.selector[question.key] === id ? 'active' : ''}">${esc(label(name))}</button>`).join('')}</div>
  </fieldset>`).join('');
};

const renderSelectorResults = () => {
  state.recommendations = getRecommendations();
  $('#selectorResults').innerHTML = state.recommendations.map((entry, index) => {
    const item = entry.item;
    const reasons = entry.reasons.length ? entry.reasons : [t('与当前条件接近，可作为备选构图', 'A close alternative for the current brief')];
    return `<article class="selector-result">
      <button class="selector-result-media" type="button" data-recommend-action="detail" data-id="${esc(item.id)}"><img src="${esc(posterSource(item) || '')}" alt="" loading="lazy"><b>0${index + 1}</b></button>
      <div class="selector-result-copy"><div><small>${esc(label(state.data.categories[item.category]))}</small><span>${esc(t(`匹配度 ${entry.match}`, `Match ${entry.match}`))}</span></div><h3>${esc(label(item.name))}</h3><p>${esc(reasons.join(' · '))}</p><div class="selector-result-actions"><button type="button" data-recommend-action="detail" data-id="${esc(item.id)}">${esc(t('查看动画', 'View motion'))}</button><button type="button" data-recommend-action="select" data-id="${esc(item.id)}">${esc(state.selected.has(item.id) ? t('已加入比较', 'Added') : t('加入比较', 'Add to compare'))}</button></div></div>
    </article>`;
  }).join('');
  observeMedia();
};

const openSelector = () => {
  renderSelectorQuestions();
  renderSelectorResults();
  $('#selectorDialog').showModal();
  syncCardPlayback();
};

const activeStory = () => state.stories.blueprints.find(story => story.id === state.story) || state.stories.blueprints[0];

const storyColors = ['#52e0c4', '#ff775f', '#76a9ff', '#b184ff', '#f6c85f', '#7fd18b', '#ec8ad4', '#9aa9b7'];

const parseStoryRows = value => {
  const rows = String(value || '').split(/\r?\n/).map(line => line.trim()).filter(Boolean).map((line, index) => {
    const parts = line.split(/[\t,，:：]/).map(part => part.trim());
    const number = Number(String(parts.at(-1) || '').replace(/[%￥¥$\s]/g, ''));
    const label = parts.slice(0, -1).join('，');
    if (!label || !Number.isFinite(number)) throw new Error(t(`第 ${index + 1} 行需要“名称,数值”`, `Row ${index + 1} must be “label,value”`));
    return {id: `item_${index + 1}`, label, value: number, color: storyColors[index % storyColors.length]};
  });
  if (rows.length < 3 || rows.length > 8) throw new Error(t('请输入 3–8 行数据', 'Enter 3–8 data rows'));
  return rows;
};

const storyProjectFromForm = story => {
  if (['presenter_guided_evidence','countdown_to_winner'].includes(story.id)) {
    throw new Error(t('此故事目前仅提供分镜方案；请使用下方对应原生配方，不支持通用四镜头渲染。', 'This story is plan-only. Use its native recipes below; the generic four-shot renderer does not support it.'));
  }
  const field = id => String($(`#${id}`)?.value || '').trim();
  const draft = {
    title: field('storyProjectTitle'),
    question: field('storyProjectQuestion'),
    takeaway: field('storyProjectTakeaway'),
    source: field('storyProjectSource'),
    unit: field('storyProjectUnit'),
    rows: field('storyProjectRows'),
  };
  if (!draft.title || !draft.question || !draft.takeaway || !draft.source) throw new Error(t('主题、问题、结论和来源不能为空', 'Title, question, takeaway, and source are required'));
  state.storyProject.draft = draft;
  return {
    blueprintId: story.id,
    title: draft.title,
    question: draft.question,
    takeaway: draft.takeaway,
    source: draft.source,
    unit: draft.unit,
    accent: '#52e0c4',
    items: parseStoryRows(draft.rows),
  };
};

const downloadStoryProject = project => {
  const blob = new Blob([`${JSON.stringify(project, null, 2)}\n`], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'story-data.json';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const storyRenderCommand = 'npx remotion render src/index.ts ShotCraft-StorySequenceGenerator story.mp4 --props=story-data.json';

const renderGeneratedStory = (story, project) => {
  const target = $('#storyGenerated');
  if (!target || !project || project.blueprintId !== story.id) {
    if (target) target.innerHTML = '';
    return;
  }
  const max = Math.max(1, ...project.items.map(item => Math.abs(item.value)));
  const focus = [...project.items].sort((left, right) => right.value - left.value)[0];
  const chapters = story.beats.map(beat => label(beat.title));
  target.innerHTML = `<div class="story-generated-head"><div><span>${esc(t('分镜与数据文件已生成，尚未渲染视频', 'PLAN AND DATA READY — VIDEO NOT RENDERED'))}</span><strong>${esc(t('渲染目标：4 个镜头 · 12 秒 · 1080P', 'Render target: 4 shots · 12 sec · 1080p'))}</strong></div><button type="button" data-story-detail="ShotCraft-StorySequenceGenerator">${esc(t('观看模板原始样例（非本次数据）', 'Watch original sample (not your data)'))}</button></div>
    <div class="story-generated-frames">
      <article><small>01 · ${esc(chapters[0])}</small><h4>${esc(project.question)}</h4><b>${esc(focus.value)} ${esc(project.unit)}</b></article>
      <article><small>02 · ${esc(chapters[1])}</small><h4>${esc(project.title)}</h4><div>${project.items.slice(0, 5).map(item => `<i style="width:${Math.abs(item.value) / max * 100}%;background:${esc(item.color)}"></i>`).join('')}</div></article>
      <article><small>03 · ${esc(chapters[2])}</small><h4>${esc(t('排序证据与关键对象聚焦', 'Ranked evidence and focus'))}</h4><b>${esc(focus.label)} · ${esc(focus.value)}</b></article>
      <article><small>04 · ${esc(chapters[3])}</small><h4>${esc(project.takeaway)}</h4><b>${esc(t('结论静止 ≥ 1.2 秒', 'Conclusion hold ≥ 1.2 sec'))}</b></article>
    </div>
    <div class="story-generated-actions"><button id="downloadStoryProject" type="button">${esc(t('下载可渲染数据', 'Download render data'))}</button><button id="copyStoryProject" type="button">${esc(t('复制项目 JSON', 'Copy project JSON'))}</button><button id="copyStoryCommand" type="button">${esc(t('复制渲染命令', 'Copy render command'))}</button></div>
    <code>${esc(storyRenderCommand)}</code>`;
  $('#downloadStoryProject').onclick = () => downloadStoryProject(project);
  $('#copyStoryProject').onclick = async event => {
    const button = event.currentTarget;
    await copyText(JSON.stringify(project, null, 2));
    const original = button.textContent;
    button.textContent = t('项目 JSON 已复制', 'Project JSON copied');
    setTimeout(() => { if (button.isConnected) button.textContent = original; }, 1500);
  };
  $('#copyStoryCommand').onclick = async event => {
    const button = event.currentTarget;
    await copyText(storyRenderCommand);
    const original = button.textContent;
    button.textContent = t('渲染命令已复制', 'Render command copied');
    setTimeout(() => { if (button.isConnected) button.textContent = original; }, 1500);
  };
};

const storySequence = story => {
  const used = new Set();
  return story.beats.map(beat => {
    const candidates = state.data.cards
      .filter(item => beat.categories.includes(item.category))
      .sort((left, right) => {
        const leftScore = beat.categories.indexOf(left.category) * 20 - (left.source?.adapter === 'shotcraft-native' ? 8 : 0);
        const rightScore = beat.categories.indexOf(right.category) * 20 - (right.source?.adapter === 'shotcraft-native' ? 8 : 0);
        return leftScore - rightScore || left.id.localeCompare(right.id);
      });
    const selected = [];
    for (const item of candidates) {
      if (selected.length >= 2) break;
      if (used.has(item.id) || selected.some(candidate => candidate.category === item.category)) continue;
      selected.push(item);
    }
    if (!selected.length && candidates.length) selected.push(candidates[0]);
    if (selected[0]) used.add(selected[0].id);
    return {...beat, cards: selected};
  });
};

const storyPrompt = story => {
  const sequence = storySequence(story);
  return [
    `Create a coherent DataMagic Cards sequence: ${label(story.name)}`,
    `Story purpose: ${label(story.description)}`,
    `Recommended total duration: ${label(story.duration)}.`,
    '',
    ...sequence.flatMap((beat, index) => {
      const primary = beat.cards[0];
      return [
        `SHOT ${index + 1} — ${label(beat.title)} (${beat.role})`,
        `Narrative job: ${label(beat.description)}`,
        primary ? `Primary recipe: ${recipeKey(primary)} — ${label(primary.name)}` : 'Primary recipe: choose a compatible editable data visual.',
        beat.cards[1] ? `Alternative recipe: ${recipeKey(beat.cards[1])} — ${label(beat.cards[1].name)}` : '',
        '',
      ];
    }),
    'Sequence rules:',
    '- Preserve one visual claim per shot and one continuous color identity for recurring data objects.',
    '- Use camera movement only when attention, scale, place, or narrative scope changes.',
    '- Carry the final data object or phrase from one shot into the next when continuity benefits comprehension.',
    '- Keep titles, sources, and conclusions outside camera-transformed chart layers.',
    '- Reserve a readable hold at the end of every evidence-heavy shot and at least one full second at the final conclusion.',
    '- Render opening, transition, and final frames for each shot, then review the full sequence for pacing and repeated layouts.',
  ].filter(value => value !== '').join('\n');
};

const renderStories = () => {
  const story = activeStory();
  const sequence = storySequence(story);
  $('#storyTabs').innerHTML = state.stories.blueprints.map((item, index) => `<button type="button" data-story="${item.id}" class="${item.id === story.id ? 'active' : ''}"><b>${String(index + 1).padStart(2, '0')}</b><span><strong>${esc(label(item.name))}</strong><small>${esc(label(item.duration))}</small></span></button>`).join('');
  const draft = state.storyProject.draft;
  $('#storyBody').innerHTML = `<header class="story-hero"><div><span>${esc(t('故事结构', 'STORY BLUEPRINT'))}</span><h2>${esc(label(story.name))}</h2><p>${esc(label(story.description))}</p></div><button id="copyStoryBrief" type="button">${esc(t('复制整段故事指令', 'Copy sequence brief'))}</button></header>
    <div class="story-continuity"><span>${esc(t('叙事连续性', 'Narrative continuity'))}</span>${sequence.map((beat, index) => `<b>${String(index + 1).padStart(2, '0')} ${esc(label(beat.title))}</b>`).join('<i>→</i>')}</div>
    <section class="story-generator"><header><div><span>${esc(t('生成分镜与数据文件', 'GENERATE PLAN AND DATA'))}</span><h3>${esc(t('把数据整理成四镜头方案', 'Prepare a four-shot story plan'))}</h3><p>${esc(t('输入 3–8 行“名称,数值”。下载数据文件后，在本机运行下方命令渲染视频；网页本身不会生成 MP4。', 'Enter 3–8 “label,value” rows. Download the data and run the command locally to render; this page does not generate MP4.'))}</p></div><b>12 SEC · 1920×1080</b></header>
      <div class="story-generator-form"><label><span>${esc(t('主题', 'Title'))}</span><input id="storyProjectTitle" value="${esc(draft.title)}"></label><label><span>${esc(t('开场问题', 'Opening question'))}</span><input id="storyProjectQuestion" value="${esc(draft.question)}"></label><label class="story-project-rows"><span>${esc(t('分类数据', 'Categorical data'))}</span><textarea id="storyProjectRows" rows="6">${esc(draft.rows)}</textarea><small>${esc(t('每行一个对象，例如：滨水步道,86', 'One object per line, e.g. Waterfront,86'))}</small></label><div class="story-project-copy"><label><span>${esc(t('结论', 'Takeaway'))}</span><textarea id="storyProjectTakeaway" rows="3">${esc(draft.takeaway)}</textarea></label><div><label><span>${esc(t('来源', 'Source'))}</span><input id="storyProjectSource" value="${esc(draft.source)}"></label><label><span>${esc(t('单位', 'Unit'))}</span><input id="storyProjectUnit" value="${esc(draft.unit)}"></label></div></div></div>
      <div class="story-generator-submit"><p id="storyProjectError" role="status"></p><button id="generateStoryProject" type="button">${esc(t('生成四镜头项目', 'Generate four-shot project'))}</button></div>
      <div id="storyGenerated" class="story-generated"></div>
    </section>
    <div class="story-beats">${sequence.map((beat, index) => {
      const primary = beat.cards[0];
      const alternative = beat.cards[1];
      return `<article class="story-beat"><div class="story-beat-index"><b>${String(index + 1).padStart(2, '0')}</b><span>${esc(beat.role.toUpperCase())}</span></div><div class="story-beat-copy"><h3>${esc(label(beat.title))}</h3><p>${esc(label(beat.description))}</p>${primary ? `<button type="button" data-story-detail="${esc(primary.id)}" class="story-primary"><img src="${esc(posterSource(primary) || '')}" alt=""><span><small>${esc(label(state.data.categories[primary.category]))}</small><strong>${esc(label(primary.name))}</strong><em>${esc(t('查看镜头', 'View shot'))} →</em></span></button>` : ''}${alternative ? `<div class="story-alternative"><span>${esc(t('另一种表达', 'Alternative'))}</span><button type="button" data-story-detail="${esc(alternative.id)}">${esc(label(alternative.name))}</button></div>` : ''}</div></article>`;
    }).join('')}</div>`;
  $('#copyStoryBrief').onclick = async () => {
    await copyText(storyPrompt(story));
    const button = $('#copyStoryBrief');
    const original = button.textContent;
    button.textContent = t('已复制整段故事指令', 'Sequence brief copied');
    setTimeout(() => { if (button.isConnected) button.textContent = original; }, 1600);
  };
  const planOnly = ['presenter_guided_evidence','countdown_to_winner'].includes(story.id);
  $('#generateStoryProject').disabled = planOnly;
  if (planOnly) {
    $('#generateStoryProject').textContent = t('此方案请使用对应原生配方', 'Use the corresponding native recipes');
    $('#storyProjectError').textContent = t('仅提供分镜方案与配方推荐，不支持通用四镜头渲染。', 'Plan and recipe recommendations only; generic rendering is not supported.');
  }
  $('#generateStoryProject').onclick = () => {
    const error = $('#storyProjectError');
    try {
      const project = storyProjectFromForm(story);
      state.storyProject.generated = project;
      error.textContent = '';
      renderGeneratedStory(story, project);
      $('#storyGenerated').scrollIntoView({behavior: 'smooth', block: 'nearest'});
    } catch (cause) {
      error.textContent = cause.message;
    }
  };
  renderGeneratedStory(story, state.storyProject.generated);
};

const openStories = () => {
  renderStories();
  $('#storyDialog').showModal();
  syncCardPlayback();
};

const media = (item, eager = false) => {
  const video = videoSource(item);
  const poster = esc(posterSource(item) || '');
  const imageLoading = eager ? 'eager' : 'lazy';
  if (!video) return `<img src="${poster}" alt="" loading="${imageLoading}" decoding="async">`;
  const videoAttributes = eager
    ? `src="${esc(video)}" data-src="${esc(video)}" preload="metadata" autoplay`
    : `data-src="${esc(video)}" data-managed-media preload="none"`;
  return `<span class="media-shell"><img src="${poster}" alt="" loading="${imageLoading}" decoding="async"><video ${videoAttributes} muted loop playsinline></video></span>`;
};

const activateMedia = video => {
  if (video.src || !video.dataset.src) return;
  video.src = video.dataset.src;
};

const syncCardPlayback = () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const viewportCenter = window.innerHeight / 2;
  const playable = reduceMotion || document.hidden || state.dataSaver || document.querySelector('dialog[open]')
    ? new Set()
    : new Set([...visibleCardVideos.entries()]
      .filter(([video, ratio]) => video.isConnected && ratio >= 0.55)
      .sort(([leftVideo, leftRatio], [rightVideo, rightRatio]) => {
        if (rightRatio !== leftRatio) return rightRatio - leftRatio;
        const leftBox = leftVideo.getBoundingClientRect();
        const rightBox = rightVideo.getBoundingClientRect();
        return Math.abs((leftBox.top + leftBox.bottom) / 2 - viewportCenter)
          - Math.abs((rightBox.top + rightBox.bottom) / 2 - viewportCenter);
      })
      .slice(0, window.innerWidth < 700 ? 1 : MAX_CONCURRENT_CARD_VIDEOS)
      .map(([video]) => video));

  new Set([...document.querySelectorAll('.card video'), ...activeCardVideos]).forEach(video => {
    if (playable.has(video)) {
      activateMedia(video);
      if (!activeCardVideos.has(video)) {
        activeCardVideos.add(video);
        video.play().catch(() => { releaseVideo(video); activeCardVideos.delete(video); });
      }
      return;
    }
    releaseVideo(video);
    activeCardVideos.delete(video);
  });
};

const pauseObservedMedia = () => {
  document.querySelectorAll('.card video').forEach(releaseVideo);
  activeCardVideos.clear();
  visibleCardVideos.clear();
};

const observeMedia = () => {
  mediaPlaybackObserver?.disconnect();
  pauseObservedMedia();

  mediaPlaybackObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleCardVideos.set(entry.target, entry.intersectionRatio);
      else visibleCardVideos.delete(entry.target);
    });
    syncCardPlayback();
  }, {threshold: [0, 0.55, 1]});

  document.querySelectorAll('video[data-managed-media]').forEach(video => {
    mediaPlaybackObserver.observe(video);
  });
};

document.addEventListener('visibilitychange', syncCardPlayback);
window.addEventListener('resize', syncCardPlayback);

const updateDataSaver = () => {
  const button = $('#dataSaver');
  button.setAttribute('aria-pressed', String(state.dataSaver));
  button.textContent = state.dataSaver ? t('省流模式：开', 'Data saver: on') : t('省流模式：关', 'Data saver: off');
  button.title = t('开启后列表只显示封面，点击案例才加载视频', 'Show posters only; load a video when you open a case');
  document.documentElement.dataset.dataSaver = String(state.dataSaver);
};
$('#dataSaver').onclick = () => {
  state.dataSaver = !state.dataSaver;
  localStorage.setItem('dvsc-data-saver', state.dataSaver ? 'on' : 'off');
  updateDataSaver();
  syncCardPlayback();
};

const showToast = message => {
  const node = $('#detail')?.open ? $('#detailToast') : $('#toast');
  node.textContent = message;
  node.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove('show'), 1800);
};

const recipeKey = item => item.slug || item.id;

const recipePrompt = item => implementationBrief(item, state.lang);

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

const copyRecipeGuide = async item => {
  await copyText(recipePrompt(item));
  showToast(t('已复制完整实现说明', 'Copied the full implementation guide'));
};

const openRecipe = item => {
  const standaloneUrl = new URL('recipe.html', window.location.href);
  standaloneUrl.searchParams.set('slug', item.slug);
  const frameUrl = new URL(standaloneUrl);
  frameUrl.searchParams.set('embedded', '1');
  $('#recipeDialogTitle').textContent = t(`${label(item.name)} · 完整配方`, `${label(item.name)} · Full recipe`);
  $('#recipeStandalone').textContent = t('独立打开', 'Open standalone');
  $('#recipeStandalone').href = standaloneUrl.href;
  $('#recipeFrame').src = frameUrl.href;
  $('#recipeDialog').showModal();
  syncCardPlayback();
  if ($('#detailBody video')) releaseVideo($('#detailBody video'));
};

const applyTheme = () => {
  document.documentElement.dataset.theme = state.theme;
  document.querySelectorAll('[data-theme]').forEach(button => {
    button.classList.toggle('active', button.dataset.theme === state.theme);
  });
};

const updateSelectionBar = () => {
  const count = state.selected.size;
  $('#selectionBar').hidden = count === 0;
  $('#selectedCount').textContent = t(`已选择 ${count}/3 个案例，可同步比较`, `${count}/3 cases selected for comparison`);
  $('#compareSelected').textContent = t('并排比较', 'Compare side by side');
  $('#compareSelected').disabled = count < 2;
  $('#copySelectedGuides').textContent = t('复制实现指令', 'Copy implementation brief');
  $('#clearSelected').textContent = t('清除选择', 'Clear');
};

const toggleSelection = id => {
  if (state.selected.has(id)) state.selected.delete(id);
  else if (state.selected.size >= 3) {
    showToast(t('最多选择 3 个案例进行比较', 'Select up to 3 cases for comparison'));
    return;
  } else state.selected.add(id);
  render();
};

const filteredCards = () => {
  state.searchIndex ||= createCardSearchIndex(state.data.cards, state.data.categories, collectionDefinitions);
  return state.data.cards.filter(item => {
    if (state.category !== 'all' && item.category !== state.category) return false;
    const collection = activeCollection();
    if (collection && !collection.match(item)) return false;
    return matchesCardSearch(state.searchIndex, item, state.query);
  });
};

const renderCollections = () => {
  const entries = [{
    id: 'all',
    name: {zh: '全部专题', en: 'All collections'},
    description: {zh: '浏览完整配方库', en: 'Browse the complete library'},
    match: () => true,
  }, ...collectionDefinitions];
  $('#collections').innerHTML = entries.map(collection => {
    const count = state.data.cards.filter(collection.match).length;
    return `<button type="button" data-collection="${collection.id}" class="collection-button${state.collection === collection.id ? ' active' : ''}">
      <span><strong>${esc(label(collection.name))}</strong><small>${esc(label(collection.description))}</small></span><b>${count}</b>
    </button>`;
  }).join('');
};

function render() {
  const cards = sortRecentCards(filteredCards(), state.history);
  renderFilters();
  pauseObservedMedia();
  $('#grid').innerHTML = cards.map(item => {
    const selected = state.selected.has(item.id);
    return `<article class="card${selected ? ' selected' : ''}">
      <button class="media-button" type="button" data-action="detail" data-id="${esc(item.id)}" aria-label="${esc(t('查看', 'View'))} ${esc(label(item.name))}">${media(item)}</button>
      <div class="card-copy">
        <div class="card-kicker"><small>${esc(label(state.data.categories[item.category]))}</small><span>${esc(item.id.startsWith('ShotCraft-') ? t('原生模板', 'Native') : item.preview?.mode === 'runtime_highlight' ? t('运行时高亮', 'Runtime highlight') : t('运行时动效', 'Runtime motion'))}</span></div>
        <h3>${esc(label(item.name))}${cardStatus(item, state.history) ? `<span class="card-update-badge">${cardStatus(item, state.history) === 'new' ? t('新增', 'NEW') : t('已更新', 'Updated')}</span>` : ''}</h3>
        <p>${esc(label(item.description))}</p>
        <div class="strategy-strip">${selectionSummary(item).map(value => `<span>${esc(value)}</span>`).join('<i>·</i>')}</div>
        <div class="tags">${item.tags.slice(0, 3).map(tag => `<span>${esc(label(tag))}</span>`).join('')}</div>
      </div>
      <footer class="card-actions">
        <button type="button" data-action="select" data-id="${esc(item.id)}" class="select-button${selected ? ' active' : ''}"><span class="check-box" aria-hidden="true">${selected ? '✓' : ''}</span>${esc(selected ? t('已选择', 'Selected') : t('选择', 'Select'))}</button>
        <button type="button" data-action="copy" data-id="${esc(item.id)}" class="copy-button" title="${esc(t('复制完整实现规格', 'Copy full implementation brief'))}"><span class="copy-icon" aria-hidden="true"></span>${esc(t('复制实现指令', 'Copy brief'))}</button>
        <button type="button" data-action="recipe" data-id="${esc(item.id)}" class="recipe-button">${esc(t('配方卡', 'Recipe'))}</button>
      </footer>
    </article>`;
  }).join('');
  $('#count').textContent = t(`${cards.length} 个案例`, `${cards.length} cases`);
  const collection = activeCollection();
  $('#resultTitle').textContent = collection
    ? [label(collection.name), state.category !== 'all' ? label(state.data.categories[state.category]) : ''].filter(Boolean).join(' · ')
    : state.category === 'all' ? t('全部案例', 'All cases') : label(state.data.categories[state.category]);
  updateSelectionBar();
  observeMedia();
}

const formatTime = seconds => {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const minutes = Math.floor(safe / 60);
  return `${minutes}:${String(Math.floor(safe % 60)).padStart(2, '0')}`;
};

const bindDetailTimeline = () => {
  const video = $('#detailBody video');
  const range = $('#detailTimeline');
  const current = $('#detailCurrent');
  const duration = $('#detailDuration');
  if (!video || !range) return;
  const sync = () => {
    if (!range.matches(':active') && video.duration) range.value = String((video.currentTime / video.duration) * 1000);
    current.textContent = formatTime(video.currentTime);
    duration.textContent = formatTime(video.duration);
  };
  range.oninput = () => {
    if (video.duration) video.currentTime = (Number(range.value) / 1000) * video.duration;
    sync();
  };
  video.addEventListener('loadedmetadata', sync);
  video.addEventListener('timeupdate', sync);
  sync();
};

function openDetail(id) {
  const item = state.data.cards.find(card => card.id === id);
  const timeline = item.preview?.mp4 ? `<div class="preview-timeline"><span id="detailCurrent">0:00</span><input id="detailTimeline" type="range" min="0" max="1000" value="0" step="1" aria-label="${esc(t('预览时间轴', 'Preview timeline'))}"><span id="detailDuration">0:00</span></div>` : '';
  $('#detailBody').querySelectorAll('video').forEach(releaseVideo);
  $('#detailBody').innerHTML = `<div class="detail-preview"><div class="detail-media${item.preview?.height > item.preview?.width ? ' portrait-media' : ''}">${media(item, true)}</div>${timeline}<div class="preview-quality"><span id="detailQualityLabel">${esc(t('轻量预览', 'Light preview'))} · ${esc(formatBytes(videoBytes(item)))}</span><button id="detailQuality" type="button">${esc(t('切换高清原片', 'Load HD original'))} ${esc(formatBytes(videoBytes(item, true)))}</button></div></div>
    <div class="detail-copy">
      <small>${esc(label(state.data.categories[item.category]))}</small>
      <h2>${esc(label(item.name))}</h2>
      <p>${esc(label(item.description))}</p>
      <div class="tags">${item.tags.map(tag => `<span>${esc(label(tag))}</span>`).join('')}</div>
      <dl class="shot-strategy"><div><dt>${esc(t('数据形状', 'Data shape'))}</dt><dd>${esc((item.selection?.dataShapes || []).map(key => taxonomyLabel('dataShapes', key)).join('、'))}</dd></div><div><dt>${esc(t('阅读速度', 'Reading speed'))}</dt><dd>${esc((item.selection?.readingSpeeds || []).map(key => readingLabel(item, key)).join('、'))}</dd></div><div><dt>${esc(t('叙事任务', 'Narrative role'))}</dt><dd>${esc((item.selection?.narrativeRoles || []).map(key => taxonomyLabel('narrativeRoles', key)).join('、'))}</dd></div><div><dt>${esc(t('运动方式', 'Motion style'))}</dt><dd>${esc((item.selection?.motionStyles || []).map(key => taxonomyLabel('motionStyles', key)).join('、'))}</dd></div></dl>
      <p class="detail-hint">${esc(t('实现指令包含配方用途、源码位置、数据格式、动画约束与交付检查；完整配方中有更详细的说明。', 'The brief includes purpose, source paths, data format, animation constraints, and delivery checks. The full recipe has additional details.'))}</p>
      <div class="detail-actions">
        <button type="button" id="detailRecipe">${esc(t('打开完整配方', 'Open full recipe'))}</button>
        <button type="button" id="detailCopy" class="secondary"><span class="copy-icon" aria-hidden="true"></span>${esc(t('复制实现指令', 'Copy brief'))}</button>
        <button type="button" id="detailSelect" class="secondary"><span class="check-box" aria-hidden="true">${state.selected.has(item.id) ? '✓' : ''}</span>${esc(state.selected.has(item.id) ? t('已选择', 'Selected') : t('选择案例', 'Select case'))}</button>
      </div>
      ${briefPreview(recipePrompt(item), state.lang)}
    </div>`;
  $('#detailRecipe').onclick = () => openRecipe(item);
  $('#detailCopy').onclick = () => copyRecipeGuide(item);
  $('#detailSelect').onclick = () => { toggleSelection(item.id); $('#detail').close(); };
  let hd = false;
  $('#detailQuality').hidden = videoSource(item) === videoSource(item, true);
  $('#detailQuality').onclick = () => {
    hd = !hd;
    const video = $('#detailBody video');
    const time = video.currentTime;
    video.pause();
    video.src = videoSource(item, hd);
    video.dataset.src = videoSource(item, hd);
    video.addEventListener('loadedmetadata', () => { if (time < video.duration) video.currentTime = time; video.play().catch(() => {}); }, {once:true});
    video.load();
    $('#detailQualityLabel').textContent = `${hd ? t('高清原片', 'HD original') : t('轻量预览', 'Light preview')} · ${formatBytes(videoBytes(item, hd))}`;
    $('#detailQuality').textContent = `${hd ? t('切回轻量预览', 'Use light preview') : t('切换高清原片', 'Load HD original')} ${formatBytes(videoBytes(item, !hd))}`;
  };
  $('#detail').showModal();
  syncCardPlayback();
  bindDetailTimeline();
}

const setComparePlayback = playing => {
  const videos = [...$('#compareBody').querySelectorAll('video')];
  if (playing && videos.length) {
    const anchor = videos[0].currentTime;
    videos.forEach(video => {
      if (Math.abs(video.currentTime - anchor) > 0.08) video.currentTime = anchor;
      video.play().catch(() => {});
    });
  } else videos.forEach(video => video.pause());
  $('#comparePlayback').dataset.playing = String(playing);
  $('#comparePlayback').textContent = playing ? t('暂停全部', 'Pause all') : t('同步播放', 'Play all');
};

const openCompare = () => {
  const items = [...state.selected].map(id => state.data.cards.find(item => item.id === id)).filter(Boolean).slice(0, 3);
  if (items.length < 2) {
    showToast(t('请先选择 2–3 个案例', 'Select 2–3 cases first'));
    return;
  }
  $('#compareTitle').textContent = t(`并排比较 · ${items.length} 个案例`, `Side-by-side comparison · ${items.length} cases`);
  $('#compareHint').textContent = t('同步观察构图、节奏和运镜差异', 'Compare composition, pacing, and camera motion in sync');
  $('#compareBody').className = `compare-body compare-${items.length}`;
  $('#compareBody').innerHTML = items.map(item => `<article class="compare-item">
    <div class="compare-media">${media(item, true)}</div>
    <small>${esc(label(state.data.categories[item.category]))}</small>
    <h3>${esc(label(item.name))}</h3>
    <p>${esc(label(item.description))}</p>
  </article>`).join('');
  $('#compareDialog').showModal();
  syncCardPlayback();
  setComparePlayback(true);
};

$('#grid').onclick = event => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const item = state.data.cards.find(card => card.id === button.dataset.id);
  if (button.dataset.action === 'detail') openDetail(item.id);
  if (button.dataset.action === 'recipe') openRecipe(item);
  if (button.dataset.action === 'select') toggleSelection(item.id);
  if (button.dataset.action === 'copy') copyRecipeGuide(item);
};

$('#search').oninput = event => { state.query = event.target.value; render(); };
$('#close').onclick = () => $('#detail').close();
$('#detail').addEventListener('close', () => {
  if (state.data?.cards.some(item => `#${item.slug}` === location.hash)) {
    history.replaceState(null, '', location.pathname + location.search);
  }
  $('#detailBody').querySelectorAll('video').forEach(video => {
    video.pause();
    video.removeAttribute('src');
    video.load();
  });
  $('#detailBody').innerHTML = '';
  syncCardPlayback();
});
$('#closeRecipe').onclick = () => $('#recipeDialog').close();
$('#recipeDialog').addEventListener('close', () => {
  $('#recipeFrame').src = 'about:blank';
  const video = $('#detail[open] video');
  if (video) { activateMedia(video); video.play().catch(() => {}); }
});
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('close', syncCardPlayback));
window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.data?.type !== 'shotcraft:close-recipe') return;
  if ($('#recipeDialog').open) $('#recipeDialog').close();
});
$('#closeCompare').onclick = () => $('#compareDialog').close();
$('#openSelector').onclick = openSelector;
$('#closeSelector').onclick = () => $('#selectorDialog').close();
$('#selectorDialog').addEventListener('close', () => {
  $('#selectorResults').querySelectorAll('video').forEach(video => {
    video.pause();
    video.removeAttribute('src');
    video.load();
  });
  $('#selectorResults').innerHTML = '';
});
$('#selectorQuestions').onclick = event => {
  const button = event.target.closest('button[data-selector-group]');
  if (!button) return;
  state.selector[button.dataset.selectorGroup] = button.dataset.selectorValue;
  renderSelectorQuestions();
};
$('#preferNative').onchange = event => { state.selector.preferNative = event.target.checked; };
$('#runSelector').onclick = renderSelectorResults;
$('#selectorResults').onclick = event => {
  const button = event.target.closest('[data-recommend-action]');
  if (!button) return;
  if (button.dataset.recommendAction === 'detail') {
    $('#selectorDialog').close();
    openDetail(button.dataset.id);
  }
  if (button.dataset.recommendAction === 'select') {
    toggleSelection(button.dataset.id);
    renderSelectorResults();
  }
};
$('#compareRecommendations').onclick = () => {
  state.selected.clear();
  state.recommendations.slice(0, 3).forEach(entry => state.selected.add(entry.item.id));
  render();
  $('#selectorDialog').close();
  openCompare();
};
$('#openStories').onclick = openStories;
$('#closeStories').onclick = () => $('#storyDialog').close();
$('#storyTabs').onclick = event => {
  const button = event.target.closest('button[data-story]');
  if (!button) return;
  state.story = button.dataset.story;
  renderStories();
};
$('#storyBody').onclick = event => {
  const button = event.target.closest('button[data-story-detail]');
  if (!button) return;
  $('#storyDialog').close();
  openDetail(button.dataset.storyDetail);
};
$('#compareDialog').addEventListener('close', () => {
  $('#compareBody').querySelectorAll('video').forEach(video => {
    video.pause();
    video.removeAttribute('src');
    video.load();
  });
  $('#compareBody').innerHTML = '';
});
$('#comparePlayback').onclick = () => setComparePlayback($('#comparePlayback').dataset.playing !== 'true');
$('#compareSelected').onclick = openCompare;
$('#clearSelected').onclick = () => { state.selected.clear(); render(); };
$('#copySelectedGuides').onclick = async () => {
  const items = [...state.selected].map(id => state.data.cards.find(item => item.id === id)).filter(Boolean);
  await copyText(items.map(recipePrompt).join('\n\n---\n\n'));
  showToast(t(`已复制 ${items.length} 份实现指令`, `Copied ${items.length} implementation briefs`));
};
$('#language').onclick = () => {
  localStorage.setItem('dvsc-language', state.lang === 'zh' ? 'en' : 'zh');
  location.reload();
};
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    $('#search').focus();
  }
  if (event.key === 'Escape' && $('#recipeDialog').open) $('#recipeDialog').close();
  else if (event.key === 'Escape' && $('#compareDialog').open) $('#compareDialog').close();
  else if (event.key === 'Escape' && $('#selectorDialog').open) $('#selectorDialog').close();
  else if (event.key === 'Escape' && $('#storyDialog').open) $('#storyDialog').close();
  else if (event.key === 'Escape' && $('#detail').open) $('#detail').close();
});
$('#themeSwitch').onclick = event => {
  const button = event.target.closest('[data-theme]');
  if (!button) return;
  state.theme = button.dataset.theme;
  localStorage.setItem('dvsc-theme', state.theme);
  applyTheme();
};

const renderFilters = () => {
  const collection = activeCollection();
  const pool = state.data.cards.filter(item => !collection || collection.match(item));
  const button = (id, name) => {
    const count = id === 'all' ? pool.length : pool.filter(item => item.category === id).length;
    if (!count && id !== 'all') return '';
    return `<button type="button" data-category="${id}" aria-pressed="${state.category === id}" class="${state.category === id ? 'active' : ''}"><span>${esc(label(name))}</span><small>${count}</small></button>`;
  };
  $('#filters').innerHTML = button('all', {zh: '全部案例', en: 'All recipes'}) + categoryGroups.map(group => {
    const buttons = group.ids.filter(id => state.data.categories[id]).map(id => button(id, state.data.categories[id])).join('');
    return buttons ? `<div class="filter-group"><h3>${esc(label(group.name))}</h3>${buttons}</div>` : '';
  }).join('');
};

Promise.all([
  fetch('api/library.json', {cache: 'no-store'}).then(response => response.json()),
  fetch('api/story-blueprints.json', {cache: 'no-store'}).then(response => response.json()),
  fetch('api/card-history.json', {cache: 'no-store'}).then(response => response.ok ? response.json() : {}).catch(() => ({})),
]).then(([data, stories, history]) => {
  state.data = data;
  state.history = history;
  state.stories = stories;
  $('#language').textContent = state.lang === 'zh' ? 'EN' : '中文';
  $('#themeSystem').textContent = t('系统', 'System');
  $('#themeLight').textContent = t('浅色', 'Light');
  $('#themeDark').textContent = t('深色', 'Dark');
  $('#brandSuffix').textContent = t('动态图表配方库', 'Data motion recipes');
  updateDataSaver();
  $('#title').textContent = t('让代码智能体生成更可靠的动态图表', 'Help coding agents build reliable animated data visuals');
  const nativeCount = data.cards.filter(item => item.source.adapter === 'shotcraft-native').length;
  $('#introCopy').textContent = t(`浏览动态图表、数据叙事和场景配方。${data.cards.length} 张卡片均提供动态预览、可编辑源码、Schema 和示例数据，支持替换数据后本地渲染。`, `Browse ${data.cards.length} chart, narrative, and scene recipes, each with motion previews, editable source, schemas, and sample data for local rendering.`);
  $('#storyEntryTitle').textContent = t('四镜头故事方案', 'Four-shot story plan');
  $('#discoveryToolsTitle').textContent = t('辅助工具：选配方与故事方案', 'Planning tools: find recipes and story plans');
  $('#storyEntryCopy').textContent = t('生成分镜与数据文件，非在线成片', 'Plan and data files, not an online render');
  $('#storyDialogTitle').textContent = t('四镜头故事方案', 'Four-shot story plan');
  $('#storyDialogSubtitle').textContent = t('生成分镜与可渲染数据，成片需在本机运行渲染命令', 'Generate plan and render data; render the video locally');
  $('#selectorOpenTitle').textContent = t('按用途选配方', 'Find recipes by purpose');
  $('#selectorOpenCopy').textContent = t('根据条件筛选 3 个候选', 'Filter three candidates by your requirements');
  $('#selectorTitle').textContent = t('按用途选配方', 'Find recipes by purpose');
  $('#selectorSubtitle').textContent = t('按数据和叙事条件筛选，不调用 AI 模型', 'Rule-based matching, without an AI model');
  $('#selectorHeading').textContent = t('这段数据准备怎么讲？', 'How should this data be told?');
  $('#selectorIntroCopy').textContent = t('选择最接近的条件。系统会综合数据契约、阅读时间、镜头任务与运动强度，而不是只按图表名称匹配。', 'Choose the closest conditions. Recommendations combine data contract, reading time, narrative role, and motion intensity.');
  $('#nativePreferenceTitle').textContent = t('优先原生高级模板', 'Prefer native advanced templates');
  $('#nativePreferenceCopy').textContent = t('相近条件下，优先选择具有源码、Schema、测试和成片的原生模板', 'When scores are close, prefer native templates with source, schema, tests, and rendered video');
  $('#runSelector').textContent = t('生成推荐', 'Generate recommendations');
  $('#selectorResultEyebrow').textContent = t('推荐结果', 'TOP MATCHES');
  $('#selectorResultTitle').textContent = t('3 个候选镜头', 'Three candidate shots');
  $('#compareRecommendations').textContent = t('将 3 项加入比较', 'Compare all three');
  $('#collectionsTitle').textContent = t('专题合集', 'Curated collections');
  $('#collectionsHint').textContent = t('排名、趋势、实景与讲解', 'Rankings, trends, footage, and explanation');
  $('#search').placeholder = t('中文搜索：猫主持、柱状图竞赛、地图…', 'Search in Chinese or English: cat, bar chart race, map…');
  $('#stats').innerHTML = `<div><strong>${data.cards.length}</strong><span>${esc(t('可复用配方', 'reusable recipes'))}</span></div><div><strong>${Object.keys(data.categories).length}</strong><span>${esc(t('视觉类型', 'visual types'))}</span></div><div><strong>${nativeCount}</strong><span>${esc(t('原生高级模板', 'native advanced templates'))}</span></div>`;
  $('.aside-label').textContent = t('场景与类型', 'Scenes & types');
  renderFilters();
  $('#filters').onclick = event => {
    const button = event.target.closest('button');
    if (!button) return;
    state.category = button.dataset.category;
    document.querySelectorAll('#filters button').forEach(node => node.classList.toggle('active', node === button));
    render();
  };
  renderCollections();
  $('#collections').onclick = event => {
    const button = event.target.closest('button[data-collection]');
    if (!button) return;
    state.collection = button.dataset.collection;
    state.category = 'all';
    renderCollections();
    render();
  };
  render();
  if (location.hash === '#selector') openSelector();
  if (location.hash === '#stories') openStories();
  const linkedCard = data.cards.find(item => `#${item.slug}` === location.hash);
  if (linkedCard) openDetail(linkedCard.id);
}).catch(error => {
  $('#grid').innerHTML = `<p class="load-error">${esc(t('案例库加载失败', 'Failed to load the library'))}: ${esc(error.message)}</p>`;
});

applyTheme();
