import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeNarrativeQuoteIllustrated: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, kicker} = contentFields(sceneContent, scene);
  const ACCENT = '#fb7185';
  if (!title) return null;

  const illustrationPath = typeof (scene as any)?.illustration_image === 'string' ? (scene as any).illustration_image.trim() : '';
  const imgSrc = illustrationPath
    ? staticFile(illustrationPath)
    : staticFile('template-assets/illustrated-demos/narrative_quote_illustrated.webp');

  const imgReveal = ease(frame, [0, 28], [0, 1]);
  const quoteReveal = ease(frame, [16, 48], [0, 1]);

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f172a 0%, #111827 60%, #020617 100%)'}} />
      <div style={{position: 'absolute', left: 110, top: 190, width: 300, height: 300, borderRadius: '50%', overflow: 'hidden', opacity: imgReveal, transform: `scale(${0.9 + 0.1 * imgReveal})`, boxShadow: `0 0 60px rgba(251,113,133,${0.18 * imgReveal}), 0 20px 50px rgba(0,0,0,0.5)`, border: `2px solid rgba(251,113,133,${0.25 * imgReveal})`, userSelect: 'none'}}>
        <Img src={imgSrc} draggable={false} style={{width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none'}} />
      </div>
      <div aria-hidden style={{position: 'absolute', left: 500, top: 148, fontSize: 160, lineHeight: 0.6, fontWeight: 900, color: ACCENT, opacity: ease(frame, [4, 28], [0, 1]), pointerEvents: 'none'}}>"</div>
      <EditableTransform id="runtime-quote-ill-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 510, top: 236, width: 650, fontSize: 44, lineHeight: 1.28, fontWeight: 880, letterSpacing: '-0.02em', color: '#f1f5f9', opacity: quoteReveal}}>
          {truncate(title, 100)}
        </div>
      </EditableTransform>
      <div style={{position: 'absolute', left: 510, top: 418, width: 120 * ease(frame, [32, 54], [0, 1]), height: 2, background: ACCENT, opacity: 0.7, borderRadius: 1}} />
      <EditableTransform id="runtime-quote-ill-subtitle" role="subtitle" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 510, top: 428, width: 600, fontSize: 16, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b', opacity: ease(frame, [42, 68], [0, 1])}}>
          {truncate(kicker || subtitle || '', 60)}
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
