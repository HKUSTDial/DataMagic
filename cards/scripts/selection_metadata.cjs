const fs = require('fs');

const taxonomy = {
  dataShapes: {
    single_metric: {zh: '单一关键指标', en: 'Single KPI'},
    categorical: {zh: '分类比较', en: 'Category comparison'},
    time_series: {zh: '时间趋势', en: 'Time series'},
    part_to_whole: {zh: '构成与占比', en: 'Part to whole'},
    distribution: {zh: '分布与密度', en: 'Distribution'},
    relationship: {zh: '变量关系', en: 'Relationship'},
    geography: {zh: '区域与空间', en: 'Geography'},
    flow: {zh: '路径与流向', en: 'Flow'},
    source_table: {zh: '原始表格与证据', en: 'Source evidence'},
  },
  readingSpeeds: {
    glance: {zh: '快速看懂 · 2–4 秒', en: 'Glance · 2–4 sec'},
    explain: {zh: '逐步讲解 · 6–10 秒', en: 'Explain · 6–10 sec'},
    inspect: {zh: '停留细读 · 10 秒以上', en: 'Inspect · 10+ sec'},
  },
  narrativeRoles: {
    hook: {zh: '开场抓注意力', en: 'Opening hook'},
    compare: {zh: '建立比较', en: 'Comparison'},
    evidence: {zh: '展示证据', en: 'Evidence'},
    explain: {zh: '解释原因或结构', en: 'Explanation'},
    transition: {zh: '连接两个场景', en: 'Transition'},
    conclude: {zh: '落到关键结论', en: 'Conclusion'},
  },
  motionStyles: {
    restrained: {zh: '克制入场', en: 'Restrained'},
    guided: {zh: '引导式强调', en: 'Guided emphasis'},
    cinematic: {zh: '明显运镜', en: 'Cinematic camera'},
  },
};

const profiles = {
  presenter_explainer: [['categorical'], ['explain'], ['explain', 'evidence'], ['guided']],
  ranking_reveal: [['categorical'], ['explain'], ['compare', 'evidence', 'hook'], ['guided']],
  video_data_fusion: [['single_metric', 'categorical'], ['explain'], ['explain', 'evidence'], ['guided']],
  bar_chart: [['categorical'], ['glance', 'explain'], ['compare', 'evidence'], ['restrained', 'guided']],
  line_chart: [['time_series'], ['explain', 'inspect'], ['evidence', 'explain'], ['guided']],
  pie_chart: [['part_to_whole'], ['glance', 'explain'], ['compare', 'evidence'], ['restrained', 'guided']],
  scatter_chart: [['relationship', 'distribution'], ['inspect', 'explain'], ['evidence', 'explain'], ['guided']],
  radar_chart: [['categorical'], ['explain'], ['compare', 'evidence'], ['guided']],
  heatmap: [['distribution', 'time_series'], ['inspect', 'explain'], ['evidence', 'explain'], ['guided']],
  waterfall_chart: [['categorical', 'time_series'], ['explain'], ['explain', 'evidence'], ['guided']],
  comparison_chart: [['categorical'], ['glance', 'explain'], ['compare', 'evidence'], ['restrained', 'guided']],
  flow_sankey: [['flow'], ['inspect', 'explain'], ['explain', 'evidence'], ['guided']],
  trend_analysis: [['time_series'], ['explain', 'inspect'], ['evidence', 'explain'], ['guided']],
  stat_cards: [['single_metric'], ['glance'], ['hook', 'conclude'], ['restrained', 'guided']],
  timeline: [['time_series'], ['explain', 'inspect'], ['explain', 'evidence'], ['guided']],
  narrative_card: [['single_metric'], ['glance', 'explain'], ['explain', 'conclude'], ['restrained']],
  narrative_scene: [['single_metric'], ['glance'], ['hook', 'transition', 'conclude'], ['cinematic', 'guided']],
  race_chart: [['time_series'], ['explain'], ['compare', 'evidence'], ['cinematic', 'guided']],
  contextual_overlay: [['single_metric', 'categorical'], ['explain'], ['evidence', 'explain'], ['cinematic', 'guided']],
  editorial_explainer: [['time_series'], ['inspect', 'explain'], ['explain', 'evidence'], ['guided']],
  map_visualization: [['geography', 'flow'], ['explain', 'inspect'], ['evidence', 'explain'], ['cinematic', 'guided']],
  chart_camera: [['time_series'], ['explain'], ['evidence', 'hook', 'explain'], ['cinematic', 'guided']],
  data_transition: [['single_metric', 'categorical'], ['glance', 'explain'], ['transition', 'conclude'], ['cinematic']],
};

