import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, cleanText, extractNumber, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeClosingSimpleOutro: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle} = contentFields(sceneContent, scene);
  const titleProgress = ease(frame, [0, 26], [0, 1]);
  const subtitleProgress = ease(frame, [14, 42], [0, 1]);
  const lineProgress = ease(frame, [28, 58], [0, 1]);
  if (!title) return null;

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f172a 0%, #111827 54%, #020617 100%)'}} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 96, height: 1, background: 'rgba(148,163,184,0.22)', transform: `scaleX(${lineProgress})`, transformOrigin: 'left center'}} />
      <EditableTransform id="runtime-closing-simple-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 214, width: 760, fontSize: title.length > 66 ? 56 : 72, lineHeight: 0.94, fontWeight: 920, letterSpacing: '-0.055em', opacity: titleProgress, transform: `translateY(${(1 - titleProgress) * 18}px)`}}>
          {truncate(title, 76)}
        </div>
      </EditableTransform>
      {subtitle ? (
        <EditableTransform id="runtime-closing-simple-subtitle" role="subtitle" style={{display: 'block'}}>
          <div data-dm-text-editable style={{position: 'absolute', left: 100, top: 396, width: 610, fontSize: 23, lineHeight: 1.42, fontWeight: 620, color: 'rgba(226,232,240,0.78)', opacity: subtitleProgress, transform: `translateY(${(1 - subtitleProgress) * 12}px)`}}>
            {truncate(subtitle, 140)}
          </div>
        </EditableTransform>
      ) : null}
      <div style={{position: 'absolute', right: 104, bottom: 102, display: 'flex', alignItems: 'center', gap: 14, opacity: lineProgress}}>
        <div style={{width: 44, height: 3, borderRadius: 999, background: '#38bdf8'}} />
        <div style={{fontSize: 13, fontWeight: 850, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.7)'}}>DataMagic</div>
      </div>
    </AbsoluteFill>
  );
};
