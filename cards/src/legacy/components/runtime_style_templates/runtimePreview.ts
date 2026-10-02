export type RuntimePreviewTemplate = {
  id: string;
  name: string;
  chartType: 'bar_chart' | 'line_chart' | 'pie_chart' | 'scatter_chart' | 'stat_cards' | 'comparison_chart' | 'flow_sankey' | 'waterfall_chart' | 'radar_chart' | 'heatmap' | 'timeline' | 'opening' | 'narrative_card' | 'closing';
  theme: 'light' | 'dark';
  accent: string;
  dataContract: string;
  entrance: string;
  emphasis: string;
  subtitleSafeArea: 'bottom' | 'center_bottom' | 'low_bottom';
  highlightTargets: string[];
  suggestedNarration: string;
  triggerPhrase: string;
  animationIntent: string;
};

const runtimeTemplate = (
  id: string,
  name: string,
  chartType: RuntimePreviewTemplate['chartType'],
  theme: RuntimePreviewTemplate['theme'],
  accent: string,
  dataContract: string,
  entrance: string,
  emphasis: string,
  highlightTargets: string[],
  suggestedNarration: string,
  triggerPhrase: string,
  animationIntent: string,
): RuntimePreviewTemplate => ({
  id,
  name,
  chartType,
  theme,
  accent,
  dataContract,
  entrance,
  emphasis,
  subtitleSafeArea: 'bottom',
  highlightTargets,
  suggestedNarration,
  triggerPhrase,
  animationIntent,
});