const unique = values => [...new Set(values)];
const addIf = (list, condition, ...values) => condition ? unique([...list, ...values]) : list;

function inferSelection(card) {
  const editorialProfiles = {
    PresenterDataTakeover: [['time_series'], ['explain'], ['explain', 'evidence', 'conclude'], ['cinematic', 'guided']],
    ContrastContributionStory: [['categorical'], ['explain'], ['hook', 'explain', 'evidence', 'conclude'], ['guided']],
    PersistentTierBoard: [['categorical'], ['explain', 'inspect'], ['compare', 'evidence', 'conclude'], ['guided']],
  };
  const base = editorialProfiles[card.slug] || profiles[card.category] || [['categorical'], ['explain'], ['evidence'], ['guided']];
  let [dataShapes, readingSpeeds, narrativeRoles, motionStyles] = base.map(values => [...values]);
  const text = `${card.slug || ''} ${card.id || ''} ${(card.compatibleVisuals || []).join(' ')}`.toLowerCase();
  const compatible = (card.compatibleVisuals || []).join(' ').toLowerCase();
  const geographic = card.category === 'map_visualization' || /(^|\s)(map|route_map|flow_map|choropleth|spatial_data|geography|geo_network)(\s|$)/.test(compatible);
  const sourceEvidence = /source|table|reconstruction|provenance/.test(text);
  const temporal = /timeline|line_chart|trend|time_series|milestone/.test(compatible);

  dataShapes = addIf(dataShapes, /percent|pie|donut|waffle|part.to.whole/.test(text), 'part_to_whole');
  dataShapes = addIf(dataShapes, geographic, 'geography');
  dataShapes = addIf(dataShapes, /route|flow|sankey|network/.test(text), 'flow');
  dataShapes = addIf(dataShapes, /scatter|correlation|relationship/.test(text), 'relationship');
  dataShapes = addIf(dataShapes, /distribution|heat|jitter/.test(text), 'distribution');
  dataShapes = addIf(dataShapes, sourceEvidence, 'source_table');
  dataShapes = addIf(dataShapes, /stat|hero|number|kpi|progress/.test(text), 'single_metric');
  dataShapes = addIf(dataShapes, /timeline|line|trend|race|bump/.test(text), 'time_series');
  dataShapes = addIf(dataShapes, card.category !== 'race_chart' && /comparison|bar|rank|dashboard|waterfall/.test(text), 'categorical');
  if (geographic) dataShapes = unique(dataShapes.filter(value => !['categorical', 'time_series'].includes(value)));
  if ((sourceEvidence || card.category === 'chart_camera') && !temporal) dataShapes = unique(dataShapes.filter(value => value !== 'time_series'));
  narrativeRoles = addIf(narrativeRoles, /focus|magnifier|isolation|reveal|crane/.test(text), 'hook');
  narrativeRoles = addIf(narrativeRoles, /source|reconstruction|insight|presenter/.test(text), 'explain');
  narrativeRoles = addIf(narrativeRoles, /transition/.test(text), 'transition');
  motionStyles = addIf(motionStyles, /camera|focus|travel|glide|crane|pull.back|transition/.test(text), 'cinematic');

  return {dataShapes, readingSpeeds, narrativeRoles, motionStyles};
}

function enrichLibrary(library) {
  return {
    ...library,
    schemaVersion: Math.max(2, Number(library.schemaVersion) || 1),
    selectionTaxonomy: taxonomy,
    cards: library.cards.map(card => ({...card, selection: inferSelection(card)})),
  };
}

function enrichFile(libraryPath) {
  const library = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
  fs.writeFileSync(libraryPath, `${JSON.stringify(enrichLibrary(library), null, 2)}\n`);
}

module.exports = {taxonomy, inferSelection, enrichLibrary, enrichFile};

if (require.main === module) {
  const libraryPath = process.argv[2];
  if (!libraryPath) throw new Error('Usage: node selection_metadata.cjs <library.json>');
  enrichFile(libraryPath);
  process.stdout.write(`Enriched selection metadata in ${libraryPath}\n`);
}
