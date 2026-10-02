import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {firstString, truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, contentFields, animationFrame, extractNumber, metricItems} from './textTemplateShared';

export const RuntimeNarrativeStatHookIllustrated: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, kicker, metrics} = contentFields(sceneContent, scene);
  const ACCENT = '#38bdf8';

  const metric = metricItems(metrics)[0];
  const metricValue = metric?.value == null ? '' : String(metric.value);
  const stat = firstString(sceneContent?.stat, sceneContent?.metric, metricValue, extractNumber(title, subtitle), '241K');
  const label = firstString(metric?.label, kicker, title, subtitle, uiLabel(sceneContent, 'revenue_momentum', 'Revenue momentum'));

  const illustrationPath = typeof (scene as any)?.illustration_image === 'string' ? (scene as any).illustration_image.trim() : '';
  const imgSrc = illustrationPath
    ? staticFile(illustrationPath)
    : staticFile('template-assets/illustrated-demos/narrative_stathook_illustrated.webp');

  const imgReveal = ease(frame, [0, 28], [0, 1]);
  const statReveal = ease(frame, [14, 40], [0, 1]);
  const subtitleReveal = ease(frame, [36, 62], [0, 1]);

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 35% 40%, rgba(56,189,248,0.10), transparent 50%), linear-gradient(160deg, #0f172a 0%, #0c1a2e 100%)'}} />
      <div style={{position: 'absolute', left: 120, top: 130, width: 320, height: 320, borderRadius: '50%', overflow: 'hidden', opacity: imgReveal, transform: `scale(${0.9 + 0.1 * imgReveal})`, boxShadow: `0 0 60px rgba(56,189,248,${0.2 * imgReveal}), 0 20px 50px rgba(0,0,0,0.5)`, border: `2px solid rgba(56,189,248,${0.3 * imgReveal})`, userSelect: 'none'}}>
        <Img src={imgSrc} draggable={false} style={{width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none'}} />
      </div>
      <EditableTransform id="runtime-stathook-ill-stat" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 560, top: 190, width: 600, fontSize: 128, lineHeight: 1, fontWeight: 900, letterSpacing: 0, color: '#ffffff', opacity: statReveal, transform: `translateX(${(1 - statReveal) * 20}px)`}}>
          {truncate(stat, 16)}
        </div>
      </EditableTransform>
      <div style={{position: 'absolute', left: 564, top: 340, width: 140 * ease(frame, [28, 50], [0, 1]), height: 3, background: ACCENT, borderRadius: 2}} />
      <EditableTransform id="runtime-stathook-ill-subtitle" role="subtitle" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 564, top: 366, width: 540, fontSize: 22, fontWeight: 500, color: '#94a3b8', letterSpacing: 0, lineHeight: 1.5, opacity: subtitleReveal}}>
          {truncate(label, 80)}
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