export const RUNTIME_PREVIEW_TEMPLATES: RuntimePreviewTemplate[] = [
  runtimeTemplate('StyleTemplate-BasicBarChart', 'Basic Bar Chart', 'bar_chart', 'light', '#2563eb', 'category values', 'column grow', 'column focus highlight', ['bar', 'label', 'value'], 'By Jun, the category reaches 205K.', 'Jun', 'Highlight the named column and its value.'),
  runtimeTemplate('StyleTemplate-ExecutiveHorizontalBars', 'Executive Horizontal Bars', 'bar_chart', 'light', '#2563eb', 'ranked items', 'progressive bar reveal', 'row focus highlight', ['bar', 'label', 'value'], 'By August, revenue leads the ranking at 241K.', 'August', 'Focus the leading ranked row when the narration names it.'),
  runtimeTemplate('StyleTemplate-LightDenseRankingBar', 'Light Dense Ranking Bar', 'bar_chart', 'light', '#0ea5e9', 'ranked items', 'progressive bar reveal', 'row focus highlight', ['bar', 'label', 'value'], 'August stands out as the top ranked period.', 'August', 'Focus the named rank row without moving the chart layout.'),
  runtimeTemplate('StyleTemplate-DarkCompactBarRanking', 'Dark Compact Bar Ranking', 'bar_chart', 'dark', '#38bdf8', 'ranked items', 'stacked row reveal', 'row focus highlight', ['row', 'bar', 'value'], 'August is the clear leader in this ranking.', 'August', 'Lift the full row, bar, and value together.'),
  runtimeTemplate('StyleTemplate-DenseRankingTable', 'Dense Ranking Table', 'bar_chart', 'dark', '#60a5fa', 'dense ranked items', 'compact row reveal', 'row focus highlight', ['row', 'rank', 'bar', 'value'], 'San Francisco leads the dense ranking at 928 active users.', 'San Francisco', 'Highlight the named dense table row.'),
  runtimeTemplate('StyleTemplate-CompactColumnKpi', 'Compact Column KPI', 'bar_chart', 'dark', '#f472b6', 'time or category values', 'column grow', 'column focus highlight', ['bar', 'label', 'value'], 'June is where the column sequence reaches its key value.', 'June', 'Mark the named column and its value label.'),
  runtimeTemplate('StyleTemplate-LeaderboardCardGrid', 'Leaderboard Card Grid', 'bar_chart', 'dark', '#fbbf24', 'ranked items', 'card grid reveal', 'card focus highlight', ['card', 'bar', 'value'], 'August takes the top card on the leaderboard.', 'August', 'Highlight the matching card, mini bar, and value.'),
  runtimeTemplate('StyleTemplate-SteppedBarStrip', 'Stepped Bar Strip', 'bar_chart', 'dark', '#60a5fa', 'dense ranked items', 'stepped strip reveal', 'strip row highlight', ['strip', 'label', 'value'], 'Aug is the top strip in the ranking.', 'Aug', 'Highlight the named strip without changing layout height.'),
  runtimeTemplate('StyleTemplate-BasicLineChart', 'Basic Line Chart', 'line_chart', 'light', '#2563eb', 'time series', 'line draw', 'point focus highlight', ['point', 'label', 'value'], 'By Aug, the trend reaches 241K.', 'Aug', 'Highlight the named point when the narration names it.'),
  runtimeTemplate('StyleTemplate-MetricTrendRibbon', 'Metric Trend Ribbon', 'line_chart', 'light', '#2563eb', 'time series', 'line draw', 'point focus highlight', ['point', 'label', 'value'], 'By August, the trend reaches 241K.', 'August', 'Pin the named point after the line has drawn.'),
  runtimeTemplate('StyleTemplate-CleanTrendCard', 'Clean Trend Card', 'line_chart', 'light', '#3b82f6', 'time series', 'line draw', 'point focus highlight', ['point', 'label', 'value'], 'August is the peak point in this trend.', 'August', 'Show the point marker and value callout.'),
  runtimeTemplate('StyleTemplate-LightFocusLine', 'Light Focus Line', 'line_chart', 'light', '#0ea5e9', 'time series', 'line draw', 'point value spotlight', ['point', 'value', 'summary'], 'By August, the latest value confirms the upward trend.', 'August', 'Spotlight the named point and keep the summary panel stable.'),
  runtimeTemplate('StyleTemplate-DarkEditorialTrend', 'Dark Editorial Trend', 'line_chart', 'dark', '#a78bfa', 'time series', 'line draw', 'editorial point callout', ['point', 'annotation'], 'August marks the strongest late-period signal.', 'August', 'Use an editorial callout on the named point.'),
  runtimeTemplate('StyleTemplate-DualSeriesPulseLine', 'Dual Series Pulse Line', 'line_chart', 'dark', '#22d3ee', 'two time series', 'dual line draw', 'series point highlight', ['series', 'point'], 'Revenue remains the series to watch in August.', 'Revenue', 'Bring the named series forward while muting the other series.'),
  runtimeTemplate('StyleTemplate-MarginSlopeComparison', 'Margin Shift by Channel', 'line_chart', 'dark', '#16a34a', 'start/end comparison', 'slope reveal', 'endpoint highlight', ['line', 'endpoint', 'label'], 'Direct expands the most from start to end.', 'Direct', 'Highlight the named slope and its end point.'),
  runtimeTemplate('StyleTemplate-LongTrendline', 'Long Trendline', 'line_chart', 'dark', '#fbbf24', 'long time series', 'line draw', 'point focus highlight', ['point', 'value'], 'August is the latest high in the long trend.', 'August', 'Mark the named late-period point.'),
  runtimeTemplate('StyleTemplate-DarkSignalTrendline', 'Dark Signal Trendline', 'line_chart', 'dark', '#22d3ee', 'time series', 'line draw', 'signal point highlight', ['point', 'signal'], 'August is the signal point that matters.', 'August', 'Pulse the named signal point and label.'),
  runtimeTemplate('StyleTemplate-BasicPieChart', 'Basic Pie Chart', 'pie_chart', 'light', '#0891b2', 'positive share items', 'slice reveal', 'slice focus highlight', ['slice', 'legend', 'value'], 'Enterprise owns the largest share at 42 percent.', 'Enterprise', 'Highlight the named slice and legend row.'),
  runtimeTemplate('StyleTemplate-MarketShareDonut', 'Market Share Donut', 'pie_chart', 'light', '#2563eb', 'positive share items', 'slice reveal', 'slice focus highlight', ['slice', 'legend', 'value'], 'Enterprise owns the largest share at 42 percent.', 'Enterprise', 'Focus the named slice and legend row.'),
  runtimeTemplate('StyleTemplate-LightMultiSlicePie', 'Light Multi-Slice Pie', 'pie_chart', 'light', '#0891b2', 'positive share items', 'slice reveal', 'slice focus highlight', ['slice', 'legend', 'value'], 'Enterprise is the dominant share segment.', 'Enterprise', 'Focus the matching slice and percentage label.'),
  runtimeTemplate('StyleTemplate-MultiSliceDonut', 'Multi-Slice Donut', 'pie_chart', 'dark', '#60a5fa', 'positive share items', 'donut reveal', 'slice focus highlight', ['slice', 'legend', 'value'], 'Enterprise is the dominant share segment.', 'Enterprise', 'Focus the matching donut slice and legend row.'),
  runtimeTemplate('StyleTemplate-DarkCompactDonutShare', 'Dark Compact Donut Share', 'pie_chart', 'dark', '#22d3ee', 'positive share items', 'donut reveal', 'slice focus highlight', ['slice', 'label'], 'Enterprise is the segment that leads the mix.', 'Enterprise', 'Bring the named donut segment forward.'),
  runtimeTemplate('StyleTemplate-RaceTrackShare', 'Race Track Share', 'pie_chart', 'dark', '#3b82f6', 'positive share items', 'track reveal', 'track focus highlight', ['track', 'label', 'value'], 'Enterprise runs ahead of the other share tracks.', 'Enterprise', 'Highlight the named track and value.'),
  runtimeTemplate('StyleTemplate-StackedShareBar', 'Stacked Share Bar', 'pie_chart', 'dark', '#60a5fa', 'positive share items', 'stacked share reveal', 'segment focus highlight', ['segment', 'legend', 'value'], 'Mobile App is the largest channel at 24.8 percent.', 'Mobile App', 'Highlight the named stacked-share segment and legend row.'),
  runtimeTemplate('StyleTemplate-BasicStatCards', 'Basic Stat Cards', 'stat_cards', 'dark', '#60a5fa', 'KPI cards', 'card reveal', 'KPI card highlight', ['card', 'metric', 'value'], 'Revenue is the metric to watch at 241K.', 'Revenue', 'Highlight the named KPI card and value.'),
  runtimeTemplate('StyleTemplate-StatCardsKpiTrio', 'Stat Cards KPI Trio', 'stat_cards', 'light', '#2563eb', 'KPI cards', 'card reveal', 'KPI card highlight', ['card', 'metric', 'delta'], 'Revenue is the headline KPI at 241K.', 'Revenue', 'Focus the named KPI card and delta.'),
  runtimeTemplate('StyleTemplate-KpiMicroDashboard', 'KPI Micro Dashboard', 'stat_cards', 'light', '#2563eb', 'KPI cards', 'dashboard reveal', 'KPI card highlight', ['card', 'metric'], 'Revenue is the dashboard metric to watch.', 'Revenue', 'Focus the named dashboard card.'),
  runtimeTemplate('StyleTemplate-LightHeroNumber', 'Light Hero Number', 'stat_cards', 'light', '#0284c7', 'hero KPI', 'hero number reveal', 'hero KPI highlight', ['hero number', 'supporting metric'], 'Revenue is the hero number in this view.', 'Revenue', 'Make the hero KPI the visual anchor.'),
  runtimeTemplate('StyleTemplate-DarkKpiMicroDashboard', 'Dark KPI Micro Dashboard', 'stat_cards', 'dark', '#a78bfa', 'KPI cards', 'dashboard reveal', 'KPI card highlight', ['card', 'metric'], 'Revenue is the strongest dashboard signal.', 'Revenue', 'Focus the named metric card in the dashboard.'),
  runtimeTemplate('StyleTemplate-HeroNumberSpotlight', 'Hero Number Spotlight', 'stat_cards', 'dark', '#38bdf8', 'hero KPI', 'spotlight reveal', 'hero KPI highlight', ['hero number', 'supporting metric'], 'Revenue takes the spotlight as the key KPI.', 'Revenue', 'Spotlight the named hero metric.'),
  runtimeTemplate('StyleTemplate-LuxuryBlackGoldMetrics', 'Luxury Black Gold Metrics', 'stat_cards', 'dark', '#d6ad60', 'KPI cards', 'premium card reveal', 'metric row highlight', ['metric', 'value'], 'Revenue is the premium metric to emphasize.', 'Revenue', 'Highlight the named metric row and value.'),
  runtimeTemplate('StyleTemplate-CyberCommandCenter', 'Cyber Command Center', 'stat_cards', 'dark', '#22d3ee', 'KPI cards', 'command panel reveal', 'KPI signal highlight', ['card', 'signal', 'metric'], 'Revenue is the command signal to monitor.', 'Revenue', 'Focus the named command-center signal.'),
  runtimeTemplate('StyleTemplate-ScatterOpportunityMap', 'Scatter Opportunity Map', 'scatter_chart', 'light', '#10b981', 'x/y scatter items', 'point reveal', 'opportunity point highlight', ['point', 'label', 'axis'], 'Enterprise is the opportunity outlier.', 'Enterprise', 'Highlight the named opportunity point and label.'),
  runtimeTemplate('StyleTemplate-BrightScatterGrid', 'Bright Scatter Grid', 'scatter_chart', 'light', '#10b981', 'x/y scatter items', 'point reveal', 'grid point highlight', ['point', 'label', 'axis'], 'Enterprise stands out on the grid.', 'Enterprise', 'Highlight the named point in the bright grid.'),
  runtimeTemplate('StyleTemplate-LightDenseScatter', 'Light Dense Scatter', 'scatter_chart', 'light', '#2563eb', 'x/y scatter items', 'dense point reveal', 'point focus highlight', ['point', 'label'], 'Enterprise is the dense scatter point to watch.', 'Enterprise', 'Highlight the named dense scatter point.'),
  runtimeTemplate('StyleTemplate-DarkCompactScatterPanel', 'Dark Compact Scatter Panel', 'scatter_chart', 'dark', '#38bdf8', 'x/y scatter items', 'point reveal', 'compact point highlight', ['point', 'label'], 'Enterprise is the compact panel outlier.', 'Enterprise', 'Highlight the named compact scatter point.'),
  runtimeTemplate('StyleTemplate-DenseScatterCloud', 'Dense Scatter Cloud', 'scatter_chart', 'dark', '#60a5fa', 'x/y scatter items', 'point cloud reveal', 'point focus highlight', ['point', 'label'], 'Enterprise is the outlier to watch.', 'Enterprise', 'Highlight the named scatter point and label.'),
  runtimeTemplate('StyleTemplate-QuadrantSplitScatter', 'Quadrant Split Scatter', 'scatter_chart', 'dark', '#a78bfa', 'x/y scatter items', 'quadrant reveal', 'point focus highlight', ['point', 'quadrant', 'label'], 'Enterprise lands in the strongest quadrant.', 'Enterprise', 'Highlight the named scatter point against the quadrant split.'),
  runtimeTemplate('StyleTemplate-HorizontalBarMatrix', 'Horizontal Bar Matrix', 'bar_chart', 'dark', '#fbbf24', 'ranked items', 'progressive bar reveal', 'row focus highlight', ['bar', 'label', 'value'], 'San Francisco leads the matrix at 928 active users.', 'San Francisco', 'Highlight the named matrix row and value.'),
  runtimeTemplate('StyleTemplate-SalesByRegionDarkColumn', 'Sales by Region Dark Column', 'bar_chart', 'dark', '#38bdf8', 'category values', 'column grow', 'column focus highlight', ['column', 'label', 'value'], 'The West region tops the columns at 241K.', 'West', 'Highlight the named column and value.'),
  runtimeTemplate('StyleTemplate-CoffeeRatingHorizontalRanking', 'Coffee Rating Horizontal Ranking', 'bar_chart', 'light', '#b45309', 'ranked items', 'card row reveal', 'row focus highlight', ['rank', 'label', 'value'], 'Ethiopia leads the rating ranking at 4.8.', 'Ethiopia', 'Highlight the named ranked row and rating.'),
  runtimeTemplate('StyleTemplate-AreaStackTrend', 'Area Stack Trend', 'line_chart', 'dark', '#34d399', 'multi-series time series', 'stacked area draw', 'series focus highlight', ['series', 'area', 'label'], 'Mobile remains the largest channel in 2024.', 'Mobile', 'Bring the named channel forward while muting the other stacked areas.'),
  runtimeTemplate('StyleTemplate-SteppedLineRanking', 'Stepped Line Ranking', 'line_chart', 'dark', '#60a5fa', 'multi-series ranking', 'rank movement draw', 'series focus highlight', ['series', 'line', 'rank'], 'Apple holds the top rank in the latest quarter.', 'Apple', 'Bring the named company forward while muting the other rank lines.'),
  runtimeTemplate('StyleTemplate-NestedRingShare', 'Nested Ring Share', 'pie_chart', 'light', '#2563eb', 'positive share items', 'ring reveal', 'ring focus highlight', ['ring', 'label', 'value'], 'Enterprise holds the largest ring share at 42 percent.', 'Enterprise', 'Highlight the named ring and legend value.'),
  runtimeTemplate('StyleTemplate-LabeledScatterGrid', 'Labeled Scatter Grid', 'scatter_chart', 'light', '#2563eb', 'x/y scatter items', 'point reveal', 'point focus highlight', ['point', 'label'], 'Enterprise sits highest on the labeled grid.', 'Enterprise', 'Highlight the named labeled scatter point.'),
  runtimeTemplate('StyleTemplate-MultiEntityScatterMatrix', 'Multi-Entity Scatter Matrix', 'scatter_chart', 'dark', '#60a5fa', 'x/y scatter items', 'point reveal', 'point focus highlight', ['point', 'label', 'quadrant'], 'Enterprise leads the upper quadrant of the matrix.', 'Enterprise', 'Highlight the named point against the matrix split.'),
  runtimeTemplate('StyleTemplate-DepartmentHeadcountDarkBar', 'Department Headcount Dark Bar', 'bar_chart', 'dark', '#38bdf8', 'ranked items', 'progressive bar reveal', 'row focus highlight', ['bar', 'label', 'value'], 'Engineering leads headcount at 128.', 'Engineering', 'Highlight the named headcount row and value.'),
  runtimeTemplate('StyleTemplate-CustomerSegmentsScatter', 'Customer Segments Scatter', 'scatter_chart', 'light', '#2563eb', 'x/y scatter items', 'point reveal', 'point focus highlight', ['point', 'label'], 'Enterprise sits highest among the segments.', 'Enterprise', 'Highlight the named customer segment point.'),
  runtimeTemplate('StyleTemplate-PortfolioBubbleMatrix', 'Portfolio Bubble Matrix', 'scatter_chart', 'light', '#6366f1', 'x/y/size scatter items', 'bubble reveal', 'bubble focus highlight', ['bubble', 'label'], 'Enterprise is the largest bubble in the portfolio.', 'Enterprise', 'Highlight the named portfolio bubble.'),
  runtimeTemplate('StyleTemplate-MarketTreemapMosaic', 'Market Treemap Mosaic', 'pie_chart', 'dark', '#2563eb', 'positive share items', 'tile reveal', 'tile focus highlight', ['tile', 'label', 'value'], 'Enterprise owns the largest market tile at 42 percent.', 'Enterprise', 'Highlight the named treemap tile and value.'),
  runtimeTemplate('StyleTemplate-SegmentTreemapVertical', 'Segment Treemap Vertical', 'pie_chart', 'dark', '#60a5fa', 'positive share items', 'segment reveal', 'segment focus highlight', ['segment', 'legend', 'value'], 'Mobile App is the tallest segment at 24.8 percent.', 'Mobile App', 'Highlight the named vertical segment and legend.'),
  runtimeTemplate('StyleTemplate-SemiGaugeProgress', 'Semi Gauge Progress', 'pie_chart', 'light', '#2563eb', 'positive share items', 'gauge sweep', 'segment focus highlight', ['segment', 'label', 'value'], 'Enterprise leads the gauge at 42 percent.', 'Enterprise', 'Highlight the named gauge segment and share.'),
  runtimeTemplate('StyleTemplate-SlopeChangeRanking', 'Slope Change Ranking', 'line_chart', 'light', '#2563eb', 'start/end rows', 'slope draw', 'slope focus highlight', ['slope', 'label', 'delta'], 'Direct shows the steepest rise from start to end.', 'Direct', 'Highlight the named slope line and its change.'),
  runtimeTemplate('StyleTemplate-SmallMultiplesTrend', 'Small Multiples Trend', 'line_chart', 'dark', '#3b82f6', 'multi-series points', 'panel reveal', 'panel focus highlight', ['panel', 'series', 'value'], 'APAC shows the strongest acceleration across the regional panels.', 'APAC', 'Bring the named regional panel forward.'),
  runtimeTemplate('StyleTemplate-SwissMinimalReport', 'Swiss Minimal Report', 'bar_chart', 'light', '#2563eb', 'category values', 'report row reveal', 'row focus highlight', ['row', 'label', 'value'], 'August is the strongest reported value.', 'Aug', 'Highlight the named report row.'),
  runtimeTemplate('StyleTemplate-EditorialDataStory', 'Editorial Data Story', 'line_chart', 'light', '#ef4444', 'trend plus editorial headline', 'editorial reveal', 'point focus highlight', ['headline', 'point', 'value'], 'August is the editorial signal that frames the trend.', 'August', 'Bring the named point and headline forward together.'),
  runtimeTemplate('StyleTemplate-QuarterlyRevenueGroupedBar', 'Quarterly Revenue Grouped Bar', 'comparison_chart', 'light', '#2563eb', 'grouped comparison values', 'grouped bar reveal', 'group focus highlight', ['group', 'bar', 'value'], 'Q4 shows the clearest revenue and cost separation.', 'Q4', 'Highlight the named comparison group.'),
  runtimeTemplate('StyleTemplate-LightWideComparison', 'Light Wide Comparison', 'comparison_chart', 'light', '#2563eb', 'grouped comparison values', 'wide group reveal', 'group focus highlight', ['group', 'bar', 'value'], 'Q4 is the comparison group to watch.', 'Q4', 'Highlight the named wide comparison group.'),
  runtimeTemplate('StyleTemplate-LightComparisonPanel', 'Light Comparison Panel', 'comparison_chart', 'light', '#2563eb', 'grouped comparison values', 'panel reveal', 'group focus highlight', ['group', 'metric', 'value'], 'Q4 leads the comparison panel.', 'Q4', 'Focus the named comparison panel row.'),
  runtimeTemplate('StyleTemplate-DarkComparisonPanel', 'Dark Comparison Panel', 'comparison_chart', 'dark', '#60a5fa', 'grouped comparison values', 'panel reveal', 'group focus highlight', ['group', 'metric', 'value'], 'Q4 stands out in the dark comparison panel.', 'Q4', 'Focus the named comparison panel row.'),
  runtimeTemplate('StyleTemplate-WideComparisonGrid', 'Wide Comparison Grid', 'comparison_chart', 'light', '#2563eb', 'grouped comparison values', 'grid reveal', 'group focus highlight', ['group', 'metric', 'value'], 'Q4 carries the strongest comparison signal.', 'Q4', 'Highlight the named comparison grid group.'),
  runtimeTemplate('StyleTemplate-ConversionFunnelClean', 'Conversion Funnel Clean', 'flow_sankey', 'light', '#2563eb', 'flow/funnel stages', 'funnel stage reveal', 'stage focus highlight', ['stage', 'flow', 'value'], 'Qualified leads are the conversion stage to watch.', 'Qualified', 'Highlight the named funnel stage.'),
  runtimeTemplate('StyleTemplate-LightFlowSankey', 'Light Flow Sankey', 'flow_sankey', 'light', '#2563eb', 'flow/funnel stages', 'flow reveal', 'node focus highlight', ['node', 'flow', 'value'], 'Qualified leads carry the largest flow.', 'Qualified', 'Highlight the named flow node.'),
  runtimeTemplate('StyleTemplate-LongFlowSankey', 'Long Flow Sankey', 'flow_sankey', 'dark', '#3b82f6', 'flow/funnel stages', 'long flow reveal', 'node focus highlight', ['node', 'flow', 'value'], 'Enterprise receives flows from multiple acquisition channels.', 'Enterprise', 'Highlight the named destination node.'),
  runtimeTemplate('StyleTemplate-SupplyChainSankeyFlow', 'Supply Chain Sankey Flow', 'flow_sankey', 'light', '#2563eb', 'flow/funnel stages', 'supply flow reveal', 'node focus highlight', ['node', 'flow', 'value'], 'Distribution carries the strongest supply flow.', 'Distribution', 'Highlight the named supply node.'),
  runtimeTemplate('StyleTemplate-SupplyFlowSankey', 'Supply Flow Sankey', 'flow_sankey', 'light', '#2563eb', 'flow/funnel stages', 'supply flow reveal', 'node focus highlight', ['node', 'flow', 'value'], 'Distribution is the flow stage to monitor.', 'Distribution', 'Highlight the named supply flow node.'),
  runtimeTemplate('StyleTemplate-WaterfallProfitBridge', 'Waterfall Profit Bridge', 'waterfall_chart', 'light', '#2563eb', 'cumulative changes', 'bridge reveal', 'bridge step highlight', ['bar', 'label', 'delta'], 'Expansion adds the largest positive step.', 'Expansion', 'Highlight the named waterfall step.'),
  runtimeTemplate('StyleTemplate-RevenueWaterfallBridge', 'Revenue Waterfall Bridge', 'waterfall_chart', 'light', '#2563eb', 'cumulative changes', 'bridge reveal', 'bridge step highlight', ['bar', 'label', 'delta'], 'Expansion is the largest revenue bridge step.', 'Expansion', 'Highlight the named waterfall step.'),
  runtimeTemplate('StyleTemplate-DarkWaterfallBridge', 'Dark Waterfall Bridge', 'waterfall_chart', 'dark', '#60a5fa', 'cumulative changes', 'bridge reveal', 'bridge step highlight', ['bar', 'label', 'delta'], 'Expansion drives the largest positive move.', 'Expansion', 'Highlight the named waterfall step.'),
  runtimeTemplate('StyleTemplate-ProductPerformanceRadar', 'Product Performance Radar', 'radar_chart', 'light', '#2563eb', 'multi-axis scores', 'axis reveal', 'profile focus highlight', ['axis', 'series', 'value'], 'Product A has the broader performance profile.', 'Product A', 'Highlight the named radar profile.'),
  runtimeTemplate('StyleTemplate-RadarPerformanceProfile', 'Radar Performance Profile', 'radar_chart', 'light', '#2563eb', 'multi-axis scores', 'axis reveal', 'profile focus highlight', ['axis', 'series', 'value'], 'Product A has the broader performance profile.', 'Product A', 'Highlight the named radar profile.'),
  runtimeTemplate('StyleTemplate-LightRadarScorecard', 'Light Radar Scorecard', 'radar_chart', 'light', '#2563eb', 'multi-axis scores', 'scorecard reveal', 'profile focus highlight', ['axis', 'series', 'value'], 'Product A leads the radar scorecard.', 'Product A', 'Highlight the named radar scorecard profile.'),
  runtimeTemplate('StyleTemplate-CorrelationHeatmapMatrix', 'Correlation Heatmap Matrix', 'heatmap', 'light', '#2563eb', 'x/y/intensity matrix', 'cell reveal', 'cell focus highlight', ['cell', 'row', 'column'], 'Churn and NPS form the strongest inverse relationship.', 'Churn', 'Highlight the named heatmap relationship.'),
  runtimeTemplate('StyleTemplate-DarkCorrelationMatrix', 'Dark Correlation Matrix', 'heatmap', 'dark', '#60a5fa', 'x/y/intensity matrix', 'cell reveal', 'cell focus highlight', ['cell', 'row', 'column'], 'Churn and NPS form the strongest inverse relationship.', 'Churn', 'Highlight the named heatmap relationship.'),
  runtimeTemplate('StyleTemplate-WeeklyActivityHeatmap', 'Weekly Activity Heatmap', 'heatmap', 'light', '#2563eb', 'x/y/intensity matrix', 'activity cell reveal', 'cell focus highlight', ['cell', 'day', 'period'], 'Wed contains the weekly activity peak.', 'Wed', 'Highlight the peak activity row.'),
  runtimeTemplate('StyleTemplate-TimelineMilestones', 'Timeline Milestones', 'timeline', 'light', '#2563eb', 'events, dates, milestones', 'timeline reveal', 'milestone highlight', ['event', 'date'], 'Launch is the milestone that anchors the timeline.', 'Launch', 'Highlight the named timeline milestone.'),
  runtimeTemplate('StyleTemplate-TimelineMilestoneRoadmap', 'Timeline Milestone Roadmap', 'timeline', 'light', '#2563eb', 'events, dates, milestones', 'roadmap reveal', 'milestone highlight', ['event', 'date'], 'Launch anchors the roadmap sequence.', 'Launch', 'Highlight the named roadmap milestone.'),
  runtimeTemplate('StyleTemplate-DarkTimelineMilestones', 'Dark Timeline Milestones', 'timeline', 'dark', '#60a5fa', 'events, dates, milestones', 'timeline reveal', 'milestone highlight', ['event', 'date'], 'Launch anchors the dark timeline.', 'Launch', 'Highlight the named timeline milestone.'),
  runtimeTemplate('StyleTemplate-OpeningExecutiveBrief', 'Executive Brief Opening', 'opening', 'dark', '#38bdf8', 'title, subtitle, metrics', 'headline reveal', 'metric reveal', ['title', 'subtitle', 'metrics'], 'We open with the strongest revenue signal and the metrics behind it.', 'revenue signal', 'Reveal the headline and supporting metrics in sequence.'),
  runtimeTemplate('StyleTemplate-OpeningSplitMetrics', 'Split Metrics Opening', 'opening', 'light', '#2563eb', 'title, subtitle, metrics', 'split reveal', 'metric spotlight', ['title', 'metrics'], 'Two headline metrics frame the story before the charts begin.', 'headline metrics', 'Reveal title and two metric anchors across the split layout.'),
  runtimeTemplate('StyleTemplate-OpeningDataGrid', 'Data Grid Opening', 'opening', 'dark', '#22d3ee', 'title, subtitle, metrics', 'grid reveal', 'cell highlight', ['title', 'data cells'], 'The dataset opens as a structured grid of performance signals.', 'dataset', 'Reveal grid cells around the opening headline.'),
  runtimeTemplate('StyleTemplate-OpeningCinematicHeadline', 'Cinematic Headline Opening', 'opening', 'dark', '#a78bfa', 'title, subtitle', 'cinematic headline reveal', 'headline emphasis', ['title', 'subtitle'], 'A cinematic headline sets up the revenue momentum story.', 'revenue momentum', 'Use a cinematic headline entrance with restrained supporting copy.'),
  runtimeTemplate('StyleTemplate-OpeningEditorialTitle', 'Editorial Title Opening', 'opening', 'light', '#2563eb', 'title, subtitle', 'editorial title reveal', 'rule emphasis', ['title', 'rule'], 'An editorial title introduces the key business question.', 'business question', 'Reveal the editorial title and accent rule.'),
  runtimeTemplate('StyleTemplate-NarrativeStatHook', 'Stat Hook Narrative', 'narrative_card', 'dark', '#38bdf8', 'title, metric, subtitle', 'stat hook reveal', 'number emphasis', ['number', 'title'], 'Revenue is the number that reframes the rest of the analysis.', 'Revenue', 'Anchor the narrative around one large metric.'),
  runtimeTemplate('StyleTemplate-NarrativeStatHookLight', 'Light Stat Hook Narrative', 'narrative_card', 'light', '#2563eb', 'title, metric, subtitle', 'stat hook reveal', 'number emphasis', ['number', 'title'], 'Revenue is the number that reframes the rest of the analysis.', 'Revenue', 'Anchor the narrative around one large metric.'),
  runtimeTemplate('StyleTemplate-NarrativeQuestion', 'Question Narrative', 'narrative_card', 'dark', '#a78bfa', 'question title, subtitle', 'question reveal', 'question emphasis', ['question', 'subtitle'], 'The next question is whether the growth is efficient.', 'growth', 'Reveal a question card before the next chart.'),
  runtimeTemplate('StyleTemplate-NarrativeBullets', 'Bullets Narrative', 'narrative_card', 'dark', '#60a5fa', 'title, bullets', 'bullet reveal', 'bullet emphasis', ['bullets'], 'Three signals explain why this pattern matters.', 'signals', 'Reveal bullets one by one with stable layout.'),
  runtimeTemplate('StyleTemplate-NarrativeBulletsLight', 'Light Bullets Narrative', 'narrative_card', 'light', '#2563eb', 'title, bullets', 'bullet reveal', 'bullet emphasis', ['bullets'], 'Three signals explain the trend in a lighter editorial tone.', 'signals', 'Reveal bullets on a light card.'),
  runtimeTemplate('StyleTemplate-NarrativeContext', 'Context Narrative', 'narrative_card', 'dark', '#22d3ee', 'title, subtitle', 'context reveal', 'context emphasis', ['title', 'body'], 'This context connects the prior chart to the next decision.', 'context', 'Reveal a concise context bridge.'),
  runtimeTemplate('StyleTemplate-NarrativeContextLight', 'Light Context Narrative', 'narrative_card', 'light', '#2563eb', 'title, subtitle', 'context reveal', 'context emphasis', ['title', 'body'], 'This context connects the prior chart to the next decision.', 'context', 'Reveal a concise light context bridge.'),
  runtimeTemplate('StyleTemplate-NarrativeDefinition', 'Definition Narrative', 'narrative_card', 'light', '#2563eb', 'term, definition, subtitle', 'definition reveal', 'term emphasis', ['term', 'definition'], 'The definition clarifies the signal before the next chart.', 'definition', 'Reveal the key term and definition together.'),
  runtimeTemplate('StyleTemplate-NarrativeChapterTitle', 'Chapter Title Narrative', 'narrative_card', 'dark', '#38bdf8', 'kicker, title', 'chapter reveal', 'title emphasis', ['kicker', 'title'], 'The analysis now shifts into margin quality.', 'margin quality', 'Reveal a chapter divider for a new section.'),
  runtimeTemplate('StyleTemplate-NarrativeChapterTitleLight', 'Light Chapter Title Narrative', 'narrative_card', 'light', '#2563eb', 'kicker, title', 'chapter reveal', 'title emphasis', ['kicker', 'title'], 'The analysis now shifts into margin quality.', 'margin quality', 'Reveal a light chapter divider.'),
  runtimeTemplate('StyleTemplate-NarrativeQuote', 'Quote Narrative', 'narrative_card', 'dark', '#fbbf24', 'quote, attribution', 'quote reveal', 'quote emphasis', ['quote'], 'The pattern is clear: growth is useful only when margin keeps pace.', 'growth', 'Reveal a quote-style narrative observation.'),
  runtimeTemplate('StyleTemplate-NarrativeQuoteLight', 'Light Quote Narrative', 'narrative_card', 'light', '#2563eb', 'quote, attribution', 'quote reveal', 'quote emphasis', ['quote'], 'The pattern is clear: growth is useful only when margin keeps pace.', 'growth', 'Reveal a quote-style narrative observation.'),
  runtimeTemplate('StyleTemplate-NarrativeVersus', 'Versus Narrative', 'narrative_card', 'dark', '#f472b6', 'two opposing points', 'versus reveal', 'side emphasis', ['left', 'right'], 'Revenue rose quickly, but cost pressure still matters.', 'cost pressure', 'Reveal a two-sided comparison card.'),
  runtimeTemplate('StyleTemplate-NarrativeBeforeAfter', 'Before After Narrative', 'narrative_card', 'light', '#2563eb', 'before and after points', 'before-after reveal', 'side emphasis', ['before', 'after'], 'The before and after view shows the operational shift.', 'after', 'Reveal the before and after contrast.'),
  runtimeTemplate('StyleTemplate-NarrativeMiniTimeline', 'Mini Timeline Narrative', 'narrative_card', 'light', '#2563eb', 'timeline beats', 'timeline reveal', 'event emphasis', ['event', 'date'], 'The mini timeline shows how the signal unfolded.', 'timeline', 'Reveal timeline beats in sequence.'),
  runtimeTemplate('StyleTemplate-NarrativeStatHookIllustrated', 'Illustrated Stat Hook Narrative', 'narrative_card', 'light', '#2563eb', 'title, metric, illustration', 'illustrated stat reveal', 'number emphasis', ['number', 'illustration'], 'Revenue is the illustrated stat that anchors the story.', 'Revenue', 'Anchor the narrative around an illustrated number.'),
  runtimeTemplate('StyleTemplate-NarrativeContextIllustrated', 'Illustrated Context Narrative', 'narrative_card', 'light', '#2563eb', 'context plus illustration', 'illustrated context reveal', 'context emphasis', ['title', 'illustration'], 'This context connects the data to the next decision.', 'context', 'Reveal illustrated context before the next chart.'),
  runtimeTemplate('StyleTemplate-NarrativeBulletsIllustrated', 'Illustrated Bullets Narrative', 'narrative_card', 'light', '#2563eb', 'bullets plus illustration', 'illustrated bullet reveal', 'bullet emphasis', ['bullets', 'illustration'], 'Three signals explain the pattern with supporting context.', 'signals', 'Reveal illustrated bullets one by one.'),
  runtimeTemplate('StyleTemplate-NarrativeQuoteIllustrated', 'Illustrated Quote Narrative', 'narrative_card', 'light', '#2563eb', 'quote plus illustration', 'illustrated quote reveal', 'quote emphasis', ['quote', 'illustration'], 'The pattern is clear when the quote and data align.', 'pattern', 'Reveal the illustrated quote observation.'),
  runtimeTemplate('StyleTemplate-NarrativeChapterTitleIllustrated', 'Illustrated Chapter Title Narrative', 'narrative_card', 'light', '#2563eb', 'chapter title plus illustration', 'illustrated chapter reveal', 'title emphasis', ['title', 'illustration'], 'The next chapter shifts into margin quality.', 'margin quality', 'Reveal the illustrated chapter divider.'),
  runtimeTemplate('StyleTemplate-ClosingSimpleOutro', 'Simple Outro', 'closing', 'dark', '#38bdf8', 'title, subtitle', 'closing reveal', 'takeaway emphasis', ['title', 'subtitle'], 'The takeaway is simple: growth is strongest when efficiency follows.', 'takeaway', 'Close with one clean final message.'),
  runtimeTemplate('StyleTemplate-ClosingLightOutro', 'Light Outro', 'closing', 'light', '#2563eb', 'title, subtitle', 'closing reveal', 'takeaway emphasis', ['title', 'subtitle'], 'The takeaway is simple: growth is strongest when efficiency follows.', 'takeaway', 'Close with a light final message.'),
  runtimeTemplate('StyleTemplate-ClosingKeyTakeaways', 'Key Takeaways Outro', 'closing', 'dark', '#60a5fa', 'title, takeaways', 'takeaway reveal', 'bullet emphasis', ['takeaways'], 'Three takeaways summarize the signal for the next decision.', 'takeaways', 'Reveal closing takeaways one by one.'),
  runtimeTemplate('StyleTemplate-ClosingMetricSummary', 'Metric Summary Outro', 'closing', 'light', '#2563eb', 'title, metrics', 'metric reveal', 'metric emphasis', ['metrics'], 'The final scorecard keeps revenue, cost, and margin in view.', 'scorecard', 'Close with a metric summary.'),
  runtimeTemplate('StyleTemplate-ClosingActionPlan', 'Action Plan Outro', 'closing', 'dark', '#34d399', 'title, steps', 'step reveal', 'step emphasis', ['steps'], 'The next step is to protect margin while scaling revenue.', 'margin', 'Close with an action-oriented sequence.'),
  runtimeTemplate('StyleTemplate-ClosingGradientSignal', 'Signal Outro', 'closing', 'dark', '#a78bfa', 'title, signal', 'signal reveal', 'signal emphasis', ['title', 'signal'], 'The signal is clear enough to guide the next move.', 'signal', 'Close with a gradient signal statement.'),
];

