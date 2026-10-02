import React from 'react';
import {BasicBarChartDemo as RuntimeBasicBarChart} from '../runtime_style_templates/bar_chart/RuntimeBasicBarChart';
import {ExecutiveHorizontalBarsDemo as RuntimeExecutiveHorizontalBars} from '../runtime_style_templates/bar_chart/RuntimeExecutiveHorizontalBars';
import {DarkCompactBarRankingDemo as RuntimeDarkCompactBarRanking} from '../runtime_style_templates/bar_chart/RuntimeDarkCompactBarRanking';
import {DenseRankingTableDemo as RuntimeDenseRankingTable} from '../runtime_style_templates/bar_chart/RuntimeDenseRankingTable';
import {LightDenseRankingBarDemo as RuntimeLightDenseRankingBar} from '../runtime_style_templates/bar_chart/RuntimeLightDenseRankingBar';
import {CompactColumnKpiDemo as RuntimeCompactColumnKpi} from '../runtime_style_templates/bar_chart/RuntimeCompactColumnKpi';
import {LeaderboardCardGridDemo as RuntimeLeaderboardCardGrid} from '../runtime_style_templates/bar_chart/RuntimeLeaderboardCardGrid';
import {SteppedBarStripDemo as RuntimeSteppedBarStrip} from '../runtime_style_templates/bar_chart/RuntimeSteppedBarStrip';
import {LightWideComparisonDemo as RuntimeLightWideComparison} from '../runtime_style_templates/comparison_chart/RuntimeLightWideComparison';
import {LightComparisonPanelDemo as RuntimeLightComparisonPanel} from '../runtime_style_templates/comparison_chart/RuntimeLightComparisonPanel';
import {DarkComparisonPanelDemo as RuntimeDarkComparisonPanel} from '../runtime_style_templates/comparison_chart/RuntimeDarkComparisonPanel';
import {HorizontalBarMatrixDemo as RuntimeHorizontalBarMatrix} from '../runtime_style_templates/bar_chart/RuntimeHorizontalBarMatrix';
import {SalesByRegionDarkColumnDemo as RuntimeSalesByRegionDarkColumn} from '../runtime_style_templates/bar_chart/RuntimeSalesByRegionDarkColumn';
import {CoffeeRatingHorizontalRankingDemo as RuntimeCoffeeRatingHorizontalRanking} from '../runtime_style_templates/bar_chart/RuntimeCoffeeRatingHorizontalRanking';
import {AreaStackTrendDemo as RuntimeAreaStackTrend} from '../runtime_style_templates/line_chart/RuntimeAreaStackTrend';
import {SteppedLineRankingDemo as RuntimeSteppedLineRanking} from '../runtime_style_templates/line_chart/RuntimeSteppedLineRanking';
import {NestedRingShareDemo as RuntimeNestedRingShare} from '../runtime_style_templates/pie_chart/RuntimeNestedRingShare';
import {LabeledScatterGridDemo as RuntimeLabeledScatterGrid} from '../runtime_style_templates/scatter_chart/RuntimeLabeledScatterGrid';
import {MultiEntityScatterMatrixDemo as RuntimeMultiEntityScatterMatrix} from '../runtime_style_templates/scatter_chart/RuntimeMultiEntityScatterMatrix';
import {DepartmentHeadcountDarkBarDemo as RuntimeDepartmentHeadcountDarkBar} from '../runtime_style_templates/bar_chart/RuntimeDepartmentHeadcountDarkBar';
import {CustomerSegmentsScatterDemo as RuntimeCustomerSegmentsScatter} from '../runtime_style_templates/scatter_chart/RuntimeCustomerSegmentsScatter';
import {PortfolioBubbleMatrixDemo as RuntimePortfolioBubbleMatrix} from '../runtime_style_templates/scatter_chart/RuntimePortfolioBubbleMatrix';
import {QuarterlyRevenueGroupedBarDemo as RuntimeQuarterlyRevenueGroupedBar} from '../runtime_style_templates/comparison_chart/RuntimeQuarterlyRevenueGroupedBar';
import {SwissMinimalReportDemo as RuntimeSwissMinimalReport} from '../runtime_style_templates/comparison_chart/RuntimeSwissMinimalReport';
import {WideComparisonGridDemo as RuntimeWideComparisonGrid} from '../runtime_style_templates/comparison_chart/RuntimeWideComparisonGrid';
import {MarketTreemapMosaicDemo as RuntimeMarketTreemapMosaic} from '../runtime_style_templates/pie_chart/RuntimeMarketTreemapMosaic';
import {SegmentTreemapVerticalDemo as RuntimeSegmentTreemapVertical} from '../runtime_style_templates/pie_chart/RuntimeSegmentTreemapVertical';
import {SemiGaugeProgressDemo as RuntimeSemiGaugeProgress} from '../runtime_style_templates/pie_chart/RuntimeSemiGaugeProgress';
import {SlopeChangeRankingDemo as RuntimeSlopeChangeRanking} from '../runtime_style_templates/line_chart/RuntimeSlopeChangeRanking';
import {SmallMultiplesTrendDemo as RuntimeSmallMultiplesTrend} from '../runtime_style_templates/line_chart/RuntimeSmallMultiplesTrend';
import {RuntimeEditorialDataStory} from '../runtime_style_templates/line_chart/RuntimeEditorialDataStory';
import {ProductPerformanceRadarDemo as RuntimeProductPerformanceRadar} from '../runtime_style_templates/radar_chart/RuntimeProductPerformanceRadar';
import {RadarPerformanceProfileDemo as RuntimeRadarPerformanceProfile} from '../runtime_style_templates/radar_chart/RuntimeRadarPerformanceProfile';
import {LightRadarScorecardDemo as RuntimeLightRadarScorecard} from '../runtime_style_templates/radar_chart/RuntimeLightRadarScorecard';
import {CorrelationHeatmapMatrixDemo as RuntimeCorrelationHeatmapMatrix} from '../runtime_style_templates/heatmap/RuntimeCorrelationHeatmapMatrix';
import {DarkCorrelationMatrixDemo as RuntimeDarkCorrelationMatrix} from '../runtime_style_templates/heatmap/RuntimeDarkCorrelationMatrix';
import {WeeklyActivityHeatmapDemo as RuntimeWeeklyActivityHeatmap} from '../runtime_style_templates/heatmap/RuntimeWeeklyActivityHeatmap';
import {SupplyFlowSankeyDemo as RuntimeSupplyFlowSankey} from '../runtime_style_templates/flow_sankey/RuntimeSupplyFlowSankey';
import {SupplyChainSankeyFlowDemo as RuntimeSupplyChainSankeyFlow} from '../runtime_style_templates/flow_sankey/RuntimeSupplyChainSankeyFlow';
import {LongFlowSankeyDemo as RuntimeLongFlowSankey} from '../runtime_style_templates/flow_sankey/RuntimeLongFlowSankey';
import {LightFlowSankeyDemo as RuntimeLightFlowSankey} from '../runtime_style_templates/flow_sankey/RuntimeLightFlowSankey';
import {ConversionFunnelCleanDemo as RuntimeConversionFunnelClean} from '../runtime_style_templates/flow_sankey/RuntimeConversionFunnelClean';
import {WaterfallProfitBridgeDemo as RuntimeWaterfallProfitBridge} from '../runtime_style_templates/waterfall_chart/RuntimeWaterfallProfitBridge';
import {RevenueWaterfallBridgeDemo as RuntimeRevenueWaterfallBridge} from '../runtime_style_templates/waterfall_chart/RuntimeRevenueWaterfallBridge';
import {DarkWaterfallBridgeDemo as RuntimeDarkWaterfallBridge} from '../runtime_style_templates/waterfall_chart/RuntimeDarkWaterfallBridge';
import {TimelineMilestonesDemo as RuntimeTimelineMilestones} from '../runtime_style_templates/timeline/RuntimeTimelineMilestones';
import {TimelineMilestoneRoadmapDemo as RuntimeTimelineMilestoneRoadmap} from '../runtime_style_templates/timeline/RuntimeTimelineMilestoneRoadmap';
import {DarkTimelineMilestonesDemo as RuntimeDarkTimelineMilestones} from '../runtime_style_templates/timeline/RuntimeDarkTimelineMilestones';
import {BasicLineChartDemo as RuntimeBasicLineChart} from '../runtime_style_templates/line_chart/RuntimeBasicLineChart';
import {MetricTrendRibbonDemo as RuntimeMetricTrendRibbon} from '../runtime_style_templates/line_chart/RuntimeMetricTrendRibbon';
import {DarkEditorialTrendDemo as RuntimeDarkEditorialTrend} from '../runtime_style_templates/line_chart/RuntimeDarkEditorialTrend';
import {CleanTrendCardDemo as RuntimeCleanTrendCard} from '../runtime_style_templates/line_chart/RuntimeCleanTrendCard';
import {LightFocusLineDemo as RuntimeLightFocusLine} from '../runtime_style_templates/line_chart/RuntimeLightFocusLine';
import {DualSeriesPulseLineDemo as RuntimeDualSeriesPulseLine} from '../runtime_style_templates/line_chart/RuntimeDualSeriesPulseLine';
import {LongTrendlineDemo as RuntimeLongTrendline} from '../runtime_style_templates/line_chart/RuntimeLongTrendline';
import {MarginSlopeComparisonDemo as RuntimeMarginSlopeComparison} from '../runtime_style_templates/line_chart/RuntimeMarginSlopeComparison';
import {BasicPieChartDemo as RuntimeBasicPieChart} from '../runtime_style_templates/pie_chart/RuntimeBasicPieChart';
import {MarketShareDonutDemo as RuntimeMarketShareDonut} from '../runtime_style_templates/RuntimeMarketShareDonut';
import {DarkCompactDonutShareDemo as RuntimeDarkCompactDonutShare} from '../runtime_style_templates/pie_chart/RuntimeDarkCompactDonutShare';
import {LightMultiSlicePieDemo as RuntimeLightMultiSlicePie} from '../runtime_style_templates/pie_chart/RuntimeLightMultiSlicePie';
import {MultiSliceDonutDemo as RuntimeMultiSliceDonut} from '../runtime_style_templates/pie_chart/RuntimeMultiSliceDonut';
import {RaceTrackShareDemo as RuntimeRaceTrackShare} from '../runtime_style_templates/pie_chart/RuntimeRaceTrackShare';
import {StackedShareBarDemo as RuntimeStackedShareBar} from '../runtime_style_templates/pie_chart/RuntimeStackedShareBar';
import {ScatterOpportunityMapDemo as RuntimeScatterOpportunityMap} from '../runtime_style_templates/RuntimeScatterOpportunityMap';
import {DarkCompactScatterPanelDemo as RuntimeDarkCompactScatterPanel} from '../runtime_style_templates/scatter_chart/RuntimeDarkCompactScatterPanel';
import {BrightScatterGridDemo as RuntimeBrightScatterGrid} from '../runtime_style_templates/scatter_chart/RuntimeBrightScatterGrid';
import {DenseScatterCloudDemo as RuntimeDenseScatterCloud} from '../runtime_style_templates/scatter_chart/RuntimeDenseScatterCloud';
import {LightDenseScatterDemo as RuntimeLightDenseScatter} from '../runtime_style_templates/scatter_chart/RuntimeLightDenseScatter';
import {QuadrantSplitScatterDemo as RuntimeQuadrantSplitScatter} from '../runtime_style_templates/scatter_chart/RuntimeQuadrantSplitScatter';
import {KpiMicroDashboardDemo as RuntimeKpiMicroDashboard} from '../runtime_style_templates/RuntimeKpiMicroDashboard';
import {BasicStatCardsDemo as RuntimeBasicStatCards} from '../runtime_style_templates/stat_cards/RuntimeBasicStatCards';
import {DarkKpiMicroDashboardDemo as RuntimeDarkKpiMicroDashboard} from '../runtime_style_templates/stat_cards/RuntimeDarkKpiMicroDashboard';
import {StatCardsKpiTrioDemo as RuntimeStatCardsKpiTrio} from '../runtime_style_templates/stat_cards/RuntimeStatCardsKpiTrio';
import {LightHeroNumberDemo as RuntimeLightHeroNumber} from '../runtime_style_templates/stat_cards/RuntimeLightHeroNumber';
import {HeroNumberSpotlightDemo as RuntimeHeroNumberSpotlight} from '../runtime_style_templates/stat_cards/RuntimeHeroNumberSpotlight';
import {LuxuryBlackGoldMetricsDemo as RuntimeLuxuryBlackGoldMetrics} from '../runtime_style_templates/stat_cards/RuntimeLuxuryBlackGoldMetrics';
import {CyberCommandCenterDemo as RuntimeCyberCommandCenter} from '../runtime_style_templates/stat_cards/RuntimeCyberCommandCenter';
import {firstString, styleTheme, type RuntimeStyleTemplateProps} from '../runtime_style_templates/runtimeSlots';

