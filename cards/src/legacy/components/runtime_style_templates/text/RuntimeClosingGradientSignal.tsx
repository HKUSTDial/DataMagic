import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, cleanText, extractNumber, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeClosingGradientSignal: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle} = contentFields(sceneContent, scene);
  const titleProgress = ease(frame, [0, 24], [0, 1]);
  const lineProgress = ease(frame, [24, 58], [0, 1]);
  if (!title) return null;

  return (
    <AbsoluteFill style={{background: '#111827', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 76% 28%, rgba(56,189,248,0.24), transparent 30%), radial-gradient(circle at 18% 78%, rgba(168,85,247,0.18), transparent 28%), linear-gradient(135deg, #111827 0%, #172033 58%, #020617 100%)'}} />
      <div style={{position: 'absolute', left: 96, top: 96, width: 170 * lineProgress, height: 4, borderRadius: 999, background: '#38bdf8'}} />
      <EditableTransform id="runtime-closing-signal-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 214, width: 760, fontSize: title.length > 72 ? 58 : 74, lineHeight: 0.95, fontWeight: 930, letterSpacing: '-0.06em', opacity: titleProgress, transform: `translateY(${(1 - titleProgress) * 18}px)`}}>
          {truncate(title, 82)}
        </div>
      </EditableTransform>
      {subtitle ? (
        <EditableTransform id="runtime-closing-signal-subtitle" role="subtitle" style={{display: 'block'}}>
          <div data-dm-text-editable style={{position: 'absolute', left: 100, top: 424, width: 620, fontSize: 23, lineHeight: 1.42, fontWeight: 620, color: 'rgba(226,232,240,0.78)', opacity: ease(frame, [18, 44], [0, 1])}}>
            {truncate(subtitle, 128)}
          </div>
        </EditableTransform>
      ) : null}
      <div style={{position: 'absolute', right: 104, bottom: 102, display: 'flex', gap: 10, opacity: lineProgress}}>
        {[0, 1, 2].map((item) => <div key={item} style={{width: 10, height: 10, borderRadius: 999, background: ['#38bdf8', '#a78bfa', '#34d399'][item]}} />)}
      </div>
    </AbsoluteFill>
  );
};