export const runtimePreviewSlug = (templateId: string): string =>
  templateId.replace(/^StyleTemplate-/, '').replace(/[^A-Za-z0-9]+/g, '-');

export const runtimePreviewCompositionId = (templateId: string): string =>
  `RuntimeTemplatePreview-${runtimePreviewSlug(templateId)}`;

export const runtimePreviewTemplateByCompositionId = (compositionId: string): RuntimePreviewTemplate | null =>
  RUNTIME_PREVIEW_TEMPLATES.find((template) => runtimePreviewCompositionId(template.id) === compositionId) ?? null;

const runtimePreviewItems = (template: RuntimePreviewTemplate) => {
  if (template.id === 'StyleTemplate-DenseRankingTable') {
    return [
      {label: 'San Francisco', value: 928, display_value: '928', color: template.accent},
      {label: 'New York', value: 814, display_value: '814', color: '#475569'},
      {label: 'Seattle', value: 742, display_value: '742', color: '#475569'},
      {label: 'Austin', value: 681, display_value: '681', color: '#475569'},
      {label: 'Boston', value: 596, display_value: '596', color: '#475569'},
      {label: 'Chicago', value: 524, display_value: '524', color: '#475569'},
      {label: 'Denver', value: 472, display_value: '472', color: '#475569'},
      {label: 'Atlanta', value: 408, display_value: '408', color: '#475569'},
      {label: 'Portland', value: 364, display_value: '364', color: '#475569'},
      {label: 'Miami', value: 318, display_value: '318', color: '#475569'},
      {label: 'San Diego', value: 281, display_value: '281', color: '#475569'},
      {label: 'Phoenix', value: 245, display_value: '245', color: '#475569'},
    ];
  }
  if (template.id === 'StyleTemplate-HorizontalBarMatrix') {
    return [
      {label: 'San Francisco', value: 928, display_value: '928', color: '#fbbf24'},
      {label: 'New York', value: 814, display_value: '814', color: '#475569'},
      {label: 'Seattle', value: 742, display_value: '742', color: '#475569'},
      {label: 'Austin', value: 681, display_value: '681', color: '#475569'},
      {label: 'Boston', value: 596, display_value: '596', color: '#475569'},
      {label: 'Chicago', value: 524, display_value: '524', color: '#475569'},
      {label: 'Denver', value: 472, display_value: '472', color: '#475569'},
      {label: 'Atlanta', value: 408, display_value: '408', color: '#475569'},
      {label: 'Portland', value: 364, display_value: '364', color: '#475569'},
      {label: 'Miami', value: 318, display_value: '318', color: '#475569'},
      {label: 'San Diego', value: 281, display_value: '281', color: '#475569'},
      {label: 'Phoenix', value: 245, display_value: '245', color: '#475569'},
    ];
  }
  if (template.id === 'StyleTemplate-DepartmentHeadcountDarkBar') {
    return [
      {label: 'Engineering', value: 128, display_value: '128', color: '#b9ff66'},
      {label: 'Product', value: 92, display_value: '92', color: '#55e6c1'},
      {label: 'Sales', value: 76, display_value: '76', color: '#ffffff'},
      {label: 'Operations', value: 58, display_value: '58', color: '#c8b6ff'},
      {label: 'Support', value: 44, display_value: '44', color: '#ff7a90'},
    ];
  }
  if (template.id === 'StyleTemplate-SalesByRegionDarkColumn') {
    return [
      {label: 'West', value: 241, display_value: '241K', color: '#38bdf8'},
      {label: 'East', value: 205, display_value: '205K', color: '#60a5fa'},
      {label: 'Central', value: 184, display_value: '184K', color: '#818cf8'},
      {label: 'South', value: 167, display_value: '167K', color: '#a78bfa'},
      {label: 'North', value: 151, display_value: '151K', color: '#c084fc'},
    ];
  }
  if (template.id === 'StyleTemplate-CoffeeRatingHorizontalRanking') {
    return [
      {label: 'Ethiopia', value: 4.8, display_value: '4.8', color: '#b45309'},
      {label: 'Kenya', value: 4.6, display_value: '4.6', color: '#d97706'},
      {label: 'Colombia', value: 4.5, display_value: '4.5', color: '#f59e0b'},
      {label: 'Brazil', value: 4.3, display_value: '4.3', color: '#fbbf24'},
      {label: 'Guatemala', value: 4.2, display_value: '4.2', color: '#fcd34d'},
    ];
  }
  if (template.id === 'StyleTemplate-MarginSlopeComparison' || template.id === 'StyleTemplate-SlopeChangeRanking') {
    return [
      {label: 'Direct', start: 31.5, end: 44.4, value: 44.4, display_value: '44.4%', color: template.accent},
      {label: 'Partner', start: 28.2, end: 35.1, value: 35.1, display_value: '35.1%', color: '#38bdf8'},
      {label: 'Retail', start: 24.8, end: 27.6, value: 27.6, display_value: '27.6%', color: '#f59e0b'},
      {label: 'Marketplace', start: 22.4, end: 20.8, value: 20.8, display_value: '20.8%', color: '#f472b6'},
    ];
  }
  if (template.chartType === 'pie_chart') {
    if (template.id === 'StyleTemplate-SegmentTreemapVertical' || template.id === 'StyleTemplate-StackedShareBar') {
      return [
        {label: 'Mobile App', value: 24.8, display_value: '24.8%', color: '#3b82f6'},
        {label: 'Web Direct', value: 18.6, display_value: '18.6%', color: '#10b981'},
        {label: 'Desktop App', value: 14.2, display_value: '14.2%', color: '#f59e0b'},
        {label: 'API Partners', value: 11.5, display_value: '11.5%', color: '#8b5cf6'},
        {label: 'Email', value: 9.4, display_value: '9.4%', color: '#ef4444'},
        {label: 'Social Referral', value: 7.8, display_value: '7.8%', color: '#06b6d4'},
        {label: 'Search', value: 6.2, display_value: '6.2%', color: '#ec4899'},
        {label: 'Affiliate', value: 4.1, display_value: '4.1%', color: '#84cc16'},
        {label: 'Other', value: 3.4, display_value: '3.4%', color: '#a855f7'},
      ];
    }
    return [
      {label: 'Enterprise', value: 42, display_value: '42%', color: template.accent},
      {label: 'Consumer', value: 28, display_value: '28%', color: '#10b981'},
      {label: 'SMB', value: 18, display_value: '18%', color: '#f59e0b'},
      {label: 'Partner', value: 12, display_value: '12%', color: '#6366f1'},
    ];
  }
  if (template.chartType === 'stat_cards') {
    return [
      {label: 'Revenue', value: 241000, display_value: '241K', subtitle: '+12.3%', color: template.accent, sparkline: [120, 138, 151, 167, 184, 205, 226, 241]},
      {label: 'Orders', value: 6210, display_value: '6.2K', subtitle: '+8.9%', color: '#10b981', sparkline: [4100, 4380, 4660, 4920, 5230, 5580, 5940, 6210]},
      {label: 'Margin', value: 44.4, display_value: '44.4%', subtitle: '+2.1 pts', color: '#f59e0b', sparkline: [35, 36, 38, 39, 41, 42, 43, 44.4]},
    ];
  }
  if (template.chartType === 'scatter_chart') {
    return [
      {label: 'Enterprise', x: 86, y: 78, size: 38, color: template.accent},
      {label: 'Consumer', x: 64, y: 58, size: 26, color: '#10b981'},
      {label: 'SMB', x: 48, y: 72, size: 22, color: '#f59e0b'},
      {label: 'Partner', x: 72, y: 42, size: 24, color: '#6366f1'},
      {label: 'Retail', x: 36, y: 48, size: 18, color: '#ec4899'},
      {label: 'Online', x: 92, y: 62, size: 28, color: '#14b8a6'},
      {label: 'Direct', x: 58, y: 86, size: 24, color: '#f97316'},
      {label: 'Wholesale', x: 30, y: 30, size: 16, color: '#8b5cf6'},
      {label: 'Field', x: 44, y: 64, size: 19, color: '#22d3ee'},
      {label: 'Reseller', x: 78, y: 34, size: 20, color: '#a78bfa'},
      {label: 'Trial', x: 24, y: 72, size: 15, color: '#f43f5e'},
      {label: 'Renewal', x: 68, y: 88, size: 29, color: '#84cc16'},
    ];
  }
  if (template.chartType === 'flow_sankey') {
    const supply = template.id.includes('Supply');
    return supply
      ? [
          {label: 'Source', value: 260, display_value: '260K', color: template.accent},
          {label: 'Manufacturing', value: 226, display_value: '226K', color: '#10b981'},
          {label: 'Distribution', value: 194, display_value: '194K', color: '#f59e0b'},
          {label: 'Retail', value: 151, display_value: '151K', color: '#6366f1'},
          {label: 'Delivered', value: 128, display_value: '128K', color: '#14b8a6'},
        ]
      : [
          {label: 'Visitors', value: 260, display_value: '260K', color: template.accent},
          {label: 'Leads', value: 194, display_value: '194K', color: '#10b981'},
          {label: 'Qualified', value: 151, display_value: '151K', color: '#f59e0b'},
          {label: 'Proposal', value: 98, display_value: '98K', color: '#6366f1'},
          {label: 'Won', value: 64, display_value: '64K', color: '#14b8a6'},
        ];
  }
  if (template.chartType === 'waterfall_chart') {
    return [
      {label: 'Base', value: 120, display_value: '120K', color: template.accent},
      {label: 'Expansion', value: 54, display_value: '+54K', color: '#16a34a'},
      {label: 'Upsell', value: 38, display_value: '+38K', color: '#10b981'},
      {label: 'Discounts', value: -24, display_value: '-24K', color: '#ef4444'},
      {label: 'Churn', value: -18, display_value: '-18K', color: '#f97316'},
    ];
  }
  if (template.chartType === 'timeline') {
    return [
      {label: 'Plan', value: 1, display_value: 'Jan', subtitle: 'Scope approved', color: template.accent},
      {label: 'Build', value: 2, display_value: 'Mar', subtitle: 'Core workflow ready', color: '#10b981'},
      {label: 'Launch', value: 3, display_value: 'Jun', subtitle: 'Public rollout', color: '#f59e0b'},
      {label: 'Scale', value: 4, display_value: 'Sep', subtitle: 'Regional expansion', color: '#6366f1'},
      {label: 'Review', value: 5, display_value: 'Dec', subtitle: 'Planning cycle closes', color: '#14b8a6'},
    ];
  }
  return [
    {label: 'Jan', value: 120, display_value: '120K', color: template.accent, series: 'Revenue'},
    {label: 'Feb', value: 138, display_value: '138K', color: '#10b981', series: 'Revenue'},
    {label: 'Mar', value: 151, display_value: '151K', color: '#f59e0b', series: 'Revenue'},
    {label: 'Apr', value: 167, display_value: '167K', color: '#6366f1', series: 'Revenue'},
    {label: 'May', value: 184, display_value: '184K', color: '#ec4899', series: 'Revenue'},
    {label: 'Jun', value: 205, display_value: '205K', color: '#14b8a6', series: 'Revenue'},
    {label: 'Jul', value: 226, display_value: '226K', color: '#f97316', series: 'Revenue'},
    {label: 'Aug', value: 241, display_value: '241K', color: '#8b5cf6', series: 'Revenue'},
  ];
};

