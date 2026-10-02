import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, extractNumber, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeNarrativeStatHookLight: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, kicker, metrics} = contentFields(sceneContent, scene);
  const ACCENT = '#2563eb';
  const metric = metrics[0];
  const stat = metric?.value || extractNumber(title, subtitle);
  const label = metric?.label || kicker || title || subtitle;
  if (!stat) return null;

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #ffffff 0%, #eff6ff 50%, #f8fafc 100%)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 42%, rgba(37,99,235,0.07), transparent 55%)'}} />
      <EditableTransform id="runtime-stathook-light-stat" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 0, right: 0, top: 188, textAlign: 'center', fontSize: stat.length > 12 ? 82 : 148, lineHeight: 1, fontWeight: 900, letterSpacing: '-0.04em', color: '#0f172a', opacity: ease(frame, [8, 32], [0, 1])}}>
          {truncate(stat, 22)}
        </div>
      </EditableTransform>
      <div style={{position: 'absolute', left: '50%', top: 362, transform: 'translateX(-50%)', width: 180 * ease(frame, [28, 52], [0, 1]), height: 4, background: ACCENT, borderRadius: 2}} />
      <EditableTransform id="runtime-stathook-light-subtitle" role="subtitle" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 0, right: 0, top: 392, textAlign: 'center', fontSize: 24, fontWeight: 500, color: '#475569', letterSpacing: '0.01em', opacity: ease(frame, [36, 62], [0, 1])}}>
          {truncate(label, 82)}
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
