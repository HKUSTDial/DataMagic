// Search only user-facing metadata, not internal paths, IDs or media manifests.
const categoryAliases = {
  bar_chart: '柱状图 条形图 柱形图 棒图 bar chart column chart',
  race_chart: '动态排名 排行榜 柱状图竞赛 条形图竞赛 动态柱状图 排名变化 数据竞赛 bar chart race racing ranking',
  ranking_reveal: '排行榜 排名 榜单 倒计时 揭晓 ranking countdown reveal',
  line_chart: '折线图 曲线图 趋势图 line chart trend',
  trend_analysis: '趋势图 增长 变化 走势 trend growth',
  pie_chart: '饼图 环形图 圆环图 甜甜圈图 占比 比例 pie donut doughnut share',
  scatter_chart: '散点图 气泡图 象限图 scatter bubble quadrant',
  radar_chart: '雷达图 蜘蛛图 能力对比 radar spider',
  heatmap: '热力图 热度图 heatmap',
  waterfall_chart: '瀑布图 贡献拆解 waterfall contribution',
  comparison_chart: '对比 比较 comparison',
  flow_sankey: '桑基图 流向图 流量图 流程 sankey flow',
  stat_cards: '指标卡 数字卡 数据看板 仪表盘 KPI dashboard',
  timeline: '时间线 时间轴 里程碑 timeline milestones',
  map_visualization: '地图 地理 国家 区域 map geography country region',
  presenter_explainer: '主持人 口播 解说 讲解 数据故事 presenter explainer',
  editorial_explainer: '讲解 数据故事 编辑化 叙事 editorial story',
  narrative_card: '故事 叙事 字幕 文案 narrative story',
  narrative_scene: '故事 场景 情境 narrative scene',
  contextual_overlay: '实景 场景 数据叠加 视频融合 footage overlay',
  video_data_fusion: '视频 实拍 实景 数据叠加 视频融合 video footage overlay',
  chart_camera: '运镜 镜头 推拉摇移 推镜 拉远 camera zoom pan',
  data_transition: '转场 过渡 衔接 transition',
};
const cardAliases = {
  CharacterPerspectiveBoard: '猫 小猫 猫咪 猫主持 小猫主持 斜卡片 倾斜卡片 透视卡片 cat presenter tilted card',
  BarChartRace: '国家排名 国家排行榜 国旗 排名竞赛',
  BumpChartStory: '国家排名 国旗 排名轨迹 bump chart',
  ChoroplethRankMap: '国家排名 国旗 分级地图 choropleth',
  CoffeeRatingHorizontalRanking: '咖啡 饮品 图标 coffee drinks icons',
  ParallaxMapGlide: '地图运镜 地图滑动 地图滑行 视差地图 parallax map',
  SourceToReconstruction: '表格转图表 财报截图 原图复刻 还原',
};
const visualAliases = {
  presenter: '主持人 口播 解说 presenter',
  time_series: '时间序列 趋势 走势 time series',
  ranking: '排名 排行榜 榜单 ranking',
  geography: '地理 地图 geography',
  editorial_story: '数据故事 故事化 叙事 data story',
};
export const normalizeSearch = value => String(value ?? '').normalize('NFKC').toLowerCase()
  .replace(/条形图|柱形图|棒图/g, '柱状图')
  .replace(/圆环图|甜甜圈图/g, '环形图')
  .replace(/曲线图/g, '折线图')
  .replace(/时间轴/g, '时间线');

function textValues(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(textValues);
  if (value && typeof value === 'object') return Object.values(value).flatMap(textValues);
  return [];
}

export function createCardSearchIndex(cards, categories = {}, collections = []) {
  return new Map(cards.map(card => {
    const fields = [card.slug, card.name, card.description, card.tags,
      categories[card.category], categoryAliases[card.category], cardAliases[card.slug],
      ...(card.compatibleVisuals || []).map(v => visualAliases[v]),
      ...collections.filter(collection => collection.match(card)).map(c => [c.name, c.description])];
    return [card.id, normalizeSearch(textValues(fields).join(' '))];
  }));
}

export function matchesCardSearch(index, card, query) {
  // Space/comma-separated terms are ANDed; either language works in either UI.
  const terms = normalizeSearch(query).split(/[\s,，、;；]+/u).filter(Boolean);
  const text = index.get(card.id) || '';
  return terms.every(term => text.includes(term));
}
