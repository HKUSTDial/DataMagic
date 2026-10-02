import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeNarrativeChapterTitleIllustrated: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, subtitle, kicker} = contentFields(sceneContent, scene);
  const ACCENT = '#f59e0b';
  if (!title) return null;

  const illustrationPath = typeof (scene as any)?.illustration_image === 'string' ? (scene as any).illustration_image.trim() : '';
  const imgSrc = illustrationPath
    ? staticFile(illustrationPath)
    : staticFile('template-assets/illustrated-demos/narrative_chapter_title_illustrated.webp');

  const imgReveal = ease(frame, [0, 32], [0, 1]);

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0c1120 0%, #0f172a 50%, #020617 100%)'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 380, height: 720, overflow: 'hidden', opacity: imgReveal, userSelect: 'none'}}>
        <Img src={imgSrc} draggable={false} style={{width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none'}} />
        <div style={{position: 'absolute', top: 0, right: 0, width: 160, height: '100%', background: 'linear-gradient(to right, transparent, #0f172a)'}} />
      </div>
      <div style={{position: 'absolute', left: 380, top: 160, width: 3, height: 260 * ease(frame, [8, 40], [0, 1]), background: `linear-gradient(180deg, ${ACCENT}, transparent)`, borderRadius: 2}} />
      <EditableTransform id="runtime-chapter-ill-kicker" role="kicker" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 416, top: 180, fontSize: 16, fontWeight: 800, letterSpacing: '0.22em', color: ACCENT, textTransform: 'uppercase', opacity: ease(frame, [6, 24], [0, 1])}}>
          {truncate(kicker || uiLabel(sceneContent, 'section', 'SECTION'), 30)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-chapter-ill-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 416, top: 232, width: 780, fontSize: title.length > 20 ? 56 : 72, lineHeight: 1.06, fontWeight: 900, letterSpacing: '-0.035em', color: '#f1f5f9', opacity: ease(frame, [14, 44], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <div style={{position: 'absolute', left: 416, top: 400, width: 220 * ease(frame, [32, 56], [0, 1]), height: 2, background: ACCENT, opacity: 0.7}} />
      <EditableTransform id="runtime-chapter-ill-subtitle" role="subtitle" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 416, top: 424, width: 740, fontSize: 22, lineHeight: 1.5, fontWeight: 500, color: '#94a3b8', opacity: ease(frame, [42, 70], [0, 1])}}>
          {truncate(subtitle || '', 100)}
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
