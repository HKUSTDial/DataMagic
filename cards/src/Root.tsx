import React from 'react';
import {PresenterDataTakeover,type PresenterDataTakeoverProps} from '../templates/presenter-data-takeover/PresenterDataTakeover';
import presenterTakeoverSample from '../templates/presenter-data-takeover/sample-data.json';
import {ContrastContributionStory} from '../templates/contrast-contribution-story/ContrastContributionStory';
import contributionStorySample from '../templates/contrast-contribution-story/sample-data.json';
import {PersistentTierBoard} from '../templates/persistent-tier-board/PersistentTierBoard';
import tierBoardSample from '../templates/persistent-tier-board/sample-data.json';
import {CharacterPerspectiveBoard, type CharacterPerspectiveBoardProps} from '../templates/character-perspective-board/CharacterPerspectiveBoard';
import characterPerspectiveSample from '../templates/character-perspective-board/sample-data.json';
import characterPerspectiveAlternate from '../templates/character-perspective-board/alternate-data.json';
import {PresenterEvidenceBoard, type PresenterEvidenceBoardProps} from '../templates/presenter-evidence-board/PresenterEvidenceBoard';
import presenterEvidence from '../templates/presenter-evidence-board/sample-data.json';
import {FootageEvidenceReveal} from '../templates/footage-evidence-reveal/FootageEvidenceReveal';
import footageEvidence from '../templates/footage-evidence-reveal/sample-data.json';
import {RankedReveal} from '../templates/ranked-reveal/RankedReveal';
import rankedReveal from '../templates/ranked-reveal/sample-data.json';
import {PortraitRankedReveal} from '../templates/portrait-ranked-reveal/PortraitRankedReveal';
import portraitRankedReveal from '../templates/portrait-ranked-reveal/sample-data.json';
import {Composition, Folder} from 'remotion';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/noto-sans-sc/400.css';
import '@fontsource/noto-sans-sc/700.css';
import {BarChartRace} from '../templates/bar-chart-race/BarChartRace';
import sampleData from '../templates/bar-chart-race/sample-data.json';
import {EditorialLedgerRace} from '../templates/editorial-ledger-race/EditorialLedgerRace';
import editorialLedgerRaceSample from '../templates/editorial-ledger-race/sample-data.json';
import {CinematicTrackRace} from '../templates/cinematic-track-race/CinematicTrackRace';
import cinematicTrackRaceSample from '../templates/cinematic-track-race/sample-data.json';
import {SpatialPercentOverlay} from '../templates/spatial-percent-overlay/SpatialPercentOverlay';
import spatialPercentSample from '../templates/spatial-percent-overlay/sample-data.json';
import {BumpChartStory} from '../templates/bump-chart-story/BumpChartStory';
import bumpChartSample from '../templates/bump-chart-story/sample-data.json';
import {DataMagnifierLens} from '../templates/data-magnifier-lens/DataMagnifierLens';
import dataMagnifierSample from '../templates/data-magnifier-lens/sample-data.json';
import {SourceToInsight} from '../templates/source-to-insight/SourceToInsight';
import sourceToInsightSample from '../templates/source-to-insight/sample-data.json';
import {ChoroplethRankMap} from '../templates/choropleth-rank-map/ChoroplethRankMap';
import choroplethRankMapSample from '../templates/choropleth-rank-map/sample-data.json';
import {MapRouteAccumulation, type MapRouteAccumulationProps} from '../templates/map-route-accumulation/MapRouteAccumulation';
import mapRouteAccumulationSample from '../templates/map-route-accumulation/sample-data.json';
import {ChartFocusPush} from '../templates/chart-focus-push/ChartFocusPush';
import chartFocusPushSample from '../templates/chart-focus-push/sample-data.json';
import {ChartTimelineTravel, type ChartTimelineTravelProps} from '../templates/chart-timeline-travel/ChartTimelineTravel';
import chartTimelineTravelSample from '../templates/chart-timeline-travel/sample-data.json';
import {CraneRiseDashboard} from '../templates/crane-rise-dashboard/CraneRiseDashboard';
import craneRiseSample from '../templates/crane-rise-dashboard/sample-data.json';
import {ParallaxMapGlide, type ParallaxMapGlideProps} from '../templates/parallax-map-glide/ParallaxMapGlide';
import parallaxMapSample from '../templates/parallax-map-glide/sample-data.json';
import {PullBackIsolation} from '../templates/pull-back-isolation/PullBackIsolation';
import pullBackSample from '../templates/pull-back-isolation/sample-data.json';
import {SplitContextComparison, type SplitContextComparisonProps} from '../templates/split-context-comparison/SplitContextComparison';
import splitContextSample from '../templates/split-context-comparison/sample-data.json';
import {NegativeSpaceChartDock} from '../templates/negative-space-chart-dock/NegativeSpaceChartDock';
import negativeSpaceSample from '../templates/negative-space-chart-dock/sample-data.json';
import {SourceToReconstruction} from '../templates/source-to-reconstruction/SourceToReconstruction';
import sourceReconstructionSample from '../templates/source-to-reconstruction/sample-data.json';
import {PresenterChartStage, type PresenterChartStageProps} from '../templates/presenter-chart-stage/PresenterChartStage';
import presenterStageSample from '../templates/presenter-chart-stage/sample-data.json';
import {SharedDataElementTransition} from '../templates/shared-data-element-transition/SharedDataElementTransition';
import sharedElementSample from '../templates/shared-data-element-transition/sample-data.json';
import {StorySequenceGenerator, type StorySequenceGeneratorProps} from '../templates/story-sequence-generator/StorySequenceGenerator';
import storySequenceSample from '../templates/story-sequence-generator/sample-data.json';
import {VideoDataOverlay, type VideoDataOverlayProps} from '../templates/video-data-overlay/VideoDataOverlay';
import videoMetricOverlaySample from '../templates/video-data-overlay/negative-space-data.json';
import trackedVideoCalloutSample from '../templates/video-data-overlay/tracked-callout-data.json';

