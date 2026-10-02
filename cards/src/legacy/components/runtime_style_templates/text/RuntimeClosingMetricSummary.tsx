import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, cleanText, extractNumber, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeClosingMetricSummary: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, metrics} = contentFields(sceneContent, scene);
  const cards = metrics.slice(0, 3);
  if (!title || !cards.length) return null;

  return (
    <AbsoluteFill style={{background: '#111827', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #111827 0%, #0f172a 60%, #020617 100%)'}} />
      <EditableTransform id="runtime-closing-metric-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 78, fontSize: 54, fontWeight: 900, letterSpacing: '-0.045em', whiteSpace: 'nowrap', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      {subtitle ? (
        <div data-dm-text-editable style={{position: 'absolute', left: 100, top: 142, width: 720, fontSize: 20, lineHeight: 1.42, fontWeight: 610, color: '#94a3b8', opacity: ease(frame, [18, 46], [0, 1])}}>
          {truncate(subtitle, 128)}
        </div>
      ) : null}
      {cards.length ? (
        <div style={{position: 'absolute', left: 104, right: 104, top: 206, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20}}>
          {cards.map((card, index) => {
            const p = ease(frame, [30 + index * 8, 60 + index * 8], [0, 1]);
            const color = card.accent || ['#60a5fa', '#34d399', '#fbbf24'][index % 3];
            return (
              <div key={`${card.label}-${index}`} style={{height: 278, borderRadius: 28, background: 'rgba(255,255,255,0.075)', border: '1px solid rgba(255,255,255,0.12)', padding: 30, boxSizing: 'border-box', opacity: p, transform: `translateY(${(1 - p) * 18}px)`}}>
                <div data-dm-text-editable style={{fontSize: 74, lineHeight: 1, fontWeight: 930, letterSpacing: '-0.06em', color, marginBottom: 64}}>{truncate(card.value, 14)}</div>
                <div data-dm-text-editable style={{fontSize: 24, lineHeight: 1.16, fontWeight: 850, color: '#f8fafc'}}>{truncate(card.label, 26)}</div>
                <div style={{height: 5, borderRadius: 999, background: `linear-gradient(90deg, ${color}, rgba(255,255,255,0.12))`, marginTop: 24, width: `${72 + index * 9}%`}} />
              </div>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
