import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, cleanText, extractNumber, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeNarrativeQuote: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, kicker} = contentFields(sceneContent, scene);
  if (!title) return null;

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f172a 0%, #111827 60%, #020617 100%)'}} />
      <div aria-hidden style={{position: 'absolute', left: 80, top: 124, fontSize: 220, lineHeight: 0.6, fontWeight: 900, color: '#fb7185', opacity: ease(frame, [0, 24], [0, 1]), pointerEvents: 'none'}}>
        “
      </div>
      <EditableTransform id="runtime-narrative-quote-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, right: 96, top: 252, textAlign: 'center', fontSize: title.length > 88 ? 42 : 60, lineHeight: 1.22, fontWeight: 880, letterSpacing: '-0.025em', color: '#ffffff', opacity: ease(frame, [14, 46], [0, 1])}}>
          {truncate(title, 118)}
        </div>
      </EditableTransform>
      <div aria-hidden style={{position: 'absolute', right: 80, top: 380, fontSize: 220, lineHeight: 0.2, fontWeight: 900, color: '#fb7185', opacity: ease(frame, [18, 42], [0, 1]), pointerEvents: 'none'}}>
        ”
      </div>
      <EditableTransform id="runtime-narrative-quote-subtitle" role="subtitle" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 0, right: 0, top: 458, textAlign: 'center', fontSize: 18, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#94a3b8', opacity: ease(frame, [40, 68], [0, 1])}}>
          {truncate(kicker || subtitle || uiLabel(sceneContent, 'from_the_analysis', 'From the analysis'), 60)}
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