export const ShotCraftRoot: React.FC = () => (
  <Folder name="Advanced-Data-Visuals">
    <Composition id="ShotCraft-PresenterDataTakeover" component={PresenterDataTakeover} durationInFrames={360} fps={30} width={1920} height={1080} defaultProps={presenterTakeoverSample as PresenterDataTakeoverProps}/>
    <Composition id="ShotCraft-ContrastContributionStory" component={ContrastContributionStory} durationInFrames={360} fps={30} width={1920} height={1080} defaultProps={contributionStorySample}/>
    <Composition id="ShotCraft-PersistentTierBoard" component={PersistentTierBoard} durationInFrames={360} fps={30} width={1920} height={1080} defaultProps={tierBoardSample}/>
    <Composition id="ShotCraft-CharacterPerspectiveBoard" component={CharacterPerspectiveBoard} durationInFrames={420} fps={30} width={1920} height={1080} defaultProps={characterPerspectiveSample as CharacterPerspectiveBoardProps} />
    <Composition id="CharacterPerspectiveBoard-Alternate" component={CharacterPerspectiveBoard} durationInFrames={420} fps={30} width={1920} height={1080} defaultProps={characterPerspectiveAlternate as CharacterPerspectiveBoardProps} />
    <Composition id="ShotCraft-PortraitRankedReveal" component={PortraitRankedReveal} defaultProps={portraitRankedReveal} durationInFrames={300} fps={30} width={1080} height={1920} />
    <Composition id="ShotCraft-PresenterEvidenceBoard" component={PresenterEvidenceBoard} defaultProps={presenterEvidence as PresenterEvidenceBoardProps} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="ShotCraft-FootageEvidenceReveal" component={FootageEvidenceReveal} defaultProps={footageEvidence} durationInFrames={240} fps={30} width={1920} height={1080} />
    <Composition id="ShotCraft-RankedReveal" component={RankedReveal} defaultProps={rankedReveal} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition
      id="ShotCraft-BarChartRace"
      component={BarChartRace}
      durationInFrames={360}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={sampleData}
    />
    <Composition
      id="ShotCraft-EditorialLedgerRace"
      component={EditorialLedgerRace}
      durationInFrames={330}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={editorialLedgerRaceSample}
    />
    <Composition
      id="ShotCraft-CinematicTrackRace"
      component={CinematicTrackRace}
      durationInFrames={330}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={cinematicTrackRaceSample}
    />
    <Composition
      id="ShotCraft-SpatialPercentOverlay"
      component={SpatialPercentOverlay}
      durationInFrames={240}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={spatialPercentSample}
    />
    <Composition
      id="ShotCraft-BumpChartStory"
      component={BumpChartStory}
      durationInFrames={240}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={bumpChartSample}
    />
    <Composition
      id="ShotCraft-DataMagnifierLens"
      component={DataMagnifierLens}
      durationInFrames={240}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={dataMagnifierSample}
    />
    <Composition
      id="ShotCraft-SourceToInsight"
      component={SourceToInsight}
      durationInFrames={240}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={sourceToInsightSample}
    />
    <Composition
      id="ShotCraft-ChoroplethRankMap"
      component={ChoroplethRankMap}
      durationInFrames={270}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={choroplethRankMapSample}
    />
    <Composition
      id="ShotCraft-MapRouteAccumulation"
      component={MapRouteAccumulation}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={mapRouteAccumulationSample as MapRouteAccumulationProps}
    />
    <Composition
      id="ShotCraft-ChartFocusPush"
      component={ChartFocusPush}
      durationInFrames={240}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={chartFocusPushSample}
    />
    <Composition
      id="ShotCraft-ChartTimelineTravel"
      component={ChartTimelineTravel}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={chartTimelineTravelSample as ChartTimelineTravelProps}
    />
    <Composition id="ShotCraft-CraneRiseDashboard" component={CraneRiseDashboard} durationInFrames={240} fps={30} width={1920} height={1080} defaultProps={craneRiseSample} />
    <Composition id="ShotCraft-ParallaxMapGlide" component={ParallaxMapGlide} durationInFrames={240} fps={30} width={1920} height={1080} defaultProps={parallaxMapSample as ParallaxMapGlideProps} />
    <Composition id="ShotCraft-PullBackIsolation" component={PullBackIsolation} durationInFrames={240} fps={30} width={1920} height={1080} defaultProps={pullBackSample} />
    <Composition id="ShotCraft-SplitContextComparison" component={SplitContextComparison} durationInFrames={240} fps={30} width={1920} height={1080} defaultProps={splitContextSample as SplitContextComparisonProps} />
    <Composition id="ShotCraft-NegativeSpaceChartDock" component={NegativeSpaceChartDock} durationInFrames={240} fps={30} width={1920} height={1080} defaultProps={negativeSpaceSample} />
    <Composition id="ShotCraft-SourceToReconstruction" component={SourceToReconstruction} durationInFrames={240} fps={30} width={1920} height={1080} defaultProps={sourceReconstructionSample} />
    <Composition id="ShotCraft-PresenterChartStage" component={PresenterChartStage} durationInFrames={240} fps={30} width={1920} height={1080} defaultProps={presenterStageSample as PresenterChartStageProps} />
    <Composition id="ShotCraft-SharedDataElementTransition" component={SharedDataElementTransition} durationInFrames={240} fps={30} width={1920} height={1080} defaultProps={sharedElementSample} />
    <Composition id="ShotCraft-StorySequenceGenerator" component={StorySequenceGenerator} durationInFrames={360} fps={30} width={1920} height={1080} defaultProps={storySequenceSample as StorySequenceGeneratorProps} />
    <Composition id="ShotCraft-VideoMetricOverlay" component={VideoDataOverlay} durationInFrames={240} fps={30} width={1920} height={1080} defaultProps={videoMetricOverlaySample as VideoDataOverlayProps} />
    <Composition id="ShotCraft-TrackedVideoCallout" component={VideoDataOverlay} durationInFrames={240} fps={30} width={1920} height={1080} defaultProps={trackedVideoCalloutSample as VideoDataOverlayProps} />
  </Folder>
);
