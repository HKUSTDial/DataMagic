import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeNarrativeContextIllustrated: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, kicker} = contentFields(sceneContent, scene);
  const ACCENT = '#f59e0b';
  if (!title) return null;

  const illustrationPath = typeof (scene as any)?.illustration_image === 'string' ? (scene as any).illustration_image.trim() : '';
  const imgSrc = illustrationPath
    ? staticFile(illustrationPath)
    : staticFile('template-assets/illustrated-demos/narrative_context_illustrated.webp');

  const imgReveal = ease(frame, [16, 48], [0, 1]);
  const imgScale = 0.96 + 0.04 * imgReveal;

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f172a 0%, #111827 70%, #020617 100%)'}} />
      <div style={{position: 'absolute', left: 72, top: 130, width: 4, height: 300 * ease(frame, [0, 36], [0, 1]), background: `linear-gradient(180deg, ${ACCENT}, transparent)`, borderRadius: 2}} />
      <EditableTransform id="runtime-ctx-ill-kicker" role="kicker" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 108, top: 134, fontSize: 13, fontWeight: 800, letterSpacing: '0.22em', color: ACCENT, textTransform: 'uppercase', opacity: ease(frame, [0, 20], [0, 1])}}>
          {truncate(kicker || uiLabel(sceneContent, 'background', 'BACKGROUND'), 40)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-ctx-ill-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 108, top: 178, width: 580, fontSize: 44, lineHeight: 1.16, fontWeight: 880, letterSpacing: '-0.025em', color: '#f1f5f9', opacity: ease(frame, [8, 36], [0, 1])}}>
          {truncate(title, 80)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-ctx-ill-body" role="subtitle" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 108, top: 318, width: 560, fontSize: 20, lineHeight: 1.7, fontWeight: 400, color: '#94a3b8', opacity: ease(frame, [24, 54], [0, 1])}}>
          {truncate(subtitle || '', 140)}
        </div>
      </EditableTransform>
      <div style={{position: 'absolute', right: 80, top: 120, width: 420, height: 360, borderRadius: 24, overflow: 'hidden', opacity: imgReveal, transform: `scale(${imgScale})`, boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)', userSelect: 'none'}}>
        <Img src={imgSrc} draggable={false} style={{width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none'}} />
        <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(transparent, rgba(15,23,42,0.6))'}} />
      </div>
    </AbsoluteFill>
  );
};
