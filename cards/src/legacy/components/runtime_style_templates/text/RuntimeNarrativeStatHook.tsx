import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, cleanText, extractNumber, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeNarrativeStatHook: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, kicker, metrics} = contentFields(sceneContent, scene);
  const metric = metrics[0];
  const stat = metric?.value || extractNumber(title, subtitle);
  const label = metric?.label || kicker;
  if (!title || !stat || !label) return null;

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 42%, rgba(56,189,248,0.13), transparent 55%), linear-gradient(160deg, #0f172a 0%, #0c1a2e 100%)'}} />
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)', opacity: ease(frame, [0, 20], [0, 0.9])}} />
      <EditableTransform id="runtime-narrative-stat" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 0, right: 0, top: stat.length > 12 ? 188 : 188, textAlign: 'center', fontSize: stat.length > 12 ? 82 : 148, lineHeight: 1, fontWeight: 900, letterSpacing: '-0.04em', color: '#ffffff', opacity: ease(frame, [8, 32], [0, 1])}}>
          {truncate(stat, 22)}
        </div>
      </EditableTransform>
      <div style={{position: 'absolute', left: '50%', top: 362, transform: 'translateX(-50%)', width: 180 * ease(frame, [28, 52], [0, 1]), height: 3, background: '#38bdf8', borderRadius: 2}} />
      <EditableTransform id="runtime-narrative-stat-subtitle" role="subtitle" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 0, right: 0, top: 390, textAlign: 'center', fontSize: 24, fontWeight: 500, color: '#94a3b8', letterSpacing: '0.01em', opacity: ease(frame, [36, 62], [0, 1])}}>
          {truncate(label || title || subtitle, 82)}
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
