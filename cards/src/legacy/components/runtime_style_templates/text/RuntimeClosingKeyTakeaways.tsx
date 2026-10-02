import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, cleanText, extractNumber, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeClosingKeyTakeaways: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, bullets} = contentFields(sceneContent, scene);
  const takeaways = (bullets.length ? bullets : subtitle ? [subtitle] : []).slice(0, 3);
  if (!title || !takeaways.length) return null;

  return (
    <AbsoluteFill style={{background: '#101820', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #101820 0%, #172033 62%, #0b1120 100%)'}} />
      <EditableTransform id="runtime-closing-takeaways-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 78, fontSize: 54, fontWeight: 890, letterSpacing: '-0.045em', whiteSpace: 'nowrap', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 48)}
        </div>
      </EditableTransform>
      <div style={{position: 'absolute', left: 138, right: 138, top: 190, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22}}>
        {takeaways.map((item, index) => {
          const p = ease(frame, [18 + index * 9, 48 + index * 9], [0, 1]);
          return (
            <div key={`${item}-${index}`} style={{height: 250, borderRadius: 24, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', padding: 28, boxSizing: 'border-box', opacity: p, transform: `translateY(${(1 - p) * 18}px)`}}>
              <div style={{fontSize: 42, fontWeight: 900, color: ['#38bdf8', '#34d399', '#fbbf24'][index % 3], marginBottom: 46}}>0{index + 1}</div>
              <div data-dm-text-editable style={{fontSize: 25, lineHeight: 1.16, fontWeight: 850}}>{truncate(item, 70)}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