// ── Adapter map: style_template_id → runtime chart component ────────────────
// IMPORTANT — this map is also the source of truth for the backend "eject" step
// (web/server.py: _parse_runtime_chart_dispatcher / _eject_runtime_chart_source).
// At quick-visual generation time the backend copies the matched template's source
// into a standalone per-task scene TSX so it gets full edit parity with the normal
// flow. The backend reads this file's `import {Export as Alias} from '...'` lines and
// the `'StyleTemplate-X': Alias,` entries below — so just keep registering templates
// here as usual; no separate backend table to update.
//
// For a new template to be ejectable (otherwise it silently falls back to the shared
// renderer — still works, just not deeply editable), it MUST follow the contract that
// every template here already follows:
//   1. One template per file under runtime_style_templates/<category>/.
//   2. Signature exactly: `export const XxxDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {`
//   3. Relative imports only from the known set: '../../scenes/EditableTransform',
//      '../runtimeSlots', '../narrationTiming', '../../style_templates/shared'
//      (add new shared deps to _RUNTIME_EJECT_IMPORT_REWRITES in server.py).
//   4. Wrap editable regions in <EditableTransform id="..." role="..."> with ids
//      unique within the file.
const RUNTIME_TEMPLATE_ADAPTERS: Record<string, React.FC<RuntimeStyleTemplateProps>> = {
  'StyleTemplate-BasicBarChart': RuntimeBasicBarChart,
  'StyleTemplate-ExecutiveHorizontalBars': RuntimeExecutiveHorizontalBars,
  'StyleTemplate-LightDenseRankingBar': RuntimeLightDenseRankingBar,
  'StyleTemplate-DenseRankingTable': RuntimeDenseRankingTable,
  'StyleTemplate-DarkCompactBarRanking': RuntimeDarkCompactBarRanking,
  'StyleTemplate-CompactColumnKpi': RuntimeCompactColumnKpi,
  'StyleTemplate-LeaderboardCardGrid': RuntimeLeaderboardCardGrid,
  'StyleTemplate-SteppedBarStrip': RuntimeSteppedBarStrip,
  'StyleTemplate-BasicLineChart': RuntimeBasicLineChart,
  'StyleTemplate-MetricTrendRibbon': RuntimeMetricTrendRibbon,
  'StyleTemplate-LightFocusLine': RuntimeLightFocusLine,
  'StyleTemplate-DarkEditorialTrend': RuntimeDarkEditorialTrend,
  'StyleTemplate-CleanTrendCard': RuntimeCleanTrendCard,
  'StyleTemplate-DualSeriesPulseLine': RuntimeDualSeriesPulseLine,
  'StyleTemplate-LongTrendline': RuntimeLongTrendline,
  'StyleTemplate-DarkSignalTrendline': RuntimeLongTrendline,
  'StyleTemplate-MarginSlopeComparison': RuntimeMarginSlopeComparison,
  'StyleTemplate-BasicPieChart': RuntimeBasicPieChart,
  'StyleTemplate-MarketShareDonut': RuntimeMarketShareDonut,
  'StyleTemplate-DarkCompactDonutShare': RuntimeDarkCompactDonutShare,
  'StyleTemplate-LightMultiSlicePie': RuntimeLightMultiSlicePie,
  'StyleTemplate-MultiSliceDonut': RuntimeMultiSliceDonut,
  'StyleTemplate-RaceTrackShare': RuntimeRaceTrackShare,
  'StyleTemplate-StackedShareBar': RuntimeStackedShareBar,
  'StyleTemplate-ScatterOpportunityMap': RuntimeScatterOpportunityMap,
  'StyleTemplate-DarkCompactScatterPanel': RuntimeDarkCompactScatterPanel,
  'StyleTemplate-DenseScatterCloud': RuntimeDenseScatterCloud,
  'StyleTemplate-BrightScatterGrid': RuntimeBrightScatterGrid,
  'StyleTemplate-LightDenseScatter': RuntimeLightDenseScatter,
  'StyleTemplate-QuadrantSplitScatter': RuntimeQuadrantSplitScatter,
  'StyleTemplate-KpiMicroDashboard': RuntimeKpiMicroDashboard,
  'StyleTemplate-BasicStatCards': RuntimeBasicStatCards,
  'StyleTemplate-StatCardsKpiTrio': RuntimeStatCardsKpiTrio,
  'StyleTemplate-LightHeroNumber': RuntimeLightHeroNumber,
  'StyleTemplate-DarkKpiMicroDashboard': RuntimeDarkKpiMicroDashboard,
  'StyleTemplate-HeroNumberSpotlight': RuntimeHeroNumberSpotlight,
  'StyleTemplate-LuxuryBlackGoldMetrics': RuntimeLuxuryBlackGoldMetrics,
  'StyleTemplate-CyberCommandCenter': RuntimeCyberCommandCenter,
  'StyleTemplate-LightWideComparison': RuntimeLightWideComparison,
  'StyleTemplate-LightComparisonPanel': RuntimeLightComparisonPanel,
  'StyleTemplate-DarkComparisonPanel': RuntimeDarkComparisonPanel,
  'StyleTemplate-HorizontalBarMatrix': RuntimeHorizontalBarMatrix,
  'StyleTemplate-SalesByRegionDarkColumn': RuntimeSalesByRegionDarkColumn,
  'StyleTemplate-CoffeeRatingHorizontalRanking': RuntimeCoffeeRatingHorizontalRanking,
  'StyleTemplate-AreaStackTrend': RuntimeAreaStackTrend,
  'StyleTemplate-SteppedLineRanking': RuntimeSteppedLineRanking,
  'StyleTemplate-NestedRingShare': RuntimeNestedRingShare,
  'StyleTemplate-LabeledScatterGrid': RuntimeLabeledScatterGrid,
  'StyleTemplate-MultiEntityScatterMatrix': RuntimeMultiEntityScatterMatrix,
  'StyleTemplate-DepartmentHeadcountDarkBar': RuntimeDepartmentHeadcountDarkBar,
  'StyleTemplate-CustomerSegmentsScatter': RuntimeCustomerSegmentsScatter,
  'StyleTemplate-PortfolioBubbleMatrix': RuntimePortfolioBubbleMatrix,
  'StyleTemplate-QuarterlyRevenueGroupedBar': RuntimeQuarterlyRevenueGroupedBar,
  'StyleTemplate-SwissMinimalReport': RuntimeSwissMinimalReport,
  'StyleTemplate-WideComparisonGrid': RuntimeWideComparisonGrid,
  'StyleTemplate-MarketTreemapMosaic': RuntimeMarketTreemapMosaic,
  'StyleTemplate-SegmentTreemapVertical': RuntimeSegmentTreemapVertical,
  'StyleTemplate-SemiGaugeProgress': RuntimeSemiGaugeProgress,
  'StyleTemplate-SlopeChangeRanking': RuntimeSlopeChangeRanking,
  'StyleTemplate-SmallMultiplesTrend': RuntimeSmallMultiplesTrend,
  'StyleTemplate-EditorialDataStory': RuntimeEditorialDataStory,
  'StyleTemplate-ProductPerformanceRadar': RuntimeProductPerformanceRadar,
  'StyleTemplate-RadarPerformanceProfile': RuntimeRadarPerformanceProfile,
  'StyleTemplate-LightRadarScorecard': RuntimeLightRadarScorecard,
  'StyleTemplate-CorrelationHeatmapMatrix': RuntimeCorrelationHeatmapMatrix,
  'StyleTemplate-DarkCorrelationMatrix': RuntimeDarkCorrelationMatrix,
  'StyleTemplate-WeeklyActivityHeatmap': RuntimeWeeklyActivityHeatmap,
  'StyleTemplate-SupplyFlowSankey': RuntimeSupplyFlowSankey,
  'StyleTemplate-SupplyChainSankeyFlow': RuntimeSupplyChainSankeyFlow,
  'StyleTemplate-LongFlowSankey': RuntimeLongFlowSankey,
  'StyleTemplate-LightFlowSankey': RuntimeLightFlowSankey,
  'StyleTemplate-ConversionFunnelClean': RuntimeConversionFunnelClean,
  'StyleTemplate-WaterfallProfitBridge': RuntimeWaterfallProfitBridge,
  'StyleTemplate-RevenueWaterfallBridge': RuntimeRevenueWaterfallBridge,
  'StyleTemplate-DarkWaterfallBridge': RuntimeDarkWaterfallBridge,
  'StyleTemplate-TimelineMilestones': RuntimeTimelineMilestones,
  'StyleTemplate-TimelineMilestoneRoadmap': RuntimeTimelineMilestoneRoadmap,
  'StyleTemplate-DarkTimelineMilestones': RuntimeDarkTimelineMilestones,
};

