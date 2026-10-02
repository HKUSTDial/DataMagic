import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeNarrativeDefinition: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, kicker} = contentFields(sceneContent, scene);
  const ACCENT = '#f59e0b';
  if (!title || !subtitle) return null;

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(150deg, #0f172a 0%, #0c1a2e 60%, #020617 100%)'}} />
      <EditableTransform id="runtime-def-kicker" role="kicker" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 100, fontSize: 13, fontWeight: 800, letterSpacing: '0.24em', color: ACCENT, textTransform: 'uppercase', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(kicker || uiLabel(sceneContent, 'term', 'TERM'), 24)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-def-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 148, width: 960, fontSize: title.length > 12 ? 56 : 72, lineHeight: 1.08, fontWeight: 900, letterSpacing: '-0.035em', color: '#f8fafc', opacity: ease(frame, [8, 32], [0, 1])}}>
          {truncate(title, 48)}
        </div>
      </EditableTransform>
      <div style={{position: 'absolute', left: 96, top: 248, width: 240 * ease(frame, [22, 44], [0, 1]), height: 2, background: ACCENT, opacity: 0.8, borderRadius: 1}} />
      <EditableTransform id="runtime-def-body" role="subtitle" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 278, width: 960, fontSize: 22, lineHeight: 1.7, fontWeight: 400, color: '#94a3b8', opacity: ease(frame, [30, 58], [0, 1])}}>
          {truncate(subtitle, 200)}
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