const runtimePreviewSeries = () => [
  {
    name: 'Revenue',
    points: [
      {label: 'Jan', value: 120, display_value: '120K'},
      {label: 'Feb', value: 138, display_value: '138K'},
      {label: 'Mar', value: 151, display_value: '151K'},
      {label: 'Apr', value: 167, display_value: '167K'},
      {label: 'May', value: 184, display_value: '184K'},
      {label: 'Jun', value: 205, display_value: '205K'},
      {label: 'Jul', value: 226, display_value: '226K'},
      {label: 'Aug', value: 241, display_value: '241K'},
    ],
  },
  {
    name: 'Cost',
    points: [
      {label: 'Jan', value: 78, display_value: '78K'},
      {label: 'Feb', value: 83, display_value: '83K'},
      {label: 'Mar', value: 91, display_value: '91K'},
      {label: 'Apr', value: 98, display_value: '98K'},
      {label: 'May', value: 106, display_value: '106K'},
      {label: 'Jun', value: 114, display_value: '114K'},
      {label: 'Jul', value: 126, display_value: '126K'},
      {label: 'Aug', value: 134, display_value: '134K'},
    ],
  },
];

const runtimePreviewStackedAreaSeries = () => [
  {
    name: 'Mobile',
    color: '#3b82f6',
    points: [
      {label: '2018', value: 12, display_value: '12'},
      {label: '2019', value: 18, display_value: '18'},
      {label: '2020', value: 24, display_value: '24'},
      {label: '2021', value: 32, display_value: '32'},
      {label: '2022', value: 41, display_value: '41'},
      {label: '2023', value: 52, display_value: '52'},
      {label: '2024', value: 64, display_value: '64'},
    ],
  },
  {
    name: 'Web',
    color: '#10b981',
    points: [
      {label: '2018', value: 22, display_value: '22'},
      {label: '2019', value: 24, display_value: '24'},
      {label: '2020', value: 26, display_value: '26'},
      {label: '2021', value: 28, display_value: '28'},
      {label: '2022', value: 30, display_value: '30'},
      {label: '2023', value: 32, display_value: '32'},
      {label: '2024', value: 34, display_value: '34'},
    ],
  },
  {
    name: 'API',
    color: '#f59e0b',
    points: [
      {label: '2018', value: 4, display_value: '4'},
      {label: '2019', value: 6, display_value: '6'},
      {label: '2020', value: 9, display_value: '9'},
      {label: '2021', value: 13, display_value: '13'},
      {label: '2022', value: 18, display_value: '18'},
      {label: '2023', value: 24, display_value: '24'},
      {label: '2024', value: 31, display_value: '31'},
    ],
  },
  {
    name: 'Email',
    color: '#8b5cf6',
    points: [
      {label: '2018', value: 8, display_value: '8'},
      {label: '2019', value: 9, display_value: '9'},
      {label: '2020', value: 9, display_value: '9'},
      {label: '2021', value: 10, display_value: '10'},
      {label: '2022', value: 11, display_value: '11'},
      {label: '2023', value: 12, display_value: '12'},
      {label: '2024', value: 13, display_value: '13'},
    ],
  },
];

