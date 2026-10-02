import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, cleanText, extractNumber, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeOpeningCinematicHeadline: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, kicker} = contentFields(sceneContent, scene);
  const lineProgress = ease(frame, [10, 48], [0, 1]);
  const lineProgress2 = ease(frame, [22, 58], [0, 1]);
  if (!title) return null;

  return (
    <AbsoluteFill style={{background: '#05070d', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#f5f7fa', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 18%, rgba(244,114,182,0.12), transparent 28%), radial-gradient(circle at 18% 82%, rgba(56,189,248,0.10), transparent 26%), linear-gradient(135deg, #05070d 0%, #0c1224 60%, #03050b 100%)'}} />
      <div style={{position: 'absolute', left: 96, top: 96, width: 1088 * lineProgress, height: 1, background: 'linear-gradient(90deg, rgba(245,247,250,0.5), rgba(245,247,250,0.06))'}} />
      {kicker ? (
        <EditableTransform id="runtime-opening-cinematic-kicker" role="subtitle" style={{display: 'block'}}>
          <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 116, fontSize: 13, fontWeight: 860, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,247,250,0.76)', opacity: ease(frame, [16, 36], [0, 1])}}>
            {truncate(kicker, 34)}
          </div>
        </EditableTransform>
      ) : null}
      <EditableTransform id="runtime-opening-cinematic-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 226, width: 1088, fontSize: title.length > 76 ? 76 : 96, lineHeight: 0.96, fontWeight: 920, letterSpacing: '-0.07em', color: '#f5f7fa', opacity: ease(frame, [12, 48], [0, 1]), transform: `translateY(${(1 - ease(frame, [12, 48], [0, 1])) * 22}px)`}}>
          {truncate(title, 76)}
        </div>
      </EditableTransform>
      <div style={{position: 'absolute', left: 96, top: 412, width: 220 * lineProgress2, height: 3, borderRadius: 999, background: 'linear-gradient(90deg, #f472b6, #38bdf8)'}} />
      {subtitle ? (
        <EditableTransform id="runtime-opening-cinematic-subtitle" role="subtitle" style={{display: 'block'}}>
          <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 436, width: 720, fontSize: 22, lineHeight: 1.42, fontWeight: 620, color: 'rgba(245,247,250,0.66)', opacity: ease(frame, [40, 68], [0, 1])}}>
            {truncate(subtitle, 136)}
          </div>
        </EditableTransform>
      ) : null}
      <div style={{position: 'absolute', left: 96, top: 506, width: 1088 * ease(frame, [44, 76], [0, 1]), height: 1, background: 'linear-gradient(90deg, rgba(245,247,250,0.06), rgba(245,247,250,0.5), rgba(245,247,250,0.06))'}} />
    </AbsoluteFill>
  );
};
