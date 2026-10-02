// Collections describe intent; categories retain the concrete visual form.
const hasShape = (item, shape) => (item.selection?.dataShapes || []).includes(shape);
const hasVisual = (item, visual) => (item.compatibleVisuals || []).includes(visual);
export const collectionDefinitions = [
  {id: 'storytelling', name: {zh: '故事化讲解', en: 'Story-led explainers'}, description: {zh: '设问、证据、转折与结论', en: 'Questions, evidence, turns, and takeaways'}, match: item => hasVisual(item, 'editorial_story') || ['presenter_explainer', 'editorial_explainer'].includes(item.category)},
  {id: 'ranking', name: {zh: '排名与揭晓', en: 'Rankings & reveals'}, description: {zh: '竞争、换位与逐项揭晓', en: 'Competition, overtakes, and staged reveals'}, match: item => ['race_chart', 'ranking_reveal'].includes(item.category) || hasVisual(item, 'ranking')},
  {id: 'trends', name: {zh: '趋势与变化', en: 'Trends & change'}, description: {zh: '时间变化、增长与转折', en: 'Change, growth, and turning points'}, match: item => hasShape(item, 'time_series') && item.category !== 'race_chart'},
  {id: 'maps', name: {zh: '地图故事', en: 'Map stories'}, description: {zh: '区域比较与地理路线', en: 'Regional comparisons and geographic routes'}, match: item => hasShape(item, 'geography')},
  {id: 'context', name: {zh: '实景与视频', en: 'Scenes & video'}, description: {zh: '情境画面与精确信息组合', en: 'Contextual footage with precise data'}, match: item => ['contextual_overlay', 'video_data_fusion'].includes(item.category) && !hasVisual(item, 'presenter')},
  {id: 'presenter', name: {zh: '主持人讲解', en: 'Presenter-led'}, description: {zh: '人物引导与数据逐步展开', en: 'Presenter-guided data explanation'}, match: item => hasVisual(item, 'presenter')},
  {id: 'hooks', name: {zh: '开场与重点', en: 'Hooks & focus'}, description: {zh: '提出问题、定位异常与强调结论', en: 'Questions, outliers, and key takeaways'}, match: item => (item.selection?.narrativeRoles || []).includes('hook')},
  {id: 'evidence', name: {zh: '证据与还原', en: 'Evidence & reconstruction'}, description: {zh: '从来源、表格到可编辑图表', en: 'From source tables to editable charts'}, match: item => hasShape(item, 'source_table')},
];

export const categoryGroups = [
  {name: {zh: '讲解与故事', en: 'Explanation & stories'}, ids: ['presenter_explainer', 'editorial_explainer', 'narrative_card', 'ranking_reveal', 'race_chart']},
  {name: {zh: '实景与情境', en: 'Footage & context'}, ids: ['video_data_fusion', 'contextual_overlay', 'narrative_scene']},
  {name: {zh: '镜头与转场', en: 'Camera & transitions'}, ids: ['chart_camera', 'data_transition']},
  {name: {zh: '图表类型', en: 'Chart types'}, ids: ['bar_chart', 'line_chart', 'pie_chart', 'scatter_chart', 'radar_chart', 'heatmap', 'waterfall_chart', 'comparison_chart', 'flow_sankey', 'trend_analysis', 'stat_cards', 'timeline', 'map_visualization']},
];
