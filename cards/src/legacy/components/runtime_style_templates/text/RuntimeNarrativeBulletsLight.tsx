import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, cleanText, extractNumber, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeNarrativeBulletsLight: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const forceLight = true;
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, kicker, bullets} = contentFields(sceneContent, scene);
  const shown = (bullets.length ? bullets : [subtitle || title]).filter(Boolean).slice(0, 3);
  const accent = forceLight ? '#059669' : '#34d399';
  if (!title || !shown.length) return null;

  return (
    <AbsoluteFill style={{background: forceLight ? '#f8fafc' : '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: forceLight ? '#0f172a' : '#ffffff', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: forceLight ? 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 50%, #f8fafc 100%)' : 'linear-gradient(150deg, #0f172a 0%, #0c1a2e 60%, #020617 100%)'}} />
      {forceLight ? (
        <div style={{position: 'absolute', left: 72, top: 96, width: 4, height: 380 * ease(frame, [0, 40], [0, 1]), background: `linear-gradient(180deg, ${accent}, rgba(5,150,105,0.1))`, borderRadius: 2}} />
      ) : null}
      <div data-dm-text-editable style={{position: 'absolute', left: forceLight ? 108 : 96, top: 100, fontSize: 14, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, opacity: ease(frame, [0, 18], [0, 1])}}>
        {truncate(kicker || uiLabel(sceneContent, 'key_takeaways', 'KEY TAKEAWAYS'), 28)}
      </div>
      <EditableTransform id="runtime-narrative-bullets-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: forceLight ? 108 : 96, top: 148, width: 900, fontSize: title.length > 70 ? 40 : 46, lineHeight: 1.16, fontWeight: 880, letterSpacing: '-0.025em', color: forceLight ? '#0f172a' : '#f1f5f9', opacity: ease(frame, [8, 32], [0, 1])}}>
          {truncate(title, 84)}
        </div>
      </EditableTransform>
      <div style={{position: 'absolute', left: forceLight ? 108 : 96, top: 234, width: 200 * ease(frame, [24, 44], [0, 1]), height: 2, background: accent, opacity: forceLight ? 0.6 : 0.7, borderRadius: 1}} />
      <div style={{position: 'absolute', left: forceLight ? 108 : 96, right: 96, top: 266}}>
        {shown.map((item, index) => {
          const p = ease(frame, [32 + index * 12, 56 + index * 12], [0, 1]);
          return (
            <div key={`${item}-${index}`} style={{position: 'absolute', left: 0, top: index * 72, right: 0, display: 'flex', alignItems: 'flex-start', gap: 16, opacity: p}}>
              <div style={{width: 8, height: 8, borderRadius: '50%', background: accent, flexShrink: 0, marginTop: 9}} />
              <div data-dm-text-editable style={{fontSize: 22, lineHeight: 1.55, fontWeight: 450, color: forceLight ? '#334155' : '#cbd5e1'}}>{truncate(item, 120)}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
