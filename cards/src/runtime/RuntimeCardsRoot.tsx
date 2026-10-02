import React from "react";
import {Composition, Folder} from "remotion";
import {RuntimeCard} from "./RuntimeCard";
import sample0 from "../../templates/runtime-cards/BasicBarChart/sample-data.json";
import sample1 from "../../templates/runtime-cards/BasicLineChart/sample-data.json";
import sample2 from "../../templates/runtime-cards/BasicPieChart/sample-data.json";
import sample3 from "../../templates/runtime-cards/BasicStatCards/sample-data.json";
import sample4 from "../../templates/runtime-cards/OpeningEditorialTitle/sample-data.json";
import sample5 from "../../templates/runtime-cards/OpeningExecutiveBrief/sample-data.json";
import sample6 from "../../templates/runtime-cards/OpeningDataGrid/sample-data.json";
import sample7 from "../../templates/runtime-cards/OpeningSplitMetrics/sample-data.json";
import sample8 from "../../templates/runtime-cards/OpeningCinematicHeadline/sample-data.json";
import sample9 from "../../templates/runtime-cards/HeroNumberSpotlight/sample-data.json";
import sample10 from "../../templates/runtime-cards/KpiMicroDashboard/sample-data.json";
import sample11 from "../../templates/runtime-cards/DarkKpiMicroDashboard/sample-data.json";
import sample12 from "../../templates/runtime-cards/StatCardsKpiTrio/sample-data.json";
import sample13 from "../../templates/runtime-cards/QuarterlyRevenueGroupedBar/sample-data.json";
import sample14 from "../../templates/runtime-cards/SwissMinimalReport/sample-data.json";
import sample15 from "../../templates/runtime-cards/CoffeeRatingHorizontalRanking/sample-data.json";
import sample16 from "../../templates/runtime-cards/DepartmentHeadcountDarkBar/sample-data.json";
import sample17 from "../../templates/runtime-cards/SalesByRegionDarkColumn/sample-data.json";
import sample18 from "../../templates/runtime-cards/ExecutiveHorizontalBars/sample-data.json";
import sample19 from "../../templates/runtime-cards/CompactColumnKpi/sample-data.json";
import sample20 from "../../templates/runtime-cards/MarginSlopeComparison/sample-data.json";
import sample21 from "../../templates/runtime-cards/MetricTrendRibbon/sample-data.json";
import sample22 from "../../templates/runtime-cards/LightFocusLine/sample-data.json";
import sample23 from "../../templates/runtime-cards/EditorialDataStory/sample-data.json";
import sample24 from "../../templates/runtime-cards/DarkEditorialTrend/sample-data.json";
import sample25 from "../../templates/runtime-cards/DarkSignalTrendline/sample-data.json";
import sample26 from "../../templates/runtime-cards/DualSeriesPulseLine/sample-data.json";
import sample27 from "../../templates/runtime-cards/SlopeChangeRanking/sample-data.json";
import sample28 from "../../templates/runtime-cards/MarketShareDonut/sample-data.json";
import sample29 from "../../templates/runtime-cards/NestedRingShare/sample-data.json";
import sample30 from "../../templates/runtime-cards/SemiGaugeProgress/sample-data.json";
import sample31 from "../../templates/runtime-cards/CustomerSegmentsScatter/sample-data.json";
import sample32 from "../../templates/runtime-cards/PortfolioBubbleMatrix/sample-data.json";
import sample33 from "../../templates/runtime-cards/ProductPerformanceRadar/sample-data.json";
import sample34 from "../../templates/runtime-cards/RadarPerformanceProfile/sample-data.json";
import sample35 from "../../templates/runtime-cards/LightRadarScorecard/sample-data.json";
import sample36 from "../../templates/runtime-cards/ScatterOpportunityMap/sample-data.json";
import sample37 from "../../templates/runtime-cards/CorrelationHeatmapMatrix/sample-data.json";
import sample38 from "../../templates/runtime-cards/DarkCorrelationMatrix/sample-data.json";
import sample39 from "../../templates/runtime-cards/WeeklyActivityHeatmap/sample-data.json";
import sample40 from "../../templates/runtime-cards/WaterfallProfitBridge/sample-data.json";
import sample41 from "../../templates/runtime-cards/RevenueWaterfallBridge/sample-data.json";
import sample42 from "../../templates/runtime-cards/ConversionFunnelClean/sample-data.json";
import sample43 from "../../templates/runtime-cards/SupplyFlowSankey/sample-data.json";
import sample44 from "../../templates/runtime-cards/SupplyChainSankeyFlow/sample-data.json";
import sample45 from "../../templates/runtime-cards/MarketTreemapMosaic/sample-data.json";
import sample46 from "../../templates/runtime-cards/CyberCommandCenter/sample-data.json";
import sample47 from "../../templates/runtime-cards/LuxuryBlackGoldMetrics/sample-data.json";
import sample48 from "../../templates/runtime-cards/TimelineMilestones/sample-data.json";
import sample49 from "../../templates/runtime-cards/TimelineMilestoneRoadmap/sample-data.json";
import sample50 from "../../templates/runtime-cards/NarrativeChapterTitle/sample-data.json";
import sample51 from "../../templates/runtime-cards/NarrativeQuestion/sample-data.json";
import sample52 from "../../templates/runtime-cards/NarrativeQuote/sample-data.json";
import sample53 from "../../templates/runtime-cards/NarrativeStatHook/sample-data.json";
import sample54 from "../../templates/runtime-cards/NarrativeContext/sample-data.json";
import sample55 from "../../templates/runtime-cards/NarrativeBullets/sample-data.json";
import sample56 from "../../templates/runtime-cards/NarrativeVersus/sample-data.json";
import sample57 from "../../templates/runtime-cards/NarrativeDefinition/sample-data.json";
import sample58 from "../../templates/runtime-cards/NarrativeBeforeAfter/sample-data.json";
import sample59 from "../../templates/runtime-cards/NarrativeMiniTimeline/sample-data.json";
import sample60 from "../../templates/runtime-cards/ClosingSimpleOutro/sample-data.json";
import sample61 from "../../templates/runtime-cards/ClosingGradientSignal/sample-data.json";
import sample62 from "../../templates/runtime-cards/ClosingLightOutro/sample-data.json";
import sample63 from "../../templates/runtime-cards/ClosingKeyTakeaways/sample-data.json";
import sample64 from "../../templates/runtime-cards/ClosingMetricSummary/sample-data.json";
import sample65 from "../../templates/runtime-cards/ClosingActionPlan/sample-data.json";
import sample66 from "../../templates/runtime-cards/DenseRankingTable/sample-data.json";
import sample67 from "../../templates/runtime-cards/MultiSliceDonut/sample-data.json";
import sample68 from "../../templates/runtime-cards/LongTrendline/sample-data.json";
import sample69 from "../../templates/runtime-cards/DenseScatterCloud/sample-data.json";
import sample70 from "../../templates/runtime-cards/WideComparisonGrid/sample-data.json";
import sample71 from "../../templates/runtime-cards/LongFlowSankey/sample-data.json";
import sample72 from "../../templates/runtime-cards/HorizontalBarMatrix/sample-data.json";
import sample73 from "../../templates/runtime-cards/LeaderboardCardGrid/sample-data.json";
import sample74 from "../../templates/runtime-cards/SteppedBarStrip/sample-data.json";
import sample75 from "../../templates/runtime-cards/StackedShareBar/sample-data.json";
import sample76 from "../../templates/runtime-cards/SegmentTreemapVertical/sample-data.json";
import sample77 from "../../templates/runtime-cards/RaceTrackShare/sample-data.json";
import sample78 from "../../templates/runtime-cards/MultiEntityScatterMatrix/sample-data.json";
import sample79 from "../../templates/runtime-cards/QuadrantSplitScatter/sample-data.json";
import sample80 from "../../templates/runtime-cards/LabeledScatterGrid/sample-data.json";
import sample81 from "../../templates/runtime-cards/SmallMultiplesTrend/sample-data.json";
import sample82 from "../../templates/runtime-cards/SteppedLineRanking/sample-data.json";
import sample83 from "../../templates/runtime-cards/AreaStackTrend/sample-data.json";
import sample84 from "../../templates/runtime-cards/CleanTrendCard/sample-data.json";
import sample85 from "../../templates/runtime-cards/BrightScatterGrid/sample-data.json";
import sample86 from "../../templates/runtime-cards/LightComparisonPanel/sample-data.json";
import sample87 from "../../templates/runtime-cards/DarkComparisonPanel/sample-data.json";
import sample88 from "../../templates/runtime-cards/DarkCompactBarRanking/sample-data.json";
import sample89 from "../../templates/runtime-cards/DarkCompactDonutShare/sample-data.json";
import sample90 from "../../templates/runtime-cards/DarkCompactScatterPanel/sample-data.json";
import sample91 from "../../templates/runtime-cards/NarrativeChapterTitleLight/sample-data.json";
import sample92 from "../../templates/runtime-cards/NarrativeStatHookLight/sample-data.json";
import sample93 from "../../templates/runtime-cards/NarrativeBulletsLight/sample-data.json";
import sample94 from "../../templates/runtime-cards/NarrativeQuoteLight/sample-data.json";
import sample95 from "../../templates/runtime-cards/NarrativeContextLight/sample-data.json";
import sample96 from "../../templates/runtime-cards/NarrativeContextIllustrated/sample-data.json";
import sample97 from "../../templates/runtime-cards/NarrativeStatHookIllustrated/sample-data.json";
import sample98 from "../../templates/runtime-cards/NarrativeBulletsIllustrated/sample-data.json";
import sample99 from "../../templates/runtime-cards/NarrativeChapterTitleIllustrated/sample-data.json";
import sample100 from "../../templates/runtime-cards/NarrativeQuoteIllustrated/sample-data.json";
import sample101 from "../../templates/runtime-cards/LightDenseRankingBar/sample-data.json";
import sample102 from "../../templates/runtime-cards/LightMultiSlicePie/sample-data.json";
import sample103 from "../../templates/runtime-cards/LightDenseScatter/sample-data.json";
import sample104 from "../../templates/runtime-cards/LightFlowSankey/sample-data.json";
import sample105 from "../../templates/runtime-cards/LightWideComparison/sample-data.json";
import sample106 from "../../templates/runtime-cards/DarkWaterfallBridge/sample-data.json";
import sample107 from "../../templates/runtime-cards/DarkTimelineMilestones/sample-data.json";
import sample108 from "../../templates/runtime-cards/LightHeroNumber/sample-data.json";

