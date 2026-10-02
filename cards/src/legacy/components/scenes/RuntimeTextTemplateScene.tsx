import React from 'react';
import type {RuntimeStyleTemplateProps} from '../runtime_style_templates/runtimeSlots';
import {firstString} from '../runtime_style_templates/runtimeSlots';
// One template per file (see ../runtime_style_templates/text/). Imported
// individually rather than from a barrel so the backend eject step can resolve
// each style_template_id back to its own source file — see the contract note
// above RUNTIME_TEXT_TEMPLATE_ADAPTERS below.
import {RuntimeClosingActionPlan} from '../runtime_style_templates/text/RuntimeClosingActionPlan';
import {RuntimeClosingGradientSignal} from '../runtime_style_templates/text/RuntimeClosingGradientSignal';
import {RuntimeClosingKeyTakeaways} from '../runtime_style_templates/text/RuntimeClosingKeyTakeaways';
import {RuntimeClosingLightOutro} from '../runtime_style_templates/text/RuntimeClosingLightOutro';
import {RuntimeClosingMetricSummary} from '../runtime_style_templates/text/RuntimeClosingMetricSummary';
import {RuntimeClosingSimpleOutro} from '../runtime_style_templates/text/RuntimeClosingSimpleOutro';
import {RuntimeNarrativeBullets} from '../runtime_style_templates/text/RuntimeNarrativeBullets';
import {RuntimeNarrativeBulletsLight} from '../runtime_style_templates/text/RuntimeNarrativeBulletsLight';
import {RuntimeNarrativeChapterTitle} from '../runtime_style_templates/text/RuntimeNarrativeChapterTitle';
import {RuntimeNarrativeChapterTitleLight} from '../runtime_style_templates/text/RuntimeNarrativeChapterTitleLight';
import {RuntimeNarrativeContext} from '../runtime_style_templates/text/RuntimeNarrativeContext';
import {RuntimeNarrativeContextLight} from '../runtime_style_templates/text/RuntimeNarrativeContextLight';
import {RuntimeNarrativeQuestion} from '../runtime_style_templates/text/RuntimeNarrativeQuestion';
import {RuntimeNarrativeQuote} from '../runtime_style_templates/text/RuntimeNarrativeQuote';
import {RuntimeNarrativeStatHook} from '../runtime_style_templates/text/RuntimeNarrativeStatHook';
import {RuntimeNarrativeVersus} from '../runtime_style_templates/text/RuntimeNarrativeVersus';
import {RuntimeNarrativeDefinition} from '../runtime_style_templates/text/RuntimeNarrativeDefinition';
import {RuntimeNarrativeBeforeAfter} from '../runtime_style_templates/text/RuntimeNarrativeBeforeAfter';
import {RuntimeNarrativeMiniTimeline} from '../runtime_style_templates/text/RuntimeNarrativeMiniTimeline';
import {RuntimeNarrativeStatHookLight} from '../runtime_style_templates/text/RuntimeNarrativeStatHookLight';
import {RuntimeNarrativeQuoteLight} from '../runtime_style_templates/text/RuntimeNarrativeQuoteLight';
import {RuntimeNarrativeStatHookIllustrated} from '../runtime_style_templates/text/RuntimeNarrativeStatHookIllustrated';
import {RuntimeNarrativeContextIllustrated} from '../runtime_style_templates/text/RuntimeNarrativeContextIllustrated';
import {RuntimeNarrativeBulletsIllustrated} from '../runtime_style_templates/text/RuntimeNarrativeBulletsIllustrated';
import {RuntimeNarrativeQuoteIllustrated} from '../runtime_style_templates/text/RuntimeNarrativeQuoteIllustrated';
import {RuntimeNarrativeChapterTitleIllustrated} from '../runtime_style_templates/text/RuntimeNarrativeChapterTitleIllustrated';
import {RuntimeOpeningCinematicHeadline} from '../runtime_style_templates/text/RuntimeOpeningCinematicHeadline';
import {RuntimeOpeningDataGrid} from '../runtime_style_templates/text/RuntimeOpeningDataGrid';
import {RuntimeOpeningEditorialTitle} from '../runtime_style_templates/text/RuntimeOpeningEditorialTitle';
import {RuntimeOpeningExecutiveBrief} from '../runtime_style_templates/text/RuntimeOpeningExecutiveBrief';
import {RuntimeOpeningSplitMetrics} from '../runtime_style_templates/text/RuntimeOpeningSplitMetrics';

