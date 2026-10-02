import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EditableTransform} from '../../scenes/EditableTransform';
import {truncate, uiLabel, type RuntimeStyleTemplateProps} from '../runtimeSlots';
import {ease, cleanText, contentFields, animationFrame} from './textTemplateShared';

export const RuntimeNarrativeMiniTimeline: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = animationFrame(sceneContent, scene);
  const {title, kicker, payload, content, bullets} = contentFields(sceneContent, scene);
  const ACCENT = '#38bdf8';

  const rawEvents: any[] = Array.isArray(payload.events)
    ? payload.events
    : Array.isArray(content.events)
      ? content.events
      : [];

  const events = rawEvents.slice(0, 4).map((ev: any) => ({
    year: cleanText(ev?.year, ev?.date, ev?.label),
    title: cleanText(ev?.title, ev?.name, ev?.event),
    desc: cleanText(ev?.desc, ev?.description, ev?.subtitle),
  })).filter((ev) => ev.title);

  // fallback: use bullets as event titles without year labels
  if (!events.length && bullets.length >= 2) {
    bullets.forEach((b) => events.push({year: '', title: b, desc: ''}));
  }

  if (!title || events.length < 2) return null;

  const N = events.length;
  const lineLeft = 130;
  const lineRight = 1150;
  const lineWidth = lineRight - lineLeft;
  const lineY = 340;

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'Inter, Helvetica, Arial, sans-serif', color: '#ffffff'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #0f172a 0%, #0c1224 100%)'}} />
      <EditableTransform id="runtime-mt-kicker" role="kicker" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 0, right: 0, top: 80, textAlign: 'center', fontSize: 13, fontWeight: 800, letterSpacing: '0.24em', color: ACCENT, textTransform: 'uppercase', opacity: ease(frame, [0, 18], [0, 1])}}>
          {truncate(kicker || uiLabel(sceneContent, 'timeline', 'TIMELINE'), 24)}
        </div>
      </EditableTransform>
      <EditableTransform id="runtime-mt-title" role="title" style={{display: 'block'}}>
        <div data-dm-text-editable style={{position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center', fontSize: 44, fontWeight: 880, letterSpacing: '-0.02em', color: '#f1f5f9', opacity: ease(frame, [8, 32], [0, 1])}}>
          {truncate(title, 60)}
        </div>
      </EditableTransform>
      <div style={{position: 'absolute', left: lineLeft, top: lineY, width: lineWidth * ease(frame, [20, 52], [0, 1]), height: 2, background: `linear-gradient(90deg, ${ACCENT}, rgba(56,189,248,0.3))`, borderRadius: 1}} />
      {events.map((ev, i) => {
        const x = lineLeft + (N > 1 ? (i / (N - 1)) * lineWidth : lineWidth / 2);
        const delay = 24 + i * 10;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: x - 6, top: lineY - 6, width: 12, height: 12, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 8px ${ACCENT}`, opacity: ease(frame, [delay, delay + 14], [0, 1])}} />
            {ev.year ? (
              <div style={{position: 'absolute', left: x - 24, top: lineY - 38, width: 48, textAlign: 'center', fontSize: 13, fontWeight: 800, color: ACCENT, letterSpacing: '0.04em', opacity: ease(frame, [delay, delay + 14], [0, 1])}}>
                {ev.year}
              </div>
            ) : null}
            <div style={{position: 'absolute', left: x - 70, top: lineY + 22, width: 140, textAlign: 'center', fontSize: 16, fontWeight: 700, color: '#f1f5f9', opacity: ease(frame, [delay + 4, delay + 18], [0, 1])}}>
              {ev.title}
            </div>
            {ev.desc ? (
              <div style={{position: 'absolute', left: x - 70, top: lineY + 50, width: 140, textAlign: 'center', fontSize: 13, lineHeight: 1.5, fontWeight: 400, color: '#64748b', opacity: ease(frame, [delay + 8, delay + 22], [0, 1])}}>
                {ev.desc}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