const runtimeTemplateId = (sceneContent: any, scene?: any): string =>
  firstString(sceneContent?.style_template_id, scene?.renderer?.style_template_id, scene?.content?.style_template_id);

const runtimeAdapterFallbackId = (sceneContent: any): string => {
  const chartType = String(sceneContent?.chart_type ?? '').toLowerCase();
  const sourceChartType = String(sceneContent?.source_chart_type ?? '').toLowerCase();
  const theme = styleTheme(sceneContent);
  if (chartType === 'stat_cards') {
    return theme === 'dark' ? 'StyleTemplate-DarkKpiMicroDashboard' : 'StyleTemplate-KpiMicroDashboard';
  }
  if (chartType === 'scatter_chart') {
    return theme === 'dark' ? 'StyleTemplate-DarkCompactScatterPanel' : 'StyleTemplate-BrightScatterGrid';
  }
  if (chartType === 'pie_chart') {
    return theme === 'dark' ? 'StyleTemplate-RaceTrackShare' : 'StyleTemplate-MarketShareDonut';
  }
  if (chartType === 'line_chart') {
    return theme === 'dark' ? 'StyleTemplate-DualSeriesPulseLine' : 'StyleTemplate-MetricTrendRibbon';
  }
  if (sourceChartType === 'comparison_chart') {
    return theme === 'dark' ? 'StyleTemplate-DarkCompactBarRanking' : 'StyleTemplate-LightWideComparison';
  }
  return theme === 'dark' ? 'StyleTemplate-CompactColumnKpi' : 'StyleTemplate-ExecutiveHorizontalBars';
};

const resolveRuntimeTemplateId = (sceneContent: any, scene?: any): string => {
  const explicit = runtimeTemplateId(sceneContent, scene);
  return RUNTIME_TEMPLATE_ADAPTERS[explicit] ? explicit : runtimeAdapterFallbackId(sceneContent);
};

export const hasRuntimeStyleTemplateAdapter = (templateId: unknown): boolean =>
  typeof templateId === 'string' && Boolean(RUNTIME_TEMPLATE_ADAPTERS[templateId]);

export const RuntimeStyleTemplateScene: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const templateId = resolveRuntimeTemplateId(sceneContent, scene);
  const Adapter = RUNTIME_TEMPLATE_ADAPTERS[templateId];
  return <Adapter sceneContent={sceneContent} scene={scene} />;
};
