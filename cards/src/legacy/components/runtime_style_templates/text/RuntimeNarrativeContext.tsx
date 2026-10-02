import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, cleanText, extractNumber, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeNarrativeContext: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const forceLight = false;
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, kicker} = contentFields(sceneContent, scene);
  const accent = forceLight ? '#d97706' : '#f59e0b';
  if (!title) return null;

  return (
    <AbsoluteFill style={{background: forceLight ? '#fffbeb' : '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: forceLight ? '#0f172a' : '#ffffff', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: forceLight ? 'linear-gradient(145deg, #ffffff 0%, #fffbeb 55%, #fef3c7 100%)' : 'linear-gradient(135deg, #0f172a 0%, #111827 70%, #020617 100%)'}} />
      <div style={{position: 'absolute', left: 72, top: 148, width: 4, height: (forceLight ? 300 : 280) * ease(frame, [0, 36], [0, 1]), background: forceLight ? `linear-gradient(180deg, ${accent}, rgba(217,119,6,0.1))` : `linear-gradient(180deg, ${accent}, transparent)`, borderRadius: 2}} />
      <EditableTransform id="runtime-narrative-context-label" role="kicker" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 108, top: 152, fontSize: 14, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, opacity: ease(frame, [0, 20], [0, 1])}}>
          {truncate(kicker || uiLabel(sceneContent, 'background', 'BACKGROUND'), 32)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-narrative-context-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 108, top: 202, width: 900, fontSize: title.length > 78 ? 44 : 54, lineHeight: 1.14, fontWeight: 880, letterSpacing: '-0.025em', color: forceLight ? '#0f172a' : '#f1f5f9', opacity: ease(frame, [12, 40], [0, 1])}}>
          {truncate(title, 92)}
        </div>
      </EditableTransform>
      {subtitle ? (
        <EditableTransform id="runtime-narrative-context-body" role="subtitle" style={{display: 'block'}}>
          <div data-dm-text-editable style={{position: 'absolute', left: 108, top: forceLight ? 348 : 330, width: 860, fontSize: 22, lineHeight: 1.65, fontWeight: 400, color: forceLight ? '#475569' : '#94a3b8', opacity: ease(frame, [28, 58], [0, 1])}}>
            {truncate(subtitle, 190)}
          </div>
        </EditableTransform>
      ) : null}
    </AbsoluteFill>
  );
};