const cards = [
  {id:"StyleTemplate-BasicBarChart", previewId:"RuntimeTemplatePreview-BasicBarChart", sample:sample0},
  {id:"StyleTemplate-BasicLineChart", previewId:"RuntimeTemplatePreview-BasicLineChart", sample:sample1},
  {id:"StyleTemplate-BasicPieChart", previewId:"RuntimeTemplatePreview-BasicPieChart", sample:sample2},
  {id:"StyleTemplate-BasicStatCards", previewId:"RuntimeTemplatePreview-BasicStatCards", sample:sample3},
  {id:"StyleTemplate-OpeningEditorialTitle", previewId:"RuntimeTemplatePreview-OpeningEditorialTitle", sample:sample4},
  {id:"StyleTemplate-OpeningExecutiveBrief", previewId:"RuntimeTemplatePreview-OpeningExecutiveBrief", sample:sample5},
  {id:"StyleTemplate-OpeningDataGrid", previewId:"RuntimeTemplatePreview-OpeningDataGrid", sample:sample6},
  {id:"StyleTemplate-OpeningSplitMetrics", previewId:"RuntimeTemplatePreview-OpeningSplitMetrics", sample:sample7},
  {id:"StyleTemplate-OpeningCinematicHeadline", previewId:"RuntimeTemplatePreview-OpeningCinematicHeadline", sample:sample8},
  {id:"StyleTemplate-HeroNumberSpotlight", previewId:"RuntimeTemplatePreview-HeroNumberSpotlight", sample:sample9},
  {id:"StyleTemplate-KpiMicroDashboard", previewId:"RuntimeTemplatePreview-KpiMicroDashboard", sample:sample10},
  {id:"StyleTemplate-DarkKpiMicroDashboard", previewId:"RuntimeTemplatePreview-DarkKpiMicroDashboard", sample:sample11},
  {id:"StyleTemplate-StatCardsKpiTrio", previewId:"RuntimeTemplatePreview-StatCardsKpiTrio", sample:sample12},
  {id:"StyleTemplate-QuarterlyRevenueGroupedBar", previewId:"RuntimeTemplatePreview-QuarterlyRevenueGroupedBar", sample:sample13},
  {id:"StyleTemplate-SwissMinimalReport", previewId:"RuntimeTemplatePreview-SwissMinimalReport", sample:sample14},
  {id:"StyleTemplate-CoffeeRatingHorizontalRanking", previewId:"RuntimeTemplatePreview-CoffeeRatingHorizontalRanking", sample:sample15},
  {id:"StyleTemplate-DepartmentHeadcountDarkBar", previewId:"RuntimeTemplatePreview-DepartmentHeadcountDarkBar", sample:sample16},
  {id:"StyleTemplate-SalesByRegionDarkColumn", previewId:"RuntimeTemplatePreview-SalesByRegionDarkColumn", sample:sample17},
  {id:"StyleTemplate-ExecutiveHorizontalBars", previewId:"RuntimeTemplatePreview-ExecutiveHorizontalBars", sample:sample18},
  {id:"StyleTemplate-CompactColumnKpi", previewId:"RuntimeTemplatePreview-CompactColumnKpi", sample:sample19},
  {id:"StyleTemplate-MarginSlopeComparison", previewId:"RuntimeTemplatePreview-MarginSlopeComparison", sample:sample20},
  {id:"StyleTemplate-MetricTrendRibbon", previewId:"RuntimeTemplatePreview-MetricTrendRibbon", sample:sample21},
  {id:"StyleTemplate-LightFocusLine", previewId:"RuntimeTemplatePreview-LightFocusLine", sample:sample22},
  {id:"StyleTemplate-EditorialDataStory", previewId:"RuntimeTemplatePreview-EditorialDataStory", sample:sample23},
  {id:"StyleTemplate-DarkEditorialTrend", previewId:"RuntimeTemplatePreview-DarkEditorialTrend", sample:sample24},
  {id:"StyleTemplate-DarkSignalTrendline", previewId:"RuntimeTemplatePreview-DarkSignalTrendline", sample:sample25},
  {id:"StyleTemplate-DualSeriesPulseLine", previewId:"RuntimeTemplatePreview-DualSeriesPulseLine", sample:sample26},
  {id:"StyleTemplate-SlopeChangeRanking", previewId:"RuntimeTemplatePreview-SlopeChangeRanking", sample:sample27},
  {id:"StyleTemplate-MarketShareDonut", previewId:"RuntimeTemplatePreview-MarketShareDonut", sample:sample28},
  {id:"StyleTemplate-NestedRingShare", previewId:"RuntimeTemplatePreview-NestedRingShare", sample:sample29},
  {id:"StyleTemplate-SemiGaugeProgress", previewId:"RuntimeTemplatePreview-SemiGaugeProgress", sample:sample30},
  {id:"StyleTemplate-CustomerSegmentsScatter", previewId:"RuntimeTemplatePreview-CustomerSegmentsScatter", sample:sample31},
  {id:"StyleTemplate-PortfolioBubbleMatrix", previewId:"RuntimeTemplatePreview-PortfolioBubbleMatrix", sample:sample32},
  {id:"StyleTemplate-ProductPerformanceRadar", previewId:"RuntimeTemplatePreview-ProductPerformanceRadar", sample:sample33},
  {id:"StyleTemplate-RadarPerformanceProfile", previewId:"RuntimeTemplatePreview-RadarPerformanceProfile", sample:sample34},
  {id:"StyleTemplate-LightRadarScorecard", previewId:"RuntimeTemplatePreview-LightRadarScorecard", sample:sample35},
  {id:"StyleTemplate-ScatterOpportunityMap", previewId:"RuntimeTemplatePreview-ScatterOpportunityMap", sample:sample36},
  {id:"StyleTemplate-CorrelationHeatmapMatrix", previewId:"RuntimeTemplatePreview-CorrelationHeatmapMatrix", sample:sample37},
  {id:"StyleTemplate-DarkCorrelationMatrix", previewId:"RuntimeTemplatePreview-DarkCorrelationMatrix", sample:sample38},
  {id:"StyleTemplate-WeeklyActivityHeatmap", previewId:"RuntimeTemplatePreview-WeeklyActivityHeatmap", sample:sample39},
  {id:"StyleTemplate-WaterfallProfitBridge", previewId:"RuntimeTemplatePreview-WaterfallProfitBridge", sample:sample40},
  {id:"StyleTemplate-RevenueWaterfallBridge", previewId:"RuntimeTemplatePreview-RevenueWaterfallBridge", sample:sample41},
  {id:"StyleTemplate-ConversionFunnelClean", previewId:"RuntimeTemplatePreview-ConversionFunnelClean", sample:sample42},
  {id:"StyleTemplate-SupplyFlowSankey", previewId:"RuntimeTemplatePreview-SupplyFlowSankey", sample:sample43},
  {id:"StyleTemplate-SupplyChainSankeyFlow", previewId:"RuntimeTemplatePreview-SupplyChainSankeyFlow", sample:sample44},
  {id:"StyleTemplate-MarketTreemapMosaic", previewId:"RuntimeTemplatePreview-MarketTreemapMosaic", sample:sample45},
  {id:"StyleTemplate-CyberCommandCenter", previewId:"RuntimeTemplatePreview-CyberCommandCenter", sample:sample46},
  {id:"StyleTemplate-LuxuryBlackGoldMetrics", previewId:"RuntimeTemplatePreview-LuxuryBlackGoldMetrics", sample:sample47},
  {id:"StyleTemplate-TimelineMilestones", previewId:"RuntimeTemplatePreview-TimelineMilestones", sample:sample48},
  {id:"StyleTemplate-TimelineMilestoneRoadmap", previewId:"RuntimeTemplatePreview-TimelineMilestoneRoadmap", sample:sample49},
  {id:"StyleTemplate-NarrativeChapterTitle", previewId:"RuntimeTemplatePreview-NarrativeChapterTitle", sample:sample50},
  {id:"StyleTemplate-NarrativeQuestion", previewId:"RuntimeTemplatePreview-NarrativeQuestion", sample:sample51},
  {id:"StyleTemplate-NarrativeQuote", previewId:"RuntimeTemplatePreview-NarrativeQuote", sample:sample52},
  {id:"StyleTemplate-NarrativeStatHook", previewId:"RuntimeTemplatePreview-NarrativeStatHook", sample:sample53},
  {id:"StyleTemplate-NarrativeContext", previewId:"RuntimeTemplatePreview-NarrativeContext", sample:sample54},
  {id:"StyleTemplate-NarrativeBullets", previewId:"RuntimeTemplatePreview-NarrativeBullets", sample:sample55},
  {id:"StyleTemplate-NarrativeVersus", previewId:"RuntimeTemplatePreview-NarrativeVersus", sample:sample56},
  {id:"StyleTemplate-NarrativeDefinition", previewId:"RuntimeTemplatePreview-NarrativeDefinition", sample:sample57},
  {id:"StyleTemplate-NarrativeBeforeAfter", previewId:"RuntimeTemplatePreview-NarrativeBeforeAfter", sample:sample58},
  {id:"StyleTemplate-NarrativeMiniTimeline", previewId:"RuntimeTemplatePreview-NarrativeMiniTimeline", sample:sample59},
  {id:"StyleTemplate-ClosingSimpleOutro", previewId:"RuntimeTemplatePreview-ClosingSimpleOutro", sample:sample60},
  {id:"StyleTemplate-ClosingGradientSignal", previewId:"RuntimeTemplatePreview-ClosingGradientSignal", sample:sample61},
  {id:"StyleTemplate-ClosingLightOutro", previewId:"RuntimeTemplatePreview-ClosingLightOutro", sample:sample62},
  {id:"StyleTemplate-ClosingKeyTakeaways", previewId:"RuntimeTemplatePreview-ClosingKeyTakeaways", sample:sample63},
  {id:"StyleTemplate-ClosingMetricSummary", previewId:"RuntimeTemplatePreview-ClosingMetricSummary", sample:sample64},
  {id:"StyleTemplate-ClosingActionPlan", previewId:"RuntimeTemplatePreview-ClosingActionPlan", sample:sample65},
  {id:"StyleTemplate-DenseRankingTable", previewId:"RuntimeTemplatePreview-DenseRankingTable", sample:sample66},
  {id:"StyleTemplate-MultiSliceDonut", previewId:"RuntimeTemplatePreview-MultiSliceDonut", sample:sample67},
  {id:"StyleTemplate-LongTrendline", previewId:"RuntimeTemplatePreview-LongTrendline", sample:sample68},
  {id:"StyleTemplate-DenseScatterCloud", previewId:"RuntimeTemplatePreview-DenseScatterCloud", sample:sample69},
  {id:"StyleTemplate-WideComparisonGrid", previewId:"RuntimeTemplatePreview-WideComparisonGrid", sample:sample70},
  {id:"StyleTemplate-LongFlowSankey", previewId:"RuntimeTemplatePreview-LongFlowSankey", sample:sample71},
  {id:"StyleTemplate-HorizontalBarMatrix", previewId:"RuntimeTemplatePreview-HorizontalBarMatrix", sample:sample72},
  {id:"StyleTemplate-LeaderboardCardGrid", previewId:"RuntimeTemplatePreview-LeaderboardCardGrid", sample:sample73},
  {id:"StyleTemplate-SteppedBarStrip", previewId:"RuntimeTemplatePreview-SteppedBarStrip", sample:sample74},
  {id:"StyleTemplate-StackedShareBar", previewId:"RuntimeTemplatePreview-StackedShareBar", sample:sample75},
  {id:"StyleTemplate-SegmentTreemapVertical", previewId:"RuntimeTemplatePreview-SegmentTreemapVertical", sample:sample76},
  {id:"StyleTemplate-RaceTrackShare", previewId:"RuntimeTemplatePreview-RaceTrackShare", sample:sample77},
  {id:"StyleTemplate-MultiEntityScatterMatrix", previewId:"RuntimeTemplatePreview-MultiEntityScatterMatrix", sample:sample78},
  {id:"StyleTemplate-QuadrantSplitScatter", previewId:"RuntimeTemplatePreview-QuadrantSplitScatter", sample:sample79},
  {id:"StyleTemplate-LabeledScatterGrid", previewId:"RuntimeTemplatePreview-LabeledScatterGrid", sample:sample80},
  {id:"StyleTemplate-SmallMultiplesTrend", previewId:"RuntimeTemplatePreview-SmallMultiplesTrend", sample:sample81},
  {id:"StyleTemplate-SteppedLineRanking", previewId:"RuntimeTemplatePreview-SteppedLineRanking", sample:sample82},
  {id:"StyleTemplate-AreaStackTrend", previewId:"RuntimeTemplatePreview-AreaStackTrend", sample:sample83},
  {id:"StyleTemplate-CleanTrendCard", previewId:"RuntimeTemplatePreview-CleanTrendCard", sample:sample84},
  {id:"StyleTemplate-BrightScatterGrid", previewId:"RuntimeTemplatePreview-BrightScatterGrid", sample:sample85},
  {id:"StyleTemplate-LightComparisonPanel", previewId:"RuntimeTemplatePreview-LightComparisonPanel", sample:sample86},
  {id:"StyleTemplate-DarkComparisonPanel", previewId:"RuntimeTemplatePreview-DarkComparisonPanel", sample:sample87},
  {id:"StyleTemplate-DarkCompactBarRanking", previewId:"RuntimeTemplatePreview-DarkCompactBarRanking", sample:sample88},
  {id:"StyleTemplate-DarkCompactDonutShare", previewId:"RuntimeTemplatePreview-DarkCompactDonutShare", sample:sample89},
  {id:"StyleTemplate-DarkCompactScatterPanel", previewId:"RuntimeTemplatePreview-DarkCompactScatterPanel", sample:sample90},
  {id:"StyleTemplate-NarrativeChapterTitleLight", previewId:"RuntimeTemplatePreview-NarrativeChapterTitleLight", sample:sample91},
  {id:"StyleTemplate-NarrativeStatHookLight", previewId:"RuntimeTemplatePreview-NarrativeStatHookLight", sample:sample92},
  {id:"StyleTemplate-NarrativeBulletsLight", previewId:"RuntimeTemplatePreview-NarrativeBulletsLight", sample:sample93},
  {id:"StyleTemplate-NarrativeQuoteLight", previewId:"RuntimeTemplatePreview-NarrativeQuoteLight", sample:sample94},
  {id:"StyleTemplate-NarrativeContextLight", previewId:"RuntimeTemplatePreview-NarrativeContextLight", sample:sample95},
  {id:"StyleTemplate-NarrativeContextIllustrated", previewId:"RuntimeTemplatePreview-NarrativeContextIllustrated", sample:sample96},
  {id:"StyleTemplate-NarrativeStatHookIllustrated", previewId:"RuntimeTemplatePreview-NarrativeStatHookIllustrated", sample:sample97},
  {id:"StyleTemplate-NarrativeBulletsIllustrated", previewId:"RuntimeTemplatePreview-NarrativeBulletsIllustrated", sample:sample98},
  {id:"StyleTemplate-NarrativeChapterTitleIllustrated", previewId:"RuntimeTemplatePreview-NarrativeChapterTitleIllustrated", sample:sample99},
  {id:"StyleTemplate-NarrativeQuoteIllustrated", previewId:"RuntimeTemplatePreview-NarrativeQuoteIllustrated", sample:sample100},
  {id:"StyleTemplate-LightDenseRankingBar", previewId:"RuntimeTemplatePreview-LightDenseRankingBar", sample:sample101},
  {id:"StyleTemplate-LightMultiSlicePie", previewId:"RuntimeTemplatePreview-LightMultiSlicePie", sample:sample102},
  {id:"StyleTemplate-LightDenseScatter", previewId:"RuntimeTemplatePreview-LightDenseScatter", sample:sample103},
  {id:"StyleTemplate-LightFlowSankey", previewId:"RuntimeTemplatePreview-LightFlowSankey", sample:sample104},
  {id:"StyleTemplate-LightWideComparison", previewId:"RuntimeTemplatePreview-LightWideComparison", sample:sample105},
  {id:"StyleTemplate-DarkWaterfallBridge", previewId:"RuntimeTemplatePreview-DarkWaterfallBridge", sample:sample106},
  {id:"StyleTemplate-DarkTimelineMilestones", previewId:"RuntimeTemplatePreview-DarkTimelineMilestones", sample:sample107},
  {id:"StyleTemplate-LightHeroNumber", previewId:"RuntimeTemplatePreview-LightHeroNumber", sample:sample108},
];

export const RuntimeCardsRoot: React.FC = () => <Folder name="DataMagic-Chart-and-Story-Templates">
  {cards.flatMap(card => [card.id, card.previewId].map(id => <Composition key={id} id={id} component={RuntimeCard} defaultProps={card.sample} durationInFrames={180} fps={30} width={1280} height={720}/>))}
</Folder>;