const runtimePreviewRankSeries = () => [
  {name: 'Apple', color: '#3b82f6', points: [{label: 'Q1', value: 1}, {label: 'Q2', value: 1}, {label: 'Q3', value: 2}, {label: 'Q4', value: 2}, {label: 'Q1', value: 1}, {label: 'Q2', value: 1}]},
  {name: 'Microsoft', color: '#10b981', points: [{label: 'Q1', value: 2}, {label: 'Q2', value: 2}, {label: 'Q3', value: 1}, {label: 'Q4', value: 1}, {label: 'Q1', value: 2}, {label: 'Q2', value: 3}]},
  {name: 'Amazon', color: '#f59e0b', points: [{label: 'Q1', value: 3}, {label: 'Q2', value: 4}, {label: 'Q3', value: 3}, {label: 'Q4', value: 3}, {label: 'Q1', value: 4}, {label: 'Q2', value: 2}]},
  {name: 'Google', color: '#8b5cf6', points: [{label: 'Q1', value: 4}, {label: 'Q2', value: 3}, {label: 'Q3', value: 4}, {label: 'Q4', value: 4}, {label: 'Q1', value: 3}, {label: 'Q2', value: 4}]},
  {name: 'Nvidia', color: '#ef4444', points: [{label: 'Q1', value: 6}, {label: 'Q2', value: 5}, {label: 'Q3', value: 5}, {label: 'Q4', value: 5}, {label: 'Q1', value: 5}, {label: 'Q2', value: 5}]},
  {name: 'Meta', color: '#06b6d4', points: [{label: 'Q1', value: 5}, {label: 'Q2', value: 6}, {label: 'Q3', value: 6}, {label: 'Q4', value: 6}, {label: 'Q1', value: 6}, {label: 'Q2', value: 6}]},
];

