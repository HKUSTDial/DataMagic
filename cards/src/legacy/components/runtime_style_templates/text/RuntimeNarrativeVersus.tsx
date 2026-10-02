import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeNarrativeVersus: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, bullets} = contentFields(sceneContent, scene);
  const left = bullets[0] || title;
  const right = bullets[1] || subtitle;
  if (!title || !left || !right) return null;

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f172a 0%, #0c1224 100%)'}} />
      <EditableTransform id="runtime-narrative-versus-kicker" role="kicker" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 0, right: 0, top: 80, textAlign: 'center', fontSize: 13, fontWeight: 800, letterSpacing: '0.2em', color: '#475569', textTransform: 'uppercase', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(title, 72)}
        </div>
      </EditableTransform>
      <div style={{position: 'absolute', left: 636, top: 140, width: 1, height: 340 * ease(frame, [8, 32], [0, 1]), background: 'linear-gradient(180deg, transparent, #334155, transparent)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 295, textAlign: 'center', fontSize: 13, fontWeight: 800, letterSpacing: '0.2em', color: '#334155', textTransform: 'uppercase', opacity: ease(frame, [14, 36], [0, 1])}}>VS</div>
      <EditableTransform id="runtime-narrative-versus-left-label" role="kicker" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 148, fontSize: 13, fontWeight: 800, letterSpacing: '0.16em', color: '#38bdf8', textTransform: 'uppercase', opacity: ease(frame, [12, 30], [0, 1])}}>
          {truncate('Left', 18)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-narrative-versus-left-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 190, width: 460, height: 116, fontSize: 40, fontWeight: 880, lineHeight: 1.12, letterSpacing: 0, color: '#f1f5f9', opacity: ease(frame, [18, 40], [0, 1]), overflow: 'hidden'}}>
          {truncate(left, 56)}
        </div>
      </EditableTransform>
      <div style={{position: 'absolute', left: 96, top: 326, width: 48 * ease(frame, [30, 48], [0, 1]), height: 3, background: '#38bdf8', borderRadius: 2, opacity: 0.85}} />
      {subtitle ? (
        <div data-dm-text-editable style={{position: 'absolute', left: 96, top: 350, width: 460, height: 78, fontSize: 17, lineHeight: 1.45, fontWeight: 400, color: '#94a3b8', opacity: ease(frame, [28, 52], [0, 1]), overflow: 'hidden'}}>
          {truncate(subtitle, 96)}
        </div>
      ) : null}
      <EditableTransform id="runtime-narrative-versus-right-label" role="kicker" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 692, top: 148, fontSize: 13, fontWeight: 800, letterSpacing: '0.16em', color: '#fb7185', textTransform: 'uppercase', opacity: ease(frame, [12, 30], [0, 1])}}>
          {truncate('Right', 18)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-narrative-versus-right-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 692, top: 190, width: 460, height: 116, fontSize: 40, fontWeight: 880, lineHeight: 1.12, letterSpacing: 0, color: '#f1f5f9', opacity: ease(frame, [18, 40], [0, 1]), overflow: 'hidden'}}>
          {truncate(right, 56)}
        </div>
      </EditableTransform>
      <div style={{position: 'absolute', left: 692, top: 326, width: 48 * ease(frame, [30, 48], [0, 1]), height: 3, background: '#fb7185', borderRadius: 2, opacity: 0.85}} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 468, height: 1, background: '#1e293b', opacity: ease(frame, [40, 58], [0, 1])}} />
    </AbsoluteFill>
  );
};
