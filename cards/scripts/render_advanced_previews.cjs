#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const {bundle} = require('@remotion/bundler');
const {getCompositions, renderMedia, renderStill} = require('@remotion/renderer');
const {enrichLibrary} = require('./selection_metadata.cjs');

const libraryPath = path.join(root, 'gallery/api/library.json');
const mediaDir = path.join(root, 'gallery/media');
const posterDir = path.join(mediaDir, 'poster');
const force = process.argv.includes('--force');
const onlyArg = process.argv.find(arg => arg.startsWith('--only='));
const only = onlyArg?.split('=')[1];

const cards = [
  ...require('./editorial_cards.cjs'),
  ...require('./narrative_cards.cjs'),
  {
    id: 'ShotCraft-BarChartRace',
    slug: 'BarChartRace',
    name: {zh: '动态柱状图竞赛', en: 'Bar Chart Race'},
    description: {
      zh: '面向多实体时序排名的连续竞赛图，支持数值插值、动态换位、进入退出和稳定实体配色。',
      en: 'A continuous race for multi-entity time series with value interpolation, rank transitions, entry and exit, and stable entity colors.',
    },
    category: 'race_chart',
    compatibleVisuals: ['bar_chart', 'timeline'],
    tags: [
      {zh: '动态排名', en: 'Ranking'},
      {zh: '时间序列', en: 'Time Series'},
      {zh: '高级图表', en: 'Advanced Chart'},
    ],
    preview: {poster: 'media/poster/BarChartRace.png', mp4: 'media/BarChartRace.mp4'},
    source: {
      adapter: 'shotcraft-native',
      component: 'templates/bar-chart-race/BarChartRace.tsx',
      schema: 'templates/bar-chart-race/schema.json',
      sampleData: 'templates/bar-chart-race/sample-data.json',
    },
  },
  {
    id: 'ShotCraft-EditorialLedgerRace',
    slug: 'EditorialLedgerRace',
    name: {zh: '编辑账本式竞赛', en: 'Editorial Ledger Race'},
    description: {
      zh: '把排名变化组织成问题、追踪对象、转折旁注和最终主张，适合证据导向的编辑化数据故事。',
      en: 'Turn ranking change into an editorial story with a question, tracked entity, turning-point note, and final claim.',
    },
    category: 'race_chart',
    compatibleVisuals: ['bar_chart_race', 'ranking', 'editorial_story', 'slow_focus_push'],
    tags: [{zh:'编辑叙事',en:'Editorial Story'},{zh:'账本排版',en:'Ledger Layout'},{zh:'缓慢推镜',en:'Slow Push'}],
    preview: {poster:'media/poster/EditorialLedgerRace.png',mp4:'media/EditorialLedgerRace.mp4'},
    source: {adapter:'shotcraft-native',component:'templates/editorial-ledger-race/EditorialLedgerRace.tsx',schema:'templates/editorial-ledger-race/schema.json',sampleData:'templates/editorial-ledger-race/sample-data.json'},
  },
  {
    id: 'ShotCraft-CinematicTrackRace',
    slug: 'CinematicTrackRace',
    name: {zh: '电影赛道式竞赛', en: 'Cinematic Track Race'},
    description: {
      zh: '用暗色赛道、领先者聚光和一次关键超越冲击聚焦，把排名变化变成高能竞赛段落。',
      en: 'Use dark lanes, a leader spotlight, and one crash focus on the pivotal overtake for a high-energy race sequence.',
    },
    category: 'race_chart',
    compatibleVisuals: ['bar_chart_race', 'ranking', 'cinematic_story', 'crash_focus'],
    tags: [{zh:'赛道竞速',en:'Track Race'},{zh:'冲击聚焦',en:'Crash Focus'},{zh:'高能叙事',en:'High Energy'}],
    preview: {poster:'media/poster/CinematicTrackRace.png',mp4:'media/CinematicTrackRace.mp4'},
    source: {adapter:'shotcraft-native',component:'templates/cinematic-track-race/CinematicTrackRace.tsx',schema:'templates/cinematic-track-race/schema.json',sampleData:'templates/cinematic-track-race/sample-data.json'},
  },
  {
    id: 'ShotCraft-SpatialPercentOverlay',
    slug: 'SpatialPercentOverlay',
    name: {zh: '实景融合百分比', en: 'Contextual Percent Overlay'},
    description: {
      zh: '把可编辑的百分比液位、标签和来源放入实景负空间，同时保留主体避让与清晰阅读层级。',
      en: 'Place an editable percentage vessel, labels, and source in contextual negative space while preserving focal clearance and readability.',
    },
    category: 'contextual_overlay',
    compatibleVisuals: ['percentage', 'contextual_footage', 'hero_metric'],
    tags: [
      {zh: '实景融合', en: 'Contextual'},
      {zh: '负空间布局', en: 'Negative Space'},
      {zh: '百分比', en: 'Percentage'},
    ],
    preview: {poster: 'media/poster/SpatialPercentOverlay.png', mp4: 'media/SpatialPercentOverlay.mp4'},
    source: {
      adapter: 'shotcraft-native',
      component: 'templates/spatial-percent-overlay/SpatialPercentOverlay.tsx',
      schema: 'templates/spatial-percent-overlay/schema.json',
      sampleData: 'templates/spatial-percent-overlay/sample-data.json',
    },
  },
  {
    id: 'ShotCraft-BumpChartStory',
    slug: 'BumpChartStory',
    name: {zh: '动态排名轨迹', en: 'Bump Chart Story'},
    description: {
      zh: '用连续排名轨迹揭示超越、反转与格局变化，保留每个时期的原始数值与稳定实体颜色。',
      en: 'Reveal overtakes, reversals, and rank changes with continuous trajectories, source values, and stable entity colors.',
    },
    category: 'race_chart',
    compatibleVisuals: ['bump_chart', 'ranking', 'timeline'],
    tags: [
      {zh: '排名变化', en: 'Rank Change'},
      {zh: '竞争格局', en: 'Competition'},
      {zh: '时间序列', en: 'Time Series'},
    ],
    preview: {poster: 'media/poster/BumpChartStory.png', mp4: 'media/BumpChartStory.mp4'},
    source: {
      adapter: 'shotcraft-native',
      component: 'templates/bump-chart-story/BumpChartStory.tsx',
      schema: 'templates/bump-chart-story/schema.json',
      sampleData: 'templates/bump-chart-story/sample-data.json',
    },
  },
  {
    id: 'ShotCraft-DataMagnifierLens',
    slug: 'DataMagnifierLens',
    name: {zh: '数据放大镜', en: 'Data Magnifier Lens'},
    description: {
      zh: '沿趋势扫描并在关键异常停留放大，把“看见走势”和“解释异常”组织成同一个动态图表镜头。',
      en: 'Scan a trend and magnify the key anomaly, combining overview and focused explanation in one data shot.',
    },
    category: 'editorial_explainer',
    compatibleVisuals: ['line_chart', 'anomaly', 'focus_detail'],
    tags: [
      {zh: '异常解释', en: 'Anomaly'},
      {zh: '视觉聚焦', en: 'Focus'},
      {zh: '趋势', en: 'Trend'},
    ],
    preview: {poster: 'media/poster/DataMagnifierLens.png', mp4: 'media/DataMagnifierLens.mp4'},
    source: {
      adapter: 'shotcraft-native',
      component: 'templates/data-magnifier-lens/DataMagnifierLens.tsx',
      schema: 'templates/data-magnifier-lens/schema.json',
      sampleData: 'templates/data-magnifier-lens/sample-data.json',
    },
  },
  {
    id: 'ShotCraft-SourceToInsight',
    slug: 'SourceToInsight',
    name: {zh: '来源到洞察', en: 'Source to Insight'},
    description: {
      zh: '把原始表格、结构转换和可视化结论放在一个可追溯的解释镜头中，适合方法说明与数据来源交代。',
      en: 'Connect source rows, transformation, and the visual conclusion in a traceable explanatory shot.',
    },
    category: 'editorial_explainer',
    compatibleVisuals: ['table', 'bar_chart', 'provenance'],
    tags: [
      {zh: '数据来源', en: 'Source'},
      {zh: '可追溯', en: 'Traceable'},
      {zh: '解释镜头', en: 'Explainer'},
    ],
    preview: {poster: 'media/poster/SourceToInsight.png', mp4: 'media/SourceToInsight.mp4'},
    source: {
      adapter: 'shotcraft-native',
      component: 'templates/source-to-insight/SourceToInsight.tsx',
      schema: 'templates/source-to-insight/schema.json',
      sampleData: 'templates/source-to-insight/sample-data.json',
    },
  },
  {
    id: 'ShotCraft-ChoroplethRankMap',
    slug: 'ChoroplethRankMap',
    name: {zh: '区域分级着色地图', en: 'Choropleth Rank Map'},
    description: {
      zh: '将地区指标映射到真实地理边界，并同步显示排名、数值、来源和可编辑的颜色尺度。',
      en: 'Map regional metrics to real geographic boundaries with synchronized ranking, values, source, and an editable color scale.',
    },
    category: 'map_visualization',
    compatibleVisuals: ['choropleth', 'regional_comparison', 'ranking'],
    tags: [
      {zh: '分级设色', en: 'Choropleth'},
      {zh: '区域排名', en: 'Regional Rank'},
      {zh: '地图', en: 'Map'},
    ],
    preview: {poster: 'media/poster/ChoroplethRankMap.png', mp4: 'media/ChoroplethRankMap.mp4'},
    source: {
      adapter: 'shotcraft-native',
      component: 'templates/choropleth-rank-map/ChoroplethRankMap.tsx',
      schema: 'templates/choropleth-rank-map/schema.json',
      sampleData: 'templates/choropleth-rank-map/sample-data.json',
    },
  },
  {
    id: 'ShotCraft-MapRouteAccumulation',
    slug: 'MapRouteAccumulation',
    name: {zh: '地图路径累积', en: 'Map Route Accumulation'},
    description: {
      zh: '按叙事顺序绘制跨地区大圆路径，同时累积每条流向的结构化数值，适合贸易、迁移和供应链故事。',
      en: 'Draw geographic great-circle routes in narrative order while accumulating structured values for trade, migration, or supply-chain stories.',
    },
    category: 'map_visualization',
    compatibleVisuals: ['flow_map', 'route_map', 'accumulation'],
    tags: [
      {zh: '流向地图', en: 'Flow Map'},
      {zh: '路径累积', en: 'Accumulation'},
      {zh: '地理叙事', en: 'Geo Story'},
    ],
    preview: {poster: 'media/poster/MapRouteAccumulation.png', mp4: 'media/MapRouteAccumulation.mp4'},
    source: {
      adapter: 'shotcraft-native',
      component: 'templates/map-route-accumulation/MapRouteAccumulation.tsx',
      schema: 'templates/map-route-accumulation/schema.json',
      sampleData: 'templates/map-route-accumulation/sample-data.json',
    },
  },
  {
    id: 'ShotCraft-ChartFocusPush',
    slug: 'ChartFocusPush',
    name: {zh: '图表焦点推镜', en: 'Chart Focus Push'},
    description: {
      zh: '先建立完整趋势，再用缓慢推镜靠近异常节点；镜头只调度注意力，不改变图表数据几何。',
      en: 'Establish the full trend, then slowly push toward an anomaly without changing the chart geometry.',
    },
    category: 'chart_camera',
    compatibleVisuals: ['line_chart', 'anomaly', 'camera_focus'],
    tags: [
      {zh: '缓慢推镜', en: 'Slow Push'},
      {zh: '异常聚焦', en: 'Anomaly Focus'},
      {zh: '镜头调度', en: 'Camera Direction'},
    ],
    preview: {poster: 'media/poster/ChartFocusPush.png', mp4: 'media/ChartFocusPush.mp4'},
    source: {
      adapter: 'shotcraft-native',
      component: 'templates/chart-focus-push/ChartFocusPush.tsx',
      schema: 'templates/chart-focus-push/schema.json',
      sampleData: 'templates/chart-focus-push/sample-data.json',
    },
  },
  {
    id: 'ShotCraft-ChartTimelineTravel',
    slug: 'ChartTimelineTravel',
    name: {zh: '图表时间线巡航', en: 'Chart Timeline Travel'},
    description: {
      zh: '镜头沿多个数据时期逐段巡航，在每个里程碑留出阅读停顿，并在结论节点减速停稳。',
      en: 'Travel milestone by milestone with reading pauses, then brake smoothly into the final conclusion.',
    },
    category: 'chart_camera',
    compatibleVisuals: ['timeline', 'line_chart', 'milestone_story'],
    tags: [
      {zh: '时间线巡航', en: 'Timeline Travel'},
      {zh: '里程碑', en: 'Milestones'},
      {zh: '减速停稳', en: 'Braking Hold'},
    ],
    preview: {poster: 'media/poster/ChartTimelineTravel.png', mp4: 'media/ChartTimelineTravel.mp4'},
    source: {
      adapter: 'shotcraft-native',
      component: 'templates/chart-timeline-travel/ChartTimelineTravel.tsx',
      schema: 'templates/chart-timeline-travel/schema.json',
      sampleData: 'templates/chart-timeline-travel/sample-data.json',
    },
  },
  {
    id: 'ShotCraft-CraneRiseDashboard', slug: 'CraneRiseDashboard',
    name: {zh: '吊臂拉升揭示', en: 'Crane Rise Dashboard'},
    description: {zh: '从一个关键数据柱的近景拉升到完整比较结构，让局部发现自然过渡为全局解释。', en: 'Rise from one key data bar into the full comparison structure, moving from detail to system.'},
    category: 'chart_camera', compatibleVisuals: ['bar_chart','dashboard','structure_reveal'],
    tags: [{zh:'由近到远',en:'Detail to Overview'},{zh:'结构揭示',en:'Structure Reveal'},{zh:'吊臂运镜',en:'Crane Rise'}],
    preview: {poster:'media/poster/CraneRiseDashboard.png',mp4:'media/CraneRiseDashboard.mp4'},
    source: {adapter:'shotcraft-native',component:'templates/crane-rise-dashboard/CraneRiseDashboard.tsx',schema:'templates/crane-rise-dashboard/schema.json',sampleData:'templates/crane-rise-dashboard/sample-data.json'},
  },
  {
    id: 'ShotCraft-ParallaxMapGlide', slug: 'ParallaxMapGlide',
    name: {zh: '多层数据地图滑行', en: 'Parallax Map Glide'},
    description: {zh: '让环境、空间底图和数据节点以克制的速度差滑行，建立地理数据的层次与方向感。', en: 'Glide environment, spatial base, and data markers at restrained relative speeds for geographic depth.'},
    category: 'chart_camera', compatibleVisuals: ['map','network','spatial_data'],
    tags: [{zh:'多层视差',en:'Multiplane'},{zh:'地图滑行',en:'Map Glide'},{zh:'空间数据',en:'Spatial Data'}],
    preview: {poster:'media/poster/ParallaxMapGlide.png',mp4:'media/ParallaxMapGlide.mp4'},
    source: {adapter:'shotcraft-native',component:'templates/parallax-map-glide/ParallaxMapGlide.tsx',schema:'templates/parallax-map-glide/schema.json',sampleData:'templates/parallax-map-glide/sample-data.json'},
  },
  {
    id: 'ShotCraft-PullBackIsolation', slug: 'PullBackIsolation',
    name: {zh: '拉远孤立异常', en: 'Pull Back Isolation'},
    description: {zh: '先呈现完整群体，再拉远并暗化邻项，把异常对象从平均结构中清晰分离。', en: 'Show the cohort, then pull back and dim neighbors to isolate the true outlier.'},
    category: 'chart_camera', compatibleVisuals: ['comparison','outlier','small_multiples'],
    tags: [{zh:'异常孤立',en:'Outlier Isolation'},{zh:'拉远',en:'Pull Back'},{zh:'注意力调度',en:'Attention'}],
    preview: {poster:'media/poster/PullBackIsolation.png',mp4:'media/PullBackIsolation.mp4'},
    source: {adapter:'shotcraft-native',component:'templates/pull-back-isolation/PullBackIsolation.tsx',schema:'templates/pull-back-isolation/schema.json',sampleData:'templates/pull-back-isolation/sample-data.json'},
  },
  {
    id:'ShotCraft-SplitContextComparison',slug:'SplitContextComparison',name:{zh:'双场景数据对比',en:'Split Context Comparison'},
    description:{zh:'把同一指标放回两个程序化情境中比较，让数值差异与真实使用语境同时可读。',en:'Compare one metric across two programmatic contexts so the numeric difference retains real-world meaning.'},
    category:'contextual_overlay',compatibleVisuals:['comparison','contextual_scene','hero_metric'],
    tags:[{zh:'双场景',en:'Split Scene'},{zh:'情境对比',en:'Contextual Comparison'},{zh:'同尺度',en:'Shared Scale'}],
    preview:{poster:'media/poster/SplitContextComparison.png',mp4:'media/SplitContextComparison.mp4'},
    source:{adapter:'shotcraft-native',component:'templates/split-context-comparison/SplitContextComparison.tsx',schema:'templates/split-context-comparison/schema.json',sampleData:'templates/split-context-comparison/sample-data.json'},
  },
  {
    id:'ShotCraft-NegativeSpaceChartDock',slug:'NegativeSpaceChartDock',name:{zh:'负空间图表停靠',en:'Negative Space Chart Dock'},
    description:{zh:'根据主体保护区和安全区域自动寻找图表停靠位置，避免覆盖实景视觉主体。',en:'Resolve a chart dock from focal and safe regions without covering the contextual subject.'},
    category:'contextual_overlay',compatibleVisuals:['contextual_scene','chart_dock','subject_avoidance'],
    tags:[{zh:'主体避让',en:'Subject Avoidance'},{zh:'负空间',en:'Negative Space'},{zh:'自动布局',en:'Auto Layout'}],
    preview:{poster:'media/poster/NegativeSpaceChartDock.png',mp4:'media/NegativeSpaceChartDock.mp4'},
    source:{adapter:'shotcraft-native',component:'templates/negative-space-chart-dock/NegativeSpaceChartDock.tsx',schema:'templates/negative-space-chart-dock/schema.json',sampleData:'templates/negative-space-chart-dock/sample-data.json'},
  },
  {
    id:'ShotCraft-SourceToReconstruction',slug:'SourceToReconstruction',name:{zh:'原稿到可编辑复刻',en:'Source to Reconstruction'},
    description:{zh:'从程序化原稿和表格中扫描字段，再重构为可编辑图表，保留数据来源与映射关系。',en:'Scan a source table and reconstruct it as editable marks while preserving provenance and field mappings.'},
    category:'editorial_explainer',compatibleVisuals:['source_document','reconstruction','bar_chart'],
    tags:[{zh:'原稿复刻',en:'Reconstruction'},{zh:'可追溯',en:'Traceable'},{zh:'编辑化讲解',en:'Editorial'}],
    preview:{poster:'media/poster/SourceToReconstruction.png',mp4:'media/SourceToReconstruction.mp4'},
    source:{adapter:'shotcraft-native',component:'templates/source-to-reconstruction/SourceToReconstruction.tsx',schema:'templates/source-to-reconstruction/schema.json',sampleData:'templates/source-to-reconstruction/sample-data.json'},
  },
  {
    id:'ShotCraft-PresenterChartStage',slug:'PresenterChartStage',name:{zh:'主持人与图表舞台',en:'Presenter Chart Stage'},
    description:{zh:'程序化主持人轮廓与可编辑图表分区协作，按照讲解节拍切换注意力和结论。',en:'Coordinate a programmatic presenter silhouette with an editable chart and narrative beats.'},
    category:'presenter_explainer',compatibleVisuals:['presenter','chart_stage','explainer'],
    tags:[{zh:'主持人',en:'Presenter'},{zh:'讲解舞台',en:'Explainer Stage'},{zh:'轮流高亮',en:'Turn Taking'}],
    preview:{poster:'media/poster/PresenterChartStage.png',mp4:'media/PresenterChartStage.mp4'},
    source:{adapter:'shotcraft-native',component:'templates/presenter-chart-stage/PresenterChartStage.tsx',schema:'templates/presenter-chart-stage/schema.json',sampleData:'templates/presenter-chart-stage/sample-data.json'},
  },
  {
    id:'ShotCraft-SharedDataElementTransition',slug:'SharedDataElementTransition',name:{zh:'共享数据元素转场',en:'Shared Data Element Transition'},
    description:{zh:'让同一个数据对象从完整比较跨入结论场景，保持数值、标签和颜色身份连续。',en:'Carry one data object from evidence to conclusion while preserving value, label, and visual identity.'},
    category:'data_transition',compatibleVisuals:['bar_chart','shared_element','scene_transition'],
    tags:[{zh:'共享元素',en:'Shared Element'},{zh:'数据转场',en:'Data Transition'},{zh:'身份连续',en:'Identity Continuity'}],
    preview:{poster:'media/poster/SharedDataElementTransition.png',mp4:'media/SharedDataElementTransition.mp4'},
    source:{adapter:'shotcraft-native',component:'templates/shared-data-element-transition/SharedDataElementTransition.tsx',schema:'templates/shared-data-element-transition/schema.json',sampleData:'templates/shared-data-element-transition/sample-data.json'},
  },
  {
    id:'ShotCraft-StorySequenceGenerator',slug:'StorySequenceGenerator',name:{zh:'四镜头故事生成器',en:'Four-shot Story Generator'},
    description:{zh:'把主题、分类数据与结论直接编译为问题、情境、证据和结论四个连续镜头，并输出可渲染项目数据。',en:'Compile a topic, categorical data, and takeaway into four continuous question, context, evidence, and conclusion shots.'},
    category:'editorial_explainer',compatibleVisuals:['story_sequence','categorical_data','overview_pan','focus_push'],
    tags:[{zh:'故事生成',en:'Story Generation'},{zh:'四镜头',en:'Four Shots'},{zh:'可渲染数据',en:'Render-ready Data'}],
    preview:{poster:'media/poster/StorySequenceGenerator.png',mp4:'media/StorySequenceGenerator.mp4'},
    source:{adapter:'shotcraft-native',component:'templates/story-sequence-generator/StorySequenceGenerator.tsx',schema:'templates/story-sequence-generator/schema.json',sampleData:'templates/story-sequence-generator/sample-data.json'},
  },
  {
    id:'ShotCraft-VideoMetricOverlay',slug:'VideoMetricOverlay',name:{zh:'生成视频数据叠加',en:'Generated Video Metric Overlay'},
    description:{zh:'以 Agnes 生成的连续 MP4 为主要情境层，将指标放入视频负空间并同步冻结结论，避免图表遮挡现场主体。',en:'Use a continuous Agnes-generated MP4 as the context layer and place synchronized metrics in protected negative space.'},
    category:'video_data_fusion',compatibleVisuals:['video','metric_overlay','negative_space','documentary'],
    tags:[{zh:'Agnes 生成视频',en:'Agnes Video'},{zh:'负空间叠加',en:'Negative Space'},{zh:'同步结论',en:'Synchronized Takeaway'}],
    preview:{poster:'media/poster/VideoMetricOverlay.png',mp4:'media/VideoMetricOverlay.mp4'},
    source:{adapter:'shotcraft-native',component:'templates/video-data-overlay/VideoDataOverlay.tsx',schema:'templates/video-data-overlay/schema.json',sampleData:'templates/video-data-overlay/negative-space-data.json'},
  },
  {
    id:'ShotCraft-TrackedVideoCallout',slug:'TrackedVideoCallout',name:{zh:'视频对象跟踪标注',en:'Tracked Video Callout'},
    description:{zh:'用可编辑关键帧持续指向 Agnes 生成视频中的设备、人物或产品，同时保持标题与结论稳定。',en:'Track a device, person, or product in Agnes-generated footage with editable keyframes while keeping titles and takeaways stable.'},
    category:'video_data_fusion',compatibleVisuals:['video','tracking','callout','object_annotation'],
    tags:[{zh:'Agnes 生成视频',en:'Agnes Video'},{zh:'关键帧锚点',en:'Keyframe Anchors'},{zh:'视频标注',en:'Video Annotation'}],
    preview:{poster:'media/poster/TrackedVideoCallout.png',mp4:'media/TrackedVideoCallout.mp4'},
    source:{adapter:'shotcraft-native',component:'templates/video-data-overlay/VideoDataOverlay.tsx',schema:'templates/video-data-overlay/schema.json',sampleData:'templates/video-data-overlay/tracked-callout-data.json'},
  },
];

