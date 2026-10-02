import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeNarrativeQuoteLight: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, kicker} = contentFields(sceneContent, scene);
  const QUOTE_COLOR = '#dc2626';
  if (!title) return null;

  return (
    <AbsoluteFill style={{background: '#fafafa', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #ffffff 0%, #fff1f2 45%, #fafafa 100%)'}} />
      <div aria-hidden style={{position: 'absolute', left: 80, top: 124, fontSize: 220, lineHeight: 0.6, fontWeight: 900, color: QUOTE_COLOR, opacity: ease(frame, [0, 24], [0, 0.18]), pointerEvents: 'none'}}>
        "
      </div>
      <div style={{position: 'absolute', left: 96, top: 220, width: 4, height: 200 * ease(frame, [8, 34], [0, 1]), background: QUOTE_COLOR, borderRadius: 2}} />
      <EditableTransform id="runtime-quote-light-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 128, right: 96, top: 220, fontSize: title.length > 88 ? 42 : 56, lineHeight: 1.22, fontWeight: 880, letterSpacing: '-0.025em', color: '#0f172a', opacity: ease(frame, [14, 46], [0, 1])}}>
          {truncate(title, 118)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-quote-light-subtitle" role="subtitle" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 128, top: 468, fontSize: 18, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8', opacity: ease(frame, [40, 68], [0, 1])}}>
          {truncate(kicker || subtitle || '', 60)}
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