// ── Adapter map: style_template_id → runtime text component ─────────────────
// Same contract as the chart dispatcher (RuntimeStyleTemplateScene.tsx): this map
// + the per-file imports above are the source of truth the backend eject step reads
// (web/server.py: _parse_runtime_dispatcher / _eject_runtime_scene_source). Keep
// each template in its own file under runtime_style_templates/text/, with the
// signature `export const RuntimeXxx: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {`,
// importing shared helpers from './textTemplateShared'. Light/dark variants are
// each their own self-contained file (forceLight baked as a const), not thin wrappers,
// so they carry real editable code.
//
// This adapter map is also the renderable narrative set the fast-runtime flow may
// pick from: when adding/removing a template here, mirror it in
// FAST_RUNTIME_NARRATIVE_TEMPLATE_IDS (scene_builder/style_template_registry.py) so
// the Narrative Director is only offered cards the converter can render, and in
// _RUNTIME_TEXT_TEMPLATE_META (web/server.py).
const RUNTIME_TEXT_TEMPLATE_ADAPTERS: Record<string, React.FC<RuntimeStyleTemplateProps>> = {
  'StyleTemplate-OpeningExecutiveBrief': RuntimeOpeningExecutiveBrief,
  'StyleTemplate-OpeningSplitMetrics': RuntimeOpeningSplitMetrics,
  'StyleTemplate-OpeningDataGrid': RuntimeOpeningDataGrid,
  'StyleTemplate-OpeningCinematicHeadline': RuntimeOpeningCinematicHeadline,
  'StyleTemplate-OpeningEditorialTitle': RuntimeOpeningEditorialTitle,
  'StyleTemplate-NarrativeStatHook': RuntimeNarrativeStatHook,
  'StyleTemplate-NarrativeQuestion': RuntimeNarrativeQuestion,
  'StyleTemplate-NarrativeBullets': RuntimeNarrativeBullets,
  'StyleTemplate-NarrativeBulletsLight': RuntimeNarrativeBulletsLight,
  'StyleTemplate-NarrativeContext': RuntimeNarrativeContext,
  'StyleTemplate-NarrativeContextLight': RuntimeNarrativeContextLight,
  'StyleTemplate-NarrativeChapterTitle': RuntimeNarrativeChapterTitle,
  'StyleTemplate-NarrativeChapterTitleLight': RuntimeNarrativeChapterTitleLight,
  'StyleTemplate-NarrativeQuote': RuntimeNarrativeQuote,
  'StyleTemplate-NarrativeVersus': RuntimeNarrativeVersus,
  'StyleTemplate-NarrativeDefinition': RuntimeNarrativeDefinition,
  'StyleTemplate-NarrativeBeforeAfter': RuntimeNarrativeBeforeAfter,
  'StyleTemplate-NarrativeMiniTimeline': RuntimeNarrativeMiniTimeline,
  'StyleTemplate-NarrativeStatHookLight': RuntimeNarrativeStatHookLight,
  'StyleTemplate-NarrativeQuoteLight': RuntimeNarrativeQuoteLight,
  'StyleTemplate-NarrativeStatHookIllustrated': RuntimeNarrativeStatHookIllustrated,
  'StyleTemplate-NarrativeContextIllustrated': RuntimeNarrativeContextIllustrated,
  'StyleTemplate-NarrativeBulletsIllustrated': RuntimeNarrativeBulletsIllustrated,
  'StyleTemplate-NarrativeQuoteIllustrated': RuntimeNarrativeQuoteIllustrated,
  'StyleTemplate-NarrativeChapterTitleIllustrated': RuntimeNarrativeChapterTitleIllustrated,
  'StyleTemplate-ClosingSimpleOutro': RuntimeClosingSimpleOutro,
  'StyleTemplate-ClosingLightOutro': RuntimeClosingLightOutro,
  'StyleTemplate-ClosingKeyTakeaways': RuntimeClosingKeyTakeaways,
  'StyleTemplate-ClosingMetricSummary': RuntimeClosingMetricSummary,
  'StyleTemplate-ClosingActionPlan': RuntimeClosingActionPlan,
  'StyleTemplate-ClosingGradientSignal': RuntimeClosingGradientSignal,
};

const runtimeTextTemplateId = (sceneContent: any, scene?: any): string =>
  firstString(sceneContent?.style_template_id, scene?.renderer?.style_template_id, scene?.content?.style_template_id);

const fallbackTextTemplateId = (scene?: any): string => {
  const sceneType = String(scene?.type ?? '').toLowerCase();
  if (sceneType === 'opening') return 'StyleTemplate-OpeningExecutiveBrief';
  if (sceneType === 'closing') return 'StyleTemplate-ClosingSimpleOutro';
  return 'StyleTemplate-NarrativeContext';
};

export const hasRuntimeTextTemplateAdapter = (templateId: unknown): boolean =>
  typeof templateId === 'string' && Boolean(RUNTIME_TEXT_TEMPLATE_ADAPTERS[templateId]);

export const RuntimeTextTemplateScene: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const explicit = runtimeTextTemplateId(sceneContent, scene);
  const templateId = RUNTIME_TEXT_TEMPLATE_ADAPTERS[explicit] ? explicit : fallbackTextTemplateId(scene);
  const Adapter = RUNTIME_TEXT_TEMPLATE_ADAPTERS[templateId];
  return <Adapter sceneContent={sceneContent} scene={scene} />;
};