const runtimePreviewComparisonRows = () => [
  {
    label: 'Q1',
    metrics: [
      {name: 'Revenue', value: 168, display_value: '168K', color: '#2563eb'},
      {name: 'Cost', value: 98, display_value: '98K', color: '#10b981'},
      {name: 'Margin', value: 41.7, display_value: '41.7%', color: '#f59e0b'},
    ],
  },
  {
    label: 'Q2',
    metrics: [
      {name: 'Revenue', value: 194, display_value: '194K', color: '#2563eb'},
      {name: 'Cost', value: 112, display_value: '112K', color: '#10b981'},
      {name: 'Margin', value: 42.3, display_value: '42.3%', color: '#f59e0b'},
    ],
  },
  {
    label: 'Q3',
    metrics: [
      {name: 'Revenue', value: 226, display_value: '226K', color: '#2563eb'},
      {name: 'Cost', value: 126, display_value: '126K', color: '#10b981'},
      {name: 'Margin', value: 44.2, display_value: '44.2%', color: '#f59e0b'},
    ],
  },
  {
    label: 'Q4',
    metrics: [
      {name: 'Revenue', value: 241, display_value: '241K', color: '#2563eb'},
      {name: 'Cost', value: 134, display_value: '134K', color: '#10b981'},
      {name: 'Margin', value: 44.4, display_value: '44.4%', color: '#f59e0b'},
    ],
  },
];

const runtimePreviewCorrelationRows = () => {
  const labels = ['Price', 'Demand', 'Supply', 'Margin', 'Churn', 'NPS'];
  const matrix = [
    [1.0, 0.72, -0.32, 0.48, -0.58, 0.41],
    [0.72, 1.0, -0.24, 0.66, -0.44, 0.57],
    [-0.32, -0.24, 1.0, -0.36, 0.22, -0.18],
    [0.48, 0.66, -0.36, 1.0, -0.62, 0.69],
    [-0.58, -0.44, 0.22, -0.62, 1.0, -0.73],
    [0.41, 0.57, -0.18, 0.69, -0.73, 1.0],
  ];
  return labels.map((label, rowIndex) => ({
    label,
    metrics: labels.map((name, colIndex) => ({
      name,
      value: matrix[rowIndex][colIndex],
      display_value: matrix[rowIndex][colIndex].toFixed(2),
    })),
  }));
};

const runtimePreviewWeeklyActivityRows = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['8', '10', '12', '14', '16', '18'];
  const values = [
    [20, 32, 58, 70, 62, 38],
    [24, 46, 64, 76, 80, 54],
    [30, 52, 75, 88, 82, 58],
    [26, 48, 69, 84, 78, 51],
    [18, 36, 55, 72, 64, 42],
    [10, 20, 32, 46, 52, 36],
    [8, 16, 28, 38, 44, 30],
  ];
  return days.map((label, rowIndex) => ({
    label,
    metrics: hours.map((name, colIndex) => ({
      name: `${name}:00`,
      value: values[rowIndex][colIndex],
      display_value: String(values[rowIndex][colIndex]),
    })),
  }));
};

const runtimePreviewRadarRows = () => [
  {
    label: 'Product A',
    metrics: [
      {name: 'Speed', value: 86, display_value: '86', color: '#2dd4bf'},
      {name: 'Quality', value: 74, display_value: '74', color: '#2dd4bf'},
      {name: 'Cost', value: 58, display_value: '58', color: '#2dd4bf'},
      {name: 'Reach', value: 92, display_value: '92', color: '#2dd4bf'},
      {name: 'Loyalty', value: 68, display_value: '68', color: '#2dd4bf'},
      {name: 'Growth', value: 80, display_value: '80', color: '#2dd4bf'},
    ],
  },
  {
    label: 'Product B',
    metrics: [
      {name: 'Speed', value: 74, display_value: '74', color: '#60a5fa'},
      {name: 'Quality', value: 81, display_value: '81', color: '#60a5fa'},
      {name: 'Cost', value: 64, display_value: '64', color: '#60a5fa'},
      {name: 'Reach', value: 70, display_value: '70', color: '#60a5fa'},
      {name: 'Loyalty', value: 77, display_value: '77', color: '#60a5fa'},
      {name: 'Growth', value: 62, display_value: '62', color: '#60a5fa'},
    ],
  },
];

