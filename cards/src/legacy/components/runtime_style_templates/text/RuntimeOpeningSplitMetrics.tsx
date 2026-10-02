import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, cleanText, extractNumber, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeOpeningSplitMetrics: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, kicker, metrics} = contentFields(sceneContent, scene);
  const shownMetrics = metrics.slice(0, 2);
  const divider = ease(frame, [12, 42], [0, 1]);
  if (!title) return null;

  return (
    <AbsoluteFill style={{background: '#f7f6fb', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#1f2937', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.92), transparent 32%), radial-gradient(circle at 82% 78%, rgba(99,102,241,0.10), transparent 26%)'}} />
      <div style={{position: 'absolute', left: 640, top: 110, width: 1, height: 350 * divider, background: 'linear-gradient(180deg, rgba(31,41,55,0.18), rgba(31,41,55,0.04))'}} />
      <EditableTransform id="runtime-opening-split-kicker" role="subtitle" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 132, fontSize: 13, fontWeight: 880, letterSpacing: '0.22em', color: '#2563eb', textTransform: 'uppercase', opacity: ease(frame, [0, 16], [0, 1])}}>
          {truncate(kicker || uiLabel(sceneContent, 'quarterly_briefing', 'Quarterly Briefing'), 32)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-opening-split-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 174, width: 480, fontSize: title.length > 60 ? 48 : 56, lineHeight: 1.02, fontWeight: 900, letterSpacing: '-0.05em', color: '#1f2937', opacity: ease(frame, [6, 32], [0, 1]), transform: `translateY(${(1 - ease(frame, [6, 32], [0, 1])) * 14}px)`}}>
          {truncate(title, 62)}
        </div>
      </EditableTransform>
      {subtitle ? (
        <EditableTransform id="runtime-opening-split-subtitle" role="subtitle" style={{display: 'block'}}>
          <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 350, width: 460, fontSize: 19, lineHeight: 1.5, fontWeight: 620, color: '#64748b', opacity: ease(frame, [28, 56], [0, 1])}}>
            {truncate(subtitle, 130)}
          </div>
        </EditableTransform>
      ) : null}
      {shownMetrics.length ? (
        <div style={{position: 'absolute', left: 720, top: 154, width: 460, display: 'flex', flexDirection: 'column', gap: 36}}>
          {shownMetrics.map((metric, index) => {
            const p = ease(frame, [22 + index * 10, 54 + index * 10], [0, 1]);
            const accent = metric.accent || ['#2563eb', '#10b981'][index % 2];
            return (
              <div key={`${metric.label}-${index}`} style={{opacity: p, transform: `translateX(${(1 - p) * 18}px)`}}>
                <div data-dm-text-editable style={{fontSize: 78, lineHeight: 1, fontWeight: 920, letterSpacing: '-0.06em', color: accent}}>{truncate(metric.value, 12)}</div>
                <div data-dm-text-editable style={{marginTop: 10, fontSize: 13, fontWeight: 840, letterSpacing: '0.18em', color: '#64748b', textTransform: 'uppercase'}}>{truncate(metric.label, 28)}</div>
                <div style={{marginTop: 14, width: `${56 + index * 22}%`, height: 3, borderRadius: 999, background: `linear-gradient(90deg, ${accent}, ${accent}33)`, opacity: ease(frame, [30 + index * 8, 60 + index * 8], [0, 1])}} />
              </div>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