const updateLibrary = () => {
  const library = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
  library.categories.presenter_explainer = {zh: '主持人解读', en: 'Presenter explainers'};
  library.categories.ranking_reveal = {zh: '排名与分层', en: 'Rankings & tiers'};
  library.categories.race_chart = {zh: '动态竞赛', en: 'Animated races'};
  library.categories.contextual_overlay = {zh: '情境叠加', en: 'Contextual overlays'};
  library.categories.editorial_explainer = {zh: '编辑化讲解', en: 'Editorial explainers'};
  library.categories.map_visualization = {zh: '地图可视化', en: 'Map visualizations'};
  library.categories.chart_camera = {zh: '图表运镜', en: 'Chart camera moves'};
  library.categories.data_transition = {zh: '数据转场', en: 'Data transitions'};
  library.categories.video_data_fusion = {zh: '视频数据融合', en: 'Video-data fusion'};
  const nativeIds = new Set(cards.map(card => card.id));
  library.cards = [...cards, ...library.cards.filter(item => !nativeIds.has(item.id))];
  fs.writeFileSync(libraryPath, `${JSON.stringify(enrichLibrary(library), null, 2)}\n`);
  const publishedRecipes = path.join(root, 'gallery', 'recipes');
  fs.mkdirSync(publishedRecipes, {recursive: true});
  for (const card of cards) {
    fs.copyFileSync(
      path.join(root, 'recipes', `${card.slug}.md`),
      path.join(publishedRecipes, `${card.slug}.md`),
    );
  }
};

