import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, cleanText, extractNumber, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeOpeningExecutiveBrief: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, kicker, metrics} = contentFields(sceneContent, scene);
  const shownMetrics = metrics.slice(0, 3);
  if (!title) return null;

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#f8fafc', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f172a 0%, #111827 48%, #172554 100%)'}} />
      <div style={{position: 'absolute', left: 74, top: 70, width: 112, height: 112, borderRadius: 28, background: 'rgba(59,130,246,0.16)', border: '1px solid rgba(147,197,253,0.18)'}} />
      <div style={{position: 'absolute', right: 98, top: 92, width: 320, height: 320, borderRadius: 999, border: '1px solid rgba(148,163,184,0.22)', opacity: 0.7}} />
      <div style={{position: 'absolute', right: 164, top: 158, width: 188, height: 188, borderRadius: 999, border: '1px solid rgba(56,189,248,0.28)', opacity: 0.8}} />
      <EditableTransform id="runtime-opening-exec-kicker" role="subtitle" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 108, top: 132, fontSize: 15, fontWeight: 860, letterSpacing: '0.18em', color: '#38bdf8', opacity: ease(frame, [0, 20], [0, 1])}}>
          {truncate(kicker || uiLabel(sceneContent, 'executive_snapshot', 'EXECUTIVE SNAPSHOT'), 28)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-opening-exec-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 104, top: 184, width: 760, fontSize: title.length > 70 ? 58 : 72, lineHeight: 1.02, fontWeight: 900, letterSpacing: '-0.055em', opacity: ease(frame, [10, 42], [0, 1]), transform: `translateY(${(1 - ease(frame, [10, 42], [0, 1])) * 18}px)`}}>
          {truncate(title, 72)}
        </div>
      </EditableTransform>
      {subtitle ? (
        <EditableTransform id="runtime-opening-exec-subtitle" role="subtitle" style={{display: 'block'}}>
          <div data-dm-text-editable style={{position: 'absolute', left: 108, top: 358, width: 760, fontSize: 21, lineHeight: 1.38, fontWeight: 650, color: 'rgba(226,232,240,0.72)', opacity: ease(frame, [34, 64], [0, 1])}}>
            {truncate(subtitle, 150)}
          </div>
        </EditableTransform>
      ) : null}
      {shownMetrics.length ? (
        <div style={{position: 'absolute', left: 108, right: 108, top: 422, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16}}>
          {shownMetrics.map((metric, index) => {
            const p = ease(frame, [42 + index * 7, 72 + index * 7], [0, 1]);
            return (
              <div key={`${metric.label}-${index}`} style={{height: 80, borderRadius: 20, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', padding: '16px 20px', boxSizing: 'border-box', opacity: p, transform: `translateY(${(1 - p) * 14}px)`}}>
                <div data-dm-text-editable style={{fontSize: 28, lineHeight: 1, fontWeight: 900, color: metric.accent || ['#38bdf8', '#34d399', '#fbbf24'][index % 3]}}>{truncate(metric.value, 12)}</div>
                <div data-dm-text-editable style={{marginTop: 6, fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', color: 'rgba(226,232,240,0.62)', textTransform: 'uppercase'}}>{truncate(metric.label, 22)}</div>
              </div>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
