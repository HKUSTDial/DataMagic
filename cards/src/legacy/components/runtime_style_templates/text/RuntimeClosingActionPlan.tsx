import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, cleanText, extractNumber, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeClosingActionPlan: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, bullets} = contentFields(sceneContent, scene);
  const steps = (bullets.length ? bullets : subtitle ? [subtitle] : []).slice(0, 3);
  if (!title || !steps.length) return null;

  return (
    <AbsoluteFill style={{background: '#f8fafc', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#0f172a', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 58%, #e0f2fe 100%)'}} />
      <EditableTransform id="runtime-closing-action-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 94, top: 76, fontSize: 54, fontWeight: 900, letterSpacing: '-0.045em', whiteSpace: 'nowrap', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 64)}
        </div>
      </EditableTransform>
      {subtitle ? (
        <EditableTransform id="runtime-closing-action-subtitle" role="subtitle" style={{display: 'block'}}>
          <div data-dm-text-editable style={{position: 'absolute', left: 98, top: 152, width: 620, fontSize: 21, lineHeight: 1.42, fontWeight: 650, color: '#64748b', opacity: ease(frame, [18, 44], [0, 1])}}>
            {truncate(subtitle, 140)}
          </div>
        </EditableTransform>
      ) : null}
      <div style={{position: 'absolute', left: 118, right: 118, top: 264, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22}}>
        {steps.map((step, index) => {
          const p = ease(frame, [24 + index * 8, 54 + index * 8], [0, 1]);
          const color = ['#38bdf8', '#34d399', '#fbbf24'][index % 3];
          return (
            <div key={`${step}-${index}`} style={{height: 240, borderRadius: 26, background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 20px 60px rgba(15,23,42,0.12)', padding: 30, boxSizing: 'border-box', opacity: p, transform: `translateY(${(1 - p) * 18}px)`}}>
              <div style={{width: 52, height: 52, borderRadius: 16, background: color, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, marginBottom: 34}}>{index + 1}</div>
              <div data-dm-text-editable style={{fontSize: 22, fontWeight: 900, marginBottom: 14, color: '#0f172a'}}>{truncate(`Move ${index + 1}`, 22)}</div>
              <div data-dm-text-editable style={{fontSize: 20, lineHeight: 1.24, fontWeight: 760, color: '#475569'}}>{truncate(step, 86)}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