const run = async () => {
  fs.mkdirSync(posterDir, {recursive: true});
  const requested = cards.filter(card => !only || only.split(',').some(value => [card.id, card.slug].includes(value)));
  if (!requested.length) throw new Error(`Unknown native recipe: ${only}`);
  const queue = requested.filter(card => {
    const video = path.join(mediaDir, `${card.slug}.mp4`);
    const poster = path.join(posterDir, `${card.slug}.png`);
    return force || !fs.existsSync(video) || !fs.existsSync(poster);
  });
  if (!queue.length) {
    updateLibrary();
    process.stdout.write('Reused existing native previews and updated the library.\n');
    return;
  }

  const serveUrl = await bundle({
    entryPoint: path.join(root, 'src/index.ts'),
  });
  const compositions = await getCompositions(serveUrl);
  for (const card of queue) {
    const composition = compositions.find(item => item.id === card.id);
    if (!composition) throw new Error(`Composition not found: ${card.id}`);
    const outputVideo = path.join(mediaDir, `${card.slug}.mp4`);
    const outputPng = path.join(posterDir, `${card.slug}.png`);
    // Keep video and poster sequential. Running two Chromium renderers in
    // parallel is fragile on shared research machines with other Remotion jobs.
    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      outputLocation: outputVideo,
      crf: 18,
      scale: 1,
      concurrency: 1,
      muted: true,
    });
    await renderStill({
      composition,
      serveUrl,
      output: outputPng,
      frame: composition.durationInFrames - 24,
      imageFormat: 'png',
      scale: 1,
    });
    process.stdout.write(`Rendered ${path.relative(root, outputVideo)}\n`);
  }
  updateLibrary();
  process.stdout.write(`Updated ${queue.length} native recipe preview(s).\n`);
};

run().catch(error => {
  console.error(error);
  process.exit(1);
});