const runtimePreviewFlowRows = (template: RuntimePreviewTemplate) => {
  if (template.id.includes('Supply')) {
    return [
      {
        label: 'Suppliers',
        metrics: [
          {name: 'Factories', value: 920, display_value: '920t', color: '#38bdf8'},
          {name: 'Assemblers', value: 260, display_value: '260t', color: '#60a5fa'},
          {name: 'Warehouses', value: 180, display_value: '180t', color: '#34d399'},
        ],
      },
      {
        label: 'Partners',
        metrics: [
          {name: 'Factories', value: 640, display_value: '640t', color: '#60a5fa'},
          {name: 'Distribution', value: 420, display_value: '420t', color: '#f59e0b'},
          {name: 'Retail', value: 220, display_value: '220t', color: '#22d3ee'},
        ],
      },
      {
        label: 'Imports',
        metrics: [
          {name: 'Distribution', value: 560, display_value: '560t', color: '#818cf8'},
          {name: 'Retail', value: 320, display_value: '320t', color: '#22d3ee'},
          {name: 'Online', value: 280, display_value: '280t', color: '#a78bfa'},
        ],
      },
    ];
  }
  if (template.id === 'StyleTemplate-LongFlowSankey') {
    return [
      {
        label: 'Organic Search',
        metrics: [
          {name: 'Free Tier', value: 32, display_value: '32K', color: '#3b82f6'},
          {name: 'Starter', value: 18, display_value: '18K', color: '#3b82f6'},
          {name: 'Growth', value: 14, display_value: '14K', color: '#3b82f6'},
        ],
      },
      {
        label: 'Paid Ads',
        metrics: [
          {name: 'Trial', value: 24, display_value: '24K', color: '#10b981'},
          {name: 'Starter', value: 22, display_value: '22K', color: '#10b981'},
          {name: 'Enterprise', value: 16, display_value: '16K', color: '#10b981'},
        ],
      },
      {
        label: 'Email',
        metrics: [
          {name: 'Free Tier', value: 12, display_value: '12K', color: '#f59e0b'},
          {name: 'Growth', value: 18, display_value: '18K', color: '#f59e0b'},
          {name: 'Churned', value: 8, display_value: '8K', color: '#f59e0b'},
        ],
      },
      {
        label: 'Social',
        metrics: [
          {name: 'Free Tier', value: 22, display_value: '22K', color: '#8b5cf6'},
          {name: 'Trial', value: 14, display_value: '14K', color: '#8b5cf6'},
          {name: 'Churned', value: 10, display_value: '10K', color: '#8b5cf6'},
        ],
      },
      {
        label: 'Direct',
        metrics: [
          {name: 'Starter', value: 26, display_value: '26K', color: '#ef4444'},
          {name: 'Growth', value: 20, display_value: '20K', color: '#ef4444'},
          {name: 'Enterprise', value: 12, display_value: '12K', color: '#ef4444'},
        ],
      },
      {
        label: 'Referral',
        metrics: [
          {name: 'Trial', value: 16, display_value: '16K', color: '#06b6d4'},
          {name: 'Growth', value: 14, display_value: '14K', color: '#06b6d4'},
          {name: 'Enterprise', value: 10, display_value: '10K', color: '#06b6d4'},
        ],
      },
    ];
  }
  return [
    {
      label: 'Visitors',
      metrics: [
        {name: 'Leads', value: 260, display_value: '260K', color: template.accent},
        {name: 'Qualified', value: 194, display_value: '194K', color: '#10b981'},
      ],
    },
    {
      label: 'Leads',
      metrics: [
        {name: 'Qualified', value: 151, display_value: '151K', color: '#f59e0b'},
        {name: 'Proposal', value: 98, display_value: '98K', color: '#6366f1'},
      ],
    },
    {
      label: 'Qualified',
      metrics: [
        {name: 'Proposal', value: 112, display_value: '112K', color: '#14b8a6'},
        {name: 'Won', value: 64, display_value: '64K', color: '#10b981'},
      ],
    },
  ];
};

const RUNTIME_PREVIEW_TITLES: Record<string, string> = {
  'StyleTemplate-DarkCompactBarRanking': 'Compact Product Ranking',
  'StyleTemplate-DenseRankingTable': 'Top 12 Cities by Active Users',
  'StyleTemplate-HorizontalBarMatrix': 'Top 12 Cities by Active Users',
  'StyleTemplate-SalesByRegionDarkColumn': 'Sales by Region',
  'StyleTemplate-CoffeeRatingHorizontalRanking': 'Coffee Rating',
  'StyleTemplate-DepartmentHeadcountDarkBar': 'Department Headcount',
  'StyleTemplate-EditorialDataStory': 'Growth is concentrating in fewer channels',
  'StyleTemplate-AreaStackTrend': 'Channel Mix Over Time',
  'StyleTemplate-SteppedLineRanking': 'Quarterly Rank Movement',
  'StyleTemplate-SmallMultiplesTrend': 'Regional Revenue Trends',
  'StyleTemplate-SupplyChainSankeyFlow': 'Supply Chain Flow',
  'StyleTemplate-SupplyFlowSankey': 'Supply Flow',
  'StyleTemplate-WeeklyActivityHeatmap': 'Weekly Activity Heatmap',
  'StyleTemplate-CorrelationHeatmapMatrix': 'Correlation Matrix',
  'StyleTemplate-DarkCorrelationMatrix': 'Correlation Matrix',
};

const runtimePreviewTitle = (template: RuntimePreviewTemplate): string =>
  RUNTIME_PREVIEW_TITLES[template.id] ?? template.name;

const runtimePreviewPayload = (template: RuntimePreviewTemplate, items: any[]) => {
  const base = {
    version: 1,
    template_id: template.id,
    chart_type: template.chartType,
    title: runtimePreviewTitle(template),
    description: 'Runtime template animation preview',
  };
  if (template.id === 'StyleTemplate-DualSeriesPulseLine') {
    return {...base, contract: {payload_kind: 'series'}, series: runtimePreviewSeries()};
  }
  if (template.id === 'StyleTemplate-AreaStackTrend') {
    return {...base, title: 'Channel Mix Over Time', contract: {payload_kind: 'series'}, series: runtimePreviewStackedAreaSeries()};
  }
  if (template.id === 'StyleTemplate-SupplyChainSankeyFlow') {
    return {...base, title: 'Supply Chain Flow', contract: {payload_kind: 'comparison_rows'}, rows: runtimePreviewFlowRows(template)};
  }
  if (template.id === 'StyleTemplate-SupplyFlowSankey') {
    return {...base, title: 'Supply Flow', contract: {payload_kind: 'comparison_rows'}, rows: runtimePreviewFlowRows(template)};
  }
  if (template.id === 'StyleTemplate-SteppedLineRanking') {
    return {...base, title: 'Quarterly Rank Movement', contract: {payload_kind: 'series'}, series: runtimePreviewRankSeries()};
  }
  if (template.id === 'StyleTemplate-HorizontalBarMatrix') {
    return {...base, title: 'Top 12 Cities by Active Users', contract: {payload_kind: 'items'}, items};
  }
  if (template.id === 'StyleTemplate-DepartmentHeadcountDarkBar') {
    return {...base, contract: {payload_kind: 'items'}, items};
  }
  if (template.id === 'StyleTemplate-SmallMultiplesTrend') {
    return {
      ...base,
      title: 'Regional Revenue Trends',
      contract: {payload_kind: 'series'},
      series: [
        {
          name: 'EU West',
          points: [
            {label: 'Jan', value: 42, display_value: '42'},
            {label: 'Feb', value: 48, display_value: '48'},
            {label: 'Mar', value: 56, display_value: '56'},
            {label: 'Apr', value: 62, display_value: '62'},
            {label: 'May', value: 71, display_value: '71'},
            {label: 'Jun', value: 78, display_value: '78'},
            {label: 'Jul', value: 86, display_value: '86'},
          ],
        },
        {
          name: 'North America',
          points: [
            {label: 'Jan', value: 120, display_value: '120'},
            {label: 'Feb', value: 128, display_value: '128'},
            {label: 'Mar', value: 132, display_value: '132'},
            {label: 'Apr', value: 141, display_value: '141'},
            {label: 'May', value: 156, display_value: '156'},
            {label: 'Jun', value: 162, display_value: '162'},
            {label: 'Jul', value: 174, display_value: '174'},
          ],
        },
        {
          name: 'APAC',
          points: [
            {label: 'Jan', value: 38, display_value: '38'},
            {label: 'Feb', value: 44, display_value: '44'},
            {label: 'Mar', value: 52, display_value: '52'},
            {label: 'Apr', value: 61, display_value: '61'},
            {label: 'May', value: 73, display_value: '73'},
            {label: 'Jun', value: 84, display_value: '84'},
            {label: 'Jul', value: 96, display_value: '96'},
          ],
        },
        {
          name: 'LATAM',
          points: [
            {label: 'Jan', value: 22, display_value: '22'},
            {label: 'Feb', value: 24, display_value: '24'},
            {label: 'Mar', value: 28, display_value: '28'},
            {label: 'Apr', value: 32, display_value: '32'},
            {label: 'May', value: 38, display_value: '38'},
            {label: 'Jun', value: 41, display_value: '41'},
            {label: 'Jul', value: 47, display_value: '47'},
          ],
        },
        {
          name: 'MEA',
          points: [
            {label: 'Jan', value: 15, display_value: '15'},
            {label: 'Feb', value: 17, display_value: '17'},
            {label: 'Mar', value: 18, display_value: '18'},
            {label: 'Apr', value: 21, display_value: '21'},
            {label: 'May', value: 24, display_value: '24'},
            {label: 'Jun', value: 26, display_value: '26'},
            {label: 'Jul', value: 29, display_value: '29'},
          ],
        },
        {
          name: 'India',
          points: [
            {label: 'Jan', value: 11, display_value: '11'},
            {label: 'Feb', value: 14, display_value: '14'},
            {label: 'Mar', value: 18, display_value: '18'},
            {label: 'Apr', value: 22, display_value: '22'},
            {label: 'May', value: 28, display_value: '28'},
            {label: 'Jun', value: 36, display_value: '36'},
            {label: 'Jul', value: 44, display_value: '44'},
          ],
        },
      ],
    };
  }
  if (template.id === 'StyleTemplate-MarginSlopeComparison' || template.id === 'StyleTemplate-SlopeChangeRanking') {
    return {...base, contract: {payload_kind: 'start_end_rows'}, rows: items};
  }
  if (template.chartType === 'scatter_chart') {
    return {...base, contract: {payload_kind: 'scatter'}, items};
  }
  if (template.chartType === 'stat_cards') {
    return {...base, contract: {payload_kind: 'cards'}, cards: items};
  }
  if (template.chartType === 'radar_chart') {
    return {...base, contract: {payload_kind: 'comparison_rows'}, rows: runtimePreviewRadarRows()};
  }
  if (template.id === 'StyleTemplate-WeeklyActivityHeatmap') {
    return {...base, title: 'Weekly Activity Heatmap', contract: {payload_kind: 'comparison_rows'}, rows: runtimePreviewWeeklyActivityRows()};
  }
  if (template.chartType === 'heatmap') {
    return {...base, title: 'Correlation Matrix', contract: {payload_kind: 'comparison_rows'}, rows: runtimePreviewCorrelationRows()};
  }
  if (template.chartType === 'comparison_chart') {
    return {...base, contract: {payload_kind: 'comparison_rows'}, rows: runtimePreviewComparisonRows()};
  }
  if (template.chartType === 'flow_sankey' && template.id !== 'StyleTemplate-ConversionFunnelClean') {
    return {...base, contract: {payload_kind: 'comparison_rows'}, rows: runtimePreviewFlowRows(template)};
  }
  return {...base, contract: {payload_kind: template.chartType === 'pie_chart' ? 'positive_items' : 'items'}, items};
};

const runtimePreviewTargetFilter = (template: RuntimePreviewTemplate) => {
  if (template.id === 'StyleTemplate-BasicBarChart') return {label: 'Jun'};
  if (template.id === 'StyleTemplate-DenseRankingTable') return {label: 'San Francisco'};
  if (template.id === 'StyleTemplate-HorizontalBarMatrix') return {label: 'San Francisco'};
  if (template.id === 'StyleTemplate-SalesByRegionDarkColumn') return {label: 'West'};
  if (template.id === 'StyleTemplate-CoffeeRatingHorizontalRanking') return {label: 'Ethiopia'};
  if (template.id === 'StyleTemplate-DepartmentHeadcountDarkBar') return {label: 'Engineering'};
  if (template.id === 'StyleTemplate-SlopeChangeRanking') return {label: 'Direct'};
  if (template.id === 'StyleTemplate-SmallMultiplesTrend') return {series: 'APAC'};
  if (template.id === 'StyleTemplate-LongFlowSankey') return {label: 'Enterprise'};
  if (template.id === 'StyleTemplate-StackedShareBar' || template.id === 'StyleTemplate-SegmentTreemapVertical') return {label: 'Mobile App'};
  if (template.chartType === 'stat_cards') return {label: 'Revenue'};
  if (template.chartType === 'comparison_chart') return {label: 'Q4'};
  if (template.chartType === 'flow_sankey') return {label: template.id.includes('Supply') ? 'Distribution' : 'Qualified'};
  if (template.chartType === 'waterfall_chart') return {label: 'Expansion'};
  if (template.chartType === 'radar_chart') return {label: 'Product A'};
  if (template.chartType === 'heatmap') return {label: template.id.includes('Weekly') ? 'Wed' : 'Churn'};
  if (template.chartType === 'timeline') return {label: 'Launch'};
  if (template.id === 'StyleTemplate-DualSeriesPulseLine') return {series: 'Revenue'};
  if (template.id === 'StyleTemplate-AreaStackTrend') return {series: 'Mobile'};
  if (template.id === 'StyleTemplate-SteppedLineRanking') return {series: 'Apple'};
  if (template.id === 'StyleTemplate-MarginSlopeComparison') return {label: 'Direct'};
  if (template.chartType === 'pie_chart') return {label: 'Enterprise'};
  if (template.chartType === 'scatter_chart') return {label: 'Enterprise'};
  if (template.id === 'StyleTemplate-CompactColumnKpi') return {label: 'Jun'};
  return {label: 'Aug'};
};

const isRuntimeTextPreview = (template: RuntimePreviewTemplate) =>
  template.chartType === 'opening' || template.chartType === 'narrative_card' || template.chartType === 'closing';

const runtimeTextPreviewPayload = (template: RuntimePreviewTemplate) => ({
  version: 1,
  template_id: template.id,
  scene_type: template.chartType,
  title: template.chartType === 'opening'
    ? 'Revenue Momentum Review'
    : template.chartType === 'closing'
      ? 'What the Signal Means'
      : template.name.replace(/ Narrative$/, ''),
  subtitle: template.suggestedNarration,
  kicker: template.chartType === 'opening' ? 'DATA BRIEF' : template.chartType === 'closing' ? 'FINAL READOUT' : 'INSIGHT',
  bullets: [
    'Revenue reaches 241K by Aug',
    'Costs rise more slowly than sales',
    'Margin quality becomes the next decision point',
  ],
  stat: '241K',
  metric: '241K',
  metrics: [
    {label: 'Revenue', value: '241K', display_value: '241K', color: template.accent},
    {label: 'Growth', value: '+18%', display_value: '+18%', color: '#10b981'},
  ],
  takeaways: [
    'Growth is clear',
    'Efficiency still matters',
    'Track the next margin inflection',
  ],
  steps: [
    'Protect the highest-margin channels',
    'Monitor cost acceleration',
    'Review the next cohort before scaling',
  ],
});

export const runtimePreviewConfig = (template: RuntimePreviewTemplate) => {
  const items = runtimePreviewItems(template);
  const dark = template.theme === 'dark';
  const background = dark ? '#0f172a' : '#f8fafc';
  const foreground = dark ? '#f8fafc' : '#0f172a';
  const templateContract = {
    template_id: template.id,
    chart_type: template.chartType,
    theme: template.theme,
    data_contract: template.dataContract,
    entrance_animation: template.entrance,
    emphasis_animation: template.emphasis,
    subtitle_safe_area: template.subtitleSafeArea,
    highlight_targets: template.highlightTargets,
    suggested_narration: template.suggestedNarration,
    trigger_phrase: template.triggerPhrase,
    animation_intent: template.animationIntent,
    timing: 'word_aligned',
  };
  if (isRuntimeTextPreview(template)) {
    const payload = runtimeTextPreviewPayload(template);
    const metrics = [
      {label: 'Revenue', value: '241K', display_value: '241K', color: template.accent},
      {label: 'Cost', value: '134K', display_value: '134K', color: '#10b981'},
      {label: 'Margin', value: '44.4%', display_value: '44.4%', color: '#f59e0b'},
    ];
    return {
      meta: {
        title: `${template.name} Runtime Preview`,
        component_prefix: `RuntimePreview${runtimePreviewSlug(template.id)}`,
        fps: 30,
        duration: 6,
        video_duration: 6,
        width: 1280,
        height: 720,
        generation_mode: 'runtime_template_preview',
        fast_runtime: true,
        visual_style: {
          background_base: background,
          foreground,
          accent: template.accent,
          theme: template.theme,
        },
        runtime_template_contract: templateContract,
      },
      background_color: background,
      subtitle_style: {mode: dark ? 'standard_dark' : 'standard_light'},
      scenes: [
        {
          id: `runtime_preview_${runtimePreviewSlug(template.id)}`,
          type: template.chartType,
          time_range: [0, 6],
          renderer: {
            type: 'runtime_template',
            component: 'RuntimeTextTemplateScene',
            style_template_id: template.id,
          },
          content: {
            fast_runtime: true,
            runtime_locked: true,
            style_template_id: template.id,
            style_template_name: template.name,
            runtime_template_contract: templateContract,
            title: payload.title,
            subtitle: payload.subtitle,
            kicker: payload.kicker,
            bullets: payload.bullets,
            takeaways: payload.takeaways,
            steps: payload.steps,
            metrics,
            cards: metrics,
            template_payload: {...payload, metrics},
            style: {
              theme: template.theme,
              accent: template.accent,
              accent_color: template.accent,
              background_color: background,
              container_background: background,
              text_color: foreground,
              palette: [template.accent, '#10b981', '#f59e0b', '#6366f1'],
            },
          },
          narration: [
            {
              text: template.suggestedNarration,
              time_start: 0,
              time_end: 6,
              scene_time_start: 0,
              scene_time_end: 6,
            },
          ],
          animations: [
            {
              id: 'runtime_text_preview_entrance',
              type: 'entrance',
              effect: 'text_reveal',
              time_start: 0.2,
              duration: 2.5,
              description: template.animationIntent,
            },
          ],
        },
      ],
    };
  }
  return {
    meta: {
      title: `${template.name} Runtime Preview`,
      component_prefix: `RuntimePreview${runtimePreviewSlug(template.id)}`,
      fps: 30,
      duration: 6,
      video_duration: 6,
      width: 1280,
      height: 720,
      generation_mode: 'runtime_template_preview',
      fast_runtime: true,
      visual_style: {
        background_base: background,
        foreground,
        accent: template.accent,
        theme: template.theme,
      },
      runtime_template_contract: templateContract,
    },
    background_color: background,
    subtitle_style: {mode: dark ? 'standard_dark' : 'standard_light'},
    scenes: [
      {
        id: `runtime_preview_${runtimePreviewSlug(template.id)}`,
        type: 'quick_visual',
        time_range: [0, 6],
        renderer: {
          type: 'runtime_template',
          component: 'RuntimeStyleTemplateScene',
          style_template_id: template.id,
        },
        content: {
          quick_visual: true,
          fast_runtime: true,
          runtime_locked: true,
          chart_type: template.chartType,
          style_template_id: template.id,
          style_template_name: template.name,
          runtime_template_contract: templateContract,
          title: template.name,
          data: items,
          cards: template.chartType === 'stat_cards' ? items : undefined,
          template_payload: runtimePreviewPayload(template, items),
          style: {
            theme: template.theme,
            accent: template.accent,
            accent_color: template.accent,
            background_color: background,
            container_background: background,
            text_color: foreground,
            palette: [template.accent, '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#14b8a6'],
          },
        },
        narration: [
          {
            text: template.suggestedNarration,
            time_start: 0,
            time_end: 6,
            scene_time_start: 0,
            scene_time_end: 6,
          },
        ],
        animations: [
          {
            id: 'runtime_preview_entrance',
            type: 'entrance',
            effect: template.chartType === 'line_chart' ? 'draw_line' : template.chartType === 'pie_chart' ? 'reveal_slices' : 'progressive_reveal',
            time_start: 0.3,
            duration: 2.2,
            description: 'Preview the runtime entrance animation contract.',
          },
          {
            id: 'runtime_preview_emphasis',
            type: 'emphasis',
            effect: 'highlight',
            target_data: {data_filter: runtimePreviewTargetFilter(template)},
            style: {intensity: 0.06},
            time_start: 3.2,
            duration: 1.1,
            description: template.animationIntent,
            _debug_info: {word_aligned: true, keyword: template.triggerPhrase, word_time: 3.2},
          },
        ],
      },
    ],
  };
};
